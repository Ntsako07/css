document.addEventListener('DOMContentLoaded', () => {
  const yearNodes = document.querySelectorAll('[data-year]');
  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const rawPath = window.location.pathname.split('/').pop();
  const currentPage = (rawPath || 'index.html').toLowerCase();

  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const revealElements = document.querySelectorAll('.reveal, .intro-section, .feature-card, .about-content, .team-member, .product-card, .location-card, .form-container, .social-strip');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach((element) => {
      if (!element.classList.contains('reveal')) {
        element.classList.add('reveal');
      }
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      if (!element.classList.contains('reveal')) {
        element.classList.add('reveal');
      }
      element.classList.add('is-visible');
    });
  }

  document.querySelectorAll('form').forEach((form) => {
    const successMessage = form.parentElement?.querySelector('.success-message');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (successMessage) {
        successMessage.style.display = 'block';
      }

      form.reset();
    });
  });
});
