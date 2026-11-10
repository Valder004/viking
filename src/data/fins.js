// Les dix fins. `condition` est évaluée dans l'ordre du tableau au chapitre 5.
// Le texte complet de chaque fin vit dans src/data/chapitres/ch5.js.
export const FINS = [
  { id: 'corbeaux', num: 9, nom: 'Nourriture pour les corbeaux', ton: 'Mort sèche', secrete: false },
  { id: 'valhalla', num: 4, nom: 'Valhalla', ton: 'Glorieuse', secrete: false },
  { id: 'vendu', num: 6, nom: 'Vendu', ton: 'Malheureuse', secrete: false },
  { id: 'banni', num: 7, nom: 'Le banni', ton: 'Ambiguë', secrete: false },
  { id: 'eau', num: 5, nom: 'L’eau se souvient', ton: 'Malheureuse', secrete: false },
  { id: 'saga', num: 8, nom: 'La saga inachevée', ton: 'Douce-amère', secrete: true },
  { id: 'maison', num: 3, nom: 'Une maison sans mur', ton: 'Heureuse', secrete: false },
  { id: 'jarl', num: 2, nom: 'Jarl de Francie', ton: 'Ambiguë', secrete: false },
  { id: 'triomphe', num: 1, nom: 'Retour triomphal', ton: 'Heureuse, en surface', secrete: false },
  { id: 'rameur', num: 10, nom: 'Le rameur', ton: 'Ambiguë', secrete: false },
];

export const FINS_PAR_ID = Object.fromEntries(FINS.map((f) => [f.id, f]));
