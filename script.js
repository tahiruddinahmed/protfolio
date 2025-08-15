// Basic interactivity: theme, mobile menu, contact form, scroll animations
(function () {
  const storageKey = 'theme';
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const yearEl = document.getElementById('year');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  function setTheme(mode) {
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(storageKey, mode);
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // Mobile menu toggle
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const hidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !hidden);
    });

    // Hide on navigation click
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // Scroll reveal animations using IntersectionObserver
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const items = Array.from(document.querySelectorAll('[data-animate]'));
    const byStaggerContainer = new Map();

    // Group children by their closest [data-stagger] ancestor to apply staggered delays
    items.forEach((el) => {
      const container = el.closest('[data-stagger]');
      if (!container) return;
      if (!byStaggerContainer.has(container)) byStaggerContainer.set(container, []);
      byStaggerContainer.get(container).push(el);
    });

    // Assign transition delays for stagger groups (unless a custom data-delay is set)
    byStaggerContainer.forEach((els) => {
      els.forEach((el, i) => {
        if (!el.hasAttribute('data-delay')) {
          el.style.transitionDelay = `${Math.min(i * 80, 600)}ms`;
        }
      });
    });

    // Observer
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('in-view');
          // If custom delay attribute is present, apply it for first reveal
          const delay = el.getAttribute('data-delay');
          if (delay) el.style.transitionDelay = delay;
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

    items.forEach((el) => io.observe(el));
  } else {
    // No animations: show elements immediately
    document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('in-view'));
  }
})();

// Contact form (demo only)
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  // Simulate async submit
  const btn = form.querySelector('button[type="submit"]');
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';
  setTimeout(() => {
    alert('Thanks, ' + (data.name || 'friend') + '! I will get back to you soon.');
    btn.disabled = false;
    btn.textContent = label;
    form.reset();
  }, 800);
  return false;
}

