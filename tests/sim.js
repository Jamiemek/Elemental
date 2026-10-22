// Elemental balance simulator.
// Loads the game's own data and rules from an index.html, then plays a virtual player:
// rolls (manual, then autoroll), fills bond slots greedily, buys and uses catalysts.
// Usage: node sim.js <index.html> [runs] [maxHours] [overrides.json]
'use strict';
const fs = require('fs');
const vm = require('vm');

function loadGame(file, over) {
    const s = fs.readFileSync(file, 'utf8');
    const grab = (from, to, incl) => {
        const a = s.indexOf(from);
        if (a < 0) {
            throw new Error('missing ' + from);
        }
        const b = s.indexOf(to, a + from.length);
        if (b < 0) {
            throw new Error('missing end ' + to);
        }
        return s.slice(a, incl ? s.indexOf('\n', b) : b);
    };
    const code = [
        grab('const ELEMENTS = [', 'ELEMENTS.forEach(e => e[2] =', true),
        grab('const ACHIEVEMENTS = [', '\n];', false) + '\n];',
        grab('const FAMILY = {};', 'function buildTable('),
        grab('function hillFormula(elements) {', 'const BASE_CHAIN'),
        grab('function parseFormula(s) {', 'ACHIEVEMENTS.forEach(a => a.hill = normalizeFormula(a.formula));', true),
        grab('// Exactly three elements grant', 'const ELEMENT_BUFFS = buildBuffs();', true),
        grab('const NET_SEED', 'function net() {'),
        grab('const CAT_TIERS = [', 'const CAT = Object.fromEntries', true),
        // quark formula, if the game defines one
        s.includes('function quarksFor(') ? grab('const QUARK_RATE', '\n}\n', false) + '\n}' : 'function quarksFor(score, mult) { return score / 100 * mult; }',
        s.includes('const BALANCE = ') ? '' : ''
    ].join('\n');
    const ctx = { console, Math, Map, Set, Object, Array, JSON, Number, String, Infinity, parseInt, parseFloat, isFinite };
    vm.createContext(ctx);
    // overrides are applied as source edits so they behave exactly like an edited game file
    let src = code;
    (over && over.edits || []).forEach(([a, b]) => {
        if (!src.includes(a)) {
            throw new Error('override not found: ' + a.slice(0, 80));
        }
        src = src.split(a).join(b);
    });
    vm.runInContext(src.replace(/^(const|let) /gm, 'var '), ctx);
    const g = {};
    vm.runInContext(`
        this.out = {
            ELEMENTS, ACHIEVEMENTS, familyOf, hillFormula, normalizeFormula, parseFormula,
            ELEMENT_BUFFS, EXTRA_ROLL_SYMBOLS, CHAIN_SYMBOLS, AUTO_UNLOCK_SYMBOL,
            AUTO_BASE_GAP: typeof AUTO_BASE_GAP !== 'undefined' ? AUTO_BASE_GAP : 5,
            AUTO_MIN_GAP: typeof AUTO_MIN_GAP !== 'undefined' ? AUTO_MIN_GAP : 0.5,
            NET: genNetwork(), CAT_TIERS, CATALYSTS, quarksFor,
            CHAIN_CAP: typeof CHAIN_CAP !== 'undefined' ? CHAIN_CAP : 3,
            MAX_EXTRA: typeof MAX_EXTRA !== 'undefined' ? MAX_EXTRA : 3,
            CHAIN_BASE: typeof CHAIN_BASE !== 'undefined' ? CHAIN_BASE : 8,
            CHAIN_STEP: typeof CHAIN_STEP !== 'undefined' ? CHAIN_STEP : 0.625
        };`, ctx);
    Object.assign(g, ctx.out);
    ACH_FIX(g);
    return g;
}
function ACH_FIX(g) {
    g.ACHIEVEMENTS.forEach(a => a.hill = g.normalizeFormula(a.formula));
}

