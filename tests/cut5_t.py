import asyncio,sys
from playwright.async_api import async_playwright
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
W,H,tag=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3]
SYMS=sys.argv[4].split(',') if len(sys.argv)>4 else ['Fl','Nh','Cn','Rg','Ds']
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch();errs=[]
        for sym in SYMS:
            pg=await b.new_page(viewport={'width':W,'height':H});pg.on('pageerror',lambda e:errs.append(sym+':'+str(e)))
            await pg.goto('file://'+PREVIEW);await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2');localStorage.setItem('previewPanelSmall','1')");await pg.reload()
            await pg.evaluate(f"go('game');window.__secretMode='never';window.__forceEl='{sym}';setTimeout(doRoll,0)")
            t=0
            for ms in [1500,3000,4500,5600,6600,8600]:
                await pg.wait_for_timeout(ms-t);t=ms
                await pg.screenshot(path=SP+f'c5_{tag}_{sym}_{ms}.png')
            await pg.wait_for_function("!rolling",timeout=30000)
            await pg.close()
        print(errs);await b.close()
asyncio.run(m())
