# Figma build guide

All writes go to the **user's file**. The Haysam template file `5fwBVBqshynrcOhdDIfAKI` is read-only (screenshots of samples only).

Before the first call on a file: `create_session(fileKey, description)` and pass the returned `sessionId` on every Figma tool call. Load the Figma `figma-use` skill if the client has it.

`fetch` does not exist inside `use_figma`; files reach Figma through `upload_assets` + curl.

## Setup (once per file)

1. `use_figma` with PART A of `scripts/setup-kit.js` → `{ kitPage, existing }`.
2. `upload_assets({ fileKey, count: N, currentPageId: kitPage })`, then POST each SVG (no `nodeIds` for SVGs):
   ```bash
   curl -s -X POST -F "file=@<skill dir>/assets/logos/haysam-yellow-white.svg;type=image/svg+xml" "<submitUrl>"
   ```
   Each response has `placedOnNodeId`. Upload `haysam-yellow-white.svg` plus the tool logos you need now.
   Tip (zsh): arrays are 1-indexed; loop `for i in 1 2 3`.
3. `use_figma` with PART B, `PLACED = { haysam: '<id>', 'Claude': '<id>', … }` → `Brand / HAYSAM` variants + `Tool / <Name>` components.

Adding a tool later: steps 2–3 with just that logo (`PLACED = { 'Kling': '<id>' }`). Name it the way you will write it in SPECs. No shell: paste the SVG text into `INLINE` instead.

Bundled logos (`assets/logos/`): anthropic, canva, chatgpt, claude, elevenlabs, figma, gemini, google, google-veo, notion, perplexity, photoshop, suno, telegram, haysam-*. Anything else: download the official SVG (brand press kit, Wikimedia Commons, `cdn.jsdelivr.net/npm/simple-icons/icons/<slug>.svg` + the brand hex as `fill`). Never draw or generate a logo.

## Read the COVER LOG (before choosing a layout)

```js
const k = figma.root.children.find(p => p.name === 'HAYSAM KIT');
await k.loadAsync();
const t = k.findOne(n => n.type === 'TEXT' && n.name === 'COVER LOG');
return t ? t.characters.split('\n').slice(1).slice(-3) : [];
```

## Build a cover

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

Several slots: one `upload_assets` call with `count` = number of slots and matching `nodeIds` order. If a submit URL errors or expires (10 min), request a new one.

## Check

`get_screenshot` the cover id and the crop id (`maxDimension` 800), download with curl and look. Fix what is wrong with a small `use_figma` edit on the named layers (move, resize, recolour). Common fixes:

- Giant word runs off the canvas → lower `size` or shift `x`.
- Text over a busy image area → add a `fade` or move the headline into the empty zone.
- Anything in `outsideSafeBand` → move it into y 285–1635.

## Gotchas

- Fonts that fail to load fall back to Inter Bold; check the screenshot if a mood font looks generic.
- Set the page once per call (`buildCover` does it).
- Text `\n` makes real line breaks; keep headlines to 2 lines.
