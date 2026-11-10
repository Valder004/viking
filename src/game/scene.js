// Rendu d'une scène : décor + personnages + texte + choix + chrono.
import { DECORS } from './decors/index.js';
import { vikingContenu } from './sprites/viking.js';
import { pnjContenu } from './sprites/pnj.js';
import { PERSONNAGES } from '../data/personnages.js';
import { formaterTexte } from './texte.js';

const echapper = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Compose le SVG du décor avec le joueur et les PNJ placés dessus. */
export function composerDecor(scene, etat) {
  const decor = DECORS[scene.decor] ?? DECORS.vide;
  const { svg, joueur, places } = decor(etat);

  const pnj = (typeof scene.personnages === 'function' ? scene.personnages(etat) : scene.personnages) ?? [];
  const presents = pnj.filter((id) => !etat.morts[id] && PERSONNAGES[id]);

  const groupe = (contenu, p) =>
    `<g transform="translate(${p.x} ${p.y}) scale(${p.scale})${p.miroir ? ' translate(200 0) scale(-1 1)' : ''}">${contenu}</g>`;

  const persos = presents
    .map((id, i) => (places[i] ? groupe(pnjContenu(id), places[i]) : ''))
    .join('');
  const moi = scene.sansJoueur ? '' : groupe(vikingContenu(etat.perso.apparence, etat), joueur);

  // Le joueur est dessiné après les PNJ : il est devant. Un décor peut placer le
  // repère <!--persos--> pour que des éléments (bastingage, brume) passent devant eux.
  const calque = `${persos}${moi}`;
  return svg.includes('<!--persos-->')
    ? svg.replace('<!--persos-->', calque)
    : svg.replace('</svg>', `${calque}</svg>`);
}

export function monterScene(racine, moteur) {
  racine.innerHTML = `
    <section class="jeu">
      <div class="jeu__decor" data-decor></div>
      <div class="jeu__chrono" data-chrono hidden><div class="jeu__chrono-barre" data-chrono-barre></div></div>
      <div class="jeu__texte" data-texte></div>
      <div class="jeu__choix" data-choix></div>
      <nav class="jeu__menu">
        <button class="btn btn--discret" data-action="menu">Menu</button>
      </nav>
    </section>`;

  const $ = (s) => racine.querySelector(s);
  const decorEl = $('[data-decor]');
  const texteEl = $('[data-texte]');
  const choixEl = $('[data-choix]');
  const chronoEl = $('[data-chrono]');
  const barreEl = $('[data-chrono-barre]');

  let choixCourants = [];

  moteur.onScene = (scene, choix, chrono) => {
    choixCourants = choix;
    decorEl.innerHTML = composerDecor(scene, moteur.etat);
    texteEl.innerHTML = formaterTexte(scene.texte, moteur.etat);
    choixEl.innerHTML = choix
      .map((c, i) => `<button class="choix" data-choix="${i}" style="--i:${i}">${echapper(typeof c.texte === 'function' ? c.texte(moteur.etat) : c.texte)}</button>`)
      .join('');
    if (scene.aSuivre) {
      choixEl.innerHTML += `<button class="choix" data-action="menu">Retour au menu</button>`;
    }
    texteEl.scrollTop = 0;

    chronoEl.hidden = !chrono;
    if (chrono) {
      barreEl.style.transform = 'scaleX(1)';
      moteur.lancerChrono(scene, (ratio) => {
        barreEl.style.transform = `scaleX(${ratio})`;
        chronoEl.classList.toggle('est-urgent', ratio < 0.35);
      });
    }
    window.scrollTo({ top: 0 });
  };

  choixEl.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-action="menu"]')) {
      $('.jeu__menu [data-action="menu"]').click();
      return;
    }
    const b = ev.target.closest('[data-choix]');
    if (!b) return;
    choixEl.querySelectorAll('.choix').forEach((x) => (x.disabled = true));
    moteur.choisir(choixCourants[Number(b.dataset.choix)]);
  });

  return { menuBtn: $('[data-action="menu"]') };
}
