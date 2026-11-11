// La scène de la page d'accueil : un fjord de nuit sous les aurores. Un drakkar rame vers le large,
// sa voile se gonfle, des corbeaux passent devant la lune ; au premier plan, une pierre runique.
// Les mouvements du bateau utilisent des animations SVG (SMIL) : le pivot de chaque rotation
// est donné explicitement, ce qui évite toute ambiguïté de transform-origin.
import { degrade, halo, etoiles, maison, sapins, neige } from './elements.js';

const L = 1600;
const H = 900;

/** Une bande d'aurore qui ondule entre deux formes. */
function aurore(id, y, couleurs, dur, decal) {
  const forme = (a) => `M-50 ${y} C 250 ${y - 60 * a} 500 ${y + 50 * a} 800 ${y - 20 * a} S 1300 ${y - 70 * a} 1650 ${y + 10 * a} L1650 ${y + 190} C 1300 ${y + 140} 1000 ${y + 230} 800 ${y + 170} S 300 ${y + 220} -50 ${y + 160} Z`;
  return `<path d="${forme(1)}" fill="url(#${id})" opacity="0.55">
    <animate attributeName="d" dur="${dur}s" begin="${decal}s" repeatCount="indefinite" values="${forme(1)};${forme(-0.6)};${forme(1)}" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
    <animate attributeName="opacity" dur="${dur * 0.7}s" begin="${decal}s" repeatCount="indefinite" values="0.35;0.7;0.35"/>
  </path>
  <defs>${degrade(id, couleurs.map(([o, c, a]) => [o, c, a]))}</defs>`;
}

/** Corbeau qui bat des ailes en traversant le ciel. */
function corbeauVol(chemin, dur, decal, s = 1) {
  return `<g>
    <animateMotion dur="${dur}s" begin="${decal}s" repeatCount="indefinite" path="${chemin}" rotate="0"/>
    <g transform="scale(${s})" fill="#05060a">
      <path d="M-4 0 Q0 -3 4 0 L2 3 L-2 3 Z"/>
      <path d="M-2 0 Q-14 -10 -26 -4 Q-14 -4 -2 2 Z">
        <animateTransform attributeName="transform" type="rotate" dur="0.5s" repeatCount="indefinite" values="0 0 0;-32 0 0;0 0 0"/>
      </path>
      <path d="M2 0 Q14 -10 26 -4 Q14 -4 2 2 Z">
        <animateTransform attributeName="transform" type="rotate" dur="0.5s" repeatCount="indefinite" values="0 0 0;32 0 0;0 0 0"/>
      </path>
      <path d="M4 -1 L9 0 L4 1 Z"/>
    </g>
  </g>`;
}

