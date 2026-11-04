// Catalyst Synthesis, from outer ring 2. Five elements on an X: a centre and four arms read
// clockwise from the top left. Turning the pattern round makes no difference
const SY_ARMS = ['tl', 'tr', 'br', 'bl'];
const syParse = r => {
    const [c, arms] = r.split(':');
    return { c, arms: arms.split(' ') };
};
const syKey = (c, arms) => c + '|' + [0, 1, 2, 3].map(i => arms.slice(i).concat(arms.slice(0, i)).join(' ')).sort()[0];
const SY_BY_KEY = new Map();
SYNTHS.forEach(y => {
    const p = syParse(y.r);
    SY_BY_KEY.set(syKey(p.c, p.arms), y.id);
});
// the lab book's page order: examples first, the rest shuffled so the pages give nothing away
const SY_PAGES = (() => {
    const rest = SYNTHS.map(y => y.id).filter(id => !SYNTH_EXAMPLES.includes(id));
    let h = 20261103;
    const rnd = () => (h = Math.imul(h ^ (h >>> 15), 2246822507) + 0x9e3779b9 >>> 0) / 4294967296;
    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return SYNTH_EXAMPLES.concat(rest);
})();
let syKnown = [];
try {
    syKnown = JSON.parse(localStorage.getItem('elementalSynthKnown') || '[]').filter(id => CAT[id]);
} catch (e) { }
const syKnows = id => SYNTH_EXAMPLES.includes(id) || syKnown.includes(id);
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
        // nothing made: check it against the page the lab book is open at
        const pid = SY_PAGES[syPage];
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
    // uses one spare copy of each element on the table
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
    catInv[id] = (catInv[id] || 0) + 1;
    const cat = CAT[id];
    if (cat.rolls || (cat.fx.start)) {
        const src = 'y|' + acDev + '|' + Date.now().toString(36);
        srcAdd(id, src);
        synthLog(id, src);
    }
    saveCats();
    const fresh = !syKnows(id);
    if (fresh) {
        syKnown.push(id);
        sySave();
        syPage = SY_PAGES.indexOf(id);
    }
    cell.classList.add('ok');
    uiSound('bond');
    $('syMsg').innerHTML = (fresh ? 'New recipe! ' : '') + '<b>' + esc(cat.name) + '</b> made. It\'s waiting in your inventory.' + (kept ? ' One ' + esc(elementBySymbol[kept][1]) + ' was left over.' : '');
    $('syMsg').className = 'sy-msg ok';
    if (fresh) {
        showAchievementToast({ kicker: 'New recipe', name: cat.name, flavor: 'Written into your lab book.' });
    }
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
function syBook() {
    syPage = Math.max(0, Math.min(SY_PAGES.length - 1, syPage));
    const found = SYNTHS.filter(y => syKnows(y.id)).length;
    $('syBookCount').textContent = found + ' of ' + SY_PAGES.length + ' written';
    const id = SY_PAGES[syPage];
    const c = CAT[id];
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
    if (!syKnows(id)) {
        $('syPages').innerHTML = `<div class="sy-page blank"><p class="sy-pno">Page ${syPage + 1}</p><h3>Unknown Catalyst #${syPage + 1}</h3>${hinted(syHints[id])}` +
            `<p class="muted">${syHints[id] ? 'Your closest mix so far.' : 'Nothing tried against this page yet.'}</p>` +
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
    } else {
        const T = CAT_TIERS[c.tier];
        $('syPages').innerHTML = `<div class="sy-page" style="--tc:${T.col}"><p class="sy-pno">Page ${syPage + 1}</p><h3>${esc(c.name)}</h3>${tierChip(c.tier)}${c.joke ? ' <span class="sy-joke">Joke</span>' : ''}` +
            mini(c.r) + `<p class="ip-effect">${catEffect(c)}</p><dl class="stats"><div><dt>Lasts</dt><dd>${catLength(c)}</dd></div><div><dt>You have</dt><dd>×${(catInv[id] || 0).toLocaleString('en-US')}</dd></div></dl>` +
            `<button class="ghost" data-load="${id}">Put on the table</button></div>`;
        $('syPages').querySelector('[data-load]').onclick = () => {
            const p = syParse(c.r);
            syTable = { c: p.c, arms: p.arms.slice() };
            syPick = null;
            syMarks = null;
            $('syMsg').textContent = '';
            renderSynth();
        };
    }
    $('syPrev').disabled = syPage === 0;
    $('syNext').disabled = syPage + 1 >= SY_PAGES.length;
    $('syPageNo').value = syPage + 1;
}
function syFlip(d) {
    syPage = Math.max(0, Math.min(SY_PAGES.length - 1, syPage + d));
    syMarks = null;
    renderSynth();
}
// jump to the next page that has something written on it
function syNextWritten(d) {
    for (let i = syPage + d; i >= 0 && i < SY_PAGES.length; i += d) {
        if (syKnows(SY_PAGES[i])) {
            syPage = i;
            syMarks = null;
            renderSynth();
            return;
        }
    }
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
    syPage = Math.max(0, Math.min(SY_PAGES.length - 1, (parseInt(e.target.value, 10) || 1) - 1));
    syMarks = null;
    renderSynth();
});
$('syPrev').addEventListener('click', () => syFlip(-1));
$('syNext').addEventListener('click', () => syFlip(1));
$('syPrevW').addEventListener('click', () => syNextWritten(-1));
$('syNextW').addEventListener('click', () => syNextWritten(1));
function syNavSync() {
    $('invSyBtn').hidden = !syOn();
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
