# Layout recipes

Each recipe is a starting SPEC. Change words, colours, font and accent to the idea; keep the geometry unless the idea needs more air. Sample node ids are in the read-only template file `5fwBVBqshynrcOhdDIfAKI` (`get_screenshot` them to look).

Lockup always sits at y 330 (brand × tool) unless the recipe says otherwise.

---

## A · Tool Hero (dark) · sample `55:68`
Tool launch, big model news. Dark bg, big official logo, AI hero frame at the bottom fading into the bg, comet glow aimed at the hero.
```js
{ bg: '#270601', elements: [
  { type: 'image', slot: 'hero', y: 880, w: 1080, h: 1040 },
  { type: 'glow', x: -860, y: 1000, w: 1500 },
  { type: 'fade', y: 600, h: 760, color: '#270601', dir: 'down' },
  { type: 'fade', y: 1460, h: 460, color: '#270601', dir: 'up' },
  { type: 'lockup', tool: 'Google Veo', brand: 'Yellow+White' },
  { type: 'toolIcon', tool: 'Google Veo', y: 420, size: 300 },
  { type: 'text', text: 'SARLAVHA\nSHU YERDA', font: 'news', size: 170, y: 730, color: '#ffffff', shadow: { a: 0.4 } },
  { type: 'sticker', text: 'TOOL NOMI', y: 1060 } ] }
```
Image: 9:16, scene of the tool's result, top quarter near-black so it melts into the bg.

## A2 · Logo only · sample `62:340`
No copy at all: giant logo + logotype in gradient. For "it's here" moments.
Same as A without headline/sticker; `toolIcon` size 380 at y 430; `text` = tool name, font `future`, size 240, y 790, colour `['#fee252','#f7a733','#df3909']`, `sheen: true`.

## A3 · Photo Full-bleed · sample `73:1366`
The AI photo is the whole cover (never a flat colour top). Fade the top for the lockup and headline.
```js
{ bg: '#03141b', elements: [
  { type: 'image', slot: 'hero', y: 0, w: 1080, h: 1920 },
  { type: 'fade', y: 0, h: 1100, color: '#03141b', dir: 'down' },
  { type: 'fade', y: 1500, h: 420, color: '#03141b', dir: 'up' },
  { type: 'lockup', tool: 'Google Veo', brand: 'Yellow+White' },
  { type: 'text', text: 'SARLAVHA\nSHU YERDA', font: 'news', size: 170, y: 730, color: '#ffffff', shadow: { a: 0.4 } } ] }
```
The bg colour = the photo's darkest tone (sample it after generation and rebuild if needed).

## B · Board (Figma canvas) · sample `55:104`
Announcements, greetings, community. Light canvas with dots, selected headline with handles and a cursor, sticky note, image card.
```js
{ bg: '#f6f7ff', pattern: 'dots', elements: [
  { type: 'glow', x: -760, y: 1730, w: 1100 },
  { type: 'lockup', y: 340 },
  { type: 'selection', y: 600, text: { text: 'HI NAME!', font: 'brandMedium', size: 150, color: '#58160c' }, cursor: { label: 'haysam' } },
  { type: 'chip', text: 'xabar\nshu yerda', bg: '#fee252', color: '#58160c', font: 'brand', size: 56, radius: 6, x: 482, y: 860, padX: 44, padY: 44 },
  { type: 'image', slot: 'card', x: 60, y: 1140, w: 600, h: 420, radius: 28, shadow: true },
  { type: 'cursor', x: 470, y: 1400, label: 'Anvar', color: '#1b7bff' } ] }
```

## C · Special Offer · sample `58:309`
Prices, discounts, "1-oy atigi 100 so'm". Lavender bg, big mono headline, price tag, sky glow, glass CTA in the offer gradient.
```js
{ bg: '#e5e9ff', elements: [
  { type: 'glow', tone: 'sky', x: -1020, y: 820, w: 1700 },
  { type: 'lockup', x: 72, y: 340 },
  { type: 'text', text: 'MAXSUS\nTAKLIF', font: 'brand', size: 150, align: 'left', x: 72, y: 470, color: '#58160c' },
  { type: 'text', text: 'Taklif matni\nshu yerda', font: 'brandMedium', size: 44, align: 'left', x: 72, y: 798, color: '#58160c', lh: 120 },
  { type: 'chip', text: '−30%', bg: '#58160c', color: '#9ee8ff', font: 'brand', size: 36, x: 780, y: 500, flat: true },
  { type: 'glassButton', text: 'Olish', tone: 'offer', x: 72, y: 1430 } ] }
```
For "atigi 100 so'm" make the price the hero (see D) and keep C's sky offer colours.

