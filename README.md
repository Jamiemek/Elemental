# Elemental

A periodic-table roll game. Play it at https://jamiemek.github.io/Elemental/

The code lives in `js/`, split up by area. `game.js` is what the page actually loads: it's every file in `js/` joined together by `tools/build.py`, so edit the files in `js/` and run the build rather than changing `game.js` directly.

`supabase/` holds the database set-up, numbered in the order it was run in the SQL editor. `tools/preview/` has the extras for building a test copy with a dev panel.
