// Admin tab: only shown to the admin account
let isAdmin = false;
async function adminCheck() {
    if (!sb || !cloudUser) {
        adminShow(false);
        return;
    }
    const { data } = await sb.rpc('is_admin');
    adminShow(data === true);
}
function adminShow(on) {
    isAdmin = !!on;
    document.querySelectorAll('.admin-only').forEach(e => e.hidden = !isAdmin);
    if (!isAdmin && $('admin').classList.contains('active')) {
        go('menu');
    }
}
function admMsg(id, text, bad) {
    const el = $(id);
    if (el) {
        el.textContent = text;
        el.classList.toggle('bad', !!bad);
    }
}
async function admCall(fn, args, msgId) {
    const { data, error } = await sb.rpc(fn, args || {});
    if (error) {
        admMsg(msgId, /not allowed/.test(error.message || '') ? 'Only the admin account can do that.' : 'Could not reach the server. Try again.', true);
        return { error };
    }
    return { data };
}
function renderAdmin() {
    if (!isAdmin) {
        return;
    }
    // what counts as a global
    const sel = $('admTier');
    if (!sel.options.length) {
        TIER_SCORES.forEach((min, i) => sel.add(new Option('Tier ' + (i + 1) + ' and above (score ' + fmtScore(min) + '+)', i + 1)));
        sel.add(new Option('No tier: only new global top 10 entries', 14));
    }
    sel.value = globalSettings.min_tier;
    $('admTop10').checked = globalSettings.announce_top10;
    $('admDiscord').checked = globalSettings.discord_enabled;
    $('admBanner').checked = globalSettings.banner_enabled;
    admMsg('admSetMsg', '');
    // giveaway catalyst list
    const cat = $('admCat');
    if (!cat.options.length) {
        CAT_TIERS.forEach((t, ti) => {
            const g = document.createElement('optgroup');
            g.label = t.name;
            CATALYSTS.filter(c => c.tier === ti).forEach(c => g.appendChild(new Option(c.name, c.id)));
            cat.appendChild(g);
        });
    }
    admPlayers();
    admBoard();
    admGifts();
    admBackups();
    admDevInfo();
}
$('admSave').onclick = async () => {
    const s = { p_min_tier: +$('admTier').value, p_top10: $('admTop10').checked, p_discord: $('admDiscord').checked, p_banner: $('admBanner').checked };
    admMsg('admSetMsg', 'Saving…');
    const r = await admCall('admin_settings', s, 'admSetMsg');
    if (!r.error) {
        globalSettings = { min_tier: s.p_min_tier, announce_top10: s.p_top10, discord_enabled: s.p_discord, banner_enabled: s.p_banner };
        admMsg('admSetMsg', 'Saved. Players pick this up the next time their game loads the board.');
    }
};
$('admTest').onclick = async () => {
    admMsg('admSetMsg', 'Sending a test post…');
    const r = await admCall('admin_test_discord', {}, 'admSetMsg');
    if (!r.error) {
        admMsg('admSetMsg', r.data === 'ok' ? (globalSettings.discord_enabled ? 'Test post sent. Check your Discord channel.' : 'Discord posts are switched off above, so nothing was sent.') :
            'No Discord webhook saved yet. Add it in Supabase first (see the setup steps).', r.data !== 'ok');
    }
};
async function admPlayers() {
    const q = $('admFind').value.trim();
    const list = $('admPlayerList');
    list.innerHTML = '<p class="adm-note">Loading…</p>';
    const r = await admCall('admin_players', { p_query: q }, 'admBanMsg');
    if (r.error) {
        list.innerHTML = '';
        return;
    }
    const rows = r.data || [];
    list.innerHTML = rows.length ? '' : '<p class="adm-note">No players match.</p>';
    rows.forEach(p => {
        const el = document.createElement('div');
        el.className = 'adm-row' + (p.banned ? ' banned' : '');
        el.innerHTML = '<div><b>' + esc(p.display_name) + '</b>' + (p.banned ? ' <span class="adm-tag">Banned</span>' : '') +
            '<small>Joined ' + new Date(p.joined).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) +
            ' · ' + formatNumber(p.submissions) + ' rolls sent · ' + formatNumber(p.globals) + ' globals' +
            (p.best_odds_log ? ' · best ' + rarityText(-p.best_odds_log) : '') + (p.banned && p.ban_reason ? ' · reason: ' + esc(p.ban_reason) : '') + '</small></div>' +
            (p.display_name === cloudName ? '<small>You</small>' : '<button class="ghost">' + (p.banned ? 'Unban' : 'Ban') + '</button>');
        const btn = el.querySelector('button');
        list.appendChild(el);
        if (!btn) {
            return;
        }
        btn.onclick = async () => {
            const reason = p.banned ? '' : $('admReason').value.trim();
            const res = await admCall('admin_ban', { p_name: p.display_name, p_reason: reason, p_banned: !p.banned }, 'admBanMsg');
            if (!res.error) {
                admMsg('admBanMsg', res.data === 'is_admin' ? "The admin account can't be banned." : res.data === 'ok' ? (p.banned ? p.display_name + ' is unbanned.' : p.display_name + ' is banned and hidden from the board.') : 'Player not found.', res.data !== 'ok');
                admPlayers();
                admBoard();
                globalLoad();
            }
        };
        list.appendChild(el);
    });
}
$('admFindBtn').onclick = admPlayers;
$('admFind').onkeydown = e => {
    if (e.key === 'Enter') {
        admPlayers();
    }
};
async function admBoard() {
    const list = $('admBoardList');
    const r = await admCall('admin_board', {}, 'admBoardMsg');
    if (r.error) {
        return;
    }
    const rows = r.data || [];
    list.innerHTML = rows.length ? '' : '<p class="adm-note">Nothing has been entered yet.</p>';
    rows.forEach(g => {
        const el = document.createElement('div');
        el.className = 'adm-row' + (g.removed || g.banned ? ' banned' : '');
        el.innerHTML = '<div><b>' + esc(withIon(g.formula, g.ion)) + '</b> · ' + esc(g.display_name) + (g.removed ? ' <span class="adm-tag">Removed</span>' : '') +
            (g.banned ? ' <span class="adm-tag">Player banned</span>' : '') + '<small>' + rarityText(-g.odds_log) + ' · score ' + fmtScore(g.score) + ' · ' +
            new Date(g.found_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) + '</small></div><button class="ghost">' + (g.removed ? 'Restore' : 'Remove') + '</button>';
        el.querySelector('button').onclick = async () => {
            const res = await admCall('admin_remove', { p_id: g.id, p_removed: !g.removed }, 'admBoardMsg');
            if (!res.error) {
                admMsg('admBoardMsg', g.formula + (g.removed ? ' is back on the board.' : ' is removed from the board.'));
                admBoard();
                globalLoad();
            }
        };
        list.appendChild(el);
    });
}
$('admGive').onclick = async () => {
    const everyone = $('admWhoAll').checked;
    const name = everyone ? '' : $('admWho').value.trim();
    const qty = Math.floor(+$('admQty').value);
    if (!everyone && !name) {
        admMsg('admGiftMsg', "Type the player's display name, or choose Everyone.", true);
        return;
    }
    if (!(qty >= 1 && qty <= 10000)) {
        admMsg('admGiftMsg', 'Choose an amount from 1 to 10,000.', true);
        return;
    }
    const c = CAT[$('admCat').value];
    admMsg('admGiftMsg', 'Sending…');
    const r = await admCall('admin_give', { p_name: name, p_catalyst: c.id, p_qty: qty, p_note: $('admNote').value.trim() }, 'admGiftMsg');
    if (!r.error) {
        admMsg('admGiftMsg', r.data === 'ok' ? qty + ' × ' + c.name + ' sent to ' + (everyone ? 'everyone' : name) + '. Players receive it the next time they open the game.' :
            r.data === 'not_found' ? 'No player has that display name.' : 'That gift could not be made.', r.data !== 'ok');
        if (r.data === 'ok') {
            $('admNote').value = '';
            admGifts();
        }
    }
};
document.querySelectorAll('input[name=admWhoMode]').forEach(r => r.onchange = () => {
    $('admWho').disabled = $('admWhoAll').checked;
});
async function admGifts() {
    const list = $('admGiftList');
    const r = await admCall('admin_gifts', {}, 'admGiftMsg');
    if (r.error) {
        return;
    }
    const rows = r.data || [];
    list.innerHTML = rows.length ? '' : '<p class="adm-note">No gifts sent yet.</p>';
    rows.forEach(g => {
        const el = document.createElement('div');
        el.className = 'adm-row';
        el.innerHTML = '<div><b>' + g.qty + ' × ' + esc(CAT[g.catalyst] ? CAT[g.catalyst].name : g.catalyst) + '</b> to ' + esc(g.recipient) +
            '<small>' + new Date(g.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) + ' · received by ' + g.claimed +
            (g.note ? ' · "' + esc(g.note) + '"' : '') + '</small></div>';
        list.appendChild(el);
    });
}

