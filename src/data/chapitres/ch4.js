// Chapitre 4 — Le château. Le pic.
// Approche (remparts / poterne / souterrains / bélier) → cour en feu (chrono) → salle du trésor
// (exploration : Gautier, la lettre, la couronne) → arrière-garde (obéir, refuser, défier,
// ou retourner les hommes avec la lettre) → fuite par les souterrains → aveu d'Ulf → plage.
// Trois fins s'y jouent déjà : Valhalla, Nourriture pour les corbeaux, Vendu.
import { fx, si } from '../outils.js';

const vivants = (...ids) => (e) => ids.filter((id) => !e.morts[id]);
const arme = (e) => e.perso.apparence.arme;
const nomArme = (e) => ({ hache: 'ta hache', epee: 'ton épée', lance: 'ta lance', arc: 'ton arc' })[arme(e)] ?? 'ton arme';

/** Eirik se range-t-il de ton côté face à son père ? */
const allie = (e) => !e.morts.eirik && Boolean(e.flags.eirik_promet || e.flags.eirik_soutien_sacrifice || e.confiance.eirik >= 2);

/** Qui Hakon désigne pour tenir la porte : toi si tu ne vaux rien à ses yeux, sinon Ulf. */
const designe = (e) => (e.reputation <= 0 || e.flags.fuite ? 'toi' : !e.morts.ulf ? 'ulf' : 'thorkel');

/** Sigrid pardonne-t-elle à Ulf ? C'est elle qui décide ; le joueur ne fait que peser. */
function pardonne(e, mode) {
  if (e.flags.mensonge_sigrid) return false;
  let c = e.confiance.sigrid;
  if (e.flags.c3_sigrid_soignee) c += 1;
  if (e.flags.lettre_lue) c += 2;
  if (e.flags.sigrid_soupconne || e.flags.sigrid_sait_scalde) c += 1; // elle a eu le temps d'y penser
  if (mode === 'demander') return c >= 3;
  if (mode === 'couteau') return c >= 2;
  return c >= 4;
}

const CAM = { gautier: 180, hakon: 400 };

const GROUPE = vivants('hakon', 'sigrid', 'aude', 'eirik', 'ulf');

// Cadrage des scènes de groupe : jusqu'à cinq personnages et le joueur.
const CINQ = {
  places: [
    { x: 305, y: 138, scale: 1.0 },
    { x: 198, y: 146, scale: 0.92, miroir: true },
    { x: 428, y: 146, scale: 0.92 },
    { x: 85, y: 150, scale: 0.9, miroir: true },
    { x: -28, y: 152, scale: 0.88, miroir: true },
  ],
  joueur: { x: 580, y: 134, scale: 1.0 },
};

