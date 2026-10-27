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
