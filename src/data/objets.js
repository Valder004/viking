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
  carte: {
    nom: 'Plan du château',
    description: 'Trouvé au scriptorium. Des murs, quatre tours, et un trait en pointillé qui passe sous l’un d’eux. Quelqu’un a annoté le coin en runes.',
    icone: `<path d="M5 8 L16 5 L25 9 L35 6 L35 33 L25 36 L16 32 L5 35 Z" fill="#e3d3a8"/>
      <path d="M16 5 L16 32 M25 9 L25 36" stroke="#b39c72" stroke-width="1"/>
      <rect x="11" y="13" width="18" height="13" fill="none" stroke="#6b4a2e" stroke-width="1.600"/>
      <rect x="9" y="11" width="4" height="4" fill="#6b4a2e"/><rect x="27" y="11" width="4" height="4" fill="#6b4a2e"/>
      <rect x="9" y="24" width="4" height="4" fill="#6b4a2e"/><rect x="27" y="24" width="4" height="4" fill="#6b4a2e"/>
      <path d="M20 26 L20 33 L30 33" stroke="#a8402a" stroke-width="1.400" stroke-dasharray="2 2" fill="none"/>`,
  },
  baume: {
    nom: 'Baume des moines',
    description: 'Un petit pot de terre, cacheté de cire. Ça sent la cire, l’ortie et quelque chose d’amer. Les moines soignent ce que les autres cassent.',
    icone: `<path d="M11 14 Q8 30 14 35 L26 35 Q32 30 29 14 Z" fill="#a8693f"/><path d="M20 14 L29 14 Q32 30 26 35 L20 35 Z" fill="rgba(0,0,0,0.2)"/>
      <rect x="10" y="10" width="20" height="5" rx="2" fill="#c98a4a"/><ellipse cx="20" cy="10" rx="9" ry="2.500" fill="#e6c35c"/>
      <path d="M14 22 Q20 26 26 22" stroke="#6f8a4a" stroke-width="2" fill="none"/><path d="M18 20 l2 -4 l2 4" stroke="#6f8a4a" stroke-width="1.500" fill="none"/>`,
  },
  calice: {
    nom: 'Calice d’or',
    description: 'L’or de l’autel. Lourd pour sa taille, comme tout ce qui compte. Hakon en connaît le poids exact sans l’avoir soulevé.',
    icone: `<path d="M9 7 L31 7 Q31 20 20 22 Q9 20 9 7 Z" fill="#d6a640"/><path d="M20 7 L31 7 Q31 20 20 22 Z" fill="rgba(0,0,0,0.18)"/>
      <rect x="18" y="22" width="4" height="7" fill="#c9963f"/><path d="M11 33 Q20 27 29 33 Z" fill="#d6a640"/>
      <ellipse cx="20" cy="7" rx="11" ry="2.500" fill="#f0d07a"/><circle cx="15" cy="13" r="1.600" fill="#8a1c1c"/><circle cx="20" cy="15" r="1.600" fill="#1f3a5f"/><circle cx="25" cy="13" r="1.600" fill="#8a1c1c"/>`,
  },
  lettre: {
    nom: 'Lettre scellée',
    description: 'Trouvée sur la table du comte. Une lettre vieille de six ans, en latin, scellée d’une cire où l’on reconnaît la marque d’un anneau. Celui que Hakon porte au doigt.',
    icone: `<path d="M6 9 L34 9 L34 31 L6 31 Z" fill="#e3d3a8"/><path d="M6 9 L20 20 L34 9" stroke="#b39c72" stroke-width="1.400" fill="none"/>
      <path d="M10 25 l10 0 M10 28 l14 0" stroke="#8a6a42" stroke-width="1"/>
      <circle cx="26" cy="25" r="5.500" fill="#a8302a"/><circle cx="26" cy="25" r="2.600" fill="none" stroke="#6e1a14" stroke-width="1.200"/>`,
  },
  couronne: {
    nom: 'Couronne du comte',
    description: 'Un cercle d’or serti de pierres rouges, trouvé dans un coffre. Trop petit pour la tête de Hakon. Il la voudra quand même.',
    icone: `<path d="M6 28 L8 12 L14 20 L20 8 L26 20 L32 12 L34 28 Z" fill="#d6a640"/><path d="M20 8 L26 20 L32 12 L34 28 L20 28 Z" fill="rgba(0,0,0,0.15)"/>
      <rect x="6" y="27" width="28" height="5" rx="1" fill="#c9963f"/>
      <circle cx="13" cy="29.500" r="1.600" fill="#a8302a"/><circle cx="20" cy="29.500" r="1.600" fill="#1f3a5f"/><circle cx="27" cy="29.500" r="1.600" fill="#a8302a"/>
      <circle cx="20" cy="8" r="1.800" fill="#f0d07a"/>`,
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
