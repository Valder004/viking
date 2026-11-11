// Les personnages non joueurs : une configuration chacun, dessinée par personnage.js.
// Pour modifier l'allure de quelqu'un, on change sa fiche ici.
import { personnage } from './personnage.js';

const OR = '#d6a640';

const FICHES = {
  sigrid: {
    carrure: 'fine', peau: '#f3d6b8', cheveux: '#c4622a', coiffure: 'tresses', expression: 'dur',
    tenue: '#8a3524', galon: '#e6c35c', plastron: '#5a3b24', pantalon: '#3d3328',
    bouclier: { motif: 'quartiers', c1: '#1f3a5f', c2: '#f4efe6' }, arme: 'lance',
    peinture: 'lignes', peintureCouleur: '#1f3a5f', yeux: '#3e6a5a',
  },
  ulf: {
    carrure: 'moyenne', peau: '#dcbf9f', cheveux: '#d8d2c6', coiffure: 'long', barbe: 'longue', expression: 'triste',
    tenue: '#5d6a78', galon: '#9aa7b3', cape: '#343c47', fourrure: '#9b9488',
    cacheOeil: true, age: true, cicatrice: true, arme: 'baton', yeux: '#7d8a99',
  },
  eirik: {
    carrure: 'fine', peau: '#f6dcc0', cheveux: '#f0d58c', coiffure: 'court', expression: 'narquois',
    tenue: '#c9962f', galon: '#8a1c1c', cape: '#8a1c1c', pantalon: '#4a3b2e', arme: 'epee', yeux: '#4a7fa8',
  },
  hakon: {
    carrure: 'large', peau: '#e2b894', cheveux: '#2b1d14', coiffure: 'long', barbe: 'longue', expression: 'dur',
    tenue: '#3b2f5c', galon: OR, cape: '#1d1730', fourrure: '#6e5a44', bandeau: OR, anneaux: true,
    arme: 'epee', pantalon: '#2e2733', age: true,
  },
  aude: {
    carrure: 'fine', peau: '#f3d6b8', cheveux: '#2b1d14', coiffure: 'long', expression: 'dur',
    robe: '#5f8f72', galon: '#e9dfc8', bandeau: '#e9dfc8', yeux: '#5a4632',
  },
  gautier: {
    carrure: 'large', peau: '#e2b894', cheveux: '#c9c2b4', coiffure: 'court', barbe: 'courte', expression: 'triste',
    tenue: '#8a8f96', galon: '#8a2c3f', mailles: true, cape: '#8a2c3f', arme: 'epee', age: true,
  },
  anselme: {
    carrure: 'moyenne', peau: '#e2b894', cheveux: '#8c7a5a', coiffure: 'tonsure', expression: 'triste',
    robe: '#6b5540', galon: '#4f3e2e', corde: true, age: true,
  },
  vieux: {
    carrure: 'fine', peau: '#d8b58f', cheveux: '#e4ded2', coiffure: 'court', barbe: 'longue', expression: 'triste',
    tenue: '#7a6a4e', galon: '#5a4a34', pantalon: '#5a4a38', age: true, yeux: '#5a6a7a',
  },
  parent: {
    carrure: 'fine', peau: '#e2b894', cheveux: '#8c7a6a', coiffure: 'foulard', foulard: '#c9bfa8', expression: 'triste',
    robe: '#7d8a76', galon: '#c9bfa8', tablier: '#8a5a3a', age: true,
  },
};

export function pnjContenu(id) {
  const fiche = FICHES[id];
  return fiche ? personnage(fiche) : '';
}
