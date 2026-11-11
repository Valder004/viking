// Briques de décor partagées. Cadre : viewBox 0 0 800 450.
// La boîte de dialogue recouvre le bas de l'image : tout ce qui compte se dessine au-dessus de y≈300.

export const SVG = (contenu) => `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">${contenu}</svg>`;

export const degrade = (id, stops, horizontal = false) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${horizontal ? 1 : 0}" y2="${horizontal ? 0 : 1}">${stops
    .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`)
    .join('')}</linearGradient>`;

export const halo = (id, couleur, force = 0.6, cx = 0.5, cy = 0.5, r = 0.5) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${couleur}" stop-opacity="${force}"/><stop offset="1" stop-color="${couleur}" stop-opacity="0"/></radialGradient>`;

/** Assombrit les bords : à poser en dernier. */
export const vignette = (id, force = 0.55) =>
  `<defs><radialGradient id="${id}" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${force}"/></radialGradient></defs>
   <rect x="-50" y="-50" width="900" height="550" fill="url(#${id})" pointer-events="none"/>`;

/** Bande de vagues qui défile. */
export function vagues(y, cls, couleur = '#ffffff', opacite = 0.08, amp = 6, bas = 460) {
  let d = `M-80 ${y}`;
  for (let x = -60; x <= 900; x += 40) d += ` Q${x} ${y - amp} ${x + 20} ${y}`;
  return `<path class="${cls}" d="${d} L900 ${bas} L-80 ${bas} Z" fill="${couleur}" opacity="${opacite}"/>`;
}

/** Liseré d'écume sur une crête. */
export function ecume(y, cls, opacite = 0.5, amp = 6) {
  let d = `M-80 ${y}`;
  for (let x = -60; x <= 900; x += 40) d += ` Q${x} ${y - amp} ${x + 20} ${y}`;
  return `<path class="${cls}" d="${d}" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="14 22 5 30" stroke-linecap="round" opacity="${opacite}"/>`;
}

export function nuage(x, y, s = 1, fill = '#fff', op = 0.6) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}" opacity="${op}">
    <ellipse cx="0" cy="0" rx="70" ry="16"/><ellipse cx="-30" cy="-10" rx="34" ry="16"/><ellipse cx="14" cy="-16" rx="40" ry="20"/><ellipse cx="50" cy="-6" rx="30" ry="13"/></g>`;
}

export function mouette(x, y, s = 1, cls = 'anim-oiseau') {
  // La position est sur le groupe, l'animation sur l'enfant : une animation CSS de
  // transform écraserait sinon l'attribut transform du SVG.
  return `<g transform="translate(${x} ${y}) scale(${s})"><path class="${cls}" d="M-12 0 Q-6 -8 0 0 Q6 -8 12 0" fill="none" stroke="#f4efe6" stroke-width="2" stroke-linecap="round"/></g>`;
}

export function corbeau(x, y, s = 1, cls = 'anim-oiseau') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}" fill="#0b0907">
    <path d="M-9 0 Q-10 -9 -2 -11 Q4 -12 6 -7 L12 -6 L6 -4 Q8 4 0 6 L-12 8 Z" stroke="#7d8cb0" stroke-width="1" stroke-opacity="0.7"/>
    <path d="M-4 6 L-4 11 M1 6 L1 11" stroke="#0b0907" stroke-width="1.2"/>
    <circle cx="3" cy="-8" r="0.9" fill="#d8d2c6"/></g></g>`;
}

export function sapin(x, y, h, fill) {
  const w = h * 0.42;
  return `<path d="M${x} ${y - h} L${x + w * 0.5} ${y - h * 0.62} L${x + w * 0.28} ${y - h * 0.62} L${x + w * 0.75} ${y - h * 0.3} L${x + w * 0.4} ${y - h * 0.3} L${x + w} ${y} L${x - w} ${y} L${x - w * 0.4} ${y - h * 0.3} L${x - w * 0.75} ${y - h * 0.3} L${x - w * 0.28} ${y - h * 0.62} L${x - w * 0.5} ${y - h * 0.62} Z" fill="${fill}"/>`;
}

export function sapins(x1, x2, y, h, fill, n) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    s += sapin(x1 + (x2 - x1) * t, y + ((i * 7) % 5) - 2, h * (0.75 + ((i * 37) % 50) / 100), fill);
  }
  return s;
}

