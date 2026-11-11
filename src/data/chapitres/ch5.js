// Chapitre 5 — Le dénouement. Court : une décision sur la plage, puis la fin.
// Ordre de résolution (voir docs/histoire.md) :
//   Hakon tué sans soutien → Le banni
//   sinon, sur la plage : rester comme jarl (Jarl de Francie), rester avec Aude (Une maison sans mur),
//   ou rentrer. En mer : coque fragile et dieux hostiles → L'eau se souvient ; sinon fin secrète,
//   puis Retour triomphal, et par défaut Le rameur.
import { ORIGINES } from '../origines.js';

const COMPAGNONS = ['sigrid', 'ulf', 'eirik', 'aude'];

const banni = (e) => Boolean(e.flags.hakon_tue && !e.flags.hakon_soutenu);
const jarlPossible = (e) => Boolean(e.morts.hakon && e.flags.hakon_soutenu);
const maisonPossible = (e) => !e.morts.aude && e.confiance.aude >= 3;
const naufrage = (e) => Boolean(e.flags.coque_fragile) && e.faveur <= -1;
const secrete = (e) => COMPAGNONS.every((id) => !e.morts[id])
  && Boolean(e.flags.ulf_pardonne && e.flags.offrande_njord && e.flags.moines_epargnes)
  && e.chronosRates === 0;
const triomphe = (e) => e.butin >= 4 && (e.morts.hakon ? Boolean(e.flags.hakon_soutenu) : e.reputation >= 3);

const vivants = (...ids) => (e) => ids.filter((id) => !e.morts[id]);
const nomsVivants = (e) => [['sigrid', 'Sigrid'], ['ulf', 'Ulf'], ['eirik', 'Eirik'], ['aude', 'Aude']].filter(([id]) => !e.morts[id]).map(([, n]) => n);

/** Ce que devient l'objet que ta mère t'a donné au chapitre 1. */
function objetRetour(e) {
  const o = ORIGINES[e.perso.origine].objet;
  if (e.flags.objet_sacrifie)
    return `Ta mère te demande ${o.nom}. Tu lui dis que tu l'as donné à la mer, la veille du départ, pour qu'elle te ramène. Elle te regarde longtemps. « Alors la mer a tenu parole. »`;
  if (e.flags.promesse_retour && e.inventaire.includes(o.id))
    return `Tu sors ${o.nom} de ta ceinture et tu le poses dans la main de ta mère. Elle referme les doigts dessus. Elle ne dit rien. Elle n'a jamais cru aux promesses ; elle croit aux objets.`;
  if (e.inventaire.includes(o.id))
    return `Tu veux rendre ${o.nom} à ta mère. Elle te referme la main dessus. « Garde-le. Tu en auras besoin la prochaine fois. » Il y aura une prochaine fois. Elle le sait mieux que toi.`;
  if (e.flags.objet_refuse)
    return `Ta mère porte ${o.nom} au cou, au bout d'un cordon. Elle ne te dit pas qu'elle l'a serré tous les soirs. Ça se voit au cordon.`;
  return '';
}

const chien = (e, avec, sans = '') => (e.flags.chien_nourri ? avec : sans);

