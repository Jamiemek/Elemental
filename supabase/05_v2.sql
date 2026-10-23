-- part 5

-- tiers, same as TIER_SCORES in the game
create or replace function public.tier_for(sc double precision)
returns int language sql immutable as $$
  select count(*)::int from unnest(array[10000, 30000, 100000, 250000, 500000, 1000000, 1500000, 3000000, 12000000,
    30000000, 100000000, 300000000]::double precision[]) t
  where sc >= t;
$$;

do $$ begin
  if exists (select 1 from pg_constraint where conname = 'game_settings_min_tier_check'
             and pg_get_constraintdef(oid) like '%<= 10)%') then
    alter table public.game_settings drop constraint game_settings_min_tier_check;
    update public.game_settings set min_tier = 13 where min_tier = 10;
    alter table public.game_settings add constraint game_settings_min_tier_check check (min_tier between 1 and 13);
  end if;
end $$;

alter table public.global_rolls add column if not exists ion smallint not null default 0;
alter table public.announcements add column if not exists ion smallint not null default 0;
do $$ begin
  alter table public.global_rolls add constraint global_rolls_ion check (ion between -3 and 3);
exception when duplicate_object then null;
end $$;
-- ions
alter table public.global_rolls drop constraint if exists global_rolls_user_id_formula_key;
do $$ begin
  alter table public.global_rolls add constraint global_rolls_user_formula_ion unique (user_id, formula, ion);
exception when duplicate_table or duplicate_object then null;
end $$;

create or replace function public.ion_text(i int)
returns text language sql immutable as $$
  select case when coalesce(i, 0) = 0 then ''
    else (case abs(i) when 1 then '' when 2 then '²' else '³' end) || (case when i > 0 then '⁺' else '⁻' end) end;
$$;

-- boards with ions
drop view if exists public.global_top_odds;
drop view if exists public.global_top_score;
create view public.global_top_odds with (security_invoker = on) as
  select g.id, g.formula, g.odds_log, g.score, g.found_at, p.display_name, g.ion
  from public.global_rolls g join public.profiles p on p.id = g.user_id
  where not g.removed and not public.is_banned(g.user_id)
  order by g.odds_log desc, g.found_at
  limit 10;
create view public.global_top_score with (security_invoker = on) as
  select g.id, g.formula, g.odds_log, g.score, g.found_at, p.display_name, g.ion
  from public.global_rolls g join public.profiles p on p.id = g.user_id
  where not g.removed and not public.is_banned(g.user_id)
  order by g.score desc, g.found_at
  limit 10;
grant select on public.global_top_odds, public.global_top_score to anon, authenticated;

