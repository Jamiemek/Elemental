import asyncio, json, threading, http.server, functools
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('preview')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8771), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
URL='http://127.0.0.1:8771/index.html'
SETUP="""(syms)=>{ syms.forEach(s=>{const e=ELEMENTS.find(x=>x[0]===s); addRecord({formula:s,name:e[1],elements:[e],rarity:'',log:exactRarity([e],0),score:e[2],count:3})}); save(); }"""
STATE="""()=>({rolls:totalRolls(), formulas:collection.length, quarks:Math.round(quarks*100)/100, hist:rollHistory.length, histTop:rollHistory[0]&&rollHistory[0].n,
  dlg: document.getElementById('dlg') && document.getElementById('dlg').innerText.replace(/\\n+/g,' | '), screen:[...document.querySelectorAll('.screen.active')].map(s=>s.id)[0],
  reel: document.querySelector('#rollResults .reel-symbol') && document.querySelector('#rollResults .reel-symbol').textContent })"""
async def run(b, hours, unlock=True, mode=None):
    ctx=await b.new_context(viewport={'width':1280,'height':860}); pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2')"+(";localStorage.setItem('elementalDisplay','score')" if mode=='score' else "")); await pg.reload(); await pg.wait_for_timeout(600)
    await pg.evaluate(SETUP, ['H','O','C','N','Fe','Pt','Ho'] if unlock else ['H','O','C'])
    expected=await pg.evaluate(f"awayRollsFor({hours*3600 if hours<24 else 86400})")
    before=await pg.evaluate(STATE)
    # simulate having closed the game hours ago
    await pg.goto('http://127.0.0.1:8771/privacy.html')
    await pg.evaluate(f"localStorage.setItem('awayLastSeen', JSON.stringify({{t:Date.now()-{hours}*3600*1000}}))")
    await pg.goto(URL); await pg.wait_for_timeout(500)
    await pg.wait_for_function("!!document.getElementById('dlg') || performance.now()>25000", timeout=60000)
    await pg.wait_for_timeout(300)
    after=await pg.evaluate(STATE)
    return pg, ctx, before, after, expected, errs
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg,ctx,bf,af,exp,errs=await run(b,3)
        print('3h away: expected', exp, 'rolls | roll total', bf['rolls'],'->',af['rolls'], '| +', af['rolls']-bf['rolls'], '| formulas', bf['formulas'],'->',af['formulas'], '| quarks', bf['quarks'],'->',af['quarks'])
        print('  history newest #', af['histTop'], '| entries', af['hist'], '| screen', af['screen'], '| reel shows', af['reel'])
        print('  popup:', af['dlg'])
        await pg.screenshot(path=SP+'away_desk.png')
        await pg.click('#awayOk'); await pg.wait_for_timeout(300)
        await pg.goto('http://127.0.0.1:8771/privacy.html'); await pg.goto(URL); await pg.wait_for_timeout(9500)
        print('  reopened straight away -> popup?', await pg.evaluate("!!document.getElementById('dlg')"), '| rolls', await pg.evaluate("totalRolls()"))
        await ctx.close()
        pg,ctx,bf,af,exp,errs2=await run(b,30, mode='score')
        print('30h away (score mode): expected', exp, '| +', af['rolls']-bf['rolls'], '| popup:', af['dlg'])
        await ctx.close()
        pg,ctx,bf,af,exp,errs3=await run(b,5,unlock=False)
        print('5h away, autoroll locked: +', af['rolls']-bf['rolls'], '| popup:', af['dlg'])
        await ctx.close()
        # phone layout
        ctx=await b.new_context(viewport={'width':390,'height':844}); pg=await ctx.new_page()
        await pg.goto(URL); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2')"); await pg.reload(); await pg.wait_for_timeout(500)
        await pg.evaluate(SETUP, ['H','O','C','N','Fe','Pt','Ho']); await pg.goto('http://127.0.0.1:8771/privacy.html'); await pg.evaluate("localStorage.setItem('awayLastSeen', JSON.stringify({t:Date.now()-7*3600*1000}))"); await pg.goto(URL)
        await pg.wait_for_function("!!document.getElementById('dlg')", timeout=60000); await pg.wait_for_timeout(300); await pg.screenshot(path=SP+'away_mob.png')
        # cutscene path: an away rarest that holds a cutscene element plays it
        await pg.click('#awayOk')
        await pg.evaluate("window.__cut=0; const o=playCutscene; playCutscene=function(){window.__cut++; return o.apply(this,arguments)}; 0")
        await pg.evaluate("doRoll([awayMakeRoll(activeBuffStats())].map(r=>{const e=[ELEMENTS.find(x=>x[0]==='U')];return {elements:e,formula:'U',name:'Uranium',log:exactRarity(e,0),rarity:'',score:rollScore(e)}}))")
        await pg.wait_for_function("!rolling", timeout=60000)
        print('cutscene played for a U preset:', await pg.evaluate("window.__cut"), '| rolls unchanged by replay:', await pg.evaluate("totalRolls()"))
        print('errors:', errs[:3], errs2[:3], errs3[:3])
        await b.close()
asyncio.run(m())