export const CH5 = [
  // ------------------------------------------------------------- La décision
  {
    id: 'c5_aube',
    chapitre: 5,
    decor: 'plage',
    personnages: (e) => [...vivants('hakon', 'sigrid', 'aude', 'eirik', 'ulf')(e), ...(e.flags.gautier_otage ? ['gautier'] : [])],
    places: [
      { x: 305, y: 138, scale: 1.0 },
      { x: 198, y: 146, scale: 0.92, miroir: true },
      { x: 428, y: 146, scale: 0.92 },
      { x: 85, y: 150, scale: 0.9, miroir: true },
      { x: -28, y: 152, scale: 0.88, miroir: true },
    ],
    joueur: { x: 580, y: 134, scale: 1.0 },
    texte: (e) => {
      if (banni(e))
        return `
Le drakkar est à l'eau. Les hommes sont à bord. Tu poses le pied sur le plat-bord, et une main se pose sur ta poitrine.

C'est un rameur dont tu ne connais pas le nom.

**Toi :** « Écarte-toi. »

Il ne s'écarte pas. Derrière lui, personne ne bouge.

Tu as tué ton jarl. Seul. Personne n'était derrière toi quand tu l'as fait, et personne ne sera derrière toi maintenant. Un homme qui tue son jarl avec des amis, on le suit. Un homme qui le tue seul, on s'en méfie toute sa vie.

On te laisse une barque. Une rame. Une outre d'eau. C'est plus que ce que Hakon t'aurait laissé.`;
      return `
Le soleil se lève sur la plage franque. Le drakkar est à l'eau, l'or est à bord, et pour la première fois depuis le village, personne n'a de raison de se battre avant midi.

${e.morts.hakon
  ? `Il n'y a plus de jarl. Les hommes te regardent chaque fois qu'il faut décider quelque chose. C'est lourd. C'est aussi un peu enivrant, et tu n'aimes pas ça.`
  : `Hakon est à la barre. Il crie qu'on part avant que le comte ne trouve d'autres cavaliers. Personne ne lui rappelle qu'il n'y a plus de comte à qui en trouver.`}
${jarlPossible(e) ? `
Un vieux rameur s'approche, celui qui chante faux au bélier.

**Un rameur :** « Le château est à nous. Les Francs ne reviendront pas avant le printemps. Un jarl pourrait le tenir. Un jarl qui aurait des hommes. »

Il ne dit pas ton nom. Il n'a pas besoin.` : ''}${maisonPossible(e) ? `
Aude reste sur le sable, à trois pas de la mer. Elle ne monte pas.

**Aude :** « Je ne pars pas. Il y a des terres, ici, qui n'appartiennent plus à personne depuis cette nuit. » Elle te regarde. « Reste. Pas pour moi. Pour une fois, pour toi. »` : ''}

Le drakkar attend. Il ne t'attendra pas longtemps.`;
    },
    choix: [
      { texte: 'Prendre la barque qu’on te laisse.', condition: banni, suivant: 'c5_fin_banni' },
      { texte: 'Prendre le château. Être jarl ici.', condition: (e) => !banni(e) && jarlPossible(e), suivant: 'c5_fin_jarl' },
      { texte: 'Rester avec Aude.', condition: (e) => !banni(e) && maisonPossible(e), suivant: 'c5_fin_maison' },
      { texte: 'Rentrer au village.', condition: (e) => !banni(e), suivant: 'c5_retour' },
    ],
  },

  // Le retour en mer
  {
    id: 'c5_retour',
    decor: 'mer',
    personnages: vivants('sigrid', 'ulf', 'eirik', 'hakon'),
    texte: (e) => `
Six jours de mer. Le vent est bon, puis il ne l'est plus, puis il redevient bon, comme s'il hésitait à vous laisser rentrer.

On rame. On dort. On ne parle presque pas de la Francie. Ça viendra plus tard, l'hiver, au coin du feu, quand on aura décidé ensemble de ce qui s'est passé.
${!e.morts.ulf ? (e.flags.ulf_muet
  ? `
Ulf ne t'a pas adressé un mot depuis la cour. Il rame. Il regarde la mer.`
  : e.flags.ulf_pardonne
    ? `
Ulf compose quelque chose, à mi-voix, en ramant. Il s'arrête quand on le regarde. Sigrid, sur le banc d'à côté, lui souffle un mot qu'il a oublié.`
    : `
Ulf boit plus que d'habitude. Personne ne l'en empêche.`) : ''}${!e.morts.eirik ? `
Eirik se tient près du mât. Il ne vomit plus. Il a l'air d'avoir pris dix ans en dix jours.` : ''}
${naufrage(e) ? `
La dernière nuit, la coque se met à gémir. Là où elle a raclé l'écueil, dans le brouillard, à l'aller. Un rameur se penche, met la main dans l'eau qui monte entre les planches, et la retire très vite.

**Un rameur :** « Elle se souvient. »` : `
La dernière nuit, la mer est calme. Au matin, on voit les montagnes.`}`,
    choix: [
      {
        texte: (e) => (naufrage(e) ? 'Écoper.' : 'Les montagnes.'),
        suivant: (e) => (naufrage(e) ? 'c5_naufrage' : secrete(e) ? 'c5_fin_saga' : triomphe(e) ? 'c5_fin_triomphe' : 'c5_fin_rameur'),
      },
    ],
  },
  {
    id: 'c5_naufrage',
    decor: 'tempete',
    personnages: vivants('sigrid', 'eirik'),
    texte: (e) => `