create or replace function public.discord_post(a public.announcements, p_rolls bigint, p_luck double precision, p_catalysts text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  url text;
  colours int[] := array[10465448, 8177919, 6220500, 11771391, 16224216, 16765286, 16751196, 16735610, 13220095, 16774870, 4190463, 12868863, 16765806];
  game text := 'https://jamiemek.github.io/Elemental/';
  what text := coalesce(nullif(a.label, ''), a.formula) || public.ion_text(a.ion);
  ranks text := '';
  head text;
  descr text;
begin
  if not (select discord_enabled from public.game_settings where id = 1) then
    return;
  end if;
  select decrypted_secret into url from vault.decrypted_secrets where name = 'discord_webhook' limit 1;
  if url is null then
    return;
  end if;
  if a.rank_odds <= 10 then
    ranks := '#' || a.rank_odds || ' by odds';
  end if;
  if a.rank_score <= 10 then
    ranks := ranks || case when ranks = '' then '' else ' · ' end || '#' || a.rank_score || ' by score';
  end if;
  head := case when a.tier > 0 then 'Tier ' || a.tier || ' find' else 'New global top 10 entry' end;
  descr := '`' || a.formula || public.ion_text(a.ion) || '`' || E'\n\n' ||
    '**Odds** ' || public.fmt_odds(a.odds_log) || E'\n' ||
    '**Score** ' || public.fmt_int(a.score) ||
    case when ranks <> '' then E'\n🏆 **Global top 10** ' || ranks else '' end || E'\n\n' ||
    concat_ws(' · ',
      case when p_rolls is not null then '**Rolls** ' || public.fmt_int(p_rolls) end,
      case when p_luck is not null then '**Luck** +' || public.fmt_int(p_luck) || '%' end) || E'\n' ||
    '**Catalysts** ' || coalesce(nullif(p_catalysts, ''), 'None');
  perform net.http_post(
    url := url,
    body := jsonb_build_object('embeds', jsonb_build_array(jsonb_build_object(
      'color', colours[least(greatest(a.tier, 0), 12) + 1],
      'author', jsonb_build_object('name', head),
      'title', a.display_name || ' found ' || what,
      'description', descr,
      'footer', jsonb_build_object('text', 'Elemental', 'icon_url', game || 'IMG_3422.png'),
      'timestamp', to_char(a.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    ))),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
exception when others then
  raise warning 'discord post failed: %', sqlerrm;
end $$;
revoke all on function public.discord_post(public.announcements, bigint, double precision, text) from public, anon, authenticated;

-- submit_roll
drop function if exists public.submit_roll(text, text, bigint, double precision, text, boolean);
create or replace function public.submit_roll(p_formula text, p_label text default null,
  p_rolls bigint default null, p_luck double precision default null, p_catalysts text default null,
  p_old boolean default false, p_ion int default 0)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  nm text;
  part text[];
  n int := 0;
  c int;
  o numeric;
  lg double precision := 0;
  sc double precision := 0;
  recent int;
  added boolean := false;
  r_odds int;
  r_score int;
  t int;
  s public.game_settings;
  ann public.announcements;
  is_global boolean;
  clean_label text;
begin
  if uid is null then
    return jsonb_build_object('ok', false, 'why', 'signed_out');
  end if;
  select display_name into nm from public.profiles where id = uid;
  if nm is null then
    return jsonb_build_object('ok', false, 'why', 'no_name');
  end if;
  if public.is_banned(uid) then
    return jsonb_build_object('ok', false, 'why', 'banned');
  end if;
  if p_formula is null or length(p_formula) > 120 or p_formula !~ '^([A-Z][a-z]?[0-9]*)+$' then
    return jsonb_build_object('ok', false, 'why', 'invalid');
  end if;
  for part in select regexp_matches(p_formula, '([A-Z][a-z]?)([0-9]*)', 'g') loop
    c := coalesce(nullif(part[2], '')::int, 1);
    select e.odds into o from public.elements e where e.symbol = part[1];
    if o is null or c < 1 then
      return jsonb_build_object('ok', false, 'why', 'invalid');
    end if;
    n := n + c;
    lg := lg + c * log(o::double precision);
    sc := sc + c * o;
  end loop;
  if n < 1 or n > 30 then
    return jsonb_build_object('ok', false, 'why', 'invalid');
  end if;
  lg := lg + (n - 1) * log(8::double precision);
  -- ion: + is 1/100 and x1.5, - is 1/1000 and x3
  if p_ion is null or p_ion not between -3 and 3 then
    return jsonb_build_object('ok', false, 'why', 'invalid');
  end if;
  if p_ion > 0 then
    lg := lg + 2 * p_ion;
    sc := sc * 1.5 * p_ion;
  elsif p_ion < 0 then
    lg := lg + 3 * (-p_ion);
    sc := sc * 3 * (-p_ion);
  end if;

  select count(*) into recent from public.roll_submissions
    where user_id = uid and at > now() - interval '1 hour';
  if recent >= 300 then
    return jsonb_build_object('ok', false, 'why', 'slow_down');
  end if;
  insert into public.roll_submissions (user_id, formula, odds_log) values (uid, p_formula, lg);

  r_odds := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not public.is_banned(g.user_id) and g.odds_log > lg and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  r_score := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not public.is_banned(g.user_id) and g.score > sc and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  if r_odds <= 10 or r_score <= 10 then
    insert into public.global_rolls (user_id, formula, ion, odds_log, score)
      values (uid, p_formula, p_ion, lg, sc)
      on conflict (user_id, formula, ion) do nothing;
    added := found;
  end if;

  select * into s from public.game_settings where id = 1;
  t := public.tier_for(sc);
  -- p_old: a find from before signing in, checked against the board
  is_global := (t >= s.min_tier and not coalesce(p_old, false)) or (s.announce_top10 and added);
  if is_global then
    clean_label := left(regexp_replace(coalesce(p_label, ''), '[^A-Za-z0-9 +×,.()-]', '', 'g'), 80);
    insert into public.announcements (display_name, formula, ion, label, odds_log, score, tier, rank_odds, rank_score)
      values (nm, p_formula, p_ion, nullif(clean_label, ''), lg, sc, t, r_odds, r_score)
      returning * into ann;
    perform public.discord_post(ann, p_rolls, p_luck, left(regexp_replace(coalesce(p_catalysts, ''), '[^A-Za-z0-9 ,''-]', '', 'g'), 200));
  end if;
  return jsonb_build_object('ok', true, 'added', added, 'ion', p_ion, 'global', is_global, 'tier', t, 'odds_log', lg, 'score', sc,
    'rank_odds', r_odds, 'rank_score', r_score);
end $$;
revoke all on function public.submit_roll(text, text, bigint, double precision, text, boolean, int) from public, anon;
grant execute on function public.submit_roll(text, text, bigint, double precision, text, boolean, int) to authenticated;

create or replace function public.admin_board()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return coalesce((select jsonb_agg(x order by x.odds_log desc) from (
    select g.id, g.formula, g.ion, g.odds_log, g.score, g.found_at, g.removed, p.display_name, public.is_banned(g.user_id) as banned
    from public.global_rolls g join public.profiles p on p.id = g.user_id
    order by g.odds_log desc limit 40) x), '[]'::jsonb);
end $$;

create or replace function public.admin_test_discord()
returns text language plpgsql security definer set search_path = '' as $$
declare
  a public.announcements;
  url text;
begin
  perform public.require_admin();
  begin
    select decrypted_secret into url from vault.decrypted_secrets where name = 'discord_webhook' limit 1;
  exception when others then
    url := null;
  end;
  if url is null then
    return 'no_webhook';
  end if;
  a := row(0, 'Elemental', 'U', 'Uranium (test post)', log(12000000::double precision), 12000000, 9, 1, 1, now(), 0)::public.announcements;
  perform public.discord_post(a, 123456, 250, 'Blaze, Chain Primer');
  return 'ok';
end $$;
