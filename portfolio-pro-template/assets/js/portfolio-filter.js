/**
 * PORTFOLIO PRO TEMPLATE — portfolio-filter.js
 * Isotope-style filter with CSS transitions, no external deps.
 * Also handles: lazy loading, lightbox, infinite scroll (optional).
 */

'use strict';

/* ══════════════════════════════════════
   PORTFOLIO FILTER
══════════════════════════════════════ */
function initPortfolioFilter() {
  const filterWrap = document.querySelector('.portfolio-filters');
  const grid       = document.querySelector('.projects-grid');
  if (!filterWrap || !grid) return;

  const items      = [...grid.querySelectorAll('.project-card')];
  const filterBtns = [...filterWrap.querySelectorAll('.filter-btn')];

  // Collect all categories from cards
  function getCategories() {
    const cats = new Set();
    items.forEach(item => {
      const cats_ = item.dataset.category?.split(',').map(c => c.trim()) || [];
      cats_.forEach(c => cats.add(c));
    });
    return cats;
  }

  // Auto-build filter buttons if they have data-auto="true"
  if (filterWrap.dataset.auto === 'true') {
    const cats = getCategories();
    filterWrap.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>';
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = cat;
      btn.textContent = cat;
      filterWrap.appendChild(btn);
    });
  }

  const allBtns = [...filterWrap.querySelectorAll('.filter-btn')];

  function filterItems(category) {
    items.forEach((item, i) => {
      const itemCats = item.dataset.category?.split(',').map(c => c.trim()) || [];
      const show = category === 'all' || itemCats.includes(category);

      if (show) {
        item.style.display = '';
        // Stagger entrance
        setTimeout(() => {
          item.style.opacity  = '1';
          item.style.transform = 'scale(1) translateY(0)';
        }, i * 60);
      } else {
        item.style.opacity  = '0';
        item.style.transform = 'scale(0.9) translateY(10px)';
        setTimeout(() => { item.style.display = 'none'; }, 350);
      }
    });
  }

  // Add transition styles to items
  items.forEach(item => {
    item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  });

  allBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      allBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems(btn.dataset.filter);
    });
  });

  // Init: show all
  filterItems('all');
}

/* ══════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════ */
function initLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox]');
  if (!triggers.length) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.style.cssText = `
    display:none;position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.92);backdrop-filter:blur(12px);
    align-items:center;justify-content:center;padding:20px;
    cursor:zoom-out;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width:90vw;max-height:90vh;object-fit:contain;
    border-radius:12px;border:1px solid rgba(255,255,255,0.1);
    box-shadow:0 24px 80px rgba(0,0,0,0.8);
    transition:transform 0.3s ease;
    cursor:default;
  `;

  const caption = document.createElement('p');
  caption.style.cssText = `
    position:absolute;bottom:24px;left:50%;transform:translateX(-50%);
    color:rgba(255,255,255,0.7);font-size:0.875rem;text-align:center;
    background:rgba(0,0,0,0.5);padding:6px 16px;border-radius:999px;
    pointer-events:none;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
  closeBtn.style.cssText = `
    position:absolute;top:20px;right:20px;
    background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
    border-radius:50%;width:44px;height:44px;display:flex;
    align-items:center;justify-content:center;color:#fff;cursor:pointer;
    transition:background 0.2s;
  `;

  const navPrev = document.createElement('button');
  const navNext = document.createElement('button');
  [navPrev, navNext].forEach((nav, i) => {
    nav.style.cssText = `
      position:absolute;top:50%;transform:translateY(-50%);
      background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
      border-radius:50%;width:48px;height:48px;display:flex;
      align-items:center;justify-content:center;color:#fff;cursor:pointer;
      transition:background 0.2s;${i === 0 ? 'left:20px;' : 'right:20px;'}
    `;
    nav.innerHTML = i === 0
      ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`
      : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
  });

  overlay.appendChild(img);
  overlay.appendChild(caption);
  overlay.appendChild(closeBtn);
  overlay.appendChild(navPrev);
  overlay.appendChild(navNext);
  document.body.appendChild(overlay);

  let currentIndex = 0;
  const sources    = [];

  triggers.forEach((el, i) => {
    sources.push({ src: el.dataset.lightbox, cap: el.dataset.caption || '' });
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', e => { e.preventDefault(); openLightbox(i); });
  });

  function openLightbox(index) {
    currentIndex = index;
    img.src = sources[index].src;
    caption.textContent = sources[index].cap;
    caption.style.display = sources[index].cap ? 'block' : 'none';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    img.src = '';
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + sources.length) % sources.length;
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = sources[currentIndex].src;
      caption.textContent = sources[currentIndex].cap;
      img.style.opacity = '1';
    }, 150);
  }

  img.style.transition = 'opacity 0.15s';

  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
  closeBtn.addEventListener('click', closeLightbox);
  navPrev.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
  navNext.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

  document.addEventListener('keydown', e => {
    if (overlay.style.display !== 'flex') return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ══════════════════════════════════════
   LAZY IMAGE LOADING
══════════════════════════════════════ */
function initLazyImages() {
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if (!lazyImgs.length) return;

  if (!('IntersectionObserver' in window)) {
    lazyImgs.forEach(img => { img.src = img.dataset.src; });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.removeAttribute('data-src');
          img.classList.add('img-loaded');
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '200px 0px' }
  );

  lazyImgs.forEach(img => {
    img.style.transition = 'opacity 0.4s ease';
    img.style.opacity    = '0';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    observer.observe(img);
  });
}

/* ══════════════════════════════════════
   LOAD MORE BUTTON
══════════════════════════════════════ */
function initLoadMore() {
  const btn      = document.querySelector('#load-more-btn');
  const grid     = document.querySelector('.projects-grid');
  const hidden   = grid ? [...grid.querySelectorAll('.project-card.hidden')] : [];
  const perBatch = 3;

  if (!btn || !hidden.length) {
    if (btn) btn.style.display = 'none';
    return;
  }

  let shown = 0;

  function showBatch() {
    const batch = hidden.slice(shown, shown + perBatch);
    batch.forEach((card, i) => {
      setTimeout(() => {
        card.classList.remove('hidden');
        card.style.opacity   = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        });
      }, i * 100);
    });

    shown += batch.length;
    if (shown >= hidden.length) btn.style.display = 'none';
  }

  btn.addEventListener('click', showBatch);
}

/* ══════════════════════════════════════
   PROJECT CARD TILT (mouse follow)
══════════════════════════════════════ */
function initCardTilt() {
  // Only on desktop
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.project-card[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
  initLightbox();
  initLazyImages();
  initLoadMore();
  initCardTilt();
});