On écope. Toute la nuit. Avec les casques, avec les mains, avec les boucliers. L'eau monte plus vite qu'on ne la jette.

Puis le vent se lève, et c'est fini.

Tu te souviens d'Ulf, au port, la veille du départ : *Njörd aime qu'on lui donne quelque chose avant de monter sur son dos.* ${e.flags.offrande_njord ? `Tu lui avais donné. Ça n'a pas suffi. Les dieux tiennent leurs comptes sur plus d'une ligne.` : `Tu n'avais rien donné. Njörd, lui, n'a rien oublié.`}

La coque s'ouvre en deux comme un pain trop cuit. Les coffres partent les premiers. L'or coule plus vite que les hommes.

Tu t'accroches à une planche. Quelqu'un crie ton nom. Puis personne ne crie plus.`,
    choix: [{ texte: 'Le froid.', suivant: 'c5_fin_eau' }],
  },

  // ----------------------------------------------------------------- Les fins
  {
    id: 'c5_fin_triomphe',
    fin: 'triomphe',
    decor: 'port',
    personnages: vivants('hakon', 'sigrid', 'eirik', 'ulf'),
    texte: (e) => `
Le village entier est sur le quai. Ils ont vu la voile depuis la colline, ils ont compté les rames, et ils ont commencé à crier avant que le drakkar touche le bois.

${e.morts.hakon
  ? `On te porte sur les épaules. Toi. Le rameur dont Eirik se moquait à la halle. Les hommes racontent déjà la lettre, ou le duel, et à chaque fois l'histoire grandit d'un cran.${!e.morts.eirik ? ` Eirik marche à côté de toi. Il ne demande pas la place de son père. Pas encore.` : ''}`
  : `Hakon saute le premier sur le quai, les bras levés. Puis il se retourne, il t'attrape par la ceinture, et il te hisse sur son épaule comme un trophée. « Celui-là ! Celui-là, je l'ai fait ! »

Il raconte la Francie. Dans son histoire, c'est lui qui a eu toutes les idées.`}

Les coffres sortent du drakkar un par un. ${e.flags.gautier_otage ? `Le comte Gautier aussi, les mains liées : sa rançon paiera trois hivers de plus. ` : ''}Les enfants touchent l'or comme on touche un animal qui pourrait mordre.

${objetRetour(e)}

${!e.morts.ulf
  ? (e.flags.ulf_pardonne ? `Ulf, au fond, ne chante pas. Pas ce soir. Il a promis à Sigrid de dire la vérité tous les hivers, et ce soir, personne ne veut l'entendre.` : `Ulf est descendu le dernier. Il est déjà parti vers sa maison, seul, par le chemin du haut.`)
  : `Personne ne chante les noms de ceux qui ne sont pas revenus. Ce n'est pas le soir pour ça. Ce ne sera jamais le soir pour ça.`}
${chien(e, `
Le chien est là, au bout du quai, à sa place. Il ne remue pas la queue. Il te regarde. Lui, au moins, compte les bonnes choses.`)}

Tout le monde est heureux. Presque tout le monde. Ça suffit pour une fête.`,
  },
  {
    id: 'c5_fin_jarl',
    fin: 'jarl',
    decor: 'tresor',
    camera: 200,
    personnages: (e) => [...vivants('sigrid', 'eirik', 'aude')(e), ...(e.flags.gautier_otage ? ['gautier'] : [])],
    joueur: { x: 300, y: 128, scale: 1.04 },
    places: [
      { x: 470, y: 144, scale: 0.96 },
      { x: 130, y: 144, scale: 0.96, miroir: true },
      { x: 580, y: 148, scale: 0.94 },
      { x: -10, y: 148, scale: 0.94, miroir: true },
    ],
    texte: (e) => `
La salle du comte sent encore la fumée. On a gratté les croix sur les murs. On a cousu à la hâte une bannière : un corbeau noir sur un drap rouge, avec des points de couture qui se voient de loin.

Tu es assis·e sur le siège de Gautier. Quelqu'un y a cloué des bois de cerf, pour que ça fasse plus norrois. Ça fait surtout bizarre.

