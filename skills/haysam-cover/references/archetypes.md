# Archetypes (the team's Higgsfield study)

The Haysam Cover Figma file is the reference library. Its `COVER SYSTEM` page holds the team's study of 93 Higgsfield covers grouped into 10 archetypes (frame `SPEC · WHITE STYLES`, node `77:1660`), the hidden DNA (`66:886`) and 15 worked templates. Look at it, then create freely: covers do not have to fit a template, they have to read as one brand.

File: `5fwBVBqshynrcOhdDIfAKI` (read only). See it with `get_screenshot` (`maxDimension` 2000 for the whole study, or crop to the archetype row you need).

General laws of the study: near-white background (#F4F4F6) · one accent colour per post · small centred lockup at the top · lots of empty space · an object overlaps the headline (layer play) · a different font every post · an AI cursor or hand is often pressing something · never the same archetype twice in a row.

| # | Archetype | What it looks like | Haysam use |
| --- | --- | --- | --- |
| 01 | Studio person + prop | white seamless studio, a real person plays with a symbolic prop (bear + saw, miniature house, megaphone); big short headline on top | host or model with the topic's prop; News or Loud font |
| 02 | 3D hero object (glass / chrome) | one big floating object in the centre (lock, chip, brain, keycaps); one accent colour | glass objects in the topic's colour; object overlaps the headline |
| 03 | UI in the scene | app windows in 3D perspective, panels, a cursor clicking; a person steps out of the UI | real tool interface + cursor + host; plugin and integration posts |
| 04 | Type only | almost empty white; one strong type move (pixel, motion blur number, slash), small chips or a button under it | one word or number + pop button; fastest to make |
| 05 | Figma canvas / selection | blue selection box, handles, cursor, dotted or grid background; objects look "being designed" | selection over text or over a photo |
| 06 | Card fan / stack | image cards in a fan, layers or a floating pile; cards around a phone | process and feature lists |
| 07 | Editorial paper (serif) | warm paper texture, engraving or botanical illustration, serif or italic headline; premium, art feeling | Premium font (Instrument Serif) + AI engraving; letters, stories |
| 08 | Mascot / character | round blob characters, clay figure, pixel hero; funny and friendly | adult detailed AI character for bot and agent posts |
| 09 | Split / before–after | diagonal or vertical split: sketch ↔ render, input → output | "what AI does" posts; both halves in one Nano Banana frame |
| 10 | Colour wash + chips | white background, a soft colour blob in one corner, floating pill tags or a motion blur button | tags = tool names; wash in brand yellow→orange, lavender or sky, **never lime** |

## Hidden DNA (on every cover)

1. HAYSAM × Tool lockup, centred, top (y ≈ 330, logo 52–64 px high); bottom is fine when the image needs the top.
2. Tool logo: the official file, in its own colours.
3. Font chosen from the type moods: Brand (greeting, announcement), News (launch, update), Future (AI, tech), Loud (offers, numbers), Cinema (video tools), Premium (trust, story), Play (fun, community).
4. Key content inside the 4:5 band (y 285–1635).
5. Lettering: smooth gradient or flat, thin sheen at most. No embossed shadow, no WordArt.

**No lime green.** Acid / lime green (#C9F24A, #D4FF4F and near) and black chips with lime text are Higgsfield's own signature: on a Haysam cover they read as a Higgsfield post. Never use them as wash, chip, button or accent. The study is Higgsfield's work, so take its compositions, not its colours. If `palette.py` returns a lime accent, take the image's second strongest tone instead.

**Colour:** covers without an image use the brand palette (lavender #E5E9FF, ink #58160C, yellow #FEE252, orange #DF3909, comet glow; sky gradient only for offers). **Covers with an AI image take every colour from the picture** (`scripts/palette.py`); the brand shows only in the lockup, tool logo and font, and buttons may keep brand colour. This overrides DNA item "only our colours" on the Figma page.
