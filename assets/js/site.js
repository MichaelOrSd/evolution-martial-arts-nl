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

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const endpoint = contactForm.dataset.endpoint || '';
    const apiKey = contactForm.dataset.apiKey || '';
    const statusEl = contactForm.querySelector('.form-status');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    const isConfigured = endpoint && !endpoint.includes('your-api-id');

    const setStatus = (message, state) => {
      if (!statusEl) return;
      statusEl.textContent = message;
      if (state) {
        statusEl.dataset.state = state;
      } else {
        delete statusEl.dataset.state;
      }
    };

    if (!isConfigured) {
      setStatus('Contact form configuration is incomplete.', 'error');
    }

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!isConfigured) {
        setStatus('Contact form configuration is incomplete.', 'error');
        return;
      }

      const formData = new FormData(contactForm);
      const payload = {
        name: (formData.get('name') || '').toString().trim(),
        email: (formData.get('email') || '').toString().trim(),
        program: (formData.get('program') || '').toString(),
        message: (formData.get('message') || '').toString().trim(),
        submittedAt: new Date().toISOString(),
      };

      if (!payload.name || !payload.email || !payload.message) {
        setStatus('Please complete all required fields before sending.', 'error');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['x-api-key'] = apiKey;
      }

      setStatus('Sending message…', 'sending');
      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Request failed');
        }

        setStatus('Thanks! Your message has been sent.', 'success');
        contactForm.reset();
      } catch (error) {
        console.error('Contact form submission failed', error);
        setStatus('Something went wrong while sending your message. Please try again.', 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }
})();