/** Étoiles réparties de façon déterministe. */
export function etoiles(n, hauteur = 200) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = (i * 197 + 31) % 800;
    const y = (i * 89 + 13) % hauteur;
    const r = 0.6 + ((i * 7) % 4) * 0.35;
    s += `<circle class="${i % 3 === 0 ? 'anim-etoile' : i % 3 === 1 ? 'anim-etoile anim-etoile--2' : ''}" cx="${x}" cy="${y}" r="${r}" fill="#f4efe6" opacity="${0.5 + (i % 5) * 0.1}"/>`;
  }
  return s;
}

/** Maison longue au toit de tourbe, vue de face. */
export function maison(x, y, w, { nuit = false, fumee = true } = {}) {
  const h = w * 0.34;
  const toit = w * 0.5;
  return `<g transform="translate(${x} ${y})">
    <path d="M0 0 L${w} 0 L${w} ${-h} L0 ${-h} Z" fill="${nuit ? '#1b1410' : '#4a3626'}"/>
    ${Array.from({ length: 4 }, (_, i) => `<path d="M0 ${-h + (i + 1) * (h / 5)} L${w} ${-h + (i + 1) * (h / 5)}" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>`).join('')}
    <path d="M${-w * 0.08} ${-h} L${w / 2} ${-h - toit} L${w * 1.08} ${-h} Z" fill="${nuit ? '#141a14' : '#5d6b46'}"/>
    <path d="M${w / 2} ${-h - toit} L${w * 1.08} ${-h} L${w / 2} ${-h} Z" fill="rgba(0,0,0,0.25)"/>
    <path d="M${w * 0.1} ${-h - toit * 0.12} L${w / 2} ${-h - toit} L${w * 0.9} ${-h - toit * 0.12}" stroke="${nuit ? '#0d0906' : '#2a1d12'}" stroke-width="${Math.max(1.5, w * 0.03)}" fill="none"/>
    <path d="M${w / 2 - w * 0.06} ${-h - toit - w * 0.07} L${w / 2} ${-h - toit} L${w / 2 + w * 0.06} ${-h - toit - w * 0.07}" stroke="${nuit ? '#0d0906' : '#2a1d12'}" stroke-width="${Math.max(1.5, w * 0.025)}" fill="none"/>
    <rect x="${w * 0.42}" y="${-h * 0.72}" width="${w * 0.16}" height="${h * 0.72}" fill="${nuit ? '#f0a23c' : '#1a110a'}"/>
    ${nuit ? `<rect x="${w * 0.42}" y="${-h * 0.72}" width="${w * 0.16}" height="${h * 0.72}" fill="#ffd27a" opacity="0.5" class="anim-lueur"/>` : ''}
    ${fumee ? `<g fill="${nuit ? '#3a4458' : '#e9e2d2'}" opacity="0.45">
      <circle class="anim-fumee" cx="${w / 2}" cy="${-h - toit}" r="${w * 0.06}"/>
      <circle class="anim-fumee anim-fumee--2" cx="${w / 2 + 3}" cy="${-h - toit}" r="${w * 0.05}"/>
      <circle class="anim-fumee anim-fumee--3" cx="${w / 2 - 2}" cy="${-h - toit}" r="${w * 0.055}"/></g>` : ''}
  </g>`;
}

