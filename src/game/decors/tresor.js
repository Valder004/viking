// La salle du trésor du comte Gautier : décor large (1200), voûtes, coffres, bannières,
// la table du comte et sa correspondance, une fenêtre ouverte sur la cour en flammes.
import { halo, feu, braises, poussiere } from './elements.js';

const L = 1200;
const PIERRE = '#4a3c30';
const PIERRE_C = '#5e4c3c';
const OR = '#d6a640';
const BOIS = '#4a3020';
const BOIS_F = '#2a1a10';

function colonne(x) {
  return `<rect x="${x - 18}" y="70" width="36" height="320" fill="${PIERRE_C}"/>
    <rect x="${x}" y="70" width="18" height="320" fill="rgba(0,0,0,0.25)"/>
    <rect x="${x - 24}" y="62" width="48" height="12" fill="#6e5a46"/><rect x="${x - 24}" y="384" width="48" height="12" fill="#6e5a46"/>
    <path d="M${x - 18} 120 L${x + 18} 120 M${x - 18} 200 L${x + 18} 200 M${x - 18} 280 L${x + 18} 280" stroke="rgba(0,0,0,0.25)" stroke-width="1.500"/>`;
}

function banniere(x) {
  return `<path d="M${x - 34} 92 L${x + 34} 92 L${x + 34} 250 L${x} 226 L${x - 34} 250 Z" fill="#8a2c3f"/>
    <path d="M${x} 92 L${x + 34} 92 L${x + 34} 250 L${x} 226 Z" fill="rgba(0,0,0,0.25)"/>
    <path d="M${x - 34} 100 L${x + 34} 100" stroke="${OR}" stroke-width="3"/>
    <path d="M${x} 120 L${x} 200 M${x - 22} 150 L${x + 22} 150" stroke="${OR}" stroke-width="7"/>
    <circle cx="${x}" cy="150" r="9" fill="none" stroke="${OR}" stroke-width="3"/>
    <path d="M${x - 40} 88 L${x + 40} 88" stroke="${BOIS_F}" stroke-width="5" stroke-linecap="round"/>`;
}

