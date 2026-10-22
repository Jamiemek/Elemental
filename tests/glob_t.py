import asyncio, json, re, threading, http.server, functools, subprocess, sys
from playwright.async_api import async_playwright
import pgserver
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('test')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8766), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
BASE='http://127.0.0.1:8766/index.html'
subprocess.run(['psql','-h','/tmp/pgtest','-p','55432','-U','postgres','-d','t','-q','-c','truncate public.global_rolls, public.roll_submissions, public.saves, public.profiles restart identity'],check=True)
MOCK=open(HERE+'mocksb.js').read()
U1={'id':'00000000-0000-0000-0000-000000000001','email':'jamie@example.com'}
U2={'id':'00000000-0000-0000-0000-000000000002','email':'other@example.com'}
async def device(b, user, w=1280, h=860, theme=None):
    ctx=await b.new_context(viewport={'width':w,'height':h})
    await ctx.expose_function('mockServer', pgserver.server)
    await ctx.add_init_script("window.__mockUser="+json.dumps(user)+";try{localStorage.setItem('elementalSaveVersion','2');"+("localStorage.setItem('elementalTheme','%s');"%theme if theme else "")+"}catch(e){}")
    await ctx.route(re.compile(r'.*supabase-js.*'), lambda rt: rt.fulfill(body=MOCK, content_type='application/javascript'))
    pg=await ctx.new_page(); pg.errs=[]; pg.on('pageerror',lambda e:pg.errs.append(str(e)))
    pg.on('console', lambda m: pg.errs.append('console: '+m.text) if m.type=='error' else None)
    await pg.goto(BASE); await pg.wait_for_timeout(700)
    return ctx,pg
async def give(pg, formula_syms):
    # add a roll to the collection exactly as the game records one, then let the game consider it
    return await pg.evaluate("""(syms)=>{const elements=syms.map(s=>ELEMENTS.find(e=>e[0]===s));const formula=hillFormula(elements);
      const log=exactRarity(elements,0);const rec={id:Math.random(),formula,name:formula,elements,rarity:rarityText(log),log,score:rollScore(elements),when:new Date().toISOString()};
      addRecord(rec);save();globalConsider(rec);return [formula, rarityText(log)]}""", formula_syms)
async def board(pg, mode='odds'):
    await pg.evaluate("go('global')"); await pg.wait_for_timeout(900)
    if mode=='score': await pg.click('[data-grank=score]'); await pg.wait_for_timeout(100)
    rows=await pg.evaluate("[...document.querySelectorAll('#globalList .rank-row')].map(r=>r.innerText.replace(/\\n+/g,' | '))")
    if mode=='score': await pg.click('[data-grank=odds]')
    return rows
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        A,pa=await device(b,U1)
        print('0 signed out, empty board:', await board(pa), '|', await pa.inner_text('#globalNote'))
        await give(pa,['H','H','O']); await give(pa,['U'])
        await pa.evaluate("go('settings')"); await pa.click('#acctIn'); await pa.wait_for_timeout(1500)
        await pa.fill('#nameInput','Jamiemek'); await pa.click('#nameSave'); await pa.wait_for_timeout(2500)
        print('1 after sign-in backfill:', await board(pa))
        print('  toast:', await pa.evaluate("$('achievementToast').innerText.replace(/\\n+/g,' | ')"))
        print('  menu shows:', await pa.inner_text('#homeGlobal'))
        # one real roll through doRoll, to prove the hook is wired
        before=subprocess.run(['psql','-h','/tmp/pgtest','-p','55432','-U','postgres','-d','t','-At','-c','select count(*) from roll_submissions'],capture_output=True,text=True).stdout.strip()
        await pa.evaluate("go('game');window.__secretMode='never';doRoll()"); await pa.wait_for_function("!rolling",timeout=60000); await pa.wait_for_timeout(1500)
        after=subprocess.run(['psql','-h','/tmp/pgtest','-p','55432','-U','postgres','-d','t','-At','-c','select count(*) from roll_submissions'],capture_output=True,text=True).stdout.strip()
        print('2 real roll submitted (board had room):', before,'->',after)
        # second player
        B,pb=await device(b,U2)
        await pb.evaluate("go('settings')"); await pb.click('#acctIn'); await pb.wait_for_timeout(1500)
        await pb.fill('#nameInput','Other'); await pb.click('#nameSave'); await pb.wait_for_timeout(1500)
        r=await give(pb,['U','O','O']); await pb.wait_for_timeout(1500)
        print('3 B rolled', r, 'toast:', await pb.evaluate("$('achievementToast').innerText.replace(/\\n+/g,' | ')"))
        # offline find: the next server call fails, so it queues and goes later
        pgserver.FAIL['next']=1
        r=await give(pb,['Og']); await pb.wait_for_timeout(800)
        print('4 offline find queued:', r, await pb.evaluate("localStorage.getItem('globalPending')"))
        await pb.evaluate("globalLoad()"); await pb.wait_for_timeout(2500)
        print('  after reconnect pending:', await pb.evaluate("localStorage.getItem('globalPending')"))
        print('5 A sees odds board:'); [print('   ',x) for x in await board(pa)]
        print('  score board:'); [print('   ',x) for x in await board(pa,'score')]
        await pa.screenshot(path=SP+'gl_desk.png')
        M,pm=await device(b,U1,390,844,'dark'); await pm.wait_for_timeout(1500)
        await board(pm); await pm.screenshot(path=SP+'gl_mob_dark.png')
        await pm.evaluate("go('menu')"); await pm.screenshot(path=SP+'gl_menu.png')
        for n,pg in [('A',pa),('B',pb),('M',pm)]:
            if pg.errs: print('ERR',n,pg.errs[:5])
        await b.close()
asyncio.run(m())
