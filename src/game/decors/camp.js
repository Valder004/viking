// Le camp de nuit sur la plage franque. Décor large (1600) qui défile.
// De gauche à droite : le drakkar tiré au sec et le butin, le grand feu, les tentes,
// puis le poteau du sacrifice entre deux torches. Au loin, sur le promontoire,
// le château de Gautier allume ses feux.
import { degrade, halo, vagues, ecume, etoiles, proue, feu, braises, caisse, corbeau } from './elements.js';
import { chateau } from './francie.js';

const L = 1600;
const BOIS = '#3a2718';
const BOIS_F = '#1e140c';

function tente(x, y, w, couleur = '#8a3524') {
  const h = w * 0.8;
  return `<g transform="translate(${x} ${y})">
    <path d="M${-w / 2 - 14} 0 L0 ${-h - 6} M${w / 2 + 14} 0 L0 ${-h - 6}" stroke="#4a4034" stroke-width="1.200"/>
    <path d="M${-w / 2} 0 L0 ${-h} L${w / 2} 0 Z" fill="#c9b994"/>
    ${[-0.3, 0, 0.3].map((t) => `<path d="M${t * w} 0 L0 ${-h} L${t * w + w * 0.12} 0 Z" fill="${couleur}"/>`).join('')}
    <path d="M0 ${-h} L${w / 2} 0 L0 0 Z" fill="rgba(0,0,0,0.3)"/>
    <path d="M${-w * 0.12} 0 L0 ${-h * 0.55} L${w * 0.12} 0 Z" fill="#0d0906"/>
    <path d="M0 ${-h - 12} L0 ${-h + 2}" stroke="${BOIS_F}" stroke-width="3"/>
    <path d="M-4 ${-h - 12} q4 -6 8 0" stroke="${BOIS_F}" stroke-width="2.500" fill="none"/>
  </g>`;
}

function torche(x, y) {
  return `<rect x="${x - 3}" y="${y}" width="6" height="${430 - y}" fill="${BOIS_F}"/>
    <path d="M${x - 8} ${y} L${x + 8} ${y} L${x + 5} ${y - 14} L${x - 5} ${y - 14} Z" fill="#2a1c12"/>
    <circle class="anim-vacille" cx="${x}" cy="${y - 20}" r="90" fill="url(#c-torche)"/>
    ${feu(x, y - 12, 0.36)}`;
}

