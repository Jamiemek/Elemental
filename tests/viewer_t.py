import asyncio
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
URL='file://'+PREVIEW
VIEW="""()=>{go('settings'); return {cuts:[...document.querySelectorAll('#vwCuts .vw-tile')].map(b=>b.dataset.cut||'?').join(' '),
  fx:[...document.querySelectorAll('#vwFx .vw-tile')].map(b=>b.dataset.fx||'?').join(' '),
  darkShown:!$('vwDarkWrap').hidden, dark:[...document.querySelectorAll('#vwDark .vw-tile')].map(b=>b.dataset.dark).join(' '), count:$('vwCount').textContent}}"""
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(URL); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('previewPanelSmall','1')")
        # an existing player: has found Og and some rare-ish things before the viewer existed
        await pg.evaluate("""()=>{ ['O','H','Og','Fe'].forEach(s=>{const e=ELEMENTS.find(x=>x[0]===s); addRecord({formula:s,name:e[1],elements:[e],rarity:'',log:exactRarity([e],0),score:e[2],count:2})}); save(); }""")
        await pg.reload(); await pg.wait_for_timeout(800)
        print('existing player:', await pg.evaluate(VIEW))
        # a real U roll with its cutscene, forced as a secret
        await pg.evaluate("go('game');window.__secretMode='always';window.__forceEl='U';doRoll()"); await pg.wait_for_function("!rolling",timeout=60000)
        print('after rolling U (secret):', await pg.evaluate(VIEW))
        await pg.evaluate("go('settings')"); await pg.wait_for_timeout(200)
        await pg.evaluate("document.querySelector('.setting:has(#vwCuts)').scrollIntoView()"); await pg.screenshot(path=SP+'viewer_desk.png')
        # replay U: cutscene plays, nothing recorded, never a secret
        rolls=await pg.evaluate("totalRolls()")
        await pg.evaluate("window.__cut=0;window.__fx=[];const oc=playCutscene;playCutscene=function(){window.__cut++;return oc.apply(this,arguments)};const of=playRarityFx;playRarityFx=function(t,d){window.__fx.push([t,!!d]);return of.apply(this,arguments)};window.__secretMode='always';0")
        await pg.click('#vwCuts [data-cut=U]'); await pg.wait_for_timeout(500); await pg.wait_for_function("!rolling",timeout=60000)
        print('replay U: cutscene plays', await pg.evaluate("window.__cut"), '| effect', await pg.evaluate("window.__fx"), '| rolls unchanged', rolls==await pg.evaluate("totalRolls()"))
        await pg.evaluate("go('settings')"); await pg.click('#vwDark [data-dark="9"]'); await pg.wait_for_timeout(600)
        print('replay secret 9 ->', await pg.evaluate("window.__fx.slice(-1)"))
        # locked tiles can't be played
        print('locked Ts tile clickable?', await pg.evaluate("!!document.querySelector('#vwCuts [data-cut=Ts]')"))
        mob=await b.new_page(viewport={'width':390,'height':844}); await mob.goto(URL); await mob.wait_for_timeout(800)
        await mob.evaluate("go('settings');document.querySelector('.setting:has(#vwCuts)').scrollIntoView()"); await mob.wait_for_timeout(200); await mob.screenshot(path=SP+'viewer_mob.png')
        print('errors:', errs[:3]); await b.close()
asyncio.run(m())
