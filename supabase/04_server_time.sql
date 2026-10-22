create or replace function public.server_time()
returns timestamptz language sql stable as $$
  select now();
$$;
grant execute on function public.server_time() to anon, authenticated;
