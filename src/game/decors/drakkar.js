// Les quatre décors du chapitre 2 vus depuis le pont : départ, pleine mer, tempête, brouillard.
import { pont, vagues } from './elements.js';

const SVG = (contenu) => `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">${contenu}</svg>`;

const PLACES_PONT = [
  { x: 120, y: 120, scale: 0.72, miroir: true },
  { x: 250, y: 125, scale: 0.7, miroir: true },
  { x: 470, y: 125, scale: 0.7 },
  { x: 620, y: 122, scale: 0.7 },
];
const JOUEUR_PONT = { x: 330, y: 110, scale: 0.78 };

export function depart() {
  const { fond, devant } = pont({ roulis: 'anim-roulis' });
  return {
    svg: SVG(`
      <defs><linearGradient id="d-ciel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6d7f94"/><stop offset="1" stop-color="#e3c9a4"/></linearGradient></defs>
      <rect width="800" height="450" fill="url(#d-ciel)"/>
      <circle cx="400" cy="230" r="46" fill="#f4e0b4" opacity="0.9"/>
      <!-- falaises du fjord -->
      <path d="M0 0 L0 320 L140 320 L180 220 L210 260 L260 120 L300 200 L320 320 L0 320 Z" fill="#2f3a3f"/>
      <path d="M800 0 L800 320 L560 320 L600 180 L640 230 L690 90 L740 190 L800 160 Z" fill="#2f3a3f"/>
      <path d="M0 160 L60 90 L120 170 L170 110 L210 190 L0 190 Z" fill="#dfe6ec" opacity="0.7"/>
      <path d="M640 150 L690 90 L740 190 L640 190 Z" fill="#dfe6ec" opacity="0.7"/>
      <!-- village au loin -->
      <g fill="#1a1209"><rect x="60" y="300" width="24" height="18"/><rect x="92" y="296" width="30" height="22"/><rect x="130" y="302" width="20" height="16"/></g>
      <rect x="0" y="320" width="800" height="130" fill="#56718a"/>
      ${vagues(330, 'anim-vague', '#ffffff', 0.1)}
      ${vagues(348, 'anim-vague anim-vague--2', '#ffffff', 0.07)}
      ${fond}<!--persos-->${devant}`),
    joueur: JOUEUR_PONT,
    places: PLACES_PONT,
  };
}

export function mer() {
  const { fond, devant } = pont({ roulis: 'anim-roulis' });
  return {
    svg: SVG(`
      <defs><linearGradient id="m-ciel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4b5f78"/><stop offset="1" stop-color="#9fb0c2"/></linearGradient></defs>
      <rect width="800" height="450" fill="url(#m-ciel)"/>
      <g fill="#ffffff" opacity="0.5"><ellipse cx="150" cy="90" rx="90" ry="22"/><ellipse cx="210" cy="80" rx="60" ry="18"/><ellipse cx="620" cy="130" rx="110" ry="20"/></g>
      <rect x="0" y="280" width="800" height="170" fill="#2f4a66"/>
      ${vagues(290, 'anim-vague', '#ffffff', 0.12)}
      ${vagues(312, 'anim-vague anim-vague--2', '#ffffff', 0.08)}
      ${vagues(340, 'anim-vague', '#0e1a2a', 0.25)}
      <g fill="#0b0907"><path class="anim-oiseau" d="M520 150 q6 -6 12 0 q-2 6 -6 8 q-4 -2 -6 -8 Z"/><path class="anim-oiseau anim-oiseau--2" d="M548 140 q6 -6 12 0 q-2 6 -6 8 q-4 -2 -6 -8 Z"/></g>
      ${fond}<!--persos-->${devant}`),
    joueur: JOUEUR_PONT,
    places: PLACES_PONT,
  };
}

export function tempete() {
  const { fond, devant } = pont({ nuit: true, voile: 'dechiree', roulis: 'anim-roulis--fort' });
  const pluie = Array.from({ length: 110 }, (_, i) => {
    const x = (i * 53) % 820;
    const y = ((i * 97) % 520) - 60;
    return `<line x1="${x}" y1="${y}" x2="${x - 6}" y2="${y + 22}" stroke="#c9d6e4" stroke-width="1.2" opacity="0.45"/>`;
  }).join('');
  return {
    svg: SVG(`
      <rect width="800" height="450" fill="#070a12"/>
      <rect class="anim-eclair" width="800" height="450" fill="#dfe6ff" opacity="0"/>
      <path class="anim-eclair anim-eclair--2" d="M560 0 L530 110 L560 105 L510 230 L570 120 L540 125 L590 0 Z" fill="#fff6d6"/>
      <rect x="0" y="240" width="800" height="210" fill="#0d1726"/>
      ${vagues(250, 'anim-vague', '#ffffff', 0.18)}
      ${vagues(275, 'anim-vague anim-vague--2', '#ffffff', 0.12)}
      ${vagues(300, 'anim-vague', '#000000', 0.35)}
      ${fond}<!--persos-->${devant}
      <g class="anim-pluie">${pluie}</g>`),
    joueur: { ...JOUEUR_PONT, y: 118 },
    places: PLACES_PONT,
  };
}

