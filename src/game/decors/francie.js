// Les décors de la côte franque (chapitre 3) vus en dialogue : la plage du débarquement,
// le village en feu et le chemin du retour au crépuscule. La palette se réchauffe :
// sable blond, blés, tuiles rouges, ciel doré.
import { SVG, degrade, halo, vignette, vagues, ecume, etoiles, nuage, mouette, proue, feu, braises } from './elements.js';

const BOIS = '#5a3b24';
const BOIS_F = '#3a2516';

// ---- Briques -----------------------------------------------------------------

/** Arbre feuillu (pommier, chêne) : tronc et trois masses de feuillage. */
export function arbre(x, y, s = 1, feuille = '#5f7a45', ombre = '#4a6236') {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-5 0 L-3 -38 Q-12 -46 -16 -52 M-3 -38 L5 0 M1 -30 Q10 -40 16 -44" stroke="#4a3626" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="-14" cy="-58" r="20" fill="${feuille}"/><circle cx="12" cy="-62" r="22" fill="${feuille}"/><circle cx="-1" cy="-80" r="22" fill="${feuille}"/>
    <path d="M12 -84 A22 22 0 0 1 34 -62 A22 22 0 0 1 12 -40 Q22 -62 12 -84 Z" fill="${ombre}"/>
    <circle cx="-8" cy="-86" r="6" fill="#fff" opacity="0.1"/></g>`;
}

/** Peuplier : une flamme verte, très haute. */
export function peuplier(x, y, h = 70, fill = '#5f7a45') {
  return `<path d="M${x} ${y - h} Q${x + 11} ${y - h * 0.5} ${x + 6} ${y} L${x - 6} ${y} Q${x - 11} ${y - h * 0.5} ${x} ${y - h} Z" fill="${fill}"/>
    <path d="M${x} ${y - h} Q${x + 11} ${y - h * 0.5} ${x + 6} ${y} L${x} ${y} Z" fill="rgba(0,0,0,0.18)"/>`;
}

/** Chaumière franque : torchis, colombages, toit de chaume. y = sol. */
export function chaumiere(x, y, w, { brule = false, nuit = false } = {}) {
  const h = w * 0.46;
  const toit = w * 0.48;
  const torchis = nuit ? '#5a5242' : '#dccca2';
  const chaume = brule ? '#3a2a1c' : nuit ? '#5a4a30' : '#b8955a';
  return `<g transform="translate(${x} ${y})">
    <rect x="0" y="${-h}" width="${w}" height="${h}" fill="${torchis}"/>
    <rect x="${w * 0.55}" y="${-h}" width="${w * 0.45}" height="${h}" fill="rgba(0,0,0,0.12)"/>
    <path d="M0 ${-h} L0 0 M${w} ${-h} L${w} 0 M${w * 0.5} ${-h} L${w * 0.5} 0 M0 ${-h * 0.45} L${w} ${-h * 0.45}
      M0 0 L${w * 0.5} ${-h * 0.45} M${w} 0 L${w * 0.5} ${-h * 0.45}" stroke="${BOIS_F}" stroke-width="${Math.max(2, w * 0.035)}"/>
    <rect x="${w * 0.18}" y="${-h * 0.62}" width="${w * 0.2}" height="${h * 0.62}" fill="${BOIS_F}"/>
    <rect x="${w * 0.66}" y="${-h * 0.82}" width="${w * 0.14}" height="${h * 0.22}" fill="${brule ? '#ff9a3c' : '#2a1c12'}"/>
    <path d="M${-w * 0.08} ${-h + 4} Q${w * 0.1} ${-h - toit * 0.55} ${w * 0.5} ${-h - toit} Q${w * 0.9} ${-h - toit * 0.55} ${w * 1.08} ${-h + 4} Z" fill="${chaume}"/>
    <path d="M${w * 0.5} ${-h - toit} Q${w * 0.9} ${-h - toit * 0.55} ${w * 1.08} ${-h + 4} L${w * 0.5} ${-h + 4} Z" fill="rgba(0,0,0,0.18)"/>
    ${Array.from({ length: 7 }, (_, i) => `<path d="M${w * (0.04 + i * 0.15)} ${-h + 2} l${w * 0.03} ${-toit * 0.32}" stroke="rgba(0,0,0,0.22)" stroke-width="1.500"/>`).join('')}
    ${brule ? `
      <path d="M${w * 0.2} ${-h - toit * 0.5} l${w * 0.08} ${-toit * 0.18} l${w * 0.06} ${toit * 0.14} Z" fill="#14100c"/>
      <g class="anim-lueur"><circle cx="${w * 0.5}" cy="${-h - toit * 0.5}" r="${w * 0.9}" fill="url(#f-incendie)"/></g>
      ${feu(w * 0.32, -h - toit * 0.32, w / 120)}${feu(w * 0.6, -h - toit * 0.62, w / 95)}${feu(w * 0.84, -h - toit * 0.22, w / 140)}
      ${braises(w * 0.55, -h - toit, 7, w * 0.8)}` : ''}
  </g>`;
}

/** Fumée épaisse d'incendie, en colonne. */
export function colonne(x, y, s = 1, couleur = '#2a2420') {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${couleur}">
    <circle class="anim-fumee" cx="0" cy="0" r="22" opacity="0.6"/>
    <circle class="anim-fumee anim-fumee--2" cx="8" cy="-6" r="18" opacity="0.55"/>
    <circle class="anim-fumee anim-fumee--3" cx="-6" cy="-4" r="20" opacity="0.5"/>
    <ellipse cx="18" cy="-90" rx="34" ry="24" opacity="0.4"/><ellipse cx="40" cy="-150" rx="52" ry="30" opacity="0.3"/><ellipse cx="70" cy="-210" rx="70" ry="34" opacity="0.22"/>
  </g>`;
}

