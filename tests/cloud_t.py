import asyncio, json, re, time, threading, http.server, functools
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('test')
H=functools.partial(http.server.SimpleHTTPRequestHandler, directory=SITE)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8765), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
BASE='http://127.0.0.1:8765/index.html'
DB={'saves':{}, 'profiles':{}}
BLOCK=['shit','fuck','admin']
tick=[0]
def stamp():
    tick[0]+=1; return '2026-10-22T09:00:%02d.%06d+00:00'%(tick[0]%60,tick[0])
def server(req):
    r=json.loads(req); uid=r.get('uid')
    if r['kind']=='rpc':
        n=(r['args'].get('new_name') or '').strip()
        if not uid: return json.dumps({'data':'signed_out','error':None})
        if not re.fullmatch(r'[A-Za-z0-9_]{3,16}',n): return json.dumps({'data':'invalid','error':None})
        fl=[n.lower().translate(str.maketrans('013457',m)).replace('_','') for m in ('oieast','oleast')]
        if any(b in x for b in BLOCK for x in fl): return json.dumps({'data':'blocked','error':None})
        if any(v.lower()==n.lower() and k!=uid for k,v in DB['profiles'].items()): return json.dumps({'data':'taken','error':None})
        DB['profiles'][uid]=n; return json.dumps({'data':'ok','error':None})
    t,op,f=r['t'],r['op'],r['f']
    if t=='profiles':
        n=DB['profiles'].get(f.get('id'))
        return json.dumps({'data':{'display_name':n} if n else None,'error':None})
    if not uid or f.get('user_id',(r.get('body') or {}).get('user_id'))!=uid: return json.dumps({'data':None,'error':{'message':'rls'}})
    row=DB['saves'].get(uid)
    if op=='select': return json.dumps({'data':row,'error':None})
    if op=='update':
        if row and row['updated_at']==f.get('updated_at'):
            row['data']=r['body']['data']; row['updated_at']=stamp(); return json.dumps({'data':[{'updated_at':row['updated_at']}],'error':None})
        return json.dumps({'data':[],'error':None})
    if op=='upsert':
        DB['saves'][uid]={'data':r['body']['data'],'updated_at':stamp()}; return json.dumps({'data':[{'updated_at':DB['saves'][uid]['updated_at']}],'error':None})
MOCK=open(HERE+'mocksb.js').read()
USER={'id':'u1','email':'jamie@example.com'}
async def device(b, offline=False):
    ctx=await b.new_context(viewport={'width':1280,'height':860})
    await ctx.expose_function('mockServer', server)
    await ctx.add_init_script("window.__mockUser="+json.dumps(USER)+";try{localStorage.setItem('elementalSaveVersion','2')}catch(e){}")
    async def route(rt):
        if offline: await rt.abort()
        else: await rt.fulfill(body=MOCK, content_type='application/javascript')
    await ctx.route(re.compile(r'.*supabase-js.*'), route)
    pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.errs=errs
    await pg.goto(BASE); await pg.wait_for_timeout(600); await pg.evaluate("go('settings')")
    return ctx,pg
async def rolls(pg, sym, n):
    await pg.evaluate(f"(()=>{{const e=ELEMENTS.find(x=>x[0]=='{sym}');let r=collection.find(c=>c.formula=='{sym}');if(!r){{r={{formula:'{sym}',elements:[e],count:0}};collection.push(r)}}r.count+={n};save()}})()")
