// HAYSAM COVER KIT · paste this whole file into one use_figma call, then call
//   return await buildCover(SPEC)        (single cover: 9:16 master + 4:5 crop)
//   return await buildCarousel(SPEC)     (carousel: N slides, 4:5 only)
//   return await fromTemplate(SPEC)      (preferred: a real cover from the COVER SYSTEM page, content swapped)
// at the bottom. SPEC format: references/spec.md. Needs the HAYSAM KIT page
// (scripts/setup-kit.js) in the same file for brand + tool logos.

const W = 1080, H = 1920, SAFE_TOP = 285, SAFE_H = 1350, SLIDE_H = 1350;

const hexRGB = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 }; };
const solid = (hex, opacity = 1) => ({ type: 'SOLID', color: hexRGB(hex), opacity });
// vertical gradient top→bottom; stops: ['#a', '#b'] or [[0,'#a',1],[1,'#b',0]]
const vgrad = (stops, angle = 'down') => {
  const n = stops.length;
  const gs = stops.map((s, i) => Array.isArray(s)
    ? { position: s[0], color: { ...hexRGB(s[1]), a: s[2] ?? 1 } }
    : { position: n === 1 ? 0 : i / (n - 1), color: { ...hexRGB(s), a: 1 } });
  const T = { down: [[0, 1, 0], [-1, 0, 1]], up: [[0, -1, 1], [1, 0, 0]], right: [[1, 0, 0], [0, 1, 0]], diag: [[0.7, 0.7, 0], [-0.7, 0.7, 0.5]] }[angle];
  return { type: 'GRADIENT_LINEAR', gradientTransform: T, gradientStops: gs };
};
const paint = p => p === 'inkMetal' ? vgrad(INK_METAL) : typeof p === 'string' ? solid(p) : Array.isArray(p) ? vgrad(p) : p.stops ? vgrad(p.stops, p.angle) : solid(p.color, p.opacity);
const shadow = (hex, a, y, r, spread = 0, x = 0) => ({ type: 'DROP_SHADOW', color: { ...hexRGB(hex), a }, offset: { x, y }, radius: r, spread, visible: true, blendMode: 'NORMAL' });
const inner = (hex, a, y, r) => ({ type: 'INNER_SHADOW', color: { ...hexRGB(hex), a }, offset: { x: 0, y }, radius: r, spread: 0, visible: true, blendMode: 'NORMAL' });
const SHEEN = inner('#ffffff', 0.45, 3, 2);           // thin top sheen for gradient lettering
const INK_METAL = ['#270601', [0.65, '#58160c', 1], [1, '#a0301a', 1]];

// ---------- fonts ----------
const FONTS = {
  brand: ['JetBrains Mono', 'Bold'], brandMedium: ['JetBrains Mono', 'Medium'],
  news: ['Anton', 'Regular'], future: ['Unbounded', 'Black'], loud: ['Archivo Black', 'Regular'],
  cinema: ['Big Shoulders Display', 'Black'], premium: ['Instrument Serif', 'Regular'],
  play: ['Bricolage Grotesque', 'ExtraBold'], ui: ['Inter', 'Semi Bold'], uiBold: ['Inter', 'Bold'], uiMedium: ['Inter', 'Medium'],
};
const loaded = new Set();
async function font(f) {
  let [family, style] = Array.isArray(f) ? f : (FONTS[f] || [f, 'Regular']);
  const key = family + '|' + style;
  if (!loaded.has(key)) {
    try { await figma.loadFontAsync({ family, style }); }
    catch (e) { family = 'Inter'; style = 'Bold'; await figma.loadFontAsync({ family, style }); }
    loaded.add(family + '|' + style);
  }
  return { family, style };
}

// ---------- kit lookups ----------
let KIT = null;
async function kit() {
  if (KIT) return KIT;
  const page = figma.root.children.find(p => p.name === 'HAYSAM KIT');
  if (!page) throw new Error('HAYSAM KIT page missing: run scripts/setup-kit.js first');
  await page.loadAsync();
  KIT = page;
  return page;
}
async function brandComp(color = 'Ink') {
  const set = (await kit()).findOne(n => n.type === 'COMPONENT_SET' && n.name === 'Brand / HAYSAM');
  const c = set && set.children.find(v => v.name === 'Color=' + color);
  if (!c) throw new Error('Brand variant missing: ' + color);
  return c;
}
async function toolComp(name) {
  const want = ['tool / ' + name, 'tool / ' + name + ' · icon'].map(s => s.toLowerCase());
  let c = null;
  for (const pn of ['HAYSAM KIT', 'COVER SYSTEM']) {
    const pg = figma.root.children.find(p => p.name === pn); if (!pg) continue;
    await pg.loadAsync();
    c = pg.findOne(n => n.type === 'COMPONENT' && want.includes(n.name.toLowerCase())); if (c) break;
  }
  if (!c) throw new Error('Tool logo missing on HAYSAM KIT: ' + name + ' (add it with setup-kit addTool)');
  return c;
}

