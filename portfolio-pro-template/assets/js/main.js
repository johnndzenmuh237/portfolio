/**
 * PORTFOLIO PRO TEMPLATE — main.js
 * Core functionality: preloader, navbar, scroll, mobile menu,
 * back-to-top, cookie banner, custom cursor, counters, parallax.
 */

'use strict';

/* ══════════════════════════════════════
   UTILITY HELPERS
══════════════════════════════════════ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

function debounce(fn, delay = 200) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

function lerp(a, b, t) { return a + (b - a) * t; }

/* ══════════════════════════════════════
   PRELOADER
══════════════════════════════════════ */
function initPreloader() {
  const loader = qs('#preloader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 600);
  });

  // Safety: remove after 3s regardless
  setTimeout(() => loader.classList.add('hidden'), 3000);
}

/* ══════════════════════════════════════
   NAVBAR — scroll state & active link
══════════════════════════════════════ */
function initNavbar() {
  const navbar = qs('#navbar');
  if (!navbar) return;

  const scrollHandler = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  on(window, 'scroll', scrollHandler, { passive: true });
  scrollHandler();

  // Highlight active nav link based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ══════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════ */
function initMobileMenu() {
  const toggle = qs('.nav-hamburger');
  const mobileNav = qs('.nav-mobile');
  if (!toggle || !mobileNav) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    toggle.classList.add('active');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    isOpen = false;
    toggle.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  on(toggle, 'click', () => isOpen ? closeMenu() : openMenu());

  // Close on link click
  qsa('.nav-mobile a').forEach(link => on(link, 'click', closeMenu));

  // Close on outside click
  on(document, 'click', e => {
    if (isOpen && !toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on ESC
  on(document, 'keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* ══════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════ */
function initBackToTop() {
  const btn = qs('#back-to-top');
  if (!btn) return;

  on(window, 'scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  on(btn, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════
   SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
══════════════════════════════════════ */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    qsa('[data-animate], [data-stagger]').forEach(el => {
      el.classList.add('in-view');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  qsa('[data-animate], [data-stagger]').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   SKILL BARS
══════════════════════════════════════ */
function initSkillBars() {
  const bars = qsa('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const pct = bar.dataset.pct || '0';
          bar.style.setProperty('--pct', pct + '%');
          bar.style.width = pct + '%';
          bar.classList.add('animated');
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* ══════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════ */
function initCounters() {
  const counters = qsa('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target  = parseFloat(el.dataset.count);
  const suffix  = el.dataset.suffix || '';
  const prefix  = el.dataset.prefix || '';
  const duration = parseInt(el.dataset.duration) || 1800;
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const start    = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = prefix + value.toFixed(decimals) + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  }

  requestAnimationFrame(update);
}

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
function initCustomCursor() {
  const dot  = qs('.cursor-dot');
  const ring = qs('.cursor-ring');
  if (!dot || !ring) return;

  // Only enable on non-touch devices
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;

  on(document, 'mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

    ringX = lerp(ringX, mouseX, 0.15);
    ringY = lerp(ringY, mouseY, 0.15);
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

    rafId = requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Scale on hover
  on(document, 'mouseover', e => {
    const target = e.target.closest('a, button, [data-cursor-scale]');
    if (target) {
      dot.style.transform  += ' scale(2.5)';
      ring.style.transform += ' scale(1.6)';
      ring.style.opacity    = '0.8';
    }
  });

  on(document, 'mouseout', e => {
    const target = e.target.closest('a, button, [data-cursor-scale]');
    if (target) {
      ring.style.opacity = '0.5';
    }
  });

  on(document, 'mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  on(document, 'mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.5';
  });
}

/* ══════════════════════════════════════
   COOKIE BANNER
══════════════════════════════════════ */
function initCookieBanner() {
  const banner = qs('#cookie-banner');
  if (!banner) return;

  if (localStorage.getItem('cookies-accepted')) return;

  setTimeout(() => banner.classList.add('show'), 2000);

  const acceptBtn = qs('#cookie-accept', banner);
  const rejectBtn = qs('#cookie-reject', banner);

  function dismissBanner(accepted) {
    if (accepted) localStorage.setItem('cookies-accepted', '1');
    banner.classList.remove('show');
    banner.classList.add('hide');
  }

  on(acceptBtn, 'click', () => dismissBanner(true));
  on(rejectBtn, 'click', () => dismissBanner(false));
}

/* ══════════════════════════════════════
   SMOOTH ANCHOR SCROLLING
══════════════════════════════════════ */
function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    on(link, 'click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════
   RIPPLE EFFECT ON BUTTONS
══════════════════════════════════════ */
function initRipple() {
  on(document, 'click', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect   = btn.getBoundingClientRect();

    circle.className = 'ripple-circle';
    circle.style.cssText = `
      width: ${diameter}px;
      height: ${diameter}px;
      top: ${e.clientY - rect.top - radius}px;
      left: ${e.clientX - rect.left - radius}px;
    `;

    btn.classList.add('ripple-wrap');
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(circle);

    setTimeout(() => circle.remove(), 700);
  });
}

/* ══════════════════════════════════════
   PARALLAX (subtle)
══════════════════════════════════════ */
function initParallax() {
  const elements = qsa('[data-parallax]');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  on(window, 'scroll', () => {
    const scrollY = window.scrollY;
    elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

/* ══════════════════════════════════════
   ACTIVE NAV ON SCROLL (single-page)
══════════════════════════════════════ */
function initScrollSpy() {
  const sections = qsa('section[id]');
  if (!sections.length) return;

  const navLinks = qsa('.nav-links a[href^="#"]');
  if (!navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════
   EXTERNAL LINKS: open in new tab
══════════════════════════════════════ */
function initExternalLinks() {
  const domain = window.location.hostname;
  qsa('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('http') && !href.includes(domain)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/* ══════════════════════════════════════
   TOOLTIP (data-tooltip="...")
══════════════════════════════════════ */
function initTooltips() {
  qsa('[data-tooltip]').forEach(el => {
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.textContent = el.dataset.tooltip;
    tip.style.cssText = `
      position:absolute;display:none;background:var(--clr-surface-2);
      color:var(--clr-text);padding:6px 12px;border-radius:6px;
      font-size:0.75rem;white-space:nowrap;pointer-events:none;
      border:1px solid var(--clr-border);z-index:999;
      transform:translateX(-50%);top:calc(100% + 8px);left:50%;
    `;
    el.style.position = 'relative';
    el.appendChild(tip);

    on(el, 'mouseenter', () => { tip.style.display = 'block'; });
    on(el, 'mouseleave', () => { tip.style.display = 'none'; });
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initMobileMenu();
  initBackToTop();
  initScrollAnimations();
  initSkillBars();
  initCounters();
  initCustomCursor();
  initCookieBanner();
  initSmoothScroll();
  initRipple();
  initParallax();
  initScrollSpy();
  initExternalLinks();
  initTooltips();
});
