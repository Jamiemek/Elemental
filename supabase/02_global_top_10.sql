-- Elemental database, part 2: element odds and the global top 10 board

-- Every element's base odds, exactly as the game uses them (after its own adjustment)
create table if not exists public.elements (
  symbol text primary key,
  odds numeric not null
);
insert into public.elements (symbol, odds) values
  ('H', 4), ('He', 21), ('Li', 54), ('Be', 114), ('B', 137), ('C', 13),
  ('N', 21), ('O', 2), ('F', 93), ('Ne', 466), ('Na', 2033), ('Mg', 114),
  ('Al', 73), ('Si', 1181), ('P', 73), ('S', 37), ('Cl', 54), ('Ar', 466),
  ('K', 2990), ('Ca', 93), ('Sc', 4032), ('Ti', 137), ('V', 2033), ('Cr', 160),
  ('Mn', 346), ('Fe', 184), ('Co', 803), ('Ni', 346), ('Cu', 73), ('Zn', 114),
  ('Ga', 2033), ('Ge', 2500), ('As', 1592), ('Se', 803), ('Br', 466), ('Kr', 4032),
  ('Rb', 7571), ('Sr', 466), ('Y', 2990), ('Zr', 2033), ('Nb', 5148), ('Mo', 1181),
  ('Tc', 85804), ('Ru', 7571), ('Rh', 17582), ('Pd', 2990), ('Ag', 54), ('Cd', 1025),
  ('In', 3501), ('Sn', 346), ('Sb', 1592), ('Te', 4032), ('I', 289), ('Xe', 6330),
  ('Cs', 8866), ('Ba', 466), ('La', 4032), ('Ce', 2033), ('Pr', 8866), ('Nd', 6330),
  ('Pm', 119082), ('Sm', 8866), ('Eu', 5148), ('Gd', 5148), ('Tb', 13037), ('Dy', 6330),
  ('Ho', 13037), ('Er', 6330), ('Tm', 17582), ('Yb', 4032), ('Lu', 8866), ('Hf', 4032),
  ('Ta', 6330), ('W', 595), ('Re', 8866), ('Os', 13037), ('Ir', 8866), ('Pt', 466),
  ('Au', 93), ('Hg', 289), ('Tl', 5148), ('Pb', 73), ('Bi', 346), ('Po', 129275),
  ('At', 184593), ('Rn', 34870), ('Fr', 299316), ('Ra', 25856), ('Ac', 44524), ('Th', 2033),
  ('Pa', 65474), ('U', 12000000), ('Np', 157993), ('Pu', 129275), ('Am', 139131), ('Cm', 184593),
  ('Bk', 299316), ('Cf', 263582), ('Es', 427396), ('Fm', 427396), ('Md', 485339), ('No', 540416),
  ('Lr', 593154), ('Rf', 693018), ('Db', 740643), ('Sg', 786972), ('Bh', 832146), ('Hs', 876280),
  ('Mt', 919468), ('Ds', 961794), ('Rg', 1003325), ('Cn', 1044123), ('Nh', 1084240), ('Fl', 1123723),
  ('Mc', 1162612), ('Lv', 1200945), ('Ts', 1238754), ('Og', 1312915)
on conflict (symbol) do update set odds = excluded.odds;

-- Rolls that made it onto (or once made it onto) the global top 10
create table if not exists public.global_rolls (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  formula text not null,
  odds_log double precision not null,
  score double precision not null,
  found_at timestamptz not null default now(),
  removed boolean not null default false,
  unique (user_id, formula)
);
create index if not exists global_rolls_odds on public.global_rolls (odds_log desc, found_at);
create index if not exists global_rolls_score on public.global_rolls (score desc, found_at);

-- Every submission, kept for rate limits and for spotting cheats later
create table if not exists public.roll_submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  formula text not null,
  odds_log double precision,
  at timestamptz not null default now()
);
create index if not exists roll_submissions_user_at on public.roll_submissions (user_id, at desc);

alter table public.elements enable row level security;
alter table public.global_rolls enable row level security;
alter table public.roll_submissions enable row level security;

drop policy if exists "elements are public" on public.elements;
create policy "elements are public" on public.elements for select using (true);
drop policy if exists "board is public" on public.global_rolls;
create policy "board is public" on public.global_rolls for select using (not removed);
-- roll_submissions has no policies: only the server functions can read or write it

grant select on public.elements to anon, authenticated;
grant select on public.global_rolls to anon, authenticated;
