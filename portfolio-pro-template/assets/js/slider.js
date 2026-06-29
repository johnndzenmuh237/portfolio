/**
 * PORTFOLIO PRO TEMPLATE — slider.js
 * Lightweight vanilla slider/carousel — no external deps.
 * Supports: testimonial slider, hero slider, blog carousel,
 * auto-play, touch/swipe, keyboard, dots, arrows.
 */

'use strict';

/* ══════════════════════════════════════
   CORE SLIDER CLASS
══════════════════════════════════════ */
class Slider {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    if (!this.container) return;

    this.opts = {
      autoplay:      options.autoplay      ?? true,
      autoplayDelay: options.autoplayDelay ?? 4000,
      loop:          options.loop          ?? true,
      speed:         options.speed         ?? 500,
      dots:          options.dots          ?? true,
      arrows:        options.arrows        ?? true,
      swipe:         options.swipe         ?? true,
      keyboard:      options.keyboard      ?? false,
      perView:       options.perView       ?? 1,
      gap:           options.gap           ?? 24,
      pauseOnHover:  options.pauseOnHover  ?? true,
      onChange:      options.onChange      ?? null,
    };

    this.track      = this.container.querySelector('.slider-track');
    this.slides     = [...this.container.querySelectorAll('.slider-slide')];
    this.totalSlides = this.slides.length;
    this.current    = 0;
    this.isPlaying  = false;
    this.timer      = null;
    this.startX     = 0;
    this.isDragging = false;

    if (!this.track || !this.totalSlides) return;

    this._setup();
    this._bindEvents();
    if (this.opts.autoplay) this.play();
  }

  _setup() {
    // Track styles
    this.track.style.cssText = `
      display: flex;
      transition: transform ${this.opts.speed}ms cubic-bezier(0.16,1,0.3,1);
      will-change: transform;
    `;

    // Slide widths
    const gap     = this.opts.gap;
    const perView = this.opts.perView;

    this.slides.forEach(slide => {
      slide.style.flex        = `0 0 calc((100% - ${gap * (perView - 1)}px) / ${perView})`;
      slide.style.marginRight = gap + 'px';
    });

    // Build dots
    if (this.opts.dots && this.totalSlides > 1) {
      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'slider-dots';
      dotsWrap.style.cssText = `
        display:flex;align-items:center;justify-content:center;
        gap:8px;margin-top:24px;
      `;
      this.dotEls = this.slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.className  = 'slider-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.style.cssText = `
          width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;
          background:var(--clr-border);transition:all 0.3s ease;padding:0;
        `;
        dot.addEventListener('click', () => this.goTo(i));
        dotsWrap.appendChild(dot);
        return dot;
      });
      this.container.appendChild(dotsWrap);
    }

    // Build arrows
    if (this.opts.arrows && this.totalSlides > 1) {
      const prevBtn = this._createArrow('prev');
      const nextBtn = this._createArrow('next');
      prevBtn.addEventListener('click', () => this.prev());
      nextBtn.addEventListener('click', () => this.next());
      this.container.appendChild(prevBtn);
      this.container.appendChild(nextBtn);
    }

    this._updateUI();
  }

  _createArrow(dir) {
    const btn = document.createElement('button');
    btn.className = `slider-arrow slider-arrow--${dir}`;
    btn.setAttribute('aria-label', dir === 'prev' ? 'Previous slide' : 'Next slide');
    btn.style.cssText = `
      position:absolute;top:50%;transform:translateY(-50%);
      ${dir === 'prev' ? 'left:-20px;' : 'right:-20px;'}
      width:44px;height:44px;border-radius:50%;
      background:var(--clr-surface);border:1px solid var(--clr-border);
      display:flex;align-items:center;justify-content:center;
      color:var(--clr-text-muted);cursor:pointer;
      transition:all 0.2s ease;z-index:10;
    `;
    btn.innerHTML = dir === 'prev'
      ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`
      : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = 'var(--clr-accent)';
      btn.style.color       = 'var(--clr-accent)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = 'var(--clr-border)';
      btn.style.color       = 'var(--clr-text-muted)';
    });
    return btn;
  }

  _bindEvents() {
    // Pause on hover
    if (this.opts.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => { if (this.opts.autoplay) this.play(); });
    }

    // Touch / swipe
    if (this.opts.swipe) {
      this.track.addEventListener('touchstart', e => {
        this.startX    = e.touches[0].clientX;
        this.isDragging = true;
      }, { passive: true });

      this.track.addEventListener('touchend', e => {
        if (!this.isDragging) return;
        const diff = this.startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
        this.isDragging = false;
      });

      // Mouse drag
      this.track.addEventListener('mousedown', e => {
        this.startX    = e.clientX;
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
      });

      document.addEventListener('mouseup', e => {
        if (!this.isDragging) return;
        const diff = this.startX - e.clientX;
        if (Math.abs(diff) > 60) diff > 0 ? this.next() : this.prev();
        this.isDragging = false;
        this.track.style.cursor = '';
      });
    }

    // Keyboard
    if (this.opts.keyboard) {
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }
  }

  _updateUI() {
    // Move track
    const slideWidth = this.slides[0]?.offsetWidth || 0;
    const gap        = this.opts.gap;
    const offset     = this.current * (slideWidth + gap);
    this.track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    if (this.dotEls) {
      this.dotEls.forEach((dot, i) => {
        const active = i === this.current;
        dot.style.background = active ? 'var(--clr-accent)' : 'var(--clr-border)';
        dot.style.width      = active ? '24px' : '8px';
        dot.style.borderRadius = '4px';
      });
    }

    // Active slide class
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === this.current);
    });

    if (this.opts.onChange) this.opts.onChange(this.current);
  }

  goTo(index) {
    if (this.opts.loop) {
      this.current = ((index % this.totalSlides) + this.totalSlides) % this.totalSlides;
    } else {
      this.current = Math.max(0, Math.min(index, this.totalSlides - 1));
    }
    this._updateUI();
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.timer = setInterval(() => this.next(), this.opts.autoplayDelay);
  }

  pause() {
    clearInterval(this.timer);
    this.isPlaying = false;
  }

  destroy() {
    this.pause();
    // Remove injected dots/arrows
    this.container.querySelectorAll('.slider-dots, .slider-arrow')
      .forEach(el => el.remove());
  }
}

