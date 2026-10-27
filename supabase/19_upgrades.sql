-- part 19: catalyst upgrades. Ten catalysts of one tier go in, one random catalyst of the next tier comes out (up to Mythic)
-- The server checks the ten are real and unused, marks them used, and picks the result, so the new one checks out like a bought one

create table if not exists public.ac_upgrades (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  at timestamptz not null default now(),
  tier int not null,
  result text not null,
  inputs jsonb not null
);
alter table public.ac_upgrades enable row level security;

create or replace function public.ac_upgrade(p_in jsonb, p_jokes boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  t int;
  c jsonb;
  cat public.ac_cats;
  res text;
  up bigint;
begin
  if uid is null then
    raise exception 'not signed in';
  end if;
  if jsonb_typeof(p_in) is distinct from 'array' or jsonb_array_length(p_in) <> 10 then
    return jsonb_build_object('error', 'ten');
  end if;
  if (select count(distinct x->>'src') from jsonb_array_elements(p_in) x) <> 10 then
    return jsonb_build_object('error', 'source');
  end if;
  for c in select * from jsonb_array_elements(p_in) loop
    select * into cat from public.ac_cats where id = c->>'id';
    if cat.id is null then
      return jsonb_build_object('error', 'catalyst');
    end if;
    t := coalesce(t, cat.tier);
    if cat.tier <> t or t > 4 then
      return jsonb_build_object('error', 'tier');
    end if;
    if coalesce(c->>'src', '') = '' or not public.ac_src_ok(uid, c->>'src', cat.id)
      or exists (select 1 from public.ac_src s where s.user_id = uid and s.src = c->>'src') then
      return jsonb_build_object('error', 'source');
    end if;
  end loop;
  select k.id into res from public.ac_cats k
    where k.tier = t + 1 and (p_jokes or not k.joke) and k.id not in ('insidejoke', 'colliderkey')
    order by random() limit 1;
  if res is null then
    return jsonb_build_object('error', 'empty');
  end if;
  insert into public.ac_upgrades (user_id, tier, result, inputs) values (uid, t, res, p_in) returning id into up;
  -- the ten are spent: none of them can be used or put in again
  insert into public.ac_src (user_id, src, grp) select uid, x->>'src', 'up:' || up from jsonb_array_elements(p_in) x
    on conflict do nothing;
  return jsonb_build_object('id', res, 'src', 'u|' || up || '|0');
end $$;
revoke all on function public.ac_upgrade(jsonb, boolean) from public, anon;
grant execute on function public.ac_upgrade(jsonb, boolean) to authenticated;

-- many at once, for Merge all: each group of ten in turn, stopping at the first one that isn't accepted
create or replace function public.ac_upgrade_many(p_groups jsonb, p_jokes boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  g jsonb;
  r jsonb;
  done jsonb := '[]'::jsonb;
begin
  if jsonb_typeof(p_groups) is distinct from 'array' or jsonb_array_length(p_groups) > 100 then
    return jsonb_build_object('done', done, 'error', 'groups');
  end if;
  for g in select * from jsonb_array_elements(p_groups) loop
    r := public.ac_upgrade(g, p_jokes);
    if r ? 'error' then
      return jsonb_build_object('done', done, 'error', r->>'error');
    end if;
    done := done || jsonb_build_array(r);
  end loop;
  return jsonb_build_object('done', done);
end $$;
revoke all on function public.ac_upgrade_many(jsonb, boolean) from public, anon;
grant execute on function public.ac_upgrade_many(jsonb, boolean) to authenticated;

-- an upgraded catalyst's source is its upgrade
create or replace function public.ac_src_ok(uid uuid, src text, want text) returns boolean
language plpgsql set search_path = '' as $$
declare
  ok boolean;
  part text[] := string_to_array(src, '|');
begin
  if part[1] = 'u' then
    return array_length(part, 1) = 3 and part[3] = '0' and part[2] ~ '^[0-9]{1,18}$'
      and exists (select 1 from public.ac_upgrades u where u.id = part[2]::bigint and u.user_id = uid and u.result = want);
  end if;
  if public.ac_src_check(uid, src, want) then
    return true;
  end if;
  perform set_config('elemental.tiers', 'before', true);
  ok := public.ac_src_check(uid, src, want);
  perform set_config('elemental.tiers', '', true);
  return ok;
end $$;
revoke all on function public.ac_src_ok(uuid, text, text) from public, anon, authenticated;

-- upgrades go in backups too, so upgraded catalysts still check out after going back
create or replace function public.backup_tables()
returns table (n int, t text, who text) language sql immutable as $$
  values (1, 'profiles', 'id'), (2, 'saves', 'user_id'), (3, 'global_rolls', 'user_id'), (4, 'announcements', null),
    (5, 'gifts', 'user_id'), (6, 'gift_claims', 'user_id'), (7, 'bans', 'user_id'), (8, 'ac_devices', 'user_id'),
    (9, 'ac_used', 'user_id'), (10, 'ac_src', 'user_id'), (11, 'ac_grp', 'user_id'), (12, 'ac_legacy', 'user_id'),
    (13, 'game_settings', null), (14, 'ac_limits', null), (15, 'ac_upgrades', 'user_id');
$$;
revoke all on function public.backup_tables() from public, anon, authenticated;
