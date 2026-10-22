import asyncio, json, threading, http.server, functools
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('preview')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8769), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
GEN="""(n)=>{ // build a big, realistic collection the way the game records rolls
  const w=ELEMENTS.map(e=>1/e[2]); const tot=w.reduce((a,b)=>a+b,0); const cum=[];let c=0;w.forEach(x=>{c+=x/tot;cum.push(c)});
  const pick=()=>{const r=Math.random();let lo=0,hi=cum.length-1;while(lo<hi){const m=(lo+hi)>>1;if(cum[m]<r)lo=m+1;else hi=m}return ELEMENTS[lo]};
  let i=0; while(collection.length<n && i<5e6){ i++; const el=[pick()]; while(el.length<30&&Math.random()<1/3) el.push(pick());
    const formula=hillFormula(el); const log=exactRarity(el,0); const known=ACHIEVEMENTS.find(a=>a.hill===formula);
    addRecord({id:Date.now()+Math.random(),formula,name:el.length===1?el[0][1]:(known?known.name:el.map(e=>e[1]).join(' + ')),elements:el,rarity:rarityText(log),log,score:rollScore(el),when:new Date().toISOString()}); }
  collection.slice(0,40).forEach((c,k)=>{ if(k%3==0) c.spent=Math.min(c.count,2) });
  save(); return [collection.length, i];
}"""
STATE="""()=>{ const nodes=net().nodes.filter(n=>n.req&&!netFilled(n.id)); netVer++;
  return {formulas:collection.length, rolls:totalRolls(), found:[...discoveredSymbols()].sort().join(''), ach:unlockedAchievements.length,
    payable:nodes.map(n=>canPay(n.req)?1:0).join(''), top:groupedCollection().slice(0,10).map(c=>c.formula).join(','), topS:scoreRanked().slice(0,10).map(c=>c.formula).join(','),
    below:collection.filter(c=>c.score<10000).length, store:storageBytes()} }"""
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://127.0.0.1:8769/index.html'); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2')"); await pg.reload(); await pg.wait_for_timeout(800)
        await pg.evaluate(GEN, 30000)
        # fill a few bonds near the centre so some slots are used and records have spent counts
        await pg.evaluate("""()=>{let k=0; for(const n of net().nodes){ if(k>=12) break; if(n.req && !netFilled(n.id) && net().adj[n.id].some(i=>{const e=net().edges[i];return netFilled(e.a===n.id?e.b:e.a)||n.id===0}) && canPay(n.req)){ try{fillSlot(n.id)}catch(e){} k++; netVer++; } } save(); }""")
        await pg.evaluate("checkAchievements && collection.slice(0,200).forEach(c=>{try{checkAchievements(c)}catch(e){}})")
        before=await pg.evaluate(STATE)
        print('before:', {k:(v if k not in('payable','found','top','topS') else str(v)[:40]) for k,v in before.items()}, 'bonds filled', await pg.evaluate("Object.keys(netState).length"))
        await pg.evaluate("go('settings')"); await pg.wait_for_timeout(300)
        print('usage line:', await pg.inner_text('#storeUse'))
        await pg.fill('#clearMin','10000'); await pg.click('#clearBtn'); await pg.wait_for_timeout(300)
        print('preview:', await pg.inner_text('#clearMsg'), '|', await pg.inner_text('#clearYes'))
        await pg.screenshot(path=SP+'clear_confirm.png', full_page=False, clip={'x':0,'y':0,'width':1280,'height':900})
        async with pg.expect_navigation(): await pg.click('#clearYes')
        await pg.wait_for_timeout(1200)
        after=await pg.evaluate(STATE)
        print('after: formulas %d -> %d, below 10k %d -> %d, storage %.0fKB -> %.0fKB'%(before['formulas'],after['formulas'],before['below'],after['below'],before['store']/1024,after['store']/1024))
        for k in ['rolls','found','ach','payable','top','topS']:
            print('  %-8s unchanged: %s'%(k, before[k]==after[k]))
        print('  bonds still filled:', await pg.evaluate("Object.keys(netState).length"))
        await pg.evaluate("go('settings')"); await pg.wait_for_timeout(300)
        el=await pg.query_selector('.setting:has(#storeUse)'); await el.screenshot(path=SP+'clear_after.png')
        print('errors:', errs[:3])
        await b.close()
asyncio.run(m())
