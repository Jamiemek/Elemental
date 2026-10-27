-- part 10: alerts in the admins' suspicious-activity channel
-- the channel's webhook goes in the vault as 'discord_alerts'

create table if not exists public.quark_alerts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete cascade,
  before double precision,
  after double precision,
  at timestamptz not null default now()
);
alter table public.quark_alerts enable row level security;

create or replace function public.alert_post(msg text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  url text;
begin
  select decrypted_secret into url from vault.decrypted_secrets where name = 'discord_alerts' limit 1;
  if url is null then
    return;
  end if;
  perform net.http_post(
    url := url,
    body := jsonb_build_object('content', left(msg, 1900), 'allowed_mentions', jsonb_build_object('parse', '[]'::jsonb)),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
exception when others then
  raise warning 'alert post failed: %', sqlerrm;
end $$;
revoke all on function public.alert_post(text) from public, anon, authenticated;

-- a find the dice didn't back up. A find sent twice is usually just a dropped connection, so not those
create or replace function public.ac_rejects_alert()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  nm text;
begin
  if new.why = 'used' or new.user_id is null then
    return new;
  end if;
  if (select count(*) from public.ac_rejects where user_id = new.user_id and at > now() - interval '1 hour') > 10 then
    return new;
  end if;
  select display_name into nm from public.profiles where id = new.user_id;
  perform public.alert_post(coalesce(nm, 'A player') || ' - anticheat caught potentially fraudulent find. ' ||
    coalesce(new.formula, '?') || public.ion_text(coalesce(new.ion, 0)) || ' (' || coalesce(new.why, '?') || ')');
  return new;
end $$;
drop trigger if exists ac_rejects_alert on public.ac_rejects;
create trigger ac_rejects_alert after insert on public.ac_rejects
  for each row execute function public.ac_rejects_alert();

-- the game reports quarks that jumped by more than 300,000 at once
create or replace function public.report_quarks(p_before double precision, p_after double precision)
returns void language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  nm text;
begin
  if uid is null or p_before is null or p_after is null or p_before < 0 or p_after - p_before <= 300000
    or p_after = 'Infinity'::double precision or p_after = 'NaN'::double precision then
    return;
  end if;
  if (select count(*) from public.quark_alerts where user_id = uid and at > now() - interval '1 hour') >= 5 then
    return;
  end if;
  insert into public.quark_alerts (user_id, before, after) values (uid, p_before, p_after);
  select display_name into nm from public.profiles where id = uid;
  perform public.alert_post(coalesce(nm, 'A player') || ' - quark count. Suspicious increase ' ||
    public.fmt_int(p_before) || ' -> ' || public.fmt_int(p_after));
end $$;
revoke all on function public.report_quarks(double precision, double precision) from public, anon;
grant execute on function public.report_quarks(double precision, double precision) to authenticated;
