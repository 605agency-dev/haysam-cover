---
name: haysam-cover
description: Make Haysam Instagram covers (9:16 master + 4:5 feed crop) as editable layers in the user's own Figma file. Use when the user asks for a Haysam post cover, an Instagram cover for a new lesson ("yangi darslik"), an offer ("1-oy atigi 100 so'm"), a how-to ("qanday qilib…"), tool news, a stat or an announcement, or says "cover", "muqova", "post rasmi", "oblojka". Invents the idea from meaning, picks a fresh layout with the rotation rule, renders the AI image with Nano Banana 2 on Higgsfield, and builds the cover with the bundled Figma kit. Also triggers on a message containing a HAYSAM BRIEF block.
---

# Haysam Cover

Haysam is an AI **education** platform. Its covers read as learning content (lesson, course, tutorial, offer), sit in a near-white Higgsfield-style world, and change composition every post. Consistency is hidden: only the team should notice the system.

You turn a short brief into a finished, editable cover in the **user's own Figma file**:

1. idea in words → 2. layout from the picker (never repeating the last 3) → 3. AI image (Nano Banana 2) → 4. build with `scripts/kit.js` → 5. check 9:16 and 4:5 → 6. log it.

## 0 · Connections (no keys, ever)

The plugin ships two MCP connections in `.mcp.json`; the user signs in with their own accounts (OAuth):

- **Figma** (`https://mcp.figma.com/mcp`): `use_figma`, `upload_assets`, `get_screenshot`, `create_new_file`.
- **Higgsfield** (`https://mcp.higgsfield.ai/mcp`): `generate_image`, `jobs_wait`.

If a tool is missing, tell the user in one line to connect that service from Claude's connector settings with their own account. Never ask for API keys or tokens.

On claude.ai (no shell): images cannot be uploaded with curl. Build the cover with an empty image slot, give the user the generated image link, and tell them to drop it on the `IMAGE · …` layer. Recommend Claude Desktop or Claude Code for the full flow.

## 1 · Where to build

- Build **only** in a file the user owns or can edit. Ask for its link once; remember it for the session.
- No file yet → `create_new_file` named `Haysam Covers` in their drafts (if `whoami` shows several plans, ask which one).
- The Haysam template file (`5fwBVBqshynrcOhdDIfAKI`, page `55:2`) is a **read-only reference**. You may `get_screenshot` its sample nodes (ids in `references/layouts.md`) to see a layout, but never write to it.
- First cover in a file: run the kit setup (`references/figma-build.md` § Setup). It creates the `HAYSAM KIT` page with the brand logo variants, tool logos and the COVER LOG. Add a tool logo the same way when a new tool appears.

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

If the user gives a full sentence brief, extract the fields yourself and go.

A message with a `HAYSAM BRIEF` block comes from the brief form on haysam-cover.vercel.app. Its lines map to the table (Post turi, Sarlavha, Tool, Yo'nalish, Qo'shimcha matn, Tugma = CTA, Rasm, Figma fayl). Treat it as complete: ask nothing, go straight to the idea. A `Figma fayl` link is the file to build in; without it, use section 1. `Rasm: O'z rasmimni beraman` means wait for the photo before building the image slot.

## 3 · Idea first

Before any layout, write two lines for yourself (show them to the user in the final message):

- **Insight**: what this post promises the learner.
- **Metaphor**: one concrete visual that carries it (an object, a scene, a UI moment).

Rules and examples: `references/idea-engine.md`.

## 4 · Layout + rotation

1. Read the last 3 rows of the COVER LOG (snippet in `references/figma-build.md`).
2. Pick the layout from the meaning→layout picker in `references/idea-engine.md`.
3. The new cover must differ from each of the last 3 in **layout, background, mood font and accent colour**. If the best layout was used recently, take the second best.
4. Layout recipes with exact geometry: `references/layouts.md`. Brand tokens and type: `references/brand-dna.md`.

## 5 · AI image (Nano Banana 2 only)

- Model `nano_banana_2_1` on Higgsfield. Generating the cover image is part of the request; do not ask again. Never generate video unless the user explicitly asks.
- 9:16 slots: aspect `9:16`; object bands: `1:1`. Palette follows the **topic**, not brand yellow/brown. Render on the exact cover background colour so it blends.
- Prompt patterns and rules: `references/ai-images.md`.
- The user's own photo: use it as the image (or as `image_references` for a restyle).

## 6 · Build

Paste `scripts/kit.js` plus `return await buildCover(SPEC)` into one `use_figma` call. SPEC format: `references/spec.md`. It returns the cover id, the 4:5 frame id and `images` (slot → node id). Then:

1. Download each generated image with curl, `upload_assets` with `nodeIds` = the slot ids, POST the files (details in `references/figma-build.md`). The 4:5 frame is an instance, so it updates by itself.
2. `get_screenshot` the 9:16 cover **and** the 4:5 frame. Fix anything clipped, crowded or unreadable (`outsideSafeBand` lists key layers outside y 285–1635). One fix pass, then stop.
3. Include `log: { layout, bg, font, accent, idea }` in the SPEC so the cover is written to the COVER LOG.

## 7 · Reply

Short, in the user's language: the idea (insight + metaphor), the layout used, the Figma link to the cover (`https://www.figma.com/design/<fileKey>?node-id=<id with - instead of :>`), and one offer (another variant, a different layout, or the matching story/reel frame).

## Hard rules

- Tool logos: official files only (`assets/logos/`, the brand's press kit, Wikimedia, Simple Icons). Never generated, never redrawn.
- Key content inside the 4:5 band (y 285–1635 of 1920).
- One accent per post. Near-white backgrounds by default; dark only when the idea needs night/cinema.
- Headline max 2 lines; big. Small meta text is avoided.
- No dark outlines on buttons; glow is same-hue.
- Everything stays editable: real text layers, components, image fills. Never flatten the cover into one picture.