/** Feu : trois langues de flamme animées. Origine en bas au centre. */
export function feu(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path class="anim-flamme" d="M-30 0 Q-38 -44 -8 -64 Q-12 -32 4 -28 Q14 -50 6 -70 Q40 -40 30 0 Z" fill="#e2601f"/>
    <path class="anim-flamme anim-flamme--2" d="M-18 0 Q-22 -30 -2 -46 Q-2 -26 8 -24 Q14 -34 10 -44 Q28 -24 20 0 Z" fill="#f79a2e"/>
    <path class="anim-flamme anim-flamme--3" d="M-8 0 Q-8 -18 2 -28 Q6 -16 12 -14 Q16 -4 10 0 Z" fill="#ffe9a8"/>
  </g>`;
}

export function braises(x, y, n = 6, largeur = 60) {
  let s = '';
  for (let i = 0; i < n; i++) {
    s += `<circle class="anim-braise ${['', 'anim-braise--2', 'anim-braise--3'][i % 3]}" cx="${x - largeur / 2 + ((i * 53) % largeur)}" cy="${y - (i % 3) * 8}" r="${1.2 + (i % 2) * 0.6}" fill="#ffc46b"/>`;
  }
  return s;
}

/** Tête de dragon de proue, tournée vers la gauche. Origine : base du col. */
export function proue(x, y, s = 1, couleur = '#3a2718', miroir = false) {
  return `<g transform="translate(${x} ${y}) scale(${miroir ? -s : s} ${s})">
    <path d="M10 0 C6 -60 -22 -112 -4 -154 C2 -170 -14 -186 -36 -178 L-66 -166 L-46 -158 L-64 -142 L-36 -146 C-34 -112 -18 -62 -16 0 Z" fill="${couleur}"/>
    <path d="M10 0 C6 -60 -22 -112 -4 -154 C0 -164 -4 -174 -14 -180 C-2 -150 -8 -110 0 -60 L2 0 Z" fill="rgba(0,0,0,0.3)"/>
    <path d="M-6 -150 l12 -8 l-4 12 l12 -2 l-8 10 l10 4 l-12 6 M-10 -110 l12 -4 l-6 10 l10 2 l-10 8" stroke="${couleur}" stroke-width="5" fill="none" stroke-linejoin="round"/>
    <circle cx="-30" cy="-168" r="3.2" fill="#e9c35c"/><circle cx="-30.6" cy="-168" r="1.3" fill="#1a110a"/>
    <path d="M-62 -164 l6 5 l5 -6 l5 6" stroke="#e9dfc8" stroke-width="1.6" fill="none"/>
    <path d="M-22 -120 q8 20 12 44 M-16 -76 q6 20 6 50" stroke="rgba(255,255,255,0.14)" stroke-width="2.5" fill="none"/>
  </g>`;
}

export function tonneau(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-16 0 Q-22 -22 -16 -44 L16 -44 Q22 -22 16 0 Z" fill="#6b4a2e"/>
    <path d="M0 -44 L16 -44 Q22 -22 16 0 L0 0 Z" fill="rgba(0,0,0,0.25)"/>
    <path d="M-18 -10 L18 -10 M-18 -34 L18 -34" stroke="#2a1d12" stroke-width="3.5"/>
    <path d="M-8 -44 L-9 0 M4 -44 L5 0" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
    <ellipse cx="0" cy="-44" rx="16" ry="4" fill="#7d5a3a"/></g>`;
}

export function caisse(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-22" y="-32" width="44" height="32" fill="#5a4028"/><rect x="0" y="-32" width="22" height="32" fill="rgba(0,0,0,0.22)"/>
    <path d="M-22 -32 L22 0 M-22 -22 L22 -22 M-22 -10 L22 -10" stroke="#2a1d12" stroke-width="1.5"/>
    <rect x="-22" y="-32" width="44" height="32" fill="none" stroke="#2a1d12" stroke-width="2.5"/></g>`;
}

// ---- Météo ------------------------------------------------------------------
// Chaque flocon ou goutte a sa propre durée et son propre décalage (variables CSS),
// ce qui évite l'effet « rideau qui descend d'un bloc ».

const alea = (i, k) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * Neige sur trois profondeurs : lointaine (fine, lente), moyenne, proche (grosse, rapide).
 * Les flocons dérivent de gauche à droite en tombant.
 */
export function neige({ n = 70, x0 = 0, largeur = 800, haut = 450, force = 1 } = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const couche = i % 3; // 0 loin, 1 milieu, 2 près
    const x = x0 + alea(i, 1) * largeur;
    const r = [0.9, 1.6, 2.7][couche] + alea(i, 2) * [0.4, 0.6, 1][couche];
    const duree = ([19, 12, 7][couche] + alea(i, 3) * [6, 4, 2.5][couche]) / force;
    const retard = -alea(i, 4) * duree;
    const derive = 3 + alea(i, 5) * 4;
    const ampli = [6, 12, 22][couche];
    s += `<g class="flocon" style="--d:${duree.toFixed(2)}s;--r:${retard.toFixed(2)}s;--h:${haut + 40}px"><circle class="flocon__grain" style="--s:${derive.toFixed(2)}s;--a:${ampli}px" cx="${x.toFixed(1)}" cy="0" r="${r.toFixed(2)}" fill="#fff" opacity="${[0.45, 0.7, 0.9][couche]}"/></g>`;
  }
  // Le vent souffle par rafales : toute la neige dérive ensemble, en plus de la dérive de chaque flocon.
  return `<g class="meteo" pointer-events="none"><g class="rafale">${s}</g></g>`;
}

/** Pluie battante en deux couches, avec éclaboussures sur une ligne (pont, quai…). */
export function pluie({ n = 110, largeur = 800, haut = 450, eclatY = null } = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const pres = i % 3 === 0;
    const x = -40 + alea(i, 1) * (largeur + 160);
    const duree = (pres ? 0.42 : 0.7) + alea(i, 2) * 0.25;
    const retard = -alea(i, 3) * duree;
    const l = pres ? 34 : 20;
    s += `<g class="goutte" style="--d:${duree.toFixed(2)}s;--r:${retard.toFixed(2)}s;--h:${haut + 80}px"><line x1="${x.toFixed(1)}" y1="-40" x2="${(x - l * 0.32).toFixed(1)}" y2="${-40 + l}" stroke="#d6e2ee" stroke-width="${pres ? 1.8 : 1.1}" stroke-linecap="round" opacity="${pres ? 0.55 : 0.32}"/></g>`;
  }
  let eclats = '';
  if (eclatY !== null) {
    for (let i = 0; i < 26; i++) {
      const x = alea(i, 7) * largeur;
      const y = typeof eclatY === 'function' ? eclatY(x) : eclatY;
      eclats += `<ellipse class="eclat" style="--r:${(-alea(i, 8) * 1.4).toFixed(2)}s;--d:${(0.5 + alea(i, 9) * 0.6).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="2.200" fill="none" stroke="#dfe8f2" stroke-width="1.300"/>`;
    }
  }
  return `<g class="meteo" pointer-events="none">${eclats}<g class="rafale rafale--pluie">${s}</g></g>`;
}

