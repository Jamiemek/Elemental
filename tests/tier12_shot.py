# tier 10-12 effect frames
import asyncio, sys
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, PREVIEW
TIERS = [(int(t), d == 'd') for t, d in (a.split(':') for a in (sys.argv[1:] or ['10:n', '11:n', '12:n', '10:d', '11:d', '12:d']))]
async def m():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for tier, dark in TIERS:
            pg = await b.new_page(viewport={'width': 1280, 'height': 860}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('file://' + PREVIEW); await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('previewPanelSmall','1')"); await pg.reload(); await pg.wait_for_timeout(400)
            await pg.add_style_tag(content='#fxPreview{display:none!important}')
            await pg.evaluate("window.__forceEl='Na';window.__secretMode='never';go('game');doRoll();0"); await pg.wait_for_function("!rolling", timeout=60000); await pg.wait_for_timeout(300)
            T = await pg.evaluate(f"({'RARITY_DARK' if dark else 'RARITY_FX'})[{tier}]")
            vd = T.get('vd', 0)
            await pg.evaluate(f"playRarityFx({tier}, {str(dark).lower()});0")
            t0 = 0
            for ms in [int(vd * 0.5), vd - 150, vd + 250, vd + 900, vd + 2200, vd + 4500]:
                await pg.wait_for_timeout(max(0, ms - t0)); t0 = ms
                await pg.screenshot(path=f"{SP}t{tier}{'d' if dark else 'n'}_{ms}.png")
            print(tier, 'dark' if dark else 'normal', 'errors', errs[:3])
            await pg.close()
        await b.close()
asyncio.run(m())
