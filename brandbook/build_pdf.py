#!/usr/bin/env python3
"""Haysam brandbook: HTML pages (1920x1080) -> PDF with live download links.
   python3 brandbook/build_assets.py   # logos (once)
   python3 brandbook/build_pdf.py      # thumbs + brandbook.html + web/brand/haysam-brandbook.pdf + kit zip"""
import os, subprocess, shutil, zipfile
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ROOT)
BRAND = os.path.join(REPO, 'web', 'brand')
URL = 'https://haysam-cover.vercel.app/brand/'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

# ---------- thumbnails (keep the PDF light) ----------
TH = os.path.join(ROOT, 'thumbs'); os.makedirs(TH, exist_ok=True)
def thumb(src, name, h):
    im = Image.open(src); im.thumbnail((10000, h))
    out = os.path.join(TH, name)
    (im if name.endswith('.png') else im.convert('RGB')).save(out, **({} if name.endswith('.png') else {'quality': 88}))
    return 'thumbs/' + name
bgdir = os.path.join(BRAND, 'backgrounds')
for f in os.listdir(bgdir):
    thumb(os.path.join(bgdir, f), f.replace('.png', '.png'), 520 if '4x5' in f else 360)
for f in os.listdir(os.path.join(ROOT, 'refs')):
    thumb(os.path.join(ROOT, 'refs', f), 'ref-' + f.replace('.png', '.jpg'), 900)

def btn(label, path, kind=''):
    return f'<a class="btn {kind}" href="{URL}{path}">{label}<span>↓</span></a>'

# ---------- page parts ----------
LOGOS = [
    ('haysam-logo-ink', 'Ink', 'Asosiy. Och fonlar: lavanda, oq.', 'lav'),
    ('haysam-logo-yellow-ink', 'Yellow + Ink', 'Och fon, sariq aksent kerak bo‘lsa.', 'white'),
    ('haysam-logo-yellow-white', 'Yellow + White', 'To‘q fon #270601.', 'dark'),
    ('haysam-logo-white', 'White', 'Rasm va fotolar ustida.', 'photo'),
    ('haysam-logo-black', 'Black', 'Faqat bir rangli bosma.', 'white'),
]
MARKS = [('haysam-mark-ink', 'Ink', 'lav'), ('haysam-mark-yellow', 'Yellow', 'dark'),
         ('haysam-mark-white', 'White', 'photo'), ('haysam-mark-black', 'Black', 'white')]
def fmt_btns(name):
    return ''.join(btn(k.upper(), f'logos/{k}/{name}.{k}', 'sm') for k in ('svg', 'png', 'jpg'))

logo_tiles = ''.join(f'''
<div class="ltile">
  <div class="lbox {bg}"><img src="../web/brand/logos/svg/{n}.svg"></div>
  <div class="lmeta"><b>{t}</b><span>{d}</span></div>
  <div class="row">{fmt_btns(n)}</div>
</div>''' for n, t, d, bg in LOGOS)

mark_tiles = ''.join(f'''
<div class="mtile">
  <div class="mbox {bg}"><img src="../web/brand/logos/svg/{n}.svg"></div>
  <b>{t}</b>
  <div class="row">{fmt_btns(n)}</div>
</div>''' for n, t, bg in MARKS)

COLORS = [
    ('#E5E9FF', 'Lavanda', 'Asosiy fon', '229 233 255', 'ink'),
    ('#F6F7FF', 'Oq-lavanda', 'Board / karusel fon', '246 247 255', 'ink'),
    ('#58160C', 'Ink', 'Barcha brend matni, logo', '88 22 12', 'w'),
    ('#270601', 'Tun', 'Faqat to‘q / kino koverlar', '39 6 1', 'w'),
    ('#FEE252', 'Sariq', 'Aksent: stiker, glow yadrosi', '254 226 82', 'ink'),
    ('#DF3909', 'Olov', 'Aksent: glow dumi, kursor', '223 57 9', 'w'),
]
color_cards = ''.join(f'''
<div class="sw"><div class="chip {tc}" style="background:{h}">{n}</div>
<div class="swm"><b>{h}</b><span>RGB {rgb}</span><em>{u}</em></div></div>''' for h, n, u, rgb, tc in COLORS)