export function brouillard() {
  const { fond, devant } = pont({ voile: 'pliee', roulis: 'anim-roulis' });
  return {
    svg: SVG(`
      <rect width="800" height="450" fill="#8c98a4"/>
      <rect x="0" y="300" width="800" height="150" fill="#5f6f7e"/>
      ${vagues(308, 'anim-vague', '#ffffff', 0.08)}
      ${fond}
      <ellipse class="anim-brume" cx="400" cy="140" rx="520" ry="90" fill="#aeb8c2" opacity="0.5"/>
      <!--persos-->
      <ellipse class="anim-brume anim-brume--2" cx="300" cy="300" rx="480" ry="60" fill="#b9c2ca" opacity="0.45"/>
      ${devant}
      <ellipse class="anim-brume" cx="500" cy="420" rx="520" ry="50" fill="#b9c2ca" opacity="0.4"/>`),
    joueur: JOUEUR_PONT,
    places: PLACES_PONT,
  };
}

export function ilot() {
  const etoiles = Array.from({ length: 30 }, (_, i) =>
    `<circle class="anim-etoile ${i % 2 ? 'anim-etoile--2' : ''}" cx="${(i * 131) % 800}" cy="${(i * 71) % 180}" r="${1 + (i % 3) * 0.5}" fill="#f4efe6"/>`).join('');
  return {
    svg: SVG(`
      <defs><radialGradient id="i-lueur" cx="0.5" cy="0.95" r="0.55">
        <stop offset="0" stop-color="#ffb347" stop-opacity="0.5"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>
      <rect width="800" height="450" fill="#090c16"/>
      ${etoiles}
      <rect x="0" y="230" width="800" height="100" fill="#0f1a2a"/>
      ${vagues(240, 'anim-vague', '#ffffff', 0.08)}
      <!-- drakkar échoué au loin -->
      <g transform="translate(560 170) scale(0.5)" opacity="0.8">
        <rect x="118" y="-60" width="6" height="140" fill="#1e150e"/>
        <path d="M0 80 Q20 40 80 40 L180 40 Q240 40 260 80 Z" fill="#1e150e"/>
        <path d="M0 80 Q-20 50 -5 10 Q-2 30 10 42 Z" fill="#1e150e"/>
      </g>
      <!-- plage -->
      <path d="M0 330 Q200 300 400 318 Q600 336 800 310 L800 450 L0 450 Z" fill="#2a2420"/>
      <rect width="800" height="450" fill="url(#i-lueur)"/>
      <!--persos-->
      <!-- feu -->
      <ellipse cx="400" cy="418" rx="70" ry="12" fill="#0d0906"/>
      <g fill="#4a4038"><rect x="340" y="400" width="36" height="14" rx="6" transform="rotate(-8 358 407)"/><rect x="420" y="402" width="36" height="14" rx="6" transform="rotate(10 438 409)"/></g>
      <path class="anim-flamme" d="M372 410 Q366 368 392 350 Q390 380 404 384 Q414 364 406 346 Q436 374 428 410 Z" fill="#e8762a"/>
      <path class="anim-flamme anim-flamme--2" d="M384 410 Q380 380 398 366 Q398 384 408 386 Q414 376 410 366 Q426 384 420 410 Z" fill="#ffb347"/>
      <path class="anim-flamme anim-flamme--3" d="M394 410 Q394 392 402 382 Q406 394 412 396 Q416 406 412 410 Z" fill="#fff0c2"/>
      <g fill="#9b8f80" opacity="0.4"><circle class="anim-fumee" cx="400" cy="346" r="10"/><circle class="anim-fumee anim-fumee--2" cx="392" cy="350" r="8"/></g>`),
    joueur: { x: 470, y: 150, scale: 0.72 },
    places: [
      { x: 120, y: 160, scale: 0.7, miroir: true },
      { x: 240, y: 170, scale: 0.68, miroir: true },
      { x: 600, y: 165, scale: 0.68 },
      { x: 700, y: 175, scale: 0.66 },
    ],
  };
}
