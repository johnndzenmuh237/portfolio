# Portfolio Pro Template

**A professional, fully-featured portfolio template for freelancers and creatives.**  
Pure HTML · CSS · Vanilla JS — no frameworks, no build tools, no dependencies.

---

## ✨ At a Glance

| Feature | Detail |
|---|---|
| **Pages** | 10 (Home, About, Projects, Project Single, Services, Blog, Blog Single, Testimonials, Contact, 404) |
| **CSS Files** | 5 (Core, Responsive, Animations, Dark Mode, Themes) |
| **JS Files** | 5 (Main, Portfolio Filter, Slider, Contact Form, Dark Mode) |
| **Color Themes** | 6 built-in + fully customizable |
| **Dark/Light Mode** | ✅ Persistent via localStorage |
| **Dependencies** | 0 (Google Fonts only, optional) |
| **Build Step** | None required |
| **Browser Support** | All modern browsers (Chrome, Firefox, Safari, Edge) |

---

## 🎯 Who Is This For?

This template is designed for:

- **Web Designers** — Showcase UI/UX case studies with full-page project layouts
- **Developers** — Clean code blocks, GitHub links, tech stack badges
- **UI/UX Designers** — Portfolio filtering, lightbox, process documentation
- **Graphic Designers** — Full-bleed imagery, gallery grid, editorial typography
- **Digital Marketers** — Metrics display, client logos, testimonials
- **Agencies** — Multi-service layout, team-ready, pricing tables
- **Photographers** — Lightbox gallery, editorial cover images
- **Content Creators** — Integrated blog with newsletter signup
- **Personal Brands** — Custom typing animation, social links, About timeline

---

## 📁 File Structure

```
portfolio-pro-template/
│
├── index.html              ← Homepage with hero, work preview, testimonials
├── about.html              ← Story, skills, experience timeline
├── projects.html           ← Filterable portfolio grid
├── project-single.html     ← Full case study with gallery
├── services.html           ← Services grid + pricing table
├── blog.html               ← Blog listing with category filter
├── blog-single.html        ← Full article with sidebar
├── testimonials.html       ← Client reviews with stats
├── contact.html            ← Contact form with validation
├── 404.html                ← Custom error page
│
├── assets/
│   ├── css/
│   │   ├── style.css         ← Core styles, CSS variables, all components
│   │   ├── responsive.css    ← Mobile-first breakpoints (1200/1024/768/480/360px)
│   │   ├── animations.css    ← Scroll-triggered reveal animations
│   │   ├── dark-mode.css     ← Light mode overrides, toggle button styles
│   │   └── themes.css        ← 6 color themes (default/ocean/forest/rose/amber/mono)
│   │
│   ├── js/
│   │   ├── main.js           ← Preloader, navbar, cursor, counters, parallax
│   │   ├── portfolio-filter.js ← Filter, lightbox, lazy loading, tilt effect
│   │   ├── slider.js         ← Testimonial slider, typed text, marquee
│   │   ├── contact-form.js   ← Validation, submission, newsletter
│   │   └── darkmode.js       ← Theme persistence, system preference, switcher
│   │
│   ├── images/               ← Your images (see Assets Guide)
│   │   ├── logo/             ← logo.svg, favicon.png, apple-touch-icon.png
│   │   ├── hero/             ← hero-photo.jpg, about-photo.jpg
│   │   ├── projects/         ← project-1.jpg … project-9.jpg + hero/gallery
│   │   ├── testimonials/     ← client-1.jpg … client-6.jpg
│   │   ├── blog/             ← blog-1.jpg … blog-6.jpg
│   │   ├── clients/          ← Client logo PNGs (transparent)
│   │   └── icons/            ← Custom SVG icons (optional)
│   │
│   └── fonts/                ← Self-hosted fonts (optional, see docs)
│
├── documentation/
│   ├── installation.html     ← Setup guide, deployment instructions
│   ├── customization.html    ← Colors, fonts, themes, JS config
│   └── assets-guide.html     ← Image specs, optimization, formats
│
└── README.md
```

---

## 🚀 Quick Start

### 1. Download & open
No npm install. No build step. Just open the folder.

### 2. Add your images
Place your photos in `assets/images/` following the naming convention in the [Assets Guide](documentation/assets-guide.html).

### 3. Replace placeholder text
Find and replace all `[Your Name]`, `[YN]`, `[Your City]`, and `hello@yourdomain.com` placeholders in every HTML file.

**VS Code shortcut:** `Ctrl+Shift+H` → Find across all files.

### 4. Customize your colors
Open `assets/css/style.css` and edit the CSS variables in `:root`:
```css
--clr-accent:   #7B5EF6;  /* Your primary brand color */
--clr-accent-2: #5BE8C8;  /* Your secondary / gradient color */
```

### 5. Connect your contact form
Add your Formspree or Netlify endpoint to the form:
```html
<form id="contact-form" data-endpoint="https://formspree.io/f/YOUR_ID">
```

