# Tests

Browser tests run with Python 3 and Playwright (Chromium). Each test builds the copy of
the game it needs from `js/` (see `common.py`) and writes screenshots to `tests/work/`.

## Tests with no server

| Test | Checks |
|---|---|
| `qstorm_t.py` | Quark Storm: chance, length, bonus quarks, bar, toasts, away rolls |
| `qs_shot.py` | Screenshots of the storm scan (desktop, phone, 4-roll press) |
| `shop_t.py` | Shop restock timing, old saves, device clock moved forward |
| `away_t.py` | While-you-were-away rolls, pop-up, cutscene replay |
| `viewer_t.py` | Cutscene and effect viewer: only seen items, secret effects hidden |
| `clear_t.py` | "Clear redundant finds" keeps everything that matters |
| `calm_t.py` | Reduce flashing limits brightness jumps |
| `cut5_t.py` | Screenshots through the last five cutscenes |

## Tests with a stand-in for Supabase

`mocksb.js` replaces the Supabase library in the page. `cloud_t.py` answers it with a small
in-memory fake. The others use `pgserver.py`, which runs the real SQL from `supabase/`
against a local Postgres, as the right player, the way Supabase does.

```
sh tests/db/setup.sh        # once per session (as root): local Postgres 16 with supabase/*.sql
python3 tests/glob_t.py     # global top 10, backfill, offline queue
python3 tests/admin_t.py    # banner, Discord post, admin tab: bans, removals, gifts
python3 tests/cat_t.py      # catalysts listed in Discord posts
python3 tests/clock_t.py    # away time checked against the server clock
python3 tests/cloud_t.py    # sign-in, display names, cloud saves, save conflicts
```

Run setup and the tests in the same shell session: the database is stopped when the
session's background processes are cleared. `db/fixtures.sql` adds two players:
"Jamiemek" (admin) and "Other". Discord posts land in the `net.sent` table.

## Balance

Build a single file first: `python3 tools/build.py --single /tmp/elemental.html`

- `node tests/tune.js /tmp/elemental.html edits.json [runs] [hours]` plays whole games and
  prints milestone hours (`{}` for no edits).
- `node tests/quarks_per_roll.js /tmp/elemental.html <luck %> <chain 1-in-N>` gives quarks
  per roll and rolls needed for given prices.
