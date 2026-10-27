-- part 9: checked rolls
-- rolls come from dice the server can roll again, so a find only goes on the board if the
-- dice really give it, with nothing stronger than a maxed player has

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.ac_secret (
  id int primary key default 1 check (id = 1),
  k bytea not null
);
insert into public.ac_secret (k) select extensions.gen_random_bytes(32)
  where not exists (select 1 from public.ac_secret);

-- the most a fully maxed player can have. Raise these when new bonds or catalysts go further
create table if not exists public.ac_limits (
  id int primary key default 1 check (id = 1),
  v jsonb not null
);
insert into public.ac_limits (v) values (jsonb_build_object(
  'since', now(),
  'luck', 701, 'joke', 10, 'refund', 35, 'stock', 60.3, 'rate', 100, 'dup', 30.1, 'drop', 0.21,
  'evmult', 2.76, 'evlen', 25,
  'fam', '{"alkali":75,"alkaline":75,"halogen":75,"noble":75,"nonmetal":75,"transition":100,"metalloid":100,"post":100,"lanth":150,"actin":150,"unknown":200}'::jsonb,
  'press', 1.0, 'away', 20, 'devices', 3, 'slack', 10000, 'restock', 300, 'maxdev', 30
)) on conflict (id) do nothing;

create table if not exists public.ac_devices (
  user_id uuid references auth.users (id) on delete cascade,
  dev text not null,
  created_at timestamptz not null default now(),
  last_at timestamptz not null default now(),
  top bigint not null default -1,
  atop bigint not null default -1,
  primary key (user_id, dev)
);
create table if not exists public.ac_used (
  user_id uuid references auth.users (id) on delete cascade,
  dev text not null,
  n bigint not null,
  k int not null,
  primary key (user_id, dev, n, k)
);
-- which group of catalysts each source belongs to, and what that group has done so far
create table if not exists public.ac_src (
  user_id uuid references auth.users (id) on delete cascade,
  src text not null,
  grp text not null,
  primary key (user_id, src)
);
create table if not exists public.ac_grp (
  user_id uuid references auth.users (id) on delete cascade,
  grp text not null,
  dev text not null,
  s bigint,
  h jsonb,
  primary key (user_id, grp)
);
-- catalysts held when this went in
create table if not exists public.ac_legacy (
  user_id uuid references auth.users (id) on delete cascade,
  cat text not null,
  qty int not null,
  primary key (user_id, cat)
);
create table if not exists public.ac_rejects (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete cascade,
  at timestamptz not null default now(),
  formula text,
  ion int,
  why text,
  proof jsonb
);
create index if not exists ac_rejects_at on public.ac_rejects (at desc);

-- the roll pool and catalysts, in the game's own order
create table if not exists public.ac_pool (
  ord int primary key,
  sym text not null,
  odds double precision not null,
  joke boolean not null,
  fam text not null
);
create table if not exists public.ac_cats (
  ord int primary key,
  id text not null unique,
  tier int not null,
  joke boolean not null,
  rolls int not null,
  fx jsonb not null
);
truncate public.ac_pool;
insert into public.ac_pool (ord, sym, odds, joke, fam) values
  (0, 'H', 4, false, 'nonmetal'), (1, 'He', 21, false, 'noble'), (2, 'Li', 54, false, 'alkali'), (3, 'Be', 114, false, 'alkaline'), (4, 'B', 137, false, 'metalloid'), (5, 'C', 13, false, 'nonmetal'),
  (6, 'N', 21, false, 'nonmetal'), (7, 'O', 2, false, 'nonmetal'), (8, 'F', 93, false, 'halogen'), (9, 'Ne', 466, false, 'noble'), (10, 'Na', 2033, false, 'alkali'), (11, 'Mg', 114, false, 'alkaline'),
  (12, 'Al', 73, false, 'post'), (13, 'Si', 1181, false, 'metalloid'), (14, 'P', 73, false, 'nonmetal'), (15, 'S', 37, false, 'nonmetal'), (16, 'Cl', 54, false, 'halogen'), (17, 'Ar', 466, false, 'noble'),
  (18, 'K', 2990, false, 'alkali'), (19, 'Ca', 93, false, 'alkaline'), (20, 'Sc', 4032, false, 'transition'), (21, 'Ti', 137, false, 'transition'), (22, 'V', 2033, false, 'transition'), (23, 'Cr', 160, false, 'transition'),
  (24, 'Mn', 346, false, 'transition'), (25, 'Fe', 184, false, 'transition'), (26, 'Co', 803, false, 'transition'), (27, 'Ni', 346, false, 'transition'), (28, 'Cu', 73, false, 'transition'), (29, 'Zn', 114, false, 'transition'),
  (30, 'Ga', 2033, false, 'post'), (31, 'Ge', 2500, false, 'metalloid'), (32, 'As', 1592, false, 'metalloid'), (33, 'Se', 803, false, 'nonmetal'), (34, 'Br', 466, false, 'halogen'), (35, 'Kr', 4032, false, 'noble'),
  (36, 'Rb', 7571, false, 'alkali'), (37, 'Sr', 466, false, 'alkaline'), (38, 'Y', 2990, false, 'transition'), (39, 'Zr', 2033, false, 'transition'), (40, 'Nb', 5148, false, 'transition'), (41, 'Mo', 1181, false, 'transition'),
  (42, 'Tc', 85804, false, 'transition'), (43, 'Ru', 7571, false, 'transition'), (44, 'Rh', 17582, false, 'transition'), (45, 'Pd', 2990, false, 'transition'), (46, 'Ag', 54, false, 'transition'), (47, 'Cd', 1025, false, 'transition'),
  (48, 'In', 3501, false, 'post'), (49, 'Sn', 346, false, 'post'), (50, 'Sb', 1592, false, 'metalloid'), (51, 'Te', 4032, false, 'metalloid'), (52, 'I', 289, false, 'halogen'), (53, 'Xe', 6330, false, 'noble'),
  (54, 'Cs', 8866, false, 'alkali'), (55, 'Ba', 466, false, 'alkaline'), (56, 'La', 4032, false, 'lanth'), (57, 'Ce', 2033, false, 'lanth'), (58, 'Pr', 8866, false, 'lanth'), (59, 'Nd', 6330, false, 'lanth'),
  (60, 'Pm', 119082, false, 'lanth'), (61, 'Sm', 8866, false, 'lanth'), (62, 'Eu', 5148, false, 'lanth'), (63, 'Gd', 5148, false, 'lanth'), (64, 'Tb', 13037, false, 'lanth'), (65, 'Dy', 6330, false, 'lanth'),
  (66, 'Ho', 13037, false, 'lanth'), (67, 'Er', 6330, false, 'lanth'), (68, 'Tm', 17582, false, 'lanth'), (69, 'Yb', 4032, false, 'lanth'), (70, 'Lu', 8866, false, 'lanth'), (71, 'Hf', 4032, false, 'transition'),
  (72, 'Ta', 6330, false, 'transition'), (73, 'W', 595, false, 'transition'), (74, 'Re', 8866, false, 'transition'), (75, 'Os', 13037, false, 'transition'), (76, 'Ir', 8866, false, 'transition'), (77, 'Pt', 466, false, 'transition'),
  (78, 'Au', 93, false, 'transition'), (79, 'Hg', 289, false, 'transition'), (80, 'Tl', 5148, false, 'post'), (81, 'Pb', 73, false, 'post'), (82, 'Bi', 346, false, 'post'), (83, 'Po', 129275, false, 'post'),
  (84, 'At', 184593, false, 'halogen'), (85, 'Rn', 34870, false, 'noble'), (86, 'Fr', 299316, false, 'alkali'), (87, 'Ra', 25856, false, 'alkaline'), (88, 'Ac', 44524, false, 'actin'), (89, 'Th', 2033, false, 'actin'),
  (90, 'Pa', 65474, false, 'actin'), (91, 'U', 12000000, false, 'actin'), (92, 'Np', 157993, false, 'actin'), (93, 'Pu', 129275, false, 'actin'), (94, 'Am', 139131, false, 'actin'), (95, 'Cm', 184593, false, 'actin'),
  (96, 'Bk', 299316, false, 'actin'), (97, 'Cf', 263582, false, 'actin'), (98, 'Es', 427396, false, 'actin'), (99, 'Fm', 427396, false, 'actin'), (100, 'Md', 485339, false, 'actin'), (101, 'No', 540416, false, 'actin'),
  (102, 'Lr', 593154, false, 'actin'), (103, 'Rf', 693018, false, 'transition'), (104, 'Db', 740643, false, 'transition'), (105, 'Sg', 903664, false, 'transition'), (106, 'Bh', 1102567, false, 'transition'), (107, 'Hs', 1345250, false, 'transition'),
  (108, 'Mt', 1641349, false, 'unknown'), (109, 'Ds', 2002622, false, 'unknown'), (110, 'Rg', 2443414, false, 'unknown'), (111, 'Cn', 2981227, false, 'unknown'), (112, 'Nh', 3637417, false, 'unknown'), (113, 'Fl', 4438039, false, 'unknown'),
  (114, 'Mc', 5414884, false, 'unknown'), (115, 'Lv', 6606739, false, 'unknown'), (116, 'Ts', 8060931, false, 'halogen'), (117, 'Og', 9835201, false, 'noble'), (118, 'Um', 35000000, true, 'joke'), (119, 'Zz', 45000000, true, 'joke'),
  (120, 'Mu', 55000000, true, 'joke'), (121, 'Ln', 70000000, true, 'joke'), (122, 'Df', 90000000, true, 'joke'), (123, 'Cz', 120000000, true, 'joke'), (124, 'Mb', 150000000, true, 'joke'), (125, 'Dj', 190000000, true, 'joke'),
  (126, 'Ha', 230000000, true, 'joke'), (127, 'Ad', 280000000, true, 'joke'), (128, 'Pi', 314159265, true, 'joke'), (129, 'Nu', 350000000, true, 'joke'), (130, 'Xx', 500000000, true, 'joke'), (131, 'Uo', 700000000, true, 'joke'),
  (132, 'Zo', 1000000000, true, 'joke'), (133, 'Gg', 1500000000, true, 'joke');
