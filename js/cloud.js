// Accounts and cloud saves (Supabase)
const CLOUD = {
    enabled: true,
    url: 'https://svfscvtskwuaygjgszog.supabase.co',
    key: 'sb_publishable_TF1DqFy8EPLwXOuZjPv_CQ_jgk2_oYf',
    lib: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.js'
};
const CLOUD_KEYS = ['elementalCollection', 'elementalCleared', 'elementalSeen', 'elementalAchievements', 'elementalQuarks', 'elementalHistory', 'elementalNetwork', 'elementalShop', 'elementalCatInv', 'elementalCatActive', 'elementalCatFlags', 'elementalCatSrc', 'elementalIons', 'elementalCosmetics', 'elementalUpLocks'];
// while playing; it also goes up on leaving, signing out and after a verified global
const CLOUD_EVERY = 15 * 60000;
let sb = null;
let cloudUser = null;
let cloudName = null;
let cloudState = 'loading'; // loading | offline | signedout | syncing | synced | error
let cloudBusy = false;
let cloudLastSync = 0;
let cloudError = '';
let cloudProfileReady = false;
const cloudGet = k => {
    try {
        return localStorage.getItem(k);
    } catch (e) {
        return null;
    }
};
const cloudSet = (k, v) => {
    try {
        if (v == null) {
            localStorage.removeItem(k);
        } else {
            localStorage.setItem(k, v);
        }
    } catch (e) { }
};
function cloudSnapshot() {
    flushSave();
    const d = {};
    CLOUD_KEYS.forEach(k => {
        const v = cloudGet(k);
        if (v != null) {
            d[k] = v;
        }
    });
    // the cloud keeps the last 100 rolls, this device keeps more
    if (d.elementalHistory) {
        try {
            d.elementalHistory = JSON.stringify(JSON.parse(d.elementalHistory).slice(0, 100));
        } catch (e) { }
    }
    return d;
}
function cloudHash(d) {
    const s = CLOUD_KEYS.map(k => k + '=' + (d[k] == null ? '' : d[k])).join('\n');
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36) + ':' + s.length;
}
// read straight from the saved formulas: unpacking a big collection here took seconds
function cloudSummary(d) {
    let col = [];
    let ach = [];
    try {
        col = JSON.parse(d.elementalCollection || '[]');
    } catch (e) { }
    try {
        ach = JSON.parse(d.elementalAchievements || '[]');
    } catch (e) { }
    const syms = new Set();
    let rolls = 0;
    try {
        rolls = JSON.parse(d.elementalCleared || '{}').rolls || 0;
    } catch (e) { }
    col.forEach(c => {
        const f = Array.isArray(c) ? c[0] : c && c.formula;
        if (typeof f !== 'string') {
            return;
        }
        rolls += (Array.isArray(c) ? +c[1] : +c.count) || 1;
        f.replace(/[A-Z][a-z]?/g, s => syms.add(s));
    });
    return { rolls, found: syms.size, ach: ach.length, quarks: Math.floor(parseFloat(d.elementalQuarks) || 0) };
}
function cloudLoadLib() {
    return new Promise((resolve, reject) => {
        if (window.supabase && window.supabase.createClient) {
            resolve();
            return;
        }
        const s = document.createElement('script');
        s.src = CLOUD.lib;
        s.async = true;
        s.onload = () => window.supabase ? resolve() : reject(new Error('lib'));
        s.onerror = () => reject(new Error('lib'));
        document.head.appendChild(s);
    });
}
// most of the name before the @ is starred out
function maskEmail(e) {
    const at = e.indexOf('@');
    if (at < 1) {
        return e;
    }
    const keep = at > 3 ? 2 : 1;
    return e.slice(0, keep) + '*'.repeat(Math.max(3, at - keep - 1)) + (at > 3 ? e[at - 1] : '') + e.slice(at);
}
async function cloudInit() {
    if (!CLOUD.enabled) {
        cloudState = 'disabled';
        renderAccount();
        return;
    }
    cloudState = 'loading';
    renderAccount();
    try {
        await cloudLoadLib();
        sb = window.supabase.createClient(CLOUD.url, CLOUD.key, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
            // a save sent as the page closes is allowed to finish (browsers cap these at 64 KB)
            global: { fetch: (u, o) => fetch(u, document.visibilityState === 'hidden' && o && typeof o.body === 'string' && o.body.length < 60000 ? Object.assign({}, o, { keepalive: true }) : o) }
        });
    } catch (e) {
        cloudState = 'offline';
        renderAccount();
        return;
    }
    // Supabase reports the starting session first, then any sign-in or sign-out
    sb.auth.onAuthStateChange((event, session) => {
        setTimeout(() => cloudOnSession(session), 0);
    });
    globalLoad();
    rtStart();
}
async function cloudOnSession(session) {
    const user = session && session.user;
    if (!user) {
        cloudUser = null;
        cloudName = null;
        cloudState = 'signedout';
        renderAccount();
        renderGlobal();
        adminShow(false);
        return;
    }
    if (cloudUser && cloudUser.id === user.id) {
        return;
    }
    cloudUser = user;
    if (/[?&]code=/.test(location.search)) {
        history.replaceState(null, '', location.pathname + location.hash);
    }
    await cloudSync();
    await cloudLoadProfile();
    if (cloudName) {
        cloudAfterProfile();
    }
    renderGlobal();
}
function cloudFail(error) {
    // turned away for being from before a reset: catch up with it, then save again
    if (error && /\breset\b/.test(error.message || '')) {
        cloudBusy = false;
        cloudState = 'synced';
        renderAccount();
        globalLoad().then(() => setTimeout(cloudTick, 2000));
        return;
    }
    // the server takes one save every 10 seconds: just try again shortly
    if (error && /too soon/.test(error.message || '')) {
        cloudBusy = false;
        cloudState = 'synced';
        renderAccount();
        setTimeout(cloudTick, 12000);
        return;
    }
    cloudBusy = false;
    cloudState = 'error';
    cloudError = navigator.onLine === false ? 'You are offline' : 'Could not reach the server';
    renderAccount();
    if (error) {
        console.warn('[cloud]', error.message || error);
    }
}
function cloudDone(at, hash) {
    cloudSet('elementalCloudUser', cloudUser.id);
    cloudSet('elementalCloudAt', at);
    cloudSet('elementalCloudHash', hash);
    cloudBusy = false;
    cloudState = 'synced';
    cloudLastSync = Date.now();
    renderAccount();
}
// Compares this device with the cloud and settles which save wins.
async function cloudSync() {
    if (!sb || !cloudUser || cloudBusy) {
        return;
    }
    cloudBusy = true;
    cloudState = 'syncing';
    renderAccount();
    const { data: head, error } = await sb.from('saves').select('updated_at').eq('user_id', cloudUser.id).maybeSingle();
    if (error) {
        cloudFail(error);
        return;
    }
    const local = cloudSnapshot();
    const hash = cloudHash(local);
    const linked = cloudGet('elementalCloudUser') === cloudUser.id;
    const localChanged = !linked || hash !== cloudGet('elementalCloudHash');
    // progress made before ever signing in to this account stays out of it: a new account
    // starts fresh, and an existing one is loaded as it is
    if (!linked && (head || cloudSummary(local).rolls > 0)) {
        let row = null;
        if (head) {
            const r = await sb.from('saves').select('data, updated_at').eq('user_id', cloudUser.id).maybeSingle();
            row = r.data;
            if (r.error || !row) {
                cloudFail(r.error);
                return;
            }
        } else {
            const r = await sb.from('saves').upsert({ user_id: cloudUser.id, data: cloudStamp({}) }).select('updated_at');
            if (r.error || !r.data || !r.data.length) {
                cloudFail(r.error);
                return;
            }
            row = { data: {}, updated_at: r.data[0].updated_at };
        }
        ['elementalEvent', 'elementalQStorm', 'globalPending', 'awayLastSeen'].forEach(k => cloudSet(k, null));
        cloudApply(row);
        return;
    }
    if (!head) {
        // first time on this account: this device's save becomes the cloud save
        cloudBusy = false;
        await cloudUpload(true);
        return;
    }
    const cloudChanged = !linked || head.updated_at !== cloudGet('elementalCloudAt');
    const fresh = cloudGet('elementalCloudFresh') === '1';
    cloudSet('elementalCloudFresh', null);
    if (!cloudChanged) {
        cloudBusy = false;
        // just restarted on a cloud save: the game tidying its storage on load isn't new progress
        if (localChanged && !fresh) {
            await cloudUpload(false);
        } else {
            cloudDone(head.updated_at, hash);
        }
        return;
    }
    const { data: row, error: err2 } = await sb.from('saves').select('data, updated_at').eq('user_id', cloudUser.id).maybeSingle();
    if (err2 || !row) {
        cloudFail(err2);
        return;
    }
    // the save that went up as this page last closed: nothing to merge
    if (cloudHash(row.data || {}) === hash) {
        cloudBusy = false;
        cloudDone(row.updated_at, hash);
        return;
    }
    if (!localChanged || cloudSummary(local).rolls === 0) {
        if (cloudElsewhere(row.data || {})) {
            cloudSet('elementalCloudNotice', 'elsewhere');
        }
        cloudApply(row);
        return;
    }
    await cloudMergeIn(local, row);
}
// Sends this device's progress up
async function cloudUpload(force) {
    if (!sb || !cloudUser || cloudBusy) {
        return;
    }
    cloudBusy = true;
    cloudState = 'syncing';
    renderAccount();
    const d = cloudSnapshot();
    const hash = cloudHash(d);
    const at = cloudGet('elementalCloudAt');
    const linked = cloudGet('elementalCloudUser') === cloudUser.id;
    const q = !force && linked && at ?
        sb.from('saves').update({ data: cloudStamp(d) }).eq('user_id', cloudUser.id).eq('updated_at', at).select('updated_at') :
        sb.from('saves').upsert({ user_id: cloudUser.id, data: cloudStamp(d) }).select('updated_at');
    const { data, error } = await q;
    if (error) {
        cloudFail(error);
        return;
    }
    if (!data || !data.length) {
        // another device saved since this one last synced
        cloudBusy = false;
        await cloudSync();
        return;
    }
    cloudDone(data[0].updated_at, hash);
}
// Replaces this device's progress with the cloud save and restarts the game on it.
function cloudApply(row) {
    cloudApplyData(row.data || {}, row.updated_at);
}
function cloudApplyData(d, at) {
    try {
        localStorage.setItem('cloudReplacedBackup', JSON.stringify(cloudSnapshot()));
    } catch (e) { }
    // stop anything writing over it before the reload
    save.frozen = true;
    autoWanted = false;
    autoRolling = false;
    CLOUD_KEYS.forEach(k => cloudSet(k, d[k] != null ? d[k] : null));
    cloudSet('elementalCloudUser', cloudUser.id);
    cloudSet('elementalCloudAt', at);
    cloudSet('elementalCloudHash', cloudHash(cloudSnapshot()));
    cloudSet('elementalCloudFresh', '1');
    // a save loaded from the account isn't a jump in quarks
    cloudSet('elementalQSeen', JSON.stringify(parseFloat(d.elementalQuarks) || 0));
    location.reload();
}
// who last wrote the save
const cloudDevice = acDev;
let cloudTouched = Date.now();
['pointerdown', 'keydown'].forEach(e => addEventListener(e, () => cloudTouched = Date.now(), true));
// r: the last reset this game knows about, so the server can turn away saves from before one
const cloudStamp = (d, quiet) => Object.assign({ dev: cloudDevice, at: quiet ? 0 : (trustedNow() || Date.now()), r: cloudGet('elementalResetSeen') || undefined }, d);
const cloudElsewhere = d => !!d.dev && d.dev !== cloudDevice && (trustedNow() || Date.now()) - (d.at || 0) < 150000;
// finds and bonds from both, spendable stuff from whichever rolled more
function cloudMerge(a, b) {
    const read = (d, k, empty) => {
        try {
            return JSON.parse(d[k] || 'null') || empty;
        } catch (e) {
            return empty;
        }
    };
    const main = cloudSummary(a).rolls >= cloudSummary(b).rolls ? a : b;
    const out = {};
    CLOUD_KEYS.forEach(k => {
        if (main[k] != null) {
            out[k] = main[k];
        }
    });
    const finds = new Map();
    [a, b].forEach(d => read(d, 'elementalCollection', []).forEach(x => {
        const r = Array.isArray(x) ? x : x && [x.formula, x.count, x.spent];
        if (!r || typeof r[0] !== 'string') {
            return;
        }
        const old = finds.get(r[0]);
        finds.set(r[0], old ? old.map((v, i) => i ? Math.max(+v || 0, +r[i] || 0) : v) : [r[0], +r[1] || 1, +r[2] || 0, +r[3] || 0, +r[4] || 0]);
    }));
    const ca = read(a, 'elementalCleared', {});
    const cb = read(b, 'elementalCleared', {});
    // a find only one save has, scoring under the other's clear cut-off, was cleared there:
    // bringing it back would count its rolls twice. Anything that's the only home of an element stays
    const has = [a, b].map(d => new Set(read(d, 'elementalCollection', []).map(x => Array.isArray(x) ? x[0] : x && x.formula)));
    const ach = new Set(ACHIEVEMENTS.map(x => normalizeFormula(x.formula)));
    const syms = f => Object.keys(parseFormula(f));
    const cleared = f => {
        const els = [];
        Object.entries(parseFormula(f)).forEach(([s, n]) => {
            for (let i = 0; i < n; i++) {
                els.push(elementBySymbol[s]);
            }
        });
        if (els.length < 2 || els.some(e => !e) || ach.has(f)) {
            return false;
        }
        const sc = rollScore(els);
        return (!has[0].has(f) && sc < (ca.min || 0)) || (!has[1].has(f) && sc < (cb.min || 0));
    };
    const drop = new Set([...finds.keys()].filter(cleared));
    const kept = new Set();
    finds.forEach((r, f) => !drop.has(f) && syms(f).forEach(s => kept.add(s)));
    drop.forEach(f => syms(f).some(s => !kept.has(s)) && drop.delete(f));
    out.elementalCollection = JSON.stringify([...finds.values()].filter(r => !drop.has(r[0])).map(r => r[3] || r[4] ? r : r[2] ? r.slice(0, 3) : r.slice(0, 2)));
    out.elementalCleared = JSON.stringify({ rolls: Math.max(ca.rolls || 0, cb.rolls || 0), formulas: Math.max(ca.formulas || 0, cb.formulas || 0), min: Math.max(ca.min || 0, cb.min || 0) });
    const both = (k, empty) => [read(a, k, empty), read(b, k, empty)];
    const union = (x, y) => [...new Set([].concat(Array.isArray(x) ? x : [], Array.isArray(y) ? y : []))];
    const [aa, ab] = both('elementalAchievements', []);
    out.elementalAchievements = JSON.stringify(union(aa, ab));
    const [na, nb] = both('elementalNetwork', {});
    out.elementalNetwork = JSON.stringify(Object.assign({}, na, nb));
    const [sa, sb2] = both('elementalSeen', {});
    out.elementalSeen = JSON.stringify({ cut: union(sa.cut, sb2.cut), fx: union(sa.fx, sb2.fx), dark: union(sa.dark, sb2.dark) });
    const [ia, ib] = both('elementalIons', {});
    const marks = Object.assign({}, ia.m);
    Object.entries(ib.m || {}).forEach(([s, m]) => marks[s] = marks[s] ? [Math.max(marks[s][0], m[0]), Math.max(marks[s][1], m[1])] : m);
    out.elementalIons = JSON.stringify({ m: marks, n: union(ia.n, ib.n) });
    const cos = read(main, 'elementalCosmetics', {});
    const [ka, kb] = both('elementalCosmetics', {});
    cos.owned = union(ka.owned, kb.owned);
    out.elementalCosmetics = JSON.stringify(cos);
    return out;
}
async function cloudMergeIn(local, row) {
    const theirs = row.data || {};
    const merged = cloudMerge(local, theirs);
    const busy = cloudElsewhere(theirs);
    // nobody's touched this one, so it gives way
    const idle = busy && Date.now() - cloudTouched > 120000;
    const { data, error } = await sb.from('saves').update({ data: cloudStamp(merged, idle) }).eq('user_id', cloudUser.id).eq('updated_at', row.updated_at).select('updated_at');
    if (error) {
        cloudFail(error);
        return;
    }
    if (!data || !data.length) {
        cloudBusy = false;
        await cloudSync();
        return;
    }
    if (busy) {
        cloudSet('elementalCloudNotice', idle ? 'paused' : 'elsewhere');
    }
    if (idle) {
        cloudSet('elementalAutoOn', null);
    }
    cloudApplyData(merged, data[0].updated_at);
}
function cloudNotice() {
    const n = cloudGet('elementalCloudNotice');
    cloudSet('elementalCloudNotice', null);
    if (n === 'paused') {
        openDialog('<h2>Paused on this device</h2><p>Your save was being played on another device, so this one stopped autorolling and picked up the progress from both. ' +
            'Carry on here whenever you like.</p><div class="btn-row"><button class="primary" id="pausedOk">OK</button></div>').querySelector('#pausedOk').onclick = closeDialog;
    } else if (n === 'elsewhere') {
        showAchievementToast({ kicker: 'Another device', name: 'Elemental is open somewhere else', flavor: 'Progress from both is kept, but please close the other one so this one stops restarting to catch up.' });
    }
}
setTimeout(cloudNotice, 1200);
// Periodic save: only when something changed since the last sync.
function cloudTick() {
    if (!sb || !cloudUser || cloudBusy) {
        return;
    }
    if (cloudHash(cloudSnapshot()) !== cloudGet('elementalCloudHash') || cloudState === 'error') {
        return cloudUpload(false);
    }
}
setInterval(cloudTick, CLOUD_EVERY);
addEventListener('pagehide', () => cloudUser && cloudTick());
document.addEventListener('visibilitychange', () => {
    if (!cloudUser) {
        return;
    }
    if (document.visibilityState === 'hidden') {
        cloudTick();
    } else if (!cloudBusy) {
        // back on this device: pick up anything played elsewhere
        cloudSync();
    }
});
async function cloudLoadProfile() {
    if (!sb || !cloudUser) {
        return;
    }
    const { data } = await sb.from('profiles').select('display_name').eq('id', cloudUser.id).maybeSingle();
    cloudName = data && data.display_name || null;
    cloudProfileReady = true;
    renderAccount();
    if (!cloudName) {
        openNameDialog(true);
    }
}
async function cloudSignIn() {
    if (!sb) {
        return;
    }
    if (!cloudGet('elementalCloudUser') && cloudSummary(cloudSnapshot()).rolls > 0 && !cloudSignIn.ok) {
        const w = openDialog('<h2>Signing in starts fresh</h2><p>Progress made on this device without an account doesn\'t carry over to one, so the global board stays fair. ' +
            'A new account starts from the beginning, and an account you already have loads as it is.</p>' +
            '<div class="btn-row"><button class="primary" id="freshGo">Sign in</button><button class="ghost" id="freshNo">Not now</button></div>');
        w.querySelector('#freshGo').onclick = () => {
            closeDialog();
            cloudSignIn.ok = true;
            cloudSignIn();
        };
        w.querySelector('#freshNo').onclick = closeDialog;
        return;
    }
    const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
    if (error) {
        cloudFail(error);
    }
}
// signed-out players are asked once, early on, while there's little to lose by signing in
function saveNudge() {
    const n = totalRolls();
    if (n >= 25 && !saveNudge.kept && navigator.storage && navigator.storage.persist) {
        saveNudge.kept = true;
        navigator.storage.persisted().then(p => p || navigator.storage.persist()).catch(() => { });
    }
    if (cloudUser || !sb || !CLOUD.enabled || rolling || tutAt >= 0 || $('dlg') || n < 25 || n > 400 || cloudGet('elementalNudged')) {
        return;
    }
    cloudSet('elementalNudged', '1');
    const w = openDialog('<h2>Keep your progress safe</h2><p>Right now your progress is only saved in this browser, so clearing its data would lose it. ' +
        'Signing in keeps it safe and syncs it between your devices.</p><p>Rolls made before signing in don\'t carry over to an account, so it\'s best done early.</p>' +
        '<div class="btn-row"><button class="primary" id="nudgeGo">Sign in</button><button class="ghost" id="nudgeNo">Not now</button></div>');
    w.querySelector('#nudgeGo').onclick = () => {
        closeDialog();
        cloudSignIn.ok = true;
        cloudSignIn();
    };
    w.querySelector('#nudgeNo').onclick = closeDialog;
}
setInterval(saveNudge, 15000);
async function cloudSignOut() {
    if (!sb) {
        return;
    }
    await cloudTick();
    await sb.auth.signOut();
}
// dialogs (name choice and save conflict)
function openDialog(html) {
    closeDialog();
    const wrap = document.createElement('div');
    wrap.className = 'dlg-wrap';
    wrap.id = 'dlg';
    wrap.innerHTML = '<div class="dlg" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(wrap);
    return wrap;
}
function closeDialog() {
    const d = $('dlg');
    if (d) {
        d.remove();
    }
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
function openNameDialog(first) {
    const w = openDialog('<h2>' + (first ? 'Choose a display name' : 'Change your name') + '</h2>' +
        '<p>This is the name other players see on the global leaderboard and in announcements.</p>' +
        '<input id="nameInput" maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(cloudName || '') + '">' +
        '<p class="dlg-note" id="nameNote">3 to 16 letters, numbers or underscores.</p>' +
        '<div class="btn-row"><button class="primary" id="nameSave">Save name</button><button class="ghost" id="nameCancel">' + (first ? 'Later' : 'Cancel') + '</button></div>');
    const input = w.querySelector('#nameInput');
    const note = w.querySelector('#nameNote');
    input.focus();
    const save = async () => {
        const n = input.value.trim();
        if (!/^[A-Za-z0-9_]{3,16}$/.test(n)) {
            note.textContent = 'Use 3 to 16 letters, numbers or underscores, with no spaces.';
            note.classList.add('bad');
            return;
        }
        note.textContent = 'Saving…';
        note.classList.remove('bad');
        const { data, error } = await sb.rpc('set_display_name', { new_name: n });
        const msg = {
            ok: '', invalid: 'Use 3 to 16 letters, numbers or underscores, with no spaces.', blocked: "That name isn't allowed. Try another.",
            taken: 'That name is taken. Try another.', signed_out: 'You have been signed out. Sign in again to choose a name.'
        };
        if (error || data !== 'ok') {
            note.textContent = error ? 'Could not reach the server. Try again in a moment.' : (msg[data] || 'Something went wrong. Try again.');
            note.classList.add('bad');
            return;
        }
        cloudName = n;
        closeDialog();
        renderAccount();
        cloudAfterProfile();
    };
    w.querySelector('#nameSave').onclick = save;
    input.onkeydown = e => {
        if (e.key === 'Enter') {
            save();
        }
    };
    w.querySelector('#nameCancel').onclick = () => {
        closeDialog();
        renderAccount();
    };
}
// the Account section in Settings
function cloudAgo() {
    const s = Math.round((Date.now() - cloudLastSync) / 1000);
    return s < 60 ? 'just now' : s < 3600 ? Math.round(s / 60) + ' min ago' : 'over an hour ago';
}
function renderAccount() {
    const box = $('accountBody');
    if (!box) {
        return;
    }
    const why = '<p>Sign in to keep your progress in sync across your devices and to qualify for the global leaderboard. ' +
        'You can always play without signing in; your progress is saved on this device. <a href="privacy.html">Privacy</a></p>';
    let html;
    if (cloudState === 'disabled') {
        html = '<p>Accounts are switched off in this copy of the game.</p>';
    } else if (cloudState === 'loading') {
        html = why + '<p class="acct-status">Checking your account…</p>';
    } else if (cloudState === 'offline') {
        html = '<p>Accounts aren\'t available right now, so your progress is being saved on this device as usual.</p>' +
            '<div class="btn-row"><button class="ghost" id="acctRetry">Try again</button></div>';
    } else if (!cloudUser) {
        html = why + '<div class="btn-row"><button class="ghost" id="acctIn">Sign in with Google</button></div>';
    } else {
        const status = cloudState === 'syncing' ? 'Syncing…' :
            cloudState === 'error' ? cloudError + '. Your progress is safe on this device and will sync when it can.' : 'Synced ' + cloudAgo();
        html = '<p>Signed in as <b>' + esc(cloudName || 'no name yet') + '</b> · ' + esc(maskEmail(cloudUser.email || '')) + '</p>' +
            '<p class="acct-status' + (cloudState === 'error' ? ' bad' : '') + '">' + status + '</p>' +
            '<div class="btn-row"><button class="ghost" id="acctSync">Sync now</button><button class="ghost" id="acctName">' +
            (cloudName ? 'Change name' : 'Choose a name') + '</button><button class="ghost" id="acctOut">Sign out</button></div>';
    }
    box.innerHTML = html;
    const on = (id, f) => {
        const b = $(id);
        if (b) {
            b.onclick = f;
        }
    };
    on('acctRetry', cloudInit);
    on('acctIn', cloudSignIn);
    on('acctSync', () => cloudSync());
    on('acctName', () => openNameDialog(!cloudName));
    on('acctOut', cloudSignOut);
}
setInterval(() => {
    if (cloudState === 'synced' && $('settings').classList.contains('active')) {
        renderAccount();
    }
}, 30000);
