// La grande halle du jarl : piliers sculptés, long foyer, siège haut, foule dans l'ombre.
export function halle() {
  const foule = Array.from({ length: 14 }, (_, i) => {
    const x = 30 + i * 56 + (i % 3) * 7;
    const h = 60 + (i % 4) * 8;
    return `<g opacity="0.55"><circle cx="${x}" cy="${330 - h}" r="12" fill="#0b0907"/><rect x="${x - 14}" y="${340 - h}" width="28" height="${h}" rx="6" fill="#0b0907"/></g>`;
  }).join('');
  const piliers = [90, 230, 570, 710].map((x) =>
    `<rect x="${x - 16}" y="0" width="32" height="340" fill="#2b1d12"/>
     <rect x="${x - 16}" y="0" width="10" height="340" fill="#3d2a1a"/>
     <path d="M${x - 8} 60 l8 -14 l8 14 l-8 14 Z M${x - 8} 120 l8 -14 l8 14 l-8 14 Z M${x - 8} 180 l8 -14 l8 14 l-8 14 Z" fill="#5a3f26"/>`).join('');

  return {
    svg: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-haut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#07060a"/><stop offset="1" stop-color="#1c130c"/>
        </linearGradient>
        <radialGradient id="g-feu" cx="0.5" cy="0.9" r="0.7">
          <stop offset="0" stop-color="#ff9a3c" stop-opacity="0.5"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#g-haut)"/>
      <!-- charpente -->
      <path d="M0 0 L400 -40 L800 0 L800 40 L400 10 L0 40 Z" fill="#120c07"/>
      ${piliers}
      <!-- sol -->
      <rect x="0" y="340" width="800" height="110" fill="#1a1209"/>
      <!-- estrade et siège haut -->
      <rect x="320" y="300" width="160" height="40" fill="#2b1d12"/>
      <rect x="330" y="292" width="140" height="10" fill="#3d2a1a"/>
      <rect x="360" y="150" width="80" height="150" fill="#3d2a1a"/>
      <path d="M360 150 L380 120 L400 140 L420 120 L440 150 Z" fill="#5a3f26"/>
      <rect x="372" y="200" width="56" height="100" fill="#1a1209"/>
      <!-- boucliers au mur -->
      ${[150, 650].map((x) => `<circle cx="${x}" cy="110" r="34" fill="#8a2c2c"/><circle cx="${x}" cy="110" r="8" fill="#8b9096"/><rect x="${x - 34}" y="106" width="68" height="8" fill="#d9a441"/>`).join('')}
      <!-- foule -->
      ${foule}
      <!-- lueur -->
      <rect width="800" height="450" fill="url(#g-feu)"/>
      <!-- long foyer -->
      <rect x="140" y="400" width="520" height="22" rx="8" fill="#0d0906"/>
      ${[200, 290, 380, 470, 560].map((x, i) => `
        <path class="anim-flamme ${i % 2 ? 'anim-flamme--2' : i % 3 ? 'anim-flamme--3' : ''}" d="M${x - 22} 404 Q${x - 18} 372 ${x} 358 Q${x + 2} 380 ${x + 12} 376 Q${x + 24} 384 ${x + 22} 404 Z" fill="#e8762a"/>
        <path class="anim-flamme ${i % 2 ? '' : 'anim-flamme--2'}" d="M${x - 10} 404 Q${x - 8} 384 ${x + 2} 376 Q${x + 8} 390 ${x + 10} 404 Z" fill="#ffd27a"/>`).join('')}
    </svg>`,
    joueur: { x: 600, y: 140, scale: 0.72 },
    places: [
      { x: 330, y: 95, scale: 0.68 }, // Hakon, sur l'estrade
      { x: 470, y: 150, scale: 0.66 }, // Eirik
      { x: 160, y: 160, scale: 0.66, miroir: true }, // Sigrid
      { x: 40, y: 165, scale: 0.64, miroir: true }, // Ulf
    ],
  };
}
