#!/usr/bin/env python3
"""Cover palette from the AI image, so the colours come from the picture, not the brand.

    python3 palette.py hero.png            # text sits at the top (default)
    python3 palette.py hero.png bottom     # text sits at the bottom

Prints JSON for fromTemplate({ palette }): bg (image edge, for the canvas and fades),
ink (headline colour with contrast on the text band), accent + onAccent (chip / sticker).
Uses Pillow when installed, else macOS sips. If neither works, look at the image and pick the
same four colours by eye.
"""
import colorsys
import json
import os
import struct
import subprocess
import sys
import tempfile


def pixels(path):
    try:
        from PIL import Image
        im = Image.open(path).convert('RGB')
        im.thumbnail((64, 64))
        w, h = im.size
        data = list(im.getdata())
        return w, h, [data[y * w:(y + 1) * w] for y in range(h)]
    except ImportError:
        pass
    fd, tmp = tempfile.mkstemp(suffix='.bmp')
    os.close(fd)
    try:
        subprocess.run(['sips', '-s', 'format', 'bmp', '-Z', '64', path, '--out', tmp], capture_output=True, check=True)
        b = open(tmp, 'rb').read()
    finally:
        os.remove(tmp)
    off = struct.unpack_from('<I', b, 10)[0]
    w, h = struct.unpack_from('<ii', b, 18)
    bpp = struct.unpack_from('<H', b, 28)[0] // 8
    stride = (w * bpp + 3) & ~3
    rows = []
    for y in range(abs(h)):
        r = off + y * stride
        rows.append([(b[r + x * bpp + 2], b[r + x * bpp + 1], b[r + x * bpp]) for x in range(w)])
    if h > 0:
        rows.reverse()                       # BMP rows are stored bottom-up
    return w, abs(h), rows


def avg(px):
    n = len(px) or 1
    return tuple(sum(p[i] for p in px) / n for i in range(3))


def lum(c):
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255


def hexc(c):
    return '#' + ''.join(f'{max(0, min(255, round(v))):02x}' for v in c)


def main():
    path = sys.argv[1]
    where = sys.argv[2] if len(sys.argv) > 2 else 'top'
    w, h, rows = pixels(path)
    edge = max(1, h // 16)
    band = max(1, h * 3 // 10)
    top_edge, bottom_edge = avg(sum(rows[:edge], [])), avg(sum(rows[-edge:], []))
    text_band = avg(sum(rows[:band] if where == 'top' else rows[-band:], []))
    allpx = sum(rows, [])

    bg = top_edge if where == 'top' else bottom_edge
    if lum(text_band) < 0.55:
        ink = (255, 255, 255)
    else:                                    # dark ink taken from the picture's own darkest tones
        dark = sorted(allpx, key=lum)[: max(1, len(allpx) // 12)]
        ink = tuple(v * 0.55 for v in avg(dark))

    def vivid(p):
        hh, s, v = colorsys.rgb_to_hsv(*(x / 255 for x in p))
        return s * v
    def lime(p):                             # acid / lime green reads as Higgsfield's brand colour
        hh, s, v = colorsys.rgb_to_hsv(*(x / 255 for x in p))
        return 0.17 < hh < 0.30 and s > 0.45 and v > 0.6
    pool = [p for p in allpx if not lime(p)] or allpx
    rich = sorted(pool, key=vivid, reverse=True)[: max(1, len(pool) // 20)]
    accent = avg(rich)
    on_accent = (17, 17, 17) if lum(accent) > 0.6 else (255, 255, 255)

    print(json.dumps({'bg': hexc(bg), 'ink': hexc(ink), 'accent': hexc(accent), 'onAccent': hexc(on_accent),
                      'bgOther': hexc(bottom_edge if where == 'top' else top_edge)}))


if __name__ == '__main__':
    main()
