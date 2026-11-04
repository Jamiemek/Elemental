// cutscenes for the void elements, the ones a Vacuum turns up. They all start in the dark
const VOID_BLUE = '#8aa2ff';
const bounceIn = (p, len) => {
    const m = ((p % (2 * len)) + 2 * len) % (2 * len);
    return m > len ? 2 * len - m : m;
};
function voidRing(ctx, x, y, r, u, alpha) {
    if (alpha <= 0.003 || r <= 0) {
        return;
    }
    [[1.6, 0.12], [0.8, 0.25], [0.25, 0.8]].forEach(([w, a]) => {
        ctx.strokeStyle = 'rgba(138,162,255,' + alpha * a + ')';
        ctx.lineWidth = w * u;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.stroke();
    });
}

// Kn: atoms drift and collide, then the empty space between them opens up and they all stop
CUTSCENES.Kn = {
    z: 0, dur: 10000, label: 'VOID ELEMENT',
    snd(audio, start) {
        padChord(audio, start, [41.2, 61.7], 6.4, 0.012, 'sine', 400);
        for (let x = 0.6; x < 6.2;) {
            playNoise(audio, start + x, 0.01, 0.03 * (1 - x / 7), 5200, 3000, 'highpass', 1, 0.1, 0.001);
            x += 0.08 + Math.random() * 0.3;
        }
        playTone(audio, 55, start + 3, 3.2, 0.035, 'sine', 30, 0.4, 0, 1.2);
        padChord(audio, start + 7.8, [196, 293.7, 392, 587.3], 2.6, 0.016, 'sine', 1800);
        sparkle(audio, start + 7.9, 6, 1.6, 0.012, [1568, 2093, 2349.3, 3136]);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        if (!st.a) {
            const r = seededRandom(201);
            st.a = Array.from({ length: 110 }, () => [r() * W, r() * H, (r() - 0.5) * 0.045 * u, (r() - 0.5) * 0.045 * u, (0.8 + r() * 1.4) * u, r()]);
        }
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        // everything slows to a stop after 6s
        const tm = time < 6000 ? time : 6000 + 700 * (1 - Math.exp(-(time - 6000) / 700));
        const R = 34 * u * easeOutCubic((time - 3000) / 2600) * (1 - 0.6 * smoothstep(6800, 7700, time)) + Math.sin(time / 400) * 0.4 * u * smoothstep(3000, 4000, time);
        const al = smoothstep(0, 2000, time) * (1 - smoothstep(6400, 7500, time));
        st.a.forEach(([x0, y0, vx, vy, rad, sh]) => {
            let x = bounceIn(x0 + vx * tm, W);
            let y = bounceIn(y0 + vy * tm, H);
            const dx = x - cx;
            const dy = y - cy;
            const d = Math.hypot(dx, dy) || 1;
            if (R > 0) {
                const nd = Math.sqrt(d * d + R * R);
                x = cx + dx / d * nd;
                y = cy + dy / d * nd;
            }
            const b = 150 + Math.round(70 * sh);
            ctx.globalAlpha = al;
            ctx.fillStyle = 'rgb(' + (b - 30) + ',' + (b - 15) + ',' + b + ')';
            ctx.beginPath();
            ctx.arc(x, y, rad, 0, TAU);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,.55)';
            ctx.beginPath();
            ctx.arc(x - rad * 0.3, y - rad * 0.3, rad * 0.35, 0, TAU);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        if (R > 0.5) {
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, TAU);
            ctx.fill();
            voidRing(ctx, cx, cy, R, u, smoothstep(3000, 3800, time) * (1 - smoothstep(7300, 7900, time)));
        }
        const q = smoothstep(1400, 2400, time) * (1 - smoothstep(5000, 5600, time));
        drawText(ctx, 'NOTHING EXISTS EXCEPT ATOMS AND EMPTY SPACE', cx, H - 5 * u, 1.9 * u, '#9aa8d8', q * 0.8, 600, 0.45 * u);
        drawText(ctx, 'EMPTY SPACE', cx, H - 5 * u, 1.9 * u, VOID_BLUE, smoothstep(5000, 5600, time) * (1 - smoothstep(6800, 7400, time)), 600, 0.45 * u);
        drawCard(ctx, scene, time, 7800, '#c9d4ff', '#5b6cff');
    }
};

