// Chapitre 3 — La côte franque. Le prix.
// Débarquement → (village avec Sigrid) → monastère explorable → chemin (embuscade ou non)
// → camp de nuit explorable → sacrifice d'Aude.
import { fx, si, chance } from '../outils.js';

const arme = (e) => e.perso.apparence.arme;
const nomArme = (e) => ({ hache: 'ta hache', epee: 'ton épée', lance: 'ta lance', arc: 'ton arc' })[arme(e)] ?? 'ton arme';
const vivants = (...ids) => (e) => ids.filter((id) => !e.morts[id]);

// Cadrages des scènes de dialogue dans les décors larges :
// le personnage principal se tient au centre de la vue (bord gauche = position - 400).
const CAM = { anselme: 500, cellule: 800, ulf: 30, hakon: 250, sigrid: 420, eirik: 580, poteau: 780 };

// Le sacrifice réunit jusqu'à cinq personnages : Aude au poteau, entre les deux torches.
const SACRIFICE = {
  camera: 720,
  personnages: vivants('aude', 'hakon', 'eirik', 'sigrid', 'ulf'),
  places: [
    { x: 360, y: 138, scale: 1.0 },
    { x: 202, y: 142, scale: 0.98, miroir: true },
    { x: 498, y: 150, scale: 0.92 },
    { x: 78, y: 150, scale: 0.92, miroir: true },
    { x: -40, y: 152, scale: 0.9, miroir: true },
  ],
  joueur: { x: 615, y: 136, scale: 1.0 },
};

