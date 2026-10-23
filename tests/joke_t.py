# joke table
import asyncio, json
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, PREVIEW
async def m():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 900}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + PREVIEW); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('previewPanelSmall','1')"); await pg.reload(); await pg.wait_for_timeout(500)
        await pg.add_style_tag(content='#fxPreview{display:none!important}')
        print('locked: pool', await pg.evaluate("rollPool().length"), '| table hidden', await pg.evaluate("go('inventory');document.querySelector('[data-tab=completionist]').click();$('jokeWrap').hidden"),
              '| setting hidden', await pg.evaluate("go('settings');$('jokeSetting').hidden"))
        # unlock: every bond filled
        await pg.evaluate("net().nodes.forEach(n=>netState[n.id]=1);saveNet();netVer++;buffCache=weightCache=null;jokeIntroCheck();0")
        await pg.wait_for_timeout(300)
        print('intro:', await pg.evaluate("document.getElementById('dlg') && document.getElementById('dlg').innerText.replace(/\\n+/g,' | ')"))
        await pg.screenshot(path=SP + 'joke_intro.png')
        await pg.click('#jokeOff'); print('mixing after "turn off":', await pg.evaluate("jokeMix"), '| stored', await pg.evaluate("localStorage.getItem('elementalJokeMix')"))
        print('unlocked: pool', await pg.evaluate("rollPool().length"))
        share = await pg.evaluate("""(()=>{const t=weightTable();let j=0;t.pool.forEach((e,i)=>{if(isJoke(e[0]))j+=t.w[i]});return [activeBuffStats().luck.toFixed(0), (t.total/j).toFixed(0), (t.total/t.w[t.pool.findIndex(e=>e[0]==='Gg')]).toFixed(0), (t.total/t.w[t.pool.findIndex(e=>e[0]==='U')]).toFixed(0)]})()""")
        print('at luck', share[0] + '%: a joke element 1 in', share[1], '| Gg 1 in', share[2], '| U 1 in', share[3], '(per element draw)')
        # mixing off: a chain started by a joke element stays joke, and a real one stays real
        print('mixing off, chains:', await pg.evaluate("(()=>{const t=(a,b)=>{const el=[elementBySymbol[a]];const go=chainStep(el,elementBySymbol[b]);return el.map(e=>e[0]).join('')+(go?'+':'.')};return [t('H','O'),t('H','Um'),t('Um','H'),t('Um','Zz')].join(' ')})()"))
        await pg.evaluate("jokeSetMix(true);0")
        print('mixing on, chains:', await pg.evaluate("(()=>{const el=[elementBySymbol.H];chainStep(el,elementBySymbol.Um);return el.map(e=>e[0]).join('')})()"))
        # roll Ummium
        await pg.evaluate("window.__extra=0;activeBuffStats=(o=>()=>Object.assign({},o(),{extra:0}))(activeBuffStats);window.__forceEl='Um';window.__secretMode='never';go('game');doRoll();0")
        await pg.wait_for_function("!rolling", timeout=60000)
        print('rolled:', await pg.evaluate("[document.querySelector('#rollResults .reel-symbol').textContent, document.querySelector('#rollResults .result-name').textContent, document.querySelector('#rollResults .rarity').textContent].join(' | ')"),
              '| tier', await pg.evaluate("getRarityTier(rollScore([elementBySymbol.Um]))"))
        print('found: real', await pg.evaluate("discoveredSymbols().size"), '| joke', await pg.evaluate("JSON.stringify([...jokesFound()])"), '| event bonus', await pg.evaluate("bondBonus().event.toFixed(2)+' (bonds '+netBonus().event.toFixed(2)+')'"))
        await pg.evaluate("window.__forceList=[elementBySymbol.Gg,elementBySymbol.H,elementBySymbol.O];doRoll();0"); await pg.wait_for_function("!rolling", timeout=60000)
        print('mixed chain:', await pg.evaluate("collection.map(c=>c.formula).join(' ')"), '| cosmetics', await pg.evaluate("JSON.stringify(bondBonus().cos.slice(-2))"))
        await pg.evaluate("go('inventory');document.querySelector('[data-tab=completionist]').click();0"); await pg.wait_for_timeout(300)
        print('table:', await pg.evaluate("$('jokeStats').textContent+' | '+[...document.querySelectorAll('#jokeTable .element-tile.discovered')].map(t=>t.dataset.sym).join(',')"), '|', await pg.evaluate("$('elementStats').textContent"))
        await pg.evaluate("document.getElementById('jokeWrap').scrollIntoView()"); await pg.wait_for_timeout(200); await pg.screenshot(path=SP + 'joke_table.png')
        await pg.evaluate("document.querySelector('#jokeTable [data-sym=Um]').click()"); await pg.wait_for_timeout(200)
        print('element page:', await pg.evaluate("$('buffElementName').textContent+' | '+$('buffElementDesc').textContent"))
        await pg.evaluate("go('settings')"); print('setting shown', await pg.evaluate("!$('jokeSetting').hidden"), '| mix box', await pg.evaluate("$('jokeMixSet').checked"))
        await pg.reload(); await pg.wait_for_timeout(700)
        print('after reload:', await pg.evaluate("collection.map(c=>c.formula+'x'+c.count).join(' ')"), '| joke found', await pg.evaluate("jokesFound().size"))
        print('errors', errs[:4]); await b.close()
asyncio.run(m())
