// Assemble toutes les scènes. Pour ajouter un chapitre : un fichier dans ./chapitres, une ligne ici.
import { CH1 } from './chapitres/ch1.js';
import { CH2 } from './chapitres/ch2.js';

export const PREMIERE_SCENE = 'c1_hutte';

export const SCENES = Object.fromEntries([...CH1, ...CH2].map((s) => [s.id, s]));
