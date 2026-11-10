// Chapitre 1 — Le village. Pas de chrono, pas de mort. Tout ce qu'on sème ici se récolte plus tard.
import { fx, si } from '../outils.js';
import { ORIGINES } from '../origines.js';

const objet = (e) => ORIGINES[e.perso.origine].objet;

export const CH1 = [
  // ---------------------------------------------------------------- La hutte
  {
    id: 'c1_hutte',
    chapitre: 1,
    decor: 'hutte',
    personnages: ['parent'],
    texte: (e) => `
Il fait encore nuit quand ta mère te secoue. Elle ne dit rien. Elle a ce visage des matins où quelqu'un part.

Le feu est déjà ranimé. Dehors, la neige tombe droite, sans vent, comme si elle aussi attendait. Tu entends le port se réveiller : un seau, une corde, quelqu'un qui tousse.

Elle ouvre la main. Dedans, ${objet(e).nom}.

**Ta mère :** « Prends-le. Ou ne le prends pas. Mais ne me le rends pas comme ton père l'a fait. »

${objet(e).texte}`,
    choix: [
      {
        texte: 'Le prendre, sans un mot.',
        effets: fx.flag('objet_famille'),
        suivant: 'c1_hutte_sortie',
      },
      {
        texte: 'Le prendre et promettre de le rapporter.',
        effets: fx.tous(fx.flag('objet_famille'), fx.flag('promesse_retour')),
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
    texte: (e) => {
      if (e.flags.promesse_retour)
        return `Elle hoche la tête. Elle a entendu cette phrase trois fois dans sa vie. Elle sait exactement ce qu'elle vaut.

**Ta mère :** « Les promesses, c'est pour les scaldes. Reviens, c'est tout. »

Tu enfiles ta tunique. Le froid entre par la porte avant toi.`;
      if (e.flags.objet_refuse)
        return `Elle referme la main. Quelque chose passe sur son visage, trop vite pour que tu saches si c'est de la fierté ou de la peur.

**Ta mère :** « Tu es bien son enfant. »

Ce n'est pas un compliment. Ce n'est pas une insulte non plus. Tu enfiles ta tunique. Le froid entre par la porte avant toi.`;
      return `Tu le glisses dans ta ceinture. Elle ne te regarde pas faire ; elle regarde le feu.

**Ta mère :** « Hakon parle fort. Les hommes qui parlent fort ont besoin de gens qui écoutent. Ne sois pas de ceux-là. »

Tu enfiles ta tunique. Le froid entre par la porte avant toi.`;
    },
    choix: [{ texte: 'Aller à la grande halle.', suivant: 'c1_halle' }],
  },

  // ------------------------------------------------------------- La grande halle
  {
    id: 'c1_halle',
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
La halle sent la fumée, la bière et la laine mouillée. Tout le village tient dedans, et tout le village se tait quand Hakon se lève.

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
    choix: [{ texte: 'Sortir prendre l\'air au port.', suivant: 'c1_port_ulf' }],
  },

  // -------------------------------------------------------------------- Le port
  {
    id: 'c1_port_ulf',
    decor: 'port',
    personnages: ['ulf'],
    entree: fx.flag('c1_nuit'),
    texte: `
La nuit est tombée sans prévenir, comme elle fait ici. Le drakkar dort à quai, la voile pliée, la coque luisante de givre.

Ulf le Borgne est assis sur un cabestan. Il ne tourne pas la tête quand tu arrives.

**Ulf :** « Trois corbeaux. »

Tu lèves les yeux. Sur la vergue, trois formes noires, immobiles. L'une d'elles te regarde de l'œil qui ne cligne pas.

**Ulf :** « Trois sur le mât la veille d'un départ. Mon grand-père disait que c'est le nombre de ceux qui ne reviennent pas. Mon grand-père disait beaucoup de choses. Il est mort dans son lit, ce qui prouve qu'il n'écoutait pas ses propres présages. »

Il sort une outre, boit, ne te la tend pas.

**Ulf :** « Njörd aime qu'on lui donne quelque chose avant de monter sur son dos. Pas grand-chose. Juste de quoi lui rappeler qu'on sait à qui appartient l'eau. »`,
    choix: [
      {
        texte: 'Jeter un morceau de pain à la mer, pour Njörd.',
        effets: fx.tous(fx.flag('offrande_njord'), fx.faveur(1)),
        suivant: 'c1_port_ulf_suite',
      },
      {
        texte: (e) => `Jeter ${objet(e).nom} à la mer. Une vraie offrande.`,
        condition: si.flag('objet_famille'),
        effets: fx.tous(fx.flag('offrande_njord'), fx.flag('objet_sacrifie'), fx.faveur(2)),
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
    texte: (e) => {
      if (e.flags.objet_sacrifie)
        return `Tu l'as fait avant de réfléchir. Un éclat, un *plouf* ridicule de petitesse, et c'est fini. Ta mère ne le saura jamais, sauf si tu reviens, et alors tu auras le temps d'inventer quelque chose.

Ulf te regarde pour la première fois. De son seul œil, il te regarde comme on regarde quelqu'un qu'on va devoir surveiller.

**Ulf :** « Ça, c'était cher. L'eau s'en souviendra. »

Il boit encore. Au-dessus, l'un des corbeaux s'envole. Il en reste deux.`;
      if (e.flags.offrande_njord)
        return `Le pain flotte, tourne, et coule. Rien ne se passe. C'est ainsi que les dieux disent merci.

**Ulf :** « Bien. Tu ne crois pas à grand-chose, mais tu paies tes dettes d'avance. C'est plus rare que la foi. »

Au-dessus, l'un des corbeaux s'envole. Il en reste deux. Ulf ne commente pas.`;
      if (e.flags.ulf_questionne)
        return `Le silence dure assez longtemps pour que tu entendes la glace craquer contre la coque.

**Ulf :** « Qui t'a parlé d'il y a six ans ? »

**Toi :** « Tout le monde. Personne. Sigrid n'en parle jamais, et c'est encore plus bruyant. »

Il boit. Il essuie sa bouche. Il regarde la mer, parce que la mer ne pose pas de questions.

**Ulf :** « Il y a six ans, j'ai donné un œil. On m'a dit que c'était un bon prix. » Un temps. « On m'a menti. »

Il ne dira rien d'autre ce soir. Mais il ne t'a pas envoyé promener, et tu sens que ça compte. Au-dessus, un corbeau s'envole.`;
      return `**Toi :** « Les dieux ont assez de pain. Et s'ils ont faim, qu'ils viennent ramer. »

Ulf a un petit rire sec, sans joie.

**Ulf :** « C'est ce que disait Arne. Le père de Sigrid. » Il laisse la phrase tomber à l'eau et ne la repêche pas.

Au-dessus, un corbeau s'envole. Tu te dis que ça ne veut rien dire. C'est exactement ce que tu te dis.`;
    },
    choix: [{ texte: 'Rejoindre Sigrid, plus loin sur le quai.', suivant: 'c1_port_sigrid' }],
  },
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
    texte: (e) => {
      if (e.flags.couteau_repare)
        return `Elle hésite. Puis elle te le donne, manche en avant, comme on donne quelque chose qu'on ne reprendra peut-être pas.

Tu passes la nuit à la forge de ton père. La lame est bonne ; la cassure est franche. À l'aube, ce n'est plus le même couteau, mais c'en est un. Quand tu le lui rends, elle le regarde longtemps.

**Sigrid :** « Il ne l'aurait pas reconnu. »

**Toi :** « Il n'aurait pas eu besoin. »

Elle le glisse à sa ceinture. Elle ne dit pas merci. Elle n'en a pas besoin non plus.`;
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
    choix: [{ texte: 'Remonter le quai.', suivant: 'c1_chien' }],
  },
  {
    id: 'c1_chien',
    decor: 'port',
    personnages: [],
    texte: `
Entre deux tas de cordages, quelque chose bouge. Un chien. Maigre à compter les côtes, une oreille en moins, l'autre dressée vers toi. Il ne grogne pas. Il n'a plus l'énergie pour ça.

Il te regarde avec l'air de quelqu'un qui a déjà vu des gens partir et qui sait exactement combien en reviennent.

Tu as un quignon de pain dans ta ceinture. Tu avais prévu de le manger à la rame.`,
    choix: [
      {
        texte: 'Lui donner le pain.',
        effets: fx.flag('chien_nourri'),
        suivant: 'c1_aube',
      },
      {
        texte: 'Le chasser d\'un coup de pied dans les cordages.',
        effets: fx.flag('chien_chasse'),
        suivant: 'c1_aube',
      },
      {
        texte: 'Passer ton chemin.',
        suivant: 'c1_aube',
      },
    ],
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
          : `Quelque part derrière les cordages, un chien ne bouge pas.`;
      const eirik = e.flags.eirik_humilie
        ? `Eirik monte le dernier et s'assied le plus loin possible de toi.`
        : e.flags.eirik_blague
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

  // Chapitre 2 pas encore écrit : écran d'attente.
  {
    id: 'c2_depart',
    chapitre: 2,
    decor: 'port',
    personnages: [],
    aSuivre: true,
    texte: `
*Le chapitre 2, « Le drakkar », n'est pas encore écrit.*

Ta partie est sauvegardée ici. Quand le chapitre sera en place, tu reprendras à ce banc de nage, avec le viking et les choix que tu viens de faire.`,
    choix: [],
  },
];