truncate public.ac_cats;
insert into public.ac_cats (ord, id, tier, joke, rolls, fx) values
  (0, 'alkali', 0, false, 0, '{"fam":"alkali","pct":75}'),
  (1, 'alkaline', 0, false, 0, '{"fam":"alkaline","pct":75}'),
  (2, 'halogen', 0, false, 0, '{"fam":"halogen","pct":75}'),
  (3, 'noble', 0, false, 0, '{"fam":"noble","pct":75}'),
  (4, 'nonmetal', 0, false, 0, '{"fam":"nonmetal","pct":75}'),
  (5, 'spark', 0, false, 0, '{"luck":12.5}'),
  (6, 'trickle', 0, false, 0, '{"quark":25}'),
  (7, 'transition', 1, false, 0, '{"fam":"transition","pct":100}'),
  (8, 'metalloid', 1, false, 0, '{"fam":"metalloid","pct":100}'),
  (9, 'post', 1, false, 0, '{"fam":"post","pct":100}'),
  (10, 'kindling', 1, false, 0, '{"luck":30}'),
  (11, 'accelerant', 1, false, 0, '{"speed":25}'),
  (12, 'primer', 1, false, 0, '{"chain":1}'),
  (13, 'lanth', 2, false, 0, '{"fam":"lanth","pct":150}'),
  (14, 'actin', 2, false, 0, '{"fam":"actin","pct":150}'),
  (15, 'ignition', 2, false, 0, '{"luck":75}'),
  (16, 'linked', 2, false, 10, '{"linked":true}'),
  (17, 'surge', 2, false, 0, '{"quark":100}'),
  (18, 'superheavy', 3, false, 0, '{"fam":"unknown","pct":200}'),
  (19, 'blaze', 3, false, 0, '{"luck":150}'),
  (20, 'twin', 3, false, 0, '{"extra":1}'),
  (21, 'lens', 3, false, 1, '{"rollLuck":400}'),
  (22, 'inferno', 4, false, 0, '{"luck":250}'),
  (23, 'storm', 4, false, 0, '{"chainMax":true}'),
  (24, 'engine', 4, false, 0, '{"quark":400}'),
  (25, 'prism', 4, false, 1, '{"rollLuck":750}'),
  (26, 'fusion', 5, false, 0, '{"luck":300}'),
  (27, 'horizon', 5, false, 1, '{"rollLuck":1500}'),
  (28, 'singularity', 6, false, 1, '{"rollLuck":5000}'),
  (29, 'stone', 6, false, 1, '{"unfound":true}'),
  (30, 'barometer', 0, false, 0, '{"event":50}'),
  (31, 'courier', 2, false, 0, '{"restock":true}'),
  (32, 'qlens', 0, false, 0, '{"lens":50}'),
  (33, 'stabiliser', 1, false, 0, '{"extend":10}'),
  (34, 'rod', 1, false, 0, '{"rod":true}'),
  (35, 'magnet', 1, false, 20, '{"magnet":true}'),
  (36, 'leveller', 1, false, 0, '{"level":true}'),
  (37, 'reagent', 1, true, 0, '{"joke":100}'),
  (38, 'grant', 2, false, 0, '{"grant":true}'),
  (39, 'heavy', 2, false, 0, '{"heavy":25}'),
  (40, 'punchline', 2, true, 0, '{"joke":300}'),
  (41, 'accel', 3, false, 25, '{"chain3":true}'),
  (42, 'bondagent', 3, false, 0, '{"bond":true}'),
  (43, 'logger', 3, false, 0, '{"logger":true}'),
  (44, 'laugh', 3, true, 0, '{"laugh":true}'),
  (45, 'stormseed', 4, false, 0, '{"start":"storm"}'),
  (46, 'colliderkey', 6, false, 0, '{"start":"collider"}'),
  (47, 'gag', 4, true, 0, '{"gag":true}'),
  (48, 'twinhorizon', 5, false, 5, '{"twice":true}'),
  (49, 'containment', 5, false, 0, '{"extend":30}'),
  (50, 'singseed', 5, false, 0, '{"start":"hole"}'),
  (51, 'insidejoke', 6, true, 1, '{"jokeNew":true}');

