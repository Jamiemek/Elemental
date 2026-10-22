import asyncio, json, re, threading, http.server, functools, sys, time
from playwright.async_api import async_playwright
import pgserver
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('test')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8773), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
URL='http://127.0.0.1:8773/index.html'; PRIV='http://127.0.0.1:8773/privacy.html'
MOCK=open(HERE+'mocksb.js').read()
SETUP="""()=>{['H','O','C','N','Fe','Pt','Ho'].forEach(s=>{const e=ELEMENTS.find(x=>x[0]===s); addRecord({formula:s,name:e[1],elements:[e],rarity:'',log:exactRarity([e],0),score:e[2],count:3})}); save();}"""
async def case(b, label, stamp_js, clock_ahead_days=0, fail_server=0):
    ctx=await b.new_context()
    await ctx.expose_function('mockServer', pgserver.server)
    init="try{localStorage.setItem('elementalSaveVersion','2')}catch(e){}"
    if clock_ahead_days:
        init+=";(()=>{const real=Date.now.bind(Date);Date.now=()=>real()+%d*86400000})()"%clock_ahead_days
    await ctx.add_init_script(init)
    await ctx.route(re.compile(r'.*supabase-js.*'), lambda rt: rt.fulfill(body=MOCK, content_type='application/javascript'))
    pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(URL); await pg.wait_for_timeout(1500); await pg.evaluate(SETUP)
    exp3h=await pg.evaluate("awayRollsFor(3*3600)")
    await pg.goto(PRIV); await pg.evaluate(stamp_js)
    before=None
    pgserver.FAIL['next']=fail_server
    await pg.goto(URL); await pg.wait_for_timeout(500)
    before=await pg.evaluate("totalRolls()")
    try:
        await pg.wait_for_function("!!document.getElementById('dlg')", timeout=15000); got=True
    except Exception: got=False
    await pg.wait_for_timeout(300)
    rolls=await pg.evaluate("totalRolls()")-7
    popup=await pg.evaluate("document.getElementById('dlg') && document.getElementById('dlg').innerText.replace(/\\n+/g,' | ').slice(0,80)")
    stamp=await pg.evaluate("localStorage.getItem('awayLastSeen')")
    print('%-46s away rolls %5d (3h would be %d) | popup: %s | saved: %s'%(label, rolls, exp3h, popup, stamp[:30] if stamp else stamp))
    if errs: print('   errors', errs[:2])
    return ctx, pg
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        real3h="localStorage.setItem('awayLastSeen', JSON.stringify({t: Date.now()-3*3600*1000}))"
        await case(b,'Closed 3h ago, clock correct:', real3h)
        # device clock 30 days fast: the saved time is genuine (3h ago in server time), the device says it's next month
        await case(b,'Closed 3h ago, device clock 30 days ahead:', "localStorage.setItem('awayLastSeen', JSON.stringify({t: Date.now()-30*86400000-3*3600*1000}))", clock_ahead_days=30)
        await case(b,'Old-style saved time (device clock):', "localStorage.setItem('awayLastSeen', String(Date.now()-5*3600*1000))")
        ctx,pg=await case(b,'Closed 3h ago, server unreachable:', real3h, fail_server=99)
        pgserver.FAIL['next']=0
        await pg.goto(PRIV); await pg.goto(URL); await pg.wait_for_timeout(6000)
        print('%-46s away rolls %5d | popup: %s'%('...then reopened with the server back:', await pg.evaluate("totalRolls()")-7, await pg.evaluate("!!document.getElementById('dlg')")))
        await b.close()
asyncio.run(m())
