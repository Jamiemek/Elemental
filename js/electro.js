// Electrolysis, from outer ring 2. Fusion builds a compound the bonds tree asks for out of
// elements you hold, fission splits a compound back into its elements. Both cost quarks.
// What they make isn't a roll: it goes in its own store, can pay for bond slots, and never
// counts as found or towards your rolls
var madeStore = {};
try {
    const v = JSON.parse(localStorage.getItem('elementalMade') || '{}');
    Object.keys(v).forEach(f => {
        const m = v[f];
        const els = [];
        Object.entries(parseFormula(f)).forEach(([s, n]) => {
            for (let i = 0; i < n && elementBySymbol[s]; i++) {
                els.push(elementBySymbol[s]);
            }
        });
        if (els.length && m.count > (m.spent || 0)) {
            madeStore[f] = { formula: f, elements: els, count: m.count, spent: m.spent || 0, made: true };
        }
    });
} catch (e) { }
function madeSave() {
    const out = {};
    Object.values(madeStore).forEach(m => {
        if (m.count > (m.spent || 0)) {
            out[m.formula] = { count: m.count, spent: m.spent || 0 };
        } else {
            delete madeStore[m.formula];
        }
    });
    try {
        localStorage.setItem('elementalMade', JSON.stringify(out));
    } catch (e) { }
}
function madeAdd(formula, els, n) {
    const m = madeStore[formula] || (madeStore[formula] = { formula, elements: els, count: 0, spent: 0, made: true });
    m.count += n;
}
// made things that could pay for a bond requirement
function madeFor(q) {
    // the bonds tree can ask before this file has loaded
    if (!madeStore) {
        return [];
    }
    return Object.values(madeStore).filter(m => {
        if (q.t === 'el') {
            return m.formula === q.k;
        }
        if (q.t === 'fam') {
            return m.elements.length === 1 && familyOf(m.elements[0][0]) === q.k;
        }
        if (q.t === 'has') {
            return m.elements.length > 1 && m.elements.some(e => e[0] === q.k);
        }
        return q.t === 'cp' && (m.norm || (m.norm = normalizeFormula(m.formula))) === q.k;
    });
}
const elxOn = () => bondBonus().electrolysis;
const elsOf = f => {
    const out = [];
    Object.entries(parseFormula(f)).forEach(([s, n]) => {
        for (let i = 0; i < n; i++) {
            out.push(elementBySymbol[s]);
        }
    });
    return out;
};
// from about 100,000 for the easy ones to 500,000 for the hardest; splitting is far cheaper
const r5k = n => Math.round(n / 5000) * 5000;
function fusePrice(els) {
    const f = Math.max(0, Math.min(1, (-exactRarity(els) - 2) / 8));
    return r5k(100000 + 400000 * Math.pow(f, 1.2));
}
const splitPrice = els => Math.max(10000, r5k(fusePrice(els) * 0.15 * elxCut()));
// catalysts can make Electrolysis cheaper while they run
const elxCut = () => 1 - Math.min(75, catBonus().elxcut + bondBonus().elxcut) / 100;
// the compounds the tree asks for, and how many open slots want each
let elxMemo = null;
function fusable() {
    if (elxMemo && elxMemo.v === netVer) {
        elxMemo.list.forEach(x => x.price = r5k(x.base * elxCut()));
        return elxMemo.list;
    }
    const m = new Map();
    net().nodes.forEach(n => {
        if (n.req.t !== 'cp') {
            return;
        }
        const x = m.get(n.req.k) || { k: n.req.k, f: n.req.l, name: n.req.nm, open: 0 };
        if (!netFilled(n.id)) {
            x.open++;
        }
        m.set(n.req.k, x);
    });
    const list = [...m.values()];
    list.forEach(x => {
        x.els = elsOf(x.f);
        x.base = fusePrice(x.els);
        x.price = r5k(x.base * elxCut());
        x.need = parseFormula(x.f);
    });
    // ones an open slot still wants come first
    list.sort((a, b) => (b.open > 0) - (a.open > 0) || a.price - b.price || a.f.localeCompare(b.f));
    elxMemo = { v: netVer, list };
    return list;
}
// spare copies of an element: rolled ones not spent on bonds, plus made ones
const spareEl = sym => eligible({ t: 'el', k: sym }).reduce((s, x) => s + x.n, 0);
function fuse(x) {
    if (!elxOn() || !canAfford(x.price)) {
        return false;
    }
    const plans = Object.entries(x.need).map(([s, n]) => payPlan({ t: 'el', k: s, n }));
    if (plans.some(p => !p)) {
        return false;
    }
    plans.forEach(p => p.forEach(y => y.c.spent = (y.c.spent || 0) + y.take));
    addQuarks(-x.price);
    madeAdd(x.f, x.els, 1);
    madeSave();
    save();
    return true;
}
// compounds you could split: rolled ones with copies to spare, and made ones
function splittable() {
    const out = [];
    collection.forEach(c => {
        const n = (c.count || 1) - (c.spent || 0);
        if (c.elements && c.elements.length > 1 && n > 0 && !c.elements.some(e => isJoke(e[0]) || isVoid(e[0]))) {
            out.push({ c, n });
        }
    });
    Object.values(madeStore).forEach(m => {
        const n = m.count - m.spent;
        if (m.elements.length > 1 && n > 0) {
            out.push({ c: m, n });
        }
    });
    return out;
}
function split(c) {
    const price = splitPrice(c.elements);
    if (!elxOn() || !canAfford(price) || (c.count || 1) - (c.spent || 0) < 1) {
        return false;
    }
    c.spent = (c.spent || 0) + 1;
    addQuarks(-price);
    const counts = {};
    c.elements.forEach(e => counts[e[0]] = (counts[e[0]] || 0) + 1);
    Object.entries(counts).forEach(([s, n]) => madeAdd(s, [elementBySymbol[s]], n));
    madeSave();
    save();
    return true;
}
// the page
let elxTab = 'fuse';
let elxFind = '';
const ELX_SHOW = 60;
// sort and filter choices for each tab, kept between visits
const ELX_SORTS = {
    fuse: [['need', 'Needed by open slots'], ['near', 'Closest to ready'], ['cheap', 'Cheapest first'], ['dear', 'Dearest first'], ['slots', 'Most open slots'], ['az', 'Formula A to Z']],
    split: [['most', 'Most of it back'], ['rare', 'Rarest first'], ['spare', 'Most spare copies'], ['helps', 'Helps fusion most'], ['cheap', 'Cheapest first'], ['gives', 'Most elements back'], ['az', 'Formula A to Z']]
};
const ELX_FILTERS = {
    fuse: [['ready', 'Ready to fuse'], ['open', 'Wanted by an open slot'], ['afford', 'Can afford'], ['madeone', 'Already made one']],
    split: [['afford', 'Can afford'], ['rolled', 'Rolled finds only'], ['made', 'Made by Electrolysis only'], ['useful', 'Gives an element fusion is short of']]
};
let elxView = { fuse: { sort: 'need', f: {} }, split: { sort: 'most', f: {}, el: null }, open: false };
try {
    const v = JSON.parse(localStorage.getItem('elementalElxView') || 'null');
    if (v && v.fuse && v.split) {
        elxView = v;
    }
} catch (e) { }
const elxViewSave = () => {
    try {
        localStorage.setItem('elementalElxView', JSON.stringify(elxView));
    } catch (e) { }
};
function elxNavSync() {
    $('bondsElxBtn').hidden = !elxOn();
}
// how many of each element the compounds open slots want are still short by
function elxShort() {
    const short = {};
    fusable().filter(x => x.open).forEach(x => Object.entries(x.need).forEach(([s, n]) => {
        const miss = n - spareEl(s);
        if (miss > 0) {
            short[s] = (short[s] || 0) + miss;
        }
    }));
    return short;
}
function elxControls() {
    const V = elxView[elxTab];
    const sel = $('elxSort');
    sel.innerHTML = ELX_SORTS[elxTab].map(([k, t]) => `<option value="${k}"${k === V.sort ? ' selected' : ''}>${t}</option>`).join('');
    const on = ELX_FILTERS[elxTab].filter(([k]) => V.f[k]).length;
    $('elxOptCount').textContent = on ? '(' + on + ')' : '';
    $('elxOptBtn').setAttribute('aria-expanded', elxView.open ? 'true' : 'false');
    $('elxOptBtn').classList.toggle('open', elxView.open);
    const box = $('elxOpts');
    box.hidden = !elxView.open;
    box.innerHTML = ELX_FILTERS[elxTab].map(([k, t]) => `<label class="elx-chk"><input type="checkbox" data-filt="${k}"${V.f[k] ? ' checked' : ''}> ${t}</label>`).join('') +
        (on ? '<button class="linkish" id="elxClear">Clear filters</button>' : '');
    box.querySelectorAll('[data-filt]').forEach(c => c.onchange = () => {
        V.f[c.dataset.filt] = c.checked;
        // rolled only and made only can't both be on
        if (c.checked && c.dataset.filt === 'rolled') {
            V.f.made = false;
        }
        if (c.checked && c.dataset.filt === 'made') {
            V.f.rolled = false;
        }
        elxViewSave();
        renderElx();
    });
    const clr = $('elxClear');
    if (clr) {
        clr.onclick = () => {
            V.f = {};
            elxViewSave();
            renderElx();
        };
    }
}
function renderElx() {
    $('elxLocked').hidden = elxOn();
    $('elxBody').hidden = !elxOn();
    if (!elxOn()) {
        return;
    }
    document.querySelectorAll('[data-elx]').forEach(b => b.classList.toggle('sel', b.dataset.elx === elxTab));
    elxControls();
    const V = elxView[elxTab];
    const want = elxFind.trim().toLowerCase();
    const hit = (f, name) => !want || f.toLowerCase().includes(want) || (name || '').toLowerCase().includes(want);
    const list = $('elxList');
    let html = '';
    let rows;
    $('elxSearch').hidden = elxTab !== 'fuse';
    $('elxPtWrap').hidden = elxTab === 'fuse';
    $('elxPick').hidden = elxTab === 'fuse';
    if (elxTab === 'fuse') {
        $('elxHelp').textContent = 'Fuse a compound the bonds tree asks for. It uses up the elements in it and the quarks shown. What you make can fill bond slots, but it doesn\'t count as a find.';
        // missing: how many elements short in total
        rows = fusable().filter(x => hit(x.f, x.name)).map(x => {
            const missing = Object.entries(x.need).reduce((s, [sym, n]) => s + Math.max(0, n - spareEl(sym)), 0);
            const made = madeStore[x.f] ? madeStore[x.f].count - madeStore[x.f].spent : 0;
            return { x, missing, made };
        }).filter(r => (!V.f.ready || !r.missing) && (!V.f.open || r.x.open) && (!V.f.afford || canAfford(r.x.price)) && (!V.f.madeone || r.made));
        const by = {
            need: (a, b) => (b.x.open > 0) - (a.x.open > 0) || a.missing - b.missing || a.x.price - b.x.price,
            near: (a, b) => a.missing - b.missing || a.x.price - b.x.price,
            cheap: (a, b) => a.x.price - b.x.price,
            dear: (a, b) => b.x.price - a.x.price,
            slots: (a, b) => b.x.open - a.x.open || a.x.price - b.x.price,
            az: (a, b) => a.x.f.localeCompare(b.x.f)
        }[V.sort] || (() => 0);
        rows.sort((a, b) => by(a, b) || a.x.f.localeCompare(b.x.f));
        rows.slice(0, ELX_SHOW).forEach(({ x, missing, made }, i) => {
            const parts = Object.entries(x.need).map(([s, n]) => {
                const have = spareEl(s);
                return `<span class="elx-el ${have >= n ? 'ok' : 'short'}"><b>${s}</b> ${have}/${n}</span>`;
            }).join('');
            html += `<div class="elx-row"><div class="elx-f"><strong>${esc(x.f)}</strong><small>${esc(x.name || '')}</small></div>` +
                `<div class="elx-els">${parts}</div>` +
                `<div class="elx-tag">${x.open ? x.open + ' open slot' + (x.open === 1 ? '' : 's') : 'no open slots'}${made ? ' · ' + made + ' made' : ''}</div>` +
                `<button class="primary" data-fuse="${i}" ${!missing && canAfford(x.price) ? '' : 'disabled'}><span class="q-sym" aria-hidden="true">q</span> ${formatNumber(x.price)}</button></div>`;
        });
        list.innerHTML = html || '<p class="muted">Nothing matches.</p>';
        list.querySelectorAll('[data-fuse]').forEach(b => b.onclick = () => {
            const x = rows[+b.dataset.fuse].x;
            if (fuse(x)) {
                elxDone('Fused ' + x.f, x.f);
            }
        });
    } else {
        $('elxHelp').textContent = 'Pick the element you want out, then split a compound that has it. You keep the find; one spare copy is used up, and the elements it gives can go into fusion or fill bond slots.';
        const short = elxShort();
        const all = splittable();
        elxTable(all, short);
        const pick = V.el;
        $('elxPick').innerHTML = pick ? `Compounds with <b>${esc(elementBySymbol[pick][1])} (${pick})</b> you could split` : 'Tap an element to see the compounds you could get it from. Lit ones are in at least one spare compound; a green mark means fusion is short of it.';
        rows = (pick ? all.filter(x => x.c.elements.some(e => e[0] === pick)) : []).map(x => {
            const counts = {};
            x.c.elements.forEach(e => counts[e[0]] = (counts[e[0]] || 0) + 1);
            const helps = Object.entries(counts).reduce((s, [sym, n]) => s + Math.min(n, short[sym] || 0), 0);
            return { c: x.c, n: x.n, counts, helps, price: splitPrice(x.c.elements), rare: exactRarity(x.c.elements) };
        }).filter(r => (!V.f.afford || canAfford(r.price)) && (!V.f.rolled || !r.c.made) && (!V.f.made || r.c.made) && (!V.f.useful || r.helps));
        const by = {
            most: (a, b) => (b.counts[pick] || 0) - (a.counts[pick] || 0) || a.price - b.price,
            rare: (a, b) => a.rare - b.rare,
            spare: (a, b) => b.n - a.n,
            helps: (a, b) => b.helps - a.helps || a.price - b.price,
            cheap: (a, b) => a.price - b.price,
            gives: (a, b) => b.c.elements.length - a.c.elements.length,
            az: (a, b) => a.c.formula.localeCompare(b.c.formula)
        }[V.sort] || (() => 0);
        rows.sort((a, b) => by(a, b) || a.c.formula.localeCompare(b.c.formula));
        rows.slice(0, ELX_SHOW).forEach((r, i) => {
            const gives = Object.entries(r.counts).map(([s, n]) => `<span class="elx-el ${s === pick ? 'pick' : short[s] ? 'want' : 'ok'}"><b>${s}</b> +${n}</span>`).join('');
            html += `<div class="elx-row"><div class="elx-f"><strong>${esc(r.c.formula)}</strong><small>${r.c.made ? 'made' : esc(r.c.name || '')}</small></div>` +
                `<div class="elx-els">${gives}</div>` +
                `<div class="elx-tag">${r.n} spare</div>` +
                `<button class="primary" data-split="${i}" ${canAfford(r.price) ? '' : 'disabled'}><span class="q-sym" aria-hidden="true">q</span> ${formatNumber(r.price)}</button></div>`;
        });
        list.innerHTML = !pick ? '' : html || '<p class="muted">' + (Object.values(V.f).some(Boolean) ? 'Nothing matches these filters.' : 'No spare compounds with this element. Bond slots use copies up, so only the ones left over can be split.') + '</p>';
        list.querySelectorAll('[data-split]').forEach(b => b.onclick = () => {
            const c = rows[+b.dataset.split].c;
            if (split(c)) {
                elxDone('Split ' + c.formula, c.formula);
            }
        });
    }
    if (elxTab === 'split' && !elxView.split.el) {
        $('elxMore').textContent = '';
        return;
    }
    $('elxMore').textContent = rows.length > ELX_SHOW ? 'Showing ' + ELX_SHOW + ' of ' + formatNumber(rows.length) + '. Search or filter to narrow it down.' : '';
}
// the periodic table on the Fission tab: tap an element to list what it can be split out of
function elxTable(all, short) {
    const have = {};
    all.forEach(x => new Set(x.c.elements.map(e => e[0])).forEach(s => have[s] = (have[s] || 0) + 1));
    const pick = elxView.split.el;
    const root = $('elxPt');
    root.innerHTML = ELEMENTS.map(e => {
        const pos = tableLayout[e[0]] || [11, 1];
        const n = have[e[0]] || 0;
        return `<button type="button" class="element-tile${n ? ' discovered fam-' + familyOf(e[0]) : ' none'}${e[0] === pick ? ' picked' : ''}${short[e[0]] ? ' wanted' : ''}" data-pick="${e[0]}" style="grid-row:${pos[0]};grid-column:${pos[1]}" title="${esc(e[1])}${n ? ', in ' + n + ' spare compound' + (n === 1 ? '' : 's') : ', in no spare compounds'}"><span class="sym">${e[0]}</span></button>`;
    }).join('');
    root.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => {
        elxView.split.el = b.dataset.pick === pick ? null : b.dataset.pick;
        elxViewSave();
        $('elxMsg').textContent = '';
        renderElx();
    });
    ptFit(root);
}
function elxDone(msg, f) {
    uiSound('bond');
    const cell = $('elxCell');
    cell.classList.remove('run');
    void cell.offsetWidth;
    cell.classList.add('run');
    cell.querySelector('.elx-out').textContent = f;
    $('elxMsg').textContent = msg + '.';
    renderElx();
    renderRollStats();
}
document.querySelectorAll('[data-elx]').forEach(b => b.addEventListener('click', () => {
    elxTab = b.dataset.elx;
    $('elxMsg').textContent = '';
    renderElx();
}));
$('elxSearch').addEventListener('input', e => {
    elxFind = e.target.value;
    renderElx();
});
$('elxSort').addEventListener('change', e => {
    elxView[elxTab].sort = e.target.value;
    elxViewSave();
    renderElx();
});
$('elxOptBtn').addEventListener('click', () => {
    elxView.open = !elxView.open;
    elxViewSave();
    renderElx();
});
