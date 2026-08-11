// build.js — inject partials into all HTML pages
// Usage: node build.js
//
// Placeholders in HTML files:
//   <!-- @@nav:start --> ... <!-- @@nav:end -->
//   <!-- @@footer:start --> ... <!-- @@footer:end -->
//   <!-- @@<name>:start --> ... <!-- @@<name>:end -->  (any custom partial)
//
// Meta tags (description, OG, canonical) are driven by partials/meta.json
// and injected automatically after each page's <title> tag.
//
// On first run: wraps existing <!-- NAV --> and <!-- FOOTER --> blocks with markers.
// On subsequent runs: replaces content between existing markers.

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PARTIALS_DIR = path.join(ROOT, 'partials');

// Load all partials from partials/ directory
function loadPartials() {
  const partials = {};
  if (!fs.existsSync(PARTIALS_DIR)) return partials;
  for (const file of fs.readdirSync(PARTIALS_DIR)) {
    if (file.endsWith('.html')) {
      const name = path.basename(file, '.html');
      partials[name] = fs.readFileSync(path.join(PARTIALS_DIR, file), 'utf8').trim();
    }
  }
  return partials;
}

// Replace content between <!-- @@name:start --> and <!-- @@name:end --> markers
function replaceMarkers(content, name, partial) {
  const start = `<!-- @@${name}:start -->`;
  const end = `<!-- @@${name}:end -->`;
  const regex = new RegExp(`${escRe(start)}[\\s\\S]*?${escRe(end)}`);
  return content.replace(regex, `${start}\n${partial}\n${end}`);
}

// Wrap original nav block with markers — handles all page variants
function wrapNav(content, partial) {
  const start = `<!-- @@nav:start -->`;
  const end = `<!-- @@nav:end -->`;
  // nav-mobile always closes with exactly "  </div>\n</div>\n" (2-space inner + 0-space outer)
  const tail = `  <\\/div>\\n<\\/div>\\n`;
  const withComment = new RegExp(`<!-- NAV -->[\\s\\S]*?${tail}`);
  const withoutComment = new RegExp(`<nav id="navbar">[\\s\\S]*?${tail}`);
  if (withComment.test(content)) {
    return content.replace(withComment, `${start}\n${partial}\n${end}\n`);
  }
  if (withoutComment.test(content)) {
    return content.replace(withoutComment, `${start}\n${partial}\n${end}\n`);
  }
  return content;
}

// Wrap original footer block (<!-- FOOTER --> ... </footer>) with markers
function wrapFooter(content, partial) {
  const start = `<!-- @@footer:start -->`;
  const end = `<!-- @@footer:end -->`;
  const original = /<!-- FOOTER -->[\s\S]*?<\/footer>/;
  if (original.test(content)) {
    return content.replace(original, `${start}\n${partial}\n${end}`);
  }
  return content;
}

function escRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Load per-page meta data from partials/meta.json
function loadMeta() {
  const metaPath = path.join(PARTIALS_DIR, 'meta.json');
  if (!fs.existsSync(metaPath)) return {};
  return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
}

// Build the meta block HTML for a given page
function buildMetaBlock(pageMeta) {
  const { description, og_title, og_description, canonical } = pageMeta;
  return [
    `<meta name="description" content="${description}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${og_title}">`,
    `<meta property="og:description" content="${og_description}">`,
    `<meta property="og:image" content="https://satheesh.info/images/award_1103.jpg">`,
    `<link rel="canonical" href="${canonical}">`,
  ].join('\n');
}

// Inject or replace meta block after <title> tag
function injectMeta(content, metaBlock) {
  const marker = '<!-- @@meta -->';
  // If marker already exists, replace the line
  if (content.includes(marker)) {
    return content.replace(
      /<!-- @@meta -->[\s\S]*?<!-- @@meta:end -->/,
      `${marker}\n${metaBlock}\n<!-- @@meta:end -->`
    );
  }
  // Otherwise inject after closing </title>
  return content.replace(
    /(<\/title>)/,
    `$1\n${marker}\n${metaBlock}\n<!-- @@meta:end -->`
  );
}

function main() {
  const partials = loadPartials();
  const meta = loadMeta();

  if (Object.keys(partials).length === 0) {
    console.error('No partials found in partials/ directory.');
    process.exit(1);
  }
  console.log(`Loaded partials: ${Object.keys(partials).join(', ')}`);
  console.log(`Loaded meta for: ${Object.keys(meta).length} pages\n`);

  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let updated = 0;

  for (const file of htmlFiles) {
    const filePath = path.join(ROOT, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Inject nav/footer partials
    for (const [name, partial] of Object.entries(partials)) {
      const startMarker = `<!-- @@${name}:start -->`;
      if (content.includes(startMarker)) {
        content = replaceMarkers(content, name, partial);
      } else if (name === 'nav') {
        content = wrapNav(content, partial);
      } else if (name === 'footer') {
        content = wrapFooter(content, partial);
      }
    }

    // Inject meta tags
    if (meta[file]) {
      content = injectMeta(content, buildMetaBlock(meta[file]));
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      updated++;
      console.log(`  updated  ${file}`);
    } else {
      console.log(`  skipped  ${file}`);
    }
  }

  console.log(`\nDone. ${updated}/${htmlFiles.length} files updated.`);
}

main();
