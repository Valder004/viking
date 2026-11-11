// Décors du dénouement (chapitre 5) : la veillée au village (fin secrète), le champ en Francie
// (une maison sans mur), la barque du banni, la grève après le naufrage.
import { SVG, degrade, halo, vignette, vagues, ecume, etoiles, maison, sapins, feu, braises, proue, mouette, nuage } from './elements.js';
import { chaumiere, arbre, peuplier } from './francie.js';

const PLACES = [
  { x: 300, y: 138, scale: 1.0 },
  { x: 130, y: 144, scale: 0.96, miroir: true },
  { x: -20, y: 148, scale: 0.94, miroir: true },
  { x: 446, y: 146, scale: 0.95 },
];

/** Montagnes de fjord, en deux plans. */
function fjord(nuit, y = 0) {
  return `<g transform="translate(0 ${y})">
    <path d="M0 250 L70 168 L130 214 L210 120 L290 208 L350 160 L430 236 L500 176 L570 232 L650 150 L730 222 L800 180 L800 300 L0 300 Z" fill="${nuit ? '#1b2740' : '#7c8da3'}"/>
    <path d="M210 120 L236 150 L218 146 L204 158 L190 144 Z M650 150 L676 180 L656 174 L640 186 L630 172 Z M70 168 L88 190 L72 186 L58 196 Z" fill="${nuit ? '#aab6cc' : '#fff'}" opacity="${nuit ? 0.6 : 0.9}"/>
    <path d="M0 290 L90 222 L190 268 L300 214 L420 280 L540 232 L660 284 L800 240 L800 310 L0 310 Z" fill="${nuit ? '#111a2c' : '#566579'}"/></g>`;
}

// --------------------------------------------- La veillée au village (fin 8)
export function veillee() {
  return {
    svg: SVG(`
      <defs>
        ${degrade('ve-ciel', [[0, '#04060f'], [0.65, '#141c34'], [1, '#2a3050']])}
        ${halo('ve-feu', '#ff8a2c', 0.7)}
        ${halo('ve-lune', '#dfe8ff', 0.4)}
      </defs>
      <rect width="800" height="450" fill="url(#ve-ciel)"/>
      ${etoiles(110, 200)}
      <path d="M-20 70 Q400 -20 820 90" stroke="#aab6dc" stroke-width="50" fill="none" opacity="0.05"/>
      <circle cx="160" cy="70" r="90" fill="url(#ve-lune)"/><circle cx="160" cy="70" r="20" fill="#eef1f6"/>
      ${fjord(true, -30)}
      ${sapins(0, 800, 290, 44, '#080c12', 16)}
      ${maison(20, 300, 110, { nuit: true })}${maison(620, 304, 130, { nuit: true })}${maison(180, 296, 70, { nuit: true, fumee: false })}
      <path d="M0 300 Q400 290 800 302 L800 460 L0 460 Z" fill="#1a1612"/>
      ${Array.from({ length: 30 }, (_, i) => `<ellipse cx="${(i * 97) % 800}" cy="${320 + ((i * 41) % 120)}" rx="5" ry="2" fill="#2a241e" opacity="0.8"/>`).join('')}
      <ellipse cx="400" cy="380" rx="420" ry="170" fill="url(#ve-feu)" class="anim-lueur"/>
      <!-- le feu, au milieu du village -->
      <ellipse cx="400" cy="392" rx="64" ry="13" fill="#0d0906"/>
      ${Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; return `<ellipse cx="${(400 + Math.cos(a) * 62).toFixed(1)}" cy="${(392 + Math.sin(a) * 13).toFixed(1)}" rx="11" ry="6" fill="#4a443c"/>`; }).join('')}
      <path d="M366 392 L430 382 M372 382 L436 394" stroke="#3a2718" stroke-width="9" stroke-linecap="round"/>
      ${feu(400, 390, 1.05)}
      ${braises(400, 330, 10, 70)}
      <!-- la place vide, pour Arne -->
      <path d="M466 420 L566 414" stroke="#3a2e24" stroke-width="20" stroke-linecap="round"/>
      <path d="M466 414 L566 408" stroke="rgba(255,150,70,0.25)" stroke-width="3" stroke-linecap="round"/>
      <g transform="translate(516 406)"><path d="M-10 0 Q-12 -22 0 -26 Q12 -22 10 0 Z" fill="#e9dfc8"/><path d="M-10 -4 L10 -4" stroke="#d6a640" stroke-width="2"/></g>
      <!--persos-->
      <ellipse cx="400" cy="400" rx="520" ry="220" fill="url(#ve-feu)" opacity="0.2" pointer-events="none"/>
      ${vignette('ve-vig', 0.7)}`),
    // Le feu au centre, la place d'Arne juste à sa droite : personne ne doit les cacher.
    joueur: { x: 632, y: 136, scale: 0.98 },
    places: [
      { x: 104, y: 144, scale: 0.96, miroir: true },
      { x: -6, y: 148, scale: 0.94, miroir: true },
      { x: 202, y: 140, scale: 0.98 },
      { x: 528, y: 150, scale: 0.92 },
    ],
  };
}

