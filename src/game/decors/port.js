// Le port : drakkar à quai, village sur la rive, montagnes enneigées.
// Deux ambiances (nuit / petit matin). Les corbeaux et le chien suivent l'histoire.
import { SVG, degrade, halo, vignette, vagues, ecume, etoiles, maison, sapins, proue, tonneau, caisse, corbeau, mouette, nuage, neige } from './elements.js';

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
  void nuit; // (les corbeaux restent visibles de nuit : la lune les découpe)
  // Le chien reste près des caisses tant qu'on ne l'a pas chassé ; à l'aube, il ne revient que nourri.
  const avecChien = scene === 'c1_aube' ? Boolean(f.chien_nourri) : scene.startsWith('c1_') && !f.chien_chasse;

  const bois = nuit ? '#231810' : '#3a2718';
  const boisSombre = nuit ? '#150e09' : '#2a1c12';
  const terre = nuit ? '#0c1016' : '#27333a';

  // Ligne de plat-bord du drakkar : courbe de Bézier quadratique
  const bord = (t) => ({ x: 150 + 560 * t, y: (1 - t) ** 2 * 292 + 2 * t * (1 - t) * 346 + t ** 2 * 286 });
  const boucliers = Array.from({ length: 9 }, (_, i) => {
    const p = bord(0.14 + i * 0.09);
    const c = ['#b8432b', '#d9a441', '#1f3a5f', '#e9dfc8'][i % 4];
    return `<circle cx="${p.x.toFixed(1)}" cy="${(p.y + 5).toFixed(1)}" r="14" fill="${boisSombre}"/><circle cx="${p.x.toFixed(1)}" cy="${(p.y + 5).toFixed(1)}" r="12" fill="${c}" opacity="${nuit ? 0.7 : 1}"/>
      <path d="M${p.x.toFixed(1)} ${(p.y - 7).toFixed(1)} A12 12 0 0 1 ${p.x.toFixed(1)} ${(p.y + 17).toFixed(1)} Z" fill="rgba(0,0,0,0.25)"/><circle cx="${p.x.toFixed(1)}" cy="${(p.y + 5).toFixed(1)}" r="3.500" fill="#8e949a"/>`;
  }).join('');

  const flocons = Array.from({ length: 26 }, (_, i) =>
    `<circle class="anim-neige ${i % 2 ? 'anim-neige--2' : ''}" cx="${(i * 131) % 800}" cy="${-20 - ((i * 67) % 420)}" r="${1 + (i % 3) * 0.5}" fill="#fff" opacity="0.6"/>`).join('');

  return {
    svg: SVG(`
      <defs>
        ${degrade('p-ciel', nuit ? [[0, '#060915'], [0.6, '#14203a'], [1, '#2a3a58']] : [[0, '#4f637d'], [0.55, '#a5b2c2'], [1, '#f0cfa8']])}
        ${degrade('p-mer', nuit ? [[0, '#16233a'], [1, '#070b14']] : [[0, '#7f95a8'], [1, '#2f4558']])}
        ${halo('p-astre', nuit ? '#dfe8ff' : '#ffd9a0', nuit ? 0.45 : 0.75)}
        ${halo('p-lampe', '#ffb04a', 0.6)}
      </defs>
      <rect width="800" height="450" fill="url(#p-ciel)"/>
      ${nuit ? etoiles(80, 200) : `${nuage(180, 90, 1.1, '#f6dcc0', 0.5)}${nuage(600, 60, 0.8, '#f6dcc0', 0.4)}${nuage(430, 130, 0.6, '#fff', 0.3)}`}
      ${nuit
        ? `<circle cx="384" cy="40" r="110" fill="url(#p-astre)"/><circle cx="384" cy="40" r="30" fill="#eef1f6"/><circle cx="374" cy="32" r="6" fill="#cfd6e2" opacity="0.6"/><circle cx="394" cy="52" r="4.500" fill="#cfd6e2" opacity="0.6"/>`
        : `<circle cx="560" cy="190" r="170" fill="url(#p-astre)"/><circle cx="560" cy="194" r="26" fill="#fff0cf"/>`}

      <!-- montagnes -->
      <g transform="translate(0 -34)">
      <path d="M0 250 L70 168 L130 214 L210 120 L290 208 L350 160 L430 236 L500 176 L570 232 L650 150 L730 222 L800 180 L800 300 L0 300 Z" fill="${nuit ? '#1b2740' : '#7c8da3'}"/>
      <path d="M210 120 L236 150 L218 146 L204 158 L190 144 Z M650 150 L676 180 L656 174 L640 186 L630 172 Z M70 168 L88 190 L72 186 L58 196 Z M350 160 L366 180 L350 176 L338 184 Z M500 176 L514 194 L500 190 L488 198 Z" fill="${nuit ? '#aab6cc' : '#fff'}" opacity="${nuit ? 0.6 : 0.9}"/>
      <path d="M0 290 L90 222 L190 268 L300 214 L420 280 L540 232 L660 284 L800 240 L800 310 L0 310 Z" fill="${nuit ? '#111a2c' : '#566579'}"/>
      <rect x="0" y="236" width="800" height="60" fill="${nuit ? '#2a3a58' : '#e9dccb'}" opacity="0.22"/>

      </g>
      <g transform="translate(0 -56)">
      <!-- la rive et le village -->
      <path d="M0 246 Q120 226 240 244 Q320 256 372 288 L0 292 Z" fill="${terre}"/>
      ${sapins(6, 330, 250, 36, nuit ? '#080c12' : '#1e2a2c', 12)}
      ${maison(22, 268, 74, { nuit })}${maison(118, 262, 96, { nuit })}${maison(238, 274, 62, { nuit })}
      <path d="M0 276 L340 284" stroke="${boisSombre}" stroke-width="2"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M${10 + i * 28} 270 l0 12" stroke="${boisSombre}" stroke-width="2"/>`).join('')}

      <!-- la mer -->
      <rect x="0" y="286" width="800" height="170" fill="url(#p-mer)"/>
      ${Array.from({ length: 9 }, (_, i) => `<rect class="anim-lueur" x="${(nuit ? 384 : 560) - 40 + i * 4}" y="${292 + i * 6}" width="${80 - i * 8}" height="2" rx="1" fill="${nuit ? '#dfe8ff' : '#fff0cf'}" opacity="${0.5 - i * 0.04}"/>`).join('')}
      ${vagues(298, 'anim-vague', '#ffffff', 0.07)}
      ${ecume(304, 'anim-vague anim-vague--2', 0.3)}

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

      <!-- brume sur l'eau -->
      <ellipse class="anim-brume" cx="260" cy="316" rx="380" ry="20" fill="#dfe6ec" opacity="${nuit ? 0.16 : 0.4}"/>
      <ellipse class="anim-brume anim-brume--2" cx="620" cy="328" rx="340" ry="18" fill="#dfe6ec" opacity="${nuit ? 0.14 : 0.34}"/>
      ${nuit ? '' : `${mouette(250, 120, 1)}${mouette(292, 138, 0.7, 'anim-oiseau anim-oiseau--2')}${mouette(610, 96, 0.8, 'anim-oiseau anim-oiseau--3')}`}

      <!-- le quai -->
      <path d="M0 346 L800 346 L800 530 L0 530 Z" fill="${nuit ? '#1a130d' : '#33271c'}"/>
      ${Array.from({ length: 23 }, (_, i) => { const x = -380 + i * 70; return `<path d="M${x} 530 L${400 + (x - 400) * 0.5} 346" stroke="rgba(0,0,0,0.4)" stroke-width="1.5"/>`; }).join('')}
      <rect x="0" y="344" width="800" height="5" fill="${nuit ? '#3a2c20' : '#5a4634'}"/>
      ${[[30, 1], [770, 1]].map(([x]) => `<rect x="${x - 11}" y="258" width="22" height="100" fill="${boisSombre}"/><rect x="${x}" y="258" width="11" height="100" fill="rgba(0,0,0,0.3)"/><rect x="${x - 14}" y="252" width="28" height="9" rx="2" fill="${bois}"/>
        <path d="M${x - 13} 300 q13 7 26 0 M${x - 13} 307 q13 7 26 0 M${x - 13} 314 q13 7 26 0" stroke="#b9a37a" stroke-width="3" fill="none"/>`).join('')}
      <!-- lanterne -->
      <path d="M30 252 L30 214 L52 214" stroke="${boisSombre}" stroke-width="4" fill="none"/>
      <path d="M52 214 l0 8" stroke="#1a110a" stroke-width="1.5"/>
      ${nuit ? '<circle class="anim-lueur" cx="52" cy="232" r="60" fill="url(#p-lampe)"/>' : ''}
      <rect x="45" y="222" width="14" height="20" rx="2" fill="${nuit ? '#ffcf7a' : '#6b5a3a'}"/><path d="M45 222 l7 -6 l7 6 Z M45 242 h14" fill="#1a110a" stroke="#1a110a" stroke-width="2"/>
      <path d="M52 222 l0 20" stroke="#1a110a" stroke-width="1.2"/>
      <!-- marchandises -->
      ${tonneau(108, 350, 1.15)}${caisse(162, 350, 1.05)}${caisse(150, 316, 0.8)}${tonneau(726, 350, 0.95)}
      <ellipse cx="220" cy="352" rx="24" ry="7" fill="none" stroke="#b9a37a" stroke-width="4"/><ellipse cx="220" cy="349" rx="17" ry="5" fill="none" stroke="#b9a37a" stroke-width="4"/>
      ${avecChien ? chien(196, 317) : ''}
      </g>

      <!--persos-->
      ${neige({ n: 90 })}
      ${vignette('p-vig', nuit ? 0.7 : 0.45)}`),
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
