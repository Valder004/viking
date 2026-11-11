// Le château de Gautier (chapitre 4) : les remparts de nuit, le souterrain sous la chapelle,
// la cour en feu (et la même cour, au petit jour, pour la fin des corbeaux).
import { SVG, degrade, halo, vignette, etoiles, feu, braises, caisse, corbeau } from './elements.js';
import { colonne } from './francie.js';

const PIERRE_NUIT = '#3c4458';
const PIERRE_NUIT_O = '#2a3042';
const BOIS = '#3a2718';
const BOIS_F = '#1e140c';

const PATTERN_PIERRE = (id, trait = 'rgba(0,0,0,0.35)') => `<pattern id="${id}" width="40" height="26" patternUnits="userSpaceOnUse">
  <path d="M0 13 L40 13 M0 26 L40 26 M20 0 L20 13 M0 13 L0 26 M40 13 L40 26" stroke="${trait}" stroke-width="1.200" fill="none"/>
  <path d="M2 2 L18 2 M22 15 L38 15" stroke="rgba(255,255,255,0.06)" stroke-width="1"/></pattern>`;

const PLACES = [
  { x: 300, y: 138, scale: 1.0 },
  { x: 130, y: 144, scale: 0.96, miroir: true },
  { x: -20, y: 148, scale: 0.94, miroir: true },
  { x: 446, y: 146, scale: 0.95 },
];
const JOUEUR = { x: 590, y: 132, scale: 1.04 };

/** Créneaux le long d'une ligne. */
const creneaux = (x1, x2, y, couleur, pas = 26, l = 15, h = 14) =>
  Array.from({ length: Math.floor((x2 - x1) / pas) + 1 }, (_, i) => `<rect x="${x1 + i * pas}" y="${y - h}" width="${l}" height="${h}" fill="${couleur}"/>`).join('');

