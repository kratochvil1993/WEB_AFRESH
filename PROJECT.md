# Afresh Dance Community — web

Nový web pro taneční skupinu **Afresh Dance Community** (Plzeň, hip hop, založeno 2006). Nahrazuje starý web na Wixu (`afreshdc.wixsite.com/afresh`).

## Tech stack

- Čisté **HTML + CSS + vanilla JavaScript** (žádný build krok, žádný framework typu React/Vue)
- **Bootstrap 5.3** (grid, komponenty, utility classes), **Font Awesome 6**, **GLightbox 3** (lightbox v galerii) a **Swiper 11** (hero carousel na homepage) — vendorované lokálně pod `vendor/`, ne přes CDN (viz CLAUDE.md pro přesné cesty)
- Vlastní styly odděleně v `css/style.css` (přepisuje/doplňuje Bootstrap přes CSS proměnné a utility classy)
- Vlastní JS v `js/main.js` (scroll-reveal animace, count-up statistik, shrink navbaru při scrollu, inicializace GLightbox a Swiper)
- Google Fonts (Anton + Inter) zůstávají jediná výjimka na CDN, záměrně
- Cíl nasazení: **Netlify** (statický web, žádný server, žádné env proměnné potřeba pro základní verzi)
- Web bude nakonec napojen na interní **Simple CMS** — zatím obsah pouze staticky v HTML

## Struktura projektu

Web je **multi-page** — samostatné `.html` soubory, žádný router, nav a footer jsou v každém souboru zkopírované ručně.

```
index.html          domovská stránka — hero (Swiper carousel), o nás (teaser), úspěchy (teaser), nabídka, video teaser, CTA
onas.html            o nás — hero fotka s overlayem, delší text o skupině
uspechy.html          statistiky (count-up), přehled akcí a soutěží
galerie.html           masonry grid fotek s GLightbox lightboxem (klik na fotku, šipky, Esc)
videa.html              embedovaná videa z YouTube + odkaz na kanál
kontakt.html            kontaktní údaje + formulář napojený na Netlify Forms
css/style.css        veškeré vlastní styly pro všechny stránky (dark theme, typografie, sekce, galerie, formulář, pill-btn, navbar shrink)
js/main.js            vlastní JS pro všechny stránky (scroll-reveal, count-up, navbar shrink, GLightbox, Swiper — viz CLAUDE.md)
vendor/                lokálně vendorovaný Bootstrap, Font Awesome, GLightbox, Swiper (žádné CDN)
assets/logo.jpg       logo skupiny (černý kruh, bílý nápis /FR_SH)
assets/photos/         reálné fotky použité napříč stránkami (hero, o nás, úspěchy), .webp
assets/gallery/        další fotky použité jen v galerii, .webp
_PODKLADY/             zdrojové fotky a materiály od klienta — NEPOUŽÍVAT přímo ve výstupu bez úpravy, není v gitu (viz .gitignore)
```

## Design

- Tmavý dark theme (`--bg: #0a0a0a`), akcentová barva sytá červená/růžová (`--accent: #ff2d55`) + žlutá (`--accent2: #ffd400`)
- Display font **Anton** (Google Fonts) pro nadpisy, **Inter** pro běžný text
- Inspirace weby profesionálních dance crews — velká bold typografie, vysoký kontrast, diagonální/asymetrické prvky, marquee pás se styly tance
- Motion: scroll-reveal fade animace, count-up čísel ve statistikách, pill tlačítka se sliding-icon efektem, navbar/logo se zmenšují po scrollu — vše respektuje `prefers-reduced-motion` (detaily v CLAUDE.md)
- Zatím jen desktop verze — **mobilní responzivita ještě není doladěná**, i když Bootstrap grid základní chování zvládá

## Reálný obsah (ověřeno ze starého webu, soc. sítí a fotek v _PODKLADY)

- Afresh D.C. vznikla v roce 2006 v Plzni
- Styly: hip hop, house dance, new jack swing, hype
- Facebook: https://www.facebook.com/afreshdc/
- Instagram: https://www.instagram.com/afreshdancecommunity
- YouTube: https://www.youtube.com/channel/UCGvXYdfGhHmPKsKzFxShCng
- Z fotek v `_PODKLADY` je vidět účast na: TV finále MČR (O2 universum Praha), Best Dance Group European Championship (Opatija) a medaile/diplom ze soutěže — přesná umístění a roky je potřeba ověřit s klientem, na stránce `uspechy.html` jsou zatím uvedená opatrně (bez konkrétních umístění)
- Videa na `videa.html` jsou dohledaná přes web search (World of Dance Austria/Switzerland/Berlin, obecné "Vystoupení Afresh Dance Community") — **nejsou ověřená přímo z klientova kanálu**, nutno potvrdit nebo vyměnit

## Co ještě chybí / další kroky

- [ ] Doladit mobilní a tablet verzi (breakpoints, hero na mobilu, marquee na malých displejích) — nav má funkční hamburger/collapse, galerie má breakpointy na 2/1 sloupec, zbytek stránek zatím ne
- [x] Fotky převedené na `.webp` (`cwebp`, q≈80–82) — `assets/gallery/` nicméně pořád obsahuje soubory až ~500 KB/kus, zvážit další zmenšení/resize před ostrým nasazením
- [ ] Ověřit s klientem videa na `videa.html` (viz výše) a případně vyměnit za oficiální nahrávky z jejich kanálu
- [ ] Ověřit přesná umístění/roky soutěží na `uspechy.html`
- [ ] Po nasazení na Netlify zkontrolovat, že formulář na `kontakt.html` chodí (Netlify Forms se aktivuje až po prvním deployi)
- [ ] SEO: title/meta description je nastavené na každé stránce, doplnit strukturovaná data (LocalBusiness / Organization) a OG tagy pro sdílení na sociálních sítích
- [ ] Nasadit na Netlify (drag & drop složky nebo napojení na git repo přes Netlify CI/CD)
- [ ] Později napojit obsah na Simple CMS

## Poznámky pro Claude Code

- Pokračuj v čistém HTML/CSS/JS + Bootstrap stylu, jak je nastaveno — nezaváděj nový framework ani build tooling bez domluvy.
- Vendorované knihovny (Bootstrap, Font Awesome, GLightbox, Swiper) drž lokálně pod `vendor/`, ne přes CDN — viz CLAUDE.md.
- `_PODKLADY/` obsahuje syrové zdrojové materiály (fotky z Instagramu/Facebooku) — je v `.gitignore`, needituj/necommituj přímo.
- Barvy a typografie jsou v CSS proměnných v `css/style.css` (`:root`) — měň je tam, ne přes inline styly.
