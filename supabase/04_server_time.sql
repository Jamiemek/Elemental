-- Elemental database, part 4: the server's clock, so time away can't be faked by
-- changing a device's clock. Run in the Supabase SQL Editor. Safe to run more than once.
create or replace function public.server_time()
returns timestamptz language sql stable as $$
  select now();
$$;
grant execute on function public.server_time() to anon, authenticated;
