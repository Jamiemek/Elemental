# Elemental

A periodic-table roll game. Play it at https://jamiemek.github.io/Elemental/

## How the files fit together

| Path | What it is |
|---|---|
| `index.html` | The page: layout and screens. Loads `css/style.css` and `game.js`. |
| `css/style.css` | All the styles. |
| `js/*.js` | The game's code, split by area. **Edit these.** |
| `game.js` | The code players load: every file in `js/` joined in order by `tools/build.py`. **Don't edit it by hand.** |
| `themes/` | Empty for now. Unlockable themes (effect sets, scanners, page designs) will go here. |
| `supabase/` | The database set-up, in the order it was run in Supabase's SQL Editor. |
| `tests/` | Browser tests, a balance simulator and a local stand-in for Supabase. |
| `tools/` | The build script, and the extras that make the preview copy. |
| `privacy.html`, `IMG_3422.png` | Privacy policy and logo. |

## Making a change

The workflow and the game's standing rules are in DEVELOPMENT.md.

1. Edit files in `js/` (or `css/style.css`, `index.html`).
2. Run `python3 tools/build.py`. It rebuilds `game.js` and updates the `?v=` tags in
   `index.html`, so browsers fetch the new files rather than an old cached copy.
3. Make a preview copy to try on a phone: `python3 tools/build.py --preview elemental_preview.html`.
   It is one self-contained file with accounts switched off and test tools added.
4. Commit `js/`, `game.js` and `index.html` together.

`python3 tools/build.py --check` says whether `game.js` matches `js/`.
`python3 tools/build.py --single elemental.html` makes a standalone copy of the live game.

## Why one joined file?

Separate `<script>` files can start running before the later ones have downloaded, so
timers (autoroll, the shop clock) or a quick tap could reach code that isn't there yet.
One joined file runs exactly as the original single-file game did.

## Undoing an update

Re-upload a previous version of `index.html`, `css/style.css` and `game.js` from the commit
history. Any older single-file `index.html` also works on its own.
