// Vue d'exploration : le joueur se déplace au clic dans un lieu, parle aux personnages,
// ramasse des objets et suit ses quêtes. Les dialogues eux-mêmes restent des scènes classiques.
import { DECORS } from './decors/index.js';
import { vikingContenu } from './sprites/viking.js';
import { pnjContenu } from './sprites/pnj.js';
import { PERSONNAGES } from '../data/personnages.js';
import { OBJETS, iconeObjet } from '../data/objets.js';

const ECHELLE = 0.6; // taille des personnages en exploration
const VITESSE = 300; // unités du décor par seconde
const HAUT = 285 * ECHELLE;

const echapper = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const HUMEURS = [
  [-2, 'te tourne le dos'],
  [-1, 'reste sur ses gardes'],
  [0, 'ne sait pas encore quoi penser de toi'],
  [1, 't’écoute'],
  [2, 'compte sur toi'],
  [3, 'te suivrait n’importe où'],
];
const humeur = (v) => HUMEURS.reduce((a, [seuil, mot]) => (v >= seuil ? mot : a), HUMEURS[0][1]);

export function monterLieu(racine, moteur, lieu, { onMenu }) {
  const etat = moteur.etat;
  const sol = lieu.sol;
  let px = Math.max(sol.xmin, Math.min(sol.xmax, etat.lieux[lieu.id] ?? lieu.depart ?? 400));
  let sens = 1;
  let cible = null; // { x, element }
  let boucle = null;
  let dernier = 0;
  let detruit = false;

  racine.innerHTML = `
    <section class="jeu jeu--lieu">
      <div class="jeu__scene" data-decor></div>
      <div class="hud hud--haut">
        <div class="hud__lieu">
          <h2>${echapper(lieu.titre ?? '')}</h2>
          <ul class="quetes" data-quetes></ul>
        </div>
        <div class="hud__boutons">
          <button class="hud__btn" data-action="carnet">Carnet</button>
          <button class="hud__btn" data-action="menu">Menu</button>
        </div>
      </div>
      <div class="hud hud--bas">
        <div class="inventaire" data-inventaire></div>
        <p class="hud__aide" data-aide></p>
      </div>
      <div class="bulle" data-bulle hidden></div>
      <div class="carnet" data-carnet hidden></div>
    </section>`;

  const $ = (s) => racine.querySelector(s);
  const decorEl = $('[data-decor]');
  const quetesEl = $('[data-quetes]');
  const invEl = $('[data-inventaire]');
  const aideEl = $('[data-aide]');
  const bulleEl = $('[data-bulle]');
  const carnetEl = $('[data-carnet]');
  const AIDE = 'Clique sur le sol pour marcher, sur quelqu’un ou quelque chose pour t’en approcher.';

  const visibles = () => lieu.elements.filter((el) => !etat.flags[`pris_${el.id}`] && (!el.visible || el.visible(etat)));
  const actionDe = (el) => (typeof el.action === 'function' ? el.action(etat) : el.action) ?? {};
  const important = (el) => (el.important ? el.important(etat) : false);

  // ---- Dessin ---------------------------------------------------------------
  function svgElement(el) {
    const marque = (x, y) => `<g class="marqueur ${important(el) ? 'marqueur--fort' : ''}" transform="translate(${x} ${y})">
      <g class="marqueur__anim">${important(el)
        ? '<circle r="11" fill="#e07a4f"/><path d="M0 -6 L0 2 M0 5.500 L0 6" stroke="#15130f" stroke-width="3" stroke-linecap="round"/>'
        : '<circle r="5" fill="#fff" opacity="0.85"/><circle r="9" fill="none" stroke="#fff" stroke-width="1.500" opacity="0.5"/>'}</g></g>`;

    if (el.type === 'pnj') {
      const x0 = el.x - 100 * ECHELLE;
      const y0 = sol.y - HAUT;
      const t = el.miroir
        ? `translate(${x0 + 200 * ECHELLE} ${y0}) scale(${-ECHELLE} ${ECHELLE})`
        : `translate(${x0} ${y0}) scale(${ECHELLE})`;
      return `<g class="lieu-el" data-el="${el.id}"><g transform="${t}"><g class="perso">${pnjContenu(el.perso)}</g></g>
        <rect x="${el.x - 34}" y="${y0}" width="68" height="${HAUT}" fill="transparent"/>${marque(el.x, y0 - 4)}</g>`;
    }
    if (el.type === 'objet') {
      return `<g class="lieu-el" data-el="${el.id}">
        <g transform="translate(${el.x - 17} ${el.y - 17}) scale(0.85)">${OBJETS[el.objet]?.icone ?? ''}</g>
        <rect x="${el.x - 26}" y="${el.y - 30}" width="52" height="56" fill="transparent"/>${marque(el.x, el.y - 30)}</g>`;
    }
    if (el.type === 'sortie') {
      return `<g class="lieu-el" data-el="${el.id}">
        <rect x="${el.x - 34}" y="${sol.y - HAUT}" width="68" height="${HAUT}" fill="transparent"/>
        <g class="marqueur marqueur--sortie" transform="translate(${el.x} ${sol.y - 70})"><g class="marqueur__anim">
          <circle r="17" fill="#15130f" opacity="0.75"/><path d="${el.x < 400 ? 'M5 -8 L-5 0 L5 8' : 'M-5 -8 L5 0 L-5 8'}" fill="none" stroke="#e07a4f" stroke-width="3.500" stroke-linecap="round" stroke-linejoin="round"/></g></g></g>`;
    }
    // zone : quelque chose du décor
    const l = el.l ?? 60;
    const h = el.h ?? 60;
    return `<g class="lieu-el" data-el="${el.id}">
      <rect x="${el.x - l / 2}" y="${el.y - h / 2}" width="${l}" height="${h}" fill="transparent"/>${marque(el.x, el.y - h / 2 - 2)}</g>`;
  }

  function transformJoueur() {
    const y0 = sol.y - HAUT;
    return sens >= 0
      ? `translate(${px - 100 * ECHELLE} ${y0}) scale(${ECHELLE})`
      : `translate(${px + 100 * ECHELLE} ${y0}) scale(${-ECHELLE} ${ECHELLE})`;
  }

  function dessiner() {
    const { svg } = (DECORS[lieu.decor] ?? DECORS.vide)(etat, 0);
    const calque = `${visibles().map(svgElement).join('')}
      <g data-joueur transform="${transformJoueur()}"><g class="perso marcheur" data-marcheur>${vikingContenu(etat.perso.apparence, etat)}</g></g>`;
    const complet = svg.includes('<!--persos-->') ? svg.replace('<!--persos-->', calque) : svg.replace('</svg>', `${calque}</svg>`);
    decorEl.innerHTML = complet.replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ');
  }

  function majHud() {
    quetesEl.innerHTML = (lieu.quetes ?? [])
      .filter((q) => !q.visible || q.visible(etat))
      .map((q) => {
        const ok = q.fait(etat);
        return `<li class="${ok ? 'est-faite' : ''}"><span class="quetes__case">${ok ? '✓' : ''}</span><span>${echapper(q.texte)}${q.facultatif ? ' <em>(facultatif)</em>' : ''}</span></li>`;
      })
      .join('');
    invEl.innerHTML = etat.inventaire.length
      ? etat.inventaire.map((id) => `<button class="inventaire__case" data-objet="${id}" title="${echapper(OBJETS[id]?.nom ?? id)}">${iconeObjet(id, 36)}</button>`).join('')
      : '<span class="inventaire__vide">Tes mains sont vides.</span>';
  }

  // ---- Bulle et carnet --------------------------------------------------------
  function dire(titre, texte) {
    bulleEl.innerHTML = `${titre ? `<strong>${echapper(titre)}</strong>` : ''}<p>${echapper(texte)}</p><span class="bulle__suite">▼</span>`;
    bulleEl.hidden = false;
  }
  const fermerBulle = () => { bulleEl.hidden = true; };

  function ouvrirCarnet() {
    const compagnons = ['sigrid', 'ulf', 'eirik', 'aude'].filter((id) => id !== 'aude' || etat.flags.aude_rencontree);
    carnetEl.innerHTML = `
      <div class="carnet__page">
        <button class="hud__btn carnet__fermer" data-action="fermer-carnet">Fermer</button>
        <h2>Carnet</h2>
        <h3>Ceux qui t’entourent</h3>
        <ul class="carnet__liste">
          ${compagnons.map((id) => {
            const p = PERSONNAGES[id];
            return etat.morts[id]
              ? `<li class="est-mort"><strong style="color:${p.couleur}">${p.nom}</strong> — n’est plus.</li>`
              : `<li><strong style="color:${p.couleur}">${p.nom}</strong>, ${p.titre} — ${humeur(etat.confiance[id])}.</li>`;
          }).join('')}
          <li><strong style="color:${PERSONNAGES.hakon.couleur}">Hakon</strong>, le jarl — ${etat.reputation >= 2 ? 'te tient pour utile' : etat.reputation <= -2 ? 'te tient pour un poids' : 'ne te regarde pas encore'}.</li>
        </ul>
        <h3>Ce que tu portes</h3>
        ${etat.inventaire.length
          ? `<ul class="carnet__liste carnet__objets">${etat.inventaire.map((id) => `<li>${iconeObjet(id, 34)}<span><strong>${echapper(OBJETS[id].nom)}</strong><br>${echapper(OBJETS[id].description)}</span></li>`).join('')}</ul>`
          : '<p class="carnet__vide">Rien. Un rameur voyage léger.</p>'}
        ${etat.blessures.length ? `<h3>Tes blessures</h3><p class="carnet__vide">${etat.blessures.map((b) => ({ bras: 'bras', jambe: 'jambe', oeil: 'œil', cotes: 'côtes' })[b]).join(', ')} — elles ne guériront pas avant la fin.</p>` : ''}
      </div>`;
    carnetEl.hidden = false;
  }

  // ---- Interaction ------------------------------------------------------------
  function interagir(el) {
    const a = actionDe(el);
    etat.lieux[lieu.id] = px;
    if (a.scene) return moteur.aller(a.scene);
    if (a.suivant) {
      if (a.condition && !a.condition(etat)) return dire(el.nom, a.refus ?? 'Pas encore.');
      return moteur.aller(moteur.resoudre(a.suivant));
    }
    if (a.prendre) {
      moteur.avecNotifs(() => {
        if (!etat.inventaire.includes(a.prendre)) etat.inventaire.push(a.prendre);
        etat.flags[`pris_${el.id}`] = true;
        if (a.effets) a.effets(etat);
      });
      moteur.sauver();
      dessiner();
      majHud();
      return dire(OBJETS[a.prendre]?.nom ?? el.nom, a.texte ?? OBJETS[a.prendre]?.description ?? '');
    }
    if (a.examiner) {
      if (a.effets) {
        moteur.avecNotifs(() => a.effets(etat));
        moteur.sauver();
        dessiner();
        majHud();
      }
      return dire(el.nom, typeof a.examiner === 'function' ? a.examiner(etat) : a.examiner);
    }
  }

  // ---- Déplacement ------------------------------------------------------------
  function allerVers(x, element = null) {
    const borne = Math.max(sol.xmin, Math.min(sol.xmax, x));
    cible = { x: borne, element };
    if (!boucle) {
      dernier = performance.now();
      boucle = requestAnimationFrame(pas);
    }
  }

  function pas(t) {
    if (detruit) return;
    const dt = Math.min(0.05, (t - dernier) / 1000);
    dernier = t;
    const joueur = decorEl.querySelector('[data-joueur]');
    const marcheur = decorEl.querySelector('[data-marcheur]');
    if (!cible || !joueur) {
      boucle = null;
      return;
    }
    const d = cible.x - px;
    if (Math.abs(d) <= VITESSE * dt) {
      px = cible.x;
      const el = cible.element;
      cible = null;
      boucle = null;
      marcheur?.classList.remove('marche');
      joueur.setAttribute('transform', transformJoueur());
      etat.lieux[lieu.id] = px;
      if (el) interagir(el);
      return;
    }
    sens = Math.sign(d);
    px += sens * VITESSE * dt;
    marcheur?.classList.add('marche');
    joueur.setAttribute('transform', transformJoueur());
    boucle = requestAnimationFrame(pas);
  }

  function pointDecor(ev) {
    const svg = decorEl.querySelector('svg');
    const m = svg.getScreenCTM();
    if (!m) return { x: 400, y: 0 };
    const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  // ---- Entrées ----------------------------------------------------------------
  decorEl.addEventListener('click', (ev) => {
    if (!bulleEl.hidden) return fermerBulle();
    const cibleEl = ev.target.closest('[data-el]');
    if (cibleEl) {
      const el = lieu.elements.find((x) => x.id === cibleEl.dataset.el);
      if (!el) return;
      // On s'arrête à côté des personnages, pas dessus.
      const ecart = el.type === 'pnj' ? 62 : el.type === 'sortie' ? 0 : 30;
      const cote = px <= el.x ? -1 : 1;
      return allerVers(el.x + cote * ecart, el);
    }
    allerVers(pointDecor(ev).x);
  });

  decorEl.addEventListener('mousemove', (ev) => {
    const cibleEl = ev.target.closest('[data-el]');
    const el = cibleEl && lieu.elements.find((x) => x.id === cibleEl.dataset.el);
    aideEl.textContent = el ? el.nom : AIDE;
    aideEl.classList.toggle('est-cible', Boolean(el));
  });

  racine.querySelector('.jeu--lieu').addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) {
      if (ev.target.closest('[data-bulle]')) fermerBulle();
      return;
    }
    if (b.dataset.action === 'menu') return onMenu();
    if (b.dataset.action === 'carnet') return ouvrirCarnet();
    if (b.dataset.action === 'fermer-carnet') { carnetEl.hidden = true; return; }
    if (b.dataset.objet) return dire(OBJETS[b.dataset.objet].nom, OBJETS[b.dataset.objet].description);
  });

  const clavier = (ev) => {
    if (ev.key === 'Escape') { carnetEl.hidden = true; fermerBulle(); }
    else if ((ev.key === ' ' || ev.key === 'Enter') && !bulleEl.hidden) { ev.preventDefault(); fermerBulle(); }
    else if (ev.key === 'ArrowLeft') allerVers(px - 120);
    else if (ev.key === 'ArrowRight') allerVers(px + 120);
  };
  document.addEventListener('keydown', clavier);

  dessiner();
  majHud();
  aideEl.textContent = AIDE;
  if (lieu.arrivee && !etat.flags[`vu_${lieu.id}`]) {
    etat.flags[`vu_${lieu.id}`] = true;
    dire(lieu.titre, typeof lieu.arrivee === 'function' ? lieu.arrivee(etat) : lieu.arrivee);
  }

  return {
    detruire() {
      detruit = true;
      if (boucle) cancelAnimationFrame(boucle);
      document.removeEventListener('keydown', clavier);
      etat.lieux[lieu.id] = px;
    },
  };
}
