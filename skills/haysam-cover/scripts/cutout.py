#!/usr/bin/env python3
"""Cut a Nano Banana object render out of its studio backdrop, so it sits on the brand background.

    python3 cutout.py hero.png hero-cut.png

Carousel slides keep the Haysam lavender gradient + dot grid; a rectangle of the render's own
off-white backdrop would cover it. This drops the backdrop: solid objects stay opaque, contact
shadows and soft edges become translucent, light rays and glows vanish. Works best on renders
prompted with a seamless plain background. Needs Pillow, numpy and scipy
(pip install pillow numpy scipy); without them, upload the render as it is and fade its edges.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as nd


def cut(src, dst, thr=0.15):
    a = np.asarray(Image.open(src).convert('RGB')).astype(float) / 255
    h, w, _ = a.shape
    k = max(8, h // 20)
    # backdrop = bilinear blend of the four corner colours (renders vignette slightly)
    c = [np.median(x.reshape(-1, 3), axis=0) for x in (a[:k, :k], a[:k, -k:], a[-k:, :k], a[-k:, -k:])]
    yy = np.linspace(0, 1, h)[:, None, None]
    xx = np.linspace(0, 1, w)[None, :, None]
    bg = (c[0] * (1 - xx) + c[1] * xx) * (1 - yy) + (c[2] * (1 - xx) + c[3] * xx) * yy
    o = np.clip(a / bg, 0, 1)                                 # backdrop → pure white
    alpha = np.clip((1 - o).max(axis=2), 0, 1)                # colour-to-alpha: shadows stay soft

    # solid objects: darker or more colourful than the backdrop, holes filled, specks dropped
    d = np.clip(bg - a, 0, 1).max(axis=2) + np.abs((a - a.mean(2, keepdims=True)) - (bg - bg.mean(2, keepdims=True))).max(axis=2)
    m = nd.binary_fill_holes(nd.binary_closing(d > thr, iterations=4))
    m = nd.binary_opening(m, iterations=3)
    lab, n = nd.label(m)
    if n:
        sizes = nd.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, 1 + np.where(sizes > h * w * 0.001)[0])
    solid = nd.gaussian_filter(nd.binary_erosion(m, iterations=2).astype(float), 1.5)

    A = np.maximum(alpha, solid)
    safe = np.where(A > 1e-3, A, 1)[..., None]
    col = np.where(A[..., None] > 1e-3, (o - (1 - A[..., None])) / safe, 1)
    col = np.clip(col * (1 - solid[..., None]) + o * solid[..., None], 0, 1)
    Image.fromarray((np.dstack([col, A]) * 255).astype('uint8')).save(dst)


if __name__ == '__main__':
    cut(sys.argv[1], sys.argv[2])
