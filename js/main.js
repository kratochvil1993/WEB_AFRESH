// Afresh DC — main.js
// Sdílené chování napříč všemi stránkami: lightbox pro galerii (na stránce galerie.html).
// Navigace je klasické statické menu (odkazy na jednotlivé stránky, aktivní stránka
// je označená přímo v HTML) — bez JS scrollspy chování.

document.addEventListener('DOMContentLoaded', () => {
  // Lightbox pro galerii
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const images = Array.from(galleryItems);
    let currentIndex = 0;

    const showImage = (index) => {
      currentIndex = (index + images.length) % images.length;
      const img = images[currentIndex];
      lightboxImg.src = img.dataset.full || img.src;
      lightboxImg.alt = img.alt || '';
    };

    images.forEach((img, index) => {
      img.addEventListener('click', () => {
        showImage(index);
        lightbox.classList.add('open');
      });
    });

    const closeLightbox = () => lightbox.classList.remove('open');

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }
});
