# outer ring screenshots
import asyncio
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, PREVIEW
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+PREVIEW); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('previewPanelSmall','1')"); await pg.reload(); await pg.wait_for_timeout(500)
        await pg.add_style_tag(content='#fxPreview{display:none!important}')
        # the whole base tree filled, plus the first orbit's bridge area
        await pg.evaluate("net().nodes.forEach(n=>{if(n.ring<=24||(n.orbit===0&&n.id%3))netState[n.id]=1});saveNet();netVer++;buffCache=weightCache=null;0")
        await pg.evaluate("go('bonds')"); await pg.wait_for_timeout(500)
        await pg.evaluate("netView.z=0.07;netView.x=0;netView.y=0;netDraw()"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=SP+'ring_far.png')
        await pg.evaluate("(()=>{const e=net().edges.find(e=>e.bridge);const a=net().nodes[e.a],b=net().nodes[e.b];netView.z=0.45;netView.x=(a.x+b.x)/2;netView.y=(a.y+b.y)/2;netDraw()})()"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=SP+'ring_bridge.png')
        print('totals:', await pg.evaluate("netTotalsHtml().replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ').slice(0,600)"))
        print('errors', errs[:3]); await b.close()
asyncio.run(m())