## D · Big Stat · sample `62:378`
A number is the message: price, %, count, lesson number. Grid bg, giant number inside a Figma selection, word underneath.
```js
{ bg: '#f6f7ff', pattern: 'grid', elements: [
  { type: 'lockup', tool: 'Claude' },
  { type: 'selection', y: 560, text: { text: '100', font: 'play', size: 320, ls: -6, lh: 100, color: ['#9ee8ff', '#2cd3f3', '#1b7bff'], sheen: true }, cursor: { label: 'haysam' } },
  { type: 'text', text: "SO'M", font: 'play', size: 176, y: 1080, color: 'inkMetal', sheen: true } ] }
```

## E · Big Button · sample `62:471`
Start/try/enrol posts. AI objects band on top, gradient headline, huge 3D button. Tiles bg.
```js
{ bg: '#e5e9ff', pattern: 'tiles', elements: [
  { type: 'image', slot: 'objects', y: 360, w: 1080, h: 603 },
  { type: 'lockup', y: 330 },
  { type: 'text', text: 'BIRINCHI\nVIDEONG', font: 'future', size: 118, y: 930, color: 'inkMetal', sheen: true, ls: -1, lh: 90 },
  { type: 'bigButton', text: 'BOSHLASH', y: 1300 } ] }
```
Image 16:9-ish band (generate 1:1 and crop with FILL): glass objects on the exact bg `#e5e9ff`.

## F · Process Stack · sample `73:1257`
"Qanday qilib…", step-by-step, from A to B. Headline on top, AI stack of stages, glass cursor clicking.
```js
{ bg: '#e5e9ff', pattern: 'dots', elements: [
  { type: 'lockup' },
  { type: 'text', text: "SO'ZDAN KADRGACHA", font: 'cinema', size: 127, y: 420, color: 'inkMetal', sheen: true },
  { type: 'image', slot: 'process', y: 544, w: 1080, h: 1080, ellipseFade: true },
  { type: 'image', slot: 'cursor', x: 760, y: 1184, w: 320, h: 320, ellipseFade: true } ] }
```

## G · Letter · sample `75:1435`
Personal message, greeting, "yangiligimiz bor". Serif greeting, glass envelope object, play-font line.
```js
{ bg: '#e5e9ff', pattern: 'lines', elements: [
  { type: 'lockup', y: 330 },
  { type: 'image', slot: 'object', y: 560, w: 1080, h: 1080, ellipseFade: true },
  { type: 'text', text: 'Hi Anvar,', font: 'premium', size: 230, y: 420, color: 'inkMetal' },
  { type: 'text', text: 'yangiligimiz bor!', font: 'play', size: 120, y: 1470, color: 'inkMetal' } ] }
```

## H · Studio + Prop · sample `81:1916`
A person in a white seamless studio holding/using the topic object. Great for "yangi darslik" with a human face.
```js
{ bg: '#f1f2f2', elements: [
  { type: 'image', slot: 'studio', y: 110, w: 1080, h: 1935 },
  { type: 'fade', y: 0, h: 700, color: '#f1f2f2', dir: 'down' },
  { type: 'lockup', tool: 'Claude' },
  { type: 'text', text: "SAYTNI\nO'ZING YIG'", font: 'news', size: 176, y: 430, color: '#270601' },
  { type: 'chip', text: 'kod yozmasdan · 1 kunda', bg: '#d97757', color: '#ffffff', y: 770, flat: true } ] }
```
Chip colour = the tool's brand colour. Person sits in the lower 60%, head below y 900.

