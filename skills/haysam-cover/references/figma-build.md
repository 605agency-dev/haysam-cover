# Figma build guide

All writes go to a Figma file the user can edit. The reference file `5fwBVBqshynrcOhdDIfAKI` is read-only for everyone (screenshot it for reference).

Before the first call on a file: `create_session(fileKey, description)` and pass the returned `sessionId` on every Figma tool call. Load the Figma `figma-use` skill if the client has it.

`fetch` does not exist inside `use_figma`; files reach Figma through `upload_assets` + curl.

## Setup (once per file)

Run the full setup once per file. In a duplicate of the reference (it has `COVER SYSTEM`) brand, glow, buttons and four tool icons already exist: run only step 2–3 for a missing tool logo (`PLACED` without `haysam`; PART A creates the `HAYSAM KIT` page to hold it).

1. `use_figma` with PART A of `scripts/setup-kit.js` → `{ kitPage, existing }`.
2. `upload_assets({ fileKey, count: N, currentPageId: kitPage })`, then POST each SVG (no `nodeIds` for SVGs):
   ```bash
   curl -s -X POST -F "file=@<skill dir>/assets/logos/haysam-yellow-white.svg;type=image/svg+xml" "<submitUrl>"
   ```
   Each response has `placedOnNodeId`. Upload `haysam-yellow-white.svg` plus the tool logos you need now.
   Tip (zsh): arrays are 1-indexed; loop `for i in 1 2 3`.
3. `use_figma` with PART B, `PLACED = { haysam: '<id>', 'Claude': '<id>', … }` → `Brand / HAYSAM` variants + `Tool / <Name>` components.

Adding a tool later: steps 2–3 with just that logo (`PLACED = { 'Kling': '<id>' }`). Name it the way you will write it in SPECs. No shell: paste the SVG text into `INLINE` instead.

Bundled logos (`assets/logos/`): anthropic, canva, chatgpt, claude, elevenlabs, figma, gamma, gemini, google, google-veo, grammarly, notebooklm, notion, perplexity, photoshop, suno, telegram, haysam-*.

**Any other brand named in the text gets its real logo too.** Before building, list every tool or brand the post mentions; for each one missing from the file and from `assets/logos/`, fetch the official SVG in this order and add it with steps 2–3:
1. Simple Icons: `curl -s https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg` (404 = not there). It is one colour: set `fill` to the brand's own colour on the `<svg>` tag.
2. The brand's own site: its favicon or logo SVG (`grep` the homepage for `favicon`/`logo` links; e.g. Gamma's `static.gamma.app/favicons/favicon_light.svg`), or its press kit.
3. Wikimedia Commons (`commons.wikimedia.org`, search "<brand> logo svg").
Render it once (`qlmanage -t -s 200 file.svg`) to check it is the right mark. Never draw, trace or generate a logo; no official file → write the name instead.

## Read the COVER LOG (before choosing a layout)

```js
const k = figma.root.children.find(p => p.name === 'HAYSAM KIT') || figma.root.children.find(p => p.name === 'Haysam Covers');
if (!k) return [];
await k.loadAsync();
const t = k.findOne(n => n.type === 'TEXT' && n.name === 'COVER LOG');
return t ? t.characters.split('\n').slice(1).slice(-3) : [];
```

## Build a cover

Default, free composition (`fromTemplate` is the optional shortcut in a reference duplicate, `templates.md`):

(Carousel: same call with `return await buildCarousel(SPEC)`, see `carousel.md`.)

One `use_figma` call: the full text of `scripts/kit.js`, then

```js
return await buildCover({ name: '…', bg: '…', log: { layout, bg, font, accent, idea }, elements: [ … ] });
```

Returns `{ cover, crop, images: { slot: nodeId }, outsideSafeBand }`. Several covers (variants) can be built in the same call: `const a = await buildCover(A); const b = await buildCover(B); return { a, b };`.

Covers land on page `Haysam Covers`, each new pair to the right of the last. The 9:16 cover is a component; the 4:5 frame holds an instance cropped to y 285–1635, so edits and images flow into it.

## Put AI images into slots

```text
1. curl -sfL -o hero.png "<higgsfield image url>"
2. upload_assets({ fileKey, count: 1, nodeIds: ['<images.hero>'], scaleMode: 'FILL' })
3. curl -s -X POST -F "file=@hero.png;type=image/png" "<submitUrl>"
```

Several slots: one `upload_assets` call with `count` = number of slots and matching `nodeIds` order. Carousels return `images` keyed `page:slot` (`'3:hero'`); pass them in page order. If a submit URL errors or expires (10 min), request a new one.

## Check

`get_screenshot` the cover id and the crop id (`maxDimension` 800), download with curl and look. Fix what is wrong with a small `use_figma` edit on the named layers (move, resize, recolour). Common fixes:

- Giant word runs off the canvas → lower `size` or shift `x`.
- Text over a busy image area → add a `fade` or move the headline into the empty zone.
- Anything in `outsideSafeBand` → move it into y 285–1635.

## Gotchas

- Fonts that fail to load fall back to Inter Bold; check the screenshot if a mood font looks generic.
- Set the page once per call (`buildCover` does it).
- Text `\n` makes real line breaks; keep headlines to 2 lines.
