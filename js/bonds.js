// Bond network
const NET_SEED = 20261021;
const NET_QTY = 23;
const NET_FAM_QTY = 23;
const NET_QTY_GROWTH = 1.42;
// how strongly each line buff is weighted toward the outer rings
const NET_WEIGHT = { luck: 2.5, auto: 1.6, price: 0.6, refresh: 0.6, stock: 0.6 };
const NET_RINGS = 24;
const NET_STEP = 130;
const NET_MIN_GAP = 74;
const NET_TOTALS = {
    luck: 65.3, auto: 800, price: 30, refresh: 8, stock: 60
};
const NET_MULTS = [1.04, 1.05, 1.06, 1.08, 1.1, 1.2, 1.35, 1.5];
const NET_SLOT_RINGS = [4, 10, 17];
const NET_CHAIN_RINGS = [13, 17, 20, 23];
const NET_EXTRA_RINGS = [10, 15];
// outer ring 1 = rings 26-28 (25 is the gap)
const NET_RING_COL = ['#f0c419', '#7ddc5a', '#7ddc5a', '#7ddc5a', '#2fe0b0', '#2fe0b0', '#2fe0b0', '#35d0e0', '#35d0e0', '#35d0e0', '#5aa8ff', '#5aa8ff', '#5aa8ff', '#9b8cff', '#9b8cff', '#9b8cff', '#c77dff', '#e060ff', '#e060ff', '#ff5a8a', '#ff5a8a', '#ff7a5a', '#ff7a5a', '#ffb35a', '#ffe08a', '#ffe08a', '#3ff0ff', '#c45cff', '#ffd36e'];
const OUTER_SEED = 20261022;
const OUTER_ORBITS = 3;
const OUTER_PER_ORBIT = 207;
const OUTER_RADIUS = 3420;
const OUTER_STEP = 180;
const OUTER_BRIDGES = 6;
// line buffs: [kind, total across the ring, share of the lines]. One line deep in each ring is a shop stock slot instead
const OUTER_BUFFS = [['quark', 60, 0.1], ['event', 60, 0.09], ['storm', 60, 0.07], ['cdur', 30, 0.08], ['droprate', 50, 0.07], ['stock', 30, 0.08],
    ['price', 10, 0.07], ['dup', 15, 0.07], ['refund', 15, 0.07], ['heavy', 20, 0.06], ['alone', 30, 0.06], ['evlen', 20, 0.06], ['auto', 100, 0.06], ['secret', 5, 0.06]];
// each bridge unlocks a feature: [kind, cosmetic, what its outer slot asks for]
// the two joke bridges work in order: the first one lit gives the joke table, the second the joke catalysts
const BRIDGE_UNLOCKS = [['ion', 0, ['Co', 240]], ['hold', 0, ['Sb', 360]], ['upgrade', 0, ['Sc', 370]],
    ['slot', 0, ['Dy', 430]], ['joke', 0, ['Ho', 420]], ['jokecat', 0, ['Ac', 190]]];
// bridges in the order players reach their inner ends
const BRIDGE_ORDER = [3, 1, 5, 0, 2, 4];
// the rest of the cosmetics are out in the orbits: [orbit, cosmetic]
const OUTER_UNLOCKS = [[1, 'blueprint'], [1, 'holographic'], [2, 'notebook'], [2, 'retro'], [2, 'astral']];
// outer ring 2: six circles of 200 slots out past outer ring 1, each joined to it by one line that unlocks a mechanic.
// Laid out after everything else with its own seed, so no slot that already exists moves or changes
const RING2_SEED = 20261103;
const RING2_SLOTS = 200;
const RING2_STEP = 120;
const RING2_SPACING = 112;
const RING2_GAP = 650;
const RING2_UNLOCKS = ['leveller', 'electrolysis', 'hyper', 'synthesis', 'bonusroll', 'jokes3'];
// what each circle's first slot asks for
const RING2_GATES = [['Yb', 900], ['Lu', 700], ['Hf', 800], ['Re', 600], ['Os', 650], ['Ir', 550]];
const RING2_COL = ['#7cf2c8', '#ff9f5a', '#ffe14d', '#c58cff', '#7dff6a', '#8aa2ff'];
// line buffs inside the circles, as totals across all six
const RING2_BUFFS = [['ionup', 100, 0.1], ['droprate', 100, 0.08], ['droplux', 50, 0.06], ['stock', 40, 0.06], ['price', 10, 0.05], ['refresh', 2, 0.04],
    ['dup', 10, 0.05], ['refund', 10, 0.05], ['quark', 30, 0.06], ['event', 30, 0.06], ['evlen', 20, 0.05], ['storm', 30, 0.05], ['cdur', 15, 0.05],
    ['ionstep', 25, 0.05], ['jokeup', 50, 0.05], ['elxcut', 20, 0.05], ['synthkeep', 10, 0.04], ['agentkeep', 10, 0.05]];
