# Carousel posts

Every slide is a 1080×1350 frame (4:5). Slides sit left to right inside one section on the `Haysam Covers` page. Element types are the same as covers (`references/spec.md`); only the canvas height changes: `y` runs 0 to 1350, no safe band.

```js
return await buildCarousel({
  name: '5 ta AI tool',
  bg: '#f6f7ff',                 // default for every slide
  pattern: null,                 // optional, same as covers
  pager: 'count',                // 'count' (default) or false
  pagerColor: '#58160c',         // light slides; dark slides switch to white by themselves
  log: { layout: 'numbered', bg: '#f6f7ff', font: 'news', accent: '#fee252', idea: '…' },
  slides: [
    { bg: '#e5e9ff', elements: [ … ] },            // 1 · hook
    { elements: [ … ] },                           // 2..n-1 · content
    { bg: '#270601', elements: [ … ] },            // n · close
  ],
});
// → { section, slides: [id…], images: { '1:hero': id, '2:hero': id, … }, log }
```

Per slide: `bg`, `pattern`, `pager` (false hides the counter), `pagerColor`.

The counter (`02 / 06`, JetBrains Mono 28) sits at y 1254. Keep key content above y 1230.

## Structure

| Slide | Job | Notes |
| --- | --- | --- |
| 1 · hook | the cover idea for the whole post | brand lockup, biggest headline, hero image, optional "Saqlab qo'ying" chip |
| middle | one point per slide | same grid on every middle slide: number, title, one line, image |
| last | close | CTA (`pop` / `glassButton`), course name, or a summary list; dark or accent bg is fine here |

Text comes from the user's page list. One page text = one slide. Max ~12 words of body per slide; title max 3 words.

## Grids for middle slides

Pick one per carousel and repeat it. Rotate the grid between carousels like cover layouts.

**Numbered** (lists, tools, tips)
```js
{ type: 'text', text: '01', font: 'premium', size: 200, lh: 100, color: '#58160c', x: 80, y: 64, align: 'left' },
{ type: 'toolIcon', tool: 'Claude', size: 120, x: 880, y: 104 },
{ type: 'text', text: 'Claude', font: 'news', size: 120, lh: 95, upper: true, x: 80, y: 310, align: 'left' },
{ type: 'text', text: 'Post matnini bir daqiqada yozadi.', font: 'uiMedium', size: 40, lh: 130, w: 920, color: '#58160c', x: 80, y: 450, align: 'left' },
{ type: 'image', slot: 'hero', x: 80, y: 640, w: 920, h: 540, radius: 32 },
```

**Image top** (steps, before/after, how to)
```js
{ type: 'image', slot: 'hero', x: 0, y: 0, w: 1080, h: 760 },
{ type: 'fade', y: 560, h: 220, dir: 'up', color: '#f6f7ff' },
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

One Nano Banana 2 image per slide (`aspect_ratio: '4:5'` for full-bleed slides, `'1:1'` or `'16:9'` for framed slots). Write one shared style line (palette, light, material) and reuse it in every prompt so the set matches. Upload all slots in one `upload_assets` call: `nodeIds` in page order, then POST the files in the same order.

## Check

`get_screenshot` the section (`maxDimension` 2000). Look for: same grid on middle slides, nothing under the counter, the hook readable as a cover, the last slide closing clearly. One fix pass.