// Lq: a steady pulse skips beats, the gaps spread through a page of writing, then gather into one missing page
CUTSCENES.Lq = {
    z: 0, dur: 10400, label: 'VOID ELEMENT',
    snd(audio, start) {
        padChord(audio, start, [49, 73.4], 6.6, 0.01, 'sine', 500);
        for (let k = 0; k < 7; k++) {
            if (k === 3 || k === 5) {
                continue;
            }
            const t = start + 0.8 + k * 0.6;
            playTone(audio, 72, t, 0.2, 0.07, 'sine', 40, 0.1, 0, 0.004);
            playTone(audio, 1250, t, 0.04, 0.015, 'sine', null, 0.2, 0, 0.002);
        }
        playNoise(audio, start + 4.5, 1.8, 0.03, 2000, 6000, 'bandpass', 0.7, 0.3, 0.4);
        riser(audio, start + 6.4, 1.8, 0.02, 200, 900);
        padChord(audio, start + 8.4, [174.6, 261.6, 349.2], 2.6, 0.016, 'triangle', 1600);
        playTone(audio, 523.3, start + 8.45, 1.6, 0.02, 'sine');
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        const BEATS = [0, 1, 2, 3, 4, 5, 6].map(k => 800 + k * 600);
        const SKIP = new Set([3, 5]);
        if (!st.rows) {
            const r = seededRandom(202);
            // a page of writing: rows of word bars, a few of them missing
            st.rows = [];
            const rowH = 3.2 * u;
            for (let y = 6 * u; y < H - 4 * u; y += rowH) {
                let x = 6 * u;
                const row = [];
                while (x < W - 6 * u) {
                    const w = (2 + r() * 7) * u;
                    row.push([x, y, Math.min(w, W - 6 * u - x), r() < 0.11]);
                    x += w + 1.2 * u;
                }
                st.rows.push(row);
            }
            st.gaps = [];
            st.rows.forEach(row => row.forEach(b => {
                if (b[3]) {
                    st.gaps.push(b);
                }
            }));
            // where each gap ends up: tiles of one blank page
            const n = st.gaps.length;
            const cols = Math.max(1, Math.round(Math.sqrt(n * 0.75)));
            const rowsN = Math.ceil(n / cols);
            const pw = 26 * u;
            const ph = 34 * u;
            st.gaps.forEach((g, i) => {
                g.push(cx - pw / 2 + (i % cols + 0.5) * pw / cols, cy - ph / 2 + (Math.floor(i / cols) + 0.5) * ph / rowsN, pw / cols, ph / rowsN, r() * 400);
            });
            st.pw = pw;
            st.ph = ph;
        }
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        // the pulse line, scrolling until 4.4s then holding still
        const head = Math.min(time, 4400);
        const span = 2400;
        const lineA = smoothstep(0, 600, time) * (1 - smoothstep(4600, 5400, time));
        if (lineA > 0) {
            ctx.strokeStyle = 'rgba(160,190,255,' + lineA + ')';
            ctx.lineWidth = 0.35 * u;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            let pen = false;
            for (let x = 0; x <= W; x += 2) {
                const ts = head - (W - x) / W * span;
                let y = cy;
                let gap = false;
                BEATS.forEach((b, k) => {
                    const d = ts - b;
                    if (Math.abs(d) < 160 && SKIP.has(k)) {
                        gap = true;
                    } else if (Math.abs(d) < 110) {
                        const ph = (d + 110) / 220 * TAU;
                        y = cy - Math.sin(ph) * (ph < Math.PI ? 9 : 3.5) * u;
                    }
                });
                if (gap || ts < 0) {
                    pen = false;
                    continue;
                }
                if (pen) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.moveTo(x, y);
                    pen = true;
                }
            }
            ctx.stroke();
            drawGlow(ctx, W, cy, 10 * u, '#a8c0ff', 0.5 * lineA * (time < 4400 ? 1 : 0));
        }
        // the page of writing, with its gaps
        const pageA = smoothstep(4400, 5400, time) * (1 - smoothstep(6600, 7400, time));
        if (pageA > 0) {
            st.rows.forEach((row, ri) => {
                const ra = pageA * clamp((time - 4400 - ri * 35) / 500);
                ctx.fillStyle = 'rgba(120,135,180,' + 0.45 * ra + ')';
                row.forEach(([x, y, w, gap]) => {
                    if (!gap) {
                        ctx.fillRect(x, y, w, 1.1 * u);
                    }
                });
            });
        }
        // the gaps: outlined holes that drift together into one blank page
        const gA = smoothstep(4700, 5600, time) * (1 - smoothstep(8300, 8900, time));
        st.gaps.forEach(([x, y, w, , tx, ty, tw, th, delay]) => {
            const k = smoothstep(6400 + delay, 7900 + delay, time);
            const X = x + (tx - tw / 2 - x) * k;
            const Y = y - 0.6 * u + (ty - th / 2 - y + 0.6 * u) * k;
            const ww = w + (tw - w) * k;
            const hh = 2.3 * u + (th - 2.3 * u) * k;
            ctx.strokeStyle = 'rgba(138,162,255,' + gA * (0.7 - 0.4 * k) + ')';
            ctx.lineWidth = 0.22 * u;
            ctx.strokeRect(X, Y, ww, hh);
        });
        const merged = smoothstep(7700, 8300, time) * (1 - smoothstep(8500, 9100, time));
        if (merged > 0) {
            drawGlow(ctx, cx, cy, 30 * u, '#5b46c9', 0.5 * merged);
            ctx.fillStyle = '#000';
            ctx.fillRect(cx - st.pw / 2, cy - st.ph / 2, st.pw, st.ph);
            ctx.strokeStyle = 'rgba(184,198,255,' + merged + ')';
            ctx.lineWidth = 0.35 * u;
            ctx.strokeRect(cx - st.pw / 2, cy - st.ph / 2, st.pw, st.ph);
        }
        drawCard(ctx, scene, time, 8400, '#b8c6ff', '#7a5cff');
    }
};

