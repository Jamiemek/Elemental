-- part 12: the chain bonus now grows from x0.2 to x3, reached at an odds total of 1.5 billion
create or replace function public.formula_score(p_formula text, p_ion int)
returns double precision language plpgsql stable set search_path = '' as $$
declare
  part text[];
  c int;
  n int := 0;
  s double precision := 0;
begin
  for part in select regexp_matches(p_formula, '([A-Z][a-z]?)([0-9]*)', 'g') loop
    c := coalesce(nullif(part[2], '')::int, 1);
    n := n + c;
    s := s + c * coalesce((select e.odds from public.elements e where e.symbol = part[1]), 0);
  end loop;
  s := s * (1 + (n - 1) * least(3, 0.2 + 2.8 * power(ln(1 + s / 1000000) / ln(1501), 2)));
  return case when p_ion > 0 then s * 1.5 * p_ion when p_ion < 0 then s * 3 * (-p_ion) else s end;
end $$;

-- finds already on the board, scored the new way so everything is ranked alike
update public.global_rolls set score = public.formula_score(formula, ion);
