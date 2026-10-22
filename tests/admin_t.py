import asyncio, json, re, threading, http.server, functools, subprocess, sys
from playwright.async_api import async_playwright
import pgserver
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from common import SP, HERE, site, PREVIEW
SITE = site('test')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8767), functools.partial(Q, directory=SITE))
threading.Thread(target=srv.serve_forever,daemon=True).start()
BASE='http://127.0.0.1:8767/index.html'
def sql(q): return subprocess.run(['psql','-h','/tmp/pgtest','-p','55432','-U','postgres','-d','t','-At','-q','-c',q],capture_output=True,text=True).stdout.strip()
sql("truncate public.global_rolls, public.roll_submissions, public.announcements, public.gifts, public.gift_claims, public.bans, public.saves, net.sent restart identity cascade; update public.game_settings set min_tier=7, announce_top10=true, discord_enabled=true, banner_enabled=true; delete from vault.secrets_store; insert into vault.secrets_store values ('discord_webhook','https://discord.com/api/webhooks/TEST');")
MOCK=open(HERE+'mocksb.js').read()
U1={'id':'00000000-0000-0000-0000-000000000001','email':'jamie@example.com'}
U2={'id':'00000000-0000-0000-0000-000000000002','email':'other@example.com'}
PAGES=[]; LAST=[0]
async def dispatch():
    rows=sql("select coalesce(json_agg(a order by id),'[]') from public.announcements a where id > %d"%LAST[0])
    rows=json.loads(rows or '[]')
    for r in rows:
        LAST[0]=max(LAST[0],r['id'])
        for pg in PAGES:
            await pg.evaluate("r => window.__rtFire && window.__rtFire(r)", r)
    return rows
async def device(b, user, w=1280, h=860, signed=True):
    ctx=await b.new_context(viewport={'width':w,'height':h})
    await ctx.expose_function('mockServer', pgserver.server)
    await ctx.add_init_script("window.__mockUser="+json.dumps(user)+";try{localStorage.setItem('elementalSaveVersion','2');"+("localStorage.setItem('mockSession',JSON.stringify(window.__mockUser));" if signed else "")+"}catch(e){}")
    await ctx.route(re.compile(r'.*supabase-js.*'), lambda rt: rt.fulfill(body=MOCK, content_type='application/javascript'))
    pg=await ctx.new_page(); pg.errs=[]; pg.on('pageerror',lambda e:pg.errs.append(str(e)))
    await pg.goto(BASE); await pg.wait_for_timeout(2000); PAGES.append(pg)
    return pg
