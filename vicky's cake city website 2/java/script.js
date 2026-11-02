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
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));

    const showFieldError = (field, message) => {
      const errorNode = field.parentElement?.querySelector('.field-error');
      if (errorNode) {
        errorNode.textContent = message || '';
      }
      const invalid = Boolean(message);
      field.classList.toggle('is-invalid', invalid);
      field.setAttribute('aria-invalid', String(invalid));
      return !invalid;
    };

    const validateField = (field) => {
      field.dataset.touched = 'true';
      const value = field.value.trim();
      let error = '';

      if (field.required && !value) {
        error = 'This field is required.';
      } else if (field.type === 'email' && value && !field.validity.valid) {
        error = 'Please enter a valid email address.';
      } else if (field.type === 'tel' && value && !/^[0-9+()\s-]{7,20}$/.test(value)) {
        error = 'Please enter a valid phone number.';
      } else if (field.type === 'date' && value && field.min && new Date(value) < new Date(field.min)) {
        error = 'Please choose a valid date.';
      } else if (field.name === 'servings' && value && (Number(value) < 1 || Number(value) > 5000)) {
        error = 'Please enter a realistic serving count.';
      } else if (field.name === 'message' && value.length < 20) {
        error = 'Please write at least 20 characters.';
      } else if (field.name === 'cake-design' && value.length < 20) {
        error = 'Please describe your design in at least 20 characters.';
      } else if (field.minLength && value.length && value.length < Number(field.minLength)) {
        error = `Please enter at least ${field.minLength} characters.`;
      } else if (field.maxLength && value.length > Number(field.maxLength)) {
        error = `Please enter no more than ${field.maxLength} characters.`;
      }

      return showFieldError(field, error);
    };

    fields.forEach((field) => {
      if (!field.parentElement?.querySelector('.field-error')) {
        const errorNode = document.createElement('span');
        errorNode.className = 'field-error';
        errorNode.setAttribute('aria-live', 'polite');
        field.parentElement.appendChild(errorNode);
      }

      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.dataset.touched === 'true') {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      let valid = true;
      fields.forEach((field) => {
        if (!validateField(field)) {
          valid = false;
        }
      });

      if (!valid) {
        if (successMessage) {
          successMessage.style.display = 'none';
          successMessage.classList.remove('is-error');
        }
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        const response = await fetch(form.action, {
          method: form.method || 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: new FormData(form),
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        if (successMessage) {
          successMessage.classList.remove('is-error');
          successMessage.innerHTML = '<strong>✓ Success!</strong> Your message has been sent. We will be in touch soon!';
          successMessage.style.display = 'block';
        }

        form.reset();
        fields.forEach((field) => {
          field.classList.remove('is-invalid');
          field.setAttribute('aria-invalid', 'false');
          const errorNode = field.parentElement?.querySelector('.field-error');
          if (errorNode) errorNode.textContent = '';
          delete field.dataset.touched;
        });
      } catch (error) {
        if (successMessage) {
          successMessage.classList.add('is-error');
          successMessage.innerHTML = '<strong>⚠ Error!</strong> Please check your details and try again.';
          successMessage.style.display = 'block';
        }
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  });
});
