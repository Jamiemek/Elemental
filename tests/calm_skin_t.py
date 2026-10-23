# python3 tests/calm_skin_t.py retro|astral
import asyncio, io, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageStat
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import PREVIEW
SKIN = sys.argv[1] if len(sys.argv) > 1 else 'retro'
async def run(pg, tier, calm):
    await pg.evaluate(f"calmFx={str(calm).lower()};go('game');playRarityFx({tier},false)")
    vals = []; prev = None; jumps = 0
    T = await pg.evaluate(f"RARITY_FX[{tier}]")
    n = int(((T.get('vd', 0) + T['ms']) / 1000) * 12)
    for i in range(n):
        im = Image.open(io.BytesIO(await pg.screenshot(type='jpeg', quality=40))).convert('L').resize((96, 54))
        v = ImageStat.Stat(im).mean[0]; vals.append(v)
        if prev is not None and abs(v - prev) > 40: jumps += 1
        prev = v
        await pg.wait_for_timeout(30)
    await pg.evaluate("stopFx();stopPageFx()"); await pg.wait_for_timeout(300)
    return jumps
async def m():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 800}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + PREVIEW)
        await pg.evaluate(f"(()=>{{net().nodes.forEach(n=>netState[n.id]=1); saveNet(); netVer++; buffCache=weightCache=null; cosState.owned=['{SKIN}']; cosState.effects='{SKIN}'; applyCosmetics(); document.getElementById('dlg') && closeDialog()}})()")
        await pg.wait_for_timeout(6000)
        bad = []
        for tier in range(1, 13):
            full = await run(pg, tier, False); calm = await run(pg, tier, True)
            print(SKIN, tier, 'jumps full', full, 'calm', calm)
            if calm: bad.append(tier)
        print('errors', errs[:3]); print('FAILED calm at tiers ' + str(bad) if bad else 'all passed')
        await b.close()
asyncio.run(m())
