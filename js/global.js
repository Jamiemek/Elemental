// Global top 10 and globals
let globalBoard = { score: null, at: 0, error: false };
let globalSettings = { min_tier: 7, announce_top10: true, discord_enabled: true, banner_enabled: true };
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
    const real = jokesOn() && !jokeHide ? '' : '_real';
    const [b, s] = await Promise.all([
        sb.from('global_top_score' + real).select('id, formula, ion, odds_log, score, found_at, display_name'),
        sb.from('game_settings').select('min_tier, announce_top10, discord_enabled, banner_enabled, reset_at').maybeSingle()
    ]);
    globalLoading = false;
    if (b.error) {
        globalBoard.error = true;
    } else {
        globalBoard = { score: b.data || [], at: Date.now(), error: false };
    }
    if (s && !s.error && s.data) {
        globalSettings = s.data;
        resetCheck(s.data.reset_at);
    }
    renderGlobal();
    globalFlushPending();
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
    const list = globalBoard.score;
    if (!list) {
        return true;
    }
    if (list.some(r => r.formula === rec.formula && (r.ion || 0) === (rec.ion || 0) && r.display_name === cloudName)) {
        return false;
    }
    return list.length < 10 || rec.score > list[list.length - 1].score + 1e-9;
}
// Called for every roll as it happens. Cheap: it only compares numbers already loaded.
// Only rolls with dice behind them can go on the board
function globalConsider(rec) {
    if (!CLOUD.enabled || !cloudUser || !cloudName || !rec || !rec.formula || !Number.isFinite(rec.log) || !rec.proof) {
        return;
    }
    const isGlobal = getRarityTier(rec.score) >= globalSettings.min_tier;
    if (!isGlobal && (globalSent.has(globalKey(rec.formula, rec.ion)) || !globalBeats(rec))) {
        return;
    }
    globalSent.add(globalKey(rec.formula, rec.ion));
    const st = activeBuffStats();
    const ev = eventNow();
    globalSubmit({
        ev: ev ? (ev === 'storm' ? 'Quark Storm' : EVENTS[ev].name) : '',
        f: rec.formula,
        ion: rec.ion || 0,
        label: rec.name || globalName(rec.formula),
        rolls: totalRolls(),
        luck: Math.round(st.luck || 0),
        cats: (rec.cats || activeList().map(x => x.c && x.c.name).filter(Boolean)).join(', '),
        pf: rec.proof
    });
}
async function globalSubmit(p) {
    if (!sb || !cloudUser) {
        globalQueue(p);
        return;
    }
    if (!p.pf) {
        return;
    }
    const args = { p_formula: p.f, p_label: p.label, p_rolls: p.rolls, p_luck: p.luck, p_catalysts: p.cats, p_proof: p.pf };
    if (p.ion) {
        args.p_ion = p.ion;
    }
    if (p.ev) {
        args.p_event = p.ev;
    }
    const { data, error } = await sb.rpc('submit_roll', args);
    if (error || !data) {
        globalSent.delete(globalKey(p.f, p.ion));
        globalQueue(p);
        return;
    }
    globalSetPending(globalPending().filter(x => !(x.f === p.f && (x.ion || 0) === (p.ion || 0))));
    // a verified global goes straight to the cloud
    if (data.ok && (data.added || data.global)) {
        cloudTick();
    }
    if (data.ok && data.added) {
        showAchievementToast({ kicker: 'Global top 10', name: withIon(p.f, p.ion) + ' · ' + globalName(p.f), flavor: 'You are now #' + data.rank_score + ' in the world.' });
        globalLoad();
    }
}
function globalQueue(p) {
    const list = globalPending();
    if (!list.some(x => x.f === p.f && (x.ion || 0) === (p.ion || 0))) {
        list.push(p);
        globalSetPending(list);
    }
}
function globalFlushPending() {
    if (!sb || !cloudUser || !cloudName) {
        return;
    }
    const list = globalPending().filter(p => p.pf);
    globalSetPending([]);
    list.forEach(p => globalSubmit(p));
}
function globalRow(r, rank) {
    const el = document.createElement('div');
    const mine = cloudName && r.display_name === cloudName;
    el.className = 'rank-row' + (mine ? ' mine' : '');
    const when = new Date(r.found_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    el.innerHTML = '<div class="rank-num">' + rank + '</div><div class="rank-main"><div class="rank-formula">' + esc(withIon(r.formula, bondBonus().ion ? r.ion : 0)) + '</div>' +
        '<div class="rank-name">' + esc(globalName(r.formula)) + '</div></div><div class="rank-odds"><b>' +
        'Score ' + fmtScore(r.score) + '</b><span title="Found ' + esc(when) + '">' +
        esc(r.display_name || 'Unknown') + (mine ? ' (you)' : '') + '</span></div>';
    return el;
}
function renderGlobal() {
    const root = $('globalList');
    if (!root) {
        return;
    }
    const list = globalBoard.score;
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
        'Your rolls are entered automatically when they score high enough to make the board. Scores are base values, before any buffs.';
    const s = note.querySelector('[data-go-settings]');
    if (s) {
        s.onclick = () => go('settings');
    }
    const home = $('homeGlobal');
    if (home) {
        const top = globalBoard.score || [];
        const mineAt = top.findIndex(r => cloudName && r.display_name === cloudName);
        home.textContent = mineAt >= 0 ? 'You are #' + (mineAt + 1) : top[0] ? 'Top score ' + fmtScore(top[0].score) : '';
    }
}
// the open Global screen: new globals come in through the banner and refresh it then, so this only
// catches top 10 changes that aren't announced (every minute if the live connection isn't up)
setInterval(() => {
    if ($('global').classList.contains('active') && document.visibilityState === 'visible' && (!rtChannel || Date.now() - globalBoard.at >= 5 * 60000)) {
        globalLoad();
    }
}, 60000);
// the banner: other players' globals, live. The connection closes a couple of minutes after
// the game goes off screen, so idle tabs don't use up the server's live connections.
let rtChannel = null;
const bannerQueue = [];
let bannerBusy = false;
function rtStart() {
    if (!sb || rtChannel || !CLOUD.enabled || document.visibilityState !== 'visible') {
        return;
    }
    rtChannel = sb.channel('globals')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, p => {
            rtLast = Math.max(rtLast, p.new.id || 0);
            bannerAdd(p.new);
            if ($('global').classList.contains('active')) {
                globalLoad();
            }
        })
        .subscribe(status => {
            // the free plan allows 200 live connections: past that, check for news every few minutes instead
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                rtStop();
                rtPollStart();
            }
        });
}
let rtLast = 0;
let rtPoll = 0;
let rtPolls = 0;
function rtPollStart() {
    if (rtPoll) {
        return;
    }
    rtCheck();
    rtPoll = setInterval(() => {
        rtCheck();
        // every 10 minutes, see if a live slot has come free
        if (++rtPolls % 10 === 0) {
            rtStart();
        }
    }, 180000);
}
async function rtCheck() {
    if (!sb || rtChannel || document.visibilityState !== 'visible') {
        return;
    }
    const { data } = await sb.from('announcements').select('*').gt('id', rtLast).order('id', { ascending: false }).limit(5);
    if (!data || !data.length) {
        return;
    }
    // the first look only finds out where things are up to
    const first = !rtLast;
    rtLast = Math.max(rtLast, data[0].id);
    if (!first) {
        data.reverse().forEach(bannerAdd);
    }
}
function rtStop() {
    if (sb && rtChannel) {
        sb.removeChannel(rtChannel);
    }
    rtChannel = null;
}
const jokeHidden = formula => (!jokesOn() || jokeHide) && Object.keys(parseFormula(formula || '')).some(isJoke);
function bannerAdd(a) {
    if (!a || !globalSettings.banner_enabled || (cloudName && a.display_name === cloudName) || jokeHidden(a.formula)) {
        return;
    }
    // old news, such as a backup being put back, isn't shown
    if (a.at && trustedNow() - Date.parse(a.at) > 300000) {
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
    const fx = RARITY_FX[Math.min(13, a.tier)];
    el.style.setProperty('--bc', fx ? fx.c : 'var(--hazard)');
    el.innerHTML = '<b>' + esc(a.display_name) + '</b> has found <b>' + esc((a.label || globalName(a.formula)) + (bondBonus().ion ? ionText(a.ion || 0) : '')) + '</b><span>' +
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
let giftsAt = 0;
async function giftsClaim() {
    if (!sb || !cloudUser || !cloudName) {
        return;
    }
    giftsAt = Date.now();
    const { data, error } = await sb.rpc('claim_gifts');
    if (error || !Array.isArray(data) || !data.length) {
        return;
    }
    const got = [];
    data.forEach(g => {
        if (CAT[g.catalyst] && g.qty > 0) {
            catInv[g.catalyst] = (catInv[g.catalyst] || 0) + g.qty;
            for (let i = 0; i < g.qty && g.id != null; i++) {
                srcAdd(g.catalyst, 'g|' + g.id + '|' + i);
            }
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
// a quick look at another tab or app keeps the live connection, and gifts are asked for at most every 10 minutes
let rtStopTimer = 0;
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        clearTimeout(rtStopTimer);
        rtStart();
        if (Date.now() - giftsAt > 10 * 60000) {
            giftsClaim();
        }
    } else {
        clearTimeout(rtStopTimer);
        rtStopTimer = setTimeout(rtStop, 2 * 60000);
    }
});
// when everyone is reset, every game that hears about it starts again from nothing
// progress only: settings, the account link and the dice stay
const RESET_KEYS = CLOUD_KEYS.concat(['elementalEvent', 'elementalQStorm', 'elementalQSeen', 'elementalQFlags', 'elementalJokeIntro', 'elementalAutoOn', 'elementalAutoState', 'elementalBonds2',
    'elementalCloudAt', 'elementalCloudHash', 'elementalCloudFresh', 'elementalCloudNotice', 'cloudReplacedBackup', 'globalPending', 'awayLastSeen']);
function resetCheck(at) {
    let seen = null;
    try {
        seen = localStorage.getItem('elementalResetSeen');
        // first time this game has looked: whatever has happened already doesn't apply to it
        if (seen == null) {
            localStorage.setItem('elementalResetSeen', at || '0');
            return;
        }
    } catch (e) {
        return;
    }
    if (!at || (seen !== '0' && Date.parse(seen) >= Date.parse(at))) {
        return;
    }
    try {
        RESET_KEYS.forEach(k => localStorage.removeItem(k));
        localStorage.setItem('elementalResetSeen', at);
        localStorage.setItem('elementalResetNote', '1');
    } catch (e) { }
    save.frozen = true;
    location.reload();
}
setTimeout(() => {
    try {
        if (localStorage.getItem('elementalResetNote')) {
            localStorage.removeItem('elementalResetNote');
            const w = openDialog('<h2>A fresh start</h2><p>Elemental has been reset for everyone, so every player starts again from the beginning. Good luck.</p><div class="btn-row"><button class="primary" id="resetOk">Let\'s go</button></div>');
            w.querySelector('#resetOk').onclick = closeDialog;
        }
    } catch (e) { }
}, 1200);
// a long session still hears about a reset
setInterval(() => document.visibilityState === 'visible' && globalLoad(), 3 * 3600000);
// Everything that needs a signed-in player with a name
function cloudAfterProfile() {
    renderGlobal();
    acFetch().then(globalFlushPending);
    giftsClaim();
    adminCheck();
    quarkSend();
}
// quarks going up by more than a big roll gives in one go get flagged to the admins
const QUARK_JUMP = 300000;
let quarkSeen = null;
try {
    quarkSeen = JSON.parse(localStorage.getItem('elementalQSeen'));
} catch (e) { }
function quarkWatch() {
    if (typeof quarkSeen !== 'number' || !Number.isFinite(quarkSeen)) {
        quarkSeen = quarks;
    }
    if (quarks - quarkSeen > QUARK_JUMP) {
        let list = [];
        try {
            list = JSON.parse(localStorage.getItem('elementalQFlags') || '[]');
        } catch (e) { }
        list.push([Math.floor(quarkSeen), Math.floor(quarks)]);
        try {
            localStorage.setItem('elementalQFlags', JSON.stringify(list.slice(-10)));
        } catch (e) { }
        quarkSend();
    }
    if (quarks !== quarkSeen) {
        quarkSeen = quarks;
        try {
            localStorage.setItem('elementalQSeen', JSON.stringify(quarkSeen));
        } catch (e) { }
    }
}
async function quarkSend() {
    if (!sb || !cloudUser || !cloudName) {
        return;
    }
    let list = [];
    try {
        list = JSON.parse(localStorage.getItem('elementalQFlags') || '[]');
        localStorage.removeItem('elementalQFlags');
    } catch (e) { }
    for (const [b, a] of list) {
        await sb.rpc('report_quarks', { p_before: b, p_after: a });
    }
}
quarkWatch();
setInterval(quarkWatch, 2000);
function errSend() {
    if (!sb || !CLOUD.enabled) {
        return;
    }
    errLog.filter(x => !x.sent).forEach(x => {
        x.sent = true;
        sb.rpc('report_error', { p_msg: x.m, p_where: x.w, p_ver: APP_VERSION, p_agent: navigator.userAgent.slice(0, 200) });
    });
}
setInterval(errSend, 20000);
