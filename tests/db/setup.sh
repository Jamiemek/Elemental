#!/bin/sh
# Creates a throwaway local Postgres 16 that imitates Supabase, with every file in
# supabase/ applied, for the tests that run real SQL (admin, cat, clock, glob).
# Data lives in /tmp/pgtest (port 55432). Run as root; it starts the server as postgres.
set -e
cd "$(dirname "$0")/../.."
PG=/usr/lib/postgresql/16/bin
D=/tmp/pgtest
if [ ! -d "$D/data" ]; then
  mkdir -p "$D" && chown postgres "$D"
  su postgres -s /bin/sh -c "$PG/initdb -D $D/data -U postgres >/dev/null"
fi
rm -f "$D/data/postmaster.pid"
su postgres -s /bin/sh -c "$PG/pg_ctl -D $D/data -o '-k $D -p 55432 -c listen_addresses=' -l $D/log start -w" >/dev/null || true
P="psql -h $D -p 55432 -U postgres -v ON_ERROR_STOP=1 -q"
$P -d postgres -c "drop database if exists t" -c "create database t"
$P -d t -f tests/db/supabase_stubs.sql
# pg_net only exists on Supabase; tests/db/supabase_stubs.sql stands in for it
for f in supabase/*.sql; do sed '/create extension if not exists pg_net/d' "$f" | $P -d t -f -; done
$P -d t -f tests/db/fixtures.sql
echo "test database ready: $($P -d t -At -c 'select count(*) from public.elements') elements"
