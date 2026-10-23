// first time tutorial, a fresh save only
const onScreen = id => $(id).classList.contains('active');
const TUT = [
    { on: 'menu', at: '.roll-cta', say: 'Welcome to Elemental. Every roll pulls elements from the periodic table, and the rarer they are the more they\'re worth. Tap Roll to start.', done: () => onScreen('game') },
    { on: 'game', at: '#rollBtn', roll: 'O', say: 'Press Roll.' },
    { at: '#rollBtn', roll: 'He', say: 'Oxygen, one of the most common elements there is. Every element has its own odds. Roll again.' },
    { at: '#rollBtn', roll: 'N', say: 'Helium. Once more.' },
    { at: '#game [data-go="inventory"]', say: 'Nitrogen. Everything you roll is kept in your collection. Open it.', done: () => onScreen('inventory') },
    { at: '[data-tab="completionist"]', say: 'Your best finds are ranked here. Tap All elements for the periodic table.', done: () => $('completionView').style.display !== 'none' },
    { at: '#periodic [data-sym="O"]', say: 'Elements light up once you\'ve found them. Tap oxygen.', done: () => onScreen('element') },
    { at: '#elementBuffPanel', say: 'Every element has a bonus, and it\'s yours for good from the first time you find it.' },
    { on: 'bonds', say: 'This is your bonds tree. Each slot asks for something you\'ve rolled, and filling it lights up the line to it for a bonus. Tap the glowing slot in the middle to put your oxygen in.', done: () => netFilled(0) },
    { on: 'bonds', say: 'The slots next to it want helium and nitrogen. Fill them both.', done: () => netFilled(1) && netFilled(2) },
    { on: 'bonds', say: 'Those rolls are used up now, but the bonuses stay. The tree goes a long way out.' },
    { on: 'shop', at: '#shopTimer', say: 'The catalyst shop. Catalysts boost your luck, your speed and plenty more for a while. They cost quarks, which every roll earns, and the stock changes on a timer.' },
    { on: 'catinv', say: 'Catalysts you buy wait in your inventory until you use them. Yours is empty for now.' },
    { on: 'settings', at: '#accountBody', say: 'Signing in with Google is optional. It keeps your save in the cloud and puts you on the global top 10. You can do it now or any time.' },
    { on: 'settings', say: 'Settings is also where you change the theme and sound, turn down flashing, and watch again any effect you\'ve seen.' },
    { on: 'game', at: '#qStormBar', storm: true, say: 'Every so often an event starts. Here\'s one on the house: a Quark Storm. Every roll earns extra quarks until it runs out.' },
    { on: 'game', say: 'That\'s all you need to get going. Expect the unexpected, there are many more secrets to uncover.' }
];
let tutAt = -1;
let tutScript = null;
let tutBox = null;
let tutSpot = null;
let tutTimer = 0;
function tutTake() {
    const s = tutScript;
    tutScript = null;
    return s;
}
function tutEnd() {
    tutAt = -1;
    tutScript = null;
    clearInterval(tutTimer);
    if (tutSpot) {
        tutSpot.classList.remove('tut-spot');
    }
    if (tutBox) {
        tutBox.remove();
        tutBox = null;
    }
    try {
        localStorage.setItem('elementalTutorial', 'done');
    } catch (e) { }
}
function tutShow(i) {
    const s = TUT[i];
    if (!s) {
        return tutEnd();
    }
    tutAt = i;
    try {
        localStorage.setItem('elementalTutorial', i);
    } catch (e) { }
    if (s.on && !onScreen(s.on)) {
        go(s.on);
    }
    const found = s.roll && discoveredSymbols().has(s.roll);
    tutScript = s.roll && !found ? s.roll : null;
    if (s.storm && !qStormOn()) {
        qStormStart();
        renderQStorm();
    }
    if (!tutBox) {
        tutBox = document.createElement('div');
        tutBox.className = 'tut';
        tutBox.setAttribute('role', 'dialog');
        tutBox.setAttribute('aria-live', 'polite');
        tutBox.innerHTML = '<p></p><div class="btn-row"><button class="ghost tut-skip">Skip tutorial</button><button class="primary tut-next">Next</button></div>';
        tutBox.querySelector('.tut-skip').onclick = tutEnd;
        tutBox.querySelector('.tut-next').onclick = () => tutShow(tutAt + 1);
        document.body.appendChild(tutBox);
    }
    tutBox.querySelector('p').textContent = s.say;
    const last = i === TUT.length - 1;
    const next = tutBox.querySelector('.tut-next');
    next.hidden = !!(s.done || s.roll);
    next.textContent = last ? 'Start playing' : 'Next';
    tutBox.querySelector('.tut-skip').hidden = last;
    tutSpot = null;
    clearInterval(tutTimer);
    tutTimer = setInterval(tutTick, 250);
    tutTick();
}
function tutTick() {
    const s = TUT[tutAt];
    if (!s) {
        return;
    }
    if (s.roll ? discoveredSymbols().has(s.roll) && !rolling : s.done && s.done()) {
        return tutShow(tutAt + 1);
    }
    // the page redraws a lot, so the highlight is found again each time
    let el = s.at && document.querySelector(s.at);
    el = el && el.closest('.screen.active') ? el : null;
    if (el !== tutSpot) {
        if (tutSpot) {
            tutSpot.classList.remove('tut-spot');
        }
        tutSpot = el;
        if (el) {
            el.classList.add('tut-spot');
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }
    const r = el && el.getBoundingClientRect();
    tutBox.classList.toggle('top', !!r && r.top + r.height / 2 > innerHeight * 0.55);
}
function tutInit() {
    let v = null;
    try {
        v = localStorage.getItem('elementalTutorial');
    } catch (e) { }
    if (v === 'done') {
        return;
    }
    // an older save, or one that just came down from the cloud
    if (v == null && totalRolls() > 0 || cloudGet('elementalCloudFresh') === '1') {
        return tutEnd();
    }
    tutShow(+v || 0);
}
