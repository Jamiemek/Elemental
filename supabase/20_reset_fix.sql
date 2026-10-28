-- part 20: the full reset and restoring a backup both failed from the admin panel. Supabase won't run a delete
-- with no where clause when it comes in through the API, so each one now says "where true"

create or replace function public.reset_everyone()
returns void language plpgsql security definer set search_path = '' as $$
begin
  delete from public.saves where true;
  delete from public.global_rolls where true;
  delete from public.announcements where true;
  delete from public.gift_claims where true;
  delete from public.gifts where true;
  delete from public.roll_submissions where true;
  update public.game_settings set reset_at = now() where id = 1;
end $$;
revoke all on function public.reset_everyone() from public, anon, authenticated;

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
  delete from backup_map where true;
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
    execute format('delete from public.%I where true', r.t);
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
revoke all on function public.backup_load(jsonb) from public, anon, authenticated;