### 6. Deploy
Drag the folder to [netlify.com/drop](https://app.netlify.com/drop) — live in 30 seconds.

---

## 🎨 Customization

### Color Themes
Six built-in themes, applied via `data-theme` on `<html>`:

```html
<html data-theme="ocean">   <!-- Blue / Cyan -->
<html data-theme="forest">  <!-- Emerald / Lime -->
<html data-theme="rose">    <!-- Pink / Coral -->
<html data-theme="amber">   <!-- Gold / Red -->
<html data-theme="mono">    <!-- Pure Grayscale -->
```

### Dark / Light Mode
Default is dark. Users can toggle via the navbar button (preference saved to localStorage).

To default to light mode, add the class to `<body>`:
```html
<body class="light-mode">
```

### Fonts
Three font variables — change any of them in `style.css`:
```css
--font-display: 'Syne', sans-serif;       /* Headings */
--font-body:    'Inter', sans-serif;       /* Body text */
--font-mono:    'JetBrains Mono', monospace; /* Labels, code */
```

---

## ⚙️ JavaScript Features

| Feature | How to Use |
|---|---|
| **Scroll animations** | Add `data-animate="fade-up"` to any element |
| **Stagger children** | Add `data-stagger` to a parent element |
| **Counter animation** | Add `data-count="120" data-suffix="+"` |
| **Typed text** | Add `data-typed="Designer,Developer,Creator"` |
| **Skill bars** | Add `data-pct="85"` to `.skill-bar-fill` |
| **Portfolio filter** | Add `data-category="web, branding"` to cards |
| **Lightbox** | Add `data-lightbox="image-url.jpg"` to any `<a>` |
| **Parallax** | Add `data-parallax="0.3"` to any element |
| **Lazy loading** | Use `<img data-src="url.jpg">` |

---

## 📐 Layout System

### Grid utilities
```html
<div class="grid-2">  <!-- 2 columns -->
<div class="grid-3">  <!-- 3 columns -->
<div class="grid-4">  <!-- 4 columns -->
```

### Container widths
```html
<div class="container">     <!-- max-width: 1200px -->
<div class="container--sm"> <!-- max-width: 760px (blog, about text) -->
```

### Section spacing
```html
<section class="section">    <!-- 8rem top/bottom padding -->
<section class="section--sm"> <!-- 5rem top/bottom padding -->
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| `1200px` | Large laptop |
| `1024px` | Tablet landscape / small laptop |
| `768px` | Tablet portrait |
| `480px` | Mobile |
| `360px` | Small mobile |

All grids collapse to single column on mobile. Navigation becomes a full-screen overlay. Typography scales fluidly using `clamp()`.

---

## ♿ Accessibility

- Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`, `<aside>`)
- ARIA labels on interactive elements
- `prefers-reduced-motion` support (animations disabled)
- `:focus-visible` keyboard navigation styles
- Proper heading hierarchy (h1 → h2 → h3)
- `alt` text on all images
- Color contrast compliant (WCAG AA)
- Screen-reader-only skip link

---

## 🌐 Deployment

| Platform | Method | Free |
|---|---|---|
| **Netlify** | Drag & drop or Git integration | ✅ |
| **Vercel** | `npx vercel` or GitHub connect | ✅ |
| **GitHub Pages** | Push repo → Settings → Pages | ✅ |
| **Cloudflare Pages** | GitHub → no build command | ✅ |
| **Traditional FTP** | Upload to `public_html` | Varies |

### Recommended: Netlify
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your project folder into the browser
3. Your site is live in ~10 seconds
4. Add your custom domain in Site Settings → Domain management

---

## 📋 Checklist Before Going Live

- [ ] Replace all `[Your Name]` placeholders
- [ ] Add your real images (see [Assets Guide](documentation/assets-guide.html))
- [ ] Update `og:image` meta tag with your absolute URL
- [ ] Update canonical URL in every `<head>`
- [ ] Connect contact form to real endpoint
- [ ] Add your Google Analytics or Plausible ID (optional)
- [ ] Test on mobile, tablet, and desktop
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev) — aim for 90+
- [ ] Check all links work correctly
- [ ] Set up a custom domain + HTTPS

---

## 📖 Documentation

Full documentation lives in the `/documentation/` folder:

- **[Installation Guide](documentation/installation.html)** — Setup, local dev, deployment options
- **[Customization Guide](documentation/customization.html)** — Colors, fonts, themes, JS config, adding sections
- **[Assets Guide](documentation/assets-guide.html)** — Image specs, optimization, formats

---

## 🏗️ Technical Details

- **CSS Architecture:** Custom properties (tokens) → component styles → utilities. No preprocessors.
- **JavaScript:** Vanilla ES6 modules. `IntersectionObserver` for animations. `localStorage` for preferences. No jQuery, no GSAP, no external dependencies.
- **Performance:** Lazy images, efficient selectors, hardware-accelerated CSS transitions, skeleton preloader.
- **SEO:** Semantic HTML, Open Graph tags, Twitter Cards, canonical URLs, descriptive `alt` text.
- **Fonts:** Google Fonts with `display=swap`. Self-hosting instructions in docs.

---

## 📄 License

This template is for personal and commercial use. You may:
- ✅ Use for personal portfolio sites
- ✅ Use for client projects
- ✅ Modify and customize freely

You may not:
- ❌ Resell or redistribute the template itself
- ❌ Remove attribution from the documentation
- ❌ Claim authorship of the template

---

## 🙋 Support

- Read the [documentation](documentation/installation.html) first
- Check [Troubleshooting](documentation/installation.html#troubleshooting) for common issues
- For custom modifications beyond the docs, consider hiring the template creator

---

**Built with care for freelancers who take their craft seriously.**  
*Clean code. Beautiful design. Zero bloat.*
