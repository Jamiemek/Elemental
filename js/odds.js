function activeBuffStats() {
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
    const denom = Math.max(3, 8 - 0.625 * Math.min(8, chainSteps + bd.chain));
    return {
        found, luck: (luck + bd.add) * bd.mult + cb.luck, speed: speed + cb.speed, autoUnlocked: autoUnlock, autoSpeed: autoSpeed + bd.auto, autoGap: Math.max(AUTO_MIN_GAP, AUTO_BASE_GAP / (1 + (autoSpeed + bd.auto) / 100)), extra: Math.min(3, extra + bd.extra + cb.extra), chainSteps: Math.min(8, chainSteps), chainDenom: cb.chainMax ? 3 : Math.max(3, denom - cb.chain), fam: cb.fam, quark: cb.quark, exp: catNextExpiry()
    };
}
function weightTable(extraLuck, only) {
    const b = activeBuffStats();
    if (!extraLuck && !only && weightCache && weightCache.b === b) {
        return weightCache;
    }
    const luck = b.luck + (extraLuck || 0);
    let total = 0;
    const w = ELEMENTS.map(e => {
        if (only && !only(e)) {
            return 0;
        }
        const v = (1 / e[2]) * Math.pow(1 + 1.5 * (Math.log10(e[2] + 1) / 3), (luck / 100) / 1.5) * (1 + (b.fam[familyOf(e[0])] || 0) / 100);
        total += v;
        return v;
    });
    const t = { w, total, b };
    if (!extraLuck && !only) {
        weightCache = t;
    }
    return t;
}
// one element, with the active buffs; `extraLuck` and `only` come from single-roll catalysts
function weightedElement(extraLuck, only) {
    const { w, total } = weightTable(extraLuck, only);
    let r = Math.random() * total;
    for (let i = 0; i < ELEMENTS.length; i++) {
        r -= w[i];
        if (r <= 0) {
            return ELEMENTS[i];
        }
    }
    return ELEMENTS[ELEMENTS.length - 1];
}
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
const SYM_IDX = Object.fromEntries(ELEMENTS.map((e, i) => [e[0], i]));
// Odds are always base odds: no luck, chain or other buffs are counted.
// Shown odds = element 1 base odds x 8 x element 2 base odds x 8 x ... using each
// element's listed base odds and the base chain chance of 1 in 8.
function exactRarity(elements, guaranteedExtras = 0) {
    const n = Math.max(1, elements.length - guaranteedExtras);
    let log10 = -(n - 1) * Math.log10(BASE_CHAIN);
    elements.forEach(e => log10 -= Math.log10(ELEMENTS[SYM_IDX[e[0]]][2]));
    return log10;
}
function rarityText(log) {
    const value = 10 ** (-log);
    if (Number.isFinite(value) && value < 1e21) {
        return '1/' + Math.max(1, Math.round(value)).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return '≈ 1/' + value.toExponential(2).replace('+', '');
}
// Quarks earned by one roll. Everyday rolls (score up to 10,000) earn √score × 0.1.
// Above that the curve steepens (score^0.75), so rare finds feel like a reward:
// Flerovium about 345, Uranium about 2,000. Even with a quark catalyst, no single roll
// pays enough for a legendary catalyst, so one lucky roll can't buy out the shop.
const QUARK_RATE = 0.1;
const QUARK_KNEE = 10000;
function quarksFor(score, mult) {
    const base = score <= QUARK_KNEE ? Math.sqrt(score) : Math.pow(score, 0.75) / Math.pow(QUARK_KNEE, 0.25);
    return base * QUARK_RATE * mult;
}
// Score = the base odds of every element in the roll added together.
function rollScore(elements) {
    return elements.reduce((sum, e) => sum + ELEMENTS[SYM_IDX[e[0]]][2], 0);
}
function fmtScore(n) {
    return Math.round(n).toLocaleString('en-US');
}
let displayMode = 'odds';
try {
    displayMode = localStorage.getItem('elementalDisplay') === 'score' ? 'score' : 'odds';
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
const APP_VERSION = '1.51';
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
// ---- Quark Storm. After any press of Roll there's a 1 in 8,000 chance of a storm, which
// lasts the next 100 presses. While it lasts, every roll earns 2 to 30 extra quarks on top
// of its usual quarks (quark catalysts don't multiply these). A storm can't start while one
// is already running. Away rolls count too.
const QSTORM_CHANCE = 1 / 8000;
const QSTORM_PRESSES = 100;
const QSTORM_MIN = 2;
const QSTORM_MAX = 30;
let qStorm = null;
try {
    const v = JSON.parse(localStorage.getItem('elementalQStorm') || 'null');
    qStorm = v && v.left > 0 ? { left: Math.min(QSTORM_PRESSES, Math.floor(v.left)), got: +v.got || 0 } : null;
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
// One press of Roll with `count` rolls. Returns { add: storm quarks for each roll, sum, ended }
// while a storm runs, { started: true } when this press starts one, otherwise null.
function qStormPress(count) {
    if (qStormOn()) {
        const add = Array.from({ length: count }, () => QSTORM_MIN + Math.floor(Math.random() * (QSTORM_MAX - QSTORM_MIN + 1)));
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
    if (Math.random() < QSTORM_CHANCE) {
        qStorm = { left: QSTORM_PRESSES, got: 0 };
        qStormSave();
        return { started: true };
    }
    return null;
}
function renderQStorm(last) {
    const bar = $('qStormBar');
    if (!bar) {
        return;
    }
    bar.hidden = !qStormOn();
    if (!bar.hidden) {
        bar.innerHTML = '<span class="qs-name">Quark Storm</span><span class="qs-left"><b>' + qStorm.left + '</b> ' + (qStorm.left === 1 ? 'roll' : 'rolls') + ' left</span>' +
            '<span class="qs-got"><span class="q-sym" aria-hidden="true">q</span> +' + formatNumber(Math.round(qStorm.got)) + (last ? '<small>+' + last + ' this roll</small>' : '') + '</span>';
    }
}
