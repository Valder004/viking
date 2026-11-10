// Point d'entrée : aiguille entre les écrans et fait tourner le moteur.
import { SCENES, PREMIERE_SCENE } from '../data/index.js';
import { Moteur, etatInitial } from './moteur.js';
import { sauvegarde } from './sauvegarde.js';
import { monterCreateur } from './createur.js';
import { monterScene } from './scene.js';
import { monterMenu, monterChapitres, monterFins, monterOptions, monterFin } from './ecrans.js';

export function demarrerJeu(racine) {
  let moteur = null;

  const menu = () => {
    moteur?.annulerChrono();
    racine.onclick = null;
    monterMenu(racine, {
      continuer: () => {
        const etat = sauvegarde.lirePartie();
        if (etat) jouer(etat, etat.scene);
      },
      nouvelle: () => creer(),
      chapitres: () =>
        monterChapitres(racine, {
          onRetour: menu,
          onChoisir: (etat) => jouer(structuredClone(etat), etat.scene),
        }),
      fins: () => monterFins(racine, { onRetour: menu }),
      options: () => monterOptions(racine, { onRetour: menu }),
    });
  };

  const creer = () => {
    racine.onclick = null;
    monterCreateur(racine, {
      onRetour: menu,
      onValider: (perso) => jouer(etatInitial(perso), PREMIERE_SCENE),
    });
  };

  const jouer = (etat, sceneId) => {
    racine.onclick = null;
    moteur = new Moteur({
      scenes: SCENES,
      etat,
      onScene: () => {},
      onFin: (scene, e) =>
        monterFin(racine, scene, e, {
          onMenu: menu,
          onFins: () => monterFins(racine, { onRetour: menu }),
        }),
    });
    const { menuBtn } = monterScene(racine, moteur);
    menuBtn.addEventListener('click', menu);
    moteur.demarrer(sceneId);
  };

  menu();
}
