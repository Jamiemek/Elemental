// Dice the server can roll again. Each press of Roll takes the next number from this
// device's counter and rolls from the device's seed, so the server can check a find later
let acDev = null;
try {
    acDev = localStorage.getItem('elementalDevice');
} catch (e) { }
if (!/^[a-z0-9]{4,16}$/.test(acDev || '')) {
    acDev = Math.random().toString(36).slice(2, 10).padEnd(6, '0');
    try {
        localStorage.setItem('elementalDevice', acDev);
    } catch (e) { }
}
// seeds are per account: d for this device's rolls, s for the shop
let acKeys = null;
let acCount = 0;
let acAway = 0;
try {
    const v = JSON.parse(localStorage.getItem('acDice') || 'null');
    if (v && v.u && Array.isArray(v.d) && Array.isArray(v.s)) {
        acKeys = v;
    }
    const c = JSON.parse(localStorage.getItem('acPress') || 'null');
    if (c && acKeys && c.u === acKeys.u) {
        acCount = Math.max(0, Math.floor(c.n) || 0);
        acAway = Math.max(0, Math.floor(c.a) || 0);
    }
} catch (e) { }
function acSaveCount() {
    try {
        localStorage.setItem('acPress', JSON.stringify({ u: acKeys ? acKeys.u : '', n: acCount, a: acAway }));
    } catch (e) { }
}
const acWords = hex => [0, 8, 16, 24].map(i => parseInt(hex.slice(i, i + 8), 16) >>> 0);
function acMix(h) {
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
}
// a number from 0 up to 1, made from a seed and four whole numbers
function acDraw(w, a, b, c, d) {
    let h = acMix(w[0] ^ a);
    h = acMix(h ^ w[1] ^ b);
    h = acMix(h ^ w[2] ^ c);
    h = acMix(h ^ w[3] ^ d);
    const lo = acMix(h ^ 0x9e3779b9);
    return (h * 2097152 + (lo >>> 11)) / 9007199254740992;
}
// while a stream is open, rnd() draws from it; otherwise it's just Math.random
let acStream = null;
function rnd() {
    if (!acStream) {
        return Math.random();
    }
    return acDraw(acStream.w, acStream.a, acStream.b, acStream.c, acStream.i++);
}
// tags: 1 events, 2 drops, 16 + k for roll k of a press
const acOpen = (n, tag) => {
    acStream = n == null || !acKeys ? null : { w: acKeys.d, a: n, b: tag, c: 0, i: 0 };
};
const acShop = (r, j) => {
    acStream = acKeys && r != null ? { w: acKeys.s, a: r, b: 0, c: j, i: 0 } : null;
};
const acClose = () => {
    acStream = null;
};
function acPress() {
    if (!acKeys) {
        return null;
    }
    const n = acCount++;
    acSaveCount();
    return n;
}
// rolls while away are numbered on their own, from 2^31 up, so the presses you make yourself stay in a row
function acAwayPress() {
    if (!acKeys) {
        return null;
    }
    const n = 2147483648 + acAway++;
    acSaveCount();
    return n;
}
// the elements picked, in order, so the server can follow along
let acTrace = null;
// catalysts that change a roll or start an event have to show where they came from
const acTracked = c => !!(c && (c.rolls || c.fx.start));
function acParams(b, more) {
    const F = {};
    Object.keys(b.fam || {}).forEach(k => {
        if (b.fam[k]) {
            F[k] = b.fam[k];
        }
    });
    return Object.assign({ L: b.luck, F, J: b.jokeMult, V: b.level ? 1 : 0, P: jokesOn() ? 1 : 0, M: jokeMix ? 1 : 0, I: bondBonus().ion ? 1 : 0 }, more);
}
// the event behind a press, if it's one that changes rolls
function acEvent() {
    if (!evRun || evRun.s == null) {
        return null;
    }
    return { id: evRun.id, s: evRun.s, co: evRun.co ? 1 : 0, c: evRun.src ? 1 : 0, src: evRun.src || null };
}
// catalysts from before this existed: the server allows each account a few, once
function acLegacyCount() {
    const out = {};
    CATALYSTS.filter(acTracked).forEach(c => {
        const inInv = Math.max(0, (catInv[c.id] || 0) - (catSrc[c.id] || []).length);
        const act = Object.values(catActive).filter(a => a.id === c.id && a.rolls > 0)
            .reduce((s, a) => s + Math.max(0, Math.ceil(a.rolls / c.rolls) - (a.src || []).length), 0);
        if (inInv + act) {
            out[c.id] = inInv + act;
        }
    });
    return out;
}
function acLegacyApply(grant) {
    const used = new Set();
    Object.values(catSrc).forEach(l => l.forEach(s => used.add(s)));
    Object.values(catActive).forEach(a => (a.src || []).forEach(s => used.add(s)));
    Object.keys(grant).forEach(id => {
        const c = CAT[id];
        if (!acTracked(c)) {
            return;
        }
        const free = [];
        for (let i = 0; i < grant[id]; i++) {
            if (!used.has('o|' + id + '|' + i)) {
                free.push('o|' + id + '|' + i);
            }
        }
        const list = catSrc[id] || [];
        while (free.length && list.length < (catInv[id] || 0)) {
            list.push(free.shift());
        }
        if (list.length) {
            catSrc[id] = list;
        }
        Object.values(catActive).forEach(a => {
            if (a.id !== id || !(a.rolls > 0)) {
                return;
            }
            a.src = a.src || [];
            while (free.length && a.src.length < Math.ceil(a.rolls / c.rolls)) {
                a.src.push(free.shift());
            }
        });
    });
    saveCats();
}
let acReq = null;
function acFetch() {
    if (!acReq) {
        acReq = acLoad().finally(() => acReq = null);
    }
    return acReq;
}
async function acLoad() {
    if (!sb || !cloudUser) {
        return;
    }
    const { data, error } = await sb.rpc('dice_seeds', { p_dev: acDev, p_legacy: acLegacyCount() });
    if (error || !data || !data.d) {
        return;
    }
    if (!acKeys || acKeys.u !== cloudUser.id) {
        acCount = 0;
        acAway = 0;
    }
    acKeys = { u: cloudUser.id, d: acWords(data.d), s: acWords(data.s) };
    try {
        localStorage.setItem('acDice', JSON.stringify(acKeys));
    } catch (e) { }
    acCount = Math.max(acCount, (data.n == null ? -1 : data.n) + 1);
    acAway = Math.max(acAway, (data.a == null ? -1 : data.a) + 1);
    acSaveCount();
    if (data.legacy) {
        acLegacyApply(data.legacy);
    }
}
