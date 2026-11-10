// Le moteur narratif. Il ne connaît rien de l'histoire : il lit les scènes dans src/data
// et applique les effets. Pour ajouter une scène, on édite les données, pas ce fichier.
//
// Format d'une scène :
// {
//   id: 'c1_hutte',
//   chapitre: 1,                 // présent sur la première scène d'un chapitre → checkpoint
//   decor: 'hutte',              // clé dans src/game/decors
//   personnages: ['parent'],     // silhouettes affichées (ids de PERSONNAGES), peut être fn(etat)
//   texte: 'Paragraphes…' | (etat) => '…',   // \n\n sépare les paragraphes
//   choix: [{ texte, condition?, effets?, suivant }],  // suivant: id ou fn(etat) => id
//   chrono?: { duree: 8, timeout: { effets?, suivant } },
//   entree?: (etat) => void,     // effets appliqués en arrivant
//   fin?: 'triomphe',            // id de fin → la scène est un écran de fin
// }

import { ORIGINES } from '../data/origines.js';
import { sauvegarde } from './sauvegarde.js';

export function etatInitial(perso) {
  const origine = ORIGINES[perso.origine];
  return {
    perso,
    sante: 3,
    blessures: [],
    reputation: origine.reputation,
    confiance: { sigrid: 0, ulf: 0, eirik: 0, aude: 0 },
    butin: 0,
    faveur: 0,
    flags: {},
    morts: {},
    chronosRates: 0,
    chapitre: 1,
    scene: null,
    historique: [], // [{ scene, choix }]
  };
}

const DUREES = { normal: 1, lent: 2, off: 0 };

export class Moteur {
  constructor({ scenes, etat, onScene, onFin }) {
    this.scenes = scenes;
    this.etat = etat;
    this.onScene = onScene;
    this.onFin = onFin;
    this.timer = null;
  }

  get options() {
    return sauvegarde.lireProfil().options;
  }

  demarrer(sceneId) {
    this.aller(sceneId ?? this.etat.scene);
  }

  aller(id) {
    const scene = this.scenes[id];
    if (!scene) throw new Error(`Scène introuvable : ${id}`);
    this.annulerChrono();

    if (scene.chapitre) {
      this.etat.chapitre = scene.chapitre;
      sauvegarde.poserCheckpoint(scene.chapitre, { ...this.etat, scene: id });
    }
    this.etat.scene = id;
    if (scene.entree) scene.entree(this.etat);

    if (scene.fin) {
      sauvegarde.debloquerFin(scene.fin);
      sauvegarde.effacerPartie();
      this.onFin(scene, this.etat);
      return;
    }

    sauvegarde.ecrirePartie(this.etat);

    const choix = (scene.choix ?? []).filter((c) => !c.condition || c.condition(this.etat));
    const chrono = this.chronoPour(scene);
    this.onScene(scene, choix, chrono);
  }

  chronoPour(scene) {
    if (!scene.chrono) return null;
    const facteur = DUREES[this.options.chrono] ?? 1;
    if (facteur === 0) return null;
    return { duree: scene.chrono.duree * facteur };
  }

  lancerChrono(scene, onTick) {
    const chrono = this.chronoPour(scene);
    if (!chrono) return;
    const debut = performance.now();
    const total = chrono.duree * 1000;
    const tick = () => {
      const restant = Math.max(0, total - (performance.now() - debut));
      onTick(restant / total);
      if (restant <= 0) {
        this.timer = null;
        this.expirer(scene);
      } else {
        this.timer = requestAnimationFrame(tick);
      }
    };
    this.timer = requestAnimationFrame(tick);
  }

  annulerChrono() {
    if (this.timer) cancelAnimationFrame(this.timer);
    this.timer = null;
  }

  choisir(choix) {
    this.annulerChrono();
    if (choix.effets) choix.effets(this.etat);
    this.etat.historique.push({ scene: this.etat.scene, choix: choix.texte });
    this.aller(this.resoudre(choix.suivant));
  }

  expirer(scene) {
    const t = scene.chrono.timeout;
    this.etat.chronosRates += 1;
    if (t.effets) t.effets(this.etat);
    this.etat.historique.push({ scene: this.etat.scene, choix: '(temps écoulé)' });
    this.aller(this.resoudre(t.suivant));
  }

  resoudre(suivant) {
    return typeof suivant === 'function' ? suivant(this.etat) : suivant;
  }
}
