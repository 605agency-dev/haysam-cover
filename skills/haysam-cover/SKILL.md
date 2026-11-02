---
name: haysam-cover
description: Make Haysam Instagram covers (9:16 master + 4:5 feed crop) and carousel posts (4:5 slides with a page counter) as editable layers in the user's own Figma file. Use when the user asks for a Haysam post cover, an Instagram cover for a new lesson ("yangi darslik"), an offer ("1-oy atigi 100 so'm"), a how-to ("qanday qilib…"), tool news, a stat or an announcement, or says "cover", "muqova", "post rasmi", "oblojka", "karusel", "carousel", "slayd". Invents the idea from meaning, picks a fresh layout with the rotation rule, renders the AI image with Nano Banana 2 on Higgsfield, and builds the cover with the bundled Figma kit. Also triggers on a message containing a HAYSAM BRIEF block.
---

# Haysam Cover

Haysam is an AI **education** platform. Its covers read as learning content (lesson, course, tutorial, offer), sit in a near-white Higgsfield-style world, and change composition every post. Consistency is hidden: only the team should notice the system.

You turn a short brief into a finished, editable cover (or a carousel, section 7) in the **user's own Figma file**:

1. idea in words → 2. layout from the picker (never repeating the last 3) → 3. AI image (Nano Banana 2) → 4. build with `scripts/kit.js` → 5. check 9:16 and 4:5 → 6. log it.

## 0 · Connections (no keys, ever)

The plugin ships two MCP connections in `.mcp.json`; the user signs in with their own accounts (OAuth):

- **Figma** (`https://mcp.figma.com/mcp`): `use_figma`, `upload_assets`, `get_screenshot`, `create_new_file`.
- **Higgsfield** (`https://mcp.higgsfield.ai/mcp`): `generate_image`, `jobs_wait`.

If a tool is missing, tell the user in one line to connect that service from Claude's connector settings with their own account. Never ask for API keys or tokens.

On claude.ai (no shell): images cannot be uploaded with curl. Build the cover with an empty image slot, give the user the generated image link, and tell them to drop it on the `IMAGE · …` layer. Recommend Claude Desktop or Claude Code for the full flow.

## 1 · Where to build: a copy of the Haysam Cover template

The base of every cover is the team's own design: the components on the `COVER SYSTEM` page of the Haysam Cover template (`https://www.figma.com/design/5fwBVBqshynrcOhdDIfAKI`). Covers must come out the same in every user's Claude, so they are built from those components, not redrawn.

- Work in the user's **copy** of that file (it has a `COVER SYSTEM` page). Ask for its link once; remember it for the session.
- No copy yet → tell the user in two lines: open the template link, Figma menu → **Duplicate** (to their drafts), send the new link. Wait for it. Figma cannot copy components between files, so this one click is required.
- Never write to the original template file `5fwBVBqshynrcOhdDIfAKI`; it is the master for everyone. Read and screenshot only.
- Covers go to the `Haysam Covers` page of the copy (created automatically). The COVER LOG lives there too (or on `HAYSAM KIT` if the file has it).
- A tool logo the template lacks: add it once with the kit setup, tools only (`references/figma-build.md` § Setup, skip `haysam`).
- The user refuses to duplicate: fall back to a plain file + kit setup + `buildCover` (free composition), and say the result is an approximation of the team templates.

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

A message with a `HAYSAM BRIEF` block comes from the brief form on haysam-cover.vercel.app. Its lines map to the table (Post turi, Format, Sarlavha, Tool, Yo'nalish, Qo'shimcha matn, Tugma = CTA, Rasm, Figma fayl, Sahifalar). Treat it as complete: ask nothing, go straight to the idea. A `Figma fayl` link is the file to build in; without it, use section 1. `Rasm: O'z rasmimni beraman` means wait for the photo before building the image slot.

## 3 · Idea first

Before any layout, write two lines for yourself (show them to the user in the final message):

- **Insight**: what this post promises the learner.
- **Metaphor**: one concrete visual that carries it (an object, a scene, a UI moment).

Rules and examples: `references/idea-engine.md`.

## 4 · Template + rotation

