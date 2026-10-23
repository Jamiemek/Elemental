// retro + astral spawn effects

// canvas over the page. o.px draws at low res for retro
function fxScene(k, dur, draw, o) {
    o = o || {};
    const cv = document.createElement('canvas');
    cv.className = 'fx fx-canvas';
    k.ov.appendChild(cv);
    const W = innerWidth;
    const H = innerHeight;
    const px = o.px || 0;
    let g;
    let out;
    let buf;
    let lines;
    if (px) {
        buf = document.createElement('canvas');
        buf.width = Math.ceil(W / px);
        buf.height = Math.ceil(H / px);
        g = buf.getContext('2d');
        cv.width = W;
        cv.height = H;
        out = cv.getContext('2d');
        out.imageSmoothingEnabled = false;
        if (o.scan) {
            // scanlines
            const s = document.createElement('canvas');
            s.width = 1;
            s.height = px;
            const x = s.getContext('2d');
            x.fillStyle = 'rgba(0,0,0,.28)';
            x.fillRect(0, px - 1, 1, 1);
            lines = out.createPattern(s, 'repeat');
        }
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
            if (lines) {
                out.fillStyle = lines;
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

// astral
const ASTRAL_GOLD = '#ffd98a';
// random constellation around x, y
function astralFigure(x, y, R, n, seed) {
    seed = seed || (Math.random() * 1e9 | 0) + 1;
    const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pts = [];
    let a = r() * 6.28;
    let px = x + Math.cos(a) * R * 0.6;
    let py = y + Math.sin(a) * R * 0.6;
    for (let i = 0; i < n; i++) {
        pts.push({ x: px, y: py, s: 0.6 + r() * 0.9 });
        a += (r() - 0.5) * 2.2;
        const d = R * (0.35 + r() * 0.35);
        px = Math.max(x - R, Math.min(x + R, px + Math.cos(a) * d));
        py = Math.max(y - R, Math.min(y + R, py + Math.sin(a) * d));
    }
    const edges = pts.slice(1).map((_, i) => [i, i + 1]);
    if (n > 4) {
        edges.push([1 + (r() * (n - 3) | 0), n - 1]);
    }
    return { pts, edges };
}
// f = how far it's drawn in
function astralDraw(g, C, f, a, col) {
    if (f <= 0 || a <= 0) {
        return;
    }
    const n = C.pts.length;
    g.lineWidth = 1;
    g.strokeStyle = col || ASTRAL_GOLD;
    C.edges.forEach(([i, j], e) => {
        const k = Math.max(0, Math.min(1, f * (C.edges.length + 1) - e));
        if (k <= 0) {
            return;
        }
        const A = C.pts[i];
        const B = C.pts[j];
        g.globalAlpha = a * 0.55;
        g.beginPath();
        g.moveTo(A.x, A.y);
        g.lineTo(A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k);
        g.stroke();
    });
    C.pts.forEach((p, i) => {
        const k = Math.max(0, Math.min(1, f * (n + 1) - i));
        if (k > 0) {
            astralStar(g, p.x, p.y, 2.2 * p.s * (0.6 + 0.4 * k), '#fff', a * k, i % 3 === 0);
        }
    });
    g.globalAlpha = 1;
}
function astralStar(g, x, y, r, col, a, spike) {
    if (a <= 0) {
        return;
    }
    const d = r * 7;
    g.globalAlpha = Math.min(1, a);
    g.drawImage(fxSprite(col), x - d / 2, y - d / 2, d, d);
    if (spike) {
        g.strokeStyle = col;
        g.lineWidth = 0.8;
        g.globalAlpha = Math.min(1, a) * 0.6;
        g.beginPath();
        g.moveTo(x - r * 5, y);
        g.lineTo(x + r * 5, y);
        g.moveTo(x, y - r * 5);
        g.lineTo(x, y + r * 5);
        g.stroke();
    }
    g.globalAlpha = 1;
}
function astralComet(g, x, y, ang, len, col, a, w) {
    const tx = x - Math.cos(ang) * len;
    const ty = y - Math.sin(ang) * len;
    const gr = g.createLinearGradient(x, y, tx, ty);
    gr.addColorStop(0, col);
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.globalAlpha = a;
    g.strokeStyle = gr;
    g.lineWidth = w || 2;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(tx, ty);
    g.stroke();
    astralStar(g, x, y, (w || 2) * 1.2, col, a);
}
function astralNight(g, cx, cy, W, H, a, inner) {
    if (a <= 0) {
        return;
    }
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(W, H) * 0.7);
    const i0 = inner == null ? 1 : inner;
    gr.addColorStop(0, 'rgba(6,10,34,' + (0.35 + 0.3 * i0) + ')');
    gr.addColorStop(0.3, 'rgba(5,8,30,.9)');
    gr.addColorStop(1, 'rgba(2,3,14,.97)');
    g.globalAlpha = Math.min(1, a);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
    g.globalAlpha = 1;
}
function astralGlow(g, x, y, r, col, a) {
    if (a <= 0 || r <= 0) {
        return;
    }
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, col);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = Math.min(1, a);
    g.globalCompositeOperation = 'lighter';
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
}
function astralFx(tier, k) {
    const { T, vd, total, cx, cy } = k;
    const c = T.c;
    const c2 = T.c2;
    const hb = T.hb || [];
    const W0 = innerWidth;
    const H0 = innerHeight;
    const M = Math.hypot(W0, H0);
    // background stars
    const field = Array.from({ length: 70 + tier * 20 }, () => ({ x: Math.random() * W0, y: Math.random() * H0, s: 0.4 + Math.random() * 1.2, tw: Math.random() * 6.28, c: Math.random() < 0.15 ? c : Math.random() < 0.2 ? ASTRAL_GOLD : '#fff' }));
    const sky = (g, t, a) => field.forEach(s => astralStar(g, s.x, s.y, s.s, s.c, a * (0.55 + 0.45 * Math.sin(s.tw + t / 400))));
    const halo = (g, t, at, dur, r1, col, w) => {
        const f = fxK(t, at, at + dur);
        if (f <= 0 || f >= 1) {
            return;
        }
        g.globalAlpha = (1 - f) * 0.8;
        g.strokeStyle = col;
        g.lineWidth = (w || 1.5) * (1 - f * 0.6);
        g.beginPath();
        g.arc(cx, cy, 8 + Math.pow(f, 0.6) * r1, 0, 6.2832);
        g.stroke();
        g.globalAlpha = 1;
    };
    let draw;
    if (tier === 1) {
        const C = astralFigure(cx + 120, cy - 30, 70, 5);
        draw = (g, t, W, H) => {
            astralNight(g, cx, cy, W, H, fxEnv(t, 0, 1700, 300, 600) * 0.55);
            astralDraw(g, C, fxK(t, 0, 900), fxEnv(t, 0, 1700, 100, 500));
            halo(g, t, 0, 1200, 160, ASTRAL_GOLD, 1);
        };
        k.sweep(0, 1100, c);
    } else if (tier === 2) {
        // two constellations and a shooting star
        const C1 = astralFigure(cx - 160, cy - 20, 80, 6);
        const C2 = astralFigure(cx + 160, cy + 10, 80, 5);
        draw = (g, t, W) => {
            const a = fxEnv(t, 0, 2200, 100, 600);
            astralNight(g, cx, cy, W, innerHeight, fxEnv(t, 0, 2200, 300, 700) * 0.7);
            astralDraw(g, C1, fxK(t, 0, 1100), a);
            astralDraw(g, C2, fxK(t, 250, 1300), a);
            const f = fxK(t, 200, 900);
            if (f > 0 && f < 1) {
                astralComet(g, -40 + f * (W + 80), cy - 220 + f * 120, 0.12, 140, '#fff', 1 - f * 0.5, 2);
            }
            halo(g, t, 100, 1400, 220, c, 1.2);
        };
        k.reelGlow(0, 1500, c, 1.03);
    } else if (tier === 3) {
        // ring of constellations
        const figs = Array.from({ length: 6 }, (_, i) => astralFigure(cx + Math.cos(i * 1.047) * 230, cy + Math.sin(i * 1.047) * 160, 70, 5));
        draw = (g, t, W, H) => {
            const a = fxEnv(t, 0, 2900, 400, 800);
            astralNight(g, cx, cy, W, H, a * 0.85);
            sky(g, t, a);
            figs.forEach((C, i) => astralDraw(g, C, fxK(t, 200 + i * 140, 1100 + i * 140), a));
            halo(g, t, 150, 1600, 260, ASTRAL_GOLD, 1.5);
        };
        k.dof(0, 2700, 3, 0.5);
        k.particles([{ type: 'burst', at: 150, n: 60, cols: ['#fff', ASTRAL_GOLD, c], speed: 300, life: 1.8, size: 1.6, drag: 1.4 }]);
    } else if (tier === 4) {
        // orbiting planet
        draw = (g, t, W, H) => {
            const a = fxEnv(t, 0, 3400, 300, 800);
            astralNight(g, cx, cy, W, H, a * 0.85);
            sky(g, t, a);
            const rx = Math.min(W * 0.42, 420);
            const ry = rx * 0.32;
            g.globalAlpha = a * 0.45;
            g.strokeStyle = ASTRAL_GOLD;
            g.lineWidth = 1;
            g.beginPath();
            g.ellipse(cx, cy, rx, ry, -0.18, 0, 6.2832);
            g.stroke();
            const ang = -1.2 + fxK(t, 0, 3200) * 6.28 * 1.15;
            const px = cx + Math.cos(ang) * rx * Math.cos(-0.18) - Math.sin(ang) * ry * Math.sin(-0.18);
            const py = cy + Math.cos(ang) * rx * Math.sin(-0.18) + Math.sin(ang) * ry * Math.cos(-0.18);
            const pr = 12 + 4 * Math.sin(ang);
            const front = Math.sin(ang) > 0;
            if (front || fxK(t, 0, 3200) < 1) {
                const gr = g.createRadialGradient(px - pr * 0.4, py - pr * 0.4, 1, px, py, pr);
                gr.addColorStop(0, '#fff');
                gr.addColorStop(0.3, c);
                gr.addColorStop(1, c2);
                g.globalAlpha = a;
                g.fillStyle = gr;
                g.beginPath();
                g.arc(px, py, pr, 0, 6.2832);
                g.fill();
                astralGlow(g, px, py, pr * 3, c, a * 0.5);
            }
            halo(g, t, 0, 1500, 300, '#fff', 2);
            halo(g, t, 200, 1800, 360, c, 1.2);
        };
        k.shockPage(40, 30, 1, 1.4);
        k.particles([{ type: 'burst', at: 0, n: 110, cols: ['#fff', ASTRAL_GOLD, c, c2], speed: 520, life: 2, size: 1.8, trail: 1 }]);
    } else if (tier === 5) {
        // meteor shower
        const meteors = Array.from({ length: 34 }, (_, i) => ({ at: 150 + i * 105 + Math.random() * 80, x: Math.random() * 1.3 - 0.1, y: -0.1 - Math.random() * 0.2, sp: 0.9 + Math.random() * 0.8, len: 80 + Math.random() * 160, col: i % 4 ? '#fff' : i % 8 ? ASTRAL_GOLD : c }));
        draw = (g, t, W, H) => {
            const a = fxEnv(t, 0, 4200, 400, 900);
            astralNight(g, cx, cy, W, H, a * 0.9);
            sky(g, t, a);
            meteors.forEach(m => {
                const f = fxK(t, m.at, m.at + 900 / m.sp);
                if (f > 0 && f < 1) {
                    const x = (m.x - f * 0.5) * W;
                    const y = (m.y + f * 0.9) * H;
                    astralComet(g, x, y, 2.07, m.len, m.col, a * Math.sin(Math.PI * f), 1.6);
                }
            });
            halo(g, t, 0, 1800, 320, ASTRAL_GOLD, 2);
        };
        k.P(k.app, [{ transform: 'none' }, { transform: 'perspective(1100px) rotateX(8deg) scale(.95)', offset: 0.28 }, { transform: 'perspective(1100px) rotateX(6deg) scale(.955)', offset: 0.6 }, { transform: 'none' }], { duration: 4000, easing: 'cubic-bezier(.3,.1,.2,1)' });
        if (k.app) {
            k.app.style.transformOrigin = '50% ' + (cy - k.app.getBoundingClientRect().top) + 'px';
        }
        k.bars(0, 4200, 7);
        k.particles([{ type: 'burst', at: 0, n: 120, cols: ['#fff', ASTRAL_GOLD, c], speed: 520, life: 2, size: 2, trail: 1, grav: 30 }]);
    } else if (tier === 6) {
        // solar flare
        const loops = Array.from({ length: 7 }, (_, i) => ({ a: i * 0.9 + Math.random() * 0.5, h: 0.6 + Math.random() * 0.8, at: 100 + i * 220 }));
        draw = (g, t, W, H) => {
            const a = fxEnv(t, 0, 5000, 200, 1200);
            astralNight(g, cx, cy, W, H, a * 0.9, 0.6);
            sky(g, t, a * 0.7);
            const R = Math.min(W, H) * 0.09;
            const sun = a * (1 - fxK(t, 1600, 2600) * 0.85);
            astralGlow(g, cx, cy, R * 6, c2, a * 0.6);
            astralGlow(g, cx, cy, R * 3, c, sun * 0.9);
            // corona
            g.save();
            g.translate(cx, cy);
            g.rotate(t / 4000);
            g.globalCompositeOperation = 'lighter';
            for (let i = 0; i < 24; i++) {
                const L = R * (2.2 + Math.sin(i * 2.7 + t / 500) * 0.6);
                g.globalAlpha = a * 0.25;
                g.strokeStyle = i % 2 ? c : '#ffe6b0';
                g.lineWidth = 2;
                g.beginPath();
                g.moveTo(Math.cos(i * 0.2618) * R, Math.sin(i * 0.2618) * R);
                g.lineTo(Math.cos(i * 0.2618 + 0.05) * L, Math.sin(i * 0.2618 + 0.05) * L);
                g.stroke();
            }
            g.restore();
            loops.forEach(l => {
                const f = fxK(t, l.at, l.at + 1600);
                if (f <= 0 || f >= 1) {
                    return;
                }
                const a0 = l.a;
                const a1 = l.a + 0.5;
                const x0 = cx + Math.cos(a0) * R;
                const y0 = cy + Math.sin(a0) * R;
                const x1 = cx + Math.cos(a1) * R;
                const y1 = cy + Math.sin(a1) * R;
                const am = (a0 + a1) / 2;
                const hx = cx + Math.cos(am) * R * (1 + l.h * 2.4 * Math.sin(Math.PI * Math.min(1, f * 1.4)));
                const hy = cy + Math.sin(am) * R * (1 + l.h * 2.4 * Math.sin(Math.PI * Math.min(1, f * 1.4)));
                g.globalAlpha = a * (1 - f) * 0.9;
                g.strokeStyle = '#ffb35a';
                g.lineWidth = 3;
                g.globalCompositeOperation = 'lighter';
                g.beginPath();
                g.moveTo(x0, y0);
                g.quadraticCurveTo(hx, hy, x1, y1);
                g.stroke();
                g.globalCompositeOperation = 'source-over';
            });
            g.globalAlpha = sun;
            const gr = g.createRadialGradient(cx, cy, 0, cx, cy, R);
            gr.addColorStop(0, '#fff');
            gr.addColorStop(0.6, '#ffe6b0');
            gr.addColorStop(1, c);
            g.fillStyle = gr;
            g.beginPath();
            g.arc(cx, cy, R, 0, 6.2832);
            g.fill();
            g.globalAlpha = 1;
            halo(g, t, 0, 1600, 360, '#fff', 3);
            halo(g, t, 120, 2000, 420, c, 2);
        };
        k.flash(0, 1100, '#fff', 0.7, 60);
        k.shake(k.game, 0, 1200, 14, 0.5);
        k.shockPage(30, 44, 2, 1.8);
        k.particles([
            { type: 'burst', at: 0, n: 180, cols: [c, c2, '#fff', '#ffe6b0'], speed: 720, life: 2.2, size: 2.2, trail: 1, grav: 60, drag: 1.8 },
            { type: 'embers', at: 200, until: 4400, rate: 40, cols: [c, '#ffe6b0'], life: 2.4, size: 2, wide: 1 }
        ]);
    } else if (tier === 7) {
        // comets
        draw = (g, t, W, H) => {
            const a = fxEnv(t, -600, 5800, 1, 1200);
            astralNight(g, cx, cy, W, H, Math.max(a, 0) * 0.92, 0.5);
            sky(g, t, a);
            [[0, -1], [340, 1]].forEach(([ms, side], i) => {
                const f = ms ? fxK(t, 0, ms) : 0;
                if (f > 0 && f < 1) {
                    const sx = side < 0 ? -60 : W + 60;
                    const sy = i ? H * 0.15 : H * 0.85;
                    const x = sx + (cx - sx) * Math.pow(f, 1.5);
                    const y = sy + (cy - sy) * Math.pow(f, 1.5);
                    astralComet(g, x, y, Math.atan2(cy - sy, cx - sx), 260, i ? c : '#bfe6ff', 1, 3);
                }
                halo(g, t, ms, 1300, 380, i ? c : '#fff', 3);
                halo(g, t, ms + 120, 1700, 460, i ? c2 : '#bfe6ff', 1.5);
            });
            const C = draw.C || (draw.C = astralFigure(cx, cy, Math.min(W, H) * 0.4, 9));
            astralDraw(g, C, fxK(t, 900, 2600), fxEnv(t, 900, 5600, 300, 1200));
        };
        k.flash(0, 900, '#fff', 0.6, 50);
        k.flash(340, 1600, c, 0.6, 70);
        k.shake(k.game, 0, 380, 12, 0.5);
        k.shake(k.game, 340, 1400, 20, 0.8);
        k.shockPage(360, 52, 2.5, 2);
        k.particles([
            { type: 'burst', at: 0, n: 90, cols: ['#fff', '#bfe6ff'], speed: 520, life: 1.6, size: 2, trail: 1 },
            { type: 'burst', at: 340, n: 200, cols: [c, c2, '#fff', ASTRAL_GOLD], speed: 820, life: 2.4, size: 2.3, trail: 1, drag: 1.6 },
            { type: 'stars', at: 600, n: 80, cols: ['#fff', ASTRAL_GOLD], life: 4.6, size: 1.4, pull: -20, rot: 0.05 }
        ]);
    } else if (tier === 8) {
        // eclipse, one step per beat
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 600)) * (t > vd ? fxEnv(t, vd, vd + 5800, 1, 1500) : 1);
            astralNight(g, cx, cy, W, H, a * 0.95, 0.4);
            sky(g, t, a * fxK(t, vd - 1200, vd + 200));
            const R = Math.min(W, H) * 0.1;
            let n = 0;
            hb.forEach(ms => {
                if (t >= ms) {
                    n++;
                }
            });
            const cover = t < vd ? n / (hb.length + 1) : 1;
            const off = (1 - cover) * R * 2.1;
            astralGlow(g, cx, cy, R * (t > vd ? 5 : 2.2), t > vd ? '#cfe0ff' : '#ffe6b0', a * (t > vd ? 0.8 * (1 - fxK(t, vd + 1200, vd + 2400) * 0.75) : 0.9));
            if (t > vd) {
                // corona
                g.save();
                g.translate(cx, cy);
                g.globalCompositeOperation = 'lighter';
                for (let i = 0; i < 40; i++) {
                    const L = R * (1.8 + ((i * 37) % 11) / 8);
                    g.globalAlpha = a * 0.22;
                    g.strokeStyle = '#e8f0ff';
                    g.lineWidth = 1.5;
                    g.beginPath();
                    g.moveTo(Math.cos(i * 0.157) * R, Math.sin(i * 0.157) * R);
                    g.lineTo(Math.cos(i * 0.157) * L, Math.sin(i * 0.157) * L);
                    g.stroke();
                }
                g.restore();
            }
            // fade them out so the result shows
            g.globalAlpha = a * (1 - fxK(t, vd + 1200, vd + 2200));
            g.fillStyle = '#fff4d6';
            g.beginPath();
            g.arc(cx, cy, R, 0, 6.2832);
            g.fill();
            g.fillStyle = '#05060f';
            g.beginPath();
            g.arc(cx + off, cy - off * 0.25, R * 1.02, 0, 6.2832);
            g.fill();
            g.globalAlpha = 1;
            // diamond ring
            const dr = fxEnv(t, vd - 120, vd + 700, 80, 500);
            if (dr > 0) {
                astralStar(g, cx - R * 0.72, cy - R * 0.7, 6, '#fff', dr, true);
                astralGlow(g, cx - R * 0.72, cy - R * 0.7, R * 2.5, '#ffffff', dr * 0.8);
            }
            hb.forEach(ms => halo(g, t, ms, 600, R * 2, '#ffe6b0', 1));
            halo(g, t, vd, 1600, 380, '#fff', 3);
            halo(g, t, vd + 200, 2000, 440, c, 1.5);
        };
        k.dof(0, vd + 400, 3, 0.4);
        k.particles([
            { type: 'burst', at: vd, n: 160, cols: ['#fff', '#cfe0ff', c], speed: 640, life: 2.4, size: 2, trail: 1 },
            { type: 'stars', at: vd + 300, n: 90, cols: ['#fff', ASTRAL_GOLD], life: 5, size: 1.4, pull: -24, rot: 0.06 }
        ], total);
    } else if (tier === 9) {
        // star trails + zodiac wheel, then dawn
        const trails = Array.from({ length: 160 }, () => ({ r: 30 + Math.random() * M * 0.6, a: Math.random() * 6.28, s: 0.5 + Math.random(), c: Math.random() < 0.2 ? ASTRAL_GOLD : Math.random() < 0.2 ? c2 : '#fff' }));
        const zod = Array.from({ length: 12 }, (_, i) => astralFigure(0, 0, 26, 4, 1000 + i * 77));
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 700)) * (t > vd ? fxEnv(t, vd, vd + 7600, 1, 1800) : 1);
            astralNight(g, cx, cy, W, H, a * 0.95, 0.4);
            const span = Math.min(1.6, fxK(t, 200, vd) * 1.6) * (t > vd ? 1 - fxK(t, vd, vd + 1600) : 1);
            g.lineCap = 'round';
            trails.forEach(s => {
                const a0 = s.a + t / 3000;
                g.globalAlpha = a * 0.5;
                g.strokeStyle = s.c;
                g.lineWidth = s.s;
                g.beginPath();
                g.arc(cx, cy, s.r, a0, a0 + Math.max(0.01, span * s.s * 0.6));
                g.stroke();
            });
            g.globalAlpha = 1;
            const zr = Math.min(W, H) * 0.32;
            const za = fxEnv(t, 300, vd + 6000, 800, 1500) * a;
            if (za > 0) {
                const rot = -0.8 + fxK(t, 300, vd) * 0.8;
                g.globalAlpha = za * 0.5;
                g.strokeStyle = ASTRAL_GOLD;
                g.lineWidth = 1;
                [zr * 0.78, zr * 1.22].forEach(r => {
                    g.beginPath();
                    g.arc(cx, cy, r, 0, 6.2832);
                    g.stroke();
                });
                for (let i = 0; i < 12; i++) {
                    const an = rot + i * 0.5236;
                    g.globalAlpha = za * 0.5;
                    g.beginPath();
                    g.moveTo(cx + Math.cos(an) * zr * 0.78, cy + Math.sin(an) * zr * 0.78);
                    g.lineTo(cx + Math.cos(an) * zr * 1.22, cy + Math.sin(an) * zr * 1.22);
                    g.stroke();
                    const zc = zod[i];
                    const mx = cx + Math.cos(an + 0.26) * zr;
                    const my = cy + Math.sin(an + 0.26) * zr;
                    const moved = { pts: zc.pts.map(p => ({ x: mx + p.x, y: my + p.y, s: p.s * 0.7 })), edges: zc.edges };
                    let lit = 0;
                    hb.forEach(ms => {
                        if (t >= ms) {
                            lit++;
                        }
                    });
                    const on = t > vd || i < lit * 12 / hb.length;
                    astralDraw(g, moved, on ? 1 : 0.25, za * (on ? 1 : 0.5));
                }
            }
            // dawn
            const dawn = fxEnv(t, vd - 100, vd + 3000, 150, 2400);
            if (dawn > 0) {
                const gr = g.createLinearGradient(0, H, 0, 0);
                gr.addColorStop(0, 'rgba(255,190,120,' + fxFlash(dawn) * 0.8 + ')');
                gr.addColorStop(0.5, 'rgba(255,140,170,' + fxFlash(dawn) * 0.35 + ')');
                gr.addColorStop(1, 'rgba(255,140,170,0)');
                g.fillStyle = gr;
                g.fillRect(0, 0, W, H);
            }
            hb.forEach(ms => halo(g, t, ms, 700, 120, ASTRAL_GOLD, 1));
            halo(g, t, vd, 1800, 420, '#fff', 3);
        };
        k.dof(0, vd, 3, 0.35);
        k.flash(vd - 60, 1600, '#fff', 0.8, 90);
        k.shockPage(vd + 40, 60, 2, 2);
        k.particles([
            { type: 'galaxy', at: vd, n: 220, cols: ['#fff', ASTRAL_GOLD, c, c2], speed: 1000, life: 3, size: 2.2, trail: 1, drag: 1.2, spin: 0.8 },
            { type: 'embers', at: vd + 500, until: vd + 7000, rate: 24, cols: ['#fff', ASTRAL_GOLD], life: 3, size: 1.6, wide: 1 }
        ], total);
    } else if (tier === 10) {
        // nebula, then a pulsar
        const clouds = Array.from({ length: 9 }, (_, i) => ({ x: (Math.random() - 0.5) * 0.7, y: (Math.random() - 0.5) * 0.5, r: 0.18 + Math.random() * 0.2, c: [c, c2, '#ff7ad9', '#5a7bff'][i % 4], d: Math.random() * 6.28 }));
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 800)) * (t > vd ? fxEnv(t, vd, vd + 8000, 1, 2000) : 1);
            astralNight(g, cx, cy, W, H, a * 0.95, 0.3);
            sky(g, t, a);
            clouds.forEach(cl => {
                const grow = 0.4 + fxK(t, 0, vd) * 0.6 + (t > vd ? fxK(t, vd, vd + 3000) * 0.5 : 0);
                const x = cx + cl.x * W + Math.cos(cl.d + t / 3000) * 20;
                const y = cy + cl.y * H + Math.sin(cl.d + t / 3000) * 14;
                astralGlow(g, x, y, cl.r * Math.min(W, H) * grow * 1.6, cl.c, a * 0.32 * (1 - fxK(t, vd + 800, vd + 2600) * 0.6));
            });
            let pulse = 0;
            hb.forEach(ms => {
                pulse = Math.max(pulse, fxEnv(t, ms, ms + 400, 40, 340));
            });
            if (t < vd) {
                astralGlow(g, cx, cy, 30 + pulse * 40 + fxK(t, 0, vd) * 30, '#fff', a * (0.4 + pulse * 0.6));
                hb.forEach(ms => halo(g, t, ms, 800, 140, c, 1));
            } else {
                const ang = (t - vd) / 900;
                const bl = fxEnv(t, vd, vd + 7000, 200, 1600) * a;
                g.save();
                g.translate(cx, cy);
                g.globalCompositeOperation = 'lighter';
                [0, Math.PI].forEach(o => {
                    g.rotate(o);
                    const gr = g.createLinearGradient(0, 0, M * 0.6, 0);
                    gr.addColorStop(0, 'rgba(255,255,255,' + 0.5 * bl + ')');
                    gr.addColorStop(1, 'rgba(255,255,255,0)');
                    g.fillStyle = gr;
                    g.save();
                    g.rotate(ang);
                    g.beginPath();
                    g.moveTo(0, 0);
                    g.lineTo(M * 0.6, -24);
                    g.lineTo(M * 0.6, 24);
                    g.fill();
                    g.restore();
                });
                g.restore();
                const core = bl * (1 - fxK(t, vd + 1200, vd + 2400) * 0.7);
                astralGlow(g, cx, cy, 90, '#fff', core);
                astralStar(g, cx, cy, 6, '#fff', core, true);
            }
            [0, 150, 300].forEach((ms, i) => halo(g, t, vd + ms, 2000 + i * 300, 460 + i * 60, [ '#fff', c, c2][i], 3 - i));
        };
        k.rumble(k.game, 0, vd, 5);
        k.flash(vd - 60, 1800, '#fff', 0.9, 90);
        k.shake(k.game, vd, 1800, 20, 1);
        k.shockPage(vd + 40, 110, 5, 2.8);
        k.particles([
            { type: 'spiral', at: 400, until: vd, rate: 70, ramp: 1, cols: ['#fff', c, c2], life: 1.3, size: 1.8, dir: -1 },
            { type: 'galaxy', at: vd, n: 260, cols: [c, c2, '#fff', '#ff7ad9'], speed: 1200, life: 3.2, size: 2.4, trail: 1, drag: 1.2, spin: 0.6 },
            { type: 'embers', at: vd + 700, until: vd + 7000, rate: 26, cols: [c, c2, '#fff'], life: 2.8, size: 1.8, wide: 1 }
        ], total);
    } else if (tier === 11) {
        // galaxy, jets on the hit
        const stars = Array.from({ length: 700 }, (_, i) => {
            const arm = i % 3;
            const d = Math.pow(Math.random(), 0.7);
            return { arm, d, j: (Math.random() - 0.5) * 0.5, c: d < 0.2 ? '#fff4d6' : Math.random() < 0.3 ? c2 : Math.random() < 0.4 ? c : '#cfe0ff' };
        });
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 900)) * (t > vd ? fxEnv(t, vd, vd + 8600, 1, 2000) : 1);
            astralNight(g, cx, cy, W, H, a * 0.96, 0.3);
            sky(g, t, a * 0.6);
            const R = Math.min(W, H) * 0.55 * (0.35 + 0.65 * fxK(t, 0, vd));
            const spin = t / 1800 + fxK(t, 0, vd) * 2;
            g.globalCompositeOperation = 'lighter';
            stars.forEach(s => {
                const ang = s.arm * 2.094 + s.d * 4.2 + s.j - spin * (1.2 - s.d * 0.6);
                const r = s.d * R;
                const x = cx + Math.cos(ang) * r;
                const y = cy + Math.sin(ang) * r * 0.55;
                g.globalAlpha = a * (0.35 + (1 - s.d) * 0.5);
                g.fillStyle = s.c;
                g.fillRect(x, y, 1.6, 1.6);
            });
            g.globalCompositeOperation = 'source-over';
            let pulse = 0;
            hb.forEach(ms => {
                pulse = Math.max(pulse, fxEnv(t, ms, ms + 400, 40, 340));
            });
            astralGlow(g, cx, cy, 40 + pulse * 30 + (t > vd ? 120 * fxEnv(t, vd, vd + 2500, 60, 2000) : 0), '#fff4d6', a * (0.6 + pulse * 0.4));
            if (t > vd) {
                const j = fxEnv(t, vd, vd + 5500, 150, 1800) * a;
                [-1, 1].forEach(d => {
                    const gr = g.createLinearGradient(cx, cy, cx, cy + d * H * 0.7);
                    gr.addColorStop(0, 'rgba(255,255,255,' + 0.7 * j + ')');
                    gr.addColorStop(0.4, c + '88');
                    gr.addColorStop(1, 'rgba(0,0,0,0)');
                    g.fillStyle = gr;
                    g.globalCompositeOperation = 'lighter';
                    g.beginPath();
                    g.moveTo(cx - 6, cy);
                    g.lineTo(cx - 30, cy + d * H * 0.7);
                    g.lineTo(cx + 30, cy + d * H * 0.7);
                    g.lineTo(cx + 6, cy);
                    g.fill();
                    g.globalCompositeOperation = 'source-over';
                });
            }
            hb.forEach(ms => halo(g, t, ms, 700, 90, c, 1));
            [0, 160, 320].forEach((ms, i) => halo(g, t, vd + ms, 2200 + i * 300, 480 + i * 60, ['#fff', c, c2][i], 3 - i));
        };
        k.dof(0, vd, 4, 0.3);
        k.flash(vd - 40, 2000, '#fff', 0.9, 90);
        k.shake(k.game, vd, 1900, 22, 1);
        k.shockPage(vd + 40, 110, 5, 2.8);
        k.particles([
            { type: 'galaxy', at: vd, n: 300, cols: [c, c2, '#fff', '#cfe0ff'], speed: 1250, life: 3.4, size: 2.4, trail: 1, drag: 1.2, spin: -1.6 },
            { type: 'embers', at: vd + 800, until: vd + 7400, rate: 26, cols: [c, c2, '#fff'], life: 2.8, size: 1.8, wide: 1 }
        ], total);
    } else {
        // cosmic dawn
        const figs = Array.from({ length: Math.max(7, hb.length) }, (_, i) => {
            const an = i / Math.max(7, hb.length) * 6.28 + 0.3;
            const r = Math.min(W0, H0) * (0.3 + (i % 2) * 0.12);
            return astralFigure(cx + Math.cos(an) * r * 1.4, cy + Math.sin(an) * r, 90, 6);
        });
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 1400)) * (t > vd ? fxEnv(t, vd, vd + 10000, 1, 2400) : 1);
            astralNight(g, cx, cy, W, H, a, t < vd ? 1 : 0.3);
            if (t < vd) {
                sky(g, t, a * fxK(t, 600, 2000));
                // one per beat, then they all fall in
                const fall = fxK(t, vd - 1000, vd);
                figs.forEach((C, i) => {
                    const ms = hb[i] != null ? hb[i] : 1500 + i * 400;
                    const moved = fall > 0 ? { pts: C.pts.map(p => ({ x: p.x + (cx - p.x) * fall * fall, y: p.y + (cy - p.y) * fall * fall, s: p.s })), edges: C.edges } : C;
                    astralDraw(g, moved, fxK(t, ms, ms + 700), a * (1 - fall * 0.6));
                });
                astralGlow(g, cx, cy, 20 + fxK(t, vd - 1000, vd) * 80, '#fff', fxK(t, vd - 1000, vd));
            } else {
                sky(g, t, a);
                const h = fxEnv(t, vd + 300, vd + 9800, 800, 2400) * a;
                g.globalAlpha = h * 0.7;
                g.strokeStyle = ASTRAL_GOLD;
                g.lineWidth = 2;
                g.beginPath();
                g.arc(cx, cy, Math.min(W, H) * 0.28, 0, 6.2832);
                g.stroke();
                g.globalAlpha = 1;
                for (let i = 0; i < 24; i++) {
                    const an = i * 0.2618 + (t - vd) / 4000;
                    astralStar(g, cx + Math.cos(an) * Math.min(W, H) * 0.28, cy + Math.sin(an) * Math.min(W, H) * 0.28, 1.6, i % 3 ? '#fff' : ASTRAL_GOLD, h, i % 6 === 0);
                }
                figs.forEach((C, i) => astralDraw(g, C, 1, h * 0.7));
            }
            [0, 180, 360, 540].forEach((ms, i) => halo(g, t, vd + ms, 2400 + i * 300, 520 + i * 60, ['#fff', ASTRAL_GOLD, c2, c][i], 3.5 - i * 0.6));
        };
        k.flash(vd - 60, 2600, '#fff', 1, 100);
        k.rays(vd + 300, 8200, 0.45, 120, ['#fff', ASTRAL_GOLD, c2, c], 40);
        k.aurora(vd + 600, 8400, [c, c2, '#7a5cff', '#3ff0ff'], 0.5);
        k.shake(k.game, vd + 100, 2200, 24, 1.2);
        k.trace(vd + 2400, 5600, ASTRAL_GOLD, 5, 4);
        k.reelGlow(vd + 2400, 6000, ASTRAL_GOLD, 1.1);
        k.particles([
            { type: 'galaxy', at: vd + 100, n: 320, cols: ['#fff', ASTRAL_GOLD, c, c2], speed: 1500, life: 3.8, size: 2.5, trail: 1, drag: 1.1, spin: 1.2 },
            { type: 'stars', at: vd + 1400, n: 160, cols: ['#ffffff', '#fff2c4'], life: 6, size: 1.5, pull: -40, rot: 0.06 },
            { type: 'embers', at: vd + 1200, until: vd + 9200, rate: 30, cols: ['#fff', ASTRAL_GOLD, c], life: 3, size: 1.8, wide: 1 }
        ], total);
    }
    fxScene(k, total, draw);
}
const FX_SKINS = { retro: retroFx, astral: astralFx };
