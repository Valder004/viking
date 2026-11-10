// Morceaux de décor partagés entre plusieurs scènes.

/** Vagues en bande horizontale, décalées par animation. */
export function vagues(y, cls, couleur = '#ffffff', opacite = 0.08) {
  let d = `M-80 ${y}`;
  for (let x = -60; x <= 880; x += 40) d += ` Q${x} ${y - 6} ${x + 20} ${y}`;
  return `<path class="${cls}" d="${d} L880 450 L-80 450 Z" fill="${couleur}" opacity="${opacite}"/>`;
}

/**
 * Le pont du drakkar vu depuis le banc de nage : mât et voile derrière les personnages,
 * bastingage et boucliers devant. Renvoie { fond, devant } à placer autour de <!--persos-->.
 */
export function pont({ nuit = false, voile = 'pleine', roulis = '' } = {}) {
  const bois = nuit ? '#1e150e' : '#3a2a1c';
  const boisClair = nuit ? '#2a1d12' : '#4a3626';
  const voileCouleur = nuit ? '#4a3b2b' : '#9a3b1f';
  const voileSvg = {
    pleine: `<path d="M330 92 L470 92 L478 230 L322 230 Z" fill="${voileCouleur}"/>
      <path d="M330 92 L470 92 L478 230 L322 230 Z" fill="#ffffff" opacity="0.08"/>
      ${[350, 378, 406, 434].map((x) => `<rect x="${x}" y="92" width="10" height="138" fill="#f4efe6" opacity="0.22"/>`).join('')}`,
    dechiree: `<path d="M330 92 L470 92 L474 160 L440 150 L452 200 L410 180 L420 230 L322 230 Z" fill="${voileCouleur}"/>
      <path d="M452 200 L468 240 L440 226 Z" fill="${voileCouleur}" opacity="0.7"/>`,
    pliee: `<rect x="326" y="92" width="150" height="14" rx="4" fill="${voileCouleur}"/>`,
  }[voile];

  const fond = `
    <g class="${roulis}">
      <rect x="396" y="40" width="8" height="300" fill="${bois}"/>
      <rect x="324" y="88" width="152" height="6" fill="${bois}"/>
      ${voileSvg}
      <line x1="400" y1="40" x2="250" y2="330" stroke="${bois}" stroke-width="2"/>
      <line x1="400" y1="40" x2="550" y2="330" stroke="${bois}" stroke-width="2"/>
    </g>`;

  const boucliers = [60, 150, 240, 330, 420, 510, 600, 690].map((x, i) =>
    `<circle cx="${x}" cy="372" r="34" fill="${['#b8432b', '#d9a441', '#1f3a5f', '#f4efe6'][i % 4]}" opacity="${nuit ? 0.75 : 1}"/><circle cx="${x}" cy="372" r="7" fill="#8b9096"/>`).join('');

  const devant = `
    <g class="${roulis}">
      <path d="M0 350 Q400 320 800 350 L800 450 L0 450 Z" fill="${boisClair}"/>
      <path d="M0 350 Q400 320 800 350 L800 362 Q400 332 0 362 Z" fill="${bois}"/>
      ${boucliers}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${i * 140 + 30}" y="398" width="6" height="52" fill="${bois}" transform="rotate(${-18 + i * 2} ${i * 140 + 33} 450)"/>`).join('')}
    </g>`;

  return { fond, devant };
}
