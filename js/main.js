/* ============================================
   CAS Development — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initScrollReveal();
  initCounters();
  initAccordions();
  initPartnerModals();
  initPartnerFilters();
  initScrollToTop();
  initParallax();
  initPageTransitions();
});

/* ── Theme Toggle (Dark/Light) ── */
function initThemeToggle() {
  const saved = localStorage.getItem('cas-theme');
  if (!saved || saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  updateThemeIcon();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('cas-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('cas-theme', 'light');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  btn.innerHTML = isLight
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
}

/* ── Navigation ── */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const overlay = document.querySelector('.nav__overlay');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  if (links) {
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle?.classList.remove('open');
        links.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', () => {
      toggle?.classList.remove('open');
      links?.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Active link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links?.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Scroll Reveal (unified IntersectionObserver with blur→clear) ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll(
    '.reveal, .stagger-reveal, .reveal-left, .reveal-right, .reveal-scale, [data-reveal]'
  );

  // Honour reduced motion: reveal everything immediately, skip observer.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  // Fallback for unsupported IntersectionObserver (very old browsers)
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -15% 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ── Scroll to Top ── */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Animated Counters ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = prefix + current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = prefix + target.toLocaleString() + suffix;
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Accordions ── */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion__header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion__body');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.accordion__item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion__body').style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ── Partner Modals ── */
function initPartnerModals() {
  const cards = document.querySelectorAll('.partner-card[data-partner]');
  const overlay = document.querySelector('.partner-modal-overlay');
  const modal = document.querySelector('.partner-modal');
  const closeBtn = document.querySelector('.partner-modal__close');

  if (!overlay || !modal) return;

  // Partner data stored in HTML data attributes
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.dataset.partner);
      
      modal.querySelector('.partner-modal__logo img').src = data.logo || '';
      modal.querySelector('.partner-modal__logo img').alt = data.name;
      modal.querySelector('h3').textContent = data.name;
      modal.querySelector('.partner-modal__country').textContent = data.flag + ' ' + data.country;
      modal.querySelector('p').textContent = data.description;
      
      const link = modal.querySelector('.partner-modal__link');
      if (data.url) {
        link.href = data.url;
        link.style.display = 'inline-flex';
      } else {
        link.style.display = 'none';
      }

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ── Partner Filters ── */
function initPartnerFilters() {
  const buttons = document.querySelectorAll('.filter-bar__btn');
  const cards = document.querySelectorAll('.partner-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.region === filter) {
          card.style.display = '';
          card.style.animation = 'scale-in 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ── Smooth scroll for anchor links (exclude modal links) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  // Skip modal/external links
  if (anchor.classList.contains('partner-modal__link')) return;
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return; // Skip bare # links
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Parallax on Hero (A2) ── */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const particles = hero.querySelectorAll('.particle');
  if (particles.length === 0) return;

  // Subtle scroll parallax
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return; // Stop processing past hero
    particles.forEach((p, i) => {
      const speed = 0.03 + (i * 0.015);
      p.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // Mouse-following parallax (desktop only)
  if (window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      particles.forEach((p, i) => {
        const intensity = 15 + (i * 10);
        p.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
      });
    });
  }
}

/* ── Page Transitions (A4) ── */
function initPageTransitions() {
  // Fade in on load
  document.body.style.opacity = '1';

  // Fade out on click to other pages
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    // Only intercept same-domain HTML page links
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (!href.endsWith('.html')) return;

    link.addEventListener('click', function(e) {
      e.preventDefault();
      const destination = this.href;
      document.body.style.transition = 'opacity 0.25s ease';
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = destination;
      }, 250);
    });
  });
}

/* ── Cookie / Privacy notice (minimal, no tracking) ── */
function initCookieNotice() {
  if (localStorage.getItem('cas-cookie-acknowledged') === '1') return;

  const notice = document.createElement('div');
  notice.className = 'cookie-notice';
  notice.setAttribute('role', 'region');
  notice.setAttribute('aria-label', 'Privacy notice');
  notice.innerHTML = `
    <p class="cookie-notice__text">
      This site uses only technical storage required for theme and language preferences.
      No tracking cookies. <a href="privacy-policy.html">Learn more</a>.
    </p>
    <button type="button" class="cookie-notice__btn" aria-label="Acknowledge privacy notice">Got it</button>
  `;
  document.body.appendChild(notice);

  // Animate in after layout
  requestAnimationFrame(() => {
    requestAnimationFrame(() => notice.classList.add('is-visible'));
  });

  notice.querySelector('.cookie-notice__btn').addEventListener('click', () => {
    localStorage.setItem('cas-cookie-acknowledged', '1');
    notice.classList.remove('is-visible');
    setTimeout(() => notice.remove(), 400);
  });
}

// Init cookie notice after main load
document.addEventListener('DOMContentLoaded', initCookieNotice);