// outer ring 2 slots take two Bonding Agents each
const RING2_AGENTS = 2;
const COSMETIC_NAMES = {
    oscilloscope: 'Oscilloscope scanner', holographic: 'Holographic scanner', blueprint: 'Blueprint page', notebook: 'Lab notebook page',
    retro: 'Retro spawn effects', astral: 'Astral spawn effects', warp: 'Warp scanner', gameover: 'Game Over page'
};
const FAMILY_ONE = {
    alkali: 'alkali metal', alkaline: 'alkaline earth metal', transition: 'transition metal', post: 'post-transition metal', metalloid: 'metalloid', nonmetal: 'nonmetal', halogen: 'halogen', noble: 'noble gas', lanth: 'lanthanide', actin: 'actinide', unknown: 'superheavy'
};
var NET = null;
var netState = {};
try {
    netState = JSON.parse(localStorage.getItem('elementalNetwork') || '{}');
} catch (e) { }
function saveNet() {
    try {
        localStorage.setItem('elementalNetwork', JSON.stringify(netState));
    } catch (e) { }
}
// Bonding Agents already put into outer ring 2 slots that need a second one
var netAgents = {};
try {
    netAgents = JSON.parse(localStorage.getItem('elementalBondAgents') || '{}');
} catch (e) { }
var levellerOn = false;
try {
    levellerOn = localStorage.getItem('elementalLeveller') === '1';
} catch (e) { }
function saveNetAgents() {
    try {
        localStorage.setItem('elementalBondAgents', JSON.stringify(netAgents));
    } catch (e) { }
}
const seededRnd = a => () => {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
// tree layout uses the old odds so existing saves don't move
const NET_ODDS = { Sg: 786972, Bh: 832146, Hs: 876280, Mt: 919468, Ds: 961794, Rg: 1003325, Cn: 1044123, Nh: 1084240, Fl: 1123723, Mc: 1162612, Lv: 1200945, Ts: 1238754, Og: 1312915 };
function genNetwork() {
    const now = {};
    ELEMENTS.forEach(e => {
        if (NET_ODDS[e[0]]) {
            now[e[0]] = e[2];
            e[2] = NET_ODDS[e[0]];
        }
    });
    const N = layNetwork();
    ELEMENTS.forEach(e => {
        if (now[e[0]]) {
            e[2] = now[e[0]];
        }
    });
    Object.keys(shareMemo).forEach(k => delete shareMemo[k]);
    return N;
}
function layNetwork() {
    const rnd = seededRnd(NET_SEED);
    const nodes = [{ id: 0, x: 0, y: 0, ring: 0, ang: 0 }];
    const edges = [];
    const near = (x, y, gap) => nodes.some(n => Math.hypot(n.x - x, n.y - y) < gap);
    let frontier = [];
    for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3 - Math.PI / 2;
        const n = { id: nodes.length, x: Math.cos(a) * NET_STEP, y: Math.sin(a) * NET_STEP, ring: 1, ang: a, twist: (rnd() - 0.5) * 0.5 };
        nodes.push(n);
        edges.push({ a: 0, b: n.id });
        frontier.push(n);
    }
    for (let r = 2; r <= NET_RINGS; r++) {
        const next = [];
        frontier.forEach(p => {
            const roll = rnd();
            const kids = roll < 0.12 ? 0 : roll < 0.55 ? 1 : roll < 0.89 ? 2 : 3;
            for (let k = 0; k < kids; k++) {
                let placed = false;
                for (let tries = 0; tries < 7 && !placed; tries++) {
                    const spread = kids === 1 ? 0 : (k - (kids - 1) / 2) * (0.85 / r + 0.08);
                    const a = p.ang + p.twist / r * 3 + spread + (rnd() - 0.5) * (0.35 / r + 0.06) * (1 + tries);
                    const rad = r * NET_STEP + (rnd() - 0.5) * 40;
                    const x = Math.cos(a) * rad;
                    const y = Math.sin(a) * rad;
                    if (!near(x, y, NET_MIN_GAP)) {
                        const n = { id: nodes.length, x, y, ring: r, ang: a, twist: p.twist + (rnd() - 0.5) * 0.18 };
                        nodes.push(n);
                        edges.push({ a: p.id, b: n.id });
                        next.push(n);
                        placed = true;
                    }
                }
            }
        });
        // keep the outer rings from thinning out: revive a dead frontier from the ring before
        if (next.length < 8 && frontier.length) {
            frontier.slice(0, 8 - next.length).forEach(p => p.twist += 0.2);
        }
        frontier = next.length ? next : frontier;
    }
    // loops: join some neighbours from different branches
    const has = new Set(edges.map(e => Math.min(e.a, e.b) + '-' + Math.max(e.a, e.b)));
    for (let i = 1; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const A = nodes[i];
            const B = nodes[j];
            if (Math.abs(A.ring - B.ring) > 1) {
                continue;
            }
            const d = Math.hypot(A.x - B.x, A.y - B.y);
            if (d < NET_MIN_GAP * 1.45 && !has.has(i + '-' + j) && rnd() < 0.22) {
                edges.push({ a: i, b: j, join: true });
                has.add(i + '-' + j);
            }
        }
    }
    // what each slot asks for, getting rarer and larger further out
    const els = [...ELEMENTS].sort((a, b) => a[2] - b[2]);
    const RK = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4 };
    const comps = [...ACHIEVEMENTS].filter(a => normalizeFormula(a.formula).match(/[A-Z]/g).length > 1).sort((a, b) => RK[a.rarity] - RK[b.rarity]);
    const fams = Object.keys(FAMILY_ONE);
    const famMin = f => Math.min(...ELEMENTS.filter(e => familyOf(e[0]) === f).map(e => e[2]));
    const pickEl = (R, r, lo, hi) => {
        const f = r / NET_RINGS;
        const top = Math.min(els.length - 2, Math.floor(els.length * Math.pow(f, 1.25) * hi + 4));
        const bot = Math.max(0, Math.floor(top * lo));
        return els[bot + Math.floor(R() * Math.max(1, top - bot))][0];
    };
    const reqFor = (r, R) => {
        const rr = r * 18 / NET_RINGS;
        if (r === 0) {
            return { t: 'el', k: 'O', n: 1 };
        }
        const roll = R();
        if (r <= 1 || roll < 0.34) {
            return { t: 'el', k: pickEl(R, r, 0.55, 1), n: 1 };
        } else if (roll < 0.6) {
            const k = pickEl(R, Math.max(1, r * 0.45), 0, 0.6);
            return { t: 'el', k, n: Math.max(2, Math.round(NET_QTY * 3 * Math.pow(NET_QTY_GROWTH, rr) / Math.pow(ELEMENTS.find(e => e[0] === k)[2], 0.55))) };
        } else if (roll < 0.74 && r >= 2) {
            const ok = fams.filter(f => famMin(f) <= Math.pow(10, 1 + rr * 0.33));
            const f = ok[Math.floor(R() * ok.length)];
            return { t: 'fam', k: f, n: Math.max(1, Math.round(NET_FAM_QTY * Math.pow(1.3, rr) / Math.pow(famMin(f), 0.3))) };
        } else if (roll < 0.9 && r >= 3) {
            const span = comps.length;
            const at = Math.min(span - 1, Math.floor(Math.pow((r - 2) / (NET_RINGS - 2), 1.1) * span * (0.6 + R() * 0.4)));
            const a = comps[at];
            return { t: 'cp', k: normalizeFormula(a.formula), l: a.formula, nm: a.name, n: 1 };
        }
        return { t: 'has', k: pickEl(R, r, 0.1, 0.55), n: 1 };
    };
    nodes.forEach(n => n.req = reqFor(n.ring, rnd));
    // what each line gives
    const outer = e => Math.max(nodes[e.a].ring, nodes[e.b].ring);
    const ringFirst = {};
    edges.forEach((e, i) => {
        const r = outer(e);
        e.ring = r;
        if (ringFirst[r] == null) {
            ringFirst[r] = i;
        }
    });
    const grind = n => {
        const q = n.req;
        return q.t === 'el' ? q.n * ELEMENTS.find(x => x[0] === q.k)[2] : q.t === 'fam' ? q.n * 60 : 0;
    };
    const used = new Set();
    const special = (r, kind, val) => {
        let best = -1;
        let bc = -1;
        edges.forEach((e, i) => {
            if (e.ring !== r || used.has(i)) {
                return;
            }
            const c = grind(nodes[nodes[e.a].ring >= nodes[e.b].ring ? e.a : e.b]);
            if (c > bc) {
                bc = c;
                best = i;
            }
        });
        if (best >= 0) {
            used.add(best);
            edges[best].kind = kind;
            edges[best].val = val;
        }
    };
    for (let r = 3; r <= NET_RINGS; r += 3) {
        special(r, 'mult', NET_MULTS[r / 3 - 1]);
    }
    NET_EXTRA_RINGS.forEach(r => special(r, 'extra', 1));
    NET_CHAIN_RINGS.forEach(r => special(r, 'chain', 1));
    NET_SLOT_RINGS.forEach(r => special(r, 'slot', 1));
    edges.forEach((e, i) => {
        if (used.has(i)) {
            return;
        }
        const x = rnd();
        e.kind = x < 0.45 ? 'luck' : x < 0.7 ? 'auto' : x < 0.8 ? 'price' : x < 0.88 ? 'refresh' : 'stock';
    });
    ['luck', 'auto', 'price', 'refresh', 'stock'].forEach(kind => {
        const list = edges.filter(e => e.kind === kind);
        const wsum = list.reduce((s, e) => s + Math.pow(e.ring, NET_WEIGHT[kind]), 0);
        const dp = kind === 'auto' ? 10 : 100;
        list.forEach(e => e.val = Math.max(1 / dp, Math.round(NET_TOTALS[kind] * Math.pow(e.ring, NET_WEIGHT[kind]) / wsum * dp) / dp));
    });
    const base = nodes.length;
    genOuter(nodes, edges, reqFor);
    // the easy bridge: cheapest rim slot to the nearest outer slot, which only asks for oxygen
    const from = nodes.slice(0, base).filter(n => n.ring === NET_RINGS && n.req.t === 'el').reduce((b, n) => grind(n) < grind(b) ? n : b);
    const to = nodes.slice(base).filter(n => n.orbit === 0).reduce((b, n) => Math.hypot(n.x - from.x, n.y - from.y) < Math.hypot(b.x - from.x, b.y - from.y) ? n : b);
    to.req = { t: 'el', k: 'O', n: 1000 };
    edges.push({ a: from.id, b: to.id, ring: NET_RINGS + 2, orbit: 0, kind: 'drop', val: 0.2 });
    const outerEnd = nodes.length;
    genRing2(nodes, edges, reqFor);
    const adj = nodes.map(() => []);
    edges.forEach((e, i) => {
        adj[e.a].push(i);
        adj[e.b].push(i);
    });
    return { nodes, edges, adj, base, outerEnd };
}
// a joke element's share of a roll, next to the real elements, for slots that ask for one
function jokeShare(sym, luck, share) {
    const j = elementBySymbol[sym];
    if (!j) {
        return 0;
    }
    const tot = ELEMENTS.reduce((s, e) => s + Math.pow(1 + 1.5 * (Math.log10(e[2] + 1) / 3), (luck / 100) / 1.5) / e[2], 0);
    return share[sym] = Math.pow(1 + 1.5 * (Math.log10(j[2] + 1) / 3), (luck / 100) / 1.5) / j[2] / tot;
}
// expected rolls to get a slot's full amount at a given luck and chain chance
const shareMemo = {};
function rollsFor(q, luck, denom) {
    let share = shareMemo[luck];
    if (!share) {
        share = shareMemo[luck] = {};
        let tot = 0;
        ELEMENTS.forEach(e => {
            share[e[0]] = Math.pow(1 + 1.5 * (Math.log10(e[2] + 1) / 3), (luck / 100) / 1.5) / e[2];
            tot += share[e[0]];
        });
        Object.keys(share).forEach(k => share[k] /= tot);
    }
    const go = 1 / denom;
    const sh = k => share[k] != null ? share[k] : jokeShare(k, luck, share);
    let p;
    if (q.t === 'ion') {
        // the first element of a roll, with an ion that size (ions only ever land on the first)
        const base = q.s > 0 ? ION_PLUS : ION_MINUS;
        p = sh(q.k) * base * Math.pow(base, Math.abs(q.s) - 1);
    } else if (q.t === 'el') {
        p = sh(q.k) * (1 - go);
    } else if (q.t === 'fam') {
        p = ELEMENTS.filter(e => familyOf(e[0]) === q.k).reduce((s, e) => s + share[e[0]], 0) * (1 - go);
    } else if (q.t === 'has') {
        p = share[q.k] * go * 2;
    } else {
        const counts = parseFormula(q.l);
        const m = Object.values(counts).reduce((a, c) => a + c, 0);
        const fact = k => k < 2 ? 1 : k * fact(k - 1);
        p = Math.pow(go, m - 1) * (1 - go) * fact(m);
        Object.keys(counts).forEach(k => p *= Math.pow(share[k], counts[k]) / fact(counts[k]));
    }
    return q.n / p;
}
function genOuter(nodes, edges, reqFor) {
    const R = seededRnd(OUTER_SEED);
    const base = nodes.length;
    const nearest = (list, n) => list.reduce((b, m) => Math.hypot(m.x - n.x, m.y - n.y) < Math.hypot(b.x - n.x, b.y - n.y) ? m : b, list[0]);
    const orbits = [];
    for (let o = 0; o < OUTER_ORBITS; o++) {
        const ring = NET_RINGS + 2 + o;
        const rad = OUTER_RADIUS + o * OUTER_STEP;
        const off = R() * Math.PI * 2;
        const list = [];
        for (let i = 0; i < OUTER_PER_ORBIT; i++) {
            const a = off + (i + (R() - 0.5) * 0.4) / OUTER_PER_ORBIT * Math.PI * 2;
            const r = rad + (R() - 0.5) * 36;
            const n = { id: nodes.length, x: Math.cos(a) * r, y: Math.sin(a) * r, ring, ang: a, orbit: o };
            nodes.push(n);
            list.push(n);
        }
        // close each orbit and link it to the one inside
        list.forEach((n, i) => edges.push({ a: n.id, b: list[(i + 1) % list.length].id, ring, orbit: o }));
        if (o) {
            list.forEach((n, i) => {
                if (R() < 0.3 || i % 40 === 0) {
                    edges.push({ a: nearest(orbits[o - 1], n).id, b: n.id, ring, orbit: o, join: true });
                }
            });
        }
        orbits.push(list);
    }
    // bridges
    const edge = nodes.slice(0, base).filter(n => n.ring >= NET_RINGS - 2);
    const bridges = [];
    for (let k = 0; k < OUTER_BRIDGES; k++) {
        const at = (k + 0.5) / OUTER_BRIDGES * Math.PI * 2;
        const near = edge.filter(n => Math.abs(Math.atan2(Math.sin(Math.atan2(n.y, n.x) - at), Math.cos(Math.atan2(n.y, n.x) - at))) < 0.35);
        const from = (near.length ? near : edge).reduce((b, n) => Math.hypot(n.x, n.y) > Math.hypot(b.x, b.y) ? n : b);
        const e = { a: from.id, b: nearest(orbits[0], from).id, ring: NET_RINGS + 2, orbit: 0, bridge: true };
        edges.push(e);
        bridges.push(e);
    }
    for (let i = base; i < nodes.length; i++) {
        nodes[i].req = reqFor(nodes[i].ring, R);
        // late luck makes some of these near impossible, so ask for the rarest element instead
        const q = nodes[i].req;
        if (q.t === 'cp' && rollsFor(q, 700, 3) > 3e5) {
            const els = ELEMENTS.filter(e => parseFormula(q.l)[e[0]]);
            nodes[i].req = { t: 'has', k: els.reduce((a, b) => b[2] > a[2] ? b : a)[0], n: 10 };
        }
    }
    const taken = new Set();
    BRIDGE_ORDER.forEach((k, i) => {
        const e = bridges[k];
        const [kind, cos, [sym, n]] = BRIDGE_UNLOCKS[i];
        e.kind = kind;
        e.val = cos || 1;
        nodes[e.b].req = { t: 'el', k: sym, n };
        taken.add(e);
    });
    const hard = n => rollsFor(n.req, 700, 3);
    // cosmetics go on the hardest line in their orbit
    const outerEdges = edges.filter(e => e.orbit != null);
    OUTER_UNLOCKS.forEach(([o, cos]) => {
        let best = null;
        let bc = -1;
        outerEdges.forEach(e => {
            if (e.orbit !== o || e.bridge || taken.has(e)) {
                return;
            }
            const c = Math.max(hard(nodes[e.a]), hard(nodes[e.b]));
            if (c > bc) {
                bc = c;
                best = e;
            }
        });
        taken.add(best);
        best.kind = 'cos';
        best.val = cos;
    });
    const free = outerEdges.filter(e => !taken.has(e));
    free.forEach(e => {
        let x = R();
        e.kind = OUTER_BUFFS.find(([, , p]) => (x -= p) < 0)[0];
    });
    ringBuffs(free.filter(e => e !== outerSlotLine(free, nodes, hard)), OUTER_BUFFS, e => Math.pow(e.orbit + 1, 1.5));
}
function genRing2(nodes, edges, reqFor) {
    const R = seededRnd(RING2_SEED);
    const rim = nodes.filter(n => n.orbit === OUTER_ORBITS - 1);
    // circle size: rings of slots round a centre slot until there are 200
    const counts = [1];
    for (let j = 1; counts.reduce((a, b) => a + b, 0) < RING2_SLOTS; j++) {
        counts.push(Math.round(2 * Math.PI * j * RING2_STEP / RING2_SPACING));
    }
    counts[counts.length - 1] -= counts.reduce((a, b) => a + b, 0) - RING2_SLOTS;
    const discR = (counts.length - 1) * RING2_STEP;
    const centreR = OUTER_RADIUS + (OUTER_ORBITS - 1) * OUTER_STEP + RING2_GAP + discR;
    for (let k = 0; k < RING2_UNLOCKS.length; k++) {
        const ca = k / RING2_UNLOCKS.length * Math.PI * 2;
        const cx = Math.cos(ca) * centreR;
        const cy = Math.sin(ca) * centreR;
        const rings = [];
        counts.forEach((c, j) => {
            const off = R() * Math.PI * 2;
            const list = [];
            for (let i = 0; i < c; i++) {
                const a = off + (i + (j ? (R() - 0.5) * 0.35 : 0)) / c * Math.PI * 2;
                const r = j * RING2_STEP + (j ? (R() - 0.5) * 28 : 0);
                const n = { id: nodes.length, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, orbit: OUTER_ORBITS, circle: k, ring: NET_RINGS + 6 };
                nodes.push(n);
                list.push(n);
            }
            rings.push(list);
        });
        const near = (list, n) => list.reduce((b, m) => Math.hypot(m.x - n.x, m.y - n.y) < Math.hypot(b.x - n.x, b.y - n.y) ? m : b, list[0]);
        const link = (a, b) => edges.push({ a: a.id, b: b.id, ring: NET_RINGS + 6, orbit: OUTER_ORBITS, circle: k });
        rings.forEach((list, j) => {
            if (!j) {
                return;
            }
            list.forEach((n, i) => {
                link(near(rings[j - 1], n), n);
                // round the ring: most neighbours touch, so there are loops to choose between
                if (list.length > 2 && R() < 0.6) {
                    link(n, list[(i + 1) % list.length]);
                }
            });
        });
        // the way in: the rim slot facing outer ring 1, and the line that unlocks this circle's mechanic
        const entry = rings[rings.length - 1].reduce((b, n) => Math.hypot(n.x, n.y) < Math.hypot(b.x, b.y) ? n : b);
        const gate = near(rim, entry);
        edges.push({ a: gate.id, b: entry.id, ring: NET_RINGS + 6, orbit: OUTER_ORBITS, circle: k, kind: RING2_UNLOCKS[k], val: 1, gate: true });
        // slots get harder the further they are from the way in
        const all = rings.flat();
        const depth = new Map([[entry, 0]]);
        const queue = [entry];
        const adj = new Map(all.map(n => [n, []]));
        edges.forEach(e => {
            if (e.circle === k && !e.gate) {
                adj.get(nodes[e.a]).push(nodes[e.b]);
                adj.get(nodes[e.b]).push(nodes[e.a]);
            }
        });
        while (queue.length) {
            const n = queue.shift();
            adj.get(n).forEach(m => {
                if (!depth.has(m)) {
                    depth.set(m, depth.get(n) + 1);
                    queue.push(m);
                }
            });
        }
        const deepest = Math.max(...depth.values());
        all.forEach(n => {
            const f = depth.get(n) / deepest;
            n.depth = depth.get(n);
            // a little past outer ring 1 (rings 26-28) at the way in, up to ring 30 at the far side
            n.ring = NET_RINGS + 3 + Math.round(f * 3);
            const roll = R();
            if (f > 0.8 && roll < 0.12) {
                // the hardest: one of the commoner joke elements
                n.req = { t: 'el', k: JOKES[Math.floor(R() * 3)][0], n: 1 };
            } else if (f > 0.15 && roll < 0.2) {
                // an ion: +1 to +2 of something common, and further in a -1
                const els = ELEMENTS.filter(e => e[2] < 40 + f * 400);
                const sym = els[Math.floor(R() * els.length)][0];
                n.req = { t: 'ion', k: sym, n: 1, s: f > 0.6 && R() < 0.35 ? -1 : f > 0.4 ? 2 : 1 };
            } else {
                n.req = reqFor(n.ring, R);
                const q = n.req;
                if (q.t === 'cp' && rollsFor(q, 700, 3) > 4e5) {
                    const els = ELEMENTS.filter(e => parseFormula(q.l)[e[0]]);
                    n.req = { t: 'has', k: els.reduce((a, b) => b[2] > a[2] ? b : a)[0], n: 12 };
                }
            }
        });
        entry.req = { t: 'el', k: RING2_GATES[k][0], n: RING2_GATES[k][1] };
    }
    // line buffs inside the circles
    const inside = edges.filter(e => e.circle != null && !e.gate);
    inside.forEach(e => {
        let x = R();
        e.kind = RING2_BUFFS.find(([, , p]) => (x -= p) < 0)[0];
    });
    const w = e => 1 + Math.max(nodes[e.a].depth, nodes[e.b].depth);
    ringBuffs(inside.filter(e => e !== outerSlotLine(inside, nodes, n => n.depth)), RING2_BUFFS, w);
}
// the line furthest in becomes a shop stock slot
function outerSlotLine(list, nodes, hard) {
    let best = null;
    let bc = -1;
    list.forEach(e => {
        const c = Math.max(hard(nodes[e.a]), hard(nodes[e.b]));
        if (c > bc) {
            bc = c;
            best = e;
        }
    });
    if (best) {
        best.kind = 'slot';
        best.val = 1;
    }
    return best;
}
// shares each buff's total out over its lines, more for the harder ones
function ringBuffs(list, buffs, weight) {
    buffs.forEach(([kind, total]) => {
        const mine = list.filter(e => e.kind === kind);
        const wsum = mine.reduce((s, e) => s + weight(e), 0);
        mine.forEach(e => e.val = Math.max(0.01, Math.round(total * weight(e) / wsum * 100) / 100));
    });
}
function net() {
    return NET || (NET = genNetwork());
}
const netFilled = id => !!netState[id];
// outer ring 1 stays off the map until one of its slots can be reached, and each outer ring 2 circle until one of its own can
let outerMemo = null;
function outerShown() {
    if (!outerMemo || outerMemo.v !== netVer) {
        const N = net();
        const open = list => list.some(n => netFilled(n.id) || netReachable(n.id));
        const ring1 = N.nodes.slice(N.base, N.outerEnd);
        outerMemo = { v: netVer, on: open(ring1), circles: RING2_UNLOCKS.map((u, k) => open(N.nodes.filter(n => n.circle === k))) };
    }
    return outerMemo.on;
}
// nodes: every slot, for looking one up by id. list: the slots on the map. edges: the lines on the map
let shownMemo = null;
function shownNet() {
    const N = net();
    const on = outerShown();
    const key = on + ':' + outerMemo.circles.join();
    if (!shownMemo || shownMemo.key !== key) {
        const show = n => n.orbit == null || (n.circle == null ? on : outerMemo.circles[n.circle]);
        const list = N.nodes.filter(show);
        shownMemo = { key, nodes: N.nodes, list, edges: N.edges.filter(e => show(N.nodes[e.a]) && show(N.nodes[e.b])), adj: N.adj };
    }
    return shownMemo;
}
const slotCol = n => n.circle != null ? RING2_COL[n.circle] : NET_RING_COL[Math.min(NET_RING_COL.length - 1, n.ring)];
const lineCol = e => e.circle != null ? RING2_COL[e.circle] : NET_RING_COL[Math.min(NET_RING_COL.length - 1, e.ring)];
const NET_BIG = new Set(['mult', 'slot', 'chain', 'ion', 'joke', 'hold', 'jokecat', 'cos', 'drop', 'upgrade', ...RING2_UNLOCKS]);
const isJokeLine = e => e.kind === 'joke' || e.kind === 'jokecat';
// which of the two the line gives: the joke table if it was lit first (or no other is lit yet), the joke catalysts if second
function jokeLineGives(e) {
    const lit = net().edges.filter(x => isJokeLine(x) && edgeLit(x));
    return (edgeLit(e) ? lit.indexOf(e) : lit.length) === 0 ? 'table' : 'cats';
}
const edgeLit = e => netFilled(e.a) && netFilled(e.b);
function edgeDesc(e) {
    const v = e.val;
    if (e.orbit != null && NET_BIG.has(e.kind) && !edgeLit(e)) {
        return '???';
    }
    const outer = {
        quark: `+${v}% quarks`, event: `+${v}% event chance`, cdur: `+${v}% catalyst time`, dup: `+${v}% duplicate catalysts`,
        refund: `+${v}% catalyst refunds`, storm: `+${v}% Quark Storm size`, hold: 'Shop hold', drop: 'Catalyst drops (1 in 500 presses of Roll)',
        ion: 'Unlocks ionisation', upgrade: 'Unlocks catalyst upgrades', cos: 'Unlocks ' + COSMETIC_NAMES[v],
        ionup: `+${v}% ion chance`, droprate: `+${v}% catalyst drops`, heavy: `+${v}% quarks for each chained element`, alone: `+${v}% quarks on unchained rolls`,
        evlen: `+${v}% event length`, secret: `+${v}% secret effect chance`, droplux: `+${v}% rarer catalyst drops`, ionstep: `Ions climb a charge ${v}% more often`,
        jokeup: `+${v}% joke element chance`, elxcut: `−${v}% Electrolysis costs`, synthkeep: `${v}% chance a synthesis keeps one element`,
        agentkeep: `${v}% chance a Bonding Agent isn't used up`, leveller: 'Unlocks the Leveller toggle', electrolysis: 'Unlocks Electrolysis',
        synthesis: 'Unlocks Catalyst Synthesis', hyper: 'Unlocks the Hypercharged event', bonusroll: '+1 bonus roll, past the usual 3', jokes3: 'Unlocks 3 new joke elements'
    };
    if (isJokeLine(e)) {
        return jokeLineGives(e) === 'table' ? 'Unlocks the joke table' : 'Joke catalysts in the shop';
    }
    return outer[e.kind] || (e.kind === 'luck' ? `+${v}% luck` : e.kind === 'mult' ? `×${v} luck` : e.kind === 'auto' ? `+${v}% autoroll speed` : e.kind === 'chain' ? 'Chain chance +1 step' : e.kind === 'extra' ? '+1 bonus roll' : e.kind === 'price' ? `−${v}% shop prices` : e.kind === 'refresh' ? `−${v} min shop restock` : e.kind === 'stock' ? `+${v}% rarer shop stock` : '+1 shop stock slot');
}
function reqShort(q) {
    if (q.t === 'ion') {
        return withIon(q.k, q.s);
    }
    if (q.t === 'el') {
        return (q.n > 1 ? q.n + ' ' : '') + q.k;
    }
    if (q.t === 'cp') {
        return q.l;
    }
    if (q.t === 'fam') {
        return (q.n > 1 ? q.n + '× ' : '') + FAMILY_ONE[q.k].split(' ')[0];
    }
    return q.k + '–?';
}
// collection records that can pay for a slot, most plentiful first
// finds grouped by what bond slots ask for, kept up as finds come in (compounds only when asked)
let payIdx = { ref: null };
function payIndex(cp) {
    const by = (m, k, c) => (m.get(k) || m.set(k, []).get(k)).push(c);
    const norm = c => c.norm || (c.norm = normalizeFormula(c.formula));
    if (payIdx.ref !== collection || payIdx.n > collection.length) {
        payIdx = { ref: collection, n: 0, fam: new Map(), has: new Map(), cp: null };
    }
    for (let i = payIdx.n; i < collection.length; i++) {
        const c = collection[i];
        if (!c.elements) {
            continue;
        }
        if (c.elements.length === 1) {
            by(payIdx.fam, familyOf(c.elements[0][0]), c);
        } else {
            new Set(c.elements.map(e => e[0])).forEach(sym => by(payIdx.has, sym, c));
        }
        if (payIdx.cp) {
            by(payIdx.cp, norm(c), c);
        }
    }
    payIdx.n = collection.length;
    if (cp && !payIdx.cp) {
        payIdx.cp = new Map();
        collection.forEach(c => c.elements && by(payIdx.cp, norm(c), c));
    }
    return payIdx;
}
// ion slots only ask that you've rolled that ion at some point: nothing is used up
const ionHad = q => {
    const m = ionMarks[q.k] || [0, 0];
    return q.s > 0 ? m[0] >= q.s : m[1] >= -q.s;
};
function eligible(q) {
    const avail = c => (c.count || 1) - (c.spent || 0);
    let list;
    if (q.t === 'ion') {
        return [];
    }
    if (q.t === 'el') {
        const c = findFormula(q.k);
        list = c ? [c] : [];
    } else {
        const ix = payIndex(q.t === 'cp');
        list = (q.t === 'cp' ? ix.cp : q.t === 'fam' ? ix.fam : ix.has).get(q.k) || [];
    }
    // plus anything made by Electrolysis
    list = list.concat(madeFor(q));
    return list.map(c => ({ c, n: avail(c) })).filter(x => x.n > 0).sort((a, b) => b.n - a.n);
}
var netVer = 0;
const payMemo = new Map();
function canPay(q) {
    const m = payMemo.get(q);
    if (m && m.v === netVer) {
        return m.ok;
    }
    const ok = q.t === 'ion' ? ionHad(q) : eligible(q).reduce((s, x) => s + x.n, 0) >= q.n;
    payMemo.set(q, { v: netVer, ok });
    return ok;
}
function payPlan(q) {
    if (q.t === 'ion') {
        return ionHad(q) ? [] : null;
    }
    let need = q.n;
    const plan = [];
    eligible(q).forEach(x => {
        if (need <= 0) {
            return;
        }
        const take = Math.min(need, x.n);
        plan.push({ c: x.c, take });
        need -= take;
    });
    return need > 0 ? null : plan;
}
const netReachable = id => id === 0 || net().adj[id].some(i => {
    const e = net().edges[i];
    return netFilled(e.a === id ? e.b : e.a);
});
const netFillable = id => !netFilled(id) && netReachable(id) && canPay(net().nodes[id].req);
// every slot you could fill right now, worked out once per change
let fillMemo = null;
function fillableIds() {
    if (fillMemo && fillMemo.v === netVer) {
        return fillMemo.ids;
    }
    const ids = net().nodes.filter(n => netFillable(n.id)).map(n => n.id);
    fillMemo = { v: netVer, ids };
    return ids;
}
function fillSlot(id) {
    const n = net().nodes[id];
    if (!netFillable(id)) {
        return false;
    }
    const plan = payPlan(n.req);
    plan.forEach(p => p.c.spent = (p.c.spent || 0) + p.take);
    save();
    fillFree(id);
    return true;
}
function fillFree(id) {
    netState[id] = 1;
    saveNet();
    netVer++;
    buffCache = weightCache = null;
    setTimeout(jokeIntroCheck, 600);
    applyCosmetics();
}
const agentReady = n => catInv.bondagent > 0 && !netFilled(n.id) && netReachable(n.id) && !canPay(n.req);
// agents a slot still needs: outer ring 2 slots take two
const agentsLeft = n => (n.circle != null ? RING2_AGENTS : 1) - (netAgents[n.id] || 0);
function useAgent(n) {
    // outer ring 2 can let one go further
    if (Math.random() >= bondBonus().agentkeep / 100) {
        srcSpend('bondagent', 1);
        catInv.bondagent--;
        if (!catInv.bondagent) {
            delete catInv.bondagent;
        }
        saveCats();
    }
    if (agentsLeft(n) > 1) {
        netAgents[n.id] = (netAgents[n.id] || 0) + 1;
        saveNetAgents();
        netVer++;
        return false;
    }
    delete netAgents[n.id];
    saveNetAgents();
    fillFree(n.id);
    return true;
}
// joke element bonuses, no luck or speed ones
const JOKE_BONUS = {
    Um: ['event', 25], Zz: ['quark', 6], Mu: ['quark', 15], Ln: ['refund', 10], Df: ['cdur', 15], Cz: ['storm', 25], Mb: ['dup', 5], Dj: ['evlen', 25],
    Ha: ['price', 5], Ad: ['refresh', 2], Pi: ['quark', 3.14], Nu: ['alone', 50], Xx: ['secret', 5], Uo: ['jokerate', 100], Zo: ['cos', 'warp'], Gg: ['cos', 'gameover'],
    Oo: ['droprate', 25], Bf: ['cdur', 10], Fz: ['secret', 10]
};
const jokeBonusText = sym => {
    const [k, v] = JOKE_BONUS[sym];
    return {
        event: `Events are ${v}% more likely`, quark: `+${v}% quarks per roll`, refund: `${v}% chance a single-roll catalyst isn't used up`,
        cdur: `Catalysts last ${v}% longer`, storm: `Quark Storms pay ${v}% more`, dup: `${v}% chance a bought catalyst arrives as two`, evlen: `Events last ${v}% longer`,
        price: `Shop prices ${v}% lower`, refresh: `The shop restocks ${v} minutes sooner`, alone: `Rolls with no chain earn ${v}% more quarks`, droprate: `+${v}% catalyst drops`, secret: `Secret effects are ${v}% more likely`,
        jokerate: 'Joke catalysts appear twice as often in the shop', cos: v === 'warp' ? 'Unlocks the Warp scanner' : 'Unlocks the Game Over page and the Final Element badge'
    }[k];
};
// netBonus is lines only, bondBonus adds the jokes
let netCache = null;
function netBonus() {
    if (netCache && netCache.v === netVer) {
        return netCache.r;
    }
    const r = {
        add: 0, mult: 1, auto: 0, price: 0, refresh: 0, stock: 0, slots: 0, chain: 0, extra: 0,
        quark: 0, event: 0, cdur: 0, dup: 0, refund: 0, storm: 0, hold: false, ion: false, joke: false, jokecat: false, upgrade: false, cos: [],
        evlen: 0, alone: 0, secret: 0, jokerate: 0, drop: 0, ionup: 0, droprate: 0, heavy: 0, droplux: 0, ionstep: 0, jokeup: 0, elxcut: 0, synthkeep: 0, agentkeep: 0,
        leveller: false, electrolysis: false, synthesis: false, hyper: false, bonusroll: false, jokes3: false
    };
    let jokeLines = 0;
    net().edges.forEach(e => {
        if (!edgeLit(e)) {
            return;
        }
        if (isJokeLine(e)) {
            jokeLines++;
        } else if (e.kind === 'luck') {
            r.add += e.val;
        } else if (e.kind === 'mult') {
            r.mult *= e.val;
        } else if (e.kind === 'slot') {
            r.slots += 1;
        } else if (e.kind === 'cos') {
            r.cos.push(e.val);
        } else if (typeof r[e.kind] === 'boolean') {
            r[e.kind] = true;
        } else {
            r[e.kind] += e.val;
        }
    });
    r.joke = jokeLines >= 1;
    r.jokecat = jokeLines >= 2;
    // the oscilloscope comes with the first slot filled on outer ring 1
    if (net().nodes.some(n => n.orbit === 0 && netFilled(n.id))) {
        r.cos.push('oscilloscope');
    }
    netCache = { v: netVer, r };
    return r;
}
let bondCache = null;
function bondBonus() {
    const n = netBonus();
    const found = jokesFound();
    if (bondCache && bondCache.n === n && bondCache.j === found) {
        return bondCache.r;
    }
    const r = Object.assign({}, n, { cos: n.cos.slice() });
    found.forEach(s => {
        const [k, v] = JOKE_BONUS[s];
        if (k === 'cos') {
            r.cos.push(v);
        } else {
            r[k] += v;
        }
    });
    bondCache = { n, j: found, r };
    return r;
}
function bondSummary() {
    const N = shownNet().list.length;
    const f = Object.keys(netState).length;
    $('homeBonds').textContent = f + ' / ' + N + ' slots';
}
// the network view
const netView = { x: 0, y: 0, z: 1, anim: null };
let netCanvas = null;
let netSel = null;
let netRaf = 0;
function netResize() {
    const cv = netCanvas;
    if (!cv) {
        return;
    }
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(r.width * dpr);
    cv.height = Math.round(r.height * dpr);
    netDraw();
}
function netToScreen(x, y) {
    const r = netCanvas.getBoundingClientRect();
    return [(x - netView.x) * netView.z + r.width / 2, (y - netView.y) * netView.z + r.height / 2];
}
function netToWorld(sx, sy) {
    const r = netCanvas.getBoundingClientRect();
    return [(sx - r.width / 2) / netView.z + netView.x, (sy - r.height / 2) / netView.z + netView.y];
}
function netDrawSoon() {
    if (!netRaf) {
        netRaf = requestAnimationFrame(() => {
            netRaf = 0;
            netDraw();
        });
    }
}
function netDraw() {
    const cv = netCanvas;
    if (!cv || !$('bonds').classList.contains('active')) {
        return;
    }
    const g = cv.getContext('2d');
    const dpr = cv.width / Math.max(1, cv.getBoundingClientRect().width);
    const W = cv.width / dpr;
    const H = cv.height / dpr;
    const { nodes, list, edges } = shownNet();
    const z = netView.z;
    const t = performance.now();
    const head = netDraw.font || (netDraw.font = getComputedStyle(document.body).getPropertyValue('--head'));
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    // blueprint grid
    const step = 64 * z;
    if (step > 10) {
        g.strokeStyle = 'rgba(232,239,233,.05)';
        g.lineWidth = 1;
        const ox = ((-netView.x * z + W / 2) % step + step) % step;
        const oy = ((-netView.y * z + H / 2) % step + step) % step;
        g.beginPath();
        for (let x = ox; x < W; x += step) {
            g.moveTo(x, 0);
            g.lineTo(x, H);
        }
        for (let y = oy; y < H; y += step) {
            g.moveTo(0, y);
            g.lineTo(W, y);
        }
        g.stroke();
    }
    const S = (x, y) => [(x - netView.x) * z + W / 2, (y - netView.y) * z + H / 2];
    const pad = 60;
    const vis = (x, y) => x > -pad && x < W + pad && y > -pad && y < H + pad;
    const far = z < 0.45;
    if (z < 0.24) {
        const pic = netFarPicture();
        const k = z / pic.s;
        g.imageSmoothingEnabled = true;
        g.drawImage(pic.cv, (pic.x0 - netView.x) * z + W / 2, (pic.y0 - netView.y) * z + H / 2, pic.cv.width / pic.r * k, pic.cv.height / pic.r * k);
        const pulse = 0.5 + 0.5 * Math.sin(t / 260);
        g.globalAlpha = 0.4 + 0.6 * pulse;
        g.strokeStyle = '#f0c419';
        g.lineWidth = 2;
        let any = false;
        fillableIds().forEach(id => {
            const [x, y] = S(nodes[id].x, nodes[id].y);
            g.beginPath();
            g.arc(x, y, 6, 0, Math.PI * 2);
            g.stroke();
            any = true;
        });
        g.globalAlpha = 1;
        $('netJump').hidden = true;
        if (drawBeam(g, S, z)) {
            any = true;
        }
        if (any) {
            netDrawSoon();
        }
        return;
    }
    // lines: unlit ones batched into two paths, lit ones drawn with a glow
    const dashed = new Path2D();
    const solid = new Path2D();
    const lit = [];
    const labels = [];
    edges.forEach(e => {
        const A = nodes[e.a];
        const B = nodes[e.b];
        const [ax, ay] = S(A.x, A.y);
        const [bx, by] = S(B.x, B.y);
        if (Math.max(ax, bx) < -pad || Math.min(ax, bx) > W + pad || Math.max(ay, by) < -pad || Math.min(ay, by) > H + pad) {
            return;
        }
        const on = edgeLit(e);
        if (on) {
            lit.push([ax, ay, bx, by, lineCol(e)]);
        } else {
            const p = NET_BIG.has(e.kind) || far ? solid : dashed;
            p.moveTo(ax, ay);
            p.lineTo(bx, by);
        }
        if (z > 0.8) {
            const relevant = on || netFilled(e.a) || netFilled(e.b) || NET_BIG.has(e.kind);
            const mx = (ax + bx) / 2;
            const my = (ay + by) / 2;
            if ((relevant || z > 1.6) && vis(mx, my)) {
                labels.push([mx, my, e, on]);
            }
        }
    });
    g.lineCap = 'round';
    g.strokeStyle = 'rgba(232,239,233,.22)';
    g.lineWidth = Math.max(1, 1.5 * z);
    g.stroke(solid);
    if (!far) {
        g.setLineDash([6 * z, 5 * z]);
        g.stroke(dashed);
        g.setLineDash([]);
    }
    lit.forEach(([ax, ay, bx, by, col]) => {
        g.strokeStyle = col;
        g.globalAlpha = 0.35;
        g.lineWidth = Math.max(3, 10 * z);
        g.beginPath();
        g.moveTo(ax, ay);
        g.lineTo(bx, by);
        g.stroke();
        g.globalAlpha = 1;
        g.lineWidth = Math.max(1.5, 3.2 * z);
        g.stroke();
    });
    if (labels.length) {
        const k = Math.min(1.4, z);
        g.font = '600 ' + Math.round(10.5 * k) + 'px ' + head;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        labels.forEach(([mx, my, e, on]) => {
            const txt = edgeDesc(e);
            const w = g.measureText(txt).width + 10;
            g.fillStyle = 'rgba(10,16,14,.85)';
            g.fillRect(mx - w / 2, my - 9 * k, w, 18 * k);
            g.fillStyle = on ? lineCol(e) : NET_BIG.has(e.kind) ? '#f0c419' : 'rgba(232,239,233,.55)';
            g.fillText(txt, mx, my + 0.5);
        });
    }
    // slots
    const R = 24 * z;
    const pulse = 0.5 + 0.5 * Math.sin(t / 260);
    let anyAvail = false;
    if (far) {
        // zoomed out: plain dots, batched by colour
        const groups = new Map();
        const ring = new Path2D();
        const red = new Path2D();
        const rr = Math.max(2, R);
        list.forEach(n => {
            const [x, y] = S(n.x, n.y);
            if (!vis(x, y)) {
                return;
            }
            const filled = netFilled(n.id);
            const avail = !filled && netReachable(n.id) && canPay(n.req);
            anyAvail = anyAvail || avail;
            const key = filled ? slotCol(n) : 'rgba(232,239,233,.35)';
            if (!groups.has(key)) {
                groups.set(key, new Path2D());
            }
            const p = groups.get(key);
            p.moveTo(x + rr, y);
            p.arc(x, y, rr, 0, Math.PI * 2);
            if (avail || agentReady(n)) {
                const p2 = avail ? ring : red;
                p2.moveTo(x + rr + 4, y);
                p2.arc(x, y, rr + 4, 0, Math.PI * 2);
                if (!avail && agentsLeft(n) > 1) {
                    p2.moveTo(x + rr + 8, y);
                    p2.arc(x, y, rr + 8, 0, Math.PI * 2);
                }
            }
        });
        groups.forEach((p, col) => {
            g.fillStyle = col;
            g.fill(p);
        });
        g.globalAlpha = 0.4 + 0.6 * pulse;
        g.strokeStyle = '#f0c419';
        g.lineWidth = 2;
        g.stroke(ring);
        g.strokeStyle = '#ff5a4a';
        g.stroke(red);
        g.globalAlpha = 1;
    } else {
        list.forEach(n => {
            const [x, y] = S(n.x, n.y);
            if (!vis(x, y)) {
                return;
            }
            const filled = netFilled(n.id);
            const reach = netReachable(n.id);
            const avail = !filled && reach && canPay(n.req);
            const pity = !avail && agentReady(n);
            const col = slotCol(n);
            anyAvail = anyAvail || avail || pity;
            g.globalAlpha = filled || reach ? 1 : 0.35;
            const hex = n.req.t === 'cp' || n.req.t === 'has';
            slotPath(g, x, y, R, hex);
            g.fillStyle = filled ? col : '#0d1311';
            g.fill();
            g.lineWidth = Math.max(1.2, (filled ? 2.5 : 1.6) * z);
            g.strokeStyle = filled ? col : avail ? '#f0c419' : pity ? '#ff5a4a' : 'rgba(232,239,233,.4)';
            g.stroke();
            if (avail || pity) {
                g.globalAlpha = 0.3 + 0.5 * pulse;
                slotPath(g, x, y, R + (5 + 5 * pulse) * z, hex);
                g.strokeStyle = avail ? '#f0c419' : '#ff5a4a';
                g.lineWidth = Math.max(1, 2 * z);
                g.stroke();
                // a second red ring while the slot still needs two agents
                if (!avail && agentsLeft(n) > 1) {
                    slotPath(g, x, y, R + (13 + 5 * pulse) * z, hex);
                    g.stroke();
                }
            }
            if (netSel === n.id) {
                g.globalAlpha = 1;
                slotPath(g, x, y, R + 4 * z, hex);
                g.strokeStyle = '#fff';
                g.lineWidth = 2;
                g.stroke();
            }
            g.globalAlpha = filled || reach ? 1 : 0.45;
            if (z > 0.38) {
                const label = filled && n.req.t === 'el' && n.req.n === 1 ? n.req.k : reqShort(n.req);
                let fs = 13 * z;
                g.font = '700 ' + fs + 'px ' + head;
                const w = g.measureText(label).width;
                if (w > R * 1.75) {
                    fs *= R * 1.75 / w;
                    g.font = '700 ' + fs + 'px ' + head;
                }
                g.fillStyle = filled ? '#0d1311' : '#e8efe9';
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.fillText(label, x, y + 1);
            }
            g.globalAlpha = 1;
        });
    }
    // arrows at the edge pointing to fillable slots off screen
    const off = [];
    fillableIds().forEach(id => {
        const [x, y] = S(nodes[id].x, nodes[id].y);
        if (x < 0 || x > W || y < 0 || y > H) {
            off.push([x, y, Math.hypot(x - W / 2, y - H / 2)]);
        }
    });
    off.sort((a, b) => a[2] - b[2]);
    off.slice(0, 8).forEach(([x, y]) => {
        const a = Math.atan2(y - H / 2, x - W / 2);
        const m = 26;
        const kx = (W / 2 - m) / Math.abs(Math.cos(a) || 1e-6);
        const ky = (H / 2 - m) / Math.abs(Math.sin(a) || 1e-6);
        const d = Math.min(kx, ky);
        g.save();
        g.translate(W / 2 + Math.cos(a) * d, H / 2 + Math.sin(a) * d);
        g.rotate(a);
        g.globalAlpha = 0.55 + 0.45 * pulse;
        g.fillStyle = '#f0c419';
        g.beginPath();
        g.moveTo(12, 0);
        g.lineTo(-8, -9);
        g.lineTo(-3, 0);
        g.lineTo(-8, 9);
        g.closePath();
        g.fill();
        g.restore();
    });
    const jb = $('netJump');
    if (jb) {
        jb.hidden = !(off.length && !anyAvail);
    }
    const beaming = drawBeam(g, S, z);
    // keep animating only while something on screen pulses
    if (anyAvail || off.length || beaming) {
        netDrawSoon();
    }
}
let netFarPic = null;
function netFarPicture() {
    const key = netVer + ':' + Object.keys(netState).length + ':' + shownNet().key + ':' + !!catInv.bondagent;
    if (netFarPic && netFarPic.key === key) {
        return netFarPic;
    }
    const { nodes, list, edges } = shownNet();
    const s = 0.24;
    const r = Math.min(2, devicePixelRatio || 1);
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    list.forEach(n => {
        x0 = Math.min(x0, n.x);
        y0 = Math.min(y0, n.y);
        x1 = Math.max(x1, n.x);
        y1 = Math.max(y1, n.y);
    });
    x0 -= 60;
    y0 -= 60;
    x1 += 60;
    y1 += 60;
    const cv = document.createElement('canvas');
    cv.width = Math.ceil((x1 - x0) * s * r);
    cv.height = Math.ceil((y1 - y0) * s * r);
    const g = cv.getContext('2d');
    g.scale(r, r);
    const P = (x, y) => [(x - x0) * s, (y - y0) * s];
    const dim = new Path2D();
    edges.forEach(e => {
        if (edgeLit(e)) {
            return;
        }
        const [ax, ay] = P(nodes[e.a].x, nodes[e.a].y);
        const [bx, by] = P(nodes[e.b].x, nodes[e.b].y);
        dim.moveTo(ax, ay);
        dim.lineTo(bx, by);
    });
    g.strokeStyle = 'rgba(232,239,233,.22)';
    g.lineWidth = 1;
    g.stroke(dim);
    g.lineCap = 'round';
    edges.forEach(e => {
        if (!edgeLit(e)) {
            return;
        }
        const [ax, ay] = P(nodes[e.a].x, nodes[e.a].y);
        const [bx, by] = P(nodes[e.b].x, nodes[e.b].y);
        g.strokeStyle = lineCol(e);
        g.lineWidth = 2.5;
        g.beginPath();
        g.moveTo(ax, ay);
        g.lineTo(bx, by);
        g.stroke();
    });
    const groups = new Map();
    list.forEach(n => {
        const key2 = netFilled(n.id) ? slotCol(n) : 'rgba(232,239,233,.35)';
        if (!groups.has(key2)) {
            groups.set(key2, new Path2D());
        }
        const [x, y] = P(n.x, n.y);
        const p = groups.get(key2);
        p.moveTo(x + 3, y);
        p.arc(x, y, 3, 0, Math.PI * 2);
    });
    groups.forEach((p, col) => {
        g.fillStyle = col;
        g.fill(p);
    });
    return netFarPic = { key, cv, s, r, x0, y0 };
}
function slotPath(g, x, y, r, hex) {
    g.beginPath();
    if (!hex) {
        g.arc(x, y, r, 0, Math.PI * 2);
        return;
    }
    for (let i = 0; i < 6; i++) {
        const a = Math.PI / 6 + i * Math.PI / 3;
        const px = x + Math.cos(a) * r * 1.08;
        const py = y + Math.sin(a) * r * 1.08;
        if (i) {
            g.lineTo(px, py);
        } else {
            g.moveTo(px, py);
        }
    }
    g.closePath();
}
function netGlideTo(x, y, z) {
    const from = { x: netView.x, y: netView.y, z: netView.z };
    const to = { x, y, z: z || Math.max(0.9, netView.z) };
    const t0 = performance.now();
    const d = 800;
    netView.anim = true;
    (function f(now) {
        const k = Math.min(1, (now - t0) / d);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        // pull back a little mid-flight so long jumps read as travel
        const dip = Math.sin(Math.PI * k) * Math.min(0.45, Math.hypot(to.x - from.x, to.y - from.y) / 3000);
        netView.x = from.x + (to.x - from.x) * e;
        netView.y = from.y + (to.y - from.y) * e;
        netView.z = (from.z + (to.z - from.z) * e) * (1 - dip);
        netDraw();
        if (k < 1) {
            requestAnimationFrame(f);
        } else {
            netView.anim = null;
            netDraw();
        }
    })(t0);
}
function netJump() {
    const { nodes } = net();
    let best = null;
    fillableIds().map(id => nodes[id]).forEach(n => {
        const d = Math.hypot(n.x - netView.x, n.y - netView.y);
        if (!best || d < best.d) {
            best = { n, d };
        }
    });
    if (best) {
        netGlideTo(best.n.x, best.n.y, 1.1);
    }
}
// network buffs: the headline numbers up top, everything else in groups that open on a tap
const netOpen = new Set();
function netTotalsHtml() {
    const b = netBonus();
    const pc = (v, d = 1) => '+' + (+v.toFixed(d)) + '%';
    const tiles = [['Luck', pc(b.add, 2)], ['Luck ×', '×' + b.mult.toFixed(3)], ['Chain', '+' + b.chain + ' step' + (b.chain === 1 ? '' : 's')],
        ['Bonus rolls', '+' + (b.extra + (b.bonusroll ? 1 : 0))], ['Autoroll', pc(b.auto)], ['Shop slots', String(2 + b.slots)]];
    const drop = b.drop ? '1 in ' + Math.round(100 / (b.drop * (1 + b.droprate / 100))) + ' presses' : '';
    // [group, [[label, value or empty to skip]]]
    const groups = [
        ['Shop', [['Prices', b.price && '−' + (+b.price.toFixed(2)) + '%'], ['Restocks sooner', b.refresh && (+b.refresh.toFixed(2)) + ' min'], ['Rarer stock', b.stock && pc(b.stock, 2)],
            ['Duplicate catalysts', b.dup && pc(b.dup, 2)], ['Single-roll catalysts kept', b.refund && pc(b.refund, 2)]]],
        ['Quarks', [['Per roll', b.quark && pc(b.quark, 2)], ['Per chained element', b.heavy && pc(b.heavy, 2)], ['Unchained rolls', b.alone && pc(b.alone, 2)],
            ['Quark Storm size', b.storm && pc(b.storm, 2)]]],
        ['Events', [['Chance', b.event && pc(b.event, 2)], ['Length', b.evlen && pc(b.evlen, 2)], ['Secret effects', b.secret && pc(b.secret, 2)]]],
        ['Catalysts', [['Drops', drop], ['More drops', b.droprate && pc(b.droprate, 2)], ['Rarer drops', b.droplux && pc(b.droplux, 2)], ['Duration', b.cdur && pc(b.cdur, 2)]]],
        ['Ions', [['Chance', b.ionup && pc(b.ionup, 2)], ['Climb a charge', b.ionstep && pc(b.ionstep, 2)]]],
        ['Jokes', [['Joke element chance', b.jokeup && pc(b.jokeup, 2)]]],
        ['Crafting', [['Electrolysis costs', b.elxcut && '−' + (+b.elxcut.toFixed(2)) + '%'], ['Synthesis keeps an element', b.synthkeep && (+b.synthkeep.toFixed(2)) + '%'],
            ['Bonding Agent kept', b.agentkeep && (+b.agentkeep.toFixed(2)) + '%']]]
    ];
    let h = '<div class="nt-tiles">' + tiles.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('') + '</div>';
    groups.forEach(([name, rows]) => {
        rows = rows.filter(r => r[1]);
        if (!rows.length) {
            return;
        }
        h += `<details class="nt-group" data-g="${name}"${netOpen.has(name) ? ' open' : ''}><summary><span>${name}</span><em>${rows.slice(0, 2).map(r => r[1]).join(' · ')}</em></summary>` +
            '<dl>' + rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('') + '</dl></details>';
    });
    const unlocks = [['Shop hold', b.hold], ['Ionisation', b.ion], ['Catalyst upgrades', b.upgrade], ['Joke table', b.joke], ['Joke catalysts', b.jokecat], ['Leveller', b.leveller],
        ['Electrolysis', b.electrolysis], ['Synthesis', b.synthesis], ['Hypercharged', b.hyper], ['4th bonus roll', b.bonusroll], ['3 new jokes', b.jokes3]].filter(x => x[1]).map(x => x[0]);
    if (b.cos.length) {
        unlocks.push(b.cos.length + (b.cos.length === 1 ? ' cosmetic' : ' cosmetics'));
    }
    if (unlocks.length) {
        h += '<div class="nt-unlocks">' + unlocks.map(x => `<span>${x}</span>`).join('') + '</div>';
    }
    return h;
}
// tapping a slot fills it straight away when you can; otherwise the slot flashes red
function netSelect(id) {
    netSel = null;
    if (id == null) {
        netDraw();
        return;
    }
    if (fillSlot(id)) {
        uiSound('bond');
        netFlash(id);
        bondSummary();
        $('netTotals').innerHTML = netTotalsHtml();
        renderRollStats();
    } else if (agentReady(net().nodes[id])) {
        useAgent(net().nodes[id]);
        uiSound('bond');
        netFlash(id);
        bondSummary();
        $('netTotals').innerHTML = netTotalsHtml();
        renderRollStats();
    } else if (!netFilled(id)) {
        uiSound('deny');
        netFlash(id, '#ff5a4a');
        if (!netReachable(id)) {
            netBeamTo(id);
        }
    }
    netDraw();
}
// the yellow beam that shows the shortest way to a slot you can't reach yet
let netBeam = null;
function netBeamTo(id) {
    const { nodes, edges, adj } = net();
    const from = new Map();
    let queue = Object.keys(netState).map(Number);
    if (!queue.length) {
        queue = [0];
    }
    queue.forEach(i => from.set(i, -1));
    for (let i = 0; i < queue.length && !from.has(id); i++) {
        adj[queue[i]].forEach(ei => {
            const j = edges[ei].a === queue[i] ? edges[ei].b : edges[ei].a;
            if (!from.has(j)) {
                from.set(j, queue[i]);
                queue.push(j);
            }
        });
    }
    if (!from.has(id)) {
        return;
    }
    // starts at the tapped slot and runs back to the nearest filled one
    const path = [];
    for (let i = id; i !== -1; i = from.get(i)) {
        path.push(nodes[i]);
    }
    netBeam = { path, t0: performance.now(), dur: Math.min(1200, 300 + 35 * path.length) };
}
function drawBeam(g, S, z) {
    if (!netBeam) {
        return false;
    }
    const k = (performance.now() - netBeam.t0) / netBeam.dur;
    if (k > 1.6) {
        netBeam = null;
        return false;
    }
    const pts = netBeam.path.map(n => S(n.x, n.y));
    // how far along the path the head has got, in hops
    const head = Math.min(1, k) * (pts.length - 1);
    g.save();
    g.globalAlpha = k > 1 ? 1 - (k - 1) / 0.6 : 1;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= Math.ceil(head) && i < pts.length; i++) {
        const f = Math.min(1, head - (i - 1));
        g.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f);
    }
    g.strokeStyle = '#ffe14d';
    g.shadowColor = '#ffe14d';
    g.shadowBlur = 18;
    g.lineWidth = Math.max(3, 9 * z);
    g.globalAlpha *= 0.35;
    g.stroke();
    g.globalAlpha /= 0.35;
    g.shadowBlur = 0;
    g.lineWidth = Math.max(1.5, 3 * z);
    g.strokeStyle = '#fff6b0';
    g.stroke();
    g.restore();
    return true;
}
function netFlash(id, colour) {
    const n = net().nodes[id];
    const fx = $('netFx');
    const [x, y] = netToScreen(n.x, n.y);
    const e = document.createElement('i');
    e.style.left = x + 'px';
    e.style.top = y + 'px';
    e.style.setProperty('--c', colour || slotCol(n));
    if (colour) {
        e.className = 'deny';
    }
    fx.appendChild(e);
    setTimeout(() => e.remove(), 900);
}
function renderBonds() {
    netCanvas = $('netCanvas');
    bondSummary();
    $('netTotals').innerHTML = netTotalsHtml();
    if (!netView.init) {
        netView.init = true;
        netView.x = 0;
        netView.y = 0;
        netView.z = innerWidth < 600 ? 0.8 : 1;
    }
    netSelect(null);
    netResize();
}
{
    const cv = $('netCanvas');
    const pts = new Map();
    let drag = null;
    let pinch = null;
    let moved = false;
    const zoomAt = (sx, sy, f) => {
        const [wx, wy] = netToWorld(sx, sy);
        netView.z = Math.max(0.05, Math.min(2.6, netView.z * f));
        const r = cv.getBoundingClientRect();
        netView.x = wx - (sx - r.width / 2) / netView.z;
        netView.y = wy - (sy - r.height / 2) / netView.z;
        netDrawSoon();
    };
    const local = e => {
        const r = cv.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    };
    cv.addEventListener('pointerdown', e => {
        cv.setPointerCapture(e.pointerId);
        pts.set(e.pointerId, local(e));
        moved = false;
        if (pts.size === 1) {
            drag = { p: local(e), x: netView.x, y: netView.y };
        } else if (pts.size === 2) {
            const [a, b] = [...pts.values()];
            pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: netView.z, m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
            drag = null;
        }
    });
    cv.addEventListener('pointermove', e => {
        if (!pts.has(e.pointerId)) {
            return;
        }
        pts.set(e.pointerId, local(e));
        if (pinch && pts.size >= 2) {
            const [a, b] = [...pts.values()];
            const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
            const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            const [wx, wy] = netToWorld(pinch.m[0], pinch.m[1]);
            netView.z = Math.max(0.05, Math.min(2.6, pinch.z * d / pinch.d));
            const r = cv.getBoundingClientRect();
            netView.x = wx - (m[0] - r.width / 2) / netView.z;
            netView.y = wy - (m[1] - r.height / 2) / netView.z;
            pinch.m = m;
            pinch.z = netView.z;
            pinch.d = d;
            moved = true;
            netDrawSoon();
        } else if (drag) {
            const p = local(e);
            const dx = p[0] - drag.p[0];
            const dy = p[1] - drag.p[1];
            if (Math.hypot(dx, dy) > 6) {
                moved = true;
            }
            netView.x = drag.x - dx / netView.z;
            netView.y = drag.y - dy / netView.z;
            netDrawSoon();
        }
    });
    const up = e => {
        if (!pts.has(e.pointerId)) {
            return;
        }
        const p = local(e);
        pts.delete(e.pointerId);
        if (pts.size < 2) {
            pinch = null;
        }
        if (pts.size === 1) {
            const q = [...pts.values()][0];
            drag = { p: q, x: netView.x, y: netView.y };
            return;
        }
        drag = null;
        if (!moved && e.type === 'pointerup') {
            const [wx, wy] = netToWorld(p[0], p[1]);
            let hit = null;
            shownNet().list.forEach(n => {
                const d = Math.hypot(n.x - wx, n.y - wy);
                if (d < 30 / Math.min(1, netView.z) && (!hit || d < hit.d)) {
                    hit = { n, d };
                }
            });
            netSelect(hit ? hit.n.id : null);
        }
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', e => {
        e.preventDefault();
        const [sx, sy] = local(e);
        zoomAt(sx, sy, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
    }, { passive: false });
    addEventListener('resize', () => {
        if ($('bonds').classList.contains('active')) {
            netResize();
        }
    });
    $('netJump').onclick = netJump;
    $('netCentre').onclick = () => netGlideTo(0, 0, innerWidth < 600 ? 0.8 : 1);
    $('netTotalsBtn').onclick = () => $('netTotalsWrap').classList.toggle('open');
    // remember which groups are open, since the panel is redrawn after every fill
    $('netTotals').addEventListener('toggle', e => {
        const g = e.target.dataset && e.target.dataset.g;
        if (g) {
            if (e.target.open) {
                netOpen.add(g);
            } else {
                netOpen.delete(g);
            }
        }
    }, true);
}
