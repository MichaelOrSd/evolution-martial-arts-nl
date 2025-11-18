document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = track ? Array.from(track.children) : [];
    const dotsContainer = carousel.querySelector('[data-carousel-dots]');
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const itemLabel = carousel.dataset.carouselLabel || 'items';

    if (!track || slides.length === 0 || !dotsContainer) {
      return;
    }

    carousel.classList.add('is-ready');
    let currentIndex = 0;

    const getItemsPerView = () => {
      const value = getComputedStyle(carousel).getPropertyValue('--carousel-items');
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? 1 : parsed;
    };

    const getMaxIndex = () => {
      const perView = getItemsPerView();
      return Math.max(0, slides.length - perView);
    };

    const updateArrows = () => {
      const maxIndex = getMaxIndex();

      if (prevButton) {
        const isDisabled = currentIndex <= 0 || maxIndex === 0;
        prevButton.disabled = isDisabled;
        prevButton.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
      }

      if (nextButton) {
        const isDisabled = currentIndex >= maxIndex || maxIndex === 0;
        nextButton.disabled = isDisabled;
        nextButton.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
      }
    };

    const updateDots = () => {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    };

    const update = () => {
      const perView = getItemsPerView();
      const maxIndex = Math.max(0, slides.length - perView);

      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }

      if (currentIndex < 0) {
        currentIndex = 0;
      }

      const activeSlide = slides[currentIndex];
      const offset = activeSlide ? activeSlide.offsetLeft : 0;
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
      updateArrows();
    };

    const createDots = () => {
      dotsContainer.innerHTML = '';
      const perView = getItemsPerView();
      const totalPages = getMaxIndex() + 1;

      for (let index = 0; index < totalPages; index += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'carousel-dot';
        const start = index * perView + 1;
        const end = Math.min(slides.length, start + perView - 1);
        button.setAttribute('aria-label', `Show ${itemLabel} ${start} to ${end}`);
        button.addEventListener('click', () => {
          currentIndex = index;
          update();
        });
        dotsContainer.appendChild(button);
      }
    };

    const handleResize = () => {
      createDots();
      update();
    };

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex -= 1;
          update();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
          currentIndex += 1;
          update();
        }
      });
    }

    createDots();
    update();

    window.addEventListener('resize', handleResize);
  });
});
