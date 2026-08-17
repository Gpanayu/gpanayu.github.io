'use strict';

// mobile nav toggle
const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('[data-site-nav]');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach((el) => revealObserver.observe(el));

// publication thumbnails: play the gif only while the row is hovered
document.querySelectorAll('.pub-thumb img[data-gif]').forEach((img) => {
  const entry = img.closest('.pub-entry');
  const { gif, poster } = img.dataset;

  entry.addEventListener('mouseenter', () => { img.src = gif; });
  entry.addEventListener('mouseleave', () => { img.src = poster; });
});
