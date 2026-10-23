// Accounts and cloud saves (Supabase)
const CLOUD = {
    enabled: true,
    url: 'https://svfscvtskwuaygjgszog.supabase.co',
    key: 'sb_publishable_TF1DqFy8EPLwXOuZjPv_CQ_jgk2_oYf',
    lib: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.js'
};
const CLOUD_KEYS = ['elementalCollection', 'elementalCleared', 'elementalSeen', 'elementalAchievements', 'elementalQuarks', 'elementalHistory', 'elementalNetwork', 'elementalShop', 'elementalCatInv', 'elementalCatActive', 'elementalCatFlags', 'elementalIons'];
const CLOUD_EVERY = 45000;
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
    const d = {};
    CLOUD_KEYS.forEach(k => {
        const v = cloudGet(k);
        if (v != null) {
            d[k] = v;
        }
    });
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
function cloudSummary(d) {
    let col = [];
    let ach = [];
    try {
        col = unpackCollection(JSON.parse(d.elementalCollection || '[]'));
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
        rolls += c.count || 1;
        (c.elements || []).forEach(e => syms.add(e[0]));
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
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
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
    if (!localChanged || cloudSummary(local).rolls === 0) {
        cloudApply(row);
        return;
    }
    cloudBusy = false;
    cloudState = 'choose';
    renderAccount();
    cloudChoose(local, row);
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
        sb.from('saves').update({ data: d }).eq('user_id', cloudUser.id).eq('updated_at', at).select('updated_at') :
        sb.from('saves').upsert({ user_id: cloudUser.id, data: d }).select('updated_at');
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
    try {
        localStorage.setItem('cloudReplacedBackup', JSON.stringify(cloudSnapshot()));
    } catch (e) { }
    CLOUD_KEYS.forEach(k => cloudSet(k, row.data && row.data[k] != null ? row.data[k] : null));
    cloudSet('elementalCloudUser', cloudUser.id);
    cloudSet('elementalCloudAt', row.updated_at);
    cloudSet('elementalCloudHash', cloudHash(cloudSnapshot()));
    cloudSet('elementalCloudFresh', '1');
    location.reload();
}
// Periodic save: only when something changed since the last sync.
function cloudTick() {
    if (!sb || !cloudUser || cloudBusy || cloudState === 'choose') {
        return;
    }
    if (cloudHash(cloudSnapshot()) !== cloudGet('elementalCloudHash') || cloudState === 'error') {
        return cloudUpload(false);
    }
}
setInterval(cloudTick, CLOUD_EVERY);
document.addEventListener('visibilitychange', () => {
    if (!cloudUser) {
        return;
    }
    if (document.visibilityState === 'hidden') {
        cloudTick();
    } else if (!cloudBusy && cloudState !== 'choose') {
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
    if (!cloudName && cloudState !== 'choose') {
        openNameDialog(true);
    }
}
async function cloudSignIn() {
    if (!sb) {
        return;
    }
    const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
    if (error) {
        cloudFail(error);
    }
}
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
function cloudChoose(local, row) {
    const a = cloudSummary(local);
    const b = cloudSummary(row.data || {});
    const when = new Date(row.updated_at);
    const card = (title, s, sub, id) => '<div class="dlg-save"><h3>' + title + '</h3><p class="dlg-note">' + sub + '</p>' +
        '<dl><dt>Elements found</dt><dd>' + s.found + ' / 118</dd><dt>Rolls</dt><dd>' + formatNumber(s.rolls) + '</dd>' +
        '<dt>Achievements</dt><dd>' + s.ach + '</dd><dt>Quarks</dt><dd>' + formatNumber(s.quarks) + '</dd></dl>' +
        '<button class="ghost" id="' + id + '">Keep this one</button></div>';
    const w = openDialog('<h2>Two different saves</h2>' +
        '<p>This device and your account both have progress. Choose which one to keep. The other is replaced everywhere.</p>' +
        '<div class="dlg-saves">' + card('This device', a, 'Saved here', 'keepLocal') +
        card('Your account', b, 'Saved ' + when.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }), 'keepCloud') + '</div>');
    w.querySelector('#keepLocal').onclick = () => {
        closeDialog();
        cloudUpload(true).then(() => cloudName || cloudLoadProfile());
    };
    w.querySelector('#keepCloud').onclick = () => {
        closeDialog();
        cloudApply(row);
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
        const status = cloudState === 'syncing' ? 'Syncing…' : cloudState === 'choose' ? 'Waiting for you to choose a save' :
            cloudState === 'error' ? cloudError + '. Your progress is safe on this device and will sync when it can.' : 'Synced ' + cloudAgo();
        html = '<p>Signed in as <b>' + esc(cloudName || 'no name yet') + '</b> · ' + esc(cloudUser.email || '') + '</p>' +
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
