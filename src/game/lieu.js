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
  const largeur = lieu.largeur ?? 800; // un lieu plus large que l ecran defile avec le joueur
  const camera = () => Math.max(0, Math.min(largeur - 800, px - 400));
  let sens = 1;
  let cible = null; // { x, element }
  let boucle = null;
  let dernier = 0;
  let detruit = false;

  racine.innerHTML = `
    <section class="jeu jeu--lieu">
      <div class="jeu__scene" data-decor></div>
      <div class="hud hud--haut">
        <div class="hud__lieu panneau">
          <h2>${echapper(lieu.titre ?? '')}</h2>
          <ul class="quetes" data-quetes></ul>
        </div>
        <div class="hud__boutons">
          <button class="btn-bois" data-action="carnet">Carnet</button>
          <button class="btn-bois" data-action="menu">Menu</button>
        </div>
      </div>
      <div class="hud hud--bas">
        <div class="inventaire panneau" data-inventaire></div>
        <p class="hud__aide" data-aide></p>
      </div>
      <div class="bulle panneau" data-bulle hidden></div>
      <div class="carnet" data-carnet hidden></div>
    </section>`;

  const $ = (s) => racine.querySelector(s);
  const decorEl = $('[data-decor]');
  const quetesEl = $('[data-quetes]');
  const invEl = $('[data-inventaire]');
  const aideEl = $('[data-aide]');
  const bulleEl = $('[data-bulle]');
  const carnetEl = $('[data-carnet]');
  const AIDE = 'Clique pour marcher. Approche-toi des gens et des choses.';

  const visibles = () => lieu.elements.filter((el) => !etat.flags[`pris_${el.id}`] && (!el.visible || el.visible(etat)));
  const actionDe = (el) => (typeof el.action === 'function' ? el.action(etat) : el.action) ?? {};
  const important = (el) => (el.important ? el.important(etat) : false);

  // ---- Dessin ---------------------------------------------------------------
  function svgElement(el) {
    // Marqueurs discrets : un petit losange ambré pour ce qui fait avancer l'histoire,
    // une étincelle pâle pour le reste. Le nom n'apparaît qu'au survol.
    const marque = (x, y) => `<g class="marqueur" transform="translate(${x} ${y})">
      <g class="marqueur__anim ${important(el) ? 'marqueur__anim--fort' : ''}">${important(el)
        ? '<circle r="8" fill="#e0a04f" opacity="0.16"/><path d="M0 -4.500 L3.600 0 L0 4.500 L-3.600 0 Z" fill="#e0a04f"/>'
        : '<path d="M0 -4 Q0.800 -0.800 4 0 Q0.800 0.800 0 4 Q-0.800 0.800 -4 0 Q-0.800 -0.800 0 -4 Z" fill="#fff"/>'}</g>
      <text class="etiquette" y="-11" text-anchor="middle">${echapper(el.nom)}</text></g>`;

    if (el.type === 'pnj') {
      const ech = el.echelle ?? ECHELLE;
      const haut = 285 * ech;
      const x0 = el.x - 100 * ech;
      const y0 = (el.solY ?? sol.y) - haut;
      const t = el.miroir
        ? `translate(${x0 + 200 * ech} ${y0}) scale(${-ech} ${ech})`
        : `translate(${x0} ${y0}) scale(${ech})`;
      return `<g class="lieu-el" data-el="${el.id}"><g transform="${t}"><g class="perso">${pnjContenu(el.perso)}</g></g>
        <rect x="${el.x - 56 * ech}" y="${y0}" width="${112 * ech}" height="${haut}" fill="transparent"/>${marque(el.x, y0 + 6 * ech)}</g>`;
    }
    if (el.type === 'objet') {
      return `<g class="lieu-el" data-el="${el.id}">
        <g transform="translate(${el.x - 17} ${el.y - 17}) scale(0.85)">${OBJETS[el.objet]?.icone ?? ''}</g>
        <rect x="${el.x - 26}" y="${el.y - 30}" width="52" height="56" fill="transparent"/>${marque(el.x, el.y - 30)}</g>`;
    }
    if (el.type === 'sortie') {
      return `<g class="lieu-el" data-el="${el.id}">
        <rect x="${el.x - 34}" y="${sol.y - HAUT}" width="68" height="${HAUT}" fill="transparent"/>
        <g class="marqueur marqueur--sortie" transform="translate(${el.x} ${sol.y - 78})">
          <circle r="13" fill="#1a120b" stroke="#6b5a3a" stroke-width="1.200" opacity="0.9"/>
          <path d="${el.x < largeur / 2 ? 'M4 -6 L-4 0 L4 6' : 'M-4 -6 L4 0 L-4 6'}" fill="none" stroke="#e0a04f" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/>
          <text class="etiquette" y="-20" text-anchor="${el.x < largeur / 2 ? 'start' : 'end'}" x="${el.x < largeur / 2 ? -12 : 12}">${echapper(el.nom)}</text></g></g>`;
    }
    // zone : quelque chose du décor
    const l = el.l ?? 60;
    const h = el.h ?? 60;
    return `<g class="lieu-el" data-el="${el.id}">${el.dessin ? el.dessin(etat) : ''}
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
    // Ancré en bas : sur un écran très large, c'est le ciel qui est rogné, jamais le sol.
    decorEl.innerHTML = complet.replace('<svg ', '<svg preserveAspectRatio="xMidYMax slice" ');
    cadrer();
  }

  function cadrer() {
    decorEl.querySelector('svg')?.setAttribute('viewBox', camera().toFixed(1) + ' 0 800 450');
  }

  function majHud() {
    quetesEl.innerHTML = (lieu.quetes ?? [])
      .filter((q) => !q.visible || q.visible(etat))
      .map((q) => {
        const ok = q.fait(etat);
        return `<li class="${ok ? 'est-faite' : ''}"><span class="quetes__case">${ok ? '✓' : ''}</span><span>${echapper(q.texte)}${q.facultatif ? ' <em>(facultatif)</em>' : ''}</span></li>`;
      })
      .join('');
    const cases = Math.max(5, etat.inventaire.length);
    invEl.innerHTML = `<span class="inventaire__titre">Besace</span>` + Array.from({ length: cases }, (_, i) => {
      const id = etat.inventaire[i];
      return id
        ? `<button class="inventaire__case est-pleine" data-objet="${id}" title="${echapper(OBJETS[id]?.nom ?? id)}">${iconeObjet(id, 34)}</button>`
        : `<span class="inventaire__case"></span>`;
    }).join('');
    const conseil = lieu.conseil ? lieu.conseil(etat) : null;
    aideEl.textContent = conseil ?? AIDE;
    aideEl.classList.toggle('est-conseil', Boolean(conseil));
    aideEl.classList.toggle('panneau', Boolean(conseil));
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
      <div class="carnet__page panneau">
        <button class="btn-bois carnet__fermer" data-action="fermer-carnet">Fermer</button>
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
      if (a.condition && !a.condition(etat)) return dire(el.nom, (typeof a.refus === 'function' ? a.refus(etat) : a.refus) ?? 'Pas encore.');
      const vers = moteur.resoudre(a.suivant);
      if (a.position !== undefined) etat.lieux[vers] = a.position;
      return moteur.aller(vers);
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
    if (!aideEl.classList.contains('est-conseil')) aideEl.classList.add('est-lue'); // l'aide s'efface dès le premier pas
    const borne = Math.max(sol.xmin, Math.min(sol.xmax, x));
    cible = { x: borne, element };
    if (!boucle) {
      dernier = performance.now();
      // Minuterie plutot que requestAnimationFrame : la marche continue meme si l affichage est suspendu.
      boucle = setInterval(() => pas(performance.now()), 16);
    }
  }

  function arreter() {
    if (boucle) clearInterval(boucle);
    boucle = null;
  }

  function pas(t) {
    if (detruit) return;
    const dt = Math.min(0.05, (t - dernier) / 1000);
    dernier = t;
    const joueur = decorEl.querySelector('[data-joueur]');
    const marcheur = decorEl.querySelector('[data-marcheur]');
    if (!cible || !joueur) {
      arreter();
      return;
    }
    const d = cible.x - px;
    if (Math.abs(d) <= VITESSE * dt) {
      px = cible.x;
      const el = cible.element;
      cible = null;
      arreter();
      marcheur?.classList.remove('marche');
      joueur.setAttribute('transform', transformJoueur());
      cadrer();
      etat.lieux[lieu.id] = px;
      if (el) interagir(el);
      return;
    }
    sens = Math.sign(d);
    px += sens * VITESSE * dt;
    marcheur?.classList.add('marche');
    joueur.setAttribute('transform', transformJoueur());
    cadrer();
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
  if (lieu.arrivee && !etat.flags[`vu_${lieu.id}`]) {
    etat.flags[`vu_${lieu.id}`] = true;
    dire(lieu.titre, typeof lieu.arrivee === 'function' ? lieu.arrivee(etat) : lieu.arrivee);
  }

  return {
    detruire() {
      detruit = true;
      arreter();
      document.removeEventListener('keydown', clavier);
      etat.lieux[lieu.id] = px;
    },
  };
}
