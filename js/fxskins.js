// retro spawn effects

// canvas over the page. o.px draws at low res for retro
function fxScene(k, dur, draw, o) {
    o = o || {};
    const cv = document.createElement('canvas');
    cv.className = 'fx fx-canvas';
    if (o.blend) {
        cv.style.mixBlendMode = o.blend;
    }
    k.ov.appendChild(cv);
    const W = innerWidth;
    const H = innerHeight;
    const px = o.px || 0;
    let g;
    let out;
    let buf;
    if (px) {
        buf = document.createElement('canvas');
        buf.width = Math.ceil(W / px);
        buf.height = Math.ceil(H / px);
        g = buf.getContext('2d');
        cv.width = W;
        cv.height = H;
        out = cv.getContext('2d');
        out.imageSmoothingEnabled = false;
    } else {
        const dpr = Math.min(1.5, devicePixelRatio || 1);
        cv.width = W * dpr;
        cv.height = H * dpr;
        g = cv.getContext('2d');
        g.scale(dpr, dpr);
    }
    const t0 = performance.now();
    (function f(now) {
        if (k.tok !== fxRunId) {
            return;
        }
        const t = now - t0;
        if (px) {
            g.clearRect(0, 0, buf.width, buf.height);
            draw(g, t, buf.width, buf.height);
            out.clearRect(0, 0, W, H);
            out.drawImage(buf, 0, 0, buf.width * px, buf.height * px);
            if (o.scan) {
                // scanlines
                out.fillStyle = scanPattern(out, px);
                out.fillRect(0, 0, W, H);
            }
        } else {
            g.clearRect(0, 0, W, H);
            draw(g, t, W, H);
        }
        if (t < dur) {
            requestAnimationFrame(f);
        } else {
            cv.remove();
        }
    })(t0);
}
function scanPattern(g, px) {
    if (scanPattern.c && scanPattern.c.px === px) {
        return scanPattern.c.p;
    }
    const s = document.createElement('canvas');
    s.width = 1;
    s.height = px;
    const x = s.getContext('2d');
    x.fillStyle = 'rgba(0,0,0,.28)';
    x.fillRect(0, px - 1, 1, 1);
    scanPattern.c = { px, p: g.createPattern(s, 'repeat') };
    return scanPattern.c.p;
}
// 0..1 between a and b
const fxK = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const fxEnv = (t, a, b, i, o) => t < a || t > b ? 0 : Math.min(1, (t - a) / (i || 1), (b - t) / (o || 1));
// reduce flashing
const fxFlash = a => calmFx ? Math.min(0.3, a * 0.35) : a;
const fxStep = (x, n) => calmFx ? x : Math.floor(x * n) / n;

