import asyncio, threading, http.server, functools
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, site
SITE = site('preview')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8783), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:8783/index.html'
fails = []
def check(name, ok, info=''):
    print(('ok   ' if ok else 'FAIL ') + name + (' | ' + str(info) if info != '' else ''))
    if not ok:
        fails.append(name)
FILL = "(()=>{net().nodes.forEach(n=>netState[n.id]=1); saveNet(); netVer++; buffCache=weightCache=null; applyCosmetics()})()"
JOKE = "(s=>{const e=elementBySymbol[s]; addRecord({formula:s,name:e[1],elements:[e],rarity:'',log:exactRarity([e],0),score:rollScore([e])}); save(); applyCosmetics()})"
async def fresh(b, vp):
    ctx = await b.new_context(viewport=vp); pg = await ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(URL); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('elementalJokeIntro','1')")
    await pg.reload(); await pg.wait_for_timeout(600)
    await pg.evaluate("document.getElementById('dlg') && closeDialog(); document.getElementById('fxPreview').style.display='none'")
    return ctx, pg, errs
async def m():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx, pg, errs = await fresh(b, {'width': 1280, 'height': 860})
        ev = pg.evaluate
        check('no tab before any cosmetic is unlocked', await ev("$('shopTabs').hidden"))
        await ev(FILL)
        check('tab shows once Outer Ring 1 unlocks cosmetics', not await ev("$('shopTabs').hidden"))
        check('unlock toast', await ev("new Promise(r=>setTimeout(()=>r($('achievementToastKicker').textContent),1700))") == 'Cosmetic unlocked')
        await ev("go('shop'); shopTab('cos')"); await pg.wait_for_timeout(200)
        cards = await ev("[...document.querySelectorAll('#cosGrid .cos-card h3')].map(h=>h.textContent)")
        check('ring cosmetics listed, Warp and Game Over not yet', cards == ['Oscilloscope', 'Holographic', 'Blueprint', 'Lab notebook', 'Retro spawn effects', 'Astral spawn effects'], cards)
        check('cannot afford with 0 quarks', await ev("document.querySelector('.cos-buy[data-id=blueprint]').disabled"))
        await ev("addQuarks(500000)"); await ev("renderCosmetics()")
        await pg.click('.cos-buy[data-id=blueprint]'); await pg.wait_for_timeout(100)
        r = await ev("[quarks, document.documentElement.dataset.skin, JSON.parse(localStorage.getItem('elementalCosmetics')).owned]")
        check('buying Blueprint charges 40,000 and puts it on', r[0] == 460000 and r[1] == 'blueprint' and r[2] == ['blueprint'], r)
        await pg.screenshot(path=SP + 'cos_shop_blueprint.png')
        await pg.click('.cos-use[data-id=blueprint]'); await pg.wait_for_timeout(50)
        check('take off', await ev("document.documentElement.dataset.skin") is None)
        await pg.click('.cos-use[data-id=blueprint]')
        await pg.click('.cos-buy[data-id=oscilloscope]')
        check('scanner bought and in use', await ev("scannerSkin()") == 'oscilloscope')
        await ev(JOKE + "('Zo')"); await ev(JOKE + "('Gg')"); await ev("renderCosmetics()")
        r = await ev("[[...document.querySelectorAll('#cosGrid .cos-card h3')].map(h=>h.textContent), !$('finalBadge').hidden, !!document.querySelector('.cos-use[data-id=warp]')]")
        check('Zoomium and Gameoverium give Warp, Game Over and the badge for free', 'Warp' in r[0] and 'Game Over' in r[0] and 'Final Element' in r[0] and r[1] and r[2], r)
        check('joke finds do not count towards elements found', await ev("activeBuffStats().found.size") == 0)
        await pg.reload(); await pg.wait_for_timeout(500)
        r = await ev("[document.documentElement.dataset.skin, scannerSkin(), !$('finalBadge').hidden]")
        check('skins and badge survive a reload', r == ['blueprint', 'oscilloscope', True], r)
        # a skin that isn't owned is never applied, even if the save says so
        await ev("localStorage.setItem('elementalCosmetics', JSON.stringify({owned:[],page:'notebook',scanner:'holographic'}))"); await pg.reload(); await pg.wait_for_timeout(500)
        r = await ev("[document.documentElement.dataset.skin||'', scannerSkin()]")
        check('unowned skins are ignored', r == ['', ''], r)
        print('errors:', errs[:5]); await ctx.close()
        # screenshots of each skin
        for vp, tag in [({'width': 1280, 'height': 860}, 'd'), ({'width': 390, 'height': 844}, 'm')]:
            ctx, pg, errs = await fresh(b, vp)
            await pg.evaluate(FILL); await pg.evaluate(JOKE + "('Zo')"); await pg.evaluate(JOKE + "('Gg')")
            await pg.evaluate("(()=>{['H','O','C','Fe','Au','U'].forEach(s=>{const e=elementBySymbol[s]; addRecord({formula:s,name:e[1],elements:[e],rarity:'',log:exactRarity([e],0),score:e[2]})}); save(); cosState.owned=['oscilloscope','holographic','blueprint','notebook']; cosSave()})()")
            for page in ['', 'blueprint', 'notebook', 'gameover']:
                await pg.evaluate(f"cosState.page='{page}'; cosSave(); applyCosmetics(); go('menu')"); await pg.wait_for_timeout(250)
                await pg.screenshot(path=f'{SP}cos_{tag}_{page or "default"}_home.png')
                await pg.evaluate("go('collection')"); await pg.wait_for_timeout(250)
                await pg.evaluate("document.querySelectorAll('[data-tab]')[1].click()"); await pg.wait_for_timeout(250)
                await pg.screenshot(path=f'{SP}cos_{tag}_{page or "default"}_table.png')
            await pg.evaluate("cosState.page=''; applyCosmetics()")
            for sk in ['oscilloscope', 'holographic', 'warp']:
                await pg.evaluate(f"cosState.scanner='{sk}'; applyCosmetics(); go('game')"); await pg.wait_for_timeout(200)
                await pg.evaluate("doRoll(); 0")
                for k in range(3):
                    await pg.wait_for_timeout(600); await pg.screenshot(path=f'{SP}cos_{tag}_{sk}_{k}.png')
                await pg.wait_for_function("!rolling", timeout=60000)
            check('no page errors ' + tag, not errs, errs[:5])
            await ctx.close()
        await b.close()
    print('FAILED: ' + ', '.join(fails) if fails else 'all passed')
asyncio.run(m())