/** Cavalier au galop, tourné vers la gauche (vers le joueur). */
export function cavalier(x, y, s = 1, couleur = '#140e0b', reflet = '#e0762a') {
  return `<g transform="translate(${x} ${y}) scale(${-s} ${s})">
    <path d="M-36 -46 Q-58 -52 -68 -30" stroke="${couleur}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-28 -30 L-42 -14 L-56 -6 M-22 -30 L-30 -10 L-40 -2 M26 -30 L46 -16 L56 -4 M20 -30 L28 -10 L22 0" stroke="${couleur}" stroke-width="5.500" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="0" cy="-40" rx="38" ry="15" fill="${couleur}"/>
    <path d="M22 -50 L42 -78 L54 -74 L38 -34 Z" fill="${couleur}"/>
    <path d="M42 -78 L68 -68 L66 -58 L48 -62 Z" fill="${couleur}"/>
    <path d="M44 -78 l2 -9 l6 7 Z" fill="${couleur}"/>
    <path d="M38 -76 Q30 -70 26 -56" stroke="${couleur}" stroke-width="4" fill="none"/>
    <path d="M-8 -52 L8 -52 L10 -84 L-6 -84 Z" fill="${couleur}"/>
    <circle cx="2" cy="-92" r="7.500" fill="${couleur}"/>
    <path d="M-6 -93 L2 -106 L10 -93 Z" fill="${couleur}"/>
    <circle cx="-10" cy="-68" r="12" fill="${couleur}"/>
    <path d="M6 -76 L92 -100" stroke="${couleur}" stroke-width="3.500" stroke-linecap="round"/>
    <path d="M92 -100 l12 -5 l-10 9 Z" fill="${couleur}"/>
    <path d="M0 -52 L10 -36" stroke="${couleur}" stroke-width="5" stroke-linecap="round"/>
    <path d="M-38 -52 Q0 -60 34 -50 M10 -84 L8 -54 M6 -76 L92 -100" stroke="${reflet}" stroke-width="1.300" fill="none" opacity="0.55"/>
  </g>`;
}