// Tw: unsorted stuff tries to arrange itself into a periodic table, fails, and sinks back into formless murk
CUTSCENES.Tw = {
    z: 0, dur: 10800, label: 'VOID ELEMENT',
    snd(audio, start) {
        playNoise(audio, start + 0.1, 5.3, 0.05, 300, 900, 'bandpass', 2, 0.3, 1.2);
        [261.6, 293.7, 329.6, 349.2, 392, 440, 493.9, 523.3, 587.3].forEach((f, i) => playTone(audio, f, start + 2.6 + i * 0.24, 0.3, 0.016, 'triangle', null, 0.3));
        playNoise(audio, start + 5.15, 0.5, 0.08, 4000, 300, 'lowpass', 3, 0.2, 0.005);
        [311, 330, 349].forEach((f, i) => playTone(audio, f, start + 5.2 + i * 0.07, 0.18, 0.02, 'square', f * 0.7, 0.2, 0, 0.004));
        playTone(audio, 220, start + 5.4, 3, 0.03, 'triangle', 40, 0.3, 0, 0.3);
        playNoise(audio, start + 6.2, 2.6, 0.04, 800, 150, 'lowpass', 2, 0.3, 0.6);
        padChord(audio, start + 8.6, [146.8, 220, 293.7], 2.6, 0.016, 'sine', 1400);
        sparkle(audio, start + 8.7, 5, 1.5, 0.012);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        const cw = Math.min(W * 0.9 / 18, H * 0.7 / 7);
        const gx = cx - 9 * cw;
        const gy = cy - 3.5 * cw;
        if (!st.p) {
            const r = seededRandom(203);
            // real periodic table cells, so the attempt looks like the table
            const cells = ELEMENTS.map(e => tableLayout[e[0]]).filter(p => p && p[0] <= 7).map(p => [p[1] - 1, p[0] - 1]);
            st.cells = cells;
            st.p = Array.from({ length: 240 }, (_, i) => {
                const c = cells[i % cells.length];
                return [r() * TAU, 0.2 + r() * 0.8, 0.3 + r() * 0.7, r() * 360, c[0], c[1], r(), r() * TAU];
            });
        }
        ctx.fillStyle = '#030208';
        ctx.fillRect(0, 0, W, H);
        const sortK = smoothstep(2500, 4600, time) * (1 - smoothstep(5200, 5900, time));
        const glitch = smoothstep(4700, 5200, time) * (1 - smoothstep(5800, 6200, time));
        const grey = smoothstep(5200, 6400, time);
        const sink = smoothstep(6200, 8400, time);
        const fade = smoothstep(0, 1200, time);
        // murk underneath
        for (let i = 0; i < 4; i++) {
            const a = time / (1800 + i * 500) + i * 1.7;
            drawGlow(ctx, cx + Math.cos(a) * 18 * u * (1 - sink), cy + Math.sin(a * 1.3) * 12 * u * (1 - sink), (26 + 8 * i) * u * (1 - 0.4 * sink), ['#2a1840', '#1a2440', '#33203a', '#1c1830'][i], 0.6 * fade);
        }
        // the grid it tries to fill
        const gridA = smoothstep(2600, 3800, time) * (1 - smoothstep(5100, 5800, time));
        if (gridA > 0) {
            ctx.lineWidth = 0.15 * u;
            st.cells.forEach(([c, r]) => {
                const jx = glitch ? Math.sin(r * 9.1 + Math.floor(time / 70)) * glitch * 3 * u : 0;
                ctx.strokeStyle = 'rgba(150,160,220,' + gridA * (0.35 + (glitch ? 0.3 * Math.sin(time / 40 + c) : 0)) + ')';
                ctx.strokeRect(gx + c * cw + jx, gy + r * cw, cw * 0.92, cw * 0.92);
            });
        }
        st.p.forEach(([ph, a, b, hue, col, row, sz, ph2]) => {
            const t = time / 1000;
            const chaosX = cx + Math.sin(t * a * 1.3 + ph) * W * 0.36 + Math.sin(t * 2.1 * b + ph2) * 6 * u;
            const chaosY = cy + Math.cos(t * b * 1.1 + ph * 1.7) * H * 0.32 + Math.cos(t * 1.7 * a + ph) * 5 * u;
            const jit = glitch * 4 * u;
            const sx = gx + (col + 0.46) * cw + Math.sin(time / 60 + ph * 7) * jit;
            const sy = gy + (row + 0.46) * cw + Math.cos(time / 55 + ph * 5) * jit;
            let x = chaosX + (sx - chaosX) * sortK;
            let y = chaosY + (sy - chaosY) * sortK;
            // pulled in on a slow spiral
            if (sink > 0) {
                const dx = x - cx;
                const dy = y - cy;
                const ang = Math.atan2(dy, dx) + sink * 2.4;
                const d = Math.hypot(dx, dy) * (1 - 0.92 * sink);
                x = cx + Math.cos(ang) * d;
                y = cy + Math.sin(ang) * d;
            }
            const s = Math.round(70 * (1 - grey));
            const l = 62 - 22 * grey;
            ctx.globalAlpha = fade * (1 - smoothstep(7400, 8500, time)) * (0.55 + 0.45 * sz);
            ctx.fillStyle = 'hsl(' + hue + ',' + s + '%,' + l + '%)';
            ctx.beginPath();
            ctx.arc(x, y, (0.5 + sz * 0.9) * u, 0, TAU);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        drawGlow(ctx, cx, cy, 22 * u, '#6a4c9c', 0.5 * smoothstep(6800, 8200, time) * (1 - smoothstep(8600, 9400, time)));
        drawText(ctx, 'SORTING', cx, H - 5 * u, 1.9 * u, '#a99ad8', smoothstep(2600, 3000, time) * (1 - smoothstep(4900, 5100, time)) * (0.6 + 0.4 * Math.sin(time / 120)), 600, 0.6 * u);
        drawText(ctx, 'NOTHING TO SORT', cx, H - 5 * u, 1.9 * u, '#d7c2ff', smoothstep(5500, 6000, time) * (1 - smoothstep(7600, 8200, time)), 600, 0.6 * u);
        drawCard(ctx, scene, time, 8600, '#d7c2ff', '#6a4c9c');
    }
};

// Ap: element tiles are cut out of an endless sheet, then the view pulls back to show it never ends
CUTSCENES.Ap = {
    z: 0, dur: 11200, label: 'VOID ELEMENT',
    snd(audio, start) {
        padChord(audio, start, [65.4, 98, 130.8], 8.2, 0.01, 'triangle', 700);
        [2.0, 2.9, 3.6, 4.15, 4.6, 5.0].forEach((x, i) => {
            playNoise(audio, start + x, 0.32, 0.05, 1500, 7000, 'highpass', 2, 0.2, 0.01);
            playTone(audio, [392, 440, 523.3, 587.3, 659.3, 784][i], start + x + 0.4, 0.5, 0.014, 'sine', null, 0.4);
        });
        riser(audio, start + 5.6, 2.4, 0.02, 900, 140);
        playNoise(audio, start + 8.05, 0.5, 0.08, 1200, 8000, 'highpass', 2, 0.3, 0.01);
        boom(audio, start + 8.3, 0.12, 2);
        padChord(audio, start + 8.8, [130.8, 196, 261.6, 329.6], 2.6, 0.018, 'sine', 2200);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        const T = 9 * u;
        if (!st.cuts) {
            st.cuts = [[-26, -12, 'H', 2000], [22, 10, 'O', 2900], [-6, 16, 'Fe', 3600], [30, -16, 'Au', 4150], [-34, 14, 'C', 4600], [6, -20, 'U', 5000]]
                .map(([x, y, s, t]) => [x * u, y * u, s, t]);
        }
        const fadeIn = smoothstep(0, 1800, time);
        // pull back: everything in world units shrinks around the centre
        const zoom = time < 5600 ? 1 : Math.exp(-2.3 * smoothstep(5600, 8000, time));
        const sheetA = fadeIn * (1 - smoothstep(8200, 9000, time));
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        // the sheet: a dim violet weave with slow bands moving through it
        ctx.globalAlpha = sheetA;
        ctx.fillStyle = '#17142a';
        ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 5; i++) {
            const x = ((time * 0.012 * u + i * W / 2.5) % (W * 1.6)) - W * 0.3;
            drawGlow(ctx, x, cy + Math.sin(time / 1500 + i) * H * 0.3, 30 * u, '#2c2650', 0.5 * sheetA);
        }
        ctx.globalAlpha = sheetA * 0.25;
        ctx.strokeStyle = '#4a4380';
        ctx.lineWidth = 1;
        const step = 3 * u * zoom;
        if (step > 2) {
            for (let x = cx % step; x < W; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }
            for (let y = cy % step; y < H; y += step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
        // the holes left by everything ever cut from it, only seen as the view pulls back
        const latA = smoothstep(5800, 7000, time) * sheetA;
        if (latA > 0) {
            const sp = 22 * u * zoom;
            const hs = T * zoom;
            const nx = Math.ceil(W / sp / 2) + 1;
            const ny = Math.ceil(H / sp / 2) + 1;
            ctx.fillStyle = '#000';
            ctx.strokeStyle = 'rgba(138,162,255,' + 0.5 * latA + ')';
            ctx.lineWidth = Math.max(0.5, 0.2 * u * zoom);
            for (let i = -nx; i <= nx; i++) {
                for (let j = -ny; j <= ny; j++) {
                    if (Math.abs(i) < 3 && Math.abs(j) < 2) {
                        continue;
                    }
                    const X = cx + (i * 22 + (j % 2) * 11) * u * zoom;
                    const Y = cy + j * 22 * u * zoom;
                    ctx.globalAlpha = latA;
                    ctx.fillRect(X - hs / 2, Y - hs / 2, hs, hs);
                    ctx.strokeRect(X - hs / 2, Y - hs / 2, hs, hs);
                }
            }
            ctx.globalAlpha = 1;
        }
        // each cut: a bright point runs round the edge, then the tile lifts away and leaves a hole
        st.cuts.forEach(([x, y, sym, t0], i) => {
            const X = cx + x * zoom;
            const Y = cy + y * zoom;
            const s = T * zoom;
            const d = time - t0;
            if (d < 0) {
                return;
            }
            const run = clamp(d / 380);
            const lift = smoothstep(420, 1300, d);
            if (lift > 0) {
                ctx.fillStyle = '#000';
                ctx.globalAlpha = sheetA;
                ctx.fillRect(X - s / 2, Y - s / 2, s, s);
                ctx.globalAlpha = 1;
            }
            const per = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]];
            ctx.strokeStyle = 'rgba(230,226,255,' + sheetA * (1 - 0.6 * lift) + ')';
            ctx.lineWidth = Math.max(0.5, 0.25 * u * zoom);
            ctx.beginPath();
            ctx.moveTo(X - s / 2, Y - s / 2);
            const segs = run * 4;
            let hx = X - s / 2;
            let hy = Y - s / 2;
            for (let k = 0; k < 4 && k < segs; k++) {
                const f = Math.min(1, segs - k);
                hx = X + (per[k][0] + (per[k + 1][0] - per[k][0]) * f) * s / 2;
                hy = Y + (per[k][1] + (per[k + 1][1] - per[k][1]) * f) * s / 2;
                ctx.lineTo(hx, hy);
            }
            ctx.stroke();
            if (run < 1) {
                drawGlow(ctx, hx, hy, 3 * u, '#ffffff', 0.9 * sheetA);
            }
            // the cut tile floats off with its element on it
            if (lift > 0 && lift < 1) {
                const fx = X + Math.cos(i * 2.1) * lift * 14 * u;
                const fy = Y - lift * 10 * u;
                const sc = 1 - 0.5 * lift;
                ctx.save();
                ctx.translate(fx, fy);
                ctx.rotate(lift * (i % 2 ? 0.5 : -0.5));
                ctx.globalAlpha = (1 - lift) * sheetA;
                ctx.fillStyle = '#2a2550';
                ctx.fillRect(-s * sc / 2, -s * sc / 2, s * sc, s * sc);
                ctx.restore();
                drawText(ctx, sym, fx, fy, 4 * u * sc * zoom, '#e6e2ff', (1 - lift) * sheetA, 700);
            }
        });
        const fin = smoothstep(8000, 8500, time) * (1 - smoothstep(8900, 9500, time));
        if (fin > 0) {
            const s = 24 * u * easeOutCubic((time - 8000) / 450);
            ctx.strokeStyle = 'rgba(230,226,255,' + fin + ')';
            ctx.lineWidth = 0.35 * u;
            ctx.strokeRect(cx - s, cy - s * 1.2, 2 * s, 2.4 * s);
            drawGlow(ctx, cx, cy, 40 * u, '#ffffff', 0.35 * fin * (calmFx ? 0.4 : 1));
        }
        drawText(ctx, 'NO EDGE FOUND', cx, H - 5 * u, 1.9 * u, '#b7b0ff', smoothstep(6400, 6900, time) * (1 - smoothstep(7900, 8300, time)), 600, 0.6 * u);
        drawCard(ctx, scene, time, 8800, '#e6e2ff', VOID_BLUE);
    }
};

// Ix: something slips through the gaps of a crystal lattice, dodging the scan, until the view closes in on it
CUTSCENES.Ix = {
    z: 0, dur: 11200, label: 'VOID ELEMENT',
    snd(audio, start) {
        padChord(audio, start, [261.6, 392, 523.3], 7.2, 0.007, 'sine', 3000);
        for (let k = 0; k < 11; k++) {
            playTone(audio, 1700 + Math.random() * 900, start + 1.8 + k * 0.32, 0.08, 0.018, 'sine', null, 0.4, 0, 0.003);
        }
        [2.2, 4.2].forEach(x => playNoise(audio, start + x, 0.9, 0.022, 500, 3200, 'bandpass', 4, 0.2, 0.1));
        riser(audio, start + 5.2, 2, 0.02, 300, 1200);
        boom(audio, start + 7.2, 0.1, 1.8);
        padChord(audio, start + 8.8, [196, 246.9, 293.7, 392], 2.4, 0.016, 'sine', 2400);
        sparkle(audio, start + 8.9, 7, 1.6, 0.012);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        const a = 14 * u;
        if (!st.path) {
            const r = seededRandom(204);
            // the gaps it hops between, ending on the one next to the centre
            const path = [[-3, 1], [-2, 1], [-2, 0], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [2, 0], [1, 0], [0, 0], [0, 0]];
            st.path = path.map(([i, j]) => [(i + 0.5) * a, (j + 0.5) * a]);
            st.jit = Array.from({ length: 400 }, () => r() * TAU);
        }
        ctx.fillStyle = '#02030a';
        ctx.fillRect(0, 0, W, H);
        // where the visitor is: a quick hop every 320ms, then still
        const hopT = (time - 1800) / 320;
        const k = clamp(Math.floor(hopT), 0, st.path.length - 2);
        const f = hopT < 0 ? 0 : easeOutCubic(clamp(hopT - k) * 1.6);
        const p0 = st.path[hopT < 0 ? 0 : k];
        const p1 = st.path[hopT < 0 ? 0 : k + 1];
        const vx = p0[0] + (p1[0] - p0[0]) * f;
        const vy = p0[1] + (p1[1] - p0[1]) * f;
        // close in on it, then it pushes the lattice apart
        const zk = smoothstep(5200, 7200, time);
        const zoom = 1 + 2.6 * zk;
        const fx = vx * zk;
        const fy = vy * zk;
        const push = smoothstep(7200, 8400, time);
        const latA = smoothstep(0, 1600, time) * (1 - smoothstep(8200, 9200, time));
        const toScreen = (x, y) => [cx + (x - fx) * zoom, cy + (y - fy) * zoom];
        const nx = Math.ceil(W / a / 2) + 1;
        const ny = Math.ceil(H / a / 2) + 1;
        const atoms = [];
        for (let i = -nx; i <= nx; i++) {
            for (let j = -ny; j <= ny; j++) {
                let x = i * a;
                let y = j * a;
                const n = (i + 40) * 9 + j + 40;
                // thermal wobble, and a flinch when the visitor goes past
                const dv = Math.hypot(x - vx, y - vy);
                const flinch = Math.max(0, 1 - dv / (1.2 * a)) * 1.4 * u * (time > 1800 && time < 5400 ? 1 : 0);
                x += Math.cos(time / 170 + st.jit[n % 400]) * 0.35 * u + (x - vx) / (dv || 1) * flinch;
                y += Math.sin(time / 190 + st.jit[(n * 7) % 400]) * 0.35 * u + (y - vy) / (dv || 1) * flinch;
                if (push > 0) {
                    const d = Math.hypot(x - vx, y - vy) || 1;
                    const m = push * 10 * u * Math.exp(-d / (3 * a));
                    x += (x - vx) / d * m;
                    y += (y - vy) / d * m;
                }
                atoms.push(toScreen(x, y));
            }
        }
        if (latA > 0) {
            ctx.globalAlpha = latA;
            ctx.strokeStyle = 'rgba(90,120,200,.35)';
            ctx.lineWidth = Math.max(0.5, 0.15 * u * zoom);
            const rows = 2 * ny + 1;
            atoms.forEach((p, n) => {
                if ((n + 1) % rows) {
                    const q = atoms[n + 1];
                    ctx.beginPath();
                    ctx.moveTo(p[0], p[1]);
                    ctx.lineTo(q[0], q[1]);
                    ctx.stroke();
                }
                const q = atoms[n + rows];
                if (q) {
                    ctx.beginPath();
                    ctx.moveTo(p[0], p[1]);
                    ctx.lineTo(q[0], q[1]);
                    ctx.stroke();
                }
            });
            atoms.forEach(([x, y]) => {
                if (x < -10 * u || x > W + 10 * u || y < -10 * u || y > H + 10 * u) {
                    return;
                }
                ctx.fillStyle = '#5d7fd6';
                ctx.beginPath();
                ctx.arc(x, y, 2.4 * u * zoom, 0, TAU);
                ctx.fill();
                ctx.fillStyle = 'rgba(210,225,255,.6)';
                ctx.beginPath();
                ctx.arc(x - 0.7 * u * zoom, y - 0.7 * u * zoom, 0.8 * u * zoom, 0, TAU);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        }
        // the scan: a line that sweeps down twice; the visitor goes dark when it passes
        let hidden = 0;
        [[2200, 2000], [4200, 2000]].forEach(([t0, len]) => {
            const s = (time - t0) / len;
            if (s > 0 && s < 1) {
                const y = s * H;
                ctx.fillStyle = 'rgba(120,200,255,.18)';
                ctx.fillRect(0, y - 0.3 * u, W, 0.6 * u);
                drawGlow(ctx, cx, y, 30 * u, '#4fd1ff', 0.08);
                const [, sy] = toScreen(vx, vy);
                hidden = Math.max(hidden, 1 - clamp(Math.abs(y - sy) / (6 * u)));
            }
        });
        const [sx, sy] = toScreen(vx, vy);
        const vis = smoothstep(1500, 1900, time) * (1 - hidden) * (1 - smoothstep(8600, 9200, time));
        const size = (1 + 3 * push) * zoom;
        drawGlow(ctx, sx, sy, 5 * u * size, '#c6b8ff', 0.7 * vis);
        if (time > 1800 && time < 5400) {
            const [tx, ty] = toScreen(p0[0], p0[1]);
            ctx.strokeStyle = 'rgba(198,184,255,' + 0.4 * (1 - f) * vis + ')';
            ctx.lineWidth = 0.3 * u;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        }
        ctx.fillStyle = 'rgba(240,236,255,' + vis + ')';
        ctx.beginPath();
        ctx.arc(sx, sy, 0.6 * u * size, 0, TAU);
        ctx.fill();
        if (push > 0) {
            drawGlow(ctx, sx, sy, 50 * u * push, '#4fd1ff', 0.3 * push * (1 - smoothstep(8400, 9400, time)) * (calmFx ? 0.5 : 1));
        }
        const txt = time < 5000 ? 'LATTICE SCAN  ·  ALL SITES ACCOUNTED FOR' : 'UNREGISTERED OCCUPANT';
        drawText(ctx, txt, cx, H - 5 * u, 1.9 * u, time < 5000 ? '#7fa6e8' : '#c6b8ff', smoothstep(600, 1200, time) * (1 - smoothstep(4700, 5000, time)) + smoothstep(5200, 5600, time) * (1 - smoothstep(7400, 7900, time)), 600, 0.5 * u);
        drawCard(ctx, scene, time, 8800, '#c6b8ff', '#4fd1ff');
    }
};

// Gx: frost on one side, fire on the other, and a gap between them that keeps yawning wider until something forms in it
CUTSCENES.Gx = {
    z: 0, dur: 12500, label: 'VOID ELEMENT',
    snd(audio, start) {
        playNoise(audio, start, 9.4, 0.05, 400, 900, 'bandpass', 1.5, 0.4, 2);
        for (let x = 0.8; x < 8.4;) {
            playNoise(audio, start + x, 0.02, 0.025, 2600, 1200, 'bandpass', 2, 0.1, 0.001);
            x += 0.05 + Math.random() * 0.22;
        }
        [1.2, 3.4, 5.6].forEach(x => sparkle(audio, start + x, 4, 1.2, 0.01, [2349.3, 2637, 3136, 3520]));
        playTone(audio, 62, start + 2.5, 4.2, 0.05, 'sine', 28, 0.3, 0, 1);
        [5.6, 6.8, 7.8].forEach((x, i) => boom(audio, start + x, 0.06 + i * 0.03, 1.4));
        riser(audio, start + 8.4, 1, 0.03, 120, 1600);
        boom(audio, start + 9.4, 0.22, 2.6);
        padChord(audio, start + 10, [110, 164.8, 220, 277.2, 329.6], 2.4, 0.02, 'sine', 2600);
        sparkle(audio, start + 10.1, 9, 1.8, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        if (!st.frost) {
            const r = seededRandom(205);
            // frost: branching lines growing in from the left edge
            st.frost = [];
            const grow = (x, y, ang, len, depth, t) => {
                const x2 = x + Math.cos(ang) * len;
                const y2 = y + Math.sin(ang) * len;
                st.frost.push([x, y, x2, y2, t]);
                if (depth > 0) {
                    [-0.6, 0.6].forEach(s => r() < 0.85 && grow(x2, y2, ang + s * (0.6 + r() * 0.4), len * 0.68, depth - 1, t + 260));
                    grow(x2, y2, ang + (r() - 0.5) * 0.3, len * 0.8, depth - 1, t + 220);
                }
            };
            for (let i = 0; i < 7; i++) {
                grow(0, H * (0.08 + i * 0.14), (r() - 0.5) * 0.6, 7 * u, 4, 600 + r() * 900);
            }
            st.emb = Array.from({ length: 70 }, () => [r(), r(), 0.4 + r() * 0.8, r() * TAU]);
            st.rime = Array.from({ length: 50 }, () => [r(), r(), 0.3 + r() * 0.6, r() * TAU]);
            st.jag = Array.from({ length: 200 }, () => r());
            st.mist = Array.from({ length: 60 }, () => [r() * TAU, r(), r() * 3000, 0.5 + r()]);
        }
        const shakeAmt = (smoothstep(5400, 6200, time) * (1 - smoothstep(8400, 8800, time)) * 0.5 + (time > 9400 && time < 9900 ? 1 - (time - 9400) / 500 : 0)) * u * (calmFx ? 0.25 : 1);
        const sx = Math.sin(time / 21) * shakeAmt;
        const sy = Math.cos(time / 17) * shakeAmt;
        ctx.fillStyle = '#010104';
        ctx.fillRect(0, 0, W, H);
        ctx.save();
        ctx.translate(sx, sy);
        const reveal = smoothstep(200, 2600, time);
        const end = 1 - smoothstep(8600, 9400, time);
        // the gap's half-width, yawning open
        const gap = (3 + 20 * easeOutCubic((time - 2500) / 3200) + Math.sin(time / 600) * 0.8 * smoothstep(3000, 4000, time)) * u;
        const iceEdge = cx - gap;
        const fireEdge = cx + gap;
        // frost side
        drawGlow(ctx, 0, cy, W * 0.55, '#3b6fd6', 0.45 * reveal * end);
        // a jagged wall of ice
        const step = 2.4 * u;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let y = 0, i = 0; y <= H + step; y += step, i++) {
            ctx.lineTo(iceEdge - st.jag[i % 200] * 2.6 * u - (i % 2) * 1.2 * u, y);
        }
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = 'rgba(12,30,66,' + 0.85 * reveal * end + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200,232,255,' + 0.75 * reveal * end * (0.85 + 0.15 * Math.sin(time / 300)) + ')';
        ctx.lineWidth = 0.25 * u;
        ctx.stroke();
        const shrinkL = Math.max(0.2, iceEdge / (cx - 3 * u));
        ctx.lineWidth = 0.22 * u;
        st.frost.forEach(([x, y, x2, y2, t]) => {
            const g = clamp((time - t) / 260);
            if (g <= 0) {
                return;
            }
            ctx.strokeStyle = 'rgba(200,230,255,' + 0.7 * reveal * end + ')';
            ctx.beginPath();
            ctx.moveTo(x * shrinkL, y);
            ctx.lineTo((x + (x2 - x) * g) * shrinkL, y + (y2 - y) * g);
            ctx.stroke();
        });
        // fire side
        drawGlow(ctx, W, cy, W * 0.55, '#ff6a1f', 0.5 * reveal * end);
        // a flickering wall of flame, three layers deep
        drawGlow(ctx, fireEdge, cy, 30 * u, '#ff7a2a', 0.25 * reveal * end);
        ctx.fillStyle = 'rgba(34,9,3,' + 0.85 * reveal * end + ')';
        ctx.fillRect(Math.min(W, fireEdge), 0, W, H);
        ['#7a1c06', '#d4530f', '#ffa53d', '#ffe08a'].forEach((col, k) => {
            const back = fireEdge + (9 - 2 * k) * u;
            ctx.beginPath();
            ctx.moveTo(back, 0);
            for (let y = 0; y <= H + u; y += u) {
                const tongue = (1.6 + 1.2 * Math.sin(y / (3.1 * u) + time / 120 + k * 1.3) + 0.7 * Math.sin(y / (1.2 * u) - time / 65 + k)) * u * (1 - k * 0.22);
                ctx.lineTo(fireEdge + k * 1.4 * u - tongue, y);
            }
            ctx.lineTo(back, H);
            ctx.closePath();
            ctx.globalAlpha = reveal * end * (0.95 - k * 0.1);
            ctx.fillStyle = col;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        // embers drift off the fire into the gap; rime drifts off the ice
        const cross = smoothstep(3000, 4500, time) * end;
        st.emb.forEach(([a, b, sp, ph]) => {
            const t = ((time / 1000) * sp + a) % 1;
            const x = W - t * (W - cx + gap * 0.2) * (0.6 + 0.4 * cross);
            const y = H * b + Math.sin(time / 400 + ph) * 3 * u - t * 8 * u;
            ctx.fillStyle = 'rgba(255,' + Math.round(150 + 80 * b) + ',80,' + reveal * end * (1 - t) + ')';
            ctx.fillRect(x, y, 0.5 * u, 0.5 * u);
        });
        st.rime.forEach(([a, b, sp, ph]) => {
            const t = ((time / 1000) * sp + a) % 1;
            const x = t * (cx + gap * 0.2) * (0.6 + 0.4 * cross);
            const y = H * b + Math.cos(time / 500 + ph) * 3 * u + t * 4 * u;
            ctx.fillStyle = 'rgba(210,235,255,' + reveal * end * (1 - t) * 0.8 + ')';
            ctx.beginPath();
            ctx.arc(x, y, 0.35 * u, 0, TAU);
            ctx.fill();
        });
        // where they meet: mist gathering in the middle of the gap, then drawn into a point
        const mistA = smoothstep(5200, 7200, time);
        const pull = smoothstep(8300, 9400, time);
        st.mist.forEach(([ang, rr, ph, sz]) => {
            const swirl = ang + time / (1600 + rr * 1400);
            const d = (4 + rr * 14) * u * (1 - pull);
            const x = cx + Math.cos(swirl) * d * Math.min(1, gap / (16 * u));
            const y = cy + Math.sin(swirl) * d * 1.4;
            drawGlow(ctx, x, y, (3 + 3 * sz) * u * (1 - 0.7 * pull), '#cfc4ff', 0.22 * mistA * (0.5 + 0.5 * Math.sin(time / 500 + ph)));
        });
        ctx.restore();
        // the moment it forms
        const flash = time > 9400 ? 1 - smoothstep(9400, 10300, time) : 0;
        drawGlow(ctx, cx, cy, 12 * u * (1 + pull), '#ffffff', 0.8 * pull * (time < 9400 ? 1 : 0));
        if (flash > 0) {
            ctx.fillStyle = 'rgba(240,238,255,' + flash * (calmFx ? 0.3 : 0.85) + ')';
            ctx.fillRect(0, 0, W, H);
        }
        drawText(ctx, 'BEFORE THE FIRST WORLD', cx, H - 5 * u, 1.9 * u, '#cfc4ff', smoothstep(1800, 2600, time) * (1 - smoothstep(5000, 5600, time)), 600, 0.7 * u);
        drawCard(ctx, scene, time, 10000, '#f2f4ff', '#9d7bff');
    }
};
