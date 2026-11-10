// Dessin d'un personnage complet (joueur ou PNJ) dans une boîte 200×300, pieds à y≈285.
// Tout est paramétrique : le joueur et les PNJ passent par la même fonction, avec des
// configurations différentes. Style : aplats, ombre franche à droite, liserés de lumière.

let compteur = 0;

const OMBRE = 'rgba(12,8,24,0.24)';
const OMBRE_FORTE = 'rgba(12,8,24,0.4)';
const LUMIERE = 'rgba(255,255,255,0.18)';
const CUIR = '#5a3b24';
const CUIR_SOMBRE = '#3a2516';
const ACIER = '#aeb4ba';
const ACIER_SOMBRE = '#6f757b';
const OR = '#d6a640';
const LIN = '#e9dfc8';

const CARRURES = { fine: 30, moyenne: 34, large: 40 };

/** Tresse : chaîne de maillons entre deux points. */
function tresse(x1, y1, x2, y2, couleur, n = 8) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${4.6 - t * 1.2}" ry="5.4" fill="${couleur}" transform="rotate(${i % 2 ? 18 : -18} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    s += `<path d="M${(x - 2.5).toFixed(1)} ${(y + 1).toFixed(1)} l5 -2" stroke="${OMBRE_FORTE}" stroke-width="1"/>`;
  }
  s += `<rect x="${x2 - 4}" y="${y2 + 2}" width="8" height="4" rx="1.5" fill="${OR}"/>`;
  return s;
}