GRADS = [
    ('linear-gradient(180deg,#E5E9FF,#F6F7FF)', 'Lavanda fon', '#E5E9FF → #F6F7FF', 'ink'),
    ('linear-gradient(90deg,#9EE8FF,#2CD3F3,#1B7BFF)', 'Offer — osmon', '#9EE8FF → #2CD3F3 → #1B7BFF · faqat taklif/narx', 'w'),
    ('linear-gradient(180deg,#270601,#58160C,#A0301A)', 'Ink metal yozuv', '#270601 → #58160C → #A0301A', 'w'),
    ('radial-gradient(60% 90% at 30% 50%,#FEE252 0 30%,#DF3909 62%,#270601 100%)', 'Comet glow', '#FEE252 → #DF3909 → #270601', 'w'),
]
grad_cards = ''.join(f'<div class="gr"><div class="gbar {tc}" style="background:{g}">{n}</div><span>{c}</span></div>' for g, n, c, tc in GRADS)

FONTS = [
    ('JetBrainsMono', 'JetBrains Mono', "'JBM'", 800, 'brand', 'Haysam ovozi: izoh, stiker, kod'),
    ('Anton', 'Anton', "'Anton'", 400, 'news', 'Yangilik, baland caps'),
    ('Unbounded', 'Unbounded Black', "'Unbounded'", 900, 'future', 'Texnologiya, raqamlar, “yangi”'),
    ('ArchivoBlack', 'Archivo Black', "'Archivo'", 400, 'loud', 'Tugmalar, hype'),
    ('BigShouldersDisplay', 'Big Shoulders Display', "'BigShoulders'", 900, 'cinema', 'Video, kino, jarayon'),
    ('InstrumentSerif', 'Instrument Serif', "'InstrumentSerif'", 400, 'premium', 'Shaxsiy xat, sokin'),
    ('BricolageGrotesque', 'Bricolage Grotesque', "'Bricolage'", 800, 'play', 'Do‘stona, jamoa, maskot'),
    ('Inter', 'Inter', "'Inter'", 600, 'ui', 'Faqat chip va label'),
]
font_cards = ''.join(f'''
<div class="fc"><div class="fa" style="font-family:{fam};font-weight:{w}">Aa</div>
<div class="fm"><div class="fk">{k}</div><b>{n}</b><span>{u}</span>
<div class="fs" style="font-family:{fam};font-weight:{w}">AI darslari</div></div>
{btn('TTF', f'fonts/haysam-font-{d}.zip', 'sm')}</div>''' for d, n, fam, w, k, u in FONTS)

LAV = [('', 'Plain'), ('-dots', 'Dots'), ('-lines', 'Lines'), ('-tiles', 'Tiles')]
lav_cards = ''.join(f'''
<div class="bgc"><img class="b45" src="thumbs/haysam-bg-lavender{s}-4x5.jpg"><b>Lavanda · {n}</b>
<div class="row">{btn('4:5', f'backgrounds/haysam-bg-lavender{s}-4x5.jpg', 'sm')}{btn('9:16', f'backgrounds/haysam-bg-lavender{s}-9x16.jpg', 'sm')}</div></div>''' for s, n in LAV)
GLOW = [('dark', 'Tun + comet'), ('dark-corner', 'Tun + chet nuri'), ('ember', 'Olov'), ('yellow', 'Quyosh'), ('lavender', 'Lavanda + comet')]
glow_cards = ''.join(f'''
<div class="bgc"><img class="b169" src="thumbs/haysam-bg-glow-{s}-16x9.jpg"><b>{n}</b>
<div class="row">{btn('16:9 · 4K', f'backgrounds/haysam-bg-glow-{s}-16x9.jpg', 'sm')}</div></div>''' for s, n in GLOW)
EL = [('haysam-comet-warm.png', 'Comet · warm'), ('haysam-comet-sky.png', 'Comet · sky (offer)'),
      ('haysam-pattern-dots-overlay.png', 'Dots overlay'), ('haysam-pattern-lines-overlay.png', 'Lines overlay'),
      ('haysam-pattern-tiles-overlay.png', 'Tiles overlay')]
