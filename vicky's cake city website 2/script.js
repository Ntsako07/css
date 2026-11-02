document.addEventListener('DOMContentLoaded', () => {
  const yearNodes = document.querySelectorAll('[data-year]');
  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

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
    }, {
      threshold: 0.15,
    });

    revealElements.forEach((element) => {
      element.classList.add('reveal');
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => element.classList.add('reveal', 'is-visible'));
  }

  document.querySelectorAll('form').forEach((form) => {
    const success = (form.closest('.container') || form.parentElement || document.body).querySelector('.success-message');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (success) {
        success.style.display = 'block';
      }

      form.reset();
    });
  });
});
