-- part 11: error reports from players' games, and deleting a player on request
-- new errors are posted to the webhook in the vault as 'discord_errors', if there is one

create table if not exists public.client_errors (
  id bigint generated always as identity primary key,
  sig text not null unique,
  msg text,
  where_at text,
  ver text,
  agent text,
  seen int not null default 1,
  first_at timestamptz not null default now(),
  last_at timestamptz not null default now()
);
alter table public.client_errors enable row level security;

create or replace function public.webhook_post(p_secret text, msg text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  url text;
begin
  select decrypted_secret into url from vault.decrypted_secrets where name = p_secret limit 1;
  if url is null then
    return;
  end if;
  perform net.http_post(
    url := url,
    body := jsonb_build_object('content', left(msg, 1900), 'allowed_mentions', jsonb_build_object('parse', '[]'::jsonb)),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
exception when others then
  raise warning 'webhook post failed: %', sqlerrm;
end $$;
revoke all on function public.webhook_post(text, text) from public, anon, authenticated;

-- the same error from the same version only counts up after the first report
create or replace function public.report_error(p_msg text, p_where text, p_ver text, p_agent text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  s text;
  dev text;
begin
  if p_msg is null or length(p_msg) = 0 then
    return;
  end if;
  p_msg := left(p_msg, 300);
  p_where := left(coalesce(p_where, ''), 60);
  p_ver := left(coalesce(p_ver, ''), 20);
  s := md5(p_ver || '|' || p_msg || '|' || p_where);
  update public.client_errors set seen = seen + 1, last_at = now() where sig = s;
  if found then
    return;
  end if;
  if (select count(*) from public.client_errors where first_at > now() - interval '1 hour') >= 50 then
    return;
  end if;
  insert into public.client_errors (sig, msg, where_at, ver, agent) values (s, p_msg, p_where, p_ver, left(p_agent, 200));
  dev := case
    when p_agent ~* 'iphone|ipad' then 'iPhone/iPad'
    when p_agent ~* 'android' then 'Android'
    when p_agent ~* 'mac os' then 'Mac'
    when p_agent ~* 'windows' then 'Windows'
    else 'other' end ||
    case when p_agent ~* 'firefox' then ', Firefox' when p_agent ~* 'edg/' then ', Edge' when p_agent ~* 'chrome|crios' then ', Chrome'
      when p_agent ~* 'safari' then ', Safari' else '' end;
  perform public.webhook_post('discord_errors', 'New game error in ' || p_ver || ' (' || dev || '): ' || p_msg || ' at ' || p_where);
end $$;
revoke all on function public.report_error(text, text, text, text) from public;
grant execute on function public.report_error(text, text, text, text) to anon, authenticated;

-- for deletion requests, run in the SQL editor: select public.forget_player('Name');
-- the account goes, and everything tied to it with it, then the announcements under that name
create or replace function public.forget_player(p_name text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  uid uuid;
  nm text;
begin
  select id, display_name into uid, nm from public.profiles where lower(display_name) = lower(p_name);
  if uid is null then
    return 'no player called ' || p_name;
  end if;
  delete from public.announcements where display_name = nm;
  delete from auth.users where id = uid;
  return 'deleted ' || nm;
end $$;
revoke all on function public.forget_player(text) from public, anon, authenticated;
