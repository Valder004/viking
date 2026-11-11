// Écrans hors jeu : menu principal, chapitres, galerie des fins, options, écran de fin.
import { FINS } from '../data/fins.js';
import { PERSONNAGES } from '../data/personnages.js';
import { sauvegarde } from './sauvegarde.js';
import { formaterTexte } from './texte.js';
import { composerDecor } from './scene.js';
import { sceneAccueil } from './decors/accueil.js';

const CHAPITRES = ['Le village', 'Le drakkar', 'La côte franque', 'Le château', 'Le dénouement'];

// Une rune gravée par fin découverte, dans l'ordre des numéros de fin.
const RUNES_FINS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ'];

/** Nœud entrelacé, au centre du filet sous le titre. */
const NOEUD = `<svg viewBox="0 0 60 24" width="60" height="24"><g fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round">
  <path d="M6 12 C14 0 22 0 30 12 C38 24 46 24 54 12"/><path d="M6 12 C14 24 22 24 30 12 C38 0 46 0 54 12"/>
  <circle cx="30" cy="12" r="4"/></g></svg>`;

/** Ornement de coin : une tête de dragon entrelacée. */
const COIN = `<svg viewBox="0 0 120 120" width="120" height="120"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 114 L6 30 Q6 6 30 6 L114 6"/>
  <path d="M16 104 L16 40 Q16 16 40 16 L104 16" opacity="0.6"/>
  <path d="M30 6 C40 30 20 40 34 54 C46 66 66 46 54 34 C44 24 30 36 40 44"/>
  <path d="M6 30 C30 40 40 20 54 34"/>
  <path d="M60 6 q6 10 0 20 q-6 10 0 20 M6 60 q10 6 20 0 q10 -6 20 0" opacity="0.7"/>
  <circle cx="40" cy="44" r="2.500" fill="currentColor"/></g></svg>`;

// Une rune du vieux futhark par action du menu, pour le sens autant que pour le décor.
const RUNES = { continuer: 'ᚱ', nouvelle: 'ᛞ', chapitres: 'ᛒ', fins: 'ᛟ', options: 'ᚲ' };

const plaque = (action, titre, sous, { principal = false, desactive = false } = {}) => `
  <button class="plaque ${principal ? 'plaque--principale' : ''}" data-action="${action}" ${desactive ? 'disabled' : ''}>
    <span class="plaque__rune" aria-hidden="true">${RUNES[action]}</span>
    <span class="plaque__texte"><span class="plaque__titre">${titre}</span>${sous ? `<span class="plaque__sous">${sous}</span>` : ''}</span>
    <span class="plaque__clou plaque__clou--g" aria-hidden="true"></span><span class="plaque__clou plaque__clou--d" aria-hidden="true"></span>
  </button>`;