// ---------- primitives ----------
function place(node, parent, o) {
  parent.appendChild(node);
  if (o.rotation) node.rotation = o.rotation;
  // x omitted → horizontally centred on the 1080 canvas; auto-layout parents position children themselves
  if (!('layoutMode' in parent) || parent.layoutMode === 'NONE') {
    node.x = (o.center ?? o.x == null) ? Math.round((W - node.width) / 2) + (o.dx || 0) : o.x;
    node.y = o.y ?? 0;
  }
  if (o.name) node.name = o.name;
  if (o.opacity != null) node.opacity = o.opacity;
  return node;
}

async function text(parent, o) {
  const t = figma.createText();
  t.fontName = await font(o.font || 'news');
  t.characters = o.text;
  t.fontSize = o.size || 120;
  t.textAlignHorizontal = (o.align || 'CENTER').toUpperCase();
  if (o.ls != null) t.letterSpacing = { unit: 'PERCENT', value: o.ls };
  t.lineHeight = o.lh != null ? { unit: 'PERCENT', value: o.lh } : { unit: 'PERCENT', value: 92 };
  if (o.upper) t.textCase = 'UPPER';
  if (o.w) { t.textAutoResize = 'HEIGHT'; t.resize(o.w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.fills = [paint(o.color || '#270601')];
  const fx = [];
  if (o.sheen) fx.push(SHEEN);
  if (o.shadow) fx.push(shadow(o.shadow.color || '#000000', o.shadow.a ?? 0.35, o.shadow.y ?? 12, o.shadow.r ?? 40));
  if (o.progressiveBlur) fx.push({ type: 'LAYER_BLUR', blurType: 'PROGRESSIVE', radius: 0, startRadius: o.progressiveBlur, startOffset: { x: 0.5, y: 1 }, endOffset: { x: 0.5, y: 0.35 }, visible: true });
  if (o.outline) { t.fills = []; t.strokes = [paint(o.outline)]; t.strokeWeight = o.outlineWidth || 3; t.strokeAlign = 'OUTSIDE'; }
  try { if (fx.length) t.effects = fx; } catch (e) { t.effects = fx.filter(f => f.blurType !== 'PROGRESSIVE'); }
  if (o.name == null) o.name = o.text.slice(0, 40);
  return place(t, parent, o);
}

function rect(parent, o) {
  const r = figma.createRectangle();
  r.resize(o.w, o.h);
  r.fills = o.fill ? [paint(o.fill)] : [];
  if (o.radius) r.cornerRadius = o.radius;
  if (o.stroke) { r.strokes = [paint(o.stroke)]; r.strokeWeight = o.strokeWidth || 2; r.strokeAlign = 'INSIDE'; }
  if (o.effects) r.effects = o.effects;
  return place(r, parent, o);
}

// image slot: grey placeholder the AI image is uploaded into (upload_assets nodeIds)
function image(parent, o) {
  const r = rect(parent, { ...o, fill: o.placeholder || '#d7dbe8', name: o.name || 'IMAGE · ' + (o.slot || 'hero') });
  if (o.shadow) r.effects = [shadow('#270601', 0.18, 24, 40)];
  if (o.ellipseFade) {                                   // soft round edge: mask group with radial fade
    const g = figma.createEllipse(); g.resize(o.w, o.h); g.x = r.x; g.y = r.y;
    g.fills = [{ type: 'GRADIENT_RADIAL', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [{ position: 0.62, color: { r: 0, g: 0, b: 0, a: 1 } }, { position: 1, color: { r: 0, g: 0, b: 0, a: 0 } }] }];
    parent.insertChild(parent.children.indexOf(r), g); g.isMask = true;   // mask sits below the image
    const grp = figma.group([g, r], parent); grp.name = (o.name || 'AI · object') + ' · faded';
  }
  return r;
}

function fade(parent, o) {                             // bg-coloured fade over a photo
  const c = o.color || '#ffffff';
  const stops = o.dir === 'up' ? [[0, c, 0], [0.55, c, 0.85], [1, c, 1]] : [[0, c, 1], [0.45, c, 0.85], [1, c, 0]];
  return rect(parent, { x: 0, y: o.y, w: o.w || W, h: o.h, fill: { stops }, name: o.name || 'fade / ' + (o.dir || 'down') });
}

function ellipse(parent, o) {
  const e = figma.createEllipse(); e.resize(o.w, o.h);
  e.fills = [paint(o.fill)];
  if (o.blur) e.effects = [{ type: 'LAYER_BLUR', radius: o.blur, visible: true }];
  return place(e, parent, o);
}

// colour wash (layout M): 3 blurred ellipses, any hue
function wash(parent, o) {
  const c = o.color || '#c9f24a', core = o.core || c;
  ellipse(parent, { x: 560, y: -260, w: 820, h: 820, fill: { color: c, opacity: 0.9 }, blur: 220, name: 'wash · main' });
  ellipse(parent, { x: 760, y: -120, w: 360, h: 420, fill: core, blur: 120, name: 'wash · core' });
  ellipse(parent, { x: -360, y: 1500, w: 720, h: 620, fill: { color: c, opacity: 0.45 }, blur: 260, name: 'wash · echo' });
}

// comet glow (Haysam DNA): crisp progressive-blur head, soft tail. Aim the head at the hero.
function glow(parent, o) {
  const tone = { warm: ['#df3909', '#fee252'], sky: ['#1b7bff', '#9ee8ff'] }[o.tone || 'warm'] || o.colors;
  const els = [];
  const mk = (name, x, y, w, h, rot, hex, fx) => { const e = figma.createEllipse(); e.resize(w, h); e.rotation = rot; e.x = x; e.y = y; e.fills = [solid(hex)]; e.effects = [fx]; e.name = name; parent.appendChild(e); els.push(e); };
  mk('halo (trail)', 76, 1277, 1140, 2075, 93.84, tone[0], { type: 'LAYER_BLUR', radius: 477, visible: true });
  mk('soft body', 780, 1051, 751, 1216, 90.4, tone[1], { type: 'LAYER_BLUR', radius: 206, visible: true });
  mk('core (head)', 1402, 912, 456, 668, 90.4, tone[1], { type: 'LAYER_BLUR', blurType: 'PROGRESSIVE', radius: 0, startRadius: 100, startOffset: { x: 0.5, y: 0 }, endOffset: { x: 0.5, y: 1 }, visible: true });
  const g = figma.group(els, parent); g.name = 'glow · comet → hero';
  g.rescale((o.w || 1500) / g.width);
  if (o.rotation) g.rotation = o.rotation;
  g.x = o.x ?? -860; g.y = o.y ?? 1000;
  return g;
}

// background patterns
function pattern(parent, kind, color, opacity = 1) {
  const g = []; const add = n => { parent.appendChild(n); g.push(n); };
  if (kind === 'dots') { for (let y = 18; y < H; y += 36) for (let x = 18; x < W; x += 36) { const d = figma.createEllipse(); d.resize(5, 5); d.x = x; d.y = y; d.fills = [solid(color || '#c7cceb')]; add(d); } }
  if (kind === 'lines') { for (let y = 60; y < H; y += 60) { const l = figma.createRectangle(); l.resize(W, 2); l.y = y; l.fills = [solid(color || '#dfe3f5')]; add(l); } }
  if (kind === 'grid') { for (let x = 40; x < W; x += 60) { const l = figma.createRectangle(); l.resize(2, H); l.x = x; l.fills = [solid(color || '#e2e5f7')]; add(l); } for (let y = 20; y < H; y += 60) { const l = figma.createRectangle(); l.resize(W, 2); l.y = y; l.fills = [solid(color || '#e2e5f7')]; add(l); } }
  if (kind === 'tiles') { let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let y = 722; y < H; y += 72) for (let x = 2; x < W; x += 72) { if (rnd() < 0.3) continue; const k = (y - 722) / (H - 722);
      const t = figma.createRectangle(); t.resize(68, 68); t.cornerRadius = 4; t.x = x; t.y = y; t.fills = [solid(rnd() < 0.5 ? '#ffffff' : (color || '#cdd3f2'), Math.min(1, 0.05 + k * 0.75 * (0.4 + rnd())))]; add(t); } }
  if (!g.length) return null;
  const grp = kind === 'tiles' ? figma.group(g, parent) : figma.flatten(g, parent); grp.name = 'bg · ' + kind; grp.opacity = opacity;
  try { grp.locked = true; } catch (e) {}
  return grp;
}

// pill chip / tag; dot:'#hex' adds a status dot
async function chip(parent, o) {
  const f = figma.createAutoLayout('HORIZONTAL');
  f.name = o.name || 'chip';
  f.itemSpacing = 12; f.counterAxisAlignItems = 'CENTER';
  f.paddingLeft = f.paddingRight = o.padX || 30; f.paddingTop = f.paddingBottom = o.padY || 14;
  f.cornerRadius = o.radius ?? 999;
  f.fills = [paint(o.bg || '#ffffff')];
  if (o.stroke) { f.strokes = [solid(o.stroke)]; f.strokeWeight = 2; f.strokeAlign = 'INSIDE'; }
  if (o.shadow !== false && !o.flat) f.effects = [shadow('#333366', 0.08, 8, 24)];
  if (o.dot) { const d = figma.createEllipse(); d.resize(14, 14); d.fills = [solid(o.dot)]; f.appendChild(d); }
  if (o.icon) { const i = (await toolComp(o.icon)).createInstance(); i.rescale((o.iconSize || 40) / i.height); f.appendChild(i); }
  const t = figma.createText(); t.fontName = await font(o.font || 'ui'); t.characters = o.text; t.fontSize = o.size || 34; t.fills = [paint(o.color || '#270601')];
  if (o.upper) t.textCase = 'UPPER';
  f.appendChild(t);
  return place(f, parent, o);
}

async function chipsRow(parent, o) {
  const row = figma.createAutoLayout('HORIZONTAL'); row.name = 'row · chips'; row.itemSpacing = o.gap || 16; row.fills = [];
  parent.appendChild(row);
  for (const c of o.items) await chip(row, typeof c === 'string' ? { ...o.chip, text: c } : { ...o.chip, ...c });
  return place(row, parent, o);
}

async function sticker(parent, o) {
  const s = await chip(parent, { text: o.text, bg: o.bg || '#fee252', color: o.color || '#58160c', font: 'brand', size: o.size || 40, radius: 12, padY: 16, flat: true, ...o });
  s.rotation = o.rotation ?? -4; s.name = 'STICKER';
  return s;
}

// RESET-style pop button: same-hue rim + glow, no dark outline. No lime: it reads as Higgsfield
const POP = { yellow: ['#fff3a8', '#fee252', '#f5b01f', '#58160c'], sky: ['#b8f4ff', '#5fe0ff', '#1b9cff', '#06203f'],
  ember: ['#ffb38f', '#ff6a2b', '#df3909', '#ffffff'],
  violet: ['#e4d4ff', '#a873ff', '#6b2ee6', '#ffffff'], pink: ['#ffd1ea', '#ff7ac2', '#e0338f', '#ffffff'] };
async function pop(parent, o) {
  const [a, b, c, ink] = POP[o.tone] || POP.yellow;
  const f = figma.createAutoLayout('HORIZONTAL'); f.name = 'CTA · pop';
  f.paddingLeft = f.paddingRight = 72; f.paddingTop = 40; f.paddingBottom = 44; f.counterAxisAlignItems = 'CENTER'; f.itemSpacing = 20;
  f.cornerRadius = 44; f.fills = [vgrad([[0, a, 1], [0.55, b, 1], [1, c, 1]])];
  f.strokes = [solid(c, 0.55)]; f.strokeWeight = 3; f.strokeAlign = 'INSIDE';
  f.effects = [inner('#ffffff', 0.75, 5, 3), inner(c, 0.6, -8, 10), shadow(b, 0.55, 0, 60, 6)];
  const t = figma.createText(); t.fontName = await font('loud'); t.characters = o.text; t.fontSize = o.size || 76; t.letterSpacing = { unit: 'PERCENT', value: -2 }; t.fills = [solid(o.color || ink)];
  f.appendChild(t);
  return place(f, parent, o);
}

// big 3D keycap button (layout E)
const BIG = { sunrise: ['#fff1a6', '#fee252', '#f5b01f', '#b5520a', '#58160c'], sky: ['#d6f6ff', '#9ee8ff', '#2cd3f3', '#1b5fbf', '#06203f'], ink: ['#7a2a1c', '#58160c', '#3a0d06', '#1a0402', '#fee252'] };
async function bigButton(parent, o) {
  const [a, b, c, edge, ink] = BIG[o.tone || 'sunrise'];
  const f = figma.createAutoLayout('HORIZONTAL'); f.name = 'UI / Big Button · 3D';
  f.paddingLeft = f.paddingRight = 80; f.paddingTop = 48; f.paddingBottom = 52; f.itemSpacing = 24; f.counterAxisAlignItems = 'CENTER';
  f.cornerRadius = 36; f.fills = [vgrad([[0, a, 1], [0.55, b, 1], [1, c, 1]])];
  f.effects = [inner('#ffffff', 0.5, 4, 2), shadow(edge, 1, 16, 0), shadow(edge, 0.3, 36, 50)];
  const t = figma.createText(); t.fontName = await font('brandMedium'); t.characters = o.text; t.fontSize = o.size || 72; t.fills = [solid(ink)];
  f.appendChild(t);
  if (o.arrow !== false) { const ar = figma.createText(); ar.fontName = await font('loud'); ar.characters = '→'; ar.fontSize = o.size || 72; ar.fills = [solid(ink)]; f.appendChild(ar); }
  return place(f, parent, o);
}

// liquid-glass CTA (offer covers use tone:'offer')
async function glassButton(parent, o) {
  const f = figma.createAutoLayout('HORIZONTAL'); f.name = 'CTA · glass';
  f.paddingLeft = f.paddingRight = 52; f.paddingTop = 26; f.paddingBottom = 28; f.itemSpacing = 16; f.counterAxisAlignItems = 'CENTER'; f.cornerRadius = 999;
  f.fills = o.tone === 'offer' ? [vgrad(['#9ee8ff', '#2cd3f3', '#1b7bff'], 'right')] : [solid('#ffffff', 0.16)];
  f.strokes = [vgrad([[0, '#ffffff', 0.9], [0.5, '#ffffff', 0.1], [1, '#ffffff', 0.6]], 'diag')]; f.strokeWeight = 2.5; f.strokeAlign = 'INSIDE';
  const sh = shadow('#270601', 0.25, 18, 40);
  try { f.effects = [{ type: 'GLASS', radius: 6, lightIntensity: 0.75, lightAngle: -45, refraction: 0.7, depth: 24, dispersion: 0.35, visible: true }, sh]; } catch (e) { f.effects = [sh]; }
  for (const s of [o.text, '→']) { const t = figma.createText(); t.fontName = await font('ui'); t.characters = s; t.fontSize = o.size || 40; t.fills = [solid(o.color || '#ffffff')]; f.appendChild(t); }
  return place(f, parent, o);
}

// Figma-style multiplayer cursor
async function cursor(parent, o) {
  const c = o.color || '#df3909';
  const g = figma.createFrame(); g.name = 'cursor · ' + (o.label || 'haysam'); g.fills = []; g.clipsContent = false; g.resize(260, 120);
  const arrow = figma.createNodeFromSvg(`<svg width="44" height="48" viewBox="0 0 44 48" xmlns="http://www.w3.org/2000/svg"><path d="M5 4 L5 41 L14.5 32 L21 45 L27.5 42 L21 29.5 L34 29.5 Z" fill="${c}" stroke="white" stroke-width="3" stroke-linejoin="round"/></svg>`);
  arrow.name = 'arrow'; g.appendChild(arrow);
  const tag = figma.createAutoLayout('HORIZONTAL'); tag.paddingLeft = tag.paddingRight = 18; tag.paddingTop = 8; tag.paddingBottom = 10; tag.fills = [solid(c)]; tag.cornerRadius = 8;
  const t = figma.createText(); t.fontName = await font('uiMedium'); t.characters = o.label || 'haysam'; t.fontSize = 26; t.fills = [solid(o.textColor || '#ffffff')]; tag.appendChild(t);
  g.appendChild(tag); tag.x = 34; tag.y = 44;
  return place(g, parent, o);
}

// Figma selection box around a text (layout B / D)
async function selection(parent, o) {
  const f = figma.createAutoLayout('VERTICAL'); f.name = 'SELECTED · ' + (o.name || 'headline');
  f.paddingLeft = f.paddingRight = 28; f.paddingTop = 6; f.paddingBottom = 10; f.counterAxisAlignItems = 'CENTER'; f.fills = []; f.clipsContent = false;
  f.strokes = [solid(o.stroke || '#0d99ff')]; f.strokeWeight = 3; f.strokeAlign = 'INSIDE';
  parent.appendChild(f);
  await text(f, { ...o.text, x: undefined, y: undefined, center: false });
  for (const [hx, hy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    const h = figma.createRectangle(); h.resize(18, 18); h.fills = [solid('#ffffff')]; h.strokes = [solid(o.stroke || '#0d99ff')]; h.strokeWeight = 3;
    f.appendChild(h); h.layoutPositioning = 'ABSOLUTE'; h.x = hx * f.width - 9; h.y = hy * f.height - 9; h.name = 'handle';
  }
  if (o.cursor) { const cu = await cursor(f, { ...o.cursor }); cu.layoutPositioning = 'ABSOLUTE'; cu.x = -14; cu.y = f.height - 12; }
  return place(f, parent, o);
}

// brand only, or brand × tool lockup (centred). brand: Ink | Yellow+Ink | Yellow+White | White
async function lockup(parent, o) {
  const row = figma.createAutoLayout('HORIZONTAL'); row.name = 'partner lockup'; row.itemSpacing = 22; row.counterAxisAlignItems = 'CENTER'; row.fills = [];
  parent.appendChild(row);
  const b = (await brandComp(o.brand || 'Ink')).createInstance(); b.rescale((o.brandH || 52) / b.height); row.appendChild(b);
  const ink = o.color || (/(White)$/.test(o.brand || '') ? '#ffffff' : '#58160c');
  if (o.tool) {
    const x = figma.createText(); x.fontName = await font('ui'); x.characters = '×'; x.fontSize = 40; x.fills = [solid(ink)]; row.appendChild(x);
    const ic = (await toolComp(o.tool)).createInstance(); ic.rescale((o.iconH || 60) / ic.height); row.appendChild(ic);
    if (o.toolName !== false) { const n = figma.createText(); n.fontName = await font('ui'); n.characters = o.toolName || o.tool; n.fontSize = 42; n.fills = [solid(ink)]; row.appendChild(n); }
  }
  return place(row, parent, { y: 330, ...o });
}

async function toolIcon(parent, o) {
  const i = (await toolComp(o.tool)).createInstance(); i.rescale((o.size || 300) / Math.max(i.width, i.height));
  if (o.shadow) i.effects = [shadow('#000000', 0.35, 20, 60)];
  return place(i, parent, { ...o, name: 'TOOL LOGO · ' + o.tool });
}

const BUILDERS = { text, rect, image, fade, ellipse, wash, glow, chip, chips: chipsRow, sticker, pop, bigButton, glassButton, cursor, selection, lockup, toolIcon,
  pattern: (p, o) => pattern(p, o.kind, o.color, o.opacity) };

// ---------- main ----------
async function buildCover(spec) {
  let page = figma.root.children.find(p => p.name === (spec.page || 'Haysam Covers'));
  if (!page) { page = figma.createPage(); page.name = spec.page || 'Haysam Covers'; }
  await figma.setCurrentPageAsync(page);
  let maxX = -200; for (const n of page.children) maxX = Math.max(maxX, n.x + n.width);
  const X = maxX + 200;

  const cover = figma.createComponent(); cover.name = 'Cover / ' + (spec.name || 'untitled') + ' · 9:16';
  cover.resize(W, H); cover.x = X; cover.y = 0; cover.clipsContent = true;
  cover.fills = [paint(spec.bg || '#f6f7ff')];
  page.appendChild(cover);
  if (spec.pattern) pattern(cover, spec.pattern.kind || spec.pattern, spec.pattern.color, spec.pattern.opacity ?? 1);

  const ids = { cover: cover.id, images: {} };
  for (const el of spec.elements || []) {
    const fn = BUILDERS[el.type]; if (!fn) throw new Error('Unknown element type: ' + el.type);
    const n = await fn(cover, el);
    if (el.type === 'image') ids.images[el.slot || 'hero'] = n.id;
  }

  // 4:5 feed version: instance of the 9:16 master, cropped to the safe band
  const crop = figma.createFrame(); crop.name = 'Cover / ' + (spec.name || 'untitled') + ' · 4:5';
  crop.resize(W, SAFE_H); crop.clipsContent = true; crop.x = X + W + 80; crop.y = SAFE_TOP; crop.fills = [];
  page.appendChild(crop);
  const inst = cover.createInstance(); crop.appendChild(inst); inst.x = 0; inst.y = -SAFE_TOP;
  ids.crop = crop.id;

  // safety report: anything key that leaves the 4:5 band
  const out = cover.children.filter(n => !/^(bg|glow|fade|wash|IMAGE|AI)/.test(n.name) && (n.y < SAFE_TOP || n.y + n.height > SAFE_TOP + SAFE_H)).map(n => n.name);
  if (spec.log) ids.log = await logCover(spec);
  figma.viewport.scrollAndZoomIntoView([cover, crop]);
  return { ...ids, outsideSafeBand: out };
}

// image covers: the picture sets the colours. Brand stays only in the logo lockup, tool logo and font;
// buttons (UI / … instances) keep their own colours.
function applyPalette(root, p) {
  const lum = h => { const c = hexRGB(h); return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b; };
  const inInstance = n => { for (let a = n.parent; a && a !== root; a = a.parent) if (a.type === 'INSTANCE') return true; return false; };
  const isChip = n => (n.type === 'FRAME') && /^(STICKER|Frame|chip)/.test(n.name) && n.findOne(c => c.type === 'TEXT')
    && Array.isArray(n.fills) && n.fills.some(f => f.type === 'SOLID' && f.visible !== false);
  if (p.bg) root.fills = [solid(p.bg)];
  for (const n of root.findAll(() => true)) {
    if (inInstance(n)) continue;
    if (/^glow/.test(n.name)) { n.visible = false; continue; }                       // brand comet: off on image covers
    if (/^fade/.test(n.name) && p.bg && Array.isArray(n.fills) && n.fills[0]?.gradientStops) {
      const c = hexRGB(p.bg);
      n.fills = n.fills.map(f => ({ ...f, gradientStops: f.gradientStops.map(st => ({ ...st, color: { ...c, a: st.color.a } })) }));
      continue;
    }
    if (isChip(n) && p.accent) { n.fills = [solid(p.accent)]; for (const t of n.findAll(c => c.type === 'TEXT')) t.fills = [solid(p.onAccent || (lum(p.accent) > 0.6 ? '#111111' : '#ffffff'))]; continue; }
    if (n.type === 'TEXT' && p.ink && !(n.parent && isChip(n.parent))) n.fills = [solid(p.ink)];
  }
  const brand = p.brand || (p.ink && lum(p.ink) > 0.5 ? 'White' : 'Ink');
  for (const b of root.findAll(n => n.type === 'INSTANCE' && n.mainComponent?.parent?.name === 'Brand / HAYSAM')) b.setProperties({ Color: brand });
}

// template mode: the cover is a copy of a COVER SYSTEM component (the team's own design), only content changes.
// spec: { template: 'Tool Hero', name, texts: { layerName: 'new text' }, tool: 'Claude', brand: 'Ink',
//         variants: { layerName: { Prop: 'Value' } }, hide: [layerName],
//         palette: { bg, ink, accent, onAccent }  ← image covers: colours come from the picture, not the brand
//         log }
async function fromTemplate(spec) {
  const sys = figma.root.children.find(p => p.name === 'COVER SYSTEM');
  if (!sys) throw new Error('COVER SYSTEM page missing: this file is not a copy of the Haysam Cover template');
  await sys.loadAsync();
  const key = spec.template.toLowerCase();
  const tpl = sys.findOne(n => n.type === 'COMPONENT' && n.name.toLowerCase() === 'cover / ' + key + ' · 9:16')
    || sys.findOne(n => n.type === 'COMPONENT' && n.name.startsWith('Cover / ') && n.name.toLowerCase().includes(key));
  if (!tpl) throw new Error('Template not found: ' + spec.template);

  let page = figma.root.children.find(p => p.name === (spec.page || 'Haysam Covers'));
  if (!page) { page = figma.createPage(); page.name = spec.page || 'Haysam Covers'; }
  await figma.setCurrentPageAsync(page);
  let maxX = -200; for (const n of page.children) maxX = Math.max(maxX, n.x + n.width);
  const X = maxX + 200;

  // wrapper component holds the design, so the 4:5 crop (an instance of the wrapper) follows every edit
  const cover = figma.createComponent(); cover.name = 'Cover / ' + (spec.name || spec.template) + ' · 9:16';
  page.appendChild(cover); cover.resize(W, H); cover.x = X; cover.y = 0; cover.clipsContent = true; cover.fills = [];
  // detached copy: pixel-identical to the template, but nested logos/images can be resized and replaced
  const tmp = tpl.createInstance(); cover.appendChild(tmp); tmp.x = 0; tmp.y = 0;
  const inst = tmp.detachInstance(); inst.name = 'design · ' + tpl.name.replace('Cover / ', '');

  const byName = name => inst.findOne(n => n.name === name) || inst.findOne(n => n.type === 'TEXT' && n.characters === name);
  const missing = [];
  for (const [k, v] of Object.entries(spec.texts || {})) {
    const t = byName(k);
    if (!t || t.type !== 'TEXT') { missing.push(k); continue; }
    for (const f of t.getRangeAllFontNames(0, t.characters.length)) await figma.loadFontAsync(f);
    t.characters = v;
  }
  if (spec.tool) {
    const comp = await toolComp(spec.tool);
    for (const i of inst.findAll(n => n.type === 'INSTANCE' && /^Tool \//.test(n.mainComponent?.name || ''))) {
      const { x, y, width: w, height: h } = i;
      i.swapComponent(comp);
      const k = Math.min(w / i.width, h / i.height); i.rescale(k);           // fit the old box, keep aspect
      i.x = x + (w - i.width) / 2; i.y = y + (h - i.height) / 2;
    }
  }
  if (spec.brand) for (const b of inst.findAll(n => n.type === 'INSTANCE' && n.mainComponent?.parent?.name === 'Brand / HAYSAM')) b.setProperties({ Color: spec.brand });
  for (const [k, props] of Object.entries(spec.variants || {})) { const n = byName(k); if (n && n.type === 'INSTANCE') n.setProperties(props); else missing.push(k); }
  for (const k of spec.hide || []) { const n = byName(k); if (n) n.visible = false; else missing.push(k); }

  if (spec.palette) applyPalette(inst, spec.palette);

  const images = {};
  for (const n of inst.findAll(n => 'fills' in n && Array.isArray(n.fills) && n.fills.some(f => f.type === 'IMAGE'))) images[n.name] = n.id;

  const crop = figma.createFrame(); crop.name = 'Cover / ' + (spec.name || spec.template) + ' · 4:5';
  page.appendChild(crop); crop.resize(W, SAFE_H); crop.clipsContent = true; crop.x = X + W + 80; crop.y = SAFE_TOP; crop.fills = [];
  const ci = cover.createInstance(); crop.appendChild(ci); ci.x = 0; ci.y = -SAFE_TOP;

  const log = spec.log ? await logCover({ ...spec, log: { ...spec.log, layout: spec.log.layout || spec.template } }) : undefined;
  figma.viewport.scrollAndZoomIntoView([cover, crop]);
  return { cover: cover.id, crop: crop.id, template: tpl.name, images, missing, log };
}

// carousel: every slide is a 1080×1350 frame (4:5 only, element y is 0–1350),
// laid out left to right inside one section; a page counter sits at the bottom
async function buildCarousel(spec) {
  let page = figma.root.children.find(p => p.name === (spec.page || 'Haysam Covers'));
  if (!page) { page = figma.createPage(); page.name = spec.page || 'Haysam Covers'; }
  await figma.setCurrentPageAsync(page);
  let maxX = -200; for (const n of page.children) maxX = Math.max(maxX, n.x + n.width);
  const slides = spec.slides || [], n = slides.length, GAP = 40, PAD = 80;
  if (!n) throw new Error('Carousel needs at least one slide');

  const sec = figma.createSection(); sec.name = 'Carousel / ' + (spec.name || 'untitled') + ' · ' + n + ' × 4:5';
  page.appendChild(sec); sec.x = maxX + 200; sec.y = 0;
  sec.resizeWithoutConstraints(PAD * 2 + n * W + (n - 1) * GAP, PAD * 2 + SLIDE_H);

  const ids = { section: sec.id, slides: [], images: {} };
  const pad2 = i => String(i).padStart(2, '0');
  for (let i = 0; i < n; i++) {
    const s = slides[i];
    const f = figma.createFrame(); f.name = (spec.name || 'Carousel') + ' · ' + pad2(i + 1) + '/' + pad2(n);
    sec.appendChild(f); f.resize(W, SLIDE_H); f.x = PAD + i * (W + GAP); f.y = PAD; f.clipsContent = true;
    f.fills = [paint(s.bg || spec.bg || '#f6f7ff')];
    const pat = s.pattern ?? spec.pattern;
    if (pat) pattern(f, pat.kind || pat, pat.color, pat.opacity ?? 1);
    for (const el of s.elements || []) {
      const fn = BUILDERS[el.type]; if (!fn) throw new Error('Unknown element type: ' + el.type);
      const node = await fn(f, el);
      if (el.type === 'image') ids.images[(i + 1) + ':' + (el.slot || 'hero')] = node.id;
    }
    const pager = s.pager ?? spec.pager ?? 'count';
    if (pager === 'count') {
      const bg = s.bg || spec.bg || '#f6f7ff', c = typeof bg === 'string' && bg !== 'inkMetal' ? hexRGB(bg) : { r: 0, g: 0, b: 0 };
      const dark = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b < 0.45;   // light counter on dark slides
      await text(f, { text: pad2(i + 1) + ' / ' + pad2(n), font: 'brandMedium', size: 28, ls: 4, lh: 100, y: SLIDE_H - 96,
        color: { color: s.pagerColor || (dark ? '#ffffff' : spec.pagerColor || '#58160c'), opacity: 0.7 }, name: 'pager' });
    }
    ids.slides.push(f.id);
  }
  if (spec.log) ids.log = await logCover({ ...spec, log: { ...spec.log, layout: 'carousel ' + n + ' · ' + (spec.log.layout || '') } });
  figma.viewport.scrollAndZoomIntoView([sec]);
  return ids;
}

// COVER LOG lives in the file itself (HAYSAM KIT page) so the rotation rule
// survives across chats: read it with readLog() before choosing the next cover.
async function logNode() {
  let k = figma.root.children.find(p => p.name === 'HAYSAM KIT');
  if (!k) k = figma.root.children.find(p => p.name === 'Haysam Covers');
  if (!k) { k = figma.createPage(); k.name = 'Haysam Covers'; }
  await k.loadAsync();
  let t = k.findOne(n => n.type === 'TEXT' && n.name === 'COVER LOG');
  if (!t) {
    await font(['Inter', 'Regular']);
    t = figma.createText(); t.name = 'COVER LOG'; t.fontName = { family: 'Inter', style: 'Regular' }; t.fontSize = 18;
    t.characters = 'date | cover | layout | background | mood font | accent | idea'; k.appendChild(t); t.x = 0; t.y = 480;
  }
  return t;
}
async function logCover(spec) {
  const t = await logNode(); await font(['Inter', 'Regular']);
  const l = spec.log;
  const row = [new Date().toISOString().slice(0, 10), spec.name, l.layout, l.bg, l.font, l.accent, l.idea || ''].join(' | ');
  t.characters = t.characters + '\n' + row;
  return row;
}
async function readLog(n = 3) {
  const t = await logNode();
  return t.characters.split('\n').slice(1).slice(-n);
}
