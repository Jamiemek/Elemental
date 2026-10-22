(function () {
    const sess = () => JSON.parse(localStorage.getItem('mockSession') || 'null');
    let cb = null;
    class Q {
        constructor(t) { this.t = t; this.f = {}; this.op = 'select'; this.one = false; }
        select() { return this; }
        eq(k, v) { this.f[k] = v; return this; }
        update(o) { this.op = 'update'; this.body = o; return this; }
        upsert(o) { this.op = 'upsert'; this.body = o; return this; }
        maybeSingle() { this.one = true; return this; }
        then(res, rej) {
            const s = sess();
            return window.mockServer(JSON.stringify({ kind: 'q', t: this.t, op: this.op, f: this.f, body: this.body, one: this.one, uid: s && s.id })).then(JSON.parse).then(res, rej);
        }
    }
    const client = {
        auth: {
            onAuthStateChange(f) { cb = f; const s = sess(); setTimeout(() => f('INITIAL_SESSION', s && { user: s }), 20); return { data: { subscription: { unsubscribe() { } } } }; },
            async signInWithOAuth({ options }) { localStorage.setItem('mockSession', JSON.stringify(window.__mockUser)); location.href = options.redirectTo + '?code=abc'; return { error: null }; },
            async signOut() { localStorage.removeItem('mockSession'); cb && cb('SIGNED_OUT', null); return { error: null }; }
        },
        from(t) { return new Q(t); },
        channel() { const ch = { on(ev, filt, cb) { window.__rtFire = row => cb({ new: row }); return ch; }, subscribe() { window.__rtOn = true; return ch; } }; return ch; },
        removeChannel() { window.__rtFire = null; window.__rtOn = false; },
        rpc(fn, args) { args = args || {}; const s = sess(); return window.mockServer(JSON.stringify({ kind: 'rpc', fn, args, uid: s && s.id })).then(JSON.parse); }
    };
    window.supabase = { createClient() { return client; } };
})();
