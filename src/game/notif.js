// Petites notifications en haut de l'écran : relation qui bouge, objet obtenu ou perdu.
import { iconeObjet } from '../data/objets.js';

function conteneur() {
  let el = document.querySelector('.notifs');
  if (!el) {
    el = document.createElement('div');
    el.className = 'notifs';
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  return el;
}

const SIGNES = { plus: '▲', moins: '▼', objet: '+', perdu: '−' };

export function notifier(notifs) {
  const zone = conteneur();
  notifs.forEach((n, i) => {
    const el = document.createElement('div');
    el.className = `notif notif--${n.sens}`;
    if (n.couleur) el.style.setProperty('--couleur', n.couleur);
    el.innerHTML = `<span class="notif__signe">${n.objet ? iconeObjet(n.objet, 22) : SIGNES[n.sens]}</span><span>${n.texte}</span>`;
    el.style.animationDelay = `${i * 120}ms`;
    zone.appendChild(el);
    setTimeout(() => el.classList.add('sort'), 3600 + i * 120);
    setTimeout(() => el.remove(), 4200 + i * 120);
  });
}

export function viderNotifs() {
  document.querySelector('.notifs')?.replaceChildren();
}
