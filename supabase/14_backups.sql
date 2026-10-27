-- part 14: backups you can make, download and go back to, and a reset for everyone

-- when everyone was last reset. Games that load after it start again from nothing
alter table public.game_settings add column if not exists reset_at timestamptz;

create table if not exists public.backups (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  kind text not null,
  label text,
  players int,
  size int,
  data jsonb not null
);
alter table public.backups enable row level security;

-- the tables a backup holds, in the order they go back, and which column in each is the player
create or replace function public.backup_tables()
returns table (n int, t text, who text) language sql immutable as $$
  values (1, 'profiles', 'id'), (2, 'saves', 'user_id'), (3, 'global_rolls', 'user_id'), (4, 'announcements', null),
    (5, 'gifts', 'user_id'), (6, 'gift_claims', 'user_id'), (7, 'bans', 'user_id'), (8, 'ac_devices', 'user_id'),
    (9, 'ac_used', 'user_id'), (10, 'ac_src', 'user_id'), (11, 'ac_grp', 'user_id'), (12, 'ac_legacy', 'user_id'),
    (13, 'game_settings', null), (14, 'ac_limits', null);
$$;

-- emails come along so a backup can be put back into a new project, where everyone's ID is different
create or replace function public.backup_make(p_kind text, p_label text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare
  d jsonb := '{}'::jsonb;
  r record;
  rows jsonb;
  bid bigint;
begin
  for r in select * from public.backup_tables() loop
    execute format('select coalesce(jsonb_agg(to_jsonb(x)), ''[]''::jsonb) from public.%I x', r.t) into rows;
    d := d || jsonb_build_object(r.t, rows);
  end loop;
  d := jsonb_build_object('v', 1, 'at', now(), 'tables', d,
    'emails', (select coalesce(jsonb_object_agg(u.id::text, u.email), '{}'::jsonb) from auth.users u));
  insert into public.backups (kind, label, players, size, data)
    values (p_kind, left(p_label, 80), jsonb_array_length(d->'tables'->'saves'), length(d::text), d)
    returning id into bid;
  -- the last few of each kind are kept
  delete from public.backups b where b.id in (
    select id from (select id, row_number() over (partition by kind order by at desc) n from public.backups) x
    where x.n > case kind when 'daily' then 7 else 3 end);
  return bid;
end $$;

-- puts a backup's tables back. Players are matched by ID, or by email if the ID has changed
create or replace function public.backup_load(d jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  r record;
  rows jsonb;
begin
  if d is null or d->>'v' is distinct from '1' or jsonb_typeof(d->'tables') is distinct from 'object'
    or jsonb_typeof(d->'tables'->'saves') is distinct from 'array' or jsonb_typeof(d->'tables'->'profiles') is distinct from 'array' then
    raise exception 'not a backup';
  end if;
  create temp table if not exists backup_map (old uuid primary key, new uuid) on commit drop;
  delete from backup_map;
  insert into backup_map
    select e.key::uuid, coalesce((select u.id from auth.users u where u.id = e.key::uuid),
      (select u.id from auth.users u where lower(u.email) = lower(e.value) limit 1))
    from jsonb_each_text(coalesce(d->'emails', '{}'::jsonb)) e;
  -- settings first, so the saves coming back pass the reset check
  update public.game_settings g set min_tier = s.min_tier, announce_top10 = s.announce_top10, discord_enabled = s.discord_enabled,
    banner_enabled = s.banner_enabled, reset_at = s.reset_at
    from jsonb_populate_recordset(null::public.game_settings, d->'tables'->'game_settings') s where g.id = 1;
  update public.ac_limits l set v = s.v from jsonb_populate_recordset(null::public.ac_limits, d->'tables'->'ac_limits') s where l.id = 1;
  for r in select * from public.backup_tables() where who is not null or t = 'announcements' order by n desc loop
    execute format('delete from public.%I', r.t);
  end loop;
  for r in select * from public.backup_tables() where who is not null or t = 'announcements' order by n loop
    rows := coalesce(d->'tables'->r.t, '[]'::jsonb);
    if r.who is not null then
      select coalesce(jsonb_agg(case when x->>r.who is null then x else x || jsonb_build_object(r.who, m.new) end), '[]'::jsonb) into rows
        from jsonb_array_elements(rows) x left join backup_map m on m.old = (x->>r.who)::uuid
        where x->>r.who is null or m.new is not null;
    end if;
    execute format('insert into public.%I overriding system value select * from jsonb_populate_recordset(null::public.%I, $1)', r.t, r.t) using rows;
    if exists (select 1 from information_schema.columns c where c.table_schema = 'public' and c.table_name = r.t and c.column_name = 'id' and c.is_identity = 'YES') then
      execute format('select setval(pg_get_serial_sequence(''public.%I'', ''id''), greatest(1, (select coalesce(max(id), 0) from public.%I)))', r.t, r.t);
    end if;
  end loop;
end $$;

-- clears everyone's progress. Names, accounts, bans and the anticheat's records stay
create or replace function public.reset_everyone()
returns void language plpgsql security definer set search_path = '' as $$
begin
  delete from public.saves;
  delete from public.global_rolls;
  delete from public.announcements;
  delete from public.gift_claims;
  delete from public.gifts;
  delete from public.roll_submissions;
  update public.game_settings set reset_at = now() where id = 1;
end $$;

-- a save from a game that hasn't caught up with the last reset would undo it for that player
create or replace function public.saves_after_reset()
returns trigger language plpgsql set search_path = '' as $$
declare
  r timestamptz := (select reset_at from public.game_settings where id = 1);
  seen timestamptz;
begin
  if r is null then
    return new;
  end if;
  begin
    seen := (new.data->>'r')::timestamptz;
  exception when others then
    seen := null;
  end;
  if seen is null or seen < r then
    raise exception 'reset';
  end if;
  return new;
end $$;
drop trigger if exists saves_after_reset on public.saves;
create trigger saves_after_reset before insert or update on public.saves
  for each row execute function public.saves_after_reset();

revoke all on function public.backup_tables() from public, anon, authenticated;
revoke all on function public.backup_make(text, text) from public, anon, authenticated;
revoke all on function public.backup_load(jsonb) from public, anon, authenticated;
revoke all on function public.reset_everyone() from public, anon, authenticated;

-- admin panel
create or replace function public.admin_backups()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return coalesce((select jsonb_agg(jsonb_build_object('id', id, 'at', at, 'kind', kind, 'label', label, 'players', players, 'size', size) order by at desc)
    from public.backups), '[]'::jsonb);
end $$;

create or replace function public.admin_backup(p_label text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  perform public.backup_make('manual', p_label);
  return public.admin_backups();
end $$;

create or replace function public.admin_backup_get(p_id bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return (select data from public.backups where id = p_id);
end $$;

-- going back takes a backup of how things are first, so it can be undone too
create or replace function public.admin_restore(p_id bigint, p_data jsonb, p_confirm text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  d jsonb := coalesce(p_data, (select data from public.backups where id = p_id));
begin
  perform public.require_admin();
  if p_confirm is distinct from 'RESTORE' or d is null then
    raise exception 'not confirmed';
  end if;
  perform public.backup_make('before', 'Before going back');
  perform public.backup_load(d);
  return public.admin_backups();
end $$;

create or replace function public.admin_reset(p_confirm text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  if p_confirm is distinct from 'RESET EVERYTHING' then
    raise exception 'not confirmed';
  end if;
  perform public.backup_make('before', 'Before the reset');
  perform public.reset_everyone();
  return public.admin_backups();
end $$;

revoke all on function public.admin_backups() from public, anon;
revoke all on function public.admin_backup(text) from public, anon;
revoke all on function public.admin_backup_get(bigint) from public, anon;
revoke all on function public.admin_restore(bigint, jsonb, text) from public, anon;
revoke all on function public.admin_reset(text) from public, anon;
grant execute on function public.admin_backups() to authenticated;
grant execute on function public.admin_backup(text) to authenticated;
grant execute on function public.admin_backup_get(bigint) to authenticated;
grant execute on function public.admin_restore(bigint, jsonb, text) to authenticated;
grant execute on function public.admin_reset(text) to authenticated;

-- a backup every night, and a weekly nudge to download one. Needs pg_cron, which Supabase includes
do $$ begin
  create extension if not exists pg_cron;
  perform cron.schedule('elemental-backup', '0 4 * * *', 'select public.backup_make(''daily'', ''Nightly'')');
  perform cron.schedule('elemental-backup-reminder', '0 9 * * 1',
    'select public.webhook_post(''discord_alerts'', ''Weekly reminder: download a backup from the admin panel'')');
exception when others then
  raise notice 'scheduling not available: %', sqlerrm;
end $$;
