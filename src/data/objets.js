// Objets que le joueur peut porter. `icone` est un contenu SVG dessiné dans une boîte 40×40.
// Un choix de dialogue peut exiger un objet : { texte, objet: 'pain', ... } (voir moteur.js).
export const OBJETS = {
  pain: {
    nom: 'Quignon de pain',
    description: 'Du pain d’orge, dur comme une excuse. Quelqu’un l’a oublié sur un tonneau.',
    icone: `<path d="M5 26 Q4 12 20 11 Q36 12 35 26 Q35 31 20 31 Q5 31 5 26 Z" fill="#b9813f"/>
      <path d="M20 11 Q36 12 35 26 Q35 31 20 31 Z" fill="rgba(0,0,0,0.2)"/>
      <path d="M12 15 l4 8 M19 13 l4 9 M26 15 l3 8" stroke="#e9c98a" stroke-width="2.2" stroke-linecap="round"/>`,
  },
  hareng: {
    nom: 'Hareng salé',
    description: 'Il te regarde d’un œil rond. Il a connu des jours meilleurs, et toi aussi.',
    icone: `<path d="M4 20 Q16 8 30 20 Q16 32 4 20 Z" fill="#9fb0bd"/><path d="M4 20 Q16 32 30 20 Q16 24 4 20 Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M29 20 l8 -7 l0 14 Z" fill="#7d8e9b"/><circle cx="10" cy="18.500" r="1.800" fill="#1a110a"/>
      <path d="M15 16 l0 8 M20 15 l0 10" stroke="rgba(0,0,0,0.3)" stroke-width="1.200"/>`,
  },
  pierre: {
    nom: 'Pierre à aiguiser',
    description: 'Prise à la forge. Elle a rendu leur fil à plus de lames que le village ne compte de morts.',
    icone: `<path d="M5 24 L12 14 L33 12 L36 22 L28 30 L8 31 Z" fill="#8a8f96"/><path d="M12 14 L33 12 L36 22 L14 23 Z" fill="#aab0b6"/>
      <path d="M14 23 L36 22 L28 30 L8 31 Z" fill="rgba(0,0,0,0.25)"/><path d="M16 17 l14 -1 M17 20 l12 -1" stroke="#e3e7ea" stroke-width="1.200"/>`,
  },
  biere: {
    nom: 'Corne de bière',
    description: 'Tirée au tonneau de la halle pendant que personne ne regardait. Elle mousse encore.',
    icone: `<path d="M8 8 Q6 30 20 36 Q34 30 32 8 Z" fill="#e9dfc8"/><path d="M20 8 L32 8 Q34 30 20 36 Z" fill="rgba(0,0,0,0.18)"/>
      <path d="M8 8 L32 8" stroke="#c9963f" stroke-width="3"/><path d="M9 14 L31 14" stroke="#b9ad94" stroke-width="1.500"/>
      <ellipse cx="20" cy="7" rx="12" ry="3.500" fill="#f4e6b0"/><circle cx="15" cy="5.500" r="2" fill="#fff8e0"/><circle cx="23" cy="4.800" r="2.400" fill="#fff8e0"/>`,
  },
  poisson: {
    nom: 'Poisson grillé',
    description: 'Pris sur la broche de l’îlot. Encore chaud. La seule chose honnête de ce voyage.',
    icone: `<path d="M4 20 Q16 8 30 20 Q16 32 4 20 Z" fill="#8a6a48"/><path d="M4 20 Q16 32 30 20 Q16 24 4 20 Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M29 20 l8 -7 l0 14 Z" fill="#6b5236"/><circle cx="10" cy="18.500" r="1.800" fill="#1a110a"/>
      <path d="M13 15 l4 10 M19 14 l4 12 M25 16 l2 8" stroke="#3a2718" stroke-width="1.500"/>`,
  },
  hamecon: {
    nom: 'Hameçon de bronze',
    description: 'Celui de ton père. Il n’a jamais rien pris de gros, mais il n’a jamais cassé.',
    icone: `<path d="M22 5 L22 24 Q22 33 14 33 Q7 33 7 25 L12 28" fill="none" stroke="#c9963f" stroke-width="3.500" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="22" cy="6" r="3.500" fill="none" stroke="#c9963f" stroke-width="2.500"/>`,
  },
  peigne: {
    nom: 'Peigne d’os',
    description: 'Le seul objet que tu possédais déjà quand on t’a vendu·e. Il lui manque trois dents.',
    icone: `<rect x="5" y="9" width="30" height="9" rx="3" fill="#e9dfc8"/>
      <path d="M8 18 l0 13 M12 18 l0 13 M16 18 l0 13 M24 18 l0 13 M32 18 l0 13" stroke="#e9dfc8" stroke-width="2.500" stroke-linecap="round"/>
      <path d="M9 13 l22 0" stroke="#b9ad94" stroke-width="1.500" stroke-dasharray="2 2"/>`,
  },
  marteau: {
    nom: 'Marteau miniature',
    description: 'Ton premier ouvrage. Il est tordu. Ta mère l’a porté au cou pendant dix ans.',
    icone: `<rect x="18" y="12" width="4.500" height="24" rx="2" fill="#6b4a2e"/>
      <path d="M8 6 L30 6 L33 10 L30 15 L8 15 Z" fill="#aeb4ba"/><path d="M20 6 L30 6 L33 10 L30 15 L20 15 Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M20 2 a3 3 0 1 1 0.100 0" fill="none" stroke="#cbb994" stroke-width="1.500"/>`,
  },
  fleche: {
    nom: 'Pointe de flèche',
    description: 'Celle qui a tué ton premier élan. Tu avais neuf ans et tu as pleuré.',
    icone: `<path d="M20 3 L31 24 L20 20 L9 24 Z" fill="#aeb4ba"/><path d="M20 3 L31 24 L20 20 Z" fill="rgba(0,0,0,0.25)"/>
      <rect x="18" y="20" width="4" height="14" fill="#6b4a2e"/><path d="M17 26 l6 2 M17 30 l6 2" stroke="#b8432b" stroke-width="1.800"/>`,
  },
};

export const iconeObjet = (id, taille = 40) =>
  OBJETS[id] ? `<svg viewBox="0 0 40 40" width="${taille}" height="${taille}" aria-hidden="true">${OBJETS[id].icone}</svg>` : '';
