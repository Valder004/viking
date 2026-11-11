// La cour du village : un décor deux fois plus large que l'écran, qui défile avec le joueur.
// De gauche à droite : la hutte familiale, le puits, la forge, la grande halle, le chemin du port.
// Gris et neigeux le matin ; de nuit après le discours de Hakon (fenêtres et torches allumées).
import { halo, degrade, feu, braises, sapins, maison, etoiles, proue, neige, nuage, corbeau, aurore } from './elements.js';

const L = 1600;

export function cour(etat) {
  const nuit = Boolean(etat?.flags?.c1_discours_vu);
  const bois = '#4a3626';
  const boisSombre = '#2a1c12';
  const neigeC = '#e8eef3';
  const neigeOmbre = '#c3ced9';

  const rondins = (x, y, l, h, pas = 22) =>
    Array.from({ length: Math.floor(h / pas) }, (_, i) => `<path d="M${x} ${y + (i + 1) * pas} L${x + l} ${y + (i + 1) * pas}" stroke="rgba(0,0,0,0.32)" stroke-width="2"/><path d="M${x} ${y + i * pas + 3} L${x + l} ${y + i * pas + 3}" stroke="rgba(255,220,170,0.07)" stroke-width="1.5"/>`).join('');

  const douves = (x, y, l, h, pas = 20) =>
    Array.from({ length: Math.floor(l / pas) }, (_, i) => `<path d="M${x + (i + 1) * pas} ${y} L${x + (i + 1) * pas} ${y + h}" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>`).join('');

  const bouclier = (x, y, c1, c2) => `<circle cx="${x}" cy="${y}" r="19" fill="${boisSombre}"/><circle cx="${x}" cy="${y}" r="16.500" fill="${c1}"/>
    <path d="M${x} ${y - 16.5} L${x} ${y + 16.5} M${x - 16.5} ${y} L${x + 16.5} ${y}" stroke="${c2}" stroke-width="5"/>
    <path d="M${x} ${y - 16.5} A16.5 16.5 0 0 1 ${x} ${y + 16.5} Z" fill="rgba(0,0,0,0.25)"/><circle cx="${x}" cy="${y}" r="4.500" fill="#8e949a"/>`;

  const torche = (x, y) => `<path d="M${x} ${y} l0 26" stroke="#1a110a" stroke-width="5" stroke-linecap="round"/>
    <path d="M${x - 7} ${y} l14 0 l-3 -12 l-8 0 Z" fill="#2a1c12"/>`;

  const lumieres = `
    <!-- ce qui éclaire : dessiné après le voile de nuit -->
    <circle class="anim-vacille" cx="255" cy="282" r="${nuit ? 70 : 40}" fill="url(#c-chaud)"/>
    <rect x="236" y="262" width="38" height="38" fill="#ffc46b"/><path d="M255 262 L255 300 M236 281 L274 281" stroke="${boisSombre}" stroke-width="3"/>
    <circle class="anim-vacille" cx="730" cy="300" r="${nuit ? 130 : 80}" fill="url(#c-forge)"/>
    <ellipse cx="730" cy="312" rx="34" ry="7" fill="#ff8a2c"/><ellipse cx="730" cy="311" rx="22" ry="4" fill="#ffd27a"/>
    ${feu(730, 312, 0.42)}${braises(730, 290, 6, 50)}
    <circle class="anim-vacille" cx="1062" cy="262" r="${nuit ? 90 : 50}" fill="url(#c-chaud)"/>
    <circle class="anim-vacille" cx="1208" cy="262" r="${nuit ? 90 : 50}" fill="url(#c-chaud)"/>
    ${feu(1062, 270, 0.36)}${feu(1208, 270, 0.36)}
    <circle class="anim-vacille" cx="1410" cy="262" r="${nuit ? 80 : 30}" fill="url(#c-chaud)"/>
    <rect x="1403" y="252" width="14" height="20" rx="2" fill="#ffcf7a"/><path d="M1403 252 l7 -6 l7 6 Z M1403 272 h14 M1410 252 l0 20" fill="#1a110a" stroke="#1a110a" stroke-width="1.800"/>
    ${nuit ? `<rect x="1118" y="250" width="4" height="118" fill="#ffb04a" opacity="0.5"/><rect x="340" y="262" width="12" height="16" fill="#ffc46b" opacity="0.9"/><rect x="540" y="258" width="14" height="18" fill="#ffc46b" opacity="0.9"/>` : ''}`;

  return {
    svg: `<svg viewBox="0 0 ${L} 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${degrade('c-ciel', nuit ? [[0, '#060915'], [0.6, '#14203a'], [1, '#2a3a58']] : [[0, '#5d7088'], [0.6, '#aab6c3'], [1, '#dfe3e6']])}
        ${halo('c-chaud', '#ffb04a', 0.6)}
        ${halo('c-forge', '#ff7a2c', 0.55)}
        ${halo('c-lune', '#dfe8ff', 0.4)}
      </defs>
      <rect width="${L}" height="450" fill="url(#c-ciel)"/>
      ${nuit
        ? `${etoiles(90, 180)}<g transform="translate(800 0)">${etoiles(90, 180)}</g>${aurore(L, 10, 'c-au')}<circle cx="560" cy="64" r="100" fill="url(#c-lune)"/><circle cx="560" cy="64" r="24" fill="#eef1f6"/><circle cx="551" cy="57" r="5" fill="#cfd6e2" opacity="0.6"/>`
        : `${nuage(240, 70, 1.4, '#fff', 0.35)}${nuage(760, 50, 1.1, '#fff', 0.3)}${nuage(1260, 90, 1.5, '#fff', 0.35)}${nuage(1500, 40, 0.9, '#fff', 0.3)}`}

      <!-- montagnes -->
      ${[0, 800].map((dx) => `<g transform="translate(${dx} -40)">
        <path d="M0 250 L70 168 L130 214 L210 120 L290 208 L350 160 L430 236 L500 176 L570 232 L650 150 L730 222 L800 180 L800 330 L0 330 Z" fill="${nuit ? '#1b2740' : '#8494a8'}"/>
        <path d="M210 120 L236 150 L218 146 L204 158 L190 144 Z M650 150 L676 180 L656 174 L640 186 L630 172 Z M70 168 L88 190 L72 186 L58 196 Z M350 160 L366 180 L350 176 L338 184 Z M500 176 L514 194 L500 190 L488 198 Z" fill="${nuit ? '#aab6cc' : '#fff'}" opacity="${nuit ? 0.6 : 0.9}"/>
        <path d="M0 290 L90 222 L190 268 L300 214 L420 280 L540 232 L660 284 L800 240 L800 340 L0 340 Z" fill="${nuit ? '#111a2c' : '#62738a'}"/></g>`).join('')}
      <rect x="0" y="230" width="${L}" height="70" fill="${nuit ? '#2a3a58' : '#eef1f3'}" opacity="0.25"/>

      <!-- le fjord et le mât du drakkar, au bout du chemin -->
      <rect x="1330" y="296" width="280" height="80" fill="${nuit ? '#16233a' : '#7f95a8'}"/>
      <path d="M1330 306 q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="1.500" fill="none" opacity="0.3" class="anim-vague"/>
      <rect x="1497" y="204" width="6" height="124" fill="${boisSombre}"/>
      <path d="M1456 228 L1544 228" stroke="${boisSombre}" stroke-width="5" stroke-linecap="round"/>
      <rect x="1462" y="230" width="76" height="9" rx="4" fill="${nuit ? '#5a4636' : '#a8402a'}"/>
      <path d="M1500 206 L1436 326 M1500 206 L1566 324" stroke="${boisSombre}" stroke-width="1.200"/>
      ${nuit ? `${corbeau(1482, 226, 0.9)}${corbeau(1500, 226, 0.9, 'anim-oiseau anim-oiseau--2')}${corbeau(1520, 226, 0.9, 'anim-oiseau anim-oiseau--3')}` : ''}
      ${proue(1436, 330, 0.3, boisSombre)}
      <path d="M1428 322 Q1500 344 1572 320 L1566 334 Q1500 356 1434 334 Z" fill="${boisSombre}"/>

      <!-- arrière-plan : sapins et maisons du village -->
      ${sapins(300, 660, 300, 56, nuit ? '#0a0f18' : '#2a3a3c', 11)}
      ${sapins(880, 950, 300, 60, nuit ? '#0a0f18' : '#2a3a3c', 3)}
      ${sapins(1340, 1400, 304, 50, nuit ? '#0a0f18' : '#2a3a3c', 3)}
      ${maison(320, 312, 86, { nuit: false })}${maison(506, 306, 100, { nuit: false })}${maison(596, 314, 62, { nuit: false, fumee: false })}

      <!-- le sol enneigé -->
      <path d="M0 366 Q200 358 400 366 Q700 376 1000 366 Q1300 358 ${L} 368 L${L} 460 L0 460 Z" fill="${neigeC}"/>
      <path d="M0 400 Q400 388 800 398 Q1200 408 ${L} 396 L${L} 460 L0 460 Z" fill="${neigeOmbre}"/>
      ${Array.from({ length: 46 }, (_, i) => `<ellipse cx="${30 + i * 34 + (i % 3) * 6}" cy="${418 + (i % 2) * 12}" rx="5" ry="2.200" fill="#9aa8b6" opacity="0.7" transform="rotate(${i % 2 ? 12 : -12} ${30 + i * 34} ${418 + (i % 2) * 12})"/>`).join('')}

      <!-- ===== la hutte familiale ===== -->
      <rect x="20" y="215" width="280" height="158" fill="${bois}"/>
      ${rondins(20, 215, 280, 158)}
      <rect x="160" y="215" width="140" height="158" fill="rgba(0,0,0,0.18)"/>
      <path d="M-6 226 L160 66 L326 226 Z" fill="#55633f"/>
      <path d="M160 66 L326 226 L160 226 Z" fill="rgba(0,0,0,0.22)"/>
      <path d="M160 66 L262 164 Q240 174 220 160 Q200 174 180 162 Q160 176 138 162 Q116 174 96 162 Q76 172 58 164 Z" fill="${neigeC}"/>
      <path d="M-6 226 L160 66 L326 226" stroke="${boisSombre}" stroke-width="12" fill="none" stroke-linejoin="round"/>
      <path d="M146 84 L190 40 M174 84 L130 40" stroke="${boisSombre}" stroke-width="8" stroke-linecap="round"/>
      <path d="M190 40 q8 -8 16 -2 l-8 4 l6 6 Z M130 40 q-8 -8 -16 -2 l8 4 l-6 6 Z" fill="${boisSombre}"/>
      <rect x="118" y="226" width="84" height="148" fill="${boisSombre}"/>
      <rect x="126" y="234" width="68" height="140" fill="#3a2718"/>
      <path d="M149 234 L149 374 M172 234 L172 374 M126 276 L194 276 M126 332 L194 332" stroke="#1a110a" stroke-width="2.500"/>
      <circle cx="184" cy="308" r="4.500" fill="#8e949a"/>
      <path d="M118 226 Q160 204 202 226" fill="${boisSombre}"/>
      <rect x="230" y="256" width="50" height="50" fill="${boisSombre}"/>
      <path d="M228 310 Q255 302 282 310 L282 316 L228 316 Z" fill="${neigeC}"/>
      <!-- tas de bois -->
      ${Array.from({ length: 12 }, (_, i) => { const x = 312 + (i % 4) * 15 + (Math.floor(i / 4) % 2) * 7; const y = 364 - Math.floor(i / 4) * 14; return `<circle cx="${x}" cy="${y}" r="7.500" fill="#6b4a2e"/><circle cx="${x}" cy="${y}" r="4" fill="#9a7450"/><circle cx="${x}" cy="${y}" r="1.500" fill="#6b4a2e"/>`; }).join('')}
      <path d="M302 330 Q330 318 366 330 L366 336 L302 336 Z" fill="${neigeC}"/>

      <!-- ===== le puits ===== -->
      <rect x="401" y="266" width="7" height="78" fill="${boisSombre}"/><rect x="452" y="266" width="7" height="78" fill="${boisSombre}"/>
      <path d="M386 272 L430 242 L474 272 Z" fill="${bois}"/><path d="M430 242 L474 272 L430 272 Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M392 268 L430 242 L468 268 Q450 262 430 252 Q410 262 392 268 Z" fill="${neigeC}"/>
      <path d="M408 284 L452 284" stroke="${boisSombre}" stroke-width="6" stroke-linecap="round"/>
      <path d="M430 284 L430 314" stroke="#b9a37a" stroke-width="2"/>
      <path d="M421 314 L439 314 L436 332 L424 332 Z" fill="#5a4028"/><path d="M421 320 L439 320" stroke="#2a1c12" stroke-width="2"/>
      <rect x="396" y="340" width="68" height="36" rx="4" fill="#6b6660"/>
      <rect x="430" y="340" width="34" height="36" rx="4" fill="rgba(0,0,0,0.22)"/>
      <path d="M396 352 L464 352 M396 364 L464 364 M414 340 L414 352 M440 340 L440 352 M426 352 L426 364 M452 352 L452 364 M410 364 L410 376 M438 364 L438 376" stroke="rgba(0,0,0,0.35)" stroke-width="1.500"/>
      <ellipse cx="430" cy="340" rx="34" ry="9" fill="#8a857e"/><ellipse cx="430" cy="340" rx="25" ry="6" fill="#14161c"/>
      <path d="M398 338 Q412 330 426 334 Q414 338 400 342 Z" fill="${neigeC}"/>

      <!-- clôture -->
      ${Array.from({ length: 5 }, (_, i) => `<rect x="${492 + i * 34}" y="322" width="8" height="54" fill="${boisSombre}"/><path d="M${490 + i * 34} 322 q6 -6 12 0 Z" fill="${neigeC}"/>`).join('')}
      <path d="M488 338 L636 338 M488 356 L636 356" stroke="${bois}" stroke-width="5"/>
      <path d="M488 335 L636 335" stroke="${neigeC}" stroke-width="2.500"/>

      <!-- ===== la forge ===== -->
      <rect x="664" y="204" width="214" height="170" fill="#1c1512"/>
      <path d="M690 222 L850 222" stroke="${boisSombre}" stroke-width="5"/>
      <path d="M706 224 l0 22 M700 246 l12 0 l0 14 l-12 0 Z" stroke="#8e949a" stroke-width="3" fill="#6f757b"/>
      <path d="M736 224 l-4 40 M740 224 l4 40 M732 264 q6 6 12 0" stroke="#8e949a" stroke-width="2.500" fill="none"/>
      <path d="M770 224 l0 30 M762 254 l16 0 l0 10 l-16 0 Z" stroke="#8e949a" stroke-width="3" fill="#6f757b"/>
      <path d="M800 224 l0 34 M800 258 q10 -4 14 6" stroke="#8e949a" stroke-width="2.500" fill="none"/>
      <rect x="690" y="312" width="80" height="62" fill="#5c544a"/><rect x="730" y="312" width="40" height="62" fill="rgba(0,0,0,0.25)"/>
      <path d="M690 332 L770 332 M690 352 L770 352 M714 312 L714 332 M744 312 L744 332 M702 332 L702 352 M730 332 L730 352 M756 332 L756 352" stroke="rgba(0,0,0,0.35)" stroke-width="1.500"/>
      <path d="M772 330 L800 322 L806 350 L776 356 Z" fill="#5a3b24"/><path d="M800 322 L812 336 L806 350 Z" fill="#3a2516"/>
      <!-- enclume -->
      <rect x="812" y="346" width="34" height="28" fill="#4a3626"/>
      <path d="M802 326 L856 326 L856 334 L846 338 L846 346 L812 346 L812 338 L796 332 Z" fill="#3f454b"/>
      <path d="M802 326 L856 326 L856 329 L800 329 Z" fill="#8e949a"/>
      <rect x="652" y="188" width="13" height="186" fill="${boisSombre}"/><rect x="877" y="176" width="13" height="198" fill="${boisSombre}"/>
      <path d="M634 216 L904 184 L904 166 L634 198 Z" fill="${bois}"/>
      <path d="M634 198 L904 166 L904 158 Q770 168 634 190 Z" fill="${neigeC}"/>
      <path d="M648 216 l0 12 M700 210 l0 9 M760 203 l0 12 M820 196 l0 8 M870 190 l0 11" stroke="#dfe9f2" stroke-width="3" stroke-linecap="round"/>

      <!-- ===== la grande halle ===== -->
      <rect x="950" y="186" width="372" height="188" fill="#4f3a28"/>
      ${douves(950, 186, 372, 188)}
      <rect x="1136" y="186" width="186" height="188" fill="rgba(0,0,0,0.18)"/>
      <path d="M914 204 L1136 -40 L1358 204 Z" fill="#55633f"/>
      <path d="M1136 -40 L1358 204 L1136 204 Z" fill="rgba(0,0,0,0.22)"/>
      <path d="M1136 -40 L1270 108 Q1244 120 1220 104 Q1194 120 1166 106 Q1136 122 1106 106 Q1078 120 1052 104 Q1028 118 1002 108 Z" fill="${neigeC}"/>
      <path d="M914 204 L1136 -40 L1358 204" stroke="${boisSombre}" stroke-width="16" fill="none" stroke-linejoin="round"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${944 + i * 22} ${176 - i * 24} l10 -4 l-2 10 Z M${1328 - i * 22} ${176 - i * 24} l-10 -4 l2 10 Z" fill="#6b4a2a"/>`).join('')}
      <rect x="940" y="368" width="392" height="10" fill="${boisSombre}"/>
      <!-- bannière -->
      <path d="M1112 120 L1160 120 L1160 196 L1136 180 L1112 196 Z" fill="#7a2218"/><path d="M1136 120 L1160 120 L1160 196 L1136 180 Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M1112 128 L1160 128" stroke="#d6a640" stroke-width="3"/>
      <path d="M1122 164 Q1136 140 1150 164 Q1136 156 1122 164 Z M1136 150 l7 -9 l-4 12" fill="#d6a640"/>
      <!-- portail sculpté -->
      <path d="M1076 374 L1076 240 Q1136 186 1196 240 L1196 374 Z" fill="${boisSombre}"/>
      <path d="M1088 374 L1088 246 Q1136 204 1184 246 L1184 374 Z" fill="#33220f"/>
      <path d="M1136 210 L1136 374" stroke="#150e09" stroke-width="4"/>
      <path d="M1088 268 L1184 268 M1088 322 L1184 322" stroke="#6f757b" stroke-width="5"/>
      ${[1100, 1112, 1124, 1148, 1160, 1172].map((x) => `<circle cx="${x}" cy="268" r="1.800" fill="#b7bcc2"/><circle cx="${x}" cy="322" r="1.800" fill="#b7bcc2"/>`).join('')}
      <circle cx="1126" cy="296" r="6" fill="none" stroke="#8e949a" stroke-width="2.500"/><circle cx="1146" cy="296" r="6" fill="none" stroke="#8e949a" stroke-width="2.500"/>
      ${Array.from({ length: 6 }, (_, i) => `<path d="M1082 ${256 + i * 20} l-4 6 l4 6 l4 -6 Z M1190 ${256 + i * 20} l-4 6 l4 6 l4 -6 Z" fill="#6b4a2a"/>`).join('')}
      <rect x="1064" y="372" width="144" height="10" fill="#6b6660"/><rect x="1054" y="380" width="164" height="8" fill="#5c544a"/>
      <path d="M1054 380 Q1136 372 1218 380 L1218 384 L1054 384 Z" fill="${neigeC}" opacity="0.8"/>
      ${bouclier(990, 262, '#b8432b', '#e9dfc8')}${bouclier(1034, 262, '#1f3a5f', '#d9a441')}${bouclier(1238, 262, '#3e7a5a', '#e9dfc8')}${bouclier(1282, 262, '#d9a441', '#2b2b2b')}
      ${torche(1062, 270)}${torche(1208, 270)}
      <g fill="${nuit ? '#3a4458' : '#f1f1ee'}" opacity="0.4"><circle class="anim-fumee" cx="1136" cy="-10" r="16"/><circle class="anim-fumee anim-fumee--2" cx="1146" cy="-6" r="13"/></g>

      <!-- ===== le chemin du port ===== -->
      <rect x="1406" y="270" width="8" height="106" fill="${boisSombre}"/>
      <path d="M1410 270 L1410 246" stroke="${boisSombre}" stroke-width="4"/>
      <path d="M1380 344 L1440 344 L1432 356 L1388 356 Z" fill="${bois}"/><path d="M1432 344 l14 6 l-14 6 Z" fill="${bois}"/>
      <path d="M1540 376 Q1552 348 1574 356 Q1592 346 1600 376 Z" fill="#5c544a"/><path d="M1548 360 Q1560 350 1574 356 Q1562 358 1552 366 Z" fill="${neigeC}"/>

      <!-- congères au pied des murs -->
      <path d="M0 376 Q60 362 120 372 Q200 364 300 374 Q340 366 380 376 L380 384 L0 384 Z M640 378 Q700 368 780 376 Q840 366 900 378 L900 386 L640 386 Z M930 380 Q1000 370 1060 380 L1060 388 L930 388 Z M1220 380 Q1290 370 1350 380 L1350 388 L1220 388 Z" fill="#fff" opacity="0.85"/>

      ${nuit ? `<rect width="${L}" height="450" fill="#050a1e" opacity="0.5"/>` : ''}
      ${lumieres}
      <!--persos-->
      ${neige({ n: 170, largeur: L })}
    </svg>`,
    joueur: { x: 470, y: 132, scale: 1.05 },
    places: [
      { x: 150, y: 140, scale: 1.0, miroir: true },
      { x: 300, y: 146, scale: 0.96, miroir: true },
    ],
  };
}
