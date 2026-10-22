const AWAY_MAX = 24 * 3600;
const AWAY_SLOWER = 10;
const trustedNow = () => clockBase ? clockBase.server + (performance.now() - clockBase.perf) : null;
async function clockSync() {
    if (!CLOUD.enabled) {
        // the preview copy has no server to ask
        clockBase = { server: Date.now(), perf: performance.now() };
        return true;
    }
    if (!sb) {
        return false;
    }
    const t0 = performance.now();
    const { data, error } = await sb.rpc('server_time');
    const t1 = performance.now();
    const ms = typeof data === 'string' ? Date.parse(data) : NaN;
    if (error || !Number.isFinite(ms)) {
        return false;
    }
    clockBase = { server: ms + (t1 - t0) / 2, perf: t1 };
    return true;
}
// the last time the game was seen open, in server time ({ t: null } = couldn't be checked)
let awaySince = null;
try {
    const v = JSON.parse(localStorage.getItem('awayLastSeen') || 'null');
    awaySince = v && typeof v === 'object' ? v : null;
} catch (e) { }
function awayStamp() {
    const t = trustedNow();
    if (t == null) {
        return;
    }
    try {
        localStorage.setItem('awayLastSeen', JSON.stringify({ t: Math.round(t) }));
    } catch (e) { }
}
// keep the "last seen" time fresh, so it is right even if a phone closes the page without warning
setInterval(awayStamp, 15000);
addEventListener('pagehide', awayStamp);
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        awayStamp();
    } else if (clockBase) {
        clockSync();
    }
});
// how many rolls the time away is worth: autoroll's full cycle (roll + break), ten times slower
function awayRollsFor(seconds) {
    const b = activeBuffStats();
    if (!b.autoUnlocked || !(seconds > 0)) {
        return 0;
    }
    const rollSec = Math.max(300, 3000 / (1 + b.speed / 100)) / 1000;
    const cycle = (b.autoGap + rollSec + 1) * AWAY_SLOWER;
    return Math.floor(seconds / cycle) * (1 + b.extra);
}
function awayMakeRoll(b) {
    const elements = [weightedElement(0)];
    while (elements.length < 30 && Math.random() < 1 / b.chainDenom) {
        elements.push(weightedElement(0));
    }
    const formula = hillFormula(elements);
    const log = exactRarity(elements, 0);
    const known = ACHIEVEMENTS.find(a => a.hill === formula);
    const name = elements.length === 1 ? elements[0][1] : (known ? known.name : elements.map(e => e[1]).join(' + '));
    return { elements, formula, name, log, rarity: rarityText(log), score: rollScore(elements) };
}
function fmtClock(s) {
    s = Math.max(0, Math.floor(s));
    return Math.floor(s / 3600) + ':' + String(Math.floor(s % 3600 / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
// wait until accounts have settled, so away rolls never clash with a save from another device
function awayWaitForCloud() {
    return new Promise(resolve => {
        const t0 = Date.now();
        (function check() {
            const settled = !CLOUD.enabled || ['offline', 'signedout', 'disabled', 'error'].includes(cloudState) || (cloudUser && cloudProfileReady);
            if (settled || (cloudState !== 'choose' && Date.now() - t0 > 8000)) {
                resolve();
            } else {
                setTimeout(check, 200);
            }
        })();
    });
}
async function awayProcess() {
    await awayWaitForCloud();
    const clockOk = await clockSync();
    clockTried = true;
    if (!clockOk) {
        // the time can't be checked, so this session can't be trusted as time away later either
        try {
            localStorage.setItem('awayLastSeen', JSON.stringify({ t: null }));
        } catch (e) { }
        return;
    }
    const since = awaySince && typeof awaySince.t === 'number' ? awaySince.t : null;
    awayStamp();
    if (since == null) {
        return;
    }
    const seconds = Math.min(AWAY_MAX, Math.max(0, (trustedNow() - since) / 1000));
    const n = awayRollsFor(seconds);
    if (n < 1) {
        return;
    }
    const b = activeBuffStats();
    const index = new Map(collection.map(c => [c.formula, c]));
    const mult = 1 + (b.quark || 0) / 100;
    const firstFinds = [];
    const hist = [];
    let total = totalRolls();
    let earned = 0;
    let best = null;
    // storms work per press of Roll, and each press is (1 + bonus rolls) rolls
    const per = 1 + b.extra;
    const stormWas = qStormOn();
    let stormAdd = null;
    let stormQ = 0;
    let stormStarted = false;
    for (let i = 0; i < n; i++) {
        if (i % per === 0) {
            const sp = qStormPress(Math.min(per, n - i));
            stormAdd = sp && sp.add;
            stormStarted = stormStarted || !!(sp && sp.started);
        }
        if (stormAdd) {
            earned += stormAdd[i % per];
            stormQ += stormAdd[i % per];
        }
        const r = awayMakeRoll(b);
        if (!best || (displayMode === 'score' ? r.score > best.score : r.log < best.log)) {
            best = r;
        }
        let x = index.get(r.formula);
        if (!x) {
            x = { formula: r.formula, name: r.name, elements: r.elements, rarity: r.rarity, log: r.log, score: r.score, count: 0 };
            collection.push(x);
            index.set(r.formula, x);
            firstFinds.push(x);
        }
        x.count++;
        total++;
        earned += quarksFor(r.score, mult);
        if (n - i <= HISTORY_MAX) {
            hist.push({ n: total, f: r.formula, l: r.log, s: r.score });
        }
    }
    renderQStorm();
    rollHistory = hist.reverse().concat(rollHistory).slice(0, HISTORY_MAX);
    try {
        localStorage.setItem('elementalHistory', JSON.stringify(rollHistory));
    } catch (e) { }
    save();
    addQuarks(earned);
    firstFinds.forEach(r => checkAchievements(r));
    renderHistory();
    renderInventory();
    renderPeriodic();
    if (typeof renderHome === 'function') {
        renderHome();
    }
    // only the rarest is played, shown and sent on
    const rec = Object.assign({}, best, { id: Date.now() + Math.random(), when: new Date().toISOString() });
    globalConsider(rec);
    go('game');
    while (rolling) {
        await new Promise(r => setTimeout(r, 100));
    }
    await doRoll([best]);
    const w = openDialog('<h2>While you were away</h2>' +
        '<p class="away-big">You rolled <b>' + formatNumber(n) + '</b> times while you were away.</p>' +
        '<p class="away-clock">' + fmtClock(seconds) + ' / 24:00:00</p>' +
        '<dl class="away-best"><dt>Your rarest find was</dt><dd>' + esc(best.name) + ' <span>' + esc(best.formula) + '</span></dd>' +
        '<dt>With ' + (displayMode === 'score' ? 'a score' : 'odds') + ' of</dt><dd>' + (displayMode === 'score' ? fmtScore(best.score) : rarityText(best.log)) + '</dd></dl>' +
        (stormQ || stormStarted ? '<p class="away-storm"><b>Quark Storm</b> ' + (stormStarted || !stormWas ? 'hit while you were away' : qStormOn() ? 'carried on while you were away' : 'blew itself out while you were away') +
            (stormQ ? ': +' + formatNumber(stormQ) + ' quarks' : '') + '.' + (qStormOn() ? ' It is still going, with ' + qStorm.left + ' rolls left.' : '') + '</p>' : '') +
        '<div class="btn-row"><button class="primary" id="awayOk">Nice</button></div>');
    w.querySelector('#awayOk').onclick = closeDialog;
}
