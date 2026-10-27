-- part 17: Linked Reaction and Family Magnet don't run alongside single-roll luck (Precision Lens up to Singularity)
-- The game won't let them be used together. This makes the server agree: a find that used both isn't counted

-- the full check from part 9 carries on as it is, under a new name
do $$ begin
  if not exists (select 1 from pg_proc where proname = 'ac_check_rolls' and pronamespace = 'public'::regnamespace) then
    alter function public.ac_check(uuid, text, int, jsonb) rename to ac_check_rolls;
  end if;
end $$;
revoke all on function public.ac_check_rolls(uuid, text, int, jsonb) from public, anon, authenticated;

create or replace function public.ac_check(uid uuid, p_formula text, p_ion int, pf jsonb) returns text
language plpgsql security definer set search_path = '' as $$
begin
  if pf is not null and jsonb_typeof(pf->'p') = 'object' and ((pf->'p'->>'ln') = '1' or (pf->'p'->>'mg') = '1')
    and jsonb_typeof(pf->'p'->'ch') = 'array'
    and exists (select 1 from jsonb_array_elements(pf->'p'->'ch') c join public.ac_cats a on a.id = c->>'id' where a.fx ? 'rollLuck') then
    return 'catalyst';
  end if;
  return public.ac_check_rolls(uid, p_formula, p_ion, pf);
end $$;
revoke all on function public.ac_check(uuid, text, int, jsonb) from public, anon, authenticated;