// backups
const admWhen = at => new Date(at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
const ADM_KIND = { manual: 'Made by you', daily: 'Nightly', before: 'Made automatically' };
async function admBackups() {
    const r = await admCall('admin_backups', {}, 'admBackupMsg');
    if (r.error) {
        return;
    }
    admBackupRows(r.data || []);
}
function admBackupRows(rows) {
    const list = $('admBackupList');
    list.innerHTML = rows.length ? '' : '<p class="adm-note">No backups yet.</p>';
    rows.forEach(b => {
        const el = document.createElement('div');
        el.className = 'adm-row';
        const kind = ADM_KIND[b.kind] || b.kind;
        el.innerHTML = '<div><b>' + admWhen(b.at) + '</b> · ' + esc(b.label || kind) + '<small>' + (b.label && b.label !== kind ? kind + ' · ' : '') +
            (b.players || 0) + ' players · ' + fmtBytes(b.size || 0) + '</small></div><div class="btn-row"><button class="ghost" data-a="get">Download</button><button class="ghost" data-a="back">Go back to this</button></div>';
        el.querySelector('[data-a=get]').onclick = () => admDownload(b);
        el.querySelector('[data-a=back]').onclick = () => admGoBack('the backup from ' + admWhen(b.at), { p_id: b.id, p_data: null });
        list.appendChild(el);
    });
}
$('admBackup').onclick = async () => {
    admMsg('admBackupMsg', 'Backing up…');
    const r = await admCall('admin_backup', { p_label: 'Made by you' }, 'admBackupMsg');
    if (!r.error) {
        admMsg('admBackupMsg', 'Backed up.');
        admBackupRows(r.data || []);
    }
};
async function admDownload(b) {
    admMsg('admBackupMsg', 'Getting the backup…');
    const r = await admCall('admin_backup_get', { p_id: b.id }, 'admBackupMsg');
    if (r.error || !r.data) {
        return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(r.data)], { type: 'application/json' }));
    a.download = 'elemental-backup-' + new Date(b.at).toISOString().slice(0, 16).replace(/[T:]/g, '-') + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    admMsg('admBackupMsg', 'Downloaded. Keep it somewhere safe.');
}
$('admBackupFile').onclick = () => $('admBackupPick').click();
$('admBackupPick').onchange = async () => {
    const f = $('admBackupPick').files[0];
    $('admBackupPick').value = '';
    if (!f) {
        return;
    }
    let d = null;
    try {
        d = JSON.parse(await f.text());
    } catch (e) { }
    if (!d || d.v !== 1 || !d.tables) {
        admMsg('admBackupMsg', "That file isn't an Elemental backup.", true);
        return;
    }
    admGoBack('the downloaded backup from ' + admWhen(d.at), { p_id: null, p_data: d });
};
// asks twice, the second time by typing
function admGoBack(what, args) {
    const w = openDialog('<h2>Go back?</h2><p>Everyone\'s saves, names, the global board, announcements and gifts go back to <b>' + esc(what) + '</b>. ' +
        'Anything since then is replaced. Players\' own games add back what they have when they next sync.</p>' +
        '<div class="btn-row"><button class="primary" id="gbYes">Continue</button><button class="ghost" id="gbNo">Cancel</button></div>');
    w.querySelector('#gbNo').onclick = closeDialog;
    w.querySelector('#gbYes').onclick = () => admTyped('Type RESTORE to go back to ' + esc(what) + '. A backup of how things are now is made first.', 'RESTORE', async () => {
        admMsg('admBackupMsg', 'Going back…');
        const r = await admCall('admin_restore', Object.assign({ p_confirm: 'RESTORE' }, args), 'admBackupMsg');
        if (!r.error) {
            admMsg('admBackupMsg', 'Done. Everything is back to ' + what + '.');
            admBackupRows(r.data || []);
            globalLoad();
        }
    });
}
function admTyped(text, word, then) {
    const w = openDialog('<h2>Are you sure?</h2><p>' + text + '</p><input id="admType" class="adm-input" autocomplete="off" autocapitalize="characters" spellcheck="false">' +
        '<div class="btn-row"><button class="primary danger" id="atGo" disabled>Confirm</button><button class="ghost" id="atNo">Cancel</button></div>');
    const input = w.querySelector('#admType');
    const go = w.querySelector('#atGo');
    input.oninput = () => go.disabled = input.value.trim() !== word;
    w.querySelector('#atNo').onclick = closeDialog;
    go.onclick = () => {
        closeDialog();
        then();
    };
    input.focus();
}
// four times over, the last by typing it out
const ADM_RESET_ASK = [
    'This clears every player\'s progress: every save, the whole global board, all announcements and gifts. Do you want to carry on?',
    'Every player will start again from nothing the next time their game loads. This affects everyone who has ever played. Still carry on?',
    'A backup is made first, so this can be undone from the backups list, but players will see their progress wiped until then. Are you really sure?'
];
function admResetAsk(i) {
    if (i >= ADM_RESET_ASK.length) {
        admTyped('Last check. Type RESET EVERYTHING to clear all community progress.', 'RESET EVERYTHING', async () => {
            admMsg('admResetMsg', 'Resetting…');
            const r = await admCall('admin_reset', { p_confirm: 'RESET EVERYTHING' }, 'admResetMsg');
            if (!r.error) {
                admMsg('admResetMsg', 'Everyone has been reset. A backup from just before is in the list above.');
                admBackupRows(r.data || []);
                globalLoad();
            }
        });
        return;
    }
    const w = openDialog('<h2>Are you sure? (' + (i + 1) + ' of 4)</h2><p>' + ADM_RESET_ASK[i] + '</p>' +
        '<div class="btn-row"><button class="ghost danger" id="arYes">Yes, carry on</button><button class="primary" id="arNo">Cancel</button></div>');
    w.querySelector('#arNo').onclick = closeDialog;
    w.querySelector('#arYes').onclick = () => admResetAsk(i + 1);
}
$('admReset').onclick = () => admResetAsk(0);

