import asyncio, json
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, PREVIEW
async def roll(pg, sym=None, ion=0):
    await pg.evaluate(f"window.__forceEl={json.dumps(sym)};window.__forceIon={ion};go('game');doRoll();0")
    await pg.wait_for_function("!rolling", timeout=60000)
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+PREVIEW); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('previewPanelSmall','1')"); await pg.reload(); await pg.wait_for_timeout(500)
        await pg.add_style_tag(content='#fxPreview{display:none!important}')
        # locked: no ions in 3000 rolls
        print('locked ion rate:', await pg.evaluate("(()=>{let n=0;for(let i=0;i<3000;i++)if(rollIon())n++;return n})()"))
        await pg.evaluate("net().nodes.forEach(n=>netState[n.id]=1);saveNet();netVer++;buffCache=weightCache=null;0")
        # single rolls for the exact checks (full bonds would give 3 bonus rolls)
        await pg.evaluate("window.__extra=0;activeBuffStats=(o=>()=>Object.assign({},o(),{extra:window.__extra}))(activeBuffStats);0")
        print('unlocked rates per 1M:', await pg.evaluate("(()=>{const c={};for(let i=0;i<1e6;i++){const v=rollIon();c[v]=(c[v]||0)+1}return JSON.stringify(c)})()"))
        await roll(pg,'H'); q0=await pg.evaluate("quarks")
        await roll(pg,'H',-3); q1=await pg.evaluate("quarks")
        print('result:', await pg.evaluate("[document.querySelector('#rollResults .reel-symbol').textContent, document.querySelector('#rollResults .result-name').textContent, document.querySelector('#rollResults .rarity').textContent].join(' | ')"))
        print('quarks for H3- roll:', round(q1-q0,3), 'expected', await pg.evaluate("quarksFor(4*9,1+activeBuffStats().quark/100).toFixed(3)"))
        print('entry:', await pg.evaluate("JSON.stringify(collection.filter(c=>c.formula==='H').map(c=>({count:c.count,log:c.log.toFixed(2),score:c.score,ionP:c.ionP,ionN:c.ionN})))"), '| history top:', await pg.evaluate("rollHistory[0].f+' '+rollHistory[0].i+' '+rarityText(rollHistory[0].l)"))
        await roll(pg,'O',2)
        print('marks:', await pg.evaluate("JSON.stringify(ionMarks)"), 'new:', await pg.evaluate("JSON.stringify(ionNew)"))
        await pg.evaluate("go('menu')"); await pg.wait_for_timeout(150)
        print('menu tiles:', await pg.evaluate("[...document.querySelectorAll('.element-tile.ion-new')].map(t=>t.className).join(' / ')"), '| ionNew after view:', await pg.evaluate("JSON.stringify(ionNew)"))
        await pg.screenshot(path=SP+'ion_menu.png')
        await pg.evaluate("go('inventory')"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=SP+'ion_coll.png')
        # survives reload (compact save)
        await pg.reload(); await pg.wait_for_timeout(600)
        print('after reload:', await pg.evaluate("JSON.stringify(collection.filter(c=>c.formula==='H'||c.formula==='O').map(c=>[c.formula,c.ionP||0,c.ionN||0,c.log.toFixed(2)]))"), 'saved:', await pg.evaluate("localStorage.getItem('elementalCollection').slice(0,120)"))
        # multiroll with bonus rolls: each roll ionised independently
        await pg.evaluate("window.__extra=3;window.__forceIon=-1;0")
        await pg.evaluate("go('game');doRoll();0"); await pg.wait_for_function("!rolling", timeout=60000)
        print('multiroll chips:', await pg.evaluate("[...document.querySelectorAll('.mr-chip b')].map(b=>b.textContent).join(' ')"))
        await pg.screenshot(path=SP+'ion_multi.png')
        # away rolls
        await pg.evaluate("['Pt','Ho'].forEach(s=>{const e=ELEMENTS.find(x=>x[0]===s);addRecord({formula:s,name:e[1],elements:[e],rarity:'',log:exactRarity([e],0),score:e[2]})});save();0")
        await pg.goto('file://'+PREVIEW); 
        await pg.evaluate("clockBase=null;localStorage.setItem('awayLastSeen', JSON.stringify({t:Date.now()-20*3600*1000}))"); await pg.goto('file://'+PREVIEW)
        await pg.wait_for_function("!!document.getElementById('dlg')", timeout=60000)
        print('away ions:', await pg.evaluate("collection.filter(c=>c.ionP||c.ionN).length+' entries with ions; history ions '+rollHistory.filter(h=>h.i).length"))
        print('errors', errs[:4]); await b.close()
asyncio.run(m())
