// Le viking du joueur : options du créateur et conversion vers le dessin générique.
import { personnage } from './personnage.js';

export const OPTIONS = {
  peau: ['#f3d6b8', '#e2b894', '#c88f66', '#8d5a3b'],
  cheveux: ['#f0d58c', '#c4762e', '#6b3a1e', '#2b1d14', '#d8d2c6'],
  coiffure: [
    { id: 'court', nom: 'Court' },
    { id: 'long', nom: 'Long' },
    { id: 'tresses', nom: 'Tresses' },
    { id: 'rase', nom: 'Crête' },
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
    { id: 'lignes', nom: 'Griffes' },
    { id: 'oeil', nom: 'Œil marqué' },
  ],
  peintureCouleur: ['#1f3a5f', '#8a1c1c', '#1f1b16', '#f4efe6'],
  tenue: ['#5c6b4a', '#7a4a2e', '#3f4a66', '#6e3b3b', '#34383d'],
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

/** Contenu SVG (sans balise <svg>) du viking, dans une boîte 200×300. */
export function vikingContenu(a, etat) {
  return personnage({
    peau: a.peau,
    cheveux: a.cheveux,
    coiffure: a.coiffure,
    barbe: a.barbe,
    peinture: a.peinture,
    peintureCouleur: a.peintureCouleur,
    tenue: a.tenue,
    casque: a.casque,
    bouclier: { motif: a.motif, c1: a.bouclier1, c2: a.bouclier2 },
    arme: a.arme,
    blessures: etat?.blessures ?? [],
  });
}

/** SVG autonome, pour l'aperçu du créateur. */
export function vikingSvg(a, etat, attrs = '') {
  return `<svg viewBox="-20 -10 240 310" xmlns="http://www.w3.org/2000/svg" ${attrs}>${vikingContenu(a, etat)}</svg>`;
}
