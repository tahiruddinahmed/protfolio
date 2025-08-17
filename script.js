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

  // Skill meter fill animation on scroll into view
  const meters = Array.from(document.querySelectorAll('.skill-meter'));
  if (meters.length) {
    const setTarget = (m) => {
      const bar = m.querySelector('span');
      if (!bar) return;
      const target = parseInt(m.getAttribute('aria-valuenow') || '0', 10);
      const clamped = Math.max(0, Math.min(target, 100));
      bar.style.width = `${clamped}%`;
    };

    if (prefersReduced) {
      meters.forEach(setTarget);
    } else if ('IntersectionObserver' in window) {
      // Initialize bars to zero width so they can animate to their targets
      meters.forEach((m) => {
        const bar = m.querySelector('span');
        if (bar) bar.style.width = '0%';
      });

      // Create a stable order for stagger based on the skills grid layout if present
      const skillsGrid = document.querySelector('#skills [data-stagger]');
      const order = skillsGrid ? Array.from(skillsGrid.querySelectorAll('.skill-card .skill-meter')) : meters;
      const indexMap = new Map(order.map((m, i) => [m, i]));

      const meterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const m = entry.target;
            const i = indexMap.get(m) ?? 0;
            const bar = m.querySelector('span');
            if (bar) {
              const delay = Math.min(i * 80, 600);
              bar.style.transitionDelay = `${delay}ms`;
            }
            setTarget(m);
            obs.unobserve(m);
          }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });

      meters.forEach((m) => meterObserver.observe(m));
    } else {
      meters.forEach(setTarget);
    }
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
