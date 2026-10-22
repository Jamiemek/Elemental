// node tune.js <index.html> <edits.json> [runs] [maxH]
const fs = require('fs');
const { loadGame, simulate } = require('./sim.js');
const file = process.argv[2];
const over = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const runs = +process.argv[4] || 6;
const maxH = +process.argv[5] || 900;
const G = loadGame(file, over);
const keys = ['autoroll', 'extra1', 'extra2', 'extra3p', 'chain55', 'chain3', 'el50', 'el75', 'extra3', 'ach30', 'ach50', 'ach', 'bond25', 'bond50', 'bond75', 'bond', 'bond90', 'U', 'table', 'complete', 'buy5', 'buy6'];
const all = [];
for (let r = 0; r < runs; r++) {
    all.push(simulate(G, 1000 + r * 7919, maxH, Object.assign({ full: !!over.full }, over.opts || {})));
}
const med = a => {
    const v = a.filter(x => x != null).sort((x, y) => x - y);
    if (v.length < a.length / 2) {
        return null;
    }
    return v[Math.floor((a.length - 1) / 2)];
};
const row = {};
keys.forEach(k => {
    const v = all.map(x => x.M[k]);
    row[k] = med(v);
    row[k + '_lo'] = Math.min(...v.map(x => x == null ? 1e9 : x));
    row[k + '_hi'] = Math.max(...v.map(x => x == null ? 1e9 : x));
});
console.log(keys.map(k => `${k}: ${row[k] == null ? '—' : row[k].toFixed(0)} (${row[k + '_lo'] > 1e8 ? '—' : row[k + '_lo'].toFixed(0)}–${row[k + '_hi'] > 1e8 ? '—' : row[k + '_hi'].toFixed(0)})`).join('\n'));
const e = all[0].end;
console.log('run0 end:', JSON.stringify({ h: +e.h.toFixed(0), found: e.found, ach: e.ach, bonds: e.bonds + '/' + e.nn, rolls: e.rolls, q: e.quarks, earned: e.earned, perH: Math.round(e.earned / e.h), bought: e.bought, rareShare: e.rareShare, rareN: e.rareN, maxQ: e.maxQ, maxQScore: e.maxQScore, luck: Math.round(e.luck), missing: e.missing.slice(0, 8) }));
if (over.showTimeline) {
    console.log(all[0].timeline.map(x => JSON.stringify(x)).join('\n'));
}
const medv = a => { const v = a.slice().sort((x, y) => x - y); return v[Math.floor((v.length - 1) / 2)]; };
const E = all.map(x => x.end);
console.log('SUMMARY ' + JSON.stringify({ perH: Math.round(medv(E.map(e => e.earned / e.h))), rareShare: medv(E.map(e => e.rareShare)), rareN: medv(E.map(e => e.rareN)), maxQ: Math.max(...E.map(e => e.maxQ)), spareQ: Math.round(medv(E.map(e => e.quarks))), boughtByTier: [0,1,2,3,4,5,6].map(k => medv(E.map(e => e.bought[k] || 0))) }));
fs.writeFileSync('last_' + Date.now() + '.json', JSON.stringify(all.map(x => ({ M: x.M, timeline: x.timeline, end: x.end }))));
