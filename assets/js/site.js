(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (toggle && nav) {
    const links = nav.querySelectorAll('a[href^="#"]');

    const closeNav = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      toggle.setAttribute('aria-expanded', String(next));
      nav.classList.toggle('is-open', next);
      document.body.classList.toggle('nav-open', next);
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 959px)').matches) {
          closeNav();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 960px)').matches) {
        closeNav();
      }
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.card, .coach, .pricing-card, .quote, .schedule-row').forEach((el) => {
      el.classList.add('will-animate');
      observer.observe(el);
    });
  }
})();