export const CH4 = [
  // ----------------------------------------------------------------- L'approche
  {
    id: 'c4_approche',
    ...CINQ,
    chapitre: 4,
    decor: 'chateauExt',
    personnages: GROUPE,
    texte: (e) => `
Vous approchez du château dans la dernière heure de la nuit, celle où les sentinelles pensent déjà à leur lit.

De près, c'est plus grand qu'on ne le racontait à la halle. Les murs montent tout droit dans le noir, avec des torches tous les vingt pas, et derrière les créneaux, des casques qui bougent.

**Hakon :** « Le fossé est à sec. La porte est trop solide pour le bélier, pas pour la patience. On entre par où on peut. »

Il regarde ses hommes, puis toi.

${e.blessures.includes('bras') ? `Ton bras te rappelle à l'ordre à chaque mouvement. Les échelles, ce n'est pas pour toi cette nuit.` : `Les échelles sont prêtes. Sigrid a déjà la sienne sur l'épaule.`}
${!e.morts.aude && e.confiance.aude >= 2 ? `
**Aude :** « Il y a une poterne, côté nord. Je connais le signal que les gardes attendent. Si on me laisse le faire. »` : ''}${e.flags.carte_monastere || e.flags.aude_souterrain || e.perso.origine === 'chasseur' ? `
Et il y a ce trait en pointillé sur le plan, qui passe sous les murs. ${e.perso.origine === 'chasseur' && !e.flags.carte_monastere ? `Sans plan, tu as senti l'air froid qui sort d'une grille, au pied de la falaise. Un souterrain respire toujours.` : ''}` : ''}

**Hakon :** « Choisis ton chemin, ${e.perso.prenom}. On se retrouve dans la cour. Ceux qui y arrivent. »`,
    choix: [
      {
        texte: 'Escalader les remparts avec Sigrid.',
        condition: si.pasBlesse('bras'),
        effets: fx.flag('route_remparts'),
        suivant: 'c4_remparts',
      },
      {
        texte: 'La poterne : laisser Aude faire le signal.',
        condition: si.et(si.vivant('aude'), si.confiance('aude', 2)),
        effets: fx.flag('route_poterne'),
        suivant: 'c4_poterne',
      },
      {
        texte: 'Le souterrain, sous les murs.',
        condition: (e) => Boolean(e.flags.carte_monastere || e.flags.aude_souterrain || e.perso.origine === 'chasseur'),
        effets: fx.flag('route_souterrain'),
        suivant: 'c4_souterrain_entree',
      },
      {
        texte: 'Rester avec Hakon, au bélier, devant la grande porte.',
        effets: fx.tous(fx.flag('route_belier'), fx.reputation(1)),
        suivant: 'c4_belier',
      },
    ],
  },

  // Les remparts : chrono d'escalade
  {
    id: 'c4_remparts',
    decor: 'chateauExt',
    personnages: vivants('sigrid', 'eirik'),
    texte: (e) => `
Les échelles touchent le mur sans un bruit. Presque sans un bruit.

Tu montes. Les barreaux sont glissants de rosée. Sous toi, le fossé, et sous le fossé, les pieux qu'on ne voit pas.

${e.perso.origine === 'forgeron' ? `Tu as les épaules d'une forge, pas les jambes d'un chat. Chaque barreau te coûte.` : `Tu montes vite. Les collines, la mer ou la forge t'ont appris à ne pas regarder en bas.`}

À mi-hauteur, une tête apparaît entre deux créneaux. Une sentinelle. Elle te regarde. Tu la regardes. Elle ouvre la bouche pour crier.`,
    chrono: {
      duree: (e) => (e.perso.origine === 'forgeron' ? 5 : 7),
      timeout: {
        effets: fx.tous(fx.blesser('jambe'), fx.flag('remparts_issue', 'chute')),
        suivant: 'c4_remparts_suite',
      },
    },
    choix: [
      { texte: 'Grimper sans t’arrêter.', effets: fx.tous(fx.flag('remparts_issue', 'grimpe'), fx.reputation(1)), suivant: 'c4_remparts_suite' },
      { texte: 'Te plaquer contre le mur et attendre.', effets: fx.tous(fx.flag('remparts_issue', 'attend'), fx.confiance('sigrid', 1)), suivant: 'c4_remparts_suite' },
      {
        texte: 'Abattre la sentinelle d’en bas.',
        condition: (e) => arme(e) === 'arc' && !e.blessures.includes('bras'),
        effets: fx.tous(fx.flag('remparts_issue', 'tir'), fx.reputation(2)),
        suivant: 'c4_remparts_suite',
      },
    ],
  },
  {
    id: 'c4_remparts_suite',
    decor: 'chateauExt',
    personnages: vivants('sigrid', 'eirik'),
    texte: (e) => {
      const i = e.flags.remparts_issue;
      if (i === 'grimpe')
        return `Tu montes les trois derniers barreaux d'un seul élan et tu attrapes la sentinelle par le col avant qu'elle ait fini d'inspirer. Elle part par-dessus le créneau. Son cri dure moins longtemps que la chute.

Sur le chemin de ronde, Sigrid arrive à côté de toi, essoufflée, et te regarde d'un air presque admiratif. Presque.

En bas, dans la cour, quelqu'un a mis le feu aux écuries. Le château se réveille.`;
      if (i === 'attend')
        return `Tu te plaques contre la pierre. La sentinelle hésite, cherche du regard. Elle ne te voit pas : elle voit Sigrid, deux échelles plus loin, déjà en haut.

Sigrid s'occupe d'elle. Proprement. Quand tu passes enfin le créneau, elle essuie sa lame.

**Sigrid :** « Tu prends ton temps. »

Ce n'est pas un reproche. En bas, dans la cour, quelqu'un a mis le feu aux écuries.`;
      if (i === 'tir')
        return `Tu cales le pied dans un barreau, tu lâches une main, tu bandes à moitié, et tu tires. La flèche prend la sentinelle sous le menton. Elle tombe en arrière sans un bruit.

Sur l'échelle voisine, Sigrid te regarde comme on regarde un tour de foire. Puis elle monte.

En bas, dans la cour, quelqu'un a mis le feu aux écuries.`;
      return `Tu hésites. La sentinelle, non. Elle crie, elle pousse, et l'échelle part en arrière avec toi dessus.

Le fossé est à sec. C'est une chance, d'après Sigrid. Ta jambe n'est pas d'accord.

On te hisse par une autre échelle. Tu arrives en haut en boitant, avec une jambe qui ne sera plus jamais tout à fait la tienne.`;
    },
    choix: [{ texte: 'Descendre dans la cour.', suivant: 'c4_cour' }],
  },

  // La poterne : chrono, la fausse trahison d'Aude
  {
    id: 'c4_poterne',
    decor: 'chateauExt',
    personnages: vivants('aude', 'sigrid'),
    texte: (e) => `
Côté nord, une petite porte dans le mur, sous un arc. Aude prend une torche et s'avance seule, en pleine lumière.

Elle lève la torche. Elle l'agite : une fois, deux fois, trois fois. Puis elle crie quelque chose en franc vers le haut du mur.

${e.perso.origine === 'affranchi' ? `Tu comprends : « Tout va bien. C'est Aude. Ouvrez. » Ce sont les bons mots. Tu ne sais pas si ce sont les bons signaux.` : `Tu ne comprends pas un mot. Tu sais seulement qu'elle vient de parler aux gardes de son père.`}

Sigrid, elle, a compris ce qu'elle voulait comprendre. Elle sort son couteau.

**Sigrid :** « Elle nous vend. Elle prévient les murs. »

Elle fait un pas vers Aude.`,
    chrono: {
      duree: (e) => (e.blessures.includes('oeil') ? 4 : 5),
      timeout: {
        effets: fx.tous(fx.tuer('aude'), fx.flag('aude_morte'), fx.flag('poterne_issue', 'temps')),
        suivant: 'c4_poterne_fermee',
      },
    },
    choix: [
      {
        texte: 'Retenir Sigrid.',
        effets: fx.tous(fx.flag('poterne_ouverte'), fx.flag('poterne_issue', 'retenue'), fx.confiance('aude', 1), fx.confiance('sigrid', -1)),
        suivant: 'c4_poterne_ouverte',
      },
      {
        texte: 'Laisser faire Sigrid.',
        effets: fx.tous(fx.tuer('aude'), fx.flag('aude_morte'), fx.flag('poterne_issue', 'sigrid'), fx.confiance('sigrid', 1)),
        suivant: 'c4_poterne_fermee',
      },
      {
        texte: 'Frapper Aude toi-même.',
        effets: fx.tous(fx.tuer('aude'), fx.flag('aude_morte'), fx.flag('poterne_issue', 'toi'), fx.faveur(-1)),
        suivant: 'c4_poterne_fermee',
      },
    ],
  },
  {
    id: 'c4_poterne_ouverte',
    decor: 'chateauExt',
    personnages: vivants('aude', 'sigrid'),
    texte: `
Tu attrapes le poignet de Sigrid. Encore une fois. Elle se débat, jure, et s'arrête net.

Parce que la poterne s'ouvre.

Un garde passe la tête, une lanterne à la main. Il voit Aude. Il sourit, soulagé.

**Aude :** « Merci, Odon. »

Il n'a pas le temps de comprendre pourquoi elle le remercie. Sigrid le comprend pour lui.

Aude regarde le corps, sans rien dire. Puis elle te regarde, toi, qui as retenu le couteau.

**Aude :** « Trois fois la torche, ça veut dire *tout va bien*. Deux fois, *alerte*. Ta bouclière ne sait pas compter. »

**Sigrid :** « … »

Vous entrez. Au fond, quelqu'un a mis le feu aux écuries.`,
    choix: [{ texte: 'Entrer dans la cour.', suivant: 'c4_cour' }],
  },
  {
    id: 'c4_poterne_fermee',
    decor: 'chateauExt',
    personnages: vivants('sigrid'),
    texte: (e) => `
${e.flags.poterne_issue === 'toi'
  ? `Tu frappes avant Sigrid. Aude tombe avec la torche, qui roule dans l'herbe mouillée et s'éteint en sifflant.`
  : `Sigrid frappe. Aude tombe avec la torche, qui roule dans l'herbe mouillée et s'éteint en sifflant.`}

Une seconde plus tard, en haut, on entend le bruit d'une barre qu'on soulève. Quelqu'un s'apprêtait à ouvrir.

Puis la barre retombe. Des cris. Des cloches.

Sigrid regarde la porte fermée, le corps, la torche éteinte. Elle comprend avant toi, et c'est pire pour elle.

**Sigrid :** « Elle disait vrai. »

Il ne reste plus qu'à rejoindre Hakon à la grande porte. Le bélier a fini par faire son travail. Vous entrez les derniers, dans une cour qui brûle déjà.`,
    choix: [{ texte: 'Courir vers la cour.', suivant: 'c4_cour' }],
  },

  // Le souterrain
  {
    id: 'c4_souterrain_entree',
    decor: 'souterrain',
    personnages: vivants('ulf', 'aude', 'sigrid', 'eirik'),
    texte: (e) => `
${!e.morts.aude && (e.flags.aude_souterrain || e.flags.aude_guide)
  ? `Aude marche devant, une lampe à la main. Elle connaît chaque marche. Elle venait ici, enfant, pour pleurer sans qu'on la voie.`
  : e.flags.carte_monastere
    ? `Tu avances le plan à la main, à la lumière d'une torche. Le pointillé est exact. Quelqu'un est déjà passé par ici, et a pris le temps de le noter.`
    : `Tu suis l'air froid, comme on suit une trace. Un souterrain respire toujours, et celui-ci respire vers le château.`}

