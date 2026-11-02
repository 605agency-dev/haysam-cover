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