async def give(pg, syms):
    return await pg.evaluate("""(syms)=>{const elements=syms.map(s=>ELEMENTS.find(e=>e[0]===s));const formula=hillFormula(elements);
      const log=exactRarity(elements,0);const known=ACHIEVEMENTS.find(a=>a.hill===formula);
      const name=elements.length===1?elements[0][1]:(known?known.name:elements.map(e=>e[1]).join(' + '));
      const rec={id:Math.random(),formula,name,elements,rarity:rarityText(log),log,score:rollScore(elements),when:new Date().toISOString()};
      addRecord(rec);save();globalConsider(rec);return [formula, rarityText(log), getRarityTier(rec.score)]}""", syms)
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        A=await device(b,U1)
        print('1 A admin row visible:', await A.evaluate("!document.querySelector('.admin-only').hidden"), '| rt on:', await A.evaluate("!!window.__rtOn"))
        B=await device(b,U2,390,844)
        print('  B admin row visible:', await B.evaluate("!document.querySelector('.admin-only').hidden"))
        # B gets a catalyst running, then finds Uranium
        await B.evaluate("catInv.blaze=1; saveCats(); useCatalyst ? 0 : 0")
        await B.evaluate("try{useCatalyst('blaze',1)}catch(e){}")
        r=await give(B,['U']); await B.wait_for_timeout(1500)
        rows=await dispatch(); await A.wait_for_timeout(700)
        print('2 B found', r, '-> announcements', [(x['display_name'],x['formula'],x['label'],x['tier']) for x in rows])
        print('  A banner:', await A.evaluate("$('globalBanner').classList.contains('show') && $('globalBanner').innerText"))
        print('  B banner (should be off for own find):', await B.evaluate("$('globalBanner').classList.contains('show')"))
        await A.screenshot(path=SP+'ad_banner_desk.png', clip={'x':0,'y':0,'width':1280,'height':120})
        await B.evaluate("bannerAdd({display_name:'Jamiemek',formula:'Og2U',label:'Oganesson + Uranium',odds_log:21.12,score:14625830,tier:9})"); await B.wait_for_timeout(600)
        await B.screenshot(path=SP+'ad_banner_mob.png', clip={'x':0,'y':0,'width':390,'height':140})
        print('3 Discord post:'); print(sql("select jsonb_pretty(body) from net.sent order by id desc limit 1"))
        # a low roll from B that doesn't make board / tier -> nothing sent
        before=sql("select count(*) from roll_submissions"); await give(B,['O']); await B.wait_for_timeout(800)
        print('4 common roll sent to server?', before, '->', sql("select count(*) from roll_submissions"))
        # admin tab
        await A.evaluate("go('admin')"); await A.wait_for_timeout(1500)
        print('5 admin players:', await A.evaluate("[...document.querySelectorAll('#admPlayerList .adm-row')].map(r=>r.innerText.replace(/\\n+/g,' | '))"))
        print('  admin board:', await A.evaluate("[...document.querySelectorAll('#admBoardList .adm-row b')].map(b=>b.innerText)"))
        await A.select_option('#admTier','8'); await A.click('#admSave'); await A.wait_for_timeout(500)
        print('6 save settings:', await A.inner_text('#admSetMsg'), '| db:', sql("select min_tier from game_settings"))
        await A.click('#admTest'); await A.wait_for_timeout(500)
        print('  test post:', await A.inner_text('#admSetMsg'), '|', sql("select body->'embeds'->0->>'description' from net.sent order by id desc limit 1").replace('\n',' '))
        await A.select_option('#admTier','7'); await A.click('#admSave'); await A.wait_for_timeout(400)
        # gift to Other
        await A.check('#admWhoOne'); await A.fill('#admWho','Other'); await A.select_option('#admCat','prism'); await A.fill('#admQty','2'); await A.fill('#admNote','Thanks for testing')
        await A.click('#admGive'); await A.wait_for_timeout(600)
        print('7 gift:', await A.inner_text('#admGiftMsg'))
        await A.check('#admWhoAll'); await A.select_option('#admCat','spark'); await A.fill('#admQty','5'); await A.click('#admGive'); await A.wait_for_timeout(600)
        await B.evaluate("giftsClaim()"); await B.wait_for_timeout(800)
        print('  B got:', await B.evaluate("$('achievementToast').innerText.replace(/\\n+/g,' | ')"), '| inv', await B.evaluate("({prism:catInv.prism,spark:catInv.spark})"))
        await B.evaluate("giftsClaim()"); await B.wait_for_timeout(500)
        print('  B claims again ->', await B.evaluate("({prism:catInv.prism,spark:catInv.spark})"))
        await A.evaluate("admGifts()"); await A.wait_for_timeout(400)
        print('  gift list:', await A.evaluate("[...document.querySelectorAll('#admGiftList .adm-row')].map(r=>r.innerText.replace(/\\n+/g,' | '))"))
        # ban Other
        await A.fill('#admReason','Testing bans'); await A.fill('#admFind','oth'); await A.click('#admFindBtn'); await A.wait_for_timeout(600)
        await A.click('#admPlayerList .adm-row button'); await A.wait_for_timeout(800)
        print('8 ban:', await A.inner_text('#admBanMsg'), '| board now', [x['display_name']+':'+x['formula'] for x in json.loads(sql("select coalesce(json_agg(v),'[]') from public.global_top_odds v"))])
        res=await B.evaluate("sb.rpc('submit_roll',{p_formula:'Og'}).then(r=>r.data)")
        print('  banned B submits ->', res)
        await A.evaluate("go('admin')"); await A.wait_for_timeout(1200)
        await A.screenshot(path=SP+'ad_admin_desk.png', full_page=True)
        await A.fill('#admFind','Other'); await A.click('#admFindBtn'); await A.wait_for_timeout(600)
        await A.click('#admPlayerList .adm-row button'); await A.wait_for_timeout(800)
        print('  unban:', await A.inner_text('#admBanMsg'))
        # remove / restore a board entry
        first=await A.evaluate("document.querySelector('#admBoardList .adm-row b').innerText")
        await A.click('#admBoardList .adm-row button'); await A.wait_for_timeout(800)
        print('9 remove', first, ':', await A.inner_text('#admBoardMsg'), '| public board has it?', first in sql("select string_agg(formula,',') from public.global_top_odds"))
        await A.click('#admBoardList .adm-row button'); await A.wait_for_timeout(800)
        print('  restore:', await A.inner_text('#admBoardMsg'))
        # B is not admin: forcing the tab open shows nothing and the server refuses
        print('10 B admin call:', await B.evaluate("sb.rpc('admin_give',{p_name:'Other',p_catalyst:'singularity',p_qty:99,p_note:''}).then(r=>r.error && r.error.message)"))
        M=await device(b,U1,390,844); await M.evaluate("go('admin')"); await M.wait_for_timeout(1500)
        await M.screenshot(path=SP+'ad_admin_mob.png', full_page=True)
        for n,pg in [('A',A),('B',B),('M',M)]:
            if pg.errs: print('ERR',n,pg.errs[:5])
        await b.close()
asyncio.run(m())