export function monterMenu(racine, actions) {
  const partie = sauvegarde.lirePartie();
  const profil = sauvegarde.lireProfil();
  const nbFins = profil.finsDebloquees.length;
  const tri = [...FINS].sort((a, b) => a.num - b.num);

  racine.innerHTML = `
    <section class="accueil">
      <div class="accueil__scene">${sceneAccueil()}</div>
      <div class="accueil__voile" aria-hidden="true"></div>
      <div class="accueil__coins" aria-hidden="true">${['hg', 'hd', 'bg', 'bd'].map((c) => `<span class="coin coin--${c}">${COIN}</span>`).join('')}</div>
      <div class="accueil__contenu">
        <header class="accueil__titre">
          <p class="accueil__runes" aria-hidden="true">ᛋᚢᚱᚢᛁᚢᚱᚨᛁᛋ · ᛏᚢ · ᚨᚢ · ᚱᚨᛁᛞ</p>
          <h1><span class="accueil__l1">Survivrais-tu</span><span class="accueil__l2">au raid ?</span></h1>
          <div class="accueil__filet" aria-hidden="true"><span></span>${NOEUD}<span></span></div>
          <p class="accueil__sous">Une saga en cinq chapitres. Dix fins. Aucune n'est juste.</p>
        </header>
        <nav class="accueil__menu" aria-label="Menu principal">
          ${partie ? plaque('continuer', 'Continuer la saga', `Chapitre ${partie.chapitre} · ${partie.perso.prenom}`, { principal: true }) : ''}
          ${plaque('nouvelle', 'Nouvelle saga', partie ? 'Ta partie en cours sera remplacée' : 'Choisis qui tu seras', { principal: !partie })}
          ${plaque('chapitres', 'Chapitres', Object.keys(profil.checkpoints).length ? 'Reprendre un chapitre déjà atteint' : 'Aucun chapitre atteint', { desactive: !Object.keys(profil.checkpoints).length })}
          ${plaque('fins', 'Les fins', `${nbFins} découverte${nbFins > 1 ? 's' : ''} sur ${FINS.length}`)}
          ${plaque('options', 'Options', 'Chronos, données')}
        </nav>
        <div class="accueil__pierres" title="${nbFins} fin${nbFins > 1 ? 's' : ''} découverte${nbFins > 1 ? 's' : ''} sur ${FINS.length}">
          ${tri.map((f) => `<span class="pierre ${profil.finsDebloquees.includes(f.id) ? 'est-gravee' : ''}" aria-hidden="true">${profil.finsDebloquees.includes(f.id) ? RUNES_FINS[f.num - 1] : ''}</span>`).join('')}
        </div>
      </div>
    </section>`;

  racine.onclick = (ev) => {
    const b = ev.target.closest('[data-action]');
    if (b && actions[b.dataset.action]) actions[b.dataset.action]();
  };
}

export function monterChapitres(racine, { onChoisir, onRetour }) {
  const profil = sauvegarde.lireProfil();
  racine.innerHTML = `
    <section class="liste">
      <header class="liste__tete"><button class="btn btn--discret" data-action="retour">← Menu</button><h1>Chapitres</h1></header>
      <p class="liste__aide">Reprendre un chapitre te replace à son début, avec le viking et les choix que tu avais alors. Les fins déjà découvertes restent acquises.</p>
      <div class="liste__items">
        ${CHAPITRES.map((nom, i) => {
          const n = i + 1;
          const cp = profil.checkpoints[n];
          return `<button class="carte ${cp ? '' : 'est-verrouille'}" data-chapitre="${n}" ${cp ? '' : 'disabled'}>
            <span class="carte__num">Chapitre ${n}</span>
            <span class="carte__nom">${cp ? nom : '???'}</span>
            ${cp ? `<span class="carte__sous">${cp.perso.prenom}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
    </section>`;
  racine.onclick = (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.action === 'retour') onRetour();
    else if (b.dataset.chapitre) onChoisir(profil.checkpoints[b.dataset.chapitre]);
  };
}

export function monterFins(racine, { onRetour }) {
  const profil = sauvegarde.lireProfil();
  const tri = [...FINS].sort((a, b) => a.num - b.num);
  racine.innerHTML = `
    <section class="liste">
      <header class="liste__tete"><button class="btn btn--discret" data-action="retour">← Menu</button><h1>Fins</h1></header>
      <p class="liste__aide">${profil.finsDebloquees.length} découverte${profil.finsDebloquees.length > 1 ? 's' : ''} sur ${FINS.length}.</p>
      <div class="liste__items liste__items--fins">
        ${tri.map((f) => {
          const ok = profil.finsDebloquees.includes(f.id);
          return `<div class="fin-carte ${ok ? 'est-trouvee' : ''}">
            <div class="fin-carte__image">${silhouetteFin(f, ok)}</div>
            <span class="carte__num">Fin ${f.num}</span>
            <span class="carte__nom">${ok ? f.nom : f.secrete ? '?' : '· · ·'}</span>
            <span class="carte__sous">${ok ? f.ton : ''}</span>
          </div>`;
        }).join('')}
      </div>
    </section>`;
  racine.onclick = (ev) => {
    if (ev.target.closest('[data-action="retour"]')) onRetour();
  };
}

