// Afresh DC — main.js
// Sdílené chování napříč všemi stránkami: lightbox pro galerii (na stránce galerie.html),
// postavený na vendorované knihovně GLightbox (vendor/glightbox/), a dvě instance
// hero swiperu, obě postavené na vendorované knihovně Swiper (vendor/swiper/) —
// obrázkový hero swiper (.hero-swiper) na archivní test-hero-slider.html a text swiper
// (.hero-text-swiper) na index.html, kde běží nad videem na pozadí (.hero-video, mimo
// swiper), scroll-reveal animace pro [data-reveal] prvky, count-up animace čísel ve
// stats sekci, shrink efekt navbaru při scrollu, scroll-linked parallax posun fotky v
// .parallax-band (index.html) a lazy-loading hero videí
// ([data-lazy-video] — index.html, nabor.html, kurzy.html, lektori.html, vystoupeni.html, o-nas/uspechy.html i o-nas/o-afresh.html). Navigace je klasické statické menu
// (odkazy na jednotlivé stránky, aktivní stránka je označená přímo v HTML) — bez JS
// scrollspy chování.

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lazy hero video — [data-lazy-video] (.hero-video na index.html, .hero-reel__video
  // na nabor.html, kurzy.html, lektori.html, vystoupeni.html, o-nas/uspechy.html i o-nas/o-afresh.html). V HTML nemají autoplay/preload a jejich
  // <source> mají src schované v data-src, takže je prohlížeč při načtení stránky vůbec nezačne stahovat
  // (video soubory mají řádově MB a jinak by okamžitě soutěžily o šířku pásma s CSS/JS/fonty/
  // poster obrázkem). Skutečné video se dotáhne a spustí až po window.load — tedy až
  // po kritickém obsahu stránky — a jen když to dává smysl: ne při prefers-reduced-motion
  // a ne na výrazně omezeném připojení (Data Saver / 2G-3G přes Network Information API,
  // kde je podporované). Do té doby — nebo natrvalo, pokud se video nespustí — zůstává
  // vidět jen poster (vyextrahovaný snímek z videa).
  const lazyVideos = document.querySelectorAll('[data-lazy-video]');
  if (lazyVideos.length) {
    const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
    const isSlowConnection = !!(conn && (conn.saveData || /^(slow-2g|2g|3g)$/.test(conn.effectiveType || '')));
    const startLazyVideo = video => {
      if (reduceMotion || isSlowConnection) return;
      video.querySelectorAll('source[data-src]').forEach(source => {
        source.src = source.dataset.src;
      });
      video.load();
      video.play().catch(() => { });
    };
    if (document.readyState === 'complete') {
      lazyVideos.forEach(startLazyVideo);
    } else {
      window.addEventListener('load', () => lazyVideos.forEach(startLazyVideo), { once: true });
    }
  }

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

  // Parallax band fotka — obrázek je normální <img loading="lazy"> (ne CSS pozadí), posun
  // se aplikuje jako translateY přes CSS proměnnou --parallax-offset (viz .parallax-band__img
  // ve style.css). Offset se počítá z pozice sekce vůči viewportu (getBoundingClientRect().top),
  // ne z absolutního window.scrollY — sekce není nahoře stránky, takže scrollY samotné by
  // dávalo offset o tisíce pixelů dřív, než se sekce vůbec objeví. PARALLAX_BUFFER musí
  // odpovídat top/height bufferu v CSS (.parallax-band__img), jinak by translate odkryl
  // okraj obrázku — proto se výsledek na něj i clampuje. Přeskočí se úplně při
  // prefers-reduced-motion — obrázek pak zůstane na klidové (netransformované) poloze z CSS.
  const parallaxImg = document.querySelector('.parallax-band__img');
  if (parallaxImg && !reduceMotion) {
    const parallaxBand = parallaxImg.closest('.parallax-band');
    const PARALLAX_SPEED = 0.5;
    const PARALLAX_BUFFER = 350; // px — odpovídá top:-350px / height:+700px v CSS
    const applyParallax = () => {
      const offset = parallaxBand.getBoundingClientRect().top * PARALLAX_SPEED;
      const clamped = Math.max(-PARALLAX_BUFFER, Math.min(PARALLAX_BUFFER, offset));
      parallaxImg.style.setProperty('--parallax-offset', `${clamped}px`);
    };
    document.addEventListener('scroll', applyParallax, { passive: true });
    applyParallax();
  }

  // "O nás" dropdown v navigaci — Bootstrapí dropdown JS otevírá menu jen na klik
  // (na caret tlačítko), což na desktopu působí jako "nejede". Najetí myší na
  // celou položku (odkaz i caret i samotné menu, jsou to sourozenci uvnitř
  // stejného <li>) proto menu doplňkově otevře/zavře přes Dropdown API. Zavření
  // má krátký delay, aby pohyb myši z odkazu na caret/menu meziprvek nezasekl.
  // Bootstrap při show() interně na caret tlačítko zavolá .focus() (kvůli
  // šipkám na klávesnici v menu) — na hover to ale vypadá jako náhodný modrý
  // focus-outline kolem šipky, i když uživatel klávesnici nepoužil. Hned po
  // otevření proto tlačítko odfokusujeme; skutečné focusnutí přes Tab si
  // vlastní focus event pošle znovu a outline se ukáže správně.
  if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
    document.querySelectorAll('.nav-item--dropdown').forEach(item => {
      const toggle = item.querySelector('[data-bs-toggle="dropdown"]');
      if (!toggle) return;
      const dropdown = bootstrap.Dropdown.getOrCreateInstance(toggle);
      let closeTimer;
      item.addEventListener('mouseenter', () => {
        clearTimeout(closeTimer);
        dropdown.show();
        toggle.blur();
      });
      item.addEventListener('mouseleave', () => {
        closeTimer = setTimeout(() => dropdown.hide(), 150);
      });
    });
  }

  // Tlačítko "zpět nahoru": objeví se po odscrollování kousek dolů, sdílí
  // rAF throttling se stejným scroll listenerem jako navbar výše.
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    let topTicking = false;
    const applyBackToTopState = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
      topTicking = false;
    };
    document.addEventListener('scroll', () => {
      if (!topTicking) {
        requestAnimationFrame(applyBackToTopState);
        topTicking = true;
      }
    }, { passive: true });
    applyBackToTopState();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Lightbox pro galerii
  if (typeof GLightbox !== 'undefined' && document.querySelector('.glightbox')) {
    GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });
  }

  // Hero swiper — obrázkové slidy, dnes jen na archivní test-hero-slider.html. Každý
  // slide má vlastní text (viz .hero-slide-content), který se přepíná synchronně
  // s obrázkem podle aktuálního reálného indexu slidu.
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

  // Text swiper na úvodní stránce (index.html) — pozadí je smyčka videa (.hero-video,
  // mimo tenhle swiper úplně), jen text nad ním (.hero-text-slide) je vlastní Swiper,
  // přepínatelný stejnými .hero-swiper-controls (šipky + tečky) jako obrázkový swiper
  // na test-hero-slider.html. autoHeight, protože oba texty mají různě dlouhý obsah.
  // rewind (ne loop): se 2 slidy dává identické cyklení (next/prev/autoplay se stejně
  // "přetočí" na druhý konec), ale bez DOM duplikace slidů, kterou loop vyžaduje — ta
  // duplikace v kombinaci s autoHeight způsobovala měřitelný CLS hned po startu (Swiper
  // spočítal výšku poprvé špatně, pak o pár desítek ms později opravil, viz Lighthouse
  // CLS audit). Ověřeno Playwrightem, že chování (cyklení, šipky, tečky) je 1:1 stejné.
  if (typeof Swiper !== 'undefined' && document.querySelector('.hero-text-swiper')) {
    new Swiper('.hero-text-swiper', {
      rewind: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 700,
      autoHeight: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.hero-swiper-pagination', clickable: true },
      navigation: { prevEl: '.hero-swiper-prev', nextEl: '.hero-swiper-next' },
    });
  }
});
