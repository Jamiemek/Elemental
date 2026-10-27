-- part 7

-- big numbers by name: the usual names up to vigintillion, then Conway-Wechsler, which never runs out
create or replace function public.illion(k int)
returns text language plpgsql immutable as $$
declare
  usual text[] := array['million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion',
    'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quattuordecillion', 'quindecillion', 'sexdecillion', 'septendecillion',
    'octodecillion', 'novemdecillion', 'vigintillion'];
  small text[] := array['m', 'b', 'tr', 'quadr', 'quint', 'sext', 'sept', 'oct', 'non'];
  units text[] := array['un', 'duo', 'tre', 'quattuor', 'quinqua', 'se', 'septe', 'octo', 'nove'];
  tens text[] := array['deci', 'viginti', 'triginta', 'quadraginta', 'quinquaginta', 'sexaginta', 'septuaginta', 'octoginta', 'nonaginta'];
  tmark text[] := array['n', 'ms', 'ns', 'ns', 'ns', 'n', 'n', 'mx', ''];
  hund text[] := array['centi', 'ducenti', 'trecenti', 'quadringenti', 'quingenti', 'sescenti', 'septingenti', 'octingenti', 'nongenti'];
  hmark text[] := array['nx', 'n', 'ns', 'ns', 'ns', 'n', 'n', 'mx', ''];
  out text := '';
  g int;
  u int;
  t int;
  h int;
  p text;
  m text;
  rest int := k;
  groups int[] := '{}';
begin
  -- k-illion is 10^(3k + 3)
  if k between 1 and 20 then
    return usual[k];
  end if;
  loop
    groups := (rest % 1000) || groups;
    rest := rest / 1000;
    exit when rest = 0;
  end loop;
  foreach g in array groups loop
    if g = 0 then
      p := 'ni';
    elsif g < 10 and array_length(groups, 1) = 1 then
      p := small[g] || 'i';
    else
      u := g % 10;
      t := (g / 10) % 10;
      h := g / 100;
      m := case when t > 0 then tmark[t] when h > 0 then hmark[h] else '' end;
      p := '';
      if u > 0 then
        p := units[u];
        if u = 3 and (m like '%s%' or m like '%x%') then
          p := 'tres';
        elsif u = 6 and m like '%x%' then
          p := 'sex';
        elsif u = 6 and m like '%s%' then
          p := 'ses';
        elsif u in (7, 9) and m like '%m%' then
          p := p || 'm';
        elsif u in (7, 9) and m like '%n%' then
          p := p || 'n';
        end if;
      end if;
      if t > 0 then
        p := p || tens[t];
      end if;
      if h > 0 then
        p := p || hund[h];
      end if;
      if g < 10 then
        p := small[g] || 'i';
      end if;
    end if;
    out := out || regexp_replace(p, '[ai]$', '') || 'illi';
  end loop;
  return out || 'on';
end $$;

-- a number given as a log10: written out in full below a trillion, then by name
create or replace function public.fmt_big(lg double precision)
returns text language plpgsql immutable as $$
declare
  k int;
  m double precision;
begin
  if lg < 12 then
    return public.fmt_int(power(10::double precision, lg));
  end if;
  k := floor(lg / 3)::int - 1;
  m := power(10::double precision, lg - 3 * (k + 1));
  -- three significant figures: 384 trillion, 12.5 decillion, 1.23 quadrillion
  return trim(trailing '.' from trim(trailing '0' from to_char(round(m::numeric, case when m >= 100 then 0 when m >= 10 then 1 else 2 end), 'FM990.99'))) || ' ' || public.illion(k);
end $$;

create or replace function public.fmt_odds(lg double precision)
returns text language sql immutable as $$
  select '1 in ' || public.fmt_big(lg);
$$;