/** Château sur sa colline, en silhouette. */
export function chateau(x, y, s = 1, couleur = '#2a2236', feux = false) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-80 0 Q-40 -26 0 -30 Q40 -26 80 0 Z" fill="${couleur}"/>
    <rect x="-46" y="-62" width="92" height="36" fill="${couleur}"/>
    ${[-46, -26, -6, 14, 34].map((dx) => `<rect x="${dx}" y="-68" width="10" height="7" fill="${couleur}"/>`).join('')}
    <rect x="-58" y="-80" width="18" height="54" fill="${couleur}"/><rect x="40" y="-80" width="18" height="54" fill="${couleur}"/>
    <rect x="-12" y="-102" width="26" height="76" fill="${couleur}"/>
    <path d="M-60 -80 l11 -12 l11 12 Z M38 -80 l11 -12 l11 12 Z M-14 -102 l15 -16 l15 16 Z" fill="${couleur}"/>
    ${feux ? '<circle class="anim-vacille" cx="-49" cy="-70" r="2.200" fill="#ffb04a"/><circle class="anim-vacille" cx="49" cy="-70" r="2.200" fill="#ffb04a"/><circle class="anim-vacille" cx="1" cy="-88" r="2.500" fill="#ffb04a"/><circle class="anim-vacille" cx="-20" cy="-52" r="1.800" fill="#ffb04a"/><circle class="anim-vacille" cx="22" cy="-52" r="1.800" fill="#ffb04a"/>' : ''}
  </g>`;
}

/** Petit monastère sur une colline lointaine. */
function monastereLointain(x, y, s = 1, nuit = false) {
  const p = nuit ? '#4a4a5a' : '#d9c49b';
  const t = nuit ? '#3a2a30' : '#a9472f';
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-60" y="-26" width="120" height="26" fill="${p}"/>
    <path d="M-64 -26 L-56 -36 L56 -36 L64 -26 Z" fill="${t}"/>
    <rect x="-20" y="-58" width="40" height="34" fill="${p}"/>
    <path d="M-24 -58 L0 -78 L24 -58 Z" fill="${t}"/>
    <rect x="24" y="-80" width="14" height="56" fill="${p}"/><path d="M22 -80 L31 -92 L40 -80 Z" fill="${t}"/>
    <rect x="28" y="-74" width="6" height="8" fill="#2a1c12"/>
    <circle cx="0" cy="-48" r="4" fill="${nuit ? '#ffb04a' : '#3a4a6a'}"/>
  </g>`;
}

const PLACES = [
  { x: 300, y: 138, scale: 1.0 },
  { x: 130, y: 144, scale: 0.96, miroir: true },
  { x: -20, y: 148, scale: 0.94, miroir: true },
  { x: 446, y: 146, scale: 0.95 },
];
const JOUEUR = { x: 590, y: 132, scale: 1.04 };

