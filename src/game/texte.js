// Mise en forme du texte des scènes : paragraphes, nom du joueur, répliques attribuées.
import { PERSONNAGES } from '../data/personnages.js';

const echapper = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Découpe le texte d'une scène en « temps » affichés un par un.
 * Un paragraphe qui commence par **Nom :** devient une réplique attribuée.
 * Renvoie [{ nom, id, couleur, html }] ; id vaut 'joueur' pour « Toi ».
 */
export function decouper(texte, etat) {
  const brut = typeof texte === 'function' ? texte(etat) : texte;
  return brut
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      let source = p.replace(/\{prenom\}/g, etat.perso.prenom);
      let nom = null;
      let id = null;
      let couleur = null;
      const m = source.match(/^\*\*([^*:]+?)\s*:\*\*\s*/);
      if (m) {
        nom = m[1].trim();
        source = source.slice(m[0].length);
        if (nom === 'Toi') {
          id = 'joueur';
          nom = etat.perso.prenom;
          couleur = '#e07a4f';
        } else {
          const trouve = Object.entries(PERSONNAGES).find(([, x]) => x.nom.startsWith(nom) || nom.startsWith(x.nom));
          if (trouve) {
            id = trouve[0];
            couleur = trouve[1].couleur;
          }
        }
      }
      const html = echapper(source).replace(/\*([^*]+)\*/g, '<em>$1</em>');
      return { nom, id, couleur, html };
    });
}

/** Texte complet en HTML (écran de fin, où l'on peut défiler). */
export function formaterTexte(texte, etat) {
  return decouper(texte, etat)
    .map((b) => `<p>${b.nom ? `<strong class="replique-nom" style="color:${b.couleur ?? 'inherit'}">${echapper(b.nom)} :</strong> ` : ''}${b.html}</p>`)
    .join('');
}
