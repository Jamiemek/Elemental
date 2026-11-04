// Catalyst Synthesis, from outer ring 2. Five elements on an X: a centre and four arms read
// clockwise from the top left. Turning the pattern round makes no difference
const SY_ARMS = ['tl', 'tr', 'br', 'bl'];
const syParse = r => {
    const [c, arms] = r.split(':');
    return { c, arms: arms.split(' ') };
};
const syKey = (c, arms) => c + '|' + [0, 1, 2, 3].map(i => arms.slice(i).concat(arms.slice(0, i)).join(' ')).sort()[0];
// the shop's own catalysts are already in the pool, so their recipes aren't in the book
const SY_BOOK = SYNTHS.filter(y => !y.of);
const SY_BY_KEY = new Map();
SY_BOOK.forEach(y => {
    const p = syParse(y.r);
    SY_BY_KEY.set(syKey(p.c, p.arms), y.id);
});
// the lab book's page order: examples first, the rest shuffled so the pages give nothing away
const SY_PAGES = (() => {
    const rest = SY_BOOK.map(y => y.id).filter(id => !SYNTH_EXAMPLES.includes(id));
    let h = 20261103;
    const rnd = () => (h = Math.imul(h ^ (h >>> 15), 2246822507) + 0x9e3779b9 >>> 0) / 4294967296;
    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return SYNTH_EXAMPLES.concat(rest);
})();
// the book: a page for each recipe not found yet (stable numbers), then the shop pool at the back
const syBookPages = () => SY_PAGES.filter(id => !syKnows(id)).concat(['pool']);
// the best check so far against each unwritten page, lined up with the recipe: [[symbol, mark] x 5], centre first
let syHints = {};
try {
    syHints = JSON.parse(localStorage.getItem('elementalSynthHints') || '{}');
} catch (e) { }
// greens count most, then yellows, purples, blues and greys
const SY_RANK = { g: 10000, y: 1000, p: 100, b: 10, x: 1 };
const syScore = h => h.reduce((s, [, m]) => s + (SY_RANK[m] || 0), 0);
function syHintsSave() {
    try {
        localStorage.setItem('elementalSynthHints', JSON.stringify(syHints));
    } catch (e) { }
}
function sySave() {
    try {
        localStorage.setItem('elementalSynthKnown', JSON.stringify(syKnown));
    } catch (e) { }
}
const syOn = () => bondBonus().synthesis;
let syTable = { c: null, arms: [null, null, null, null] };
let syPick = null;
let syPage = 0;
// spare copies of each element, after what's already on the table
function sySpare(sym) {
    const on = [syTable.c].concat(syTable.arms).filter(s => s === sym).length;
    return spareEl(sym) - on;
}
// checks a mix against the recipe on the open page, Wordle style: green for the right element
// in the right slot, yellow for one that's in the recipe somewhere else, purple for the right
// family in the right slot, blue for the right family somewhere else, grey for none of those.
// The pattern can be turned round, so it lines the arms up whichever way matches best
let syMarks = null;
function syCheck(c, arms, r) {
    const p = syParse(r);
    let rot = 0;
    let best = -1;
    for (let k = 0; k < 4; k++) {
        const hits = [0, 1, 2, 3].reduce((n, i) => n + (arms[(i + k) % 4] === p.arms[i] ? 10 : familyOf(arms[(i + k) % 4]) === familyOf(p.arms[i]) ? 1 : 0), 0);
        if (hits > best) {
            best = hits;
            rot = k;
        }
    }
    // mine[i] is the element in my slot i; want[i] is what the recipe has in that slot
    const mine = [c].concat([0, 1, 2, 3].map(i => arms[i]));
    const want = [p.c].concat([0, 1, 2, 3].map(i => p.arms[(i - rot + 4) % 4]));
    const marks = mine.map((s, i) => s === want[i] ? 'g' : null);
    syCheck.rot = rot;
    const left = {};
    want.forEach((s, i) => {
        if (!marks[i]) {
            left[s] = (left[s] || 0) + 1;
        }
    });
    mine.forEach((s, i) => {
        if (!marks[i] && left[s]) {
            marks[i] = 'y';
            left[s]--;
        }
    });
    // what's left of the recipe, for the family checks
    const rest = [];
    Object.entries(left).forEach(([s, n]) => {
        for (let j = 0; j < n; j++) {
            rest.push(s);
        }
    });
    const take = s => rest.splice(rest.indexOf(s), 1);
    mine.forEach((s, i) => {
        if (!marks[i] && rest.includes(want[i]) && familyOf(want[i]) === familyOf(s)) {
            marks[i] = 'p';
            take(want[i]);
        }
    });
    mine.forEach((s, i) => {
        if (marks[i]) {
            return;
        }
        const f = rest.find(r => familyOf(r) === familyOf(s));
        if (f) {
            marks[i] = 'b';
            take(f);
        } else {
            marks[i] = 'x';
        }
    });
    return marks;
}
function synthesise() {
    const { c, arms } = syTable;
    if (!syOn() || !c || arms.some(a => !a)) {
        return;
    }
    const id = SY_BY_KEY.get(syKey(c, arms));
    const cell = $('syTable');
    cell.classList.remove('ok');
    void cell.offsetWidth;
    if (!id) {
        // nothing found: check it against the page the lab book is open at
        const pid = syBookPages()[syPage];
        if (pid === 'pool') {
            $('syMsg').textContent = 'Nothing there. Turn to a recipe page to check a mix against it.';
            $('syMsg').className = 'sy-msg';
            uiSound('deny');
            return;
        }
        syMarks = syCheck(c, arms, CAT[pid].r);
        // write it on the page, lined up with the recipe, if it tells you more than what's there
        const rot = syCheck.rot;
        const mine = [c].concat(arms);
        const h = [[c, syMarks[0]]].concat([0, 1, 2, 3].map(j => {
            const i = (j + rot) % 4;
            return [mine[i + 1], syMarks[i + 1]];
        }));
        if (!syKnows(pid) && (!syHints[pid] || syScore(h) > syScore(syHints[pid]))) {
            syHints[pid] = h;
            syHintsSave();
        }
        $('syMsg').textContent = '';
        $('syMsg').className = 'sy-msg';
        uiSound('deny');
        renderSynth();
        syPulse();
        return;
    }
    syMarks = null;
    const cat = CAT[id];
    if (syKnows(id)) {
        $('syMsg').innerHTML = '<b>' + esc(cat.name) + '</b> is already in your shop pool. Nothing was used.';
        $('syMsg').className = 'sy-msg';
        return;
    }
    // finding it uses one spare copy of each element on the table
    const need = {};
    [c].concat(arms).forEach(s => need[s] = (need[s] || 0) + 1);
    const plans = Object.entries(need).map(([s, n]) => payPlan({ t: 'el', k: s, n }));
    if (plans.some(p => !p)) {
        $('syMsg').textContent = 'You don\'t have enough spare copies of those elements.';
        $('syMsg').className = 'sy-msg';
        return;
    }
    // outer ring 2: now and then one of them isn't used up
    let kept = null;
    if (Math.random() < bondBonus().synthkeep / 100) {
        const i = Math.floor(Math.random() * plans.length);
        kept = Object.keys(need)[i];
        plans[i][plans[i].length - 1].take--;
    }
    plans.forEach(p => p.forEach(x => x.c.spent = (x.c.spent || 0) + x.take));
    if (typeof madeSave === 'function') {
        madeSave();
    }
    save();
    syKnown.push(id);
    sySave();
    synthFound();
    // over to the shop pool, where it now sits
    syNewest = id;
    syPage = syBookPages().length - 1;
    cell.classList.add('ok');
    uiSound('bond');
    $('syMsg').innerHTML = '<b>' + esc(cat.name) + '</b> is now in your shop pool and can turn up when the shop restocks.' + (kept ? ' One ' + esc(elementBySymbol[kept][1]) + ' was left over.' : '');
    $('syMsg').className = 'sy-msg ok';
    showAchievementToast({ kicker: 'Added to the shop pool', name: cat.name, flavor: 'It can turn up in the shop from now on.' });
    renderShop();
    renderSynth();
}
function renderSynth() {
    $('syLocked').hidden = syOn();
    $('syBody').hidden = !syOn();
    if (!syOn()) {
        return;
    }
    ['c'].concat(SY_ARMS).forEach((k, i) => {
        const sym = i ? syTable.arms[i - 1] : syTable.c;
        const b = $('sySlot_' + k);
        b.classList.toggle('on', !!sym);
        b.classList.toggle('pick', syPick === k);
        ['g', 'y', 'p', 'b', 'x'].forEach(m => b.classList.toggle('m-' + m, !!syMarks && syMarks[i] === m));
        // the slot's rim takes the element's family colour
        b.style.setProperty('--fc', sym ? 'var(--' + familyOf(sym) + ')' : '');
        b.innerHTML = sym ? `<b>${sym}</b><small>${Math.max(0, sySpare(sym) + 1)} spare</small>` : '<i>+</i>';
    });
    const full = syTable.c && syTable.arms.every(Boolean);
    $('syGo').disabled = !full;
    syPicker();
    syBook();
}
// choosing an element for a slot: only ones you have a spare copy of light up
function syPicker() {
    const box = $('syPickWrap');
    box.hidden = !syPick;
    if (!syPick) {
        return;
    }
    const cur = syPick === 'c' ? syTable.c : syTable.arms[SY_ARMS.indexOf(syPick)];
    $('syPickHead').textContent = (syPick === 'c' ? 'Centre' : 'Arm') + ': pick an element';
    $('syPickClear').hidden = !cur;
    const root = $('syPt');
    root.innerHTML = ELEMENTS.map(e => {
        const pos = tableLayout[e[0]] || [11, 1];
        const n = sySpare(e[0]) + (e[0] === cur ? 1 : 0);
        return `<button type="button" class="element-tile${n > 0 ? ' discovered fam-' + familyOf(e[0]) : ' none'}${e[0] === cur ? ' picked' : ''}" data-sy="${e[0]}" ${n > 0 ? '' : 'disabled'} style="grid-row:${pos[0]};grid-column:${pos[1]}" title="${esc(e[1])}: ${Math.max(0, n)} spare"><span class="sym">${e[0]}</span></button>`;
    }).join('');
    root.querySelectorAll('[data-sy]').forEach(b => b.onclick = () => sySet(b.dataset.sy));
    ptFit(root);
}
// the colours pulse in one slot at a time, centre first
function syPulse() {
    ['c'].concat(SY_ARMS).forEach((k, i) => {
        const b = $('sySlot_' + k);
        b.classList.remove('pulse');
        b.style.animationDelay = (i * 140) + 'ms';
        void b.offsetWidth;
        b.classList.add('pulse');
    });
}
function sySet(sym) {
    syMarks = null;
    if (syPick === 'c') {
        syTable.c = sym;
    } else {
        syTable.arms[SY_ARMS.indexOf(syPick)] = sym;
    }
    // straight on to the next empty slot
    const order = ['c'].concat(SY_ARMS);
    const next = order.find(k => !(k === 'c' ? syTable.c : syTable.arms[SY_ARMS.indexOf(k)]));
    syPick = sym ? next || null : syPick;
    $('syMsg').textContent = '';
    renderSynth();
}
// the lab book, one page at a time. A failed mix is checked against whichever page is open
let syNewest = null;
function syBook() {
    const pages = syBookPages();
    syPage = Math.max(0, Math.min(pages.length - 1, syPage));
    const found = SY_BOOK.filter(y => syKnows(y.id)).length;
    $('syBookCount').textContent = found + ' of ' + SY_BOOK.length + ' found';
    const id = pages[syPage];
    const mini = r => {
        const p = r ? syParse(r) : { c: '', arms: ['', '', '', ''] };
        const cell = (k, s) => `<span class="sy-mini-${k}${s ? ' fam-' + familyOf(s) : ''}">${s || '?'}</span>`;
        return `<div class="sy-mini">${cell('c', p.c)}${SY_ARMS.map((k, j) => cell(k, p.arms[j])).join('')}</div>`;
    };
    // an unwritten page shows the best check against it so far
    const hinted = h => {
        const cell = (k, x) => x ? `<span class="sy-mini-${k} m-${x[1]}">${x[0]}</span>` : `<span class="sy-mini-${k}">?</span>`;
        return `<div class="sy-mini">${cell('c', h && h[0])}${SY_ARMS.map((k, j) => cell(k, h && h[j + 1])).join('')}</div>`;
    };
    const load = r => {
        const p = syParse(r);
        syTable = { c: p.c, arms: p.arms.slice() };
        syPick = null;
        syMarks = null;
        $('syMsg').textContent = '';
        renderSynth();
    };
    const no = SY_PAGES.indexOf(id) + 1;
    if (id === 'pool') {
        $('syPages').innerHTML = syPoolPage(mini);
    } else if (SYNTH_EXAMPLES.includes(id)) {
        // the worked examples show their recipe; making one still adds it to the pool
        const c = CAT[id];
        $('syPages').innerHTML = `<div class="sy-page" style="--tc:${CAT_TIERS[c.tier].col}"><p class="sy-pno">Example</p><h3>${esc(c.name)}</h3>${tierChip(c.tier)}` +
            mini(c.r) + `<p class="ip-effect">${catEffect(c)}</p><p class="muted">Make it to add it to your shop pool.</p><button class="ghost" id="syLoad">Put on the table</button></div>`;
        $('syLoad').onclick = () => load(c.r);
    } else {
        $('syPages').innerHTML = `<div class="sy-page blank"><p class="sy-pno">Recipe ${no}</p><h3>Unknown Catalyst #${no}</h3>${hinted(syHints[id])}` +
            `<p class="muted">${syHints[id] ? 'Your closest mix so far.' : 'Nothing tried against this page yet.'} Find it to add it to your shop pool.</p>` +
            (syHints[id] ? '<button class="ghost" id="syGuess">Put best guess on the table</button>' : '') + '</div>';
        // greens and yellows go back where they were tried; greys are left empty
        const gb = $('syGuess');
        if (gb) {
            gb.onclick = () => {
                const h = syHints[id];
                const keep = x => x[1] === 'x' ? null : x[0];
                syTable = { c: keep(h[0]), arms: [1, 2, 3, 4].map(i => keep(h[i])) };
                syPick = null;
                syMarks = null;
                $('syMsg').textContent = '';
                renderSynth();
            };
        }
    }
    $('syPrev').disabled = syPage === 0;
    $('syNext').disabled = syPage + 1 >= pages.length;
    $('syPageNo').value = syPage + 1;
    $('syPageNo').max = pages.length;
}
// the back of the book: everything that can turn up in your shop, rarest first. The commoner ones can be switched off
function syPoolPage(mini) {
    const list = POOL_IDS.map(id => CAT[id]).filter(c => !c.synth || syKnows(c.id)).sort((a, b) => b.tier - a.tier || (a.synth === b.synth ? a.name.localeCompare(b.name) : a.synth ? 1 : -1));
    let tier = -1;
    const rows = list.map(c => {
        const head = c.tier !== tier ? `<h4 class="sy-pool-tier" style="--tc:${c.tier === 6 ? 'var(--ink)' : CAT_TIERS[c.tier].col}">${CAT_TIERS[c.tier].name}</h4>` : '';
        tier = c.tier;
        const on = poolHas(c.id);
        const sw = poolCanSwitch(c.id) ? `<button class="ghost sy-pool-tog${on ? ' on' : ''}" data-pool="${c.id}" aria-pressed="${on}">${on ? 'In pool' : 'Out'}</button>` : '<span class="sy-pool-fixed">In pool</span>';
        return head + `<div class="sy-pool-row${c.id === syNewest ? ' new' : ''}${on ? '' : ' off'}">${c.synth ? mini(c.r) : '<span class="sy-pool-shop">Shop</span>'}` +
            `<div class="sy-pool-text"><b>${esc(c.name)}</b><small>${catEffect(c)}</small></div>${sw}</div>`;
    }).join('');
    return `<div class="sy-page sy-pool"><p class="sy-pno">Shop pool</p><h3>In your shop pool</h3>` +
        `<p class="muted">The shop restocks from these. Each recipe you find joins them. Common, Uncommon and Rare ones can be switched off to keep them out of the shop.</p>${rows}</div>`;
}
$('syPages').addEventListener('click', e => {
    const b = e.target.closest('[data-pool]');
    if (!b) {
        return;
    }
    const c = CAT[b.dataset.pool];
    if (!poolCanSwitch(c.id)) {
        return;
    }
    if (!poolOff.has(c.id)) {
        // every rarity keeps at least one that isn't a joke catalyst, so the shop always has something to pick
        const left = POOL_IDS.filter(id => CAT[id].tier === c.tier && id !== c.id && poolHas(id) && !poolJoke(CAT[id]));
        if (!poolJoke(c) && !left.length) {
            $('syMsg').textContent = 'Each rarity needs at least one non-joke catalyst in the pool.';
            $('syMsg').className = 'sy-msg';
            return;
        }
        poolOff.add(c.id);
    } else {
        poolOff.delete(c.id);
    }
    poolSave();
    $('syMsg').textContent = '';
    syBook();
});
function syFlip(d) {
    syPage = Math.max(0, Math.min(syBookPages().length - 1, syPage + d));
    syMarks = null;
    renderSynth();
}
['c'].concat(SY_ARMS).forEach(k => {
    $('sySlot_' + k).addEventListener('click', () => {
        syPick = syPick === k ? null : k;
        renderSynth();
    });
    // a double click takes the element back off
    $('sySlot_' + k).addEventListener('dblclick', () => {
        if (k === 'c') {
            syTable.c = null;
        } else {
            syTable.arms[SY_ARMS.indexOf(k)] = null;
        }
        syPick = null;
        syMarks = null;
        renderSynth();
    });
});
$('syPickClear').addEventListener('click', () => {
    syMarks = null;
    if (syPick === 'c') {
        syTable.c = null;
    } else {
        syTable.arms[SY_ARMS.indexOf(syPick)] = null;
    }
    renderSynth();
});
$('syPickClose').addEventListener('click', () => {
    syPick = null;
    renderSynth();
});
$('syGo').addEventListener('click', synthesise);
$('syClear').addEventListener('click', () => {
    syTable = { c: null, arms: [null, null, null, null] };
    syPick = null;
    syMarks = null;
    $('syMsg').textContent = '';
    $('syTable').classList.remove('ok');
    renderSynth();
});
$('syPageNo').addEventListener('change', e => {
    syPage = Math.max(0, Math.min(syBookPages().length - 1, (parseInt(e.target.value, 10) || 1) - 1));
    syMarks = null;
    renderSynth();
});
$('syPrev').addEventListener('click', () => syFlip(-1));
$('syNext').addEventListener('click', () => syFlip(1));
// first page, and the shop pool at the back
$('syPrevW').addEventListener('click', () => {
    syPage = 0;
    syMarks = null;
    renderSynth();
});
$('syNextW').addEventListener('click', () => {
    syPage = syBookPages().length - 1;
    syMarks = null;
    renderSynth();
});
function syNavSync() {
    $('shopSyBtn').hidden = !syOn();
}
// the silly catalysts: a class on the page for each one running
let sySillyOn = '';
function sillySync() {
    const on = catBonus().silly.slice().sort().join(' ');
    if (on === sySillyOn) {
        return;
    }
    sySillyOn = on;
    [...document.body.classList].filter(c => c.startsWith('silly-')).forEach(c => document.body.classList.remove(c));
    catBonus().silly.forEach(k => document.body.classList.add('silly-' + k));
    let duck = document.querySelector('.sy-duck');
    if (on.includes('duck') && !duck) {
        duck = document.createElement('div');
        duck.className = 'sy-duck';
        duck.textContent = '\u{1F986}';
        document.body.appendChild(duck);
    } else if (!on.includes('duck') && duck) {
        duck.remove();
    }
}
setInterval(sillySync, 1000);
function sillyConfetti() {
    if (!catBonus().silly.includes('confetti')) {
        return;
    }
    const cols = ['#ff4f4f', '#ffb84f', '#f5e642', '#4fd17a', '#4fa8ff', '#b46bff'];
    for (let i = 0; i < 40; i++) {
        const c = document.createElement('i');
        c.className = 'sy-confetti';
        c.style.left = (20 + Math.random() * 60) + 'vw';
        c.style.top = '-12px';
        c.style.background = cols[i % cols.length];
        c.style.setProperty('--dx', ((Math.random() - 0.5) * 300) + 'px');
        c.style.setProperty('--r', (Math.random() * 900) + 'deg');
        c.style.animationDelay = (Math.random() * 0.4) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 2200);
    }
}
