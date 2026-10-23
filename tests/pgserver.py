import json, os, subprocess, secrets
PSQL=['psql','-h',os.environ.get('ELEMENTAL_PGHOST','/tmp/pgtest'),'-p',os.environ.get('ELEMENTAL_PGPORT','55432'),'-U','postgres','-d','t','-A','-t','-q','-v','ON_ERROR_STOP=1']
FAIL={'next':0}
def lit(v):
    tag='q'+secrets.token_hex(4)
    return '$'+tag+'$'+str(v)+'$'+tag+'$'
def run(uid, sql):
    pre=("set role authenticated; set test.uid = "+lit(uid)+";") if uid else "set role anon;"
    p=subprocess.run(PSQL+['-c',pre+sql],capture_output=True,text=True)
    if p.returncode: return None, p.stderr.strip()
    out=p.stdout.strip()
    return (json.loads(out) if out else None), None
def server(req):
    r=json.loads(req); uid=r.get('uid')
    if FAIL['next']>0:
        FAIL['next']-=1; return json.dumps({'data':None,'error':{'message':'network'}})
    if r['kind']=='rpc':
        args=', '.join(k+' => '+('NULL' if v is None else lit(v)) for k,v in (r.get('args') or {}).items())
        d,e=run(uid,"select to_jsonb(public.%s(%s));"%(r['fn'],args))
    else:
        t,op,f,body=r['t'],r['op'],r['f'],r.get('body') or {}
        if t in ('global_top_odds','global_top_score','global_top_odds_real','global_top_score_real'):
            d,e=run(uid,"select coalesce(json_agg(x),'[]') from (select id, formula, ion, odds_log, score, found_at, display_name from public.%s) x;"%t)
        elif t=='game_settings':
            d,e=run(uid,"select to_jsonb(x) from (select min_tier, announce_top10, discord_enabled, banner_enabled from public.game_settings where id = 1) x;")
        elif t=='profiles':
            d,e=run(uid,"select to_jsonb(x) from (select display_name from public.profiles where id = %s) x;"%lit(f['id']))
        elif op=='select':
            d,e=run(uid,"select to_jsonb(x) from (select data, updated_at from public.saves where user_id = %s) x;"%lit(f['user_id']))
        elif op=='update':
            d,e=run(uid,"with u as (update public.saves set data = %s::jsonb where user_id = %s and updated_at = %s::timestamptz returning updated_at) select coalesce(json_agg(u),'[]') from u;"%(lit(json.dumps(body['data'])),lit(f['user_id']),lit(f['updated_at'])))
        elif op=='upsert':
            d,e=run(uid,"with u as (insert into public.saves (user_id, data) values (%s, %s::jsonb) on conflict (user_id) do update set data = excluded.data returning updated_at) select coalesce(json_agg(u),'[]') from u;"%(lit(body['user_id']),lit(json.dumps(body['data']))))
    return json.dumps({'data':d,'error':({'message':e} if e else None)})
