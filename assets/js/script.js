'use strict';

/*-----------------------------------*\
  #PANAYU KEELAWAT — SITE BEHAVIOUR
  mobile nav · scroll reveal · nav spy · pub previews · year
\*-----------------------------------*/

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/*-----------------------------------*\
  #MOBILE NAVIGATION
\*-----------------------------------*/

(() => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (!toggle || !nav) return;

  const isOpen = () => nav.classList.contains('open');

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // any in-page link dismisses the menu
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // click outside, Escape, or a widened viewport closes it
  document.addEventListener('click', (event) => {
    if (!isOpen()) return;
    if (event.target.closest('[data-nav-toggle]') || event.target.closest('[data-site-nav]')) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  window.addEventListener('resize', () => {
    if (!isOpen()) return;
    if (getComputedStyle(toggle).display === 'none') setOpen(false);
  });
})();

/*-----------------------------------*\
  #SCROLL REVEAL
\*-----------------------------------*/

(() => {
  const items = document.querySelectorAll('.reveal');

  if (!items.length) return;

  const showAll = () => items.forEach((el) => el.classList.add('in-view'));

  if (!('IntersectionObserver' in window) || prefersReducedMotion.matches) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

  items.forEach((el) => observer.observe(el));
})();

/*-----------------------------------*\
  #SECTION-AWARE NAVIGATION
\*-----------------------------------*/

(() => {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));

  if (!links.length || !('IntersectionObserver' in window)) return;

  const targets = new Map();

  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) targets.set(section, link);
  });

  if (!targets.size) return;

  const setCurrent = (active) => {
    links.forEach((link) => {
      if (link === active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  // sections currently crossing the middle band of the viewport
  const visible = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });

    // first section in document order wins; none visible means nothing is current
    const active = Array.from(visible).sort((a, b) => a.offsetTop - b.offsetTop)[0];

    setCurrent(active ? targets.get(active) : null);
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  targets.forEach((link, section) => observer.observe(section));
})();

/*-----------------------------------*\
  #PUBLICATION PREVIEWS
  poster by default, animated gif while hovered or focused
\*-----------------------------------*/

(() => {
  const previews = document.querySelectorAll('.pub-thumb img[data-gif]');

  previews.forEach((img) => {
    const entry = img.closest('.pub-entry');
    const motion = img.dataset.gif;
    const poster = img.dataset.poster || img.getAttribute('src');

    if (!entry || !motion) return;

    let prefetched = false;

    const play = () => {
      if (!prefetched) {
        new Image().src = motion; // warm the cache, avoid a flash of empty box
        prefetched = true;
      }
      img.src = motion;
    };

    const stop = () => {
      if (poster) img.src = poster;
    };

    entry.addEventListener('pointerenter', play);
    entry.addEventListener('pointerleave', stop);
    entry.addEventListener('focusin', play);
    entry.addEventListener('focusout', stop);
  });
})();

/*-----------------------------------*\
  #FOOTER YEAR
\*-----------------------------------*/

(() => {
  const slots = document.querySelectorAll('[data-year]');

  if (!slots.length) return;

  const year = String(new Date().getFullYear());

  slots.forEach((el) => {
    el.textContent = year;
  });
})();