el_cards = ''.join(f'''<div class="elc"><div class="elb"><img src="thumbs/{f}"></div><b>{n}</b>{btn('PNG', 'backgrounds/' + f, 'sm')}</div>''' for f, n in EL)

AI_PROMPT = '''You design for HAYSAM — an Uzbek AI-education platform.
Copy: Uzbek Latin, short, reads as a lesson or benefit.

LOGO  official files only: mark + caps "HAYSAM".
      ink on light · yellow-white on #270601 · white on photos.
      ~52 px tall on a 1080 canvas, centred near the top.
COLOR lavender #E5E9FF→#F6F7FF · ink #58160C · dark #270601
      accents #FEE252 / #DF3909 (one per design)
      offers only: sky #9EE8FF→#2CD3F3→#1B7BFF
      photo designs: the picture owns the colour.
TYPE  one mood font per post: JetBrains Mono · Anton ·
      Unbounded · Archivo Black · Big Shoulders · Instrument
      Serif · Bricolage. Inter = chips only. Headline
      110–230 px, ≤ 2 lines, leading 90 %.
SIZE  1080×1920 master, content in y 285–1635 (4:5 crop).
      Carousel 1080×1350 on lavender + dot grid.
LOGOS of tools: real official files, never generated.
NEVER page counters, emoji, filler labels, lime/acid
      green, WordArt bevels, lowercase "haysam" logo.'''

html = open(os.path.join(ROOT, 'brandbook.template.html')).read()
for k, v in {'{{URL}}': URL, '{{LOGO_TILES}}': logo_tiles, '{{MARK_TILES}}': mark_tiles, '{{COLOR_CARDS}}': color_cards,
             '{{GRAD_CARDS}}': grad_cards, '{{FONT_CARDS}}': font_cards, '{{LAV_CARDS}}': lav_cards,
             '{{GLOW_CARDS}}': glow_cards, '{{EL_CARDS}}': el_cards, '{{AI_PROMPT}}': AI_PROMPT,
             '{{KIT}}': btn('Brand kit · ZIP', 'haysam-brand-kit.zip', 'y big'),
             '{{LOGO_ZIPS}}': btn('Barcha SVG', 'haysam-logos-svg.zip') + btn('Barcha PNG', 'haysam-logos-png.zip') + btn('Barcha JPG', 'haysam-logos-jpg.zip'),
             '{{FONTS_ZIP}}': btn('Barcha shriftlar · ZIP', 'fonts/haysam-fonts-all.zip'),
             '{{BG_ZIP}}': btn('Barcha fonlar · ZIP', 'haysam-backgrounds.zip'),
             '{{AI_BTNS}}': btn('AI brief · .md', 'haysam-brand-brief.md', 'y') + btn('Brand kit · ZIP', 'haysam-brand-kit.zip')}.items():
    html = html.replace(k, v)
hp = os.path.join(ROOT, 'brandbook.html'); open(hp, 'w').write(html)

pdf = os.path.join(BRAND, 'haysam-brandbook.pdf')
subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--run-all-compositor-stages-before-draw',
                '--virtual-time-budget=8000', f'--print-to-pdf={pdf}', 'file://' + hp], check=True, capture_output=True)
print('pdf', os.path.getsize(pdf) // 1024, 'KB')

# ---------- one zip with everything ----------
kit = os.path.join(BRAND, 'haysam-brand-kit.zip')
with zipfile.ZipFile(kit, 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(pdf, 'haysam-brand-kit/haysam-brandbook.pdf')
    z.write(os.path.join(BRAND, 'haysam-brand-brief.md'), 'haysam-brand-kit/haysam-brand-brief.md')
    for sub in ('logos', 'backgrounds'):
        for dp, _, fs in os.walk(os.path.join(BRAND, sub)):
            for f in fs:
                if f.startswith('.'): continue
                p = os.path.join(dp, f); z.write(p, 'haysam-brand-kit/' + os.path.relpath(p, BRAND))
    for dp, _, fs in os.walk(os.path.join(ROOT, 'fonts')):
        for f in fs:
            if f.startswith('.'): continue
            p = os.path.join(dp, f); z.write(p, 'haysam-brand-kit/fonts/' + os.path.relpath(p, os.path.join(ROOT, 'fonts')))
print('kit', os.path.getsize(kit) // 1024 // 1024, 'MB')