// ------------------------------------------- Le champ en Francie (fin 3)
export function champ(etat) {
  const anselme = Boolean(etat?.flags?.moines_epargnes);
  return {
    svg: SVG(`
      <defs>
        ${degrade('cp-ciel', [[0, '#7a8ac0'], [0.5, '#e8b48a'], [1, '#f8dca0']])}
        ${halo('cp-soleil', '#fff1c8', 0.85)}
      </defs>
      <rect width="800" height="450" fill="url(#cp-ciel)"/>
      <circle cx="620" cy="230" r="200" fill="url(#cp-soleil)"/><circle cx="620" cy="234" r="32" fill="#fff6dc"/>
      ${nuage(180, 80, 1.2, '#fbe6d0', 0.6)}${nuage(420, 50, 0.9, '#fbe6d0', 0.5)}
      <path d="M0 250 Q200 214 420 236 Q620 256 800 226 L800 320 L0 320 Z" fill="#9cb07a"/>
      <path d="M0 270 Q300 248 560 264 Q700 272 800 260 L800 330 L0 330 Z" fill="#c9a84a"/>
      ${Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 41) % 800} ${276 + (i % 5) * 9} l2 -9 l2 9" stroke="#a8823a" stroke-width="1.200" fill="none"/>`).join('')}
      ${peuplier(80, 262, 60, '#6a8a48')}${peuplier(96, 264, 50, '#6a8a48')}${peuplier(760, 256, 64, '#6a8a48')}
      ${anselme ? `<!-- au loin, sur le chemin, un moine -->
        <g transform="translate(140 286) scale(0.3)">
          <path d="M-16 0 L-12 -60 L12 -60 L16 0 Z" fill="#6b5540"/><circle cx="0" cy="-70" r="10" fill="#e2b894"/>
          <path d="M18 -60 L22 0" stroke="#5a4028" stroke-width="3"/></g>` : ''}
      <!-- la maison, sans mur d'enceinte -->
      ${chaumiere(470, 330, 150)}
      ${arbre(670, 330, 1.05, '#6a8a48', '#55703a')}
      ${[[650, 280], [690, 272], [700, 296]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#c9423a"/>`).join('')}
      <!-- le sol, le potager -->
      <path d="M0 326 Q400 316 800 328 L800 460 L0 460 Z" fill="#7a8a4a"/>
      ${[[90, 360], [150, 370], [210, 362]].map(([x, y]) => `<rect x="${x}" y="${y}" width="50" height="12" rx="2" fill="#6b4f33"/><path d="M${x + 8} ${y} q-4 -10 -6 -14 M${x + 22} ${y} q0 -12 1 -16 M${x + 36} ${y} q4 -10 8 -14" stroke="#6f9a4a" stroke-width="2.200" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M360 460 Q420 380 520 330 L560 330 Q480 390 460 460 Z" fill="#a8885a" opacity="0.7"/>
      ${mouette(300, 140, 0.8)}${mouette(330, 126, 0.6, 'anim-oiseau anim-oiseau--2')}
      <!--persos-->
      ${vignette('cp-vig', 0.3)}`),
    joueur: { x: 560, y: 132, scale: 1.02 },
    places: [{ x: 300, y: 138, scale: 1.0 }, { x: 130, y: 144, scale: 0.96, miroir: true }],
  };
}

// ---------------------------------------------- La barque du banni (fin 7)
export function barque() {
  return {
    svg: SVG(`
      <defs>
        ${degrade('ba-ciel', [[0, '#1a1a3a'], [0.5, '#6a4060'], [1, '#e08a5a']])}
        ${degrade('ba-mer', [[0, '#4a3a5a'], [1, '#0e101c']])}
        ${halo('ba-soleil', '#ffb07a', 0.8)}
      </defs>
      <rect width="800" height="450" fill="url(#ba-ciel)"/>
      ${etoiles(30, 120)}
      <circle cx="400" cy="260" r="200" fill="url(#ba-soleil)"/><circle cx="400" cy="262" r="40" fill="#ffd0a0"/>
      <rect x="0" y="260" width="800" height="200" fill="url(#ba-mer)"/>
      ${Array.from({ length: 10 }, (_, i) => `<rect class="anim-lueur" x="${400 - 60 + i * 6}" y="${268 + i * 8}" width="${120 - i * 12}" height="2.500" rx="1" fill="#ffd0a0" opacity="${0.6 - i * 0.05}"/>`).join('')}
      ${vagues(276, 'anim-vague', '#ffffff', 0.06, 4)}${ecume(300, 'anim-vague anim-vague--2', 0.25, 5)}
      ${vagues(340, 'anim-vague anim-vague--3', '#000000', 0.25, 7)}
      <!-- au loin, le drakkar qui s'en va -->
      <g transform="translate(120 262) scale(0.25)" fill="#0e0a12">
        <rect x="-2" y="-90" width="6" height="90"/><rect x="-40" y="-80" width="84" height="40" rx="6"/>
        <path d="M-90 0 Q0 24 90 0 L80 12 Q0 34 -80 12 Z"/><path d="M-90 0 Q-104 -20 -94 -44 Q-90 -24 -82 -14 Z"/></g>
      <!-- la barque -->
      <g class="anim-roulis">
        <path d="M270 392 Q400 420 530 390 L516 410 Q400 440 284 412 Z" fill="#3a2718"/>
        <path d="M270 392 Q400 420 530 390" stroke="rgba(255,200,150,0.4)" stroke-width="2.500" fill="none"/>
        <path d="M270 392 Q258 374 266 360 M530 390 Q542 372 534 358" stroke="#3a2718" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M300 404 L230 436 M500 402 L570 434" stroke="#5a4028" stroke-width="5" stroke-linecap="round"/>
      </g>
      <!--persos-->
      ${vignette('ba-vig', 0.6)}`),
    joueur: { x: 300, y: 112, scale: 0.98 },
    places: PLACES,
  };
}

// ------------------------------------------ La grève après le naufrage (fin 5)
export function greve(etat) {
  const chien = Boolean(etat?.flags?.chien_nourri);
  const debris = [[120, 360, -12], [230, 378, 8], [520, 366, -4], [660, 384, 14], [760, 356, -20]];
  return {
    svg: SVG(`
      <defs>${degrade('gr-ciel', [[0, '#5a6470'], [1, '#b8bcc0']])}</defs>
      <rect width="800" height="450" fill="url(#gr-ciel)"/>
      ${nuage(200, 70, 1.6, '#d8dade', 0.6)}${nuage(600, 50, 1.3, '#d8dade', 0.5)}
      ${fjord(false, -30)}
      ${sapins(0, 300, 290, 40, '#2a3434', 8)}
      ${maison(40, 296, 80, { fumee: true })}${maison(150, 292, 60, { fumee: false })}
      <rect x="0" y="280" width="800" height="60" fill="#5a6a78"/>
      ${vagues(290, 'anim-vague', '#ffffff', 0.12, 5, 340)}${ecume(300, 'anim-vague anim-vague--2', 0.4, 5)}
      <!-- la proue brisée, dans l'eau -->
      <g transform="rotate(28 600 320)">${proue(600, 336, 0.45, '#2a1c12')}</g>
      <path d="M0 330 Q400 316 800 334 L800 460 L0 460 Z" fill="#8a8476"/>
      <path d="M0 330 Q400 316 800 334 L800 344 Q400 328 0 342 Z" fill="#6a665c"/>
      ${ecume(334, 'anim-vague', 0.6, 3)}
      ${debris.map(([x, y, r]) => `<rect x="${x - 40}" y="${y - 6}" width="80" height="11" fill="#3a2718" transform="rotate(${r} ${x} ${y})"/>`).join('')}
      <g transform="translate(420 392)"><circle r="20" fill="#2a1c12"/><circle r="17" fill="#6a5628"/><path d="M-17 0 L17 0" stroke="#1a110a" stroke-width="3"/><path d="M-6 -16 L4 2 L-4 16" stroke="#1a110a" stroke-width="2" fill="none"/></g>
      <path d="M300 410 Q330 404 360 410" stroke="#b9a37a" stroke-width="3" fill="none"/>
      ${chien ? `<g transform="translate(560 412)">
        <path d="M-14 -2 Q-28 -6 -25 -20" stroke="#6e6258" stroke-width="4.500" fill="none" stroke-linecap="round"/>
        <path d="M-14 0 Q-21 -22 -9 -34 Q-5 -50 6 -52 Q18 -53 20 -42 L29 -38 L20 -32 Q16 -26 10 -26 Q15 -10 12 0 Z" fill="#6e6258"/>
        <path d="M1 -51 L3 -65 L12 -52 Z" fill="#5a4f46"/><circle cx="13" cy="-43" r="1.700" fill="#120c07"/><circle cx="27.500" cy="-38" r="2" fill="#120c07"/>
        <path d="M2 0 l0 -10 M9 0 l0 -10" stroke="#5a4f46" stroke-width="3" stroke-linecap="round"/></g>` : ''}
      <!--persos-->
      ${vignette('gr-vig', 0.45)}`),
    joueur: { x: 300, y: 128, scale: 1.0 },
    places: PLACES,
  };
}