// ------------------------------------------------------------------ La plage
export function plage(etat) {
  // Au chapitre 4, on revient sur cette plage au petit jour, en fuyant le château.
  const aube = (etat?.scene ?? '').startsWith('c4_') || (etat?.scene ?? '').startsWith('c5_');
  const nuit = !aube && Boolean(etat?.flags?.soutien_ulf);
  const sable = nuit ? '#3a3428' : '#d8c497';
  const sableMouille = nuit ? '#2a261e' : '#b9a576';
  return {
    svg: SVG(`
      <defs>
        ${degrade('pl-ciel', nuit ? [[0, '#050814'], [0.7, '#16213c'], [1, '#2e3c5c']] : aube ? [[0, '#4a5a8a'], [0.55, '#d8948a'], [1, '#f6d0a0']] : [[0, '#6f9cc8'], [0.6, '#bcd2dc'], [1, '#f6e2b6']])}
        ${degrade('pl-mer', nuit ? [[0, '#1a2a48'], [1, '#080c18']] : [[0, '#6b98ad'], [1, '#3a6a80']])}
        ${halo('pl-astre', nuit ? '#dfe8ff' : '#fff1c8', nuit ? 0.45 : 0.8)}
      </defs>
      <rect width="800" height="450" fill="url(#pl-ciel)"/>
      ${nuit
        ? `${etoiles(90, 210)}<circle cx="200" cy="70" r="100" fill="url(#pl-astre)"/><circle cx="200" cy="70" r="22" fill="#eef1f6"/>`
        : `<circle cx="640" cy="90" r="140" fill="url(#pl-astre)"/><circle cx="640" cy="90" r="26" fill="#fff8e4"/>
           ${nuage(180, 70, 1.2, '#fff', 0.7)}${nuage(420, 110, 0.8, '#fff', 0.5)}${nuage(720, 50, 0.9, '#fff', 0.55)}`}

      <!-- la mer derrière -->
      <rect x="0" y="214" width="800" height="90" fill="url(#pl-mer)"/>
      ${vagues(222, 'anim-vague anim-vague--3', '#ffffff', 0.1, 4)}

      <!-- la côte : collines vertes, le monastère, les fumées du village -->
      <path d="M300 240 Q420 186 560 196 Q680 204 800 178 L800 300 L300 300 Z" fill="${nuit ? '#1a2418' : '#8fa86a'}"/>
      <path d="M420 250 Q560 220 700 232 Q760 236 800 226 L800 300 L420 300 Z" fill="${nuit ? '#141c12' : '#76924f'}"/>
      ${nuit ? '' : `<path d="M470 236 L540 226 L560 238 L486 248 Z M600 232 L690 226 L700 236 L612 242 Z" fill="#d8c070" opacity="0.8"/>`}
      ${peuplier(470, 240, 44, nuit ? '#121a10' : '#5f7a45')}${peuplier(486, 242, 36, nuit ? '#121a10' : '#5f7a45')}${peuplier(760, 220, 46, nuit ? '#121a10' : '#5f7a45')}
      ${monastereLointain(600, 200, 0.8, nuit)}
      ${nuit ? '' : `${colonne(720, 214, 0.35, '#6a6058')}${colonne(744, 220, 0.28, '#6a6058')}`}

      <!-- le drakkar échoué -->
      <ellipse cx="190" cy="300" rx="190" ry="10" fill="#000" opacity="0.25"/>
      <g transform="rotate(-4 190 290)">
        <rect x="186" y="96" width="8" height="190" fill="#2a1c12"/>
        <path d="M120 120 L260 120" stroke="#2a1c12" stroke-width="6" stroke-linecap="round"/>
        <rect x="126" y="122" width="128" height="13" rx="6" fill="${nuit ? '#4a3b2b' : '#a23c26'}"/>
        <path d="M190 100 L40 284 M190 100 L340 280" stroke="#1a110a" stroke-width="1.500"/>
        ${proue(40, 290, 0.62, '#2a1c12')}
        <path d="M24 280 Q190 318 352 276 L340 300 Q190 338 40 304 Z" fill="#2e2016"/>
        <path d="M24 280 Q190 318 352 276" stroke="rgba(255,220,170,0.3)" stroke-width="2" fill="none"/>
        ${[78, 118, 158, 198, 238, 278, 318].map((x, i) => `<circle cx="${x}" cy="${296 + Math.sin((x - 24) / 104) * 9}" r="12" fill="${['#b8432b', '#d9a441', '#1f3a5f', '#e9dfc8'][i % 4]}" opacity="${nuit ? 0.6 : 1}"/><circle cx="${x}" cy="${296 + Math.sin((x - 24) / 104) * 9}" r="3" fill="#8e949a"/>`).join('')}
      </g>

      <!-- la grève -->
      <path d="M0 298 Q200 290 400 300 Q600 310 800 296 L800 460 L0 460 Z" fill="${sable}"/>
      <path d="M0 298 Q200 290 400 300 Q600 310 800 296 L800 316 Q600 330 400 320 Q200 310 0 318 Z" fill="${sableMouille}"/>
      ${ecume(300, 'anim-vague anim-vague--2', 0.6, 3)}
      ${Array.from({ length: 30 }, (_, i) => `<ellipse cx="${(i * 97 + 30) % 800}" cy="${330 + ((i * 53) % 110)}" rx="${3 + (i % 3)}" ry="1.600" fill="${nuit ? '#1e1a14' : '#a8946a'}" opacity="0.7"/>`).join('')}
      <!-- bois flotté et oyats -->
      <path d="M430 352 Q480 344 540 350" stroke="${nuit ? '#2a2018' : '#8a7458'}" stroke-width="9" stroke-linecap="round"/>
      <path d="M520 348 l14 -10" stroke="${nuit ? '#2a2018' : '#8a7458'}" stroke-width="5" stroke-linecap="round"/>
      ${[[700, 330], [730, 336], [760, 328], [20, 340], [50, 346]].map(([x, y]) => `<path d="M${x} ${y} q-6 -18 -12 -26 M${x} ${y} q0 -20 2 -30 M${x} ${y} q6 -16 14 -22" stroke="${nuit ? '#2a3020' : '#8a9a5a'}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}
      ${nuit ? '' : `${mouette(340, 150, 1)}${mouette(380, 132, 0.7, 'anim-oiseau anim-oiseau--2')}`}
      <!--persos-->
      ${vignette('pl-vig', nuit ? 0.7 : 0.35)}`),
    joueur: JOUEUR,
    places: PLACES,
  };
}

// --------------------------------------------------------- Le village en feu
export function village() {
  return {
    svg: SVG(`
      <defs>
        ${degrade('v-ciel', [[0, '#4a3a3a'], [0.5, '#a8705a'], [1, '#e8b47a']])}
        ${halo('f-incendie', '#ff8a2c', 0.45)}
        ${halo('v-lueur', '#ff9a3c', 0.5)}
      </defs>
      <rect width="800" height="450" fill="url(#v-ciel)"/>
      <circle cx="420" cy="200" r="60" fill="#ffd9a0" opacity="0.35"/>
      <!-- fumées qui couvrent le ciel -->
      <g fill="#2e2622" opacity="0.5"><ellipse cx="300" cy="40" rx="260" ry="50"/><ellipse cx="640" cy="70" rx="220" ry="46"/></g>
      ${colonne(180, 230, 1.1)}${colonne(560, 216, 1.3)}${colonne(720, 240, 0.8)}
      <!-- champs et arbres au loin -->
      <path d="M0 260 Q200 230 400 246 Q600 262 800 238 L800 320 L0 320 Z" fill="#8a8a52"/>
      <path d="M0 280 Q300 262 520 276 Q680 286 800 270 L800 330 L0 330 Z" fill="#6f7a44"/>
      ${arbre(60, 268, 0.8, '#55693c', '#435430')}${arbre(760, 262, 0.9, '#55693c', '#435430')}${peuplier(640, 270, 60, '#4f6436')}${peuplier(656, 272, 50, '#4f6436')}
      <!-- les chaumières -->
      ${chaumiere(130, 322, 150, { brule: true })}
      ${chaumiere(470, 312, 180, { brule: true })}
      ${chaumiere(330, 304, 96)}
      ${chaumiere(690, 316, 110)}
      <!-- le sol, la boue, la paille -->
      <path d="M0 318 Q400 300 800 318 L800 460 L0 460 Z" fill="#6b5a3e"/>
      <path d="M260 460 Q330 380 420 318 L500 318 Q470 380 520 460 Z" fill="#584a32"/>
      ${Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 89) % 800} ${330 + ((i * 47) % 120)} l${6 + (i % 3) * 3} ${i % 2 ? -3 : 2}" stroke="#c9a85a" stroke-width="1.500" opacity="0.6"/>`).join('')}
      <!-- le puits -->
      <rect x="44" y="300" width="7" height="58" fill="${BOIS_F}"/><rect x="99" y="300" width="7" height="58" fill="${BOIS_F}"/>
      <path d="M34 304 L75 280 L116 304 Z" fill="#7a5a32"/><path d="M75 280 L116 304 L75 304 Z" fill="rgba(0,0,0,0.25)"/>
      <rect x="40" y="350" width="70" height="32" rx="4" fill="#8a8070"/><rect x="75" y="350" width="35" height="32" rx="4" fill="rgba(0,0,0,0.2)"/>
      <ellipse cx="75" cy="350" rx="35" ry="8" fill="#a09684"/><ellipse cx="75" cy="350" rx="25" ry="5" fill="#1a1612"/>
      <!-- la charrette renversée -->
      <g transform="rotate(-14 680 360)">
        <rect x="610" y="340" width="130" height="24" fill="${BOIS}"/><rect x="610" y="340" width="130" height="5" fill="rgba(255,220,170,0.15)"/>
        <path d="M610 352 L560 372" stroke="${BOIS}" stroke-width="6" stroke-linecap="round"/>
      </g>
      <circle cx="720" cy="384" r="26" fill="none" stroke="${BOIS_F}" stroke-width="6"/>
      <path d="M720 358 L720 410 M694 384 L746 384 M702 366 L738 402 M738 366 L702 402" stroke="${BOIS_F}" stroke-width="3"/>
      ${[[640, 400], [660, 396], [600, 404]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="5" fill="#a87a3a"/>`).join('')}
      <rect width="800" height="450" fill="url(#v-lueur)" opacity="0.5" pointer-events="none"/>
      <!--persos-->
      ${braises(400, 200, 14, 700)}
      ${vignette('v-vig', 0.6)}`),
    joueur: JOUEUR,
    places: [{ x: 300, y: 138, scale: 1.0 }, { x: 70, y: 150, scale: 0.94 }, { x: -40, y: 148, scale: 0.94, miroir: true }],
  };
}

// --------------------------------------------------- Le chemin, au crépuscule
export function chemin(etat) {
  const scene = etat?.scene ?? '';
  const charge = scene.startsWith('c3_embuscade') && !scene.endsWith('_suite');
  const calme = scene === 'c3_chemin_calme';
  return {
    svg: SVG(`
      <defs>
        ${degrade('ch-ciel', calme ? [[0, '#0a0c1c'], [0.6, '#2a2a4a'], [1, '#5a4060']] : [[0, '#3a3a6a'], [0.45, '#b06a6a'], [0.75, '#e8a05a'], [1, '#f4d08a']])}
        ${halo('ch-soleil', '#ffd08a', 0.8)}
        ${halo('ch-torche', '#ffb04a', 0.7)}
      </defs>
      <rect width="800" height="450" fill="url(#ch-ciel)"/>
      ${calme ? etoiles(70, 200) : `<circle cx="600" cy="236" r="160" fill="url(#ch-soleil)"/><circle cx="600" cy="240" r="30" fill="#ffe6b0"/>
        ${nuage(200, 90, 1.3, '#e8a08a', 0.5)}${nuage(480, 60, 1, '#d88a7a', 0.45)}`}
      <!-- collines lointaines et le château -->
      <path d="M0 240 Q160 200 340 222 Q520 244 680 210 Q760 196 800 204 L800 300 L0 300 Z" fill="${calme ? '#1a1a2c' : '#6a5070'}"/>
      ${chateau(700, 214, 0.55, calme ? '#0e0e1a' : '#4a3650', calme)}
      <path d="M0 266 Q200 246 420 260 Q620 272 800 252 L800 310 L0 310 Z" fill="${calme ? '#14181a' : '#7a6a4a'}"/>
      <!-- blés et meules -->
      <path d="M0 282 Q300 266 560 280 Q700 288 800 276 L800 340 L0 340 Z" fill="${calme ? '#2a2a1e' : '#c9a24a'}"/>
      ${calme ? '' : Array.from({ length: 30 }, (_, i) => `<path d="M${(i * 61) % 800} ${290 + (i % 4) * 9} l2 -8 l2 8" stroke="#a8823a" stroke-width="1.200" fill="none"/>`).join('')}
      ${[[90, 300], [190, 294], [380, 298]].map(([x, y]) => `<path d="M${x - 12} ${y} L${x} ${y - 30} L${x + 12} ${y} Z" fill="${calme ? '#2a2618' : '#d8b05a'}"/><path d="M${x} ${y - 30} L${x + 12} ${y} L${x} ${y} Z" fill="rgba(0,0,0,0.2)"/><path d="M${x - 9} ${y - 10} L${x + 9} ${y - 10}" stroke="${calme ? '#1a160e' : '#a8823a'}" stroke-width="2"/>`).join('')}
      <!-- la lisière du bois, à droite -->
      <path d="M560 340 Q580 250 620 236 Q650 220 690 232 Q720 214 760 228 Q790 220 820 236 L820 340 Z" fill="${calme ? '#080a0c' : '#2a3a24'}"/>
      ${[600, 650, 700, 750, 790].map((x, i) => `<circle cx="${x}" cy="${248 - (i % 2) * 10}" r="${26 + (i % 3) * 6}" fill="${calme ? '#0a0c0e' : '#334a2c'}"/>`).join('')}
      <!-- la haie -->
      <path d="M0 336 Q120 318 240 330 Q300 336 330 340 L330 352 L0 352 Z" fill="${calme ? '#0c120c' : '#3e5430'}"/>
      ${Array.from({ length: 12 }, (_, i) => `<circle cx="${12 + i * 28}" cy="${328 + (i % 2) * 4}" r="${12 + (i % 3) * 3}" fill="${calme ? '#0e140e' : '#4a6238'}"/>`).join('')}
      <!-- le chemin -->
      <path d="M0 460 Q240 380 420 344 Q520 326 600 318 L640 320 Q560 340 480 362 Q340 400 220 460 Z" fill="${calme ? '#2a2620' : '#a8885a'}"/>
      <path d="M100 450 Q260 392 440 352 M160 456 Q300 400 470 360" stroke="${calme ? '#1e1a14' : '#8a6a42'}" stroke-width="2" fill="none" stroke-dasharray="10 14"/>
      <!-- le sol au premier plan -->
      <path d="M0 360 Q200 352 400 362 Q600 372 800 356 L800 460 L0 460 Z" fill="${calme ? '#1a1e14' : '#6f7a3e'}" opacity="0.9"/>
      <path d="M0 460 Q240 380 420 344 Q520 326 600 318 L640 320 Q560 340 480 362 Q340 400 220 460 Z" fill="${calme ? '#2a2620' : '#a8885a'}"/>
      <!-- le calvaire -->
      <rect x="136" y="236" width="8" height="110" fill="${calme ? '#1a120c' : BOIS_F}"/>
      <rect x="116" y="254" width="48" height="8" fill="${calme ? '#1a120c' : BOIS_F}"/>
      <path d="M128 346 L152 346 L148 336 L132 336 Z" fill="${calme ? '#2a2620' : '#8a8070'}"/>
      ${charge ? `
        <!-- les cavaliers sortent de la haie -->
        <g class="anim-houle">${cavalier(720, 330, 1.25)}</g>
        <g class="anim-houle anim-houle--2">${cavalier(620, 312, 1.05)}</g>
        ${cavalier(780, 300, 0.85)}
        <path d="M560 340 Q600 330 640 342 Q700 330 760 344" stroke="#c9a85a" stroke-width="10" fill="none" opacity="0.4"/>` : ''}
      ${calme ? `
        <!-- au loin, des torches passent sur la route -->
        ${[520, 556, 592].map((x, i) => `<g transform="translate(${x} ${262 + i * 2})"><circle class="anim-vacille" r="16" fill="url(#ch-torche)"/>${cavalier(0, 14, 0.28, '#05060a', '#ffb04a')}<circle cx="-10" cy="-6" r="2.500" fill="#ffd27a"/></g>`).join('')}` : ''}
      <!--persos-->
      ${vignette('ch-vig', calme ? 0.7 : 0.45)}`),
    joueur: { x: 560, y: 132, scale: 1.04 },
    places: [
      { x: 300, y: 138, scale: 1.0 },
      { x: 130, y: 144, scale: 0.96, miroir: true },
      { x: -20, y: 148, scale: 0.94, miroir: true },
      { x: 430, y: 146, scale: 0.95 },
    ],
  };
}
