-- imitate Supabase: roles, auth schema, auth.uid() from a session setting
do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant usage on schema public to anon, authenticated;
insert into auth.users values ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002');

create schema if not exists net;
create table if not exists net.sent (id bigserial, url text, body jsonb, headers jsonb);
create or replace function net.http_post(url text, body jsonb default '{}', params jsonb default '{}', headers jsonb default '{}', timeout_milliseconds int default 5000)
returns bigint language sql as $$ insert into net.sent (url, body, headers) values (url, body, headers) returning id $$;
create schema if not exists vault;
create table if not exists vault.secrets_store (name text, decrypted_secret text);
create or replace view vault.decrypted_secrets as select * from vault.secrets_store;
do $$ begin create publication supabase_realtime; exception when others then null; end $$;