export function personnage(c) {
  const uid = `p${++compteur}`;
  const ep = CARRURES[c.carrure ?? 'moyenne'];
  const L = 100 - ep;
  const R = 100 + ep;
  const peau = c.peau ?? '#e2b894';
  const poil = c.cheveux ?? '#6b3a1e';
  const tenue = c.tenue ?? '#5c6b4a';
  const galon = c.galon ?? OR;
  const pantalon = c.pantalon ?? '#4a3b2e';
  const bless = c.blessures ?? [];
  const p = []; // calques, dans l'ordre

  // ---- Ombre au sol
  p.push(`<ellipse cx="100" cy="286" rx="${ep + 14}" ry="7" fill="rgba(0,0,0,0.32)"/>`);

  // ---- Cape (dos)
  if (c.cape) {
    p.push(`<path d="M${L - 4} 106 Q100 92 ${R + 4} 106 L${R + 18} 256 Q100 270 ${L - 18} 256 Z" fill="${c.cape}"/>
      <path d="M100 96 Q${R} 96 ${R + 4} 106 L${R + 18} 256 Q${R - 10} 266 100 267 Z" fill="${OMBRE}"/>
      <path d="M${L - 10} 180 Q${L - 6} 220 ${L - 16} 254" stroke="${OMBRE}" stroke-width="3" fill="none"/>`);
  }

  // ---- Cheveux (dos)
  if (c.coiffure === 'long' || c.coiffure === 'tresses') {
    p.push(`<path d="M77 50 Q74 28 100 27 Q126 28 123 50 L${c.coiffure === 'long' ? '130 116 Q100 126 70 116' : '126 98 Q100 104 74 98'} Z" fill="${poil}"/>
      <path d="M100 27 Q126 28 123 50 L130 116 Q114 122 100 123 Z" fill="${OMBRE}" opacity="${c.coiffure === 'long' ? 1 : 0}"/>`);
  }
  if (c.coiffure === 'foulard') {
    p.push(`<path d="M78 46 Q72 80 76 112 L124 112 Q128 80 122 46 Z" fill="${c.foulard ?? '#b9ad94'}"/>`);
  }

  // ---- Carquois (dos) pour l'arc
  if (c.arme === 'arc') {
    p.push(`<g transform="rotate(18 ${L + 10} 120)">
      <rect x="${L + 2}" y="84" width="14" height="64" rx="5" fill="${CUIR}"/>
      <rect x="${L + 2}" y="84" width="14" height="6" fill="${CUIR_SOMBRE}"/>
      ${[0, 5, 10].map((d) => `<path d="M${L + 4 + d} 84 l0 -16 l-3 6 m3 -6 l3 6" stroke="#d8d2c6" stroke-width="1.6" fill="none"/>`).join('')}
    </g>`);
  }

  // ---- Jambes ou robe
  if (c.robe) {
    p.push(`<ellipse cx="90" cy="283" rx="9" ry="4" fill="${CUIR_SOMBRE}"/><ellipse cx="110" cy="283" rx="9" ry="4" fill="${CUIR_SOMBRE}"/>
      <path d="M${L + 2} 106 Q100 95 ${R - 2} 106 L${R - 1} 160 L${R + 12} 274 Q100 284 ${L - 12} 274 L${L + 1} 160 Z" fill="${c.robe}"/>
      <path d="M100 97 Q${R - 8} 98 ${R - 2} 106 L${R - 1} 160 L${R + 12} 274 Q${R - 10} 281 100 281 Z" fill="${OMBRE}"/>
      <path d="M${L - 11} 266 Q100 276 ${R + 11} 266" stroke="${galon}" stroke-width="4" fill="none"/>
      <path d="M${L - 11} 266 Q100 276 ${R + 11} 266" stroke="${OMBRE_FORTE}" stroke-width="1.2" stroke-dasharray="2 4" fill="none"/>
      <path d="M92 200 Q90 240 86 272 M110 200 Q112 240 116 272" stroke="${OMBRE}" stroke-width="2" fill="none"/>`);
    if (c.tablier) {
      p.push(`<path d="M${L + 9} 116 L${R - 9} 116 L${R + 1} 256 Q100 262 ${L - 1} 256 Z" fill="${c.tablier}"/>
        <path d="M100 116 L${R - 9} 116 L${R + 1} 256 Q${R - 14} 260 100 260 Z" fill="${OMBRE}"/>
        <path d="M${L + 12} 116 L${L + 9} 104 M${R - 12} 116 L${R - 9} 104" stroke="${c.tablier}" stroke-width="6"/>
        <ellipse cx="${L + 12}" cy="117" rx="6" ry="4.5" fill="${OR}"/><ellipse cx="${R - 12}" cy="117" rx="6" ry="4.5" fill="${OR}"/>
        <ellipse cx="${L + 12}" cy="117" rx="2.5" ry="1.8" fill="${CUIR_SOMBRE}"/><ellipse cx="${R - 12}" cy="117" rx="2.5" ry="1.8" fill="${CUIR_SOMBRE}"/>
        <path d="M${L + 14} 121 Q100 140 ${R - 14} 121" stroke="${CUIR_SOMBRE}" stroke-width="1" fill="none"/>
        ${[0.2, 0.35, 0.5, 0.65, 0.8].map((t, i) => `<circle cx="${L + 14 + (R - L - 28) * t}" cy="${121 + 9.5 * (1 - Math.pow(2 * t - 1, 2))}" r="2.2" fill="${['#7fb3c8', '#c85a3a', '#e6c35c', '#c85a3a', '#7fb3c8'][i]}"/>`).join('')}`);
    }
    if (c.corde) {
      p.push(`<path d="M${L + 2} 160 Q100 168 ${R - 2} 160" stroke="#cbb994" stroke-width="3.5" fill="none"/>
        <path d="M${L + 14} 163 L${L + 12} 206 M${L + 18} 163 L${L + 20} 198" stroke="#cbb994" stroke-width="3" stroke-linecap="round"/>`);
    }
  } else {
    p.push(`
      <path d="M82 198 L99 198 L98 262 L84 262 Z" fill="${pantalon}"/>
      <path d="M101 198 L118 198 L116 262 L102 262 Z" fill="${pantalon}"/>
      <path d="M101 198 L118 198 L116 262 L102 262 Z" fill="${OMBRE}"/>
      <!-- bandes molletières -->
      <path d="M83.5 234 L98 234 L98 262 L84 262 Z" fill="#9c8a66"/><path d="M102 234 L116.5 234 L116 262 L102 262 Z" fill="#9c8a66"/>
      <path d="M102 234 L116.5 234 L116 262 L102 262 Z" fill="${OMBRE}"/>
      <path d="M84 240 l14 -4 M84 247 l14 -4 M84 254 l14 -4 M84 261 l14 -4 M102 240 l14 -4 M102 247 l14 -4 M102 254 l14 -4 M102 261 l14 -4" stroke="${OMBRE_FORTE}" stroke-width="1.2"/>
      <!-- bottes -->
      <path d="M82 259 L99 259 L99 280 Q99 285 93 285 L77 285 Q75 277 82 271 Z" fill="${CUIR_SOMBRE}"/>
      <path d="M101 259 L118 259 L118 271 Q125 277 123 285 L107 285 Q101 285 101 280 Z" fill="${CUIR_SOMBRE}"/>
      <path d="M82 262 L99 262 M101 262 L118 262" stroke="${CUIR}" stroke-width="3"/>
      <path d="M78 283 L98 283 M103 283 L122 283" stroke="#1a110a" stroke-width="2.5" stroke-linecap="round"/>`);

    // Tunique
    p.push(`
      <path d="M${L} 107 Q100 94 ${R} 107 L${R + 2} 158 L${R + 9} 208 Q100 217 ${L - 9} 208 L${L - 2} 158 Z" fill="${tenue}"/>
      <path d="M100 96 Q${R - 8} 98 ${R} 107 L${R + 2} 158 L${R + 9} 208 Q${R - 10} 214 100 214 Z" fill="${OMBRE}"/>
      <path d="M${L - 8.5} 203 Q100 212 ${R + 8.5} 203" stroke="${galon}" stroke-width="5.5" fill="none"/>
      <path d="M${L - 8.5} 203 Q100 212 ${R + 8.5} 203" stroke="${OMBRE_FORTE}" stroke-width="1.4" stroke-dasharray="1.5 4" fill="none"/>
      <path d="M94 172 Q92 190 90 206 M106 172 Q108 190 111 206" stroke="${OMBRE}" stroke-width="2" fill="none"/>
      <!-- encolure -->
      <path d="M89 99 L100 121 L111 99 Z" fill="${LIN}"/>
      <path d="M89 99 L100 121 L111 99" stroke="${galon}" stroke-width="3" fill="none" stroke-linejoin="round"/>`);

    if (c.plastron) {
      p.push(`<path d="M${L + 6} 108 Q100 100 ${R - 6} 108 L${R - 4} 158 L${L + 4} 158 Z" fill="${c.plastron}"/>
        <path d="M100 102 Q${R - 12} 103 ${R - 6} 108 L${R - 4} 158 L100 158 Z" fill="${OMBRE}"/>
        <path d="M89 101 L100 121 L111 101" fill="${LIN}"/>
        <path d="M100 121 L100 158" stroke="${CUIR_SOMBRE}" stroke-width="1.5"/>
        ${[128, 138, 148].map((y) => `<path d="M96 ${y} l8 3 M104 ${y} l-8 3" stroke="${LIN}" stroke-width="1.1"/>`).join('')}
        <path d="M${L + 6} 112 Q100 104 ${R - 6} 112" stroke="${CUIR_SOMBRE}" stroke-width="1.5" fill="none" stroke-dasharray="2 3"/>`);
    }
    if (c.mailles) {
      p.push(`<defs><pattern id="${uid}-m" width="6" height="5" patternUnits="userSpaceOnUse"><path d="M0 2.5 a3 2.5 0 0 0 6 0" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="0.9"/></pattern></defs>
        <path d="M${L} 107 Q100 94 ${R} 107 L${R + 2} 158 L${R + 7} 196 Q100 203 ${L - 7} 196 L${L - 2} 158 Z" fill="url(#${uid}-m)"/>`);
    }
  }

  // ---- Ceinture
  if (!c.robe) {
    p.push(`
      <rect x="${L - 2}" y="156" width="${R - L + 4}" height="9" fill="${CUIR_SOMBRE}"/>
      <rect x="${L - 2}" y="156" width="${R - L + 4}" height="2" fill="${LUMIERE}"/>
      <rect x="94" y="153.5" width="11" height="14" rx="2" fill="none" stroke="${OR}" stroke-width="2.4"/>
      <path d="M105 160 L112 160 L112 190 L107 186 Z" fill="${CUIR_SOMBRE}"/>
      <rect x="${L + 5}" y="163" width="15" height="17" rx="5" fill="${CUIR}"/>
      <path d="M${L + 5} 169 q7.5 5 15 0" stroke="${CUIR_SOMBRE}" stroke-width="1.5" fill="none"/>
      <circle cx="${L + 12.5}" cy="173" r="1.5" fill="${OR}"/>
      <path d="M${R - 16} 165 l4 22 l4 -2 l-3 -20 Z" fill="${ACIER_SOMBRE}"/><rect x="${R - 18}" y="162" width="8" height="6" rx="1" fill="${CUIR}"/>`);
  }

  // ---- Fourrure et fibule
  if (c.cape) {
    if (c.fourrure) {
      p.push(`<path d="M${L - 6} 114 Q100 90 ${R + 6} 114" stroke="${c.fourrure}" stroke-width="19" fill="none" stroke-linecap="round"/>
        <path d="M${L - 6} 118 Q100 96 ${R + 6} 118" stroke="${OMBRE_FORTE}" stroke-width="4" fill="none" stroke-dasharray="2 5" stroke-linecap="round"/>
        <path d="M${L - 6} 109 Q100 85 ${R + 6} 109" stroke="${LUMIERE}" stroke-width="3" fill="none" stroke-dasharray="3 6" stroke-linecap="round"/>`);
    } else {
      p.push(`<path d="M${L - 4} 110 Q100 96 ${R + 4} 110" stroke="${c.cape}" stroke-width="10" fill="none" stroke-linecap="round"/>`);
    }
    p.push(`<circle cx="${R - 9}" cy="111" r="5.5" fill="${OR}"/><circle cx="${R - 9}" cy="111" r="2.2" fill="${CUIR_SOMBRE}"/>
      <path d="M${R - 15} 106 L${R - 3} 116" stroke="${ACIER}" stroke-width="1.6"/>`);
  }

  // ---- Bras gauche (à gauche de l'image)
  const manche = c.robe ?? tenue;
  p.push(`
    <path d="M${L + 5} 111 Q${L - 9} 134 ${L - 4} 158 L${L - 2} 186" stroke="${manche}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${L - 4} 164 L${L - 2} 186" stroke="${c.robe ? manche : CUIR}" stroke-width="15" stroke-linecap="butt"/>
    ${c.robe ? '' : `<path d="M${L - 10} 168 l14 2 M${L - 9.5} 175 l14 2 M${L - 9} 182 l14 2" stroke="${CUIR_SOMBRE}" stroke-width="1.3"/>`}
    <circle cx="${L - 2}" cy="193" r="8.5" fill="${peau}"/>`);

  // ---- Bras droit
  const brasDroit = `
    <path d="M${R - 5} 111 Q${R + 9} 134 ${R + 4} 158 L${R + 2} 186" stroke="${manche}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${R - 5} 111 Q${R + 9} 134 ${R + 4} 158 L${R + 2} 186" stroke="${OMBRE}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${R + 4} 164 L${R + 2} 186" stroke="${c.robe ? manche : CUIR}" stroke-width="15"/>
    ${c.robe ? '' : `<path d="M${R - 4} 170 l14 -2 M${R - 4.5} 177 l14 -2 M${R - 5} 184 l14 -2" stroke="${CUIR_SOMBRE}" stroke-width="1.3"/>`}
    ${c.anneaux ? `<path d="M${R - 2} 136 l15 -3" stroke="${OR}" stroke-width="4" stroke-linecap="round"/><path d="M${L + 2} 133 l-15 3" stroke="${OR}" stroke-width="4" stroke-linecap="round"/>` : ''}`;
  p.push(brasDroit);

  // ---- Cou et tête
  p.push(`
    <path d="M91 80 L109 80 L110 101 Q100 108 90 101 Z" fill="${peau}"/>
    <path d="M91 86 Q100 97 109 86 L109 82 L91 82 Z" fill="${OMBRE}"/>
    <ellipse cx="79.5" cy="63" rx="4" ry="6" fill="${peau}"/><ellipse cx="120.5" cy="63" rx="4" ry="6" fill="${peau}"/>
    <ellipse cx="120.5" cy="63" rx="4" ry="6" fill="${OMBRE}"/>
    <path d="M80 50 Q80 31 100 31 Q120 31 120 50 L120 68 Q120 84 100 91 Q80 84 80 68 Z" fill="${peau}"/>
    <path d="M100 31 Q120 31 120 50 L120 68 Q120 84 100 91 Q108 76 108 58 Q108 42 100 31 Z" fill="${OMBRE}" opacity="0.7"/>`);

  // Peinture de guerre (sous les yeux)
  const pc = c.peintureCouleur ?? '#1f3a5f';
  if (c.peinture === 'bande') p.push(`<path d="M80 54 L120 54 L120 66 L80 66 Z" fill="${pc}" opacity="0.82"/>`);
  if (c.peinture === 'lignes') p.push(`<path d="M86 66 l-2 14 M90.5 67 l-1 14 M95 66 l0 13 M105 66 l0 13 M109.5 67 l1 14 M114 66 l2 14" stroke="${pc}" stroke-width="2.4" stroke-linecap="round" opacity="0.9"/>`);
  if (c.peinture === 'oeil') p.push(`<circle cx="109" cy="60" r="8" fill="${pc}" opacity="0.85"/><path d="M109 66 L111 84" stroke="${pc}" stroke-width="3" stroke-linecap="round" opacity="0.85"/>`);

  // Visage
  const sourcilCouleur = c.sourcils ?? poil;
  const sourcils = {
    neutre: 'M85.5 54 L96 53.5 M104 53.5 L114.5 54',
    dur: 'M85.5 51.5 L96.5 55.5 M103.5 55.5 L114.5 51.5',
    triste: 'M85.5 55.5 L96 52.5 M104 52.5 L114.5 55.5',
    narquois: 'M85.5 54.5 L96 54 M104 52 L114.5 50.5',
  }[c.expression ?? 'neutre'];
  const bouche = {
    neutre: 'M94 79 Q100 80.5 106 79',
    dur: 'M94 80 Q100 77 106 80',
    triste: 'M94 80 Q100 78 106 80',
    narquois: 'M94 79.5 Q102 81 107.5 76',
    sourire: 'M93 78 Q100 84 107 78',
  }[c.expression ?? 'neutre'];
  const oeilGauche = `<ellipse cx="91" cy="60.5" rx="3.6" ry="2.8" fill="#f7f1e3"/><circle cx="91.6" cy="60.7" r="2" fill="${c.yeux ?? '#3a2a1c'}"/><circle cx="92.3" cy="60" r="0.7" fill="#fff"/><path d="M87 58.6 Q91 56.6 95 58.6" stroke="${OMBRE_FORTE}" stroke-width="1.2" fill="none"/>`;
  const oeilDroit = `<ellipse cx="109" cy="60.5" rx="3.6" ry="2.8" fill="#f7f1e3"/><circle cx="109.6" cy="60.7" r="2" fill="${c.yeux ?? '#3a2a1c'}"/><circle cx="110.3" cy="60" r="0.7" fill="#fff"/><path d="M105 58.6 Q109 56.6 113 58.6" stroke="${OMBRE_FORTE}" stroke-width="1.2" fill="none"/>`;
  const borgne = c.cacheOeil || bless.includes('oeil');
  p.push(`
    ${oeilGauche}${borgne ? '' : oeilDroit}
    <path d="${sourcils}" stroke="${sourcilCouleur}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    <path d="M100.5 60 L97.5 71.5 Q100.5 74 104 71.5" stroke="${OMBRE_FORTE}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${c.age ? `<path d="M86 65.5 q5 2.5 9 0.5 M105 66 q4 2 9 -0.5 M88 44 q12 -3 24 0 M90 39 q10 -2 20 0" stroke="${OMBRE_FORTE}" stroke-width="1" fill="none" opacity="0.7"/>` : ''}
    ${c.cicatrice ? `<path d="M113 46 L117 72" stroke="#b56a5a" stroke-width="1.6" stroke-linecap="round"/>` : ''}`);
  if (borgne) {
    p.push(`<path d="M79 47 L121 66" stroke="#1c1612" stroke-width="3"/><path d="M103 55 Q109 52 115 56 Q116 64 109 67 Q103 64 103 55 Z" fill="#1c1612"/>`);
  }

  // Barbe
  const pb = c.barbeCouleur ?? poil;
  if (c.barbe && c.barbe !== 'aucune') {
    const formes = {
      courte: 'M80.5 64 Q80 86 100 95 Q120 86 119.5 64 Q114 75 100 75 Q86 75 80.5 64 Z',
      longue: 'M80.5 64 Q76 108 100 132 Q124 108 119.5 64 Q114 75 100 75 Q86 75 80.5 64 Z',
      tressee: 'M80.5 64 Q79 92 100 102 Q121 92 119.5 64 Q114 75 100 75 Q86 75 80.5 64 Z',
    };
    p.push(`<path d="${formes[c.barbe]}" fill="${pb}"/>
      <path d="M100 75 Q114 75 119.5 64 ${c.barbe === 'longue' ? 'Q124 108 100 132' : c.barbe === 'tressee' ? 'Q121 92 100 102' : 'Q120 86 100 95'} Z" fill="${OMBRE}"/>`);
    if (c.barbe === 'longue') p.push(`<path d="M90 90 Q91 106 96 120 M100 92 L100 128 M110 90 Q109 106 104 120" stroke="${OMBRE_FORTE}" stroke-width="1.2" fill="none"/>`);
    if (c.barbe === 'tressee') p.push(tresse(93, 100, 91, 132, pb, 5) + tresse(107, 100, 109, 132, pb, 5));
    p.push(`<path d="M89 76 Q95 71 100 75 Q105 71 111 76 Q105 80 100 77.5 Q95 80 89 76 Z" fill="${pb}"/>
      <path d="M89 76 Q95 71 100 75 Q105 71 111 76" stroke="${LUMIERE}" stroke-width="1" fill="none"/>`);
  }
  p.push(`<path d="${bouche}" stroke="#4a241c" stroke-width="2" fill="none" stroke-linecap="round"/>`);

  // Cheveux (face)
  const calotte = `M79 54 Q74 27 100 26 Q126 27 121 54 Q118 41 106 39 Q92 37 86 43 Q81 47 79 54 Z`;
  switch (c.coiffure) {
    case 'court':
      p.push(`<path d="${calotte}" fill="${poil}"/><path d="M100 26 Q126 27 121 54 Q118 41 106 39 Z" fill="${OMBRE}"/><path d="M86 34 Q98 28 112 33" stroke="${LUMIERE}" stroke-width="2" fill="none" stroke-linecap="round"/>`);
      break;
    case 'long':
      p.push(`<path d="${calotte}" fill="${poil}"/><path d="M100 26 Q126 27 121 54 Q118 41 106 39 Z" fill="${OMBRE}"/>
        <path d="M79 50 Q72 82 76 110 L84 108 Q80 80 83 54 Z" fill="${poil}"/><path d="M121 50 Q128 82 124 110 L116 108 Q120 80 117 54 Z" fill="${poil}"/>
        <path d="M121 50 Q128 82 124 110 L116 108 Q120 80 117 54 Z" fill="${OMBRE}"/>
        <path d="M86 34 Q98 28 112 33" stroke="${LUMIERE}" stroke-width="2" fill="none" stroke-linecap="round"/>`);
      break;
    case 'tresses':
      p.push(`<path d="${calotte}" fill="${poil}"/><path d="M100 26 Q126 27 121 54 Q118 41 106 39 Z" fill="${OMBRE}"/>
        <path d="M100 27 L100 40" stroke="${OMBRE_FORTE}" stroke-width="1.2"/>
        ${tresse(77, 60, 73, 138, poil, 9)}${tresse(123, 60, 127, 138, poil, 9)}
        <path d="M86 34 Q98 28 112 33" stroke="${LUMIERE}" stroke-width="2" fill="none" stroke-linecap="round"/>`);
      break;
    case 'rase':
      p.push(`<path d="${calotte}" fill="${poil}" opacity="0.28"/>
        <path d="M91 42 Q92 20 100 19 Q108 20 109 42 Q100 37 91 42 Z" fill="${poil}"/>
        <path d="M100 19 Q108 20 109 42 Q104 39 100 38 Z" fill="${OMBRE}"/>
        <path d="M95 24 l10 3 M94 30 l12 3 M93.5 36 l13 3" stroke="${OMBRE_FORTE}" stroke-width="1.1"/>`);
      break;
    case 'foulard':
      p.push(`<path d="M78 56 Q73 26 100 25 Q127 26 122 56 Q116 42 100 42 Q84 42 78 56 Z" fill="${c.foulard ?? '#b9ad94'}"/>
        <path d="M100 25 Q127 26 122 56 Q116 42 100 42 Z" fill="${OMBRE}"/>
        <path d="M82 44 Q100 36 118 44" stroke="${OMBRE_FORTE}" stroke-width="1" fill="none"/>
        <path d="M84 45 Q100 40 116 45 L114 49 Q100 44 86 49 Z" fill="${poil}"/>`);
      break;
    case 'tonsure':
      p.push(`<path d="M79 56 Q76 40 86 36 Q84 46 88 50 Q82 50 79 56 Z M121 56 Q124 40 114 36 Q116 46 112 50 Q118 50 121 56 Z" fill="${poil}"/>
        <path d="M84 37 Q100 30 116 37" stroke="${poil}" stroke-width="5" fill="none" stroke-linecap="round"/>`);
      break;
    default:
      break;
  }

  // Bandeau / voile
  if (c.bandeau) {
    p.push(`<path d="M79 44 Q100 37 121 44 L121 49 Q100 42 79 49 Z" fill="${c.bandeau}"/>
      <path d="M79 44 Q100 37 121 44" stroke="${LUMIERE}" stroke-width="1" fill="none"/>
      ${c.bandeau === OR ? `<path d="M96 40.5 l4 -5 l4 5 l-4 4 Z" fill="#8a1c1c"/>` : ''}`);
  }

  // Casque
  if (c.casque && c.casque !== 'aucun') {
    if (c.casque === 'cuir') {
      p.push(`<path d="M77 51 Q76 23 100 23 Q124 23 123 51 Z" fill="${CUIR}"/>
        <path d="M100 23 Q124 23 123 51 L100 51 Z" fill="${OMBRE}"/>
        <path d="M100 23 L100 51 M88 26 Q86 38 86 51 M112 26 Q114 38 114 51" stroke="${CUIR_SOMBRE}" stroke-width="1.5" fill="none" stroke-dasharray="2.5 2.5"/>
        <rect x="75" y="47" width="50" height="6.5" rx="2" fill="${CUIR_SOMBRE}"/>
        <path d="M77 53 L85 53 L84 76 Q78 73 77 62 Z M123 53 L115 53 L116 76 Q122 73 123 62 Z" fill="${CUIR}"/>
        <path d="M123 53 L115 53 L116 76 Q122 73 123 62 Z" fill="${OMBRE}"/>`);
    } else {
      p.push(`<path d="M77 51 Q76 22 100 22 Q124 22 123 51 Z" fill="${ACIER}"/>
        <path d="M100 22 Q124 22 123 51 L100 51 Z" fill="${OMBRE}"/>
        <path d="M84 30 Q90 24 98 24" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M100 22 L100 51" stroke="${ACIER_SOMBRE}" stroke-width="3"/>
        <rect x="75" y="46.5" width="50" height="7" rx="2" fill="${ACIER_SOMBRE}"/>
        ${[80, 88, 96, 104, 112, 120].map((x) => `<circle cx="${x}" cy="50" r="1.3" fill="${ACIER}"/>`).join('')}
        <circle cx="100" cy="22" r="2.4" fill="${ACIER_SOMBRE}"/>`);
      if (c.casque === 'nasal') p.push(`<path d="M96.5 52 L103.5 52 L102.5 72 Q100 74 97.5 72 Z" fill="${ACIER_SOMBRE}"/><path d="M98.5 53 L98.8 70" stroke="${ACIER}" stroke-width="1"/>`);
    }
  }

  // ---- Bouclier (tenu main gauche)
  if (c.bouclier) {
    const b = c.bouclier;
    const cx = L - 6;
    const cy = 172;
    const r = 37;
    let motif = '';
    if (b.motif === 'croix') motif = `<rect x="${cx - r}" y="${cy - 7}" width="${r * 2}" height="14" fill="${b.c2}"/><rect x="${cx - 7}" y="${cy - r}" width="14" height="${r * 2}" fill="${b.c2}"/>`;
    if (b.motif === 'quartiers') motif = `<path d="M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z M${cx} ${cy} L${cx} ${cy + r} A${r} ${r} 0 0 1 ${cx - r} ${cy} Z" fill="${b.c2}"/>`;
    if (b.motif === 'spirale') motif = `<path d="M${cx} ${cy - 26} a26 26 0 1 1 -26 26 a18 18 0 1 1 18 -18 a10 10 0 1 1 -10 10" fill="none" stroke="${b.c2}" stroke-width="7" stroke-linecap="round"/>`;
    p.push(`<g>
      <clipPath id="${uid}-b"><circle cx="${cx}" cy="${cy}" r="${r - 3}"/></clipPath>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${CUIR_SOMBRE}"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="${b.c1}"/>
      <g clip-path="url(#${uid}-b)">
        ${motif}
        ${[-22, -11, 0, 11, 22].map((d) => `<path d="M${cx + d} ${cy - r} L${cx + d} ${cy + r}" stroke="rgba(0,0,0,0.16)" stroke-width="1.2"/>`).join('')}
        <path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="${OMBRE}"/>
        <path d="M${cx - 24} ${cy - 18} A30 30 0 0 1 ${cx - 6} ${cy - 30}" stroke="${LUMIERE}" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>
      ${Array.from({ length: 10 }, (_, i) => `<circle cx="${(cx + Math.cos((i * Math.PI) / 5) * (r - 1.5)).toFixed(1)}" cy="${(cy + Math.sin((i * Math.PI) / 5) * (r - 1.5)).toFixed(1)}" r="1.4" fill="${ACIER}"/>`).join('')}
      <circle cx="${cx}" cy="${cy}" r="9.5" fill="${ACIER_SOMBRE}"/><circle cx="${cx}" cy="${cy}" r="7.5" fill="${ACIER}"/>
      <path d="M${cx} ${cy - 7.5} A7.5 7.5 0 0 1 ${cx} ${cy + 7.5} Z" fill="${OMBRE}"/>
      <circle cx="${cx - 2.5}" cy="${cy - 2.5}" r="2" fill="rgba(255,255,255,0.6)"/>
    </g>`);
  }

  // ---- Arme (main droite)
  const ax = R + 2;
  const armes = {
    hache: `<rect x="${ax - 2.5}" y="96" width="5.5" height="140" rx="2" fill="#6b4a2e"/>
      <rect x="${ax + 1}" y="96" width="2" height="140" fill="${OMBRE}"/>
      <path d="M${ax - 3} 180 l7 2 M${ax - 3} 186 l7 2 M${ax - 3} 198 l7 2 M${ax - 3} 204 l7 2" stroke="${CUIR_SOMBRE}" stroke-width="1.6"/>
      <path d="M${ax - 4} 99 L${ax + 4} 99 L${ax + 25} 89 Q${ax + 33} 112 ${ax + 25} 140 Q${ax + 16} 128 ${ax + 4} 123 L${ax - 4} 123 Z" fill="${ACIER}"/>
      <path d="M${ax + 25} 89 Q${ax + 33} 112 ${ax + 25} 140 Q${ax + 26} 112 ${ax + 21} 91 Z" fill="#e3e7ea"/>
      <path d="M${ax + 4} 111 L${ax + 24} 112 L${ax + 25} 140 Q${ax + 16} 128 ${ax + 4} 123 Z" fill="${OMBRE}"/>
      <rect x="${ax - 4}" y="104" width="8" height="14" fill="${ACIER_SOMBRE}"/>`,
    epee: `<path d="M${ax - 4} 178 L${ax - 4} 98 L${ax} 84 L${ax + 4} 98 L${ax + 4} 178 Z" fill="#c9ced3"/>
      <path d="M${ax} 84 L${ax + 4} 98 L${ax + 4} 178 L${ax} 178 Z" fill="${OMBRE}"/>
      <path d="M${ax} 98 L${ax} 174" stroke="${ACIER_SOMBRE}" stroke-width="1.4"/>
      <path d="M${ax - 3} 100 L${ax - 3} 170" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
      <rect x="${ax - 11}" y="177" width="22" height="5.5" rx="2" fill="${OR}"/>
      <rect x="${ax - 2.8}" y="182" width="5.6" height="20" fill="${CUIR_SOMBRE}"/>
      <path d="M${ax - 3} 205 l-3 5 l6 4 l6 -4 l-3 -5 Z" fill="${OR}"/>`,
    lance: `<rect x="${ax - 2.3}" y="26" width="4.6" height="258" rx="2" fill="#6b4a2e"/>
      <rect x="${ax + 0.5}" y="26" width="1.8" height="258" fill="${OMBRE}"/>
      <path d="M${ax} 0 Q${ax + 11} 18 ${ax + 3} 38 L${ax - 3} 38 Q${ax - 11} 18 ${ax} 0 Z" fill="${ACIER}"/>
      <path d="M${ax} 0 Q${ax + 11} 18 ${ax + 3} 38 L${ax} 38 Z" fill="${OMBRE}"/>
      <path d="M${ax} 4 L${ax} 34" stroke="#e3e7ea" stroke-width="1.2"/>
      <rect x="${ax - 3.5}" y="38" width="7" height="10" fill="${ACIER_SOMBRE}"/>
      <path d="M${ax - 3} 52 l6 2 M${ax - 3} 57 l6 2" stroke="#b8432b" stroke-width="2"/>`,
    arc: `<path d="M${ax} 92 Q${ax + 38} 142 ${ax + 4} 188 Q${ax + 38} 238 ${ax} 286" fill="none" stroke="#6b4a2e" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M${ax} 92 Q${ax + 38} 142 ${ax + 4} 188" fill="none" stroke="${LUMIERE}" stroke-width="1.4"/>
      <line x1="${ax}" y1="92" x2="${ax}" y2="286" stroke="#e9dfc8" stroke-width="1.2"/>
      <rect x="${ax - 1}" y="180" width="8" height="18" rx="3" fill="${CUIR_SOMBRE}"/>`,
    baton: `<path d="M${ax + 1} 60 Q${ax - 1} 160 ${ax + 1} 284" stroke="#5a4028" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M${ax + 3} 60 Q${ax + 1} 160 ${ax + 3} 284" stroke="${OMBRE}" stroke-width="2" fill="none"/>
      <path d="M${ax + 1} 62 Q${ax - 12} 52 ${ax - 8} 40 Q${ax - 2} 30 ${ax + 9} 36 Q${ax + 14} 42 ${ax + 9} 47 Q${ax + 5} 42 ${ax + 1} 46 Q${ax - 2} 52 ${ax + 4} 60 Z" fill="#5a4028"/>
      <circle cx="${ax + 6}" cy="40" r="1.5" fill="#e9dfc8"/>
      <path d="M${ax - 1} 70 l-8 16 M${ax + 3} 70 l7 20" stroke="#cbb994" stroke-width="1"/>
      <path d="M${ax - 9} 86 l-3 12 l5 -1 Z" fill="#1c1612"/><path d="M${ax + 10} 90 l-2 12 l5 -2 Z" fill="#d8d2c6"/>
      <circle cx="${ax - 4}" cy="78" r="2" fill="#7fb3c8"/><circle cx="${ax + 6}" cy="80" r="2" fill="#c85a3a"/>`,
  };
  if (c.arme && armes[c.arme]) p.push(armes[c.arme]);

  // Main droite par-dessus l'arme
  p.push(`<circle cx="${R + 2}" cy="193" r="8.5" fill="${peau}"/><circle cx="${R + 2}" cy="193" r="8.5" fill="${OMBRE}"/>
    ${c.arme ? `<path d="M${R - 4} 190 q6 -3 12 0 M${R - 4} 194 q6 -3 12 0 M${R - 4} 198 q6 -3 12 0" stroke="${OMBRE_FORTE}" stroke-width="1" fill="none"/>` : ''}`);

  // ---- Blessures visibles
  if (bless.includes('bras')) {
    p.push(`<path d="M${R + 1} 124 Q${R + 8} 134 ${R + 5} 150" stroke="#e9e2d2" stroke-width="16" fill="none"/>
      <path d="M${R - 6} 128 l15 4 M${R - 5} 136 l15 4 M${R - 5} 144 l15 4" stroke="#b9ad94" stroke-width="1.2"/>
      <circle cx="${R + 5}" cy="138" r="4" fill="#8a1c1c" opacity="0.55"/>`);
  }
  if (bless.includes('jambe')) {
    p.push(`<path d="M101.5 208 L117.5 208 L117 230 L102 230 Z" fill="#e9e2d2"/><path d="M102 214 l15 3 M102 221 l15 3" stroke="#b9ad94" stroke-width="1.2"/><circle cx="110" cy="219" r="3.5" fill="#8a1c1c" opacity="0.55"/>`);
  }
  if (bless.includes('cotes')) {
    p.push(`<path d="M${L} 128 L${R} 128 L${R + 1} 152 L${L - 1} 152 Z" fill="#e9e2d2" opacity="0.95"/>
      <path d="M${L} 134 L${R} 137 M${L} 141 L${R} 144 M${L} 148 L${R} 151" stroke="#b9ad94" stroke-width="1.2"/>`);
  }

  return p.join('');
}