/* ══════════════════════════════════════
   TESTIMONIAL SLIDER INIT
══════════════════════════════════════ */
function initTestimonialSlider() {
  const wrap = document.querySelector('.testimonial-slider');
  if (!wrap) return;

  wrap.style.position   = 'relative';
  wrap.style.overflow   = 'hidden';

  return new Slider('.testimonial-slider', {
    autoplay:      true,
    autoplayDelay: 5000,
    loop:          true,
    dots:          true,
    arrows:        true,
    swipe:         true,
    perView:       window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1,
    gap:           24,
  });
}

/* ══════════════════════════════════════
   HERO SLIDER / HERO TYPED ROLES
══════════════════════════════════════ */
function initHeroTyped() {
  const el = document.querySelector('[data-typed]');
  if (!el) return;

  const words = el.dataset.typed.split(',').map(w => w.trim());
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 50;
  const PAUSE_END      = 1800;
  const PAUSE_START    = 400;

  function type() {
    const current = words[wordIdx];

    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
    } else {
      el.textContent = current.slice(0, ++charIdx);
    }

    let speed = deleting ? DELETING_SPEED : TYPING_SPEED;

    if (!deleting && charIdx === current.length) {
      deleting = true;
      speed    = PAUSE_END;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      speed    = PAUSE_START;
    }

    setTimeout(type, speed);
  }

  // Only run if reduced motion is not preferred
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    type();
  } else {
    el.textContent = words[0];
  }
}

/* ══════════════════════════════════════
   CLIENTS LOGO SLIDER (marquee duplicate)
══════════════════════════════════════ */
function initLogoMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Duplicate items for seamless loop
  const items = [...track.children];
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTestimonialSlider();
  initHeroTyped();
  initLogoMarquee();

  // Expose Slider globally for custom usage
  window.PortfolioSlider = Slider;
});

// Update perView on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Re-init sliders if needed (simple approach: reload if layout changes)
    const sliders = document.querySelectorAll('.slider-wrap');
    sliders.forEach(s => {
      // Custom event for external listeners
      s.dispatchEvent(new CustomEvent('slider:resize'));
    });
  }, 300);
});