Les hommes t'appellent jarl. Les premiers jours, ça te faisait sursauter. Maintenant, tu te retournes.
${!e.morts.eirik ? `
Eirik est debout à ta droite. Il porte l'épée de son père. Il ne t'a jamais demandé de la lui rendre ; tu ne la lui as jamais demandée.` : ''}${!e.morts.sigrid ? `
Sigrid commande la garde. Elle a fait des Francs du village des archers. Elle dit qu'ils tirent mal. Elle dit ça en souriant, ce qui est nouveau.` : ''}${!e.morts.aude ? `
Aude tient les comptes. Elle sait ce que vaut chaque sac de blé de la vallée, et elle sait qui ment sur le poids. Elle t'appelle *mon jarl* avec une politesse qui ressemble à une menace affectueuse.` : ''}${e.flags.gautier_otage ? `
Le comte Gautier est assis au bout de la table. Personne n'a payé sa rançon. Alors il est devenu ton conseiller. Il connaît la région, les seigneurs, les rancunes. Tu ne sais jamais tout à fait de quel côté il conseille.` : ''}

Au printemps, d'autres viendront. Des Francs pour reprendre le château. Des Normands pour te le prendre. Un jour, quelqu'un de plus jeune, plus affamé, avec des amis derrière lui, entrera dans cette salle comme tu es entré dans celle de Hakon.

Tu le sais. Tu fais mettre une deuxième porte.`,
  },
  {
    id: 'c5_fin_maison',
    fin: 'maison',
    decor: 'champ',
    personnages: ['aude'],
    texte: (e) => `
Le drakkar est parti sans toi. Tu l'as regardé jusqu'à ce que la voile ne soit plus qu'un point, puis plus rien. ${e.morts.hakon ? '' : `Hakon n'a même pas regardé en arrière. Un rameur de moins ; il a dû compter ce que ça lui faisait d'or en plus.`}

Il y a une maison, à deux jours du château, dans une vallée où personne ne vient réclamer de taxe depuis que le comte n'est plus là. Elle était vide. Elle ne l'est plus.

Aude y a planté un potager. Toi, tu as réparé le toit, trois fois, avant de comprendre comment on fait du chaume. ${e.perso.origine === 'forgeron' ? `Tu as remonté une forge dans l'appentis. Les paysans des environs viennent faire ferrer leurs bêtes. Ils te paient en œufs et en méfiance.` : `Tu as appris à labourer. Tu le fais mal. Le blé pousse quand même, par politesse.`}

Elle ne t'aime pas comme dans les chansons. Elle t'aime comme on aime quelqu'un qui a ouvert une porte et qui n'a pas demandé de remerciement. C'est plus solide.
${e.flags.moines_epargnes ? `
Parfois, un vieux moine passe sur le chemin. Anselme. Il s'arrête, boit une écuelle de lait, bénit la maison sans demander la permission, et repart. Tu le laisses faire. Ça ne coûte rien, et tu as appris que les choses qui ne coûtent rien sont celles qui tiennent.` : ''}

Il n'y a pas de mur autour de la maison. Aude n'en voulait pas. Elle a passé sa vie derrière des murs.

