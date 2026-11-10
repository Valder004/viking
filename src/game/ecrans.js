// Écrans hors jeu : menu principal, chapitres, galerie des fins, options, écran de fin.
import { FINS } from '../data/fins.js';
import { PERSONNAGES } from '../data/personnages.js';
import { sauvegarde } from './sauvegarde.js';
import { formaterTexte } from './texte.js';
import { composerDecor } from './scene.js';

const CHAPITRES = ['Le village', 'Le drakkar', 'La côte franque', 'Le château', 'Le dénouement'];

export function monterMenu(racine, actions) {
  const partie = sauvegarde.lirePartie();
  const profil = sauvegarde.lireProfil();
  const nbFins = profil.finsDebloquees.length;

  racine.innerHTML = `
    <section class="menu">
      <div class="menu__titre">
        <p class="menu__sur">Un jeu narratif</p>
        <h1>Survivrais-tu<br>au raid ?</h1>
      </div>
      <div class="menu__actions">
        ${partie ? `<button class="btn btn--principal" data-action="continuer">Continuer <small>chapitre ${partie.chapitre} · ${partie.perso.prenom}</small></button>` : ''}
        <button class="btn ${partie ? '' : 'btn--principal'}" data-action="nouvelle">Nouvelle partie</button>
        <button class="btn" data-action="chapitres" ${Object.keys(profil.checkpoints).length ? '' : 'disabled'}>Chapitres</button>
        <button class="btn" data-action="fins">Fins découvertes <small>${nbFins} / ${FINS.length}</small></button>
        <button class="btn btn--discret" data-action="options">Options</button>
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
