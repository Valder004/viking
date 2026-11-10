// Point d'entrée : aiguille entre les écrans et fait tourner le moteur.
import { SCENES, PREMIERE_SCENE } from '../data/index.js';
import { Moteur, etatInitial } from './moteur.js';
import { sauvegarde } from './sauvegarde.js';
import { monterCreateur } from './createur.js';
import { monterScene } from './scene.js';
import { monterLieu } from './lieu.js';
import { notifier, viderNotifs } from './notif.js';
import { monterMenu, monterChapitres, monterFins, monterOptions, monterFin } from './ecrans.js';

export function demarrerJeu(racine) {
  let moteur = null;
  let vue = null; // vue montée (dialogue ou exploration), à détruire en quittant
  let mode = null; // 'dialogue' | 'lieu'

  const quitterVue = () => {
    moteur?.annulerChrono();
    vue?.detruire();
    vue = null;
    mode = null;
    racine.onclick = null;
  };

  const menu = () => {
    quitterVue();
    viderNotifs();
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
    quitterVue();
    moteur = new Moteur({
      scenes: SCENES,
      etat,
      onNotif: notifier,
      onScene: (scene, choix) => {
        if (mode !== 'dialogue') {
          vue?.detruire();
          vue = monterScene(racine, moteur, { onMenu: menu });
          mode = 'dialogue';
        }
        vue.afficher(scene, choix);
      },
      onLieu: (lieu) => {
        vue?.detruire();
        vue = monterLieu(racine, moteur, lieu, { onMenu: menu });
        mode = 'lieu';
      },
      onFin: (scene, e) => {
        quitterVue();
        monterFin(racine, scene, e, {
          onMenu: menu,
          onFins: () => monterFins(racine, { onRetour: menu }),
        });
      },
    });
    moteur.demarrer(sceneId);
  };

  menu();
}