function mulberry(a) {
    return () => {
        a |= 0;
        a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function simulate(G, seed, maxHours, opts) {
    const rnd = mulberry(seed);
    const E = G.ELEMENTS;
    const NE = E.length;
    const SYM = E.map(e => e[0]);
    const IDX = Object.fromEntries(SYM.map((x, i) => [x, i]));
    const RAR = E.map(e => e[2]);
    const FAM = SYM.map(x => G.familyOf(x));
    const famList = {};
    SYM.forEach((x, i) => (famList[FAM[i]] = famList[FAM[i]] || []).push(i));
    // ---- player state
    let t = 0; // seconds
    const found = new Uint8Array(NE);
    let foundN = 0;
    const single = new Float64Array(NE); // available single-element records per element
    const cpAvail = new Map(); // hill formula -> available count (compounds only)
    const cpEls = new Map(); // hill formula -> unique element indices
    const hasAvail = new Float64Array(NE); // available compounds containing element
    const hasList = Array.from({ length: NE }, () => []); // formulas containing element
    const achWant = new Map();
    G.ACHIEVEMENTS.forEach(a => achWant.set(a.hill, (achWant.get(a.hill) || 0) + 1));
    const achGot = new Set();
    let achN = 0;
    let quarks = 0;
    let earned = 0;
    let earnedRare = 0, rareN = 0, maxQ = 0, maxQScore = 0;
    let rollsDone = 0;
    let draws = 0;
    // ---- element buffs from found elements
    let eb = { luck: 0, speed: 0, extra: 0, chain: 0, auto: false, aspeed: 0 };
    function addElementBuff(i) {
        const b = G.ELEMENT_BUFFS.get(SYM[i]);
        if (!b) {
            return;
        }
        if (b.type === 'luck') {
            eb.luck += b.value;
        } else if (b.type === 'speed') {
            eb.speed += b.value;
        } else if (b.type === 'extra') {
            eb.extra += 1;
        } else if (b.type === 'chain') {
            eb.chain += 1;
        } else if (b.type === 'autounlock') {
            eb.auto = true;
        } else if (b.type === 'autospeed' || b.type === 'autotime' || b.type === 'autocool') {
            eb.aspeed += b.value;
        }
    }
    // ---- network
    const N = G.NET;
    const nn = N.nodes.length;
    const filled = new Uint8Array(nn);
    let filledN = 0;
    const reach = new Uint8Array(nn);
    reach[0] = 1;
    const frontier = new Set([0]);
    const bb = { add: 0, mult: 1, auto: 0, price: 0, refresh: 0, stock: 0, slots: 0 };
    const sec = (e) => e.kind;
    function litEdge(e) {
        const k = e.kind;
        if (k === 'luck') {
            bb.add += e.val;
        } else if (k === 'mult') {
            bb.mult *= e.val;
        } else if (k === 'slot') {
            bb.slots += 1;
        } else if (k === 'sec' || k === 'cool') {
            bb.auto += 0;
        } else {
            bb[k] = (bb[k] || 0) + e.val;
        }
    }
    function payable(q) {
        if (q.t === 'el') {
            return single[IDX[q.k]] >= q.n;
        }
        if (q.t === 'cp') {
            return (cpAvail.get(q.k) || 0) >= q.n;
        }
        if (q.t === 'fam') {
            let s = 0;
            for (const i of famList[q.k]) {
                s += single[i];
            }
            return s >= q.n;
        }
        return hasAvail[IDX[q.k]] >= q.n;
    }
    function spendCp(f, n) {
        cpAvail.set(f, cpAvail.get(f) - n);
        for (const j of cpEls.get(f)) {
            hasAvail[j] -= n;
        }
    }
    function pay(q) {
        let need = q.n;
        if (q.t === 'el') {
            single[IDX[q.k]] -= need;
        } else if (q.t === 'cp') {
            spendCp(q.k, need);
        } else if (q.t === 'fam') {
            const l = famList[q.k].slice().sort((a, b) => single[b] - single[a]);
            for (const i of l) {
                const take = Math.min(need, single[i]);
                single[i] -= take;
                need -= take;
                if (!need) {
                    break;
                }
            }
        } else {
            const i = IDX[q.k];
            for (const f of hasList[i]) {
                const a = cpAvail.get(f);
                if (a > 0) {
                    const take = Math.min(need, a);
                    spendCp(f, take);
                    need -= take;
                    if (!need) {
                        break;
                    }
                }
            }
        }
    }
    function tryFill() {
        let any = true;
        let changed = false;
        while (any) {
            any = false;
            for (const id of frontier) {
                const q = N.nodes[id].req;
                if (payable(q)) {
                    pay(q);
                    filled[id] = 1;
                    filledN++;
                    frontier.delete(id);
                    for (const ei of N.adj[id]) {
                        const e = N.edges[ei];
                        const o = e.a === id ? e.b : e.a;
                        if (filled[o]) {
                            litEdge(e);
                        } else if (!reach[o]) {
                            reach[o] = 1;
                            frontier.add(o);
                        }
                    }
                    any = changed = true;
                }
            }
        }
        if (changed) {
            wCache.clear();
        }
    }
    // ---- catalysts
    const CATS = G.CATALYSTS;
    const CATID = Object.fromEntries(CATS.map(c => [c.id, c]));
    const inv = {};
    const active = {}; // tier -> {id, until, rolls}
    let shopSlot = -1;
    let stock = [];
    const bought = {};
    function cb() {
        const r = { luck: 0, speed: 0, quark: 0, extra: 0, chain: 0, chainMax: false, fam: {} };
        for (const k in active) {
            const a = active[k];
            if (a.until != null && a.until <= t) {
                delete active[k];
                continue;
            }
            if (a.rolls != null && a.rolls <= 0) {
                delete active[k];
                continue;
            }
            if (a.until == null) {
                continue;
            }
            const f = CATID[a.id].fx;
            if (f.luck) {
                r.luck += f.luck;
            }
            if (f.speed) {
                r.speed += f.speed;
            }
            if (f.quark) {
                r.quark += f.quark;
            }
            if (f.extra) {
                r.extra += f.extra;
            }
            if (f.chain) {
                r.chain += f.chain;
            }
            if (f.chainMax) {
                r.chainMax = true;
            }
            if (f.fam) {
                r.fam[f.fam] = (r.fam[f.fam] || 0) + f.pct;
            }
        }
        return r;
    }
    function useCat(id) {
        const c = CATID[id];
        const cur = active[c.tier];
        if (cur && cur.id !== id) {
            if ((cur.until != null && cur.until > t) || (cur.rolls != null && cur.rolls > 0)) {
                return false;
            }
        }
        if (c.rolls) {
            active[c.tier] = { id, rolls: (cur && cur.id === id ? cur.rolls : 0) + c.rolls };
        } else {
            const base = cur && cur.id === id && cur.until > t ? cur.until : t;
            active[c.tier] = { id, until: base + c.min * 60 };
        }
        inv[id]--;
        return true;
    }
    function shopTick() {
        const P = Math.max(5, 20 - bb.refresh) * 60;
        const slot = Math.floor(t / P);
        if (slot === shopSlot) {
            return;
        }
        shopSlot = slot;
        const n = Math.min(5, 2 + bb.slots);
        const boost = bb.stock / 100;
        const w = G.CAT_TIERS.map((x, i) => x.p * (1 + boost * i / 3));
        const tot = w.reduce((a, b) => a + b, 0);
        stock = [];
        for (let k = 0; k < n; k++) {
            let r = rnd() * tot;
            let tier = 0;
            for (; tier < w.length - 1; tier++) {
                r -= w[tier];
                if (r <= 0) {
                    break;
                }
            }
            const pool = CATS.filter(c => c.tier === tier);
            stock.push(pool[Math.floor(rnd() * pool.length)].id);
        }
        // buy: rarest first, if affordable
        const disc = 1 - Math.min(90, bb.price) / 100;
        stock.sort((a, b) => CATID[b].tier - CATID[a].tier).forEach(id => {
            const p = Math.max(1, Math.round(CATID[id].price * disc));
            const thrift = CATID[id].tier <= (opts.thriftTier == null ? 4 : opts.thriftTier) ? (opts.thrift == null ? 0.5 : opts.thrift) : 1;
            const keep = CATID[id].tier <= 4 ? Math.max(opts.reserve || 0, Math.min(opts.reserveCap || 1e9, (opts.reserveFrac || 0) * earned)) : 0;
            if (p <= quarks * thrift && quarks - p >= keep && (!opts.skipCat || !opts.skipCat(CATID[id]))) {
                quarks -= p;
                inv[id] = (inv[id] || 0) + 1;
                bought[CATID[id].tier] = (bought[CATID[id].tier] || 0) + 1;
                if (CATID[id].tier >= 5) {
                    mark('buy' + CATID[id].tier);
                }
            }
        });
        // use whatever can run
        for (const id in inv) {
            while (inv[id] > 0 && useCat(id)) { }
        }
    }
    function takeCharge() {
        const o = { rollLuck: 0, unfound: false, linked: false };
        for (const k in active) {
            const a = active[k];
            if (a.rolls == null || a.rolls <= 0) {
                continue;
            }
            const f = CATID[a.id].fx;
            if (f.rollLuck) {
                o.rollLuck += f.rollLuck;
            }
            if (f.unfound) {
                o.unfound = true;
            }
            if (f.linked) {
                o.linked = true;
            }
            a.rolls--;
            if (a.rolls <= 0) {
                delete active[k];
                for (const id in inv) {
                    if (inv[id] > 0 && CATID[id].tier === +k) {
                        useCat(id);
                        break;
                    }
                }
            }
        }
        return o;
    }
    // ---- weights
    const LF = RAR.map(n => 1 + 1.5 * (Math.log10(n + 1) / 3));
    const wCache = new Map();
    function table(luck, fam, onlyUnfound) {
        const key = luck.toFixed(1) + '|' + JSON.stringify(fam) + (onlyUnfound ? '|u' + foundN : '');
        let tb = wCache.get(key);
        if (tb) {
            return tb;
        }
        const cum = new Float64Array(NE);
        let s = 0;
        for (let i = 0; i < NE; i++) {
            let v = onlyUnfound && found[i] ? 0 : (1 / RAR[i]) * Math.pow(LF[i], (luck / 100) / 1.5) * (1 + (fam[FAM[i]] || 0) / 100);
            s += v;
            cum[i] = s;
        }
        tb = { cum, s };
        if (wCache.size > 4000) {
            wCache.clear();
        }
        wCache.set(key, tb);
        return tb;
    }
    function draw(tb) {
        const r = rnd() * tb.s;
        let lo = 0;
        let hi = NE - 1;
        while (lo < hi) {
            const m = (lo + hi) >> 1;
            if (tb.cum[m] < r) {
                lo = m + 1;
            } else {
                hi = m;
            }
        }
        return lo;
    }
    // ---- milestones
    const M = { };
    const mark = (k) => {
        if (M[k] == null) {
            M[k] = t / 3600;
        }
    };
    const CUT = new Set(['U', 'Og', 'Ts', 'Lv', 'Mc'].map(x => IDX[x]));
    const goalAch = opts.ach || 60;
    const goalBond = Math.ceil(nn * (opts.bond || 0.85));
    const goalBond90 = Math.ceil(nn * 0.9);
    const maxT = maxHours * 3600;
    let lastFill = 0;
    let lastTimeline = 0;
    const timeline = [];
    const formulaOf = els => {
        const c = new Map();
        for (const i of els) {
            c.set(i, (c.get(i) || 0) + 1);
        }
        return G.hillFormula(els.map(i => [SYM[i]]));
    };
    while (t < maxT) {
        shopTick();
        const c = cb();
        const luck = (eb.luck + bb.add) * bb.mult + c.luck;
        const speed = eb.speed + c.speed;
        const extra = Math.min(G.MAX_EXTRA, eb.extra + (bb.extra || 0) + c.extra);
        const steps = Math.min(8, eb.chain + (bb.chain || 0));
        const denomBase = Math.max(G.CHAIN_CAP, G.CHAIN_BASE - G.CHAIN_STEP * steps);
        const denom = c.chainMax ? G.CHAIN_CAP : Math.max(G.CHAIN_CAP, denomBase - c.chain);
        const tb = table(luck, c.fam, false);
        let cutT = 0;
        let actionScore = 0;
        for (let k = 0; k <= extra; k++) {
            const ch = takeCharge();
            let tbr = tb;
            let lu = luck + ch.rollLuck;
            if (ch.rollLuck) {
                tbr = table(lu, c.fam, false);
            }
            const els = [];
            if (ch.unfound && foundN < NE) {
                els.push(draw(table(lu, c.fam, true)));
            } else {
                if (ch.unfound) {
                    lu += 3000;
                    tbr = table(lu, c.fam, false);
                }
                els.push(draw(tbr));
            }
            while (els.length < 30 && ((ch.linked && els.length === 1) || rnd() < 1 / denom)) {
                els.push(draw(tbr));
            }
            draws += els.length;
            rollsDone++;
            let score = 0;
            for (const i of els) {
                score += RAR[i];
                if (!found[i]) {
                    found[i] = 1;
                    foundN++;
                    addElementBuff(i);
                    wCache.clear();
                    if (SYM[i] === G.AUTO_UNLOCK_SYMBOL) {
                        mark('autoroll');
                    }
                }
                if (CUT.has(i)) {
                    cutT = Math.max(cutT, 10.5);
                }
            }
            actionScore = Math.max(actionScore, score);
            const qq = G.quarksFor(score, 1 + c.quark / 100);
            quarks += qq;
            earned += qq;
            if (score >= 500000) { earnedRare += qq; rareN++; }
            if (qq > maxQ) { maxQ = qq; maxQScore = score; }
            if (els.length === 1) {
                single[els[0]]++;
            } else {
                const f = formulaOf(els);
                const had = cpAvail.has(f);
                cpAvail.set(f, (cpAvail.get(f) || 0) + 1);
                if (!had) {
                    const u = [...new Set(els)];
                    cpEls.set(f, u);
                    for (const j of u) {
                        hasList[j].push(f);
                    }
                }
                for (const j of cpEls.get(f)) {
                    hasAvail[j]++;
                }
            }
            const f1 = els.length === 1 ? SYM[els[0]] : null;
            const hf = f1 || G.hillFormula(els.map(i => [SYM[i]]));
            if (achWant.has(hf) && !achGot.has(hf)) {
                achGot.add(hf);
                achN += achWant.get(hf);
            }
        }
        // time for this action
        const delay = Math.max(300, 3000 / (1 + speed / 100));
        const anim = Math.max(120, 1350 * delay / 3000) + 1650 + 350;
        const gap = eb.auto ? Math.max(G.AUTO_MIN_GAP, G.AUTO_BASE_GAP / (1 + (eb.aspeed + bb.auto) / 100)) : (opts.manualGap || 1.2);
        t += anim / 1000 + gap + cutT;
        if (t - lastFill > 30) {
            lastFill = t;
            tryFill();
        }
        if (foundN === NE) {
            mark('table');
        }
        if (achN >= goalAch) {
            mark('ach');
        }
        if (filledN >= goalBond) {
            mark('bond');
        }
        if (filledN >= goalBond90) {
            mark('bond90');
        }
        [10, 25, 50, 75, 100].forEach(p => {
            if (foundN >= Math.ceil(NE * p / 100)) {
                mark('el' + p);
            }
        });
        [10, 25, 50, 75].forEach(p => {
            if (filledN >= Math.ceil(nn * p / 100)) {
                mark('bond' + p);
            }
        });
        [10, 20, 30, 40, 50].forEach(p => {
            if (achN >= p) {
                mark('ach' + p);
            }
        });
        if (eb.extra + (bb.extra || 0) >= 1) {
            mark('extra1');
        }
        if (eb.extra + (bb.extra || 0) >= 2) {
            mark('extra2');
        }
        if (eb.extra + (bb.extra || 0) >= 3) {
            mark('extra3p');
        }
        if (denomBase <= 5.5) {
            mark('chain55');
        }
        if (denomBase <= 3) {
            mark('chain3');
        }
        if (extra >= 3) {
            mark('extra3');
        }
        if (found[IDX.U]) {
            mark('U');
        }
        if (t - lastTimeline >= 3600 * (opts.tlStep || 10)) {
            lastTimeline = t;
            timeline.push({ h: Math.round(t / 3600), rolls: rollsDone, chain: +denomBase.toFixed(2), extra, earned: Math.round(earned), found: foundN, ach: achN, bonds: filledN, luck: Math.round(luck), q: Math.round(quarks), auto: +(Math.max(G.AUTO_MIN_GAP, G.AUTO_BASE_GAP / (1 + (eb.aspeed + bb.auto) / 100))).toFixed(2) });
        }
        if (M.table != null && M.ach != null && M.bond != null) {
            mark('complete');
            if (!opts.full) {
                break;
            }
        }
    }
    return { M, end: { h: t / 3600, found: foundN, ach: achN, bonds: filledN, nn, rolls: rollsDone, draws, quarks: Math.round(quarks), earned: Math.round(earned), bought, rareShare: +(earnedRare / Math.max(1, earned)).toFixed(3), rareN, maxQ: Math.round(maxQ), maxQScore, luck: (eb.luck + bb.add) * bb.mult, missing: SYM.filter((x, i) => !found[i]) }, timeline };
}

if (require.main === module) {
    const file = process.argv[2] || 'index.html';
    const runs = +process.argv[3] || 3;
    const maxH = +process.argv[4] || 800;
    const over = process.argv[5] ? JSON.parse(fs.readFileSync(process.argv[5], 'utf8')) : null;
    const G = loadGame(file, over);
    const res = [];
    for (let r = 0; r < runs; r++) {
        const t0 = Date.now();
        const x = simulate(G, 1000 + r * 7919, maxH, over && over.opts || {});
        x.ms = Date.now() - t0;
        res.push(x);
        console.log(JSON.stringify({ run: r, M: Object.fromEntries(Object.entries(x.M).map(([k, v]) => [k, +v.toFixed(1)])), end: x.end, ms: x.ms }));
    }
}
module.exports = { loadGame, simulate };
