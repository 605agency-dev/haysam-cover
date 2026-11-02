# Templates (COVER SYSTEM page)

The Haysam Cover template file holds the team's own cover designs as components on the `COVER SYSTEM` page. **These are the base.** A cover is a copy of one of them with the content swapped. The design itself (composition, fonts, sizes, glow, buttons, colours) stays exactly as the team drew it, so every user's Claude produces the same quality.

Template file (users duplicate it once): https://www.figma.com/design/5fwBVBqshynrcOhdDIfAKI

```js
return await fromTemplate({
  template: 'Tool Hero',                 // name between "Cover / " and " · 9:16"
  name: 'Claude darslik',                // name of the new cover
  texts: { 'HEADLINE': 'SAYTNI\nO‘ZING YIG‘', 'TOOL NOMI': 'YANGI DARS', 'Tool': 'Claude' },
  tool: 'Claude',                        // swaps every tool icon/logo, fitted into the old box
  brand: 'Yellow + White',               // optional: Brand / HAYSAM colour
  variants: { 'glow · comet → hero': { Tone: 'Sky' } },   // optional: nested component variants by layer name
  hide: [],                              // optional: layer names to hide
  log: { layout: 'A Tool Hero', bg: '#270601', font: 'news', accent: '#fee252', idea: '…' },
});
// → { cover, crop, template, images: { layerName: nodeId }, missing: [keys not found], log }
```

Text keys are layer names (or the current text when the layer is named by its content). `missing` lists keys that matched nothing: fix the key and edit that layer, do not ignore it.

**Every image slot carries the template's test picture** (Veo surfer, studio guy…). Always replace each slot in `images` with a new Nano Banana 2 image, or hide it. Never ship a cover with the template's test image.

## The 15 templates

| Template | Use for | Text keys | Image slots (generate at) | Tool |
| --- | --- | --- | --- | --- |
| `Tool Hero` (A) | tool news, "X'da video yasash" | `HEADLINE`, `TOOL NOMI` (sticker), `Tool` (lockup name) | `HERO SLOT · Higgsfield gen (Veo test)` 1080×1040 (`1:1`) | lockup icon + big logo |
| `Tool Hero · Logo only` (A2) | tool launch, big wordmark | `Tool`, `TOOL WORDMARK (logo-type)` | `HERO SLOT · …` 1080×1040 (`1:1`) | lockup icon + big logo |
| `Photo Full-bleed` (A3) | cinematic tool result | `HEADLINE`, `TOOL NOMI`, `Tool` | `HERO SLOT · full-bleed AI photo` 1080×1920 (`9:16`) | lockup icon + big logo |
| `Board` (B) | personal announcement "Hi NAME!" | `HEADLINE`, `MESSAGE`, second `haysam` = guest cursor name | `IMAGE CARD · reel frame` 600×420 (`4:3`) | none |
| `Special Offer` (C) | offer, discount, "1 oy 100 so'm" | `HEADLINE`, `OFFER TEXT`, `−30%`, `label` (button) | none | none |
| `Big Stat` (D) | one number: price, %, count | `STAT`, `WORD`, `tool name` | none | lockup icon |
| `Big Button` (E) | start / try / enrol | `HEADLINE`, `label` (button), `tool name` | `IMAGE · objects` 1080×603 (`16:9`) | lockup icon |
| `Process Stack` (F) | how to, steps | `SO'ZDAN KADRGACHA` (headline), `tool name` | `AI · process stack` 1080×1080 (`1:1`), `AI · cursor` 320×320 (`1:1`) | lockup icon |
| `Letter` (G) | personal message, news to followers | `Hi Anvar,`, `yangiligimiz bor!` | `AI · glass envelope` 1080×1080 (`1:1`) | none |
| `Studio + Prop` (H) | new lesson with a person | `SAYTNI O‘ZING YIG‘` (headline), `kod yozmasdan · 1 kunda` (sub), `tool name` | `AI · studio person + prop` 1080×1935 (`9:16`) | lockup icon |
| `Type Only` (I) | version / feature list | `KICKER`, `BIG`, `ovoz bilan`, `1080p`, `8 soniya` (chips), `RESET` (button), `tool name` | none | lockup icon |
| `UI in Scene` (J) | feature inside an app | `FIGMA ICHIDA AI` (headline), `plagin · 2 daqiqada` (sub), `tool name` | `AI · person through UI` 1080×1935 (`9:16`) | lockup icon |
| `Split` (K) | before / after, input → output | `ESKIZDAN`, `SURATGA`, `INPUT`, `OUTPUT`, `tool name` | `AI · split before/after` 1080×1935 (`9:16`) | lockup icon |
| `Colour Wash + Chips` (M) | list of models / tools | `12 model bitta joyda` (headline), chips `VEO 3.1`, `KLING 3.0`, `NANO BANANA 2`, `SEEDANCE 2.5`, `GPT IMAGE 2.5`, `SOUL 2` | none | none |
| `Mascot` (L) | agents, playful topic | `agentlaring uxlamaydi` (headline), `24/7 · siz uxlaganda ham` (sub), `tool name` | `AI · mascots` 864×1548 (`9:16`) | lockup icon |

Unused chips or lines: put them in `hide`.

## Variants you can switch

| Layer (nested component) | Prop | Options |
| --- | --- | --- |
| `glow · comet → hero` | `Tone` | `Warm`, `Sky` |
| any `Brand / HAYSAM` (use `brand`) | `Color` | `Yellow + White`, `Ink`, `Yellow + Ink`, `White` |
| `CTA · glass` | `Tone` | `Clear`, `Offer` |
| `UI / Big Button · 3D` | `Tone` | `Sunrise`, `Sky`, `Ink` |
| `CTA · pop` | `Tone` | `Yellow`, `Sky`, `Ember`, `Lime` |
| `bg · tiles` / `bg · dots` / `bg · lines` | `Pattern` | `Plain`, `Dots`, `Lines`, `Tiles` |

## Tool logos

The template has `Tool / Google Veo · icon`, `Tool / Claude · icon`, `Tool / Figma · icon`, `Tool / Gemini · icon`. Any other tool: add it once from `assets/logos/` with the kit setup (PART B, tools only; skip `haysam`). `tool` finds both `Tool / X` and `Tool / X · icon`.

## Variety

Rotation works the same as before (COVER LOG, last 3 differ in template, background, font, accent). With 15 templates plus the `variants` switches (glow tone, button tone, pattern, brand colour) there are many combinations before anything repeats. Use `buildCover` (free composition from `layouts.md`) only when no template fits the idea; say so in the reply.
