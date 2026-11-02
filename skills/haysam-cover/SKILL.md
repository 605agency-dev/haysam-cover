---
name: haysam-cover
description: Make Haysam Instagram covers (9:16 master + 4:5 feed crop) and carousel posts (4:5 slides on the brand lavender + dot grid) as editable layers in the user's own Figma file. Use when the user asks for a Haysam post cover, an Instagram cover for a new lesson ("yangi darslik"), an offer ("1-oy atigi 100 so'm"), a how-to ("qanday qilib…"), tool news, a stat or an announcement, or says "cover", "muqova", "post rasmi", "oblojka", "karusel", "carousel", "slayd". Invents the idea from meaning, picks a fresh layout with the rotation rule, renders the AI image with Nano Banana 2 on Higgsfield, and builds the cover with the bundled Figma kit. Also triggers on a message containing a HAYSAM BRIEF block.
---

# Haysam Cover

Haysam is an AI **education** platform. Its covers read as learning content (lesson, course, tutorial, offer), sit in a near-white Higgsfield-style world, and change composition every post. Consistency is hidden: only the team should notice the system.

You turn a short brief into a finished, editable cover (or a carousel, section 7) in the **user's own Figma file**:

1. idea in words → 2. composition from the archetypes (never repeating the last 3) → 3. AI image (Nano Banana 2) → 4. build with `scripts/kit.js` → 5. check 9:16 and 4:5 → 6. log it.

## 0 · Connections (no keys, ever)

The plugin ships two MCP connections in `.mcp.json`; the user signs in with their own accounts (OAuth):

- **Figma** (`https://mcp.figma.com/mcp`): `use_figma`, `upload_assets`, `get_screenshot`, `create_new_file`.
- **Higgsfield** (`https://mcp.higgsfield.ai/mcp`): `generate_image`, `jobs_wait`.

If a tool is missing, tell the user in one line to connect that service from Claude's connector settings with their own account. Never ask for API keys or tokens.

On claude.ai (no shell): images cannot be uploaded with curl. Build the cover with an empty image slot, give the user the generated image link, and tell them to drop it on the `IMAGE · …` layer. Recommend Claude Desktop or Claude Code for the full flow.

## 1 · Where to build, what to look at

**Free creativity, one brand.** Covers do not have to fit a template. They have to read as Haysam. The team's Figma file is the reference library, not a mould.

- **Look first.** Before designing, `get_screenshot` the reference file `5fwBVBqshynrcOhdDIfAKI` (read only): the Higgsfield study `77:1660` (10 archetypes), the hidden DNA `66:886`, and the 1–2 templates closest to the idea (node ids in `references/templates.md`). Text summary: `references/archetypes.md`.
- **Build** in any Figma file the user can edit (the `Figma fayl` link from the brief, or ask for one; no link → `create_new_file`). Covers go to the `Haysam Covers` page (created automatically) together with the COVER LOG.
- **First time in a file:** run the kit setup (`references/figma-build.md` § Setup): it puts the HAYSAM logo, glow and tool logos on a `HAYSAM KIT` page.
- **Optional shortcut:** if the file is a duplicate of the reference (it has a `COVER SYSTEM` page) and one template fits the idea as it is, `fromTemplate` copies it in one call. Never required, never ask the user to duplicate.
- Never write to `5fwBVBqshynrcOhdDIfAKI`; it is the master for everyone.

## 2 · Brief (ask only what is missing, in one short message, in the user's language)

| Field | Values |
| --- | --- |
| Post type | yangi darslik · taklif/aksiya · qanday qilib · tool yangiligi · raqam/stat · e'lon · faqat logo |
| Headline | the main words, max ~5 words (you may shorten; show the shortened version) |
| Extra text | optional: price, date, lesson number, 2–3 chip words |
| Tool | from `assets/logos/` or the user's official SVG; never a generated logo |
| Direction | one sentence: mood, metaphor, what to feel |
| Image | AI (default) · user's photo · none |
| CTA | optional button text |
| Format | cover (default) · karusel: page count + the text for each page |

If the user gives a full sentence brief, extract the fields yourself and go.

A message with a `HAYSAM BRIEF` block comes from the brief form on haysam-cover.vercel.app. Its lines map to the table (Post turi, Format, Sarlavha, Tool, Yo'nalish, Qo'shimcha matn, Tugma = CTA, Rasm, Figma fayl, Sahifalar). Treat it as complete: ask nothing, go straight to the idea. A `Figma fayl` link is the file to build in; without it, see section 1. `Rasm: O'z rasmimni beraman` means wait for the photo before building the image slot.

## 3 · Idea first

Before any layout, write two lines for yourself (show them to the user in the final message):

- **Insight**: what this post promises the learner.
- **Metaphor**: one concrete visual that carries it (an object, a scene, a UI moment).

Rules and examples: `references/idea-engine.md`.

## 4 · Composition + rotation

1. Read the last 3 rows of the COVER LOG (snippet in `references/figma-build.md`).
2. Pick the composition from the idea: one of the 10 archetypes in `references/archetypes.md` (studio + prop, 3D hero object, UI in scene, type only, Figma canvas, card fan, editorial paper, mascot, split, colour wash + chips), a recipe from `references/layouts.md`, or something new the idea asks for. Mixing two archetypes is fine.
3. The new cover must differ from each of the last 3 in **composition, background, mood font and accent colour**. Image covers take background and accent from the picture.
4. Keep the hidden DNA (`references/archetypes.md`): lockup, real tool logo, mood font, 4:5 band, clean lettering. Brand tokens and type: `references/brand-dna.md`.

