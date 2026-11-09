#!/usr/bin/env python3
"""Build Haysam logo files: SVG + transparent PNG + JPG on a backdrop, all from the official Figma geometry.
   python3 brandbook/build_assets.py   (needs Google Chrome for rendering)"""
import os, re, subprocess, tempfile, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ROOT)
OUT = os.path.join(REPO, 'web', 'brand', 'logos')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

INK, YELLOW, DARK, LAV = '#58160C', '#FEE252', '#270601', '#E5E9FF'

# Official logo = Brand / HAYSAM (Figma COVER SYSTEM 63:791) = plugin assets/logos/haysam-*.svg.
# 14 paths: 0-7 mark, 8-13 caps wordmark. The lowercase "haysam" logo on the old HAYSAM page is retired.
src = open(os.path.join(REPO, 'skills', 'haysam-cover', 'assets', 'logos', 'haysam-yellow-ink.svg')).read()
paths = re.findall(r'<path [^>]*/>', src)
recol = lambda p, c: re.sub(r'fill="[^"]*"', f'fill="{c}"', p)
mark_paths, word_paths = paths[:8], paths[8:]

def svg(w, h, vb, body):
    return f'<svg width="{w}" height="{h}" viewBox="{vb}" fill="none" xmlns="http://www.w3.org/2000/svg">\n' + '\n'.join(body) + '\n</svg>\n'

def logo(mark, word):
    return svg(1416, 329, '0 0 1416 329', [recol(p, mark) for p in mark_paths] + [recol(p, word) for p in word_paths])

def mark_only(c):
    return svg(329, 329, '0 0 328.44 328.44', [recol(p, c) for p in mark_paths])

# name -> (svg, (w, h), JPG backdrop)
items = {
    'haysam-logo-ink':          (logo(INK, INK), (1416, 329), LAV),
    'haysam-logo-yellow-ink':   (logo(YELLOW, INK), (1416, 329), '#FFFFFF'),
    'haysam-logo-yellow-white': (logo(YELLOW, '#FFFFFF'), (1416, 329), DARK),
    'haysam-logo-white':        (logo('#FFFFFF', '#FFFFFF'), (1416, 329), DARK),
    'haysam-logo-black':        (logo('#000000', '#000000'), (1416, 329), '#FFFFFF'),
    'haysam-mark-ink':    (mark_only(INK), (329, 329), LAV),
    'haysam-mark-yellow': (mark_only(YELLOW), (329, 329), DARK),
    'haysam-mark-white':  (mark_only('#FFFFFF'), (329, 329), DARK),
    'haysam-mark-black':  (mark_only('#000000'), (329, 329), '#FFFFFF'),
}

def render(svg_text, w, h, target_w, bg, out_png):
    """Chrome screenshot of the SVG at target width. bg None = transparent; else pad 20% clear space."""
    scale = target_w / w
    if bg:
        pad = round(min(w, h) * 0.5)
        cw, ch = w + 2 * pad, h + 2 * pad
        scale = target_w / cw
    else:
        pad, cw, ch = 0, w, h
    vw, vh = round(cw * scale), round(ch * scale)
    html = (f'<html><body style="margin:0;background:{bg or "transparent"}">'
            f'<div style="width:{vw}px;height:{vh}px;display:flex;align-items:center;justify-content:center">'
            f'<img style="width:{round(w*scale)}px;height:{round(h*scale)}px" src="data:image/svg+xml;base64,'
            + __import__('base64').b64encode(svg_text.encode()).decode() + '"></div></body></html>')
    d = tempfile.mkdtemp()
    hp = os.path.join(d, 'p.html'); open(hp, 'w').write(html)
    args = [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
            f'--window-size={vw},{vh}', f'--screenshot={out_png}', 'file://' + hp]
    if not bg: args.insert(3, '--default-background-color=00000000')
    subprocess.run(args, check=True, capture_output=True)
    shutil.rmtree(d)

for sub in ('svg', 'png', 'jpg'):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)

for name, (text, (w, h), bg) in items.items():
    open(os.path.join(OUT, 'svg', name + '.svg'), 'w').write(text)
    tw = 6000 if w > h else 4000
    render(text, w, h, tw, None, os.path.join(OUT, 'png', name + '.png'))
    tmp = os.path.join(OUT, 'jpg', name + '.tmp.png')
    render(text, w, h, tw, bg, tmp)
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '92', tmp, '--out',
                    os.path.join(OUT, 'jpg', name + '.jpg')], check=True, capture_output=True)
    os.remove(tmp)
    print('ok', name)
