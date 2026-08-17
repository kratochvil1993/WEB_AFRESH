// Afresh DC — main.js
// Sdílené chování napříč všemi stránkami: lightbox pro galerii (na stránce galerie.html),
// postavený na vendorované knihovně GLightbox (vendor/glightbox/), hero swiper na
// úvodní stránce (index.html), postavený na vendorované knihovně Swiper (vendor/swiper/),
// scroll-reveal animace pro [data-reveal] prvky, count-up animace čísel ve stats sekci
// a shrink efekt navbaru při scrollu. Navigace je klasické statické menu (odkazy na
// jednotlivé stránky, aktivní stránka je označená přímo v HTML) — bez JS scrollspy chování.

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal — [data-reveal] prvky (na index.html) se při vjezdu do viewportu
  // "rozsvítí" fade+translateY animací (viz CSS). One-shot: jakmile se prvek jednou
  // ukáže, přestane se sledovat, takže se animace neopakuje při scrollu zpět nahoru.
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(el => revealObserver.observe(el));
    }
  }

  // Count-up animace čísel ve stats sekci — jen pro hodnoty začínající číslicí
  // (např. "2006", "18+"). Čistě textové statistiky (např. "MČR") count-up nemají,
  // jen se odhalí přes fade z obalového [data-reveal] .stat-col.
  if (!reduceMotion) {
    document.querySelectorAll('.stat-num').forEach(el => {
      const match = el.textContent.match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = Number(match[1]);
      const suffix = match[2];
      const runCountUp = () => {
        const duration = 1200;
        const start = performance.now();
        const step = now => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      const statCol = el.closest('[data-reveal]');
      if (statCol && typeof IntersectionObserver !== 'undefined') {
        const statObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              runCountUp();
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.4 });
        statObserver.observe(statCol);
      } else {
        runCountUp();
      }
    });
  }

  // Navbar: zmenší se a ztmavne jakmile se stránka odscrolluje kousek od horního
  // okraje. requestAnimationFrame hlídá, aby se stav přepočítal max jednou za frame.
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let navTicking = false;
    const applyNavScrollState = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
      navTicking = false;
    };
    document.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(applyNavScrollState);
        navTicking = true;
      }
    }, { passive: true });
    applyNavScrollState();
  }

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
      effect: 'flip',
      flipEffect: { slideShadows: true, limitRotation: true },
      speed: 900,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.hero-swiper-pagination', clickable: true },
      navigation: { prevEl: '.hero-swiper-prev', nextEl: '.hero-swiper-next' },
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
