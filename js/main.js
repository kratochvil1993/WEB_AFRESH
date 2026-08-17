// Afresh DC — main.js
// Sdílené chování napříč všemi stránkami: lightbox pro galerii (na stránce galerie.html),
// postavený na vendorované knihovně GLightbox (vendor/glightbox/), a hero swiper na
// úvodní stránce (index.html), postavený na vendorované knihovně Swiper (vendor/swiper/).
// Navigace je klasické statické menu (odkazy na jednotlivé stránky, aktivní stránka
// je označená přímo v HTML) — bez JS scrollspy chování.

document.addEventListener('DOMContentLoaded', () => {
  // Lightbox pro galerii
  if (typeof GLightbox !== 'undefined' && document.querySelector('.glightbox')) {
    GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });
  }

  // Hero swiper na úvodní stránce — každý slide má vlastní text (viz .hero-slide-content),
  // který se přepíná synchronně s obrázkem podle aktuálního reálného indexu slidu.
  if (typeof Swiper !== 'undefined' && document.querySelector('.hero-swiper')) {
    const heroTexts = document.querySelectorAll('.hero-slide-content');
    new Swiper('.hero-swiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 700,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      on: {
        slideChange(swiper) {
          heroTexts.forEach(el => {
            el.classList.toggle('active', Number(el.dataset.slide) === swiper.realIndex);
          });
        },
      },
    });
  }
});
