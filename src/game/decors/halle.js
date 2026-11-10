// La grande halle du jarl, vue dans l'axe : charpente fuyante, piliers sculptés, torches,
// tenture au drakkar derrière le siège haut, long foyer central, foule sur les bancs.
import { SVG, halo, vignette, feu, braises, proue } from './elements.js';

export function halle() {
  // Fermes de charpente, de la plus proche à la plus lointaine
  const fermes = [0, 0.35, 0.65, 0.88].map((t) => {
    const xl = 250 * t;
    const y = 70 * t;
    const ep = 16 - t * 10;
    return `<path d="M${xl} ${y + 4} L400 ${y - 74 + t * 60} L${800 - xl} ${y + 4}" stroke="#2c1c10" stroke-width="${ep}" fill="none"/>
      <path d="M${xl} ${y + 4 - ep / 2} L400 ${y - 74 + t * 60 - ep / 2} L${800 - xl} ${y + 4 - ep / 2}" stroke="rgba(255,170,90,0.12)" stroke-width="1.5" fill="none"/>`;
  }).join('');

  const pilier = (x, y1, y2, w, sens) => `
    <rect x="${x - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" fill="#3a2515"/>
    <rect x="${sens > 0 ? x : x - w / 2}" y="${y1}" width="${w / 2}" height="${y2 - y1}" fill="rgba(255,150,70,0.16)"/>
    <rect x="${sens > 0 ? x - w / 2 : x}" y="${y1}" width="${w / 2}" height="${y2 - y1}" fill="rgba(0,0,0,0.3)"/>
    <path d="M${x - w * 0.75} ${y1} L${x + w * 0.75} ${y1} L${x + w / 2} ${y1 + w * 0.6} L${x - w / 2} ${y1 + w * 0.6} Z" fill="#2c1c10"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const y = y1 + w * 1.2 + i * w * 1.1;
      return y + w < y2 ? `<path d="M${x} ${y - w * 0.5} L${x + w * 0.3} ${y} L${x} ${y + w * 0.5} L${x - w * 0.3} ${y} Z M${x - w * 0.3} ${y - w * 0.5} L${x + w * 0.3} ${y + w * 0.5} M${x + w * 0.3} ${y - w * 0.5} L${x - w * 0.3} ${y + w * 0.5}" fill="none" stroke="#6b4a2a" stroke-width="${Math.max(1, w * 0.06)}" stroke-linejoin="round"/>` : '';
    }).join('')}`;

  const torche = (x, y, d) => `
    <path d="M${x} ${y} l${14 * d} -10" stroke="#1a110a" stroke-width="4" stroke-linecap="round"/>
    <rect x="${x + 14 * d - 4}" y="${y - 22}" width="8" height="14" fill="#2a1c12"/>
    <circle cx="${x + 14 * d}" cy="${y - 30}" r="46" fill="url(#g-torche)" class="anim-lueur"/>
    ${feu(x + 14 * d, y - 20, 0.34)}`;

  // Convives : silhouettes éclairées par le feu, côté intérieur
  const convive = (x, y, s, sens, variante) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-22 60 Q-24 22 -10 16 L10 16 Q24 22 22 60 Z" fill="#120a06"/>
      <circle cx="0" cy="4" r="12" fill="#150c07"/>
      ${variante === 1 ? '<path d="M-12 2 Q-13 -12 0 -12 Q13 -12 12 2 Z" fill="#2a2420"/>' : ''}
      ${variante === 2 ? '<path d="M-12 4 Q-16 22 -12 34 L-7 34 Q-10 20 -8 6 Z M12 4 Q16 22 12 34 L7 34 Q10 20 8 6 Z" fill="#150c07"/>' : ''}
      <path d="M${sens * 9} -6 Q${sens * 14} 4 ${sens * 10} 14 M${sens * 14} 20 Q${sens * 22} 30 ${sens * 21} 56" stroke="#e0762a" stroke-width="2.2" fill="none" opacity="0.6" stroke-linecap="round"/>
    </g>`;
  const rangGauche = [[258, 262, 0.5], [236, 270, 0.62], [208, 280, 0.78], [172, 292, 0.98], [128, 304, 1.2]]
    .map(([x, y, s], i) => convive(x, y, s, 1, i % 3)).join('');
  const rangDroit = [[542, 262, 0.5], [564, 270, 0.62], [592, 280, 0.78], [628, 292, 0.98], [672, 304, 1.2]]
    .map(([x, y, s], i) => convive(x, y, s, -1, (i + 1) % 3)).join('');

  const banniere = (x) => `
    <path d="M${x - 17} 34 L${x + 17} 34 L${x + 17} 118 L${x} 104 L${x - 17} 118 Z" fill="#7a2218"/>
    <path d="M${x} 34 L${x + 17} 34 L${x + 17} 118 L${x} 104 Z" fill="rgba(0,0,0,0.25)"/>
    <path d="M${x - 17} 40 L${x + 17} 40" stroke="#d6a640" stroke-width="2.5"/>
    <path d="M${x - 9} 76 Q${x} 56 ${x + 9} 76 Q${x} 70 ${x - 9} 76 Z M${x} 66 l5 -7 l-3 9" fill="#d6a640"/>`;

  return {
    svg: SVG(`
      <defs>
        ${halo('g-feu', '#ff8a2c', 0.62)}
        ${halo('g-torche', '#ffb04a', 0.5)}
      </defs>
      <rect width="800" height="450" fill="#0b0604"/>

      <!-- mur du fond -->
      <rect x="250" y="66" width="300" height="240" fill="#2a1a0e"/>
      ${Array.from({ length: 14 }, (_, i) => `<path d="M${262 + i * 22} 66 L${262 + i * 22} 306" stroke="rgba(0,0,0,0.3)"/>`).join('')}
      <path d="M250 66 L400 8 L550 66 Z" fill="#20140a"/>
      <path d="M400 8 L400 66" stroke="#2c1c10" stroke-width="8"/>

      <!-- murs latéraux et plafond -->
      <path d="M0 0 L250 66 L250 306 L0 430 Z" fill="#1c1109"/>
      <path d="M800 0 L550 66 L550 306 L800 430 Z" fill="#1c1109"/>
      ${[0.2, 0.4, 0.6, 0.8].map((t) => `<path d="M0 ${430 * t} L250 ${66 + 240 * t} M800 ${430 * t} L550 ${66 + 240 * t}" stroke="rgba(0,0,0,0.35)"/>`).join('')}
      <path d="M0 0 L800 0 L550 66 L400 8 L250 66 Z" fill="#0d0704"/>
      ${fermes}
      <path d="M368 0 L432 0 L470 300 L330 300 Z" fill="#ffe2b0" opacity="0.045"/>

      <!-- tenture au drakkar -->
      <rect x="302" y="84" width="196" height="118" fill="#d6a640"/>
      <rect x="307" y="89" width="186" height="108" fill="#7a2218"/>
      <rect x="400" y="89" width="93" height="108" fill="rgba(0,0,0,0.2)"/>
      <path d="M340 160 Q400 186 460 160 L454 168 Q400 194 346 168 Z" fill="#d6a640"/>
      <path d="M340 160 Q330 146 338 136 M460 160 Q470 146 462 136" stroke="#d6a640" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M400 110 L400 168 M372 116 L428 116 L424 150 L376 150 Z" stroke="#d6a640" stroke-width="3" fill="none"/>
      <path d="M318 182 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#e9dfc8" stroke-width="1.6" fill="none" opacity="0.7"/>
      <path d="M312 98 h176 M312 190 h176" stroke="#d6a640" stroke-width="1.5" stroke-dasharray="4 4"/>
      ${Array.from({ length: 20 }, (_, i) => `<path d="M${306 + i * 10} 202 l0 7" stroke="#d6a640" stroke-width="2"/>`).join('')}
      ${[274, 526].map((x, i) => `<circle cx="${x}" cy="150" r="19" fill="#1a110a"/><circle cx="${x}" cy="150" r="17" fill="${i ? '#1f3a5f' : '#3e7a5a'}"/><path d="M${x} 133 L${x} 167 M${x - 17} 150 L${x + 17} 150" stroke="#e9dfc8" stroke-width="4"/><circle cx="${x}" cy="150" r="4.500" fill="#8e949a"/>`).join('')}

      <!-- estrade et siège haut -->
      <rect x="284" y="312" width="232" height="12" fill="#22150b"/>
      <rect x="300" y="298" width="200" height="15" fill="#3a2515"/><rect x="300" y="298" width="200" height="3" fill="rgba(255,170,90,0.2)"/>
      <rect x="364" y="176" width="72" height="124" fill="#3d2a1a"/>
      <path d="M364 176 Q400 150 436 176 Z" fill="#3d2a1a"/>
      <path d="M376 190 Q400 172 424 190 L424 250 L376 250 Z" fill="#2a1c12"/>
      <path d="M384 204 q16 -12 32 0 q-16 12 -32 0 Z M384 226 q16 -12 32 0 q-16 12 -32 0 Z" fill="none" stroke="#6b4a2a" stroke-width="2"/>
      <rect x="356" y="166" width="11" height="136" fill="#2c1c10"/><rect x="433" y="166" width="11" height="136" fill="#2c1c10"/>
      ${proue(360, 170, 0.2, '#2c1c10')}${proue(440, 170, 0.2, '#2c1c10', true)}
      <rect x="350" y="258" width="100" height="10" fill="#4a3220"/>
      <path d="M352 196 Q346 230 356 262 L372 262 Q366 228 372 198 Z" fill="#8c7a5a"/>

      <!-- piliers du fond, bannières, convives -->
      ${pilier(292, 70, 304, 16, 1)}${pilier(508, 70, 304, 16, -1)}
      ${banniere(150)}${banniere(650)}
      ${rangGauche}${rangDroit}
      <path d="M118 336 L262 286 L276 290 L150 348 Z" fill="#4a3020"/><path d="M118 336 L262 286 L263 289 L120 340 Z" fill="rgba(255,170,90,0.25)"/>
      <path d="M682 336 L538 286 L524 290 L650 348 Z" fill="#4a3020"/><path d="M682 336 L538 286 L537 289 L680 340 Z" fill="rgba(255,170,90,0.25)"/>
      ${[[150, 330], [186, 317], [220, 305], [246, 296], [650, 330], [614, 317], [580, 305], [554, 296]].map(([x, y], i) => `<path d="M${x - 3} ${y} l1 -9 l5 0 l1 9 Z" fill="${i % 2 ? '#d6a640' : '#c9bfa8'}"/>`).join('')}
      ${pilier(206, 26, 352, 28, 1)}${pilier(594, 26, 352, 28, -1)}
      ${torche(220, 170, 1)}${torche(580, 170, -1)}

      <!-- sol -->
      <path d="M0 430 L250 306 L550 306 L800 430 L800 460 L0 460 Z" fill="#24160c"/>
      ${[-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9].map((k) => `<path d="M${400 + k * 150} 306 L${400 + k * 520} 460" stroke="rgba(0,0,0,0.3)"/>`).join('')}

      <!-- long foyer -->
      <ellipse cx="400" cy="336" rx="330" ry="150" fill="url(#g-feu)" class="anim-lueur"/>
      <path d="M338 324 L462 324 L484 352 L316 352 Z" fill="#0d0704"/>
      ${[330, 356, 382, 408, 434, 460].map((x, i) => `<ellipse cx="${x + (i % 2) * 6}" cy="324" rx="11" ry="4.500" fill="#5c544a"/>`).join('')}
      ${[322, 352, 384, 416, 448, 478].map((x) => `<ellipse cx="${x}" cy="352" rx="13" ry="5.500" fill="#4a433b"/>`).join('')}
      <path d="M346 344 L400 336 M404 346 L458 338" stroke="#3a2515" stroke-width="7" stroke-linecap="round"/>
      ${feu(366, 346, 0.5)}${feu(402, 344, 0.62)}${feu(438, 346, 0.5)}
      ${braises(400, 300, 9, 110)}

      <!-- piliers proches -->
      ${pilier(60, -10, 460, 56, 1)}${pilier(740, -10, 460, 56, -1)}
      <ellipse class="anim-brume" cx="400" cy="46" rx="460" ry="46" fill="#6b5a4a" opacity="0.16"/>

      <!--persos-->
      <ellipse cx="400" cy="380" rx="460" ry="220" fill="url(#g-feu)" opacity="0.3" pointer-events="none"/>
      ${vignette('g-vig', 0.75)}`),
    joueur: { x: 606, y: 134, scale: 1.05 },
    places: [
      { x: 325, y: 92, scale: 0.75 }, // Hakon, devant le siège haut
      { x: 462, y: 146, scale: 0.97 }, // Eirik
      { x: 134, y: 146, scale: 0.97, miroir: true }, // Sigrid
      { x: -22, y: 150, scale: 0.95, miroir: true }, // Ulf
    ],
  };
}