// the dev copy: stored on the server for admins only, kept on this device until a newer one is uploaded
async function devPack(text) {
    if (!window.CompressionStream) {
        return 'raw:' + text;
    }
    const buf = new Uint8Array(await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
    let bin = '';
    for (let i = 0; i < buf.length; i += 32768) {
        bin += String.fromCharCode.apply(null, buf.subarray(i, i + 32768));
    }
    return 'gz:' + btoa(bin);
}
async function devUnpack(d) {
    if (d.startsWith('raw:')) {
        return d.slice(4);
    }
    const bin = atob(d.slice(3));
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        buf[i] = bin.charCodeAt(i);
    }
    return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
}
async function admDevInfo() {
    const r = await admCall('admin_dev_info', {}, 'admDevMsg');
    if (r.error) {
        return false;
    }
    $('admDevInfo').textContent = r.data ? 'Uploaded ' + admWhen(r.data.at) + ' · ' + fmtBytes(r.data.size || 0) : 'No dev copy uploaded yet.';
    return r.data;
}
// kept in the browser's cache rather than localStorage, which the saves need the room in
async function devKept() {
    try {
        const r = await (await caches.open('elemental-dev')).match('dev-copy');
        return r ? await r.json() : null;
    } catch (e) {
        return null;
    }
}
async function devKeep(copy) {
    try {
        await (await caches.open('elemental-dev')).put('dev-copy', new Response(JSON.stringify(copy)));
    } catch (e) { }
}
$('admDevOpen').onclick = async () => {
    admMsg('admDevMsg', 'Opening…');
    const info = await admDevInfo();
    if (info === false) {
        return;
    }
    if (!info) {
        admMsg('admDevMsg', 'Upload a dev copy first.');
        return;
    }
    let kept = await devKept();
    if (!kept || kept.ver !== info.ver) {
        admMsg('admDevMsg', 'Downloading the new version…');
        const r = await admCall('admin_dev_get', {}, 'admDevMsg');
        if (r.error || !r.data) {
            return;
        }
        kept = r.data;
        devKeep(kept);
    }
    if (kept.data.startsWith('gz:') && !window.DecompressionStream) {
        admMsg('admDevMsg', 'This browser is too old to open it. Try updating it.', true);
        return;
    }
    devShow(await devUnpack(kept.data));
    admMsg('admDevMsg', '');
};
// full screen over the game, with a way back
function devShow(html) {
    const wrap = document.createElement('div');
    wrap.id = 'devCopy';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000';
    const frame = document.createElement('iframe');
    frame.style.cssText = 'width:100%;height:100%;border:0;display:block';
    frame.srcdoc = html;
    const shut = document.createElement('button');
    shut.className = 'primary';
    shut.textContent = 'Close';
    // bottom left, as the testing tools sit bottom right
    shut.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:100000;padding:5px 12px;font-size:12px;opacity:.85';
    shut.onclick = () => {
        wrap.remove();
        document.body.style.overflow = '';
    };
    wrap.appendChild(frame);
    wrap.appendChild(shut);
    document.body.appendChild(wrap);
    document.body.style.overflow = 'hidden';
}
$('admDevUp').onclick = () => $('admDevPick').click();
$('admDevPick').onchange = async () => {
    const f = $('admDevPick').files[0];
    $('admDevPick').value = '';
    if (!f) {
        return;
    }
    const text = await f.text();
    if (!text.includes('devcopy:') || !text.includes('(preview copy)')) {
        admMsg('admDevMsg', "That file isn't a dev copy of Elemental.", true);
        return;
    }
    admMsg('admDevMsg', 'Uploading…');
    const r = await admCall('admin_dev_put', { p_data: await devPack(text), p_size: text.length }, 'admDevMsg');
    if (!r.error) {
        admMsg('admDevMsg', 'Uploaded. Open it to try it out.');
        admDevInfo();
    }
};
