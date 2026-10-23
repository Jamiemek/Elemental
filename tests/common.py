# Shared set-up for the browser tests: builds the copies of the game the tests load
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
ROOT = os.path.dirname(HERE.rstrip('/')) + '/'
SP = HERE + 'work/'
os.makedirs(SP, exist_ok=True)
sys.path.insert(0, ROOT + 'tools')
import build  # noqa: E402

CLOUD_OFF = '    enabled: false, // the preview copy never touches real accounts or saves'

def page(kind, tutorial=False):
    p = build.preview(build.single(build.joined_js()))
    # the other tests start from a cleared save, which would start the tutorial
    if not tutorial:
        assert p.count('\ntutInit();\n') == 1
        p = p.replace('\ntutInit();\n', '\n')
    if kind == 'test':
        assert p.count(CLOUD_OFF) == 1
        p = p.replace(CLOUD_OFF, '    enabled: true,')
    return p

def site(kind):
    d = SP + 'site-' + kind
    os.makedirs(d, exist_ok=True)
    with open(d + '/index.html', 'w', encoding='utf-8') as f:
        f.write(page(kind))
    for extra in ('privacy.html', 'IMG_3422.png'):
        shutil.copy(ROOT + extra, d + '/' + extra)
    return d

PREVIEW = SP + 'elemental_preview.html'
with open(PREVIEW, 'w', encoding='utf-8') as _f:
    _f.write(page('preview'))