function sentinelle(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#0a0c14">
    <path d="M-7 0 L-6 -24 L6 -24 L7 0 Z"/><circle cx="0" cy="-30" r="6"/><path d="M-6 -32 L0 -40 L6 -32 Z"/>
    <path d="M8 -36 L8 6" stroke="#0a0c14" stroke-width="2"/><path d="M8 -36 l-3 -6 l6 0 Z"/></g>`;
}

// ---------------------------------------------------------------- Les remparts
export function chateauExt(etat) {
  const scene = etat?.scene ?? '';
  const echelles = scene.startsWith('c4_remparts');
  const poterne = scene.startsWith('c4_poterne');
  const ouverte = Boolean(etat?.flags?.poterne_ouverte);

  const fleches = echelles ? Array.from({ length: 9 }, (_, i) => {
    const x = 380 + ((i * 53) % 360);
    const y = 120 + ((i * 37) % 160);
    return `<path d="M${x} ${y} l-30 22" stroke="#d8d2c6" stroke-width="1.200" opacity="0.6"/>`;
  }).join('') : '';

  const echelle = (x, h, a) => `<g transform="rotate(${a} ${x} 360)">
    <path d="M${x - 10} 360 L${x - 10} ${360 - h} M${x + 10} 360 L${x + 10} ${360 - h}" stroke="${BOIS}" stroke-width="5"/>
    ${Array.from({ length: Math.floor(h / 22) }, (_, i) => `<path d="M${x - 10} ${352 - i * 22} L${x + 10} ${352 - i * 22}" stroke="${BOIS}" stroke-width="3.500"/>`).join('')}</g>`;

  return {
    svg: SVG(`
      <defs>
        ${degrade('ce-ciel', [[0, '#04060f'], [0.7, '#141a30'], [1, '#2a2a44']])}
        ${halo('ce-lune', '#dfe8ff', 0.4)}
        ${halo('ce-torche', '#ffa040', 0.55)}
        ${halo('ce-porte', '#ffb04a', 0.7)}
        ${PATTERN_PIERRE('ce-pierre')}
      </defs>
      <rect width="800" height="450" fill="url(#ce-ciel)"/>
      ${etoiles(80, 140)}
      <circle cx="420" cy="58" r="90" fill="url(#ce-lune)"/><circle cx="420" cy="58" r="20" fill="#eef1f6"/>

      <!-- la courtine -->
      <rect x="0" y="104" width="800" height="250" fill="${PIERRE_NUIT}"/>
      <rect x="0" y="104" width="800" height="250" fill="url(#ce-pierre)"/>
      ${creneaux(0, 800, 104, PIERRE_NUIT)}
      <rect x="0" y="104" width="800" height="250" fill="#000" opacity="0.15"/>
      <path d="M0 240 Q200 236 400 244 Q600 250 800 240" stroke="rgba(0,0,0,0.3)" stroke-width="16" fill="none"/>
      <!-- les tours -->
      ${[110, 690].map((x) => `
        <rect x="${x - 62}" y="44" width="124" height="310" fill="${PIERRE_NUIT_O}"/>
        <rect x="${x - 62}" y="44" width="124" height="310" fill="url(#ce-pierre)"/>
        <rect x="${x}" y="44" width="62" height="310" fill="#000" opacity="0.2"/>
        ${creneaux(x - 62, x + 62, 44, PIERRE_NUIT_O, 24, 14, 14)}
        <path d="M${x - 6} 110 L${x - 6} 90 Q${x} 82 ${x + 6} 90 L${x + 6} 110 Z M${x - 6} 200 L${x - 6} 180 Q${x} 172 ${x + 6} 180 L${x + 6} 200 Z" fill="#0a0c14"/>
        <circle class="anim-vacille" cx="${x}" cy="102" r="10" fill="url(#ce-torche)"/>`).join('')}
      <!-- torches et sentinelles sur le chemin de ronde -->
      ${[260, 420, 560].map((x) => `<circle class="anim-vacille" cx="${x}" cy="84" r="46" fill="url(#ce-torche)"/>${feu(x, 92, 0.22)}`).join('')}
      ${sentinelle(300, 92, 0.9)}${sentinelle(500, 92, 0.9)}

      <!-- la poterne -->
      <path d="M300 354 L300 286 Q330 262 360 286 L360 354 Z" fill="${ouverte ? '#ffcf7a' : '#140c08'}"/>
      ${ouverte
        ? `<circle class="anim-vacille" cx="330" cy="318" r="80" fill="url(#ce-porte)"/><path d="M300 290 L284 296 L284 360 L300 354 Z" fill="${BOIS}"/>`
        : `<path d="M304 354 L304 288 Q330 268 356 288 L356 354 Z" fill="${BOIS}"/><path d="M316 286 L316 354 M330 276 L330 354 M344 286 L344 354" stroke="${BOIS_F}" stroke-width="2"/><circle cx="348" cy="322" r="3" fill="#6f757b"/>`}
      <path d="M296 354 L296 284 Q330 254 364 284 L364 354" stroke="${PIERRE_NUIT_O}" stroke-width="6" fill="none"/>
      ${poterne ? `<circle class="anim-vacille" cx="250" cy="300" r="60" fill="url(#ce-torche)"/>` : ''}

      <!-- le fossé et le sol -->
      <path d="M0 354 L800 354 L800 382 Q400 392 0 382 Z" fill="#0c0e14"/>
      <path d="M0 372 Q400 380 800 372" stroke="#2a3450" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M0 380 Q400 392 800 380 L800 460 L0 460 Z" fill="#1a1a16"/>
      ${Array.from({ length: 24 }, (_, i) => `<path d="M${(i * 71) % 800} ${398 + ((i * 29) % 50)} q-4 -10 -8 -14 M${(i * 71) % 800} ${398 + ((i * 29) % 50)} q2 -12 4 -16" stroke="#2a3020" stroke-width="1.800" fill="none"/>`).join('')}

      ${echelles ? `${echelle(470, 260, 6)}${echelle(560, 270, 4)}${echelle(640, 250, 8)}
        <path d="M410 104 L404 360" stroke="#b9a37a" stroke-width="2"/><path d="M402 104 l8 -6 l8 6" stroke="#6f757b" stroke-width="3" fill="none"/>
        ${fleches}` : ''}
      <!--persos-->
      ${vignette('ce-vig', 0.7)}`),
    joueur: JOUEUR,
    places: PLACES,
  };
}

// ---------------------------------------------------------------- Le souterrain
export function souterrain(etat) {
  const scene = etat?.scene ?? '';
  const herse = scene.startsWith('c4_aveu') || scene.startsWith('c4_fuite') || scene === 'c4_thorkel';
  const arches = [0, 1, 2, 3, 4].map((i) => {
    const s = 1 - i * 0.17;
    const w = 760 * s;
    const h = 380 * s;
    const x = 400 - w / 2;
    const y = 400 - h;
    const t = 0.8 - i * 0.15;
    return `<path d="M${x} 460 L${x} ${y + h * 0.42} Q${x} ${y} 400 ${y} Q${x + w} ${y} ${x + w} ${y + h * 0.42} L${x + w} 460" stroke="#2a2a30" stroke-width="${30 * s}" fill="none" opacity="${t}"/>
      <path d="M${x} 460 L${x} ${y + h * 0.42} Q${x} ${y} 400 ${y} Q${x + w} ${y} ${x + w} ${y + h * 0.42} L${x + w} 460" stroke="url(#so-pierre)" stroke-width="${30 * s}" fill="none" opacity="${t}"/>`;
  }).join('');
  const gouttes = Array.from({ length: 8 }, (_, i) =>
    `<g class="goutte" style="--d:${(1.6 + (i % 3) * 0.7).toFixed(1)}s;--r:${(-i * 0.4).toFixed(1)}s;--h:300px"><line x1="${240 + i * 46}" y1="${70 + (i % 3) * 20}" x2="${240 + i * 46}" y2="${78 + (i % 3) * 20}" stroke="#9fb4cc" stroke-width="1.600" opacity="0.6"/></g>`).join('');

  return {
    svg: SVG(`
      <defs>
        ${halo('so-torche', '#ffa040', 0.55)}
        ${halo('so-fond', '#3a4a6a', 0.35)}
        ${PATTERN_PIERRE('so-pierre', 'rgba(0,0,0,0.45)')}
      </defs>
      <rect width="800" height="450" fill="#07070a"/>
      <circle cx="400" cy="250" r="160" fill="url(#so-fond)"/>
      ${arches}
      <!-- au fond : la porte aux runes -->
      <path d="M362 330 L362 262 Q400 236 438 262 L438 330 Z" fill="#1a120c"/>
      <path d="M368 330 L368 266 Q400 244 432 266 L432 330 Z" fill="#2a1c12"/>
      <path d="M384 276 l0 14 l6 -7 M396 272 l0 18 M380 300 l10 0 l-5 10 M406 296 l0 14 l-6 -4 M414 280 l8 0 l-4 10" stroke="#a8402a" stroke-width="2.200" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- l'eau au sol -->
      <path d="M0 420 Q400 380 800 420 L800 460 L0 460 Z" fill="#0c1018"/>
      <path d="M120 430 Q400 392 680 430" stroke="#3a4a6a" stroke-width="2" fill="none" opacity="0.6"/>
      <ellipse class="anim-lueur" cx="400" cy="420" rx="120" ry="6" fill="#ffb04a" opacity="0.18"/>
      ${gouttes}
      <!-- torches portées -->
      <circle class="anim-vacille" cx="200" cy="230" r="170" fill="url(#so-torche)"/>
      <circle class="anim-vacille" cx="620" cy="220" r="150" fill="url(#so-torche)"/>
      <path d="M120 120 l6 0 l0 40 l-6 0 Z M672 110 l6 0 l0 40 l-6 0 Z" fill="${BOIS_F}"/>
      ${feu(123, 120, 0.3)}${feu(675, 110, 0.3)}
      ${herse ? `
        <!-- la herse, à moitié levée -->
        <g opacity="0.95">
          ${Array.from({ length: 11 }, (_, i) => `<rect x="${60 + i * 68}" y="0" width="7" height="230" fill="#3a3f46"/><path d="M${60 + i * 68} 230 l3.500 12 l3.500 -12 Z" fill="#3a3f46"/>`).join('')}
          ${[40, 110, 180].map((y) => `<rect x="40" y="${y}" width="720" height="7" fill="#3a3f46"/>`).join('')}
          <path d="M40 0 L760 0" stroke="#5a6068" stroke-width="3"/>
        </g>
        <path d="M30 0 L30 300 M770 0 L770 300" stroke="#b9a37a" stroke-width="3"/>` : ''}
      <!--persos-->
      ${vignette('so-vig', 0.85)}`),
    joueur: JOUEUR,
    places: PLACES,
  };
}

// ------------------------------------------------------------- La cour en feu
export function courFeu(etat) {
  const scene = etat?.scene ?? '';
  const aube = scene === 'c4_fin_corbeaux';
  const poutre = scene === 'c4_cour' && !aube;
  const francs = scene === 'c4_arriere_garde';

  const galerie = (x, w, brule) => `
    <rect x="${x}" y="200" width="${w}" height="12" fill="${BOIS}"/>
    ${Array.from({ length: Math.floor(w / 40) + 1 }, (_, i) => `<rect x="${x + i * 40}" y="200" width="7" height="160" fill="${BOIS}"/>`).join('')}
    <path d="M${x - 10} 200 L${x + w + 10} 200 L${x + w} 170 L${x} 170 Z" fill="${aube ? '#2a2420' : '#5a3a24'}"/>
    ${brule && !aube ? `${Array.from({ length: Math.floor(w / 60) }, (_, i) => feu(x + 30 + i * 60, 190, 0.7 + (i % 2) * 0.3)).join('')}` : ''}`;

  const francsSilh = francs ? [560, 620, 680, 740].map((x, i) => `<g transform="translate(${x} ${300 - (i % 2) * 6}) scale(0.9)" fill="#140c08">
      <path d="M-12 60 L-10 0 L10 0 L12 60 Z"/><circle cx="0" cy="-8" r="9"/><path d="M-9 -10 L0 -22 L9 -10 Z"/>
      <circle cx="-14" cy="22" r="12"/><path d="M12 -20 L18 50" stroke="#140c08" stroke-width="3"/></g>`).join('') : '';

  return {
    svg: SVG(`
      <defs>
        ${degrade('cf-ciel', aube ? [[0, '#4a5060'], [0.7, '#9aa0a8'], [1, '#c9b8a0']] : [[0, '#1a0c08'], [0.5, '#5a2014'], [1, '#c2541e']])}
        ${halo('cf-brasier', '#ff7a2c', 0.6)}
        ${PATTERN_PIERRE('cf-pierre', aube ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.4)')}
      </defs>
      <rect width="800" height="450" fill="url(#cf-ciel)"/>
      ${aube ? '' : `${colonne(300, 160, 1.4, '#1a1210')}${colonne(560, 150, 1.6, '#1a1210')}`}
      <!-- le donjon -->
      <rect x="300" y="30" width="200" height="330" fill="${aube ? '#6a6a70' : '#3a2a28'}"/>
      <rect x="300" y="30" width="200" height="330" fill="url(#cf-pierre)"/>
      <rect x="400" y="30" width="100" height="330" fill="#000" opacity="0.2"/>
      ${creneaux(300, 500, 30, aube ? '#6a6a70' : '#3a2a28', 25, 14, 14)}
      ${[90, 150, 210].map((y) => `<path d="M392 ${y + 30} L392 ${y} Q400 ${y - 8} 408 ${y} L408 ${y + 30} Z" fill="${aube ? '#2a2a2e' : '#ffb04a'}"/>`).join('')}
      <!-- la porte de la cour, à droite -->
      <path d="M690 360 L690 250 Q740 214 790 250 L790 360 Z" fill="#0c0806"/>
      ${francsSilh}
      <!-- les galeries de bois -->
      ${galerie(-10, 300, true)}${galerie(520, 160, true)}
      ${aube ? '' : `<rect width="800" height="450" fill="url(#cf-brasier)" class="anim-lueur" opacity="0.7"/>`}
      <!-- le sol de la cour -->
      <path d="M0 360 L800 360 L800 460 L0 460 Z" fill="${aube ? '#4a4640' : '#2a1a12'}"/>
      ${Array.from({ length: 30 }, (_, i) => `<ellipse cx="${(i * 97) % 800}" cy="${372 + ((i * 41) % 80)}" rx="${4 + (i % 3) * 2}" ry="2" fill="${aube ? '#2a2826' : '#1a0e08'}" opacity="0.8"/>`).join('')}
      <!-- le puits et une charrette -->
      <rect x="80" y="330" width="60" height="34" rx="4" fill="${aube ? '#5a5650' : '#3a2e28'}"/><ellipse cx="110" cy="330" rx="30" ry="7" fill="${aube ? '#6a6660' : '#4a3e36'}"/>
      ${caisse(220, 368, 1.0)}
      ${poutre ? `
        <!-- la poutre qui tombe, le coffre du comte -->
        <g transform="rotate(-22 420 300)"><rect x="300" y="290" width="260" height="22" fill="${BOIS}"/>${feu(380, 292, 0.5)}${feu(480, 292, 0.6)}</g>
        <g transform="translate(600 372)">
          <rect x="-34" y="-36" width="68" height="36" fill="#5a3b24"/><path d="M-34 -36 Q0 -54 34 -36 Z" fill="#6b4a2e"/>
          <path d="M-34 -24 L34 -24 M-20 -36 L-20 0 M20 -36 L20 0" stroke="#d6a640" stroke-width="3"/>
          <rect x="-6" y="-30" width="12" height="10" fill="#d6a640"/>
          <circle cx="-12" cy="-44" r="2" fill="#ffd27a"/><circle cx="10" cy="-47" r="2" fill="#ffd27a"/>
        </g>` : ''}
      ${aube ? `
        <g transform="rotate(-8 400 360)"><rect x="300" y="350" width="260" height="20" fill="#2a2420"/></g>
        <g fill="#5a5450" opacity="0.5"><circle class="anim-fumee" cx="200" cy="200" r="14"/><circle class="anim-fumee anim-fumee--2" cx="600" cy="190" r="12"/></g>
        ${corbeau(360, 344, 1.6)}${corbeau(420, 340, 1.5, 'anim-oiseau anim-oiseau--2')}${corbeau(480, 336, 1.6, 'anim-oiseau anim-oiseau--3')}` : braises(400, 300, 22, 760)}
      <!--persos-->
      ${aube ? '' : braises(400, 220, 12, 760)}
      ${vignette('cf-vig', aube ? 0.45 : 0.7)}`),
    joueur: JOUEUR,
    places: PLACES,
  };
}