## I · Type Only · sample `80:1660`
No image. Kicker + giant blurred number/word + chips + pop CTA. Fast, bold, cheap.
```js
{ bg: '#f6f7ff', pattern: { kind: 'lines', opacity: 0.7 }, elements: [
  { type: 'lockup', tool: 'Google Veo' },
  { type: 'text', text: 'GOOGLE\nVEO', font: 'loud', size: 96, align: 'left', x: 70, y: 640 },
  { type: 'text', text: '3.1', font: 'future', size: 520, x: 300, y: 820, progressiveBlur: 60 },
  { type: 'chips', y: 1290, items: ['ovoz bilan', '4K', '8 sekund'], chip: { dot: '#1b7bff', stroke: '#d9dceb' } },
  { type: 'pop', text: 'RESET', tone: 'sky', y: 1420 } ] }
```
Keep the giant word inside the canvas (measure: Unbounded Black ≈ 0.75 × size per character).

## J · UI in Scene · sample `83:1996`
A person breaking out of a floating tool window, glass cursor. "X ichida AI", feature tutorials.
```js
{ bg: '#e4e5e7', elements: [
  { type: 'image', slot: 'scene', y: 0, w: 1080, h: 1935 },
  { type: 'lockup', tool: 'Figma' },
  { type: 'text', text: 'FIGMA\nICHIDA AI', font: 'future', size: 118, y: 430, color: '#1b1530' },
  { type: 'chip', text: 'yangi darslik', bg: '#a259ff', color: '#ffffff', y: 670, flat: true } ] }
```
Image: top 40% empty bg for the text.

## K · Split before/after · sample `83:2110`
Transformation lessons: sketch → photo, raw → edited, prompt → result.
```js
{ bg: '#ffffff', elements: [
  { type: 'image', slot: 'split', y: 0, w: 1080, h: 1935 },
  { type: 'lockup', tool: 'Gemini' },
  { type: 'text', text: 'ESKIZDAN', font: 'loud', size: 150, y: 420, outline: '#1b1530', outlineWidth: 3 },
  { type: 'text', text: 'SURATGA', font: 'loud', size: 150, y: 545, color: ['#3d6bff', '#1236c9'] },
  { type: 'chip', text: '‹ ›', bg: '#ffffff', color: '#1e4fe0', font: 'uiBold', size: 40, x: 477, y: 1102 },
  { type: 'chip', text: 'INPUT', bg: '#ffffff', color: '#3a3a3a', font: 'uiBold', size: 28, radius: 10, x: 70, y: 1440 },
  { type: 'chip', text: 'OUTPUT', bg: '#1e4fe0', color: '#ffffff', font: 'uiBold', size: 28, radius: 10, x: 820, y: 900 } ] }
```
Image: one frame split diagonally, left = before, right = after.

## L · Mascot · sample `86:2366`
Agents, automation, community, playful lessons. Matte geometric characters around an empty middle; text in the middle.
```js
{ bg: '#ffffff', elements: [
  { type: 'image', slot: 'mascots', x: 108, y: 186, w: 864, h: 1548 },
  { type: 'lockup', y: 640 },
  { type: 'text', text: 'agentlaring\nuxlamaydi', font: 'play', size: 150, y: 740, color: '#2a1a14' },
  { type: 'chip', text: 'yangi darslik · 12 daqiqa', bg: '#2a1a14', color: '#ffffff', radius: 14, y: 1040, flat: true } ] }
```

## M · Colour Wash + Chips · sample `85:2262`
Lists, "N ta model / N ta usul", overviews. Vector only (no AI image needed): corner wash + floating tags + cursor.
```js
{ bg: '#fbfbfc', elements: [
  { type: 'wash', color: '#c9f24a', core: '#e7ff6e' },
  { type: 'lockup', y: 820 },
  { type: 'text', text: '12 model\nbitta joyda', font: 'play', size: 140, y: 900, color: '#16161a' },
  { type: 'chip', text: 'VEO 3.1', color: '#55565e', x: 150, y: 560 },
  { type: 'chip', text: 'KLING 3.0', bg: '#16161a', color: '#c9f24a', x: 640, y: 640 },
  { type: 'chip', text: 'GPT IMAGE 2.5', color: '#55565e', x: 300, y: 700 },
  { type: 'chip', text: 'SOUL 2', bg: '#16161a', color: '#c9f24a', x: 760, y: 1220 },
  { type: 'chip', text: 'NANO BANANA 2', color: '#55565e', x: 90, y: 1300 },
  { type: 'chip', text: 'SEEDANCE 2.5', color: '#55565e', x: 600, y: 1380 },
  { type: 'cursor', x: 800, y: 700, label: 'haysam' } ] }
```