export const CH3 = [
  // --------------------------------------------------------------- Le débarquement
  {
    id: 'c3_debarquement',
    chapitre: 3,
    decor: 'plage',
    personnages: vivants('hakon', 'sigrid', 'ulf', 'eirik'),
    texte: (e) => {
      const arrivee = e.flags.soutien_ulf
        ? `Vous touchez le sable au milieu de la nuit, à la rame, sans un mot. Personne ne vous a vus. Ulf ne dit pas « je vous l'avais dit ». Il le pense assez fort pour que tout le monde l'entende.`
        : `Le drakkar racle le sable en plein jour. Sur la grève, un garçon qui ramassait du varech lâche son panier et court vers les collines. Personne ne le rattrape. Hakon le regarde partir sans un mot : maintenant, tout le pays sait.`;
      return `
${arrivee}

La Francie sent l'herbe mouillée et la fumée de bois. Ici, la terre est grasse, les collines sont douces, et les gens qui y vivent n'ont jamais eu besoin d'apprendre à ramer.

Sur la colline, un clocher. Plus loin, des toits de chaume.

**Hakon :** « Le monastère d'abord. Les moines ont de l'or et pas d'épées. »

**Sigrid :** « Le village. » ${e.flags.sigrid_blessee ? `Elle tient son bras gauche contre elle, serré dans un chiffon noir de sang séché. ` : ''}« Là où sont les hommes. »

**Hakon :** « Va où tu veux, Sigrid. L'or, lui, est au monastère. »

Il ne la retient pas. Une dizaine d'hommes se rangent derrière elle. Une trentaine derrière lui. Il reste une place dans chaque groupe, et tout le monde attend de voir laquelle tu prends.`;
    },
    choix: [
      {
        texte: 'Suivre Hakon au monastère.',
        effets: fx.tous(fx.flag('route_monastere'), fx.reputation(1)),
        suivant: 'c3_monastere',
      },
      {
        texte: 'Suivre Sigrid au village.',
        effets: fx.tous(fx.flag('route_village'), fx.confiance('sigrid', 1), fx.reputation(-1)),
        suivant: 'c3_village',
      },
    ],
  },

  // ------------------------------------------------------- Le village, avec Sigrid
  {
    id: 'c3_village',
    decor: 'village',
    personnages: ['sigrid', 'vieux'],
    texte: (e) => `
Le village brûle avant que tu arrives. La moitié des hommes de Sigrid avait des haches ; l'autre moitié avait des torches. Personne n'a eu besoin d'ordres.

Il n'y a presque personne. Les Francs ont fui vers les bois en entendant le cor. Ceux qui restent sont ceux qui ne pouvaient pas courir.

Sigrid sort un vieil homme de la cabane du puits, par le col, comme un sac. Elle lui met ${e.flags.couteau_repare ? 'le couteau réparé de son père' : e.flags.couteau_aiguise ? 'le moignon de lame de son père' : 'sa lame'} sous la gorge.

**Sigrid :** « Il était là il y a six ans. Je le vois à ses yeux. Il a vu mon père mourir. »

**Le vieil homme :** « Pitié… pitié, je n'ai rien… »

C'est du franc. Tu reconnais le ton, pas les mots. Le ton, tout le monde le reconnaît.

**Sigrid :** « Demande-lui ce qu'il sait. Ou regarde-moi faire. »`,
    choix: [
      {
        texte: 'Lui parler en franc.',
        condition: si.origine('affranchi'),
        suivant: 'c3_village_franc',
      },
      {
        texte: 'Retenir le bras de Sigrid.',
        effets: fx.tous(fx.flag('vieux_epargne'), fx.confiance('sigrid', -1), fx.faveur(1)),
        suivant: 'c3_village_geste',
      },
      {
        texte: 'Laisser faire Sigrid.',
        effets: fx.tous(fx.flag('vieux_tue'), fx.confiance('sigrid', 1), fx.faveur(-1)),
        suivant: 'c3_village_tue',
      },
    ],
  },
  {
    id: 'c3_village_franc',
    decor: 'village',
    personnages: ['sigrid', 'vieux'],
    texte: `
Les mots te reviennent d'une enfance que tu n'as pas choisie. Le vieil homme te fixe comme si un chien venait de lui parler.

**Le vieil homme :** « Il y a six ans ? Oui. Le comte savait. Tout le monde savait. Un marchand frison était venu au château, au printemps. Il a vendu au comte la route des Normands : le jour, la plage, le nombre de bateaux. »

Il avale sa salive contre la lame.

**Le vieil homme :** « Le comte a payé en argent. Beaucoup. Le Frison riait. Il disait qu'il l'avait achetée pour rien, à un poète de chez vous. Un scalde, avec des dettes de dés. »

**Sigrid :** « Qu'est-ce qu'il dit ? »

Elle ne te regarde pas. Elle regarde le vieil homme. Elle attend.`,
    choix: [
      {
        texte: 'Tout traduire. Le Frison, l’argent, le scalde.',
        effets: fx.tous(fx.flag('sigrid_sait_scalde'), fx.flag('vieux_epargne'), fx.confiance('sigrid', 1)),
        suivant: 'c3_village_fin',
      },
      {
        texte: 'Traduire, mais taire le mot « scalde ».',
        effets: fx.tous(fx.flag('scalde_tu'), fx.flag('vieux_epargne')),
        suivant: 'c3_village_fin',
      },
      {
        texte: '« Il ne sait rien. Laisse-le. »',
        effets: fx.tous(fx.flag('scalde_tu'), fx.flag('mensonge_sigrid'), fx.flag('vieux_epargne')),
        suivant: 'c3_village_fin',
      },
    ],
  },
  {
    id: 'c3_village_geste',
    decor: 'village',
    personnages: ['sigrid', 'vieux'],
    texte: `
Tu attrapes son poignet. Elle est forte, mais tu as l'angle. La lame s'arrête à un doigt de la gorge.

**Sigrid :** « Lâche-moi. »

Elle te fixe. Toi. Plus le vieil homme. C'est pire.

Le vieil homme, lui, a compris qu'il a une seconde. Il ne court pas. Il tend le bras vers la colline, là où on devine des tours.

**Le vieil homme :** « Gautier. Gautier… »

Puis il pose la main sur son œil droit, le cache, et fait de l'autre main le geste de tendre quelque chose. Deux fois. Comme pour être sûr que tu as vu.

Sigrid n'a rien vu : elle te regardait. Le vieil homme s'enfuit vers les bois en boitant. Personne ne le poursuit.`,
    choix: [{ texte: 'Lâcher le poignet de Sigrid.', suivant: 'c3_village_fin' }],
  },
  {
    id: 'c3_village_tue',
    decor: 'village',
    personnages: ['sigrid'],
    texte: `
Tu ne bouges pas. Sigrid non plus, pendant un battement de cœur. Puis elle bouge.

Le vieil homme tombe sans bruit. Avant de mourir, il dit un mot en franc, deux fois, en touchant son œil droit du bout des doigts. Personne ici ne comprend ce mot. Il emporte son sens avec lui.

Sigrid essuie la lame sur sa cuisse. Elle regarde le corps longtemps.

**Sigrid :** « Un de moins. »

Elle attend quelque chose. Un soulagement, peut-être. Il ne vient pas, et tu la vois s'en rendre compte.`,
    choix: [{ texte: 'Te détourner.', suivant: 'c3_village_fin' }],
  },
  {
    id: 'c3_village_fin',
    decor: 'village',
    personnages: ['sigrid'],
    entree: fx.flag('c3_village_vu'),
    texte: (e) => {
      if (e.flags.sigrid_sait_scalde)
        return `Tu traduis tout. Le Frison, l'argent, le scalde.

Sigrid lâche le vieil homme. Il ne s'enfuit pas tout de suite ; il ne comprend pas pourquoi elle l'a lâché. Elle non plus, peut-être.

**Sigrid :** « Un scalde. »

Elle ne dit pas de nom. Il n'y a qu'un scalde à bord. Il y en a des dizaines dans le nord. Elle le sait aussi. Elle range son couteau très lentement.

Au loin, le cor de Hakon. Trois coups : on se regroupe au monastère.`;
      if (e.flags.mensonge_sigrid)
        return `**Toi :** « Il ne sait rien. Il était aux champs. »

Sigrid te regarde un long moment. Puis elle lâche l'homme, qui détale vers les bois.

**Sigrid :** « Tu as parlé longtemps, pour quelqu'un qui n'apprend rien. »

Elle ne dit rien d'autre. Elle n'a pas besoin. Au loin, le cor de Hakon : on se regroupe au monastère.`;
      if (e.flags.scalde_tu)
        return `Tu traduis. Le marchand frison, le comte, l'argent. Tu t'arrêtes avant le dernier mot.

**Sigrid :** « Un Frison. » Elle crache. « Je retrouverai le Frison. »

Elle lâche le vieil homme, qui disparaît dans la fumée. Tu gardes le mot pour toi. Il est lourd, pour un seul mot.

Au loin, le cor de Hakon : on se regroupe au monastère.`;
      return `Le cor de Hakon sonne au loin. Trois coups : on se regroupe au monastère.

Sigrid passe devant toi sans te regarder. Derrière vous, les toits finissent de brûler, et quelque part dans les bois, quelqu'un pleure assez fort pour qu'on l'entende par-dessus le feu.`;
    },
    choix: [{ texte: 'Monter au monastère.', suivant: 'c3_monastere' }],
  },

  // ---------------------------------------------------- Le monastère (exploration)
  {
    id: 'c3_monastere',
    type: 'lieu',
    decor: 'monastere',
    largeur: 1600,
    titre: 'Le monastère',
    arrivee: (e) => (e.flags.route_village
      ? 'Quand vous arrivez, la porte du monastère est déjà à terre. Les moines se sont enfermés dans la chapelle. Un seul est resté dehors, devant le portail, les mains ouvertes. Hakon t’attend dans la cour.'
      : 'La porte a tenu trois coups de bélier. Les moines se sont enfermés dans la chapelle. Un seul est resté dehors, devant le portail, les mains ouvertes. Et il parle norrois.'),
    sol: { y: 430, xmin: 40, xmax: 1560 },
    depart: 128,
    quetes: [
      { texte: 'Traiter avec le moine qui parle norrois', fait: si.flag('c3_anselme_fait') },
      { texte: 'Trouver d’où viennent les coups, au fond', fait: si.flag('c3_cellule_vue'), facultatif: true },
      { texte: 'Fouiller le scriptorium', fait: si.flag('carte_monastere'), facultatif: true },
      { texte: 'Reprendre la route de la plage', visible: si.flag('c3_anselme_fait'), fait: () => false },
    ],
    elements: [
      {
        id: 'sortie', type: 'sortie', x: 44, nom: 'Reprendre la route de la plage',
        action: {
          suivant: (e) => (e.flags.soutien_ulf ? 'c3_chemin_calme' : e.perso.origine === 'chasseur' ? 'c3_chemin_pisteur' : 'c3_embuscade'),
          condition: si.flag('c3_anselme_fait'),
          refus: 'Pas avant d’avoir réglé le sort des moines. Hakon t’a confié l’affaire, et il ne te la confiera pas deux fois.',
        },
      },
      {
        id: 'ulf', type: 'pnj', perso: 'ulf', x: 150, miroir: true, nom: 'Ulf le Borgne',
        visible: si.vivant('ulf'),
        action: (e) => ({
          examiner: e.flags.fresque_vue
            ? 'Ulf n’a pas passé la porte. Quand tu lui parles de la fresque, il ne demande pas laquelle.'
            : 'Ulf est resté sous le porche, appuyé sur son bâton. « Les dieux des autres, je les laisse chez eux. Ils ont la mémoire longue. »',
        }),
      },
      {
        id: 'hakon', type: 'pnj', perso: 'hakon', x: 300, nom: 'Hakon',
        action: (e) => ({
          examiner: e.flags.c3_anselme_fait
            ? 'Hakon compte. Les coffres, les hommes, la hauteur du soleil. Il a l’air d’un homme qui fait une addition dont le résultat ne lui plaît pas encore.'
            : 'Hakon te montre le moine du menton. « Il ne veut pas traiter avec un jarl. Il veut quelqu’un d’autre. Vas-y. Et si tu rates, c’est toi qui paieras la différence. »',
        }),
      },
      {
        id: 'puits', type: 'zone', x: 472, y: 330, l: 84, h: 110, nom: 'Le puits du cloître',
        action: { examiner: 'Une eau claire, froide, qui sent la pierre. Sur la margelle, quelqu’un a gravé une croix, et quelqu’un d’autre, plus tard, un petit marteau de Thor. Les deux tiennent compagnie au seau.' },
      },
      {
        id: 'jardin', type: 'zone', x: 594, y: 398, l: 112, h: 44, nom: 'Le jardin des simples',
        action: { prendre: 'baume', texte: 'Des herbes en carrés bien droits, chacune avec son nom sur une planchette. Sous la planchette de l’ortie, un pot de terre cacheté de cire. Ça sent l’onguent. Les moines soignent ce que les autres cassent.' },
      },
      {
        id: 'sigrid', type: 'pnj', perso: 'sigrid', x: 668, nom: 'Sigrid',
        action: (e) => ({
          examiner: e.flags.sigrid_sait_scalde
            ? 'Sigrid regarde vers le portail, là où Ulf attend. Elle ne dit rien. Elle regarde, c’est tout.'
            : e.flags.vieux_tue
              ? 'Sigrid s’est lavé les mains au puits. Trois fois. Elle te tourne le dos.'
              : e.flags.route_village
                ? 'Sigrid sent la fumée. Elle ne regarde pas la chapelle ; les moines ne l’intéressent pas. Ce n’est pas ici qu’elle trouvera ce qu’elle cherche.'
                : 'Sigrid fait les cent pas dans la cour. « On perd notre temps avec des hommes en robe. Les vrais Francs sont dans le château. »',
        }),
      },
      {
        id: 'chapelle', type: 'zone', x: 805, y: 316, l: 92, h: 130, nom: 'La chapelle',
        action: (e) => ({
          examiner: !e.flags.c3_anselme_fait
            ? 'Les moines se sont entassés au fond, derrière l’autel. Ils prient en latin, très vite, comme s’ils pouvaient finir avant vous.'
            : e.flags.moines_tues
              ? 'Il n’y a plus de prière dans la chapelle. Les cierges brûlent quand même. Ils ne savent pas encore.'
              : 'Les moines ont repris leur prière, plus lentement. L’un d’eux te regarde passer. Il te remercie, ou il te maudit : en latin, c’est pareil.',
        }),
      },
      {
        id: 'calice', type: 'objet', objet: 'calice', x: 805, y: 338, nom: 'Le calice, sur l’autel',
        action: (e) => ({
          prendre: 'calice',
          texte: e.flags.moines_epargnes
            ? 'Tu as juré que l’or partirait avec Hakon, et voilà que tu en glisses un morceau à ta ceinture. Un moine t’a vu. Il ne dit rien. Les dieux, eux, ont tout vu, et ils n’ont jamais eu besoin de parler.'
            : e.flags.moines_tues
              ? 'Tu le ramasses dans le silence. Il est lourd. Il était fait pour être tenu à deux mains par quelqu’un qui priait.'
              : 'Tu passes entre les moines agenouillés, tu prends le calice sur l’autel, et tu ressors. Personne ne t’arrête. Personne n’ose. Ça aussi, c’est une forme de prière.',
          effets: (x) => {
            x.butin = Math.min(10, x.butin + 1);
            if (x.flags.moines_epargnes) { x.faveur = Math.max(-3, x.faveur - 2); x.flags.serment_rompu = true; } else x.flags.calice_vole = true;
          },
        }),
      },
      {
        id: 'anselme', type: 'pnj', perso: 'anselme', x: 900, nom: 'Frère Anselme',
        visible: si.pasFlag('moines_tues'),
        important: si.pasFlag('c3_anselme_fait'),
        action: (e) => (e.flags.c3_anselme_fait
          ? { examiner: 'Anselme regarde les coffres partir. « Tu as tenu parole. Je prierai pour toi. Ne me remercie pas : ça ne sert presque jamais. »' }
          : { scene: 'c3_anselme' }),
      },
      {
        id: 'fresque', type: 'zone', x: 1040, y: 314, l: 84, h: 84, nom: 'Une fresque, sous le portique',
        action: (e) => ({
          examiner: `Un homme à un seul œil tend un rouleau à un homme en manteau rouge, couronné. Derrière eux, sur une mer bleue, des barques à tête de dragon. Au-dessous, une ligne en latin.${e.perso.origine === 'affranchi' ? ' Tu reconnais un mot : « proditor ». Traître.' : ' Tu ne sais pas la lire. Tu la regardes quand même longtemps.'}`,
          effets: fx.flag('fresque_vue'),
        }),
      },
      {
        id: 'scriptorium', type: 'zone', x: 1133, y: 312, l: 70, h: 70, nom: 'Le pupitre du scriptorium',
        action: {
          prendre: 'carte',
          texte: 'Sur le pupitre, sous un psautier, un parchemin plié en quatre : un plan. Des murs, quatre tours, et un trait en pointillé qui passe sous l’une d’elles. Le château de Gautier. Dans un coin, quelqu’un a ajouté trois signes à l’encre. Des runes.',
          effets: fx.flag('carte_monastere'),
        },
      },
      {
        id: 'cellule', type: 'zone', x: 1222, y: 340, l: 54, h: 76, nom: 'Une porte barrée, d’où viennent des coups',
        visible: si.pasFlag('c3_cellule_vue'),
        important: () => true,
        action: { scene: 'c3_cellule' },
      },
      {
        id: 'eirik', type: 'pnj', perso: 'eirik', x: 1430, nom: 'Eirik',
        visible: si.vivant('eirik'),
        action: (e) => ({
          examiner: e.confiance.eirik >= 2
            ? 'Eirik retourne des paillasses. Il n’y a pas d’or dans les paillasses des moines ; il le sait. « Si je ne trouve rien, au moins il m’aura vu chercher. »'
            : 'Eirik retourne des paillasses à la recherche d’or. Il n’en trouve pas. Il continue, pour que son père le voie chercher.',
        }),
      },
    ],
  },

  // Anselme : le marché
  {
    id: 'c3_anselme',
    decor: 'monastere',
    camera: CAM.anselme,
    personnages: ['anselme', 'hakon'],
    texte: (e) => `
Le moine est vieux, maigre, et il a les mains d'un homme qui a ramé autrefois. Il te regarde arriver sans reculer.

**Frère Anselme :** « C'est toi qu'ils envoient ? Bien. Les jeunes négocient mieux : ils ont encore quelque chose à perdre. »

Il parle norrois avec l'accent de Hedeby. L'accent des marchés, et des chaînes.

**Frère Anselme :** « Dans la chapelle, il y a onze frères et tout l'or de cette maison. Prenez l'or. Laissez les frères. Ils ne savent rien faire d'autre que prier, et ça ne vous coûtera rien de les laisser à leurs prières. »
${e.inventaire.includes('calice') ? `
**Frère Anselme :** « Tout l'or, y compris le calice que tu portes à la ceinture. Tu le rendras, ou tu ne jureras pas. On ne jure pas avec les mains pleines. »
` : ''}
Derrière toi, Hakon ne dit rien. Il compte.`,
    choix: [
      {
        texte: (e) => `Accepter, et jurer sur ${nomArme(e)}.`,
        effets: (e) => {
          e.flags.moines_epargnes = true;
          fx.butin(2)(e);
          fx.faveur(1)(e);
          fx.reputation(-1)(e);
          if (e.inventaire.includes('calice')) {
            e.inventaire = e.inventaire.filter((o) => o !== 'calice');
            e.flags.calice_rendu = true;
          }
        },
        suivant: 'c3_anselme_suite',
      },
      {
        texte: 'Tout prendre. Les vivants parlent.',
        effets: fx.tous(fx.flag('moines_tues'), fx.butin(4), fx.confiance('sigrid', -1), fx.confiance('ulf', -1), fx.faveur(-1)),
        suivant: 'c3_anselme_suite',
      },
      {
        texte: '« Tu parles norrois. Où l’as-tu appris ? »',
        condition: si.pasFlag('anselme_frison'),
        suivant: 'c3_anselme_frison',
      },
      {
        texte: '« Et au fond, au dortoir, qui frappe à cette porte ? »',
        condition: si.et(si.pasFlag('aude_indice'), si.pasFlag('c3_cellule_vue')),
        suivant: 'c3_anselme_cellule',
      },
      {
        texte: '« Laisse-moi réfléchir. »',
        suivant: 'c3_monastere',
      },
    ],
  },
  {
    id: 'c3_anselme_frison',
    decor: 'monastere',
    camera: CAM.anselme,
    personnages: ['anselme'],
    entree: fx.flag('anselme_frison'),
    texte: (e) => `
**Frère Anselme :** « À Hedeby. Dix ans au banc de nage d'un marchand frison. Ubbo, il s'appelait. Il achetait de l'ambre, des fourrures, des esclaves. Et des routes. »

Il dit ça comme on parle de la pluie.

**Frère Anselme :** « Il y a six ans, il a vendu au comte Gautier la route d'un raid normand. Le jour, la plage, le nombre de bateaux. Il en a ri pendant une semaine. Il disait qu'il l'avait payée moins cher qu'un tonneau de bière : à un poète de chez vous, qui devait de l'argent aux dés. »
${e.morts.ulf ? '' : `
Tu penses à un œil. Un seul. Tu chasses la pensée. Elle revient s'asseoir un peu plus loin, et elle attend.`}`,
    choix: [{ texte: 'Revenir à l’affaire.', suivant: 'c3_anselme' }],
  },
  {
    id: 'c3_anselme_cellule',
    decor: 'monastere',
    camera: CAM.anselme,
    personnages: ['anselme'],
    entree: fx.flag('aude_indice'),
    texte: `
Anselme a un petit sourire fatigué.

**Frère Anselme :** « Une fille. La bâtarde du comte. Il nous l'a confiée pour qu'elle apprenne l'obéissance. Elle n'apprend pas. »

**Frère Anselme :** « Elle connaît le château mieux que son père. Chaque couloir, chaque porte. Si vous la prenez, elle vous mordra. Si vous la laissez, elle nous mordra nous. »

Il hausse les épaules.

**Frère Anselme :** « Je ne vous la vends pas. Je vous préviens. Ce n'est pas pareil, même si ça y ressemble. »`,
    choix: [{ texte: 'Revenir à l’affaire.', suivant: 'c3_anselme' }],
  },
  {
    id: 'c3_anselme_suite',
    decor: 'monastere',
    camera: CAM.anselme,
    personnages: (e) => (e.flags.moines_tues ? ['hakon'] : ['anselme', 'hakon']),
    entree: fx.flag('c3_anselme_fait'),
    texte: (e) => {
      if (e.flags.moines_tues)
        return `**Toi :** « Tout. »

Hakon hoche la tête. Il ne te regarde pas ; il regarde la chapelle. Il fait un geste, et des hommes y entrent.

Ça dure moins longtemps que la prière qu'ils avaient commencée. Anselme meurt en dernier. Il te regarde jusqu'au bout, sans haine : avec une curiosité d'homme qui a vu beaucoup de choses et veut voir comment celle-ci finit.

${e.morts.ulf ? '' : `Sous le porche, Ulf vomit. Personne ne se moque.

`}Quatre coffres sortent de la chapelle. Hakon les compte deux fois.

**Hakon :** « Voilà ce qu'on appelle une affaire. »`;
      return `Tu poses la main sur ${nomArme(e)}, et tu jures. Les mots sont vieux ; ta voix ne l'est pas. Anselme écoute jusqu'au bout, puis il frappe trois coups à la porte de la chapelle.
${e.flags.calice_rendu ? `
Avant, tu poses le calice dans ses mains. Il le regarde, puis toi. « Bien. Maintenant ton serment pèse quelque chose. »
` : ''}
Les moines sortent un par un, les bras chargés : des coffres, des chandeliers, une croix d'argent plus haute qu'un enfant. Ils posent tout aux pieds de Hakon, puis ils retournent prier. Personne ne les touche.

**Hakon :** « Deux coffres, et des moines vivants qui raconteront à tout le pays qu'on tient parole. » Il plisse les yeux. « Ça peut servir. Ou pas. »

${e.morts.ulf ? '' : 'Sous le porche, Ulf ferme son œil, et tu le vois respirer pour la première fois depuis la plage.'}`;
    },
    choix: [{ texte: 'Retourner dans la cour.', suivant: 'c3_monastere' }],
  },

  // La cellule
  {
    id: 'c3_cellule',
    decor: 'monastere',
    camera: CAM.cellule,
    personnages: ['aude'],
    entree: fx.flag('aude_rencontree'),
    texte: (e) => `
Les coups s'arrêtent quand tu approches. Derrière la grille de la porte, deux yeux sombres, et une voix qui ne tremble pas.

C'est une jeune femme, en robe verte de bonne laine, les poignets rougis par une corde qu'on lui a retirée il y a peu. ${e.flags.aude_indice ? `La bâtarde du comte. Elle n'a pas l'air d'une fille qu'on a enfermée pour lui apprendre l'obéissance ; elle a l'air de quelqu'un qui compte les jours.` : `Elle n'a pas l'air d'une nonne. Elle a l'air de quelqu'un qui compte les jours.`}

${e.perso.origine === 'affranchi'
  ? `**Aude :** « Tu comprends ce que je dis, toi. Je le vois. Alors écoute : ouvre cette porte, et je te dirai comment entrer chez mon père sans frapper. »`
  : `Elle parle franc d'abord, très vite. Puis elle cherche des mots dans ta langue, des mots de marché, cassés.

**Aude :** « Toi. Normand. Ouvre. Je sais… château. Je sais tout. »`}`,
    choix: [
      {
        texte: 'Forcer la porte.',
        effets: fx.tous(fx.flag('aude_liberee'), fx.flag('porte_forcee'), fx.confiance('aude', 1)),
        suivant: 'c3_cellule_suite',
      },
      {
        texte: 'Lui répondre en franc.',
        condition: si.origine('affranchi'),
        effets: fx.tous(fx.flag('aude_liberee'), fx.flag('aude_parle'), fx.confiance('aude', 2)),
        suivant: 'c3_cellule_suite',
      },
      {
        texte: 'Lui montrer le plan du château à travers la grille.',
        objet: 'carte',
        garde: true,
        effets: fx.tous(fx.flag('aude_liberee'), fx.flag('aude_souterrain'), fx.confiance('aude', 1)),
        suivant: 'c3_cellule_suite',
      },
      {
        texte: 'La laisser derrière sa porte. Hakon décidera.',
        effets: fx.tous(fx.flag('aude_laissee'), fx.confiance('aude', -1)),
        suivant: 'c3_cellule_suite',
      },
    ],
  },
  {
    id: 'c3_cellule_suite',
    decor: 'monastere',
    camera: CAM.cellule,
    personnages: ['aude', 'hakon'],
    entree: fx.tous(fx.flag('c3_cellule_vue'), fx.flag('aude_captive')),
    texte: (e) => {
      const fin = `

Les hommes de Hakon arrivent, attirés par le bruit. Hakon les suit. Il regarde la fille, puis toi.

**Hakon :** « Une Franque qui connaît son château. » Il sourit pour la première fois depuis la Norvège. « Elle vaut plus que l'or du moine. Attachez-la. »

On lui lie les mains. Elle ne se débat pas. Elle te regarde pendant qu'on l'emmène vers la plage, et tu ne sais pas encore ce que ce regard te reproche.`;
      if (e.flags.aude_souterrain)
        return `Tu glisses le parchemin contre la grille. Elle le regarde une seconde, puis elle pose le doigt sur le trait en pointillé, celui qui passe sous une tour.

**Aude :** « Ça. Moi, je connais. Personne d'autre. »

Puis elle pose le doigt sur les runes du coin. Elle fronce les sourcils : elle ne sait pas les lire. Toi non plus, pas vraiment. Mais tu connais quelqu'un qui écrit comme ça.

Tu soulèves la barre. La porte s'ouvre.${fin}`;
      if (e.flags.aude_parle)
        return `Tu lui réponds dans sa langue. Ses yeux changent.

**Aude :** « Aude. Je m'appelle Aude. La clé est sous la statue de saint Martin, au bout du couloir. Les moines croient que je ne le sais pas. Les moines croient beaucoup de choses. »

La clé est là où elle a dit. La porte s'ouvre sans un bruit. Aude sort, se frotte les poignets, et te regarde de haut en bas comme on évalue un cheval.

**Aude :** « Tu n'es pas comme les autres. Ça ne veut pas dire que tu vaux mieux. »${fin}`;
      if (e.flags.porte_forcee)
        return `${e.perso.origine === 'forgeron'
          ? `Tu regardes la serrure. Une bonne serrure franque, honnête, avec un défaut que son forgeron n'aurait jamais avoué. Tu glisses la pointe de ${nomArme(e)} au bon endroit. Clac.`
          : `Tu arraches la barre, puis tu frappes la serrure jusqu'à ce qu'elle cède. Ça fait un bruit à réveiller tout le monastère, et une bonne partie de la côte.`}

La porte s'ouvre. Elle ne sort pas tout de suite. Elle te regarde, longtemps, pour être sûre que ce n'est pas un piège. Puis elle sort, et elle ne te remercie pas.${fin}`;
      return `Tu recules. Derrière la grille, ses yeux suivent chaque pas.

**Aude :** « Lâche. »

Ce mot-là, elle le connaît très bien dans ta langue.

Tu n'as pas à décider longtemps : Hakon décide pour toi.${fin}`;
    },
    choix: [{ texte: 'Retourner dans la cour.', suivant: 'c3_monastere' }],
  },

  // ------------------------------------------------------------------ Le chemin
  {
    id: 'c3_chemin_calme',
    decor: 'chemin',
    personnages: vivants('ulf', 'sigrid', 'eirik'),
    entree: fx.tous(fx.flag('embuscade_evitee'), fx.confiance('ulf', 1)),
    texte: (e) => `
Vous repartez à la nuit tombée, par les bois plutôt que par la route. C'est l'idée d'Ulf. Hakon a grogné, puis il a suivi.

Les coffres pèsent. Personne ne parle. On entend les chouettes, les pas, et le souffle des porteurs.

Puis, en bas, sur la route, des torches. Une vingtaine de cavaliers passent au galop, en direction du monastère. Leurs armures sonnent comme des cloches mal accordées. Ils ne lèvent pas la tête vers le bois.

Vous attendez qu'ils soient passés. Longtemps.

${e.morts.ulf ? '' : `**Ulf :** « La nuit nous a donné un jour de plus. » Il regarde les torches s'éloigner. « Les jours, ça se rend toujours. »`}`,
    choix: [{ texte: 'Rejoindre la plage.', suivant: 'c3_camp' }],
  },
  {
    id: 'c3_chemin_pisteur',
    decor: 'chemin',
    personnages: vivants('sigrid', 'ulf', 'eirik'),
    texte: `
Le soleil descend sur les blés. Vous rentrez par la route, chargés comme des mules, et tout le monde a déjà la tête dans la bière du soir.

Pas toi. Tu regardes le sol, par habitude. Il y a des traces de sabots, fraîches, beaucoup, qui quittent la route et entrent dans la haie, là-bas, à deux cents pas. Elles n'en ressortent pas.

Et la haie est trop calme. Pas un oiseau. Les oiseaux savent toujours avant les hommes.`,
    choix: [
      {
        texte: 'Prévenir Hakon. On coupe par les champs.',
        effets: fx.tous(fx.flag('embuscade_evitee'), fx.reputation(2)),
        suivant: 'c3_chemin_evite',
      },
      {
        texte: 'Leur tendre un piège à notre tour.',
        effets: (e) => {
          e.flags.contre_embuscade = true;
          fx.reputation(3)(e);
          fx.butin(1)(e);
          fx.confiance('sigrid', 1)(e);
          if (!chance(e, 0.65)) fx.blesser('jambe')(e);
        },
        suivant: 'c3_contre_embuscade',
      },
      {
        texte: 'Ne rien dire. Pour voir.',
        effets: fx.flag('pisteur_tait'),
        suivant: 'c3_embuscade',
      },
    ],
  },
  {
    id: 'c3_chemin_evite',
    decor: 'chemin',
    personnages: vivants('sigrid', 'ulf', 'eirik'),
    texte: (e) => `
Hakon t'écoute jusqu'au bout. Il regarde la haie. Il regarde les blés. Il ne te demande pas si tu es sûr·e : il voit que tu l'es.

Vous quittez la route en silence et vous coupez à travers champs, courbés sous les coffres. Derrière vous, la haie attend des hommes qui ne viendront pas.

Quand vous atteignez la plage, Hakon pose une main sur ton épaule. Une seconde. C'est beaucoup, pour lui.

**Hakon :** « Les collines t'ont appris quelque chose, ${e.perso.prenom}. »`,
    choix: [{ texte: 'Rejoindre le camp.', suivant: 'c3_camp' }],
  },
  {
    id: 'c3_contre_embuscade',
    decor: 'chemin',
    personnages: vivants('sigrid', 'ulf', 'eirik'),
    texte: (e) => `
Vous posez les coffres au milieu de la route, bien en vue. Puis vous vous couchez dans les blés, de chaque côté.

Les Francs sortent de la haie au trot, pour ramasser l'or que ces idiots de Normands ont abandonné. Ils sont huit. Ils ont le temps d'être surpris.

C'est court. Sigrid se bat comme quelqu'un qui attendait ça depuis six ans. ${e.blessures.includes('jambe') ? `Un cavalier te passe dessus en fuyant ; un sabot t'ouvre le mollet jusqu'à l'os. Tu ne le sens que plus tard, quand tu essaies de te relever.` : `Tu t'en sors sans une égratignure, ce qui t'étonne plus que les Francs.`}

Vous repartez avec deux chevaux, une bourse, et une histoire que Hakon racontera à la halle, l'hiver prochain, en oubliant de dire qui a vu les traces.`,
    choix: [{ texte: 'Rejoindre le camp.', suivant: 'c3_camp' }],
  },

  // L'embuscade : deuxième chrono du jeu
  {
    id: 'c3_embuscade',
    decor: 'chemin',
    personnages: vivants('ulf', 'sigrid', 'eirik'),
    texte: (e) => `
Le soleil descend sur les blés. Vous rentrez par la route, chargés comme des mules. ${e.morts.ulf ? '' : `Ulf traîne un coffre trop lourd pour lui, à l'arrière, en marmonnant contre son dos.`}

${e.flags.pisteur_tait ? `Les traces de sabots entrent dans la haie, là-bas. Tu les as vues. Tu n'as rien dit. Tu attends.` : `Il fait beau. C'est la première chose qui aurait dû t'alerter.`}

La haie explose.

Des chevaux. Des hommes en fer. Des lances. Ils sortent des buissons comme si la terre les crachait, et le premier fonce droit sur ${e.morts.ulf ? 'Sigrid' : 'Ulf, qui lâche son coffre et se retourne trop lentement'}.

Autour de toi, tout le monde crie en même temps.`,
    chrono: {
      duree: (e) => (e.flags.pisteur_tait ? 8 : 6),
      timeout: {
        effets: fx.tous(fx.blesser('oeil'), fx.flag('embuscade_issue', 'temps')),
        suivant: 'c3_embuscade_suite',
      },
    },
    choix: [
      {
        texte: 'Couvrir Ulf.',
        condition: si.vivant('ulf'),
        effets: (e) => {
          e.flags.embuscade_issue = 'ulf';
          fx.confiance('ulf', 2)(e);
          if (!chance(e, 0.5)) fx.blesser('jambe')(e);
        },
        suivant: 'c3_embuscade_suite',
      },
      {
        texte: 'Former le mur de boucliers avec Sigrid.',
        effets: (e) => {
          e.flags.embuscade_issue = 'mur';
          fx.confiance('sigrid', 1)(e);
          if (e.morts.ulf) return;
          if (!e.morts.eirik && e.confiance.eirik >= 2) {
            e.flags.eirik_sauve_ulf = true;
            fx.confiance('eirik', 1)(e);
          } else {
            e.morts.ulf = true;
          }
        },
        suivant: 'c3_embuscade_suite',
      },
      {
        texte: 'Lâcher le butin et courir vers le drakkar.',
        effets: fx.tous(fx.flag('embuscade_issue', 'fuite'), fx.flag('fuite'), fx.reputation(-3), fx.butin(-1)),
        suivant: 'c3_embuscade_suite',
      },
      {
        texte: 'Tirer sur le cheval de tête.',
        condition: (e) => arme(e) === 'arc' && !e.blessures.includes('bras'),
        effets: fx.tous(fx.flag('embuscade_issue', 'tir'), fx.reputation(2), fx.confiance('ulf', 1)),
        suivant: 'c3_embuscade_suite',
      },
    ],
  },
  {
    id: 'c3_embuscade_suite',
    decor: 'chemin',
    personnages: vivants('ulf', 'sigrid', 'eirik'),
    texte: (e) => {
      const issue = e.flags.embuscade_issue;
      if (issue === 'ulf')
        return `Tu te jettes entre Ulf et la lance. Ton bouclier prend le coup ; le choc te remonte jusque dans les dents. ${e.blessures.includes('jambe') ? `Le cheval, lui, ne s'arrête pas. Il te passe dessus. Quelque chose craque dans ta jambe, un bruit sec de bois vert.` : `Le cheval fait un écart, le cavalier perd l'équilibre, et Sigrid est déjà sur lui.`}

Quand c'est fini, Ulf est assis dans la poussière, vivant, et il te regarde comme on regarde une dette.

**Ulf :** « Tu n'aurais pas dû. » Un temps. « Merci quand même. »`;
      if (issue === 'mur') {
        if (e.flags.eirik_sauve_ulf)
          return `Tu cours vers Sigrid. Vos boucliers claquent l'un contre l'autre, d'autres viennent s'y coller, et la charge se brise sur le mur comme une vague sur un rocher.

Derrière, Ulf était seul. Tu le sais. Tu as choisi.

Mais quand tu te retournes, Ulf est debout. Eirik l'a tiré par le col jusque dans le fossé, juste à temps. Le fils du jarl est couvert de boue, essoufflé, et il a l'air surpris d'avoir fait ça.

**Eirik :** « Il est lourd, pour un vieux. »`;
        return `Tu cours vers Sigrid. Vos boucliers claquent l'un contre l'autre, d'autres viennent s'y coller, et la charge se brise sur le mur comme une vague sur un rocher.

Les Francs repartent aussi vite qu'ils sont venus.

Derrière, sur la route, Ulf est couché sur le dos, une lance plantée dans la poitrine. Il regarde le ciel avec son seul œil. Il a l'air de lire quelque chose, là-haut, qu'il est le seul à comprendre.

Il ne dit rien. Il n'a plus de quoi.

Sigrid te touche l'épaule. Le mur a tenu. Tout le monde le dira. Personne ne dira le reste.`;
      }
      if (issue === 'fuite')
        return `Tu lâches le coffre et tu cours. Les autres te voient courir, et ils courent aussi : c'est comme ça que les déroutes commencent. Avec une seule personne qui part la première.

Vous atteignez le drakkar. Tout le monde est vivant. Il manque deux coffres.

Hakon arrive le dernier. Il a tenu la route seul, avec quatre hommes, le temps que les Francs se lassent. Il ne dit rien. Il te regarde, il s'en souviendra, et c'est pire que n'importe quel mot.`;
      if (issue === 'tir')
        return `Tu bandes, tu vises, tu lâches. Pas l'homme : le cheval. La flèche le prend au poitrail. Il s'effondre en pleine course, et le cavalier vole par-dessus sa tête.

Les chevaux derrière s'emmêlent dans le premier. Le temps qu'ils se démêlent, le mur de boucliers est formé.

Les Francs repartent. Ulf, assis dans le fossé, te regarde ranger ton arc.

**Ulf :** « Un seul trait. » Il hoche la tête. « Mon grand-père aurait fait une chanson. Moi aussi, peut-être. »`;
      return `Tu hésites. Une seconde. Deux.

Une lance passe. Pas pour toi : elle passe *près* de toi. Le fer t'ouvre le visage en travers, et le monde se coupe en deux. La moitié droite devient rouge, puis noire, et ne revient pas.

Quand c'est fini, tu es à genoux sur la route. Quelqu'un te bande la tête avec un morceau de sa tunique.

${e.morts.ulf ? `Sigrid serre le bandage, sans un mot.` : `C'est Ulf. Il serre le bandage, il regarde ce qui reste de ton œil, et pendant une seconde son visage se défait complètement.

**Ulf :** « Bienvenue chez les borgnes. On voit moins de choses. On les voit mieux. »`}`;
    },
    choix: [{ texte: 'Rejoindre la plage.', suivant: 'c3_camp' }],
  },

  // ------------------------------------------------------- Le camp (exploration)
  {
    id: 'c3_camp',
    type: 'lieu',
    decor: 'camp',
    largeur: 1600,
    titre: 'Le camp, la nuit',
    entree: fx.tous(fx.flag('aude_rencontree'), fx.flag('aude_captive')),
    arrivee: 'Le camp est monté sur la plage, autour d’un feu qu’on doit voir depuis la Norvège. Hakon a fait planter un poteau face à la mer, entre deux torches. La Franque y est attachée. À minuit, a-t-il dit, Odin aura sa part.',
    sol: { y: 430, xmin: 40, xmax: 1560 },
    depart: 360,
    quetes: [
      { texte: 'Parler à la captive, au poteau', fait: si.flag('c3_aude_poteau_vu') },
      { texte: 'Panser le bras de Sigrid', visible: si.et(si.flag('sigrid_blessee'), si.vivant('sigrid')), fait: si.flag('c3_sigrid_soignee'), facultatif: true },
      { texte: 'Écouter Ulf', visible: si.vivant('ulf'), fait: si.flag('c3_ulf_vu'), facultatif: true },
      { texte: 'Rejoindre Hakon pour le sacrifice', fait: () => false },
    ],
    elements: [
      {
        id: 'butin', type: 'zone', x: 312, y: 330, l: 150, h: 70, nom: 'Le butin',
        action: (e) => ({
          examiner: e.butin >= 6
            ? 'Des coffres, des chandeliers, une croix d’argent, des calices qu’on a déjà commencé à tordre pour qu’ils tiennent mieux dans les sacs. Hakon passera la nuit à compter. Il aime compter.'
            : e.butin >= 3
              ? 'Deux coffres, quelques chandeliers, une croix. Assez pour un hiver. Pas assez pour une saga. Hakon le sait ; c’est pour ça qu’il regarde le château.'
              : 'Un coffre à moitié vide et un tas de chandeliers tordus. Pour un raid, c’est maigre. Pour une seule journée, c’est déjà trop de morts.',
        }),
      },
      {
        id: 'ulf', type: 'pnj', perso: 'ulf', x: 430, miroir: true, nom: 'Ulf le Borgne',
        visible: si.vivant('ulf'),
        action: (e) => (e.flags.c3_ulf_vu
          ? { examiner: 'Ulf boit. Il ne regarde pas le poteau. Il le fait exprès, et ça se voit.' }
          : { scene: 'c3_camp_ulf' }),
      },
      {
        id: 'feu', type: 'zone', x: 560, y: 340, l: 130, h: 70, nom: 'Le grand feu',
        action: { examiner: 'Les hommes boivent autour du feu et parlent fort. Ils racontent déjà la journée, et à chaque fois, ils étaient plus nombreux à tenir la route et les Francs plus nombreux à fuir.' },
      },
      {
        id: 'hakon', type: 'pnj', perso: 'hakon', x: 650, nom: 'Hakon',
        important: si.flag('c3_aude_poteau_vu'),
        action: (e) => (e.flags.c3_aude_poteau_vu
          ? { scene: 'c3_sacrifice' }
          : { examiner: 'Hakon aiguise un couteau qui n’est pas fait pour le combat. « Minuit. Va voir ta Franque, si ça te chante. Elle ne parlera plus longtemps. »' }),
      },
      {
        id: 'sigrid', type: 'pnj', perso: 'sigrid', x: 820, nom: 'Sigrid',
        visible: si.vivant('sigrid'),
        action: (e) => (e.flags.c3_sigrid_vue
          ? { examiner: e.flags.c3_sigrid_soignee ? 'Sigrid fait jouer son bras, lentement. Elle grimace moins. Elle ne te le dira pas.' : 'Sigrid aiguise sa lame, près de la tente. Le même geste, cent fois.' }
          : { scene: 'c3_camp_sigrid' }),
      },
      {
        id: 'eirik', type: 'pnj', perso: 'eirik', x: 980, nom: 'Eirik',
        visible: si.vivant('eirik'),
        action: (e) => (e.flags.c3_eirik_vu
          ? { examiner: 'Eirik regarde son père aiguiser le couteau. Il a les poings serrés. Il ne s’en rend pas compte.' }
          : { scene: 'c3_camp_eirik' }),
      },
      {
        id: 'aude', type: 'pnj', perso: 'aude', x: 1180, nom: 'Aude, attachée au poteau',
        important: si.pasFlag('c3_aude_poteau_vu'),
        action: (e) => (e.flags.c3_aude_poteau_vu
          ? { examiner: 'Aude regarde la mer. Elle ne prie pas. Elle attend, comme on attend une marée.' }
          : { scene: 'c3_aude_poteau' }),
      },
      {
        id: 'chateau', type: 'zone', x: 1500, y: 166, l: 150, h: 80, nom: 'Le château, sur le promontoire',
        action: { examiner: 'Sur les remparts, des feux s’allument un à un. Gautier sait que vous êtes là. Il compte vos feux comme vous comptez les siens.' },
      },
    ],
  },

  // Ulf, au camp
  {
    id: 'c3_camp_ulf',
    decor: 'camp',
    camera: CAM.ulf,
    personnages: ['ulf'],
    entree: fx.flag('c3_ulf_vu'),
    texte: (e) => `
Ulf est assis contre la coque, une corne à la main. Il ne regarde pas le poteau. Il regarde ses pieds, et c'est un choix.

${e.flags.embuscade_issue === 'ulf'
  ? `**Ulf :** « Tu m'as tiré de là, sur la route. Je ne sais pas encore si je dois te remercier. »`
  : e.flags.eirik_sauve_ulf
    ? `**Ulf :** « Le petit du jarl m'a tiré par le col comme un sac de navets. » Il boit. « Je ne lui pardonnerai jamais. »`
    : `**Ulf :** « Assieds-toi, ${e.perso.prenom}. Ou ne t'assieds pas. Mais ne reste pas debout devant moi, tu me caches le feu. »`}`,
    choix: [
      {
        texte: '« Anselme a ramé pour un Frison, à Hedeby. Un certain Ubbo. »',
        condition: si.flag('anselme_frison'),
        effets: fx.tous(fx.flag('ulf_ebranle'), fx.confiance('ulf', -1)),
        suivant: 'c3_camp_ulf_suite',
      },
      {
        texte: '« Il y a une fresque, au monastère. Un borgne qui tend un rouleau. »',
        condition: si.flag('fresque_vue'),
        effets: fx.flag('ulf_fresque'),
        suivant: 'c3_camp_ulf_suite',
      },
      {
        texte: '« Hakon va offrir la Franque à Odin. Qu’en dit le scalde ? »',
        effets: fx.tous(fx.flag('ulf_conseil'), fx.confiance('ulf', 1)),
        suivant: 'c3_camp_ulf_suite',
      },
      { texte: 'Le laisser boire.', suivant: 'c3_camp' },
    ],
  },
  {
    id: 'c3_camp_ulf_suite',
    decor: 'camp',
    camera: CAM.ulf,
    personnages: ['ulf'],
    texte: (e) => {
      if (e.flags.ulf_ebranle)
        return `La corne s'arrête à mi-chemin de sa bouche. Elle reste là, en l'air, longtemps. La bière déborde un peu.

