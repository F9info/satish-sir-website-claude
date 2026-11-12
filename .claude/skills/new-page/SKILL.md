---
name: new-page
description: Add a new HTML page to the site with the shared nav, footer and meta tags wired up through build.js. Use when asked to create or add a page.
---

# Add a new page

Arguments: the page name or topic, and optionally where it belongs in the nav.

## Steps

1. **Settle the basics.** Pick a lowercase filename with no spaces (`example.html`). If the user did not say whether the page should appear in the nav, and under which group, ask.

2. **Create the page** by copying the skeleton of a similar existing page (`awards.html` is a simple one). It must contain, in order:
   - the standard `<head>`: charset, viewport, `<title>Page — Satheesh Karnatakapu</title>`, the Google Fonts links, `css/style.css`. Do not write a meta block by hand. Include the Behold widget script only if the page embeds the Instagram feed.
   - an optional page-specific `<style>` block, with a short class prefix unique to the page
   - `<!-- @@nav:start -->` and `<!-- @@nav:end -->` on consecutive lines
   - the page content as `<section class="reveal">` blocks, with no `<main>` tags (the partials supply them)
   - `<!-- @@footer:start -->` and `<!-- @@footer:end -->` on consecutive lines
   - `<script src="js/main.js"></script>`

3. **Add a meta entry** to `partials/meta.json` keyed by the filename, with `description`, `og_title`, `og_description` and `canonical` (`https://satheesh.info/<file>`).

4. **Add nav links, if wanted,** in `partials/nav.html` — in both the desktop dropdown and the matching mobile `mob-group`. Mobile links need `onclick="closeMob()"`. Add a footer link in `partials/footer.html` only if asked.

5. **Build:** run `node build.js`. Run it a second time and confirm every file is `skipped`.

6. **Verify:** `git diff --stat` should show the new page, the partials you edited, and (if the nav changed) every page. Serve with `python3 -m http.server 8000` and check the page at desktop and 375px widths.

7. **Update `CLAUDE.md`** if the page count or nav structure changed.

## Rules

- Use CSS variables from `css/style.css`, never hardcoded colours.
- Do not invent biographical facts, figures or quotes. Use content the user supplied, or leave a clearly marked placeholder and say so.
