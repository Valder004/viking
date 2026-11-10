// Rendu d'une scène : décor plein cadre, personnages, boîte de dialogue qui avance
// réplique par réplique, puis choix (et chrono, qui ne démarre qu'à l'apparition des choix).
import { DECORS } from './decors/index.js';
import { vikingContenu } from './sprites/viking.js';
import { pnjContenu } from './sprites/pnj.js';
import { PERSONNAGES } from '../data/personnages.js';
import { decouper } from './texte.js';

const echapper = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const VITESSE = 16; // ms par caractère

/** Compose le SVG du décor avec le joueur et les PNJ placés dessus. */
export function composerDecor(scene, etat) {
  const decor = DECORS[scene.decor] ?? DECORS.vide;
  const { svg, joueur, places } = decor(etat);

  const pnj = (typeof scene.personnages === 'function' ? scene.personnages(etat) : scene.personnages) ?? [];
  const presents = pnj.filter((id) => !etat.morts[id] && PERSONNAGES[id]);

  const groupe = (id, contenu, p) =>
    `<g transform="translate(${p.x} ${p.y}) scale(${p.scale})${p.miroir ? ' translate(200 0) scale(-1 1)' : ''}"><g class="perso" data-perso="${id}">${contenu}</g></g>`;

  const persos = presents
    .map((id, i) => (places[i] ? groupe(id, pnjContenu(id), places[i]) : ''))
    .join('');
  const moi = scene.sansJoueur ? '' : groupe('joueur', vikingContenu(etat.perso.apparence, etat), joueur);

  // Le joueur est dessiné après les PNJ : il est devant. Un décor peut placer le
  // repère <!--persos--> pour que des éléments (bastingage, brume) passent devant eux.
  const calque = `${persos}${moi}`;
  const complet = svg.includes('<!--persos-->')
    ? svg.replace('<!--persos-->', calque)
    : svg.replace('</svg>', `${calque}</svg>`);
  return complet.replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ');
}

