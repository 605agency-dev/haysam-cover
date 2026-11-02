# Carousel posts

Every slide is a 1080×1350 frame (4:5). Slides sit left to right inside one section on the `Haysam Covers` page. Element types are the same as covers (`references/spec.md`); only the canvas height changes: `y` runs 0 to 1350, no safe band.

**Background, every slide:** the brand lavender gradient (`#E5E9FF` → `#F6F7FF`) with the dot grid (the file's `BG / Pattern` Dots component, `#C7CCEB`). The kit applies both by default. **No page counter** (`02 / 07`): it reads as AI slop.

```js
return await buildCarousel({
  name: '5 ta AI tool',
  // bg: default ['#e5e9ff', '#f6f7ff'] (brand gradient); pattern: default 'dots', false = plain
  log: { layout: 'numbered', bg: 'lavender dots', font: 'news', accent: '#df3909', idea: '…' },
  slides: [
    { elements: [ … ] },                           // 1 · hook
    { elements: [ … ] },                           // 2..n-1 · content
    { elements: [ … ] },                           // n · close
  ],
});
// → { section, slides: [id…], images: { '1:hero': id, '2:hero': id, … }, log }
```

Per slide: `bg`, `pattern` (override only when the idea needs it, e.g. a dark close slide).

Keep key content above y 1260 (Instagram's dots and caption overlay the bottom).

## Structure

| Slide | Job | Notes |
| --- | --- | --- |
| 1 · hook | the cover idea for the whole post | brand lockup, biggest headline, hero image, optional "Saqlab qo'ying" chip |
| middle | one point per slide | same grid on every middle slide: number, title, one line, image |
| last | close | CTA (`pop` / `glassButton`), course name, or a summary list |

Text comes from the user's page list. One page text = one slide. Max ~12 words of body per slide; title max 3 words.

## Grids for middle slides

Pick one per carousel and repeat it. Rotate the grid between carousels like cover layouts.

**Numbered** (lists, tools, tips)
```js
{ type: 'image', slot: 'hero', x: 0, y: 0, w: 1080, h: 806 },          // 4:3 render, cut out (below)
{ type: 'tile', tool: 'Claude', size: 200, x: 80, y: 690 },             // real logo tile overlaps the image
{ type: 'text', text: '01', font: 'future', size: 150, lh: 100, color: '#df3909', x: 700, w: 300, align: 'right', y: 720 },
{ type: 'text', text: 'Claude', font: 'news', size: 150, lh: 95, upper: true, color: '#270601', x: 80, y: 930, align: 'left' },
{ type: 'text', text: 'Post matnini bir daqiqada yozadi.', font: 'uiMedium', size: 46, lh: 130, w: 900, color: '#270601', x: 80, y: 1100, align: 'left' },
```

**Image top** (steps, before/after, how to)
```js
{ type: 'image', slot: 'hero', x: 0, y: 0, w: 1080, h: 760 },
{ type: 'chip', text: '2-qadam', bg: '#fee252', color: '#58160c', x: 80, y: 800 },
{ type: 'text', text: 'Promptni yozing', font: 'news', size: 110, upper: true, x: 80, y: 890, align: 'left' },
{ type: 'text', text: 'Bitta gap: kim, nima, qayerda.', font: 'uiMedium', size: 40, w: 920, color: '#58160c', x: 80, y: 1020, align: 'left' },
```

**Quote / big word** (insight, stat)
```js
{ type: 'text', text: '3×', font: 'future', size: 360, color: 'inkMetal', sheen: true, y: 140 },
{ type: 'text', text: 'tezroq post', font: 'news', size: 110, upper: true, y: 560 },
{ type: 'image', slot: 'hero', x: 140, y: 740, w: 800, h: 440, radius: 40 },
```

## Images

One Nano Banana 2 image per slide (`'4:3'` for the top band, `'1:1'` for a centred hero). Write one shared style line (material, light, the object's own colours) and reuse it in every prompt so the set matches.

**Cut every render out** so the object sits on the gradient + dots, never a rectangle of its own backdrop:

1. Prompt the object **floating, on a seamless plain backdrop, generous empty space, no floor shadow**. Coloured objects: warm off-white backdrop. White or very light objects (paper, white plastic, frosted glass): flat mid-grey backdrop (`#8C8C8C`), otherwise the cut loses them.
2. `swift scripts/cutout.swift render.png render-cut.png` (macOS 14+, Apple Vision subject mask): solid edges, no shadows, objects stay opaque. Look at the result: Vision keeps only what it reads as the subject, so small loose pieces or a flat sheet can drop out. Re-render with the pieces touching (one object) or on the grey backdrop.
3. Not on a Mac: Higgsfield `remove_background` on the render.

Upload the cut PNGs in one `upload_assets` call with `nodeIds` in page order. POST the first URL last (an immediate first POST can 404 and shift the rest) and check each `placedOnNodeId`; fix a wrong slot by setting `imageHash` on the right node.

## Check

`get_screenshot` the section (`maxDimension` 2000). Look for: same grid on middle slides, no leftover backdrop rectangles or light-ray bands from the renders, the hook readable as a cover, the last slide closing clearly. One fix pass.

## Colour

Carousels are brand pages: lavender gradient + dot grid, ink `#270601` text, one brand accent (`#DF3909` numbers / dots, yellow `pop` button). The objects inside the cut-out renders keep their own colours (tool colours, topic colours). No lime.