// retro
const RETRO_PAL = [
    null,
    ['#5fcde4', '#306082', '#ffffff'],
    ['#6abe30', '#37946e', '#cbdbfc'],
    ['#9b6bff', '#5b37c9', '#ffffff', '#cbdbfc'],
    ['#ff77a8', '#b13e8a', '#ffffff', '#ffccaa'],
    ['#fbf236', '#df7126', '#ffffff', '#8f563b'],
    ['#ff8a2a', '#d0302a', '#fbf236', '#ffffff'],
    ['#ff004d', '#7e2553', '#ffffff', '#29adff'],
    ['#c2c3ff', '#5b37c9', '#ffffff', '#ff77a8'],
    ['#fff1e8', '#ff77a8', '#29adff', '#fbf236', '#00e436'],
    ['#29f0ff', '#7a5cff', '#ffffff', '#ff77a8'],
    ['#c45cff', '#ff4fd8', '#29f0ff', '#ffffff'],
    ['#ffd36e', '#ff77a8', '#29adff', '#00e436', '#ffffff', '#7a5cff']
];
const RAINBOW8 = ['#ff004d', '#ffa300', '#ffec27', '#00e436', '#29adff', '#83769c', '#ff77a8'];
// bayer 4x4
function ditherFill(g, col, level) {
    ditherFill.c = ditherFill.c || {};
    const key = col + level;
    if (!ditherFill.c[key]) {
        const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
        const s = document.createElement('canvas');
        s.width = s.height = 4;
        const x = s.getContext('2d');
        x.fillStyle = col;
        B.forEach((v, i) => {
            if (v < level) {
                x.fillRect(i % 4, i >> 2, 1, 1);
            }
        });
        ditherFill.c[key] = s;
    }
    return g.createPattern(ditherFill.c[key], 'repeat');
}
// midpoint circle
function pxCircle(g, x0, y0, r, col, th) {
    g.fillStyle = col;
    for (let w = 0; w < (th || 1); w++) {
        let x = Math.round(r) + w;
        let y = 0;
        let e = 1 - x;
        while (x >= y) {
            [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]].forEach(([a, b]) => g.fillRect(Math.round(x0 + a), Math.round(y0 + b), 1, 1));
            y++;
            if (e < 0) {
                e += 2 * y + 1;
            } else {
                x--;
                e += 2 * (y - x) + 1;
            }
        }
    }
}
function pxDisc(g, x0, y0, r, fill, sx) {
    g.fillStyle = fill;
    r = Math.round(r);
    for (let dy = -r; dy <= r; dy++) {
        const w = Math.floor(Math.sqrt(r * r - dy * dy) * (sx == null ? 1 : sx));
        g.fillRect(Math.round(x0 - w), Math.round(y0 + dy), w * 2 + 1, 1);
    }
}
function pxLine(g, x0, y0, x1, y1, col) {
    g.fillStyle = col;
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (let n = 0; n < 4000; n++) {
        g.fillRect(x0, y0, 1, 1);
        if (x0 === x1 && y0 === y1) {
            break;
        }
        const e2 = 2 * e;
        if (e2 >= dy) {
            e += dy;
            x0 += sx;
        }
        if (e2 <= dx) {
            e += dx;
            y0 += sy;
        }
    }
}
function pxTwinkle(g, x, y, s, col) {
    x = Math.round(x);
    y = Math.round(y);
    g.fillStyle = col;
    g.fillRect(x, y - s, 1, s * 2 + 1);
    g.fillRect(x - s, y, s * 2 + 1, 1);
    if (s > 2) {
        g.fillStyle = '#fff';
        g.fillRect(x - 1, y - 1, 3, 3);
    }
}
function pxCoin(g, x, y, r, spin) {
    const sx = Math.abs(Math.cos(spin));
    pxDisc(g, x, y, r, '#df7126', Math.max(0.15, sx));
    pxDisc(g, x, y, r - 1, '#fbf236', Math.max(0.1, sx * 0.85));
    if (sx > 0.4) {
        g.fillStyle = '#fff';
        g.fillRect(Math.round(x - r * sx * 0.4), Math.round(y - r * 0.5), 1, Math.max(1, Math.round(r * 0.6)));
    }
}
// lightning
function pxBolt(g, x0, y0, x1, y1, col, seed, jag) {
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const n = 9;
    let px = x0;
    let py = y0;
    for (let i = 1; i <= n; i++) {
        const f = i / n;
        const x = i === n ? x1 : x0 + (x1 - x0) * f + (rnd() - 0.5) * (jag || 16);
        const y = i === n ? y1 : y0 + (y1 - y0) * f;
        pxLine(g, px, py, x, y, col);
        pxLine(g, px + 1, py, x + 1, y, col);
        px = x;
        py = y;
    }
}
// pixel particles
function pxBits() {
    const L = [];
    return {
        burst(x, y, n, pal, speed, o) {
            o = o || {};
            for (let i = 0; i < n; i++) {
                const a = o.ring ? i / n * 6.2832 : Math.random() * 6.2832;
                const sp = speed * (o.ring ? 1 : 0.25 + Math.random() * 0.75);
                L.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: o.grav || 0, col: pal[i % pal.length], life: (o.life || 1) * (0.7 + Math.random() * 0.6), age: 0, s: o.size || 1, tw: o.twinkle, drag: o.drag == null ? 1.5 : o.drag, coin: o.coin, spin: Math.random() * 6 });
            }
        },
        add(p) {
            L.push(Object.assign({ age: 0, g: 0, drag: 0, s: 1, life: 1 }, p));
        },
        draw(g, dt) {
            for (let i = L.length; i--;) {
                const p = L[i];
                p.age += dt;
                if (p.age >= p.life) {
                    L.splice(i, 1);
                    continue;
                }
                const d = Math.exp(-p.drag * dt);
                p.vx *= d;
                p.vy = p.vy * d + p.g * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                // blink before they go
                if (p.age > p.life * 0.66 && Math.floor(p.age * 16) % 2 && !calmFx) {
                    continue;
                }
                if (p.coin) {
                    pxCoin(g, p.x, p.y, p.s, p.spin + p.age * 9);
                } else if (p.tw) {
                    pxTwinkle(g, p.x, p.y, Math.max(1, Math.round(p.s * (1 - p.age / p.life))), p.col);
                } else {
                    g.fillStyle = p.col;
                    g.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
                }
            }
        },
        get n() {
            return L.length;
        }
    };
}
function retroShake(k, el, delay, dur, amp) {
    const fr = [];
    const n = Math.max(6, Math.round(dur / 70));
    for (let i = 0; i <= n; i++) {
        const f = Math.pow(1 - i / n, 1.4);
        fr.push({ transform: i === 0 || i === n ? 'none' : 'translate(' + Math.round((Math.random() - 0.5) * 2 * amp * f / 4) * 4 + 'px,' + Math.round((Math.random() - 0.5) * 2 * amp * f / 4) * 4 + 'px)' });
    }
    k.P(el, fr, { duration: dur, delay, easing: calmFx ? 'linear' : 'steps(' + n + ')' });
}
function retroFx(tier, k) {
    const { T, vd, total } = k;
    const pal = RETRO_PAL[tier];
    const PX = Math.max(3, Math.round(Math.min(innerWidth, innerHeight) / 200));
    const scan = tier >= 4;
    const bits = pxBits();
    let last = 0;
    const rb = k.reels.length ? k.reels[0].getBoundingClientRect() : null;
    const box = rb ? { x: Math.round(rb.left / PX), y: Math.round(rb.top / PX), w: Math.round(rb.width / PX), h: Math.round(rb.height / PX) } : null;
    const marching = (g, t, col, speed) => {
        // marching ants
        if (!box) {
            return;
        }
        g.fillStyle = col;
        const per = 2 * (box.w + box.h);
        const off = Math.floor(t / (speed || 40));
        for (let i = 0; i < per; i++) {
            if ((i + off) % 6 > 2) {
                continue;
            }
            let x;
            let y;
            if (i < box.w) {
                x = box.x + i;
                y = box.y - 2;
            } else if (i < box.w + box.h) {
                x = box.x + box.w + 1;
                y = box.y + i - box.w;
            } else if (i < 2 * box.w + box.h) {
                x = box.x + box.w - (i - box.w - box.h);
                y = box.y + box.h + 1;
            } else {
                x = box.x - 2;
                y = box.y + box.h - (i - 2 * box.w - box.h);
            }
            g.fillRect(x, y, 1, 1);
        }
    };
    // dither vignette, a > 1 blacks out the middle too
    const ditherVeil = (g, a, W, H, col) => {
        a = Math.max(0, a);
        if (a <= 0) {
            return;
        }
        col = col || '#000';
        const M = Math.hypot(W, H) / 2;
        const steps = [[1, 1], [0.62, 0.66], [0.38, 0.33]];
        steps.forEach(([rf, lf], i) => {
            const lv = Math.min(16, Math.round(a * lf * 14));
            if (lv <= 0) {
                return;
            }
            if (i) {
                g.globalCompositeOperation = 'destination-out';
                pxDisc(g, cx, cy, M * rf, '#000');
                g.globalCompositeOperation = 'source-over';
                pxDisc(g, cx, cy, M * rf, ditherFill(g, col, lv));
            } else {
                g.fillStyle = ditherFill(g, col, lv);
                g.fillRect(0, 0, W, H);
            }
        });
        if (a > 1) {
            g.globalAlpha = Math.min(1, a - 1);
            g.fillStyle = col;
            g.fillRect(0, 0, W, H);
            g.globalAlpha = 1;
        }
    };
    const palFlash = (g, a, W, H, col) => {
        const v = fxFlash(fxStep(a, 3));
        if (v > 0) {
            g.globalAlpha = v;
            g.fillStyle = col;
            g.fillRect(0, 0, W, H);
            g.globalAlpha = 1;
        }
    };
    const ringAt = (g, t, at, dur, r1, col, th, stepMs) => {
        const f = fxK(t, at, at + dur);
        if (f <= 0 || f >= 1) {
            return;
        }
        const ff = fxStep(f, Math.max(4, Math.round(dur / (stepMs || 60))));
        pxCircle(g, cx, cy, 2 + ff * r1, col, th || 1);
    };
    const cx = Math.round(k.cx / PX);
    const cy = Math.round(k.cy / PX);
    const once = {};
    const at = (t, ms, key, fn) => {
        if (t >= ms && !once[key]) {
            once[key] = 1;
            fn();
        }
    };
    const hb = T.hb || [];
    let draw;
    if (tier === 1) {
        draw = (g, t) => {
            at(t, 60, 'b', () => bits.burst(cx, cy, 14, pal, 60, { twinkle: 1, size: 2, life: 1.1, drag: 3 }));
            ringAt(g, t, 0, 900, 70, pal[0], 1);
            marching(g, t, pal[0]);
        };
    } else if (tier === 2) {
        draw = (g, t) => {
            at(t, 80, 'b', () => bits.burst(cx, cy, 30, pal, 110, { life: 1.3, size: 2 }));
            at(t, 300, 'c', () => bits.burst(cx, cy, 10, pal, 70, { twinkle: 1, size: 3, life: 1.2, drag: 3 }));
            ringAt(g, t, 0, 1000, 80, pal[0], 2);
            ringAt(g, t, 250, 1100, 110, pal[1], 1);
            marching(g, t, pal[2], 30);
        };
        k.reelGlow(0, 1500, T.c, 1.03);
    } else if (tier === 3) {
        // coins
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 2700, 300, 600) * 0.7, W, H);
            at(t, 120, 'c', () => {
                for (let i = 0; i < 14; i++) {
                    bits.add({ x: cx + (Math.random() - 0.5) * 20, y: cy, vx: (Math.random() - 0.5) * 140, vy: -120 - Math.random() * 120, g: 260, life: 1.8, s: 4, coin: 1, spin: Math.random() * 6 });
                }
            });
            at(t, 150, 'b', () => bits.burst(cx, cy, 40, pal, 150, { life: 1.6, size: 2 }));
            ringAt(g, t, 150, 1200, 120, pal[0], 2);
            ringAt(g, t, 400, 1300, 150, pal[1], 1);
            marching(g, t, pal[0], 30);
        };
        k.dof(0, 2700, 3, 0.5);
    } else if (tier === 4) {
        // power up
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 3300, 200, 900) * 0.75, W, H);
            [0, 180, 360].forEach((ms, i) => palFlash(g, fxEnv(t, ms, ms + 140, 20, 100) * 0.5, W, H, pal[i % 2 ? 1 : 0]));
            const rot = fxStep(fxK(t, 0, 3000), 12) * 1.6;
            const ba = fxEnv(t, 100, 3000, 300, 900);
            if (ba > 0) {
                const L = Math.max(W, H);
                g.globalAlpha = Math.min(0.55, ba);
                for (let i = 0; i < 8; i++) {
                    const a = rot + i * 0.785;
                    g.fillStyle = i % 2 ? pal[1] : pal[0];
                    g.beginPath();
                    g.moveTo(cx, cy);
                    g.lineTo(cx + Math.cos(a - 0.05) * L, cy + Math.sin(a - 0.05) * L);
                    g.lineTo(cx + Math.cos(a + 0.05) * L, cy + Math.sin(a + 0.05) * L);
                    g.fill();
                }
                g.globalAlpha = 1;
            }
            at(t, 0, 'b', () => bits.burst(cx, cy, 70, pal, 220, { life: 1.8, size: 2 }));
            at(t, 260, 'c', () => bits.burst(cx, cy, 16, pal, 90, { twinkle: 1, size: 3, life: 1.6, drag: 2 }));
            ringAt(g, t, 0, 1200, 180, '#fff', 3);
            ringAt(g, t, 140, 1400, 210, pal[0], 2);
            ringAt(g, t, 300, 1600, 240, pal[1], 1);
            marching(g, t, pal[2], 25);
        };
        k.shockPage(40, 32, 0, 1.4);
    } else if (tier === 5) {
        // fireworks
        const rockets = Array.from({ length: 6 }, (_, i) => ({ x: 0.15 + i * 0.14 + (Math.random() - 0.5) * 0.05, at: 150 + i * 330 + Math.random() * 120, top: 0.18 + Math.random() * 0.3, col: RAINBOW8[i % 7] }));
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 4200, 300, 900) * 0.8, W, H, '#1a1c2c');
            rockets.forEach((r, i) => {
                const x = Math.round(r.x * W);
                const y0 = H + 2;
                const y1 = Math.round(r.top * H);
                const f = fxK(t, r.at, r.at + 520);
                if (f > 0 && f < 1) {
                    const y = y0 + (y1 - y0) * (1 - Math.pow(1 - f, 2));
                    g.fillStyle = '#fff';
                    g.fillRect(x, Math.round(y), 1, 2);
                    g.fillStyle = r.col;
                    g.fillRect(x, Math.round(y) + 2, 1, 3);
                }
                at(t, r.at + 520, 'r' + i, () => {
                    bits.burst(x, y1, 28, [r.col, '#fff', r.col], 70, { ring: 1, life: 1.6, size: 1, grav: 30, drag: 1.2 });
                    bits.burst(x, y1, 12, [r.col], 30, { twinkle: 1, size: 2, life: 1.2, drag: 2 });
                });
            });
            at(t, 0, 'b', () => bits.burst(cx, cy, 50, pal, 170, { life: 1.6, size: 2, grav: 60 }));
            ringAt(g, t, 0, 1300, 160, pal[0], 2);
            marching(g, t, pal[0], 25);
        };
        k.bars(0, 4200, 7);
    } else if (tier === 6) {
        // explosion
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 5000, 150, 1200) * 0.8, W, H, '#1a0a06');
            palFlash(g, fxEnv(t, 0, 220, 10, 200) * 0.85, W, H, '#fff');
            const f = fxK(t, 0, 1600);
            if (f > 0 && f < 1) {
                const r = fxStep(Math.pow(f, 0.5), 10) * 70;
                const fade = Math.round((1 - f) * 16);
                pxDisc(g, cx, cy, r, ditherFill(g, '#5f574f', Math.max(1, fade)));
                pxDisc(g, cx, cy, r * 0.8, ditherFill(g, pal[1], Math.max(1, fade)));
                pxDisc(g, cx, cy, r * 0.55, ditherFill(g, pal[0], Math.max(1, fade)));
                pxDisc(g, cx, cy, r * 0.3, ditherFill(g, pal[2], Math.max(1, fade)));
            }
            at(t, 0, 'b', () => {
                bits.burst(cx, cy, 90, pal, 260, { life: 2, size: 2, grav: 140, drag: 1.2 });
                bits.burst(cx, cy, 30, ['#5f574f', '#83769c'], 60, { life: 2.6, size: 3, grav: -20, drag: 1 });
            });
            at(t, 600, 'e', () => bits.burst(cx, cy, 20, [pal[2], '#fff'], 80, { twinkle: 1, size: 2, life: 1.6 }));
            ringAt(g, t, 0, 1400, 260, '#fff', 3);
            ringAt(g, t, 100, 1700, 300, pal[0], 2);
            if (t > 200 && t < 4400) {
                if (Math.random() < 0.5) {
                    bits.add({ x: Math.random() * W, y: H + 1, vx: 0, vy: -30 - Math.random() * 40, life: 2.4, col: pal[Math.random() * 3 | 0] });
                }
            }
            marching(g, t, pal[2], 20);
        };
        retroShake(k, k.game, 0, 1200, 16);
        k.shockPage(30, 44, 0, 1.8);
    } else if (tier === 7) {
        // two strikes, second one inverts
        const seeds = [Math.random() * 99999 | 0, Math.random() * 99999 | 0, Math.random() * 99999 | 0];
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 5800, 100, 1200) * 0.85, W, H, '#0b0820');
            [0, 340].forEach((ms, i) => {
                const a = fxEnv(t, ms, ms + 420, 10, 250);
                if (a > 0 && (a > 0.5 || Math.floor(t / 50) % 2 || calmFx)) {
                    const sx = i ? W * 0.82 : W * 0.18;
                    pxBolt(g, sx, 0, cx, cy, i ? pal[3] : pal[2], seeds[i] + Math.floor(t / 70), 26);
                    pxBolt(g, sx + (i ? -30 : 30), 0, cx, cy, pal[0], seeds[2] + Math.floor(t / 90), 18);
                }
                palFlash(g, fxEnv(t, ms, ms + 200, 10, 180) * 0.7, W, H, i ? pal[3] : '#fff');
            });
            if (t > 340 && t < 900) {
                const y = Math.floor(((t - 340) / 560) * H);
                g.globalCompositeOperation = 'difference';
                g.fillStyle = calmFx ? 'rgba(255,255,255,.25)' : '#fff';
                g.fillRect(0, y - 20, W, 12);
                g.fillRect(0, y - 60, W, 6);
                g.globalCompositeOperation = 'source-over';
            }
            at(t, 0, 'b1', () => bits.burst(cx, cy, 60, pal, 200, { life: 1.6, size: 2, grav: 80 }));
            at(t, 340, 'b2', () => bits.burst(cx, cy, 90, pal, 280, { life: 2, size: 2, grav: 120 }));
            at(t, 500, 'tw', () => bits.burst(cx, cy, 24, [pal[2], pal[3]], 120, { twinkle: 1, size: 3, life: 1.8, drag: 2 }));
            ringAt(g, t, 0, 1100, 200, '#fff', 2);
            ringAt(g, t, 340, 1500, 320, pal[0], 3);
            ringAt(g, t, 500, 1700, 360, pal[3], 1);
            marching(g, t, pal[2], 18);
        };
        retroShake(k, k.game, 0, 380, 12);
        retroShake(k, k.game, 340, 1400, 20);
        k.shockPage(360, 50, 0, 2);
    } else if (tier === 8) {
        // iris wipe on the heartbeat
        draw = (g, t, W, H) => {
            const R0 = Math.hypot(W, H) * 0.6;
            if (t < vd + 120) {
                let n = 0;
                hb.forEach(ms => {
                    if (t >= ms) {
                        n++;
                    }
                });
                const target = R0 * (1 - n / (hb.length + 1) * 0.9);
                const r = t < vd ? target : Math.max(4, target * (1 - fxK(t, vd, vd + 120)));
                g.fillStyle = '#000';
                g.fillRect(0, 0, W, H);
                g.globalCompositeOperation = 'destination-out';
                pxDisc(g, cx, cy, r, '#000');
                g.globalCompositeOperation = 'source-over';
                pxCircle(g, cx, cy, r, pal[0], 1);
                hb.forEach((ms, i) => ringAt(g, t, ms, 300, 30 + i * 6, pal[i % 2 ? 1 : 3], 1));
            } else {
                // open
                const f = fxK(t, vd + 120, vd + 900);
                if (f < 1) {
                    const r = fxStep(f, 8) * R0;
                    g.fillStyle = '#000';
                    g.fillRect(0, 0, W, H);
                    g.globalCompositeOperation = 'destination-out';
                    pxDisc(g, cx, cy, Math.max(1, r), '#000');
                    g.globalCompositeOperation = 'source-over';
                    pxCircle(g, cx, cy, r, '#fff', 2);
                }
                palFlash(g, fxEnv(t, vd + 100, vd + 400, 20, 250) * 0.6, W, H, pal[2]);
                ditherVeil(g, fxEnv(t, vd + 400, vd + 6000, 200, 1200) * 0.6, W, H, '#0b0820');
            }
            at(t, vd + 120, 'b', () => {
                bits.burst(cx, cy, 100, pal, 300, { life: 2.2, size: 2, grav: 60 });
                bits.burst(cx, cy, 30, pal, 160, { twinkle: 1, size: 3, life: 2.4, drag: 1.6 });
            });
            ringAt(g, t, vd + 120, 1500, 300, '#fff', 3);
            ringAt(g, t, vd + 300, 1800, 340, pal[1], 2);
            if (t > vd) {
                marching(g, t, pal[0], 20);
            }
        };
        k.dof(0, vd + 200, 3, 0.4);
        retroShake(k, k.game, vd + 100, 1200, 14);
    } else if (tier === 9) {
        const stars = Array.from({ length: 160 }, () => ({ a: Math.random() * 6.2832, d: Math.random(), v: 0.4 + Math.random() * 0.9, c: Math.random() < 0.2 ? RAINBOW8[Math.random() * 7 | 0] : '#fff' }));
        let blocks = null;
        draw = (g, t, W, H, dt) => {
            const sp = t < vd ? 0.2 + fxK(t, 0, vd) * 1.6 : Math.max(0.15, 1.8 - fxK(t, vd, vd + 3000) * 1.65);
            const vis = fxEnv(t, 0, vd + 6000, 400, 1500);
            if (t < vd + 300) {
                ditherVeil(g, fxK(t, 0, 800) * 1.75, W, H, '#000');
            } else {
                ditherVeil(g, vis * 0.75, W, H, '#000');
            }
            const M = Math.hypot(W, H) * 0.6;
            stars.forEach(s => {
                s.d += s.v * sp * dt;
                if (s.d > 1) {
                    s.d = 0.02;
                    s.a = Math.random() * 6.2832;
                }
                const r = s.d * s.d * M;
                const len = Math.max(1, sp * s.d * 10);
                if (vis > 0) {
                    pxLine(g, cx + Math.cos(s.a) * r, cy + Math.sin(s.a) * r, cx + Math.cos(s.a) * (r + len), cy + Math.sin(s.a) * (r + len), s.c);
                }
            });
            hb.forEach((ms, i) => {
                for (let j = 0; j < 3; j++) {
                    ringAt(g, t, ms + j * 60, 500, 40 + i * 14 + j * 8, RAINBOW8[(i + j) % 7], 1);
                }
            });
            if (t >= vd - 80 && t < vd + 2000) {
                // rainbow blocks, cleared in random order
                if (!blocks) {
                    blocks = [];
                    const S = 12;
                    for (let y = 0; y < H; y += S) {
                        for (let x = 0; x < W; x += S) {
                            blocks.push({ x, y, S, o: Math.random(), c: RAINBOW8[((x + y) / S | 0) % 7] });
                        }
                    }
                }
                const f = fxK(t, vd + 100, vd + 1800);
                blocks.forEach(b => {
                    if (b.o >= f) {
                        const cyc = calmFx ? 0 : Math.floor(t / 220);
                        g.fillStyle = f === 0 ? '#fff' : RAINBOW8[(RAINBOW8.indexOf(b.c) + cyc) % 7];
                        g.globalAlpha = f === 0 ? fxFlash(1) : calmFx ? 0.35 : 1;
                        g.fillRect(b.x, b.y, b.S, b.S);
                        g.globalAlpha = 1;
                    }
                });
            }
            at(t, vd + 900, 'b', () => {
                bits.burst(cx, cy, 120, RAINBOW8, 300, { life: 2.4, size: 2, grav: 40 });
                bits.burst(cx, cy, 30, ['#fff', '#fbf236'], 150, { twinkle: 1, size: 3, life: 2.6, drag: 1.4 });
            });
            if (t > vd + 1200) {
                marching(g, t, RAINBOW8[Math.floor(t / 120) % 7], 16);
            }
        };
        k.dof(0, vd, 3, 0.35);
        retroShake(k, k.game, vd, 1600, 18);
    } else if (tier === 10) {
        // supernova
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, vd + 7000, 600, 1500) * 0.85, W, H, '#05041a');
            let pulse = 0;
            hb.forEach(ms => {
                pulse = Math.max(pulse, fxEnv(t, ms, ms + 260, 30, 200));
            });
            if (t < vd) {
                const grow = fxK(t, 0, vd - 300);
                const shrink = fxK(t, vd - 300, vd);
                const r = (6 + grow * 22 + pulse * 6) * (1 - shrink * 0.9);
                pxDisc(g, cx, cy, r + 3, ditherFill(g, pal[1], 8));
                pxDisc(g, cx, cy, r, pal[0]);
                pxDisc(g, cx, cy, r * 0.5, '#fff');
                pxCircle(g, cx, cy, r + 6 + pulse * 4, pal[1], 1);
            }
            palFlash(g, fxEnv(t, vd - 40, vd + 500, 20, 450), W, H, '#fff');
            [0, 140, 280, 420, 560].forEach((ms, i) => ringAt(g, t, vd + ms, 1800 + i * 200, 260 + i * 40, [pal[0], '#fff', pal[1], pal[3], pal[0]][i], 3 - Math.min(2, i)));
            at(t, vd, 'b', () => {
                bits.burst(cx, cy, 160, pal, 340, { life: 2.6, size: 2, drag: 1 });
                bits.burst(cx, cy, 40, pal, 120, { twinkle: 1, size: 3, life: 3, drag: 1.2 });
            });
            at(t, vd + 600, 'c', () => bits.burst(cx, cy, 60, [pal[1], pal[3]], 90, { life: 3.4, size: 1, drag: 0.6 }));
            if (t > vd) {
                marching(g, t, pal[(Math.floor(t / 100) % 2) ? 0 : 3], 14);
            }
        };
        k.rumble(k.game, 0, vd, 5);
        retroShake(k, k.game, vd, 1800, 22);
        k.shockPage(vd + 40, 110, 0, 2.8);
    } else if (tier === 11) {
        const motes = Array.from({ length: 220 }, () => ({ a: Math.random() * 6.2832, r: 0.3 + Math.random() * 0.7, c: pal[Math.random() * 4 | 0] }));
        draw = (g, t, W, H) => {
            const M = Math.hypot(W, H) * 0.55;
            if (t < vd + 80) {
                ditherVeil(g, fxK(t, 0, vd * 0.8) * 1.05, W, H, '#000');
                const f = fxK(t, 0, vd);
                motes.forEach(m => {
                    m.a += 0.03 + 0.05 / m.r;
                    m.r = Math.max(0.02, m.r - 0.0015 - f * 0.004);
                    const r = m.r * M;
                    g.fillStyle = m.c;
                    g.fillRect(Math.round(cx + Math.cos(m.a) * r), Math.round(cy + Math.sin(m.a) * r * 0.75), 1, 1);
                });
                const R = 10 + f * 14;
                const rot = fxStep(t / 1000, 8);
                for (let i = 0; i < 48; i++) {
                    const a = i / 48 * 6.2832 + rot;
                    const rr = R * (1.6 + (i % 3) * 0.25);
                    g.fillStyle = i % 4 ? pal[0] : pal[2];
                    g.fillRect(Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr * 0.4), 2, 1);
                }
                pxDisc(g, cx, cy, R, '#000');
                pxCircle(g, cx, cy, R, pal[1], 1);
                hb.forEach((ms, i) => {
                    const ff = fxK(t, ms, ms + 500);
                    if (ff > 0 && ff < 1) {
                        pxCircle(g, cx, cy, R + (1 - fxStep(ff, 6)) * 60, pal[i % 2 ? 1 : 2], 1);
                    }
                });
            } else {
                palFlash(g, fxEnv(t, vd, vd + 900, 30, 800), W, H, '#fff');
                ditherVeil(g, fxEnv(t, vd + 300, vd + 8000, 400, 1500) * 0.7, W, H, '#05041a');
            }
            at(t, vd + 40, 'b', () => {
                bits.burst(cx, cy, 200, RAINBOW8, 380, { life: 2.8, size: 2, drag: 1 });
                bits.burst(cx, cy, 50, ['#fff', pal[2]], 160, { twinkle: 1, size: 3, life: 3, drag: 1.2 });
            });
            [0, 160, 320, 480, 640].forEach((ms, i) => ringAt(g, t, vd + ms, 2000 + i * 200, 280 + i * 40, ['#fff', pal[0], pal[2], pal[1], '#fff'][i], 3 - Math.min(2, i)));
            if (t > vd + 200) {
                marching(g, t, RAINBOW8[Math.floor(t / 90) % 7], 12);
            }
        };
        k.dof(0, vd, 5, 0.25);
        k.rumble(k.game, 0, vd, 6);
        retroShake(k, k.game, vd, 1900, 24);
    } else {
        const rockets = Array.from({ length: 12 }, (_, i) => ({ x: 0.06 + i * 0.08 + Math.random() * 0.03, at: vd + 1400 + i * 260 + Math.random() * 150, top: 0.12 + Math.random() * 0.35, col: RAINBOW8[i % 7] }));
        const crt = vd + 7600;
        draw = (g, t, W, H) => {
            if (t < vd) {
                g.fillStyle = '#000';
                g.globalAlpha = fxK(t, 0, 1400);
                g.fillRect(0, 0, W, H);
                g.globalAlpha = 1;
                hb.forEach((ms, i) => {
                    const a = fxEnv(t, ms, ms + 400, 20, 300);
                    if (a > 0) {
                        const s = 1 + Math.floor(i / 2);
                        g.fillStyle = i % 2 ? pal[1] : '#fff';
                        g.fillRect(cx - (s >> 1), cy - (s >> 1), s, s);
                        pxCircle(g, cx, cy, 3 + i * 2 + (1 - a) * 6, pal[i % pal.length], 1);
                    }
                });
            } else if (t < vd + 2000) {
                // blast
                const f = fxK(t, vd, vd + 1600);
                const R = fxStep(Math.pow(f, 0.6), 16) * Math.hypot(W, H) * 0.6;
                g.fillStyle = '#000';
                g.globalAlpha = 1 - f;
                g.fillRect(0, 0, W, H);
                g.globalAlpha = calmFx ? 0.35 : 1 - f * 0.7;
                for (let i = 0; i < 7; i++) {
                    const r = R - i * 6;
                    if (r > 1) {
                        pxDisc(g, cx, cy, r, RAINBOW8[(i + (calmFx ? 0 : Math.floor(t / 140))) % 7]);
                    }
                }
                pxDisc(g, cx, cy, Math.max(1, R - 48), '#fff');
                g.globalAlpha = 1;
            } else {
                ditherVeil(g, fxEnv(t, vd + 2000, crt, 300, 600) * 0.7, W, H, '#0b0820');
            }
            rockets.forEach((r, i) => {
                const x = Math.round(r.x * W);
                const y1 = Math.round(r.top * H);
                const f = fxK(t, r.at, r.at + 480);
                if (f > 0 && f < 1) {
                    const y = H + (y1 - H) * (1 - Math.pow(1 - f, 2));
                    g.fillStyle = '#fff';
                    g.fillRect(x, Math.round(y), 1, 3);
                }
                at(t, r.at + 480, 'r' + i, () => bits.burst(x, y1, 32, [r.col, '#fff'], 80, { ring: 1, life: 1.8, size: 1, grav: 30, drag: 1.1 }));
            });
            at(t, vd + 200, 'b', () => {
                bits.burst(cx, cy, 240, RAINBOW8, 420, { life: 3, size: 2, drag: 0.9 });
                bits.burst(cx, cy, 60, ['#fff', '#ffec27'], 200, { twinkle: 1, size: 3, life: 3.4, drag: 1.1 });
            });
            if (t > vd + 1500 && t < crt) {
                marching(g, t, RAINBOW8[Math.floor(t / 90) % 7], 12);
            }
            // crt switching on
            if (t >= crt) {
                const f = fxK(t, crt, crt + 900);
                const hh = Math.round(fxStep(Math.pow(f, 0.7), 12) * H / 2);
                g.fillStyle = '#000';
                g.globalAlpha = calmFx ? 0.5 * (1 - f) : 1 - fxK(t, crt + 700, crt + 1300);
                g.fillRect(0, 0, W, Math.max(0, H / 2 - hh - 1));
                g.fillRect(0, H / 2 + hh + 1, W, H);
                g.globalAlpha = fxFlash(1 - f);
                g.fillStyle = '#fff';
                g.fillRect(0, Math.round(H / 2 - hh - 1), W, 1);
                g.fillRect(0, Math.round(H / 2 + hh), W, 1);
                g.globalAlpha = 1;
            }
        };
        retroShake(k, k.game, vd + 100, 2200, 26);
        k.shockPage(vd + 120, 120, 0, 3);
    }
    fxScene(k, total, (g, t, W, H) => {
        const dt = Math.min(0.05, (t - last) / 1000);
        last = t;
        draw(g, t, W, H, dt);
        bits.draw(g, dt);
    }, { px: PX, scan });
}
const FX_SKINS = { retro: retroFx };