C'est long. L'eau monte aux chevilles. Des gouttes tombent de la voûte, régulières, comme une horloge qui compterait pour quelqu'un d'autre.

Au bout, une porte de bois noir. Dessus, des runes peintes en rouge.
${!e.morts.ulf ? `
**Ulf :** « *Ici passe qui sait se taire.* »

Il l'a lu sans s'arrêter, sans plisser l'œil. Comme on lit son propre nom.

Personne ne lui a demandé de lire.` : ''}

Quand vous débouchez sous la chapelle, il est trop tard pour la surprise. La cour brûle déjà.`,
    entree: fx.flag('ulf_runes'),
    choix: [{ texte: 'Monter dans la cour.', suivant: 'c4_cour' }],
  },

  // Le bélier
  {
    id: 'c4_belier',
    decor: 'chateauExt',
    personnages: vivants('hakon', 'eirik'),
    texte: (e) => `
Le bélier est un tronc de chêne sur des cordes, et huit hommes qui le balancent en chantant faux. Tu prends ta place sur la corde, à côté de Hakon lui-même.

Les flèches tombent. Les boucliers les prennent. Un homme devant toi tombe aussi, et on le remplace sans arrêter de chanter.

Au vingtième coup, la porte cède.

**Hakon :** « ${e.perso.prenom}. » Il essuie son front. « Tu es resté·e. »

