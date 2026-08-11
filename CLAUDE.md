# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML portfolio website for Satheesh Karnatakapu — 22 HTML pages, one CSS file, one JS file. No build tools, no npm, no frameworks. Open any `.html` file directly in a browser to preview.

## Architecture

```
/
├── index.html          # Homepage (reference template for nav/footer structure)
├── [20 other pages].html
├── css/style.css       # All styles (1,605 lines)
├── js/main.js          # All JavaScript (82 lines)
└── images/             # Award photos named award_NNNN.jpg
```

## Critical: Navigation Updates

Every page shares the **same nav HTML**. When the navigation changes (new link, renamed section, new page), **all 22 HTML files must be updated** — both the desktop nav dropdowns and the mobile menu panel. Use the `/new-page` skill when adding pages, as it handles this automatically.

Nav structure: four dropdowns (About, Work, People) + three direct links (Journey, Projects, Dream Port) + Connect CTA button.

## Design System

CSS custom properties are defined at the top of `css/style.css`:

- **Colors:** `--navy`, `--navy-mid`, `--navy-light`, `--navy-pale` | `--gold`, `--gold-light` | `--accent`, `--accent-light`
- **Text:** `--text`, `--text-mid`, `--text-light` | `--border`, `--border-dark`
- **Fonts:** `Plus Jakarta Sans` (body) + `Fraunces` (serif headings) — loaded via Google Fonts CDN

Always use CSS variables rather than hardcoded values.

## Page Structure Pattern

```html
<header> <!-- Fixed navbar, same across all pages -->
<main>
  <section class="reveal"> <!-- Sections animate in via IntersectionObserver -->
  ...
</main>
<footer> <!-- Social links, same across all pages -->
```

Add `class="reveal"` to new sections for scroll-based fade-in animation.

## JavaScript Patterns (`js/main.js`)

- **Reveal on scroll** — IntersectionObserver watches `.reveal` and `.tl-item` elements
- **Counter animation** — `animateCounter()` used for impact stats (triggered when `.impact` section is visible)
- **Gallery filtering** — `filterGallery(category)` shows/hides `.gallery-item` elements by `data-category`
- **Mobile menu** — hamburger toggle with outside-click close

## External Dependencies

- **Google Fonts CDN** — Plus Jakarta Sans + Fraunces (in every page `<head>`)
- **Behold.so widget** — Instagram feed embed (`https://w.behold.so/widget.js`) used on `media.html`
