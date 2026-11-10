// Point d'entrée : aiguille entre les écrans et fait tourner le moteur.
import { SCENES, PREMIERE_SCENE } from '../data/index.js';
import { Moteur, etatInitial } from './moteur.js';
import { sauvegarde } from './sauvegarde.js';
import { monterCreateur } from './createur.js';
import { monterScene } from './scene.js';
import { monterMenu, monterChapitres, monterFins, monterOptions, monterFin } from './ecrans.js';

export function demarrerJeu(racine) {
  let moteur = null;
  let vue = null; // scène montée, à détruire en quittant

  const quitterScene = () => {
    moteur?.annulerChrono();
    vue?.detruire();
    vue = null;
    racine.onclick = null;
  };

  const menu = () => {
    quitterScene();
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
    quitterScene();
    moteur = new Moteur({
      scenes: SCENES,
      etat,
      onScene: () => {},
      onFin: (scene, e) => {
        quitterScene();
        monterFin(racine, scene, e, {
          onMenu: menu,
          onFins: () => monterFins(racine, { onRetour: menu }),
        });
      },
    });
    vue = monterScene(racine, moteur, { onMenu: menu });
    moteur.demarrer(sceneId);
  };

  menu();
}
