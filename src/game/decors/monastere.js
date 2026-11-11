// Le monastère, une fin d'après-midi dorée. Décor large (1600) qui défile.
// De gauche à droite : la porte enfoncée, le cloître et son puits, le jardin des simples,
// la chapelle et son clocher, le scriptorium (avec la fresque), le dortoir et ses cellules.
import { degrade, halo, nuage, poussiere } from './elements.js';
import { arbre, peuplier } from './francie.js';

const L = 1600;
const PIERRE = '#dcc79e';
const PIERRE_O = '#bba67c';
const PIERRE_F = '#8f7c58';
const TUILE = '#a9472f';
const BOIS = '#5a3b24';
const BOIS_F = '#3a2516';

/** Toit à deux pans vu de face (pignon). */
function pignon(xg, xd, yBas, yHaut, couleur = TUILE) {
  const xm = (xg + xd) / 2;
  return `<path d="M${xg} ${yBas} L${xm} ${yHaut} L${xd} ${yBas} Z" fill="${couleur}"/>
    <path d="M${xg} ${yBas} L${xm} ${yHaut} L${xd} ${yBas} Z" fill="url(#m-tuile)"/>
    <path d="M${xm} ${yHaut} L${xd} ${yBas} L${xm} ${yBas} Z" fill="rgba(0,0,0,0.18)"/>
    <path d="M${xg} ${yBas} L${xm} ${yHaut} L${xd} ${yBas}" stroke="#6e2a1c" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
}

/** Toit long vu de face (versant), entre deux hauteurs. */
function versant(xg, xd, yBas, yHaut, debord = 10) {
  return `<path d="M${xg - debord} ${yBas} L${xd + debord} ${yBas} L${xd} ${yHaut} L${xg} ${yHaut} Z" fill="${TUILE}"/>
    <path d="M${xg - debord} ${yBas} L${xd + debord} ${yBas} L${xd} ${yHaut} L${xg} ${yHaut} Z" fill="url(#m-tuile)"/>
    <path d="M${xg - debord} ${yBas} L${xd + debord} ${yBas}" stroke="#6e2a1c" stroke-width="4"/>
    <path d="M${xg} ${yHaut} L${xd} ${yHaut}" stroke="#c9634a" stroke-width="2"/>`;
}

/** Mur de pierre appareillée. */
const mur = (x, y, w, h, teinte = PIERRE) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${teinte}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#m-pierre)"/>`;

/** Vitrail en lancette. */
function vitrail(x, y, w = 22, h = 56) {
  return `<path d="M${x} ${y + h} L${x} ${y + w / 2} Q${x + w / 2} ${y - w / 3} ${x + w} ${y + w / 2} L${x + w} ${y + h} Z" fill="#2a3a5a"/>
    <path d="M${x + 3} ${y + h - 3} L${x + 3} ${y + w / 2} Q${x + w / 2} ${y - w / 6} ${x + w - 3} ${y + w / 2} L${x + w - 3} ${y + h - 3} Z" fill="#3a6aa8"/>
    <rect x="${x + 3}" y="${y + h * 0.45}" width="${w - 6}" height="${h * 0.2}" fill="#c9423a"/>
    <rect x="${x + 3}" y="${y + h * 0.7}" width="${w - 6}" height="${h * 0.12}" fill="#e6b84a"/>
    <path d="M${x + w / 2} ${y + 2} L${x + w / 2} ${y + h} M${x} ${y + h * 0.45} L${x + w} ${y + h * 0.45}" stroke="#2a2018" stroke-width="1.500"/>
    <path d="M${x} ${y + h} L${x} ${y + w / 2} Q${x + w / 2} ${y - w / 3} ${x + w} ${y + w / 2} L${x + w} ${y + h} Z" fill="none" stroke="${PIERRE_F}" stroke-width="2.500"/>`;
}

export function monastere(etat) {
  const f = etat?.flags ?? {};
  const audeLibre = Boolean(f.aude_liberee);
  const carte = Boolean(f.carte_monastere);
  const massacre = Boolean(f.moines_tues);

  const arcades = Array.from({ length: 5 }, (_, i) => {
    const x = 352 + i * 58;
    return `<path d="M${x} 372 L${x} 304 Q${x + 24} 274 ${x + 48} 304 L${x + 48} 372 Z" fill="#5a4a36"/>
      <path d="M${x} 372 L${x} 304 Q${x + 24} 274 ${x + 48} 304 L${x + 48} 372 Z" fill="none" stroke="${PIERRE_F}" stroke-width="2"/>
      <path d="M${x + 6} 372 L${x + 6} 310 Q${x + 24} 290 ${x + 42} 310" stroke="rgba(255,220,150,0.12)" stroke-width="3" fill="none"/>
      <rect x="${x + 48}" y="300" width="10" height="72" fill="${PIERRE}"/><rect x="${x + 46}" y="296" width="14" height="6" fill="${PIERRE_O}"/><rect x="${x + 46}" y="366" width="14" height="6" fill="${PIERRE_O}"/>`;
  }).join('');

  const herbes = (x, y, n, c) => Array.from({ length: n }, (_, i) => {
    const cx = x + i * 14 + (i % 2) * 3;
    return `<path d="M${cx} ${y} q-5 -12 -8 -16 M${cx} ${y} q0 -14 1 -20 M${cx} ${y} q5 -10 9 -14" stroke="${c}" stroke-width="2.200" fill="none" stroke-linecap="round"/>`;
  }).join('');

  const porteCellule = (x, ouverte) => ouverte
    ? `<rect x="${x - 18}" y="310" width="36" height="62" fill="#1a120c"/><path d="M${x - 18} 310 L${x - 30} 316 L${x - 30} 378 L${x - 18} 372 Z" fill="${BOIS}"/>`
    : `<rect x="${x - 18}" y="310" width="36" height="62" fill="${BOIS}"/><path d="M${x - 6} 310 L${x - 6} 372 M${x + 6} 310 L${x + 6} 372" stroke="${BOIS_F}" stroke-width="1.500"/>`;

  return {
    largeur: L,
    svg: `<svg viewBox="0 0 ${L} 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${degrade('m-ciel', [[0, '#7fa4cc'], [0.6, '#cfdce2'], [1, '#f6e4bc']])}
        ${halo('m-soleil', '#fff1c8', 0.85)}
        ${halo('m-cierge', '#ffb04a', 0.7)}
        <pattern id="m-pierre" width="44" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 14 L44 14 M0 28 L44 28 M22 0 L22 14 M0 14 L0 28 M44 14 L44 28" stroke="rgba(90,70,40,0.32)" stroke-width="1.200" fill="none"/>
          <path d="M2 2 L20 2 M24 16 L42 16" stroke="rgba(255,240,210,0.25)" stroke-width="1"/>
        </pattern>
        <pattern id="m-tuile" width="16" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 9 Q4 3 8 9 Q12 3 16 9" stroke="rgba(60,20,10,0.45)" stroke-width="1.200" fill="none"/>
        </pattern>
      </defs>
      <rect width="${L}" height="450" fill="url(#m-ciel)"/>
      <circle cx="1280" cy="110" r="170" fill="url(#m-soleil)"/><circle cx="1280" cy="110" r="30" fill="#fff8e4"/>
      ${nuage(200, 80, 1.3, '#fff', 0.65)}${nuage(640, 56, 1, '#fff', 0.55)}${nuage(1060, 96, 1.2, '#fff', 0.55)}${nuage(1520, 60, 0.9, '#fff', 0.5)}

      <!-- campagne -->
      <path d="M0 250 Q200 202 420 230 Q640 258 860 214 Q1100 176 1340 224 Q1480 250 ${L} 220 L${L} 330 L0 330 Z" fill="#a9b98a"/>
      <path d="M120 236 L240 222 L260 232 L140 246 Z M700 236 L820 222 L840 230 L716 244 Z M1180 222 L1300 214 L1318 224 L1196 232 Z" fill="#d8c070" opacity="0.85"/>
      <path d="M0 270 Q300 246 600 266 Q900 286 1200 258 Q1420 244 ${L} 264 L${L} 330 L0 330 Z" fill="#8fa56e"/>
      ${[80, 96, 520, 536, 1440, 1456].map((x, i) => peuplier(x, 262 + (i % 2) * 3, 50 - (i % 2) * 10, '#5f7a45')).join('')}

      <!-- l'enceinte -->
      ${mur(0, 232, L, 140, PIERRE_O)}
      <rect x="0" y="226" width="${L}" height="9" fill="${TUILE}"/><rect x="0" y="226" width="${L}" height="9" fill="url(#m-tuile)"/>
      ${arbre(250, 236, 0.75)}${arbre(1560, 238, 0.7)}

      <!-- ===== la porte enfoncée ===== -->
      ${mur(26, 196, 40, 186)}${mur(190, 196, 40, 186)}
      <rect x="18" y="182" width="220" height="30" fill="${PIERRE}"/><rect x="18" y="182" width="220" height="30" fill="url(#m-pierre)"/>
      ${pignon(10, 246, 186, 150)}
      <rect x="66" y="212" width="124" height="168" fill="#e6d6ac"/>
      <path d="M66 330 Q128 316 190 330 L190 380 L66 380 Z" fill="#c9b68a"/>
      <path d="M90 380 Q118 340 128 318 L136 318 Q146 344 168 380 Z" fill="#b39c72"/>
      ${peuplier(160, 330, 60, '#7a9358')}
      <path d="M66 212 L58 228 L58 374 L66 380 Z" fill="${BOIS_F}"/>
      <g transform="rotate(-24 70 212)"><rect x="70" y="212" width="58" height="150" fill="${BOIS}"/>${[84, 98, 112].map((x) => `<path d="M${x} 212 L${x} 362" stroke="${BOIS_F}" stroke-width="2"/>`).join('')}<path d="M70 240 L128 240 M70 330 L128 330" stroke="#6f757b" stroke-width="5"/></g>
      <path d="M118 376 L196 360 L200 374 L122 390 Z" fill="${BOIS}"/><path d="M140 372 L148 386 M164 367 L172 382" stroke="${BOIS_F}" stroke-width="2"/>

      <!-- ===== le cloître ===== -->
      ${mur(340, 250, 316, 130)}
      ${arcades}
      ${versant(340, 656, 254, 212)}

      <!-- le puits -->
      <rect x="441" y="300" width="6" height="62" fill="${BOIS_F}"/><rect x="497" y="300" width="6" height="62" fill="${BOIS_F}"/>
      <path d="M430 304 L472 282 L514 304 Z" fill="${TUILE}"/><path d="M430 304 L472 282 L514 304 Z" fill="url(#m-tuile)"/>
      <path d="M447 316 L497 316" stroke="${BOIS_F}" stroke-width="5" stroke-linecap="round"/>
      <path d="M472 316 L472 342" stroke="#b9a37a" stroke-width="2"/><path d="M464 342 L480 342 L478 356 L466 356 Z" fill="${BOIS}"/>
      ${mur(436, 356, 72, 32, '#c9b68a')}
      <ellipse cx="472" cy="356" rx="36" ry="8" fill="#d8c8a2"/><ellipse cx="472" cy="356" rx="26" ry="5" fill="#2a2620"/>

      <!-- le jardin des simples -->
      ${[[548, 388], [596, 392], [548, 408], [596, 412]].map(([x, y]) => `<rect x="${x}" y="${y}" width="42" height="12" rx="2" fill="#6b4f33"/>`).join('')}
      ${herbes(552, 390, 3, '#6f9a4a')}${herbes(600, 394, 3, '#8aa858')}${herbes(552, 410, 3, '#7a9a3e')}${herbes(600, 414, 3, '#6f9a4a')}
      ${[[560, 384], [612, 388]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.500" fill="#b07ab0"/><circle cx="${x + 6}" cy="${y - 2}" r="2" fill="#e6c35c"/>`).join('')}
      <path d="M540 384 L644 384" stroke="${BOIS}" stroke-width="2.500"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${540 + i * 13} 384 l0 -14" stroke="${BOIS}" stroke-width="2.500"/>`).join('')}
      <path d="M540 376 Q592 372 644 376" stroke="#8a6a42" stroke-width="2" fill="none"/>

      <!-- ===== la chapelle ===== -->
      ${mur(670, 150, 270, 232)}
      <path d="M670 150 L805 64 L940 150 Z" fill="${PIERRE}"/><path d="M670 150 L805 64 L940 150 Z" fill="url(#m-pierre)"/>
      <path d="M656 158 L805 56 L954 158" stroke="${TUILE}" stroke-width="16" fill="none" stroke-linejoin="round"/>
      <path d="M656 158 L805 56 L954 158" stroke="#6e2a1c" stroke-width="3" fill="none" stroke-linejoin="round" transform="translate(0 6)"/>
      <path d="M805 22 L805 58 M793 34 L817 34" stroke="${PIERRE_F}" stroke-width="5" stroke-linecap="round"/>
      <!-- la rose -->
      <circle cx="805" cy="118" r="28" fill="${PIERRE_F}"/><circle cx="805" cy="118" r="24" fill="#2a3a5a"/>
      ${Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${(805 + Math.cos(a) * 14).toFixed(1)}" cy="${(118 + Math.sin(a) * 14).toFixed(1)}" r="6" fill="${['#c9423a', '#3a6aa8', '#e6b84a', '#4a8a5a'][i % 4]}"/>`; }).join('')}
      <circle cx="805" cy="118" r="6" fill="#e6b84a"/>
      ${vitrail(698, 196)}${vitrail(890, 196)}
      <!-- le portail ouvert -->
      <path d="M752 382 L752 288 Q805 230 858 288 L858 382 Z" fill="${PIERRE_O}"/>
      <path d="M758 382 L758 290 Q805 240 852 290 L852 382" stroke="${PIERRE_F}" stroke-width="2" fill="none"/>
      <path d="M766 382 L766 296 Q805 256 844 296 L844 382 Z" fill="#2a1e14"/>
      <!-- intérieur : l'autel et ses cierges -->
      <rect x="784" y="346" width="42" height="36" fill="#5a4a38"/><rect x="782" y="344" width="46" height="5" fill="#e9dfc8"/>
      <rect x="790" y="300" width="30" height="40" fill="#3a2e22"/><path d="M805 304 L805 334 M795 314 L815 314" stroke="#d6a640" stroke-width="2.500"/>
      ${[774, 836].map((x) => `<rect x="${x - 2}" y="${330}" width="4" height="16" fill="#e9dfc8"/><circle class="anim-vacille" cx="${x}" cy="326" r="18" fill="url(#m-cierge)"/><path d="M${x} 330 q-2 -4 0 -7 q2 3 0 7 Z" fill="#ffd27a"/>`).join('')}
      ${massacre ? '<path d="M772 380 Q790 372 812 378 Q830 384 846 378" stroke="#5a1a14" stroke-width="5" fill="none" opacity="0.7"/>' : '<g fill="#3a3028"><path d="M772 382 q6 -16 12 0 Z"/><path d="M830 382 q6 -16 12 0 Z"/></g>'}
      <path d="M766 296 L752 300 L752 382 L766 382 Z M844 296 L858 300 L858 382 L844 382 Z" fill="${BOIS}"/>
      <rect x="740" y="380" width="130" height="7" fill="${PIERRE_O}"/><rect x="730" y="386" width="150" height="7" fill="${PIERRE_F}"/>
      <!-- le clocher -->
      ${mur(942, 40, 46, 342)}
      <path d="M934 44 L965 -2 L996 44 Z" fill="${TUILE}"/><path d="M934 44 L965 -2 L996 44 Z" fill="url(#m-tuile)"/>
      <path d="M950 94 L950 66 Q965 52 980 66 L980 94 Z" fill="#2a1e14"/>
      <path d="M957 86 Q957 70 965 68 Q973 70 973 86 Z" fill="#c9963f"/><circle cx="965" cy="88" r="2.500" fill="#8a6a2a"/>
      <path d="M965 60 L965 68" stroke="#3a2a1a" stroke-width="1.500"/>

      <!-- ===== le scriptorium ===== -->
      ${mur(996, 196, 180, 186)}
      ${versant(996, 1176, 200, 156)}
      ${[1022, 1076, 1130].map((x) => `<path d="M${x} 252 L${x} 226 Q${x + 9} 214 ${x + 18} 226 L${x + 18} 252 Z" fill="#3a2e22"/><path d="M${x} 252 L${x} 226 Q${x + 9} 214 ${x + 18} 226 L${x + 18} 252 Z" fill="none" stroke="${PIERRE_F}" stroke-width="2"/>`).join('')}
      <!-- la fresque -->
      <rect x="1002" y="276" width="76" height="76" fill="#8a2c22"/>
      <rect x="1006" y="280" width="68" height="68" fill="#e2c48a"/>
      <path d="M1006 334 Q1040 326 1074 334 L1074 348 L1006 348 Z" fill="#5a7aa8"/>
      <path d="M1012 338 q6 -6 12 0 l-2 6 l-8 0 Z M1046 336 q6 -6 12 0 l-2 6 l-8 0 Z" fill="#3a2a1c"/>
      <path d="M1012 338 q-3 -6 0 -9 M1046 336 q-3 -6 0 -9" stroke="#3a2a1c" stroke-width="1.500" fill="none"/>
      <!-- le borgne et l'homme en rouge -->
      <path d="M1018 330 L1020 304 L1032 304 L1034 330 Z" fill="#6a7a8a"/><circle cx="1026" cy="298" r="6" fill="#d8b58f"/>
      <path d="M1020 296 L1032 300" stroke="#1a1410" stroke-width="2"/><path d="M1021 300 Q1026 312 1031 300" fill="#e4ded2"/>
      <path d="M1052 330 L1050 302 L1064 302 L1066 330 Z" fill="#a8302a"/><circle cx="1057" cy="296" r="6" fill="#d8b58f"/>
      <path d="M1051 292 l3 -5 l3 4 l3 -4 l3 5 Z" fill="#d6a640"/>
      <rect x="1034" y="308" width="16" height="6" rx="2" fill="#f4efe6"/><path d="M1034 311 L1050 311" stroke="#8a6a42" stroke-width="0.800"/>
      <path d="M1008 285 L1072 285" stroke="#8a2c22" stroke-width="1" stroke-dasharray="3 2"/>
      <!-- la fenêtre du scriptorium : pupitre, livre, chandelle -->
      <rect x="1104" y="282" width="58" height="62" fill="#2a2018"/>
      <rect x="1100" y="278" width="66" height="6" fill="${PIERRE_O}"/><rect x="1100" y="342" width="66" height="6" fill="${PIERRE_O}"/>
      <path d="M1112 340 L1120 314 L1150 314 L1156 340" stroke="${BOIS}" stroke-width="4" fill="none"/>
      <path d="M1118 314 L1152 314 L1148 306 L1122 306 Z" fill="${BOIS}"/>
      <path d="M1122 306 L1134 300 L1146 306 Z" fill="#f4efe6"/><path d="M1134 300 L1134 306" stroke="#b9ad94" stroke-width="1"/>
      ${carte ? '' : '<path d="M1140 312 l8 -2 l2 5 l-8 2 Z" fill="#e3d3a8"/>'}
      <circle class="anim-vacille" cx="1152" cy="300" r="16" fill="url(#m-cierge)"/><rect x="1150" y="300" width="4" height="10" fill="#e9dfc8"/><path d="M1152 300 q-2 -4 0 -6 q2 2 0 6 Z" fill="#ffd27a"/>
      <!-- parchemins piétinés -->
      ${[[1090, 404, -12], [1132, 412, 18], [1180, 398, -4], [980, 410, 10]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="16" height="11" fill="#e3d3a8" transform="rotate(${r} ${x} ${y})"/><path d="M${x + 3} ${y + 4} l10 0 M${x + 3} ${y + 7} l8 0" stroke="#8a6a42" stroke-width="0.800" transform="rotate(${r} ${x} ${y})"/>`).join('')}

      <!-- ===== le dortoir ===== -->
      ${mur(1182, 236, 418, 146)}
      ${versant(1182, L + 20, 240, 198, 0)}
      ${[1222, 1312, 1402, 1492].map((x) => `<rect x="${x - 7}" y="268" width="14" height="18" fill="#2a2018"/><rect x="${x - 9}" y="284" width="18" height="3" fill="${PIERRE_O}"/>`).join('')}
      ${porteCellule(1312, true)}${porteCellule(1402, true)}${porteCellule(1492, false)}
      <!-- la cellule fermée -->
      ${audeLibre
        ? porteCellule(1222, true)
        : `${porteCellule(1222, false)}<path d="M1200 336 L1244 330" stroke="${BOIS_F}" stroke-width="7" stroke-linecap="round"/>
           <rect x="1214" y="344" width="16" height="12" rx="2" fill="#5f6469"/><path d="M1218 344 q4 -8 8 0" stroke="#5f6469" stroke-width="2.500" fill="none"/>
           <rect x="1214" y="316" width="16" height="10" fill="#1a120c"/><path d="M1218 316 L1218 326 M1222 316 L1222 326 M1226 316 L1226 326" stroke="#5f6469" stroke-width="1.500"/>`}
      <!-- banc renversé -->
      <g transform="rotate(78 1560 380)"><rect x="1530" y="372" width="64" height="8" fill="${BOIS}"/><path d="M1538 380 l0 14 M1586 380 l0 14" stroke="${BOIS_F}" stroke-width="4"/></g>

      <!-- la cour -->
      <rect x="0" y="378" width="${L}" height="90" fill="#c4ac7e"/>
      <rect x="0" y="378" width="${L}" height="6" fill="#a8916a"/>
      <path d="M700 394 L910 394 L960 460 L650 460 Z" fill="#d6c294"/>
      ${Array.from({ length: 14 }, (_, i) => `<path d="M${690 + i * 18} 394 L${660 + i * 23} 460" stroke="rgba(90,70,40,0.25)" stroke-width="1.200"/>`).join('')}
      <path d="M680 418 L930 418 M666 440 L946 440" stroke="rgba(90,70,40,0.25)" stroke-width="1.200"/>
      ${Array.from({ length: 50 }, (_, i) => `<ellipse cx="${(i * 131 + 20) % L}" cy="${392 + ((i * 41) % 60)}" rx="${2 + (i % 3)}" ry="1.300" fill="#9a8460" opacity="0.6"/>`).join('')}
      <!-- chandelier renversé -->
      <path d="M890 404 L928 398" stroke="#d6a640" stroke-width="3" stroke-linecap="round"/><ellipse cx="890" cy="405" rx="6" ry="2.500" fill="#d6a640"/>
      <rect x="0" y="0" width="${L}" height="450" fill="#ffd08a" opacity="0.07" pointer-events="none"/>

      <!--persos-->
      ${poussiere({ n: 30, x0: 700, largeur: 520, y0: 160, hauteur: 220 })}${poussiere({ n: 16, x0: 340, largeur: 300, y0: 230, hauteur: 140 })}
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
