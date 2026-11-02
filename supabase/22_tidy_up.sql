-- part 22: a quark check for brand new saves, and the offline rolls cleared out for good

-- 1. the offline tracking that never got switched on
drop function if exists public.offline_return(text, uuid);
drop function if exists public.offline_heartbeat(text, uuid);
drop function if exists public.offline_record_online_activity(uuid);
drop table if exists public.offline_claims;
drop table if exists public.offline_activity;
drop table if exists public.offline_state;

-- 2. the quark checks on saves compare against the last save, so a save with nothing before it went unchecked:
-- the very first one, or the first real one after an empty start. Nobody starts with more than a handful of quarks
create or replace function public.report_quark_new_save()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  q double precision;
  who text;
begin
  -- backups being put back come through here as staff, not as the player
  if auth.uid() is distinct from new.user_id then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.data ? 'elementalQuarks' then
    return new;
  end if;
  begin
    q := (new.data->>'elementalQuarks')::double precision;
  exception when others then
    return new;
  end;
  -- NaN sorts above every number, so it fails this too
  if q is null or (q >= 0 and q <= 250000) then
    return new;
  end if;
  if (select count(*) from public.quark_alerts where user_id = new.user_id and at > now() - interval '1 hour') >= 5 then
    return new;
  end if;
  insert into public.quark_alerts (user_id, before, after) values (new.user_id, 0, q);
  select display_name into who from public.profiles where id = new.user_id;
  who := left(regexp_replace(coalesce(nullif(who, ''), 'A player'), '[[:cntrl:]]', ' ', 'g'), 80);
  perform public.alert_post(who || ' - quark count. Suspicious new save starting on '
    || case when q = 'NaN' then 'NaN' when q in ('Infinity', '-Infinity') then 'infinite' when q < 0 then 'a negative' else public.fmt_int(q) end
    || ' quarks', new.user_id);
  return new;
exception when others then
  raise warning 'new save quark report failed: %', sqlerrm;
  return new;
end $$;
revoke all on function public.report_quark_new_save() from public, anon, authenticated;

drop trigger if exists saves_new_quark_report on public.saves;
create trigger saves_new_quark_report after insert or update on public.saves
  for each row execute function public.report_quark_new_save();

-- 3. presses numbered from 2^31 up were the offline rolls. The roll check now turns them away and only
-- counts presses made in the game. Catalysts that dropped during offline rolls before they went still
-- check out (ac_src_check and the 'away' budget), so nobody gets flagged for using one. That part can go after the next reset
do $$
declare
  def text;
  swaps text[];
  i int;
begin
  def := pg_get_functiondef('public.ac_check_rolls(uuid, text, integer, jsonb)'::regprocedure);
  swaps := array[
    E'  away boolean;\n', '',
    E'  away := n >= 2147483648;\n', '',
    'n >= 4294967296', 'n >= 2147483648',
    $a$  if away then
    tot := (select sum(case when x.dev = d.dev then greatest(x.atop, n - 2147483648) else x.atop end + 1) from public.ac_devices x where x.user_id = uid);
  else
    tot := (select sum(case when x.dev = d.dev then greatest(x.top, n) else x.top end + 1) from public.ac_devices x where x.user_id = uid);
  end if;
$a$, $a$  tot := (select sum(case when x.dev = d.dev then greatest(x.top, n) else x.top end + 1) from public.ac_devices x where x.user_id = uid);
$a$,
    'public.ac_budget(uid, away)', 'public.ac_budget(uid, false)',
    $a$ or ((ev->>'s')::bigint >= 2147483648) <> away then$a$, $a$ or (ev->>'s')::bigint >= 2147483648 then$a$,
    $a$  if away then
    update public.ac_devices x set atop = greatest(x.atop, n - 2147483648), last_at = now() where x.user_id = uid and x.dev = d.dev;
  else
    update public.ac_devices x set top = greatest(x.top, n), last_at = now() where x.user_id = uid and x.dev = d.dev;
  end if;
$a$, $a$  update public.ac_devices x set top = greatest(x.top, n), last_at = now() where x.user_id = uid and x.dev = d.dev;
$a$
  ];
  for i in 1 .. array_length(swaps, 1) by 2 loop
    if position(swaps[i] in def) = 0 then
      raise exception 'ac_check_rolls is not the part 9 version, nothing was changed (missing: %)', left(swaps[i], 60);
    end if;
    def := replace(def, swaps[i], swaps[i + 1]);
  end loop;
  if def ~ '\maway\M' then
    raise exception 'ac_check_rolls still mentions away, nothing was changed';
  end if;
  execute def;

  def := pg_get_functiondef('public.dice_seeds(text, jsonb)'::regprocedure);
  if position(E'    \'a\', d.atop,\n' in def) = 0 then
    raise exception 'dice_seeds is not the part 9 version, nothing was changed';
  end if;
  execute replace(def, E'    \'a\', d.atop,\n', '');

  if exists (select 1 from pg_proc p where p.pronamespace = 'public'::regnamespace and p.prosrc ~ '\matop\M') then
    raise exception 'something else still uses ac_devices.atop, nothing was changed: %',
      (select string_agg(proname, ', ') from pg_proc p where p.pronamespace = 'public'::regnamespace and p.prosrc ~ '\matop\M');
  end if;
  alter table public.ac_devices drop column atop;
end $$;