## 5 · AI image (Nano Banana 2 only)

- Model `nano_banana_2_1` on Higgsfield. Generating the cover image is part of the request; do not ask again. Never generate video unless the user explicitly asks.
- 9:16 slots: aspect `9:16`; object bands: `1:1`. The prompt's palette comes only from the **topic**; never ask for Haysam colours or the template's background in the prompt.
- **Image covers: the picture owns the colour.** When a cover has an AI image, its colours come 100% from the topic (a nature lesson looks like nature, a finance topic like finance). Haysam does not tint it. Our style on an image cover is only: the HAYSAM logo (top or bottom), the tool logo, and a fitting font. No brand yellow/brown backgrounds, no comet glow, no yellow stickers. The one exception is a button (`UI / …` components), which may keep brand colour.
- Prompt patterns and rules: `references/ai-images.md`.
- The user's own photo: use it as the image (or as `image_references` for a restyle).

## 6 · Build

Default: free composition. Paste `scripts/kit.js` plus `return await buildCover(SPEC)` into one `use_figma` call (SPEC: `references/spec.md`, recipes: `references/layouts.md`). It returns the cover id, the 4:5 frame id and `images` (slot → node id). Shortcut when a template fits as it is: `return await fromTemplate(SPEC)` (`references/templates.md`, file must have `COVER SYSTEM`).

1. Image covers, in this order: generate the image(s) first, download, run `python3 scripts/palette.py <image> [top|bottom]` (where the headline sits). Use its colours for canvas, fades, headline and chip (`fromTemplate` takes it as `palette`). No Python: pick the same four colours by eye.
2. **No seams:** when the image does not fill the canvas, the canvas is a gradient with a solid stop of the image's top-edge colour down to the image's top, and the bottom-edge colour (`bgOther`) from the image's bottom; fades over the image edges use the same two colours.
3. Upload one image per slot: download with curl, `upload_assets` with `nodeIds` = the slot ids, POST the files (details in `references/figma-build.md`). Template copies carry test pictures: replace or hide every slot. The 4:5 frame is an instance, so it updates by itself.
4. `get_screenshot` the 9:16 cover **and** the 4:5 frame. Fix anything clipped, crowded or unreadable. One fix pass, then stop.
5. Include `log: { layout, bg, font, accent, idea }` in the SPEC so the cover is written to the COVER LOG (`layout` = archetype or recipe name).

## 7 · Carousel posts

When the format is karusel (or the user lists pages / slides), build a carousel instead of a cover:

- **4:5 only**: every slide is 1080×1350. No 9:16 master, no crop. Element `y` runs 0 to 1350.
- **Page count is the user's.** Build exactly the number of pages given, one slide per page text, in order. Keep their words; shorten only to fit, and show what you shortened.
- **Brand background on every slide**: lavender gradient `#E5E9FF` → `#F6F7FF` + the dot grid (kit default). **No page counter** (`01 / 06`): it reads as AI slop.
- **Every slide has an image** unless the brief says Rasmsiz: one Nano Banana 2 object render per slide on a seamless plain neutral backdrop, then `swift scripts/cutout.swift` cuts the object out (no shadows) so it sits on the gradient + dots. Same material and light across the set.
- **One system across slides**: same mood font, same accent, same grid. Slide 1 is the hook (the cover idea, brand lockup); middle slides share one grid; the last slide closes (CTA, save, or summary).
- Every tool named on a slide gets its **real logo** (`tile` element); add missing logos from official sources first.
- Build with `return await buildCarousel(SPEC)` (format: `references/carousel.md`). It returns the section id, slide ids and `images` keyed `page:slot` (`'2:hero'`). Upload images the same way as covers, then screenshot the section once and fix.
- Log it like a cover; the layout field is written as `carousel N · <grid>`.

## 8 · Reply

Short, in the user's language: the idea (insight + metaphor), the composition used (archetype), the Figma link to the cover (`https://www.figma.com/design/<fileKey>?node-id=<id with - instead of :>`), and one offer (another variant, a different layout, or the matching story/reel frame).

## Hard rules

- Tool logos: official files only (`assets/logos/`, the brand's press kit, Wikimedia, Simple Icons). Never generated, never redrawn.
- Key content inside the 4:5 band (y 285–1635 of 1920). Carousels are 4:5 already: keep key content above y 1260. No page counters.
- No lime / acid green anywhere (wash, chip, button, accent): it reads as Higgsfield. Take the study's compositions, never its colours.
- One accent per post. Near-white backgrounds by default; dark only when the idea needs night/cinema.
- Image covers: colours from the picture only (`palette`). Brand = logo lockup + tool logo + font; buttons may keep brand colour. Brand colours (yellow, brown, lavender, comet glow) belong to covers without an image.
- Headline max 2 lines; big. Small meta text is avoided.
- No dark outlines on buttons; glow is same-hue.
- Everything stays editable: real text layers, components, image fills. Never flatten the cover into one picture.
- Never write to the reference file `5fwBVBqshynrcOhdDIfAKI`. In a duplicate, never change the `COVER SYSTEM` components; edit only what is on `Haysam Covers`.
- Templates are a reference, not a rule: free composition is the default.
