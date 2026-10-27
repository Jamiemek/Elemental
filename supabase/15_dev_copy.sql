-- part 15: the dev copy of the game, kept where only admins can get at it
create table if not exists public.dev_copy (
  id int primary key default 1 check (id = 1),
  ver bigint not null,
  at timestamptz not null default now(),
  size int,
  data text not null
);
alter table public.dev_copy enable row level security;

-- just the version, so a device that already has this one doesn't download it again
create or replace function public.admin_dev_info()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return (select jsonb_build_object('ver', ver, 'at', at, 'size', size) from public.dev_copy where id = 1);
end $$;

create or replace function public.admin_dev_get()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return (select jsonb_build_object('ver', ver, 'data', data) from public.dev_copy where id = 1);
end $$;

create or replace function public.admin_dev_put(p_data text, p_size int)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  if p_data is null or length(p_data) > 5000000 then
    raise exception 'too big';
  end if;
  insert into public.dev_copy (id, ver, at, size, data)
    values (1, (extract(epoch from clock_timestamp()) * 1000)::bigint, now(), p_size, p_data)
    on conflict (id) do update set ver = excluded.ver, at = excluded.at, size = excluded.size, data = excluded.data;
  return public.admin_dev_info();
end $$;

revoke all on function public.admin_dev_info() from public, anon;
revoke all on function public.admin_dev_get() from public, anon;
revoke all on function public.admin_dev_put(text, int) from public, anon;
grant execute on function public.admin_dev_info() to authenticated;
grant execute on function public.admin_dev_get() to authenticated;
grant execute on function public.admin_dev_put(text, int) to authenticated;
