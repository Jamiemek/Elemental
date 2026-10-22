const { loadGame } = require('./sim.js');
// usage: node quarks_per_roll.js <single-file build> <luck %> <chain 1-in-N>
const G = loadGame(process.argv[2]);
const E = G.ELEMENTS, N = E.length, RAR = E.map(e => e[2]);
const luck = +process.argv[3], denom = +process.argv[4];
const w = RAR.map(o => (1 / o) * Math.pow(1 + 1.5 * (Math.log10(o + 1) / 3), (luck / 100) / 1.5));
const cum = []; let s = 0; w.forEach(v => cum.push(s += v));
function draw() { const r = Math.random() * s; let lo = 0, hi = N - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; } return lo; }
function roll() { let sc = RAR[draw()]; let n = 1; while (n < 30 && Math.random() < 1 / denom) { sc += RAR[draw()]; n++; } return G.quarksFor(sc, 1); }
const T = [160000, 220000, 400000, 500000];
let tot = 0; const M = 3e6; for (let i = 0; i < M; i++) tot += roll();
const out = T.map(() => []);
for (let k = 0; k < 60; k++) { let q = 0, r = 0, j = 0; while (j < T.length) { q += roll(); r++; while (j < T.length && q >= T[j]) { out[j].push(r); j++; } } }
console.log('chain 1 in ' + denom + ' | mean ' + (tot / M).toFixed(2) + ' q/roll | ' + T.map((t, i) => { const a = out[i].sort((x, y) => x - y); return t + ': ' + a[30] + ' (' + a[6] + '-' + a[53] + ')'; }).join(' | '));
