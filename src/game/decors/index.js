// Registre des décors. Chaque décor est une fonction (etat) => { svg, joueur, places }.
// - svg : chaîne SVG complète, viewBox 0 0 800 450 ; le repère <!--persos--> indique où
//   insérer les personnages (sinon ils sont dessinés au-dessus de tout)
// - joueur : { x, y, scale, miroir? } position du viking (boîte 200×300 avant échelle)
// - places : positions disponibles pour les PNJ, dans l'ordre de scene.personnages
import { hutte } from './hutte.js';
import { halle } from './halle.js';
import { port } from './port.js';
import { depart, mer, tempete, brouillard } from './drakkar.js';
import { ilot } from './ilot.js';
import { cour } from './cour.js';

export const vide = () => ({
  svg: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="450" fill="#0e0f14"/></svg>`,
  joueur: { x: 300, y: 150, scale: 0.9 },
  places: [],
});

export const DECORS = { vide, hutte, halle, port, cour, depart, mer, ilot, tempete, brouillard };
