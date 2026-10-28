-- part 21: most superheavies move just inside tier 6, so a tier 7 or 8 find on its own stays special.
-- Same odds as js/data.js. Run it as the update goes out: the roll check uses these odds too

update public.elements e set odds = v.odds
from (values ('Bh', 1020000), ('Hs', 1067677), ('Mt', 1117582), ('Ds', 1169820), ('Rg', 1224500), ('Cn', 1281735),
  ('Nh', 1341646), ('Fl', 1404358), ('Mc', 1470000), ('Lv', 3100000), ('Ts', 5996666), ('Og', 11600000)) v(sym, odds)
where e.symbol = v.sym;

update public.ac_pool p set odds = v.odds
from (values ('Bh', 1020000), ('Hs', 1067677), ('Mt', 1117582), ('Ds', 1169820), ('Rg', 1224500), ('Cn', 1281735),
  ('Nh', 1341646), ('Fl', 1404358), ('Mc', 1470000), ('Lv', 3100000), ('Ts', 5996666), ('Og', 11600000)) v(sym, odds)
where p.sym = v.sym;

-- the global top 10 scored again with the new odds
update public.global_rolls set score = public.formula_score(formula, ion), odds_log = public.formula_log(formula, ion) where true;