1. Read the last 3 rows of the COVER LOG (snippet in `references/figma-build.md`).
2. Pick the template from the meaning→layout picker in `references/idea-engine.md` (layout letters A–M = templates in `references/templates.md`). The Higgsfield study on the COVER SYSTEM page (`SPEC · WHITE STYLES`, 10 archetypes) is the reference for the idea and the image; screenshot it when unsure.
3. The new cover must differ from each of the last 3 in **template, background, mood font and accent colour**. Use the template `variants` (glow tone, button tone, pattern, brand colour) to change background and accent. If the best template was used recently, take the second best.
4. Brand tokens and type: `references/brand-dna.md`.

## 5 · AI image (Nano Banana 2 only)

- Model `nano_banana_2_1` on Higgsfield. Generating the cover image is part of the request; do not ask again. Never generate video unless the user explicitly asks.
- 9:16 slots: aspect `9:16`; object bands: `1:1`. Palette follows the **topic**, not brand yellow/brown. Render on the exact cover background colour so it blends.
- Prompt patterns and rules: `references/ai-images.md`.
- The user's own photo: use it as the image (or as `image_references` for a restyle).

## 6 · Build

Paste `scripts/kit.js` plus `return await fromTemplate(SPEC)` into one `use_figma` call (SPEC: `references/templates.md`). It copies the template, swaps texts, tool logo and variants, and returns the cover id, the 4:5 frame id, `images` (slot layer → node id) and `missing` (keys that matched nothing). `buildCover` (free composition, `references/spec.md` + `layouts.md`) is only for ideas no template fits. Then:

1. Generate one image per slot in `images` and upload them: download with curl, `upload_assets` with `nodeIds` = the slot ids, POST the files (details in `references/figma-build.md`). Every slot still shows the template's test picture until replaced, so replace or hide all of them. The 4:5 frame is an instance, so it updates by itself.
2. `get_screenshot` the 9:16 cover **and** the 4:5 frame. Fix anything clipped, crowded or unreadable (longer text than the template's may need a smaller font size on that layer). One fix pass, then stop.
3. Include `log: { layout, bg, font, accent, idea }` in the SPEC so the cover is written to the COVER LOG.

## 7 · Carousel posts

When the format is karusel (or the user lists pages / slides), build a carousel instead of a cover:

- **4:5 only**: every slide is 1080×1350. No 9:16 master, no crop. Element `y` runs 0 to 1350.
- **Page count is the user's.** Build exactly the number of pages given, one slide per page text, in order. Keep their words; shorten only to fit, and show what you shortened.
- **Every slide has an image** unless the brief says Rasmsiz: one Nano Banana 2 image per slide, aspect `4:5` (`1:1` for object bands), same palette and lighting across the set so it reads as one post.
- **One system across slides**: same background family, same mood font, same accent. Slide 1 is the hook (the cover idea, brand lockup); middle slides share one grid; the last slide closes (CTA, save, or summary).
- **Page counter** (`01 / 06`) sits at the bottom of every slide automatically; it turns light on dark slides. `pager: false` hides it on a slide that needs the space.
- Build with `return await buildCarousel(SPEC)` (format: `references/carousel.md`). It returns the section id, slide ids and `images` keyed `page:slot` (`'2:hero'`). Upload images the same way as covers, then screenshot the section once and fix.
- Log it like a cover; the layout field is written as `carousel N · <grid>`.

## 8 · Reply

Short, in the user's language: the idea (insight + metaphor), the layout used, the Figma link to the cover (`https://www.figma.com/design/<fileKey>?node-id=<id with - instead of :>`), and one offer (another variant, a different layout, or the matching story/reel frame).

## Hard rules

- Tool logos: official files only (`assets/logos/`, the brand's press kit, Wikimedia, Simple Icons). Never generated, never redrawn.
- Key content inside the 4:5 band (y 285–1635 of 1920). Carousels are 4:5 already: keep key content above the page counter (y < 1230).
- One accent per post. Near-white backgrounds by default; dark only when the idea needs night/cinema.
- Headline max 2 lines; big. Small meta text is avoided.
- No dark outlines on buttons; glow is same-hue.
- Everything stays editable: real text layers, components, image fills. Never flatten the cover into one picture.
- Never change the template components on `COVER SYSTEM` themselves; edit only the copy on `Haysam Covers`.