alter table public.ac_secret enable row level security;
alter table public.ac_limits enable row level security;
alter table public.ac_devices enable row level security;
alter table public.ac_used enable row level security;
alter table public.ac_src enable row level security;
alter table public.ac_grp enable row level security;
alter table public.ac_legacy enable row level security;
alter table public.ac_rejects enable row level security;
alter table public.ac_pool enable row level security;
alter table public.ac_cats enable row level security;

-- the dice: the same sums as the game, on 32-bit numbers kept in bigints
create or replace function public.ac_mul(a bigint, b bigint) returns bigint
language sql immutable parallel safe set search_path = '' as $$
  select ((a * (b & 65535)) + (((a * (b >> 16)) & 65535) << 16)) & 4294967295
$$;
create or replace function public.ac_mix(h bigint) returns bigint
language plpgsql immutable parallel safe set search_path = '' as $$
begin
  h := h # (h >> 16);
  h := public.ac_mul(h, 2246822507);
  h := h # (h >> 13);
  h := public.ac_mul(h, 3266489909);
  h := h # (h >> 16);
  return h;
end $$;
create or replace function public.ac_draw(w bigint[], a bigint, b bigint, c bigint, d bigint) returns double precision
language plpgsql immutable parallel safe set search_path = '' as $$
declare
  h bigint;
  lo bigint;
