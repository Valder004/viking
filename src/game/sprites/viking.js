// Le viking du joueur, dessiné en calques SVG dans une boîte 200×300.
// Chaque calque est une fonction (apparence, etat) => string SVG.
// `etat` est optionnel : il sert à afficher les blessures (bandeau, bandage…).

export const OPTIONS = {
  peau: ['#f3d6b8', '#e2b894', '#c88f66', '#8d5a3b'],
  cheveux: ['#f0d58c', '#c4762e', '#6b3a1e', '#2b1d14', '#d8d2c6'],
  coiffure: [
    { id: 'court', nom: 'Court' },
    { id: 'long', nom: 'Long' },
    { id: 'tresses', nom: 'Tresses' },
    { id: 'rase', nom: 'Rasé' },
  ],
  barbe: [
    { id: 'aucune', nom: 'Aucune' },
    { id: 'courte', nom: 'Courte' },
    { id: 'longue', nom: 'Longue' },
    { id: 'tressee', nom: 'Tressée' },
  ],
  peinture: [
    { id: 'aucune', nom: 'Aucune' },
    { id: 'bande', nom: 'Bande' },
    { id: 'lignes', nom: 'Trois lignes' },
    { id: 'oeil', nom: 'Œil marqué' },
  ],
  peintureCouleur: ['#1f3a5f', '#8a1c1c', '#1f1b16', '#f4efe6'],
  tenue: ['#5c6b4a', '#7a4a2e', '#3f4a66', '#6e3b3b', '#2b2b2b'],
  casque: [
    { id: 'aucun', nom: 'Aucun' },
    { id: 'simple', nom: 'Calotte' },
    { id: 'nasal', nom: 'Nasal' },
    { id: 'cuir', nom: 'Cuir' },
  ],
  motif: [
    { id: 'uni', nom: 'Uni' },
    { id: 'croix', nom: 'Croix' },
    { id: 'quartiers', nom: 'Quartiers' },
    { id: 'spirale', nom: 'Spirale' },
  ],
  bouclierCouleurs: ['#b8432b', '#d9a441', '#1f3a5f', '#f4efe6', '#2b2b2b', '#3e7a5a'],
  arme: [
    { id: 'hache', nom: 'Hache' },
    { id: 'epee', nom: 'Épée' },
    { id: 'lance', nom: 'Lance' },
    { id: 'arc', nom: 'Arc' },
  ],
};

export const APPARENCE_DEFAUT = {
  peau: OPTIONS.peau[1],
  cheveux: OPTIONS.cheveux[1],
  coiffure: 'long',
  barbe: 'courte',
  peinture: 'aucune',
  peintureCouleur: OPTIONS.peintureCouleur[0],
  tenue: OPTIONS.tenue[0],
  casque: 'aucun',
  motif: 'croix',
  bouclier1: OPTIONS.bouclierCouleurs[0],
  bouclier2: OPTIONS.bouclierCouleurs[3],
  arme: 'hache',
};

export function apparenceAuHasard() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const id = (arr) => pick(arr).id;
  return {
    peau: pick(OPTIONS.peau),
    cheveux: pick(OPTIONS.cheveux),
    coiffure: id(OPTIONS.coiffure),
    barbe: id(OPTIONS.barbe),
    peinture: id(OPTIONS.peinture),
    peintureCouleur: pick(OPTIONS.peintureCouleur),
    tenue: pick(OPTIONS.tenue),
    casque: id(OPTIONS.casque),
    motif: id(OPTIONS.motif),
    bouclier1: pick(OPTIONS.bouclierCouleurs),
    bouclier2: pick(OPTIONS.bouclierCouleurs),
    arme: id(OPTIONS.arme),
  };
}

const OMBRE = 'rgba(0,0,0,0.22)';

// ---- Calques ---------------------------------------------------------------

function corps(a) {
  return `
    <g id="jambes">
      <rect x="78" y="200" width="20" height="70" fill="#3a2d22"/>
      <rect x="102" y="200" width="20" height="70" fill="#3a2d22"/>
      <rect x="74" y="262" width="28" height="18" rx="4" fill="#241b14"/>
      <rect x="98" y="262" width="28" height="18" rx="4" fill="#241b14"/>
    </g>
    <g id="tunique">
      <path d="M70 120 L130 120 L142 215 L58 215 Z" fill="${a.tenue}"/>
      <path d="M100 120 L130 120 L142 215 L100 215 Z" fill="${OMBRE}"/>
      <rect x="62" y="178" width="76" height="10" fill="#3a2d22"/>
      <rect x="94" y="176" width="12" height="14" fill="#c9a24a"/>
      <!-- bras -->
      <rect x="52" y="124" width="20" height="62" rx="8" fill="${a.tenue}"/>
      <rect x="128" y="124" width="20" height="62" rx="8" fill="${a.tenue}"/>
      <rect x="128" y="124" width="20" height="62" rx="8" fill="${OMBRE}"/>
    </g>
    <g id="mains">
      <circle cx="62" cy="192" r="10" fill="${a.peau}"/>
      <circle cx="138" cy="192" r="10" fill="${a.peau}"/>
    </g>`;
}

