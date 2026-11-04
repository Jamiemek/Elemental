// held still for the length of one roll
let buffHold = null;
// top-tier finds stay rare at full power
const LUCK_CEILING = 450;
function activeBuffStats() {
    if (buffHold) {
        return buffHold;
    }
    if (buffCache && Date.now() < buffCache.exp) {
        return buffCache;
    }
    return buffCache = computeBuffs();
}
function computeBuffs() {
    const found = discoveredSymbols();
    let luck = 0;
    let speed = 0;
    let extra = 0;
    let chainSteps = 0;
    let autoUnlock = false;
    let autoTime = 0;
    let autoCool = 0;
    let autoSpeed = 0;
    found.forEach(sym => {
        const b = ELEMENT_BUFFS.get(sym);
        if (!b) {
            return;
        }
        if (b.type === 'autounlock') {
            autoUnlock = true;
        }
        if (b.type === 'autospeed') {
            autoSpeed += b.value;
        }
        if (b.type === 'autotime') {
            autoTime += b.value;
        }
        if (b.type === 'autocool') {
            autoCool += b.value;
        }
        if (b.type === 'luck') {
            luck += b.value;
        }
        if (b.type === 'speed') {
            speed += b.value;
        }
        if (b.type === 'extra') {
            extra += 1;
        }
        if (b.type === 'chain') {
            chainSteps += 1;
        }
    });
    const bd = bondBonus();
    const cb = catBonus();
    const own = (luck + bd.add) * bd.mult;
    const denom = Math.max(CHAIN_MAX, BASE_CHAIN - (BASE_CHAIN - CHAIN_MAX) / 8 * Math.min(8, chainSteps + bd.chain));
    return {
        // oddsLuck is what the odds use: catalysts can't take it past LUCK_CEILING (your own luck can)
        found, luck: own + cb.luck, oddsLuck: Math.min(own + cb.luck, Math.max(own, LUCK_CEILING)), speed: speed + cb.speed, autoUnlocked: autoUnlock, autoSpeed: autoSpeed + bd.auto + cb.auto, autoGap: Math.max(AUTO_MIN_GAP, AUTO_BASE_GAP / (1 + (autoSpeed + bd.auto + cb.auto) / 100)), extra: Math.min(bd.bonusroll ? 4 : 3, extra + bd.extra + cb.extra + (bd.bonusroll ? 1 : 0)), chainSteps: Math.min(8, chainSteps), chainDenom: cb.chainMax ? cb.chainFloor : Math.max(cb.chainFloor, denom - cb.chain), fam: cb.fam, quark: cb.quark + bd.quark,
        // reagent/punchline add, running gag multiplies
        jokeMult: (1 + (cb.joke + bd.jokeup) / 100) * (cb.gag || 1), level: cb.level || (bd.leveller && levellerOn), exp: catNextExpiry()
    };
}
function weightTable(extraLuck, only) {
    const b = activeBuffStats();
    const gamma = evOn('gamma');
    if (!extraLuck && !only && weightCache && weightCache.b === b && weightCache.gamma === gamma && weightCache.pool.length === rollPool().length) {
        return weightCache;
    }
    const luck = b.oddsLuck + (extraLuck || 0);
    let total = 0;
    let total0 = 0;
    const pool = rollPool();
    const flat = [];
    const w = pool.map(e => {
        if (only && !only(e)) {
            flat.push(0);
            return 0;
        }
        const m = (1 + (b.fam[familyOf(e[0])] || 0) / 100) * (isJoke(e[0]) ? b.jokeMult : 1) * (gamma && RADIOACTIVE.has(e[0]) ? GAMMA_MULT : 1) / e[2];
        const v = m * Math.pow(1 + 1.5 * (Math.log10(e[2] + 1) / 3), (luck / 100) / 1.5);
        flat.push(m);
        total += v;
        total0 += m;
        return v;
    });
    // leveller: anything luck has made rarer gets its 0% luck share back
    if (b.level && total0) {
        const k = total / total0;
        total = 0;
        for (let i = 0; i < w.length; i++) {
            w[i] = Math.max(w[i], flat[i] * k);
            total += w[i];
        }
    }
    const t = { w, total, b, pool, gamma };
    if (!extraLuck && !only) {
        weightCache = t;
    }
    return t;
}
// a Vacuum adds the void elements to the first pick of each roll. One draw: under their share
// of the weight it's a void element, otherwise the roll carries on as normal
function voidPick(extraLuck) {
    const t = weightTable(extraLuck);
    const luck = t.b.oddsLuck + (extraLuck || 0);
    const lure = catBonus().voidx;
    const vw = VOIDS.map(v => lure * Math.pow(1 + 1.5 * (Math.log10(v[2] + 1) / 3), (luck / 100) / 1.5) / v[2]);
    const sum = vw.reduce((a, x) => a + x, 0);
    let r = rnd() * (t.total + sum);
    for (let i = 0; i < VOIDS.length; i++) {
        r -= vw[i];
        if (r < 0) {
            if (acTrace) {
                acTrace.push(VOIDS[i][0]);
            }
            return VOIDS[i];
        }
    }
    return null;
}
// one element, with the active buffs; extraLuck and only come from single-roll catalysts
function weightedElement(extraLuck, only) {
    const { w, total, pool } = weightTable(extraLuck, only);
    let r = rnd() * total;
    let i = 0;
    for (; i < pool.length - 1; i++) {
        r -= w[i];
        if (r <= 0) {
            break;
        }
    }
    if (acTrace) {
        acTrace.push(pool[i][0]);
    }
    return pool[i];
}
// joke table
let jokeMix = true;
let jokeHide = false;
try {
    jokeMix = localStorage.getItem('elementalJokeMix') !== '0';
    jokeHide = localStorage.getItem('elementalJokeHide') === '1';
} catch (e) { }
const jokesOn = () => bondBonus().joke;
const rollPool = () => jokesOn() ? ELEMENTS.concat(JOKES.filter(jokeOpen)) : ELEMENTS;
// false = chain stops (mixing off rule)
function chainStep(elements, e) {
    if (jokeMix || !jokesOn() || isJoke(e[0]) === isJoke(elements[0][0])) {
        elements.push(e);
        return true;
    }
    if (isJoke(e[0])) {
        elements.length = 0;
        elements.push(e);
    }
    return false;
}
function rollElements(luckUp, first, o) {
    const elements = [first || weightedElement(luckUp)];
    const fam = o.magnet ? familyOf(elements[0][0]) : null;
    const only = fam ? (e => familyOf(e[0]) === fam) : undefined;
    while (elements.length < 30 && ((o.linked && elements.length === 1) || rnd() < 1 / o.denom)) {
        if (!chainStep(elements, weightedElement(luckUp, only))) {
            break;
        }
    }
    return elements;
}
// black hole / twin horizon
function rollTwice(make) {
    const a = make();
    const b = make();
    return exactRarity(b, 0) < exactRarity(a, 0) ? b : a;
}
function quarkMult(elements, buffs) {
    const cb = catBonus();
    const n = elements.length;
    const pct = (buffs.quark || 0) + (n === 1 ? bondBonus().alone : 0) + (n > 1 ? cb.lens : 0) + (cb.heavy + bondBonus().heavy) * (n - 1);
    return (1 + pct / 100) * (cb.laugh && elements.some(e => isJoke(e[0])) ? 3 : 1);
}
// + Redactium
const secretChance = () => SECRET_CHANCE + (bondBonus().secret + catBonus().secret) / 100;
function hillFormula(elements) {
    const counts = {};
    elements.forEach(e => counts[e[0]] = (counts[e[0]] || 0) + 1);
    let syms = Object.keys(counts);
    syms.sort((a, b) => {
        if (counts.C && a === 'C') {
            return -1;
        }
        if (counts.C && b === 'C') {
            return 1;
        }
        if (counts.C && a === 'H' && b !== 'C') {
            return -1;
        }
        if (counts.C && b === 'H' && a !== 'C') {
            return 1;
        }
        return a.localeCompare(b);
    });
    return syms.map(s => s + (counts[s] > 1 ? counts[s] : '')).join('');
}
const BASE_CHAIN = 8;
const CHAIN_MAX = 5;
// Legendary and up can take chain chance past the usual best, so they still matter once the bonds have it maxed
const chainFloor = tier => tier >= 6 ? 3 : tier === 5 ? 3.5 : tier === 4 ? 4 : CHAIN_MAX;
// Odds are always base odds: no luck, chain or other buffs are counted
function exactRarity(elements, guaranteedExtras = 0) {
    const n = Math.max(1, elements.length - guaranteedExtras);
    let log10 = -(n - 1) * Math.log10(BASE_CHAIN);
    elements.forEach(e => log10 -= Math.log10(elementBySymbol[e[0]][2]));
    return log10;
}
// ions: 1/100 for +, 1/1000 for -, - wins a tie
const ION_PLUS = 0.01;
const ION_MINUS = 0.001;
const ION_MAX = 3;
// outer ring 2 lines make every ion a little more likely, and Hypercharged a lot more
const ionClimb = () => +(1 + bondBonus().ionstep / 100).toFixed(4);
const ionBoost = () => (1 + (bondBonus().ionup + catBonus().ionx) / 100) * (evOn('hyper') ? HYPER_MULT : 1);
// Ion Lens: always an ion, ² or ³ either way
function ionLensRoll() {
    const sign = rnd() < 0.5 ? 1 : -1;
    return sign * (rnd() < 0.3 ? 3 : 2);
}
function rollIon() {
    if (!bondBonus().ion) {
        return 0;
    }
    // the same rounded figure the server is sent
    const k = +ionBoost().toFixed(4);
    const plus = rnd() < ION_PLUS * k;
    const minus = rnd() < ION_MINUS * k;
    if (!plus && !minus) {
        return 0;
    }
    // outer ring 2 makes each step up a little likelier
    const p = (minus ? ION_MINUS : ION_PLUS) * k * ionClimb();
    let n = 1;
    while (n < ION_MAX && rnd() < p) {
        n++;
    }
    return minus ? -n : n;
}
const ionScoreMult = ion => ion > 0 ? 1.5 * ion : ion < 0 ? -3 * ion : 1;
const ionLog = ion => ion > 0 ? -2 * ion : ion < 0 ? 3 * ion : 0;
const ION_SUP = ['', '', '²', '³'];
const ionText = ion => ion ? ION_SUP[Math.abs(ion)] + (ion > 0 ? '⁺' : '⁻') : '';
const withIon = (formula, ion) => formula + ionText(ion || 0);
const entryIons = c => ionText(c.ionP || 0) + ionText(-(c.ionN || 0));
function ionise(rec, ion) {
    rec.ion = ion;
    if (ion) {
        rec.baseLog = rec.log;
        rec.baseScore = rec.score;
        rec.log += ionLog(ion);
        rec.score *= ionScoreMult(ion);
        rec.rarity = rarityText(rec.log);
    }
    return rec;
}
let ionMarks = {};
let ionNew = [];
try {
    const v = JSON.parse(localStorage.getItem('elementalIons') || '{}');
    ionMarks = v.m || {};
    ionNew = v.n || [];
} catch (e) { }
function ionSave() {
    try {
        localStorage.setItem('elementalIons', JSON.stringify({ m: ionMarks, n: ionNew }));
    } catch (e) { }
}
function ionCredit(sym, ion) {
    if (!ion) {
        return;
    }
    const m = ionMarks[sym] || [0, 0];
    const k = ion > 0 ? 0 : 1;
    if (Math.abs(ion) > m[k]) {
        m[k] = Math.abs(ion);
        ionMarks[sym] = m;
        if (!ionNew.includes(sym)) {
            ionNew.push(sym);
        }
        ionSave();
    }
}
function rarityText(log) {
    const value = 10 ** (-log);
    if (Number.isFinite(value) && value < 1e21) {
        return '1/' + Math.max(1, Math.round(value)).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return '≈ 1/' + value.toExponential(2).replace('+', '');
}
// Quarks earned by one roll
const QUARK_RATE = 0.1;
const QUARK_KNEE = 10000;
function quarksFor(score, mult) {
    const base = score <= QUARK_KNEE ? Math.sqrt(score) : Math.pow(score, 0.75) / Math.pow(QUARK_KNEE, 0.25);
    return base * QUARK_RATE * mult;
}
const oddsSum = elements => elements.reduce((sum, e) => sum + elementBySymbol[e[0]][2], 0);
// score: odds summed, with a bonus per extra element that grows from x0.2 to x3 at 1.5 billion
function rollScore(elements) {
    return scoreFrom(oddsSum(elements), elements.length);
}
function scoreFrom(s, n) {
    return s * (1 + (n - 1) * Math.min(3, 0.2 + 2.8 * Math.pow(Math.log(1 + s / 1e6) / Math.log(1501), 2)));
}
function fmtScore(n) {
    return Math.round(n).toLocaleString('en-US');
}
let displayMode = 'score';
try {
    displayMode = localStorage.getItem('elementalDisplay') === 'odds' ? 'odds' : 'score';
} catch (e) { }
// The rarity shown for a record, as odds or score depending on the setting (or a forced mode).
function rarityShown(rec, mode = displayMode) {
    if (mode === 'score') {
        return fmtScore(Number.isFinite(rec.score) ? rec.score : rollScore(rec.elements));
    }
    return Number.isFinite(rec.log) ? rarityText(rec.log) : (rec.rarity || '');
}
function rarityWord(mode = displayMode) {
    return mode === 'score' ? 'Score' : 'Odds';
}
const APP_VERSION = '2.2';
let quarks = 0;
try {
    quarks = parseFloat(localStorage.getItem('elementalQuarks')) || 0;
} catch (e) { }
function renderQuarks() {
    const el = $('quarkCount');
    if (el) {
        el.textContent = quarks.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}
function addQuarks(n) {
    quarks += n;
    try {
        localStorage.setItem('elementalQuarks', String(quarks));
    } catch (e) { }
    renderQuarks();
}
// an infinite or NaN balance can't pay for anything
const BAD_QUARKS = "Your quark balance isn't a normal number, so nothing can be bought.";
function canAfford(price) {
    return Number.isFinite(quarks) && quarks >= price;
}
// Quark Storm. After any press of Roll there's a 1 in 8,000 chance of a storm, which
// lasts the next 100 presses
const QSTORM_CHANCE = 1 / 8000;
const QSTORM_PRESSES = 100;
const QSTORM_MIN = 2;
const QSTORM_MAX = 30;
let qStorm = null;
try {
    const v = JSON.parse(localStorage.getItem('elementalQStorm') || 'null');
    qStorm = v && v.left > 0 ? { left: Math.min(QSTORM_PRESSES * 3, Math.floor(v.left)), got: +v.got || 0 } : null;
} catch (e) { }
function qStormSave() {
    try {
        if (qStorm) {
            localStorage.setItem('elementalQStorm', JSON.stringify(qStorm));
        } else {
            localStorage.removeItem('elementalQStorm');
        }
    } catch (e) { }
}
const qStormOn = () => !!(qStorm && qStorm.left > 0);
// ring 1 raises these
function qStormRange() {
    const s = (bondBonus().storm + catBonus().stormx) / 100;
    return [QSTORM_MIN + Math.round(2 * s), QSTORM_MAX + Math.round(20 * s)];
}
const eventChanceMult = () => 1 + (bondBonus().event + catBonus().event) / 100;
const qStormChance = () => QSTORM_CHANCE * eventChanceMult();
// deja-vium, lightning rod, event logger
function eventLength(base, storm) {
    return Math.round(base * (1 + (bondBonus().evlen + catBonus().evlen) / 100) * (storm && takeFlag('rod') ? 1.5 : 1) * (takeFlag('logger') ? 2 : 1));
}
function qStormStart() {
    qStorm = { left: eventLength(QSTORM_PRESSES, true), got: 0 };
    qStormSave();
}
// One press of Roll with count rolls
function qStormPress(count) {
    if (qStormOn()) {
        const [lo, hi] = qStormRange();
        const add = Array.from({ length: count }, () => lo + Math.floor(rnd() * (hi - lo + 1)));
        const sum = add.reduce((a, b) => a + b, 0);
        qStorm.left--;
        qStorm.got += sum;
        const ended = qStorm.left <= 0 ? qStorm.got : 0;
        if (ended) {
            qStorm = null;
        }
        qStormSave();
        return { add, sum, ended };
    }
    if (rnd() < qStormChance()) {
        qStormStart();
        return { started: true };
    }
    return null;
}
// supercollider + black hole, one event at a time
// at: newer events take a fixed draw, so they don't move the older ones' dice about
const GAMMA_MULT = 3;
const HYPER_MULT = 4;
const EVENTS = {
    collider: { name: 'Supercollider', chance: 1 / 16000, presses: 30, what: 'chain chance is 1 in 2' },
    hole: { name: 'Black Hole', chance: 1 / 12000, presses: 50, what: 'every roll is rolled twice and keeps the rarer' },
    gamma: { name: 'Gamma Ray Burst', chance: 1 / 16000, presses: 100, what: 'radioactive elements are 3× as common', at: 3 },
    hyper: { name: 'Hypercharged', chance: 1 / 12000, presses: 100, what: 'ions are 4× as common', at: 4, need: 'hyper' }
};
// technetium, promethium and everything from polonium on
const RADIOACTIVE = new Set(['Tc', 'Pm'].concat(ELEMENTS.slice(83).map(e => e[0])));
let evRun = null;
try {
    const v = JSON.parse(localStorage.getItem('elementalEvent') || 'null');
    evRun = v && EVENTS[v.id] && v.left > 0 ? { id: v.id, left: Math.min(EVENTS[v.id].presses * 4, Math.floor(v.left)), s: v.s, co: v.co, src: v.src, got: +v.got || 0 } : null;
} catch (e) { }
// the Vacuum runs alongside everything else, for a very long time
const VACUUM_CHANCE = 1 / 250000;
const VACUUM_PRESSES = 50000;
let vacRun = null;
try {
    const v = JSON.parse(localStorage.getItem('elementalVacuum') || 'null');
    vacRun = v && v.left > 0 ? { left: Math.min(VACUUM_PRESSES * 4, Math.floor(v.left)), s: v.s, src: v.src, got: +v.got || 0 } : null;
} catch (e) { }
function vacSave() {
    try {
        if (vacRun) {
            localStorage.setItem('elementalVacuum', JSON.stringify(vacRun));
        } else {
            localStorage.removeItem('elementalVacuum');
        }
    } catch (e) { }
}
const vacOn = () => !!vacRun;
// a Vacuum Seed starts a shorter one
const VACUUM_SEED = 5000;
function vacStart(s, len) {
    vacRun = { left: Math.round((len || VACUUM_PRESSES) * (1 + bondBonus().evlen / 100)), s };
    vacSave();
}
function vacuumPress(n) {
    if (vacRun) {
        vacRun.left--;
        const ended = vacRun.left <= 0;
        if (ended) {
            vacRun = null;
        }
        vacSave();
        return ended ? { ended: true } : null;
    }
    if (anyEventOn()) {
        return null;
    }
    acOpen(n, 1);
    try {
        if (acStream) {
            acStream.i = 5;
        }
        if (rnd() < VACUUM_CHANCE * eventChanceMult()) {
            vacStart(n);
            return { started: true };
        }
    } finally {
        acClose();
    }
    return null;
}
function evSave() {
    try {
        if (evRun) {
            localStorage.setItem('elementalEvent', JSON.stringify(evRun));
        } else {
            localStorage.removeItem('elementalEvent');
        }
    } catch (e) { }
}
// the Supercollider is a reward for finding nihonium
const colliderOn = () => discoveredSymbols().has(COLLIDER_SYMBOL);
const evOn = id => !!evRun && (!id || evRun.id === id);
const anyEventOn = () => qStormOn() || evOn();
const eventNow = () => qStormOn() ? 'storm' : evOn() ? evRun.id : null;
// from: the press it started on, and the catalyst that started it if there was one
function evStart(id, from) {
    evRun = Object.assign({ id, left: eventLength(EVENTS[id].presses, false) }, from);
    evSave();
}
function eventsPress(count, n) {
    acOpen(n, 1);
    try {
        return eventsRoll(count, n);
    } finally {
        acClose();
    }
}
function eventsRoll(count, n) {
    if (vacOn()) {
        return null;
    }
    if (evOn()) {
        const id = evRun.id;
        evRun.left--;
        if (evRun.left <= 0) {
            evRun = null;
        }
        evSave();
        return { ev: id, ended: !evRun };
    }
    const st = qStormPress(count);
    if (st) {
        return st;
    }
    for (const id of Object.keys(EVENTS)) {
        const E = EVENTS[id];
        if ((id === 'collider' && !colliderOn()) || (E.need && !bondBonus()[E.need])) {
            continue;
        }
        if (E.at != null && acStream) {
            acStream.i = E.at;
        }
        if (rnd() < E.chance * eventChanceMult()) {
            evStart(id, n == null ? {} : { s: n, co: colliderOn() });
            return { ev: id, started: true };
        }
    }
    return null;
}
// what each event has done so far, shown on its bar the way a Quark Storm shows its quarks
const EV_TALLY = {
    collider: ['1:2', n => n === 1 ? 'extra element chained' : 'extra elements chained', rolls => rolls.reduce((s, r) => s + r.elements.length - 1, 0)],
    hole: ['×2', n => n === 1 ? 'roll doubled' : 'rolls doubled', rolls => rolls.length],
    gamma: ['☢\uFE0E', n => n === 1 ? 'radioactive element' : 'radioactive elements', rolls => rolls.reduce((s, r) => s + r.elements.filter(e => RADIOACTIVE.has(e[0])).length, 0)],
    hyper: ['±', n => n === 1 ? 'ion' : 'ions', rolls => rolls.filter(r => r.ion).length],
    vacuum: ['∅', n => n === 1 ? 'void element' : 'void elements', rolls => rolls.filter(r => r.elements.some(e => isVoid(e[0]))).length]
};
function eventTally(evId, vac, rolls) {
    if (evId && EV_TALLY[evId] && evRun) {
        evRun.got = (evRun.got || 0) + EV_TALLY[evId][2](rolls);
        evSave();
    }
    if (vac && vacRun) {
        vacRun.got = (vacRun.got || 0) + EV_TALLY.vacuum[2](rolls);
        vacSave();
    }
}
const tallyHtml = (id, n) => '<span class="qs-got"><span class="ev-sym" aria-hidden="true">' + EV_TALLY[id][0] + '</span>' + formatNumber(n || 0) + ' ' + EV_TALLY[id][1](n || 0) + '</span>';
function renderVacuum() {
    const vb = $('vacBar');
    if (!vb) {
        return;
    }
    vb.hidden = !vacRun;
    if (vacRun) {
        vb.innerHTML = '<span class="qs-name">Vacuum</span><span class="qs-left"><b>' + formatNumber(vacRun.left) + '</b> ' + (vacRun.left === 1 ? 'roll' : 'rolls') + ' left</span>' + tallyHtml('vacuum', vacRun.got);
    }
}
function renderQStorm(last) {
    renderVacuum();
    const bar = $('qStormBar');
    if (!bar) {
        return;
    }
    bar.className = 'qstorm-bar' + (evOn() ? ' ev-' + evRun.id : '');
    if (evOn()) {
        bar.hidden = false;
        bar.innerHTML = '<span class="qs-name">' + EVENTS[evRun.id].name + '</span><span class="qs-left"><b>' + evRun.left + '</b> ' + (evRun.left === 1 ? 'roll' : 'rolls') + ' left</span>' + tallyHtml(evRun.id, evRun.got);
        return;
    }
    bar.hidden = !qStormOn();
    if (!bar.hidden) {
        bar.innerHTML = '<span class="qs-name">Quark Storm</span><span class="qs-left"><b>' + qStorm.left + '</b> ' + (qStorm.left === 1 ? 'roll' : 'rolls') + ' left</span>' +
            '<span class="qs-got"><span class="q-sym" aria-hidden="true">q</span> +' + formatNumber(Math.round(qStorm.got)) + (last ? '<small>+' + last + ' this roll</small>' : '') + '</span>';
    }
}
