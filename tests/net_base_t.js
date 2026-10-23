// base tree (to ring 24) can't change, slots are saved by id
const crypto = require('crypto');
const { loadGame } = require('./sim.js');
const G = loadGame(process.argv[2]);
const N = G.NET;
const base = N.nodes.filter(n => n.ring <= 24);
const ids = new Set(base.map(n => n.id));
const lines = N.edges.filter(e => ids.has(e.a) && ids.has(e.b));
const text = JSON.stringify([
    base.map(n => [n.id, Math.round(n.x * 1000), Math.round(n.y * 1000), n.ring, n.req]),
    lines.map(e => [e.a, e.b, e.kind, e.val, !!e.join])
]);
const EXPECT = process.env.EXPECT || '';
const h = crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
console.log('base slots', base.length, '| base lines', lines.length, '| all slots', N.nodes.length, '| fingerprint', h, EXPECT ? (h === EXPECT ? 'MATCHES' : 'DIFFERENT') : '');
