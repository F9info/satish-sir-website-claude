# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

Static HTML portfolio website for Satheesh Karnatakapu (live at `satheesh.info`) — 22 HTML pages, one shared CSS file, one shared JS file. No npm, no frameworks. Open any `.html` file directly in a browser to preview.

The only tooling is `build.js`, a dependency-free Node script that stamps shared partials into every page.

## Architecture

```
/
├── index.html            # Homepage
├── [21 other pages].html
├── build.js              # Injects partials + meta tags into every page
├── partials/
│   ├── nav.html          # Skip link, navbar, mobile menu, opening <main>
│   ├── footer.html       # Closing </main> and the footer
│   └── meta.json         # Per-page description / Open Graph / canonical
├── css/style.css         # Shared styles (design tokens at the top)
├── js/main.js            # Shared JavaScript
└── images/               # Photos; awards are named award_NNNN.jpg
```

## Critical: shared nav, footer and meta are generated

Never hand-edit anything between these markers in a page — it is overwritten on the next build:

- `<!-- @@nav:start -->` … `<!-- @@nav:end -->`
- `<!-- @@footer:start -->` … `<!-- @@footer:end -->`
- `<!-- @@meta -->` … `<!-- @@meta:end -->`

Instead, edit `partials/nav.html`, `partials/footer.html` or `partials/meta.json`, then run:

```bash
node build.js
```

Then check `git diff --stat` — only the pages you expected should change. The build is idempotent: a second run should report every file as `skipped`.

Things to know:

- `partials/nav.html` contains both the desktop dropdowns and the mobile menu panel. A nav change must be made in both.
- The nav partial opens `<main id="main-content">` and the footer partial closes it. Page content sits between the two marker blocks and must not add its own `<main>` tags.
- `f9tech.html`, `kalamdreamlabs.html` and `projects.html` deliberately have their own minimal footer (no footer markers). Leave those alone unless asked.
- A page with no entry in `partials/meta.json` gets no meta block. Every new page needs an entry.
- Use the `/new-page` skill when adding a page.

Nav structure: four dropdowns (About, Work, People, Connect) + three direct links (Journey, Projects, Dream Port). Connect is the CTA button.

## Design System

CSS custom properties are defined at the top of `css/style.css`:

- **Colors:** `--navy`, `--navy-mid`, `--navy-light`, `--navy-pale`, `--navy-subtle` | `--gold`, `--gold-light`, `--gold-accessible` (use this one for gold text on white) | `--accent`, `--accent-light`
- **Text:** `--text`, `--text-mid`, `--text-light` | `--border`, `--border-dark`
- **Scales:** `--space-*` (4px base), `--shadow-sm|md|lg|xl`, radius scale
- **Fonts:** `Plus Jakarta Sans` (body) + `Fraunces` (serif headings), via Google Fonts CDN

Always use the variables rather than hardcoded values.

Most pages also carry a page-specific `<style>` block in the `<head>` with prefixed class names (for example `.t-hero` on `testimonials.html`). Put styles used by one page there; put anything shared in `css/style.css`.

## Page Structure Pattern

```html
<head> … <title>, meta block, fonts, css/style.css, optional page <style> … </head>
<body>
<!-- @@nav:start --> … <!-- @@nav:end -->      (generated)
  <section class="reveal"> … </section>         (page content)
<!-- @@footer:start --> … <!-- @@footer:end --> (generated)
<script src="js/main.js"></script>
</body>
```

Add `class="reveal"` to new sections for the scroll fade-in.

## JavaScript Patterns (`js/main.js`)

- **Nav scroll state** — toggles `.scrolled` on `#navbar`
- **Reveal on scroll** — IntersectionObserver watches `.reveal` and `.tl-item`
- **Counter animation** — `animateCount()` runs on `.ic-num[data-target]` when `#impact` is visible; respects `prefers-reduced-motion`
- **Mobile menu** — hamburger toggle; `closeMob()` is called inline from mobile links
- **Gallery filtering** — shows/hides `.gallery-item` by `data-category`

The script is shared by every page, so guard any element lookup that may not exist on a page.

## Publishing rule

`master` is the published branch. Never push to `master`, merge into it, or otherwise publish without the owner's explicit permission for that specific change. Work on a separate branch, push the branch, and ask. Permission to publish one change does not cover any other change.

## Content rules

- This is a real person's public site. Do not invent facts, numbers, awards, quotes or names. If content is missing, ask or leave a clearly marked placeholder.
- Keep impact figures consistent across pages and `partials/meta.json` when one changes.
- Spelling is Indian/British English ("Organisations"); numbers use Indian grouping (`2,09,792`).

## Images

- The repo is already heavy (about 118 MB of images). Resize and compress before adding; aim for under 500 KB per photo.
- Use descriptive lowercase hyphenated filenames, meaningful `alt` text, and `loading="lazy"` below the fold.
- Only website assets belong in `images/`. Never commit documents, invoices or archives there — everything in this repo may be published.

## Verifying changes

There are no tests. Before committing:

1. Run `node build.js` twice; the second run must skip every file.
2. Preview with `python3 -m http.server 8000` and check the changed pages at desktop and mobile (375px) widths, including the hamburger menu.
3. Check that new internal links and image paths resolve.

## External Dependencies

- **Google Fonts CDN** — in every page `<head>`
- **Behold.so widget** — Instagram feed embed (`https://w.behold.so/widget.js`), used on `media.html`
