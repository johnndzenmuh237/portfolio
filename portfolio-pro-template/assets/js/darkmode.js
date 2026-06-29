/**
 * PORTFOLIO PRO TEMPLATE — darkmode.js
 * Dark/Light mode + Color theme switcher.
 * Persists preference in localStorage. Respects system preference.
 */

'use strict';

/* ══════════════════════════════════════
   CONSTANTS
══════════════════════════════════════ */
const STORAGE_KEY_MODE  = 'ppt-color-mode';   // 'dark' | 'light'
const STORAGE_KEY_THEME = 'ppt-color-theme';  // 'default' | 'ocean' | etc.
const TRANSITION_CLASS  = 'mode-transitioning';
const TRANSITION_MS     = 380;

/* ══════════════════════════════════════
   DARK / LIGHT MODE
══════════════════════════════════════ */
function initDarkMode() {
  const html   = document.documentElement;
  const body   = document.body;
  const toggles = document.querySelectorAll('.theme-icon-btn, .dark-mode-toggle, [data-darkmode-toggle]');

  /* ── Determine initial mode ── */
  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function getSavedMode() {
    return localStorage.getItem(STORAGE_KEY_MODE);
  }

  function applyMode(mode, animate = false) {
    if (animate) {
      body.classList.add(TRANSITION_CLASS);
      setTimeout(() => body.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
    }

    if (mode === 'light') {
      body.classList.add('light-mode');
      html.setAttribute('data-mode', 'light');
    } else {
      body.classList.remove('light-mode');
      html.setAttribute('data-mode', 'dark');
    }

    // Update toggles
    toggles.forEach(toggle => {
      if (toggle.classList.contains('dark-mode-toggle')) {
        toggle.classList.toggle('on', mode === 'dark');
        toggle.setAttribute('aria-pressed', mode === 'dark');
      }
      toggle.setAttribute('aria-label',
        mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    });

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = mode === 'light' ? '#F7F7FA' : '#0C0C0F';
    }
  }

  /* ── Toggle ── */
  function toggleMode() {
    const current = getSavedMode() || (body.classList.contains('light-mode') ? 'light' : 'dark');
    const next    = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY_MODE, next);
    applyMode(next, true);
  }

  /* ── Init ── */
  const savedMode = getSavedMode() || getSystemPreference();
  applyMode(savedMode, false);

  // Bind toggles
  toggles.forEach(toggle => {
    toggle.addEventListener('click', toggleMode);
  });

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    // Only follow system if user hasn't manually set preference
    if (!getSavedMode()) {
      applyMode(e.matches ? 'light' : 'dark', true);
    }
  });

  // Expose for external use
  window.PortfolioTheme = window.PortfolioTheme || {};
  window.PortfolioTheme.setMode  = (mode) => { localStorage.setItem(STORAGE_KEY_MODE, mode); applyMode(mode, true); };
  window.PortfolioTheme.getMode  = () => getSavedMode() || getSystemPreference();
  window.PortfolioTheme.toggle   = toggleMode;
}

/* ══════════════════════════════════════
   COLOR THEME SWITCHER
══════════════════════════════════════ */
function initThemeSwitcher() {
  const html     = document.documentElement;
  const swatches = document.querySelectorAll('.theme-swatch');
  if (!swatches.length) return;

  function applyTheme(theme, animate = false) {
    if (animate) {
      document.body.classList.add(TRANSITION_CLASS);
      setTimeout(() => document.body.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
    }

    html.setAttribute('data-theme', theme);

    swatches.forEach(s => {
      s.classList.toggle('active', s.dataset.themeValue === theme);
    });
  }

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'default';
  }

  // Init
  applyTheme(getSavedTheme(), false);

  // Bind
  swatches.forEach(swatch => {
    const themeVal = swatch.dataset.themeValue;
    if (!themeVal) return;
    swatch.setAttribute('aria-label', `Switch to ${themeVal} theme`);
    swatch.setAttribute('role', 'button');
    swatch.setAttribute('tabindex', '0');

    swatch.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY_THEME, themeVal);
      applyTheme(themeVal, true);
    });

    swatch.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        swatch.click();
      }
    });
  });

  // Expose
  window.PortfolioTheme = window.PortfolioTheme || {};
  window.PortfolioTheme.setTheme = (theme) => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    applyTheme(theme, true);
  };
  window.PortfolioTheme.getTheme = getSavedTheme;
}

/* ══════════════════════════════════════
   SYSTEM PREFERENCE BANNER (optional)
   Shows a "Switch to light mode?" nudge
   when user's OS is in light mode but
   the site is showing dark.
══════════════════════════════════════ */
function initModeSuggestion() {
  // Opt-in: add data-mode-suggest to any element
  const suggestionEl = document.querySelector('[data-mode-suggest]');
  if (!suggestionEl) return;

  const saved  = localStorage.getItem(STORAGE_KEY_MODE);
  if (saved) return; // User already made a choice

  const isSystemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isBodyDark    = !document.body.classList.contains('light-mode');

  if (isSystemLight && isBodyDark) {
    setTimeout(() => {
      suggestionEl.style.display = 'block';
    }, 3000);

    const acceptBtn = document.querySelector('[data-mode-suggest-accept]');
    const dismissBtn = document.querySelector('[data-mode-suggest-dismiss]');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        window.PortfolioTheme?.setMode('light');
        suggestionEl.style.display = 'none';
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY_MODE, 'dark');
        suggestionEl.style.display = 'none';
      });
    }
  }
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
// Run ASAP to prevent flash of wrong theme
(function earlyThemeApply() {
  try {
    const savedMode  = localStorage.getItem(STORAGE_KEY_MODE);
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);

    if (savedMode === 'light') document.body.classList.add('light-mode');
    if (savedTheme && savedTheme !== 'default') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  } catch (e) { /* localStorage unavailable */ }
})();

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initThemeSwitcher();
  initModeSuggestion();
});
