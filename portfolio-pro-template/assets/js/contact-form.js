/**
 * PORTFOLIO PRO TEMPLATE — contact-form.js
 * Full-featured contact form: validation, submission,
 * honeypot anti-spam, character counter, file upload preview.
 * Works with Netlify Forms, Formspree, and custom backends.
 */

'use strict';

/* ══════════════════════════════════════
   VALIDATION RULES
══════════════════════════════════════ */
const RULES = {
  required: (val) => val.trim() !== '' || 'This field is required.',
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) || 'Please enter a valid email address.',
  minLength: (min) => (val) => val.trim().length >= min || `Must be at least ${min} characters.`,
  maxLength: (max) => (val) => val.trim().length <= max || `Cannot exceed ${max} characters.`,
  phone: (val) => !val || /^[+\d\s\-().]{7,20}$/.test(val.trim()) || 'Please enter a valid phone number.',
  url: (val) => !val || /^https?:\/\/.+/.test(val.trim()) || 'Please enter a valid URL (https://...).',
};

/* ══════════════════════════════════════
   CONTACT FORM INIT
══════════════════════════════════════ */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const submitBtn   = form.querySelector('[type="submit"]');
  const statusEl    = form.querySelector('.form-status');
  const inputs      = [...form.querySelectorAll('input, textarea, select')];

  // Validation config per field (name → array of rule fns)
  const fieldRules = {
    name:    [RULES.required, RULES.minLength(2), RULES.maxLength(80)],
    email:   [RULES.required, RULES.email],
    phone:   [RULES.phone],
    subject: [RULES.required, RULES.minLength(4), RULES.maxLength(120)],
    message: [RULES.required, RULES.minLength(20), RULES.maxLength(2000)],
    budget:  [],
    website: [RULES.url],
  };

  /* ── Per-field validation ── */
  function validateField(input) {
    const name   = input.name;
    const value  = input.value;
    const rules  = fieldRules[name] || [];
    let   error  = '';

    for (const rule of rules) {
      const result = rule(value);
      if (result !== true) { error = result; break; }
    }

    setFieldState(input, error);
    return error === '';
  }

  function setFieldState(input, error) {
    const wrapper = input.closest('.form-group') || input.parentElement;
    let errEl = wrapper.querySelector('.field-error');

    if (error) {
      input.style.borderColor = '#ef4444';
      input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'field-error';
        errEl.style.cssText = `
          display:block;color:#ef4444;font-size:0.75rem;
          margin-top:4px;font-family:var(--font-mono);
        `;
        wrapper.appendChild(errEl);
      }
      errEl.textContent = error;
    } else {
      input.style.borderColor = '#22c55e';
      input.style.boxShadow   = '0 0 0 3px rgba(34,197,94,0.12)';
      if (errEl) errEl.remove();
    }
  }

  function clearFieldState(input) {
    input.style.borderColor = '';
    input.style.boxShadow   = '';
    const wrapper = input.closest('.form-group') || input.parentElement;
    const errEl   = wrapper.querySelector('.field-error');
    if (errEl) errEl.remove();
  }

  /* ── Live validation on blur ── */
  inputs.forEach(input => {
    if (!input.name) return;

    input.addEventListener('blur', () => validateField(input));

    input.addEventListener('input', () => {
      // Clear error while typing (re-validate on blur)
      if (input.style.borderColor === 'rgb(239, 68, 68)') {
        validateField(input);
      }
    });

    // Clear green state when focused again
    input.addEventListener('focus', () => {
      if (input.style.borderColor !== 'rgb(239, 68, 68)') {
        clearFieldState(input);
      }
    });
  });

  /* ── Character counter for textarea ── */
  const textarea = form.querySelector('textarea[name="message"]');
  if (textarea) {
    const maxLen  = 2000;
    const counter = document.createElement('span');
    counter.style.cssText = `
      display:block;text-align:right;font-size:0.7rem;
      font-family:var(--font-mono);color:var(--clr-text-faint);
      margin-top:4px;transition:color 0.2s;
    `;
    textarea.parentElement.appendChild(counter);

    function updateCounter() {
      const len  = textarea.value.length;
      const left = maxLen - len;
      counter.textContent = `${len} / ${maxLen}`;
      counter.style.color = left < 100
        ? (left < 20 ? '#ef4444' : '#f59e0b')
        : 'var(--clr-text-faint)';
    }

    textarea.addEventListener('input', updateCounter);
    updateCounter();
  }

  /* ── Honeypot (hidden field anti-spam) ── */
  const honeypot = form.querySelector('[name="_honey"]');

  /* ── Submit handler ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot && honeypot.value) return;

    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
      if (input.name && !validateField(input)) isValid = false;
    });

    if (!isValid) {
      showStatus('error', 'Please fix the highlighted errors before submitting.');
      // Scroll to first error
      const firstError = form.querySelector('[style*="rgb(239, 68, 68)"]');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Disable button & show loading
    setSubmitLoading(true);
    hideStatus();

    const formData = new FormData(form);
    const endpoint = form.dataset.endpoint || form.action || '#';

    try {
      // ── Formspree / Netlify / custom endpoint ──
      if (endpoint && endpoint !== '#') {
        const res = await fetch(endpoint, {
          method: 'POST',
          body:   formData,
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          showStatus('success', '✓ Message sent! I\'ll get back to you within 24 hours.');
          form.reset();
          inputs.forEach(clearFieldState);
          if (textarea) { textarea.dispatchEvent(new Event('input')); }
        } else {
          const data = await res.json();
          const msg  = data?.errors?.map(e => e.message).join(', ')
                    || 'Something went wrong. Please try again.';
          showStatus('error', msg);
        }
      } else {
        // Demo mode — simulate success
        await new Promise(r => setTimeout(r, 1200));
        showStatus('success', '✓ Message sent! I\'ll get back to you within 24 hours.');
        form.reset();
        inputs.forEach(clearFieldState);
      }
    } catch (err) {
      showStatus('error', 'Network error. Please check your connection and try again.');
      console.error('Form submission error:', err);
    } finally {
      setSubmitLoading(false);
    }
  });

  /* ── Helpers ── */
  function setSubmitLoading(loading) {
    submitBtn.disabled = loading;
    if (loading) {
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          style="animation:spin 0.7s linear infinite;">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Sending…
      `;
    } else {
      submitBtn.innerHTML = submitBtn.dataset.originalText || 'Send Message';
    }
  }

  function showStatus(type, msg) {
    if (!statusEl) return;
    statusEl.className  = `form-status ${type}`;
    statusEl.textContent = msg;
    statusEl.style.display = 'block';
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideStatus() {
    if (!statusEl) return;
    statusEl.style.display = 'none';
    statusEl.textContent   = '';
  }

  // Inject spin keyframes
  if (!document.querySelector('#form-spin-style')) {
    const style = document.createElement('style');
    style.id    = 'form-spin-style';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
}

/* ══════════════════════════════════════
   NEWSLETTER FORM
══════════════════════════════════════ */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');

  forms.forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');
    const btn        = form.querySelector('button');
    const msg        = form.querySelector('.newsletter-msg');

    if (!emailInput || !btn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.style.borderColor = '#ef4444';
        if (msg) { msg.textContent = 'Please enter a valid email.'; msg.style.color = '#ef4444'; }
        return;
      }

      btn.disabled = true;
      btn.textContent = '…';

      try {
        const endpoint = form.dataset.endpoint || '#';
        if (endpoint !== '#') {
          await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          await new Promise(r => setTimeout(r, 800));
        }

        emailInput.value       = '';
        emailInput.style.borderColor = '#22c55e';
        btn.textContent        = '✓ Subscribed!';
        btn.style.background   = '#22c55e';
        if (msg) { msg.textContent = 'You\'re on the list!'; msg.style.color = '#22c55e'; }

        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = 'Subscribe';
          btn.style.background  = '';
          emailInput.style.borderColor = '';
        }, 4000);

      } catch {
        if (msg) { msg.textContent = 'Error. Try again.'; msg.style.color = '#ef4444'; }
        btn.disabled = false;
        btn.textContent = 'Subscribe';
      }
    });
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initNewsletterForm();
});
