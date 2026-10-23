# spawn effect skin frames: python3 tests/skin_shot.py retro 1 2 3
import asyncio, sys
from playwright.async_api import async_playwright
from PIL import Image
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, PREVIEW
SKIN = sys.argv[1] if len(sys.argv) > 1 else 'retro'
TIERS = [int(a) for a in sys.argv[2:]] or list(range(1, 13))
CALM = _os.environ.get('CALM') == '1'
async def m():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for tier in TIERS:
            pg = await b.new_page(viewport={'width': 1280, 'height': 860}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('file://' + PREVIEW)
            await pg.evaluate(f"localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('elementalJokeIntro','1');localStorage.setItem('elementalCalm','{1 if CALM else 0}')"); await pg.reload(); await pg.wait_for_timeout(400)
            await pg.add_style_tag(content='#fxPreview{display:none!important}')
            await pg.evaluate(f"(()=>{{net().nodes.forEach(n=>netState[n.id]=1); saveNet(); netVer++; buffCache=weightCache=null; cosState.owned=['{SKIN}']; cosState.effects='{SKIN}'; cosSave(); applyCosmetics()}})()")
            await pg.evaluate("document.getElementById('dlg') && closeDialog(); window.__forceEl='Na';window.__secretMode='never';go('game');doRoll();0"); await pg.wait_for_function("!rolling", timeout=60000); await pg.wait_for_timeout(300)
            T = await pg.evaluate(f"RARITY_FX[{tier}]")
            vd = T.get('vd', 0); ms_total = vd + T['ms']
            times = sorted(set([60, 250, 600] + ([int(vd * 0.5), vd - 100, vd + 150, vd + 700] if vd else []) + [int(vd + (ms_total - vd) * f) for f in (0.3, 0.55, 0.85)]))
            await pg.evaluate(f"playRarityFx({tier}, false);0")
            t0 = 0; shots = []
            for ms in times:
                await pg.wait_for_timeout(max(0, ms - t0)); t0 = ms
                f = f"{SP}sk_{SKIN}{tier}_{ms}.png"; await pg.screenshot(path=f); shots.append((ms, f))
            print(SKIN, tier, 'errors', errs[:3])
            ims = [Image.open(f).resize((480, 322)) for _, f in shots]
            cols = 4; rows = (len(ims) + cols - 1) // cols
            sheet = Image.new('RGB', (480 * cols, 322 * rows))
            for i, im in enumerate(ims):
                sheet.paste(im, ((i % cols) * 480, (i // cols) * 322))
            sheet.save(f"{SP}sheet_{SKIN}{tier}{'_calm' if CALM else ''}.png")
            await pg.close()
        await b.close()
asyncio.run(m())
