document.addEventListener('DOMContentLoaded', () => {
  const yearNodes = document.querySelectorAll('[data-year]');
  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (navToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!nav.contains(target) && !navToggle.contains(target)) {
        closeMenu();
      }
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 820) {
          closeMenu();
        }
      });
    });
  }

  const rawPath = window.location.pathname.split('/').pop();
  const currentPage = (rawPath || 'index.html').toLowerCase();

  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const revealElements = document.querySelectorAll('.reveal, .intro-section, .feature-card, .about-content, .team-member, .product-card, .location-card, .form-container, .social-strip');

  revealElements.forEach((element, index) => {
    if (!element.classList.contains('reveal')) {
      element.classList.add('reveal');
    }
    const delay = index * 80;
    element.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add('is-visible');
    });
  }

  document.querySelectorAll('form').forEach((form) => {
    const successMessage = form.parentElement?.querySelector('.success-message');
    const fields = form.querySelectorAll('input, select, textarea');

    const setFieldState = (field) => {
      const isInvalid = field.dataset.touched === 'true' && !field.checkValidity();
      field.classList.toggle('is-invalid', isInvalid);
      field.setAttribute('aria-invalid', String(isInvalid));
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => {
        field.dataset.touched = 'true';
        setFieldState(field);
      });

      field.addEventListener('input', () => {
        if (field.dataset.touched === 'true') {
          setFieldState(field);
        }
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      fields.forEach((field) => {
        field.dataset.touched = 'true';
        setFieldState(field);
      });

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        form.reportValidity();
        return;
      }

      form.classList.remove('was-validated');

      if (successMessage) {
        successMessage.style.display = 'block';
      }

      form.reset();
      fields.forEach((field) => {
        field.classList.remove('is-invalid');
        field.setAttribute('aria-invalid', 'false');
        delete field.dataset.touched;
      });
    });
  });
});
