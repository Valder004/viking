// L'îlot, la nuit : une grève deux fois plus large que l'écran.
// À gauche le drakkar tiré au sec et le feu ; plus loin une vieille épave, une tombe de marin,
// et la pointe sud, d'où l'on voit l'orage monter sur l'horizon.
import { degrade, halo, vagues, ecume, etoiles, proue, feu, braises } from './elements.js';

const L = 1600;

export function ilot() {
  const galets = Array.from({ length: 54 }, (_, i) =>
    `<ellipse cx="${(i * 131 + 20) % L}" cy="${286 + ((i * 47) % 150)}" rx="${5 + (i % 4) * 2}" ry="${2.5 + (i % 3)}" fill="#4a443c" opacity="0.7"/>`).join('');
  const poisson = (x) => `<path d="M${x - 14} 266 Q${x} 256 ${x + 12} 266 Q${x} 276 ${x - 14} 266 Z M${x + 12} 266 l8 -6 l0 12 Z" fill="#8a6a48"/>`;

  // Membrures de l'épave : des côtes qui sortent du sable
  const membrures = Array.from({ length: 7 }, (_, i) => {
    const x = 900 + i * 30;
    const h = 46 + Math.sin(i * 0.9) * 22;
    return `<path d="M${x} 318 Q${x - 16} ${318 - h * 0.6} ${x - 6} ${318 - h}" stroke="#1a130d" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M${x} 318 Q${x - 16} ${318 - h * 0.6} ${x - 6} ${318 - h}" stroke="#4a5a80" stroke-width="1.500" fill="none" opacity="0.5" stroke-linecap="round"/>`;
  }).join('');

  return {
    largeur: L,
    svg: `<svg viewBox="0 0 ${L} 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${degrade('i-ciel', [[0, '#050814'], [0.7, '#14203c'], [1, '#2a3a5c']])}
        ${degrade('i-mer', [[0, '#1a2a48'], [1, '#080c18']])}
        ${halo('i-lune', '#dfe8ff', 0.45)}
        ${halo('i-feu', '#ff9434', 0.7)}
        ${halo('i-orage', '#b9c6ff', 0.5)}
      </defs>
      <rect width="${L}" height="450" fill="url(#i-ciel)"/>
      ${etoiles(110, 220)}<g transform="translate(800 0)">${etoiles(110, 220)}</g>
      <path d="M-20 60 Q500 -30 1000 70 Q1300 120 1620 60" stroke="#aab6dc" stroke-width="46" fill="none" opacity="0.05"/>
      <circle cx="620" cy="70" r="100" fill="url(#i-lune)"/><circle cx="620" cy="70" r="24" fill="#eef1f6"/>
      <circle cx="611" cy="63" r="5.500" fill="#cfd6e2" opacity="0.6"/><circle cx="628" cy="79" r="4" fill="#cfd6e2" opacity="0.6"/>

      <!-- l'orage, loin au sud -->
      <ellipse class="anim-eclair" cx="1490" cy="196" rx="170" ry="60" fill="url(#i-orage)" opacity="0"/>
      <g fill="#04060c">
        <ellipse cx="1420" cy="196" rx="120" ry="30"/><ellipse cx="1520" cy="178" rx="130" ry="36"/><ellipse cx="1600" cy="200" rx="110" ry="34"/>
        <ellipse cx="1470" cy="158" rx="80" ry="26"/><ellipse cx="1570" cy="148" rx="70" ry="24"/>
      </g>
      <path class="anim-eclair anim-eclair--2" d="M1496 196 L1488 214 L1494 213 L1484 232 L1500 210 L1494 211 L1502 196 Z" fill="#e6ecff"/>
      <path d="M1340 198 Q1400 176 1470 184" stroke="#3a4870" stroke-width="2" fill="none" opacity="0.6"/>

      <!-- mer et reflet -->
      <rect x="0" y="232" width="${L}" height="60" fill="url(#i-mer)"/>
      ${Array.from({ length: 8 }, (_, i) => `<rect class="anim-lueur" x="${620 - 44 + i * 5}" y="${236 + i * 5}" width="${88 - i * 10}" height="2" rx="1" fill="#dfe8ff" opacity="${0.5 - i * 0.05}"/>`).join('')}
      ${vagues(240, 'anim-vague', '#ffffff', 0.07, 4, 300)}<g transform="translate(800 0)">${vagues(240, 'anim-vague', '#ffffff', 0.07, 4, 300)}</g>
      ${ecume(252, 'anim-vague anim-vague--2', 0.3, 4)}<g transform="translate(800 0)">${ecume(252, 'anim-vague anim-vague--2', 0.3, 4)}</g>

      <!-- le drakkar tiré sur la grève -->
      <g transform="rotate(-3 180 250)">
        <rect x="176" y="118" width="7" height="140" fill="#120c07"/>
        <path d="M110 138 L250 138" stroke="#120c07" stroke-width="6" stroke-linecap="round"/>
        <rect x="118" y="140" width="124" height="12" rx="6" fill="#3a2e24"/>
        <path d="M180 120 L52 248 M180 120 L318 246" stroke="#1a130d" stroke-width="1.4"/>
        ${proue(54, 250, 0.5, '#161009')}
        <path d="M40 242 Q180 276 330 240 L318 262 Q180 296 54 264 Z" fill="#161009"/>
        <path d="M40 242 Q180 276 330 240" stroke="#4a5a80" stroke-width="2" fill="none" opacity="0.6"/>
        ${[90, 124, 158, 192, 226, 260, 294].map((x, i) => `<circle cx="${x}" cy="${258 + Math.sin((x - 40) / 92) * 8}" r="9" fill="${['#5a2a20', '#6b5628', '#1a2a44'][i % 3]}"/>`).join('')}
      </g>

      <!-- la pointe sud : rochers en gradins -->
      <path d="M1380 278 L1410 236 L1442 250 L1470 204 L1506 226 L1540 176 L1580 206 L1600 190 L1600 300 L1380 300 Z" fill="#0c1018"/>
      <path d="M1540 176 L1580 206 L1600 190 L1600 200 L1578 218 L1546 192 Z M1470 204 L1506 226 L1500 236 L1474 218 Z" fill="#2a3450" opacity="0.7"/>

      <!-- la grève -->
      <path d="M0 276 Q200 258 400 268 Q620 280 800 262 Q1000 250 1200 266 Q1400 282 ${L} 260 L${L} 460 L0 460 Z" fill="#26211c"/>
      <path d="M0 276 Q200 258 400 268 Q620 280 800 262 Q1000 250 1200 266 Q1400 282 ${L} 260" stroke="#4a5a80" stroke-width="2" fill="none" opacity="0.5"/>
      ${galets}
      <ellipse cx="330" cy="336" rx="330" ry="110" fill="url(#i-feu)" class="anim-lueur"/>

      <!-- lances et boucliers plantés -->
      <path d="M452 320 L446 196" stroke="#3a2718" stroke-width="4"/><path d="M446 196 l-5 -20 l9 16 Z" fill="#8e949a"/>
      <circle cx="456" cy="296" r="22" fill="#1a110a"/><circle cx="456" cy="296" r="19" fill="#8a3524"/><path d="M456 277 A19 19 0 0 1 456 315 Z" fill="rgba(0,0,0,0.3)"/><circle cx="456" cy="296" r="5" fill="#8e949a"/>

      <!-- le feu et la broche -->
      <ellipse cx="330" cy="330" rx="62" ry="13" fill="#0d0906"/>
      ${Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; return `<ellipse cx="${(330 + Math.cos(a) * 60).toFixed(1)}" cy="${(330 + Math.sin(a) * 13).toFixed(1)}" rx="11" ry="6" fill="#4a443c"/>`; }).join('')}
      <path d="M296 330 L356 320 M304 320 L364 332" stroke="#3a2718" stroke-width="9" stroke-linecap="round"/>
      <path d="M262 336 L270 262 M266 268 l-8 -10 M270 266 l8 -10 M398 336 L390 262 M394 268 l8 -10 M390 266 l-8 -10" stroke="#3a2718" stroke-width="4" stroke-linecap="round"/>
      <path d="M262 266 L400 266" stroke="#5a4028" stroke-width="3"/>
      ${poisson(308)}${poisson(350)}
      ${feu(330, 328, 0.95)}
      ${braises(330, 280, 8, 60)}
      <g fill="#8a8478" opacity="0.3"><circle class="anim-fumee" cx="330" cy="250" r="12"/><circle class="anim-fumee anim-fumee--2" cx="322" cy="254" r="9"/><circle class="anim-fumee anim-fumee--3" cx="338" cy="252" r="10"/></g>
      <!-- troncs autour du feu -->
      <path d="M40 348 L230 338" stroke="#3a2e24" stroke-width="22" stroke-linecap="round"/><path d="M40 342 L230 332" stroke="rgba(255,150,70,0.2)" stroke-width="3" stroke-linecap="round"/>
      <path d="M440 340 L770 350" stroke="#3a2e24" stroke-width="24" stroke-linecap="round"/><path d="M440 333 L770 343" stroke="rgba(255,150,70,0.2)" stroke-width="3" stroke-linecap="round"/>

      <!-- ===== la vieille épave ===== -->
      <path d="M866 322 Q980 306 1100 322" stroke="#120c07" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${membrures}
      <path d="M874 316 Q868 262 884 232 Q892 222 900 230" stroke="#1a130d" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M1040 322 l34 -10 l6 12 l-36 6 Z M1086 318 l22 4 l-4 10 l-20 -4 Z" fill="#1a130d"/>
      <ellipse cx="980" cy="330" rx="130" ry="10" fill="#1c1814"/>
      <!-- flaques de marée -->
      <ellipse cx="1130" cy="348" rx="34" ry="7" fill="#1a2a48"/><ellipse cx="1124" cy="346" rx="14" ry="2.500" fill="#dfe8ff" opacity="0.25"/>
      <ellipse cx="840" cy="366" rx="26" ry="5" fill="#1a2a48"/>

      <!-- ===== la tombe du marin ===== -->
      <path d="M1238 320 L1232 208" stroke="#2a2018" stroke-width="5" stroke-linecap="round"/>
      <path d="M1232 208 Q1222 186 1230 168 Q1240 186 1232 208 Z" fill="#2a2018"/>
      <path d="M1230 172 Q1236 190 1232 206" stroke="#4a5a80" stroke-width="1.200" fill="none" opacity="0.6"/>
      ${[[1190, 322, 16, 9], [1214, 318, 18, 11], [1240, 322, 17, 10], [1264, 324, 15, 8], [1202, 308, 14, 8], [1228, 304, 16, 9], [1252, 310, 14, 8], [1216, 294, 13, 7], [1240, 296, 12, 7], [1228, 284, 11, 6]]
        .map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3a3f48"/><ellipse cx="${x - 3}" cy="${y - 3}" rx="${rx * 0.55}" ry="${ry * 0.4}" fill="#5a6a90" opacity="0.5"/>`).join('')}
      <circle cx="1200" cy="290" r="17" fill="#14100c"/><circle cx="1200" cy="290" r="14.500" fill="#3a2a22"/>
      <path d="M1200 275.500 A14.5 14.5 0 0 1 1200 304.500 Z" fill="rgba(0,0,0,0.3)"/><circle cx="1200" cy="290" r="4" fill="#5a6066"/>
      <path d="M1192 280 L1206 300" stroke="#14100c" stroke-width="1.500"/>

      <!--persos-->
      <ellipse cx="330" cy="360" rx="470" ry="200" fill="url(#i-feu)" opacity="0.28" pointer-events="none"/>
    </svg>`,
    joueur: { x: 498, y: 140, scale: 1.02 },
    places: [
      { x: -14, y: 146, scale: 0.96, miroir: true },
      { x: 112, y: 150, scale: 0.94, miroir: true },
      { x: 380, y: 152, scale: 0.92 },
      { x: 628, y: 142, scale: 0.98 },
    ],
  };
}
