// Les décors du chapitre 2. Caméra sur le pont, tournée vers le large : au fond la mer,
// puis le plat-bord et ses boucliers, le mât et la voile, la proue au dragon à gauche.
import { SVG, degrade, halo, vignette, vagues, ecume, nuage, mouette, etoiles, maison, sapins, proue, feu, braises, caisse } from './elements.js';

const rail = (x) => 303 - 12 * (1 - ((x - 400) / 420) ** 2);

/** Le bateau lui-même, dessiné devant le paysage et derrière les personnages. */
function pont({ nuit = false, voile = 'pleine' } = {}) {
  const bois = nuit ? '#1e150e' : '#3d2a1b';
  const boisClair = nuit ? '#2c2016' : '#5a4230';
  const boisSombre = nuit ? '#120c07' : '#261a10';
  const corde = nuit ? '#4a4034' : '#b9a37a';

  const formeVoile = {
    pleine: 'M384 34 L736 34 Q754 130 730 224 Q560 244 390 224 Q366 130 384 34 Z',
    dechiree: 'M384 34 L736 34 Q750 104 742 148 L700 130 L718 192 L660 168 L678 232 Q600 242 524 236 L544 186 L482 214 L470 232 Q420 230 390 224 Q366 130 384 34 Z',
  }[voile];

  const toile = formeVoile
    ? `<clipPath id="k-voile"><path d="${formeVoile}"/></clipPath>
       <g clip-path="url(#k-voile)">
         <rect x="360" y="28" width="400" height="224" fill="#e3d5b2"/>
         ${[0, 1, 2, 3].map((i) => `<rect x="${384 + i * 88}" y="28" width="44" height="224" fill="#a23c26"/>`).join('')}
         <path d="M372 84 Q560 100 748 84 M370 134 Q560 152 750 134 M374 184 Q560 202 746 184" stroke="rgba(0,0,0,0.18)" stroke-width="1.5" fill="none"/>
         ${Array.from({ length: 12 }, (_, i) => `<path d="M${398 + i * 30} 136 l0 9" stroke="#e9dfc8" stroke-width="1.6"/>`).join('')}
         <rect x="560" y="28" width="200" height="224" fill="rgba(0,0,0,0.2)"/>
         <ellipse cx="470" cy="120" rx="70" ry="90" fill="rgba(255,255,255,0.09)"/>
         ${nuit ? '<rect x="360" y="28" width="400" height="224" fill="#070a14" opacity="0.6"/>' : ''}
       </g>
       <path d="${formeVoile}" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="1.5"/>
       <path d="M390 224 L326 ${rail(326)} M730 224 L792 ${rail(792)}" stroke="${corde}" stroke-width="1.6"/>`
    : `<rect x="384" y="34" width="352" height="18" rx="9" fill="${nuit ? '#4a3b2b' : '#a23c26'}"/>
       <path d="M384 43 Q560 56 736 43" stroke="rgba(0,0,0,0.3)" stroke-width="2" fill="none"/>
       ${Array.from({ length: 9 }, (_, i) => `<path d="M${404 + i * 39} 32 l0 22" stroke="#e9dfc8" stroke-width="2"/>`).join('')}`;

  const boucliers = Array.from({ length: 9 }, (_, i) => {
    const x = 140 + i * 78;
    const y = rail(x) + 8;
    const c = ['#b8432b', '#d9a441', '#1f3a5f', '#e9dfc8'][i % 4];
    return `<circle cx="${x}" cy="${y}" r="27" fill="${boisSombre}"/><circle cx="${x}" cy="${y}" r="24" fill="${c}" opacity="${nuit ? 0.6 : 1}"/>
      <path d="M${x} ${y - 24} A24 24 0 0 1 ${x} ${y + 24} Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M${x - 16} ${y - 12} A20 20 0 0 1 ${x - 4} ${y - 20}" stroke="rgba(255,255,255,0.25)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }).join('');

  return `
    <!-- gréement -->
    <path d="M560 -10 L300 ${rail(300)} M560 -10 L440 ${rail(440)} M560 -10 L690 ${rail(690)} M560 -10 L820 ${rail(820)}" stroke="${corde}" stroke-width="1.6" opacity="0.8"/>
    <path d="M370 31 L750 31" stroke="${bois}" stroke-width="9" stroke-linecap="round"/>
    ${toile}
    <rect x="550" y="-12" width="20" height="340" fill="${boisClair}"/><rect x="561" y="-12" width="9" height="340" fill="rgba(0,0,0,0.35)"/>
    <rect x="552" y="-12" width="3" height="340" fill="rgba(255,220,170,0.15)"/>
    ${[64, 70, 76, 252, 258, 264].map((y) => `<path d="M549 ${y} l22 3" stroke="${corde}" stroke-width="3"/>`).join('')}
    <!-- proue -->
    ${proue(74, rail(74) + 10, 0.92, bois)}
    <!-- boucliers accrochés au plat-bord -->
    ${boucliers}
    <!-- plat-bord et bordé intérieur -->
    <path d="M-20 319 Q400 295 820 319 L820 470 L-20 470 Z" fill="${bois}"/>
    <path d="M-20 341 Q400 317 820 341 M-20 366 Q400 342 820 366 M-20 394 Q400 370 820 394" stroke="rgba(0,0,0,0.4)" stroke-width="1.6" fill="none"/>
    ${Array.from({ length: 8 }, (_, i) => { const x = 40 + i * 104; return `<rect x="${x - 5}" y="${rail(x) + 14}" width="10" height="150" fill="${boisSombre}"/><rect x="${x - 5}" y="${rail(x) + 14}" width="3" height="150" fill="rgba(255,220,170,0.1)"/>`; }).join('')}
    ${Array.from({ length: 30 }, (_, i) => { const x = 10 + i * 27; return `<circle cx="${x}" cy="${rail(x) + 30}" r="1.3" fill="#8e949a" opacity="0.6"/>`; }).join('')}
    <path d="M-20 303 Q400 279 820 303 L820 319 Q400 295 -20 319 Z" fill="${boisClair}"/>
    <path d="M-20 303 Q400 279 820 303" stroke="rgba(255,220,170,0.3)" stroke-width="2.500" fill="none"/>
    <!-- pied de mât, coffre, cordage -->
    <rect x="534" y="322" width="52" height="20" rx="3" fill="${boisSombre}"/>
    ${caisse(258, 356, 1.2)}
    <ellipse cx="660" cy="350" rx="26" ry="8" fill="none" stroke="${corde}" stroke-width="5"/><ellipse cx="660" cy="346" rx="18" ry="5.500" fill="none" stroke="${corde}" stroke-width="5"/>`;
}

const placesPont = (n) =>
  n <= 1
    ? [{ x: 124, y: 144, scale: 0.98, miroir: true }]
    : [
        { x: -12, y: 148, scale: 0.96, miroir: true },
        { x: 128, y: 150, scale: 0.95, miroir: true },
        { x: 424, y: 150, scale: 0.95 },
        { x: 582, y: 144, scale: 0.98 },
      ];
const joueurPont = (n) => (n <= 1 ? { x: 380, y: 136, scale: 1.04 } : { x: 268, y: 138, scale: 1.02 });

// ------------------------------------------------------------------ Le départ
export function depart(etat, n = 0) {
  return {
    svg: SVG(`
      <defs>
        ${degrade('d-ciel', [[0, '#5d7390'], [0.6, '#c9bfae'], [1, '#f6d6a4']])}
        ${degrade('d-mer', [[0, '#c9b995'], [0.25, '#6f8a9c'], [1, '#2f4a60']])}
        ${halo('d-sol', '#ffe2a8', 0.85)}
      </defs>
      <g class="anim-roulis">
        <rect x="-100" y="-100" width="1000" height="420" fill="url(#d-ciel)"/>
        <circle cx="250" cy="198" r="150" fill="url(#d-sol)"/><circle cx="250" cy="200" r="24" fill="#fff3d6"/>
        ${nuage(120, 60, 0.9, '#f6e2c6', 0.5)}${nuage(330, 96, 0.6, '#fff', 0.35)}
        <!-- le fjord : plans successifs -->
        <path d="M150 216 L196 150 L224 176 L262 128 L300 216 Z" fill="#9aa4b0"/>
        <path d="M262 128 L276 150 L262 146 L252 154 Z" fill="#fff"/>
        <path d="M290 216 L340 140 L372 170 L420 216 Z" fill="#8792a0"/>
        <path d="M-100 -60 L40 -60 L96 20 L78 70 L128 120 L112 160 L176 216 L-100 216 Z" fill="#3c4a55"/>
        <path d="M40 -60 L96 20 L78 70 L128 120 L112 160 L176 216 L130 216 L84 150 L96 120 L52 70 L66 24 L20 -60 Z" fill="#2c3840"/>
        <path d="M-100 -60 L40 -60 L66 -20 L30 -6 L-10 -24 L-100 0 Z" fill="#e6edf2"/>
        <path d="M60 40 L62 120 M66 44 L70 130" stroke="#e6edf2" stroke-width="2" opacity="0.8"/>
        ${sapins(-20, 150, 214, 30, '#1e2a2c', 9)}
        <path d="M-100 204 Q40 196 150 210 L180 218 L-100 220 Z" fill="#27333a"/>
        ${maison(20, 210, 40)}${maison(74, 208, 52)}${maison(134, 212, 32, { fumee: false })}
        <path d="M150 214 L214 214" stroke="#261a10" stroke-width="3"/>
        ${[160, 172, 186, 200].map((x, i) => `<path d="M${x} 214 l0 -9 m-3 3 l3 ${i % 2 ? -7 : -5} l3 4" stroke="#261a10" stroke-width="2" fill="none"/>`).join('')}
        <!-- la mer -->
        <rect x="-100" y="215" width="1000" height="260" fill="url(#d-mer)"/>
        ${Array.from({ length: 10 }, (_, i) => `<rect class="anim-lueur" x="${250 - 46 + i * 4}" y="${220 + i * 7}" width="${92 - i * 8}" height="2.500" rx="1" fill="#fff3d6" opacity="${0.75 - i * 0.06}"/>`).join('')}
        ${vagues(232, 'anim-vague', '#ffffff', 0.08)}
        ${ecume(246, 'anim-vague anim-vague--2', 0.4)}
        ${vagues(266, 'anim-vague anim-vague--3', '#0e1a2a', 0.2)}
        ${ecume(280, 'anim-vague', 0.3)}
      </g>
      ${mouette(330, 70, 1.1)}${mouette(372, 92, 0.8, 'anim-oiseau anim-oiseau--2')}${mouette(180, 110, 0.7, 'anim-oiseau anim-oiseau--3')}
      ${pont()}
      <!--persos-->
      ${vignette('d-vig', 0.4)}`),
    joueur: joueurPont(n),
    places: placesPont(n),
  };
}

// ------------------------------------------------------------------ Pleine mer
export function mer(etat, n = 0) {
  return {
    svg: SVG(`
      <defs>
        ${degrade('m-ciel', [[0, '#2f4f7a'], [0.7, '#8fb0cf'], [1, '#d6e4ee']])}
        ${degrade('m-mer', [[0, '#3f6a8c'], [1, '#12283c']])}
        ${halo('m-sol', '#fffbe6', 0.8)}
      </defs>
      <g class="anim-roulis">
        <rect x="-100" y="-100" width="1000" height="420" fill="url(#m-ciel)"/>
        <circle cx="210" cy="72" r="110" fill="url(#m-sol)"/><circle cx="210" cy="72" r="20" fill="#fffdf2"/>
        <g class="anim-vol">${nuage(-40, 120, 1.3, '#fff', 0.75)}${nuage(-320, 70, 0.9, '#fff', 0.6)}</g>
        <g class="anim-vol anim-vol--2">${nuage(-120, 170, 0.8, '#fff', 0.5)}${nuage(-520, 40, 1.1, '#fff', 0.55)}</g>
        ${nuage(300, 196, 1.8, '#e6eef4', 0.5)}
        <rect x="-100" y="215" width="1000" height="260" fill="url(#m-mer)"/>
        <rect x="-100" y="215" width="1000" height="3" fill="#d6e4ee" opacity="0.5"/>
        ${Array.from({ length: 9 }, (_, i) => `<rect class="anim-lueur" x="${210 - 30 + i * 3}" y="${222 + i * 7}" width="${60 - i * 6}" height="2" rx="1" fill="#fffdf2" opacity="${0.6 - i * 0.05}"/>`).join('')}
        ${vagues(226, 'anim-vague anim-vague--3', '#ffffff', 0.08, 4)}
        ${vagues(240, 'anim-vague', '#0e2238', 0.25, 7)}${ecume(240, 'anim-vague', 0.45, 7)}
        ${vagues(258, 'anim-vague anim-vague--2', '#ffffff', 0.07, 8)}${ecume(258, 'anim-vague anim-vague--2', 0.35, 8)}
        ${vagues(278, 'anim-vague', '#0a1a2c', 0.3, 9)}${ecume(278, 'anim-vague', 0.5, 9)}
      </g>
      ${mouette(120, 150, 1)}${mouette(160, 132, 0.7, 'anim-oiseau anim-oiseau--2')}
      ${pont()}
      <!--persos-->
      ${vignette('m-vig', 0.4)}`),
    joueur: joueurPont(n),
    places: placesPont(n),
  };
}

// ------------------------------------------------------------------ La tempête
export function tempete(etat, n = 0) {
  const pluie = Array.from({ length: 130 }, (_, i) => {
    const x = (i * 53) % 840;
    const y = ((i * 97) % 520) - 60;
    return `<line x1="${x}" y1="${y}" x2="${x - 8}" y2="${y + 24}" stroke="#c9d6e4" stroke-width="1.2" opacity="0.4"/>`;
  }).join('');
  const embruns = Array.from({ length: 26 }, (_, i) =>
    `<circle class="anim-braise ${['', 'anim-braise--2', 'anim-braise--3'][i % 3]}" cx="${(i * 67) % 800}" cy="${300 - (i % 4) * 6}" r="${1.5 + (i % 3)}" fill="#dfe8f2" opacity="0.7"/>`).join('');
  const lame = (d, cls) => `<g class="${cls}"><path d="${d}" fill="#0f1c30"/><path d="${d.split(' L')[0]}" fill="none" stroke="#c9d6e4" stroke-width="3" stroke-dasharray="26 14 8 20" stroke-linecap="round" opacity="0.7"/></g>`;
  return {
    svg: SVG(`
      <defs>${degrade('t-ciel', [[0, '#04060c'], [1, '#141c2c']])}</defs>
      <g class="anim-roulis--fort">
        <rect x="-150" y="-150" width="1100" height="520" fill="url(#t-ciel)"/>
        <g fill="#161e30"><ellipse cx="120" cy="40" rx="220" ry="60"/><ellipse cx="460" cy="20" rx="260" ry="54"/><ellipse cx="760" cy="60" rx="200" ry="58"/></g>
        <g fill="#0c111c"><ellipse cx="260" cy="96" rx="240" ry="40"/><ellipse cx="640" cy="110" rx="260" ry="36"/></g>
        <rect class="anim-eclair" x="-150" y="-150" width="1100" height="700" fill="#cfdcff" opacity="0"/>
        <path class="anim-eclair anim-eclair--2" d="M230 -20 L196 84 L222 80 L170 196 L250 96 L220 100 L262 -20 Z" fill="#fff6d6"/>
        <path class="anim-eclair" d="M330 40 L312 110 L326 108 L300 170 L342 114 L328 116 L350 40 Z" fill="#fff6d6"/>
        <rect x="-150" y="230" width="1100" height="300" fill="#0b1524"/>
        ${lame('M-150 300 Q-20 96 120 214 Q170 250 210 300 L-150 320 Z', 'anim-houle')}
        ${lame('M160 300 Q250 150 360 232 Q400 262 420 300 L160 320 Z', 'anim-houle anim-houle--2')}
        ${lame('M700 300 Q800 130 950 300 L700 320 Z', 'anim-houle')}
        ${vagues(262, 'anim-vague', '#ffffff', 0.14, 12)}${ecume(262, 'anim-vague', 0.6, 12)}
        ${vagues(284, 'anim-vague anim-vague--2', '#000000', 0.35, 12)}${ecume(284, 'anim-vague anim-vague--2', 0.5, 12)}
      </g>
      ${pont({ nuit: true, voile: 'dechiree' })}
      ${embruns}
      <!--persos-->
      <rect width="800" height="450" fill="#0a1020" opacity="0.28" pointer-events="none"/>
      <rect class="anim-eclair" width="800" height="450" fill="#cfdcff" opacity="0" pointer-events="none" style="mix-blend-mode:screen"/>
      <g class="anim-pluie" pointer-events="none">${pluie}</g>
      ${vignette('t-vig', 0.75)}`),
    joueur: joueurPont(n),
    places: placesPont(n),
  };
}

// ---------------------------------------------------------------- Le brouillard
export function brouillard(etat, n = 0) {
  return {
    svg: SVG(`
      <defs>${degrade('b-ciel', [[0, '#8894a0'], [1, '#bcc4cb']])}${halo('b-sol', '#ffffff', 0.5)}</defs>
      <g class="anim-roulis">
        <rect x="-100" y="-100" width="1000" height="420" fill="url(#b-ciel)"/>
        <circle cx="300" cy="92" r="90" fill="url(#b-sol)"/><circle cx="300" cy="92" r="22" fill="#eef1f3" opacity="0.7"/>
        <!-- écueils qui devinent -->
        <path d="M110 216 L128 150 L150 170 L166 112 L196 150 L214 132 L250 216 Z" fill="#59636d" opacity="0.5"/>
        <path d="M400 216 L424 168 L446 186 L470 150 L500 216 Z" fill="#6c7680" opacity="0.32"/>
        <path d="M-40 216 L-10 176 L30 196 L60 216 Z" fill="#59636d" opacity="0.4"/>
        <rect x="-100" y="215" width="1000" height="260" fill="#6d7b88"/>
        ${vagues(228, 'anim-vague', '#ffffff', 0.1, 4)}${ecume(246, 'anim-vague anim-vague--2', 0.3, 5)}
        ${vagues(268, 'anim-vague anim-vague--3', '#2a3540', 0.2, 6)}
        <ellipse class="anim-brume" cx="300" cy="200" rx="520" ry="60" fill="#c6ced5" opacity="0.6"/>
        <ellipse class="anim-brume anim-brume--2" cx="600" cy="150" rx="460" ry="70" fill="#c6ced5" opacity="0.5"/>
      </g>
      ${pont({ voile: 'pliee' })}
      <rect width="800" height="450" fill="#aab3bb" opacity="0.3"/>
      <ellipse class="anim-brume" cx="400" cy="60" rx="560" ry="110" fill="#c6ced5" opacity="0.6"/>
      <ellipse class="anim-brume anim-brume--2" cx="200" cy="270" rx="420" ry="50" fill="#c6ced5" opacity="0.45"/>
      <!--persos-->
      <ellipse class="anim-brume" cx="560" cy="330" rx="520" ry="60" fill="#c6ced5" opacity="0.35" pointer-events="none"/>
      <rect width="800" height="450" fill="#aab3bb" opacity="0.12" pointer-events="none"/>
      ${vignette('b-vig', 0.35)}`),
    joueur: joueurPont(n),
    places: placesPont(n),
  };
}

// ------------------------------------------------------------------- L'îlot
export function ilot() {
  const galets = Array.from({ length: 26 }, (_, i) =>
    `<ellipse cx="${(i * 131 + 20) % 800}" cy="${286 + ((i * 47) % 150)}" rx="${5 + (i % 4) * 2}" ry="${2.5 + (i % 3)}" fill="#4a443c" opacity="0.7"/>`).join('');
  const poisson = (x) => `<path d="M${x - 14} 266 Q${x} 256 ${x + 12} 266 Q${x} 276 ${x - 14} 266 Z M${x + 12} 266 l8 -6 l0 12 Z" fill="#8a6a48"/>`;
  return {
    svg: SVG(`
      <defs>
        ${degrade('i-ciel', [[0, '#050814'], [0.7, '#14203c'], [1, '#2a3a5c']])}
        ${degrade('i-mer', [[0, '#1a2a48'], [1, '#080c18']])}
        ${halo('i-lune', '#dfe8ff', 0.45)}
        ${halo('i-feu', '#ff9434', 0.7)}
      </defs>
      <rect width="800" height="450" fill="url(#i-ciel)"/>
      ${etoiles(110, 220)}
      <path d="M-20 60 Q300 -10 820 90" stroke="#aab6dc" stroke-width="46" fill="none" opacity="0.05"/>
      <circle cx="620" cy="70" r="100" fill="url(#i-lune)"/><circle cx="620" cy="70" r="24" fill="#eef1f6"/>
      <circle cx="611" cy="63" r="5.500" fill="#cfd6e2" opacity="0.6"/><circle cx="628" cy="79" r="4" fill="#cfd6e2" opacity="0.6"/>
      <!-- mer et reflet -->
      <rect x="0" y="232" width="800" height="60" fill="url(#i-mer)"/>
      ${Array.from({ length: 8 }, (_, i) => `<rect class="anim-lueur" x="${620 - 44 + i * 5}" y="${236 + i * 5}" width="${88 - i * 10}" height="2" rx="1" fill="#dfe8ff" opacity="${0.5 - i * 0.05}"/>`).join('')}
      ${vagues(240, 'anim-vague', '#ffffff', 0.07, 4, 300)}${ecume(252, 'anim-vague anim-vague--2', 0.3, 4)}
      <!-- rochers -->
      <path d="M640 262 L668 206 L700 224 L730 180 L770 214 L800 196 L800 270 L640 270 Z" fill="#0c1018"/>
      <path d="M730 180 L770 214 L800 196 L800 204 L768 224 L736 196 Z" fill="#2a3450" opacity="0.7"/>
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
      <!-- la grève -->
      <path d="M0 276 Q200 258 400 268 Q620 280 800 262 L800 460 L0 460 Z" fill="#26211c"/>
      <path d="M0 276 Q200 258 400 268 Q620 280 800 262" stroke="#4a5a80" stroke-width="2" fill="none" opacity="0.5"/>
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
      <!-- troncs -->
      <path d="M40 348 L230 338" stroke="#3a2e24" stroke-width="22" stroke-linecap="round"/><path d="M40 342 L230 332" stroke="rgba(255,150,70,0.2)" stroke-width="3" stroke-linecap="round"/>
      <path d="M440 340 L770 350" stroke="#3a2e24" stroke-width="24" stroke-linecap="round"/><path d="M440 333 L770 343" stroke="rgba(255,150,70,0.2)" stroke-width="3" stroke-linecap="round"/>
      <!--persos-->
      <ellipse cx="330" cy="360" rx="470" ry="200" fill="url(#i-feu)" opacity="0.28" pointer-events="none"/>
      ${vignette('i-vig', 0.7)}`),
    joueur: { x: 498, y: 140, scale: 1.02 },
    places: [
      { x: -14, y: 146, scale: 0.96, miroir: true },
      { x: 112, y: 150, scale: 0.94, miroir: true },
      { x: 380, y: 152, scale: 0.92 },
      { x: 628, y: 142, scale: 0.98 },
    ],
  };
}
