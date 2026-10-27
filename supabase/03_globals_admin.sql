
-- Discord posts are sent straight from the database
create extension if not exists pg_net;

-- admins
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;
-- the account that holds the display name Jamiemek is the admin
insert into public.admins (user_id)
  select id from public.profiles where lower(display_name) = 'jamiemek'
  on conflict do nothing;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.require_admin()
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'not allowed';
  end if;
end $$;
revoke all on function public.require_admin() from public, anon;

-- settings
-- What counts as a global, and where globals are shown. Everyone can read these.
create table if not exists public.game_settings (
  id int primary key default 1 check (id = 1),
  min_tier int not null default 7 check (min_tier between 1 and 10),
  announce_top10 boolean not null default true,
  discord_enabled boolean not null default true,
  banner_enabled boolean not null default true
);
insert into public.game_settings (id) values (1) on conflict do nothing;
alter table public.game_settings enable row level security;
drop policy if exists "settings are public" on public.game_settings;
create policy "settings are public" on public.game_settings for select using (true);
grant select on public.game_settings to anon, authenticated;

-- bans
create table if not exists public.bans (
  user_id uuid primary key references auth.users (id) on delete cascade,
  reason text,
  at timestamptz not null default now()
);
alter table public.bans enable row level security;

create or replace function public.is_banned(uid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.bans where user_id = uid);
$$;
grant execute on function public.is_banned(uuid) to anon, authenticated;

-- The two boards, with players' display names. Banned players are hidden.
drop view if exists public.global_top_odds;
drop view if exists public.global_top_score;
create view public.global_top_odds with (security_invoker = on) as
  select g.id, g.formula, g.odds_log, g.score, g.found_at, p.display_name
  from public.global_rolls g join public.profiles p on p.id = g.user_id
  where not g.removed and not public.is_banned(g.user_id)
  order by g.odds_log desc, g.found_at
  limit 10;
create view public.global_top_score with (security_invoker = on) as
  select g.id, g.formula, g.odds_log, g.score, g.found_at, p.display_name
  from public.global_rolls g join public.profiles p on p.id = g.user_id
  where not g.removed and not public.is_banned(g.user_id)
  order by g.score desc, g.found_at
  limit 10;
grant select on public.global_top_odds, public.global_top_score to anon, authenticated;

-- globals
-- Every global, shown as a banner in everyone's game and posted to Discord.
create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  display_name text not null,
  formula text not null,
  label text,
  odds_log double precision not null,
  score double precision not null,
  tier int not null,
  rank_odds int,
  rank_score int,
  at timestamptz not null default now()
);
create index if not exists announcements_at on public.announcements (at desc);
alter table public.announcements enable row level security;
drop policy if exists "announcements are public" on public.announcements;
create policy "announcements are public" on public.announcements for select using (true);
grant select on public.announcements to anon, authenticated;
-- the game hears about new globals the moment they happen
do $$ begin
  alter publication supabase_realtime add table public.announcements;
exception when others then null;
end $$;

-- Rarity tier from score: must match TIER_SCORES in the game
create or replace function public.tier_for(sc double precision)
returns int language sql immutable as $$
  select count(*)::int from unnest(array[10000, 30000, 100000, 250000, 500000, 1000000, 1500000, 3000000, 12000000]::double precision[]) t
  where sc >= t;
$$;

-- Number formatting to match the game: 1,234,567 and 1/12,000,000 (or ≈ 1/1.23e21)
create or replace function public.fmt_int(x double precision)
returns text language sql immutable as $$
  select to_char(round(x::numeric), 'FM999,999,999,999,999,999,999,999');
$$;
create or replace function public.fmt_odds(lg double precision)
returns text language sql immutable as $$
  select case when lg < 21 then '1/' || public.fmt_int(greatest(1, power(10::double precision, lg)))
    else '≈ 1/' || to_char(power(10::double precision, lg - floor(lg)), 'FM0.00') || 'e' || floor(lg)::int end;
$$;

