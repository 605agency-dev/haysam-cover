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
  const carouselBox = document.getElementById('carousel-fields');
  const pagesList = document.getElementById('pages-list');
  const headline = form.elements.headline;
  const KEY = 'haysam-brief';
  const rows = [
    ['type', 'Post turi'], ['format', 'Format'], ['headline', 'Sarlavha'], ['tool', 'Tool'], ['direction', "Yo'nalish"],
    ['extra', "Qo'shimcha matn"], ['cta', 'Tugma'], ['image', 'Rasm'], ['figma', 'Figma fayl'],
  ];
  const clean = v => (v || '').trim().replace(/\s+/g, ' ');
  let pageTexts = [];

  const isCarousel = () => form.elements.format.value === 'Karusel';
  const pageCount = () => Number(form.elements.pages.value) || 5;

  // one textarea per page; typed text survives count changes
  const renderPages = () => {
    const n = pageCount();
    pagesList.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const row = document.createElement('div'); row.className = 'page-field';
      const id = 'f-page-' + (i + 1);
      row.innerHTML = `<span class="page-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <div><label class="sr-only" for="${id}">Sahifa ${i + 1}</label>
        <textarea class="input body-3" id="${id}" rows="1" maxlength="160" placeholder="${i === 0 ? 'Muqova matni' : i === n - 1 ? 'Yakuniy chaqiriq' : 'Sahifa ' + (i + 1) + ' matni'}"></textarea></div>`;
      const ta = row.querySelector('textarea'); ta.value = pageTexts[i] || '';
      ta.addEventListener('input', () => { pageTexts[i] = ta.value; });
      pagesList.appendChild(row);
    }
  };

  const values = () => {
    const v = Object.fromEntries(rows.map(([k]) => [k, clean(form.elements[k].value)]));
    if (v.format === 'Karusel') v.format = `Karusel, 4:5, ${pageCount()} sahifa`;
    return v;
  };
  const build = v => {
    const lines = ["Haysam Cover: shu brif bo'yicha " + (isCarousel() ? 'karusel' : 'muqova') + ' yasa.', '', 'HAYSAM BRIEF',
      ...rows.filter(([k]) => v[k]).map(([k, label]) => `${label}: ${v[k]}`)];
    if (isCarousel()) {
      lines.push('Sahifalar:');
      for (let i = 0; i < pageCount(); i++) lines.push(`${i + 1}. ${clean(pageTexts[i]) || '(Claude yozsin)'}`);
    }
    return lines.join('\n');
  };

  const render = () => {
    carouselBox.hidden = !isCarousel();
    const v = values();
    if (!v.headline) out.innerHTML = '<span class="empty">Sarlavhani yozing, brif shu yerda yig\'iladi.</span>';
    else out.textContent = build(v);
    openBtn.href = v.headline ? 'https://claude.ai/new?q=' + encodeURIComponent(build(v)) : 'https://claude.ai/new';
    try {
      const raw = Object.fromEntries(rows.map(([k]) => [k, form.elements[k].value]));
      localStorage.setItem(KEY, JSON.stringify({ ...raw, pages: form.elements.pages.value, pageTexts }));
    } catch {}
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
    if (saved) {
      for (const [k, val] of Object.entries(saved)) {
        const el = form.elements[k];
        if (!el || !val || k === 'pageTexts') continue;
        if (el instanceof RadioNodeList) [...el].forEach(r => { r.checked = r.value === val; });
        else el.value = val;
      }
      if (Array.isArray(saved.pageTexts)) pageTexts = saved.pageTexts;
    }
  } catch {}

  form.addEventListener('change', e => { if (e.target === form.elements.pages) renderPages(); });
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
  renderPages();
  render();
}