Le soir, tu regardes vers le nord. Pas longtemps. Juste assez pour savoir qu'il est toujours là.`,
  },
  {
    id: 'c5_fin_banni',
    fin: 'banni',
    decor: 'barque',
    personnages: [],
    texte: `
Une barque. Une rame. Une outre d'eau qui sera vide dans trois jours.

Le drakkar s'éloigne vers le nord. Personne ne se retourne. Tu les regardes partir jusqu'à ce que la voile se confonde avec la mer.

Tu as tué Hakon. Tu avais peut-être raison. Ça ne change rien : un homme qui tue son jarl seul, sans personne pour dire qu'il a eu raison, n'a plus de place nulle part. Ni au village, ni en Francie, ni dans les sagas.

Alors tu rames.

Vers où, tu n'en sais rien. L'Irlande, peut-être. On dit qu'on y accueille les gens qui n'ont plus de nom, s'ils savent se battre.

Derrière toi, personne. Devant toi, l'eau. Au-dessus, un seul corbeau qui suit la barque depuis la côte, et qui ne se décide pas à partir.

Tu commences à lui parler, le deuxième jour.`,
  },
  {
    id: 'c5_fin_eau',
    fin: 'eau',
    decor: 'greve',
    personnages: [],
    texte: (e) => `
Tu te réveilles sur une grève de galets que tu connais. Ton fjord. Ton village, là-haut, avec ses fumées du matin.

La mer t'a ramené·e. Elle t'a ramené·e seul·e.

Autour de toi, des planches. Un bouclier fendu. La tête de dragon de la proue, plantée de travers dans l'eau peu profonde, qui regarde le large comme si elle attendait encore quelqu'un.

${nomsVivants(e).length ? `${nomsVivants(e).join(', ')}. Tu cherches leurs visages parmi les débris. Tu ne les trouves pas. La mer les a gardés, avec l'or.` : `Il n'y a personne à chercher. Tu étais déjà le dernier de ceux avec qui tu étais parti·e.`}

${chien(e, `Quelque chose bouge sur la grève. Le chien. Maigre à compter les côtes, une oreille en moins. Il s'assied à trois pas de toi. Il ne remue pas la queue. Il te regarde.

C'est la seule chose vivante qui t'attendait. Ça suffit pour te relever.`, `Rien ne bouge sur la grève. Personne ne t'attendait ici. Personne ne savait qu'il fallait attendre.`)}

Ulf l'avait dit, dans le brouillard. *L'eau se souvient.* Elle se souvient de tout.`,
  },
  {
    id: 'c5_fin_saga',
    fin: 'saga',
    decor: 'veillee',
    personnages: ['sigrid', 'aude', 'ulf', 'eirik'],
    texte: (e) => `
C'est le même feu que sur l'îlot, à l'aller. Ou c'est un autre feu, mais il a la même odeur, et ce sont les mêmes gens autour. Tous. Personne ne manque.

Le village est venu s'asseoir dans le noir pour écouter.

Ulf se lève. Il n'a pas bu. Il regarde Sigrid, qui hoche la tête. Alors il commence.

Il chante le départ, les trois corbeaux, la tempête. Il chante Eirik qui ne savait pas nager. Il chante le monastère et le moine qui parlait norrois, et l'or qu'on a pris sans prendre de vies. Il chante une captive qui savait compter les torches.

Puis il chante une chose que personne au village n'avait jamais entendue. Une dette de dés. Un rouleau qu'il n'a pas ouvert. Une plage où trente hommes sont morts parce qu'un scalde avait peur. Il la chante entière, sans s'arrêter, sans s'épargner.

Personne ne parle quand il se tait.

Sigrid se lève, va jusqu'au banc vide, à côté du feu, et y pose une corne de bière pleine.

**Sigrid :** « Pour Arne. »

Aude, qui ne comprend pas tous les mots, comprend celui-là.

${objetRetour(e)}

Ulf se rassoit. La saga n'est pas finie. Il dit qu'il lui manque la fin, qu'il la trouvera l'hiver prochain. Tout le monde sait qu'il ne la finira jamais. Ce n'est pas grave. Les meilleures sagas sont celles qu'on continue à raconter.`,
  },
  {
    id: 'c5_fin_rameur',
    fin: 'rameur',
    decor: 'port',
    personnages: [],
    texte: (e) => `
Il pleut sur le port quand le drakkar touche le quai. Une pluie fine, froide, qui ne s'arrête pas pour les héros.

Il y a des gens sur le quai. Pas tout le village. Ceux qui attendaient quelqu'un. Ils cherchent un visage, le trouvent ou ne le trouvent pas, et repartent sous la pluie.

Toi, tu descends avec ta part. Ce n'est pas rien. Ce n'est pas assez pour qu'on chante ton nom.

${e.morts.hakon ? `Il n'y a plus de jarl. Il y aura des réunions, des cris, des alliances. Tu ne sais pas encore de quel côté tu seras. Tu n'es pas pressé·e de le savoir.` : `Hakon parle déjà de l'été prochain. D'un autre château. Il ne t'a pas regardé·e en descendant. Tu es un rameur. Tu étais un rameur avant de partir.`}

${objetRetour(e) || `Personne ne t'attend sur le quai. Personne ne te chasse non plus.`}
${chien(e, `
Le chien est là, sous l'auvent de la halle, au sec. Il se lève quand il te voit. Il ne vient pas vers toi : il attend que tu viennes vers lui. Tu y vas.`)}

Tu es revenu·e. C'est déjà plus que certains. C'est moins que ce que tu croyais en partant.

Il pleut. Demain, il faudra réparer le toit.`,
  },
];
