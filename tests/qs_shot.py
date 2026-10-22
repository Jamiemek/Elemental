import asyncio, threading, http.server, functools
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('preview')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8773), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
URL='http://127.0.0.1:8773/index.html'
async def shoot(b, vp, tag, extra):
    ctx=await b.new_context(viewport=vp); pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('elementalQStorm',JSON.stringify({left:57,got:1234}))"); await pg.reload(); await pg.wait_for_timeout(700)
    await pg.add_style_tag(content='#fxPreview{display:none!important}')
    await pg.evaluate("document.getElementById('dlg') && closeDialog(); go('game')")
    if extra: await pg.evaluate("activeBuffStats=(o=>()=>Object.assign({},o(),{extra:3}))(activeBuffStats); 0")
    await pg.wait_for_timeout(200)
    await pg.evaluate("doRoll(); 0")
    for ms in (500, 1200, 2300):
        await pg.wait_for_timeout(ms - (0 if ms==500 else (700 if ms==1200 else 1100)))
        await pg.screenshot(path=f'{SP}qs_{tag}_{ms}.png')
    await pg.wait_for_function("!rolling", timeout=60000); await pg.wait_for_timeout(300)
    await pg.screenshot(path=f'{SP}qs_{tag}_after.png')
    print(tag, errs[:3]); await ctx.close()
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await shoot(b,{'width':1280,'height':860},'d',False)
        await shoot(b,{'width':390,'height':844},'m',False)
        await shoot(b,{'width':390,'height':844},'m4',True)
        await b.close()
asyncio.run(m())
