import asyncio, json, threading, http.server, functools
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('preview')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8772), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
URL='http://127.0.0.1:8772/index.html'
SETUP="""(syms)=>{ syms.forEach(s=>{const e=ELEMENTS.find(x=>x[0]===s); addRecord({formula:s,name:e[1],elements:[e],rarity:'',log:exactRarity([e],0),score:e[2],count:3})}); save(); }"""
async def fresh(b, vp, storm=None):
    ctx=await b.new_context(viewport=vp); pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2')")
    if storm: await pg.evaluate(f"localStorage.setItem('elementalQStorm', JSON.stringify({json.dumps(storm)}))")
    await pg.reload(); await pg.wait_for_timeout(700)
    await pg.evaluate("document.getElementById('dlg') && closeDialog()")
    return ctx,pg,errs
async def roll(pg):
    await pg.evaluate("go('game')"); await pg.wait_for_timeout(100)
    await pg.evaluate("doRoll()"); await pg.wait_for_function("!rolling", timeout=60000)
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx,pg,errs=await fresh(b,{'width':1280,'height':860},{'left':3,'got':0})
        print('bar on load:', await pg.evaluate("!$('qStormBar').hidden"), '|', await pg.evaluate("$('qStormBar').innerText.replace(/\\n/g,' / ')"))
        # quarks per roll: storm adds 2-30 on top of the element quarks
        await pg.evaluate("window.__base=[]; const o=quarksFor; quarksFor=function(s,m){const v=o(s,m); window.__base.push(v); return v}; 0")
        for i in range(3):
            q0=await pg.evaluate("quarks"); await roll(pg); q1=await pg.evaluate("quarks"); base=await pg.evaluate("window.__base.pop()")
            print(f'roll {i+1}: gained {q1-q0:.2f}, element quarks {base:.2f}, storm part {q1-q0-base:.2f} | left', await pg.evaluate("qStorm&&qStorm.left"), '| bar:', await pg.evaluate("$('qStormBar').hidden?'hidden':$('qStormBar').innerText.replace(/\\n/g,' / ')"))
        print('toast after end:', await pg.evaluate("$('achievementToastKicker').textContent+' | '+$('achievementToastName').textContent"), '| saved:', await pg.evaluate("localStorage.getItem('elementalQStorm')"))
        # starting: forced chance; and no restart while running
        print('start:', await pg.evaluate("(()=>{const r=Math.random; Math.random=()=>0; const a=qStormPress(1); const b=qStormPress(1); Math.random=r; return JSON.stringify([a,b,qStorm])})()"))
        await pg.evaluate("qStorm=null; qStormSave(); window.__r=Math.random; Math.random=()=>0.0000001"); await roll(pg); await pg.evaluate("Math.random=window.__r")
        print('started by a roll:', await pg.evaluate("JSON.stringify(qStorm)"), '| toast:', await pg.evaluate("$('achievementToastName').textContent+' / '+$('achievementToastDesc').textContent"))
        # chance check: 1/8000
        print('starts in 800k presses (expect ~100):', await pg.evaluate("(()=>{let n=0; for(let i=0;i<800000;i++){qStorm=null; if(qStormPress(1)) n++;} qStorm=null; qStormSave(); return n})()"))
        # multi roll with 4 rolls per press: each roll gets its own 2-30
        print('4-roll press:', await pg.evaluate("(()=>{qStorm={left:100,got:0}; const s=qStormPress(4); return JSON.stringify(s)+' left '+qStorm.left})()"))
        # visual: screenshot mid-scan
        await pg.evaluate("qStorm={left:57,got:1234}; qStormSave(); renderQStorm(41); go('game')"); await pg.wait_for_timeout(200)
        await pg.evaluate("doRoll()"); await pg.wait_for_timeout(700); await pg.screenshot(path=SP+'qs_desk_scan.png')
        await pg.wait_for_timeout(500); await pg.screenshot(path=SP+'qs_desk_scan2.png')
        await pg.wait_for_function("!rolling", timeout=60000); await pg.wait_for_timeout(300); await pg.screenshot(path=SP+'qs_desk_after.png')
        print('errors desk:', errs[:5]); await ctx.close()
        ctx,pg,errs=await fresh(b,{'width':390,'height':844},{'left':57,'got':1234})
        await pg.evaluate(SETUP, ['H','O','C','N','Fe','Pt','Ho'])
        await pg.evaluate("go('game')"); await pg.wait_for_timeout(200); await pg.evaluate("doRoll()"); await pg.wait_for_timeout(800); await pg.screenshot(path=SP+'qs_mob_scan.png')
        await pg.wait_for_function("!rolling", timeout=60000); await pg.wait_for_timeout(200); await pg.screenshot(path=SP+'qs_mob_after.png', full_page=False)
        # away with a storm running
        q0=await pg.evaluate("quarks")
        await pg.goto('http://127.0.0.1:8772/privacy.html'); await pg.evaluate("localStorage.setItem('awayLastSeen', JSON.stringify({t:Date.now()-3*3600*1000}))")
        await pg.goto(URL); await pg.wait_for_function("!!document.getElementById('dlg')", timeout=60000); await pg.wait_for_timeout(300)
        print('away popup:', await pg.evaluate("document.getElementById('dlg').innerText.replace(/\\n+/g,' | ')"), '| storm now', await pg.evaluate("JSON.stringify(qStorm)"))
        await pg.screenshot(path=SP+'qs_mob_away.png')
        print('errors mob:', errs[:5]); await ctx.close()
        await b.close()
asyncio.run(m())
