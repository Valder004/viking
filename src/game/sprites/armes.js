// L'arme et le bouclier du joueur accrochés à un mur (hutte du chapitre 1).
// Origine : le haut de l'arme. L'ensemble tient dans environ 60×150.
const ACIER = '#aeb4ba';
const BOIS = '#6b4a2e';

const ARMES = {
  hache: `<rect x="-2.500" y="0" width="5" height="140" rx="2" fill="${BOIS}"/>
    <path d="M-4 4 L4 4 L26 -6 Q34 18 26 46 Q16 34 4 28 L-4 28 Z" fill="${ACIER}"/>
    <path d="M26 -6 Q34 18 26 46 Q27 18 22 -4 Z" fill="#e3e7ea"/>`,
  epee: `<path d="M-4 96 L-4 12 L0 0 L4 12 L4 96 Z" fill="#c9ced3"/><path d="M0 0 L4 12 L4 96 L0 96 Z" fill="rgba(0,0,0,0.2)"/>
    <rect x="-11" y="95" width="22" height="5.500" rx="2" fill="#d6a640"/><rect x="-2.800" y="100" width="5.600" height="20" fill="#3a2516"/>
    <path d="M-3 122 l-3 5 l6 4 l6 -4 l-3 -5 Z" fill="#d6a640"/>`,
  lance: `<rect x="-2.300" y="24" width="4.600" height="126" rx="2" fill="${BOIS}"/>
    <path d="M0 -6 Q11 12 3 32 L-3 32 Q-11 12 0 -6 Z" fill="${ACIER}"/><path d="M0 -6 Q11 12 3 32 L0 32 Z" fill="rgba(0,0,0,0.2)"/>`,
  arc: `<path d="M0 0 Q36 48 4 76 Q36 104 0 150" fill="none" stroke="${BOIS}" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="0" y2="150" stroke="#e9dfc8" stroke-width="1.200"/>`,
};

export function armeMurale(a, x, y) {
  const r = 27;
  const cy = 104;
  let motif = '';
  if (a.motif === 'croix') motif = `<rect x="${-r}" y="${cy - 5}" width="${r * 2}" height="10" fill="${a.bouclier2}"/><rect x="-5" y="${cy - r}" width="10" height="${r * 2}" fill="${a.bouclier2}"/>`;
  if (a.motif === 'quartiers') motif = `<path d="M0 ${cy} L0 ${cy - r} A${r} ${r} 0 0 1 ${r} ${cy} Z M0 ${cy} L0 ${cy + r} A${r} ${r} 0 0 1 ${-r} ${cy} Z" fill="${a.bouclier2}"/>`;
  if (a.motif === 'spirale') motif = `<path d="M0 ${cy - 18} a18 18 0 1 1 -18 18 a12 12 0 1 1 12 -12 a6 6 0 1 1 -6 6" fill="none" stroke="${a.bouclier2}" stroke-width="5" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y})">
    <path d="M-14 -10 L14 -10" stroke="#2a1c12" stroke-width="5" stroke-linecap="round"/>
    <g transform="rotate(6)">${ARMES[a.arme] ?? ''}</g>
    <clipPath id="am-clip"><circle cx="0" cy="${cy}" r="${r - 2}"/></clipPath>
    <circle cx="0" cy="${cy}" r="${r}" fill="#2a1c12"/><circle cx="0" cy="${cy}" r="${r - 2}" fill="${a.bouclier1}"/>
    <g clip-path="url(#am-clip)">${motif}<path d="M0 ${cy - r} A${r} ${r} 0 0 1 0 ${cy + r} Z" fill="rgba(0,0,0,0.25)"/></g>
    <circle cx="0" cy="${cy}" r="6.500" fill="#8e949a"/><circle cx="-2" cy="${cy - 2}" r="1.800" fill="rgba(255,255,255,0.55)"/>
  </g>`;
}
