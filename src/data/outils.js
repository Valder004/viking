// Petits outils pour écrire les effets et les conditions des scènes sans toucher au moteur.
// Un effet est une fonction (etat) => void. Une condition est une fonction (etat) => boolean.

const borne = (v, min, max) => Math.max(min, Math.min(max, v));

export const fx = {
  flag: (nom, valeur = true) => (e) => { e.flags[nom] = valeur; },
  reputation: (n) => (e) => { e.reputation = borne(e.reputation + n, -5, 5); },
  confiance: (qui, n) => (e) => { e.confiance[qui] = borne(e.confiance[qui] + n, -3, 3); },
  butin: (n) => (e) => { e.butin = borne(e.butin + n, 0, 10); },
  faveur: (n) => (e) => { e.faveur = borne(e.faveur + n, -3, 3); },
  blesser: (type) => (e) => {
    if (!e.blessures.includes(type)) e.blessures.push(type);
    e.sante = borne(e.sante - 1, 0, 3);
  },
  tuer: (qui) => (e) => { e.morts[qui] = true; },
  prendre: (objet) => (e) => { if (!e.inventaire.includes(objet)) e.inventaire.push(objet); },
  perdre: (objet) => (e) => { e.inventaire = e.inventaire.filter((o) => o !== objet); },
  tous: (...effets) => (e) => effets.forEach((f) => f(e)),
};

export const si = {
  origine: (o) => (e) => e.perso.origine === o,
  flag: (nom) => (e) => Boolean(e.flags[nom]),
  pasFlag: (nom) => (e) => !e.flags[nom],
  objet: (id) => (e) => e.inventaire.includes(id),
  vivant: (qui) => (e) => !e.morts[qui],
  mort: (qui) => (e) => Boolean(e.morts[qui]),
  blesse: (type) => (e) => e.blessures.includes(type),
  pasBlesse: (type) => (e) => !e.blessures.includes(type),
  confiance: (qui, min) => (e) => e.confiance[qui] >= min,
  reputation: (min) => (e) => e.reputation >= min,
  faveur: (min) => (e) => e.faveur >= min,
  et: (...conds) => (e) => conds.every((c) => c(e)),
  ou: (...conds) => (e) => conds.some((c) => c(e)),
};

// Hasard pondéré par la faveur des dieux : base 0.5, ±0.15 par point de faveur.
export function chance(e, base = 0.5) {
  return Math.random() < borne(base + e.faveur * 0.15, 0.05, 0.95);
}
