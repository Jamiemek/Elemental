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
