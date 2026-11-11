// Le port : un long quai, deux fois plus large que l'écran, qui défile avec le joueur.
// À gauche le village et le drakkar ; puis les séchoirs à poisson, le hangar à bateaux,
// une barque, et tout au bout la pierre levée face au large.
// Deux ambiances (nuit / petit matin). Les corbeaux et le chien suivent l'histoire.
import { degrade, halo, vagues, ecume, etoiles, maison, sapins, proue, tonneau, caisse, corbeau, mouette, nuage, neige } from './elements.js';

const L = 1600;

function chien(x, y) {
  return `<g transform="translate(${x} ${y})">
    <path d="M-14 -2 Q-28 -6 -25 -20" stroke="#6e6258" stroke-width="4.500" fill="none" stroke-linecap="round"/>
    <path d="M-14 0 Q-21 -22 -9 -34 Q-5 -50 6 -52 Q18 -53 20 -42 L29 -38 L20 -32 Q16 -26 10 -26 Q15 -10 12 0 Z" fill="#6e6258"/>
    <path d="M6 -52 Q18 -53 20 -42 L29 -38 L20 -32 Q16 -26 10 -26 Q15 -10 12 0 L4 0 Q8 -26 6 -52 Z" fill="rgba(0,0,0,0.22)"/>
    <path d="M1 -51 L3 -65 L12 -52 Z" fill="#5a4f46"/>
    <path d="M-8 -22 l8 -2 M-9 -16 l9 -2 M-9 -10 l9 -2" stroke="rgba(0,0,0,0.3)" stroke-width="1.3"/>
    <circle cx="13" cy="-43" r="1.700" fill="#120c07"/><circle cx="27.5" cy="-38" r="2" fill="#120c07"/>
    <path d="M2 0 l0 -10 M9 0 l0 -10" stroke="#5a4f46" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}

export function port(etat, nbPnj = 0) {
  const nuit = Boolean(etat?.flags?.c1_nuit);
  const scene = etat?.scene ?? '';
  const f = etat?.flags ?? {};
  // Trois corbeaux tant qu'Ulf n'a pas parlé, deux ensuite, plus aucun à l'aube.
  const nbCorbeaux = scene === 'c1_aube' || !scene.startsWith('c1_') ? 0 : f.c1_ulf_vu ? 2 : 3;
  // Le chien reste près des caisses tant qu'on ne l'a pas chassé ; à l'aube, il ne revient que nourri.
  const avecChien = scene === 'c1_aube' ? Boolean(f.chien_nourri) : scene.startsWith('c1_') && !f.chien_chasse;

  const bois = nuit ? '#231810' : '#3a2718';
  const boisSombre = nuit ? '#150e09' : '#2a1c12';
  const terre = nuit ? '#0c1016' : '#27333a';
  const neigeC = nuit ? '#8f9cb8' : '#eef2f5';

  // Ligne de plat-bord du drakkar : courbe de Bézier quadratique
  const bord = (t) => ({ x: 150 + 560 * t, y: (1 - t) ** 2 * 292 + 2 * t * (1 - t) * 346 + t ** 2 * 286 });
  const boucliers = Array.from({ length: 9 }, (_, i) => {
    const p = bord(0.14 + i * 0.09);
    const c = ['#b8432b', '#d9a441', '#1f3a5f', '#e9dfc8'][i % 4];
    return `<circle cx="${p.x.toFixed(1)}" cy="${(p.y + 5).toFixed(1)}" r="14" fill="${boisSombre}"/><circle cx="${p.x.toFixed(1)}" cy="${(p.y + 5).toFixed(1)}" r="12" fill="${c}" opacity="${nuit ? 0.7 : 1}"/>
      <path d="M${p.x.toFixed(1)} ${(p.y - 7).toFixed(1)} A12 12 0 0 1 ${p.x.toFixed(1)} ${(p.y + 17).toFixed(1)} Z" fill="rgba(0,0,0,0.25)"/><circle cx="${p.x.toFixed(1)}" cy="${(p.y + 5).toFixed(1)}" r="3.500" fill="#8e949a"/>`;
  }).join('');

  const montagnes = (dx) => `<g transform="translate(${dx} -34)">
      <path d="M0 250 L70 168 L130 214 L210 120 L290 208 L350 160 L430 236 L500 176 L570 232 L650 150 L730 222 L800 180 L800 300 L0 300 Z" fill="${nuit ? '#1b2740' : '#7c8da3'}"/>
      <path d="M210 120 L236 150 L218 146 L204 158 L190 144 Z M650 150 L676 180 L656 174 L640 186 L630 172 Z M70 168 L88 190 L72 186 L58 196 Z M350 160 L366 180 L350 176 L338 184 Z M500 176 L514 194 L500 190 L488 198 Z" fill="${nuit ? '#aab6cc' : '#fff'}" opacity="${nuit ? 0.6 : 0.9}"/>
      <path d="M0 290 L90 222 L190 268 L300 214 L420 280 L540 232 L660 284 L800 240 L800 310 L0 310 Z" fill="${nuit ? '#111a2c' : '#566579'}"/>
      <rect x="0" y="236" width="800" height="60" fill="${nuit ? '#2a3a58' : '#e9dccb'}" opacity="0.22"/></g>`;

  const poteau = (x) => `<rect x="${x - 11}" y="258" width="22" height="100" fill="${boisSombre}"/><rect x="${x}" y="258" width="11" height="100" fill="rgba(0,0,0,0.3)"/><rect x="${x - 14}" y="252" width="28" height="9" rx="2" fill="${bois}"/>
        <path d="M${x - 13} 300 q13 7 26 0 M${x - 13} 307 q13 7 26 0 M${x - 13} 314 q13 7 26 0" stroke="#b9a37a" stroke-width="3" fill="none"/>`;

  const lanterne = (x, y, r = 60) => `
      ${nuit ? `<circle class="anim-vacille" cx="${x}" cy="${y + 10}" r="${r}" fill="url(#p-lampe)"/>` : ''}
      <rect x="${x - 7}" y="${y}" width="14" height="20" rx="2" fill="${nuit ? '#ffcf7a' : '#6b5a3a'}"/><path d="M${x - 7} ${y} l7 -6 l7 6 Z M${x - 7} ${y + 20} h14" fill="#1a110a" stroke="#1a110a" stroke-width="2"/>
      <path d="M${x} ${y} l0 20" stroke="#1a110a" stroke-width="1.2"/>`;

  // Séchoir à poisson : deux rangs de morues pendues
  const morues = (y) => Array.from({ length: 9 }, (_, i) => {
    const x = 858 + i * 16;
    return `<path d="M${x} ${y} l0 5" stroke="#b9a37a" stroke-width="1"/><path d="M${x} ${y + 5} Q${x + 5} ${y + 16} ${x} ${y + 30} Q${x - 5} ${y + 16} ${x} ${y + 5} Z" fill="${nuit ? '#6b6250' : '#b39c72'}"/><path d="M${x} ${y + 30} l-3.500 6 l7 0 Z" fill="${nuit ? '#6b6250' : '#b39c72'}"/>`;
  }).join('');

  return {
    largeur: L,
    svg: `<svg viewBox="0 0 ${L} 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${degrade('p-ciel', nuit ? [[0, '#060915'], [0.6, '#14203a'], [1, '#2a3a58']] : [[0, '#4f637d'], [0.55, '#a5b2c2'], [1, '#f0cfa8']])}
        ${degrade('p-mer', nuit ? [[0, '#16233a'], [1, '#070b14']] : [[0, '#7f95a8'], [1, '#2f4558']])}
        ${halo('p-astre', nuit ? '#dfe8ff' : '#ffd9a0', nuit ? 0.45 : 0.75)}
        ${halo('p-lampe', '#ffb04a', 0.6)}
      </defs>
      <rect width="${L}" height="450" fill="url(#p-ciel)"/>
      ${nuit
        ? `${etoiles(80, 200)}<g transform="translate(800 0)">${etoiles(80, 200)}</g>`
        : `${nuage(180, 90, 1.1, '#f6dcc0', 0.5)}${nuage(600, 60, 0.8, '#f6dcc0', 0.4)}${nuage(430, 130, 0.6, '#fff', 0.3)}${nuage(1040, 80, 1.2, '#f6dcc0', 0.45)}${nuage(1420, 56, 0.9, '#f6dcc0', 0.4)}`}
      ${nuit
        ? `<circle cx="384" cy="40" r="110" fill="url(#p-astre)"/><circle cx="384" cy="40" r="30" fill="#eef1f6"/><circle cx="374" cy="32" r="6" fill="#cfd6e2" opacity="0.6"/><circle cx="394" cy="52" r="4.500" fill="#cfd6e2" opacity="0.6"/>`
        : `<circle cx="560" cy="190" r="170" fill="url(#p-astre)"/><circle cx="560" cy="194" r="26" fill="#fff0cf"/>`}

      ${montagnes(0)}${montagnes(800)}

      <g transform="translate(0 -56)">
      <!-- la rive et le village -->
      <path d="M0 246 Q120 226 240 244 Q320 256 372 288 L0 292 Z" fill="${terre}"/>
      ${sapins(6, 330, 250, 36, nuit ? '#080c12' : '#1e2a2c', 12)}
      ${maison(22, 268, 74, { nuit })}${maison(118, 262, 96, { nuit })}${maison(238, 274, 62, { nuit })}
      <path d="M0 276 L340 284" stroke="${boisSombre}" stroke-width="2"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M${10 + i * 28} 270 l0 12" stroke="${boisSombre}" stroke-width="2"/>`).join('')}

      <!-- la mer -->
      <rect x="0" y="286" width="${L}" height="170" fill="url(#p-mer)"/>
      ${Array.from({ length: 9 }, (_, i) => `<rect class="anim-lueur" x="${(nuit ? 384 : 560) - 40 + i * 4}" y="${292 + i * 6}" width="${80 - i * 8}" height="2" rx="1" fill="${nuit ? '#dfe8ff' : '#fff0cf'}" opacity="${0.5 - i * 0.04}"/>`).join('')}
      ${vagues(298, 'anim-vague', '#ffffff', 0.07)}<g transform="translate(800 0)">${vagues(298, 'anim-vague', '#ffffff', 0.07)}</g>
      ${ecume(304, 'anim-vague anim-vague--2', 0.3)}<g transform="translate(800 0)">${ecume(304, 'anim-vague anim-vague--2', 0.3)}</g>

      <!-- le drakkar -->
      <g transform="translate(-100 0)">
      <ellipse cx="430" cy="350" rx="290" ry="12" fill="#000" opacity="0.3"/>
      <path d="M156 298 C138 250 148 212 172 204 C186 200 194 212 186 220 C180 226 172 222 175 215" stroke="${bois}" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${proue(704, 292, 0.72, bois, true)}
      <rect x="426" y="52" width="9" height="282" fill="${bois}"/><rect x="431" y="52" width="4" height="282" fill="rgba(0,0,0,0.3)"/>
      <path d="M430 56 L172 296 M430 56 L690 290 M430 56 L340 98 M430 56 L520 98" stroke="${boisSombre}" stroke-width="1.6"/>
      <path d="M336 98 L524 98" stroke="${bois}" stroke-width="7" stroke-linecap="round"/>
      <rect x="344" y="100" width="172" height="15" rx="7" fill="${nuit ? '#5a4636' : '#a8402a'}"/>
      <path d="M344 108 Q430 118 516 108" stroke="rgba(0,0,0,0.25)" stroke-width="2" fill="none"/>
      ${[362, 396, 430, 464, 498].map((x) => `<path d="M${x} 99 l0 17" stroke="#e9dfc8" stroke-width="2"/>`).join('')}
      ${[corbeau(456, 90, 1.5), corbeau(482, 90, 1.5, 'anim-oiseau anim-oiseau--2'), corbeau(508, 90, 1.5, 'anim-oiseau anim-oiseau--3')].slice(0, nbCorbeaux).join('')}
      ${boucliers}
      <path d="M150 292 Q430 346 710 286 L698 304 Q430 384 164 310 Z" fill="${bois}"/>
      <path d="M150 292 Q430 346 710 286" stroke="rgba(255,220,170,0.25)" stroke-width="2.500" fill="none"/>
      <path d="M156 301 Q430 358 704 296 M162 308 Q430 370 700 302" stroke="rgba(0,0,0,0.4)" stroke-width="1.4" fill="none"/>
      ${Array.from({ length: 22 }, (_, i) => { const p = bord(0.05 + i * 0.042); return `<circle cx="${p.x.toFixed(1)}" cy="${(p.y + 13).toFixed(1)}" r="1" fill="#8e949a" opacity="0.7"/>`; }).join('')}
      <path d="M690 300 Q790 340 868 300" stroke="#b9a37a" stroke-width="2.500" fill="none"/>
      </g>

      <!-- ===== le hangar à bateaux ===== -->
      <path d="M1070 300 Q1190 284 1320 302 L1320 352 L1070 352 Z" fill="${terre}"/>
      <rect x="1098" y="246" width="192" height="104" fill="${nuit ? '#2a1e15' : '#4a3626'}"/>
      ${Array.from({ length: 4 }, (_, i) => `<path d="M1098 ${268 + i * 22} L1290 ${268 + i * 22}" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>`).join('')}
      <path d="M1124 350 L1124 270 Q1194 236 1264 270 L1264 350 Z" fill="#0d0906"/>
      <path d="M1146 350 Q1150 300 1194 292 Q1238 300 1242 350 Z" fill="${boisSombre}"/>
      <path d="M1194 292 L1194 350 M1162 322 Q1194 312 1226 322 M1154 338 Q1194 328 1234 338" stroke="rgba(255,220,170,0.14)" stroke-width="1.500" fill="none"/>
      ${proue(1198, 296, 0.22, boisSombre)}
      <path d="M1076 252 L1194 176 L1312 252 Z" fill="${nuit ? '#1a2018' : '#55633f'}"/>
      <path d="M1194 176 L1312 252 L1194 252 Z" fill="rgba(0,0,0,0.22)"/>
      <path d="M1194 176 L1262 220 Q1246 228 1230 218 Q1212 228 1194 220 Q1176 230 1158 218 Q1142 226 1126 220 Z" fill="${neigeC}"/>
      <path d="M1076 252 L1194 176 L1312 252" stroke="${boisSombre}" stroke-width="9" fill="none" stroke-linejoin="round"/>
      <path d="M1184 190 L1212 160 M1204 190 L1176 160" stroke="${boisSombre}" stroke-width="6" stroke-linecap="round"/>
      <path d="M1296 262 L1296 284 L1310 284" stroke="${boisSombre}" stroke-width="3.500" fill="none"/>
      ${lanterne(1310, 286, 54)}

      <!-- ===== la barque ===== -->
      <ellipse cx="1420" cy="340" rx="76" ry="6" fill="#000" opacity="0.3"/>
      <rect x="1417" y="250" width="5" height="78" fill="${bois}"/>
      <path d="M1396 268 L1444 268" stroke="${bois}" stroke-width="4" stroke-linecap="round"/>
      <rect x="1400" y="270" width="40" height="8" rx="4" fill="${nuit ? '#4a4034' : '#c9bfa8'}"/>
      <path d="M1348 316 Q1420 340 1492 314 L1484 328 Q1420 352 1356 330 Z" fill="${bois}"/>
      <path d="M1348 316 Q1420 340 1492 314" stroke="rgba(255,220,170,0.25)" stroke-width="2" fill="none"/>
      <path d="M1348 316 Q1338 300 1346 290 M1492 314 Q1502 298 1494 288" stroke="${bois}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M1494 318 Q1530 336 1548 322" stroke="#b9a37a" stroke-width="2" fill="none"/>

      <!-- brume sur l'eau -->
      <ellipse class="anim-brume" cx="260" cy="316" rx="380" ry="20" fill="#dfe6ec" opacity="${nuit ? 0.16 : 0.4}"/>
      <ellipse class="anim-brume anim-brume--2" cx="620" cy="328" rx="340" ry="18" fill="#dfe6ec" opacity="${nuit ? 0.14 : 0.34}"/>
      <ellipse class="anim-brume" cx="1040" cy="322" rx="360" ry="18" fill="#dfe6ec" opacity="${nuit ? 0.14 : 0.36}"/>
      <ellipse class="anim-brume anim-brume--2" cx="1440" cy="330" rx="340" ry="18" fill="#dfe6ec" opacity="${nuit ? 0.16 : 0.38}"/>
      ${nuit ? '' : `${mouette(250, 120, 1)}${mouette(292, 138, 0.7, 'anim-oiseau anim-oiseau--2')}${mouette(610, 96, 0.8, 'anim-oiseau anim-oiseau--3')}${mouette(1080, 130, 0.9)}${mouette(1380, 110, 0.8, 'anim-oiseau anim-oiseau--2')}`}

      <!-- le quai -->
      <path d="M0 346 L${L} 346 L${L} 530 L0 530 Z" fill="${nuit ? '#1a130d' : '#33271c'}"/>
      ${Array.from({ length: 44 }, (_, i) => { const x = -700 + i * 70; return `<path d="M${x} 530 L${800 + (x - 800) * 0.6} 346" stroke="rgba(0,0,0,0.4)" stroke-width="1.5"/>`; }).join('')}
      <rect x="0" y="344" width="${L}" height="5" fill="${nuit ? '#3a2c20' : '#5a4634'}"/>
      ${poteau(30)}${poteau(770)}${poteau(1540)}
      <!-- lanterne du quai -->
      <path d="M30 252 L30 214 L52 214 L52 222" stroke="${boisSombre}" stroke-width="4" fill="none"/>
      ${lanterne(52, 222)}
      <!-- marchandises -->
      ${tonneau(108, 350, 1.15)}${caisse(162, 350, 1.05)}${caisse(150, 316, 0.8)}
      <ellipse cx="220" cy="352" rx="24" ry="7" fill="none" stroke="#b9a37a" stroke-width="4"/><ellipse cx="220" cy="349" rx="17" ry="5" fill="none" stroke="#b9a37a" stroke-width="4"/>
      ${avecChien ? chien(196, 317) : ''}

      <!-- ===== les séchoirs à poisson ===== -->
      <path d="M850 350 L866 232 M1002 350 L986 232 M850 350 L836 240 M1002 350 L1016 240" stroke="${boisSombre}" stroke-width="6" stroke-linecap="round"/>
      <path d="M842 246 L1010 246 M848 288 L1004 288" stroke="${bois}" stroke-width="5" stroke-linecap="round"/>
      ${morues(248)}${morues(290)}
      <path d="M842 243 L1010 243" stroke="${neigeC}" stroke-width="2.500" stroke-linecap="round" opacity="0.9"/>
      ${tonneau(1042, 350, 1.05)}
      <ellipse cx="1042" cy="304" rx="15" ry="4" fill="${nuit ? '#5a6672' : '#9fb0bd'}"/>
      <path d="M1066 350 Q1080 322 1100 350 Z" fill="${nuit ? '#2a2620' : '#6b5a3a'}"/><path d="M1068 348 l6 -10 l6 10 M1078 348 l5 -12 l6 12 M1088 348 l4 -8 l5 8" stroke="#b9a37a" stroke-width="1" fill="none"/>

      <!-- ===== le bout du quai : la pierre levée ===== -->
      <path d="M1562 350 Q1560 300 1572 276 Q1586 266 1596 280 Q1604 310 1600 350 Z" fill="${nuit ? '#3a3f48' : '#7d838a'}"/>
      <path d="M1586 268 Q1596 272 1596 280 Q1604 310 1600 350 L1584 350 Q1590 310 1586 268 Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M1574 296 l0 12 l6 -6 M1584 292 l0 14 M1576 318 l8 0 l-4 10 M1588 316 l0 12 l-6 -4 M1574 334 l12 0" stroke="#b8432b" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1562 282 Q1574 270 1588 272 Q1576 276 1566 288 Z" fill="${neigeC}"/>
      </g>

      <!--persos-->
      ${neige({ n: 180, largeur: L })}
    </svg>`,
    joueur: { x: 606, y: 132, scale: 1.05 },
    places: nbPnj <= 1
      ? [{ x: 250, y: 140, scale: 1.0, miroir: true }]
      : [
          { x: 0, y: 144, scale: 0.97, miroir: true },
          { x: 150, y: 148, scale: 0.95, miroir: true },
          { x: 318, y: 148, scale: 0.95 },
          { x: 462, y: 138, scale: 1.0 },
        ],
  };
}
