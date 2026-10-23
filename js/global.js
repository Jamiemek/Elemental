// Global top 10 and globals
let globalBoard = { odds: null, score: null, at: 0, error: false };
let globalSettings = { min_tier: 7, announce_top10: true, discord_enabled: true, banner_enabled: true };
let globalMode = 'odds';
let globalLoading = false;
const globalSent = new Set();
const globalKey = (f, ion) => f + '|' + (ion || 0);
function globalName(formula) {
    const counts = parseFormula(formula);
    const syms = Object.keys(counts);
    if (syms.length === 1 && counts[syms[0]] === 1) {
        return elementBySymbol[syms[0]] ? elementBySymbol[syms[0]][1] : formula;
    }
    const known = ACHIEVEMENTS.find(a => a.hill === formula);
    if (known) {
        return known.name;
    }
    return syms.map(s => (counts[s] > 1 ? counts[s] + ' × ' : '') + (elementBySymbol[s] ? elementBySymbol[s][1] : s)).join(' + ');
}
async function globalLoad() {
    if (!sb || globalLoading) {
        return;
    }
    globalLoading = true;
    const [a, b, s] = await Promise.all([
        sb.from('global_top_odds').select('id, formula, ion, odds_log, score, found_at, display_name'),
        sb.from('global_top_score').select('id, formula, ion, odds_log, score, found_at, display_name'),
        sb.from('game_settings').select('min_tier, announce_top10, discord_enabled, banner_enabled').maybeSingle()
    ]);
    globalLoading = false;
    if (a.error || b.error) {
        globalBoard.error = true;
    } else {
        globalBoard = { odds: a.data || [], score: b.data || [], at: Date.now(), error: false };
    }
    if (s && !s.error && s.data) {
        globalSettings = s.data;
    }
    renderGlobal();
    globalFlushPending();
    globalBackfill();
}
// Finds waiting to be sent (made while the server couldn't be reached).
function globalPending() {
    try {
        return JSON.parse(localStorage.getItem('globalPending') || '[]').filter(p => p && p.f);
    } catch (e) {
        return [];
    }
}
function globalSetPending(list) {
    try {
        localStorage.setItem('globalPending', JSON.stringify(list.slice(-30)));
    } catch (e) { }
}
function globalBeats(rec) {
    const b = globalBoard;
    if (!b.odds || !b.score) {
        return true;
    }
    const onBoard = list => list.some(r => r.formula === rec.formula && (r.ion || 0) === (rec.ion || 0) && r.display_name === cloudName);
    if (onBoard(b.odds) || onBoard(b.score)) {
        return false;
    }
    const beats = (list, v, k) => list.length < 10 || v > list[list.length - 1][k] + 1e-9;
    return beats(b.odds, -rec.log, 'odds_log') || beats(b.score, rec.score, 'score');
}
// Called for every roll as it happens. Cheap: it only compares numbers already loaded.
function globalConsider(rec, old) {
    if (!CLOUD.enabled || !cloudUser || !cloudName || !rec || !rec.formula || !Number.isFinite(rec.log)) {
        return;
    }
    const isGlobal = !old && getRarityTier(rec.score) >= globalSettings.min_tier;
    if (!isGlobal && (globalSent.has(globalKey(rec.formula, rec.ion)) || !globalBeats(rec))) {
        return;
    }
    globalSent.add(globalKey(rec.formula, rec.ion));
    const st = activeBuffStats();
    globalSubmit({
        f: rec.formula,
        ion: rec.ion || 0,
        label: rec.name || globalName(rec.formula),
        rolls: totalRolls(),
        luck: Math.round(st.luck || 0),
        cats: (rec.cats || activeList().map(x => x.c && x.c.name).filter(Boolean)).join(', '),
        old: !!old
    });
}
async function globalSubmit(p) {
    if (!sb || !cloudUser) {
        globalQueue(p);
        return;
    }
    const args = { p_formula: p.f, p_label: p.label, p_rolls: p.rolls, p_luck: p.luck, p_catalysts: p.cats, p_old: p.old };
    if (p.ion) {
        args.p_ion = p.ion;
    }
    const { data, error } = await sb.rpc('submit_roll', args);
    if (error || !data) {
        globalSent.delete(globalKey(p.f, p.ion));
        globalQueue(p);
        return;
    }
    globalSetPending(globalPending().filter(x => !(x.f === p.f && (x.ion || 0) === (p.ion || 0) && x.old === p.old)));
    if (data.ok && data.added) {
        const parts = [];
        if (data.rank_odds <= 10) {
            parts.push('#' + data.rank_odds + ' by odds');
        }
        if (data.rank_score <= 10) {
            parts.push('#' + data.rank_score + ' by score');
        }
        showAchievementToast({ kicker: 'Global top 10', name: withIon(p.f, p.ion) + ' · ' + globalName(p.f), flavor: 'You are now ' + parts.join(' and ') + ' in the world.' });
        globalLoad();
    }
}
function globalQueue(p) {
    const list = globalPending();
    if (!list.some(x => x.f === p.f && (x.ion || 0) === (p.ion || 0) && x.old === p.old)) {
        list.push(p);
        globalSetPending(list);
    }
}
function globalFlushPending() {
    if (!sb || !cloudUser || !cloudName) {
        return;
    }
    const list = globalPending();
    globalSetPending([]);
    list.forEach(p => globalSubmit(p));
}
// After signing in: your best finds so far get a chance at the board too
function globalBackfill() {
    if (!cloudUser || !cloudName || !globalBoard.odds) {
        return;
    }
    try {
        if (localStorage.getItem('globalBackfilled') === cloudUser.id) {
            return;
        }
        localStorage.setItem('globalBackfilled', cloudUser.id);
    } catch (e) { }
    const best = groupedCollection().slice(0, 10).map(c => c.rarestRecord);
    const top = scoreRanked().slice(0, 10).map(c => c.rarestRecord);
    best.concat(top).forEach(r => globalConsider(r, true));
}
function globalRow(r, rank) {
    const el = document.createElement('div');
    const mine = cloudName && r.display_name === cloudName;
    el.className = 'rank-row' + (mine ? ' mine' : '');
    const when = new Date(r.found_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    el.innerHTML = '<div class="rank-num">' + rank + '</div><div class="rank-main"><div class="rank-formula">' + esc(withIon(r.formula, r.ion)) + '</div>' +
        '<div class="rank-name">' + esc(globalName(r.formula)) + '</div></div><div class="rank-odds"><b>' +
        (globalMode === 'score' ? 'Score ' + fmtScore(r.score) : rarityText(-r.odds_log)) + '</b><span title="Found ' + esc(when) + '">' +
        esc(r.display_name || 'Unknown') + (mine ? ' (you)' : '') + '</span></div>';
    return el;
}
function renderGlobal() {
    const root = $('globalList');
    if (!root) {
        return;
    }
    const list = globalBoard[globalMode];
    const note = $('globalNote');
    const stat = $('globalStatus');
    root.innerHTML = '';
    if (!CLOUD.enabled) {
        root.innerHTML = '<div class="empty"><strong>The global top 10 is switched off in this copy of the game.</strong></div>';
        note.textContent = '';
        stat.textContent = '';
        return;
    }
    if (!list) {
        const down = globalBoard.error || cloudState === 'offline';
        root.innerHTML = '<div class="empty"><strong>' + (down ? "Can't reach the global top 10 right now." : 'Loading the global top 10…') + '</strong>' +
            (down ? '<p>Your rolls are still saved on this device. Check your connection and try again.</p><button class="ghost" id="globalRetry">Try again</button>' : '') + '</div>';
        const b = $('globalRetry');
        if (b) {
            b.onclick = () => (sb ? globalLoad() : cloudInit());
        }
    } else if (!list.length) {
        root.innerHTML = '<div class="empty"><strong>Nobody is on the board yet.</strong><p>The first signed-in players to roll will fill it.</p></div>';
    } else {
        list.forEach((r, i) => root.appendChild(globalRow(r, i + 1)));
    }
    stat.textContent = globalBoard.at ? 'Updated ' + new Date(globalBoard.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    note.innerHTML = !cloudUser ? 'Only signed-in players appear here. <button class="linkish" data-go-settings>Sign in from Settings</button> to put your rolls on the board.' :
        !cloudName ? 'Choose a display name in Settings to put your rolls on the board.' :
        'Your rolls are entered automatically when they are rare enough to make the board. Odds and score are always base values, before any buffs.';
    const s = note.querySelector('[data-go-settings]');
    if (s) {
        s.onclick = () => go('settings');
    }
    const home = $('homeGlobal');
    if (home) {
        const mineAt = (globalBoard.odds || []).findIndex(r => cloudName && r.display_name === cloudName);
        home.textContent = mineAt >= 0 ? 'You are #' + (mineAt + 1) : globalBoard.odds && globalBoard.odds[0] ? 'Top ' + rarityText(-globalBoard.odds[0].odds_log) : '';
    }
}
document.querySelectorAll('[data-grank]').forEach(b => b.addEventListener('click', () => {
    globalMode = b.dataset.grank;
    document.querySelectorAll('[data-grank]').forEach(x => x.classList.toggle('active', x === b));
    renderGlobal();
}));
setInterval(() => {
    if ($('global').classList.contains('active') && document.visibilityState === 'visible') {
        globalLoad();
    }
}, 60000);
// the banner: other players' globals, live. The connection is only open while
// the game is on screen, so idle tabs don't use up the server's live connections.
let rtChannel = null;
const bannerQueue = [];
let bannerBusy = false;
function rtStart() {
    if (!sb || rtChannel || !CLOUD.enabled || document.visibilityState !== 'visible') {
        return;
    }
    rtChannel = sb.channel('globals')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, p => bannerAdd(p.new))
        .subscribe();
}
function rtStop() {
    if (sb && rtChannel) {
        sb.removeChannel(rtChannel);
    }
    rtChannel = null;
}
function bannerAdd(a) {
    if (!a || !globalSettings.banner_enabled || (cloudName && a.display_name === cloudName)) {
        return;
    }
    if (bannerQueue.length < 5) {
        bannerQueue.push(a);
    }
    bannerNext();
}
function bannerNext() {
    const el = $('globalBanner');
    if (bannerBusy || !bannerQueue.length || !el) {
        return;
    }
    bannerBusy = true;
    const a = bannerQueue.shift();
    const fx = RARITY_FX[Math.min(12, a.tier)];
    el.style.setProperty('--bc', fx ? fx.c : 'var(--hazard)');
    el.innerHTML = '<b>' + esc(a.display_name) + '</b> has found <b>' + esc((a.label || globalName(a.formula)) + ionText(a.ion || 0)) + '</b><span>' +
        (displayMode === 'score' ? 'Score ' + fmtScore(a.score) : rarityText(-a.odds_log)) + '</span>';
    el.classList.add('show');
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => {
            bannerBusy = false;
            bannerNext();
        }, 450);
    }, 5500);
}
// gifts from the admin, handed over when you sign in or come back to the game
async function giftsClaim() {
    if (!sb || !cloudUser || !cloudName) {
        return;
    }
    const { data, error } = await sb.rpc('claim_gifts');
    if (error || !Array.isArray(data) || !data.length) {
        return;
    }
    const got = [];
    data.forEach(g => {
        if (CAT[g.catalyst] && g.qty > 0) {
            catInv[g.catalyst] = (catInv[g.catalyst] || 0) + g.qty;
            got.push(g.qty + ' × ' + CAT[g.catalyst].name);
        }
    });
    if (!got.length) {
        return;
    }
    saveCats();
    if ($('catinv').classList.contains('active')) {
        renderCatInv();
    }
    const note = data.map(g => g.note).filter(Boolean)[0];
    showAchievementToast({ kicker: 'Gift received', name: got.join(', '), flavor: note || 'Added to your catalyst inventory.' });
    cloudTick();
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        rtStart();
        giftsClaim();
    } else {
        rtStop();
    }
});
// Everything that needs a signed-in player with a name
function cloudAfterProfile() {
    renderGlobal();
    globalFlushPending();
    globalBackfill();
    giftsClaim();
    adminCheck();
}
