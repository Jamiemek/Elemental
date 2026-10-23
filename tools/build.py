#!/usr/bin/env python3
"""Joins js/*.js into game.js and updates the ?v= tags in index.html.

  python3 tools/build.py
  python3 tools/build.py --check
  python3 tools/build.py --single OUT
  python3 tools/build.py --preview OUT
"""
import hashlib
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# The order the files run in
JS_FILES = [
    'data.js',       # save-version check, elements, table layout, achievements
    'sound.js',      # settings toggles, the $ helper, audio, rarity tiers, sounds
    'effects.js',    # rarity effects, secret variants, reduce flashing, particles
    'fxskins.js',    # Retro and Astral spawn effects (cosmetics)
    'scan.js',       # the field scan animation, Quark Storm particles
    'core.js',       # achievement toasts, the compact collection, saving, navigation, element buffs
    'bonds.js',      # the bond network
    'shop.js',       # catalyst shop, inventory, active catalysts
    'odds.js',       # buffs, element weights, odds, score, quarks, Quark Storm rules
    'screens.js',    # roll history, periodic table, home, collection and rankings
    'roll.js',       # the roll itself, multirolls, autoroll, formula parsing
    'settings.js',   # achievement rarities, settings, theme, start-up renders
    'cosmetics.js',  # scanner and page skins, the Final Element badge, the shop's Cosmetics tab
    'cutscenes.js',  # the 15 element cutscenes
    'storage.js',    # storage use and "Clear redundant finds"
    'viewer.js',     # cutscene and effect viewer, donation links
    'cloud.js',      # accounts and cloud saves
    'global.js',     # global top 10, banner, gifts
    'admin.js',      # admin tab
    'away.js',       # while you were away
    'tutorial.js',   # first time tutorial
    'main.js',       # starts the game
]
CSS = 'css/style.css'
BUNDLE = 'game.js'
HEADER = ''

def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()

def write(path, text):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)

def joined_js():
    parts = []
    for name in JS_FILES:
        s = read('js/' + name)
        assert s.endswith('\n'), 'js/%s must end with a new line' % name
        parts.append(s)
    return ''.join(parts)

def tag(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()[:10]

def stamped_index(bundle):
    page = read('index.html')
    css_ref = re.compile(r'<link rel="stylesheet" href="css/style\.css(\?v=[0-9a-f]*)?">')
    js_ref = re.compile(r'<script src="game\.js(\?v=[0-9a-f]*)?"></script>')
    assert len(css_ref.findall(page)) == 1 and len(js_ref.findall(page)) == 1, 'index.html must load css/style.css and game.js once each'
    page = css_ref.sub('<link rel="stylesheet" href="css/style.css?v=%s">' % tag(read(CSS)), page)
    page = js_ref.sub('<script src="game.js?v=%s"></script>' % tag(bundle), page)
    return page

def single(bundle_body):
    page = read('index.html')
    page = re.sub(r'<link rel="stylesheet" href="css/style\.css(\?v=[0-9a-f]*)?">', lambda m: '<style>\n' + read(CSS) + '</style>', page)
    page = re.sub(r'<script src="game\.js(\?v=[0-9a-f]*)?"></script>', lambda m: '<script>\n' + bundle_body + '</script>', page)
    return page

def preview(page):
    for old, new in json.loads(read('tools/preview/patches.json')):
        assert page.count(old) == 1, 'preview patch no longer fits: ' + old[:60]
        page = page.replace(old, new)
    k = page.rindex('</body></html>')
    return page[:k] + read('tools/preview/panel.html') + page[k:]

def main(argv):
    body = joined_js()
    bundle = HEADER + body
    if argv[:1] == ['--check']:
        ok = os.path.exists(os.path.join(ROOT, BUNDLE)) and read(BUNDLE) == bundle and read('index.html') == stamped_index(bundle)
        print('up to date' if ok else 'OUT OF DATE: run python3 tools/build.py')
        return 0 if ok else 1
    if argv[:1] in (['--single'], ['--preview']) and len(argv) == 2:
        page = single(body)
        if argv[0] == '--preview':
            page = preview(page)
        write(argv[1], page)
        print('wrote', argv[1], '(%d KB)' % (len(page.encode('utf-8')) // 1024))
        return 0
    if argv:
        print(__doc__)
        return 2
    write(os.path.join(ROOT, BUNDLE), bundle)
    write(os.path.join(ROOT, 'index.html'), stamped_index(bundle))
    print('game.js %d KB, %d files | index.html tags updated' % (len(bundle.encode('utf-8')) // 1024, len(JS_FILES)))
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
