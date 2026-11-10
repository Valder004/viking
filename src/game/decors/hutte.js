// La hutte familiale, à l'aube. Intérieur de bois, foyer central, neige par la fenêtre.
export function hutte() {
  const planches = Array.from({ length: 9 }, (_, i) =>
    `<rect x="0" y="${i * 34}" width="800" height="32" fill="${i % 2 ? '#3a2a1c' : '#42301f'}"/>`).join('');
  const neige = Array.from({ length: 14 }, (_, i) =>
    `<circle class="anim-neige ${i % 2 ? 'anim-neige--2' : ''}" cx="${560 + (i * 37) % 170}" cy="${-10 - (i * 53) % 300}" r="${1.5 + (i % 3) * 0.6}" fill="#f4efe6" opacity="0.8"/>`).join('');

  return {
    svg: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="h-lueur" cx="0.38" cy="0.78" r="0.6">
          <stop offset="0" stop-color="#ffb347" stop-opacity="0.55"/>
          <stop offset="1" stop-color="#ffb347" stop-opacity="0"/>
        </radialGradient>
        <clipPath id="h-fenetre"><rect x="560" y="80" width="170" height="130"/></clipPath>
      </defs>
      <!-- mur -->
      <g>${planches}</g>
      <rect width="800" height="450" fill="#120d08" opacity="0.55"/>
      <!-- fenêtre -->
      <rect x="552" y="72" width="186" height="146" fill="#2a1d12"/>
      <g clip-path="url(#h-fenetre)">
        <rect x="560" y="80" width="170" height="130" fill="#8ea1b5"/>
        <path d="M560 170 L600 150 L640 165 L690 140 L730 160 L730 210 L560 210 Z" fill="#dfe6ec"/>
        <path d="M560 185 L620 175 L680 190 L730 180 L730 210 L560 210 Z" fill="#f4efe6"/>
        ${neige}
      </g>
      <rect x="644" y="72" width="6" height="146" fill="#2a1d12"/>
      <!-- sol -->
      <rect x="0" y="330" width="800" height="120" fill="#24180f"/>
      <rect x="0" y="330" width="800" height="6" fill="#120d08"/>
      <!-- lueur du feu -->
      <rect width="800" height="450" fill="url(#h-lueur)"/>
      <!-- foyer -->
      <ellipse cx="300" cy="392" rx="90" ry="18" fill="#0d0906"/>
      <g fill="#4a4038">
        <rect x="222" y="372" width="30" height="16" rx="6"/><rect x="258" y="378" width="34" height="16" rx="6"/>
        <rect x="300" y="376" width="32" height="16" rx="6"/><rect x="340" y="372" width="30" height="16" rx="6"/>
      </g>
      <path d="M240 386 L310 380 L362 388" stroke="#2b2118" stroke-width="10" stroke-linecap="round" fill="none"/>
      <g>
        <path class="anim-flamme" d="M270 382 Q262 340 290 322 Q286 352 302 356 Q312 336 304 318 Q334 346 326 382 Z" fill="#e8762a"/>
        <path class="anim-flamme anim-flamme--2" d="M282 382 Q278 352 296 338 Q296 356 306 358 Q312 348 308 338 Q324 356 318 382 Z" fill="#ffb347"/>
        <path class="anim-flamme anim-flamme--3" d="M292 382 Q292 364 300 354 Q304 366 310 368 Q314 378 310 382 Z" fill="#fff0c2"/>
      </g>
      <g fill="#9b8f80" opacity="0.5">
        <circle class="anim-fumee" cx="300" cy="320" r="10"/>
        <circle class="anim-fumee anim-fumee--2" cx="292" cy="324" r="8"/>
        <circle class="anim-fumee anim-fumee--3" cx="310" cy="322" r="9"/>
      </g>
      <!-- étagère et objets -->
      <rect x="40" y="150" width="200" height="8" fill="#2a1d12"/>
      <rect x="60" y="118" width="26" height="32" fill="#5a4a38"/><rect x="100" y="126" width="40" height="24" rx="3" fill="#6e5a3a"/>
      <circle cx="190" cy="134" r="14" fill="#7a6a52"/>
      <!-- banc -->
      <rect x="430" y="300" width="160" height="12" fill="#3a2a1c"/>
      <rect x="440" y="312" width="12" height="30" fill="#2a1d12"/><rect x="568" y="312" width="12" height="30" fill="#2a1d12"/>
    </svg>`,
    joueur: { x: 420, y: 150, scale: 0.72 },
    places: [{ x: 110, y: 170, scale: 0.68 }],
  };
}
