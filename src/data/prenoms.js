export const PRENOMS = [
  'Bjorn', 'Leif', 'Torvald', 'Gunnar', 'Sten', 'Asgeir', 'Rurik', 'Halvard',
  'Astrid', 'Freydis', 'Gudrun', 'Thora', 'Ingrid', 'Yrsa', 'Solveig', 'Ragna',
  'Ask', 'Embla', 'Rune',
];

export function prenomAuHasard() {
  return PRENOMS[Math.floor(Math.random() * PRENOMS.length)];
}
