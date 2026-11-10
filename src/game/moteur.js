// Le moteur narratif. Il ne connaît rien de l'histoire : il lit les scènes dans src/data
// et applique les effets. Pour ajouter une scène, on édite les données, pas ce fichier.
//
// Deux sortes de scènes :
//
// 1) Scène de dialogue (par défaut)
// {
//   id: 'c1_hutte',
//   chapitre: 1,                 // présent sur la première scène d'un chapitre → checkpoint
//   decor: 'hutte',              // clé dans src/game/decors
//   personnages: ['parent'],     // ids de PERSONNAGES, ou fn(etat)
//   texte: 'Paragraphes…' | (etat) => '…',   // \n\n sépare les répliques
//   choix: [{ texte, condition?, objet?, garde?, effets?, suivant }],
//       objet: 'pain'  → le choix n'apparaît que si le joueur porte l'objet, qui est consommé
//       garde: true    → l'objet n'est pas consommé
//       suivant: id ou fn(etat) => id
//   chrono?: { duree: 8 | fn(etat), timeout: { effets?, suivant } },
//   entree?: (etat) => void,     // effets appliqués en arrivant
//   fin?: 'triomphe',            // id de fin → la scène est un écran de fin
// }
//
// 2) Lieu explorable : type: 'lieu'
// {
//   id: 'c1_port', type: 'lieu', decor: 'port', titre: 'Le port, la nuit',
//   sol: { y: 408, xmin: 30, xmax: 770 },      // ligne où marchent les personnages
//   depart: 420,                                // x d'arrivée du joueur
//   quetes: [{ texte, fait: fn(etat), visible?: fn(etat), facultatif? }],
//   elements: [{
//     id, nom, x,
//     type: 'pnj' (perso: 'ulf', miroir?) | 'objet' (objet: 'pain', y) | 'zone' (y, l, h) | 'sortie',
//     visible?: fn(etat), important?: fn(etat),
//     action: { scene } | { prendre, texte } | { examiner } | { suivant, condition?, refus? }
//             ou fn(etat) qui renvoie l'un de ces objets
//   }],
// }

import { ORIGINES } from '../data/origines.js';
import { PERSONNAGES } from '../data/personnages.js';
import { OBJETS } from '../data/objets.js';
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
    inventaire: [],
    lieux: {}, // position du joueur dans chaque lieu visité
    chronosRates: 0,
    chapitre: 1,
    scene: null,
    historique: [], // [{ scene, choix }]
  };
}

const DUREES = { normal: 1, lent: 2, off: 0 };

export class Moteur {
  constructor({ scenes, etat, onScene, onLieu, onFin, onNotif }) {
    this.scenes = scenes;
    this.etat = etat;
    this.etat.inventaire ??= []; // sauvegardes antérieures à l'inventaire
    this.etat.lieux ??= {};
    this.onScene = onScene;
    this.onLieu = onLieu;
    this.onFin = onFin;
    this.onNotif = onNotif ?? (() => {});
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
    if (scene.entree) this.avecNotifs(() => scene.entree(this.etat));

    if (scene.fin) {
      sauvegarde.debloquerFin(scene.fin);
      sauvegarde.effacerPartie();
      this.onFin(scene, this.etat);
      return;
    }

    this.sauver();

    if (scene.type === 'lieu') {
      this.onLieu(scene);
      return;
    }

    const choix = (scene.choix ?? []).filter(
      (c) => (!c.condition || c.condition(this.etat)) && (!c.objet || this.etat.inventaire.includes(c.objet)),
    );
    this.onScene(scene, choix, this.chronoPour(scene));
  }

  sauver() {
    sauvegarde.ecrirePartie(this.etat);
  }

  /** Exécute des effets et signale ce qui a changé pour le joueur (relations, objets). */
  avecNotifs(fn) {
    const e = this.etat;
    const avant = { confiance: { ...e.confiance }, reputation: e.reputation, inventaire: [...e.inventaire] };
    fn();
    const notifs = [];
    for (const [qui, v] of Object.entries(e.confiance)) {
      const d = v - avant.confiance[qui];
      if (!d || e.morts[qui]) continue;
      const nom = PERSONNAGES[qui].nom.split(' ')[0];
      const fort = Math.abs(d) >= 2 ? 'beaucoup' : 'un peu';
      notifs.push({ sens: d > 0 ? 'plus' : 'moins', texte: `${nom} te fait ${fort} ${d > 0 ? 'plus' : 'moins'} confiance.`, couleur: PERSONNAGES[qui].couleur });
    }
    const dr = e.reputation - avant.reputation;
    if (dr) notifs.push({ sens: dr > 0 ? 'plus' : 'moins', texte: dr > 0 ? 'Hakon t’a remarqué·e.' : 'Hakon te regarde de travers.', couleur: PERSONNAGES.hakon.couleur });
    for (const o of e.inventaire) if (!avant.inventaire.includes(o)) notifs.push({ sens: 'objet', objet: o, texte: `Obtenu : ${OBJETS[o]?.nom ?? o}` });
    for (const o of avant.inventaire) if (!e.inventaire.includes(o)) notifs.push({ sens: 'perdu', objet: o, texte: `Perdu : ${OBJETS[o]?.nom ?? o}` });
    if (notifs.length) this.onNotif(notifs);
  }

  chronoPour(scene) {
    if (!scene.chrono) return null;
    const facteur = DUREES[this.options.chrono] ?? 1;
    if (facteur === 0) return null;
    const duree = typeof scene.chrono.duree === 'function' ? scene.chrono.duree(this.etat) : scene.chrono.duree;
    return { duree: duree * facteur };
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
    this.avecNotifs(() => {
      if (choix.objet && !choix.garde) {
        this.etat.inventaire = this.etat.inventaire.filter((o) => o !== choix.objet);
      }
      if (choix.effets) choix.effets(this.etat);
    });
    const texte = typeof choix.texte === 'function' ? choix.texte(this.etat) : choix.texte;
    this.etat.historique.push({ scene: this.etat.scene, choix: texte });
    this.aller(this.resoudre(choix.suivant));
  }

  expirer(scene) {
    const t = scene.chrono.timeout;
    this.etat.chronosRates += 1;
    if (t.effets) this.avecNotifs(() => t.effets(this.etat));
    this.etat.historique.push({ scene: this.etat.scene, choix: '(temps écoulé)' });
    this.aller(this.resoudre(t.suivant));
  }

  resoudre(suivant) {
    return typeof suivant === 'function' ? suivant(this.etat) : suivant;
  }
}
