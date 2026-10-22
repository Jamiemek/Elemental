import asyncio
from playwright.async_api import async_playwright
from PIL import Image, ImageStat
import io
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
async def run(pg, tier, dark, calm):
    await pg.evaluate(f"calmFx={str(calm).lower()};go('game');playRarityFx({tier},{str(dark).lower()})")
    vals=[]; prev=None; jumps=0
    for i in range(70):
        b=await pg.screenshot(type='jpeg',quality=40)
        im=Image.open(io.BytesIO(b)).convert('L').resize((96,54))
        v=ImageStat.Stat(im).mean[0]; vals.append(v)
        if prev is not None and abs(v-prev)>40: jumps+=1
        prev=v
        await pg.wait_for_timeout(60)
    await pg.evaluate("stopFx();stopPageFx()")
    await pg.wait_for_timeout(300)
    return max(vals)-min(vals), jumps
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':800}); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+PREVIEW)
        for tier,dark in [(7,False),(8,False),(9,False),(6,True),(8,True),(9,True)]:
            for calm in [False,True]:
                r=await run(pg,tier,dark,calm); print(tier,'secret' if dark else 'normal','calm' if calm else 'full','range %.0f jumps %d'%r)
        # setting persists
        await pg.evaluate("go('settings')"); await pg.click('#calmSetting')
        print('stored', await pg.evaluate("localStorage.getItem('elementalCalm')"))
        await pg.reload(); print('after reload', await pg.evaluate("calmFx"), await pg.evaluate("$('calmSetting').checked"))
        await pg.evaluate("go('settings')"); await pg.screenshot(path=SP+'calm_settings.png')
        print(errs); await b.close()
asyncio.run(m())