-- just the formula in the post, and the event if one was running
drop function if exists public.discord_post(public.announcements, bigint, double precision, text);
create or replace function public.discord_post(a public.announcements, p_rolls bigint, p_luck double precision, p_catalysts text, p_event text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  url text;
  colours int[] := array[10465448, 8177919, 6220500, 11771391, 16224216, 16765286, 16751196, 16735610, 13220095, 16774870, 4190463, 12868863, 16765806];
  game text := 'https://jamiemek.github.io/Elemental/';
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
  head := case when a.tier > 0 then 'Tier ' || a.tier || ' find' else 'New global top 10 entry' end;
  descr := '**Odds** ' || public.fmt_odds(a.odds_log) || E'\n' ||
    '**Score** ' || public.fmt_big(log(greatest(a.score, 1))) ||
    case when a.rank_score <= 10 then E'\n🏆 **Global top 10** #' || a.rank_score else '' end || E'\n\n' ||
    concat_ws(' · ',
      case when p_rolls is not null then '**Rolls** ' || public.fmt_int(p_rolls) end,
      case when p_luck is not null then '**Luck** +' || public.fmt_int(p_luck) || '%' end) || E'\n' ||
    '**Catalysts** ' || coalesce(nullif(p_catalysts, ''), 'None') ||
    case when coalesce(p_event, '') <> '' then E'\n**Event** ' || p_event else '' end;
  perform net.http_post(
    url := url,
    body := jsonb_build_object('embeds', jsonb_build_array(jsonb_build_object(
      'color', colours[least(greatest(a.tier, 0), 12) + 1],
      'author', jsonb_build_object('name', head),
      'title', a.display_name || ' found ' || a.formula || public.ion_text(a.ion),
      'description', descr,
      'footer', jsonb_build_object('text', 'Elemental', 'icon_url', game || 'IMG_3422.png'),
      'timestamp', to_char(a.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    ))),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
exception when others then
  raise warning 'discord post failed: %', sqlerrm;
end $$;
revoke all on function public.discord_post(public.announcements, bigint, double precision, text, text) from public, anon, authenticated;

-- submit_roll: score top 10 only, and the event goes along to Discord
drop function if exists public.submit_roll(text, text, bigint, double precision, text, boolean, int);
create or replace function public.submit_roll(p_formula text, p_label text default null,
  p_rolls bigint default null, p_luck double precision default null, p_catalysts text default null,
  p_old boolean default false, p_ion int default 0, p_event text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  nm text;
  part text[];
  n int := 0;
  c int;
  o numeric;
  jk boolean;
  has_joke boolean := false;
  lg double precision := 0;
  sc double precision := 0;
  recent int;
  added boolean := false;
  r_score int;
  r_score_real int;
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
    select e.odds, e.joke into o, jk from public.elements e where e.symbol = part[1];
    has_joke := has_joke or coalesce(jk, false);
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
  sc := public.formula_score(p_formula, p_ion);

  select count(*) into recent from public.roll_submissions
    where user_id = uid and at > now() - interval '1 hour';
  if recent >= 300 then
    return jsonb_build_object('ok', false, 'why', 'slow_down');
  end if;
  insert into public.roll_submissions (user_id, formula, odds_log) values (uid, p_formula, lg);

  r_score := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not public.is_banned(g.user_id) and g.score > sc and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  -- joke-free finds can also make the _real board
  r_score_real := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not g.joke and not public.is_banned(g.user_id) and g.score > sc and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  if r_score <= 10 or (not has_joke and r_score_real <= 10) then
    insert into public.global_rolls (user_id, formula, ion, odds_log, score, joke)
      values (uid, p_formula, p_ion, lg, sc, has_joke)
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
      values (nm, p_formula, p_ion, nullif(clean_label, ''), lg, sc, t, null, r_score)
      returning * into ann;
    perform public.discord_post(ann, p_rolls, p_luck, left(regexp_replace(coalesce(p_catalysts, ''), '[^A-Za-z0-9 ,''-]', '', 'g'), 200),
      left(regexp_replace(coalesce(p_event, ''), '[^A-Za-z ]', '', 'g'), 40));
  end if;
  return jsonb_build_object('ok', true, 'added', added, 'ion', p_ion, 'global', is_global, 'tier', t, 'odds_log', lg, 'score', sc,
    'rank_score', r_score);
end $$;
revoke all on function public.submit_roll(text, text, bigint, double precision, text, boolean, int, text) from public, anon;
grant execute on function public.submit_roll(text, text, bigint, double precision, text, boolean, int, text) to authenticated;

-- the admin test post, with a big number and an event to show the new layout
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
  a := row(0, 'Elemental', 'UOg', null, public.formula_log('UOg', 0), public.formula_score('UOg', 0), 9, null, 1, now(), 0)::public.announcements;
  perform public.discord_post(a, 123456, 250, 'Blaze, Chain Primer', 'Black Hole');
  return 'ok';
end $$;
