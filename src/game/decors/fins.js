// Décors des écrans de fin : le Valhalla, le marché aux esclaves de Rouen.
import { SVG, degrade, halo, vignette, nuage, corbeau, vagues } from './elements.js';
import { chaumiere } from './francie.js';

const PLACES = [
  { x: 300, y: 138, scale: 1.0 },
  { x: 130, y: 144, scale: 0.96, miroir: true },
  { x: -20, y: 148, scale: 0.94, miroir: true },
  { x: 446, y: 146, scale: 0.95 },
];

// ------------------------------------------------------------------ Le Valhalla
export function valhalla() {
  const arc = (r, couleur, ep) => `<path d="M-60 470 A${r} ${r * 0.62} 0 0 1 ${-60 + 2 * r} 470" stroke="${couleur}" stroke-width="${ep}" fill="none"/>`;
  return {
    svg: SVG(`
      <defs>
        ${degrade('va-ciel', [[0, '#3a4a8a'], [0.5, '#c98a5a'], [1, '#f8e2a8']])}
        ${halo('va-gloire', '#fff6d8', 0.9)}
      </defs>
      <rect width="800" height="450" fill="url(#va-ciel)"/>
      <circle cx="610" cy="150" r="240" fill="url(#va-gloire)"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M610 150 L${610 + Math.cos(-2.6 + i * 0.32) * 700} ${150 + Math.sin(-2.6 + i * 0.32) * 700}" stroke="#fff6d8" stroke-width="${18 - i}" opacity="0.08"/>`).join('')}
      ${nuage(140, 360, 2.2, '#fff4e0', 0.8)}${nuage(420, 400, 2.6, '#fff4e0', 0.85)}${nuage(720, 380, 2.2, '#fff4e0', 0.8)}
      <!-- Bifröst -->
      <g opacity="0.85">${arc(380, '#c9423a', 14)}${arc(366, '#e6863a', 14)}${arc(352, '#e6c35c', 14)}${arc(338, '#6aa85a', 14)}${arc(324, '#3a6aa8', 14)}${arc(310, '#6a4a9a', 14)}</g>
      <!-- la halle d'Odin, toit de boucliers -->
      <g transform="translate(610 220)">
        <rect x="-150" y="0" width="300" height="110" fill="#c9963f"/>
        <rect x="0" y="0" width="150" height="110" fill="rgba(0,0,0,0.15)"/>
        ${Array.from({ length: 8 }, (_, i) => `<rect x="${-140 + i * 38}" y="0" width="10" height="110" fill="#8a6a2a"/>`).join('')}
        <path d="M-180 4 L0 -110 L180 4 Z" fill="#d6a640"/>
        ${Array.from({ length: 5 }, (_, row) => Array.from({ length: 9 - row * 2 }, (_, i) => { const n = 9 - row * 2; const x = (i - (n - 1) / 2) * 34; const y = -14 - row * 22; return `<circle cx="${x}" cy="${y}" r="15" fill="${['#c9423a', '#e6c35c', '#3a6aa8', '#e9dfc8'][(i + row) % 4]}"/><circle cx="${x}" cy="${y}" r="4" fill="#8e949a"/>`; }).join('')).join('')}
        <path d="M-30 110 L-30 50 Q0 26 30 50 L30 110 Z" fill="#fff0c8"/>
        <path d="M-16 -110 l-14 -26 M16 -110 l14 -26" stroke="#d6a640" stroke-width="8" stroke-linecap="round"/>
      </g>
      ${corbeau(470, 120, 2)}${corbeau(520, 100, 1.8, 'anim-oiseau anim-oiseau--2')}
      <!--persos-->
      ${vignette('va-vig', 0.3)}`),
    joueur: { x: 560, y: 132, scale: 1.04 },
    places: PLACES,
  };
}

// --------------------------------------------- Le marché aux esclaves, Rouen
export function marche() {
  const maison = (x, w, h, c) => `<rect x="${x}" y="${330 - h}" width="${w}" height="${h}" fill="${c}"/>
    <path d="M${x} ${330 - h} L${x} 330 M${x + w} ${330 - h} L${x + w} 330 M${x} ${330 - h * 0.5} L${x + w} ${330 - h * 0.5} M${x} 330 L${x + w * 0.5} ${330 - h * 0.5} M${x + w} 330 L${x + w * 0.5} ${330 - h * 0.5}" stroke="#3a2516" stroke-width="3"/>
    <path d="M${x - 8} ${330 - h} L${x + w / 2} ${330 - h - w * 0.5} L${x + w + 8} ${330 - h} Z" fill="#6a5a4a"/>
    <rect x="${x + w * 0.35}" y="${330 - h * 0.85}" width="${w * 0.3}" height="${h * 0.22}" fill="#2a2018"/>`;
  return {
    svg: SVG(`
      <defs>${degrade('ma-ciel', [[0, '#7a8494'], [1, '#c9c2b4']])}</defs>
      <rect width="800" height="450" fill="url(#ma-ciel)"/>
      ${nuage(200, 70, 1.6, '#e6e2da', 0.7)}${nuage(600, 50, 1.3, '#e6e2da', 0.6)}
      <!-- la Seine et ses barques -->
      <rect x="0" y="250" width="800" height="40" fill="#6a7a84"/>
      ${vagues(256, 'anim-vague', '#ffffff', 0.1, 3, 290)}
      <path d="M60 262 Q110 276 160 260 L154 270 Q110 284 66 272 Z" fill="#3a2a1c"/><path d="M110 262 L110 220 L140 250 Z" fill="#c9bfa8"/>
      <!-- la cathédrale au loin -->
      <rect x="560" y="140" width="110" height="120" fill="#8a8476"/><path d="M560 140 L615 96 L670 140 Z" fill="#6a5a4a"/>
      <rect x="640" y="60" width="30" height="200" fill="#8a8476"/><path d="M636 60 L655 10 L674 60 Z" fill="#6a5a4a"/>
      <path d="M655 0 L655 14 M649 6 L661 6" stroke="#4a3a2a" stroke-width="3"/>
      <!-- les maisons -->
      ${maison(0, 110, 120, '#c9b48a')}${maison(120, 90, 100, '#b8a27a')}${maison(690, 110, 130, '#c9b48a')}
      ${chaumiere(240, 330, 120)}
      <!-- l'estrade, les chaînes -->
      <rect x="250" y="330" width="320" height="30" fill="#5a3b24"/>
      ${[270, 330, 390, 450, 510, 550].map((x) => `<rect x="${x}" y="330" width="8" height="40" fill="#3a2516"/>`).join('')}
      <rect x="250" y="326" width="320" height="6" fill="#6b4a2e"/>
      <path d="M300 300 Q340 316 380 300 Q420 316 460 300 Q500 316 540 300" stroke="#5f6469" stroke-width="3" fill="none" stroke-dasharray="5 3"/>
      <!-- l'étal du marchand frison -->
      <path d="M600 330 L600 250 M740 330 L740 250" stroke="#3a2516" stroke-width="5"/>
      <path d="M590 254 L750 254 L740 230 L600 230 Z" fill="#3a6aa8"/>
      ${[600, 620, 640, 660, 680, 700, 720].map((x, i) => `<path d="M${x} 254 l10 12 l10 -12 Z" fill="${i % 2 ? '#e9dfc8' : '#3a6aa8'}"/>`).join('')}
      <!-- la foule -->
      ${[40, 90, 150, 200, 640, 700, 760].map((x, i) => `<g transform="translate(${x} ${364 + (i % 2) * 6}) scale(${0.9 + (i % 3) * 0.08})" fill="#3a3430"><path d="M-14 70 Q-16 20 -6 14 L6 14 Q16 20 14 70 Z"/><circle cx="0" cy="2" r="11"/></g>`).join('')}
      <!-- le sol -->
      <path d="M0 360 L800 360 L800 460 L0 460 Z" fill="#7a6a52"/>
      ${Array.from({ length: 30 }, (_, i) => `<ellipse cx="${(i * 89) % 800}" cy="${372 + ((i * 41) % 80)}" rx="6" ry="2.500" fill="#5a4c3a" opacity="0.6"/>`).join('')}
      <!--persos-->
      ${vignette('ma-vig', 0.45)}`),
    joueur: { x: 300, y: 104, scale: 0.98 },
    places: [{ x: 600, y: 140, scale: 0.98 }, { x: 140, y: 146, scale: 0.94, miroir: true }],
  };
}
