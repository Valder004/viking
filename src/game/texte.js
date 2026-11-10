// Mise en forme du texte des scènes : paragraphes, nom du joueur, noms colorés des personnages.
import { PERSONNAGES } from '../data/personnages.js';

const echapper = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function formaterTexte(texte, etat) {
  const brut = typeof texte === 'function' ? texte(etat) : texte;
  return brut
    .trim()
    .split(/\n\s*\n/)
    .map((p) => {
      let html = echapper(p.trim()).replace(/\{prenom\}/g, echapper(etat.perso.prenom));
      // **Nom :** réplique → nom coloré
      html = html.replace(/^\*\*([^*]+)\*\*/g, (_, nom) => {
        const perso = Object.values(PERSONNAGES).find((x) => nom.startsWith(x.nom));
        const style = perso ? ` style="color:${perso.couleur}"` : '';
        return `<strong class="replique-nom"${style}>${nom}</strong>`;
      });
      html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      return `<p>${html}</p>`;
    })
    .join('');
}
