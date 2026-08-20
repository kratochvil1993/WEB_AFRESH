# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **Afresh Dance Community** (Plzeň, hip hop dance group, founded 2006), replacing the group's old Wix site. See `PROJECT.md` for full project context, content sourcing, and the outstanding TODO list.

## Commands

There is no build step, package manager, or test suite in this repository. It is a static site — open `index.html` directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`) to test relative asset paths and routing before deploying.

Deployment target is **Netlify** as a static site (drag-and-drop the folder, or connect the git repo for CI/CD). No environment variables or Netlify functions are used.

## Git workflow

Work directly on `main` — do not create feature branches or PRs for changes in this repo, unless the user explicitly asks for a branch/PR.

Never run `git commit` or `git push` without the user's explicit go-ahead in that turn. Make the requested edits and leave the working tree as-is; ask before committing/pushing rather than assuming a standing approval.

## Architecture

- Plain **HTML + CSS + vanilla JavaScript** — no framework, no bundler, no npm dependencies. Do not introduce a build pipeline or JS framework without explicit direction.
- **Bootstrap 5.3**, **Font Awesome 6 Free**, **GLightbox 3** and **Swiper 11** are vendored locally under `vendor/` (`vendor/bootstrap/bootstrap.min.css` + `bootstrap.bundle.min.js`, `vendor/fontawesome/css/all.min.css` + `vendor/fontawesome/webfonts/`, `vendor/glightbox/css/glightbox.min.css` + `vendor/glightbox/js/glightbox.min.js`, `vendor/swiper/swiper-bundle.min.css` + `swiper-bundle.min.js`) and linked with relative paths — not loaded from a CDN. This is intentional (site must keep working with no external requests for these); when upgrading versions, re-download the matching files into the same paths rather than switching back to a CDN `<link>`/`<script>` tag. Bootstrap is used for grid/layout (`container`, `row`, `col-*`) and base components, with custom visual design on top in `css/style.css`. Font Awesome icons (`fa-solid`, `fa-brands`) are used sparingly (social links, CTA arrows, highlight-card icons). GLightbox powers the photo lightbox on `galerie.html` only (`.glightbox` anchors), initialized from `js/main.js`. Swiper powers the hero image slider on `index.html` only (`.hero-swiper`), initialized from `js/main.js` (loop + autoplay + flip effect + per-slide caption text, see below).
- **Google Fonts** (Anton + Inter) are the one exception left on a CDN — loaded via `<link>` to `fonts.googleapis.com` in every page's `<head>`, by explicit choice (not self-hosted).
- **Multi-page site**, plain `.html` files at the repo root, no router: `index.html` (home), `onas.html` (o nás / about), `uspechy.html`, `galerie.html`, `videa.html`, `kontakt.html`. Each page repeats the same `<nav>` and `<footer>` markup verbatim (copy-paste, no templating) — when changing nav/footer, update all six files.
- `css/style.css` — all custom styling for every page, source of truth for CSS. Theme colors, spacing and other design tokens are defined as CSS custom properties in `:root` at the top of the file (`--bg`, `--accent`, `--accent2`, `--text`, `--text-dim`, `--line`, etc.) — change the look of the site by editing these variables, not by hardcoding colors inline. **`css/style.min.css` is a separately-maintained minified copy, and it's the one every HTML page actually `<link>`s (not `style.css`).** There is no build step that regenerates it — after editing `style.css`, hand-apply the same change to `style.min.css` (find the matching minified selector and edit it in place), or the change won't show up in the browser at all.
- `js/main.js` — vanilla JS shared by every page, each behavior behind its own guard clause (`document.querySelectorAll(...).length`, `typeof GLightbox/Swiper !== 'undefined'`, etc.) so the same script runs safely on pages that don't have the relevant elements: scroll-reveal for `[data-reveal]` elements (one-shot fade+translateY via `IntersectionObserver`, skipped in favor of an immediate `.is-visible` when `prefers-reduced-motion` is set), count-up animation for `.stat-num` values that start with a digit (e.g. `2006`, `18+` — pure-text stats like "MČR" just fade in with their `[data-reveal]` wrapper, no count-up), a navbar shrink/darken effect toggling `.is-scrolled` once `window.scrollY > 40` (rAF-throttled), GLightbox init for `galerie.html`, and the Swiper hero carousel on `index.html`. Navigation is a classic static menu — the active page link (`.nav-link.active`) is hardcoded per-page in HTML, there is no JS scrollspy. **`js/main.min.js` is a separately-maintained minified copy, and it's the one every HTML page actually `<script src>`s (not `main.js`).** Same deal as `css/style.min.css` below — there is no build step that regenerates it automatically. After editing `main.js`, regenerate it (e.g. `npx terser js/main.js --compress --mangle --output js/main.min.js`) before considering the change done, or the fix only exists in the file nobody's browser loads.
- `assets/logo.jpg` — group logo (black circle, white `/FR_SH` mark on a white square background). It's displayed clipped to a circle via `border-radius: 50%` in CSS (`.logo-badge`) to remove the white corners — don't re-crop the source file for this.
- `assets/photos/` — real event/performance photos used across the site (hero, about, úspěchy). `assets/gallery/` — photos used only on `galerie.html`, laid out as a 3-column CSS-columns masonry grid (`.gallery-grid`, 2 cols ≤991px, 1 col ≤575px) and opened in the GLightbox lightbox. Both sourced and cropped from `_PODKLADY/`. Photographic content assets are saved as **`.webp`** (via `cwebp`, q≈80–82) rather than `.jpg` for smaller file size — keep new photos in this format too. Icons/favicons (`assets/fav/`) stay PNG/ICO/SVG, since those formats are what `<link rel="icon">` needs. `assets/logo-white.png` is kept as the source file, but every page links `assets/logo-white.webp` (lossless `cwebp -lossless`, since it's a flat-color logo with transparency) — regenerate the `.webp` from the `.png` if the source ever changes.
- `_PODKLADY/` — raw source photos from the client's Instagram/Facebook. **Git-ignored** (see `.gitignore`) — do not commit files from here directly; copy/crop into `assets/` when actually used on a page.
- `_docs/` — internal project documents/notes (e.g. `TODO.md` for outstanding SEO/analytics work). **Git-ignored** (see `.gitignore`) — never committed.
- The `kontakt.html` form is wired for **Netlify Forms** (`data-netlify="true"`, hidden `form-name` input, honeypot field) — it only starts working once the site is actually deployed on Netlify; no JS submit handler is needed or present.
- `videa.html` embeds real YouTube videos via `youtube-nocookie.com/embed/<id>` iframes inside `.ratio.ratio-16x9`. The current video picks were found via web search, not confirmed against the client's own channel — verify/swap before shipping (see PROJECT.md).

## SEO / structured data

Every page has a JSON-LD `@graph` in `<head>` (organization/website, a page-specific type such as `WebPage`/`CollectionPage`, a `BreadcrumbList`, and on content-listing pages a matching `ItemList` — see `kurzy.html`, `o-nas/uspechy.html`, `o-nas/videa.html`), plus `<title>`, meta description, canonical link and OG tags. **This does not update itself — when editing page content, update the matching structured data in the same change**, otherwise it silently drifts out of sync (nothing breaks visually, so it's easy to forget):

- Add/remove/rename a page → update its own JSON-LD block, the `BreadcrumbList`/nav links on every page linking to it, and `sitemap.xml`.
- Add/remove gallery photos (`assets/gallery/`) → update the `image` array in `o-nas/galerie.html`'s JSON-LD.
- Add/remove/reorder courses, achievements or videos → update the matching `ItemList` in `kurzy.html`, `o-nas/uspechy.html` or `o-nas/videa.html`.
- Change a page's headline/description → update its `name`/`description` in JSON-LD and keep `<title>`/meta description consistent with it.

## Design system

- Dark theme only for now (`--bg: #0a0a0a`). Accent colors: red/pink (`--accent: #ff2d55`) and yellow (`--accent2: #ffd400`).
- Display headings use the **Anton** Google Font (`.display` class, uppercase, tight tracking); body copy uses **Inter**. Both loaded via `<link>` in `index.html`, not self-hosted.
- Visual language is inspired by professional dance-crew sites: bold oversized typography, high contrast, a marquee/ticker strip of dance styles, diagonal/layered image blocks in the "about" section.
- Shared motion/interaction patterns, all respecting `prefers-reduced-motion` (see `js/main.js` and the matching `css/style.css` rules): `[data-reveal]` scroll-reveal fades (`.reveal-delay-1`–`4` stagger helpers), `.stat-num` count-up, `.pill-btn` buttons (solid and `.pill-btn--outline` variants) whose icon slides across on hover/focus, and the navbar (`.navbar`) which darkens via `.is-scrolled` and shrinks its `.logo-badge` from 100px (overflowing the navbar top when unscrolled) down to 48px once the page scrolls.

## Known gaps (see PROJECT.md for the full list)

- Mobile/tablet responsiveness is not yet tuned — only the desktop layout has been designed in detail (the navbar does have a working Bootstrap collapse/hamburger for small screens).
- Video picks on `videa.html` need client confirmation (see above).
- Photos in `assets/` are not yet compressed for production.