export function monterScene(racine, moteur, { onMenu }) {
  racine.innerHTML = `
    <section class="jeu">
      <div class="jeu__scene" data-decor></div>
      <div class="boite" data-boite>
        <div class="boite__chrono" data-chrono hidden><div class="boite__chrono-barre" data-chrono-barre></div></div>
        <div class="boite__nom" data-nom hidden></div>
        <div class="boite__texte" data-texte></div>
        <div class="boite__choix" data-choix hidden></div>
        <div class="boite__pied">
          <button class="boite__btn" data-action="menu">Menu</button>
          <button class="boite__btn" data-action="relire" hidden>↺ Relire</button>
          <span class="boite__espace"></span>
          <span class="boite__compte" data-compte></span>
          <button class="boite__btn" data-action="passer">Passer ⏭</button>
          <span class="boite__suite" data-suite aria-hidden="true">▼</span>
        </div>
      </div>
    </section>`;

  const $ = (s) => racine.querySelector(s);
  const decorEl = $('[data-decor]');
  const boite = $('[data-boite]');
  const nomEl = $('[data-nom]');
  const texteEl = $('[data-texte]');
  const choixEl = $('[data-choix]');
  const chronoEl = $('[data-chrono]');
  const barreEl = $('[data-chrono-barre]');
  const compteEl = $('[data-compte]');
  const suiteEl = $('[data-suite]');
  const relireBtn = $('[data-action="relire"]');
  const passerBtn = $('[data-action="passer"]');

  const sansAnimation = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let sceneCourante = null;
  let choixCourants = [];
  let temps = []; // paragraphes de la scène
  let index = 0;
  let frappe = null; // { noeuds, textes, pos, total, timer }
  let auxChoix = false;

  // ---- Machine à écrire : on vide les nœuds texte puis on les remplit peu à peu.
  function finirFrappe() {
    if (!frappe) return;
    clearInterval(frappe.timer);
    frappe.noeuds.forEach((n, i) => (n.nodeValue = frappe.textes[i]));
    frappe = null;
    suiteEl.classList.add('est-visible');
  }

  function ecrire(html) {
    texteEl.innerHTML = html;
    suiteEl.classList.remove('est-visible');
    if (sansAnimation) {
      suiteEl.classList.add('est-visible');
      return;
    }
    const marcheur = document.createTreeWalker(texteEl, NodeFilter.SHOW_TEXT);
    const noeuds = [];
    while (marcheur.nextNode()) noeuds.push(marcheur.currentNode);
    const textes = noeuds.map((n) => n.nodeValue);
    const total = textes.reduce((s, t) => s + t.length, 0);
    noeuds.forEach((n) => (n.nodeValue = ''));
    frappe = { noeuds, textes, pos: 0, total, timer: null };
    frappe.timer = setInterval(() => {
      if (!frappe) return;
      frappe.pos += 2;
      let reste = frappe.pos;
      frappe.noeuds.forEach((n, i) => {
        const t = frappe.textes[i];
        n.nodeValue = t.slice(0, Math.max(0, Math.min(t.length, reste)));
        reste -= t.length;
      });
      if (frappe.pos >= frappe.total) finirFrappe();
    }, VITESSE);
  }

  function eclairer(id) {
    decorEl.classList.toggle('a-locuteur', Boolean(id));
    decorEl.querySelectorAll('.perso').forEach((g) => g.classList.toggle('parle', g.dataset.perso === id));
  }

  function afficherTemps() {
    const t = temps[index];
    auxChoix = false;
    choixEl.hidden = true;
    texteEl.hidden = false;
    relireBtn.hidden = true;
    passerBtn.hidden = false;
    nomEl.hidden = !t.nom;
    if (t.nom) {
      nomEl.textContent = t.nom;
      nomEl.style.setProperty('--couleur', t.couleur ?? 'var(--color-muted)');
    }
    boite.classList.toggle('est-replique', Boolean(t.nom));
    compteEl.textContent = `${index + 1} / ${temps.length}`;
    eclairer(t.id);
    ecrire(t.html);
  }

  function afficherChoix() {
    finirFrappe();
    auxChoix = true;
    eclairer(null);
    nomEl.hidden = true;
    texteEl.hidden = true;
    suiteEl.classList.remove('est-visible');
    passerBtn.hidden = true;
    compteEl.textContent = '';
    boite.classList.remove('est-replique');

    const scene = sceneCourante;
    const etat = moteur.etat;
    let html = choixCourants
      .map((c, i) => `<button class="choix" data-choix="${i}" style="--i:${i}"><span class="choix__num">${i + 1}</span>${echapper(typeof c.texte === 'function' ? c.texte(etat) : c.texte)}</button>`)
      .join('');
    if (scene.aSuivre) html += `<button class="choix" data-action="menu"><span class="choix__num">↩</span>Retour au menu</button>`;
    choixEl.innerHTML = html;
    choixEl.classList.toggle('est-seul', choixCourants.length + (scene.aSuivre ? 1 : 0) === 1);
    choixEl.hidden = false;

    const chrono = moteur.chronoPour(scene);
    chronoEl.hidden = !chrono;
    relireBtn.hidden = Boolean(chrono) || temps.length < 2;
    if (chrono) {
      barreEl.style.transform = 'scaleX(1)';
      boite.classList.add('est-chrono');
      moteur.lancerChrono(scene, (ratio) => {
        barreEl.style.transform = `scaleX(${ratio})`;
        chronoEl.classList.toggle('est-urgent', ratio < 0.35);
      });
    }
  }

  function avancer() {
    if (auxChoix) return;
    if (frappe) return finirFrappe();
    if (index < temps.length - 1) {
      index += 1;
      afficherTemps();
    } else {
      afficherChoix();
    }
  }

  function choisir(i) {
    const c = choixCourants[i];
    if (!c || !auxChoix) return;
    choixEl.querySelectorAll('.choix').forEach((x) => (x.disabled = true));
    moteur.choisir(c);
  }

  moteur.onScene = (scene, choix) => {
    sceneCourante = scene;
    choixCourants = choix;
    finirFrappe();
    chronoEl.hidden = true;
    chronoEl.classList.remove('est-urgent');
    boite.classList.remove('est-chrono');
    decorEl.innerHTML = composerDecor(scene, moteur.etat);
    decorEl.classList.remove('entre');
    void decorEl.offsetWidth;
    decorEl.classList.add('entre');
    temps = decouper(scene.texte, moteur.etat);
    index = 0;
    afficherTemps();
  };

  // ---- Entrées
  boite.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) return avancer();
    if (b.dataset.choix !== undefined) return choisir(Number(b.dataset.choix));
    switch (b.dataset.action) {
      case 'menu': return onMenu();
      case 'passer': return afficherChoix();
      case 'relire':
        index = 0;
        return afficherTemps();
      default:
    }
  });
  decorEl.addEventListener('click', avancer);

  const clavier = (ev) => {
    if (ev.target.closest?.('input, textarea')) return;
    if (ev.key === ' ' || ev.key === 'Enter' || ev.key === 'ArrowRight') {
      if (auxChoix) return;
      ev.preventDefault();
      avancer();
    } else if (auxChoix && /^[1-9]$/.test(ev.key)) {
      choisir(Number(ev.key) - 1);
    }
  };
  document.addEventListener('keydown', clavier);

  return {
    detruire() {
      finirFrappe();
      document.removeEventListener('keydown', clavier);
    },
  };
}