Dans sa bouche, c'est presque une médaille.`,
    choix: [{ texte: 'Entrer dans la cour.', suivant: 'c4_cour' }],
  },

  // ------------------------------------------------- La cour en feu (chrono 7 s)
  {
    id: 'c4_cour',
    decor: 'courFeu',
    personnages: vivants('sigrid', 'ulf', 'eirik'),
    texte: (e) => `
La cour est un four. Les galeries de bois brûlent sur trois côtés, les écuries hurlent, et la fumée est si épaisse qu'on se bat contre des ombres.

${e.flags.route_souterrain ? `Vous arrivez tard. Les autres sont déjà là, et les Francs aussi.` : `Les Francs sortent de partout, à moitié habillés, l'épée à la main et le sommeil dans les yeux.`}

Au-dessus de Sigrid, une poutre de la galerie craque.

Tu as le temps de voir deux choses. Sigrid, qui ne lève pas la tête parce qu'elle a un Franc devant elle. Et à trois pas, posé contre le mur, un coffre cerclé d'or que deux serviteurs essayaient de sauver. Le coffre du comte.

La poutre tombe.`,
    chrono: {
      duree: 7,
      timeout: {
        effets: fx.tous(fx.blesser('cotes'), fx.flag('sigrid_blessee'), fx.flag('cour_issue', 'temps')),
        suivant: 'c4_cour_suite',
      },
    },
    choix: [
      {
        texte: 'Sigrid !',
        effets: fx.tous(fx.flag('cour_issue', 'sigrid'), fx.confiance('sigrid', 1)),
        suivant: 'c4_cour_suite',
      },
      {
        texte: 'Le coffre du comte.',
        effets: fx.tous(fx.flag('cour_issue', 'coffre'), fx.butin(4), fx.tuer('sigrid'), fx.flag('sigrid_morte'), fx.flag('ulf_muet')),
        suivant: 'c4_cour_suite',
      },
    ],
  },
  {
    id: 'c4_cour_suite',
    decor: 'courFeu',
    personnages: vivants('sigrid', 'ulf', 'eirik'),
    texte: (e) => {
      const i = e.flags.cour_issue;
      if (i === 'sigrid')
        return `Tu te jettes sur elle. Vous roulez ensemble dans la boue, et la poutre s'écrase là où elle était, dans une gerbe d'étincelles.

Sigrid se relève la première. Elle a du sang sur la tempe, de la suie partout, et un regard que tu ne lui connaissais pas.

**Sigrid :** « Le coffre. Tu as vu le coffre. »

**Toi :** « Oui. »

Elle ne dit rien d'autre. Elle n'a pas besoin. Derrière vous, le coffre est sous la poutre, et l'or du comte fond doucement dans le feu.`;
      if (i === 'coffre')
        return `Tu cours vers le coffre. Tes mains le trouvent, le tirent, le sauvent. Il est lourd. Il est à toi.

Derrière toi, la poutre tombe.

Quand tu te retournes, il n'y a plus de Sigrid. Il y a une poutre en flammes, et dessous, une main qui tient encore un couteau cassé.
${e.morts.ulf ? '' : `
Ulf est là. Il a tout vu. Il te regarde, longtemps, de son seul œil.

Il ne te dira plus un mot. Pas un seul. Jusqu'à la fin.`}`;
      return `Tu hésites. Une seconde. Deux.

La poutre tombe. Tu te jettes vers Sigrid trop tard pour la tirer, assez tôt pour prendre le bout de la poutre sur le flanc à sa place. Tes côtes cèdent avec un bruit de bois mort.

Sigrid s'en sort, la jambe en sang, vivante. Le coffre, lui, a disparu sous les braises.

Tu te relèves. Respirer fait mal. Respirer est quand même mieux que l'alternative.`;
    },
    choix: [{ texte: 'Suivre Hakon vers le donjon.', suivant: 'c4_tresor' }],
  },

  // --------------------------------------------- La salle du trésor (exploration)
  {
    id: 'c4_tresor',
    type: 'lieu',
    decor: 'tresor',
    largeur: 1200,
    titre: 'La salle du trésor',
    arrivee: 'Une salle voûtée sous le donjon. De l’or partout, de la cire, des bannières rouges. Au fond, un vieil homme en cotte de mailles vous attend, l’épée à la main. Le comte Gautier n’a pas fui.',
    sol: { y: 430, xmin: 120, xmax: 1160 },
    depart: 160,
    quetes: [
      { texte: 'Régler le sort du comte', fait: si.flag('c4_gautier_fait') },
      { texte: 'Fouiller la table du comte', fait: si.flag('pris_table'), facultatif: true },
      { texte: 'Fouiller les coffres', fait: si.flag('pris_coffres'), facultatif: true },
      { texte: 'Rejoindre Hakon', visible: si.flag('c4_gautier_fait'), fait: () => false },
    ],
    elements: [
      {
        id: 'sigrid', type: 'pnj', perso: 'sigrid', x: 160, miroir: true, nom: 'Sigrid',
        visible: si.vivant('sigrid'),
        action: (e) => ({
          examiner: e.flags.cour_issue === 'sigrid'
            ? 'Sigrid ne touche pas à l’or. Elle te regarde le regarder. Tu as vu le coffre, dans la cour. Elle s’en souviendra autant que toi.'
            : 'Sigrid se tient près de l’escalier, la main sur sa jambe. Elle regarde le comte. Elle a trouvé un Franc qui valait la peine.',
        }),
      },
      {
        id: 'ulf', type: 'pnj', perso: 'ulf', x: 260, miroir: true, nom: 'Ulf le Borgne',
        visible: si.vivant('ulf'),
        action: (e) => ({
          examiner: e.flags.ulf_muet
            ? 'Ulf détourne la tête quand tu approches. Il ne te parle plus.'
            : 'Ulf regarde la table du comte, pas l’or. Il a la tête de quelqu’un qui reconnaît une pièce où il n’est jamais entré.',
        }),
      },
      {
        id: 'coffres', type: 'zone', x: 395, y: 372, l: 130, h: 70, nom: 'Les coffres du comte',
        action: {
          prendre: 'couronne',
          texte: 'Sous les pièces, enveloppé dans un linge brodé : un cercle d’or serti de pierres rouges. La couronne du comte. Elle est trop petite pour la tête de Hakon. Il la voudra quand même.',
        },
      },
      {
        id: 'aude', type: 'pnj', perso: 'aude', x: 490, nom: 'Aude',
        visible: si.vivant('aude'),
        action: { examiner: 'Aude ne regarde pas l’or. Elle regarde son père, au fond de la salle. Elle a attendu ce moment toute sa vie, et maintenant qu’il est là, elle ne sait pas quoi en faire.' },
      },
      {
        id: 'gautier', type: 'pnj', perso: 'gautier', x: 580, nom: 'Le comte Gautier',
        visible: (e) => !e.flags.gautier_mort,
        important: si.pasFlag('c4_gautier_fait'),
        action: (e) => (e.flags.c4_gautier_fait
          ? { examiner: e.flags.gautier_otage ? 'Le comte a les mains liées. Il se tient droit. Il vaut cher, et il le sait.' : 'Le comte s’est assis sur un coffre. Il regarde ses mains comme si elles appartenaient à un autre.' }
          : { scene: 'c4_gautier' }),
      },
      {
        id: 'table', type: 'zone', x: 712, y: 326, l: 120, h: 50, nom: 'La table du comte',
        action: (e) => ({
          prendre: 'lettre',
          texte: !e.morts.aude
            ? 'Parmi les comptes du comte, une lettre vieille de six ans. Aude la prend, la lit, et pâlit. « Elle est de votre jarl. Il offrait à mon père la route du raid de votre ancien jarl, contre quarante livres d’argent et la paix sur ses terres quand il serait jarl à son tour. Et il écrit : le scalde borgne, qui me doit tout, la portera au Frison. » La cire porte la marque d’un anneau. Celui que Hakon a au doigt.'
            : 'Parmi les comptes du comte, une lettre vieille de six ans, en latin. Tu ne sais pas la lire. Mais tu reconnais la cire : la marque d’un anneau, un serpent qui se mord la queue. Celui que Hakon porte au doigt depuis que tu es enfant.',
          effets: (x) => { if (!x.morts.aude) x.flags.lettre_lue = true; },
        }),
      },
      {
        id: 'hakon', type: 'pnj', perso: 'hakon', x: 830, nom: 'Hakon',
        important: si.flag('c4_gautier_fait'),
        action: (e) => (e.flags.c4_gautier_fait
          ? { scene: designe(e) === 'toi' ? 'c4_arriere_toi' : 'c4_arriere_autre' }
          : { examiner: 'Hakon soupèse un chandelier d’or, puis un autre. « Finis-en avec le vieux. Je n’ai pas le temps de négocier avec un mort. »' }),
      },
      {
        id: 'fenetre', type: 'zone', x: 960, y: 200, l: 90, h: 150, nom: 'La fenêtre sur la cour',
        action: { examiner: 'En bas, la cour brûle. Par la grande porte, des torches entrent en rang : des cavaliers francs, revenus des villages. Ils seront là avant que l’or soit dans les sacs.' },
      },
      {
        id: 'eirik', type: 'pnj', perso: 'eirik', x: 1080, nom: 'Eirik',
        visible: si.vivant('eirik'),
        action: (e) => ({
          examiner: allie(e)
            ? 'Eirik se tient près de la fenêtre. Il te fait un signe de tête. Il est là. Il sera là.'
            : 'Eirik regarde son père remplir des sacs. Il a l’air d’un garçon qui découvre que la saga ne parle jamais de ce moment-là.',
        }),
      },
    ],
  },

  // Gautier
  {
    id: 'c4_gautier',
    decor: 'tresor',
    camera: CAM.gautier,
    personnages: vivants('gautier', 'aude'),
    texte: (e) => `
Le comte est vieux. Plus vieux que Hakon, plus vieux qu'Ulf. Il tient son épée à deux mains, et elle ne tremble pas.

**Gautier :** « Normands. » Il parle ta langue, avec un accent de marché. « Six ans que je vous attends. Votre jarl m'avait promis la paix. Il faut croire qu'il a changé d'avis, ou de jarl. »

Il voit ton regard, et il rit, sans joie.

**Gautier :** « Vous ne savez pas ? Demandez-lui ce qu'il m'a écrit, il y a six ans. C'est sur la table. Je garde tout. »
${!e.morts.aude ? `
Puis il voit Aude. Son épée baisse d'un pouce.

**Gautier :** « Aude. »

Elle ne répond pas. Elle le regarde comme on regarde une porte qu'on a fini par ouvrir.` : ''}`,
    choix: [
      {
        texte: 'Le tuer.',
        effets: (e) => {
          e.flags.gautier_mort = true;
          fx.reputation(2)(e);
          if (!e.morts.aude) fx.confiance('aude', -1)(e);
        },
        suivant: 'c4_gautier_suite',
      },
      {
        texte: 'Laisser Aude décider.',
        condition: si.vivant('aude'),
        effets: (e) => {
          e.flags.aude_decide = true;
          if (e.confiance.aude >= 2) e.flags.gautier_epargne = true;
          else e.flags.gautier_mort = true;
          fx.confiance('aude', 1)(e);
        },
        suivant: 'c4_gautier_suite',
      },
      {
        texte: 'L’épargner contre rançon.',
        effets: fx.tous(fx.flag('gautier_otage'), fx.butin(2), fx.faveur(1), fx.reputation(1)),
        suivant: 'c4_gautier_suite',
      },
    ],
  },
  {
    id: 'c4_gautier_suite',
    decor: 'tresor',
    camera: CAM.gautier,
    personnages: (e) => [...(e.flags.gautier_mort ? [] : ['gautier']), ...(e.morts.aude ? [] : ['aude'])],
    entree: fx.flag('c4_gautier_fait'),
    texte: (e) => {
      if (e.flags.aude_decide && e.flags.gautier_epargne)
        return `Aude s'avance. Elle prend l'épée des mains de son père. Il la laisse faire.

Elle la lève. Elle la garde levée longtemps.

**Aude :** « Vis. » Elle jette l'épée sur les pièces d'or. « Et souviens-toi tous les jours que c'est la bâtarde de la lavandière qui t'a laissé vivre. »

Le comte s'assoit sur un coffre. Il ne dit rien. C'est la première fois de sa vie, probablement.`;
      if (e.flags.aude_decide)
        return `Aude s'avance. Elle prend l'épée des mains de son père. Il la laisse faire, parce qu'il ne croit pas qu'elle osera.

Il a tort. Ça dure un instant.

Aude reste debout au-dessus du corps, l'épée à la main. Elle tremble maintenant, alors qu'elle ne tremblait pas avant.

**Aude :** « Il ne m'a jamais regardée comme ça. Comme si j'existais. Il a fallu ça. »`;
      if (e.flags.gautier_otage)
        return `**Toi :** « Vivant, tu vaux une rançon. Mort, tu ne vaux qu'une tombe. »

Gautier te regarde, puis il pose son épée sur un coffre, lentement, la garde vers toi. Un geste de chevalier, de ceux qu'on apprend aux fils de comte.

**Gautier :** « Au moins, tu sais compter. »

On lui lie les mains. Il se laisse faire avec une dignité qui agace Hakon plus qu'une insulte.`;
      return `Tu frappes. Le vieil homme pare une fois, deux fois, avec un savoir de quarante ans de guerre. La troisième, il est trop lent. Il le savait.

Il tombe sur son or.
${!e.morts.aude ? `
Aude le regarde. Elle ne pleure pas.

**Aude :** « C'était à moi de choisir. Tu ne m'as pas demandé. »` : `
Hakon applaudit, deux fois, sans rire.`}`;
    },
    choix: [{ texte: 'Retourner dans la salle.', suivant: 'c4_tresor' }],
  },

  // ----------------------------------------------------------------- L'arrière-garde
  {
    id: 'c4_arriere_toi',
    decor: 'tresor',
    camera: CAM.hakon,
    personnages: vivants('hakon', 'eirik', 'ulf', 'sigrid'),
    texte: (e) => `
Hakon ferme le dernier sac. Par la fenêtre, on entend les chevaux francs dans la cour.

**Hakon :** « Ils reviennent des villages. On part par les souterrains, avec l'or. Quelqu'un tient la porte de la cour, le temps que tout le monde passe. »

Il te regarde.

**Hakon :** « Toi. ${e.flags.fuite ? `Sur la route, tu as couru le premier. Ce soir, tu restes le dernier. C'est juste.` : `Tu ne m'as servi à rien jusqu'ici. Sers à quelque chose.`} »
${!e.morts.eirik ? (allie(e)
  ? `
**Eirik :** « Père. Non. »

Hakon ne se retourne même pas vers son fils.`
  : `
Eirik baisse les yeux.`) : ''}`,
    choix: [
      { texte: 'Obéir. Tenir la porte.', effets: fx.flag('arriere_toi'), suivant: 'c4_arriere_garde' },
      {
        texte: 'Lui offrir la couronne du comte.',
        objet: 'couronne',
        effets: fx.tous(fx.flag('couronne_donnee'), fx.reputation(2)),
        suivant: 'c4_arriere_autre',
      },
      { texte: 'Montrer la lettre aux hommes.', objet: 'lettre', garde: true, suivant: 'c4_lettre' },
      { texte: 'Refuser.', effets: fx.tous(fx.flag('refus_arriere'), fx.reputation(-2)), suivant: 'c4_arriere_autre' },
      { texte: 'Défier Hakon.', effets: (e) => resoudreDefi(e), suivant: (e) => issueDefi(e) },
    ],
  },
  {
    id: 'c4_arriere_autre',
    decor: 'tresor',
    camera: CAM.hakon,
    personnages: vivants('hakon', 'ulf', 'eirik', 'sigrid'),
    texte: (e) => {
      const avant = e.flags.couronne_donnee && !e.flags.c4_autre_vu
        ? `Hakon prend la couronne. Il essaie de la mettre ; elle s'arrête au-dessus des oreilles. Il la glisse à sa ceinture.

**Hakon :** « Bien. Tu ne restes pas. »

Puis, comme on change de pion :

`
        : e.flags.refus_arriere && !e.flags.c4_autre_vu
          ? `Tu refuses. Hakon te regarde longtemps, comme on regarde un chien qui vient de montrer les dents. Puis il crache par terre, à tes pieds.

**Hakon :** « Garde ta peau. Elle ne vaut pas grand-chose. »

Puis, comme on change de pion :

`
          : `Hakon ferme le dernier sac. Par la fenêtre, on entend les chevaux francs dans la cour.

**Hakon :** « On part par les souterrains. Quelqu'un tient la porte, au bout, le temps que tout le monde passe. »

`;
      if (e.morts.ulf)
        return `${avant}**Hakon :** « Thorkel. Toi et tes deux cousins. Vous tiendrez la porte. »

Thorkel est un rameur du banc de derrière. Tu ne lui as jamais parlé. Il hoche la tête comme on accepte la pluie.`;
      return `${avant}**Hakon :** « Ulf tiendra la porte. » Il ne le regarde pas en le disant. « Il me doit bien ça. Il le sait. »

Ulf ne proteste pas. Il ne demande pas pourquoi lui. Il hoche la tête, une fois.

**Ulf :** « Oui. »

Et tu comprends, à la façon dont il a dit ce mot, que Hakon ne parle pas d'une dette de cette nuit.`;
    },
    entree: fx.flag('c4_autre_vu'),
    choix: [
      { texte: 'Laisser faire.', effets: (e) => { if (!e.morts.ulf) e.flags.designe_ulf = true; }, suivant: 'c4_fuite' },
      {
        texte: (e) => (e.morts.ulf ? '« Je tiendrai la porte à leur place. »' : '« Je tiendrai la porte à la place d’Ulf. »'),
        effets: (e) => {
          e.flags.arriere_toi = true;
          fx.faveur(1)(e);
          if (!e.morts.ulf) { e.flags.ulf_remplace = true; fx.confiance('ulf', 2)(e); }
        },
        suivant: 'c4_arriere_garde',
      },
      { texte: 'Montrer la lettre aux hommes.', objet: 'lettre', garde: true, suivant: 'c4_lettre' },
      { texte: 'Défier Hakon.', effets: (e) => resoudreDefi(e), suivant: (e) => issueDefi(e) },
    ],
  },

  // La lettre : les hommes apprennent qui a vendu leurs pères
  {
    id: 'c4_lettre',
    ...CINQ,
    decor: 'tresor',
    camera: CAM.hakon,
    personnages: vivants('hakon', 'sigrid', 'ulf', 'eirik', 'aude'),
    entree: (e) => {
      e.flags.lettre_montree = true;
      e.flags.lettre_lue = true;
      e.flags.hakon_destitue = true;
      e.flags.hakon_soutenu = true;
      e.morts.hakon = true;
      if (!e.morts.sigrid) { e.flags.hakon_tue_par_sigrid = true; fx.confiance('sigrid', 2)(e); }
    },
    texte: (e) => `
Tu lèves la lettre au-dessus de ta tête, la cire tournée vers les hommes.

**Toi :** « Regardez l'anneau. »

Ils regardent. Ils connaissent cet anneau. Ils l'ont vu à la main qui leur distribue l'or et les ordres depuis six ans.

${!e.morts.aude
  ? `**Aude :** « *Je vous donnerai la route du raid du vieux jarl. Le jour, la plage, le nombre de bateaux. Contre quarante livres d'argent et la paix sur mes terres quand je serai jarl.* » Elle lit sans trembler. « *Le scalde borgne, qui me doit tout, la portera au Frison.* »`
  : `Tu ne sais pas lire le latin. Tu n'en as pas besoin. Tu dis ce que dit le comte, ce que dit la cire, ce que dit le silence de Hakon.`}

