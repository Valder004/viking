// Sauvegarde dans localStorage. Deux clés :
// - viking.partie : la partie en cours (état complet)
// - viking.profil : ce qui survit aux parties (fins débloquées, checkpoints, options)

const CLE_PARTIE = 'viking.partie';
const CLE_PROFIL = 'viking.profil';

function lire(cle, defaut) {
  try {
    const brut = localStorage.getItem(cle);
    return brut ? JSON.parse(brut) : defaut;
  } catch {
    return defaut;
  }
}

function ecrire(cle, valeur) {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    /* stockage indisponible : le jeu continue sans sauvegarde */
  }
}

export const PROFIL_DEFAUT = {
  finsDebloquees: [],
  checkpoints: {}, // { "1": etat, "2": etat, ... }
  options: { chrono: 'normal' }, // normal | lent | off
};

export const sauvegarde = {
  lirePartie: () => lire(CLE_PARTIE, null),
  ecrirePartie: (etat) => ecrire(CLE_PARTIE, etat),
  effacerPartie: () => {
    try { localStorage.removeItem(CLE_PARTIE); } catch { /* ignore */ }
  },

  lireProfil: () => ({ ...PROFIL_DEFAUT, ...lire(CLE_PROFIL, {}) }),
  ecrireProfil: (profil) => ecrire(CLE_PROFIL, profil),

  debloquerFin(id) {
    const p = this.lireProfil();
    if (!p.finsDebloquees.includes(id)) {
      p.finsDebloquees.push(id);
      this.ecrireProfil(p);
    }
  },

  poserCheckpoint(chapitre, etat) {
    const p = this.lireProfil();
    p.checkpoints[chapitre] = structuredClone(etat);
    this.ecrireProfil(p);
  },

  setOption(nom, valeur) {
    const p = this.lireProfil();
    p.options[nom] = valeur;
    this.ecrireProfil(p);
  },
};