function silhouetteFin(f, ok) {
  const c = ok ? 'var(--color-accent)' : 'var(--color-border)';
  return `<svg viewBox="0 0 80 80" aria-hidden="true">
    <circle cx="40" cy="28" r="14" fill="${c}"/>
    <path d="M14 78 Q14 46 40 46 Q66 46 66 78 Z" fill="${c}"/>
    ${f.secrete && !ok ? '<text x="40" y="36" text-anchor="middle" font-size="26" fill="var(--color-bg)" font-weight="700">?</text>' : ''}
  </svg>`;
}

export function monterOptions(racine, { onRetour }) {
  const profil = sauvegarde.lireProfil();
  const niveaux = [
    ['normal', 'Normal', 'Les choix chronométrés durent 5 à 8 secondes.'],
    ['lent', 'Lent', 'Deux fois plus de temps.'],
    ['off', 'Désactivé', 'Plus de chrono. Tu prends ton temps, le drakkar t’attend.'],
  ];
  racine.innerHTML = `
    <section class="liste">
      <header class="liste__tete"><button class="btn btn--discret" data-action="retour">← Menu</button><h1>Options</h1></header>
      <div class="champ">
        <span class="champ__nom">Choix chronométrés</span>
        <div class="liste__items">
          ${niveaux.map(([id, nom, aide]) => `<button class="carte ${profil.options.chrono === id ? 'est-actif' : ''}" data-chrono="${id}">
            <span class="carte__nom">${nom}</span><span class="carte__sous">${aide}</span></button>`).join('')}
        </div>
      </div>
      <div class="champ">
        <span class="champ__nom">Données</span>
        <button class="btn btn--danger" data-action="effacer">Effacer toute la progression</button>
      </div>
    </section>`;
  racine.onclick = (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.action === 'retour') onRetour();
    else if (b.dataset.chrono) {
      sauvegarde.setOption('chrono', b.dataset.chrono);
      monterOptions(racine, { onRetour });
    } else if (b.dataset.action === 'effacer') {
      if (confirm('Tout effacer ? Fins, chapitres, partie en cours. Les dieux ne rendent rien.')) {
        sauvegarde.effacerPartie();
        sauvegarde.ecrireProfil({ finsDebloquees: [], checkpoints: {}, options: profil.options });
        onRetour();
      }
    }
  };
}

export function monterFin(racine, scene, etat, { onMenu, onFins }) {
  const fin = FINS.find((f) => f.id === scene.fin);
  const compagnons = ['sigrid', 'ulf', 'eirik', 'aude'];
  const recap = compagnons.map((id) => {
    const p = PERSONNAGES[id];
    const mort = etat.morts[id];
    const jamais = id === 'aude' && !etat.flags.aude_rencontree;
    return `<li class="${mort ? 'est-mort' : ''}"><span style="color:${p.couleur}">${p.nom}</span> — ${jamais ? 'jamais rencontrée' : mort ? 'mort·e' : 'en vie'}</li>`;
  }).join('');

  const profil = sauvegarde.lireProfil();
  racine.innerHTML = `
    <section class="jeu jeu--fin">
      <div class="jeu__decor">${composerDecor(scene, etat)}</div>
      <div class="jeu__texte">
        <p class="fin__etiquette">Fin ${fin?.num ?? ''} · ${fin?.ton ?? ''}</p>
        <h1 class="fin__titre">${fin?.nom ?? scene.fin}</h1>
        ${formaterTexte(scene.texte, etat)}
        <h2 class="fin__sous">Ce qu'il en reste</h2>
        <ul class="fin__recap">${recap}</ul>
        <p class="fin__compteur">${profil.finsDebloquees.length} fin${profil.finsDebloquees.length > 1 ? 's' : ''} découverte${profil.finsDebloquees.length > 1 ? 's' : ''} sur ${FINS.length}.</p>
      </div>
      <div class="jeu__choix">
        <button class="choix" data-action="fins">Voir les fins</button>
        <button class="choix" data-action="menu">Retour au menu</button>
      </div>
    </section>`;
  racine.onclick = (ev) => {
    const b = ev.target.closest('[data-action]');
    if (!b) return;
    if (b.dataset.action === 'menu') onMenu();
    if (b.dataset.action === 'fins') onFins();
  };
}