begin
  h := public.ac_mix(w[1] # (a & 4294967295));
  h := public.ac_mix(h # w[2] # (b & 4294967295));
  h := public.ac_mix(h # w[3] # (c & 4294967295));
  h := public.ac_mix(h # w[4] # (d & 4294967295));
  lo := public.ac_mix(h # 2654435769);
  return (h * 2097152 + (lo >> 11))::double precision / 9007199254740992::double precision;
end $$;
create or replace function public.ac_seed(uid uuid, what text) returns text
language sql stable set search_path = '' as $$
  select substr(encode(extensions.hmac(convert_to(uid::text || ':' || what, 'UTF8'), (select k from public.ac_secret where id = 1), 'sha256'), 'hex'), 1, 32)
$$;
create or replace function public.ac_words(hex text) returns bigint[]
language sql immutable set search_path = '' as $$
  select array[('x' || substr(hex, 1, 8))::bit(32)::bigint, ('x' || substr(hex, 9, 8))::bit(32)::bigint,
    ('x' || substr(hex, 17, 8))::bit(32)::bigint, ('x' || substr(hex, 25, 8))::bit(32)::bigint]
$$;

-- element weights, as weightTable makes them
create or replace function public.ac_weights(odds double precision[], joke boolean[], fam text[], syms text[],
  luck double precision, fx jsonb, jm double precision, lev boolean, only_syms text[],
  out w double precision[], out total double precision)
language plpgsql immutable set search_path = '' as $$
declare
  np int := array_length(odds, 1);
  flat double precision[];
  m double precision;
  v double precision;
  t0 double precision := 0;
  f double precision;
  kk double precision;
begin
  w := array_fill(0::double precision, array[np]);
  flat := w;
  total := 0;
  for i in 1..np loop
    if only_syms is null or syms[i] = any(only_syms) then
      f := coalesce((fx->>fam[i])::double precision, 0);
      m := (1 + f / 100) * (case when joke[i] then jm else 1 end) / odds[i];
      v := m * power(1 + 1.5 * (log(odds[i] + 1) / 3), (luck / 100) / 1.5);
      w[i] := v;
      flat[i] := m;
      total := total + v;
      t0 := t0 + m;
    end if;
  end loop;
  -- leveller
  if lev and t0 <> 0 then
    kk := total / t0;
    total := 0;
    for i in 1..np loop
      w[i] := greatest(w[i], flat[i] * kk);
      total := total + w[i];
    end loop;
  end if;
end $$;

-- one weighted pick. Right on the edge between two elements the last digit of a power can
-- differ between a browser and the server, so there the game's pick is taken as it is
create or replace function public.ac_pick(w double precision[], total double precision, u double precision, claim int) returns int
language plpgsql immutable set search_path = '' as $$
declare
  np int := array_length(w, 1);
  r double precision := u * total;
  i int := 1;
  c double precision := 0;
  tol double precision := total * 1e-9;
begin
  while i < np loop
    r := r - w[i];
    exit when r <= 0;
    i := i + 1;
  end loop;
  if claim is null or claim = i then
    return i;
  end if;
  if claim < 1 or claim > np or w[claim] <= 0 then
    return 0;
  end if;
  for j in 1..claim - 1 loop
    c := c + w[j];
  end loop;
  if u * total >= c - tol and u * total <= c + w[claim] + tol then
    return claim;
  end if;
  return 0;
end $$;

-- one roll of the shop's stock, as shopRoll does it
create or replace function public.ac_shop_roll(w bigint[], a bigint, b bigint, c bigint, i0 int,
  boost double precision, flags int, rate double precision) returns text
language plpgsql stable set search_path = '' as $$
declare
  ps double precision[] := array[60, 26, 9.5, 3.2, 1, 0.25, 0.05]::double precision[];
  tw double precision[];
  tot double precision := 0;
  r double precision;
  tr int := 0;
  x double precision;
  s double precision := 0;
  ids text[];
  wts double precision[];
begin
  tw := array_fill(0::double precision, array[7]);
  for t in 0..6 loop
    tw[t + 1] := ps[t + 1] * (1 + (boost / 100) * t / 3);
    tot := tot + tw[t + 1];
  end loop;
  r := public.ac_draw(w, a, b, c, i0) * tot;
  while tr < 6 loop
    r := r - tw[tr + 1];
    exit when r <= 0;
    tr := tr + 1;
  end loop;
  select array_agg(k.id order by k.ord), array_agg(case when k.joke then 1 + rate / 100 else 1 end order by k.ord)
    into ids, wts
    from public.ac_cats k
    where k.tier = tr and (not k.joke or flags & 1 = 1)
      and not (k.id = 'insidejoke' and flags & 2 = 2) and not (k.id = 'colliderkey' and flags & 4 = 0);
  if ids is null then
    return null;
  end if;
  for q in 1..array_length(wts, 1) loop
    s := s + wts[q];
  end loop;
  x := public.ac_draw(w, a, b, c, i0 + 1) * s;
  for q in 1..array_length(ids, 1) loop
    x := x - wts[q];
    if x < 0 then
      return ids[q];
    end if;
  end loop;
  return ids[array_length(ids, 1)];
end $$;

-- how many presses an account could have made by now, on each kind of counter
create or replace function public.ac_budget(uid uuid, away boolean) returns double precision
language sql stable set search_path = '' as $$
  select coalesce(extract(epoch from now() - min(d.created_at)), 0)
    / (case when away then (l.v->>'away')::double precision else (l.v->>'press')::double precision end)
    * (l.v->>'devices')::double precision + (l.v->>'slack')::double precision
  from public.ac_devices d, public.ac_limits l where d.user_id = uid and l.id = 1 group by l.v
$$;

-- is this where a catalyst of this kind really came from?
create or replace function public.ac_src_ok(uid uuid, src text, want text) returns boolean
language plpgsql stable set search_path = '' as $$
declare
  lim jsonb := (select v from public.ac_limits where id = 1);
  part text[] := string_to_array(src, '|');
  sw bigint[];
  dw bigint[];
  r bigint;
  j bigint;
  n bigint;
  t0 timestamptz;
begin
  if part[1] = 'sh' and array_length(part, 1) between 7 and 8 then
    -- sh|restock|item|copy|stock bonus|flags|joke rate[|duplicate chance]
    r := part[2]::bigint;
    j := part[3]::bigint;
    select min(created_at) into t0 from public.ac_devices where user_id = uid;
    if t0 is null or r < 0 or j < 0 or j > 7
      or r > extract(epoch from now() - t0) / (lim->>'restock')::double precision * 2 + 50
      or part[5]::double precision > (lim->>'stock')::double precision or part[7]::double precision > (lim->>'rate')::double precision
      or part[6]::int not between 0 and 7 or part[4] not in ('0', '1') then
      return false;
    end if;
    sw := public.ac_words(public.ac_seed(uid, 'shop'));
    if part[4] = '1' and (array_length(part, 1) < 8 or part[8]::double precision > (lim->>'dup')::double precision
      or public.ac_draw(sw, r, 0, j, 2) >= part[8]::double precision / 100) then
      return false;
    end if;
    return public.ac_shop_roll(sw, r, 0, j, 0, part[5]::double precision, part[6]::int, part[7]::double precision) = want;
  elsif part[1] = 'd' and array_length(part, 1) = 7 then
    -- d|device|press|stock bonus|flags|joke rate|drop chance
    n := part[3]::bigint;
    if not exists (select 1 from public.ac_devices where user_id = uid and dev = part[2]) or n < 0
      or n > (case when n >= 2147483648 then 2147483648 + public.ac_budget(uid, true) else public.ac_budget(uid, false) end)
      or part[4]::double precision > (lim->>'stock')::double precision or part[6]::double precision > (lim->>'rate')::double precision
      or part[5]::int not between 0 and 7 or part[7]::double precision > (lim->>'drop')::double precision then
      return false;
    end if;
    dw := public.ac_words(public.ac_seed(uid, part[2]));
    if public.ac_draw(dw, n, 2, 0, 0) >= part[7]::double precision / 100 then
      return false;
    end if;
    return public.ac_shop_roll(dw, n, 2, 0, 1, part[4]::double precision, part[5]::int, part[6]::double precision) = want;
  elsif part[1] = 'g' and array_length(part, 1) = 3 then
    -- g|gift|copy
    return exists (select 1 from public.gifts g where g.id = part[2]::bigint and g.catalyst = want and part[3]::int between 0 and g.qty - 1
      and (g.user_id = uid or (g.user_id is null and exists (select 1 from public.gift_claims c where c.gift_id = g.id and c.user_id = uid))));
  elsif part[1] = 'o' and array_length(part, 1) = 3 and part[2] = want then
    -- o|catalyst|copy
    return exists (select 1 from public.ac_legacy l where l.user_id = uid and l.cat = want and part[3]::int between 0 and l.qty - 1);
  end if;
  return false;
exception when others then
  return false;
end $$;

-- the roll again, from the dice. t is the elements the game picked, in order
create or replace function public.ac_roll(w bigint[], n bigint, k int, p jsonb, t jsonb) returns jsonb
language plpgsql stable set search_path = '' as $$
declare
  syms text[];
  ov double precision[];
  jk boolean[];
  fams text[];
  pool_n int;
  luck double precision := (p->>'L')::double precision + (p->>'X')::double precision;
  den double precision := (p->>'D')::double precision;
  linked boolean := (p->>'ln') = '1';
  magnet boolean := (p->>'mg') = '1';
  twice boolean := (p->>'tw') = '1';
  mix boolean := (p->>'M') = '1';
  jokes boolean := (p->>'P') = '1';
  only_l text[];
  wa double precision[];
  ta double precision;
  wo double precision[];
  tot_o double precision;
  wm double precision[];
  tm double precision;
  mfam text;
  di int := 0;
  ti int := 0;
  first_i int := null;
  els int[];
  res int[][];
  pick int;
  claim int;
  u double precision;
  lg double precision[] := array[0, 0]::double precision[];
  keep int;
  plus boolean;
  minus boolean;
  ion int := 0;
  pc double precision;
  rounds int := case when twice then 2 else 1 end;
  a_els int[];
  b_els int[];
begin
  select array_agg(sym order by ord), array_agg(odds order by ord), array_agg(joke order by ord), array_agg(fam order by ord)
    into syms, ov, jk, fams from public.ac_pool where jokes or not joke;
  pool_n := array_length(syms, 1);
  select * into wa, ta from public.ac_weights(ov, jk, fams, syms, luck, p->'F', (p->>'J')::double precision, (p->>'V') = '1', null);
  if p->'o' is not null and jsonb_typeof(p->'o') = 'object' then
    select array_agg(x) into only_l from jsonb_array_elements_text(p->'o'->'l') x;
    select * into wo, tot_o from public.ac_weights(ov, jk, fams, syms, luck, p->'F', (p->>'J')::double precision, (p->>'V') = '1', only_l);
    u := public.ac_draw(w, n, 16 + k, 0, di);
    di := di + 1;
    claim := array_position(syms, t->>ti);
    ti := ti + 1;
    first_i := public.ac_pick(wo, tot_o, u, claim);
    if first_i = 0 then
      return jsonb_build_object('x', 'pick');
    end if;
  end if;
  for round in 1..rounds loop
    if first_i is not null then
      els := array[first_i];
    else
      u := public.ac_draw(w, n, 16 + k, 0, di);
      di := di + 1;
      claim := array_position(syms, t->>ti);
      ti := ti + 1;
      pick := public.ac_pick(wa, ta, u, claim);
      if pick = 0 then
        return jsonb_build_object('x', 'pick');
      end if;
      els := array[pick];
    end if;
    if magnet and (mfam is distinct from fams[els[1]]) then
      mfam := fams[els[1]];
      select * into wm, tm from public.ac_weights(ov, jk, fams, syms, luck, p->'F', (p->>'J')::double precision, (p->>'V') = '1',
        (select array_agg(syms[q]) from generate_series(1, pool_n) q where fams[q] = mfam));
    end if;
    loop
      exit when array_length(els, 1) >= 30;
      if not (linked and array_length(els, 1) = 1) then
        u := public.ac_draw(w, n, 16 + k, 0, di);
        di := di + 1;
        exit when not (u < 1 / den);
      end if;
      u := public.ac_draw(w, n, 16 + k, 0, di);
      di := di + 1;
      claim := array_position(syms, t->>ti);
      ti := ti + 1;
      if magnet then
        pick := public.ac_pick(wm, tm, u, claim);
      else
        pick := public.ac_pick(wa, ta, u, claim);
      end if;
      if pick = 0 then
        return jsonb_build_object('x', 'pick');
      end if;
      -- with mixing off, a joke and a normal element don't chain
      if mix or not jokes or jk[pick] = jk[els[1]] then
        els := els || pick;
      else
        if jk[pick] then
          els := array[pick];
        end if;
        exit;
      end if;
    end loop;
    lg[round] := -(array_length(els, 1) - 1) * log(8::double precision);
    for q in 1..array_length(els, 1) loop
      lg[round] := lg[round] - log(ov[els[q]]);
    end loop;
    if round = 1 then
      a_els := els;
    else
      b_els := els;
    end if;
  end loop;
  if ti <> jsonb_array_length(t) then
    return jsonb_build_object('x', 'trace');
  end if;
  if (p->>'I') = '1' then
    plus := public.ac_draw(w, n, 16 + k, 0, di) < 0.01;
    minus := public.ac_draw(w, n, 16 + k, 0, di + 1) < 0.001;
    di := di + 2;
    if plus or minus then
      pc := case when minus then 0.001 else 0.01 end;
      ion := 1;
      while ion < 3 and public.ac_draw(w, n, 16 + k, 0, di) < pc loop
        ion := ion + 1;
        di := di + 1;
      end loop;
      if minus then
        ion := -ion;
      end if;
    end if;
  end if;
  if not twice then
    return jsonb_build_object('a', (select jsonb_agg(syms[q]) from unnest(a_els) q), 'ion', ion);
  end if;
  -- rolled twice, keeps the rarer; a near tie could go either way
  return jsonb_build_object('a', (select jsonb_agg(syms[q]) from unnest(case when lg[2] < lg[1] then b_els else a_els end) q),
    'b', case when abs(lg[2] - lg[1]) < 1e-9 then (select jsonb_agg(syms[q]) from unnest(case when lg[2] < lg[1] then a_els else b_els end) q) end,
    'ion', ion);
end $$;

-- is list a the start of list b?
create or replace function public.ac_prefix(a jsonb, b jsonb) returns boolean
language sql immutable set search_path = '' as $$
  select jsonb_array_length(a) <= jsonb_array_length(b) and not exists (
    select 1 from generate_series(0, jsonb_array_length(a) - 1) i where a->i <> b->i)
$$;

-- counts of each symbol in a formula
create or replace function public.ac_counts(f text) returns jsonb
language sql immutable set search_path = '' as $$
  select coalesce(jsonb_object_agg(s, c), '{}'::jsonb) from (
    select m[1] s, sum(coalesce(nullif(m[2], '')::int, 1)) c from regexp_matches(f, '([A-Z][a-z]?)([0-9]*)', 'g') m group by m[1]) x
$$;
create or replace function public.ac_counts_of(l jsonb) returns jsonb
language sql immutable set search_path = '' as $$
  select coalesce(jsonb_object_agg(s, c), '{}'::jsonb) from (select s, count(*) c from jsonb_array_elements_text(l) s group by s) x
$$;

-- checks a find. Gives 'ok' and notes what was used, or the reason it can't be counted
create or replace function public.ac_check(uid uuid, p_formula text, p_ion int, pf jsonb) returns text
language plpgsql security definer set search_path = '' as $$
declare
  lim jsonb := (select v from public.ac_limits where id = 1);
  n bigint;
  k int;
  p jsonb := pf->'p';
  d public.ac_devices;
  w bigint[];
  away boolean;
  ch jsonb;
  c jsonb;
  cat public.ac_cats;
  srcs text[];
  s text;
  g text;
  grp public.ac_grp;
  h jsonb;
  e jsonb;
  prev jsonb;
  spent int;
  have_linked boolean := false;
  have_magnet boolean := false;
  have_twice boolean := false;
  have_unfound boolean := false;
  have_joke boolean := false;
  roll_luck double precision := 0;
  ev jsonb := p->'ev';
  evlen double precision;
  e0 double precision;
  e1 double precision;
  e2 double precision;
  lo double precision;
  hi double precision;
  ech double precision;
  r jsonb;
  writes jsonb := '[]'::jsonb;
  tot double precision;
begin
  if pf is null or jsonb_typeof(pf) <> 'object' or p is null or jsonb_typeof(pf->'t') <> 'array' then
    return 'no dice';
  end if;
  if not (p ?& array['L', 'X', 'J', 'D', 'P', 'M', 'I']) or (p->>'D')::double precision <= 0 then
    return 'bad proof';
  end if;
  n := (pf->>'n')::bigint;
  k := (pf->>'k')::int;
  if n is null or n < 0 or n >= 4294967296 or k not between 0 and 3 then
    return 'bad press';
  end if;
  away := n >= 2147483648;
  select * into d from public.ac_devices where user_id = uid and ac_devices.dev = pf->>'d';
  if d.dev is null then
    return 'unknown device';
  end if;
  if exists (select 1 from public.ac_used u where u.user_id = uid and u.dev = d.dev and u.n = (pf->>'n')::bigint and u.k = (pf->>'k')::int) then
    return 'used';
  end if;
  -- no more presses than the account could have made by now
  if away then
    tot := (select sum(case when x.dev = d.dev then greatest(x.atop, n - 2147483648) else x.atop end + 1) from public.ac_devices x where x.user_id = uid);
  else
    tot := (select sum(case when x.dev = d.dev then greatest(x.top, n) else x.top end + 1) from public.ac_devices x where x.user_id = uid);
  end if;
  if tot > public.ac_budget(uid, away) then
    return 'too many presses';
  end if;

  -- settings no stronger than a maxed player's
  if (p->>'L')::double precision > (lim->>'luck')::double precision or (p->>'J')::double precision > (lim->>'joke')::double precision
    or (p->>'J')::double precision < 1 or (p->>'X')::double precision < 0 or coalesce((p->>'R')::double precision, 0) > (lim->>'refund')::double precision
    or (p->>'D')::double precision > 8 then
    return 'settings';
  end if;
  if exists (select 1 from jsonb_each_text(coalesce(p->'F', '{}'::jsonb)) f
      where f.value::double precision > coalesce((lim->'fam'->>f.key)::double precision, 0) or f.value::double precision < 0) then
    return 'settings';
  end if;
  w := public.ac_words(public.ac_seed(uid, d.dev));

  -- catalysts used on this roll
  for c in select * from jsonb_array_elements(coalesce(p->'ch', '[]'::jsonb)) loop
    select * into cat from public.ac_cats where id = c->>'id';
    if cat.id is null or cat.rolls < 1 then
      return 'catalyst';
    end if;
    select array_agg(distinct x) into srcs from jsonb_array_elements_text(coalesce(c->'s', '[]'::jsonb)) x;
    if srcs is null then
      return 'catalyst source';
    end if;
    g := c->'s'->>0;
    foreach s in array srcs loop
      if not public.ac_src_ok(uid, s, cat.id) then
        return 'catalyst source';
      end if;
      if exists (select 1 from public.ac_src x where x.user_id = uid and x.src = s and x.grp <> g) then
        return 'catalyst source';
      end if;
    end loop;
    -- its uses run in a row, one per roll, and a refund only comes when the dice say so
    h := coalesce(c->'h', '[]'::jsonb) || jsonb_build_array(jsonb_build_array(n, k));
    spent := 0;
    prev := null;
    for e in select * from jsonb_array_elements(h) loop
      if prev is not null and not (((e->>0)::bigint = (prev->>0)::bigint and (e->>1)::int = (prev->>1)::int + 1 and (e->>1)::int <= 3)
          or ((e->>0)::bigint = (prev->>0)::bigint + 1 and (e->>1)::int = 0)) then
        return 'catalyst uses';
      end if;
      prev := e;
    end loop;
    for e in select * from jsonb_array_elements(coalesce(c->'h', '[]'::jsonb)) loop
      if public.ac_draw(w, (e->>0)::bigint, 3, cat.ord, (e->>1)::bigint) >= coalesce((p->>'R')::double precision, 0) / 100 then
        spent := spent + 1;
      end if;
    end loop;
    if spent >= array_length(srcs, 1) * cat.rolls then
      return 'catalyst used up';
    end if;
    select * into grp from public.ac_grp x where x.user_id = uid and x.grp = g;
    if grp.grp is not null and (grp.dev <> d.dev or grp.h is null or not (public.ac_prefix(grp.h, h) or public.ac_prefix(h, grp.h))) then
      return 'catalyst uses';
    end if;
    writes := writes || jsonb_build_object('g', g, 's', to_jsonb(srcs), 'h', h);
    have_linked := have_linked or (cat.fx->>'linked') = 'true';
    have_magnet := have_magnet or (cat.fx->>'magnet') = 'true';
    have_twice := have_twice or (cat.fx->>'twice') = 'true';
    have_unfound := have_unfound or (cat.fx->>'unfound') = 'true';
    have_joke := have_joke or (cat.fx->>'jokeNew') = 'true';
    roll_luck := roll_luck + coalesce((cat.fx->>'rollLuck')::double precision, 0);
  end loop;

  -- the event behind the press
  if ev is not null and jsonb_typeof(ev) = 'object' then
    if ev->>'id' not in ('collider', 'hole') then
      return 'event';
    end if;
    evlen := round((case when ev->>'id' = 'collider' then 30 else 50 end) * (1 + (lim->>'evlen')::double precision / 100) * 2);
    if (ev->>'c') = '1' then
      -- started by a catalyst
      select array_agg(distinct x) into srcs from jsonb_array_elements_text(coalesce(ev->'src', '[]'::jsonb)) x;
      if srcs is null or n < (ev->>'s')::bigint or n >= (ev->>'s')::bigint + evlen then
        return 'event';
      end if;
      g := ev->'src'->>0;
      foreach s in array srcs loop
        if not public.ac_src_ok(uid, s, case when ev->>'id' = 'collider' then 'colliderkey' else 'singseed' end)
          or exists (select 1 from public.ac_src x where x.user_id = uid and x.src = s and x.grp <> g) then
          return 'event';
        end if;
      end loop;
      select * into grp from public.ac_grp x where x.user_id = uid and x.grp = g;
      if grp.grp is not null and (grp.dev <> d.dev or grp.s <> (ev->>'s')::bigint) then
        return 'event';
      end if;
      writes := writes || jsonb_build_object('g', g, 's', to_jsonb(srcs), 'e', (ev->>'s')::bigint);
    else
      -- started by the dice on an earlier press: no storm, and this event's chance came up
      if n <= (ev->>'s')::bigint or n > (ev->>'s')::bigint + evlen or ((ev->>'s')::bigint >= 2147483648) <> away then
        return 'event';
      end if;
      e0 := public.ac_draw(w, (ev->>'s')::bigint, 1, 0, 0);
      e1 := public.ac_draw(w, (ev->>'s')::bigint, 1, 0, 1);
      e2 := public.ac_draw(w, (ev->>'s')::bigint, 1, 0, 2);
      -- some event bonus from 1 up to the most a player can have makes it work
      hi := least((lim->>'evmult')::double precision, e0 * 8000);
      if ev->>'id' = 'collider' then
        if (ev->>'co') <> '1' then
          return 'event';
        end if;
        lo := e1 * 16000;
      elsif (ev->>'co') = '1' then
        hi := least(hi, e1 * 16000);
        lo := e2 * 12000;
      else
        lo := e1 * 12000;
      end if;
      if not (lo < hi and hi >= 1) then
        return 'event';
      end if;
    end if;
  end if;

  -- each part of the roll has to be backed by something
  if ((p->>'ln') = '1' and not have_linked) or ((p->>'mg') = '1' and not have_magnet)
    or ((p->>'tw') = '1' and not have_twice and not (ev is not null and ev->>'id' = 'hole'))
    or ((p->>'tw') <> '1' and (have_twice or (ev is not null and ev->>'id' = 'hole')))
    or (p->>'X')::double precision > roll_luck + (case when have_unfound then 1500 else 0 end) + 1e-9 then
    return 'catalyst';
  end if;
  if ev is not null and ev->>'id' = 'collider' then
    if (p->>'D')::double precision <> 2 then
      return 'settings';
    end if;
  elsif (p->>'D')::double precision < 5 then
    return 'settings';
  end if;
  if p->'o' is not null and jsonb_typeof(p->'o') = 'object' then
    if not ((p->'o'->>'k' = 'u' and have_unfound) or (p->'o'->>'k' = 'j' and have_joke and (p->>'P') = '1'))
      or jsonb_array_length(p->'o'->'l') < 1 then
      return 'catalyst';
    end if;
  end if;

  -- roll it again
  r := public.ac_roll(w, n, k, p, pf->'t');
  if r ? 'x' then
    return 'roll ' || (r->>'x');
  end if;
  if (r->>'ion')::int <> coalesce(p_ion, 0) then
    return 'roll ion';
  end if;
  if public.ac_counts_of(r->'a') <> public.ac_counts(p_formula)
    and (jsonb_typeof(r->'b') is distinct from 'array' or public.ac_counts_of(r->'b') <> public.ac_counts(p_formula)) then
    return 'roll formula';
  end if;

  -- it checks out: note what it used
  insert into public.ac_used (user_id, dev, n, k) values (uid, d.dev, n, k);
  if away then
    update public.ac_devices x set atop = greatest(x.atop, n - 2147483648), last_at = now() where x.user_id = uid and x.dev = d.dev;
  else
    update public.ac_devices x set top = greatest(x.top, n), last_at = now() where x.user_id = uid and x.dev = d.dev;
  end if;
  for c in select * from jsonb_array_elements(writes) loop
    insert into public.ac_src (user_id, src, grp) select uid, x, c->>'g' from jsonb_array_elements_text(c->'s') x
      on conflict do nothing;
    if c ? 'e' then
      insert into public.ac_grp (user_id, grp, dev, s) values (uid, c->>'g', d.dev, (c->>'e')::bigint) on conflict do nothing;
    else
      insert into public.ac_grp (user_id, grp, dev, h) values (uid, c->>'g', d.dev, c->'h')
        on conflict on constraint ac_grp_pkey do update set h = case when jsonb_array_length(excluded.h) > jsonb_array_length(ac_grp.h) then excluded.h else ac_grp.h end;
    end if;
  end loop;
  return 'ok';
exception when others then
  return 'bad proof: ' || left(sqlerrm, 120);
end $$;

-- the checking functions are only for the server's own use
revoke all on function public.ac_mul(bigint, bigint) from public, anon, authenticated;
revoke all on function public.ac_mix(bigint) from public, anon, authenticated;
revoke all on function public.ac_draw(bigint[], bigint, bigint, bigint, bigint) from public, anon, authenticated;
revoke all on function public.ac_seed(uuid, text) from public, anon, authenticated;
revoke all on function public.ac_words(text) from public, anon, authenticated;
revoke all on function public.ac_weights(double precision[], boolean[], text[], text[], double precision, jsonb, double precision, boolean, text[]) from public, anon, authenticated;
revoke all on function public.ac_pick(double precision[], double precision, double precision, int) from public, anon, authenticated;
revoke all on function public.ac_shop_roll(bigint[], bigint, bigint, bigint, int, double precision, int, double precision) from public, anon, authenticated;
revoke all on function public.ac_budget(uuid, boolean) from public, anon, authenticated;
revoke all on function public.ac_src_ok(uuid, text, text) from public, anon, authenticated;
revoke all on function public.ac_roll(bigint[], bigint, int, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.ac_prefix(jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.ac_counts(text) from public, anon, authenticated;
revoke all on function public.ac_counts_of(jsonb) from public, anon, authenticated;
revoke all on function public.ac_check(uuid, text, int, jsonb) from public, anon, authenticated;

-- the game asks for its seeds once a session. Catalysts held from before this went in are
-- counted from the cloud save, with a little room for ones bought since it last synced
create or replace function public.dice_seeds(p_dev text, p_legacy jsonb default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  lim jsonb := (select v from public.ac_limits where id = 1);
  d public.ac_devices;
  joined timestamptz;
  kv record;
begin
  if uid is null or p_dev is null or p_dev !~ '^[a-z0-9]{4,16}$' then
    return null;
  end if;
  select * into d from public.ac_devices where user_id = uid and dev = p_dev;
  if d.dev is null then
    if (select count(*) from public.ac_devices where user_id = uid) >= (lim->>'maxdev')::int
      or (select count(*) from public.ac_devices where user_id = uid and created_at > now() - interval '1 day') >= 5 then
      return null;
    end if;
    insert into public.ac_devices (user_id, dev) values (uid, p_dev) returning * into d;
  else
    update public.ac_devices set last_at = now() where user_id = uid and dev = p_dev;
  end if;
  select created_at into joined from public.profiles where id = uid;
  if joined < (lim->>'since')::timestamptz and p_legacy is not null and jsonb_typeof(p_legacy) = 'object'
    and not exists (select 1 from public.ac_legacy where user_id = uid and cat = '+') then
    for kv in select key, value from jsonb_each_text(p_legacy) loop
      if exists (select 1 from public.ac_cats c where c.id = kv.key and (c.rolls > 0 or c.fx ? 'start')) then
        insert into public.ac_legacy (user_id, cat, qty) values (uid, kv.key, least(greatest(kv.value::int, 0), 2))
          on conflict (user_id, cat) do update set qty = greatest(ac_legacy.qty, least(greatest(kv.value::int, 0), ac_legacy.qty + 2));
      end if;
    end loop;
    insert into public.ac_legacy (user_id, cat, qty) values (uid, '+', 0) on conflict do nothing;
  end if;
  return jsonb_build_object(
    'd', public.ac_seed(uid, p_dev),
    's', public.ac_seed(uid, 'shop'),
    'n', d.top,
    'a', d.atop,
    'legacy', (select jsonb_object_agg(cat, qty) from public.ac_legacy where user_id = uid and cat <> '+')
  );
end $$;
revoke all on function public.dice_seeds(text, jsonb) from public, anon;
grant execute on function public.dice_seeds(text, jsonb) to authenticated;

-- catalysts held right now, from each cloud save
insert into public.ac_legacy (user_id, cat, qty)
select x.user_id, x.cat, sum(x.qty)::int from (
  select s.user_id, i.key as cat, i.value::int as qty
    from public.saves s, jsonb_each_text(case when jsonb_typeof(s.data->'elementalCatInv') = 'string' then (s.data->>'elementalCatInv')::jsonb else '{}'::jsonb end) i
  union all
  select s.user_id, a.value->>'id', ceil((a.value->>'rolls')::numeric / c.rolls)::int
    from public.saves s, jsonb_each(case when jsonb_typeof(s.data->'elementalCatActive') = 'string' then (s.data->>'elementalCatActive')::jsonb else '{}'::jsonb end) a,
    public.ac_cats c
    where c.id = a.value->>'id' and c.rolls > 0 and (a.value->>'rolls')::numeric > 0
) x join public.ac_cats c on c.id = x.cat and (c.rolls > 0 or c.fx ? 'start')
where x.qty > 0
group by x.user_id, x.cat
on conflict (user_id, cat) do nothing;

-- gifts now say which gift they are, so the catalysts in them can be traced
create or replace function public.claim_gifts()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  joined timestamptz;
  out jsonb;
begin
  if uid is null then
    return '[]'::jsonb;
  end if;
  select created_at into joined from public.profiles where id = uid;
  if joined is null then
    return '[]'::jsonb;
  end if;
  with mine as (
    select g.* from public.gifts g
    where (g.user_id = uid or (g.user_id is null and g.at >= joined))
      and not exists (select 1 from public.gift_claims c where c.gift_id = g.id and c.user_id = uid)
  ), claimed as (
    insert into public.gift_claims (gift_id, user_id) select id, uid from mine
    on conflict do nothing returning gift_id
  )
  select coalesce(jsonb_agg(jsonb_build_object('id', m.id, 'catalyst', m.catalyst, 'qty', m.qty, 'note', m.note) order by m.id), '[]'::jsonb)
    into out from mine m join claimed c on c.gift_id = m.id;
  return out;
end $$;

-- finds now come with their dice. The old versions are gone, so an old copy of the game can't skip the check
drop function if exists public.submit_roll(text, text, bigint, double precision, text, boolean);
drop function if exists public.submit_roll(text, text, bigint, double precision, text, boolean, int);
drop function if exists public.submit_roll(text, text, bigint, double precision, text, boolean, int, text);
create or replace function public.submit_roll(p_formula text, p_label text default null,
  p_rolls bigint default null, p_luck double precision default null, p_catalysts text default null,
  p_ion int default 0, p_event text default null, p_proof jsonb default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  nm text;
  part text[];
  n int := 0;
  c int;
  o numeric;
  jk boolean;
  has_joke boolean := false;
  lg double precision := 0;
  sc double precision := 0;
  recent int;
  added boolean := false;
  r_score int;
  r_score_real int;
  t int;
  s public.game_settings;
  ann public.announcements;
  is_global boolean;
  clean_label text;
  why text;
begin
  if uid is null then
    return jsonb_build_object('ok', false, 'why', 'signed_out');
  end if;
  select display_name into nm from public.profiles where id = uid;
  if nm is null then
    return jsonb_build_object('ok', false, 'why', 'no_name');
  end if;
  if public.is_banned(uid) then
    return jsonb_build_object('ok', false, 'why', 'banned');
  end if;
  if p_formula is null or length(p_formula) > 120 or p_formula !~ '^([A-Z][a-z]?[0-9]*)+$' then
    return jsonb_build_object('ok', false, 'why', 'invalid');
  end if;
  for part in select regexp_matches(p_formula, '([A-Z][a-z]?)([0-9]*)', 'g') loop
    c := coalesce(nullif(part[2], '')::int, 1);
    select e.odds, e.joke into o, jk from public.elements e where e.symbol = part[1];
    has_joke := has_joke or coalesce(jk, false);
    if o is null or c < 1 then
      return jsonb_build_object('ok', false, 'why', 'invalid');
    end if;
    n := n + c;
    lg := lg + c * log(o::double precision);
  end loop;
  if n < 1 or n > 30 then
    return jsonb_build_object('ok', false, 'why', 'invalid');
  end if;
  lg := lg + (n - 1) * log(8::double precision);
  -- ion: + is 1/100 and x1.5, - is 1/1000 and x3
  if p_ion is null or p_ion not between -3 and 3 then
    return jsonb_build_object('ok', false, 'why', 'invalid');
  end if;
  if p_ion > 0 then
    lg := lg + 2 * p_ion;
  elsif p_ion < 0 then
    lg := lg + 3 * (-p_ion);
  end if;
  sc := public.formula_score(p_formula, p_ion);

  select count(*) into recent from public.roll_submissions
    where user_id = uid and at > now() - interval '1 hour';
  if recent >= 300 then
    return jsonb_build_object('ok', false, 'why', 'slow_down');
  end if;
  insert into public.roll_submissions (user_id, formula, odds_log) values (uid, p_formula, lg);

  why := public.ac_check(uid, p_formula, p_ion, p_proof);
  if why <> 'ok' then
    insert into public.ac_rejects (user_id, formula, ion, why, proof) values (uid, p_formula, p_ion, why, p_proof);
    return jsonb_build_object('ok', false, 'why', 'unchecked');
  end if;

  r_score := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not public.is_banned(g.user_id) and g.score > sc and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  -- joke-free finds can also make the _real board
  r_score_real := 1 + (select count(*) from public.global_rolls g
    where not g.removed and not g.joke and not public.is_banned(g.user_id) and g.score > sc and not (g.user_id = uid and g.formula = p_formula and g.ion = p_ion));
  if r_score <= 10 or (not has_joke and r_score_real <= 10) then
    insert into public.global_rolls (user_id, formula, ion, odds_log, score, joke)
      values (uid, p_formula, p_ion, lg, sc, has_joke)
      on conflict (user_id, formula, ion) do nothing;
    added := found;
  end if;

  select * into s from public.game_settings where id = 1;
  t := public.tier_for(sc);
  is_global := t >= s.min_tier or (s.announce_top10 and added);
  if is_global then
    clean_label := left(regexp_replace(coalesce(p_label, ''), '[^A-Za-z0-9 +×,.()-]', '', 'g'), 80);
    insert into public.announcements (display_name, formula, ion, label, odds_log, score, tier, rank_odds, rank_score)
      values (nm, p_formula, p_ion, nullif(clean_label, ''), lg, sc, t, null, r_score)
      returning * into ann;
    perform public.discord_post(ann, p_rolls, p_luck, left(regexp_replace(coalesce(p_catalysts, ''), '[^A-Za-z0-9 ,''-]', '', 'g'), 200),
      left(regexp_replace(coalesce(p_event, ''), '[^A-Za-z ]', '', 'g'), 40));
  end if;
  return jsonb_build_object('ok', true, 'added', added, 'ion', p_ion, 'global', is_global, 'tier', t, 'odds_log', lg, 'score', sc,
    'rank_score', r_score);
end $$;
revoke all on function public.submit_roll(text, text, bigint, double precision, text, int, text, jsonb) from public, anon;
grant execute on function public.submit_roll(text, text, bigint, double precision, text, int, text, jsonb) to authenticated;

-- admin: finds that didn't pass, newest first
create or replace function public.admin_rejects()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_admin();
  return coalesce((select jsonb_agg(x) from (
    select r.at, p.display_name, r.formula, r.ion, r.why
    from public.ac_rejects r left join public.profiles p on p.id = r.user_id
    order by r.at desc limit 100) x), '[]'::jsonb);
end $$;
revoke all on function public.admin_rejects() from public, anon;
grant execute on function public.admin_rejects() to authenticated;
