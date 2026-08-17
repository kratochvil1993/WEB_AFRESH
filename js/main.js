// Afresh DC — main.js
// Zatím jen drobné vylepšení chování stránky. Sem přijde další logika
// (mobilní menu, scroll animace, formulář na kontakt apod.), jak se bude web rozrůstat.

document.addEventListener('DOMContentLoaded', () => {
  // Aktivní stav v navigaci podle scrollu (jednoduchá verze)
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
  }
});
