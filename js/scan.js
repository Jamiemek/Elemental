const QS_COLS = ['#ff5a6e', '#5ef0a0', '#5aa8ff'];
let qsSprites = null;
function qsSprite(i) {
    if (!qsSprites) {
        qsSprites = QS_COLS.map(c => {
            const s = document.createElement('canvas');
            s.width = s.height = 64;
            const x = s.getContext('2d');
            const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
            gr.addColorStop(0, '#ffffff');
            gr.addColorStop(0.16, '#ffffff');
            gr.addColorStop(0.3, c);
            gr.addColorStop(0.55, c + '55');
            gr.addColorStop(1, c + '00');
            x.fillStyle = gr;
            x.fillRect(0, 0, 64, 64);
            return s;
        });
    }
    return qsSprites[i];
}
// soft round glow in any colour, for event particles
const glowSprites = {};
function glowSprite(c) {
    if (!glowSprites[c]) {
        const s = document.createElement('canvas');
        s.width = s.height = 64;
        const x = s.getContext('2d');
        const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, c + 'aa');
        gr.addColorStop(0.4, c + '44');
        gr.addColorStop(1, c + '00');
        x.fillStyle = gr;
        x.fillRect(0, 0, 64, 64);
        glowSprites[c] = s;
    }
    return glowSprites[c];
}
const RAD_SYMS = ['Tc', 'Pm'].concat(ELEMENTS.slice(83).map(e => e[0]));
// text sprites, setting the font per particle was too slow
const GLYPH = 128;
let glyphs = new Map();
function glyph(text, col, fam, px) {
    const key = text + '|' + col + '|' + fam + '|' + px;
    let s = glyphs.get(key);
    if (!s) {
        if (glyphs.size > 1500) {
            glyphs = new Map();
        }
        s = document.createElement('canvas');
        const x = s.getContext('2d');
        x.font = '700 ' + px + 'px ' + fam;
        const tw = x.measureText(text).width;
        // cap the size for long chains
        if (tw > 2048) {
            px = px * 2048 / tw | 0;
        }
        s.px = px;
        s.width = Math.ceil(Math.min(tw, 2048)) + 8;
        s.height = px * 1.3 | 0;
        x.font = '700 ' + px + 'px ' + fam;
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillStyle = col;
        x.fillText(text, s.width / 2, s.height / 2);
        glyphs.set(key, s);
    }
    return s;
}
if (document.fonts) {
    document.fonts.addEventListener('loadingdone', () => glyphs = new Map());
}
function drawGlyph(g, text, col, fam, size, x, y) {
    const s = glyph(text, col, fam, size > 48 ? GLYPH * 2 : GLYPH);
    const k = size / s.px;
    g.drawImage(s, x - s.width * k / 2, y - s.height * k / 2, s.width * k, s.height * k);
}
const SCAN_SKIN = {
    '': { fg: '#cfe3da', st: '#9fe0c8', hi: '#eef3ef' },
    oscilloscope: { fg: '#7dff9a', st: '#3dff6e', hi: '#d8ffe0' },
    holographic: { fg: '#d9fbff', st: '#ff7ce6', hi: '#ffffff' },
    warp: { fg: '#dfe8ff', st: '#9fb8ff', hi: '#ffffff' }
};
function skinLayer(g, sk, t, W, H, q) {
    g.save();
    if (sk === 'oscilloscope') {
        g.strokeStyle = '#7dff9a';
        g.lineWidth = 1;
        g.globalAlpha = 0.12;
        g.beginPath();
        for (let i = 1; i < 10; i++) {
            g.moveTo(W * i / 10, 0);
            g.lineTo(W * i / 10, H);
        }
        for (let i = 1; i < 8; i++) {
            g.moveTo(0, H * i / 8);
            g.lineTo(W, H * i / 8);
        }
        g.stroke();
        g.globalAlpha = 0.25;
        g.beginPath();
        for (let i = 0; i <= 50; i++) {
            g.moveTo(W * i / 50, H / 2 - 3);
            g.lineTo(W * i / 50, H / 2 + 3);
        }
        g.stroke();
        const A = H * 0.24 * (1 - q);
        g.globalAlpha = 0.85;
        g.strokeStyle = '#3dff6e';
        g.lineWidth = 2;
        g.shadowColor = '#3dff6e';
        g.shadowBlur = 10;
        g.beginPath();
        for (let x = 0; x <= W; x += 3) {
            const y = H / 2 + A * (0.6 * Math.sin(x / W * 18.85 + t / 180) + 0.3 * Math.sin(x * 0.071 - t / 90) + 0.1 * Math.sin(x * 0.53 + t / 40));
            if (x) {
                g.lineTo(x, y);
            } else {
                g.moveTo(x, y);
            }
        }
        g.stroke();
    } else if (sk === 'holographic') {
        const x0 = ((t / 1700) % 1.6 - 0.3) * W;
        const gr = g.createLinearGradient(x0 - W * 0.25, 0, x0 + W * 0.25, H * 0.4);
        gr.addColorStop(0, 'rgba(63,240,255,0)');
        gr.addColorStop(0.35, 'rgba(63,240,255,.10)');
        gr.addColorStop(0.5, 'rgba(255,255,255,.16)');
        gr.addColorStop(0.65, 'rgba(255,79,216,.10)');
        gr.addColorStop(1, 'rgba(255,79,216,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, W, H);
        g.globalAlpha = 0.06;
        for (let y = (t / 30) % 6; y < H; y += 6) {
            g.fillStyle = (y | 0) % 12 < 6 ? '#3ff0ff' : '#ff4fd8';
            g.fillRect(0, y, W, 1);
        }
    } else if (sk === 'warp') {
        const M = Math.max(W, H) * 0.75;
        g.strokeStyle = '#9fb8ff';
        g.lineWidth = 1.5;
        for (let k = 0; k < 6; k++) {
            const f = (t / 900 + k / 6) % 1;
            g.globalAlpha = (1 - f) * 0.35 * (1 - q);
            g.beginPath();
            g.ellipse(W / 2, H / 2, f * f * M, f * f * M * 0.62, 0, 0, 6.2832);
            g.stroke();
        }
        const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.4);
        gr.addColorStop(0, 'rgba(220,230,255,' + 0.35 * (1 - q) + ')');
        gr.addColorStop(1, 'rgba(220,230,255,0)');
        g.globalAlpha = 1;
        g.fillStyle = gr;
        g.fillRect(0, 0, W, H);
    }
    g.restore();
}
const EV_HUD = { storm: ['QUARK STORM', '#f0c419'], collider: ['SUPERCOLLIDER', '#5fd4ff'], hole: ['BLACK HOLE', '#ff9a3c'], gamma: ['GAMMA RAY BURST', '#7dff6a'], hyper: ['HYPERCHARGED', '#ffe14d'], vacuum: ['VACUUM', '#8aa2ff'] };
// black hole off the right edge, drawn once per roll
function holeLayer(W, H, dpr) {
    const R = H * 0.55;
    const bx = W + R / 3;
    const by = H * 0.52;
    const cv = document.createElement('canvas');
    cv.width = W * dpr;
    cv.height = H * dpr;
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    // halo
    const halo = g.createRadialGradient(bx, by, R * 0.9, bx, by, R * 2.6);
    halo.addColorStop(0, 'rgba(255,170,90,0.55)');
    halo.addColorStop(0.35, 'rgba(255,120,40,0.18)');
    halo.addColorStop(1, 'rgba(255,120,40,0)');
    g.fillStyle = halo;
    g.fillRect(0, 0, W, H);
    // disk
    const disk = front => {
        const a0 = front ? 0 : Math.PI;
        g.save();
        g.translate(bx, by);
        g.rotate(-0.12);
        g.scale(1, 0.18);
        const glow = g.createRadialGradient(0, 0, R * 1.1, 0, 0, R * 2.6);
        glow.addColorStop(0, 'rgba(255,240,210,0)');
        glow.addColorStop(0.05, 'rgba(255,236,200,0.95)');
        glow.addColorStop(0.3, 'rgba(255,175,90,0.6)');
        glow.addColorStop(0.65, 'rgba(230,110,40,0.22)');
        glow.addColorStop(1, 'rgba(200,80,30,0)');
        const side = g.createLinearGradient(-R * 2.6, 0, R * 2.6, 0);
        side.addColorStop(0, 'rgba(255,245,225,0.45)');
        side.addColorStop(1, 'rgba(120,40,10,0)');
        [glow, side].forEach(fill => {
            g.fillStyle = fill;
            g.beginPath();
            g.arc(0, 0, R * 2.6, a0, a0 + Math.PI);
            g.arc(0, 0, R * 1.1, a0 + Math.PI, a0, true);
            g.fill();
        });
        g.restore();
    };
    disk(false);
    // lensed back of the disk
    // fades at both ends. older Safari can't do conic gradients so it goes without
    if (g.createConicGradient) {
        const lens = g.createConicGradient(Math.PI, bx, by);
        lens.addColorStop(0, 'rgba(255,205,140,0)');
        lens.addColorStop(0.15, 'rgba(255,205,140,0.85)');
        lens.addColorStop(0.35, 'rgba(255,190,120,0.8)');
        lens.addColorStop(0.5, 'rgba(255,170,100,0)');
        lens.addColorStop(1, 'rgba(255,170,100,0)');
        g.lineWidth = R * 0.06;
        g.strokeStyle = lens;
        g.beginPath();
        g.ellipse(bx, by - R * 0.04, R * 1.1, R * 1.04, 0, Math.PI, Math.PI * 2);
        g.stroke();
    }
    // shadow, photon ring, front of disk
    g.fillStyle = '#000';
    g.beginPath();
    g.arc(bx, by, R, 0, 6.2832);
    g.fill();
    g.lineWidth = R * 0.025;
    g.strokeStyle = 'rgba(255,236,200,0.8)';
    g.beginPath();
    g.arc(bx, by, R * 1.02, 0, 6.2832);
    g.stroke();
    disk(true);
    return { cv, bx, by, R };
}
function drawHole(g, h, W, H, f) {
    g.globalAlpha = f;
    g.drawImage(h.cv, 0, 0, W, H);
    return [h.bx, h.by, h.R];
}
function scanField(reel, syms, labels, scores, dur, targets, ev) {
    const storm = ev === 'storm';
    const sk = scannerSkin();
    const SK = SCAN_SKIN[sk];
    const N = labels.length;
    const W = reel.clientWidth;
    const H = reel.clientHeight;
    if (!W || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // nothing to draw but keep the timing
        return new Promise(r => setTimeout(r, Math.max(120, 1350 * dur / 3000) + 1650));
    }
    const cv = document.createElement('canvas');
    const dpr = lowDetail ? 1 : Math.min(2, devicePixelRatio || 1);
    cv.width = W * dpr;
    cv.height = H * dpr;
    reel.appendChild(cv);
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    const holeArt = ev === 'hole' ? holeLayer(W, H, dpr) : null;
    const cs = getComputedStyle(syms[0]);
    const fam = cs.fontFamily;
    const base = Math.min(parseFloat(cs.fontSize) || 80, N > 1 ? 84 : 999);
    g.font = '700 ' + base + 'px ' + fam;
    const fsA = targets ? targets.map(t => t.fs) : labels.map(l => {
        const room = W / N - (N > 1 ? 24 : 30);
        const tw = g.measureText(l).width;
        return tw > room ? base * room / tw : base;
    });
    if (N > 1 && !targets) {
        syms.forEach((e, i) => e.style.fontSize = fsA[i] + 'px');
    }
    const ACC = ['#f0c419'].concat(RARITY_FX.slice(1).map(x => x.c));
    const tiers = scores.map(getRarityTier);
    const tier = Math.max(...tiers);
    const acc = ACC[tier];
    const Pp = H * 0.9;
    const t0 = performance.now();
    const sm = x => {
        x = Math.max(0, Math.min(1, x));
        return x * x * (3 - 2 * x);
    };
    const spawn = (p, d, c) => {
        p.z = c + d;
        p.x = (Math.random() - 0.5) * (W / Pp) * d * 1.25;
        p.y = (Math.random() - 0.5) * (H / Pp) * d * 1.25;
        p.s = 0.25 + Math.random() * 0.45;
        p.t = ELEMENTS[Math.random() * ELEMENTS.length | 0][0];
        // gamma: plenty of radioactive ones, glowing. hypercharged: some carry a charge. vacuum: a few blink out
        p.rad = ev === 'gamma' && Math.random() < 0.45;
        if (p.rad) {
            p.t = RAD_SYMS[Math.random() * RAD_SYMS.length | 0];
        }
        p.lab = p.t;
        if (ev === 'hyper' && Math.random() < 0.35) {
            const n = Math.random() < 0.8 ? 1 : 2;
            p.lab = withIon(p.t, Math.random() < 0.7 ? n : -n);
            p.ion = true;
        }
        p.fl = Math.random() * 6.3;
        p.dk = 0;
        // hypercharged: some come apart into loose charges that drift off and latch onto others
        p.frag = ev === 'hyper' && !p.ion && Math.random() < 0.3 ? 3 + Math.random() * 7 : 0;
        p.near = null;
        p.bits = p.frag ? Array.from({ length: 5 + (Math.random() * 6 | 0) }, () => ({ a: Math.random() * 6.3, r: 0.6 + Math.random() * 1.4, plus: Math.random() < 0.5, to: Math.random() * 1e9 | 0, w: Math.random() * 6.3 })) : null;
        return p;
    };
    // a vacuum has nothing in it at all
    const P = ev === 'collider' || ev === 'vacuum' ? [] : Array.from({ length: lowDetail ? 90 : 150 }, () => spawn({}, 0.6 + Math.pow(Math.random(), 0.8) * 13.4, -9));
    // gamma: bursts (a flash, two jets and a shock ring) and the bits radioactive elements shed
    const bursts = [];
    const specks = [];
    let nextBurst = 120 + Math.random() * 200;
    // quark storm: dust drifting round with the storm
    const dust = storm ? Array.from({ length: lowDetail ? 40 : 90 }, () => ({ a: Math.random() * 6.2832, r: 0.05 + Math.random() * 0.95, s: 0.6 + Math.random() * 0.9 })) : null;
    // black hole: matter going round the disk
    const disk = holeArt ? Array.from({ length: lowDetail ? 70 : 160 }, () => ({ r: 1.15 + Math.pow(Math.random(), 1.6) * 1.4, a: Math.random() * 6.2832, s: 0.6 + Math.random() * 0.8, l: 0.05 + Math.random() * 0.12 })) : null;
    // where each find was last frame, so things can head for it
    const tgAt = labels.map(() => null);
    // hypercharged: little arcs between charged elements, and rings where a loose charge lands
    const arcs = [];
    const pulses = [];
    // vacuum: where the brackets look while there's nothing to find, and what gathers into the find
    const seek = { x: W / 2, y: H / 2, fx: W / 2, fy: H / 2, s: 20, from: 0, at: 0 };
    const motes = ev === 'vacuum' ? labels.map(() => Array.from({ length: lowDetail ? 60 : 140 }, () => ({ a: Math.random() * 6.2832, r: 0.3 + Math.random() * 2.2, s: 0.5 + Math.random() * 0.7, d: Math.random() * 0.4 }))) : null;
    P.forEach(p => {
        p.L = 1600 + Math.random() * 1600;
        p.b = -Math.random() * p.L * 0.9;
    });
    // supercollider pairs
    const cSpawn = (p, d, c) => {
        spawn(p, d, c);
        const a = Math.random() * 6.2832;
        const r = (0.5 + Math.random() * 0.7) * d / 5;
        p.ox = Math.cos(a) * r;
        p.oy = Math.sin(a) * r;
        p.t2 = ELEMENTS[Math.random() * ELEMENTS.length | 0][0];
        p.dc = 2 + Math.random() * 4;
        p.sa = Math.random() * 6.3;
        p.f = hillFormula([elementBySymbol[p.t], elementBySymbol[p.t2]]);
        p.s *= 1.6;
        return p;
    };
    const C = ev === 'collider' ? Array.from({ length: lowDetail ? 45 : 70 }, () => cSpawn({}, 0.6 + Math.pow(Math.random(), 0.8) * 13.4, -9)) : [];
    // storm quarks: k = 0 for a lone quark (colour c), 1 for a bound three
    const qSpawn = (p, d, c) => {
        spawn(p, d, c);
        p.k = Math.random() < 0.28 ? 1 : 0;
        p.c = Math.random() * 3 | 0;
        p.w = (0.5 + Math.random() * 0.9) * (Math.random() < 0.85 ? 1 : -1);
        p.r0 = Math.hypot(p.x, p.y);
        p.a0 = Math.atan2(p.y, p.x);
        p.sp = Math.random() * 6.3;
        return p;
    };
    const Q = storm ? Array.from({ length: Math.round(Math.min(70, Math.max(44, W * H / 4500)) * (lowDetail ? 0.6 : 1)) }, () => qSpawn({}, 0.8 + Math.random() * 13, -9)) : [];
    const S = Math.max(120, 1350 * dur / 3000);
    const T1 = S + 600;
    const total = S + 1650;
    const two = labels.map(() => Math.random() < 0.5);
    const T = labels.map((l, i) => N === 1 ? { x: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 1.6), y: (Math.random() - 0.5) * 1.6 } : { x: ((i + 0.5) / N - 0.5) * 5.5 + (Math.random() - 0.5) * 1.2, y: (Math.random() - 0.5) * 2 });
    const mx = T.reduce((a, b) => a + b.x, 0) / N;
    const my = T.reduce((a, b) => a + b.y, 0) / N;
    return new Promise(res => {
        let done = false;
        const fin = () => {
            if (done) {
                return;
            }
            done = true;
            cv.remove();
            res();
        };
        setTimeout(fin, total + 1200);
        (function frame(now) {
            if (done) {
                return;
            }
            const t = now - t0;
            const u = t >= total ? 1 : t < S ? 0.45 * t / S : t < T1 ? 0.45 + 0.2 * (t - S) / 600 : 0.65 + 0.35 * (t - T1) / 1050;
            const q = u < 0.65 ? 0 : (u - 0.65) / 0.35;
            const D = u < 0.65 ? 8 - 3 * u / 0.65 : 5 * (1 - q * q);
            const dt = 1 + D;
            const cz = -dt;
            const w = sm((u - 0.45) / 0.35);
            const w2 = sm((u - 0.55) / 0.45);
            const ur = t / 3000;
            const cxw = Math.sin(ur * 9) * 2.4 * (1 - w) + mx * w;
            const cyw = Math.cos(ur * 6) * 1.2 * (1 - w) + my * w;
            g.clearRect(0, 0, W, H);
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.lineCap = 'round';
            if (sk) {
                skinLayer(g, sk, t, W, H, q);
            }
            const pr = (x, y, d) => [W / 2 + (x - cxw) * Pp / d, H / 2 + (y - cyw) * Pp / d];
            const hole = holeArt ? drawHole(g, holeArt, W, H, 1 - q) : null;
            if (ev === 'vacuum') {
                // pitch black, only letting go right at the end
                g.globalAlpha = 1 - sm((u - 0.97) / 0.03);
                g.fillStyle = '#000';
                g.fillRect(0, 0, W, H);
            }
            if (storm) {
                // gold dust drifting round the middle of the storm
                g.save();
                g.globalCompositeOperation = 'lighter';
                g.translate(W / 2, H / 2);
                g.rotate(t / 2600);
                const RR = Math.hypot(W, H) * 0.55;
                // gold dust caught up in it
                dust.forEach(m => {
                    const an = m.a + t / 2600 * (1 + 1.5 / m.r);
                    const x = Math.cos(an) * m.r * RR;
                    const y = Math.sin(an) * m.r * RR * 0.62;
                    g.globalAlpha = (0.35 + 0.35 * Math.sin(t / 200 + m.a * 7)) * (1 - q);
                    g.fillStyle = '#ffe28a';
                    g.fillRect(x - m.s, y - m.s, m.s * 2, m.s * 2);
                });
                g.restore();
            }
            if (hole) {
                // matter streaming round the disk, quicker further in; behind the hole it's hidden
                const [bx, by, R] = hole;
                g.save();
                g.globalCompositeOperation = 'lighter';
                g.translate(bx, by);
                g.rotate(-0.12);
                disk.forEach(m => {
                    const sp = m.s / Math.pow(m.r, 1.5);
                    const a0 = m.a + t / 900 * sp;
                    g.beginPath();
                    let vis = false;
                    for (let j = 0; j <= 4; j++) {
                        const an = a0 - j * m.l / 4;
                        const X = Math.cos(an) * R * m.r;
                        const Y = Math.sin(an) * R * m.r * 0.18;
                        // hidden where it passes behind the shadow
                        const hid = Math.sin(an) < 0 && Math.abs(X) < R * 1.02;
                        if (j && !hid && vis) {
                            g.lineTo(X, Y);
                        } else {
                            g.moveTo(X, Y);
                        }
                        vis = !hid;
                    }
                    // the side coming towards us is brighter
                    const lit = 0.55 + 0.45 * -Math.cos(a0);
                    g.globalAlpha = lit * 0.55 * (1 - q) * (m.r < 1.6 ? 1 : 0.6);
                    g.strokeStyle = m.r < 1.5 ? '#fff1d8' : '#ffb070';
                    g.lineWidth = m.r < 1.5 ? 1.6 : 1.1;
                    g.stroke();
                });
                g.restore();
                // at the lock the hole flares and fires jets out of its poles
                const fk = (t - T1 + 60) / 900;
                if (fk > 0 && fk < 1) {
                    const f = Math.pow(1 - fk, 1.5) * (1 - q * 0.5);
                    g.save();
                    g.globalCompositeOperation = 'lighter';
                    const fr = R * (1.4 + fk * 0.6);
                    g.globalAlpha = f * 0.35;
                    g.drawImage(glowSprite('#ffb070'), bx - fr, by - fr, fr * 2, fr * 2);
                    // a pulse of light rolls out from the edge of the hole
                    g.globalAlpha = f * 0.8;
                    g.strokeStyle = '#fff1d8';
                    g.lineWidth = R * 0.03 * (1 - fk) + 1;
                    g.beginPath();
                    g.arc(bx, by, R * (1.02 + sm(fk) * 0.9), 0, 6.2832);
                    g.stroke();
                    g.globalAlpha = f * 0.3;
                    g.lineWidth = R * 0.12 * (1 - fk) + 2;
                    g.strokeStyle = '#ffb070';
                    g.stroke();
                    g.restore();
                }
                // the photon ring shimmers
                g.save();
                g.globalCompositeOperation = 'lighter';
                for (let j = 0; j < 3; j++) {
                    const a0 = t / 500 + j * 2.0944;
                    g.globalAlpha = 0.35 * (1 - q);
                    g.strokeStyle = '#fff3dc';
                    g.lineWidth = R * 0.02;
                    g.beginPath();
                    g.arc(bx, by, R * 1.02, a0, a0 + 0.5);
                    g.stroke();
                }
                g.restore();
            }
            if (ev === 'gamma') {
                // a sickly green at the edges, brighter for a moment after each burst
                const kick = bursts.reduce((m, b) => Math.max(m, 1 - (t - b.b) / 260), 0);
                const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.hypot(W, H) * 0.6);
                vg.addColorStop(0, 'rgba(125,255,106,0)');
                vg.addColorStop(1, 'rgba(125,255,106,' + (0.1 + 0.12 * Math.max(0, kick)) * (1 - q) + ')');
                g.globalAlpha = 1;
                g.fillStyle = vg;
                g.fillRect(0, 0, W, H);
            }
            // the loose charges: out from where the element broke, then over to another element and stuck there
            const drawBits = (p, sx, sy, fz, k, a) => {
                if (!p.near) {
                    // each charge heads for one of the few elements closest to where it broke off
                    p.near = P.filter(o => o !== p && !o.frag && o.sx != null)
                        .sort((x, y) => Math.hypot(x.sx - sx, x.sy - sy) - Math.hypot(y.sx - sx, y.sy - sy)).slice(0, 4);
                }
                p.bits.forEach(b => {
                    const o = p.near.length ? p.near[b.to % p.near.length] : null;
                    const out = sm(k * 2.2);
                    let x = sx + Math.cos(b.a + t / 900) * b.r * fz * out;
                    let y = sy + Math.sin(b.a + t / 900) * b.r * fz * out;
                    const m = sm((k - 0.4) / 0.8);
                    const col = b.plus ? '#ffe68a' : '#a9c6ff';
                    const orb = Math.max(7, fz * 0.45);
                    if (o && m > 0) {
                        // curves over to its new element and circles it
                        const ox = o.sx + Math.cos(b.w + t / 260) * orb;
                        const oy = o.sy + Math.sin(b.w + t / 260) * orb;
                        const cx = (x + ox) / 2 - (oy - y) * 0.35;
                        const cy = (y + oy) / 2 + (ox - x) * 0.35;
                        const bez = f => [(1 - f) * (1 - f) * x + 2 * (1 - f) * f * cx + f * f * ox, (1 - f) * (1 - f) * y + 2 * (1 - f) * f * cy + f * f * oy];
                        const [nx, ny] = bez(m);
                        // the thread it leaves behind, fading once it lands
                        g.globalAlpha = a * 0.45 * Math.min(1, m * 3) * (1 - sm((m - 0.85) / 0.15) * 0.7);
                        g.strokeStyle = col;
                        g.lineWidth = 0.8;
                        g.beginPath();
                        g.moveTo(nx, ny);
                        g.quadraticCurveTo((nx + o.sx) / 2 - (o.sy - ny) * 0.2, (ny + o.sy) / 2 + (o.sx - nx) * 0.2, o.sx, o.sy);
                        g.stroke();
                        x = nx;
                        y = ny;
                        if (m >= 0.995 && !b.landed) {
                            b.landed = true;
                            pulses.push({ o, b: t, col });
                        }
                    }
                    const sz = Math.max(8, Math.min(22, fz * 0.38));
                    g.save();
                    g.globalCompositeOperation = 'lighter';
                    g.globalAlpha = a * Math.min(1, k * 3) * 0.8;
                    g.drawImage(glowSprite(b.plus ? '#ffd860' : '#7aa8ff'), x - sz * 1.4, y - sz * 1.4, sz * 2.8, sz * 2.8);
                    g.restore();
                    g.globalAlpha = Math.min(1, a * 1.2) * Math.min(1, k * 3);
                    drawGlyph(g, b.plus ? '+' : '−', b.plus ? '#fff2c0' : '#d6e4ff', fam, sz, x, y);
                });
            };
            const drawGamma = (t, q, u) => {
                if (t > nextBurst && u < 0.6) {
                    // somewhere in the field, a short-lived source fires two jets out opposite ways
                    bursts.push({ x: W * (0.15 + Math.random() * 0.7), y: H * (0.15 + Math.random() * 0.7), a: Math.random() * 6.2832, b: t, s: 0.7 + Math.random() * 0.6 });
                    nextBurst = t + 700 + Math.random() * 900;
                }
                const far = Math.hypot(W, H);
                g.save();
                g.globalCompositeOperation = 'lighter';
                for (let j = bursts.length - 1; j >= 0; j--) {
                    const B = bursts[j];
                    const k = (t - B.b) / 900;
                    if (k >= 1) {
                        bursts.splice(j, 1);
                        continue;
                    }
                    const f = (1 - q) * Math.pow(1 - k, 1.6);
                    // shock ring
                    g.globalAlpha = f * 0.5;
                    g.strokeStyle = '#7dff6a';
                    g.lineWidth = 2 * (1 - k) + 0.5;
                    g.beginPath();
                    g.arc(B.x, B.y, sm(k) * Math.min(W, H) * 0.55 * B.s, 0, 6.2832);
                    g.stroke();
                    // the jets: narrow cones that shoot out and fade
                    const len = far * sm(Math.min(1, k * 4));
                    [0, Math.PI].forEach(o => {
                        const an = B.a + o;
                        const ex = B.x + Math.cos(an) * len;
                        const ey = B.y + Math.sin(an) * len;
                        const nx = -Math.sin(an);
                        const ny = Math.cos(an);
                        const wid = (6 + 22 * k) * B.s;
                        // a wider, fainter sheath round the jet
                        const sh = g.createLinearGradient(B.x, B.y, ex, ey);
                        sh.addColorStop(0, 'rgba(90,255,200,' + f * 0.35 + ')');
                        sh.addColorStop(1, 'rgba(90,255,200,0)');
                        g.globalAlpha = 1;
                        g.fillStyle = sh;
                        g.beginPath();
                        g.moveTo(B.x, B.y);
                        g.lineTo(ex + nx * wid * 2.6, ey + ny * wid * 2.6);
                        g.lineTo(ex - nx * wid * 2.6, ey - ny * wid * 2.6);
                        g.closePath();
                        g.fill();
                        const gr = g.createLinearGradient(B.x, B.y, ex, ey);
                        gr.addColorStop(0, 'rgba(235,255,228,' + f + ')');
                        gr.addColorStop(0.25, 'rgba(125,255,106,' + f * 0.55 + ')');
                        gr.addColorStop(1, 'rgba(125,255,106,0)');
                        g.globalAlpha = 1;
                        g.fillStyle = gr;
                        g.beginPath();
                        g.moveTo(B.x + nx * 1.5, B.y + ny * 1.5);
                        g.lineTo(ex + nx * wid, ey + ny * wid);
                        g.lineTo(ex - nx * wid, ey - ny * wid);
                        g.lineTo(B.x - nx * 1.5, B.y - ny * 1.5);
                        g.closePath();
                        g.fill();
                        // bright core down the middle
                        g.globalAlpha = f * 0.9;
                        g.strokeStyle = '#f2fff0';
                        g.lineWidth = 1.2;
                        g.beginPath();
                        g.moveTo(B.x, B.y);
                        g.lineTo(B.x + Math.cos(an) * len * 0.7, B.y + Math.sin(an) * len * 0.7);
                        g.stroke();
                        // knots of light racing out along it
                        for (let i = 0; i < 5; i++) {
                            const f2 = ((t - B.b) / 380 + i / 5 + B.s) % 1;
                            const d2 = far * f2;
                            if (d2 > len) {
                                continue;
                            }
                            const r2 = (3 + 5 * (1 - f2)) * B.s;
                            g.globalAlpha = f * (1 - f2);
                            g.drawImage(glowSprite('#eaffe4'), B.x + Math.cos(an) * d2 - r2, B.y + Math.sin(an) * d2 - r2, r2 * 2, r2 * 2);
                        }
                    });
                    // the source itself, white hot then gone
                    const fr = (18 + 40 * (1 - k)) * B.s;
                    g.globalAlpha = (1 - q) * Math.pow(1 - k, 3);
                    g.drawImage(glowSprite('#f2fff0'), B.x - fr, B.y - fr, fr * 2, fr * 2);
                    g.drawImage(glowSprite('#7dff6a'), B.x - fr * 2, B.y - fr * 2, fr * 4, fr * 4);
                    // the whole field flashes for a moment
                    if (k < 0.12) {
                        g.globalAlpha = (1 - k / 0.12) * 0.16 * (1 - q);
                        g.fillStyle = '#b8ffaa';
                        g.fillRect(0, 0, W, H);
                    }
                }
                g.restore();
                // decay particles: alpha ones short and fat, beta ones quick and thin
                for (let j = specks.length - 1; j >= 0; j--) {
                    const P2 = specks[j];
                    const k = (t - P2.b) / P2.L;
                    if (k >= 1) {
                        specks.splice(j, 1);
                        continue;
                    }
                    const sp = P2.beta ? 1.8 : 0.9;
                    const x = P2.x + P2.vx * (t - P2.b) * sp;
                    const y = P2.y + P2.vy * (t - P2.b) * sp;
                    g.globalAlpha = (1 - k) * (1 - q) * 0.9;
                    g.strokeStyle = P2.beta ? '#c9ffbd' : '#7dff6a';
                    g.lineWidth = P2.beta ? 1 : 2.2;
                    g.beginPath();
                    g.moveTo(x, y);
                    g.lineTo(x - P2.vx * (P2.beta ? 40 : 14), y - P2.vy * (P2.beta ? 40 : 14));
                    g.stroke();
                }
            };
            const drawHyper = (t, q) => {
                // now and then a faint crackle jumps between two charged elements that are close together
                if (Math.random() < (lowDetail ? 0.06 : 0.14) && arcs.length < 5) {
                    const on = P.filter(p => p.ion && p.sx != null && p.sx > 0 && p.sx < W && p.sy > 0 && p.sy < H);
                    if (on.length > 1) {
                        const A = on[Math.random() * on.length | 0];
                        let best = null;
                        on.forEach(o => {
                            const dd = Math.hypot(o.sx - A.sx, o.sy - A.sy);
                            if (o !== A && dd < Math.min(W, H) * 0.35 && (!best || dd < best.dd)) {
                                best = { o, dd };
                            }
                        });
                        if (best) {
                            arcs.push({ A, B: best.o, b: t, seed: Math.random() * 1000 });
                        }
                    }
                }
                for (let j = arcs.length - 1; j >= 0; j--) {
                    const R = arcs[j];
                    const k = (t - R.b) / 180;
                    if (k >= 1) {
                        arcs.splice(j, 1);
                        continue;
                    }
                    const segs = 7;
                    const dx = R.B.sx - R.A.sx;
                    const dy = R.B.sy - R.A.sy;
                    const L = Math.hypot(dx, dy) || 1;
                    g.beginPath();
                    for (let i = 0; i <= segs; i++) {
                        const f = i / segs;
                        const off = i === 0 || i === segs ? 0 : Math.sin(R.seed + i * 12.9898 + Math.floor(t / 45) * 3.1) * L * 0.08;
                        const X = R.A.sx + dx * f - dy / L * off;
                        const Y = R.A.sy + dy * f + dx / L * off;
                        if (i) {
                            g.lineTo(X, Y);
                        } else {
                            g.moveTo(X, Y);
                        }
                    }
                    g.save();
                    g.globalCompositeOperation = 'lighter';
                    g.strokeStyle = '#ffd860';
                    g.globalAlpha = (1 - k) * 0.25 * (1 - q);
                    g.lineWidth = 5;
                    g.stroke();
                    g.strokeStyle = '#fff6d8';
                    g.globalAlpha = (1 - k) * 0.85 * (1 - q);
                    g.lineWidth = 1;
                    g.stroke();
                    [R.A, R.B].forEach(E => g.drawImage(glowSprite('#ffd860'), E.sx - 9, E.sy - 9, 18, 18));
                    g.restore();
                }
                for (let j = pulses.length - 1; j >= 0; j--) {
                    const R = pulses[j];
                    const k = (t - R.b) / 380;
                    if (k >= 1) {
                        pulses.splice(j, 1);
                        continue;
                    }
                    g.globalAlpha = (1 - k) * 0.6 * (1 - q);
                    g.strokeStyle = R.col;
                    g.lineWidth = 1;
                    g.beginPath();
                    g.arc(R.o.sx, R.o.sy, 6 + k * 18, 0, 6.2832);
                    g.stroke();
                }
            };
            P.forEach(p => {
                let d = p.z - cz;
                if (d < 0.35 || p.gone) {
                    spawn(p, 13 + Math.random() * 2, cz);
                    p.b = t;
                    p.gone = false;
                    d = p.z - cz;
                }
                let px = p.x;
                let py = p.y;
                let fade = 1;
                if (hole) {
                    // pulled to the hole in 3d, far ones grow and near ones shrink
                    const [bx, by, R] = hole;
                    const k = Math.min(1, (t - p.b) / p.L);
                    const e = k * k;
                    px += (cxw + (bx - W / 2) * 6 / Pp - px) * e;
                    py += (cyw + (by - H / 2) * 6 / Pp - py) * e;
                    d += (6 - d) * e;
                    const [hx, hy] = pr(px, py, d);
                    fade = sm((Math.hypot(hx - bx, hy - by) - R * 0.9) / (R * 0.3));
                    if (fade <= 0) {
                        p.gone = true;
                        return;
                    }
                    p.pull = e;
                    p.ang = Math.atan2(by - hy, bx - hx);
                }
                let [sx, sy] = pr(px, py, d);
                // about to come apart: it shivers first
                if (p.frag && d < p.frag + 1.5 && d >= p.frag) {
                    const sh = (1 - (d - p.frag) / 1.5) * Math.max(1, base * p.s / d * 0.08);
                    sx += (Math.random() - 0.5) * sh * 2;
                    sy += (Math.random() - 0.5) * sh * 2;
                }
                p.sx = sx;
                p.sy = sy;
                const a = Math.min(1, (d - 0.35) / 0.9) * (d > 10 ? (14 - d) / 4 : 1) * 0.8 * (1 - q * 0.92) * fade;
                if (p.frag && d < p.frag) {
                    const k0 = (p.frag - d) / 0.5;
                    if (k0 < 1) {
                        // the snap as it splits
                        const fr = Math.max(8, base * p.s / d) * (1 + k0 * 1.5);
                        g.globalAlpha = a * (1 - k0) * 0.8;
                        g.drawImage(glowSprite('#fff4c8'), sx - fr, sy - fr, fr * 2, fr * 2);
                    }
                    drawBits(p, sx, sy, Math.max(5, base * p.s / d), (p.frag - d) / 2.2, a);
                    if ((p.frag - d) / 0.6 >= 1) {
                        return;
                    }
                }
                if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) {
                    return;
                }
                if (a <= 0) {
                    return;
                }
                if (!hole && (q > 0 || sk === 'warp')) {
                    const [ex, ey] = pr(px, py, d + q * q * 3.5 + (sk === 'warp' ? 0.9 : 0));
                    g.globalAlpha = a * 0.7;
                    g.strokeStyle = tier ? acc : SK.st;
                    g.lineWidth = 1.5;
                    g.beginPath();
                    g.moveTo(sx, sy);
                    g.lineTo(ex, ey);
                    g.stroke();
                }
                g.globalAlpha = p.frag && d < p.frag ? a * (1 - (p.frag - d) / 0.6) : a;
                const fz = Math.max(5, base * p.s / d);
                if (p.rad) {
                    const fl = 0.55 + 0.45 * Math.sin(t / 90 + p.fl) * Math.sin(t / 37 + p.fl * 2);
                    const gr = Math.min(fz * 1.5, 46);
                    g.globalAlpha = a * fl * 0.85;
                    g.drawImage(glowSprite('#7dff6a'), sx - gr, sy - gr, gr * 2, gr * 2);
                    g.globalAlpha = a;
                    drawGlyph(g, p.t, '#d4ffc9', fam, fz, sx, sy);
                    // every so often it decays: a few quick particles shoot off
                    if (t > p.dk && fz > 9 && specks.length < (lowDetail ? 60 : 160)) {
                        if (p.dk) {
                            const n = 2 + (Math.random() * 4 | 0);
                            for (let j = 0; j < n; j++) {
                                const an = Math.random() * 6.2832;
                                const v = (0.25 + Math.random() * 0.6) * Math.max(1, fz / 18);
                                specks.push({ x: sx, y: sy, vx: Math.cos(an) * v, vy: Math.sin(an) * v, b: t, L: 260 + Math.random() * 260, beta: Math.random() < 0.6 });
                            }
                            g.globalAlpha = a;
                            g.drawImage(glowSprite('#eaffe4'), sx - fz, sy - fz, fz * 2, fz * 2);
                        }
                        p.dk = t + 250 + Math.random() * 1400;
                    }
                    return;
                }
                if (p.ion && fz > 10) {
                    const ang = t / 300 + p.fl;
                    const rr = fz * 0.75;
                    g.globalAlpha = a * 0.6;
                    g.drawImage(glowSprite('#ffe9a0'), sx + Math.cos(ang) * rr - 3, sy + Math.sin(ang) * rr * 0.45 - 3, 6, 6);
                    g.globalAlpha = a;
                }
                if (sk === 'holographic') {
                    g.globalAlpha = a * 0.6;
                    drawGlyph(g, p.lab, '#ff4fd8', fam, fz, sx - 1.5, sy);
                    drawGlyph(g, p.lab, '#3ff0ff', fam, fz, sx + 1.5, sy);
                    g.globalAlpha = a;
                }
                if (hole && p.pull > 0.3) {
                    // stretched out towards the hole and reddening as it goes
                    const st2 = (p.pull - 0.3) / 0.7;
                    g.save();
                    g.translate(sx, sy);
                    g.rotate(p.ang);
                    g.scale(1 + st2 * 2.2, 1 - st2 * 0.55);
                    drawGlyph(g, p.lab, SK.fg, fam, fz, 0, 0);
                    g.globalAlpha = a * st2;
                    drawGlyph(g, p.lab, '#ff9a5a', fam, fz, 0, 0);
                    g.restore();
                    return;
                }
                drawGlyph(g, p.lab, p.ion ? '#efe9c4' : SK.fg, fam, fz, sx, sy);
            });
            if (ev === 'gamma') {
                drawGamma(t, q, u);
            }
            if (ev === 'hyper') {
                drawHyper(t, q);
            }
            let bang = 0;
            C.forEach(p => {
                let d = p.z - cz;
                if (d < 0.35) {
                    cSpawn(p, 13 + Math.random() * 2, cz);
                    d = p.z - cz;
                }
                const a = Math.min(1, (d - 0.35) / 0.9) * (d > 10 ? (14 - d) / 4 : 1) * 0.95 * (1 - q * 0.92);
                if (a <= 0) {
                    return;
                }
                const k = Math.min(1, (d - p.dc) / 3);
                const fz = Math.max(5, base * p.s / d);
                if (k > 0) {
                    [[p.t, 1], [p.t2, -1]].forEach(([sym, s]) => {
                        const [sx, sy] = pr(p.x + p.ox * k * s, p.y + p.oy * k * s, d);
                        if (k < 0.8) {
                            const [tx, ty] = pr(p.x + p.ox * Math.min(1, k + 0.35) * s, p.y + p.oy * Math.min(1, k + 0.35) * s, d);
                            g.globalAlpha = a * 0.7 * (1 - k / 0.8);
                            g.strokeStyle = '#5fd4ff';
                            g.lineWidth = Math.max(1, base * 0.05 / d);
                            g.beginPath();
                            g.moveTo(sx, sy);
                            g.lineTo(tx, ty);
                            g.stroke();
                        }
                        g.globalAlpha = a;
                        drawGlyph(g, sym, k < 0.5 ? '#bfefff' : SK.fg, fam, fz, sx, sy);
                    });
                    return;
                }
                const [sx, sy] = pr(p.x, p.y, d);
                const since = p.dc - d;
                if (since < 1.3) {
                    const f = 1 - since / 1.3;
                    const rr = base * 2.6 / d * (0.4 + since);
                    const fl = g.createRadialGradient(sx, sy, 0, sx, sy, rr);
                    fl.addColorStop(0, 'rgba(255,255,255,' + f * a + ')');
                    fl.addColorStop(0.35, 'rgba(95,212,255,' + f * 0.6 * a + ')');
                    fl.addColorStop(1, 'rgba(95,212,255,0)');
                    g.globalAlpha = 1;
                    g.fillStyle = fl;
                    g.fillRect(sx - rr, sy - rr, rr * 2, rr * 2);
                    // shockwave
                    const ring = base * (0.5 + since * 3.2) / d;
                    g.globalAlpha = a * f * 0.85;
                    g.strokeStyle = '#5fd4ff';
                    g.lineWidth = Math.max(1, base * 0.06 / d);
                    g.beginPath();
                    g.arc(sx, sy, ring, 0, 6.2832);
                    for (let j = 0; j < 8; j++) {
                        const sa = p.sa + j * 0.785;
                        g.moveTo(sx + Math.cos(sa) * ring * 0.6, sy + Math.sin(sa) * ring * 0.6);
                        g.lineTo(sx + Math.cos(sa) * ring * 1.25, sy + Math.sin(sa) * ring * 1.25);
                    }
                    g.stroke();
                    bang = Math.max(bang, f * a * Math.min(1, 3 / d));
                }
                g.globalAlpha = a;
                drawGlyph(g, p.f, since < 1.3 ? '#bfefff' : SK.fg, fam, fz, sx, sy);
            });
            if (bang > 0.05) {
                // flash for close hits
                g.globalAlpha = bang * 0.22;
                g.fillStyle = '#5fd4ff';
                g.fillRect(0, 0, W, H);
            }
            Q.forEach(p => {
                let d = p.z - cz;
                if (d < 0.35) {
                    qSpawn(p, 13 + Math.random() * 2, cz);
                    d = p.z - cz;
                }
                // swirl round the centre of the field, faster as they come close
                const spin = p.w * (1.2 + 3 / d);
                const ang = p.a0 + spin * t / 1000;
                let [sx, sy] = pr(Math.cos(ang) * p.r0, Math.sin(ang) * p.r0, d);
                // at the lock, the storm pours into the find
                const tgq = tgAt[p.c % N] || tgAt[0];
                const pull = tgq && p.k === 0 ? sm((t - T1 + 120 - (p.sp % 1) * 260) / 420) : 0;
                if (pull > 0) {
                    if (pull >= 1) {
                        return;
                    }
                    sx += (tgq[0] - sx) * pull * pull;
                    sy += (tgq[1] - sy) * pull * pull;
                    const rq = Math.max(2, base * 0.06) * (1 - pull * 0.5);
                    g.save();
                    g.globalCompositeOperation = 'lighter';
                    g.globalAlpha = 0.9;
                    g.drawImage(qsSprite(p.c), sx - rq * 3, sy - rq * 3, rq * 6, rq * 6);
                    g.restore();
                    return;
                }
                if (sx < -40 || sx > W + 40 || sy < -40 || sy > H + 40) {
                    return;
                }
                const a = Math.min(1, (d - 0.35) / 0.9) * (d > 10 ? (14 - d) / 4 : 1) * (1 - q * 0.95);
                if (a <= 0) {
                    return;
                }
                const r = Math.max(1.8, base * 0.085 / d);
                const glow = r * 3.4;
                // a trail along the swirl
                g.save();
                g.globalCompositeOperation = 'lighter';
                g.globalAlpha = a * 0.45;
                g.strokeStyle = QS_COLS[p.c];
                g.lineWidth = Math.max(1, r * 0.8);
                g.beginPath();
                for (let s = 0; s <= 10; s++) {
                    const b2 = ang - spin * s * 0.035;
                    const [tx, ty] = pr(Math.cos(b2) * p.r0, Math.sin(b2) * p.r0, d + s * 0.05);
                    if (s) {
                        g.lineTo(tx, ty);
                    } else {
                        g.moveTo(tx, ty);
                    }
                }
                g.stroke();
                g.restore();
                g.globalAlpha = a;
                if (!p.k) {
                    g.drawImage(qsSprite(p.c), sx - glow, sy - glow, glow * 2, glow * 2);
                    return;
                }
                const turn = p.sp + t / 420 * p.w;
                const pts = [0, 1, 2].map(j => [sx + Math.cos(turn + j * 2.094) * r * 2.4, sy + Math.sin(turn + j * 2.094) * r * 2.4]);
                if (r > 1.8) {
                    g.globalAlpha = a * 0.55;
                    g.strokeStyle = '#f0c419';
                    g.lineWidth = Math.max(0.6, r * 0.28);
                    g.beginPath();
                    pts.forEach((A, j) => {
                        const B = pts[(j + 1) % 3];
                        const nx = -(B[1] - A[1]);
                        const ny = B[0] - A[0];
                        const L = Math.hypot(nx, ny) || 1;
                        for (let s = 0; s <= 8; s++) {
                            const f = s / 8;
                            const o = Math.sin(f * Math.PI * 4 + t / 90) * r * 0.45 * Math.sin(f * Math.PI);
                            const X = A[0] + (B[0] - A[0]) * f + nx / L * o;
                            const Y = A[1] + (B[1] - A[1]) * f + ny / L * o;
                            if (s) {
                                g.lineTo(X, Y);
                            } else {
                                g.moveTo(X, Y);
                            }
                        }
                    });
                    g.stroke();
                    g.globalAlpha = a;
                }
                const gl = glow * 0.75;
                pts.forEach((A, j) => g.drawImage(qsSprite(j), A[0] - gl, A[1] - gl, gl * 2, gl * 2));
            });
            const st = 0.45 + 0.55 * sm((u - 0.55) / 0.1);
            if (ev === 'vacuum' && t < T1 - 460) {
                // nothing to lock onto: the brackets hunt about the dark
                if (t > seek.at) {
                    seek.fx = seek.x;
                    seek.fy = seek.y;
                    seek.x = W * (0.15 + Math.random() * 0.7);
                    seek.y = H * (0.2 + Math.random() * 0.6);
                    seek.s = 14 + Math.random() * 22;
                    seek.from = t;
                    seek.at = t + 260 + Math.random() * 260;
                }
                const k = sm((t - seek.from) / 140);
                const x = seek.fx + (seek.x - seek.fx) * k;
                const y = seek.fy + (seek.y - seek.fy) * k;
                const h = seek.s * (1.4 - 0.4 * k);
                g.globalAlpha = 0.3 + 0.3 * k;
                g.strokeStyle = '#8aa2ff';
                g.lineWidth = 1.2;
                g.beginPath();
                [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => {
                    g.moveTo(x + a * h, y + b * h * 0.7 - b * 6);
                    g.lineTo(x + a * h, y + b * h * 0.7);
                    g.lineTo(x + a * h - a * 6, y + b * h * 0.7);
                });
                g.stroke();
            }
            T.forEach((tg, i) => {
                const [px, py] = pr(tg.x, tg.y, dt);
                const sx = px + ((targets ? targets[i].x : W * (i + 0.5) / N) - px) * w2;
                const sy = py + ((targets ? targets[i].y : H / 2) - py) * w2;
                const sz = fsA[i] * st / dt;
                const o = i * 40;
                const ac = ACC[tiers[i]];
                const hl = t >= T1 - 60 || (t >= T1 - 240 + o && t < T1 - 150 + o) || (two[i] && t >= T1 - 450 + o && t < T1 - 360 + o);
                g.globalAlpha = 1;
                if (hl) {
                    const h = Math.max(16, sz * 0.9) * (1 + (1 - w) * 0.6);
                    g.strokeStyle = ac;
                    g.lineWidth = 2;
                    g.beginPath();
                    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => {
                        g.moveTo(sx + a * h, sy + b * h * 0.7 - b * 8);
                        g.lineTo(sx + a * h, sy + b * h * 0.7);
                        g.lineTo(sx + a * h - a * 8, sy + b * h * 0.7);
                    });
                    if (u < 0.95) {
                        g.stroke();
                    }
                }
                g.globalAlpha = hl ? 1 : 0.8 * Math.min(1, (dt - 0.35) / 0.9);
                tgAt[i] = [sx, sy];
                if (storm && t > T1 + 180) {
                    // a gold ring as the last of the storm lands
                    const k = (t - T1 - 180) / 600;
                    if (k < 1) {
                        g.save();
                        g.globalCompositeOperation = 'lighter';
                        g.globalAlpha = (1 - k) * 0.8;
                        g.strokeStyle = '#f0c419';
                        g.lineWidth = 2 * (1 - k) + 0.5;
                        g.beginPath();
                        g.arc(sx, sy, sz * (0.7 + k * 1.8), 0, 6.2832);
                        g.stroke();
                        const fr = sz * (1 + k);
                        g.globalAlpha = (1 - k) * 0.5;
                        g.drawImage(glowSprite('#f0c419'), sx - fr, sy - fr, fr * 2, fr * 2);
                        g.restore();
                    }
                }
                if (ev === 'collider' && t >= T1 - 40) {
                    const k = (t - T1 + 40) / 500;
                    if (k < 1) {
                        g.save();
                        g.globalCompositeOperation = 'lighter';
                        const fr = sz * (1.2 + k * 2.5);
                        g.globalAlpha = (1 - k) * 0.7;
                        g.drawImage(glowSprite('#5fd4ff'), sx - fr, sy - fr, fr * 2, fr * 2);
                        g.globalAlpha = (1 - k) * 0.85;
                        g.strokeStyle = '#bfefff';
                        g.lineWidth = 1.5;
                        g.beginPath();
                        g.arc(sx, sy, sz * (0.6 + k * 3), 0, 6.2832);
                        g.stroke();
                        g.restore();
                    }
                }
                if (ev === 'gamma' && t >= T1 && !tg.burst) {
                    // the find goes off like one of the bursts
                    tg.burst = true;
                    bursts.push({ x: sx, y: sy, a: Math.random() * 6.2832, b: t, s: 1.15 });
                }
                if (ev === 'hyper' && t > T1 - 200) {
                    // loose charges gather round the find and settle into it
                    const e = sm((t - T1 + 200) / 500);
                    const fade = 1 - sm((u - 0.88) / 0.12);
                    g.save();
                    g.globalCompositeOperation = 'lighter';
                    for (let j = 0; j < 8; j++) {
                        const an = j / 8 * 6.2832 + t / 520 * (j % 2 ? 1 : -1);
                        const rr = sz * (2.6 - 1.7 * e);
                        const cx2 = sx + Math.cos(an) * rr;
                        const cy2 = sy + Math.sin(an) * rr * 0.6;
                        const plus = j % 2 === 0;
                        const s2 = Math.max(8, sz * 0.22);
                        g.globalAlpha = e * fade * 0.75;
                        g.drawImage(glowSprite(plus ? '#ffd860' : '#7aa8ff'), cx2 - s2 * 1.4, cy2 - s2 * 1.4, s2 * 2.8, s2 * 2.8);
                        g.globalAlpha = e * fade;
                        drawGlyph(g, plus ? '+' : '−', plus ? '#fff2c0' : '#d6e4ff', fam, s2, cx2, cy2);
                    }
                    g.restore();
                }
                if (ev === 'vacuum') {
                    // locks onto nothing, then the element slowly comes up out of the dark
                    const e = sm((t - T1 + 80) / (total - T1));
                    if (e <= 0) {
                        return;
                    }
                    // faint light drawn in from all round, spiralling into the find
                    g.save();
                    g.globalCompositeOperation = 'lighter';
                    const reach = Math.min(W / N, H) * 0.45;
                    const at = f => {
                        const rr = (sz * 0.3 + m0.r * reach / 2.5) * (1 - f);
                        const an = m0.a + (1 - f) * 2.4;
                        return [sx + Math.cos(an) * rr * 1.25, sy + Math.sin(an) * rr * 0.85];
                    };
                    let m0 = null;
                    motes[i].forEach(m => {
                        m0 = m;
                        const f = sm((e - m.d) / (1 - m.d));
                        if (f <= 0 || f >= 1) {
                            return;
                        }
                        const [x1, y1] = at(f);
                        const [x0, y0] = at(Math.max(0, f - 0.08));
                        g.globalAlpha = Math.sin(Math.PI * f) * 0.9;
                        g.strokeStyle = f > 0.65 ? '#dfe5ff' : '#6f84ff';
                        g.lineWidth = m.s * 1.6;
                        g.beginPath();
                        g.moveTo(x0, y0);
                        g.lineTo(x1, y1);
                        g.stroke();
                    });
                    g.restore();
                    const hr = sz * (0.9 + e * 0.9);
                    g.globalAlpha = e * 0.45;
                    g.drawImage(glowSprite('#4a5cff'), sx - hr, sy - hr, hr * 2, hr * 2);
                    // a ring of bent light once it's mostly through
                    const lk = (e - 0.55) / 0.45;
                    if (lk > 0 && lk < 1) {
                        g.globalAlpha = (1 - lk) * 0.5;
                        g.strokeStyle = '#b8c4ff';
                        g.lineWidth = 1.5 * (1 - lk) + 0.4;
                        g.beginPath();
                        g.ellipse(sx, sy, sz * (0.6 + lk * 1.8), sz * (0.45 + lk * 1.3), 0, 0, 6.2832);
                        g.stroke();
                    }
                    // a soft bloom the moment it's whole
                    const bl = (e - 0.7) / 0.3;
                    if (bl > 0 && bl < 1) {
                        const br = sz * (1.2 + bl * 1.4);
                        g.save();
                        g.globalCompositeOperation = 'lighter';
                        g.globalAlpha = Math.sin(Math.PI * bl) * 0.5;
                        g.drawImage(glowSprite('#c8d2ff'), sx - br, sy - br, br * 2, br * 2);
                        g.restore();
                    }
                    g.globalAlpha = Math.pow(e, 1.4) * 0.9;
                    drawGlyph(g, labels[i], '#7f93ff', fam, sz, sx, sy);
                    g.globalAlpha = sm((e - 0.45) / 0.55);
                    drawGlyph(g, labels[i], SK.hi, fam, sz, sx, sy);
                    return;
                }
                drawGlyph(g, labels[i], hl ? (u > 0.65 ? SK.hi : ac) : SK.fg, fam, sz, sx, sy);
            });
            g.globalAlpha = 0.9;
            g.fillStyle = acc;
            g.font = '600 11px ' + fam;
            g.textBaseline = 'alphabetic';
            g.textAlign = 'left';
            g.fillText(u < 0.65 ? (ev === 'vacuum' ? 'SEARCHING' + '...'.slice(0, (t / 300 | 0) % 4) : 'FIELD SCAN') : (N > 1 ? 'LOCK x' + N : 'LOCK'), 18, 26);
            g.textAlign = 'right';
            g.fillText('RNG ' + D.toFixed(1), W - 18, 26);
            if (ev) {
                g.textAlign = 'left';
                g.fillStyle = EV_HUD[ev][1];
                g.globalAlpha = 0.75 + 0.25 * Math.sin(t / 160);
                g.fillText(EV_HUD[ev][0], 18, H - 18);
                g.fillStyle = acc;
                g.globalAlpha = 0.9;
            }
            g.textBaseline = 'middle';
            g.textAlign = 'center';
            if (u < 0.65) {
                g.globalAlpha = 0.25;
                g.strokeStyle = SK.fg;
                g.lineWidth = 1;
                g.beginPath();
                g.moveTo(W / 2 - 10, H / 2);
                g.lineTo(W / 2 + 10, H / 2);
                g.moveTo(W / 2, H / 2 - 10);
                g.lineTo(W / 2, H / 2 + 10);
                g.stroke();
            }
            if (u >= 1) {
                fin();
            } else {
                requestAnimationFrame(frame);
            }
        })(performance.now());
    });
}
