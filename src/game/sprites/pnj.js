// Silhouettes des personnages non joueurs, boîte 200×300, même échelle que le viking.
import { PERSONNAGES } from '../../data/personnages.js';

const OMBRE = 'rgba(0,0,0,0.25)';

function base(couleur, peau = '#e2b894') {
  return `
    <rect x="78" y="200" width="20" height="70" fill="#3a2d22"/>
    <rect x="102" y="200" width="20" height="70" fill="#3a2d22"/>
    <rect x="74" y="262" width="28" height="18" rx="4" fill="#241b14"/>
    <rect x="98" y="262" width="28" height="18" rx="4" fill="#241b14"/>
    <path d="M70 120 L130 120 L142 215 L58 215 Z" fill="${couleur}"/>
    <path d="M100 120 L130 120 L142 215 L100 215 Z" fill="${OMBRE}"/>
    <rect x="52" y="124" width="20" height="62" rx="8" fill="${couleur}"/>
    <rect x="128" y="124" width="20" height="62" rx="8" fill="${couleur}"/>
    <circle cx="62" cy="192" r="10" fill="${peau}"/><circle cx="138" cy="192" r="10" fill="${peau}"/>
    <rect x="90" y="98" width="20" height="26" fill="${peau}"/>
    <ellipse cx="100" cy="78" rx="26" ry="30" fill="${peau}"/>
    <circle cx="90" cy="76" r="2.6" fill="#1f1b16"/><circle cx="110" cy="76" r="2.6" fill="#1f1b16"/>`;
}

const DETAILS = {
  sigrid: (c) => `${base(c, '#f3d6b8')}
    <path d="M74 72 Q74 42 100 44 Q126 42 126 72 Q114 60 100 60 Q86 60 74 72 Z" fill="#c4762e"/>
    <rect x="68" y="70" width="9" height="70" rx="4" fill="#c4762e"/>
    <circle cx="62" cy="164" r="44" fill="#1f3a5f"/><circle cx="62" cy="164" r="9" fill="#8b9096"/>
    <line x1="18" y1="164" x2="106" y2="164" stroke="#f4efe6" stroke-width="12"/>`,
  ulf: (c) => `${base(c, '#d8b58f')}
    <path d="M74 72 Q74 42 100 44 Q126 42 126 72 L128 120 L118 118 L118 84 Q100 62 82 84 L82 118 L72 120 Z" fill="#d8d2c6"/>
    <path d="M76 84 Q78 150 100 160 Q122 150 124 84 Q100 112 76 84 Z" fill="#d8d2c6"/>
    <path d="M74 70 L128 82 L128 88 L74 76 Z" fill="#1f1b16"/><circle cx="110" cy="78" r="8" fill="#1f1b16"/>
    <rect x="140" y="60" width="6" height="210" fill="#5a3b24"/><circle cx="143" cy="58" r="8" fill="#5a3b24"/>`,
  eirik: (c) => `${base(c, '#f3d6b8')}
    <path d="M74 72 Q74 42 100 44 Q126 42 126 72 Q114 60 100 60 Q86 60 74 72 Z" fill="#f0d58c"/>
    <rect x="62" y="178" width="76" height="10" fill="#c9a24a"/>
    <rect x="136" y="80" width="7" height="110" fill="#b7bcc2"/><rect x="128" y="186" width="22" height="6" fill="#c9a24a"/>`,
  hakon: (c) => `${base(c, '#e2b894')}
    <path d="M58 122 L142 122 L156 220 L44 220 Z" fill="#1a1230" opacity="0.85"/>
    <path d="M70 120 L130 120 L142 215 L58 215 Z" fill="${c}"/>
    <path d="M74 72 Q74 42 100 44 Q126 42 126 72 Q114 60 100 60 Q86 60 74 72 Z" fill="#2b1d14"/>
    <path d="M76 84 Q78 136 100 146 Q122 136 124 84 Q100 112 76 84 Z" fill="#2b1d14"/>
    <path d="M74 50 L80 38 L90 50 L100 36 L110 50 L120 38 L126 50 Z" fill="#c9a24a"/>`,
  aude: (c) => `${base(c, '#f3d6b8')}
    <path d="M70 120 L130 120 L150 270 L50 270 Z" fill="${c}"/>
    <path d="M74 72 Q74 42 100 44 Q126 42 126 72 L128 130 L118 128 L118 84 Q100 62 82 84 L82 128 L72 130 Z" fill="#2b1d14"/>
    <path d="M72 52 Q100 40 128 52 L128 60 Q100 50 72 60 Z" fill="#e9e2d2"/>`,
  gautier: (c) => `${base(c, '#e2b894')}
    <path d="M74 72 Q74 42 100 44 Q126 42 126 72 Q114 60 100 60 Q86 60 74 72 Z" fill="#d8d2c6"/>
    <rect x="62" y="130" width="76" height="60" fill="#8b9096" opacity="0.7"/>`,
  anselme: (c) => `${base(c, '#e2b894')}
    <path d="M60 120 L140 120 L150 270 L50 270 Z" fill="${c}"/>
    <path d="M74 72 Q74 46 100 46 Q126 46 126 72 Q114 64 100 64 Q86 64 74 72 Z" fill="#d8d2c6"/>
    <rect x="60" y="176" width="80" height="8" fill="#5a3b24"/>`,
  parent: (c) => `${base(c, '#e2b894')}
    <path d="M70 120 L130 120 L148 270 L52 270 Z" fill="${c}"/>
    <path d="M72 60 Q100 44 128 60 L128 74 Q100 60 72 74 Z" fill="#6e5a3a"/>`,
};

export function pnjContenu(id) {
  const p = PERSONNAGES[id];
  if (!p) return '';
  return (DETAILS[id] ?? ((c) => base(c)))(p.couleur);
}