/**
 * Aurore boréale : des voiles verts et violets qui ondulent lentement (animations SVG).
 * prefixe : identifiant unique pour les dégradés de ce décor.
 */
export function aurore(largeur = 800, y = 40, prefixe = 'au') {
  const bande = (n, yb, couleurs, dur, decal, op) => {
    const forme = (a) => `M-50 ${yb} C ${largeur * 0.2} ${yb - 40 * a} ${largeur * 0.35} ${yb + 34 * a} ${largeur * 0.5} ${yb - 14 * a} S ${largeur * 0.8} ${yb - 46 * a} ${largeur + 50} ${yb + 8 * a} L${largeur + 50} ${yb + 120} C ${largeur * 0.8} ${yb + 90} ${largeur * 0.62} ${yb + 146} ${largeur * 0.5} ${yb + 108} S ${largeur * 0.2} ${yb + 140} -50 ${yb + 100} Z`;
    return `<defs>${degrade(`${prefixe}${n}`, couleurs)}</defs>
      <path d="${forme(1)}" fill="url(#${prefixe}${n})" opacity="${op}">
        <animate attributeName="d" dur="${dur}s" begin="${decal}s" repeatCount="indefinite" values="${forme(1)};${forme(-0.7)};${forme(1)}" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
        <animate attributeName="opacity" dur="${(dur * 0.6).toFixed(1)}s" begin="${decal}s" repeatCount="indefinite" values="${op * 0.5};${op};${op * 0.5}"/>
      </path>`;
  };
  return `<g pointer-events="none" style="mix-blend-mode:screen">
    ${bande(1, y, [[0, '#3affb0', 0], [0.45, '#3affb0', 0.6], [1, '#7a5cff', 0]], 16, 0, 0.45)}
    ${bande(2, y + 40, [[0, '#7affd0', 0], [0.5, '#4ad0a0', 0.4], [1, '#c060ff', 0]], 21, -7, 0.35)}
  </g>`;
}

/** Poussière dorée qui flotte dans un rayon de lumière (monastère, trésor, hutte). */
export function poussiere({ n = 24, x0 = 0, largeur = 200, y0 = 100, hauteur = 200, couleur = '#ffe6a8' } = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + alea(i, 11) * largeur;
    const y = y0 + alea(i, 12) * hauteur;
    const d = 6 + alea(i, 13) * 8;
    s += `<circle class="grain" style="--d:${d.toFixed(1)}s;--r:${(-alea(i, 14) * d).toFixed(1)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.7 + alea(i, 15) * 1.1).toFixed(2)}" fill="${couleur}"/>`;
  }
  return `<g pointer-events="none">${s}</g>`;
}
