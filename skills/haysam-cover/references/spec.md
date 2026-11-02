# SPEC format (input to `buildCover`)

Canvas is 1080 × 1920. Safe band for key content: y 285–1635. Omit `x` on any element to centre it horizontally. Elements are drawn in order (first = bottom).

```js
{
  name: 'Yangi darslik · Claude',      // layer name: "Cover / <name> · 9:16" and "· 4:5"
  bg: '#f6f7ff',                        // colour | ['#top', '#bottom'] gradient | { color, opacity }
                                        // | { stops: [[pos, '#hex'], …] } (image covers: see below)
  pattern: 'dots',                      // optional: dots | lines | grid | tiles | { kind, color, opacity }
  page: 'Haysam Covers',                // optional target page (created if missing)
  log: { layout: 'I', bg: 'lines', font: 'loud', accent: '#d97757', idea: 'lesson number as hero' },
  elements: [ … ]
}
```

## Paint values

`'#hex'` · `{ color: '#hex', opacity: 0.5 }` · `['#a', '#b', '#c']` (vertical gradient) · `{ stops: [[0,'#a',1],[1,'#b',0]], angle: 'down'|'up'|'right'|'diag' }` · `'inkMetal'` (Haysam brown lettering gradient).

## Element types

| type | keys | notes |
| --- | --- | --- |
| `text` | `text` (use `\n` for 2 lines), `font`, `size`, `color`, `align` (center/left/right), `x`, `y`, `w`, `ls` (letter spacing %), `lh` (line height %, default 92), `upper`, `sheen`, `shadow: {color,a,y,r}`, `progressiveBlur` (px), `outline` (paint → outlined letters) | `font` = mood key (below) or `['Family','Style']` |
| `image` | `slot`, `x`, `y`, `w`, `h`, `radius`, `shadow`, `ellipseFade` | grey placeholder named `IMAGE · <slot>`; returned in `images` for upload |
| `fade` | `y`, `h`, `color`, `dir` | `dir:'down'` = solid at top, clears downward (photo top edge). `dir:'up'` = solid at bottom, clears upward (photo bottom edge) |
| `glow` | `x`, `y`, `w`, `rotation`, `tone` (warm/sky) or `colors:[trail, core]` | comet: crisp head, soft tail. Aim the head at the hero |
| `wash` | `color`, `core` | 3 blurred ellipses (top right + bottom left echo) |
| `ellipse` | `x`, `y`, `w`, `h`, `fill`, `blur` | free blob |
| `rect` | `x`, `y`, `w`, `h`, `fill`, `radius`, `stroke`, `effects` | |
| `lockup` | `y` (330), `tool`, `toolName`, `brand` (Ink/Yellow+Ink/Yellow+White/White), `color`, `brandH`, `iconH` | brand alone when no `tool` |
| `toolIcon` | `tool`, `size`, `x`, `y`, `shadow` | big official logo |
| `chip` | `text`, `bg`, `color`, `dot`, `icon` (tool), `stroke`, `font`, `size`, `radius`, `flat`, `x`, `y`, `rotation` | pill tag |
| `chips` | `items: ['a','b']` or objects, `chip: {defaults}`, `gap`, `y` | centred row |
| `sticker` | `text`, `bg`, `color`, `rotation` (−4), `y` | mono label, slight tilt |
| `pop` | `text`, `tone` (yellow/sky/ember/violet/pink; no lime), `size`, `y` | glossy RESET-style CTA |
| `bigButton` | `text`, `tone` (sunrise/sky/ink), `arrow`, `y` | 3D keycap |
| `glassButton` | `text`, `tone` (clear/offer), `x`, `y` | liquid glass |
| `cursor` | `x`, `y`, `label`, `color` | Figma multiplayer cursor |
| `selection` | `text: {text element}`, `cursor: {label}`, `stroke`, `y` | Figma selection box with handles |
| `pattern` | `kind`, `color`, `opacity` | extra pattern layer |

## Mood fonts (`font`)

| key | font | feels |
| --- | --- | --- |
| `brand` / `brandMedium` | JetBrains Mono Bold / Medium | Haysam voice, code, notes |
| `news` | Anton | news, loud caps, studio |
| `future` | Unbounded Black | tech, numbers, "new" |
| `loud` | Archivo Black | buttons, hype, kickers |
| `cinema` | Big Shoulders Display Black | video, film, process |
| `premium` | Instrument Serif | personal, letters, calm |
| `play` | Bricolage Grotesque ExtraBold | friendly, mascots, community |
| `ui` / `uiBold` / `uiMedium` | Inter | chips, labels only |

## Return value

`{ cover, crop, images: { <slot>: nodeId }, outsideSafeBand: [layer names], log }`

## Carousels

`buildCarousel(SPEC)` builds 4:5 slides with the same element types. Format and slide grids: `carousel.md`.

## Image covers without seams

When the image does not fill the 1080×1920 canvas, build the canvas from the picture's own edge colours (`palette.py` → `bg` top edge, `bgOther` bottom edge) with solid stops up to the image edges, and fade the image edges into the same colours:

```js
// image slot at y 380, h 1080 → top edge 380/1920 ≈ 0.2, bottom edge 1460/1920 ≈ 0.76
bg: { stops: [[0, '#8e887c'], [0.2, '#8e887c'], [0.76, '#282a12'], [1, '#282a12']] },
elements: [
  { type: 'image', slot: 'hero', x: 0, y: 380, w: 1080, h: 1080 },
  { type: 'fade', y: 380, h: 260, dir: 'down', color: '#8e887c' },
  { type: 'fade', y: 1200, h: 260, dir: 'up', color: '#282a12' },
  …
]
```