Six ans. Le raid où leurs pères, leurs frères, sont morts sur une plage où les Francs attendaient.

Hakon tire son épée. Il dit quelque chose sur les mensonges des Francs, sur les bâtards qui savent écrire. Personne ne l'écoute.
${!e.morts.sigrid ? `
C'est Sigrid qui avance la première. Elle ne dit rien. Elle a ${e.flags.couteau_repare ? 'le couteau réparé de son père' : 'le couteau cassé de son père'} à la main.

Hakon pare le premier coup. Il ne pare pas les dix suivants, parce que Sigrid n'est plus seule.

Quand c'est fini, elle reste au-dessus de lui, longtemps.

**Sigrid :** « Pour Arne. » Puis, plus bas : « Enfin. »` : `
Ce sont les rameurs qui avancent, sans un mot. Hakon pare le premier coup. Il ne pare pas les suivants.`}
${!e.morts.eirik ? `
Eirik n'a pas bougé. Il regarde son père mort sur l'or du comte. Il ne pleure pas. Il dit seulement, à personne :

**Eirik :** « Il disait toujours qu'on se souviendrait de son nom. »` : ''}
${!e.morts.ulf ? `
Ulf, lui, s'est assis par terre. La lettre l'a nommé aussi. Tout le monde le regarde maintenant.` : ''}`,
    choix: [{ texte: 'Les chevaux francs sont dans la cour. Fuir.', suivant: 'c4_fuite' }],
  },

  // Victoire au duel
  {
    id: 'c4_defi_victoire',
    decor: 'tresor',
    camera: CAM.hakon,
    personnages: vivants('eirik', 'sigrid', 'ulf'),
    texte: (e) => `