/** Silhouette assise autour du feu, éclairée d'un côté. */
function guerrier(x, y, s, sens = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s * sens} ${s})">
    <path d="M-16 0 Q-18 -26 -6 -32 L8 -32 Q18 -26 16 0 Z" fill="#100a07"/>
    <circle cx="1" cy="-40" r="9" fill="#100a07"/>
    <path d="M-8 -42 L1 -54 L10 -42 Z" fill="#100a07"/>
    <path d="M9 -46 Q12 -38 9 -32 M14 -26 Q18 -14 16 0" stroke="#e0762a" stroke-width="2" fill="none" opacity="0.7" stroke-linecap="round"/>
  </g>`;
}

export function camp(etat) {
  const f = etat?.flags ?? {};
  const audeMorte = Boolean(etat?.morts?.aude);
  const apres = Boolean(f.c3_sacrifice_fait);

  return {
    largeur: L,
    svg: `<svg viewBox="0 0 ${L} 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${degrade('c-ciel', [[0, '#04060f'], [0.65, '#141c34'], [1, '#2a3050']])}
        ${degrade('c-mer', [[0, '#1a2440'], [1, '#070a14']])}
        ${halo('c-lune', '#dfe8ff', 0.4)}
        ${halo('c-feu', '#ff8a2c', 0.65)}
        ${halo('c-torche', '#ffa040', 0.45)}
      </defs>
      <rect width="${L}" height="450" fill="url(#c-ciel)"/>
      ${etoiles(100, 210)}<g transform="translate(800 0)">${etoiles(100, 210)}</g>
      <circle cx="980" cy="64" r="110" fill="url(#c-lune)"/><circle cx="980" cy="64" r="24" fill="#eef1f6"/>
      <circle cx="972" cy="58" r="5" fill="#cfd6e2" opacity="0.6"/><circle cx="988" cy="72" r="3.500" fill="#cfd6e2" opacity="0.6"/>

      <!-- la mer, au fond -->
      <rect x="0" y="230" width="${L}" height="70" fill="url(#c-mer)"/>
      ${Array.from({ length: 8 }, (_, i) => `<rect class="anim-lueur" x="${980 - 44 + i * 5}" y="${234 + i * 6}" width="${88 - i * 10}" height="2" rx="1" fill="#dfe8ff" opacity="${0.45 - i * 0.05}"/>`).join('')}
      ${vagues(240, 'anim-vague', '#ffffff', 0.06, 4, 300)}<g transform="translate(800 0)">${vagues(240, 'anim-vague', '#ffffff', 0.06, 4, 300)}</g>

      <!-- le promontoire et le château de Gautier -->
      <path d="M1280 240 Q1380 200 1460 196 Q1540 194 ${L} 206 L${L} 260 L1280 260 Z" fill="#0c0e18"/>
      ${chateau(1500, 200, 0.6, '#080a12', true)}

      <!-- les dunes -->
      <path d="M0 270 Q200 252 400 262 Q600 274 800 258 Q1000 246 1200 262 Q1400 276 ${L} 258 L${L} 460 L0 460 Z" fill="#2e2820"/>
      <path d="M0 270 Q200 252 400 262 Q600 274 800 258 Q1000 246 1200 262 Q1400 276 ${L} 258" stroke="#4a5070" stroke-width="2" fill="none" opacity="0.5"/>
      ${ecume(266, 'anim-vague anim-vague--2', 0.25, 3)}

      <!-- le drakkar tiré au sec -->
      <g transform="rotate(-3 180 260)">
        <rect x="178" y="110" width="7" height="160" fill="#120c07"/>
        <path d="M112 132 L252 132" stroke="#120c07" stroke-width="6" stroke-linecap="round"/>
        <rect x="120" y="134" width="124" height="12" rx="6" fill="#3a2e24"/>
        <path d="M182 112 L50 258 M182 112 L322 254" stroke="#1a130d" stroke-width="1.400"/>
        ${proue(52, 262, 0.52, '#161009')}
        <path d="M36 254 Q180 290 332 250 L320 272 Q180 308 50 276 Z" fill="#161009"/>
        <path d="M36 254 Q180 290 332 250" stroke="#4a5a80" stroke-width="2" fill="none" opacity="0.6"/>
        ${[88, 124, 160, 196, 232, 268, 304].map((x, i) => `<circle cx="${x}" cy="${270 + Math.sin((x - 36) / 94) * 8}" r="10" fill="${['#5a2a20', '#6b5628', '#1a2a44', '#6a6458'][i % 4]}"/>`).join('')}
      </g>

      <!-- le butin -->
      ${caisse(268, 352, 1.1)}${caisse(318, 356, 0.95)}${caisse(292, 322, 0.85)}
      <path d="M340 352 L364 330 L388 352 Z" fill="#6b4a2e"/>
      ${[[258, 312], [300, 288], [346, 320], [372, 336]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#ffd27a"/><path d="M${x - 4} ${y} l8 0 M${x} ${y - 4} l0 8" stroke="#ffd27a" stroke-width="0.800" opacity="0.7"/>`).join('')}
      <path d="M238 352 L246 316 M246 316 l-8 -2 l16 0" stroke="#d6a640" stroke-width="2.500" fill="none"/>
      <path d="M396 350 L396 312 M386 324 L406 324" stroke="#d6a640" stroke-width="3"/>

      <!-- le grand feu -->
      <ellipse cx="560" cy="350" rx="420" ry="150" fill="url(#c-feu)" class="anim-lueur"/>
      ${guerrier(480, 352, 1.05)}${guerrier(508, 340, 0.85)}${guerrier(614, 340, 0.85, -1)}${guerrier(642, 354, 1.05, -1)}
      <ellipse cx="560" cy="368" rx="58" ry="12" fill="#0d0906"/>
      ${Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; return `<ellipse cx="${(560 + Math.cos(a) * 56).toFixed(1)}" cy="${(368 + Math.sin(a) * 12).toFixed(1)}" rx="10" ry="5.500" fill="#4a443c"/>`; }).join('')}
      <path d="M528 368 L590 358 M534 358 L594 370" stroke="${BOIS}" stroke-width="9" stroke-linecap="round"/>
      ${feu(560, 366, 1.05)}
      ${braises(560, 310, 10, 70)}
      <g fill="#7a7468" opacity="0.3"><circle class="anim-fumee" cx="560" cy="290" r="14"/><circle class="anim-fumee anim-fumee--2" cx="552" cy="294" r="11"/><circle class="anim-fumee anim-fumee--3" cx="568" cy="292" r="12"/></g>

      <!-- les tentes -->
      ${tente(880, 360, 96)}
      ${tente(1330, 352, 84, '#1f3a5f')}${tente(1440, 360, 104)}${tente(1560, 352, 80, '#6b5628')}
      <path d="M906 360 L930 350 L936 362 Z" fill="#5a4a34"/>

      <!-- le poteau du sacrifice -->
      ${torche(1110, 250)}${torche(1250, 250)}
      <ellipse cx="1180" cy="430" rx="80" ry="12" fill="none" stroke="#4a443c" stroke-width="7" stroke-dasharray="10 8"/>
      <rect x="1171" y="124" width="18" height="308" fill="#2a1c12"/>
      <rect x="1180" y="124" width="9" height="308" fill="rgba(0,0,0,0.3)"/>
      <path d="M1166 124 L1194 124 L1188 98 L1172 98 Z" fill="#2a1c12"/>
      <path d="M1172 98 Q1180 84 1188 98" fill="#2a1c12"/>
      <circle cx="1176" cy="106" r="2.200" fill="#ffb04a"/>
      <path d="M1171 150 l18 6 M1171 160 l18 6 M1171 300 l18 6 M1171 310 l18 6" stroke="#8a7a5a" stroke-width="2.500"/>
      ${apres ? '' : corbeau(1180, 92, 1.4)}
      ${apres && audeMorte ? '<path d="M1160 430 Q1180 418 1204 430" stroke="#5a1a14" stroke-width="6" fill="none" opacity="0.7"/>' : ''}
      <!-- la pierre aux runes -->
      <path d="M1274 432 Q1272 380 1284 364 Q1296 356 1304 368 Q1312 396 1308 432 Z" fill="#3a3f48"/>
      <path d="M1284 384 l0 12 l6 -6 M1294 380 l0 14 M1286 404 l8 0 l-4 10" stroke="#a8402a" stroke-width="2" fill="none" stroke-linecap="round"/>

      <!-- le sable au premier plan -->
      ${Array.from({ length: 60 }, (_, i) => `<ellipse cx="${(i * 131 + 20) % L}" cy="${290 + ((i * 47) % 150)}" rx="${4 + (i % 4) * 2}" ry="${2 + (i % 3)}" fill="#3e372c" opacity="0.7"/>`).join('')}

      <!--persos-->
      <ellipse cx="560" cy="380" rx="520" ry="220" fill="url(#c-feu)" opacity="0.18" pointer-events="none"/>
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
