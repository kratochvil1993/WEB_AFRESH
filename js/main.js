// Afresh DC — main.js
// Sdílené chování napříč všemi stránkami: lightbox pro galerii (na stránce galerie.html),
// postavený na vendorované knihovně GLightbox (vendor/glightbox/).
// Navigace je klasické statické menu (odkazy na jednotlivé stránky, aktivní stránka
// je označená přímo v HTML) — bez JS scrollspy chování.

document.addEventListener('DOMContentLoaded', () => {
  // Lightbox pro galerii
  if (typeof GLightbox !== 'undefined' && document.querySelector('.glightbox')) {
    GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });
  }
});
