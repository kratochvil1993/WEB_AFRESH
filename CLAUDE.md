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
- `index.html` — single page, currently the entire site (hero, about, stats, offerings, contact/CTA, footer).
- `css/style.css` — all custom styling. Theme colors, spacing and other design tokens are defined as CSS custom properties in `:root` at the top of the file (`--bg`, `--accent`, `--accent2`, `--text`, `--text-dim`, `--line`, etc.) — change the look of the site by editing these variables, not by hardcoding colors inline.
- `js/main.js` — vanilla JS, currently just an `IntersectionObserver` that toggles the active nav link based on scroll position. Add new behavior here as plain DOM APIs, no framework.
- `assets/logo.jpg` — group logo (black circle, white `/FR_SH` mark on a white square background). It's displayed clipped to a circle via `border-radius: 50%` in CSS (`.logo-badge`) to remove the white corners — don't re-crop the source file for this.
- `assets/photos/` — real event/performance photos used on the page (hero visual, about section). Sourced and cropped from `_PODKLADY/`.
- `_PODKLADY/` — raw source photos from the client's Instagram/Facebook. **Git-ignored** (see `.gitignore`) — do not commit files from here directly; copy/crop into `assets/` when actually used on the page.

## Design system

- Dark theme only for now (`--bg: #0a0a0a`). Accent colors: red/pink (`--accent: #ff2d55`) and yellow (`--accent2: #ffd400`).
- Display headings use the **Anton** Google Font (`.display` class, uppercase, tight tracking); body copy uses **Inter**. Both loaded via `<link>` in `index.html`, not self-hosted.
- Visual language is inspired by professional dance-crew sites: bold oversized typography, high contrast, a marquee/ticker strip of dance styles, diagonal/layered image blocks in the "about" section.

## Known gaps (see PROJECT.md for the full list)

- Mobile/tablet responsiveness is not yet tuned — only the desktop layout has been designed in detail.
- The contact CTA button has no real action yet (candidate: Netlify Forms).
