// ---------------------------------------------------------------------------
// Catalyst shop. Restocks on fixed real-time boundaries; bought catalysts go to an
// inventory; one active catalyst per tier; the same catalyst extends; timers run
// in real time; single-roll catalysts cover one individual roll each.
// ---------------------------------------------------------------------------
const CAT_TIERS = [
    { name: 'Common', col: '#9fb0a8', p: 60 },
    { name: 'Uncommon', col: '#6fcf8a', p: 26 },
    { name: 'Rare', col: '#5aa8ff', p: 9.5 },
    { name: 'Epic', col: '#b48cff', p: 3.2 },
    { name: 'Legendary', col: '#f0c419', p: 1 },
    { name: 'Mythic', col: '#ff6b8a', p: 0.25 },
    { name: 'Secret', col: '#ffffff', p: 0.05 }
];
const CATALYSTS = [
    { id: 'alkali', name: 'Alkali Metals Catalyst', tier: 0, min: 10, fx: { fam: 'alkali', pct: 150 }, price: 8 },
    { id: 'alkaline', name: 'Alkaline Earth Catalyst', tier: 0, min: 10, fx: { fam: 'alkaline', pct: 150 }, price: 8 },
    { id: 'halogen', name: 'Halogen Catalyst', tier: 0, min: 10, fx: { fam: 'halogen', pct: 150 }, price: 8 },
    { id: 'noble', name: 'Noble Gas Catalyst', tier: 0, min: 10, fx: { fam: 'noble', pct: 150 }, price: 10 },
    { id: 'nonmetal', name: 'Nonmetal Catalyst', tier: 0, min: 10, fx: { fam: 'nonmetal', pct: 150 }, price: 7 },
    { id: 'spark', name: 'Spark', tier: 0, min: 10, fx: { luck: 25 }, price: 13 },
    { id: 'trickle', name: 'Quark Trickle', tier: 0, min: 15, fx: { quark: 25 }, price: 10 },
    { id: 'transition', name: 'Transition Metals Catalyst', tier: 1, min: 15, fx: { fam: 'transition', pct: 200 }, price: 40 },
    { id: 'metalloid', name: 'Metalloid Catalyst', tier: 1, min: 15, fx: { fam: 'metalloid', pct: 200 }, price: 35 },
    { id: 'post', name: 'Post-transition Catalyst', tier: 1, min: 15, fx: { fam: 'post', pct: 200 }, price: 35 },
    { id: 'kindling', name: 'Kindling', tier: 1, min: 15, fx: { luck: 60 }, price: 60 },
    { id: 'accelerant', name: 'Accelerant', tier: 1, min: 15, fx: { speed: 25 }, price: 30 },
    { id: 'primer', name: 'Chain Primer', tier: 1, min: 15, fx: { chain: 1 }, price: 50 },
    { id: 'lanth', name: 'Lanthanide Catalyst', tier: 2, min: 20, fx: { fam: 'lanth', pct: 300 }, price: 170 },
    { id: 'actin', name: 'Actinide Catalyst', tier: 2, min: 20, fx: { fam: 'actin', pct: 300 }, price: 270 },
    { id: 'ignition', name: 'Ignition', tier: 2, min: 20, fx: { luck: 150 }, price: 230 },
    { id: 'linked', name: 'Linked Reaction', tier: 2, rolls: 10, fx: { linked: true }, price: 130 },
    { id: 'surge', name: 'Quark Surge', tier: 2, min: 20, fx: { quark: 100 }, price: 300 },
    { id: 'superheavy', name: 'Superheavy Catalyst', tier: 3, min: 30, fx: { fam: 'unknown', pct: 400 }, price: 800 },
    { id: 'blaze', name: 'Blaze', tier: 3, min: 30, fx: { luck: 300 }, price: 1200 },
    { id: 'twin', name: 'Twin Reactor', tier: 3, min: 30, fx: { extra: 1 }, price: 1000 },
    { id: 'lens', name: 'Precision Lens', tier: 3, rolls: 1, fx: { rollLuck: 800 }, price: 600 },
    { id: 'inferno', name: 'Inferno', tier: 4, min: 60, fx: { luck: 500 }, price: 6200 },
    { id: 'storm', name: 'Chain Storm', tier: 4, min: 30, fx: { chainMax: true }, price: 3100 },
    { id: 'engine', name: 'Quark Engine', tier: 4, min: 60, fx: { quark: 400 }, price: 15000 },
    { id: 'prism', name: 'Focus Prism', tier: 4, rolls: 1, fx: { rollLuck: 1500 }, price: 5000 },
    { id: 'fusion', name: 'Fusion Core', tier: 5, min: 30, fx: { luck: 600 }, price: 18000 },
    { id: 'horizon', name: 'Event Horizon', tier: 5, rolls: 1, fx: { rollLuck: 3000 }, price: 13000 },
    { id: 'singularity', name: 'Singularity', tier: 6, rolls: 1, fx: { rollLuck: 10000 }, price: 33000 },
    { id: 'stone', name: "Philosopher's Stone", tier: 6, rolls: 1, fx: { unfound: true }, price: 27000 }
];
const CAT = Object.fromEntries(CATALYSTS.map(c => [c.id, c]));
function catEffect(c) {
    const f = c.fx;
    if (f.fam) {
        return `+${f.pct}% chance to roll ${FAMILY_ONE[f.fam] === 'superheavy' ? 'a superheavy (Mt to Lv)' : (/^[aeiou]/.test(FAMILY_ONE[f.fam]) ? 'an ' : 'a ') + FAMILY_ONE[f.fam]}`;
    }
    if (f.luck) {
        return `+${f.luck}% luck`;
    }
    if (f.quark) {
        return f.quark === 100 ? 'Double quarks earned' : f.quark === 400 ? 'Five times the quarks earned' : `+${f.quark}% quarks earned`;
    }
    if (f.speed) {
        return `+${f.speed}% scanner speed`;
    }
    if (f.chain) {
        return 'Chain chance one step better (1 in 8 to 1 in 7 at base, never past 1 in 3)';
    }
    if (f.chainMax) {
        return 'Chain chance at its maximum, 1 in 3';
    }
    if (f.extra) {
        return '+1 bonus roll on every roll, up to the maximum of 3';
    }
    if (f.linked) {
        return 'Each roll chains at least once';
    }
    if (f.rollLuck) {
        return `+${f.rollLuck.toLocaleString('en-US')}% luck` + (f.rollLuck >= 10000 ? ', which guarantees Uranium' : '');
    }
    return "The roll gives an element you haven't found yet (+3,000% luck if you've found them all)";
}
const catLength = c => c.rolls ? (c.rolls === 1 ? 'Single roll' : `Next ${c.rolls} rolls`) : `Timed, ${c.min} min`;
// ---- saved state
function loadJSON(k, d) {
    try {
        return JSON.parse(localStorage.getItem(k) || 'null') || d;
    } catch (e) {
        return d;
    }
}
let shopState = loadJSON('elementalShop', { slot: -1, stock: [] });
let catInv = loadJSON('elementalCatInv', {});
let catActive = loadJSON('elementalCatActive', {});
function saveCats() {
    try {
        localStorage.setItem('elementalShop', JSON.stringify(shopState));
        localStorage.setItem('elementalCatInv', JSON.stringify(catInv));
        localStorage.setItem('elementalCatActive', JSON.stringify(catActive));
    } catch (e) { }
}
// ---- active catalysts
function pruneActive() {
    let ch = false;
    const now = Date.now();
    Object.keys(catActive).forEach(t => {
        const a = catActive[t];
        if (!a || !CAT[a.id] || (a.until && a.until <= now) || (a.rolls != null && a.rolls <= 0)) {
            delete catActive[t];
            ch = true;
        }
    });
    if (ch) {
        saveCats();
        buffCache = weightCache = null;
    }
    return catActive;
}
function activeList() {
    pruneActive();
    return Object.keys(catActive).sort((a, b) => a - b).map(t => ({ tier: +t, a: catActive[t], c: CAT[catActive[t].id] }));
}
// totals from active timed catalysts, for computeBuffs and weightTable
function catBonus() {
    const r = {
        luck: 0, speed: 0, quark: 0, extra: 0, chain: 0, chainMax: false, fam: {}
    };
    activeList().forEach(({ a, c }) => {
        if (!a.until) {
            return;
        }
        const f = c.fx;
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
    });
    return r;
}
// the soonest moment an active catalyst runs out, so cached buffs refresh then
function catNextExpiry() {
    let t = Infinity;
    Object.values(catActive).forEach(a => {
        if (a.until) {
            t = Math.min(t, a.until);
        }
    });
    return t;
}
function useCatalyst(id, n) {
    const c = CAT[id];
    const have = catInv[id] || 0;
    n = Math.max(0, Math.min(have, Math.floor(n)));
    if (!n) {
        return 'You have none of these.';
    }
    pruneActive();
    const cur = catActive[c.tier];
    if (cur && cur.id !== id) {
        const o = CAT[cur.id];
        return `${o.name} is already running for ${CAT_TIERS[c.tier].name.toLowerCase()} catalysts (${catLeft(cur)} left). Only one ${CAT_TIERS[c.tier].name.toLowerCase()} catalyst can be active at a time.`;
    }
    if (c.rolls) {
        catActive[c.tier] = { id, rolls: (cur ? cur.rolls : 0) + c.rolls * n };
    } else {
        const base = cur ? cur.until : Date.now();
        catActive[c.tier] = { id, until: base + c.min * 60000 * n };
    }
    catInv[id] = have - n;
    if (!catInv[id]) {
        delete catInv[id];
    }
    saveCats();
    buffCache = weightCache = null;
    return '';
}
function catLeft(a) {
    if (a.rolls != null) {
        return a.rolls + (a.rolls === 1 ? ' roll' : ' rolls');
    }
    return fmtClock(Math.max(0, a.until - Date.now()) / 1000);
}
function fmtClock(s) {
    s = Math.ceil(s);
    if (s >= 172800) {
        const d = Math.floor(s / 86400);
        return `${d.toLocaleString('en-US')}d ${Math.floor(s % 86400 / 3600)}h`;
    }
    const h = Math.floor(s / 3600);
    const m = Math.floor(s % 3600 / 60);
    const ss = s % 60;
    return h ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${m}:${String(ss).padStart(2, '0')}`;
}
// single-roll catalysts: take one charge for one individual roll
function takeRollCharge() {
    pruneActive();
    const out = { rollLuck: 0, unfound: false, linked: false, used: [] };
    Object.keys(catActive).forEach(t => {
        const a = catActive[t];
        if (a.rolls == null || a.rolls <= 0) {
            return;
        }
        out.used.push(CAT[a.id].name);
        const f = CAT[a.id].fx;
        if (f.rollLuck) {
            out.rollLuck += f.rollLuck;
        }
        if (f.unfound) {
            out.unfound = true;
        }
        if (f.linked) {
            out.linked = true;
        }
        a.rolls -= 1;
    });
    pruneActive();
    saveCats();
    return out;
}
function clearCatalyst(tier) {
    delete catActive[tier];
    saveCats();
    buffCache = weightCache = null;
}
// ---- the shop
function shopPeriodMs() {
    const b = bondBonus();
    return Math.max(5, 20 - b.refresh) * 60000;
}
const shopSlots = () => Math.min(5, 2 + bondBonus().slots);
function shopPrice(c) {
    return Math.max(1, Math.round(c.price * (1 - Math.min(90, bondBonus().price) / 100)));
}
// The shop's clock: the server's time once known (see "While you were away"), so moving
// the device clock forward doesn't restock it. Declared here so the shop can use it early.
var clockBase = null;
var clockTried = false;
function shopNow() {
    return clockBase ? clockBase.server + (performance.now() - clockBase.perf) : Date.now();
}
// The time of the next restock is saved, so a change to the restock time (bonds can
// shorten it) applies from the next restock rather than restocking on the spot.
function shopCheck() {
    const P = shopPeriodMs();
    const now = shopNow();
    const want = shopSlots();
    if (!shopState.nextAt) {
        // older saves: keep the stock and timer they already had
        shopState.nextAt = shopState.slot >= 0 && shopState.period ? (shopState.slot + 1) * shopState.period : now + P;
    }
    // a restock time further off than one full period can only come from a wrong clock
    if (shopState.nextAt > now + P + 60000 && (clockBase || clockTried)) {
        shopState.nextAt = now + P;
    }
    // wait until the clock has been checked before restocking (the first few seconds only)
    if (now >= shopState.nextAt && (clockBase || clockTried || !shopState.stock.length)) {
        shopState.nextAt = (now - shopState.nextAt) / P > 1000 ? now + P : shopState.nextAt;
        while (shopState.nextAt <= now) {
            shopState.nextAt += P;
        }
        shopState.stock = [];
    }
    while (shopState.stock.length < want) {
        shopState.stock.push({ id: shopRoll(), sold: false });
    }
    saveCats();
    return shopState;
}
function shopRoll() {
    const boost = bondBonus().stock / 100;
    const w = CAT_TIERS.map((t, i) => t.p * (1 + boost * i / 3));
    const tot = w.reduce((a, b) => a + b, 0);
    let r = Math.random() * tot;
    let tier = 0;
    for (; tier < w.length - 1; tier++) {
        r -= w[tier];
        if (r <= 0) {
            break;
        }
    }
    const pool = CATALYSTS.filter(c => c.tier === tier);
    return pool[Math.floor(Math.random() * pool.length)].id;
}
// a new save has no stock yet, so stock the shop before reading its timer
function shopNextIn() {
    if (!shopState.nextAt) {
        shopCheck();
    }
    return shopState.nextAt - shopNow();
}
function buyStock(i) {
    const s = shopState.stock[i];
    if (!s || s.sold) {
        return;
    }
    const c = CAT[s.id];
    const p = shopPrice(c);
    if (quarks < p) {
        return;
    }
    addQuarks(-p);
    s.sold = true;
    catInv[s.id] = (catInv[s.id] || 0) + 1;
    saveCats();
    renderShop();
    $('shopMsg').textContent = `${c.name} added to your inventory.`;
}
const tierChip = t => `<span class="cat-tier" style="--tc:${CAT_TIERS[t].col}">${CAT_TIERS[t].name}</span>`;
function renderShop() {
    if (!$('shopStock')) {
        return;
    }
    shopCheck();
    $('shopTimer').textContent = fmtClock(shopNextIn() / 1000);
    $('shopStock').innerHTML = shopState.stock.map((s, i) => {
        const c = CAT[s.id];
        const p = shopPrice(c);
        return `<article class="cat-card${s.sold ? ' sold' : ''}" style="--tc:${CAT_TIERS[c.tier].col}">${tierChip(c.tier)}<h3>${c.name}</h3><p>${catEffect(c)}</p><p class="cat-len">${catLength(c)}</p><button class="${s.sold ? 'ghost' : 'primary'} cat-buy" data-i="${i}"${s.sold || quarks < p ? ' disabled' : ''}>${s.sold ? 'Bought' : `<span class="q-sym">q</span> ${p.toLocaleString('en-US')}`}</button></article>`;
    }).join('');
    $('shopSlotsNote').textContent = `${shopState.stock.length} of 5 stock slots open`;
    renderActiveCats();
}
function renderActiveCats() {
    const list = activeList();
    const html = list.length ? list.map(({ tier, a, c }) => `<div class="act-row" style="--tc:${CAT_TIERS[tier].col}">${tierChip(tier)}<strong>${c.name}</strong><span class="act-left" data-tier="${tier}">${catLeft(a)}</span></div>`).join('') : '<p class="muted">No catalysts active.</p>';
    ['catActive', 'rollCats'].forEach(k => {
        const el = $(k);
        if (el) {
            el.innerHTML = list.length ? (k === 'catActive' ? '<div class="inv-sect"><span>Active</span></div>' : '') + html : '';
        }
    });
    const cl = $('catClear');
    if (cl) {
        cl.innerHTML = list.length ? list.map(({ tier, c }) => `<div class="act-row" style="--tc:${CAT_TIERS[tier].col}">${tierChip(tier)}<strong>${c.name}</strong><button class="ghost cat-clear" data-tier="${tier}">Clear</button></div>`).join('') : '<p class="muted">No catalysts active.</p>';
    }
    const hs = $('homeShop');
    if (hs) {
        hs.textContent = 'Restock in ' + fmtClock(Math.max(0, shopNextIn()) / 1000);
    }
}
$('shopStock').addEventListener('click', e => {
    const b = e.target.closest('.cat-buy');
    if (b) {
        buyStock(+b.dataset.i);
    }
});
// ---- the inventory page: a grid of owned catalysts and a detail panel for the selected one
let invSel = null;
const catMark = c => {
    const w = c.name.replace(/Catalyst|'s/g, '').trim().split(/[\s-]+/);
    return w.length > 1 ? w[0][0] + w[1][0].toLowerCase() : w[0].slice(0, 2);
};
function renderCatInv() {
    if (!$('catInv')) {
        return;
    }
    const inv = Object.keys(catInv).filter(id => catInv[id] > 0 && CAT[id]).sort((a, b) => CAT[b].tier - CAT[a].tier || CAT[a].name.localeCompare(CAT[b].name));
    if (!inv.includes(invSel)) {
        invSel = inv[0] || null;
    }
    $('catInv').innerHTML = inv.length ? inv.map(id => {
        const c = CAT[id];
        return `<button class="inv-tile${id === invSel ? ' sel' : ''}" data-sel="${id}" style="--tc:${CAT_TIERS[c.tier].col}"><span class="it-name">${c.name}</span><span class="it-n">×${catInv[id].toLocaleString('en-US')}</span></button>`;
    }).join('') : '<p class="muted inv-empty">Nothing here yet. Catalysts you buy in the shop wait here until you use them.</p>';
    const d = $('invDetail');
    if (!invSel) {
        d.innerHTML = '<div class="inv-preview" style="--tc:var(--soft)"><span class="ip-mark">–</span></div><p class="muted">Select a catalyst to see it here.</p>';
    } else {
        const c = CAT[invSel];
        const T = CAT_TIERS[c.tier];
        const a = catActive[c.tier];
        const status = a && a.id === invSel ? `<p class="ip-status on">Running: ${catLeft(a)} left. Using more adds to it.</p>` : a ? `<p class="ip-status off">${CAT[a.id].name} is running for ${T.name.toLowerCase()} catalysts (${catLeft(a)} left), so this one can't be used until it ends.</p>` : '';
        const n = catInv[invSel];
        d.innerHTML = `<div class="inv-preview" style="--tc:${T.col}"><span class="ip-mark">${catMark(c)}</span><span class="ip-tier">${T.name}</span></div>
<div class="ip-use"><button class="primary" data-use="1">Use</button>${n > 1 ? '<button class="ghost" data-use="pick">Use…</button><button class="ghost" data-use="all">Use all</button>' : ''}</div>
<p class="shop-msg" id="invMsg" aria-live="polite"></p>
<div class="ip-desc" style="--tc:${T.col}"><h2>${c.name}</h2>${tierChip(c.tier)}<p class="ip-effect">${catEffect(c)}</p><dl class="stats"><div><dt>Lasts</dt><dd>${catLength(c)}</dd></div><div><dt>You have</dt><dd>×${n.toLocaleString('en-US')}</dd></div>${c.rolls ? '' : `<div><dt>Using all</dt><dd>${fmtClock(c.min * 60 * n)}</dd></div>`}</dl>${status}</div>`;
    }
    renderActiveCats();
}
$('catInv').addEventListener('click', e => {
    const t = e.target.closest('[data-sel]');
    if (!t) {
        return;
    }
    invSel = t.dataset.sel;
    renderCatInv();
    if (innerWidth < 760) {
        $('invDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
$('invDetail').addEventListener('click', e => {
    const b = e.target.closest('[data-use]');
    if (!b || !invSel) {
        return;
    }
    const id = invSel;
    const have = catInv[id];
    const n = b.dataset.use === 'all' ? have : b.dataset.use === 'pick' ? parseInt(prompt(`How many ${CAT[id].name} to use? You have ${have}.`, '1'), 10) : 1;
    if (!n || n < 1) {
        return;
    }
    const msg = useCatalyst(id, n);
    renderCatInv();
    const m = $('invMsg');
    if (m) {
        m.textContent = msg || `${n > 1 ? n + ' × ' : ''}${CAT[id].name} used.`;
        m.classList.toggle('ok', !msg);
    }
    renderRollStats();
});
$('catClear').addEventListener('click', e => {
    const b = e.target.closest('.cat-clear');
    if (!b) {
        return;
    }
    const t = +b.dataset.tier;
    const a = catActive[t];
    if (!a) {
        return;
    }
    const c = CAT[a.id];
    if (!confirm(`Clear ${c.name}?\n\nIt stops working straight away with ${catLeft(a)} left. You will not get it back.`)) {
        return;
    }
    if (!confirm(`Are you sure? This can't be undone.`)) {
        return;
    }
    clearCatalyst(t);
    renderActiveCats();
    renderRollStats();
});
// tick timers once a second
setInterval(() => {
    const before = Object.keys(catActive).length;
    pruneActive();
    if (Object.keys(catActive).length !== before) {
        renderRollStats();
    }
    if ($('shop') && $('shop').classList.contains('active')) {
        if (shopNow() >= (shopState.nextAt || 0)) {
            renderShop();
        } else {
            $('shopTimer').textContent = fmtClock(Math.max(0, shopNextIn()) / 1000);
            document.querySelectorAll('#catActive .act-left').forEach(el => {
                const a = catActive[el.dataset.tier];
                if (a) {
                    el.textContent = catLeft(a);
                }
            });
        }
    } else if ($('catinv').classList.contains('active')) {
        document.querySelectorAll('#catActive .act-left').forEach(el => {
            const a = catActive[el.dataset.tier];
            if (a) {
                el.textContent = catLeft(a);
            }
        });
    } else {
        renderActiveCats();
    }
}, 1000);
