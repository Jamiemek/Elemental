import asyncio, sys, os
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SP, page

F = SP + 'tut.html'
with open(F, 'w', encoding='utf-8') as f:
    f.write(page('preview', tutorial=True))
shots = len(sys.argv) > 1

async def say(pg):
    return await pg.evaluate("document.querySelector('.tut p') ? document.querySelector('.tut p').textContent.slice(0, 40) : null")

async def fresh(pg):
    await pg.goto('file://' + F)
    await pg.evaluate("localStorage.clear();localStorage.setItem('elementalSaveVersion','2')")
    await pg.reload()
    await pg.wait_for_timeout(500)
    await pg.add_style_tag(content='#fxPreview{display:none!important}')

async def run(b, w, h):
    pg = await b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await fresh(pg)
    print(w, 'x', h)
    print(' start:', await say(pg))
    await pg.click('.roll-cta')
    for k in range(3):
        await pg.wait_for_timeout(400)
        await pg.click('#rollBtn')
        await pg.wait_for_function('!rolling')
        await pg.wait_for_timeout(400)
    print(' rolled:', await pg.evaluate("collection.map(c=>c.formula).join(' ')"), '| quarks', await pg.evaluate("Math.round(quarks)"))
    print(' now:', await say(pg))
    await pg.click('#game [data-go="inventory"]')
    await pg.wait_for_timeout(400)
    await pg.click('[data-tab="completionist"]')
    await pg.wait_for_timeout(400)
    await pg.click('#periodic [data-sym="O"]')
    await pg.wait_for_timeout(400)
    print(' element page:', await say(pg))
    await pg.click('.tut-next')
    await pg.wait_for_timeout(600)
    if shots:
        await pg.screenshot(path=SP + 'tut_bonds_%d.png' % w)
    # tap the real slots on the canvas
    for i in (0, 1, 2):
        xy = await pg.evaluate("(()=>{const n=net().nodes[%d];const [x,y]=netToScreen(n.x,n.y);const r=$('netCanvas')?$('netCanvas').getBoundingClientRect():document.querySelector('#bonds canvas').getBoundingClientRect();return [r.left+x,r.top+y];})()" % i)
        await pg.mouse.click(xy[0], xy[1])
        await pg.wait_for_timeout(400)
    print(' slots filled:', await pg.evaluate("[0,1,2].map(netFilled).join(',')"), '| spent', await pg.evaluate("collection.map(c=>c.spent||0).join(',')"))
    print(' now:', await say(pg))
    seen = []
    while await pg.evaluate("!!document.querySelector('.tut')"):
        seen.append(await pg.evaluate("document.querySelector('.screen.active').id"))
        if shots and seen[-1] in ('shop', 'settings', 'game'):
            await pg.screenshot(path=SP + 'tut_%s_%d.png' % (seen[-1], w))
        await pg.click('.tut-next')
        await pg.wait_for_timeout(300)
    print(' screens after bonds:', ' '.join(seen))
    print(' storm on:', await pg.evaluate("qStormOn() && qStorm.left"), '| inventory', await pg.evaluate("JSON.stringify(catInv)"), '| saved', await pg.evaluate("localStorage.getItem('elementalTutorial')"))
    await pg.click('#rollBtn')
    await pg.wait_for_function('!rolling')
    print(' normal roll after:', await pg.evaluate("collection.length"), 'formulas | storm left', await pg.evaluate("qStorm && qStorm.left"))
    await pg.reload()
    await pg.wait_for_timeout(500)
    print(' after reload, tutorial shown:', await pg.evaluate("!!document.querySelector('.tut')"))
    # skip
    await fresh(pg)
    await pg.click('.tut-skip')
    await pg.click('.roll-cta')
    await pg.click('#rollBtn')
    await pg.wait_for_function('!rolling')
    print(' skipped:', await pg.evaluate("localStorage.getItem('elementalTutorial')"), '| shown', await pg.evaluate("!!document.querySelector('.tut')"))
    # resume after the sign-in redirect
    await pg.evaluate("localStorage.setItem('elementalTutorial','13')")
    await pg.reload()
    await pg.wait_for_timeout(500)
    print(' resumed on:', await pg.evaluate("document.querySelector('.screen.active').id"), '|', await say(pg))
    # an old save never sees it
    await pg.evaluate("localStorage.removeItem('elementalTutorial')")
    await pg.reload()
    await pg.wait_for_timeout(500)
    print(' old save:', await pg.evaluate("localStorage.getItem('elementalTutorial')"), '| shown', await pg.evaluate("!!document.querySelector('.tut')"))
    print(' errors:', errs or 'none')
    await pg.close()

async def m():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        await run(b, 1280, 800)
        await run(b, 390, 844)
        await b.close()
asyncio.run(m())
