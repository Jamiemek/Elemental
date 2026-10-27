-- part 13: keeping within the free plan
-- one save write per player every 10 seconds at most. The game waits and tries again if told too soon
create or replace function public.saves_throttle()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.updated_at > now() - interval '10 seconds' then
    raise exception 'too soon';
  end if;
  return new;
end $$;
drop trigger if exists saves_throttle on public.saves;
create trigger saves_throttle before update on public.saves
  for each row execute function public.saves_throttle();

-- logs only keep the last month or two, tidied now and then as finds come in
create or replace function public.logs_tidy()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if random() < 0.005 then
    delete from public.roll_submissions where at < now() - interval '30 days';
    delete from public.ac_rejects where at < now() - interval '30 days';
    delete from public.quark_alerts where at < now() - interval '30 days';
    delete from public.client_errors where last_at < now() - interval '60 days';
  end if;
  return null;
end $$;
drop trigger if exists logs_tidy on public.roll_submissions;
create trigger logs_tidy after insert on public.roll_submissions
  for each row execute function public.logs_tidy();
