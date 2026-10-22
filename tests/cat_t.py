import asyncio, json, re, threading, http.server, functools, subprocess, sys
from playwright.async_api import async_playwright
import pgserver
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('test')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8775), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
def sql(q): return subprocess.run(['psql','-h','/tmp/pgtest','-p','55432','-U','postgres','-d','t','-At','-q','-c',q],capture_output=True,text=True).stdout.strip()
sql("truncate public.global_rolls, public.roll_submissions, public.announcements, net.sent restart identity cascade; update public.game_settings set min_tier=1, announce_top10=true")
MOCK=open(HERE+'mocksb.js').read()
U1={'id':'00000000-0000-0000-0000-000000000001','email':'jamie@example.com'}
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context()
        await ctx.expose_function('mockServer', pgserver.server)
        await ctx.add_init_script("window.__mockUser="+json.dumps(U1)+";try{localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('mockSession',JSON.stringify(window.__mockUser));localStorage.setItem('globalBackfilled',window.__mockUser.id)}catch(e){}")
        await ctx.route(re.compile(r'.*supabase-js.*'), lambda rt: rt.fulfill(body=MOCK, content_type='application/javascript'))
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://127.0.0.1:8775/index.html'); await pg.wait_for_timeout(3000)
        # a timed catalyst and a single-roll catalyst, then one real roll
        await pg.evaluate("catInv.blaze=1; catInv.prism=1; saveCats(); useCatalyst('blaze',1); useCatalyst('prism',1); 0")
        print('active before roll:', await pg.evaluate("activeList().map(x=>x.c.name+(x.a.rolls!=null?' ('+x.a.rolls+' roll)':''))"))
        await pg.evaluate("go('game'); window.__secretMode='never'; doRoll()"); await pg.wait_for_function("!rolling", timeout=60000); await pg.wait_for_timeout(1500)
        print('active after roll:', await pg.evaluate("activeList().map(x=>x.c.name)"), '| collection', await pg.evaluate("collection.map(c=>c.formula+'x'+c.count)"), '| history', await pg.evaluate("rollHistory.map(h=>h.f)"))
        post=sql("select body->'embeds'->0->>'description' from net.sent order by id desc limit 1")
        print('Discord post catalysts line:', next((l for l in post.splitlines() if 'Blaze' in l or 'Focus Prism' in l), '(none)') if post else '(no post)')
        print('errors:', errs[:3]); await b.close()
asyncio.run(m())