**Ulf :** « Ubbo. » Il dit le nom comme on touche une vieille blessure pour voir si elle fait encore mal. « Il est mort, Ubbo. Noyé, il paraît. Il y a quatre ans. »

**Toi :** « Tu le connaissais. »

**Ulf :** « Tout le monde connaissait Ubbo. »

Il boit enfin. Il ne te regarde plus. Mais tu as vu sa main, et sa main tremblait.`;
      if (e.flags.ulf_fresque)
        return `**Ulf :** « Les moines peignent les histoires qu'on leur raconte. » Il boit. « Et on leur raconte n'importe quoi. Un borgne, un roi, un rouleau. Tu sais combien il y a de borgnes, dans le nord ? »

**Toi :** « Je n'ai pas dit que c'était un homme du nord. »

Un silence. Le feu craque.

**Ulf :** « Va dormir, ${e.perso.prenom}. »`;
      return `Ulf regarde enfin le poteau. Une seconde. Puis il revient à sa bière.

**Ulf :** « Odin aime le sang. Tout le monde le sait. Ce que les jeunes oublient, c'est qu'il aime surtout savoir *pourquoi* on le lui donne. »

Il essuie sa barbe.

**Ulf :** « Un homme qui offre sa fille pour la victoire, Odin l'écoute. Un homme qui offre une étrangère dont il veut se débarrasser, en disant que c'est pour les dieux… » Il hausse les épaules. « Odin n'est pas un idiot. Il est borgne, comme moi. Ça rend méfiant. »`;
    },
    choix: [{ texte: 'Le laisser à sa bière.', suivant: 'c3_camp' }],
  },

  // Sigrid, au camp
  {
    id: 'c3_camp_sigrid',
    decor: 'camp',
    camera: CAM.sigrid,
    personnages: ['sigrid'],
    entree: fx.flag('c3_sigrid_vue'),
    texte: (e) => `
Sigrid est assise devant sa tente. ${e.flags.sigrid_blessee ? `Son bras gauche est serré dans un chiffon noirci. Elle ne s'en sert plus que pour tenir son bouclier, et encore : en serrant les dents.` : `Elle aiguise sa lame, le même geste, cent fois.`}

${e.flags.vieux_tue
  ? `**Sigrid :** « J'ai tué un vieux, aujourd'hui. Il n'avait rien fait. » Elle passe la pierre. « Je croyais que ça ferait quelque chose. »`
  : e.flags.sigrid_sait_scalde
    ? `**Sigrid :** « Assieds-toi. » Elle ne lève pas les yeux. « Je réfléchis, et je n'aime pas ce que je trouve. »`
    : `**Sigrid :** « Tu viens voir si je dors ? Je ne dors pas. Je dormirai au château. »`}`,
    choix: [
      {
        texte: 'Lui passer le baume des moines sur le bras.',
        objet: 'baume',
        condition: si.flag('sigrid_blessee'),
        effets: fx.tous(fx.flag('c3_sigrid_soignee'), fx.confiance('sigrid', 2)),
        suivant: 'c3_camp_sigrid_suite',
      },
      {
        texte: '« Un scalde, a dit le vieux. Tu y penses ? »',
        condition: si.flag('sigrid_sait_scalde'),
        effets: fx.flag('sigrid_soupconne'),
        suivant: 'c3_camp_sigrid_suite',
      },
      {
        texte: '« Et la Franque, au poteau ? »',
        effets: fx.flag('sigrid_avis'),
        suivant: 'c3_camp_sigrid_suite',
      },
      { texte: 'La laisser.', suivant: 'c3_camp' },
    ],
  },
  {
    id: 'c3_camp_sigrid_suite',
    decor: 'camp',
    camera: CAM.sigrid,
    personnages: ['sigrid'],
    texte: (e) => {
      if (e.flags.c3_sigrid_soignee)
        return `Elle te laisse défaire le chiffon. Dessous, ce n'est pas beau. Tu étales le baume ; ça sent l'ortie et la cire. Elle ne dit rien pendant que tu bandes le bras, proprement cette fois.

**Sigrid :** « Les moines. » Elle fait jouer ses doigts. « Ils soignent ceux qui viennent les piller. »

**Toi :** « Ils soignent. C'est tout. »

**Sigrid :** « Mon père disait que les Francs étaient des bêtes. » Un temps. « Mon père disait beaucoup de choses. »`;
      if (e.flags.sigrid_soupconne)
        return `La pierre s'arrête.

**Sigrid :** « Tu sais combien de scaldes il y a dans le nord ? Des dizaines. Des centaines. »

**Toi :** « Je sais. »

**Sigrid :** « Il y en a un seul sur ce bateau. »

Elle reprend la pierre, plus vite. Elle ne dit pas le nom. Elle n'a pas besoin. Au bout de la plage, près du drakkar, quelqu'un boit seul.`;
      return `${e.flags.promesse_vengeance
        ? `**Sigrid :** « Une Franque. » Elle regarde le poteau, et ses yeux brillent dans la lumière des torches. « C'est un début. Tu m'as promis, au port. Tu te souviens ? »

Tu te souviens.`
        : `**Sigrid :** « Une Franque. » Elle regarde le poteau. « Je devrais être contente. »

Elle ne l'est pas. Ça la met en colère, et elle ne sait pas contre qui.

**Sigrid :** « Hakon ne fait pas ça pour Odin. Il le fait pour qu'on le regarde le faire. »`}`;
    },
    choix: [{ texte: 'La laisser.', suivant: 'c3_camp' }],
  },

  // Eirik, au camp
  {
    id: 'c3_camp_eirik',
    decor: 'camp',
    camera: CAM.eirik,
    personnages: ['eirik'],
    entree: fx.flag('c3_eirik_vu'),
    texte: (e) => `
Eirik se tient à l'écart, les bras croisés. Il regarde son père aiguiser le couteau au coin du feu.

${e.confiance.eirik >= 2
  ? `**Eirik :** « ${e.perso.prenom}. » Il ne se retourne pas. « Il fait ça devant tout le monde pour qu'on ne puisse plus lui dire non après. C'est sa méthode. Il l'a toujours fait avec moi. »`
  : `**Eirik :** « Quoi ? » Il ne se retourne pas. « Tu viens me demander ce que j'en pense ? Je n'en pense rien. Je suis le fils du jarl. On ne me demande pas de penser. »`}`,
    choix: [
      {
        texte: '« Si je m’interpose, tu seras derrière moi ? »',
        condition: si.confiance('eirik', 2),
        effets: fx.tous(fx.flag('eirik_promet'), fx.confiance('eirik', 1)),
        suivant: 'c3_camp_eirik_suite',
      },
      {
        texte: '« Ton père va égorger une femme attachée. Ça te va ? »',
        effets: (e) => {
          e.flags.eirik_trouble = true;
          if (e.confiance.eirik < 0) fx.confiance('eirik', -1)(e);
        },
        suivant: 'c3_camp_eirik_suite',
      },
      { texte: 'Le laisser.', suivant: 'c3_camp' },
    ],
  },
  {
    id: 'c3_camp_eirik_suite',
    decor: 'camp',
    camera: CAM.eirik,
    personnages: ['eirik'],
    texte: (e) => {
      if (e.flags.eirik_promet)
        return `Il se tait longtemps. Si longtemps que tu crois qu'il ne répondra pas.

**Eirik :** « Tu sais ce qu'il me fera ? »

**Toi :** « Oui. »

**Eirik :** « Moi aussi. » Il décroise les bras. « Je serai derrière toi. Pas devant. Je ne suis pas fou. »

C'est la phrase la plus courageuse qu'il ait jamais dite, et il la dit comme une plaisanterie. C'est comme ça que tu sais qu'il est sérieux.`;
      if (e.confiance.eirik < 0)
        return `**Eirik :** « Et toi, ça te va de venir me faire la morale ? Tu m'as ri au nez devant tout le village. »

Il crache dans le sable.

**Eirik :** « Va dire ça à mon père, si tu as tant de courage. Moi, je regarderai. »`;
      return `Il ne répond pas tout de suite. Ses mâchoires travaillent.

**Eirik :** « Non. » Il le dit au sable. « Non, ça ne me va pas. »

Puis, plus bas :

**Eirik :** « Mais ce n'est pas moi qui tiens le couteau. Ce n'est jamais moi. »`;
    },
    choix: [{ texte: 'Le laisser.', suivant: 'c3_camp' }],
  },

  // Aude, au poteau
  {
    id: 'c3_aude_poteau',
    decor: 'camp',
    camera: CAM.poteau,
    personnages: ['aude'],
    entree: fx.flag('c3_aude_poteau_vu'),
    texte: (e) => `
Aude est attachée au poteau par les poignets, les bras tirés en arrière. Les torches lui font un visage de cuivre. Au-dessus d'elle, sur le poteau, un corbeau dort, ou fait semblant.

${e.flags.aude_laissee
  ? `Elle te reconnaît. Celui qui a laissé la porte fermée.

**Aude :** « Tu viens voir si j'ai peur ? »`
  : e.flags.aude_liberee
    ? `Elle te reconnaît. Celui qui a ouvert la porte, pour qu'on la rattache un peu plus loin.

**Aude :** « Tu m'as sortie d'une cellule pour m'attacher à un poteau. Chez vous, c'est ce qu'on appelle une faveur ? »`
    : `**Aude :** « Encore un. » Elle te regarde de haut en bas. « Vous venez tous voir la bête, avant minuit. »`}

${e.perso.origine === 'affranchi' ? `Elle parle franc. Tu comprends chaque mot. Elle le voit, et ça change quelque chose dans ses yeux.` : `Elle parle avec des mots de marché, cassés, mais elle se fait comprendre. Les gens qui ont l'habitude qu'on ne les écoute pas apprennent à être clairs.`}`,
    choix: [
      { texte: 'Lui donner à boire.', effets: fx.tous(fx.flag('aude_eau'), fx.confiance('aude', 1)), suivant: 'c3_aude_poteau_suite' },
      { texte: 'Lui donner le pain.', objet: 'pain', effets: fx.tous(fx.flag('aude_mange'), fx.confiance('aude', 1)), suivant: 'c3_aude_poteau_suite' },
      { texte: 'Lui donner le poisson grillé.', objet: 'poisson', effets: fx.tous(fx.flag('aude_mange'), fx.confiance('aude', 1)), suivant: 'c3_aude_poteau_suite' },
      { texte: 'Lui donner le hareng.', objet: 'hareng', effets: fx.tous(fx.flag('aude_hareng'), fx.confiance('aude', 1)), suivant: 'c3_aude_poteau_suite' },
      {
        texte: 'Lui montrer le plan du château.',
        objet: 'carte',
        garde: true,
        condition: si.pasFlag('aude_souterrain'),
        effets: fx.tous(fx.flag('aude_souterrain'), fx.confiance('aude', 1)),
        suivant: 'c3_aude_poteau_suite',
      },
      { texte: '« Qui es-tu, exactement ? »', effets: fx.flag('aude_identite'), suivant: 'c3_aude_poteau_suite' },
      { texte: 'La laisser.', suivant: 'c3_camp' },
    ],
  },
  {
    id: 'c3_aude_poteau_suite',
    decor: 'camp',
    camera: CAM.poteau,
    personnages: ['aude'],
    texte: (e) => {
      if (e.flags.aude_hareng)
        return `Tu lui tends le hareng. Elle le regarde. Elle te regarde.

**Aude :** « Du poisson salé. À une femme attachée, sans eau, la veille de sa mort. »

Elle éclate de rire. Un vrai rire, qui la plie en deux autant que les cordes le permettent.

**Aude :** « Donne. » Elle mord dedans. « Tu es le premier Normand qui me fait rire. Ne t'y habitue pas. »`;
      if (e.flags.aude_souterrain && !e.flags.aude_identite && !e.flags.aude_eau && !e.flags.aude_mange)
        return `Tu déplies le parchemin à la lumière des torches. Elle se penche autant que les cordes le permettent. Son doigt ne peut pas bouger, alors elle désigne le trait en pointillé du menton.

**Aude :** « Ça. Sous la chapelle du château. Ça mène aux caves. Mon père ne sait même pas qu'il existe encore. Moi, j'y allais pour pleurer sans qu'on me voie. »

Elle relève les yeux vers toi.

**Aude :** « Maintenant, tu sais pourquoi je vaux plus vivante. Reste à le faire comprendre à ton jarl. »`;
      if (e.flags.aude_identite)
        return `**Aude :** « Aude. Fille de Gautier. Pas de sa femme : de la lavandière. »

Elle dit ça sans honte, comme on dit le temps qu'il fait.

**Aude :** « Il m'a gardée parce que je savais compter ses sacs de blé mieux que son intendant. Il m'a enfermée chez les moines parce que j'ai refusé le mari qu'il m'avait compté aussi. »

Elle regarde le château, sur le promontoire, et ses feux.

**Aude :** « Alors non, je ne vous aiderai pas par amour pour vous. Mais je n'ai aucune raison de vous empêcher d'entrer chez lui. »`;
      return `Tu portes l'outre à ses lèvres${e.flags.aude_mange ? `, puis tu lui donnes à manger, bouchée par bouchée, parce qu'elle n'a pas les mains libres` : ''}. Elle boit longtemps, sans te quitter des yeux.

**Aude :** « Pourquoi ? »

**Toi :** « Je ne sais pas. »

**Aude :** « Au moins tu ne mens pas. » Elle s'essuie la bouche contre son épaule. « Les autres, ils me disent que ça ira. Ils mentent tous. Toi, tu m'as donné de l'eau. C'est plus utile. »`;
    },
    choix: [{ texte: 'Revenir au feu.', suivant: 'c3_camp' }],
  },

  // ----------------------------------------------------------------- Le sacrifice
  {
    id: 'c3_sacrifice',
    decor: 'camp',
    ...SACRIFICE,
    texte: (e) => `
Minuit. Hakon se lève, et le camp se tait comme la halle s'était tue, au village, il y a mille ans, c'est-à-dire la semaine dernière.

Il marche jusqu'au poteau, le couteau à la main. Les hommes se lèvent derrière lui et forment un cercle. Sur le poteau, le corbeau ouvre un œil.

**Hakon :** « Odin. Tu nous as donné la mer, et tu nous donnes un château. Voici ta part. »

Il lève le couteau. Aude ne baisse pas les yeux. Elle ne le regarde pas, lui. Elle te regarde, toi.
${e.flags.promesse_vengeance && !e.morts.sigrid ? `
**Sigrid :** « Une Franque. » Sa voix est très calme. « C'est un début. »
` : ''}${!e.morts.ulf ? `
Ulf fixe le sable. ${e.flags.ulf_conseil ? `Il t'a dit ce qu'il pensait. Il ne le redira pas.` : `Il n'a rien dit à personne.`}
` : ''}${!e.morts.eirik && e.flags.eirik_promet ? `
Eirik fait un pas de côté. Vers toi.
` : ''}
Tu as le temps d'un souffle.`,
    choix: [
      {
        texte: 'T’interposer.',
        effets: (e) => {
          e.flags.sacrifice_issue = 'interpose';
          fx.confiance('aude', 2)(e);
          const soutien = !e.morts.eirik && (e.flags.eirik_promet || e.confiance.eirik >= 2);
          if (soutien) {
            e.flags.eirik_soutien_sacrifice = true;
            fx.confiance('eirik', 1)(e);
            fx.reputation(-1)(e);
          } else {
            fx.reputation(-2)(e);
          }
        },
        suivant: 'c3_sacrifice_suite',
      },
      {
        texte: '« Elle connaît le château. Vivante, elle vaut une armée. »',
        effets: (e) => {
          e.flags.sacrifice_issue = 'guide';
          e.flags.aude_guide = true;
          fx.confiance('aude', 1)(e);
          if (e.flags.carte_monastere || e.flags.aude_souterrain) fx.reputation(1)(e);
          else { fx.reputation(-1)(e); e.flags.menace_hakon = true; }
        },
        suivant: 'c3_sacrifice_suite',
      },
      {
        texte: 'Offrir le calice à Odin à sa place. « L’or brille plus que le sang. »',
        objet: 'calice',
        effets: (e) => {
          e.flags.sacrifice_issue = 'or';
          e.flags.offrande_or = true;
          fx.confiance('aude', 1)(e);
          if (!e.flags.serment_rompu) fx.faveur(1)(e);
        },
        suivant: 'c3_sacrifice_suite',
      },
      {
        texte: 'Laisser faire.',
        effets: (e) => {
          e.flags.sacrifice_issue = 'laisse';
          e.flags.aude_morte = true;
          e.morts.aude = true;
          fx.faveur(-1)(e);
          if (e.flags.promesse_vengeance) fx.confiance('sigrid', 1)(e);
        },
        suivant: 'c3_sacrifice_suite',
      },
    ],
  },
  {
    id: 'c3_sacrifice_suite',
    decor: 'camp',
    ...SACRIFICE,
    entree: fx.flag('c3_sacrifice_fait'),
    texte: (e) => {
      const issue = e.flags.sacrifice_issue;
      if (issue === 'interpose') {
        if (e.flags.eirik_soutien_sacrifice)
          return `Tu fais trois pas, et tu te retrouves entre le couteau et la Franque. Le cercle retient son souffle.

**Hakon :** « Écarte-toi. »

Tu ne t'écartes pas. Et derrière toi, quelqu'un d'autre s'avance. Eirik. Pâle comme la lune, la main sur la poignée de son épée, sans la tirer.

**Eirik :** « Père. Elle vaut plus vivante. Tout le monde le sait. »

Hakon regarde son fils très longtemps. Ce qu'il voit lui déplaît, et lui plaît aussi, et il déteste les deux.

**Hakon :** « Bien. » Il range le couteau. « Odin attendra le château. Il aura plus de sang là-bas qu'ici. »

Il passe devant toi sans te regarder. À son fils, il ne dit rien du tout. C'est pire.`;
        return `Tu fais trois pas, et tu te retrouves entre le couteau et la Franque. Le cercle retient son souffle.

**Hakon :** « Écarte-toi. »

Tu ne t'écartes pas. Personne ne vient à côté de toi. Le silence dure le temps qu'il faut pour qu'un homme décide s'il va tuer quelqu'un d'autre ce soir.

**Hakon :** « Tu veux la garder ? Garde-la. » Il range le couteau. « Mais au château, c'est toi qui passeras le premier. Et si elle nous trahit, c'est toi qu'Odin aura. »

Il se détourne. Le cercle se défait, déçu. Tu as gagné une vie et perdu quelque chose que tu ne sais pas encore nommer.`;
      }
      if (issue === 'guide') {
        if (e.flags.carte_monastere || e.flags.aude_souterrain)
          return `**Toi :** « Elle connaît le château. Elle connaît un chemin sous la chapelle. Il est sur ce plan, et elle est la seule à savoir où il commence. »

Tu tends le parchemin. Hakon le prend, le déplie à la lumière des torches. Il le regarde longtemps. Puis il regarde la fille.

**Hakon :** « Un chemin sous les murs. » Il replie le plan. « Odin préfère un château à une femme. Moi aussi. »

Il range le couteau. Il te rend le plan, et ce geste-là, devant tout le camp, vaut plus que de l'or.`;
        return `**Toi :** « Elle connaît le château. Chaque couloir, chaque porte. Morte, elle ne vaut qu'un mouton. Vivante, elle vaut une armée. »

Hakon te regarde. Il pèse. On voit presque les plateaux de la balance bouger derrière ses yeux.

**Hakon :** « Une armée. » Il range le couteau, lentement. « Si elle ment, ${e.perso.prenom}, c'est toi que j'ouvre à sa place. Devant tout le monde. Et Odin aura deux parts. »

Il te laisse avec la fille et le poids de ce que tu viens d'acheter.`;
      }
      if (issue === 'or')
        return `Tu sors le calice de ta ceinture et tu le lèves à la lumière des torches. L'or s'allume. Le cercle se tait d'une autre façon.

**Toi :** « Odin aime l'or. Celui-là a servi aux dieux des Francs. Donne-le-lui. Ça, il ne l'a jamais eu. »

Hakon hésite. ${e.morts.ulf ? 'Personne ne parle.' : `Ulf, sans lever les yeux du sable, dit à mi-voix : « Odin n'a jamais refusé de l'or. »`}

Hakon prend le calice. Il le soupèse. Il le jette à la mer, de toutes ses forces, et il le regarde disparaître.

**Hakon :** « Voilà ta part, Odin. » Il se retourne vers toi. « Et ça, c'était la tienne. »

Il range le couteau. ${e.flags.serment_rompu ? `L'or volé à des moines à qui tu avais juré : tu te demandes ce qu'Odin en pense. Tu ne le sauras pas ce soir.` : `Sur le poteau, le corbeau s'envole vers la mer, là où le calice a coulé.`}`;
      return `Tu ne bouges pas.

Hakon abaisse le couteau. C'est rapide. Il a l'habitude. Aude ne crie pas. Elle te regarde jusqu'au bout, et puis elle ne regarde plus rien.

Le cercle pousse un cri. Les hommes boivent. Hakon essuie la lame et la lève vers le ciel.

${e.morts.ulf ? `Personne ne remarque que le corbeau s'est envolé avant la fin.` : `Ulf, lui, ne lève pas les yeux. Plus tard, tu l'entendras dire, à personne en particulier : « Odin n'aime pas les cadeaux qu'on fait pour se débarrasser. Il les accepte. Et il s'en souvient. »`}${e.flags.promesse_vengeance && !e.morts.sigrid ? `

Sigrid regarde le corps longtemps. Elle attendait quelque chose. Ça n'est pas venu non plus.` : ''}`;
    },
    choix: [{ texte: 'La nuit.', suivant: 'c3_fin' }],
  },
  {
    id: 'c3_fin',
    decor: 'camp',
    camera: 800,
    personnages: (e) => (e.morts.aude ? ['hakon'] : ['aude', 'hakon']),
    texte: (e) => `
Plus tard, quand le feu a baissé, tu regardes vers le promontoire.

Sur les remparts du château de Gautier, des feux s'allument un à un. Quelqu'un, là-bas, compte les vôtres.

**Hakon :** « Demain, le château. » Il ne parle à personne en particulier ; il parle à la nuit, pour qu'elle le retienne. « Demain, on dira mon nom. »
${!e.morts.aude ? `
Aude, au pied du poteau, a les mains libres maintenant, et une corde à la cheville. Elle regarde le château de son père.

**Aude :** « Il y a une porte qui ne s'ouvre que du dedans. » Elle sourit, sans joie. « Ton scalde la connaît peut-être. Les scaldes connaissent toutes les portes. »
` : ''}${!e.morts.ulf ? `
Au bout de la plage, Ulf chante tout bas, pour lui seul. Une vieille chanson. Une chanson de départ.
` : `
Au bout de la plage, là où Ulf buvait d'habitude, il n'y a personne. Personne ne chante.
`}`,
    choix: [{ texte: 'Dormir. Si on peut.', suivant: 'c4_approche' }],
  },
];
