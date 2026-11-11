// Chapitre 1 — Le village. Pas de chrono, pas de mort. Tout ce qu'on sème ici se récolte plus tard.
// La nuit au port est un lieu explorable : on y marche, on y parle, on y ramasse de quoi agir.
import { fx, si } from '../outils.js';
import { ORIGINES } from '../origines.js';
import { armeMurale } from '../../game/sprites/armes.js';

const objet = (e) => ORIGINES[e.perso.origine].objet;
const prendreObjetFamille = (e) => fx.prendre(objet(e).id)(e);
const perdreObjetFamille = (e) => fx.perdre(objet(e).id)(e);

export const CH1 = [
  // ------------------------------------------------- La hutte (exploration)
  {
    id: 'c1_hutte',
    chapitre: 1,
    type: 'lieu',
    decor: 'hutte',
    titre: 'La hutte, avant l’aube',
    arrivee: 'Il fait encore nuit quand ta mère te secoue. Elle ne dit rien. Elle a ce visage des matins où quelqu’un part. Le feu est déjà ranimé.',
    // Tant que l'arme est au mur, le joueur est dessiné sans elle.
    entree: (e) => { if (!e.flags.arme_prise) e.flags.sans_arme = true; },
    conseil: (e) => (!e.flags.c1_mere_vue
      ? 'Ta mère t’attend près du métier à tisser. Clique sur elle pour lui parler.'
      : e.flags.sans_arme
        ? 'Ton arme et ton bouclier sont accrochés au mur, près de la porte. Clique dessus pour les prendre.'
        : e.flags.c1_cour_vue ? null : 'Te voilà prêt·e. Clique sur la porte, à droite, pour sortir.'),
    sol: { y: 424, xmin: 70, xmax: 740 },
    depart: 420,
    quetes: [
      { texte: 'Parler à ta mère', fait: si.flag('c1_mere_vue') },
      { texte: 'Regarder une dernière fois', fait: si.et(si.flag('c1_bouclier_vu'), si.flag('c1_fenetre_vue')), facultatif: true },
      { texte: 'Prendre ton arme et ton bouclier', visible: si.flag('c1_mere_vue'), fait: si.flag('arme_prise') },
      { texte: 'Sortir dans le village', visible: si.flag('arme_prise'), fait: () => false },
    ],
    elements: [
      {
        id: 'metier', type: 'zone', x: 92, y: 180, l: 120, h: 220, nom: 'Le métier à tisser',
        action: { examiner: 'La toile rouge n’est pas finie. Elle ne le sera pas avant ton retour, et ta mère le sait : elle a cessé de tisser le jour où Hakon a parlé de la Francie.' },
      },
      {
        id: 'mere', type: 'pnj', perso: 'parent', x: 190, nom: 'Ta mère',
        important: si.pasFlag('c1_mere_vue'),
        action: (e) => (e.flags.c1_mere_vue
          ? { examiner: e.flags.objet_refuse ? 'Elle a refermé la main sur l’objet. Elle ne le rouvrira pas.' : 'Elle regarde le feu. Elle a dit ce qu’elle avait à dire, et une chose de moins.' }
          : { scene: 'c1_hutte_mere' }),
      },
      {
        id: 'bouclier', type: 'zone', x: 316, y: 126, l: 100, h: 100, nom: 'Le bouclier de ton père',
        action: { examiner: 'Fendu d’un coup de hache, du bord jusqu’à l’umbo. On te l’a rapporté il y a six ans, sans lui. Ta mère l’a accroché là où on le voit depuis la couche, et depuis la porte.', effets: fx.flag('c1_bouclier_vu') },
      },
      {
        id: 'foyer', type: 'zone', x: 362, y: 300, l: 150, h: 80, nom: 'Le foyer',
        action: { examiner: (e) => (e.perso.origine === 'forgeron' ? 'Le chaudron fuit à la soudure. Tu l’as réparé deux fois. Tu ne le répareras pas une troisième ; pas ce matin.' : 'Une soupe d’orge. Elle a mis le dernier morceau de lard. Tu fais semblant de ne pas le remarquer.') },
      },
      {
        id: 'fenetre', type: 'zone', x: 705, y: 140, l: 150, h: 150, nom: 'La fenêtre',
        action: { examiner: 'La neige tombe droite, sans vent, comme si elle aussi attendait. En bas, le port se réveille : un seau, une corde, quelqu’un qui tousse.', effets: fx.flag('c1_fenetre_vue') },
      },
      {
        id: 'arme', type: 'zone', x: 588, y: 166, l: 70, h: 176, nom: 'Ton arme et ton bouclier',
        visible: si.flag('sans_arme'),
        important: si.flag('c1_mere_vue'),
        dessin: (e) => armeMurale(e.perso.apparence, 588, 92),
        action: (e) => ({
          examiner: {
            hache: 'Ta hache. Tu l’as affûtée hier soir, et encore ce matin, sans raison. Le bouclier pèse moins que dans ton souvenir. Ça ne durera pas.',
            epee: 'Ton épée. Elle a coûté trois hivers de travail. Tu la passes à ta ceinture comme on met un nom. Le bouclier pèse moins que dans ton souvenir.',
            lance: 'Ta lance. Elle te dépasse d’une tête, et elle t’a déjà gardé·e en vie contre un sanglier. Les Francs sont plus grands. Tu prends aussi le bouclier.',
            arc: 'Ton arc. Tu le bandes une fois, par habitude, et tu écoutes la corde. Elle chante juste. Tu prends aussi le bouclier, pour ce que ça vaudra.',
          }[e.perso.apparence.arme] ?? 'Tu décroches ton arme et ton bouclier.',
          effets: (x) => { x.flags.sans_arme = false; x.flags.arme_prise = true; },
        }),
      },
      {
        id: 'sortie', type: 'sortie', x: 756, nom: 'Sortir',
        action: {
          suivant: 'c1_cour',
          position: 190,
          condition: si.et(si.flag('c1_mere_vue'), si.flag('arme_prise')),
          refus: (e) => (!e.flags.c1_mere_vue
            ? 'Ta mère est debout près du métier à tisser. Elle ne t’appelle pas. C’est à toi d’y aller.'
            : 'On ne part pas en raid les mains vides. Ton arme est au mur, près de la porte.'),
        },
      },
    ],
  },
  {
    id: 'c1_hutte_mere',
    decor: 'hutte',
    personnages: ['parent'],
    texte: (e) => `
Elle ne dit rien d'abord. Dehors, la neige tombe droite, sans vent.

Elle ouvre la main. Dedans, ${objet(e).nom}.

**Ta mère :** « Prends-le. Ou ne le prends pas. Mais ne me le rends pas comme ton père l'a fait. »

${objet(e).texte}`,
    choix: [
      {
        texte: 'Le prendre, sans un mot.',
        effets: fx.tous(fx.flag('objet_famille'), prendreObjetFamille),
        suivant: 'c1_hutte_sortie',
      },
      {
        texte: 'Le prendre et promettre de le rapporter.',
        effets: fx.tous(fx.flag('objet_famille'), fx.flag('promesse_retour'), prendreObjetFamille),
        suivant: 'c1_hutte_sortie',
      },
      {
        texte: '« Garde-le. Tu en auras plus besoin que moi. »',
        effets: fx.flag('objet_refuse'),
        suivant: 'c1_hutte_sortie',
      },
    ],
  },
  {
    id: 'c1_hutte_sortie',
    decor: 'hutte',
    personnages: ['parent'],
    entree: fx.flag('c1_mere_vue'),
    texte: (e) => {
      if (e.flags.promesse_retour)
        return `Elle hoche la tête. Elle a entendu cette phrase trois fois dans sa vie. Elle sait exactement ce qu'elle vaut.

**Ta mère :** « Les promesses, c'est pour les scaldes. Reviens, c'est tout. »

**Ta mère :** « Ton arme est au mur, près de la porte. Ne pars pas sans elle. Et ne reviens pas sans toi. »`;
      if (e.flags.objet_refuse)
        return `Elle referme la main. Quelque chose passe sur son visage, trop vite pour que tu saches si c'est de la fierté ou de la peur.

**Ta mère :** « Tu es bien son enfant. »

Ce n'est pas un compliment. Ce n'est pas une insulte non plus. **Ta mère :** « Ton arme est au mur, près de la porte. Ne pars pas sans elle. Et ne reviens pas sans toi. »`;
      return `Tu le glisses dans ta ceinture. Elle ne te regarde pas faire ; elle regarde le feu.

**Ta mère :** « Hakon parle fort. Les hommes qui parlent fort ont besoin de gens qui écoutent. Ne sois pas de ceux-là. »

**Ta mère :** « Ton arme est au mur, près de la porte. Ne pars pas sans elle. Et ne reviens pas sans toi. »`;
    },
    choix: [{ texte: 'Hocher la tête.', suivant: 'c1_hutte' }],
  },

  // ------------------------------------------------ La cour (exploration, large)
  {
    id: 'c1_cour',
    type: 'lieu',
    decor: 'cour',
    largeur: 1600,
    titre: 'Le village',
    entree: fx.flag('c1_cour_vue'),
    arrivee: 'Le froid te prend au visage. Le village s’éveille sous la neige : la forge rougeoie déjà, et tout le monde monte vers la grande halle. Marche vers la droite.',
    sol: { y: 430, xmin: 40, xmax: 1572 },
    depart: 190,
    quetes: [
      { texte: 'Monter à la grande halle', fait: si.flag('c1_discours_vu') },
      { texte: 'Passer à la forge', fait: si.flag('pris_pierre'), facultatif: true },
      { texte: 'Descendre au port', visible: si.flag('c1_discours_vu'), fait: () => false },
    ],
    elements: [
      {
        id: 'porte_hutte', type: 'zone', x: 160, y: 300, l: 84, h: 150, nom: 'La hutte familiale',
        action: { suivant: 'c1_hutte', position: 700 },
      },
      {
        id: 'bois', type: 'zone', x: 334, y: 346, l: 64, h: 56, nom: 'Le tas de bois',
        action: { examiner: 'Assez de bûches pour l’hiver. Tu les as fendues toi-même, à l’automne. Ta mère n’aura pas à demander.' },
      },
      {
        id: 'puits', type: 'zone', x: 430, y: 310, l: 84, h: 130, nom: 'Le puits',
        action: { examiner: (e) => (e.flags.c1_discours_vu
          ? 'L’eau du puits est noire. Tout au fond, la lune. Quelque chose passe devant, une seconde, et la lune revient.'
          : 'Tu remontes le seau. Sur l’eau, une plume noire. Tu la retires du bout des doigts et tu bois quand même.') },
      },
      {
        id: 'forge', type: 'zone', x: 734, y: 290, l: 110, h: 150, nom: 'La forge',
        action: { examiner: (e) => (e.perso.origine === 'forgeron'
          ? 'La forge de ton père. Il n’est pas là ; il n’aime pas les départs. Il a laissé le feu allumé et une pierre à aiguiser sur l’enclume. C’est sa façon de dire au revoir.'
          : 'Le forgeron n’est pas là. Le feu, si. Des fers de lance refroidissent dans le baquet : il a travaillé toute la nuit pour Hakon.') },
      },
      {
        id: 'pierre', type: 'objet', objet: 'pierre', x: 829, y: 314, nom: 'Une pierre à aiguiser',
        action: { prendre: 'pierre', texte: 'Elle est posée sur l’enclume, usée en creux par vingt ans de lames. Personne ne la réclamera avant ton retour.' },
      },
      {
        id: 'porte_halle', type: 'zone', x: 1136, y: 296, l: 116, h: 164, nom: 'La grande halle',
        important: si.pasFlag('c1_discours_vu'),
        action: { suivant: 'c1_halle', position: 640 },
      },
      {
        id: 'sortie', type: 'sortie', x: 1572, nom: 'Descendre au port',
        action: {
          suivant: 'c1_port',
          position: 404,
          condition: si.flag('c1_discours_vu'),
          refus: 'Le chemin du port est vide. Tout le village est dans la grande halle : le jarl parle ce matin, et personne ne manque ça.',
        },
      },
    ],
  },

  // ------------------------------------------- La grande halle (exploration)
  {
    id: 'c1_halle',
    type: 'lieu',
    decor: 'halle',
    titre: 'La grande halle',
    arrivee: 'La halle sent la fumée, la bière et la laine mouillée. Tout le village tient dedans. Hakon n’a pas encore parlé, et tout le monde attend qu’il le fasse.',
    sol: { y: 436, xmin: 110, xmax: 690 },
    depart: 400,
    quetes: [
      { texte: 'Écouter le jarl', fait: si.flag('c1_discours_vu') },
      { texte: 'Prendre la température de la halle', fait: si.et(si.flag('c1_halle_sigrid'), si.flag('c1_halle_ulf')), facultatif: true },
      { texte: 'Sortir et descendre au port', visible: si.flag('c1_discours_vu'), fait: () => false },
    ],
    elements: [
      {
        id: 'ulf', type: 'pnj', perso: 'ulf', x: 180, miroir: true, nom: 'Ulf le Borgne',
        action: (e) => (e.flags.c1_halle_ulf
          ? { examiner: 'Ulf ne regarde pas Hakon. Il regarde l’endroit où Hakon regarde. C’est différent.' }
          : { scene: 'c1_halle_ulf' }),
      },
      {
        id: 'sigrid', type: 'pnj', perso: 'sigrid', x: 286, miroir: true, nom: 'Sigrid',
        action: (e) => (e.flags.c1_halle_sigrid
          ? { examiner: 'Sigrid est déjà debout. Elle sera debout avant tout le monde, ce soir et tous les autres.' }
          : { scene: 'c1_halle_sigrid' }),
      },
      {
        id: 'hakon', type: 'pnj', perso: 'hakon', x: 400, solY: 300, echelle: 0.44, nom: 'Hakon, le jarl',
        important: si.pasFlag('c1_discours_vu'),
        action: (e) => (e.flags.c1_discours_vu
          ? { examiner: 'Hakon est rassis. Il a dit ce qu’il avait à dire, et compté ceux qui ont crié avec lui.' }
          : { scene: 'c1_halle_discours' }),
      },
      {
        id: 'tenture', type: 'zone', x: 400, y: 144, l: 200, h: 120, nom: 'La tenture',
        action: { examiner: 'Un drakkar brodé d’or sur fond rouge. Il date du vieux jarl. Hakon l’a gardée ; il a seulement fait découdre le nom.', effets: fx.flag('c1_tenture_vue') },
      },
      {
        id: 'eirik', type: 'pnj', perso: 'eirik', x: 540, nom: 'Eirik',
        action: (e) => ({ examiner: e.flags.c1_discours_vu
          ? (e.flags.eirik_humilie ? 'Eirik ne te regarde plus. Il regarde la porte.' : 'Eirik fait semblant de ne pas t’avoir vu. Il n’est pas doué.')
          : 'Eirik, le fils du jarl, debout à côté du siège haut. Il te cherche des yeux. Il a déjà sa phrase prête.' }),
      },
      {
        id: 'tonneau', type: 'zone', x: 668, y: 340, l: 70, h: 80, nom: 'Le tonneau de bière',
        action: { prendre: 'biere', texte: 'Tu remplis une corne pendant que tout le monde regarde Hakon. Elle mousse. Tu la tiens droite.' },
      },
      {
        id: 'sortie', type: 'sortie', x: 686, nom: 'Sortir de la halle',
        action: { suivant: 'c1_cour', position: 1136, condition: si.flag('c1_discours_vu'), refus: 'Personne ne sort pendant que le jarl se lève. Et il va se lever.' },
      },
    ],
  },
  {
    id: 'c1_halle_ulf',
    decor: 'halle',
    personnages: ['ulf'],
    entree: fx.flag('c1_halle_ulf'),
    texte: `
Ulf le Borgne est assis tout au bout du banc, là où la lumière du feu n'arrive plus qu'à moitié. Il ne boit pas. Il regarde Hakon.

**Ulf :** « Tu vois comme il se tient ? Les épaules en arrière. Il a répété. »

Il ne te regarde toujours pas.

**Ulf :** « Écoute ce qu'il va dire. Puis écoute ce qu'il ne dira pas. C'est là que ça se passe. »`,
    choix: [
      { texte: 'Lui tendre la corne de bière.', objet: 'biere', effets: fx.tous(fx.flag('ulf_biere'), fx.confiance('ulf', 1)), suivant: 'c1_halle_ulf_suite' },
      { texte: '« Et toi, tu as répété quoi ? »', effets: fx.confiance('ulf', 1), suivant: 'c1_halle_ulf_suite' },
      { texte: 'Hocher la tête et retourner vers le feu.', suivant: 'c1_halle' },
    ],
  },
  {
    id: 'c1_halle_ulf_suite',
    decor: 'halle',
    personnages: ['ulf'],
    texte: (e) => (e.flags.ulf_biere
      ? `Il prend la corne, la regarde, et boit. Longtemps. Quand il la rend, elle est vide.

**Ulf :** « La dernière fois qu'on m'a offert à boire dans cette halle, c'était le vieux jarl. La veille du raid. » Il essuie sa bouche. « Il est mort dans son lit. Les hommes qui ont ramé pour lui, non. »

Il te regarde enfin, de son seul œil, et il y a quelque chose là-dedans qui ressemble à de la gratitude. Ou à de la pitié. Avec Ulf, c'est souvent la même chose.`
      : `Un silence. Puis quelque chose qui pourrait être un rire, ou une toux.

**Ulf :** « Moi ? Je répète la même chose depuis six ans. Personne ne m'a encore demandé le texte. »

Il se retourne vers Hakon. La conversation est finie, mais il n'a pas dit non.`),
    choix: [{ texte: 'Retourner vers le feu.', suivant: 'c1_halle' }],
  },
  {
    id: 'c1_halle_sigrid',
    decor: 'halle',
    personnages: ['sigrid'],
    entree: fx.flag('c1_halle_sigrid'),
    texte: `
Sigrid est debout. Tout le monde est assis, et elle est debout, les bras croisés, la lance posée contre le pilier.

**Sigrid :** « Tu viens ? »

Ce n'est pas une question sur ce soir. C'est une question sur toi.`,
    choix: [
      { texte: '« Je viens. »', effets: fx.confiance('sigrid', 1), suivant: 'c1_halle_sigrid_suite' },
      { texte: '« Si Hakon me veut. »', effets: fx.tous(fx.flag('sigrid_prudent'), fx.confiance('sigrid', -1)), suivant: 'c1_halle_sigrid_suite' },
      { texte: 'Lui tendre la corne de bière.', objet: 'biere', effets: fx.flag('sigrid_biere'), suivant: 'c1_halle_sigrid_suite' },
    ],
  },
  {
    id: 'c1_halle_sigrid_suite',
    decor: 'halle',
    personnages: ['sigrid'],
    texte: (e) => {
      if (e.flags.sigrid_biere)
        return `Elle regarde la corne. Elle ne la prend pas.

**Sigrid :** « Pas ce soir. Je veux me souvenir de tout. »

Elle ne t'en veut pas. Mais elle a noté que tu bois, toi.`;
      if (e.flags.sigrid_prudent)
        return `**Sigrid :** « Hakon veut des rames. Il prendra n'importe qui. » Elle décroise les bras. « Je demandais si *toi*, tu venais. »

Elle n'attend pas la réponse. Elle a entendu la première.`;
      return `Elle hoche la tête, une fois. Chez elle, ça vaut un serment.

**Sigrid :** « Bien. Reste près de moi là-bas. Je rame mieux quand je sais qui est à côté. »`;
    },
    choix: [{ texte: 'Retourner vers le feu.', suivant: 'c1_halle' }],
  },
  {
    id: 'c1_halle_discours',
    decor: 'halle',
    personnages: ['hakon', 'eirik', 'sigrid', 'ulf'],
    texte: (e) => {
      const pique = {
        pecheur: `« Et on emmène ${e.perso.prenom} ? Pour quoi faire, pêcher les Francs à la ligne ? »`,
        affranchi: `« On emmène les esclaves, maintenant ? J'espère que ${e.perso.prenom} sait au moins ramer dans le bon sens. »`,
        forgeron: `« ${e.perso.prenom} vient aussi ? Bien. S'il nous manque un clou, on saura qui appeler. »`,
        chasseur: `« Et le sauvage des collines ? ${e.perso.prenom}, c'est ça ? Tu sais qu'en mer il n'y a pas d'arbres pour te cacher ? »`,
      }[e.perso.origine];
      return `
Hakon se lève. Tout le village se tait.

**Hakon :** « Six ans. Six ans qu'on enterre nos morts et qu'on compte nos moutons. Cette fois nous ne prenons pas un village. Nous prenons un château. Celui du comte Gautier, en Francie. Son or paiera dix hivers. »

Un grondement d'approbation. Ulf, au fond, ne gronde pas. Il regarde Hakon, et Hakon le regarde une demi-seconde de trop.

Sigrid est debout avant les autres. Elle n'a pas besoin qu'on lui explique pourquoi partir.

Puis Eirik, le fils du jarl, tourne la tête vers toi et sourit comme on dégaine.

**Eirik :** ${pique}

Des rires. Pas tous francs. Hakon attend de voir ce que tu fais. Tout le monde attend.`;
    },
    choix: [
      {
        texte: 'Le remettre à sa place devant tous.',
        effets: fx.tous(fx.flag('eirik_humilie'), fx.reputation(1), fx.confiance('eirik', -2)),
        suivant: 'c1_halle_suite',
      },
      {
        texte: 'Détourner d\'une blague.',
        effets: fx.tous(fx.flag('eirik_blague'), fx.confiance('eirik', 1), fx.reputation(-1)),
        suivant: 'c1_halle_suite',
      },
      {
        texte: 'Te taire et le regarder.',
        effets: fx.tous(fx.flag('eirik_silence'), fx.confiance('ulf', 1)),
        suivant: 'c1_halle_suite',
      },
    ],
  },
  {
    id: 'c1_halle_suite',
    decor: 'halle',
    personnages: ['hakon', 'eirik', 'sigrid', 'ulf'],
    entree: fx.flag('c1_discours_vu'),
    texte: (e) => {
      if (e.flags.eirik_humilie)
        return `**Toi :** « Et toi, Eirik, c'est ton premier raid ou ton premier bateau ? Parce que je t'ai vu au quai hier. Tu regardais l'eau comme si elle te devait de l'argent. »

Le rire, cette fois, est franc. Et il ne tombe pas sur toi. Eirik devient très pâle, puis très rouge, dans cet ordre.

Hakon rit aussi. Un peu trop longtemps. Il aime ça, quelqu'un qui mord.

**Hakon :** « Bien. Un banc de nage pour ${e.perso.prenom}. On part à l'aube. »

Eirik ne te regarde plus. Tu te dis que ça lui passera. Tu te trompes peut-être.`;
      if (e.flags.eirik_blague)
        return `**Toi :** « Rassure-toi, Eirik. Si on coule, je te tiendrai la tête hors de l'eau. C'est ce qu'il y a de plus léger sur toi. »

Ça rit. Eirik rit aussi, une demi-seconde en retard, et quelque chose dans ses épaules se relâche. Il ne s'attendait pas à ce qu'on lui laisse une porte.

Hakon, lui, ne rit pas.

**Hakon :** « On n'embarque pas des farceurs. On embarque des rameurs. Un banc pour ${e.perso.prenom}. On verra. »

Eirik te jette un regard que tu ne sais pas lire. Pas encore.`;
      return `Tu ne dis rien. Tu le regardes. Longtemps. Le rire s'éteint tout seul, comme un feu sans bois.

Eirik détourne les yeux le premier. Hakon hausse une épaule et passe à autre chose : la halle a mieux à faire que ton silence.

Au fond, Ulf le Borgne hoche lentement la tête. Il a compris quelque chose sur toi. Tu ne sais pas encore quoi.

**Hakon :** « Un banc pour ${e.perso.prenom}. On part à l'aube. »`;
    },
    choix: [{ texte: 'La halle se remet à parler.', suivant: 'c1_halle' }],
  },

  // ------------------------------------------------- Le port, la nuit (exploration)
  {
    id: 'c1_port',
    type: 'lieu',
    decor: 'port',
    titre: 'Le port, la nuit',
    entree: fx.flag('c1_nuit'),
    arrivee: 'La nuit est tombée sans prévenir, comme elle fait ici. Le drakkar dort à quai. Il te reste quelques heures, et des gens à voir avant de dormir.',
    sol: { y: 408, xmin: 26, xmax: 774 },
    depart: 404,
    quetes: [
      { texte: 'Écouter ce qu’Ulf a à dire', fait: si.flag('c1_ulf_vu') },
      { texte: 'Rejoindre Sigrid au bout du quai', fait: si.flag('c1_sigrid_vue') },
      { texte: 'Donner quelque chose à la mer', visible: si.flag('c1_ulf_vu'), fait: si.flag('c1_offrande_vue'), facultatif: true },
      { texte: 'Voir ce qui bouge près des caisses', fait: si.flag('c1_chien_vu'), facultatif: true },
      { texte: 'Rentrer dormir', visible: si.et(si.flag('c1_ulf_vu'), si.flag('c1_sigrid_vue')), fait: () => false },
    ],
    elements: [
      {
        id: 'sortie', type: 'sortie', x: 30, nom: 'Rentrer dormir',
        action: {
          suivant: 'c1_aube',
          condition: si.et(si.flag('c1_ulf_vu'), si.flag('c1_sigrid_vue')),
          refus: 'Pas encore. Ulf t’a fait signe tout à l’heure, et Sigrid est seule au bout du quai. On ne part pas sur un bateau sans avoir parlé à ceux qui rament à côté.',
        },
      },
      {
        id: 'pain', type: 'objet', objet: 'pain', x: 108, y: 234, nom: 'Un quignon de pain',
        action: { prendre: 'pain', texte: 'Quelqu’un l’a posé là et l’a oublié. Il est dur, mais c’est du pain. Tu le glisses dans ta ceinture.' },
      },
      {
        id: 'chien', type: 'zone', x: 198, y: 236, l: 64, h: 70, nom: 'Quelque chose, entre les caisses',
        visible: si.pasFlag('chien_chasse'),
        important: si.pasFlag('c1_chien_vu'),
        action: (e) => (e.flags.c1_chien_vu
          ? { examiner: e.flags.chien_nourri ? 'Le chien te regarde. Il ne remue pas la queue ; il n’a pas ce genre d’habitudes. Mais il ne te quitte pas des yeux.' : 'Le chien te regarde passer. Il a tout son temps.' }
          : { scene: 'c1_chien' }),
      },
      {
        id: 'ulf', type: 'pnj', perso: 'ulf', x: 306, miroir: true, nom: 'Ulf le Borgne',
        important: si.pasFlag('c1_ulf_vu'),
        action: (e) => (e.flags.c1_ulf_vu
          ? { examiner: e.flags.ulf_questionne ? 'Ulf fixe l’eau. Il a dit ce qu’il avait à dire, et un peu plus qu’il ne voulait.' : 'Ulf boit, lentement, en regardant le mât. Il compte quelque chose.' }
          : { scene: 'c1_port_ulf' }),
      },
      {
        id: 'corbeaux', type: 'zone', x: 380, y: 34, l: 96, h: 44, nom: 'La vergue',
        action: { examiner: (e) => (e.flags.c1_ulf_vu ? 'Ils ne sont plus que deux. L’un des deux te regarde, de l’œil qui ne cligne pas.' : 'Trois corbeaux, posés sur la vergue, noirs sur la lune. Aucun ne bouge.') },
      },
      {
        id: 'eirik', type: 'pnj', perso: 'eirik', x: 476, nom: 'Eirik',
        important: si.pasFlag('c1_eirik_vu'),
        action: (e) => (e.flags.c1_eirik_vu
          ? { examiner: 'Eirik lance des cailloux dans l’eau, un par un, sans regarder où ils tombent.' }
          : { scene: 'c1_port_eirik' }),
      },
      {
        id: 'sigrid', type: 'pnj', perso: 'sigrid', x: 604, nom: 'Sigrid',
        important: si.pasFlag('c1_sigrid_vue'),
        action: (e) => (e.flags.c1_sigrid_vue
          ? { examiner: e.flags.couteau_repare ? 'Sigrid fait tourner le couteau réparé dans sa main. Elle ne le lâchera plus.' : 'Sigrid regarde vers le sud. Elle y est déjà.' }
          : { scene: 'c1_port_sigrid' }),
      },
      {
        id: 'eau', type: 'zone', x: 668, y: 262, l: 56, h: 50, nom: 'L’eau noire',
        visible: si.et(si.flag('c1_ulf_vu'), si.pasFlag('c1_offrande_vue')),
        important: () => true,
        action: { scene: 'c1_offrande' },
      },
      {
        id: 'harengs', type: 'zone', x: 728, y: 266, l: 44, h: 60, nom: 'Un tonneau de harengs',
        action: { prendre: 'hareng', texte: 'Le couvercle ne tient plus. Tu plonges la main dans la saumure et tu en sors un hareng. Personne ne comptera.' },
      },
    ],
  },

  // Ulf
  {
    id: 'c1_port_ulf',
    decor: 'port',
    personnages: ['ulf'],
    texte: `
Ulf le Borgne est assis sur un cabestan. Il ne tourne pas la tête quand tu arrives.

**Ulf :** « Trois corbeaux. »

Tu lèves les yeux. Sur la vergue, trois formes noires, immobiles. L'une d'elles te regarde de l'œil qui ne cligne pas.

**Ulf :** « Trois sur le mât la veille d'un départ. Mon grand-père disait que c'est le nombre de ceux qui ne reviennent pas. Mon grand-père disait beaucoup de choses. Il est mort dans son lit, ce qui prouve qu'il n'écoutait pas ses propres présages. »

Il sort une outre, boit, ne te la tend pas.

**Ulf :** « Njörd aime qu'on lui donne quelque chose avant de monter sur son dos. Pas grand-chose. Juste de quoi lui rappeler qu'on sait à qui appartient l'eau. »`,
    choix: [
      {
        texte: '« Je trouverai de quoi lui donner. »',
        effets: fx.tous(fx.flag('ulf_promis'), fx.confiance('ulf', 1)),
        suivant: 'c1_port_ulf_suite',
      },
      {
        texte: 'Lui tendre la corne de bière. Les présages passent mieux avec.',
        objet: 'biere',
        effets: fx.tous(fx.flag('ulf_promis'), fx.flag('ulf_biere_port'), fx.confiance('ulf', 2)),
        suivant: 'c1_port_ulf_suite',
      },
      {
        texte: '« Les dieux ont assez de pain. »',
        effets: fx.flag('moquerie_dieux'),
        suivant: 'c1_port_ulf_suite',
      },
      {
        texte: '« Et toi, Ulf, qu’est-ce que tu as donné, il y a six ans ? »',
        effets: fx.tous(fx.flag('ulf_questionne'), fx.confiance('ulf', 1)),
        suivant: 'c1_port_ulf_suite',
      },
    ],
  },
  {
    id: 'c1_port_ulf_suite',
    decor: 'port',
    personnages: ['ulf'],
    entree: fx.flag('c1_ulf_vu'),
    texte: (e) => {
      if (e.flags.ulf_questionne)
        return `Le silence dure assez longtemps pour que tu entendes la glace craquer contre la coque.

**Ulf :** « Qui t'a parlé d'il y a six ans ? »

**Toi :** « Tout le monde. Personne. Sigrid n'en parle jamais, et c'est encore plus bruyant. »

Il boit. Il essuie sa bouche. Il regarde la mer, parce que la mer ne pose pas de questions.

**Ulf :** « Il y a six ans, j'ai donné un œil. On m'a dit que c'était un bon prix. » Un temps. « On m'a menti. »

Il ne dira rien d'autre ce soir. Mais il ne t'a pas envoyé promener, et tu sens que ça compte. Au-dessus, un corbeau s'envole.`;
      if (e.flags.moquerie_dieux)
        return `**Toi :** « Les dieux ont assez de pain. Et s'ils ont faim, qu'ils viennent ramer. »

Ulf a un petit rire sec, sans joie.

**Ulf :** « C'est ce que disait Arne. Le père de Sigrid. » Il laisse la phrase tomber à l'eau et ne la repêche pas.

Au-dessus, un corbeau s'envole. Tu te dis que ça ne veut rien dire. C'est exactement ce que tu te dis.`;
      if (e.flags.ulf_biere_port)
        return `Il prend la corne. Il boit. Il la garde.

**Ulf :** « Tu sais ce qui est pire qu'un présage ? Un présage sans bière. »

Il regarde les corbeaux. Puis toi.

**Ulf :** « Il y a six ans, un homme a aussi offert à boire au scalde la veille d'un départ. Il voulait savoir si les dieux étaient avec nous. » Il boit. « Je lui ai dit oui. »

Il ne dit pas ce qui s'est passé ensuite. Il n'a pas besoin. Au-dessus, un corbeau s'envole.`;
      return `**Ulf :** « Du pain, ça suffit. Il y en a toujours un bout qui traîne sur ce quai. » Il boit. « Ne lui donne pas ce que tu ne peux pas te permettre de perdre. Les jeunes font ça. Ils croient que les dieux pèsent. »

Il désigne du menton le bout du quai, là où l'eau est la plus noire.

**Ulf :** « Là-bas. Quand tu seras prêt. Ou pas du tout. Njörd n'a jamais couru après personne. »

Au-dessus, un corbeau s'envole. Il en reste deux. Ulf ne commente pas.`;
    },
    choix: [{ texte: 'Le laisser à ses corbeaux.', suivant: 'c1_port' }],
  },

  // L'offrande : ce qu'on a dans les mains décide de ce qu'on peut faire.
  {
    id: 'c1_offrande',
    decor: 'port',
    personnages: [],
    texte: (e) => `
Au bout du quai, l'eau ne reflète plus rien. Elle est noire, lisse, et elle attend avec la patience de ce qui a toujours gagné.

${e.inventaire.length ? `Tu regardes ce que tu as sur toi.` : `Tu n'as rien dans les mains. Rien qu'on puisse donner, en tout cas.`}`,
    choix: [
      {
        texte: 'Jeter le pain à la mer, pour Njörd.',
        objet: 'pain',
        effets: fx.tous(fx.flag('offrande_njord'), fx.flag('offrande_pain'), fx.faveur(1)),
        suivant: 'c1_offrande_suite',
      },
      {
        texte: (e) => `Jeter ${objet(e).nom}. Une vraie offrande.`,
        condition: (e) => e.inventaire.includes(objet(e).id),
        effets: fx.tous(fx.flag('offrande_njord'), fx.flag('objet_sacrifie'), fx.faveur(2), perdreObjetFamille),
        suivant: 'c1_offrande_suite',
      },
      {
        texte: 'Rendre le hareng à la mer. Njörd appréciera l’ironie.',
        objet: 'hareng',
        effets: fx.flag('offrande_hareng'),
        suivant: 'c1_offrande_suite',
      },
      {
        texte: 'Ne rien donner. Pas ce soir.',
        effets: fx.flag('offrande_refusee'),
        suivant: 'c1_port',
      },
    ],
  },
  {
    id: 'c1_offrande_suite',
    decor: 'port',
    personnages: ['ulf'],
    entree: fx.flag('c1_offrande_vue'),
    texte: (e) => {
      if (e.flags.objet_sacrifie)
        return `Tu l'as fait avant de réfléchir. Un éclat, un *plouf* ridicule de petitesse, et c'est fini. Ta mère ne le saura jamais, sauf si tu reviens, et alors tu auras le temps d'inventer quelque chose.

Ulf s'est approché sans bruit. De son seul œil, il te regarde comme on regarde quelqu'un qu'on va devoir surveiller.

**Ulf :** « Ça, c'était cher. L'eau s'en souviendra. »`;
      if (e.flags.offrande_hareng)
        return `Le hareng touche l'eau, flotte une seconde sur le flanc, et coule sans conviction.

Derrière toi, Ulf a un bruit de gorge qui pourrait être un rire.

**Ulf :** « Rendre un poisson mort au dieu des poissons. » Il secoue la tête. « Il ne t'en voudra pas. Il ne te devra rien non plus. »`;
      return `Le pain flotte, tourne, et coule. Rien ne se passe. C'est ainsi que les dieux disent merci.

Ulf s'est approché sans bruit.

**Ulf :** « Bien. Tu ne crois pas à grand-chose, mais tu paies tes dettes d'avance. C'est plus rare que la foi. »`;
    },
    choix: [{ texte: 'Revenir sur le quai.', suivant: 'c1_port' }],
  },

  // Eirik : une conversation que personne n'oblige à avoir.
  {
    id: 'c1_port_eirik',
    decor: 'port',
    personnages: ['eirik'],
    entree: fx.flag('c1_eirik_vu'),
    texte: (e) => {
      if (e.flags.eirik_humilie)
        return `Eirik est assis au bord du quai, les jambes dans le vide. Il lance des cailloux dans l'eau. Quand il te reconnaît, sa main s'arrête.

**Eirik :** « Tu viens finir le travail ? Il n'y a plus de public. »

Il a dix-sept ans. À la halle, tu avais oublié.`;
      if (e.flags.eirik_blague)
        return `Eirik est assis au bord du quai, les jambes dans le vide. Il lance des cailloux dans l'eau.

**Eirik :** « Tiens. Le farceur. » Ce n'est pas méchant. « Mon père dit que tu ne tiendras pas trois jours. »

Il en lance un autre. Il regarde l'eau un peu trop fixement pour quelqu'un qui n'en a pas peur.`;
      return `Eirik est assis au bord du quai, les jambes dans le vide. Il lance des cailloux dans l'eau.

**Eirik :** « Toi, tu n'as rien dit, tout à l'heure. » Il te jauge. « Je ne sais pas si c'est du mépris ou de la prudence. »

Il en lance un autre. Il regarde l'eau un peu trop fixement pour quelqu'un qui n'en a pas peur.`;
    },
    choix: [
      {
        texte: '« J’y suis allé·e fort, à la halle. Je n’aurais pas dû. »',
        condition: si.flag('eirik_humilie'),
        effets: fx.tous(fx.flag('eirik_excuse'), fx.confiance('eirik', 2)),
        suivant: 'c1_port_eirik_suite',
      },
      {
        texte: '« Tu l’avais cherché. »',
        condition: si.flag('eirik_humilie'),
        effets: fx.tous(fx.flag('eirik_enfonce'), fx.confiance('eirik', -1)),
        suivant: 'c1_port_eirik_suite',
      },
      {
        texte: '« C’est ton premier raid, à toi aussi. »',
        condition: si.pasFlag('eirik_humilie'),
        effets: fx.tous(fx.flag('eirik_egal'), fx.confiance('eirik', 1)),
        suivant: 'c1_port_eirik_suite',
      },
      {
        texte: '« Ton père te regarde beaucoup, pour quelqu’un qui ne te voit pas. »',
        effets: fx.tous(fx.flag('eirik_pere'), fx.confiance('eirik', 1), fx.reputation(-1)),
        suivant: 'c1_port_eirik_suite',
      },
      {
        texte: 'Lui tendre la corne de bière, sans un mot.',
        objet: 'biere',
        effets: fx.tous(fx.flag('eirik_biere'), fx.confiance('eirik', 1)),
        suivant: 'c1_port_eirik_suite',
      },
      {
        texte: '« Attention à ne pas tomber. Elle est froide. »',
        effets: fx.tous(fx.flag('eirik_eau'), fx.confiance('eirik', -1)),
        suivant: 'c1_port_eirik_suite',
      },
    ],
  },
  {
    id: 'c1_port_eirik_suite',
    decor: 'port',
    personnages: ['eirik'],
    texte: (e) => {
      if (e.flags.eirik_biere)
        return `Il regarde la corne, puis toi. Il cherche le piège. Il ne le trouve pas, et ça l'agace.

**Eirik :** « Tu l'as prise à la halle. Sous le nez de mon père. »

**Toi :** « Il regardait ailleurs. »

Il boit. Il fait la grimace : la bière de Hakon est mauvaise, tout le monde le sait, personne ne le dit.

**Eirik :** « Elle est infecte. » Il boit encore. « Merci. »

Il ne te rend pas la corne. C'est sa façon de la garder, et toi avec.`;
      if (e.flags.eirik_excuse)
        return `Il ne s'y attendait pas. Il cherche le piège, ne le trouve pas, et ça le désarme plus que n'importe quelle insulte.

**Eirik :** « Personne ne me dit jamais ça. » Un caillou. « D'habitude, on rit, et puis on attend que mon père ait le dos tourné. »

Il ne te pardonne pas. Pas encore. Mais il se pousse un peu sur le bord du quai, et il y a maintenant de la place pour deux.`;
      if (e.flags.eirik_enfonce)
        return `**Eirik :** « Oui. » Il lance le dernier caillou, fort. « Je l'avais cherché. »

Il se lève, s'essuie les mains, et passe devant toi sans te toucher. Il a la démarche de quelqu'un qui range quelque chose pour plus tard.`;
      if (e.flags.eirik_egal)
        return `**Eirik :** « Oui, mais moi, on me regarde. » Il fait tourner un caillou entre ses doigts. « Toi, si tu vomis, si tu trembles, si tu te caches derrière un bouclier, personne ne le racontera à la halle. »

**Toi :** « Et si tu te bats bien ? »

**Eirik :** « Alors on dira que c'est normal. » Il a un demi-sourire. « Tu vois le problème. »

C'est la première chose vraie qu'il te dit. Il a l'air surpris de l'avoir dite.`;
      if (e.flags.eirik_pere)
        return `Eirik tourne la tête si vite que tu entends ses vertèbres.

**Eirik :** « Qui t'a dit ça ? »

**Toi :** « Personne. J'ai des yeux. »

Il se tait longtemps. Derrière vous, là-haut, une silhouette large se découpe à la porte de la halle. Elle regarde vers le quai. Puis elle rentre.

**Eirik :** « Ne redis jamais ça devant lui. » Plus bas : « Mais merci de l'avoir vu. »`;
      return `Sa main se fige. Juste une seconde. Puis il se force à rire.

**Eirik :** « Je sais nager. »

Il l'a dit trop vite, et personne n'avait posé la question. Tu te demandes pourquoi le fils d'un jarl, né sur un fjord, a besoin de le préciser.

Il se lève et s'éloigne du bord. De deux pas. Sans s'en rendre compte.`;
    },
    choix: [{ texte: 'Le laisser.', suivant: 'c1_port' }],
  },

  // Sigrid
  {
    id: 'c1_port_sigrid',
    decor: 'port',
    personnages: ['sigrid'],
    texte: `
Sigrid est au bout du quai, là où les planches deviennent molles. Elle fait tourner quelque chose dans sa main. Quand tu arrives, elle ne le cache pas ; elle te le montre.

Un couteau. Une bonne lame, autrefois. Cassée net à deux doigts de la garde.

**Sigrid :** « Celui de mon père. On me l'a rapporté comme ça. Pas le corps. Juste ça. »

Elle le fait tourner encore.

**Sigrid :** « Ils savaient qu'on venait, {prenom}. Il y a six ans. Les Francs attendaient sur la plage. Personne ne m'a jamais expliqué comment. »

Elle te regarde enfin.

**Sigrid :** « Je ne pars pas pour l'or. »`,
    choix: [
      {
        texte: '« Je t\'aiderai à le venger. Je te le jure. »',
        effets: fx.tous(fx.flag('promesse_vengeance'), fx.confiance('sigrid', 2)),
        suivant: 'c1_port_sigrid_suite',
      },
      {
        texte: '« La vengeance ne ramène personne, Sigrid. »',
        effets: fx.tous(fx.flag('sigrid_contredite'), fx.confiance('sigrid', -1), fx.faveur(1)),
        suivant: 'c1_port_sigrid_suite',
      },
      {
        texte: '« Donne. Je peux le réparer avant l\'aube. »',
        condition: si.origine('forgeron'),
        effets: fx.tous(fx.flag('couteau_repare'), fx.confiance('sigrid', 2)),
        suivant: 'c1_port_sigrid_suite',
      },
      {
        texte: 'Lui tendre la pierre à aiguiser. « Cassée, pas morte. »',
        objet: 'pierre',
        effets: fx.tous(fx.flag('couteau_aiguise'), fx.confiance('sigrid', 2)),
        suivant: 'c1_port_sigrid_suite',
      },
      {
        texte: 'Ne rien dire. Rester là, avec elle.',
        effets: fx.tous(fx.flag('sigrid_silence'), fx.confiance('sigrid', 1)),
        suivant: 'c1_port_sigrid_suite',
      },
    ],
  },
  {
    id: 'c1_port_sigrid_suite',
    decor: 'port',
    personnages: ['sigrid'],
    entree: fx.flag('c1_sigrid_vue'),
    texte: (e) => {
      if (e.flags.couteau_repare)
        return `Elle hésite. Puis elle te le donne, manche en avant, comme on donne quelque chose qu'on ne reprendra peut-être pas.

Tu cours à la forge de ton père. La lame est bonne ; la cassure est franche. Quand tu reviens, ce n'est plus le même couteau, mais c'en est un. Elle le regarde longtemps.

**Sigrid :** « Il ne l'aurait pas reconnu. »

**Toi :** « Il n'aurait pas eu besoin. »

Elle le glisse à sa ceinture. Elle ne dit pas merci. Elle n'en a pas besoin non plus.`;
      if (e.flags.couteau_aiguise)
        return `Elle regarde la pierre, puis toi. Elle la prend.

Le bruit de l'acier sur la pierre, dans la nuit, long, régulier. Ce qui reste de la lame tient dans une paume. Quand elle a fini, ça coupe un cheveu.

**Sigrid :** « Il disait qu'une lame courte, c'est une lame qui oblige à s'approcher. »

Elle garde la pierre. Tu ne la réclames pas. Elle glisse le moignon de couteau à sa ceinture, côté cœur.`;
      if (e.flags.promesse_vengeance)
        return `Elle hoche la tête, une fois. Pas de sourire. Les serments, chez elle, ne se fêtent pas ; ils se tiennent.

**Sigrid :** « Alors on est deux. »

Elle range le couteau. Tu as la sensation très nette d'avoir signé quelque chose sans l'avoir lu.`;
      if (e.flags.sigrid_contredite)
        return `Elle ne se fâche pas. C'est pire.

**Sigrid :** « Je sais. Ce n'est pas pour le ramener. C'est pour qu'ils sachent que quelqu'un se souvient. »

Elle range le couteau. Elle ne te regarde plus de la même façon, mais tu n'es pas sûr que ce soit en mal. Quelque part, les dieux ont pris note que quelqu'un, ce soir, a dit une chose vraie.`;
      return `Tu ne dis rien. Elle non plus. La mer fait son travail en dessous.

Au bout d'un moment, elle range le couteau et s'essuie le visage d'un revers de main, vite, comme pour chasser une mouche. Il n'y a pas de mouches en hiver.

**Sigrid :** « Va dormir, {prenom}. Demain on rame. »`;
    },
    choix: [{ texte: 'La laisser regarder le sud.', suivant: 'c1_port' }],
  },

  // Le chien
  {
    id: 'c1_chien',
    decor: 'port',
    personnages: [],
    entree: fx.flag('c1_chien_vu'),
    texte: (e) => `
Entre les caisses, quelque chose bouge. Un chien. Maigre à compter les côtes, une oreille en moins, l'autre dressée vers toi. Il ne grogne pas. Il n'a plus l'énergie pour ça.

Il te regarde avec l'air de quelqu'un qui a déjà vu des gens partir et qui sait exactement combien en reviennent.

${e.inventaire.includes('pain') || e.inventaire.includes('hareng') ? `Puis il regarde ta ceinture. Il a très bien vu ce que tu y as glissé.` : `Puis il regarde tes mains. Elles sont vides, et il le sait avant toi.`}`,
    choix: [
      {
        texte: 'Lui donner le pain.',
        objet: 'pain',
        effets: fx.tous(fx.flag('chien_nourri'), fx.flag('chien_pain')),
        suivant: 'c1_chien_suite',
      },
      {
        texte: 'Lui donner le hareng.',
        objet: 'hareng',
        effets: fx.tous(fx.flag('chien_nourri'), fx.flag('chien_hareng')),
        suivant: 'c1_chien_suite',
      },
      {
        texte: 'Le chasser d\'un coup de pied dans les caisses.',
        effets: fx.flag('chien_chasse'),
        suivant: 'c1_chien_suite',
      },
      {
        texte: 'Le laisser tranquille.',
        suivant: 'c1_port',
      },
    ],
  },
  {
    id: 'c1_chien_suite',
    decor: 'port',
    personnages: [],
    texte: (e) => {
      if (e.flags.chien_chasse)
        return `Le bois claque. Le chien détale sans un bruit, la queue basse, et disparaît entre deux coques retournées.

Tu restes seul·e avec les caisses. C'était plus facile que tu ne pensais. C'est toujours plus facile que ce qu'on pense.`;
      return `${e.flags.chien_hareng ? `Il attrape le hareng au vol, sans te quitter des yeux, et l'emporte derrière les caisses.` : `Il prend le pain du bout des dents, très doucement, comme s'il craignait que tu changes d'avis.`} Tu l'entends manger. Ça ne dure pas longtemps.

Quand il ressort, il s'assied à trois pas de toi. Pas plus près. Il ne remue pas la queue. Mais il te regarde, et tu comprends que tu viens d'être inscrit·e quelque part.`;
    },
    choix: [{ texte: 'Revenir sur le quai.', suivant: 'c1_port' }],
  },

  // ------------------------------------------------------------------- L'aube
  {
    id: 'c1_aube',
    decor: 'port',
    personnages: ['sigrid', 'ulf', 'eirik', 'hakon'],
    entree: fx.flag('c1_nuit', false),
    texte: (e) => {
      const chien = e.flags.chien_nourri
        ? `Le chien est là, assis au bout du quai. Il ne remue pas la queue. Il regarde.`
        : e.flags.chien_chasse
          ? `Le chien n'est plus là. Personne ne le remarque.`
          : `Quelque part derrière les caisses, un chien ne bouge pas.`;
      const eirik = e.flags.eirik_humilie && !e.flags.eirik_excuse
        ? `Eirik monte le dernier et s'assied le plus loin possible de toi.`
        : e.confiance.eirik >= 2
          ? `Eirik monte, hésite, et s'assied sur le banc juste devant le tien.`
          : e.confiance.eirik >= 0
            ? `Eirik monte, croise ton regard, et s'assied à deux bancs de toi. Ni loin ni près.`
            : `Eirik monte sans regarder personne.`;
      return `
L'aube arrive grise et basse. Le village entier est sur le quai, et personne ne parle fort.

Hakon monte le premier, comme il se doit. Sigrid ensuite, sans se retourner. Ulf grimpe lentement, son bâton sous le bras, et s'installe à la proue, là où on voit venir les choses.

${eirik}

${chien}

Sur la vergue, il n'y a plus de corbeaux. Ulf lève les yeux, les baisse, et ne dit rien.

Quelqu'un te tend une rame. C'est lourd. C'est exactement le poids que tu imaginais.`;
    },
    choix: [{ texte: 'Monter à bord.', suivant: 'c2_depart' }],
  },
];