/** Le drakkar, vu de flanc, qui rame vers la gauche. Origine : milieu de la ligne de flottaison. */
function drakkar() {
  const rames = Array.from({ length: 9 }, (_, i) => {
    const x = -150 + i * 36;
    return `<g>
      <animateTransform attributeName="transform" type="rotate" dur="2.2s" begin="${(-i * 0.04).toFixed(2)}s" repeatCount="indefinite"
        values="-16 ${x} -14;18 ${x} -14;-16 ${x} -14" keyTimes="0;0.45;1" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
      <path d="M${x} -14 L${x - 12} 52" stroke="#2a1c12" stroke-width="4" stroke-linecap="round"/>
      <path d="M${x - 12} 52 l-5 16 l8 -1 Z" fill="#2a1c12"/>
    </g>`;
  }).join('');
  const boucliers = Array.from({ length: 10 }, (_, i) => {
    const x = -168 + i * 36;
    const c = ['#b8432b', '#d9a441', '#1f3a5f', '#e9dfc8'][i % 4];
    return `<circle cx="${x}" cy="-22" r="15" fill="#1a110a"/><circle cx="${x}" cy="-22" r="13" fill="${c}" opacity="0.85"/>
      <path d="M${x} -35 A13 13 0 0 1 ${x} -9 Z" fill="rgba(0,0,0,0.3)"/><circle cx="${x}" cy="-22" r="3" fill="#8e949a"/>`;
  }).join('');

  return `<g>
    <!-- le bateau tangue -->
    <animateTransform attributeName="transform" type="rotate" dur="6s" repeatCount="indefinite" values="-1.5 0 0;1.8 0 0;-1.5 0 0" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" additive="sum"/>
    <!-- sillage -->
    <path d="M200 6 Q330 18 470 8 Q330 30 200 16 Z" fill="#cfe0f0" opacity="0.25"/>
    <!-- le mât et la voile qui se gonfle -->
    <rect x="-6" y="-250" width="9" height="240" fill="#1e140c"/>
    <path d="M-110 -228 L110 -228" stroke="#1e140c" stroke-width="7" stroke-linecap="round"/>
    <path d="M0 -248 L-230 -24 M0 -248 L230 -20" stroke="#3a2e22" stroke-width="1.600"/>
    <g>
      <animateTransform attributeName="transform" type="scale" dur="4s" repeatCount="indefinite" values="1 1;1.06 1.02;1 1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" additive="sum"/>
      <path d="M-104 -226 L104 -226 Q122 -150 100 -70 Q0 -52 -100 -70 Q-122 -150 -104 -226 Z" fill="#e3d5b2"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${-104 + i * 52} -226 L${-78 + i * 52} -226 L${-74 + i * 52} -62 L${-100 + i * 52} -66 Z" fill="#a23c26"/>`).join('')}
      <path d="M0 -226 L104 -226 Q122 -150 100 -70 Q50 -60 0 -58 Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M-104 -226 L104 -226 Q122 -150 100 -70 Q0 -52 -100 -70 Q-122 -150 -104 -226 Z" fill="#081022" opacity="0.45"/>
    </g>
    ${rames}
    <!-- la coque -->
    <path d="M-230 -30 Q0 10 230 -34 L214 4 Q0 40 -214 8 Z" fill="#1e140c"/>
    <path d="M-230 -30 Q0 10 230 -34" stroke="#5a6a90" stroke-width="2.500" fill="none" opacity="0.7"/>
    ${boucliers}
    <!-- la proue au dragon, la poupe en volute -->
    <path d="M-230 -30 C-246 -80 -232 -128 -212 -150 C-206 -162 -218 -176 -236 -170 L-258 -160 L-244 -154 L-256 -142 L-236 -144 C-238 -120 -244 -80 -214 8 Z" fill="#1e140c"/>
    <circle cx="-232" cy="-162" r="3" fill="#e9c35c"/>
    <path d="M230 -34 C250 -80 242 -118 222 -126 C210 -130 202 -118 212 -110 C220 -104 228 -112 224 -118" stroke="#1e140c" stroke-width="9" fill="none" stroke-linecap="round"/>
    <!-- la lanterne de poupe -->
    <circle cx="196" cy="-56" r="40" fill="url(#ac-lanterne)">
      <animate attributeName="r" dur="1.3s" repeatCount="indefinite" values="36;44;38;42;36"/>
    </circle>
    <path d="M196 -40 L196 -70" stroke="#1e140c" stroke-width="3"/>
    <rect x="189" y="-70" width="14" height="18" rx="2" fill="#ffcf7a"/>
  </g>`;
}

/** La pierre runique du premier plan, avec son serpent et ses runes qui luisent. */
function pierreRunique(x, y) {
  return `<g transform="translate(${x} ${y})">
    <path d="M-80 0 Q-92 -170 -50 -250 Q0 -300 54 -250 Q96 -170 84 0 Z" fill="#3a4050"/>
    <path d="M10 -284 Q54 -270 66 -220 Q96 -150 84 0 L20 0 Q40 -150 10 -284 Z" fill="rgba(0,0,0,0.3)"/>
    <path d="M-56 -30 Q-74 -150 -36 -220 Q0 -260 40 -220 Q72 -150 58 -30" stroke="#8a2a20" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M-56 -30 Q-74 -150 -36 -220 Q0 -260 40 -220 Q72 -150 58 -30" stroke="#2a1410" stroke-width="2" fill="none" stroke-dasharray="6 5"/>
    <path d="M40 -220 l14 -10 l-4 14 Z" fill="#8a2a20"/><circle cx="46" cy="-222" r="2" fill="#ffd27a"/>
    <g stroke="#ff8a4a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <animate attributeName="opacity" dur="3.4s" repeatCount="indefinite" values="0.35;0.9;0.35"/>
      <path d="M-20 -180 l0 26 l10 -12 M2 -184 l0 30 M14 -184 l12 0 l-6 14 l6 14 M-24 -130 l12 -12 l12 12 l-12 12 Z M8 -134 l0 28 l12 -8 M-16 -86 l0 26 l12 -26 l0 26 M10 -88 l14 0 M17 -88 l0 28"/>
    </g>
    <circle cx="0" cy="-140" r="70" fill="url(#ac-runes)" opacity="0.6">
      <animate attributeName="opacity" dur="3.4s" repeatCount="indefinite" values="0.2;0.6;0.2"/>
    </circle>
    <path d="M-86 -60 Q-60 -82 -30 -70 Q-56 -60 -86 -50 Z M40 -258 Q60 -270 76 -250 Q60 -252 46 -248 Z" fill="#e8eef3" opacity="0.9"/>
  </g>`;
}

export function sceneAccueil() {
  const reflets = Array.from({ length: 14 }, (_, i) => `<rect x="${1180 - 70 + i * 5}" y="${574 + i * 12}" width="${140 - i * 10}" height="3" rx="1.500" fill="#dfe8ff" opacity="${0.55 - i * 0.035}">
      <animate attributeName="x" dur="${3 + (i % 3)}s" repeatCount="indefinite" values="${1180 - 70 + i * 5};${1180 - 62 + i * 5};${1180 - 70 + i * 5}"/></rect>`).join('');
  const vagues = Array.from({ length: 7 }, (_, i) => {
    const y = 600 + i * 42;
    let d = `M-60 ${y}`;
    for (let x = -40; x <= L + 80; x += 60) d += ` Q${x} ${y - 7} ${x + 30} ${y}`;
    return `<path d="${d}" stroke="#cfe0f0" stroke-width="1.500" fill="none" opacity="${0.18 - i * 0.015}" stroke-dasharray="40 30 10 50">
      <animateTransform attributeName="transform" type="translate" dur="${10 + i * 2}s" repeatCount="indefinite" values="0 0;-120 0"/></path>`;
  }).join('');

  return `<svg viewBox="0 0 ${L} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      ${degrade('ac-ciel', [[0, '#02030a'], [0.45, '#0a1630'], [0.8, '#163a52'], [1, '#2a5060']])}
      ${degrade('ac-mer', [[0, '#14304a'], [0.4, '#0a1a2c'], [1, '#03060c']])}
      ${halo('ac-lune', '#dfe8ff', 0.5)}
      ${halo('ac-lanterne', '#ffb04a', 0.65)}
      ${halo('ac-runes', '#ff7a3a', 0.6)}
      ${halo('ac-fenetre', '#ffb04a', 0.55)}
    </defs>
    <rect width="${L}" height="${H}" fill="url(#ac-ciel)"/>
    ${etoiles(120, 420)}<g transform="translate(800 0)">${etoiles(120, 420)}</g>
    <!-- les aurores -->
    ${aurore('ac-au1', 70, [[0, '#3affb0', 0], [0.4, '#3affb0', 0.7], [1, '#7a5cff', 0]], 14, 0)}
    ${aurore('ac-au2', 140, [[0, '#7affd0', 0], [0.5, '#4ad0a0', 0.5], [1, '#c060ff', 0]], 19, -6)}
    ${aurore('ac-au3', 30, [[0, '#a0ffe0', 0], [0.5, '#5affb0', 0.35], [1, '#5a6aff', 0]], 23, -11)}
    <!-- la lune -->
    <circle cx="1180" cy="210" r="190" fill="url(#ac-lune)"/>
    <circle cx="1180" cy="210" r="46" fill="#eef1f6"/>
    <circle cx="1160" cy="226" r="11" fill="#cfd6e2" opacity="0.55"/><circle cx="1202" cy="196" r="6" fill="#cfd6e2" opacity="0.5"/><circle cx="1186" cy="236" r="4" fill="#cfd6e2" opacity="0.45"/><circle cx="1150" cy="190" r="3" fill="#cfd6e2" opacity="0.4"/>
    ${corbeauVol('M-100 380 Q600 300 1800 360', 26, 0, 1.2)}${corbeauVol('M-100 120 Q700 60 1800 110', 30, -9, 1)}${corbeauVol('M-100 400 Q500 330 1800 380', 34, -20, 0.9)}

    <!-- montagnes du fjord -->
    <path d="M0 480 L120 330 L230 420 L360 250 L480 400 L580 320 L720 470 L860 360 L980 450 L1120 300 L1260 430 L1380 340 L1500 420 L1600 360 L1600 600 L0 600 Z" fill="#18243c"/>
    <path d="M360 250 L400 300 L376 294 L352 312 L330 290 Z M1120 300 L1160 350 L1136 342 L1112 360 L1094 340 Z M120 330 L148 368 L126 362 L106 376 Z M1380 340 L1404 372 L1386 366 L1370 378 Z" fill="#c9d6e8" opacity="0.75"/>
    <path d="M0 540 L160 430 L320 510 L500 420 L700 530 L900 450 L1080 540 L1280 470 L1460 540 L1600 490 L1600 620 L0 620 Z" fill="#0f1828"/>
    <rect x="0" y="500" width="${L}" height="80" fill="#3a6a7a" opacity="0.18"/>
    <!-- le village sur la rive -->
    <path d="M0 560 Q200 530 420 552 Q500 560 560 584 L0 590 Z" fill="#080c14"/>
    ${sapins(0, 520, 556, 46, '#060a10', 14)}
    ${maison(40, 576, 90, { nuit: true })}${maison(160, 570, 110, { nuit: true })}${maison(300, 580, 70, { nuit: true })}
    ${[[85, 556], [215, 548], [335, 562]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="url(#ac-fenetre)"><animate attributeName="opacity" dur="${2 + (x % 3)}s" repeatCount="indefinite" values="0.6;1;0.7;1;0.6"/></circle>`).join('')}

    <!-- la mer -->
    <rect x="0" y="580" width="${L}" height="${H - 580}" fill="url(#ac-mer)"/>
    ${reflets}
    ${vagues}
    <ellipse class="anim-brume" cx="500" cy="610" rx="700" ry="40" fill="#9ab0c4" opacity="0.2"/>
    <ellipse class="anim-brume anim-brume--2" cx="1200" cy="600" rx="600" ry="36" fill="#9ab0c4" opacity="0.16"/>
    <!-- le drakkar -->
    <g transform="translate(980 640)">${drakkar()}</g>

    <!-- premier plan : rochers, pins, pierre runique -->
    <path d="M0 900 L0 700 Q60 660 150 680 Q240 640 330 690 Q400 700 440 760 Q470 820 520 900 Z" fill="#0c1018"/>
    <path d="M0 700 Q60 660 150 680 Q240 640 330 690 Q300 690 240 674 Q160 690 90 676 Q40 690 0 712 Z" fill="#e8eef3" opacity="0.85"/>
    ${sapins(10, 140, 700, 150, '#05080c', 3)}
    ${pierreRunique(300, 880)}
    <path d="M1600 900 L1600 720 Q1520 690 1440 720 Q1380 740 1340 800 Q1310 850 1280 900 Z" fill="#0c1018"/>
    <path d="M1600 720 Q1520 690 1440 720 Q1470 716 1520 708 Q1570 712 1600 730 Z" fill="#e8eef3" opacity="0.85"/>
    ${sapins(1460, 1590, 724, 170, '#05080c', 3)}
    <!-- bouclier et hache plantés dans la neige -->
    <g transform="translate(1400 840) rotate(-8)">
      <path d="M40 -150 L52 40" stroke="#2a1c12" stroke-width="7" stroke-linecap="round"/>
      <path d="M36 -148 L64 -160 Q74 -132 66 -104 L40 -110 Z" fill="#8e949a"/>
      <circle cx="0" cy="-40" r="58" fill="#1a110a"/><circle cx="0" cy="-40" r="54" fill="#6a1e16"/>
      <path d="M0 -94 L0 14 M-54 -40 L54 -40" stroke="#d9a441" stroke-width="10"/>
      <path d="M0 -94 A54 54 0 0 1 0 14 Z" fill="rgba(0,0,0,0.3)"/><circle cx="0" cy="-40" r="12" fill="#8e949a"/>
    </g>

    ${neige({ n: 140, largeur: L, haut: H })}
  </svg>`;
}