**Toi :** « Non. Tiens-la toi-même, ta porte. »

Le silence qui suit est celui des halles juste avant qu'on renverse les tables. Hakon pose son sac. Il tire son épée. Il sourit presque.

**Hakon :** « Enfin. »

Il est fort, lourd, il a trente ans de guerre dans les bras. ${e.sante >= 2 ? `Mais tu as quelque chose qu'il n'a plus : l'envie de voir le jour suivant.` : `Tes blessures te ralentissent. Il le voit. Il appuie là où ça fait mal.`}

${e.flags.hakon_tue_par_eirik
  ? `Il te met à genoux. Il lève l'épée.

Et la lame d'Eirik lui entre dans le dos.

Hakon se retourne, lentement, pour voir qui. Il voit. Il a l'air presque fier, une seconde. Puis il tombe.

Eirik lâche son épée comme si elle brûlait.

**Eirik :** « Je l'ai fait. » Il te regarde. « C'est moi qui l'ai fait. Pas toi. Souviens-toi de ça. »`
  : `Le combat est court, sale, et rien de ce que les scaldes en chanteront ne sera vrai. À la fin, Hakon est sur le dos, au milieu des pièces d'or, et il te regarde comme on regarde le temps qu'il fait.

**Hakon :** « Bien. » Il tousse. « Ils diront quand même mon nom. »

Ils le diront. Pas comme il l'espérait.${allie(e) ? `

Eirik est à côté de toi. Il ne regarde pas son père. Il te regarde, toi, et il hoche la tête.` : ''}`}

Les hommes te regardent maintenant. Ils attendent un ordre. De toi.`,
    choix: [{ texte: '« Les sacs. Les souterrains. Maintenant. »', suivant: 'c4_fuite' }],
  },

  // L'arrière-garde : tu tiens la porte
  {
    id: 'c4_arriere_garde',
    decor: 'courFeu',
    personnages: [],
    texte: (e) => `
${e.flags.ulf_remplace ? `Ulf te tient le bras une seconde avant de partir. Il a le temps de dire dix mots, pas plus.

**Ulf :** « C'est moi qui ai vendu la route, il y a six ans. Pardonne-moi. »

Puis il s'en va avec les autres, et il ne se retourne pas, parce qu'il sait que s'il se retourne, il restera.

` : ''}Tu restes seul·e devant la porte de la cour, avec ${nomArme(e)}, une torche, et un monde entier qui vient vers toi.

Les cavaliers francs entrent au trot, puis au pas, quand ils voient qu'il n'y a qu'un Normand. Ils ont le temps. Toi aussi, finalement : le temps de compter jusqu'à cent, lentement, pour que les autres atteignent la mer.

Tu en abats un. Deux. Au troisième, quelqu'un te frappe derrière la tête avec le plat d'une épée.

Quand tu te réveilles, tu as des fers aux poignets, et un Franc qui te regarde les dents comme on regarde celles d'un cheval.

**Un Franc :** « Vivant. Bien. Un Normand vivant, ça se vend. »`,
    choix: [{ texte: 'Le chemin de Rouen.', suivant: 'c4_fin_vendu' }],
  },

  // ----------------------------------------------------------- La fuite et l'aveu
  {
    id: 'c4_fuite',
    ...CINQ,
    decor: 'souterrain',
    personnages: vivants('sigrid', 'ulf', 'eirik', 'aude', 'hakon'),
    texte: (e) => `
Vous courez dans le souterrain, chargés d'or, avec de l'eau jusqu'aux chevilles et les cris des Francs derrière vous.

${!e.morts.aude ? `Aude court devant. Elle connaît le chemin. Elle aurait pu vous perdre dans le noir, à n'importe quel embranchement. Elle ne le fait pas.` : `Vous courez à l'aveugle, une torche pour vingt hommes.`}

