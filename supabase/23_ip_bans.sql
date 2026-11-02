-- part 23: new accounts are banned when they share an IP with a banned player, as well as a device,
-- and both kinds of automatic ban show up in the staff log

-- the IPs each account has saved from. Kept for 30 days after they were last seen
create table if not exists public.ac_ips (
  user_id uuid references auth.users (id) on delete cascade,
  ip inet not null,
  first_at timestamptz not null default now(),
  last_at timestamptz not null default now(),
  primary key (user_id, ip)
);
create index if not exists ac_ips_ip on public.ac_ips (ip);
alter table public.ac_ips enable row level security;

-- Cloudflare sets cf-connecting-ip itself. x-forwarded-for can start with anything the player likes,
-- so if it has to be used, the real address is the one added last
create or replace function public.request_ip()
returns inet language plpgsql stable set search_path = '' as $$
declare
  h json;
begin
  h := nullif(current_setting('request.headers', true), '')::json;
  return coalesce(nullif(btrim(h->>'cf-connecting-ip'), ''), nullif(btrim(regexp_replace(h->>'x-forwarded-for', '^.*,', '')), ''))::inet;
exception when others then
  return null;
end $$;
revoke all on function public.request_ip() from public, anon, authenticated;

-- bans uid for sharing something with a banned player, and notes it in the log
create or replace function public.auto_ban(uid uuid, other uuid, what text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  nm text := (select display_name from public.profiles where id = uid);
  was text := coalesce((select display_name from public.profiles where id = other), 'a banned player');
begin
  if public.rank_of(uid) > 0 then
    return;
  end if;
  insert into public.bans (user_id, reason, at) values (uid, 'Automatic ban: same ' || what || ' as ' || was, now())
    on conflict (user_id) do nothing;
  if found then
    insert into public.staff_log (by_name, action, target, detail)
      values ('Auto-ban', 'ban', coalesce(nm, 'a new account'), 'same ' || what || ' as ' || was);
  end if;
end $$;
revoke all on function public.auto_ban(uuid, uuid, text) from public, anon, authenticated;

-- the device check as before, now through auto_ban so it reaches the log
create or replace function public.ban_new_account_on_shared_device()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_dev text := nullif(btrim(new.data->>'dev'), '');
  other uuid;
begin
  if v_dev is null then
    return new;
  end if;
  -- keep the device on record even if the save goes later
  insert into public.ac_devices (user_id, dev) values (new.user_id, v_dev) on conflict (user_id, dev) do nothing;
  select b.user_id into other from public.bans b join public.ac_devices d on d.user_id = b.user_id
    where d.dev = v_dev and b.user_id <> new.user_id limit 1;
  if other is not null then
    perform public.auto_ban(new.user_id, other, 'device');
  end if;
  return new;
exception when others then
  raise warning 'device ban check failed: %', sqlerrm;
  return new;
end $$;

-- every save notes the IP it came from. A brand new account on the IP of a player banned in the
-- last 30 days is banned too. Accounts more than a day old are left alone, so a reset doesn't ban
-- everyone who has ever shared wifi with a cheater
create or replace function public.saves_ip_check()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_ip inet;
  other uuid;
begin
  if auth.uid() is distinct from new.user_id then
    return new;
  end if;
  v_ip := public.request_ip();
  if v_ip is null then
    return new;
  end if;
  insert into public.ac_ips (user_id, ip) values (new.user_id, v_ip)
    on conflict (user_id, ip) do update set last_at = now();
  if tg_op = 'INSERT' and exists (select 1 from public.profiles where id = new.user_id and created_at > now() - interval '1 day') then
    select i.user_id into other from public.ac_ips i join public.bans b on b.user_id = i.user_id
      where i.ip = v_ip and i.user_id <> new.user_id and i.last_at > now() - interval '30 days'
      order by i.last_at desc limit 1;
    if other is not null then
      perform public.auto_ban(new.user_id, other, 'IP');
    end if;
  end if;
  return new;
exception when others then
  raise warning 'ip check failed: %', sqlerrm;
  return new;
end $$;
revoke all on function public.saves_ip_check() from public, anon, authenticated;

drop trigger if exists saves_ip_check on public.saves;
create trigger saves_ip_check after insert or update on public.saves
  for each row execute function public.saves_ip_check();

-- old addresses go after 30 days
select cron.schedule('elemental-ip-tidy', '30 4 * * *', 'delete from public.ac_ips where last_at < now() - interval ''30 days''');
