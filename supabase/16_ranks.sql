-- part 16: owner, admins and mods, and a log of what staff do

-- everyone already in the table is the owner. Anyone added from now on starts as a mod
alter table public.admins add column if not exists role text not null default 'owner';
alter table public.admins alter column role set default 'mod';
-- and Jamiemek is always the owner
insert into public.admins (user_id, role)
  select id, 'owner' from public.profiles where lower(display_name) = 'jamiemek'
  on conflict (user_id) do update set role = 'owner';
do $$ begin
  alter table public.admins add constraint admins_role check (role in ('owner', 'admin', 'mod'));
exception when duplicate_object then null;
end $$;

-- 3 owner, 2 admin, 1 mod, 0 everyone else
create or replace function public.rank_of(uid uuid)
returns int language sql stable security definer set search_path = '' as $$
  select coalesce((select case role when 'owner' then 3 when 'admin' then 2 when 'mod' then 1 end
    from public.admins where user_id = uid), 0);
$$;
revoke all on function public.rank_of(uuid) from public, anon, authenticated;

create or replace function public.my_role()
returns text language sql stable security definer set search_path = '' as $$
  select role from public.admins where user_id = auth.uid();
$$;
grant execute on function public.my_role() to anon, authenticated;

-- older games still ask this, so it means admin or owner
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select public.rank_of(auth.uid()) >= 2;
$$;

create or replace function public.require_rank(r int)
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if public.rank_of(auth.uid()) < r then
    raise exception 'not allowed';
  end if;
end $$;
revoke all on function public.require_rank(int) from public, anon;

-- admins can do what the admin tab always could, apart from backups and the reset
create or replace function public.require_admin()
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  perform public.require_rank(2);
end $$;

-- the log
create table if not exists public.staff_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  by_name text,
  action text not null,
  target text,
  detail text
);
alter table public.staff_log enable row level security;

create or replace function public.staff_note(p_action text, p_target text, p_detail text)
returns void language sql security definer set search_path = '' as $$
  insert into public.staff_log (by_name, action, target, detail)
    values ((select display_name from public.profiles where id = auth.uid()), p_action, p_target, left(nullif(p_detail, ''), 200));
$$;
revoke all on function public.staff_note(text, text, text) from public, anon, authenticated;

create or replace function public.admin_log()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_rank(2);
  return coalesce((select jsonb_agg(x order by x.at desc) from (
    select at, by_name, action, target, detail from public.staff_log order by at desc limit 100) x), '[]'::jsonb);
end $$;

