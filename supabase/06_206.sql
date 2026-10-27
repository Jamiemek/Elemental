-- part 6

-- the cutscene elements climb evenly up to uranium
insert into public.elements (symbol, odds) values
  ('Sg', 903664), ('Bh', 1102567), ('Hs', 1345250), ('Mt', 1641349), ('Ds', 2002622), ('Rg', 2443414), ('Cn', 2981227),
  ('Nh', 3637417), ('Fl', 4438039), ('Mc', 5414884), ('Lv', 6606739), ('Ts', 8060931), ('Og', 9835201)
on conflict (symbol) do update set odds = excluded.odds;

-- pi
insert into public.elements (symbol, odds, joke) values ('Pi', 314159265, true)
on conflict (symbol) do update set odds = excluded.odds, joke = true;

-- score: the odds added up, then worth more for every extra element once the odds get big (same as rollScore)
create or replace function public.formula_score(p_formula text, p_ion int)
returns double precision language plpgsql stable set search_path = '' as $$
declare
  part text[];
  c int;
  n int := 0;
  s double precision := 0;
begin
  for part in select regexp_matches(p_formula, '([A-Z][a-z]?)([0-9]*)', 'g') loop
    c := coalesce(nullif(part[2], '')::int, 1);
    n := n + c;
    s := s + c * coalesce((select e.odds from public.elements e where e.symbol = part[1]), 0);
  end loop;
  s := s * (1 + (n - 1) * least(2, 0.2 + 1.8 * power(ln(1 + s / 1000000) / ln(301), 2)));
  return case when p_ion > 0 then s * 1.5 * p_ion when p_ion < 0 then s * 3 * (-p_ion) else s end;
end $$;

-- odds as a log, for finds already on the board
create or replace function public.formula_log(p_formula text, p_ion int)
returns double precision language plpgsql stable set search_path = '' as $$
declare
  part text[];
  c int;
  n int := 0;
  lg double precision := 0;
begin
  for part in select regexp_matches(p_formula, '([A-Z][a-z]?)([0-9]*)', 'g') loop
    c := coalesce(nullif(part[2], '')::int, 1);
    n := n + c;
    lg := lg + c * log(coalesce((select e.odds from public.elements e where e.symbol = part[1]), 1)::double precision);
  end loop;
  lg := lg + (n - 1) * log(8::double precision);
  return lg + case when p_ion > 0 then 2 * p_ion when p_ion < 0 then 3 * (-p_ion) else 0 end;
end $$;

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
  jk boolean;
  has_joke boolean := false;
  lg double precision := 0;
  sc double precision := 0;
  recent int;
  added boolean := false;
  r_odds int;
  r_score int;
  r_odds_real int;
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

  r_odds := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not public.is_banned(g.user_id) and g.odds_log > lg and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  r_score := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not public.is_banned(g.user_id) and g.score > sc and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  -- joke-free finds can also make the _real board
  r_odds_real := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not g.joke and not public.is_banned(g.user_id) and g.odds_log > lg and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  r_score_real := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not g.joke and not public.is_banned(g.user_id) and g.score > sc and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  if r_odds <= 10 or r_score <= 10 or (not has_joke and (r_odds_real <= 10 or r_score_real <= 10)) then
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
      values (nm, p_formula, p_ion, nullif(clean_label, ''), lg, sc, t, r_odds, r_score)
      returning * into ann;
    perform public.discord_post(ann, p_rolls, p_luck, left(regexp_replace(coalesce(p_catalysts, ''), '[^A-Za-z0-9 ,''-]', '', 'g'), 200));
  end if;
  return jsonb_build_object('ok', true, 'added', added, 'ion', p_ion, 'global', is_global, 'tier', t, 'odds_log', lg, 'score', sc,
    'rank_odds', r_odds, 'rank_score', r_score);
end $$;
revoke all on function public.submit_roll(text, text, bigint, double precision, text, boolean, int) from public, anon;
grant execute on function public.submit_roll(text, text, bigint, double precision, text, boolean, int) to authenticated;

-- the board already has finds scored the old way
update public.global_rolls set score = public.formula_score(formula, ion), odds_log = public.formula_log(formula, ion);
