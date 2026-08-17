# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **Afresh Dance Community** (Plzeň, hip hop dance group, founded 2006), replacing the group's old Wix site. See `PROJECT.md` for full project context, content sourcing, and the outstanding TODO list.

## Commands

There is no build step, package manager, or test suite in this repository. It is a static site — open `index.html` directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`) to test relative asset paths and routing before deploying.

Deployment target is **Netlify** as a static site (drag-and-drop the folder, or connect the git repo for CI/CD). No environment variables or Netlify functions are used.

## Architecture

- Plain **HTML + CSS + vanilla JavaScript** — no framework, no bundler, no npm dependencies. Do not introduce a build pipeline or JS framework without explicit direction.
- **Bootstrap 5.3** is loaded via CDN in `index.html` (`<link>`/`<script>` tags) and used for grid/layout (`container`, `row`, `col-*`) and base components. All custom visual design lives on top of it in `css/style.css`.
- **Font Awesome 6 Free** is loaded via CDN for icons (`fa-solid`, `fa-brands`) — used sparingly (social links, CTA arrows, highlight-card icons).
- **Multi-page site**, plain `.html` files at the repo root, no router: `index.html` (home), `uspechy.html`, `galerie.html`, `videa.html`, `kontakt.html`. Each page repeats the same `<nav>` and `<footer>` markup verbatim (copy-paste, no templating) — when changing nav/footer, update all five files.
- `css/style.css` — all custom styling for every page, shared via `<link>`. Theme colors, spacing and other design tokens are defined as CSS custom properties in `:root` at the top of the file (`--bg`, `--accent`, `--accent2`, `--text`, `--text-dim`, `--line`, etc.) — change the look of the site by editing these variables, not by hardcoding colors inline.
- `js/main.js` — vanilla JS shared by every page: an `IntersectionObserver` that toggles the active nav link based on scroll position (home page anchor sections), and the click/keyboard-driven lightbox for `galerie.html` (`.gallery-item img` + `#lightbox` markup). Guard clauses (`if (sections.length)`, `if (galleryItems.length && lightbox)`) let the same script run safely on pages that don't have those elements.
- `assets/logo.jpg` — group logo (black circle, white `/FR_SH` mark on a white square background). It's displayed clipped to a circle via `border-radius: 50%` in CSS (`.logo-badge`) to remove the white corners — don't re-crop the source file for this.
- `assets/photos/` — real event/performance photos used across the site (hero, about, úspěchy). `assets/gallery/` — additional photos used only on `galerie.html`. Both sourced and cropped from `_PODKLADY/`.
- `_PODKLADY/` — raw source photos from the client's Instagram/Facebook. **Git-ignored** (see `.gitignore`) — do not commit files from here directly; copy/crop into `assets/` when actually used on a page.
- The `kontakt.html` form is wired for **Netlify Forms** (`data-netlify="true"`, hidden `form-name` input, honeypot field) — it only starts working once the site is actually deployed on Netlify; no JS submit handler is needed or present.
- `videa.html` embeds real YouTube videos via `youtube-nocookie.com/embed/<id>` iframes inside `.ratio.ratio-16x9`. The current video picks were found via web search, not confirmed against the client's own channel — verify/swap before shipping (see PROJECT.md).

## Design system

- Dark theme only for now (`--bg: #0a0a0a`). Accent colors: red/pink (`--accent: #ff2d55`) and yellow (`--accent2: #ffd400`).
- Display headings use the **Anton** Google Font (`.display` class, uppercase, tight tracking); body copy uses **Inter**. Both loaded via `<link>` in `index.html`, not self-hosted.
- Visual language is inspired by professional dance-crew sites: bold oversized typography, high contrast, a marquee/ticker strip of dance styles, diagonal/layered image blocks in the "about" section.

## Known gaps (see PROJECT.md for the full list)

- Mobile/tablet responsiveness is not yet tuned — only the desktop layout has been designed in detail (the navbar does have a working Bootstrap collapse/hamburger for small screens).
- Video picks on `videa.html` need client confirmation (see above).
- Photos in `assets/` are not yet compressed for production.
