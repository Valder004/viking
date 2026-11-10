// Le port au petit matin : brume, drakkar à quai, trois corbeaux sur le mât.
export function port(etat) {
  const nuit = etat?.flags?.c1_nuit;
  const ciel = nuit ? ['#0a0d16', '#1a2233'] : ['#5d6f85', '#9fb0c2'];
  const mer = nuit ? '#0f1621' : '#3f5873';
  const vague = (y, cls, op) => `<path class="${cls}" d="M-80 ${y} Q-60 ${y - 6} -40 ${y} T0 ${y} T40 ${y} T80 ${y} T120 ${y} T160 ${y} T200 ${y} T240 ${y} T280 ${y} T320 ${y} T360 ${y} T400 ${y} T440 ${y} T480 ${y} T520 ${y} T560 ${y} T600 ${y} T640 ${y} T680 ${y} T720 ${y} T760 ${y} T800 ${y} T840 ${y} T880 ${y} L880 450 L-80 450 Z" fill="#ffffff" opacity="${op}"/>`;

  return {
    svg: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="p-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${ciel[0]}"/><stop offset="1" stop-color="${ciel[1]}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#p-ciel)"/>
      ${nuit ? '<circle cx="640" cy="80" r="26" fill="#e9e2d2" opacity="0.9"/>' : '<circle cx="640" cy="110" r="40" fill="#f4e7c8" opacity="0.5"/>'}
      <!-- montagnes -->
      <path d="M0 260 L120 150 L220 230 L330 120 L440 240 L560 170 L680 250 L800 190 L800 300 L0 300 Z" fill="${nuit ? '#121826' : '#46566a'}"/>
      <path d="M0 300 L90 240 L200 290 L320 230 L430 300 L540 250 L660 300 L800 260 L800 320 L0 320 Z" fill="${nuit ? '#0d121c' : '#35414f'}"/>
      <!-- mer -->
      <rect x="0" y="300" width="800" height="150" fill="${mer}"/>
      ${vague(318, 'anim-vague', 0.08)}
      ${vague(350, 'anim-vague anim-vague--2', 0.06)}
      ${vague(390, 'anim-vague', 0.05)}
      <!-- drakkar -->
      <g transform="translate(120 0)">
        <rect x="248" y="90" width="6" height="230" fill="#3a2a1c"/>
        <rect x="190" y="118" width="122" height="6" fill="#3a2a1c"/>
        <path d="M196 124 L306 124 L300 200 L202 200 Z" fill="${nuit ? '#4a3b2b' : '#9a3b1f'}"/>
        <path d="M196 124 L306 124 L300 200 L202 200 Z" fill="#ffffff" opacity="0.08"/>
        ${[214, 236, 258, 280].map((x) => `<rect x="${x}" y="124" width="8" height="76" fill="#f4efe6" opacity="0.25"/>`).join('')}
        <path d="M130 300 Q150 250 220 250 L330 250 Q400 250 420 300 Z" fill="#3a2a1c"/>
        <path d="M130 300 Q150 270 220 270 L330 270 Q400 270 420 300 Z" fill="#2a1d12"/>
        <path d="M130 300 Q110 270 125 230 Q128 250 140 262 Z" fill="#3a2a1c"/>
        <path d="M420 300 Q440 270 425 230 Q422 250 410 262 Z" fill="#3a2a1c"/>
        ${[170, 210, 250, 290, 330, 370].map((x, i) => `<circle cx="${x}" cy="262" r="12" fill="${['#b8432b', '#d9a441', '#1f3a5f'][i % 3]}"/><circle cx="${x}" cy="262" r="3" fill="#8b9096"/>`).join('')}
        <!-- trois corbeaux -->
        <g fill="#0b0907">
          <path class="anim-oiseau" d="M240 84 q6 -6 12 0 q-2 6 -6 8 q-4 -2 -6 -8 Z"/>
          <path class="anim-oiseau anim-oiseau--2" d="M252 82 q6 -6 12 0 q-2 6 -6 8 q-4 -2 -6 -8 Z"/>
          <path class="anim-oiseau anim-oiseau--3" d="M198 110 q6 -6 12 0 q-2 6 -6 8 q-4 -2 -6 -8 Z"/>
        </g>
      </g>
      <!-- brume -->
      <ellipse class="anim-brume" cx="300" cy="320" rx="420" ry="40" fill="#dfe6ec" opacity="0.35"/>
      <ellipse class="anim-brume anim-brume--2" cx="600" cy="345" rx="380" ry="34" fill="#dfe6ec" opacity="0.3"/>
      <!-- quai -->
      <rect x="0" y="380" width="800" height="70" fill="#2a2018"/>
      ${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 82}" y="380" width="78" height="70" fill="${i % 2 ? '#2f261c' : '#261d15'}"/>`).join('')}
      <rect x="0" y="376" width="800" height="6" fill="#1a1209"/>
      ${[60, 740].map((x) => `<rect x="${x - 10}" y="340" width="20" height="50" fill="#1a1209"/><rect x="${x - 12}" y="336" width="24" height="8" fill="#241b14"/>`).join('')}
    </svg>`,
    joueur: { x: 560, y: 150, scale: 0.78 },
    places: [
      { x: 110, y: 170, scale: 0.72, miroir: true },
      { x: 300, y: 185, scale: 0.68, miroir: true },
      { x: 420, y: 180, scale: 0.68 },
      { x: 680, y: 190, scale: 0.66 },
    ],
  };
}
