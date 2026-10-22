const RARITY_FX = [
    null,
    { c: '#7cc8ff', c2: '#2f6bff', ms: 1800 },
    { c: '#5eead4', c2: '#0e9f9a', ms: 2300 },
    { c: '#b39dff', c2: '#6d4cff', ms: 3000 },
    { c: '#f78fd8', c2: '#c026d3', ms: 3600 },
    { c: '#ffd166', c2: '#ff8c1a', ms: 4400 },
    { c: '#ff9a5c', c2: '#e8431a', ms: 5200 },
    { c: '#ff5d7a', c2: '#b0123a', ms: 6000 },
    { c: '#c9b8ff', c2: '#4b2bff', ms: 6200, vd: 2400, hb: [500, 1050, 1500, 1850, 2100] },
    { c: '#fff6d6', c2: '#ff7ad9', ms: 8000, vd: 4320, hb: [0, 900, 1700, 2400, 3000, 3500, 3900] }
];
// Secret variants for tiers 5 to 9: about 1 in 10 of those rolls play these instead.
const SECRET_CHANCE = 0.1;
const RARITY_DARK = [
    null, null, null, null, null,
    { c: '#b3201c', c2: '#2a0404', ms: 4600 },
    { c: '#e0261c', c2: '#3a0000', ms: 5600 },
    { c: '#9dff3a', c2: '#0b2205', ms: 6400 },
    { c: '#ff2a2a', c2: '#160000', ms: 6200, vd: 2400, hb: [400, 1150, 1320, 1900, 2040, 2230] },
    { c: '#ff2a2a', c2: '#5a0000', ms: 8400, vd: 4320, hb: [0, 700, 1600, 1760, 2600, 3100, 3260, 3700, 3950, 4120] }
];
let rarityEffectTimer = null;
let fxRunId = 0;
let runningFx = [];
let calmFx = false;
function tameFlash(frames, dur) {
    if (!frames.length || frames.some(f => f.opacity == null)) {
        return frames;
    }
    const n = frames.length;
    const off = frames.map((f, i) => f.offset != null ? f.offset : i === 0 ? 0 : i === n - 1 ? 1 : null);
    for (let i = 1; i < n; i++) {
        if (off[i] == null) {
            let j = i;
            while (off[j] == null) {
                j++;
            }
            for (let k = i; k < j; k++) {
                off[k] = off[i - 1] + (off[j] - off[i - 1]) * (k - i + 1) / (j - i + 1);
            }
        }
    }
    const ops = frames.map(f => +f.opacity);
    ops[0] = 0;
    let k = 1;
    for (let i = 0; i + 1 < n; i++) {
        const d = Math.abs(ops[i + 1] - ops[i]);
        if (d > 0) {
            k = Math.min(k, 0.0016 * Math.max(1, (off[i + 1] - off[i]) * dur) / d);
        }
    }
    const top = Math.max(...ops);
    if (top * k > 0.45) {
        k = 0.45 / top;
    }
    return frames.map((f, i) => Object.assign({}, f, { opacity: ops[i] * k }, f.easing && f.easing.includes('steps') ? { easing: 'linear' } : {}));
}
function animateFx(el, frames, o) {
    if (calmFx && el.classList.contains('fx-fill')) {
        frames = tameFlash(frames, (o && o.duration) || 1000);
        if (o && o.easing && o.easing.includes('steps')) {
            o = Object.assign({}, o, { easing: 'linear' });
        }
    }
    const a = el.animate(frames, Object.assign({ fill: 'both', easing: 'ease-out' }, o));
    runningFx.push(a);
    return a;
}
function createFxElement(ov, cls, css) {
    const e = document.createElement('div');
    e.className = 'fx ' + cls;
    if (css) {
        e.style.cssText = css;
    }
    ov.appendChild(e);
    return e;
}
function stopFx() {
    fxRunId++;
    if (rarityEffectTimer) {
        clearTimeout(rarityEffectTimer);
        rarityEffectTimer = null;
    }
    runningFx.splice(0).forEach(a => {
        try {
            a.cancel();
        } catch (e) { }
    });
    const ov = $('rarityEffect');
    if (ov) {
        ov.innerHTML = '';
    }
    document.body.classList.remove('fx-warping');
}
// Rarity effects
let runningPageFx = [];
function stopPageFx() {
    runningPageFx.splice(0).forEach(a => {
        try {
            a.cancel();
        } catch (e) { }
    });
    document.documentElement.classList.remove('fx-on');
    const app = document.querySelector('.app');
    if (app) {
        app.style.transformOrigin = '';
    }
}
function fxSprite(col, flat) {
    fxSprite.cache = fxSprite.cache || {};
    const key = col + (flat ? '_f' : '');
    if (fxSprite.cache[key]) {
        return fxSprite.cache[key];
    }
    const s = document.createElement('canvas');
    s.width = s.height = 48;
    const x = s.getContext('2d');
    // Normalise any colour (hex or hsl) to r,g,b so the glow fades out in its own colour.
    x.fillStyle = col;
    const h = parseInt(x.fillStyle.slice(1), 16);
    const rgb = (h >> 16) + ',' + (h >> 8 & 255) + ',' + (h & 255);
    const gr = x.createRadialGradient(24, 24, 0, 24, 24, 24);
    if (flat) {
        gr.addColorStop(0, 'rgba(' + rgb + ',1)');
        gr.addColorStop(0.3, 'rgba(' + rgb + ',.9)');
        gr.addColorStop(0.55, 'rgba(' + rgb + ',0)');
    } else {
        gr.addColorStop(0, 'rgba(255,255,255,1)');
        gr.addColorStop(0.12, 'rgba(255,255,255,.9)');
        gr.addColorStop(0.24, 'rgba(' + rgb + ',.9)');
        gr.addColorStop(0.5, 'rgba(' + rgb + ',.25)');
        gr.addColorStop(1, 'rgba(' + rgb + ',0)');
    }
    x.fillStyle = gr;
    x.fillRect(0, 0, 48, 48);
    return fxSprite.cache[key] = s;
}
// Particle field
function fxParticles(cv, o) {
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    const W = innerWidth;
    const H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    const { cx, cy, tok, plan, end } = o;
    const sc = Math.max(0.65, Math.min(1.4, Math.min(W, H) / 800));
    const diag = Math.hypot(W, H);
    const P = [];
    const MAX = 600;
    const pick = a => a[(Math.random() * a.length) | 0];
    const hue = () => 'hsl(' + ((Math.random() * 360) | 0) + ',100%,72%)';
    const colOf = e => e.cols === 'rainbow' ? hue() : pick(e.cols);
    const spawn = (e) => {
        if (P.length >= MAX) {
            return;
        }
        const col = colOf(e);
        const life = (e.life || 1.6) * (0.6 + Math.random() * 0.8);
        const size = (e.size || 2) * (0.5 + Math.random()) * sc;
        if (e.type === 'burst' || e.type === 'galaxy') {
            const a = Math.random() * 6.2832;
            const sp = (e.speed || 400) * (0.15 + Math.pow(Math.random(), 1.5) * 0.85) * sc;
            P.push({
                k: e.type, x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: (e.grav || 0) * sc, drag: e.drag || 2.2, spin: e.type === 'galaxy' ? (e.spin || 1.4) : 0, age: 0, life, size, col, tw: Math.random() * 6.28, trail: e.trail
            });
        } else if (e.type === 'spiral') {
            P.push({
                k: 'spiral', a: Math.random() * 6.2832, r0: diag * (0.25 + Math.random() * 0.35), spin: (e.dir || 1) * (0.6 + Math.random() * 1.2), age: 0, life: life * 0.9, size, col, px: 0, py: 0
            });
        } else if (e.type === 'embers') {
            const x = e.wide ? Math.random() * W : cx + (Math.random() - 0.5) * W * 0.6;
            P.push({
                k: 'ember', x, y: H + 10, vx: 0, vy: -(60 + Math.random() * 120) * sc, sway: Math.random() * 6.28, age: 0, life: life * 1.6, size, col, tw: Math.random() * 6.28
            });
        } else if (e.type === 'rain') {
            P.push({
                k: 'rain', x: Math.random() * W, y: -20, vx: (Math.random() - 0.5) * 40, vy: (260 + Math.random() * 380) * sc, age: 0, life: life * 1.4, size: size * 0.8, col
            });
        } else if (e.type === 'ash') {
            P.push({
                k: 'ash', x: Math.random() * W, y: -10 - Math.random() * 40, vy: (35 + Math.random() * 70) * sc, sway: Math.random() * 6.28, age: 0, life: life * 2, size, col, dk: 1
            });
        } else if (e.type === 'stars') {
            const a = Math.random() * 6.2832;
            const r = diag * (0.08 + Math.random() * 0.55);
            P.push({
                k: 'star', a, r, pull: e.pull || 0, rot: (e.rot || 0.08) * (0.5 + Math.random()), age: 0, life: e.life || 5, size: size * 0.7, col, tw: Math.random() * 6.28
            });
        }
    };
    const t0 = performance.now();
    let last = t0;
    const st = plan.map(e => ({ e, fired: false, acc: 0 }));
    (function f(now) {
        if (tok !== fxRunId) {
            g.clearRect(0, 0, W, H);
            return;
        }
        const t = now - t0;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        st.forEach(s => {
            const e = s.e;
            if (e.rate) {
                if (t >= e.at && t < e.until) {
                    const k = (t - e.at) / (e.until - e.at);
                    s.acc += e.rate * (e.ramp ? 0.2 + 0.8 * k : 1) * dt;
                    while (s.acc >= 1) {
                        s.acc--;
                        spawn(e);
                    }
                }
            } else if (!s.fired && t >= e.at) {
                s.fired = true;
                for (let i = 0; i < e.n; i++) {
                    spawn(e);
                }
            }
        });
        g.clearRect(0, 0, W, H);
        g.globalCompositeOperation = 'lighter';
        g.lineCap = 'round';
        for (let i = P.length; i--;) {
            const p = P[i];
            p.age += dt;
            const k = p.age / p.life;
            if (k >= 1) {
                P.splice(i, 1);
                continue;
            }
            let x;
            let y;
            let al;
            if (p.k === 'spiral') {
                const r = p.r0 * Math.pow(1 - k, 1.6);
                const a = p.a + p.spin * k * 2.4;
                x = cx + Math.cos(a) * r;
                y = cy + Math.sin(a) * r;
                al = Math.sin(Math.PI * k) * 0.9;
                if (p.px) {
                    g.globalAlpha = al * 0.55;
                    g.strokeStyle = p.col;
                    g.lineWidth = p.size * 0.7;
                    g.beginPath();
                    g.moveTo(p.px, p.py);
                    g.lineTo(x, y);
                    g.stroke();
                }
                p.px = x;
                p.py = y;
            } else if (p.k === 'star') {
                p.a += p.rot * dt;
                p.r = Math.max(0, p.r - p.pull * dt * (0.4 + k));
                x = cx + Math.cos(p.a) * p.r;
                y = cy + Math.sin(p.a) * p.r * 0.8;
                al = Math.min(1, k * 6) * Math.min(1, (1 - k) * 4) * (0.55 + 0.45 * Math.sin(p.tw + p.age * 5));
            } else if (p.k === 'ash') {
                p.sway += dt * 1.6;
                p.x += Math.sin(p.sway) * 30 * sc * dt;
                p.y += p.vy * dt;
                x = p.x;
                y = p.y;
                al = Math.min(1, k * 4) * Math.pow(1 - k, 0.6) * 0.85;
            } else if (p.k === 'ember') {
                p.sway += dt * 2;
                p.x += (Math.sin(p.sway) * 22 * sc) * dt;
                p.y += p.vy * dt;
                x = p.x;
                y = p.y;
                al = Math.min(1, k * 5) * Math.pow(1 - k, 0.8) * (0.7 + 0.3 * Math.sin(p.tw + p.age * 9));
            } else if (p.k === 'rain') {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                x = p.x;
                y = p.y;
                al = Math.pow(1 - k, 0.7);
                g.globalAlpha = al * 0.5;
                g.strokeStyle = p.col;
                g.lineWidth = p.size * 0.6;
                g.beginPath();
                g.moveTo(x, y - p.vy * 0.05);
                g.lineTo(x, y);
                g.stroke();
            } else {
                const dr = Math.exp(-p.drag * dt);
                if (p.spin) {
                    const rx = p.x - cx;
                    const ry = p.y - cy;
                    const d = Math.hypot(rx, ry) || 1;
                    p.vx += (-ry / d) * p.spin * 90 * sc * dt;
                    p.vy += (rx / d) * p.spin * 90 * sc * dt;
                }
                p.vx *= dr;
                p.vy = p.vy * dr + p.g * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                x = p.x;
                y = p.y;
                al = Math.pow(1 - k, 1.3) * (0.8 + 0.2 * Math.sin(p.tw + p.age * 14));
                if (p.trail && Math.abs(p.vx) + Math.abs(p.vy) > 200) {
                    g.globalAlpha = al * 0.45;
                    g.strokeStyle = p.col;
                    g.lineWidth = p.size * 0.7;
                    g.beginPath();
                    g.moveTo(x - p.vx * 0.03, y - p.vy * 0.03);
                    g.lineTo(x, y);
                    g.stroke();
                }
            }
            g.globalAlpha = Math.max(0, al);
            g.globalCompositeOperation = p.dk ? 'source-over' : 'lighter';
            const d = p.size * 6;
            g.drawImage(fxSprite(p.col, p.dk), x - d / 2, y - d / 2, d, d);
        }
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
        if (t < end || P.length) {
            requestAnimationFrame(f);
        } else {
            g.clearRect(0, 0, W, H);
        }
    })(t0);
}
function triggerRarityEffect(rec, dark) {
    const tier = getRarityTier(rec.score);
    if (!tier || rarityEffects[tier] === false) {
        return;
    }
    playRarityFx(tier, dark && tier >= 5);
}
function playRarityFx(tier, dark) {
    const T = (dark ? RARITY_DARK : RARITY_FX)[tier];
    const ov = $('rarityEffect');
    const vd = T.vd || 0;
    const D = vd;
    const total = vd + T.ms;
    const W = innerWidth;
    const H = innerHeight;
    const c = T.c;
    const c2 = T.c2;
    stopFx();
    stopPageFx();
    const tok = fxRunId;
    const onGame = $('game').classList.contains('active');
    // Centre on the roll window(s).
    const reels = [...document.querySelectorAll('#rollResults .reel')].filter(r => r.getBoundingClientRect().width);
    let box = null;
    reels.forEach(r => {
        const b = r.getBoundingClientRect();
        box = box ? { left: Math.min(box.left, b.left), top: Math.min(box.top, b.top), right: Math.max(box.right, b.right), bottom: Math.max(box.bottom, b.bottom) } : { left: b.left, top: b.top, right: b.right, bottom: b.bottom };
    });
    const inView = onGame && box && box.bottom > 0 && box.top < H;
    const cx = inView ? (box.left + box.right) / 2 : W / 2;
    const cy = inView ? Math.min(Math.max((box.top + box.bottom) / 2, H * 0.15), H * 0.85) : H / 2;
    const at = 'left:' + cx + 'px;top:' + cy + 'px;';
    const TR = 'translate(-50%,-50%) ';
    const E = (cls, css) => createFxElement(ov, cls, css);
    const A = (el, fr, o) => animateFx(el, fr, o);
    ov.style.setProperty('--c', c);
    ov.style.setProperty('--c2', c2);
    const done = () => {
        rarityEffectTimer = setTimeout(() => {
            stopFx();
            stopPageFx();
        }, total + 500);
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const e = E('fx-fill', 'box-shadow:inset 0 0 0 1px ' + c + ',inset 0 0 ' + (40 + tier * 14) + 'px ' + tier + 'px ' + c2);
        A(e, [{ opacity: 0 }, { opacity: 0.85, offset: 0.2 }, { opacity: 0 }], { duration: 1400 + tier * 200, easing: 'linear' });
        done();
        return;
    }
    // Page elements that can be moved.
    const q = s => document.querySelector(s);
    const app = q('.app');
    const game = $('game');
    const head = q('#game .page-head');
    const side = q('#game .roll-side');
    const controls = q('#game .roll-controls');
    const hint = $('autoHint');
    const cards = [...document.querySelectorAll('#rollResults .result-card')];
    const parts = [head, ...cards, controls, hint, side].filter(el => el && el.getBoundingClientRect().height);
    const P = (el, fr, o) => {
        if (!onGame || !el) {
            return null;
        }
        if (calmFx && fr.some(f => /invert|brightness\((?:[2-9]|1\.[5-9])/.test(f.filter || ''))) {
            return null;
        }
        const a = el.animate(fr, Object.assign({ fill: 'none', easing: 'ease-out' }, o));
        runningPageFx.push(a);
        return a;
    };
    if (onGame) {
        document.documentElement.classList.add('fx-on');
    }
    const origin = el => {
        const r = el.getBoundingClientRect();
        return (cx - r.left) + 'px ' + (cy - r.top) + 'px';
    };
    const vec = el => {
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        const d = Math.hypot(dx, dy) || 1;
        return { dx: dx / d, dy: dy / d, d };
    };
    // building blocks
    const ring = (delay, dur, to, col, w, glow, from) => {
        const r = E('fx-ring', at + 'width:12vmin;height:12vmin;border-width:' + (w || 1.5) + 'px;border-color:' + col + ';box-shadow:0 0 ' + (glow || 14) + 'px ' + col + ',inset 0 0 ' + (glow || 14) + 'px ' + col);
        A(r, [{ opacity: 0, transform: TR + 'scale(' + (from || 0.3) + ')' }, { opacity: 1, offset: 0.08 }, { opacity: 0, transform: TR + 'scale(' + to + ')' }], { duration: dur, delay, easing: 'cubic-bezier(.15,.75,.25,1)' });
    };
    const ringIn = (delay, dur, from, col) => {
        const r = E('fx-ring', at + 'width:12vmin;height:12vmin;border-width:1px;border-color:' + col + ';box-shadow:0 0 12px ' + col);
        A(r, [{ opacity: 0, transform: TR + 'scale(' + from + ')' }, { opacity: 0.7, offset: 0.4 }, { opacity: 0, transform: TR + 'scale(.6)' }], { duration: dur, delay, easing: 'cubic-bezier(.5,0,.9,.5)' });
    };
    const bloom = (delay, dur, size, col, peak) => {
        const b = E('fx-bloom', at + 'width:' + size + 'vmin;height:' + size + 'vmin;margin:-' + size / 2 + 'vmin 0 0 -' + size / 2 + 'vmin;mix-blend-mode:screen;background:radial-gradient(circle,#fff 0,' + col + ' 18%,transparent 62%)');
        A(b, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: peak, transform: 'scale(1)', offset: 0.16 }, { opacity: 0, transform: 'scale(1.35)' }], { duration: dur, delay });
    };
    const flash = (delay, dur, col, peak, spread) => {
        const f = E('fx-fill', 'mix-blend-mode:screen;background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,' + col + ' 0,transparent ' + (spread || 70) + '%)');
        A(f, [{ opacity: 0 }, { opacity: peak, offset: 0.08 }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-out' });
    };
    const veil = (delay, dur, peak, hold, rgb, inner) => {
        const v = E('fx-fill', 'background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,rgba(' + rgb + ',0) ' + (inner || 12) + '%,rgba(' + rgb + ',.85) 70%,rgba(' + rgb + ',1) 100%)');
        A(v, [{ opacity: 0 }, { opacity: peak, offset: hold[0] }, { opacity: peak, offset: hold[1] }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-in-out' });
        return v;
    };
    const edge = (delay, dur, col, k) => {
        const e = E('fx-fill', 'box-shadow:inset 0 0 0 1px ' + col + ',inset 0 0 ' + (50 * k) + 'px ' + (4 * k) + 'px ' + col);
        A(e, [{ opacity: 0 }, { opacity: 0.9, offset: 0.12 }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-in-out' });
        return e;
    };
    const rays = (delay, dur, peak, turn, cols, count, size) => {
        const rw = E('fx-raysw', at + (size ? 'width:' + size + 'vmax;height:' + size + 'vmax;margin:-' + size / 2 + 'vmax 0 0 -' + size / 2 + 'vmax;' : ''));
        const ri = document.createElement('i');
        ri.style.background = 'conic-gradient(' + cols.concat(cols[0]).join(',') + ')';
        const step = 360 / (count || 36);
        const m = 'repeating-conic-gradient(#000 0 ' + (step * 0.16).toFixed(2) + 'deg,transparent ' + (step * 0.5).toFixed(2) + 'deg ' + step.toFixed(2) + 'deg)';
        ri.style.webkitMaskImage = m;
        ri.style.maskImage = m;
        rw.appendChild(ri);
        A(rw, [{ opacity: 0, transform: 'rotate(0deg) scale(.6)' }, { opacity: peak, offset: 0.22 }, { opacity: peak * 0.7, offset: 0.6 }, { opacity: 0, transform: 'rotate(' + turn + 'deg) scale(1.05)' }], { duration: dur, delay, easing: 'cubic-bezier(.2,.6,.3,1)' });
        return rw;
    };
    const bars = (delay, dur, h) => {
        const hide = ['translateY(-101%)', 'translateY(101%)'];
        ['top', 'bot'].forEach((p, i) => {
            const b = E('fx-bar ' + p, 'height:' + h + 'vh');
            A(b, [{ transform: hide[i] }, { transform: 'none', offset: 0.12 }, { transform: 'none', offset: 0.86 }, { transform: hide[i] }], { duration: dur, delay, easing: 'cubic-bezier(.6,0,.2,1)' });
        });
    };
    const aurora = (delay, dur, cols, peak) => {
        cols.forEach((col, i) => {
            const y = 8 + i * 14;
            const a = E('fx-aurora', 'top:' + y + 'vh;background:radial-gradient(50% 50% at 50% 50%,' + col + ',transparent 70%)');
            const dir = i % 2 ? -1 : 1;
            A(a, [
                { opacity: 0, transform: 'translateX(' + (-12 * dir) + 'vw) scaleY(.6) skewX(' + (-14 * dir) + 'deg)' },
                { opacity: peak, offset: 0.3 },
                { opacity: peak * 0.8, offset: 0.7 },
                { opacity: 0, transform: 'translateX(' + (12 * dir) + 'vw) scaleY(1.2) skewX(' + (14 * dir) + 'deg)' }
            ], { duration: dur, delay: delay + i * 160, easing: 'ease-in-out' });
        });
    };
    // A light sweep across each roll window, and light running round its edge.
    const reelFx = (fn) => reels.forEach(r => {
        const b = r.getBoundingClientRect();
        if (!b.width || b.bottom < 0 || b.top > H) {
            return;
        }
        fn(b);
    });
    const sweep = (delay, dur, col) => reelFx(b => {
        const w = E('fx-clip', 'left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px');
        const s = document.createElement('i');
        s.style.background = 'linear-gradient(105deg,transparent 30%,' + col + ' 46%,rgba(255,255,255,.95) 50%,' + col + ' 54%,transparent 70%)';
        w.appendChild(s);
        A(s, [{ transform: 'translateX(-100%)' }, { transform: 'translateX(100%)' }], { duration: dur, delay, easing: 'cubic-bezier(.45,0,.25,1)' });
        A(w, [{ opacity: 0 }, { opacity: 0.85, offset: 0.15 }, { opacity: 0.85, offset: 0.8 }, { opacity: 0 }], { duration: dur, delay, easing: 'linear' });
    });
    const trace = (delay, dur, col, laps, wid) => reelFx(b => {
        const w = E('fx-trace', 'left:' + (b.left - 3) + 'px;top:' + (b.top - 3) + 'px;width:' + (b.width + 6) + 'px;height:' + (b.height + 6) + 'px;padding:' + (wid || 3) + 'px;filter:drop-shadow(0 0 6px ' + col + ')');
        const s = document.createElement('i');
        const sz = Math.hypot(b.width, b.height) * 1.1;
        s.style.width = s.style.height = sz + 'px';
        s.style.background = 'conic-gradient(transparent 0 62%,' + col + ' 82%,#fff 92%,transparent 93%)';
        w.appendChild(s);
        A(s, [{ transform: 'translate(-50%,-50%) rotate(0deg)' }, { transform: 'translate(-50%,-50%) rotate(' + 360 * (laps || 1) + 'deg)' }], { duration: dur, delay, easing: 'cubic-bezier(.4,.1,.3,1)' });
        A(w, [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { duration: dur, delay, easing: 'linear' });
    });
    const reelGlow = (delay, dur, col, scale) => {
        reelFx(b => {
            const g = E('fx-fill', 'inset:auto;left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px;box-shadow:0 0 0 2px ' + col + ',0 0 50px 6px ' + col);
            A(g, [{ opacity: 0, transform: 'none' }, { opacity: 1, transform: 'scale(' + scale + ')', offset: 0.2 }, { opacity: 0, transform: 'none' }], { duration: dur, delay, easing: 'cubic-bezier(.2,.8,.2,1)' });
        });
        reels.forEach(r => P(r, [{ transform: 'none' }, { transform: 'scale(' + scale + ')', offset: 0.2 }, { transform: 'none' }], { duration: dur, delay, easing: 'cubic-bezier(.2,.8,.2,1)' }));
    };
    const shake = (el, delay, dur, amp, rot) => {
        const fr = [];
        const n = Math.max(8, Math.round(dur / 45));
        for (let i = 0; i <= n; i++) {
            const k = Math.pow(1 - i / n, 1.6);
            fr.push({ transform: i === 0 || i === n ? 'none' : 'translate(' + ((Math.random() - 0.5) * 2 * amp * k).toFixed(1) + 'px,' + ((Math.random() - 0.5) * 2 * amp * k).toFixed(1) + 'px) rotate(' + ((Math.random() - 0.5) * 2 * (rot || 0) * k).toFixed(2) + 'deg)' });
        }
        P(el, fr, { duration: dur, delay, easing: 'linear' });
    };
    const rumble = (el, delay, dur, amp) => {
        const fr = [];
        const n = Math.max(8, Math.round(dur / 40));
        for (let i = 0; i <= n; i++) {
            const k = Math.pow(i / n, 2);
            fr.push({ transform: i === 0 || i === n ? 'none' : 'translate(' + ((Math.random() - 0.5) * 2 * amp * k).toFixed(1) + 'px,' + ((Math.random() - 0.5) * 2 * amp * k).toFixed(1) + 'px)' });
        }
        P(el, fr, { duration: dur, delay, easing: 'linear' });
    };
    // Page parts pushed away from the roll window by a wave, springing back.
    const shockPage = (delay, dist, rot, speed) => parts.forEach(el => {
        const v = vec(el);
        const lag = v.d / (speed || 1.6);
        const r = (Math.random() - 0.5) * 2 * (rot || 0);
        P(el, [
            { transform: 'none' },
            { transform: 'translate(' + (v.dx * dist).toFixed(1) + 'px,' + (v.dy * dist).toFixed(1) + 'px) rotate(' + r.toFixed(2) + 'deg)', offset: 0.18 },
            { transform: 'translate(' + (-v.dx * dist * 0.18).toFixed(1) + 'px,' + (-v.dy * dist * 0.18).toFixed(1) + 'px) rotate(' + (-r * 0.2).toFixed(2) + 'deg)', offset: 0.5 },
            { transform: 'translate(' + (v.dx * dist * 0.05).toFixed(1) + 'px,' + (v.dy * dist * 0.05).toFixed(1) + 'px)', offset: 0.75 },
            { transform: 'none' }
        ], { duration: 900 + dist * 4, delay: delay + lag, easing: 'cubic-bezier(.2,.7,.3,1)' });
    });
    const dof = (delay, dur, blur, fade) => parts.forEach(el => P(el, [
        { filter: 'none', opacity: 1 },
        { filter: 'blur(' + blur + 'px) saturate(.4)', opacity: fade, offset: 0.2 },
        { filter: 'blur(' + blur + 'px) saturate(.4)', opacity: fade, offset: 0.7 },
        { filter: 'none', opacity: 1 }
    ], { duration: dur, delay, easing: 'ease-in-out' }));
    const cv = document.createElement('canvas');
    cv.className = 'fx fx-canvas';
    const particles = (plan, end) => {
        ov.appendChild(cv);
        fxParticles(cv, { cx, cy, tok, plan, end: end || total });
    };
    // secret (dark) variants for tiers 5 to 9
    if (dark) {
        // jagged crack lines spreading out from a point, drawn on over dur
        const cracks = (delay, dur, n, reach, col, w, ox, oy, keep) => {
            const sx = ox == null ? cx : ox;
            const sy = oy == null ? cy : oy;
            const ns = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(ns, 'svg');
            svg.setAttribute('class', 'fx fx-cracks');
            svg.setAttribute('width', W);
            svg.setAttribute('height', H);
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
            ov.appendChild(svg);
            const lines = [];
            const walk = (x, y, a, len, depth) => {
                const pts = [[x, y]];
                let L = 0;
                while (L < len) {
                    const step = 14 + Math.random() * 30;
                    a += (Math.random() - 0.5) * 0.7;
                    x += Math.cos(a) * step;
                    y += Math.sin(a) * step;
                    L += step;
                    pts.push([x, y]);
                    if (depth < 2 && Math.random() < 0.12) {
                        walk(x, y, a + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.6), len * (0.25 + Math.random() * 0.3), depth + 1);
                    }
                }
                lines.push({ pts, L, depth });
            };
            for (let i = 0; i < n; i++) {
                walk(sx, sy, (i / n) * 6.2832 + Math.random() * 0.5, reach * (0.55 + Math.random() * 0.6), 0);
            }
            lines.forEach(l => {
                const d = 'M' + l.pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
                [['rgba(0,0,0,.85)', w + 2.5], [col, w * (l.depth ? 0.6 : 1)]].forEach(([st, sw]) => {
                    const path = document.createElementNS(ns, 'path');
                    path.setAttribute('d', d);
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', st);
                    path.setAttribute('stroke-width', sw);
                    path.setAttribute('stroke-linejoin', 'bevel');
                    path.setAttribute('stroke-dasharray', l.L + 40);
                    path.setAttribute('stroke-dashoffset', l.L + 40);
                    svg.appendChild(path);
                    A(path, [{ strokeDashoffset: l.L + 40 }, { strokeDashoffset: 0 }], { duration: dur * (0.5 + l.depth * 0.25), delay: delay + l.depth * dur * 0.3, easing: 'cubic-bezier(.1,.9,.3,1)' });
                });
            });
            A(svg, [{ opacity: 1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: keep, delay, easing: 'linear' });
            return svg;
        };
        // dark glass shards thrown out from the roll window, tumbling and falling
        const shards = (delay, n, speed, tint) => {
            for (let i = 0; i < n; i++) {
                const s = 8 + Math.random() * 34;
                const pts = [];
                const k = 3 + (Math.random() * 2 | 0);
                for (let j = 0; j < k; j++) {
                    const a = j / k * 6.2832 + Math.random() * 0.8;
                    pts.push((50 + Math.cos(a) * (30 + Math.random() * 20)).toFixed(0) + '% ' + (50 + Math.sin(a) * (30 + Math.random() * 20)).toFixed(0) + '%');
                }
                const el = E('fx-shard', at + 'width:' + s + 'px;height:' + s + 'px;margin:' + (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px;clip-path:polygon(' + pts.join(',') + ');background:linear-gradient(' + (Math.random() * 360 | 0) + 'deg,rgba(255,255,255,.75),' + tint + ' 45%,rgba(0,0,0,.95))');
                const a = Math.random() * 6.2832;
                const v = speed * (0.35 + Math.random() * 0.65);
                const dx = Math.cos(a) * v;
                const dy = Math.sin(a) * v;
                const r = (Math.random() - 0.5) * 900;
                const fr = [];
                for (let j = 0; j <= 6; j++) {
                    const t = j / 6;
                    fr.push({ transform: 'translate(' + (dx * (1 - Math.pow(1 - t, 2))).toFixed(0) + 'px,' + (dy * (1 - Math.pow(1 - t, 2)) + 520 * t * t).toFixed(0) + 'px) rotate3d(1,.6,.3,' + (r * t).toFixed(0) + 'deg)', opacity: j === 6 ? 0 : 1 });
                }
                A(el, fr, { duration: 1300 + Math.random() * 900, delay: delay + Math.random() * 60, easing: 'linear' });
            }
        };
        // the whole screen breaks into black glass, holds, then falls away
        const screenShatter = (delay, hold) => {
            const cols = W > H ? 9 : 5;
            const rows = Math.round(cols * H / W) + 1;
            const gx = W / cols;
            const gy = H / rows;
            const P0 = [];
            for (let y = 0; y <= rows; y++) {
                P0.push([]);
                for (let x = 0; x <= cols; x++) {
                    const edgeX = x === 0 || x === cols;
                    const edgeY = y === 0 || y === rows;
                    P0[y].push([x * gx + (edgeX ? 0 : (Math.random() - 0.5) * gx * 0.7), y * gy + (edgeY ? 0 : (Math.random() - 0.5) * gy * 0.7)]);
                }
            }
            const tri = [];
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const a = P0[y][x];
                    const b = P0[y][x + 1];
                    const c3 = P0[y + 1][x + 1];
                    const d = P0[y + 1][x];
                    if (Math.random() < 0.5) {
                        tri.push([a, b, c3], [a, c3, d]);
                    } else {
                        tri.push([a, b, d], [b, c3, d]);
                    }
                }
            }
            tri.forEach(t => {
                const minX = Math.min(t[0][0], t[1][0], t[2][0]);
                const minY = Math.min(t[0][1], t[1][1], t[2][1]);
                const maxX = Math.max(t[0][0], t[1][0], t[2][0]);
                const maxY = Math.max(t[0][1], t[1][1], t[2][1]);
                const w = maxX - minX + 1;
                const h = maxY - minY + 1;
                const poly = t.map(p => ((p[0] - minX) / w * 100).toFixed(1) + '% ' + ((p[1] - minY) / h * 100).toFixed(1) + '%').join(',');
                const mx = (minX + maxX) / 2;
                const my = (minY + maxY) / 2;
                const g = Math.random() * 360 | 0;
                const el = E('fx-shard', 'left:' + minX + 'px;top:' + minY + 'px;width:' + w + 'px;height:' + h + 'px;clip-path:polygon(' + poly + ');background:linear-gradient(' + g + 'deg,#16090b 0,#050203 55%,#2a1316 100%)');
                const dist = Math.hypot(mx - cx, my - cy);
                const away = { x: (mx - cx) / (dist || 1), y: (my - cy) / (dist || 1) };
                const start = hold + dist * 0.6 + Math.random() * 120;
                const L = start + 1400;
                const o = ms => ms / L;
                const r = (Math.random() - 0.5) * 140;
                A(el, [
                    { transform: 'none', opacity: 0, offset: 0 },
                    { transform: 'none', opacity: 1, offset: o(30) },
                    { transform: 'scale(.985)', opacity: 1, offset: o(start), easing: 'cubic-bezier(.5,0,.9,.5)' },
                    { transform: 'translate(' + (away.x * 120).toFixed(0) + 'px,' + (H * 0.9 + away.y * 80).toFixed(0) + 'px) rotate3d(' + (Math.random() - 0.5).toFixed(2) + ',1,.4,' + r.toFixed(0) + 'deg) scale(.8)', opacity: 0, offset: 1 }
                ], { duration: L, delay, easing: 'linear' });
            });
            // crack lines along the shard edges
            cracks(delay, 220, 16, Math.hypot(W, H), 'rgba(255,255,255,.9)', 1.2, null, null, hold + 900);
        };
        // failing-light flicker
        const flicker = (delay, dur, peak, rgb) => {
            const f = E('fx-fill', 'background:rgb(' + (rgb || '0,0,0') + ')');
            const fr = [];
            const n = 14;
            for (let i = 0; i <= n; i++) {
                fr.push({ opacity: i === 0 || i === n ? 0 : (Math.random() < 0.5 ? peak : peak * Math.random() * 0.3), easing: 'steps(1,end)' });
            }
            A(f, fr, { duration: dur, delay });
        };
        // scanlines and moving static
        const staticNoise = (delay, dur, peak) => {
            const c0 = document.createElement('canvas');
            c0.width = c0.height = 160;
            const x = c0.getContext('2d');
            const id = x.createImageData(160, 160);
            for (let i = 0; i < id.data.length; i += 4) {
                const v = Math.random() * 255;
                id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
                id.data[i + 3] = 255;
            }
            x.putImageData(id, 0, 0);
            const n = E('fx-noise', 'background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.55) 0 1px,transparent 1px 3px),url(' + c0.toDataURL() + ')');
            const fr = [];
            for (let i = 0; i <= 12; i++) {
                fr.push({ transform: 'translate(' + (-(Math.random() * 160) | 0) + 'px,' + (-(Math.random() * 160) | 0) + 'px)', easing: 'steps(1,end)' });
            }
            A(n, fr, { duration: 600, iterations: Math.ceil(dur / 600), delay });
            A(n, [{ opacity: 0 }, { opacity: peak, offset: 0.08 }, { opacity: peak * 0.6, offset: 0.7 }, { opacity: 0 }], { duration: dur, delay, easing: 'linear', composite: 'replace' });
        };
        // the page tears sideways in slices
        const tear = (el, delay, dur) => {
            const fr = [];
            const n = Math.round(dur / 70);
            for (let i = 0; i <= n; i++) {
                if (i === 0 || i === n) {
                    fr.push({ transform: 'none', clipPath: 'inset(0 0 0 0)', easing: 'steps(1,end)' });
                    continue;
                }
                const t = Math.random() * 80;
                const b = Math.random() * (100 - t) * 0.7;
                fr.push({ transform: 'translateX(' + ((Math.random() - 0.5) * 60).toFixed(0) + 'px)', clipPath: Math.random() < 0.6 ? 'inset(' + t.toFixed(0) + '% 0 ' + b.toFixed(0) + '% 0)' : 'inset(0 0 0 0)', easing: 'steps(1,end)' });
            }
            P(el, fr, { duration: dur, delay });
        };
        const blackout = (delay, dur, peak) => {
            const b = E('fx-fill', 'background:#000;opacity:0');
            A(b, [{ opacity: peak }, { opacity: peak, offset: 0.6 }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-in', fill: 'none' });
        };
        // a black sun with a burning rim
        const eclipse = (delay, dur, size, col, col2) => {
            const e = E('fx-eclipse', at + 'width:' + size + 'vmin;height:' + size + 'vmin;margin:-' + size / 2 + 'vmin 0 0 -' + size / 2 + 'vmin;box-shadow:0 0 0 2px ' + col + ',0 0 30px 6px ' + col + ',0 0 120px 40px ' + col2 + ',inset 0 0 40px 6px ' + col2);
            A(e, [{ opacity: 0, transform: 'scale(.1)' }, { opacity: 1, transform: 'scale(1)', offset: 0.18 }, { opacity: 1, transform: 'scale(1.06)', offset: 0.7 }, { opacity: 0, transform: 'scale(1.6)' }], { duration: dur, delay, easing: 'cubic-bezier(.2,.8,.2,1)' });
        };
        // rays that pull inward and turn backwards
        const raysIn = (delay, dur, peak, turn, cols, count) => {
            const rw = E('fx-raysw', at);
            const ri = document.createElement('i');
            ri.style.background = 'conic-gradient(' + cols.concat(cols[0]).join(',') + ')';
            const step = 360 / (count || 36);
            const m = 'repeating-conic-gradient(#000 0 ' + (step * 0.16).toFixed(2) + 'deg,transparent ' + (step * 0.5).toFixed(2) + 'deg ' + step.toFixed(2) + 'deg)';
            ri.style.webkitMaskImage = m;
            ri.style.maskImage = m;
            rw.appendChild(ri);
            A(rw, [
                { opacity: 0, transform: 'rotate(0deg) scale(1.3)' },
                { opacity: peak, transform: 'rotate(' + turn * 0.2 + 'deg) scale(1.1)', offset: 0.2 },
                { opacity: peak * 0.7, transform: 'rotate(' + turn * 0.6 + 'deg) scale(.75)', offset: 0.6 },
                { opacity: 0, transform: 'rotate(' + turn + 'deg) scale(.45)' }
            ], { duration: dur, delay, easing: 'cubic-bezier(.5,0,.8,.6)' });
            return rw;
        };
        // page parts knocked crooked, hanging, then snapping back
        const slip = (delay, hold, amt) => parts.forEach((el, i) => {
            const r = (Math.random() - 0.5) * 2 * amt * 0.12;
            const y = amt * (0.4 + Math.random() * 0.8);
            const L = hold + 700;
            P(el, [
                { transform: 'none' },
                { transform: 'translateY(' + y.toFixed(0) + 'px) rotate(' + r.toFixed(2) + 'deg)', offset: 0.04, easing: 'ease-in-out' },
                { transform: 'translateY(' + (y * 1.08).toFixed(0) + 'px) rotate(' + (r * 1.1).toFixed(2) + 'deg)', offset: hold / L * 0.9 },
                { transform: 'translateY(' + (y * 1.1).toFixed(0) + 'px) rotate(' + (r * 1.1).toFixed(2) + 'deg)', offset: hold / L, easing: 'cubic-bezier(.3,1.4,.4,1)' },
                { transform: 'none' }
            ], { duration: L, delay: delay + i * 30, easing: 'linear' });
        });
        const reelCrack = (delay, n, col) => reelFx(b => cracks(delay, 260, n, Math.min(b.width, b.height) * 0.55, col, 1.4, b.left + b.width / 2, b.top + b.height / 2, total - delay));
        const ash = { type: 'ash', cols: ['#1a1a1a', '#2b2b2b', '#3d3535'], dark: 1 };
        if (tier === 5) {
            veil(0, 4400, 0.8, [0.08, 0.8], '12,2,2', 14);
            flicker(0, 1100, 0.7);
            P(app, [{ filter: 'none' }, { filter: 'grayscale(1) brightness(.8) contrast(1.1)', offset: 0.1 }, { filter: 'grayscale(1) brightness(.8) contrast(1.1)', offset: 0.85 }, { filter: 'none' }], { duration: 4200, easing: 'ease-in-out' });
            P(game, [
                { transform: 'none' },
                { transform: 'translateY(14px) rotate(1.4deg)', offset: 0.08, easing: 'cubic-bezier(.3,1.6,.5,1)' },
                { transform: 'translateY(16px) rotate(1.6deg)', offset: 0.85, easing: 'cubic-bezier(.6,0,.4,1)' },
                { transform: 'none' }
            ], { duration: 4200 });
            reelCrack(60, 7, 'rgba(255,255,255,.9)');
            shards(60, 14, 260, 'rgba(60,10,10,.9)');
            raysIn(200, 3800, 0.3, -40, [c, c2, '#000', c2], 24);
            edge(0, 4000, c, 1.6);
            particles([
                Object.assign({ at: 300, until: 4000, rate: 30, life: 3, size: 2.6 }, ash),
                { type: 'burst', at: 60, n: 40, cols: [c, '#5a0d0d'], speed: 300, life: 1.6, size: 1.8, grav: 160 }
            ]);
        }
        if (tier === 6) {
            blackout(0, 260, 1);
            veil(0, 5200, 0.85, [0.05, 0.75], '18,0,0', 12);
            cracks(150, 420, 11, Math.hypot(W, H) * 0.75, 'rgba(255,90,70,.95)', 1.6, null, null, 4600);
            flash(150, 1800, c, 0.5, 60);
            shake(game, 150, 1300, 20, 0.8);
            slip(250, 3200, 26);
            shards(150, 40, 520, 'rgba(90,10,10,.9)');
            raysIn(150, 4800, 0.4, -70, [c, c2, '#000', c, c2], 30);
            ring(150, 1600, 18, c, 2.5, 20);
            edge(150, 4800, c, 2.4);
            particles([
                Object.assign({ at: 400, until: 5000, rate: 45, life: 3.2, size: 2.8, wide: 1 }, ash),
                { type: 'burst', at: 150, n: 110, cols: [c, '#ff9a7a', '#4a0000'], speed: 700, life: 1.8, size: 2, grav: 260, trail: 1 }
            ]);
        }
        if (tier === 7) {
            // first hit
            shake(game, 0, 320, 10, 0.4);
            reelCrack(0, 6, 'rgba(255,255,255,.9)');
            blackout(0, 200, 0.8);
            // second hit: everything inverts and tears
            P(app, [
                { filter: 'none' },
                { filter: 'invert(1) contrast(1.4)', offset: 0.01 },
                { filter: 'invert(1) contrast(1.4) hue-rotate(60deg)', offset: 0.6 },
                { filter: 'none', offset: 0.62 },
                { filter: 'invert(1) contrast(1.4)', offset: 0.66 },
                { filter: 'none', offset: 0.7 },
                { filter: 'none' }
            ], { duration: 2200, delay: 340, easing: 'steps(1,end)' });
            tear(game, 340, 1500);
            staticNoise(340, 2600, 0.28);
            veil(340, 5800, 0.85, [0.04, 0.78], '0,8,0', 12);
            cracks(340, 380, 12, Math.hypot(W, H) * 0.8, c, 1.3, null, null, 5000);
            shards(340, 46, 620, 'rgba(20,50,10,.9)');
            raysIn(340, 5400, 0.4, -90, [c, c2, '#000', c2], 22);
            for (let i = 0; i < 5; i++) {
                ringIn(500 + i * 380, 1300, 16 - i, i % 2 ? c : '#fff');
            }
            shake(game, 1900, 1400, 14, 0.6);
            edge(340, 5400, c, 2.6);
            particles([
                Object.assign({ at: 700, until: 5600, rate: 40, life: 3, size: 2.6, wide: 1 }, ash),
                { type: 'spiral', at: 900, until: 4800, rate: 60, cols: [c, '#eaffd0'], life: 1.3, size: 1.8, dir: -1 },
                { type: 'burst', at: 340, n: 90, cols: [c, '#fff'], speed: 720, life: 1.4, size: 1.8, trail: 1, grav: 200 }
            ]);
        }
        if (tier === 8) {
            // build-up: darkness closes in, the heartbeat stumbles, the window cracks
            [42, 28, 18, 10].forEach((r, i) => veil(i * vd * 0.22, vd + 900 - i * vd * 0.22, 0.95, [0.6, 0.85], '0,0,0', r));
            if (app) {
                app.style.transformOrigin = origin(app);
            }
            P(app, [{ transform: 'none' }, { transform: 'scale(.9) rotate(1.6deg)', offset: 0.98 }, { transform: 'none' }], { duration: vd + 400, easing: 'cubic-bezier(.5,0,.9,.5)' });
            rumble(game, 0, vd, 5);
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                flash(ms, 400, c, 0.12 + k * 0.2, 25);
                reelCrack(ms, 2 + i, 'rgba(255,255,255,.85)');
                shake(game, ms, 160, 4 + k * 6, 0);
            });
            // release: black, then everything breaks outward and the light is pulled in
            blackout(vd, 380, 1);
            eclipse(vd + 200, 5400, 60, c, c2);
            cracks(vd + 200, 380, 14, Math.hypot(W, H) * 0.85, 'rgba(255,255,255,.9)', 1.6, null, null, 5200);
            shards(vd + 200, 60, 760, 'rgba(70,0,0,.9)');
            raysIn(vd + 200, 5600, 0.45, -110, [c, c2, '#000', c2], 30);
            shake(game, vd + 200, 1700, 22, 1);
            slip(vd + 300, 3400, 30);
            edge(vd + 200, 5600, c, 3);
            particles([
                { type: 'spiral', at: vd + 400, until: vd + 5000, rate: 110, cols: [c, '#ff8a6a', '#fff'], life: 1.6, size: 2.2, dir: -1 },
                { type: 'burst', at: vd + 200, n: 140, cols: [c, '#400000', '#fff'], speed: 900, life: 1.8, size: 2.2, grav: 220, trail: 1 },
                Object.assign({ at: vd + 600, until: vd + 5600, rate: 40, life: 3.4, size: 2.8, wide: 1 }, ash)
            ]);
        }
        if (tier === 9) {
            // build-up: the page drifts apart into a red void; the window cracks with every beat
            const v = E('fx-fill', 'background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,rgba(40,0,0,.45) 0,rgba(8,0,0,.97) 30%,#000 100%)');
            A(v, [{ opacity: 0 }, { opacity: 0.6, offset: 0.25 }, { opacity: 1, offset: vd / (vd + 900) }, { opacity: 1, offset: 0.98 }, { opacity: 0 }], { duration: vd + 900, easing: 'ease-in' });
            parts.forEach((el, i) => {
                const vv = vec(el);
                const st = i * 60;
                const back = vd + 900 + i * 90;
                const L = back + 1600;
                const o = ms => Math.min(1, ms / L);
                const r = (Math.random() - 0.5) * 24;
                P(el, [
                    { transform: 'none', opacity: 1, offset: 0 },
                    { transform: 'none', opacity: 1, offset: o(st), easing: 'cubic-bezier(.55,0,.75,.4)' },
                    { transform: 'perspective(900px) translate(' + (-vv.dx * vv.d * 0.6).toFixed(0) + 'px,' + (-vv.dy * vv.d * 0.6 + 60).toFixed(0) + 'px) translateZ(-400px) rotate(' + r.toFixed(1) + 'deg)', opacity: 0, offset: o(vd) },
                    { transform: 'translateY(40px) scale(.96)', opacity: 0, offset: o(back), easing: 'cubic-bezier(.2,.9,.3,1)' },
                    { transform: 'translateY(-4px)', opacity: 1, offset: o(back + 800) },
                    { transform: 'none', opacity: 1, offset: 1 }
                ], { duration: L, easing: 'linear' });
            });
            rumble(game, 0, vd, 7);
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                reelCrack(ms, 2 + (i >> 1), 'rgba(255,255,255,.9)');
                flash(ms, 300, c2, 0.15 + k * 0.35, 30);
                if (i % 3 === 2) {
                    P(app, [{ filter: 'invert(1)' }, { filter: 'invert(1)', offset: 0.9 }, { filter: 'none' }], { duration: 90, delay: ms, easing: 'steps(1,end)' });
                }
                shake(game, ms, 180, 4 + k * 8, 0);
            });
            // release: the screen itself breaks and falls away
            screenShatter(vd, 650);
            eclipse(vd + 900, 6800, 84, '#ff2a2a', c2);
            raysIn(vd + 900, 7000, 0.5, -140, ['#ff2a2a', c2, '#000', '#ff2a2a', '#000'], 34);
            tear(game, vd + 1000, 1200);
            staticNoise(vd + 900, 3200, 0.22);
            shake(game, vd, 2200, 26, 1.2);
            P(app, [{ filter: 'none' }, { filter: 'grayscale(1) contrast(1.3)', offset: 0.1 }, { filter: 'grayscale(1) contrast(1.3)', offset: 0.7 }, { filter: 'none' }], { duration: 4200, delay: vd + 900, easing: 'ease-in-out' });
            const ed = edge(vd + 900, 7000, '#ff2a2a', 3.4);
            ed.style.boxShadow = 'inset 0 0 0 2px #ff2a2a,inset 0 0 160px 18px #6a0000,inset 0 0 320px 40px #000';
            for (let i = 0; i < 4; i++) {
                ringIn(vd + 1400 + i * 600, 1500, 22 - i * 3, i % 2 ? '#ff2a2a' : '#fff');
            }
            particles([
                { type: 'stars', at: 0, n: 140, cols: ['#ffffff', '#ffd6d6'], life: vd / 1000 * 0.75, size: 1.6, pull: 60, rot: -0.12 },
                { type: 'spiral', at: 800, until: vd, rate: 70, ramp: 1, cols: ['#ff2a2a', '#fff'], life: 1.5, size: 2, dir: -1 },
                { type: 'spiral', at: vd + 1000, until: vd + 6400, rate: 90, cols: ['#ff2a2a', '#ff8a6a', '#fff'], life: 1.7, size: 2.2, dir: -1 },
                Object.assign({ at: vd + 1200, until: vd + 7400, rate: 45, life: 3.6, size: 3, wide: 1 }, ash)
            ], vd + 7600);
        }
        done();
        return;
    }
    // the tiers
    if (tier === 1) {
        sweep(0, 1100, c);
        ring(80, 1300, 5, c, 1.2, 10);
        reelGlow(0, 1200, c, 1.012);
        particles([{ type: 'burst', at: 60, n: 24, cols: [c, '#fff'], speed: 260, life: 1.1, size: 1.6, drag: 2.8 }]);
    }
    if (tier === 2) {
        trace(0, 1500, c, 1, 2);
        sweep(250, 1100, c);
        reelGlow(0, 1500, c, 1.03);
        ring(120, 1500, 7, c, 1.5, 14);
        ring(320, 1500, 9, c2, 1, 10);
        flash(80, 900, c2, 0.35, 45);
        particles([{ type: 'burst', at: 80, n: 46, cols: [c, c2, '#fff'], speed: 380, life: 1.4, size: 1.8, trail: 1 }]);
    }
    if (tier === 3) {
        veil(0, 2700, 0.55, [0.15, 0.7], '6,8,16', 16);
        dof(0, 2700, 4, 0.45);
        trace(0, 1800, c, 1.5, 3);
        reelGlow(0, 2400, c, 1.05);
        bloom(150, 1500, 70, c, 0.6);
        ring(150, 1700, 9, c, 2, 18);
        ring(380, 1800, 12, c2, 1.2, 12);
        particles([
            { type: 'burst', at: 150, n: 80, cols: [c, c2, '#fff'], speed: 460, life: 1.8, size: 2, trail: 1 },
            { type: 'burst', at: 500, n: 30, cols: [c, '#fff'], speed: 160, life: 2.2, size: 1.4, drag: 1.2, grav: -20 }
        ]);
    }
    if (tier === 4) {
        veil(0, 3300, 0.6, [0.1, 0.65], '10,4,14', 14);
        flash(0, 700, '#fff', 0.5, 35);
        bloom(0, 1600, 90, c, 0.75);
        ring(0, 1500, 14, '#fff', 2.5, 22);
        ring(140, 1800, 16, c, 1.5, 16);
        ring(300, 2000, 18, c2, 1, 12);
        rays(100, 3000, 0.35, 40, [c, c2, c, '#fff', c2], 30);
        shockPage(40, 34, 1.2, 1.4);
        reelGlow(0, 2600, c, 1.06);
        trace(200, 2000, c, 2, 3);
        edge(0, 2600, c2, 1.4);
        particles([
            { type: 'burst', at: 0, n: 140, cols: [c, c2, '#fff'], speed: 620, life: 1.9, size: 2.1, trail: 1 },
            { type: 'burst', at: 260, n: 50, cols: [c, '#fff'], speed: 220, life: 2.6, size: 1.5, drag: 1, grav: -16 }
        ]);
    }
    if (tier === 5) {
        bars(0, 4200, 7);
        veil(0, 4200, 0.62, [0.1, 0.72], '14,9,2', 14);
        // the page tips back, as if looking up into the light
        P(app, [
            { transform: 'none' },
            { transform: 'perspective(1100px) rotateX(9deg) scale(.95)', offset: 0.28 },
            { transform: 'perspective(1100px) rotateX(7deg) scale(.955)', offset: 0.6 },
            { transform: 'none' }
        ], { duration: 4000, easing: 'cubic-bezier(.3,.1,.2,1)' });
        if (app) {
            app.style.transformOrigin = '50% ' + (cy - app.getBoundingClientRect().top) + 'px';
        }
        dof(200, 3600, 2, 0.6);
        // shafts of light falling from above
        for (let i = 0; i < 6; i++) {
            const x = cx + (i - 2.5) * Math.min(W, 900) * 0.13 + (Math.random() - 0.5) * 30;
            const s = E('fx-shaft', 'left:' + x + 'px;width:' + (60 + Math.random() * 90) + 'px;background:linear-gradient(180deg,' + c + ',transparent 85%)');
            A(s, [{ opacity: 0, transform: 'translateX(-50%) skewX(' + (i - 2.5) * 4 + 'deg) scaleY(0)' }, { opacity: 0.45, transform: 'translateX(-50%) skewX(' + (i - 2.5) * 4 + 'deg) scaleY(1)', offset: 0.3 }, { opacity: 0.3, offset: 0.7 }, { opacity: 0 }], { duration: 3600, delay: 120 + i * 90, easing: 'ease-out' });
        }
        bloom(0, 2200, 110, c, 0.85);
        flash(0, 900, '#fff', 0.45, 40);
        rays(80, 3800, 0.42, 30, [c, c2, '#fff', c, c2], 40);
        ring(0, 1800, 16, '#fff', 2.5, 24);
        ring(200, 2200, 20, c, 1.5, 18);
        reelGlow(0, 3600, c, 1.07);
        trace(100, 2600, c, 2, 3);
        edge(0, 3600, c2, 1.8);
        particles([
            { type: 'burst', at: 0, n: 150, cols: [c, c2, '#fff'], speed: 560, life: 2, size: 2.2, trail: 1, grav: 30 },
            { type: 'embers', at: 150, until: 3600, rate: 46, cols: [c, c2, '#ffe8a8'], life: 2.4, size: 2.2 }
        ]);
    }
    if (tier === 6) {
        bars(0, 5000, 8);
        veil(0, 5000, 0.7, [0.06, 0.7], '16,5,2', 12);
        flash(0, 1100, '#fff', 0.85, 60);
        flash(0, 2400, c2, 0.5, 80);
        bloom(0, 2400, 130, c, 0.95);
        ring(0, 1600, 22, '#fff', 3, 28);
        ring(90, 2000, 24, c, 2, 22);
        ring(240, 2400, 26, c2, 1.2, 16);
        rays(0, 4600, 0.5, 50, [c, c2, '#ffd6a0', c2], 34);
        shake(game, 0, 1200, 16, 0.6);
        shockPage(30, 46, 2.2, 1.8);
        warpFx(tok, 120, 2600, 12, 'heat');
        reels.forEach(r => P(r, [
            { filter: 'none' },
            { filter: 'drop-shadow(5px 0 0 rgba(255,40,40,.75)) drop-shadow(-5px 0 0 rgba(40,220,255,.75))', offset: 0.06 },
            { filter: 'drop-shadow(1px 0 0 rgba(255,40,40,.4)) drop-shadow(-1px 0 0 rgba(40,220,255,.4))', offset: 0.3 },
            { filter: 'none' }
        ], { duration: 1600, easing: 'ease-out' }));
        reelGlow(0, 4200, c, 1.08);
        trace(150, 3000, c, 3, 3);
        edge(0, 4400, c2, 2.2);
        particles([
            { type: 'burst', at: 0, n: 220, cols: [c, c2, '#fff', '#ffd166'], speed: 780, life: 2.2, size: 2.3, trail: 1, grav: 120, drag: 1.8 },
            { type: 'embers', at: 200, until: 4400, rate: 60, cols: [c, c2, '#ffd6a0'], life: 2.4, size: 2.4, wide: 1 }
        ]);
    }
    if (tier === 7) {
        bars(0, 5800, 9);
        veil(0, 5800, 0.74, [0.05, 0.72], '18,2,8', 12);
        // first impact
        flash(0, 900, '#fff', 0.7, 50);
        bloom(0, 1600, 100, c, 0.8);
        ring(0, 1300, 18, '#fff', 2.5, 22);
        shake(game, 0, 380, 12, 0.5);
        // second impact: the page flashes to its negative and scatters
        P(app, [
            { filter: 'none' },
            { filter: 'invert(1) hue-rotate(180deg) contrast(1.2)', offset: 0.02 },
            { filter: 'invert(1) hue-rotate(180deg) contrast(1.2)', offset: 0.12 },
            { filter: 'none', offset: 0.22 },
            { filter: 'none' }
        ], { duration: 900, delay: 340, easing: 'linear' });
        flash(340, 1600, '#fff', 0.95, 70);
        flash(340, 3000, c2, 0.55, 90);
        bloom(340, 2800, 150, c, 1);
        ring(340, 1700, 26, '#fff', 3.5, 30);
        ring(440, 2100, 28, c, 2, 22);
        ring(600, 2500, 30, c2, 1.2, 16);
        rays(340, 5200, 0.55, -60, [c, c2, '#fff', c2, c], 30);
        rays(340, 5200, 0.3, 50, [c2, c], 18, 140);
        shake(game, 340, 1500, 22, 1);
        shockPage(360, 70, 5, 2.2);
        warpFx(tok, 400, 2400, 18, 'ripple');
        reelGlow(340, 4800, c, 1.09);
        trace(400, 3200, c, 3, 4);
        edge(340, 5000, c2, 2.6);
        particles([
            { type: 'burst', at: 0, n: 90, cols: [c, '#fff'], speed: 520, life: 1.4, size: 2, trail: 1 },
            { type: 'burst', at: 340, n: 260, cols: [c, c2, '#fff', '#ffb3c1'], speed: 900, life: 2.4, size: 2.4, trail: 1, grav: 60, drag: 1.7 },
            { type: 'rain', at: 700, until: 5000, rate: 40, cols: [c, '#fff', c2], life: 2, size: 2.2 }
        ]);
    }
    if (tier === 8) {
        // build-up: the page is drawn into the roll window over a heartbeat
        veil(0, vd + 4600, 0.96, [vd / (vd + 4600) * 0.85, (vd + 1400) / (vd + 4600)], '4,2,14', 4);
        if (app) {
            app.style.transformOrigin = origin(app);
        }
        {
            const L = vd + 1800;
            const o = ms => ms / L;
            P(app, [
                { transform: 'none', easing: 'cubic-bezier(.5,0,.8,.6)' },
                { transform: 'scale(.86) rotate(-1.2deg)', offset: o(vd * 0.92) },
                { transform: 'scale(.84) rotate(-1.4deg)', offset: o(vd), easing: 'cubic-bezier(.2,.9,.25,1)' },
                { transform: 'scale(1.035) rotate(.3deg)', offset: o(vd + 220) },
                { transform: 'scale(.995)', offset: o(vd + 600) },
                { transform: 'none' }
            ], { duration: L, easing: 'linear' });
        }
        rumble(game, 0, vd, 4);
        (T.hb || []).forEach((ms, i, a) => {
            const k = (i + 1) / a.length;
            flash(ms, 520, c2, 0.15 + k * 0.25, 40);
            ring(ms, 900, 3 + k * 3, c, 1.5, 14, 0.5);
        });
        ringIn(0, vd * 0.7, 14, c);
        ringIn(vd * 0.3, vd * 0.7, 12, c2);
        // release
        flash(vd, 1400, '#fff', 0.95, 75);
        bloom(vd, 3000, 170, c, 1);
        ring(vd, 1700, 30, '#fff', 3.5, 34);
        ring(vd + 100, 2200, 32, c, 2, 24);
        ring(vd + 260, 2600, 34, c2, 1.4, 18);
        rays(vd, 5200, 0.55, 70, [c, c2, '#fff', c, c2], 36);
        aurora(vd + 200, 5200, [c2, c, '#7de0ff'], 0.4);
        shake(game, vd, 1300, 14, 0.6);
        reelGlow(vd, 4800, c, 1.08);
        trace(vd + 100, 3400, c, 3, 4);
        edge(vd, 5200, c2, 3);
        particles([
            { type: 'spiral', at: 0, until: vd, rate: 85, ramp: 1, cols: [c, c2, '#fff'], life: 1.4, size: 2 },
            { type: 'burst', at: vd, n: 210, cols: [c, c2, '#fff', '#7de0ff'], speed: 980, life: 2.6, size: 2.4, trail: 1, drag: 1.6 },
            { type: 'burst', at: vd + 300, n: 80, cols: [c, '#fff'], speed: 300, life: 3.4, size: 1.6, drag: 0.9, grav: -10 }
        ]);
    }
    if (tier === 9) {
        // build-up: the page comes apart and drifts toward the roll window, into a starfield
        const v = E('fx-fill', 'background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,rgba(10,4,26,.5) 0,rgba(3,1,10,.97) 32%,#010004 100%)');
        const d = vd + 900;
        A(v, [{ opacity: 0 }, { opacity: 0.55, offset: 0.25 }, { opacity: 0.97, offset: vd / d * 0.95 }, { opacity: 1, offset: vd / d }, { opacity: 0 }], { duration: d, easing: 'ease-in' });
        parts.forEach((el, i) => {
            const vv = vec(el);
            const r = (Math.random() - 0.5) * 30;
            const z = -200 - Math.random() * 500;
            const st = i * 60;
            const back = vd + 250 + i * 70;
            const L = back + 1500;
            const o = ms => Math.min(1, ms / L);
            const tx = k => 'translate(' + (-vv.dx * vv.d * k).toFixed(0) + 'px,' + (-vv.dy * vv.d * k).toFixed(0) + 'px)';
            P(el, [
                { transform: 'none', opacity: 1, offset: 0 },
                { transform: 'none', opacity: 1, offset: o(st), easing: 'cubic-bezier(.55,0,.75,.4)' },
                { transform: 'perspective(900px) ' + tx(0.15) + ' translateZ(' + (z * 0.3).toFixed(0) + 'px) rotate(' + (r * 0.3).toFixed(1) + 'deg)', opacity: 0.85, offset: o(st + vd * 0.4), easing: 'cubic-bezier(.55,0,.75,.4)' },
                { transform: 'perspective(900px) ' + tx(0.7) + ' translateZ(' + z.toFixed(0) + 'px) rotateX(' + (r * 0.8).toFixed(1) + 'deg) rotate(' + r.toFixed(1) + 'deg)', opacity: 0, offset: o(Math.min(st + vd, back)) },
                { transform: 'perspective(900px) translate(' + (vv.dx * 80).toFixed(0) + 'px,' + (vv.dy * 80).toFixed(0) + 'px) translateZ(200px)', opacity: 0, offset: o(back), easing: 'cubic-bezier(.15,.9,.25,1)' },
                { transform: 'perspective(900px) translate(' + (-vv.dx * 6).toFixed(0) + 'px,' + (-vv.dy * 6).toFixed(0) + 'px)', opacity: 1, offset: o(back + 600) },
                { transform: 'none', opacity: 1, offset: 1 }
            ], { duration: L, easing: 'linear' });
        });
        reels.forEach(r => P(r, [{ transform: 'none' }, { transform: 'scale(1.04)', offset: 0.9 }, { transform: 'scale(.97)' }], { duration: vd, easing: 'ease-in' }));
        reelFx(b => {
            const g = E('fx-fill', 'inset:auto;left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px;box-shadow:0 0 0 3px #fff,0 0 90px 24px ' + c2);
            A(g, [{ opacity: 0 }, { opacity: 0.8, offset: 0.85 }, { opacity: 1 }], { duration: vd, easing: 'ease-in' });
        });
        rumble(game, 0, vd, 6);
        (T.hb || []).forEach((ms, i, a) => {
            const k = (i + 1) / a.length;
            flash(ms, 600, i % 2 ? c2 : '#8fb4ff', 0.12 + k * 0.3, 30 + k * 30);
            ring(ms, 1000, 3 + k * 5, i % 2 ? c2 : '#cfe0ff', 1.5, 16, 0.5);
        });
        ringIn(0, vd * 0.6, 16, '#cfe0ff');
        ringIn(vd * 0.25, vd * 0.6, 14, c2);
        ringIn(vd * 0.5, vd * 0.5, 12, '#fff');
        // release: white-out, then prismatic light as the page reforms
        const wo = E('fx-fill', 'background:#fff');
        A(wo, [{ opacity: 0 }, { opacity: 1, offset: 0.04 }, { opacity: 1, offset: 0.12 }, { opacity: 0 }], { duration: 2400, delay: vd - 80, easing: 'ease-out' });
        const prism = ['#ff6b9a', '#ffd36b', '#7dffa0', '#6bdcff', '#a58bff'];
        const r1 = rays(vd, 7000, 0.6, 120, prism, 40);
        for (let i = 0; i < 4; i++) {
            ring(vd + i * 200, 2400 + i * 200, 30 + i * 4, prism[i % 5], 2.5 - i * 0.25, 26);
        }
        aurora(vd + 300, 6800, ['#ff7ad9', '#6bdcff', '#a58bff'], 0.4);
        const ed = edge(vd, 7200, '#fff', 3.2);
        ed.style.boxShadow = 'inset 0 0 0 2px #ff7ad9,inset 0 0 160px 14px #6bdcff,inset 0 0 300px 30px #a58bff';
        bloom(vd, 3600, 200, '#fff6d6', 1);
        flash(vd + 200, 4000, c2, 0.4, 100);
        shake(game, vd + 200, 1600, 18, 0.8);
        trace(vd + 300, 4000, '#fff', 4, 4);
        particles([
            { type: 'stars', at: 0, n: 150, cols: ['#ffffff', '#cfe0ff', '#ffd6f2'], life: vd / 1000 + 0.4, size: 1.6, pull: 120, rot: 0.25 },
            { type: 'spiral', at: 600, until: vd, rate: 100, ramp: 1, cols: ['#cfe0ff', c2, '#fff'], life: 1.5, size: 2, dir: -1 },
            { type: 'galaxy', at: vd, n: 240, cols: 'rainbow', speed: 1100, life: 3.4, size: 2.4, trail: 1, drag: 1.3, spin: 1.6 },
            { type: 'burst', at: vd + 500, n: 100, cols: 'rainbow', speed: 420, life: 4.2, size: 1.7, drag: 0.8, grav: -8 },
            { type: 'embers', at: vd + 800, until: vd + 6000, rate: 26, cols: 'rainbow', life: 2.6, size: 1.8, wide: 1 }
        ]);
    }
    done();
}
const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function warpFx(tok, delay, dur, peak, mode) {
    if (prefersReducedMotion()) {
        return;
    }
    const turb = $('fxTurb');
    const disp = $('fxDisp');
    if (!turb || !disp) {
        return;
    }
    const clear = () => {
        document.body.classList.remove('fx-warping');
        disp.setAttribute('scale', '0');
    };
    setTimeout(() => {
        if (tok !== fxRunId) {
            return;
        }
        document.body.classList.add('fx-warping');
        const t0 = performance.now();
        (function f(now) {
            if (tok !== fxRunId) {
                clear();
                return;
            }
            const t = Math.max(0, now - t0);
            if (t > dur) {
                clear();
                return;
            }
            const e = Math.pow(Math.sin(Math.PI * t / dur), 0.7);
            disp.setAttribute('scale', (peak * e).toFixed(1));
            turb.setAttribute('baseFrequency', mode === 'heat' ? (0.012 + Math.sin(t / 700) * 0.003).toFixed(4) + ' ' + (0.05 + Math.sin(t / 140) * 0.012).toFixed(4) : (0.004 + Math.sin(t / 1100) * 0.0025).toFixed(4) + ' ' + (0.007 + Math.cos(t / 900) * 0.003).toFixed(4));
            requestAnimationFrame(f);
        })(performance.now());
    }, delay);
}