-- Builds the Discord post for a global and sends it, if a webhook is saved
create or replace function public.discord_post(a public.announcements, p_rolls bigint, p_luck double precision, p_catalysts text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  url text;
  colours int[] := array[10465448, 8177919, 6220500, 11771391, 16224216, 16765286, 16751196, 16735610, 13220095, 16774870];
  game text := 'https://jamiemek.github.io/Elemental/';
  what text := coalesce(nullif(a.label, ''), a.formula);
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
  -- grouped, labelled lines: what was found, how rare it is, then the player's setup
  descr := '`' || a.formula || '`' || E'\n\n' ||
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
      'color', colours[least(greatest(a.tier, 0), 9) + 1],
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

-- submitting rolls
-- The game calls this when a roll might make the top 10 or count as a global
create or replace function public.submit_roll(p_formula text, p_label text default null,
  p_rolls bigint default null, p_luck double precision default null, p_catalysts text default null,
  p_old boolean default false)
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

  select count(*) into recent from public.roll_submissions
    where user_id = uid and at > now() - interval '1 hour';
  if recent >= 300 then
    return jsonb_build_object('ok', false, 'why', 'slow_down');
  end if;
  insert into public.roll_submissions (user_id, formula, odds_log) values (uid, p_formula, lg);

  r_odds := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not public.is_banned(g.user_id) and g.odds_log > lg and not (g.user_id = uid and g.formula = p_formula));
  r_score := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not public.is_banned(g.user_id) and g.score > sc and not (g.user_id = uid and g.formula = p_formula));
  if r_odds <= 10 or r_score <= 10 then
    insert into public.global_rolls (user_id, formula, odds_log, score)
      values (uid, p_formula, lg, sc)
      on conflict (user_id, formula) do nothing;
    added := found;
  end if;

  select * into s from public.game_settings where id = 1;
  t := public.tier_for(sc);
  -- p_old: a find from before signing in, checked against the board
  is_global := (t >= s.min_tier and not coalesce(p_old, false)) or (s.announce_top10 and added);
  if is_global then
    clean_label := left(regexp_replace(coalesce(p_label, ''), '[^A-Za-z0-9 +×,.()-]', '', 'g'), 80);
    insert into public.announcements (display_name, formula, label, odds_log, score, tier, rank_odds, rank_score)
      values (nm, p_formula, nullif(clean_label, ''), lg, sc, t, r_odds, r_score)
      returning * into ann;
    perform public.discord_post(ann, p_rolls, p_luck, left(regexp_replace(coalesce(p_catalysts, ''), '[^A-Za-z0-9 ,''-]', '', 'g'), 200));
  end if;
  return jsonb_build_object('ok', true, 'added', added, 'global', is_global, 'tier', t, 'odds_log', lg, 'score', sc,
    'rank_odds', r_odds, 'rank_score', r_score);
end $$;
revoke all on function public.submit_roll(text, text, bigint, double precision, text, boolean) from public, anon;
grant execute on function public.submit_roll(text, text, bigint, double precision, text, boolean) to authenticated;

