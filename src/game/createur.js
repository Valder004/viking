// Écran de création du viking : calques SVG + prénom + origine.
import { OPTIONS, APPARENCE_DEFAUT, apparenceAuHasard, vikingSvg } from './sprites/viking.js';
import { ORIGINES } from '../data/origines.js';
import { prenomAuHasard } from '../data/prenoms.js';

const CHAMPS = [
  { cle: 'peau', nom: 'Peau', type: 'couleur', options: OPTIONS.peau },
  { cle: 'cheveux', nom: 'Cheveux', type: 'couleur', options: OPTIONS.cheveux },
  { cle: 'coiffure', nom: 'Coiffure', type: 'choix', options: OPTIONS.coiffure },
  { cle: 'barbe', nom: 'Barbe', type: 'choix', options: OPTIONS.barbe },
  { cle: 'peinture', nom: 'Peinture de guerre', type: 'choix', options: OPTIONS.peinture },
  { cle: 'peintureCouleur', nom: 'Couleur de peinture', type: 'couleur', options: OPTIONS.peintureCouleur, si: (a) => a.peinture !== 'aucune' },
  { cle: 'tenue', nom: 'Tenue', type: 'couleur', options: OPTIONS.tenue },
  { cle: 'casque', nom: 'Casque', type: 'choix', options: OPTIONS.casque },
  { cle: 'motif', nom: 'Motif du bouclier', type: 'choix', options: OPTIONS.motif },
  { cle: 'bouclier1', nom: 'Bouclier, fond', type: 'couleur', options: OPTIONS.bouclierCouleurs },
  { cle: 'bouclier2', nom: 'Bouclier, motif', type: 'couleur', options: OPTIONS.bouclierCouleurs, si: (a) => a.motif !== 'uni' },
  { cle: 'arme', nom: 'Arme', type: 'choix', options: OPTIONS.arme },
];

export function monterCreateur(racine, { onValider, onRetour }) {
  const apparence = { ...APPARENCE_DEFAUT };
  let prenom = prenomAuHasard();
  let origine = 'pecheur';

  racine.innerHTML = `
    <section class="createur">
      <header class="createur__tete">
        <button class="btn btn--discret" data-action="retour">← Menu</button>
        <h1>Qui es-tu ?</h1>
      </header>
      <div class="createur__corps">
        <div class="createur__apercu">
          <div class="apercu" data-apercu></div>
          <button class="btn btn--discret" data-action="hasard">Au hasard</button>
        </div>
        <div class="createur__options">
          <label class="champ">
            <span class="champ__nom">Prénom</span>
            <span class="champ__ligne">
              <input type="text" maxlength="16" data-prenom value="${prenom}" />
              <button class="btn btn--discret" data-action="prenom" title="Prénom nordique au hasard">⚄</button>
            </span>
          </label>
          <div class="champ">
            <span class="champ__nom">Origine</span>
            <div class="origines" data-origines></div>
            <p class="origine__resume" data-resume></p>
          </div>
          <div data-calques></div>
        </div>
      </div>
      <footer class="createur__pied">
        <button class="btn btn--principal" data-action="valider">Embarquer</button>
      </footer>
    </section>`;

  const $ = (s) => racine.querySelector(s);
  const apercu = $('[data-apercu]');
  const calques = $('[data-calques]');
  const originesEl = $('[data-origines]');
  const resume = $('[data-resume]');
  const inputPrenom = $('[data-prenom]');

  function rendreApercu() {
    apercu.innerHTML = vikingSvg(apparence, null, 'class="apercu__svg"');
  }

  function rendreOrigines() {
    originesEl.innerHTML = Object.entries(ORIGINES)
      .map(([id, o]) => `<button class="pastille ${id === origine ? 'est-actif' : ''}" data-origine="${id}">${o.nom}</button>`)
      .join('');
    resume.textContent = ORIGINES[origine].resume;
  }

  function rendreCalques() {
    calques.innerHTML = CHAMPS.filter((c) => !c.si || c.si(apparence))
      .map((c) => {
        const boutons =
          c.type === 'couleur'
            ? c.options
                .map((v) => `<button class="nuance ${apparence[c.cle] === v ? 'est-actif' : ''}" style="--c:${v}" data-cle="${c.cle}" data-val="${v}" aria-label="${v}"></button>`)
                .join('')
            : c.options
                .map((o) => `<button class="pastille ${apparence[c.cle] === o.id ? 'est-actif' : ''}" data-cle="${c.cle}" data-val="${o.id}">${o.nom}</button>`)
                .join('');
        return `<div class="champ"><span class="champ__nom">${c.nom}</span><div class="champ__options">${boutons}</div></div>`;
      })
      .join('');
  }

  function toutRendre() {
    rendreApercu();
    rendreOrigines();
    rendreCalques();
  }

  racine.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.cle) {
      apparence[b.dataset.cle] = b.dataset.val;
      toutRendre();
    } else if (b.dataset.origine) {
      origine = b.dataset.origine;
      rendreOrigines();
    } else if (b.dataset.action === 'hasard') {
      Object.assign(apparence, apparenceAuHasard());
      toutRendre();
    } else if (b.dataset.action === 'prenom') {
      prenom = prenomAuHasard();
      inputPrenom.value = prenom;
    } else if (b.dataset.action === 'retour') {
      onRetour();
    } else if (b.dataset.action === 'valider') {
      prenom = inputPrenom.value.trim() || prenomAuHasard();
      onValider({ prenom, origine, apparence: { ...apparence } });
    }
  });

  inputPrenom.addEventListener('input', () => { prenom = inputPrenom.value; });

  toutRendre();
}
