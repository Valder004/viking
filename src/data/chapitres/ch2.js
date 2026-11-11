// Chapitre 2 — Le drakkar. Premier chrono, première mort possible, premières blessures.
import { fx, si, chance } from '../outils.js';

const equipage = (e) => ['sigrid', 'ulf', 'eirik', 'hakon'].filter((id) => !e.morts[id]);

export const CH2 = [
  // ------------------------------------------------------------------ Le départ
  {
    id: 'c2_depart',
    chapitre: 2,
    decor: 'depart',
    personnages: ['sigrid', 'ulf', 'eirik', 'hakon'],
    texte: (e) => `
Le fjord se referme derrière vous comme une porte qu'on ne claque pas. Les falaises défilent, blanches en haut, noires en bas. Le village n'est déjà plus qu'une idée de fumée.

Tu rames. Tout le monde rame, sauf Hakon qui tient la barre et Ulf qui tient ses présages. Au bout d'une heure, tes mains ont compris ce que tes bras refusaient de croire.

Devant toi, Eirik rame aussi. Mal. Il est vert, puis gris, puis il se penche par-dessus le bord et rend le repas de sa mère aux poissons.

Quelqu'un rit. Puis deux. Hakon, à la barre, regarde ailleurs avec application.

${e.flags.eirik_humilie ? `Eirik s'essuie la bouche et te cherche des yeux. Il attend que tu en remettes une couche. Il a l'air de quelqu'un qui a déjà préparé sa réponse.` : `Eirik s'essuie la bouche. Il ne regarde personne. Surtout pas toi.`}`,
    choix: [
      {
        texte: 'Ramer plus fort pour couvrir le bruit, et lui tendre ton outre.',
        effets: fx.tous(fx.flag('eirik_couvert'), fx.confiance('eirik', 1)),
        suivant: 'c2_depart_suite',
      },
      {
        texte: '« C\'est le fjord qui te fait ça. Attends la vraie mer. »',
        effets: fx.tous(fx.flag('eirik_pique'), fx.confiance('eirik', -1)),
        suivant: 'c2_depart_suite',
      },
      {
        texte: 'Ramer. Ce n\'est pas ton problème.',
        suivant: 'c2_depart_suite',
      },
    ],
  },
  {
    id: 'c2_depart_suite',
    decor: 'depart',
    personnages: ['sigrid', 'ulf', 'eirik', 'hakon'],
    texte: (e) => {
      if (e.flags.eirik_couvert)
        return `Il prend l'outre sans te regarder, boit, crache, boit encore. Quand il te la rend, ses doigts tremblent un peu.

**Eirik :** « Dis-le à personne. »

**Toi :** « Dire quoi ? »

Il a presque un sourire. Presque. Derrière, Sigrid a tout vu et ne dit rien, ce qui chez elle est une forme d'approbation.`;
      if (e.flags.eirik_pique)
        return `Les rires repartent de plus belle. Eirik se redresse, blanc comme la voile.

**Eirik :** « Quand on sera en Francie, ${e.perso.prenom}, rappelle-moi de te montrer la vraie guerre. »

C'est une menace de gamin. Mais les gamins grandissent, et celui-là est fils de jarl. Ulf, à la proue, secoue lentement la tête. Pas pour Eirik.`;
      return `Tu rames. Le rire s'éteint tout seul. Eirik reprend sa rame et tire dessus comme s'il voulait la casser.

Personne ne reparlera de ça. Tout le monde s'en souviendra.`;
    },
    choix: [{ texte: 'Continuer.', suivant: 'c2_mer' }],
  },

  // ------------------------------------------------------------------ Pleine mer
  {
    id: 'c2_mer',
    decor: 'mer',
    personnages: ['sigrid', 'ulf', 'eirik', 'hakon'],
    texte: `
Deuxième jour. La côte a disparu et avec elle toute idée de direction. Il n'y a plus que la houle, le vent dans la voile, et le dos de celui qui rame devant toi.

Le rythme s'installe. On ne rame plus avec les bras mais avec quelque chose entre le ventre et l'ennui. Hakon parle peu. Sigrid aiguise son couteau, le même geste cent fois. Ulf regarde l'horizon comme s'il lui devait de l'argent.

Il reste encore de la lumière. Tu peux en faire quelque chose.`,
    choix: [
      {
        texte: 'Lire la houle. Quelque chose ne va pas dans le rythme des vagues.',
        condition: si.origine('pecheur'),
        effets: fx.tous(fx.flag('tempete_prevue'), fx.confiance('ulf', 1)),
        suivant: 'c2_mer_suite',
      },
      {
        texte: 'Aller parler à Sigrid.',
        effets: fx.tous(fx.flag('mer_sigrid'), fx.confiance('sigrid', 1)),
        suivant: 'c2_mer_suite',
      },
      {
        texte: 'Vérifier les cordages, les rames, le gouvernail. Par habitude.',
        condition: si.origine('forgeron'),
        effets: fx.tous(fx.flag('gouvernail_verifie'), fx.reputation(1)),
        suivant: 'c2_mer_suite',
      },
      {
        texte: 'Dormir pendant que c\'est encore possible.',
        effets: fx.flag('mer_dormi'),
        suivant: 'c2_mer_suite',
      },
    ],
  },
  {
    id: 'c2_mer_suite',
    decor: 'mer',
    personnages: ['sigrid', 'ulf', 'eirik', 'hakon'],
    texte: (e) => {
      if (e.flags.tempete_prevue)
        return `La houle vient du sud-ouest, longue et grasse, et le vent dit le contraire. Ton père appelait ça « la mer qui ment ». Ça veut dire qu'il y a quelque chose derrière l'horizon qui pousse.

Tu le dis à Hakon. Il hausse les épaules : on ne change pas de cap pour une vague. Tu le dis à Ulf. Lui ne hausse rien du tout.

**Ulf :** « Attache ce qui peut l'être. Et dors habillé. »

Tu le fais. Tu seras prêt. Les autres non.`;
      if (e.flags.mer_sigrid)
        return `Elle ne lève pas les yeux de sa lame.

**Sigrid :** « Tu sais ce qui est le pire ? Je ne me souviens plus de sa voix. Je me souviens de ses mains, de sa façon de marcher. Pas de sa voix. »

Elle passe la pierre, une fois, deux fois.

**Sigrid :** « Quand on arrivera, je veux que tu restes près de moi. Pas pour me protéger. Pour que quelqu'un se souvienne de la mienne. »

Tu dis oui. C'est facile à dire sur une mer calme.`;
      if (e.flags.gouvernail_verifie)
        return `Le gouvernail a du jeu. Pas beaucoup. Assez pour que, par gros temps, la barre réponde une seconde trop tard. Tu cales la fixation avec un coin de bois et un bout de corde goudronnée.

Hakon te regarde faire.

**Hakon :** « Qui t'a dit de toucher à mon bateau ? »

**Toi :** « Personne. Il en avait besoin. »

Il ne répond rien. Mais le soir, c'est à toi qu'il tend la première part de poisson séché. Dans son langage, ça veut dire quelque chose.`;
      return `Tu te cales entre deux coffres, la tête sur ton bouclier, et tu dors comme on tombe.

Tu rêves d'une porte. Une grande porte de bois, fermée. Quelqu'un frappe de l'intérieur. Tu te réveilles avant de savoir si tu ouvres.

Ulf te regarde. Il n'a pas l'air surpris.`;
    },
    choix: [{ texte: 'Le soir tombe. Hakon fait accoster sur un îlot.', suivant: 'c2_ilot' }],
  },

  // ------------------------------------------------------- L'îlot (exploration)
  {
    id: 'c2_ilot',
    type: 'lieu',
    decor: 'ilot',
    titre: 'L’îlot, la nuit',
    largeur: 1600,
    arrivee: 'Un caillou avec une plage, pas plus. Mais un feu sur un caillou vaut mieux que pas de feu sur l’eau. Le drakkar est tiré sur les galets. Les autres s’installent.',
    sol: { y: 430, xmin: 40, xmax: 1560 },
    depart: 560,
    quetes: [
      { texte: 'S’asseoir au feu avec les autres', fait: si.flag('c2_feu_vu') },
      { texte: 'Regarder le drakkar de près', fait: si.flag('c2_drakkar_vu'), facultatif: true },
      { texte: 'Marcher jusqu’à la pointe sud', fait: si.flag('c2_horizon_vu'), facultatif: true },
      { texte: 'Dormir', visible: si.flag('c2_feu_vu'), fait: () => false },
    ],
    elements: [
      {
        id: 'drakkar', type: 'zone', x: 180, y: 232, l: 240, h: 90, nom: 'Le drakkar, tiré sur les galets',
        action: (e) => ({
          examiner: e.perso.origine === 'forgeron' && !e.flags.gouvernail_verifie
            ? 'Tu passes la main sur la coque. Le gouvernail a du jeu : par gros temps, la barre répondra une seconde trop tard. Tu cales la fixation avec un coin de bois. Personne ne t’a rien demandé.'
            : e.perso.origine === 'pecheur'
              ? 'La coque est saine. Mais la houle qui lèche les galets vient du sud-ouest, longue et grasse, et le vent dit le contraire. Ton père appelait ça « la mer qui ment ».'
              : 'Un bon bateau. Il sent le goudron et le sel. Dans le noir, la tête de dragon à la proue a l’air de surveiller la mer.',
          effets: (x) => {
            x.flags.c2_drakkar_vu = true;
            if (x.perso.origine === 'forgeron' && !x.flags.gouvernail_verifie) { x.flags.gouvernail_verifie = true; x.reputation = Math.min(5, x.reputation + 1); }
            if (x.perso.origine === 'pecheur') x.flags.tempete_prevue = true;
          },
        }),
      },
      {
        id: 'poisson', type: 'objet', objet: 'poisson', x: 330, y: 262, nom: 'Le poisson sur la broche',
        visible: si.pasFlag('c2_feu_vu'),
        action: { prendre: 'poisson', texte: 'Tu en décroches un avant que les autres ne s’en aperçoivent. Il te brûle les doigts. Tu le gardes.' },
      },
      {
        id: 'feu', type: 'zone', x: 330, y: 322, l: 140, h: 80, nom: 'Le feu',
        important: si.pasFlag('c2_feu_vu'),
        action: (e) => (e.flags.c2_feu_vu ? { examiner: 'Les braises. Quelqu’un a remis une bûche. Les histoires sont finies.' } : { scene: 'c2_ilot_feu' }),
      },
      { id: 'ulf', type: 'pnj', perso: 'ulf', x: 118, miroir: true, nom: 'Ulf le Borgne',
        action: (e) => ({ examiner: e.flags.c2_feu_vu ? 'Ulf regarde les étoiles. Il compte quelque chose, encore.' : 'Ulf attend que tout le monde soit assis. Il ne commence jamais une histoire debout.' }) },
      { id: 'hakon', type: 'pnj', perso: 'hakon', x: 232, miroir: true, nom: 'Hakon',
        action: (e) => (e.flags.c2_hakon_vu
          ? { examiner: 'Hakon a fini de parler. Il regarde la mer comme un homme regarde une terre qu’il n’a pas encore.' }
          : { scene: 'c2_ilot_hakon' }) },
      { id: 'sigrid', type: 'pnj', perso: 'sigrid', x: 470, nom: 'Sigrid',
        action: (e) => ({ examiner: e.flags.couteau_repare ? 'Sigrid aiguise le couteau réparé. Le geste est devenu une prière.' : 'Sigrid aiguise sa lame. Le même geste, cent fois.' }) },
      {
        id: 'eirik', type: 'pnj', perso: 'eirik', x: 1330, nom: 'Eirik',
        visible: si.vivant('eirik'),
        important: (e) => !e.flags.c2_eirik_vu && e.confiance.eirik >= 1,
        action: (e) => (e.flags.c2_eirik_vu
          ? { examiner: 'Eirik reste loin de l’eau. De deux pas. Sans s’en rendre compte.' }
          : { scene: 'c2_ilot_eirik' }),
      },
      {
        id: 'epave', type: 'zone', x: 980, y: 280, l: 230, h: 100, nom: 'Une vieille épave',
        action: { examiner: 'Des membrures noires qui sortent du sable comme des côtes. Un bateau du nord, à la coupe de l’étrave. Quelqu’un est déjà passé par ici en allant vers la Francie. Il n’est pas allé plus loin.', effets: fx.flag('c2_epave_vue') },
      },
      {
        id: 'tombe', type: 'zone', x: 1226, y: 290, l: 100, h: 90, nom: 'Une tombe de marin',
        action: (e) => (e.flags.c2_tombe_honoree
          ? { examiner: 'Ta pierre est en haut du tas. Elle ne tiendra pas trois hivers. C’est déjà plus que ce qu’on a fait pour d’autres.' }
          : {
              examiner: 'Un tas de galets, une rame plantée, un bouclier fendu. Personne n’a gravé de nom. Tu ramasses une pierre sur la grève et tu la poses en haut du tas. Ça ne coûte rien. Les dieux aiment ce qui ne rapporte rien.',
              effets: fx.tous(fx.flag('c2_tombe_honoree'), fx.faveur(1)),
            }),
      },
      {
        id: 'horizon', type: 'zone', x: 1500, y: 196, l: 180, h: 90, nom: 'L’horizon, au sud',
        action: (e) => ({
          examiner: e.perso.origine === 'pecheur'
            ? 'Des éclairs, très loin, sans un bruit. Et la houle qui arrive de là-bas, longue et grasse, alors que le vent dit le contraire. Ton père appelait ça « la mer qui ment ». Demain soir, elle sera sur vous. Tu dormiras habillé·e.'
            : 'Des éclairs, très loin, sans un bruit. Trop loin pour entendre le tonnerre. Ça vient droit sur votre route. Tu te promets de garder une main près du mât, demain.',
          effets: (x) => {
            x.flags.c2_horizon_vu = true;
            if (x.perso.origine === 'pecheur') x.flags.tempete_prevue = true;
            else x.flags.orage_vu = true;
          },
        }),
      },
      {
        id: 'sortie', type: 'sortie', x: 44, nom: 'Dormir près du drakkar',
        action: { suivant: 'c2_tempete', condition: si.flag('c2_feu_vu'), refus: 'Pas encore. Il y a un feu, des gens autour, et c’est la coutume de dire pourquoi on part. On dort après.' },
      },
    ],
  },
  {
    id: 'c2_ilot_hakon',
    decor: 'ilot',
    personnages: ['hakon'],
    entree: fx.flag('c2_hakon_vu'),
    texte: `
Hakon est assis un peu à l'écart, le dos contre la coque. Il ne t'invite pas. Il ne te chasse pas non plus.

**Hakon :** « Tu rames bien. Pas assez pour que je m'en souvienne. »

Il attend. Un jarl ne pose pas de questions ; il laisse des silences.`,
    choix: [
      { texte: '« Combien d’hommes garde le château ? »', effets: fx.tous(fx.flag('hakon_plan'), fx.reputation(1)), suivant: 'c2_ilot_hakon_suite' },
      { texte: '« Eirik a eu peur, à la rame. Il tiendra. »', effets: fx.tous(fx.flag('hakon_eirik'), fx.reputation(-1), fx.confiance('eirik', 1)), suivant: 'c2_ilot_hakon_suite' },
      { texte: 'Lui tendre le poisson grillé.', objet: 'poisson', effets: fx.tous(fx.flag('hakon_poisson'), fx.reputation(1)), suivant: 'c2_ilot_hakon_suite' },
      { texte: 'Ne rien dire. Il n’attend pas de réponse.', suivant: 'c2_ilot' },
    ],
  },
  {
    id: 'c2_ilot_hakon_suite',
    decor: 'ilot',
    personnages: ['hakon'],
    texte: (e) => {
      if (e.flags.hakon_plan)
        return `**Hakon :** « Trop. » Il a presque souri. « C'est pour ça qu'on n'entre pas par la porte. »

Il n'en dira pas plus. Mais il t'a regardé·e, cette fois, et il a vu quelqu'un qui pense au château avant d'y être. Dans sa tête, ça vaut une rame de plus.`;
      if (e.flags.hakon_eirik)
        return `Son visage ne bouge pas. C'est ce qu'il a de plus effrayant.

**Hakon :** « Je ne t'ai pas demandé ce que mon fils vaut. »

Un temps.

**Hakon :** « Mais tu es le premier à le dire sans rire. » Il regarde le feu, là où Eirik est assis. « Garde ça pour toi. »

Il ne t'aime pas davantage. Eirik, lui, t'a vu parler à son père, et il n'a pas vu son père se fâcher. Il en tirera ses conclusions.`;
      return `Il prend le poisson, l'inspecte comme un butin, et mord dedans.

**Hakon :** « Tu voles sur la broche de ton jarl et tu viens lui offrir sa part. » Il mâche. « C'est exactement ce qu'il faut. »

Tu ne sais pas si c'est un compliment. Avec lui, ça ne l'est jamais tout à fait.`;
    },
    choix: [{ texte: 'Retourner vers le feu.', suivant: 'c2_ilot' }],
  },
  {
    id: 'c2_ilot_eirik',
    decor: 'ilot',
    camera: 800,
    personnages: ['eirik'],
    entree: fx.flag('c2_eirik_vu'),
    texte: (e) => `
Eirik est au bord de l'eau. Pas tout à fait : à deux pas. Il regarde les vagues lécher les galets comme on regarde un chien qu'on ne connaît pas.

${e.confiance.eirik >= 1
  ? `**Eirik :** « ${e.perso.prenom}. » Il ne se retourne pas. « Tu sais garder quelque chose pour toi ? »`
  : `**Eirik :** « Quoi ? » Il s'écarte encore d'un pas de l'eau. « Je réfléchis. Ça ne se voit pas, mais ça m'arrive. »`}`,
    choix: [
      {
        texte: '« Oui. »',
        condition: si.confiance('eirik', 1),
        effets: fx.tous(fx.flag('eirik_nage_pas'), fx.confiance('eirik', 1)),
        suivant: 'c2_ilot_eirik_suite',
      },
      {
        texte: 'Lui tendre le poisson grillé.',
        objet: 'poisson',
        effets: fx.tous(fx.flag('eirik_poisson'), fx.confiance('eirik', 1)),
        suivant: 'c2_ilot_eirik_suite',
      },
      {
        texte: '« L’eau ne mord pas, tu sais. »',
        effets: fx.tous(fx.flag('eirik_moque_eau'), fx.confiance('eirik', -1)),
        suivant: 'c2_ilot_eirik_suite',
      },
      { texte: 'Le laisser réfléchir.', suivant: 'c2_ilot' },
    ],
  },
  {
    id: 'c2_ilot_eirik_suite',
    decor: 'ilot',
    camera: 800,
    personnages: ['eirik'],
    texte: (e) => {
      if (e.flags.eirik_nage_pas)
        return `**Eirik :** « Je ne sais pas nager. »

Il l'a dit à la mer, pas à toi. Comme si c'était elle qu'il fallait prévenir.

**Eirik :** « Fils de jarl, né sur un fjord. Personne ne le sait. Mon père croit que je nage comme un phoque. » Il rit, pas drôle. « Si je tombe, je coule. C'est tout. »

Tu promets de garder ça. Il te croit à moitié, mais c'est déjà une moitié de plus qu'avec n'importe qui d'autre ici.`;
      if (e.flags.eirik_poisson)
        return `Il regarde le poisson, puis toi, puis le poisson.

**Eirik :** « Tu l'as volé sur la broche. »

**Toi :** « Oui. »

**Eirik :** « Bien. » Il le prend. « Je commençais à croire que tu étais honnête. Ça m'inquiétait. »

Il mange en regardant l'eau. Il a l'air un peu moins seul. Un peu.`;
      return `**Eirik :** « Je sais. »

Il l'a dit trop vite, et trop fort. Il s'éloigne de l'eau, cette fois franchement, et va s'asseoir de l'autre côté du feu, là où on ne la voit pas.

Tu as touché quelque chose. Tu ne sais pas encore quoi, et lui ne te le dira plus.`;
    },
    choix: [{ texte: 'Retourner vers le feu.', suivant: 'c2_ilot' }],
  },

  // ------------------------------------------------------------- Au feu
  {
    id: 'c2_ilot_feu',
    decor: 'ilot',
    personnages: ['sigrid', 'ulf', 'eirik', 'hakon'],
    texte: `
Le poisson grille, la bière tourne, et pour la première fois depuis le départ, les gens parlent.

**Hakon :** « Chacun dit pourquoi il est là. C'est la coutume. Moi, c'est simple : je veux que dans cent ans, on dise encore mon nom. »

**Sigrid :** « Pour mon père. »

Elle n'ajoute rien, et personne ne demande.

**Eirik :** « Parce que mon père me l'a ordonné. » Un silence. « Et parce que je veux voir si je vaux quelque chose. »

Hakon ne relève pas. Ulf, lui, fixe les flammes.

**Ulf :** « Moi, je suis là parce qu'il y a une porte, quelque part là-bas, qui va s'ouvrir du dedans. Et je veux voir qui l'ouvre. »

Personne ne comprend. Ulf n'explique pas. Les braises craquent. C'est ton tour.`,
    choix: [
      {
        texte: '« Et toi, Ulf, cette porte, tu l\'as déjà vue ? » Le pousser.',
        condition: si.flag('ulf_questionne'),
        effets: fx.tous(fx.flag('ulf_indice'), fx.confiance('ulf', 1)),
        suivant: 'c2_ilot_suite',
      },
      {
        texte: 'Demander à Eirik ce qu\'il veut prouver, et à qui.',
        condition: si.vivant('eirik'),
        effets: fx.tous(fx.flag('ilot_eirik'), fx.confiance('eirik', 1)),
        suivant: 'c2_ilot_suite',
      },
      {
        texte: '« Pour l\'or. » Court, net, et personne n\'y croit.',
        effets: fx.tous(fx.flag('ilot_or'), fx.reputation(1)),
        suivant: 'c2_ilot_suite',
      },
      {
        texte: '« Pour revenir. » Et regarder le feu.',
        effets: fx.tous(fx.flag('ilot_revenir'), fx.faveur(1)),
        suivant: 'c2_ilot_suite',
      },
    ],
  },
  {
    id: 'c2_ilot_suite',
    decor: 'ilot',
    personnages: ['sigrid', 'ulf', 'eirik', 'hakon'],
    entree: fx.flag('c2_feu_vu'),
    texte: (e) => {
      if (e.flags.ulf_indice)
        return `Ulf ne répond pas tout de suite. Hakon, de l'autre côté du feu, cesse de mâcher.

**Ulf :** « Il y a six ans, il y avait un marchand frison à Hedeby. Il achetait des routes. Pas des marchandises : des routes. Où on allait, quand, combien. » Il boit. « Quelqu'un lui en a vendu une. »

**Sigrid :** « Qui ? »

Le silence dure trois battements de cœur. Puis Hakon jette une bûche dans le feu, fort, et les étincelles montent.

**Hakon :** « Un Frison. Un mort, depuis. Dormez. On rame à l'aube. »

Ulf se tait. Mais tu as vu son œil, dans la lumière, et tu as vu celui de Hakon. Les deux savaient quelque chose. Un seul avait peur.`;
      if (e.flags.ilot_eirik)
        return `Eirik regarde son père. Son père regarde le feu.

**Eirik :** « À lui. Évidemment. » Il rit, pas drôle. « Tu sais ce qu'il m'a dit, la veille du départ ? *Reviens avec quelque chose ou ne reviens pas.* Il a dit ça comme on parle à un chien. »

Hakon ne bouge pas d'un cil. Tu te demandes s'il a entendu. Puis tu comprends qu'il a entendu, et que c'est précisément pour ça qu'il ne bouge pas.

Eirik se lève et va vers l'eau. Pas tout à fait jusqu'à l'eau. Si tu veux lui parler, c'est maintenant.`;
      if (e.flags.ilot_or)
        return `Hakon éclate de rire.

**Hakon :** « Enfin quelqu'un d'honnête ! »

Il te tape sur l'épaule, fort. Sigrid te regarde comme si elle te découvrait, et ce n'est pas un bon regard. Ulf, lui, sourit à moitié : il sait que tu mens, et il se demande pourquoi tu as choisi *ce* mensonge-là.`;
      return `Un silence. Puis Ulf hoche la tête, lentement.

**Ulf :** « C'est la seule bonne réponse. C'est pour ça que personne ne la donne. »

Hakon grogne quelque chose sur les rameurs qui philosophent. Mais les dieux, s'ils écoutaient, ont entendu quelqu'un dire une chose vraie à un feu de camp, et les dieux aiment ça plus qu'on ne croit.`;
    },
    choix: [{ texte: 'Le feu baisse. Chacun retourne à ses affaires.', suivant: 'c2_ilot' }],
  },

  // ------------------------------------------------------------------ La tempête
  {
    id: 'c2_tempete',
    decor: 'tempete',
    personnages: ['sigrid'],
    texte: (e) => `
Ça arrive la nuit, comme tout ce qui est sérieux.

D'abord un vent qui change. Puis la voile qui claque comme une gifle. Puis le monde qui bascule.

${e.flags.tempete_prevue ? `Tu es déjà debout, habillé, une main sur le mât. Tu as deux secondes d'avance sur tout le monde, et deux secondes, par ce temps-là, c'est une vie.` : `Tu te réveilles avec de l'eau jusqu'aux genoux et aucune idée de quel côté est le ciel.`}

Un éclair. Dans la lumière blanche, tu vois tout en même temps :

Sigrid, seule à la barre, les deux bras tendus, le bateau qui lui résiste comme une bête.

La voile déchirée qui bat au vent et tire le mât vers l'eau.

Et Eirik. Eirik n'est plus sur le pont. Eirik est dans l'eau, une main accrochée à une rame, la bouche ouverte sur un cri que le vent emporte.

Tu n'as le temps que d'une chose.`,
    chrono: {
      duree: (e) => (e.flags.tempete_prevue ? 12 : e.flags.orage_vu ? 10 : 8),
      timeout: {
        effets: fx.tous(fx.blesser('cotes'), fx.tuer('eirik'), fx.flag('tempete_issue', 'temps')),
        suivant: 'c2_tempete_suite',
      },
    },
    choix: [
      {
        texte: 'Plonger pour Eirik.',
        effets: (e) => {
          e.flags.tempete_issue = 'plonge';
          e.flags.eirik_sauve = true;
          e.confiance.eirik = Math.min(3, e.confiance.eirik + 3);
          const protege = e.perso.origine === 'pecheur' || e.flags.offrande_njord;
          if (!protege && !chance(e, 0.5)) fx.blesser('bras')(e);
          e.flags.sigrid_blessee = true;
        },
        suivant: 'c2_tempete_suite',
      },
      {
        texte: 'Aider Sigrid à la barre.',
        effets: (e) => {
          e.flags.tempete_issue = 'barre';
          e.confiance.sigrid = Math.min(3, e.confiance.sigrid + 1);
          if (chance(e, 0.25)) e.flags.eirik_repeche = true;
          else e.morts.eirik = true;
        },
        suivant: 'c2_tempete_suite',
      },
      {
        texte: 'Couper la voile avant qu\'elle ne couche le bateau.',
        effets: fx.tous(fx.flag('tempete_issue', 'voile'), fx.flag('voile_coupee'), fx.flag('sigrid_blessee'), fx.tuer('eirik'), fx.reputation(1)),
        suivant: 'c2_tempete_suite',
      },
    ],
  },
  {
    id: 'c2_tempete_suite',
    decor: 'tempete',
    personnages: (e) => ['sigrid', 'eirik', 'ulf', 'hakon'].filter((id) => !e.morts[id]),
    texte: (e) => {
      const issue = e.flags.tempete_issue;
      if (issue === 'plonge') {
        const bras = e.blessures.includes('bras');
        return `L'eau est si froide qu'elle ne fait même pas mal. Elle efface. Tu nages vers l'endroit où tu as vu Eirik, et il n'y est plus, et puis il y est, et tu attrapes ce qui te tombe sous la main : des cheveux.

${bras ? `Une vague vous jette contre la coque. Quelque chose craque dans ton épaule, un bruit propre, net, comme une branche. Tu ne lâches pas. Tu ne sais pas comment, mais tu ne lâches pas.` : `${e.perso.origine === 'pecheur' ? `La mer, tu la connais. Tu ne te bats pas contre elle ; tu attends qu'elle te remonte, et elle le fait.` : `Une vague vous soulève, vous jette vers la coque — et vous dépose. Comme une main. Tu repenseras à ce pain jeté au port.`}`}

Des bras vous hissent. Eirik vomit de l'eau sur le pont, puis te regarde, et il n'y a plus rien d'arrogant dans ce regard. Il n'y a plus rien du tout. Juste quelqu'un qui vient de comprendre qu'il est vivant.

Derrière, Sigrid a tenu la barre seule. Elle a tenu. Mais son bras gauche pend d'une façon qu'un bras ne devrait pas.`;
      }
      if (issue === 'barre') {
        return `Tu te jettes sur la barre à côté de Sigrid. À deux, le bateau obéit. Lentement, de mauvaise grâce, la proue revient face aux vagues, et le drakkar cesse de vouloir mourir.

${e.flags.eirik_repeche
  ? `Quand c'est fini, Eirik est sur le pont. Un rameur l'a repêché à la gaffe, par la tunique, comme un poisson. Il tousse, il tremble, il est vivant. Il te cherche des yeux et te trouve à la barre. Il a compris où tu étais. Il ne l'oubliera pas.`
  : `Quand c'est fini, tu regardes vers l'endroit où était Eirik.

Il n'y a plus que la rame, qui flotte.

Hakon est debout à la proue. Il ne crie pas. Il ne pleure pas. Il regarde l'eau pendant très longtemps, puis il se retourne vers l'équipage, et son visage est exactement le même qu'avant. C'est ça, le plus effrayant.`}`;
      }
      if (issue === 'voile') {
        return `Ton couteau tranche la drisse. La voile s'affale d'un coup, le mât se redresse, et le bateau se remet d'aplomb comme un ivrogne qui retrouve son mur.

Tu as sauvé le drakkar. Hakon le sait ; il te l'a vu faire.

Tu n'as pas sauvé Eirik. Quand tu regardes, il n'y a plus que la rame. Et derrière toi, Sigrid a tenu la barre seule, et son bras gauche pend d'une façon qu'un bras ne devrait pas.

Elle ne dit rien. Hakon non plus. Toi non plus. La tempête, elle, continue de parler pour tout le monde.`;
      }
      return `Tu hésites. Une seconde. Deux.

La mer ne te laisse pas la troisième. Une vague te prend de côté et te jette contre un banc de nage. Tu entends tes côtes avant de les sentir.

Quand tu peux de nouveau respirer, la tempête finit déjà, comme si elle avait obtenu ce qu'elle voulait. Sigrid est à la barre, debout, vivante. Eirik n'est plus nulle part.

Hakon regarde l'eau. Puis il te regarde, toi, au sol, et tu vois ce qu'il pense : *voilà ce qu'on a à la place de mon fils.*`;
    },
    choix: [{ texte: 'L\'aube. Ce qui reste du vent tombe.', suivant: 'c2_brouillard' }],
  },

  // ---------------------------------------------------------------- Le brouillard
  {
    id: 'c2_brouillard',
    decor: 'brouillard',
    personnages: (e) => equipage(e),
    texte: (e) => `
Le matin ne vient pas. À sa place, un brouillard si épais que le mât disparaît à mi-hauteur. On entend l'eau, on entend les rames, on n'entend pas la côte. Elle est là, quelque part. Ulf dit qu'il la sent. Hakon dit qu'il s'en fout.

**Hakon :** « On rame droit. Plein sud. La côte est là, et si on attend que la soupe se lève, on l'atteindra de nuit avec des Francs réveillés. »

**Ulf :** « Il y a des écueils devant. Je les entends. »

**Hakon :** « Tu entends des choses depuis six ans, Ulf. »

${e.morts.eirik ? `Ça sort plus dur que d'habitude. Hakon a perdu un fils cette nuit, et il va le faire payer à quelqu'un. Peut-être à la mer. Peut-être à vous tous.` : `Eirik, près de son père, ne dit rien. Il n'a plus rien dit depuis la tempête.`}

Hakon se tourne vers l'équipage. Vers toi. Il veut qu'on le soutienne. Il veut surtout qu'on le voie soutenu.`,
    choix: [
      {
        texte: '« Le jarl a raison. On rame. »',
        effets: fx.tous(fx.flag('soutien_hakon'), fx.flag('coque_fragile'), fx.reputation(2), fx.confiance('ulf', -1)),
        suivant: 'c2_brouillard_suite',
      },
      {
        texte: '« Une heure. On donne une heure à Ulf. »',
        effets: fx.tous(fx.flag('soutien_ulf'), fx.reputation(-2), fx.confiance('ulf', 2)),
        suivant: 'c2_brouillard_suite',
      },
      {
        texte: 'Te taire. Ce n\'est pas à toi de choisir.',
        effets: fx.tous(fx.flag('brouillard_silence'), fx.flag('coque_fragile')),
        suivant: 'c2_brouillard_suite',
      },
    ],
  },
  {
    id: 'c2_brouillard_suite',
    decor: 'brouillard',
    personnages: (e) => equipage(e),
    texte: (e) => {
      if (e.flags.soutien_ulf)
        return `Hakon te regarde comme on regarde une rame cassée : avec l'air de calculer combien ça va coûter.

**Hakon :** « Une heure. »

Il la donne. Et pendant cette heure, le brouillard se lève juste assez pour qu'on voie, à vingt brasses devant, une ligne de rochers noirs qui n'attendait que vous.

Personne ne dit rien. Ulf ne triomphe pas ; il a l'air plutôt fatigué. Hakon fait virer de bord sans un mot et ne te regardera plus de la journée.

Vous toucherez la côte franque de nuit. Dans le noir. Là où personne ne vous attend.`;
      const silence = e.flags.brouillard_silence;
      return `${silence ? `Personne ne parle. Alors Hakon décide, parce que c'est ce que font les jarls quand personne ne parle.` : `**Hakon :** « Voilà. Quelqu'un qui comprend. »`}

Vous ramez plein sud dans la soupe. Pendant une heure, rien. Puis un choc sourd, sous vos pieds, qui remonte dans les bancs de nage jusque dans les dents.

Un écueil. La coque racle, gémit, et passe. Un rameur se penche : il y a de l'eau, pas beaucoup. On écope. On continue.

**Ulf :** à voix basse, pour toi seul. « L'eau se souvient, ${e.perso.prenom}. Elle se souvient de tout. »

Le brouillard se lève à midi. La côte franque est là, verte, basse, et sur la plage, des gens vous ont déjà vus.`;
    },
    choix: [{ texte: 'La Francie.', suivant: 'c3_debarquement' }],
  },
];
