import asyncio, threading, http.server, functools, sys
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('preview')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8774), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
SIM="""()=>{
  // fake clock we can move, and a way to light 'refresh' bond lines one at a time
  clockTried=true; clockBase=null; let t=Date.now(); const real=Date.now; Date.now=()=>t;
  const refreshEdges=net().edges.filter(e=>e.kind==='refresh');
  const light=e=>{netState[e.a]=1;netState[e.b]=1;};
  shopCheck(); let restocks=0, lastSlot=shopState.nextAt;
  const log=[];
  for(let m=1;m<=180;m++){ t+=60000;
    if(m%15===0 && refreshEdges[m/15]){ light(refreshEdges[m/15]); }
    shopCheck();
    if(shopState.nextAt!==lastSlot){ restocks++; log.push(m); lastSlot=shopState.nextAt; }
  }
  Date.now=real;
  return {restocks, at:log, periodMin: shopPeriodMs()/60000, refreshLines: refreshEdges.length};
}"""
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto('http://127.0.0.1:8774/index.html'); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2')"); await pg.reload(); await pg.wait_for_timeout(800)
        r=await pg.evaluate(SIM)
        print('3 hours, a refresh bond line lit every 15 min:', r['restocks'], 'restocks at minutes', r['at'], '| period now', round(r['periodMin'],2), 'min | expected about', round(180/r['periodMin']))
        # an old save's stock and timer carry over
        await pg.evaluate("localStorage.setItem('elementalShop', JSON.stringify({slot: Math.floor(Date.now()/1200000), period:1200000, stock:[{id:'blaze',sold:false},{id:'spark',sold:true}]}))"); await pg.reload(); await pg.wait_for_timeout(800)
        print('old save carried over:', await pg.evaluate("JSON.stringify(shopState.stock.map(s=>s.id+(s.sold?'(sold)':'')))"), '| next restock in', await pg.evaluate("Math.round(shopNextIn()/60000*10)/10"), 'min')
        # clock moved forward a day while away: restock once, then a normal timer
        await pg.evaluate("clockTried=true; const real=Date.now; Date.now=()=>real()+86400000; shopCheck(); window.__n=shopNextIn(); Date.now=real; 0")
        print('device clock +1 day (offline fallback): next restock in', await pg.evaluate("Math.round(window.__n/60000*10)/10"), 'min')
        await b.close()
asyncio.run(m())
