// cutscenes for the joke elements
// Um: a serious build-up, then a party popper
CUTSCENES.Um = {
    z: 0, dur: 8200,
    snd(audio, start) {
        padChord(audio, start, [55, 82.4], 3.4, 0.014, 'sine', 500);
        [0.8, 1.6, 2.2, 2.7, 3.05, 3.3].forEach(x => playTone(audio, 880, start + x, 0.08, 0.02, 'sine', null, 0.3));
        playNoise(audio, start + 3.6, 0.25, 0.12, 3000, 400, 'bandpass', 1, 0.2, 0.002);
        [523.3, 659.3, 784, 1046.5].forEach((f, i) => playTone(audio, f, start + 3.7 + i * 0.11, 0.18, 0.03, 'square', null, 0.2, 0, 0.005));
        sparkle(audio, start + 3.7, 14, 1.6, 0.02);
        padChord(audio, start + 4.3, [261.6, 329.6, 392], 2.8, 0.016, 'triangle', 2400);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        if (!st.c) {
            const r = seededRandom(7);
            const cols = ['#ff5d7a', '#ffd166', '#5eead4', '#7cc8ff', '#b39dff', '#f78fd8'];
            st.c = Array.from({ length: 140 }, () => {
                const a = -Math.PI / 2 + (r() - 0.5) * 2.6;
                const v = (0.5 + r() * 1.2) * u;
                return [Math.cos(a) * v, Math.sin(a) * v, cols[Math.floor(r() * cols.length)], r() * TAU, r() * 0.02 + 0.005, r() < 0.3];
            });
        }
        const pop = 3600;
        const b = smoothstep(0, 3200, time);
        const after = time >= pop;
        ctx.fillStyle = after ? '#2b1640' : '#04070d';
        ctx.fillRect(0, 0, W, H);
        if (!after) {
            // this is meant to look like every other cutscene's opening
            const shake = smoothstep(2600, pop, time) * 0.8 * u * (calmFx ? 0.3 : 1);
            const sx = Math.sin(time / 23) * shake;
            drawGlow(ctx, cx + sx, cy, 40 * u * (0.6 + 0.4 * b), '#2d6bff', 0.6 * b);
            ctx.fillStyle = '#9cc4ff';
            ctx.beginPath();
            ctx.arc(cx + sx, cy, (3 + 2 * b + Math.sin(time / 180) * 0.4) * u, 0, TAU);
            ctx.fill();
            drawText(ctx, 'INITIATING SEQUENCE', cx, H - 6 * u, 2.2 * u, '#7aa7ff', b * (0.6 + 0.4 * Math.sin(time / 300)), 600, 0.6 * u);
            return;
        }
        const d = time - pop;
        drawGlow(ctx, cx, cy, 70 * u, '#ff9a5c', 0.5 * (1 - smoothstep(0, 1200, d)));
        // confetti
        st.c.forEach(([vx, vy, col, a0, spin, strip]) => {
            const x = cx + vx * d / 16;
            const y = cy + vy * d / 16 + 0.00006 * u * d * d;
            if (y > H + 4 * u) {
                return;
            }
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(a0 + d * spin);
            ctx.fillStyle = col;
            ctx.globalAlpha = 1 - smoothstep(3200, 4400, d);
            if (strip) {
                ctx.fillRect(-0.3 * u, -1.6 * u, 0.6 * u, 3.2 * u);
            } else {
                ctx.fillRect(-0.7 * u, -0.45 * u, 1.4 * u, 0.9 * u);
            }
            ctx.restore();
        });
        const k = easeOutCubic(d / 500);
        const bounce = 1 + 0.12 * Math.sin(d / 70) * (1 - smoothstep(0, 900, d));
        const out = 1 - smoothstep(2000, 2500, d);
        drawText(ctx, 'SURPRISE!', cx, cy - 4 * u, 12 * u * k * bounce, '#ffd166', out, 800, 0.4 * u);
        drawCard(ctx, scene, time, 6000, '#ffd166', '#ff5d7a');
    }
};
// Zz: a sleeping atom ignores a poke and an alarm clock, then jolts awake
CUTSCENES.Zz = {
    z: 0, dur: 8600,
    snd(audio, start) {
        for (let x = 0.2; x < 5; x += 1.3) {
            playNoise(audio, start + x, 0.7, 0.03, 180, 420, 'lowpass', 4, 0.1, 0.3);
        }
        playTone(audio, 900, start + 1.6, 0.06, 0.03, 'triangle', 700, 0.1);
        for (let i = 0; i < 16; i++) {
            playTone(audio, i % 2 ? 1320 : 1480, start + 3 + i * 0.09, 0.07, 0.02, 'square', null, 0.15, 0, 0.003);
        }
        riser(audio, start + 4.7, 0.6, 0.03, 200, 1800);
        boom(audio, start + 5.3, 0.06, 0.8);
        sparkle(audio, start + 5.35, 10, 1.2, 0.02);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2 + 4 * u;
        const wake = 5300;
        const up = time >= wake;
        const d = time - wake;
        ctx.fillStyle = up ? '#14243a' : '#070b1a';
        ctx.fillRect(0, 0, W, H);
        const fade = 1 - smoothstep(6200, 6800, time);
        drawGlow(ctx, cx, cy, 30 * u, up ? '#7cc8ff' : '#3b4b8f', (up ? 0.7 * (1 - smoothstep(0, 1500, d)) + 0.3 : 0.35) * fade);
        ctx.globalAlpha = fade;
        // a poke and a wobble
        const poke = smoothstep(1300, 1600, time) * (1 - smoothstep(1700, 2000, time));
        const wob = Math.sin(time / 40) * Math.max(0, 1 - Math.abs(time - 1650) / 400) * u;
        // the alarm clock rattles to the side
        const ring = time > 3000 && time < 4500;
        const shake = ring ? Math.sin(time / 18) * 0.6 * u * (calmFx ? 0.4 : 1) : 0;
        const jolt = up ? Math.sin(d / 25) * 2 * u * (1 - smoothstep(0, 500, d)) * (calmFx ? 0.3 : 1) : 0;
        const x = cx + wob + jolt;
        // orbits, slow while asleep
        const spin = up ? time / 140 : time / 1400;
        ctx.strokeStyle = 'rgba(150,180,255,0.35)';
        ctx.lineWidth = 0.3 * u;
        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.ellipse(x, cy, 14 * u, 5 * u, i * 1.2 - 0.6, 0, TAU);
            ctx.stroke();
            const a = spin * (i ? 1.3 : 1) + i;
            const ex = Math.cos(a) * 14 * u;
            const ey = Math.sin(a) * 5 * u;
            const r = i * 1.2 - 0.6;
            ctx.fillStyle = '#bcd2ff';
            ctx.beginPath();
            ctx.arc(x + ex * Math.cos(r) - ey * Math.sin(r), cy + ex * Math.sin(r) + ey * Math.cos(r), 0.9 * u, 0, TAU);
            ctx.fill();
        }
        ctx.fillStyle = up ? '#9fd3ff' : '#6d7fc4';
        ctx.beginPath();
        ctx.arc(x, cy, 6 * u, 0, TAU);
        ctx.fill();
        // eyes
        ctx.strokeStyle = '#0b1230';
        ctx.fillStyle = '#0b1230';
        ctx.lineWidth = 0.5 * u;
        [-1, 1].forEach(s => {
            ctx.beginPath();
            if (up) {
                ctx.arc(x + s * 2 * u, cy - 0.8 * u, 1.1 * u, 0, TAU);
                ctx.fill();
            } else {
                ctx.arc(x + s * 2 * u, cy - 1.2 * u, 1 * u, 0.2, Math.PI - 0.2);
                ctx.stroke();
            }
        });
        // z's drift up while it sleeps
        if (!up) {
            for (let i = 0; i < 4; i++) {
                const p = ((time / 2200 + i / 4) % 1);
                const big = ring ? 1.6 : 1;
                drawText(ctx, 'z', x + 6 * u + p * 10 * u, cy - 6 * u - p * 22 * u, (2 + 3 * p) * u * big, '#9aa8ff', Math.sin(p * Math.PI) * 0.9, 700);
            }
        } else {
            drawText(ctx, '!', x, cy - 14 * u, 8 * u * easeOutCubic(d / 300), '#ffd166', 1 - smoothstep(1200, 1700, d), 800);
        }
        ctx.globalAlpha = 1;
        // the finger
        if (poke > 0) {
            ctx.fillStyle = '#f2c7a5';
            ctx.beginPath();
            ctx.roundRect(cx - 30 * u + poke * 16 * u, cy - u, 14 * u, 2.6 * u, 1.3 * u);
            ctx.fill();
            drawText(ctx, 'poke', cx - 20 * u, cy - 6 * u, 2.4 * u, '#f2c7a5', poke, 600);
        }
        // the clock
        const ca = smoothstep(2700, 3000, time) * (1 - smoothstep(4500, 4900, time));
        if (ca > 0) {
            const kx = W * 0.78 + shake;
            const ky = cy - 2 * u;
            ctx.globalAlpha = ca;
            ctx.fillStyle = '#d14d4d';
            ctx.beginPath();
            ctx.arc(kx, ky, 6 * u, 0, TAU);
            ctx.fill();
            [-1, 1].forEach(s => {
                ctx.beginPath();
                ctx.arc(kx + s * 4.5 * u, ky - 5.5 * u, 2 * u, 0, TAU);
                ctx.fill();
            });
            ctx.fillStyle = '#f6efe3';
            ctx.beginPath();
            ctx.arc(kx, ky, 4.6 * u, 0, TAU);
            ctx.fill();
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 0.4 * u;
            ctx.beginPath();
            ctx.moveTo(kx, ky);
            ctx.lineTo(kx, ky - 3.2 * u);
            ctx.moveTo(kx, ky);
            ctx.lineTo(kx + 2.2 * u, ky);
            ctx.stroke();
            ctx.globalAlpha = 1;
            if (ring) {
                drawText(ctx, 'RING RING', kx, ky - 11 * u, 2.6 * u, '#ff8a8a', 0.6 + 0.4 * Math.sin(time / 50), 700, 0.3 * u);
            }
        }
        drawCard(ctx, scene, time, 6600, '#9fd3ff', '#3b6bff');
    }
};
// Mu: nothing happens, slowly, then a very small ding
CUTSCENES.Mu = {
    z: 0, dur: 8200,
    snd(audio, start) {
        for (let i = 0; i < 12; i++) {
            playTone(audio, 220, start + 1 + i * 0.38, 0.03, 0.008, 'sine', null, 0.05);
        }
        playTone(audio, 1568, start + 5.7, 0.5, 0.012, 'sine', null, 0.4);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const dim = smoothstep(5900, 6400, time);
        const g = Math.round(232 - 160 * dim);
        ctx.fillStyle = 'rgb(' + g + ',' + (g - 6) + ',' + (g - 20) + ')';
        ctx.fillRect(0, 0, W, H);
        const a = smoothstep(200, 900, time) * (1 - dim);
        ctx.globalAlpha = a;
        ctx.fillStyle = '#9b978d';
        ctx.fillRect(cx - 7 * u, cy - 14 * u, 14 * u, 14 * u);
        ctx.globalAlpha = 1;
        drawText(ctx, 'A grey square', cx, cy + 5 * u, 2.4 * u, '#6f6b62', a, 500);
        // a loading bar that takes its time
        const p = Math.floor(smoothstep(1000, 5500, time) * 12) / 12;
        ctx.globalAlpha = a;
        ctx.strokeStyle = '#8c887e';
        ctx.lineWidth = 0.3 * u;
        ctx.strokeRect(cx - 20 * u, cy + 11 * u, 40 * u, 2.4 * u);
        ctx.fillStyle = '#a9a59a';
        ctx.fillRect(cx - 20 * u, cy + 11 * u, 40 * u * p, 2.4 * u);
        ctx.globalAlpha = 1;
        const blip = time > 3900 && time < 4100;
        drawText(ctx, 'Excitement: ' + (blip ? '1' : '0') + '%', cx, cy + 18 * u, 2 * u, '#6f6b62', a, 500);
        // the ding
        const ding = time - 5700;
        if (ding > 0 && ding < 700) {
            const k = 1 - ding / 700;
            ctx.strokeStyle = 'rgba(120,116,106,' + k + ')';
            ctx.lineWidth = 0.25 * u;
            ctx.beginPath();
            ctx.arc(cx + 7 * u, cy - 14 * u, (1 + ding / 120) * u, 0, TAU);
            ctx.stroke();
            drawText(ctx, 'ding', cx + 12 * u, cy - 18 * u, 1.8 * u, '#6f6b62', k, 500);
        }
        drawCard(ctx, scene, time, 6500, '#d8d2c4', '#8f8a7e');
    }
};