async def summ(pg): return await pg.evaluate("cloudSummary(cloudSnapshot())")
async def acct(pg): return await pg.evaluate("go('settings'); $('accountBody').innerText")
def srvsum():
    r=DB['saves'].get('u1'); 
    if not r: return None
    col=json.loads(r['data'].get('elementalCollection','[]')); return sum((c[1] if isinstance(c,list) else c.get('count',1)) for c in col)
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        # 1. device A: plays signed out, then signs in for the first time
        A,pa=await device(b)
        print('A signed out:', (await acct(pa))[:60].replace('\n',' | '))
        await rolls(pa,'H',10)
        await pa.click('#acctIn'); await pa.wait_for_timeout(1200)
        print('1 url cleaned:', pa.url, '| server rolls', srvsum(), '| dialog', await pa.evaluate("!!$('dlg') && $('dlg').innerText.slice(0,30)"))
        await pa.screenshot(path=SP+'cl_name.png')
        await pa.fill('#nameInput','Sh1t_lord'); await pa.click('#nameSave'); await pa.wait_for_timeout(200)
        print('  blocked note:', await pa.inner_text('#nameNote'))
        await pa.fill('#nameInput','Jamie_1'); await pa.click('#nameSave'); await pa.wait_for_timeout(200)
        print('  after name:', (await acct(pa)).replace('\n',' | '))
        await pa.screenshot(path=SP+'cl_acct.png')
        # 2. device B: fresh, signs in -> gets A's save
        B,pb=await device(b)
        await pb.click('#acctIn'); await pb.wait_for_timeout(1500)
        print('2 B after sign-in:', await summ(pb), '| dialog', await pb.evaluate("!!$('dlg')"))
        await pb.fill('#nameInput','jamie_1') if await pb.evaluate("!!$('nameInput')") else None
        # B already has a name, so no dialog expected
        # 3. B plays and saves
        await rolls(pb,'O',7); await pb.evaluate("cloudTick()"); await pb.wait_for_timeout(300)
        print('3 server rolls after B:', srvsum())
        # 4. A comes back and picks up B's progress
        await pa.evaluate("cloudSync()"); await pa.wait_for_timeout(1200)
        print('4 A now:', await summ(pa))
        # 5. conflict: A plays without syncing, B plays and syncs, A syncs
        await rolls(pa,'C',3)
        await rolls(pb,'N',4); await pb.evaluate("cloudTick()"); await pb.wait_for_timeout(300)
        print('  A before tick:', await pa.evaluate("[cloudState, cloudBusy, !!cloudUser, cloudHash(cloudSnapshot())===cloudGet('elementalCloudHash'), cloudGet('elementalCloudAt')]"), DB['saves']['u1']['updated_at'])
        await pa.evaluate("cloudTick()"); await pa.wait_for_timeout(600)
        print('  A after tick:', await pa.evaluate("[cloudState, cloudBusy]"))
        print('5 A dialog:', await pa.evaluate("$('dlg') && $('dlg').innerText.replace(/\\n+/g,' | ').slice(0,200)"))
        await pa.set_viewport_size({'width':390,'height':844}); await pa.screenshot(path=SP+'cl_choose_m.png'); await pa.set_viewport_size({'width':1280,'height':860})
        await pa.screenshot(path=SP+'cl_choose.png')
        await pa.click('#keepLocal'); await pa.wait_for_timeout(600)
        print('  kept A; server rolls', srvsum(), '| A', await summ(pa))
        await pb.evaluate("cloudSync()"); await pb.wait_for_timeout(1500)
        print('  B now', await summ(pb))
        # 6. sign out on B keeps progress
        await pb.evaluate("go('settings')"); await pb.click('#acctOut'); await pb.wait_for_timeout(400)
        print('6 B signed out:', (await acct(pb))[:50].replace('\n',' | '), await summ(pb))
        # 7. offline: library can't load
        C,pc=await device(b, offline=True)
        await rolls(pc,'He',2)
        print('7 offline:', (await acct(pc)).replace('\n',' | ')[:120], await summ(pc))
        # 8. taken name from another account
        USER['id']='u2'; USER['email']='other@example.com'
        D,pd=await device(b); await pd.click('#acctIn'); await pd.wait_for_timeout(1200)
        await pd.fill('#nameInput','JAMIE_1'); await pd.click('#nameSave'); await pd.wait_for_timeout(200)
        print('8 taken note:', await pd.inner_text('#nameNote'))
        for n,pg in [('A',pa),('B',pb),('C',pc),('D',pd)]:
            if pg.errs: print('ERR',n,pg.errs)
        await b.close()
asyncio.run(m())