-- mods see the player list and can ban
create or replace function public.admin_players(p_query text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_rank(1);
  return coalesce((select jsonb_agg(x order by x.last_roll desc nulls last) from (
    select p.display_name, p.created_at as joined, b.reason as ban_reason, (b.user_id is not null) as banned, a.role,
      (select count(*) from public.roll_submissions r where r.user_id = p.id) as submissions,
      (select count(*) from public.announcements n where n.display_name = p.display_name) as globals,
      (select max(r.odds_log) from public.roll_submissions r where r.user_id = p.id) as best_odds_log,
      (select max(r.at) from public.roll_submissions r where r.user_id = p.id) as last_roll
    from public.profiles p left join public.bans b on b.user_id = p.id left join public.admins a on a.user_id = p.id
    where p.display_name is not null and (coalesce(p_query, '') = '' or p.display_name ilike '%' || p_query || '%')
    limit 50) x), '[]'::jsonb);
end $$;

-- nobody can ban staff, so a mod can't ban another mod and an admin can't ban the owner
create or replace function public.admin_ban(p_name text, p_reason text, p_banned boolean)
returns text language plpgsql security definer set search_path = '' as $$
declare
  uid uuid;
  nm text;
begin
  perform public.require_rank(1);
  select id, display_name into uid, nm from public.profiles where lower(display_name) = lower(p_name);
  if uid is null then
    return 'not_found';
  end if;
  if public.rank_of(uid) > 0 then
    return 'is_staff';
  end if;
  if p_banned then
    insert into public.bans (user_id, reason) values (uid, nullif(p_reason, ''))
      on conflict (user_id) do update set reason = excluded.reason;
    perform public.staff_note('ban', nm, p_reason);
  elsif exists (select 1 from public.bans where user_id = uid) then
    delete from public.bans where user_id = uid;
    perform public.staff_note('unban', nm, null);
  end if;
  return 'ok';
end $$;

-- the owner can make or remove admins and mods. Admins can only make or remove mods
create or replace function public.admin_promote(p_name text, p_role text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  uid uuid;
  nm text;
  mine int := public.rank_of(auth.uid());
  was text;
begin
  perform public.require_rank(2);
  if p_role is not null and p_role not in ('admin', 'mod') then
    return 'invalid';
  end if;
  select id, display_name into uid, nm from public.profiles where lower(display_name) = lower(p_name);
  if uid is null then
    return 'not_found';
  end if;
  was := (select role from public.admins where user_id = uid);
  if uid = auth.uid() or was = 'owner' or (mine < 3 and (p_role = 'admin' or was = 'admin')) then
    return 'not_allowed';
  end if;
  if p_role is not null and exists (select 1 from public.bans where user_id = uid) then
    return 'banned';
  end if;
  if p_role is null then
    delete from public.admins where user_id = uid;
  else
    insert into public.admins (user_id, role) values (uid, p_role)
      on conflict (user_id) do update set role = excluded.role;
  end if;
  if was is distinct from p_role then
    perform public.staff_note('role', nm, coalesce(p_role, 'player'));
  end if;
  return 'ok';
end $$;

create or replace function public.admin_give(p_name text, p_catalyst text, p_qty int, p_note text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  uid uuid;
  nm text;
begin
  perform public.require_rank(2);
  if p_qty is null or p_qty < 1 or p_qty > 10000 or coalesce(p_catalyst, '') !~ '^[a-z]{2,20}$' then
    return 'invalid';
  end if;
  if coalesce(btrim(p_name), '') <> '' then
    select id, display_name into uid, nm from public.profiles where lower(display_name) = lower(btrim(p_name));
    if uid is null then
      return 'not_found';
    end if;
  end if;
  insert into public.gifts (user_id, catalyst, qty, note) values (uid, p_catalyst, p_qty, left(nullif(p_note, ''), 140));
  perform public.staff_note('gift', coalesce(nm, 'Everyone'), p_qty || ' × ' || p_catalyst);
  return 'ok';
end $$;

-- backups and the reset stay with the owner
create or replace function public.admin_backups()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_rank(3);
  return coalesce((select jsonb_agg(jsonb_build_object('id', id, 'at', at, 'kind', kind, 'label', label, 'players', players, 'size', size) order by at desc)
    from public.backups), '[]'::jsonb);
end $$;

create or replace function public.admin_backup(p_label text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_rank(3);
  perform public.backup_make('manual', p_label);
  return public.admin_backups();
end $$;

create or replace function public.admin_backup_get(p_id bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_rank(3);
  return (select data from public.backups where id = p_id);
end $$;

create or replace function public.admin_restore(p_id bigint, p_data jsonb, p_confirm text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  d jsonb := coalesce(p_data, (select data from public.backups where id = p_id));
begin
  perform public.require_rank(3);
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
  perform public.require_rank(3);
  if p_confirm is distinct from 'RESET EVERYTHING' then
    raise exception 'not confirmed';
  end if;
  perform public.backup_make('before', 'Before the reset');
  perform public.reset_everyone();
  return public.admin_backups();
end $$;

revoke all on function public.admin_log() from public, anon;
revoke all on function public.admin_promote(text, text) from public, anon;
grant execute on function public.admin_log() to authenticated;
grant execute on function public.admin_promote(text, text) to authenticated;
