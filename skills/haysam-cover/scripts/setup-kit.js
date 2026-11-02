// HAYSAM KIT SETUP · once per Figma file. Three steps (details: references/figma-build.md):
//  1. use_figma: run PART A → returns the HAYSAM KIT page id
//  2. upload_assets(count=N, currentPageId=<kit page>) and curl-POST each SVG from
//     assets/logos/ (Content-Type: image/svg+xml). Each result gives placedOnNodeId.
//  3. use_figma: run PART B with PLACED filled in → components on the kit page.
// No shell (claude.ai)? Skip step 2 and put the SVG text into INLINE in PART B.

// ===== PART A =====
// let page = figma.root.children.find(p => p.name === 'HAYSAM KIT');
// if (!page) { page = figma.createPage(); page.name = 'HAYSAM KIT'; }
// await page.loadAsync();
// return { kitPage: page.id, existing: page.findAll(n => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET').map(n => n.name) };

// ===== PART B =====
// key = 'haysam' for the Yellow+White logo, otherwise the tool's display name
const PLACED = { /* 'haysam': '12:34', 'Claude': '12:40', 'Google Veo': '12:44' */ };
const INLINE = { /* 'Claude': '<svg …>' */ };

const page = figma.root.children.find(p => p.name === 'HAYSAM KIT');
await figma.setCurrentPageAsync(page);
const made = [];
const nodeFor = async key => PLACED[key] ? await figma.getNodeByIdAsync(PLACED[key]) : INLINE[key] ? figma.createNodeFromSvg(INLINE[key]) : null;

// brand: recolour the Yellow+White master (first 8 vectors = mark, last 6 = wordmark)
const master = await nodeFor('haysam');
if (master && !page.findOne(n => n.type === 'COMPONENT_SET' && n.name === 'Brand / HAYSAM')) {
  const C = { Ink: ['#58160C', '#58160C'], 'Yellow+Ink': ['#FEE252', '#58160C'], 'Yellow+White': ['#FEE252', '#FFFFFF'], White: ['#FFFFFF', '#FFFFFF'] };
  const hex = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const comps = [];
  for (const [name, [mark, word]] of Object.entries(C)) {
    const f = master.clone(); page.appendChild(f);
    f.findAll(n => n.type === 'VECTOR').forEach((v, i) => { v.fills = [{ type: 'SOLID', color: hex(i < 8 ? mark : word) }]; });
    f.rescale(52 / f.height);
    const c = figma.createComponentFromNode(f); c.name = 'Color=' + name; comps.push(c);
  }
  master.remove();
  const set = figma.combineAsVariants(comps, page); set.name = 'Brand / HAYSAM';
  set.layoutMode = 'VERTICAL'; set.itemSpacing = 24; set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 32;
  set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO';
  set.fills = [{ type: 'SOLID', color: { r: 0.62, g: 0.62, b: 0.68 } }];
  set.x = 0; set.y = 0; made.push(set.id);
}

// tool logos: official files only, never generated
let x = 400 + 160 * page.findAll(n => n.type === 'COMPONENT' && n.name.startsWith('Tool / ')).length;
for (const key of new Set([...Object.keys(PLACED), ...Object.keys(INLINE)])) {
  if (key === 'haysam' || page.findOne(n => n.type === 'COMPONENT' && n.name === 'Tool / ' + key)) continue;
  const f = await nodeFor(key); if (f.parent !== page) page.appendChild(f);
  f.rescale(120 / Math.max(f.width, f.height));
  const c = figma.createComponentFromNode(f); c.name = 'Tool / ' + key; c.fills = [];
  c.x = x; c.y = 0; x += 160; made.push(c.id);
}

return { created: made, components: page.findAll(n => n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && n.parent.type !== 'COMPONENT_SET')).map(n => n.name) };
