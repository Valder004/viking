// Origines du joueur. Le trait n'est jamais affiché en jeu : il ouvre ou ferme des options.
export const ORIGINES = {
  pecheur: {
    nom: 'Enfant de pêcheur',
    resume: 'Tu connais la mer mieux que les hommes. Les hommes, ça ne t’a jamais trop réussi.',
    trait: 'lit_la_mer',
    objet: { id: 'hamecon', nom: 'un hameçon de bronze', texte: 'L’hameçon de ton père. Il n’a jamais rien pris de gros, mais il n’a jamais cassé.' },
    reputation: -1,
  },
  affranchi: {
    nom: 'Esclave affranchi·e',
    resume: 'Tu as été pris·e enfant sur une côte dont tu ne te souviens plus. Tu as racheté ta liberté. Tu en connais le prix exact.',
    trait: 'parle_franc',
    objet: { id: 'peigne', nom: 'un peigne d’os', texte: 'Le seul objet que tu possédais déjà quand on t’a vendu·e. Il lui manque trois dents.' },
    reputation: 0,
  },
  forgeron: {
    nom: 'Enfant de forgeron',
    resume: 'Tu sais ce qu’une lame vaut, ce qu’elle coûte, et combien de temps elle met à casser.',
    trait: 'mains_sures',
    objet: { id: 'marteau', nom: 'un marteau miniature', texte: 'Ton premier ouvrage. Il est tordu. Ta mère le porte au cou depuis dix ans.' },
    reputation: 0,
  },
  chasseur: {
    nom: 'Chasseur des fjords',
    resume: 'Tu vis en haut, là où le village ne monte pas. Tu descends quand il y a quelque chose à prendre.',
    trait: 'pisteur',
    objet: { id: 'fleche', nom: 'une pointe de flèche', texte: 'Celle qui a tué ton premier élan. Tu avais neuf ans et tu as pleuré. Tu ne le diras à personne.' },
    reputation: 0,
  },
};