function coffre(x, y, s = 1, ouvert = true) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-36" y="-34" width="72" height="34" fill="#5a3b24"/>
    <path d="M-36 -22 L36 -22 M-22 -34 L-22 0 M22 -34 L22 0" stroke="${OR}" stroke-width="3"/>
    ${ouvert
      ? `<path d="M-36 -34 L-40 -64 L32 -64 L36 -34 Z" fill="#4a3020"/><path d="M-30 -34 Q0 -50 30 -34 Z" fill="${OR}"/>
         ${[-18, -6, 6, 18].map((dx, i) => `<circle cx="${dx}" cy="${-38 - (i % 2) * 4}" r="4" fill="#f0d07a"/>`).join('')}`
      : `<path d="M-36 -34 Q0 -52 36 -34 Z" fill="#6b4a2e"/><rect x="-6" y="-28" width="12" height="10" fill="${OR}"/>`}
  </g>`;
}

function chandelier(x) {
  return `<path d="M${x} 390 L${x} 250 M${x - 26} 270 Q${x} 290 ${x + 26} 270 M${x - 26} 270 L${x - 26} 256 M${x + 26} 270 L${x + 26} 256" stroke="${OR}" stroke-width="4" fill="none"/>
    <path d="M${x - 16} 390 L${x} 372 L${x + 16} 390 Z" fill="${OR}"/>
    ${[x - 26, x, x + 26].map((cx) => `<rect x="${cx - 3}" y="${cx === x ? 236 : 242}" width="6" height="14" fill="#e9dfc8"/><circle class="anim-vacille" cx="${cx}" cy="${cx === x ? 230 : 236}" r="30" fill="url(#t-cierge)"/><path d="M${cx} ${cx === x ? 236 : 242} q-3 -7 0 -11 q3 4 0 11 Z" fill="#ffd27a"/>`).join('')}`;
}

/** Bannière cousue à la hâte : un corbeau noir sur fond rouge, coutures visibles. */
function bannNorroise(x) {
  return `<path d="M${x - 34} 92 L${x + 34} 92 L${x + 34} 250 L${x} 226 L${x - 34} 250 Z" fill="#a8302a"/>
    <path d="M${x} 92 L${x + 34} 92 L${x + 34} 250 L${x} 226 Z" fill="rgba(0,0,0,0.2)"/>
    <path d="M${x - 30} 96 L${x - 30} 244 M${x + 30} 96 L${x + 30} 244" stroke="#e9dfc8" stroke-width="1.200" stroke-dasharray="4 3"/>
    <path d="M${x - 18} 170 Q${x - 22} 146 ${x - 4} 140 Q${x + 6} 136 ${x + 10} 144 L${x + 22} 146 L${x + 10} 152 Q${x + 14} 172 ${x} 178 L${x - 24} 184 Z" fill="#14100c"/>
    <circle cx="${x + 4}" cy="146" r="1.600" fill="#d6a640"/>
    <path d="M${x - 40} 88 L${x + 40} 88" stroke="#2a1a10" stroke-width="5" stroke-linecap="round"/>`;
}

/** Le siège haut, monté avec ce qu'on a trouvé : une chaise de comte, des bois de cerf. */
function siege(x) {
  return `<rect x="${x - 40}" y="250" width="80" height="140" fill="#5a3b24"/><rect x="${x - 30}" y="262" width="60" height="80" fill="#8a2c3f"/>
    <rect x="${x - 50}" y="340" width="100" height="12" fill="#4a3020"/>
    <path d="M${x - 30} 252 Q${x - 60} 220 ${x - 54} 190 M${x - 46} 232 l-18 -10 M${x - 52} 210 l-16 -4 M${x + 30} 252 Q${x + 60} 220 ${x + 54} 190 M${x + 46} 232 l18 -10 M${x + 52} 210 l16 -4" stroke="#d8c8a0" stroke-width="6" fill="none" stroke-linecap="round"/>`;
}

export function tresor(etat) {
  const f = etat?.flags ?? {};
  const lettrePrise = Boolean(f.pris_table);
  const couronnePrise = Boolean(f.pris_coffres);
  // Fin « Jarl de Francie » : la salle du comte, réaménagée à la norroise.
  const norrois = (etat?.scene ?? '').startsWith('c5_');

  return {
    largeur: L,
    svg: `<svg viewBox="0 0 ${L} 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${halo('t-cierge', '#ffb04a', 0.55)}
        ${halo('t-feu', '#ff7a2c', 0.6)}
        <pattern id="t-pierre" width="44" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 14 L44 14 M0 28 L44 28 M22 0 L22 14 M0 14 L0 28 M44 14 L44 28" stroke="rgba(0,0,0,0.35)" stroke-width="1.200" fill="none"/>
        </pattern>
      </defs>
      <!-- murs et voûtes -->
      <rect width="${L}" height="450" fill="${PIERRE}"/>
      <rect width="${L}" height="450" fill="url(#t-pierre)"/>
      <rect width="${L}" height="90" fill="#1a120c"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => { const x = i * 200; return `<path d="M${x} 90 Q${x + 100} -10 ${x + 200} 90" stroke="#2a1e16" stroke-width="22" fill="none"/><path d="M${x} 90 Q${x + 100} 6 ${x + 200} 90" stroke="rgba(255,190,120,0.07)" stroke-width="2" fill="none"/>`; }).join('')}

      <!-- l'escalier, à gauche -->
      ${Array.from({ length: 7 }, (_, i) => `<rect x="${i * 12}" y="${250 + i * 20}" width="${100 - i * 12}" height="20" fill="${i % 2 ? '#3a2e24' : '#43362a'}"/>`).join('')}
      <path d="M0 250 L100 250 L100 390" stroke="#2a1e16" stroke-width="4" fill="none"/>

      <!-- la fenêtre sur la cour en feu -->
      <path d="M916 270 L916 150 Q960 104 1004 150 L1004 270 Z" fill="#2a0e06"/>
      <path d="M920 270 L920 152 Q960 112 1000 152 L1000 270 Z" fill="#c2541e"/>
      <circle class="anim-lueur" cx="960" cy="230" r="140" fill="url(#t-feu)"/>
      ${feu(944, 270, 0.6)}${feu(980, 270, 0.5)}
      <path d="M960 112 L960 270 M920 190 L1000 190" stroke="#2a1e16" stroke-width="4"/>
      <path d="M908 272 L1012 272" stroke="#6e5a46" stroke-width="8"/>
      ${braises(960, 200, 6, 60)}

      ${norrois ? [200, 600, 1040].map(bannNorroise).join('') : banniere(200) + banniere(600) + banniere(1040)}
      ${norrois ? siege(600) : ''}
      ${[100, 300, 500, 700, 900, 1100].map(colonne).join('')}

      <!-- le butin du comte -->
      ${coffre(350, 396, 1.1, true)}${coffre(430, 400, 0.95, !couronnePrise)}${coffre(392, 360, 0.8, false)}
      ${Array.from({ length: 14 }, (_, i) => `<ellipse cx="${300 + ((i * 37) % 200)}" cy="${404 + (i % 3) * 5}" rx="4" ry="2" fill="#f0d07a"/>`).join('')}
      <path d="M470 400 L470 360 M460 372 L480 372" stroke="${OR}" stroke-width="3"/>
      ${couronnePrise ? '' : `<g transform="translate(430 352) scale(0.6)"><path d="M-14 8 L-12 -8 L-6 0 L0 -12 L6 0 L12 -8 L14 8 Z" fill="${OR}"/><circle cx="0" cy="4" r="2" fill="#a8302a"/></g>`}

      ${chandelier(640)}${chandelier(860)}

      <!-- la table du comte -->
      <rect x="650" y="330" width="120" height="10" fill="${BOIS}"/>
      <path d="M660 340 L660 396 M760 340 L760 396" stroke="${BOIS_F}" stroke-width="7"/>
      <rect x="664" y="320" width="34" height="12" fill="#e3d3a8" transform="rotate(-6 680 326)"/>
      <rect x="702" y="322" width="26" height="9" fill="#d8c8a0" transform="rotate(8 715 326)"/>
      ${lettrePrise ? '' : `<rect x="732" y="320" width="26" height="12" fill="#e9dcb6"/><circle cx="752" cy="326" r="4" fill="#a8302a"/>`}
      <rect x="690" y="306" width="5" height="16" fill="#e9dfc8"/><circle class="anim-vacille" cx="692" cy="302" r="26" fill="url(#t-cierge)"/><path d="M692 306 q-3 -6 0 -9 q3 3 0 9 Z" fill="#ffd27a"/>
      <path d="M716 322 L726 300" stroke="#e9dfc8" stroke-width="1.500"/>

      <!-- le sol dallé -->
      <rect x="0" y="390" width="${L}" height="70" fill="#3a2e24"/>
      ${Array.from({ length: 24 }, (_, i) => `<path d="M${i * 52} 390 L${i * 52 - 20} 460" stroke="rgba(0,0,0,0.3)" stroke-width="1.500"/>`).join('')}
      <path d="M0 418 L${L} 418" stroke="rgba(0,0,0,0.3)" stroke-width="1.500"/>
      <ellipse cx="960" cy="410" rx="160" ry="16" fill="#ff7a2c" opacity="0.12"/>
      <rect width="${L}" height="450" fill="#ffb060" opacity="0.05" pointer-events="none"/>

      <!--persos-->
      ${poussiere({ n: 22, x0: 880, largeur: 180, y0: 140, hauteur: 240, couleur: '#ffc890' })}${poussiere({ n: 14, x0: 600, largeur: 300, y0: 200, hauteur: 160 })}
    </svg>`,
    joueur: { x: 590, y: 132, scale: 1.04 },
    places: [
      { x: 300, y: 138, scale: 1.0 },
      { x: 120, y: 144, scale: 0.96, miroir: true },
      { x: -30, y: 148, scale: 0.94, miroir: true },
      { x: 448, y: 146, scale: 0.95 },
    ],
  };
}
