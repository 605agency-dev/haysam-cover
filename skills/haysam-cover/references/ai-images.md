# AI images (Higgsfield · Nano Banana 2 only)

Model id: `nano_banana_2_1`. One image per slot. Do not switch models; never generate video unless the user explicitly asks.

```
generate_image({ params: { model: 'nano_banana_2_1', prompt, aspect_ratio: '9:16' | '1:1',
                           medias?: [{ value: <media_id or job_id>, role: 'image_references' }] } })
jobs_wait({ jobs: [{ index: 0, job_id }] })      // returns the image URL
```

- Reference photos: upload with `media_upload` → curl PUT → `media_confirm`, then pass the returned id in `medias` (never a raw URL).
- If the tool answers with `unlim_choice`, ask the user which balance to use; never pick for them.
- On a timeout, do not resubmit blindly: wait on the returned job id.

Download with curl, then upload into the slot (see `figma-build.md`). 9:16 results are about 768 × 1376: fine for the cover, Figma scales with FILL.

## Palette

- Follows the **topic**, not Haysam yellow/brown. Claude lesson → warm terracotta; Veo → teal/blue; finance/offer → sky; agents → warm neutral.
- Light tints are welcome. Do not force the sky offer gradient into images.
- Render objects **on the exact cover background colour** (say the hex in the prompt). Transparent cut-outs leave a white fringe; avoid them.

## Prompt skeleton

```
[subject + action], [one metaphor object], [material: glassmorphic / matte / brushed metal],
[lighting: soft studio, large softbox, gentle rim light], [palette: 2–3 named colours from the topic],
background solid [#hex] seamless, [empty area: top 40% clean for text],
high detail, photographic, adult and premium (not toy, not cartoon), no text, no logos, no watermark
```

## Patterns by layout

| Layout | Prompt focus |
| --- | --- |
| A Tool Hero | cinematic still of what the tool makes; top quarter near black `#270601`; warm rim light |
| A3 Photo | full-bleed scene; darkest tone at the top for the headline |
| E Big Button | 3–4 glass objects of the topic floating in a band, on `#e5e9ff` |
| F Process | a vertical stack of 3 glass stages rising from a card; separate image: one 3D glass cursor |
| G Letter | single glass envelope / card, soft violet or topic tint, centred, on the bg colour |
| H Studio | person (adult, natural, confident) in a white seamless studio `#f1f2f2`, holding/using the topic prop, framed from the chest up in the lower 60% |
| J UI in Scene | person leaning out of a floating app window, glass cursor nearby, top 40% empty |
| K Split | one frame split diagonally: left the "before" (sketch, raw), right the "after" (photo, finished) |
| L Mascot | 4–6 matte geometric characters around an empty centre, playful poses, pastel topic colours on white |

## Glass cursors

Generated 3D glass cursors are allowed as objects. Real UI cursors (layout B/M) come from the kit's `cursor` element.

## Never

- Generated tool logos, brand marks or text inside images.
- Childish/toy rendering, plastic cartoon faces, emoji style.
- Busy backgrounds behind the headline area.