-- giveaways
create table if not exists public.gifts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete cascade, -- empty = everyone
  catalyst text not null,
  qty int not null check (qty between 1 and 10000),
  note text,
  at timestamptz not null default now()
);
create table if not exists public.gift_claims (
  gift_id bigint references public.gifts (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  at timestamptz not null default now(),
  primary key (gift_id, user_id)
);
alter table public.gifts enable row level security;
alter table public.gift_claims enable row level security;

-- The game calls this after signing in: hands over any gifts not yet received
create or replace function public.claim_gifts()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  joined timestamptz;
  out jsonb;
begin
  if uid is null then
    return '[]'::jsonb;
  end if;
  select created_at into joined from public.profiles where id = uid;
  if joined is null then
    return '[]'::jsonb;
  end if;
  with mine as (
    select g.* from public.gifts g
    where (g.user_id = uid or (g.user_id is null and g.at >= joined))
      and not exists (select 1 from public.gift_claims c where c.gift_id = g.id and c.user_id = uid)
  ), claimed as (
    insert into public.gift_claims (gift_id, user_id) select id, uid from mine
    on conflict do nothing returning gift_id
  )
  select coalesce(jsonb_agg(jsonb_build_object('catalyst', m.catalyst, 'qty', m.qty, 'note', m.note) order by m.id), '[]'::jsonb)
    into out from mine m join claimed c on c.gift_id = m.id;
  return out;
end $$;
revoke all on function public.claim_gifts() from public, anon;
grant execute on function public.claim_gifts() to authenticated;

-- admin tab
create or replace function public.admin_settings(p_min_tier int, p_top10 boolean, p_discord boolean, p_banner boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  update public.game_settings set min_tier = p_min_tier, announce_top10 = p_top10,
    discord_enabled = p_discord, banner_enabled = p_banner where id = 1;
end $$;

create or replace function public.admin_players(p_query text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return coalesce((select jsonb_agg(x order by x.last_roll desc nulls last) from (
    select p.display_name, p.created_at as joined, b.reason as ban_reason, (b.user_id is not null) as banned,
      (select count(*) from public.roll_submissions r where r.user_id = p.id) as submissions,
      (select count(*) from public.announcements a where a.display_name = p.display_name) as globals,
      (select max(r.odds_log) from public.roll_submissions r where r.user_id = p.id) as best_odds_log,
      (select max(r.at) from public.roll_submissions r where r.user_id = p.id) as last_roll
    from public.profiles p left join public.bans b on b.user_id = p.id
    where p.display_name is not null and (coalesce(p_query, '') = '' or p.display_name ilike '%' || p_query || '%')
    limit 50) x), '[]'::jsonb);
end $$;

create or replace function public.admin_ban(p_name text, p_reason text, p_banned boolean)
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid;
begin
  perform public.require_admin();
  select id into uid from public.profiles where lower(display_name) = lower(p_name);
  if uid is null then
    return 'not_found';
  end if;
  if exists (select 1 from public.admins where user_id = uid) then
    return 'is_admin';
  end if;
  if p_banned then
    insert into public.bans (user_id, reason) values (uid, nullif(p_reason, ''))
      on conflict (user_id) do update set reason = excluded.reason;
  else
    delete from public.bans where user_id = uid;
  end if;
  return 'ok';
end $$;

create or replace function public.admin_board()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return coalesce((select jsonb_agg(x order by x.odds_log desc) from (
    select g.id, g.formula, g.odds_log, g.score, g.found_at, g.removed, p.display_name, public.is_banned(g.user_id) as banned
    from public.global_rolls g join public.profiles p on p.id = g.user_id
    order by g.odds_log desc limit 40) x), '[]'::jsonb);
end $$;

create or replace function public.admin_remove(p_id bigint, p_removed boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  update public.global_rolls set removed = p_removed where id = p_id;
end $$;

create or replace function public.admin_give(p_name text, p_catalyst text, p_qty int, p_note text)
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid;
begin
  perform public.require_admin();
  if p_qty is null or p_qty < 1 or p_qty > 10000 or coalesce(p_catalyst, '') !~ '^[a-z]{2,20}$' then
    return 'invalid';
  end if;
  if coalesce(btrim(p_name), '') <> '' then
    select id into uid from public.profiles where lower(display_name) = lower(btrim(p_name));
    if uid is null then
      return 'not_found';
    end if;
  end if;
  insert into public.gifts (user_id, catalyst, qty, note) values (uid, p_catalyst, p_qty, left(nullif(p_note, ''), 140));
  return 'ok';
end $$;

create or replace function public.admin_gifts()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return coalesce((select jsonb_agg(x order by x.at desc) from (
    select g.id, g.catalyst, g.qty, g.note, g.at, coalesce(p.display_name, 'Everyone') as recipient,
      (select count(*) from public.gift_claims c where c.gift_id = g.id) as claimed
    from public.gifts g left join public.profiles p on p.id = g.user_id
    order by g.at desc limit 20) x), '[]'::jsonb);
end $$;

-- Sends a sample post so you can check the Discord channel is connected
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
  a := row(0, 'Elemental', 'U', 'Uranium (test post)', log(12000000::double precision), 12000000, 9, 1, 1, now())::public.announcements;
  perform public.discord_post(a, 123456, 250, 'Blaze, Chain Primer');
  return 'ok';
end $$;

do $$
declare f text;
begin
  foreach f in array array['admin_settings(int, boolean, boolean, boolean)', 'admin_players(text)',
    'admin_ban(text, text, boolean)', 'admin_board()', 'admin_remove(bigint, boolean)',
    'admin_give(text, text, int, text)', 'admin_gifts()', 'admin_test_discord()'] loop
    execute 'revoke all on function public.' || f || ' from public, anon';
    execute 'grant execute on function public.' || f || ' to authenticated';
  end loop;
end $$;
