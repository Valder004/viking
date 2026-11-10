// La hutte familiale, à l'aube. Rondins, métier à tisser, chaudron sur le foyer,
// le bouclier fendu du père au mur, la neige par la fenêtre.
import { SVG, halo, vignette, feu, braises, sapins } from './elements.js';

export function hutte() {
  const rondins = Array.from({ length: 11 }, (_, i) => {
    const y = i * 30;
    return `<rect x="0" y="${y}" width="800" height="30" fill="${i % 2 ? '#4c3524' : '#553c29'}"/>
      <rect x="0" y="${y + 26}" width="800" height="4" fill="#2a1c12"/>
      <rect x="0" y="${y}" width="800" height="2" fill="rgba(255,220,170,0.07)"/>
      <ellipse cx="${(i * 173 + 60) % 760}" cy="${y + 14}" rx="9" ry="4" fill="#3a2718" opacity="0.7"/>
      <path d="M${(i * 311 + 200) % 650} ${y + 11} q40 -4 110 2 M${(i * 127 + 420) % 700} ${y + 19} q30 3 70 -1" stroke="rgba(0,0,0,0.2)" stroke-width="1" fill="none"/>`;
  }).join('');

  const flocons = Array.from({ length: 22 }, (_, i) =>
    `<circle class="anim-neige ${i % 2 ? 'anim-neige--2' : ''}" cx="${642 + ((i * 37) % 126)}" cy="${-300 + ((i * 53) % 300)}" r="${1.2 + (i % 3) * 0.6}" fill="#fff" opacity="0.85"/>`).join('');

  const poissons = [408, 430, 452].map((x, i) =>
    `<g transform="translate(${x} ${50 - i * 0.4})"><path d="M0 0 L0 10" stroke="#cbb994" stroke-width="1"/>
      <path d="M0 10 Q8 24 0 42 Q-8 24 0 10 Z" fill="#b39c72"/><path d="M0 10 Q8 24 0 42 Z" fill="rgba(0,0,0,0.2)"/>
      <path d="M0 42 l-6 9 l12 0 Z" fill="#b39c72"/><circle cx="-2" cy="17" r="1" fill="#2a1c12"/></g>`).join('');

  const herbes = [484, 512].map((x) =>
    `<g transform="translate(${x} 47)"><path d="M0 0 L0 8" stroke="#cbb994" stroke-width="1"/>
      <path d="M0 8 Q-12 22 -8 40 M0 8 Q-3 24 0 44 M0 8 Q10 22 8 40 M0 8 Q-6 22 -3 38 M0 8 Q5 22 4 42" stroke="#6f7d4a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <rect x="-3" y="6" width="6" height="4" fill="#8a5a3a"/></g>`).join('');

  const oignons = Array.from({ length: 5 }, (_, i) =>
    `<ellipse cx="${204 + (i % 2) * 7}" cy="${62 + i * 9}" rx="6" ry="5.5" fill="#c98a4a"/><ellipse cx="${206 + (i % 2) * 7}" cy="${62 + i * 9}" rx="3" ry="5.5" fill="rgba(0,0,0,0.2)"/>`).join('');

  const fils = Array.from({ length: 16 }, (_, i) =>
    `<line x1="${48 + i * 6}" y1="150" x2="${48 + i * 6}" y2="302" stroke="#d8cfb8" stroke-width="1" opacity="0.7"/>`).join('');
  const poids = Array.from({ length: 8 }, (_, i) =>
    `<ellipse cx="${51 + i * 12}" cy="308" rx="5" ry="6.5" fill="#8b8378"/><ellipse cx="${52.5 + i * 12}" cy="308" rx="2.5" ry="6.5" fill="rgba(0,0,0,0.3)"/><circle cx="${51 + i * 12}" cy="305" r="1.2" fill="#2a1c12"/>`).join('');

  const pierres = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2;
    const x = 380 + Math.cos(a) * 92;
    const y = 338 + Math.sin(a) * 20;
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="14" ry="8" fill="#5c544a"/><ellipse cx="${(x - 3).toFixed(1)}" cy="${(y - 2.5).toFixed(1)}" rx="8" ry="3" fill="rgba(255,200,140,0.22)"/>`;
  }).join('');

  return {
    svg: SVG(`
      <defs>
        ${halo('h-feu', '#ff9a3c', 0.6)}
        ${halo('h-froid', '#bcd4ee', 0.3)}
        <clipPath id="h-fen"><rect x="640" y="70" width="130" height="130"/></clipPath>
        <clipPath id="h-bou"><circle cx="392" cy="122" r="40"/></clipPath>
      </defs>

      <!-- mur de rondins -->
      ${rondins}
      <rect width="800" height="330" fill="#0c0705" opacity="0.5"/>

      <!-- charpente -->
      <path d="M-20 62 L400 -52 L820 62 L820 -60 L-20 -60 Z" fill="#150e09"/>
      <path d="M-10 60 L400 -48 L810 60" stroke="#2a1c12" stroke-width="16" fill="none"/>
      <path d="M-10 54 L400 -54 L810 54" stroke="rgba(255,200,140,0.08)" stroke-width="2" fill="none"/>
      <rect x="248" y="20" width="24" height="300" fill="#3a2718"/><rect x="262" y="20" width="10" height="300" fill="rgba(0,0,0,0.3)"/>
      <path d="M252 120 l8 -10 l8 10 l-8 10 Z M252 150 l8 -10 l8 10 l-8 10 Z" fill="#5a3f26"/>
      <rect x="538" y="26" width="24" height="294" fill="#3a2718"/><rect x="552" y="26" width="10" height="294" fill="rgba(0,0,0,0.3)"/>

      <!-- perche à provisions -->
      <path d="M392 48 L548 44" stroke="#2a1c12" stroke-width="5" stroke-linecap="round"/>
      ${poissons}${herbes}${oignons}

      <!-- fenêtre -->
      <rect x="630" y="60" width="150" height="150" fill="#2a1c12"/>
      <g clip-path="url(#h-fen)">
        <rect x="640" y="70" width="130" height="130" fill="#93a8be"/>
        <rect x="640" y="70" width="130" height="60" fill="#7d93ab"/>
        <path d="M640 150 L670 112 L694 138 L724 100 L770 146 L770 200 L640 200 Z" fill="#c9d6e2"/>
        <path d="M670 112 L680 124 L664 126 Z M724 100 L738 116 L714 118 Z" fill="#fff"/>
        ${sapins(648, 764, 176, 30, '#3d5150', 6)}
        <path d="M640 172 Q680 162 720 172 Q750 178 770 170 L770 200 L640 200 Z" fill="#f2f5f7"/>
        ${flocons}
      </g>
      <rect x="702" y="60" width="6" height="150" fill="#2a1c12"/><rect x="630" y="132" width="150" height="5" fill="#2a1c12"/>
      <path d="M642 70 l3 10 l3 -10 Z M660 70 l2.5 14 l2.5 -14 Z M690 70 l2 8 l2 -8 Z M730 70 l3 12 l3 -12 Z M752 70 l2 7 l2 -7 Z" fill="#e6f0f7" opacity="0.9"/>
      <rect x="624" y="208" width="162" height="9" fill="#3a2718"/>
      <path d="M632 208 Q650 200 676 207 Q700 201 730 207 Q760 202 780 208 Z" fill="#f2f5f7"/>
      <rect x="606" y="66" width="22" height="138" fill="#3a2718"/><path d="M613 66 L613 204 M620 66 L620 204" stroke="rgba(0,0,0,0.3)"/>
      <rect x="782" y="66" width="22" height="138" fill="#33220f"/>
      <ellipse cx="705" cy="150" rx="150" ry="130" fill="url(#h-froid)"/>
      <path d="M640 210 L770 210 L720 450 L470 450 Z" fill="#cfe0f0" opacity="0.05"/>

      <!-- métier à tisser -->
      <rect x="34" y="58" width="9" height="270" fill="#33220f"/><rect x="141" y="58" width="9" height="270" fill="#33220f"/>
      <rect x="24" y="62" width="136" height="11" rx="5" fill="#4a3423"/>
      <rect x="46" y="74" width="92" height="78" fill="#8a3524"/>
      <path d="M46 92 L138 92 M46 98 L138 98 M46 132 L138 132" stroke="#e6c35c" stroke-width="2.5"/>
      <path d="M46 114 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7 l4 -3.5" stroke="#e9dfc8" stroke-width="2" fill="none"/>
      <rect x="92" y="74" width="46" height="78" fill="rgba(0,0,0,0.18)"/>
      ${fils}
      <rect x="38" y="196" width="108" height="5" rx="2" fill="#4a3423"/>
      ${poids}

      <!-- le bouclier du père -->
      <g transform="translate(-76 4)">
      <path d="M352 196 L438 46" stroke="#5a4028" stroke-width="5" stroke-linecap="round"/>
      <path d="M438 46 l10 -24 l4 22 Z" fill="#8e949a"/>
      <circle cx="392" cy="122" r="43" fill="#2a1c12"/>
      <circle cx="392" cy="122" r="40" fill="#74301f"/>
      <g clip-path="url(#h-bou)">
        <path d="M392 122 L392 82 A40 40 0 0 1 432 122 Z M392 122 L392 162 A40 40 0 0 1 352 122 Z" fill="#c9bfa8"/>
        <path d="M370 82 L370 162 M381 82 L381 162 M403 82 L403 162 M414 82 L414 162" stroke="rgba(0,0,0,0.2)"/>
        <path d="M392 82 A40 40 0 0 1 392 162 Z" fill="rgba(0,0,0,0.25)"/>
      </g>
      <path d="M404 84 L398 108 L410 122 L400 160" stroke="#150e09" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
      <circle cx="392" cy="122" r="9" fill="#8e949a"/><circle cx="389.5" cy="119.500" r="2.5" fill="rgba(255,255,255,0.5)"/>
      </g>

      <!-- étagère -->
      <rect x="452" y="214" width="84" height="7" fill="#33220f"/>
      <path d="M460 221 l0 12 l10 -12 Z M528 221 l0 12 l-10 -12 Z" fill="#2a1c12"/>
      <path d="M462 214 Q456 196 464 186 L476 186 Q484 196 478 214 Z" fill="#9a6a48"/><path d="M470 186 L476 186 Q484 196 478 214 L470 214 Z" fill="rgba(0,0,0,0.25)"/>
      <ellipse cx="470" cy="186" rx="6" ry="2" fill="#5a3a26"/>
      <path d="M488 214 Q488 204 500 204 Q512 204 512 214 Z" fill="#7d6a52"/><path d="M490 206 L510 206" stroke="#5a4a38" stroke-width="2"/>
      <path d="M518 214 Q516 198 528 190 Q526 202 530 214 Z" fill="#e9dfc8"/><path d="M518 214 L530 214" stroke="#d6a640" stroke-width="3"/>

      <!-- sol -->
      <rect x="0" y="318" width="800" height="140" fill="#2b1e14"/>
      <rect x="0" y="318" width="800" height="5" fill="#150e09"/>
      ${Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 97) % 800} ${330 + ((i * 41) % 110)} l${8 + (i % 4) * 4} ${i % 2 ? -2 : 2}" stroke="#6b5a3a" stroke-width="1.4" opacity="0.5"/>`).join('')}

      <!-- porte -->
      <rect x="748" y="82" width="60" height="240" fill="#1a110a"/>
      <rect x="752" y="86" width="52" height="236" fill="#2a1c12"/>
      <path d="M778 86 L778 322 M752 130 L804 130 M752 230 L804 230" stroke="#150e09" stroke-width="3"/>
      <circle cx="762" cy="208" r="4" fill="#8e949a"/>
      <path d="M752 86 L804 86 L804 322 L752 322 Z" fill="#9fb4cc" opacity="0.06"/>
      <!-- couche et fourrures -->
      <rect x="566" y="290" width="250" height="44" fill="#33220f"/>
      <rect x="560" y="262" width="13" height="76" fill="#2a1c12"/><path d="M560 262 q6.5 -14 13 0 Z" fill="#2a1c12"/>
      <path d="M573 292 Q600 268 640 282 Q682 262 730 280 Q770 268 816 284 L816 306 L573 306 Z" fill="#8c7a5a"/>
      <path d="M690 274 Q730 270 770 276 Q790 272 816 284 L816 306 L690 306 Z" fill="#5f5340"/>
      <path d="M590 284 l4 8 M612 280 l4 9 M640 286 l3 8 M668 278 l4 9 M706 282 l3 8 M740 280 l4 9 M776 284 l3 8" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>

      <!-- foyer et chaudron pendu à la charpente -->
      <g transform="translate(-18 -44)">
      <ellipse cx="380" cy="330" rx="260" ry="120" fill="url(#h-feu)" class="anim-lueur"/>
      <ellipse cx="380" cy="338" rx="92" ry="20" fill="#120c07"/>
      ${pierres}
      <path d="M330 338 L420 326 M342 326 L430 340" stroke="#3a2718" stroke-width="11" stroke-linecap="round"/>
      <circle cx="330" cy="338" r="5.5" fill="#7d5a3a"/><circle cx="430" cy="340" r="5.5" fill="#7d5a3a"/>
      <g class="anim-lueur">${feu(380, 336, 1.05)}</g>
      ${braises(380, 290, 7, 70)}
      <path d="M380 30 L380 252" stroke="#1a1513" stroke-width="3" stroke-dasharray="5 3"/>
      <path d="M348 262 Q380 224 412 262" stroke="#1a1513" stroke-width="3" fill="none"/>
      <path d="M345 262 Q338 312 380 317 Q422 312 415 262 Z" fill="#1c1816"/>
      <path d="M380 262 L415 262 Q422 312 380 317 Z" fill="rgba(0,0,0,0.35)"/>
      <path d="M352 272 Q350 296 362 308" stroke="rgba(255,170,90,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="380" cy="262" rx="36" ry="7" fill="#2c2623"/><ellipse cx="380" cy="263" rx="30" ry="4.500" fill="#6b5a3a"/>
      <g fill="#d8d2c6" opacity="0.35"><circle class="anim-fumee" cx="372" cy="254" r="9"/><circle class="anim-fumee anim-fumee--2" cx="388" cy="252" r="7"/><circle class="anim-fumee anim-fumee--3" cx="380" cy="256" r="8"/></g>
      </g>

      <!--persos-->
      <ellipse cx="380" cy="330" rx="420" ry="230" fill="url(#h-feu)" opacity="0.35" pointer-events="none"/>
      ${vignette('h-vig', 0.7)}`),
    joueur: { x: 448, y: 120, scale: 1.06 },
    places: [{ x: 96, y: 128, scale: 1.02 }],
  };
}
