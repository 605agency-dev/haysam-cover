const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// mobile menu: full height panel, links arrive one by one (60ms step, 400ms cap)
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('mobile-menu');
const setMenu = open => {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Menyuni yopish' : 'Menyuni ochish');
  if (open) {
    menu.hidden = false;
    [...menu.children].forEach((a, i) => { a.style.transitionDelay = Math.min(i * 60, 400) + 'ms'; });
    requestAnimationFrame(() => menu.classList.add('open'));
    document.body.style.overflow = 'hidden';
  } else {
    menu.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (toggle.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, 300);
  }
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });

// section reveals, once
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => reduce ? el.classList.add('in') : io.observe(el));

// tagline: each word lights up as it crosses the trigger line
const tagline = document.querySelector('[data-words]');
if (tagline) {
  tagline.innerHTML = tagline.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const words = tagline.querySelectorAll('.w');
  if (reduce) words.forEach(w => w.classList.add('on'));
  else {
    const wio = new IntersectionObserver(entries => {
      for (const e of entries) e.target.classList.toggle('on', e.isIntersecting || e.boundingClientRect.top < 0);
    }, { rootMargin: '0px 0px -45% 0px' });
    words.forEach((w, i) => { w.style.transitionDelay = (i % 4) * 40 + 'ms'; wio.observe(w); });
  }
}

// install tabs (arrow keys move between tabs)
const tabs = [...document.querySelectorAll('[role="tab"]')];
const select = tab => {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  tab.focus();
};
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(t));
  t.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length]);
    if (e.key === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length]);
  });
});

// copy buttons
const status = document.querySelector('.copy-error');
document.querySelectorAll('.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.parentElement.querySelector('code').textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Nusxalandi';
      btn.classList.add('done');
      status.textContent = '';
      setTimeout(() => { btn.textContent = 'Nusxalash'; btn.classList.remove('done'); }, 1800);
    } catch {
      status.textContent = "Nusxalab bo'lmadi. Buyruqni qo'lda belgilab nusxalang.";
    }
  });
});

// brief composer: fields → ready brief text, claude.ai link, copy; draft kept in this browser only
const form = document.getElementById('brief-form');
if (form) {
  const out = document.getElementById('brief-text');
  const openBtn = document.getElementById('brief-open');
  const copyBtn = document.getElementById('brief-copy');
  const err = document.getElementById('brief-error');
  const headline = form.elements.headline;
  const KEY = 'haysam-brief';
  const rows = [
    ['type', 'Post turi'], ['headline', 'Sarlavha'], ['tool', 'Tool'], ['direction', "Yo'nalish"],
    ['extra', "Qo'shimcha matn"], ['cta', 'Tugma'], ['image', 'Rasm'], ['figma', 'Figma fayl'],
  ];
  const values = () => Object.fromEntries(rows.map(([k]) => [k, (form.elements[k].value || '').trim().replace(/\s+/g, ' ')]));
  const build = v => [
    "Haysam Cover: shu brif bo'yicha muqova yasa.",
    '',
    'HAYSAM BRIEF',
    ...rows.filter(([k]) => v[k]).map(([k, label]) => `${label}: ${v[k]}`),
  ].join('\n');

  const render = () => {
    const v = values();
    if (!v.headline) {
      out.innerHTML = '<span class="empty">Sarlavhani yozing, brif shu yerda yig\'iladi.</span>';
    } else {
      out.textContent = build(v);
    }
    openBtn.href = v.headline ? 'https://claude.ai/new?q=' + encodeURIComponent(build(v)) : 'https://claude.ai/new';
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
  };

  const needHeadline = e => {
    if (headline.value.trim()) { headline.removeAttribute('aria-invalid'); err.textContent = ''; return false; }
    e?.preventDefault();
    headline.setAttribute('aria-invalid', 'true');
    err.textContent = 'Avval sarlavhani yozing.';
    headline.focus();
    return true;
  };

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) for (const [k, val] of Object.entries(saved)) {
      const el = form.elements[k];
      if (!el || !val) continue;
      if (el instanceof RadioNodeList) [...el].forEach(r => { r.checked = r.value === val; });
      else el.value = val;
    }
  } catch {}

  form.addEventListener('input', () => { if (headline.value.trim()) needHeadline(); render(); });
  form.addEventListener('submit', e => e.preventDefault());
  // also copy, so the brief can be pasted if claude.ai drops the prefilled text (e.g. after sign in)
  openBtn.addEventListener('click', e => {
    if (needHeadline(e)) return;
    navigator.clipboard?.writeText(build(values())).catch(() => {});
  });
  copyBtn.addEventListener('click', async () => {
    if (needHeadline()) return;
    const label = copyBtn.querySelector('span');
    try {
      await navigator.clipboard.writeText(build(values()));
      label.textContent = 'Nusxalandi';
      copyBtn.classList.add('done');
      setTimeout(() => { label.textContent = 'Nusxalash'; copyBtn.classList.remove('done'); }, 1800);
    } catch {
      err.textContent = "Nusxalab bo'lmadi. Matnni qo'lda belgilab nusxalang.";
    }
  });
  render();
}
