// the shop and cloud saves go by the server's time
const trustedNow = () => clockBase ? clockBase.server + (performance.now() - clockBase.perf) : null;
async function clockSync() {
    if (!CLOUD.enabled) {
        // the preview copy has no server to ask
        clockBase = { server: Date.now(), perf: performance.now() };
        return true;
    }
    if (!sb) {
        return false;
    }
    const t0 = performance.now();
    // don't wait forever on a slow connection
    const wait = new Promise(resolve => setTimeout(() => resolve({}), 6000));
    let res;
    try {
        res = await Promise.race([sb.rpc('server_time'), wait]);
    } catch (e) {
        return false;
    }
    const { data, error } = res;
    const t1 = performance.now();
    const ms = typeof data === 'string' ? Date.parse(data) : NaN;
    if (error || !Number.isFinite(ms)) {
        return false;
    }
    clockBase = { server: ms + (t1 - t0) / 2, perf: t1 };
    return true;
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && clockBase) {
        clockSync();
    }
});
// wait until accounts have settled before asking for the time
function clockWaitForCloud() {
    return new Promise(resolve => {
        const t0 = Date.now();
        (function check() {
            const settled = !CLOUD.enabled || ['offline', 'signedout', 'disabled', 'error'].includes(cloudState) || (cloudUser && cloudProfileReady);
            if (settled || Date.now() - t0 > 8000) {
                resolve();
            } else {
                setTimeout(check, 200);
            }
        })();
    });
}
// the shop waits for this, so it counts as done even if it fails
async function clockStart() {
    try {
        localStorage.removeItem('awayLastSeen');
    } catch (e) { }
    await clockWaitForCloud();
    try {
        await clockSync();
    } finally {
        clockTried = true;
    }
}