function tete(a) {
  return `
    <g id="tete">
      <rect x="90" y="98" width="20" height="26" fill="${a.peau}"/>
      <ellipse cx="100" cy="78" rx="26" ry="30" fill="${a.peau}"/>
      <path d="M100 48 A26 30 0 0 1 126 78 L126 92 A26 30 0 0 1 100 108 Z" fill="${OMBRE}" opacity="0.6"/>
      <circle cx="90" cy="76" r="2.6" fill="#1f1b16"/>
      <circle cx="110" cy="76" r="2.6" fill="#1f1b16"/>
      <path d="M94 92 Q100 96 106 92" stroke="#1f1b16" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`;
}

function peinture(a) {
  const c = a.peintureCouleur;
  switch (a.peinture) {
    case 'bande':
      return `<rect x="74" y="70" width="52" height="11" fill="${c}" opacity="0.9"/>`;
    case 'lignes':
      return `<g stroke="${c}" stroke-width="3" stroke-linecap="round">
        <line x1="80" y1="84" x2="88" y2="100"/><line x1="88" y1="82" x2="94" y2="100"/><line x1="96" y1="84" x2="100" y2="100"/></g>`;
    case 'oeil':
      return `<circle cx="110" cy="76" r="9" fill="none" stroke="${c}" stroke-width="3.5"/>`;
    default:
      return '';
  }
}

function barbe(a) {
  const c = a.cheveux;
  switch (a.barbe) {
    case 'courte':
      return `<path d="M76 84 Q100 118 124 84 L124 92 Q100 124 76 92 Z" fill="${c}"/>`;
    case 'longue':
      return `<path d="M76 84 Q78 130 100 142 Q122 130 124 84 Q100 112 76 84 Z" fill="${c}"/>`;
    case 'tressee':
      return `<path d="M76 84 Q78 118 100 124 Q122 118 124 84 Q100 112 76 84 Z" fill="${c}"/>
        <rect x="95" y="118" width="10" height="34" rx="4" fill="${c}"/>
        <rect x="93" y="130" width="14" height="4" fill="#c9a24a"/><rect x="93" y="144" width="14" height="4" fill="#c9a24a"/>`;
    default:
      return '';
  }
}

function cheveux(a) {
  const c = a.cheveux;
  switch (a.coiffure) {
    case 'court':
      return `<path d="M74 72 Q74 42 100 44 Q126 42 126 72 Q114 60 100 60 Q86 60 74 72 Z" fill="${c}"/>`;
    case 'long':
      return `<path d="M74 72 Q74 42 100 44 Q126 42 126 72 L130 130 L118 128 L118 84 Q100 62 82 84 L82 128 L70 130 Z" fill="${c}"/>`;
    case 'tresses':
      return `<path d="M74 72 Q74 42 100 44 Q126 42 126 72 Q114 60 100 60 Q86 60 74 72 Z" fill="${c}"/>
        <rect x="68" y="70" width="9" height="70" rx="4" fill="${c}"/><rect x="123" y="70" width="9" height="70" rx="4" fill="${c}"/>
        <rect x="66" y="100" width="13" height="4" fill="#c9a24a"/><rect x="121" y="100" width="13" height="4" fill="#c9a24a"/>`;
    case 'rase':
      return `<path d="M74 72 Q74 42 100 44 Q126 42 126 72 Q114 60 100 60 Q86 60 74 72 Z" fill="${c}" opacity="0.3"/>`;
    default:
      return '';
  }
}

function casque(a) {
  switch (a.casque) {
    case 'simple':
      return `<path d="M72 70 Q72 38 100 38 Q128 38 128 70 Z" fill="#8b9096"/><rect x="70" y="66" width="60" height="7" fill="#5f6469"/>`;
    case 'nasal':
      return `<path d="M72 70 Q72 38 100 38 Q128 38 128 70 Z" fill="#8b9096"/><rect x="70" y="66" width="60" height="7" fill="#5f6469"/>
        <rect x="96" y="70" width="8" height="24" fill="#5f6469"/>`;
    case 'cuir':
      return `<path d="M72 70 Q72 42 100 42 Q128 42 128 70 Z" fill="#5a3b24"/><rect x="70" y="66" width="60" height="7" fill="#3a2516"/>
        <rect x="68" y="70" width="10" height="24" fill="#5a3b24"/><rect x="122" y="70" width="10" height="24" fill="#5a3b24"/>`;
    default:
      return '';
  }
}

