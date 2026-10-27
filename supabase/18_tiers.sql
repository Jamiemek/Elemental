-- part 18: Linked Reaction moves to Mythic and Family Magnet to Epic, and Inside Joke only works half the time

-- the tiers as they were, so catalysts stocked before the move still check out
alter table public.ac_cats add column if not exists tier_before int;
update public.ac_cats set tier_before = tier where tier_before is null;
update public.ac_cats set tier = 5 where id = 'linked';
update public.ac_cats set tier = 3 where id = 'magnet';

-- one roll of the shop's stock, as shopRoll does it. With elemental.tiers set to 'before' it uses the old tiers
create or replace function public.ac_shop_roll(w bigint[], a bigint, b bigint, c bigint, i0 int,
  boost double precision, flags int, rate double precision) returns text
language plpgsql stable set search_path = '' as $$
declare
  ps double precision[] := array[60, 26, 9.5, 3.2, 1, 0.25, 0.05]::double precision[];
  tw double precision[];
  tot double precision := 0;
  r double precision;
  tr int := 0;
  x double precision;
  s double precision := 0;
  ids text[];
  wts double precision[];
  old boolean := coalesce(current_setting('elemental.tiers', true), '') = 'before';
begin
  tw := array_fill(0::double precision, array[7]);
  for t in 0..6 loop
    tw[t + 1] := ps[t + 1] * (1 + (boost / 100) * t / 3);
    tot := tot + tw[t + 1];
  end loop;
  r := public.ac_draw(w, a, b, c, i0) * tot;
  while tr < 6 loop
    r := r - tw[tr + 1];
    exit when r <= 0;
    tr := tr + 1;
  end loop;
  select array_agg(k.id order by k.ord), array_agg(case when k.joke then 1 + rate / 100 else 1 end order by k.ord)
    into ids, wts
    from public.ac_cats k
    where (case when old then coalesce(k.tier_before, k.tier) else k.tier end) = tr and (not k.joke or flags & 1 = 1)
      and not (k.id = 'insidejoke' and flags & 2 = 2) and not (k.id = 'colliderkey' and flags & 4 = 0);
  if ids is null then
    return null;
  end if;
  for q in 1..array_length(wts, 1) loop
    s := s + wts[q];
  end loop;
  x := public.ac_draw(w, a, b, c, i0 + 1) * s;
  for q in 1..array_length(ids, 1) loop
    x := x - wts[q];
    if x < 0 then
      return ids[q];
    end if;
  end loop;
  return ids[array_length(ids, 1)];
end $$;

-- the source check from part 9 carries on as it is, under a new name, and gets a second go with the old tiers
do $$ begin
  if not exists (select 1 from pg_proc where proname = 'ac_src_check' and pronamespace = 'public'::regnamespace) then
    alter function public.ac_src_ok(uuid, text, text) rename to ac_src_check;
  end if;
end $$;
revoke all on function public.ac_src_check(uuid, text, text) from public, anon, authenticated;

create or replace function public.ac_src_ok(uid uuid, src text, want text) returns boolean
language plpgsql set search_path = '' as $$
declare
  ok boolean;
begin
  if public.ac_src_check(uid, src, want) then
    return true;
  end if;
  perform set_config('elemental.tiers', 'before', true);
  ok := public.ac_src_check(uid, src, want);
  perform set_config('elemental.tiers', '', true);
  return ok;
end $$;
revoke all on function public.ac_src_ok(uuid, text, text) from public, anon, authenticated;

-- part 17's rule, plus Inside Joke's coin: it only gives the joke when the dice came up under a half
create or replace function public.ac_check(uid uuid, p_formula text, p_ion int, pf jsonb) returns text
language plpgsql security definer set search_path = '' as $$
begin
  if pf is not null and jsonb_typeof(pf->'p') = 'object' and ((pf->'p'->>'ln') = '1' or (pf->'p'->>'mg') = '1')
    and jsonb_typeof(pf->'p'->'ch') = 'array'
    and exists (select 1 from jsonb_array_elements(pf->'p'->'ch') c join public.ac_cats a on a.id = c->>'id' where a.fx ? 'rollLuck') then
    return 'catalyst';
  end if;
  if pf is not null and jsonb_typeof(pf->'p'->'o') = 'object' and pf->'p'->'o'->>'k' = 'j' then
    begin
      if public.ac_draw(public.ac_words(public.ac_seed(uid, pf->>'d')), (pf->>'n')::bigint, 4, 0, (pf->>'k')::bigint) >= 0.5 then
        return 'catalyst';
      end if;
    exception when others then
      return 'bad proof';
    end;
  end if;
  return public.ac_check_rolls(uid, p_formula, p_ion, pf);
end $$;
revoke all on function public.ac_check(uuid, text, int, jsonb) from public, anon, authenticated;
