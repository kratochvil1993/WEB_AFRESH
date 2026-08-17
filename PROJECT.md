# Afresh Dance Community — web

Nový web pro taneční skupinu **Afresh Dance Community** (Plzeň, hip hop, založeno 2006). Nahrazuje starý web na Wixu (`afreshdc.wixsite.com/afresh`).

## Tech stack

- Čisté **HTML + CSS + vanilla JavaScript** (žádný build krok, žádný framework typu React/Vue)
- **Bootstrap 5.3** (grid, komponenty, utility classes) — načítáno přes CDN v `index.html`
- Vlastní styly odděleně v `css/style.css` (přepisuje/doplňuje Bootstrap přes CSS proměnné a utility classy)
- Vlastní JS v `js/main.js`
- Cíl nasazení: **Netlify** (statický web, žádný server, žádné env proměnné potřeba pro základní verzi)
- Web bude nakonec napojen na interní **Simple CMS** — zatím obsah pouze staticky v HTML

## Struktura projektu

```
index.html          hlavní (zatím jediná) stránka — hero, o nás, úspěchy, nabídka, kontakt
css/style.css        veškeré vlastní styly (dark theme, typografie, sekce)
js/main.js            vlastní JS (zatím: aktivní stav v navigaci podle scrollu)
assets/logo.jpg       logo skupiny (černý kruh, bílý nápis /FR_SH)
_PODKLADY/             zdrojové fotky a materiály od klienta — NEPOUŽÍVAT přímo ve výstupu bez úpravy, není v gitu (viz .gitignore)
```

## Design

- Tmavý dark theme (`--bg: #0a0a0a`), akcentová barva sytá červená/růžová (`--accent: #ff2d55`) + žlutá (`--accent2: #ffd400`)
- Display font **Anton** (Google Fonts) pro nadpisy, **Inter** pro běžný text
- Inspirace weby profesionálních dance crews — velká bold typografie, vysoký kontrast, diagonální/asymetrické prvky, marquee pás se styly tance
- Zatím jen desktop verze — **mobilní responzivita ještě není doladěná**, i když Bootstrap grid základní chování zvládá

## Reálný obsah (ověřeno ze starého webu a soc. sítí)

- Afresh D.C. vznikla v roce 2006 v Plzni
- Styly: hip hop, house dance, new jack swing, hype
- Facebook: https://www.facebook.com/afreshdc/
- Instagram: https://www.instagram.com/afreshdancecommunity

## Co ještě chybí / další kroky

- [ ] Doladit mobilní a tablet verzi (breakpoints, hero na mobilu, marquee na malých displejích)
- [ ] Nahradit placeholdery (`hero-visual`, `about-visual` bloky) reálnými fotkami z `_PODKLADY` (po výběru a úpravě klientem/majitelem)
- [ ] Kontaktní formulář v sekci `#contact` (aktuálně jen tlačítko bez akce) — zvážit Netlify Forms
- [ ] Doplnit další podstránky, pokud budou potřeba (galerie, kurzy/rozvrh, členové) — v konzultaci s klientem
- [ ] SEO: title/meta description je nastavené, doplnit strukturovaná data (LocalBusiness / Organization) a OG tagy pro sdílení na sociálních sítích
- [ ] Nasadit na Netlify (drag & drop složky nebo napojení na git repo přes Netlify CI/CD)
- [ ] Později napojit obsah na Simple CMS

## Poznámky pro Claude Code

- Pokračuj v čistém HTML/CSS/JS + Bootstrap stylu, jak je nastaveno — nezaváděj nový framework ani build tooling bez domluvy.
- `_PODKLADY/` obsahuje syrové zdrojové materiály (fotky z Instagramu/Facebooku) — je v `.gitignore`, needituj/necommituj přímo.
- Barvy a typografie jsou v CSS proměnných v `css/style.css` (`:root`) — měň je tam, ne přes inline styly.