function bouclier(a) {
  const c1 = a.bouclier1;
  const c2 = a.bouclier2;
  let motif = '';
  switch (a.motif) {
    case 'croix':
      motif = `<rect x="18" y="156" width="88" height="16" fill="${c2}"/><rect x="54" y="120" width="16" height="88" fill="${c2}"/>`;
      break;
    case 'quartiers':
      motif = `<path d="M62 164 L62 120 A44 44 0 0 1 106 164 Z" fill="${c2}"/><path d="M62 164 L62 208 A44 44 0 0 1 18 164 Z" fill="${c2}"/>`;
      break;
    case 'spirale':
      motif = `<path d="M62 164 m0 -30 a30 30 0 1 1 -30 30 a20 20 0 1 1 20 -20 a10 10 0 1 1 -10 10" fill="none" stroke="${c2}" stroke-width="8" stroke-linecap="round"/>`;
      break;
    default:
      motif = '';
  }
  return `
    <g id="bouclier">
      <circle cx="62" cy="164" r="46" fill="#2b2118"/>
      <circle cx="62" cy="164" r="44" fill="${c1}"/>
      <clipPath id="clip-bouclier"><circle cx="62" cy="164" r="44"/></clipPath>
      <g clip-path="url(#clip-bouclier)">${motif}</g>
      <path d="M62 120 A44 44 0 0 1 106 164 L62 164 Z" fill="${OMBRE}" opacity="0.5" clip-path="url(#clip-bouclier)"/>
      <circle cx="62" cy="164" r="9" fill="#8b9096"/>
    </g>`;
}

function arme(a) {
  switch (a.arme) {
    case 'hache':
      return `<g id="arme"><rect x="136" y="110" width="6" height="110" fill="#5a3b24"/>
        <path d="M139 108 L166 100 Q172 122 166 144 L139 136 Z" fill="#8b9096"/><path d="M139 108 L166 100 L166 122 L139 122 Z" fill="${OMBRE}"/></g>`;
    case 'epee':
      return `<g id="arme"><rect x="136" y="80" width="7" height="110" fill="#b7bcc2"/><rect x="128" y="186" width="22" height="6" fill="#c9a24a"/>
        <rect x="136" y="192" width="7" height="26" fill="#5a3b24"/><circle cx="139.5" cy="220" r="5" fill="#c9a24a"/></g>`;
    case 'lance':
      return `<g id="arme"><rect x="136" y="20" width="6" height="230" fill="#5a3b24"/><path d="M139 0 L150 30 L128 30 Z" fill="#8b9096"/></g>`;
    case 'arc':
      return `<g id="arme"><path d="M140 100 Q180 190 140 280" fill="none" stroke="#5a3b24" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="100" x2="140" y2="280" stroke="#d8d2c6" stroke-width="1.5"/></g>`;
    default:
      return '';
  }
}

function blessures(etat) {
  if (!etat) return '';
  const b = etat.blessures;
  let s = '';
  if (b.includes('bras')) s += `<rect x="50" y="140" width="24" height="26" rx="4" fill="#e9e2d2"/><rect x="50" y="150" width="24" height="4" fill="#8a1c1c" opacity="0.6"/>`;
  if (b.includes('jambe')) s += `<rect x="100" y="222" width="24" height="22" fill="#e9e2d2"/>`;
  if (b.includes('oeil')) s += `<path d="M74 70 L128 82 L128 88 L74 76 Z" fill="#1f1b16"/><circle cx="110" cy="78" r="8" fill="#1f1b16"/>`;
  if (b.includes('cotes')) s += `<rect x="62" y="150" width="76" height="22" fill="#e9e2d2" opacity="0.9"/>`;
  return `<g id="blessures">${s}</g>`;
}

/** Contenu SVG (sans balise <svg>) du viking, dans une boîte 200×300. */
export function vikingContenu(a, etat) {
  return [bouclier(a), corps(a), tete(a), peinture(a), barbe(a), cheveux(a), casque(a), blessures(etat), arme(a)].join('');
}

/** SVG autonome, pour l'aperçu du créateur. */
export function vikingSvg(a, etat, attrs = '') {
  return `<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" ${attrs}>${vikingContenu(a, etat)}</svg>`;
}