Au bout, une herse rouillée, à moitié levée, et un levier pour la faire tomber. Il faut que quelqu'un reste du mauvais côté pour la baisser. Et pour la tenir, le temps que les autres atteignent la plage.`,
    choix: [
      {
        texte: 'Arriver à la herse.',
        suivant: (e) => (!e.morts.ulf ? 'c4_aveu' : 'c4_thorkel'),
      },
    ],
  },
  {
    id: 'c4_thorkel',
    decor: 'souterrain',
    personnages: vivants('sigrid', 'eirik', 'aude'),
    texte: `
Thorkel s'arrête au levier. Il ne dit rien. Ses deux cousins s'arrêtent avec lui. Personne ne leur a rien ordonné ; ils ont juste vu que quelqu'un devait le faire.

La herse descend derrière vous dans un hurlement de fer. De l'autre côté, trois silhouettes, des torches, et le bruit des Francs qui arrivent.

Tu ne connaissais pas Thorkel. Tu ne le connaîtras pas. C'est souvent comme ça que les meilleurs s'en vont.`,
    choix: [{ texte: 'Vers la mer.', suivant: 'c4_sortie' }],
  },
  {
    id: 'c4_aveu',
    decor: 'souterrain',
    personnages: vivants('ulf', 'sigrid', 'eirik', 'aude'),
    texte: (e) => `
Ulf s'arrête au levier de la herse. Il pose son bâton contre le mur. Il ne court plus.

${e.flags.ulf_muet ? `Il ne t'a pas adressé un mot depuis la cour. Il ne te parle pas maintenant non plus. Il parle à la voûte, aux morts, à ceux qui veulent bien entendre.` : ''}

**Ulf :** « Il y a six ans, je devais de l'argent aux dés. Beaucoup. Hakon a payé ma dette. Puis il m'a donné un rouleau à porter à un Frison, à Hedeby. Ubbo. Je ne l'ai pas ouvert. Je savais ce qu'il y avait dedans. Je ne l'ai pas ouvert quand même. »
${e.flags.lettre_lue ? `
**Ulf :** « Vous avez lu la lettre. Alors vous savez que je n'étais qu'une main. » Il regarde ses mains. « Mais c'était la mienne. »` : ''}

**Ulf :** « Le Frison l'a vendue au comte. Le comte a attendu sur la plage. Et Arne est mort avec trente autres, et j'ai perdu un œil, et Hakon est devenu jarl. »
${e.flags.designe_ulf ? `
**Ulf :** « Hakon m'a nommé pour tenir cette porte. Il avait raison, pour une fois. »` : ''}${!e.morts.sigrid ? `

Sigrid est là. Elle a tout entendu. Elle ne bouge pas. Elle a le couteau de son père à la main, et elle regarde le vieil homme qui le lui a pris.${e.flags.mensonge_sigrid ? `

Puis elle te regarde, toi. Elle se souvient du vieil homme au village, de ce que tu as traduit, de ce que tu as tu. Son visage se ferme.` : ''}` : `

Il n'y a personne, ici, pour lui pardonner. Sigrid est restée sous une poutre, dans la cour.`}`,
    choix: [
      {
        texte: 'Demander à Sigrid de lui pardonner.',
        condition: si.vivant('sigrid'),
        effets: (e) => decider(e, 'demander'),
        suivant: 'c4_aveu_suite',
      },
      {
        texte: 'Te taire. C’est à elle de choisir.',
        condition: si.vivant('sigrid'),
        effets: (e) => decider(e, 'silence'),
        suivant: 'c4_aveu_suite',
      },
      {
        texte: 'Tendre ton couteau à Sigrid.',
        condition: si.vivant('sigrid'),
        effets: (e) => decider(e, 'couteau'),
        suivant: 'c4_aveu_suite',
      },
      {
        texte: 'Le retenir. « Tu viens avec nous. »',
        condition: si.mort('sigrid'),
        effets: fx.tous(fx.flag('aveu_mode', 'retenu'), fx.flag('ulf_retenu'), fx.confiance('ulf', 1)),
        suivant: 'c4_aveu_suite',
      },
      {
        texte: 'Le laisser tenir la porte.',
        condition: si.mort('sigrid'),
        effets: fx.tous(fx.flag('aveu_mode', 'laisse'), fx.tuer('ulf'), fx.flag('ulf_chante')),
        suivant: 'c4_aveu_suite',
      },
    ],
  },
  {
    id: 'c4_aveu_suite',
    decor: 'souterrain',
    personnages: vivants('ulf', 'sigrid', 'eirik', 'aude'),
    texte: (e) => {
      const mode = e.flags.aveu_mode;
      if (mode === 'retenu')
        return `Tu attrapes Ulf par le bras. Il résiste, à peine.

**Toi :** « Tu viens. La herse tombera toute seule. »

Tu coupes la corde du contrepoids. La herse descend dans un hurlement de fer, et vous passez dessous en roulant, au dernier moment.

Ulf est vivant. Personne ne lui a pardonné. Il devra vivre avec ça, ce qui est peut-être la punition la plus longue de toutes.`;
      if (mode === 'laisse')
        return `Tu ne dis rien. Ulf hoche la tête, comme si c'était la réponse qu'il attendait.

Vous passez la herse. Il abaisse le levier. Le fer tombe entre vous.

Puis, de l'autre côté, tu l'entends chanter. Une vieille chanson, une chanson de départ, avec une voix qui n'a jamais été belle et qui l'est, ce soir, pour la première fois.

Les torches franques arrivent. La chanson continue. Puis elle s'arrête.

C'est le seul moment de toute cette histoire où quelque chose a été presque beau.`;
      if (e.flags.ulf_pardonne) {
        const comment = mode === 'couteau'
          ? `Tu tends ${nomArme(e) === 'ton arc' ? 'ton couteau' : 'ta lame'} à Sigrid, manche en avant. *À toi de choisir.* Elle la prend. Elle la regarde. Elle la laisse tomber dans l'eau.`
          : mode === 'demander'
            ? `**Toi :** « Il a porté un rouleau. Hakon a écrit la lettre. Hakon a tué ton père. Ulf a juste été assez faible pour obéir. Comme nous tous. »`
            : `Tu ne dis rien. Sigrid te regarde, attend un mot, n'en reçoit pas. Elle comprend que c'est à elle.`;
        return `${comment}

**Sigrid :** « Lève-toi, vieil homme. »

Ulf ne comprend pas.

**Sigrid :** « Tu crois que je vais te laisser mourir en héros, en chantant, pour qu'on fasse une saga sur toi ? Non. Tu vas vivre. Tu vas rentrer. Et tu vas raconter à tout le village ce que tu as fait. Tous les hivers. »

Elle pose la main sur le levier, à côté de la sienne. Ils l'abaissent ensemble. La herse tombe, et vous passez dessous en courant, tous, même Ulf.

De l'autre côté, il pleure. Sans bruit. Personne ne se moque.`;
      }
      const comment = mode === 'couteau'
        ? `Tu tends ta lame à Sigrid, manche en avant. Elle la prend. Elle la regarde longtemps. Puis elle te la rend.`
        : mode === 'demander'
          ? `**Toi :** « Pardonne-lui, Sigrid. »

**Sigrid :** « Non. »`
          : `Tu ne dis rien. Sigrid ne dit rien non plus, longtemps.`;
      return `${comment}

**Sigrid :** « Je ne te tuerai pas. » Elle regarde Ulf. « Mais je ne te pardonnerai pas. Reste. Tiens ta porte. C'est tout ce que tu sais faire, tenir les portes pour les autres. »

Ulf hoche la tête. Il l'attendait.

Vous passez la herse. Il abaisse le levier. Le fer tombe entre vous.

Puis, de l'autre côté, tu l'entends chanter. Une vieille chanson, une chanson de départ, avec une voix qui n'a jamais été belle et qui l'est, ce soir, pour la première fois.

Sigrid s'arrête. Elle écoute jusqu'au bout. Les torches franques arrivent. La chanson continue. Puis elle s'arrête.`;
    },
    choix: [{ texte: 'Vers la mer.', suivant: 'c4_sortie' }],
  },

  // La sortie, à l'aube
  {
    id: 'c4_sortie',
    ...CINQ,
    decor: 'plage',
    personnages: (e) => [...['hakon', 'sigrid', 'ulf', 'eirik', 'aude'].filter((id) => !e.morts[id]), ...(e.flags.gautier_otage ? ['gautier'] : [])],
    texte: (e) => {
      const vivantsNoms = [['sigrid', 'Sigrid'], ['ulf', 'Ulf'], ['eirik', 'Eirik'], ['aude', 'Aude']].filter(([id]) => !e.morts[id]).map(([, n]) => n);
      return `
Le souterrain débouche au pied de la falaise, sur la plage, juste au moment où le ciel blanchit. Le drakkar est là où vous l'avez laissé. Il a l'air plus petit.

Vous chargez l'or en silence. Personne ne parle encore de ce qui s'est passé. Ça viendra, à la rame, pendant des jours.

${e.morts.hakon
  ? `Il n'y a plus de jarl. ${e.flags.hakon_destitue ? `Les hommes ont vu la lettre. Ils ont vu la cire.` : `Les hommes t'ont vu le défier.`} Ils te regardent, maintenant, chaque fois qu'il faut décider quelque chose.`
  : `Hakon est à la barre. Il compte les sacs. Il ne compte pas les hommes.`}
${e.flags.gautier_otage ? `
Le comte Gautier est assis au fond du bateau, les mains liées. Il regarde son château brûler sur le promontoire, sans un mot.` : ''}

${vivantsNoms.length ? `Autour de toi : ${vivantsNoms.join(', ')}. Vivants. Ce n'est pas rien.` : `Autour de toi, des rameurs. Aucun de ceux avec qui tu étais parti·e.`}

Il reste la mer. Et, quelque part de l'autre côté, un village qui attend de savoir qui revient.`;
    },
    choix: [{ texte: 'Pousser le drakkar à l’eau.', suivant: 'c5_aube' }],
  },

  // ----------------------------------------------------------------- Les fins
  {
    id: 'c4_fin_valhalla',
    fin: 'valhalla',
    decor: 'valhalla',
    morts: true,
    personnages: (e) => ['ulf', 'eirik', 'sigrid'].filter((id) => e.morts[id]),
    texte: (e) => {
      const deja = [['ulf', 'Ulf'], ['eirik', 'Eirik'], ['sigrid', 'Sigrid']].filter(([id]) => e.morts[id]).map(([, n]) => n);
      return `
L'épée de Hakon t'a ouvert de l'épaule à la hanche. Tu n'as pas eu mal longtemps.

Après, il y a une lumière, un pont de toutes les couleurs, et au bout, une halle au toit de boucliers d'où sort une odeur de viande grillée et de bière qui ne finit jamais.

Sur le seuil, des gens t'attendent.${deja.length ? ` ${deja.join(', ')}. Ils ont l'air de bonne humeur, pour des morts.` : ''}

Et derrière eux, un homme que tu n'as jamais vu, avec des mains de forgeron et le regard de Sigrid. Arne. Il te tend une corne.

**Arne :** « Alors ? Il est mort, le jarl ? »

Tu dis non. Il hausse les épaules.

**Arne :** « Il viendra. Ils viennent tous. Ici, on a le temps. »

Odin, quelque part au fond, lève un œil vers toi. Un seul. Il a l'air de trouver que tu as fait ce qu'il fallait. Ou au moins quelque chose de bruyant.`;
    },
  },
  {
    id: 'c4_fin_corbeaux',
    fin: 'corbeaux',
    decor: 'courFeu',
    sansJoueur: true,
    personnages: [],
    texte: `
L'épée de Hakon t'a ouvert de l'épaule à la hanche.

Tu as défié ton jarl dans une salle pleine d'or, sans personne à tes côtés et sans les dieux dans ton dos. Les dieux, tu ne leur avais jamais rien donné. Ils ne t'ont rien rendu.

Hakon a fait jeter ton corps dans la cour, avec ceux des Francs, pour que les autres comprennent.

Au matin, le feu s'est éteint. Trois corbeaux sont descendus sur la poutre.

Ulf avait raison. Trois sur le mât, la veille du départ. C'est le nombre de ceux qui ne reviennent pas.

Il avait simplement oublié de préciser qu'ils attendaient sur place.`,
  },
  {
    id: 'c4_fin_vendu',
    fin: 'vendu',
    decor: 'marche',
    texte: (e) => `
Rouen, trois semaines plus tard. Un marché sur les quais, une estrade, des chaînes, et toi dessus.

On t'a vendu·e une première fois au port, une deuxième fois sur la route. À chaque fois un peu moins cher : ${e.blessures.length ? `tes blessures font baisser le prix.` : `tu parles trop mal le franc pour un bon prix.`}

Un marchand s'approche. Grand, blond, une voile bleue au mât de son navire, à quai derrière lui. Il te regarde les dents. Il te parle dans ta langue.

**Le marchand :** « Normand ? Bien. Mon oncle commerçait avec les vôtres, à Hedeby. Ubbo. Tu connais ? »

Tu connais.

**Le marchand :** « Il disait toujours que les Normands se vendent entre eux mieux que personne. Il avait raison. » Il paie. « On part pour le nord demain. Tu reverras peut-être ton fjord. Depuis le banc de nage. »

${e.flags.ulf_remplace ? `Tu as tenu la porte pour qu'un vieil homme puisse rentrer chez lui. Il te reste ça. Ça ne pèse rien, sur un banc de nage. Ça pèse quand même.` : `Le village racontera que tu as tenu la porte. Personne ne racontera ce qui est venu après.`}`,
  },
];

// ---- Résolution du duel et de l'aveu -----------------------------------------

function resoudreDefi(e) {
  const gagne = e.sante >= 2 || allie(e);
  e.flags.defi = true;
  e.flags.defi_gagne = gagne;
  if (gagne) {
    e.morts.hakon = true;
    e.flags.hakon_tue = true;
    e.flags.hakon_soutenu = allie(e) || (!e.morts.sigrid && e.confiance.sigrid >= 2);
    if (allie(e) && e.sante < 2) e.flags.hakon_tue_par_eirik = true;
  } else {
    e.sante = 0;
  }
}

function issueDefi(e) {
  if (e.flags.defi_gagne) return 'c4_defi_victoire';
  return e.faveur >= 1 ? 'c4_fin_valhalla' : 'c4_fin_corbeaux';
}

function decider(e, mode) {
  e.flags.aveu_mode = mode;
  if (e.flags.mensonge_sigrid) fx.confiance('sigrid', -2)(e);
  if (pardonne(e, mode)) {
    e.flags.ulf_pardonne = true;
    fx.confiance('ulf', 2)(e);
  } else {
    e.morts.ulf = true;
    e.flags.ulf_chante = true;
  }
}
