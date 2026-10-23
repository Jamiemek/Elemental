function assignAchievementRarities() {
    const weights = ELEMENTS.map(e => (1 / e[2]) * (1 + 1.5 * (Math.log10(e[2] + 1) / 3)));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const chainChance = 1 / 3;

    const logFactorial = n => {
        let total = 0;
        for (let i = 2; i <= n; i++) {
            total += Math.log(i);
        }
        return total;
    };

    function estimatedRolls(formula) {
        const counts = parseFormula(formula);
        const symbols = Object.keys(counts);
        const length = symbols.reduce((sum, symbol) => sum + counts[symbol], 0);
        if (length > 30) {
            return Infinity;
        }
        let logProbability = logFactorial(length);
        if (length < 30) {
            logProbability += (length - 1) * Math.log(chainChance) + Math.log(1 - chainChance);
        } else {
            logProbability += 29 * Math.log(chainChance);
        }
        symbols.forEach(symbol => {
            const weight = weights[ELEMENTS.findIndex(e => e[0] === symbol)];
            logProbability += counts[symbol] * Math.log(weight / totalWeight) - logFactorial(counts[symbol]);
        });
        return Math.exp(-logProbability);
    }

    ACHIEVEMENTS.forEach(a => {
        const rolls = estimatedRolls(a.formula);
        if (rolls < 2e3) a.rarity = 'Common';
        else if (rolls < 2e4) a.rarity = 'Uncommon';
        else if (rolls < 2e5) a.rarity = 'Rare';
        else if (rolls < 2e6) a.rarity = 'Epic';
        else a.rarity = 'Legendary';
    });

    unlockedAchievements = unlockedAchievements.filter(formula => ACHIEVEMENTS.some(a => a.formula === formula));
    document.querySelector('#achievements .sub').textContent = ACHIEVEMENTS.length + ' formulas to find. Each is recorded the first time you roll it.';
    renderAchievements();
}
assignAchievementRarities();
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && $('game').classList.contains('active') && !/INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)) {
        e.preventDefault();
        doRoll();
    }
});
try {
    $('chainSetting').value = localStorage.getItem('elementalChain') || 'on';
} catch (e) { }
$('appVersion').textContent = 'Jamiemek - Elemental - version ' + APP_VERSION;
function applyTheme(t) {
    const dark = t === 'dark' || (t === 'system' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
let themePref = 'light';
try {
    themePref = localStorage.getItem('elementalTheme') || 'light';
} catch (e) { }
$('themeSetting').value = themePref;
$('themeSetting').onchange = () => {
    themePref = $('themeSetting').value;
    try {
        localStorage.setItem('elementalTheme', themePref);
    } catch (e) { }
    applyTheme(themePref);
};
if (window.matchMedia) {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onSys = () => themePref === 'system' && applyTheme('system');
    mq.addEventListener ? mq.addEventListener('change', onSys) : mq.addListener(onSys);
}
try {
    calmFx = localStorage.getItem('elementalCalm') === '1';
} catch (e) { }
$('calmSetting').checked = calmFx;
$('calmSetting').onchange = () => {
    calmFx = $('calmSetting').checked;
    try {
        localStorage.setItem('elementalCalm', calmFx ? '1' : '0');
    } catch (e) { }
};
$('displaySetting').value = displayMode;
$('displaySetting').onchange = () => {
    displayMode = $('displaySetting').value === 'score' ? 'score' : 'odds';
    try {
        localStorage.setItem('elementalDisplay', displayMode);
    } catch (e) { }
    renderInventory();
    renderPeriodic();
    renderHistory();
};
renderQuarks();
renderQStorm();
renderHistory();
try {
    $('bonusFold').open = localStorage.getItem('elementalBonusOpen') === 'true';
} catch (e) { }
$('bonusFold').addEventListener('toggle', () => {
    try {
        localStorage.setItem('elementalBonusOpen', $('bonusFold').open ? 'true' : 'false');
    } catch (e) { }
});
$('chainSetting').onchange = () => {
    try {
        localStorage.setItem('elementalChain', $('chainSetting').value);
    } catch (e) { }
};
syncEffectSettings();
try {
    localStorage.removeItem('elementalStock');
} catch (e) { }
bondSummary();
renderActiveCats();
// tiers 10-12 only show once you've reached them
function tierRowsSync() {
    const top = collection.reduce((m, c) => Math.max(m, getRarityTier(c.score)), Math.max(0, ...seenLoad().fx));
    document.querySelectorAll('.tier-table tbody tr').forEach((tr, i) => tr.hidden = i >= 9 && i + 1 > top);
    $('tier9Top').textContent = top >= 10 ? 'to 30,000,000' : 'and above';
}
function jokeUiSync() {
    $('jokeSetting').hidden = !jokesOn();
    $('jokeMixSet').checked = jokeMix;
    $('jokeHideSet').checked = jokeHide;
}
function jokeSetMix(on) {
    jokeMix = on;
    try {
        localStorage.setItem('elementalJokeMix', on ? '1' : '0');
    } catch (e) { }
    weightCache = null;
}
$('jokeMixSet').addEventListener('change', () => jokeSetMix($('jokeMixSet').checked));
$('jokeHideSet').addEventListener('change', () => {
    jokeHide = $('jokeHideSet').checked;
    try {
        localStorage.setItem('elementalJokeHide', jokeHide ? '1' : '');
    } catch (e) { }
    if (typeof globalLoad === 'function') {
        globalLoad();
    }
});
// first unlock popup
function jokeIntroCheck() {
    let seen = true;
    try {
        seen = localStorage.getItem('elementalJokeIntro') === '1';
    } catch (e) { }
    if (seen || !jokesOn()) {
        return;
    }
    if (document.getElementById('dlg') || rolling) {
        setTimeout(jokeIntroCheck, 1500);
        return;
    }
    try {
        localStorage.setItem('elementalJokeIntro', '1');
    } catch (e) { }
    const w = openDialog('<h2>The joke periodic table</h2><p>' + JOKES.length + ' new elements are now in the pool, every one rarer than Uranium. Find them on the joke table in your Collection.</p>' +
        '<p>Mixing is on: joke elements can chain with real ones into joke compounds. You can turn it off now, or any time in Settings.</p>' +
        '<div class="btn-row"><button class="primary" id="jokeKeep">Keep mixing on</button><button class="ghost" id="jokeOff">Turn mixing off</button></div>');
    w.querySelector('#jokeKeep').onclick = closeDialog;
    w.querySelector('#jokeOff').onclick = () => {
        jokeSetMix(false);
        closeDialog();
    };
    if (typeof globalLoad === 'function') {
        globalLoad();
    }
}
setTimeout(jokeIntroCheck, 2500);
