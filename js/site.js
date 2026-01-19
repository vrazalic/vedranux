(() => {
  const STORAGE_KEY = 'theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  const getStoredTheme = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === THEME_DARK ? THEME_DARK : THEME_LIGHT;
    } catch (error) {
      return THEME_LIGHT;
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage errors (private mode, blocked storage).
    }
  };

  const initTheme = () => {
    applyTheme(getStoredTheme());
  };

  const initThemeToggle = () => {
    const toggle = document.querySelector('.js-theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const next =
        document.documentElement.dataset.theme === THEME_DARK
          ? THEME_LIGHT
          : THEME_DARK;
      applyTheme(next);
    });
  };

  const initGuidesToggle = () => {
    const button = document.querySelector('.js-guides-toggle');
    const guides = document.querySelector('.guides');
    if (!button || !guides) return;

    button.addEventListener('click', (event) => {
      event.preventDefault();
      const showing = guides.classList.toggle('is-visible');
      button.classList.toggle('active', showing);
    });
  };

  const initHamburger = () => {
    const nav = document.querySelector('.navbar-white_ok.w-nav');
    if (!nav) return;

    const button = nav.querySelector('.w-nav-button');
    const menu = nav.querySelector('.w-nav-menu');
    if (!button || !menu) return;

    if (!menu.id) {
      menu.id = 'primary-nav-menu';
    }

    button.setAttribute('aria-controls', menu.id);
    button.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');

    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    const closeMenu = () => {
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      button.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    };

    const openMenu = () => {
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
      button.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
    };

    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (nav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  };

  const initScrollProgress = () => {
    const bars = document.querySelectorAll('.progress-bar, .progress-bar-ds');
    if (!bars.length) return;

    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      bars.forEach((bar) => {
        bar.style.transform = `scaleX(${progress})`;
      });
      ticking = false;
    };

    const requestTick = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  };

  const initFormStates = () => {
    const form = document.querySelector('form[name="contact"]');
    if (!form) return;

    const status = form.querySelector('.form-status');
    const submit = form.querySelector('button[type="submit"]');

    const setState = (state, message) => {
      form.dataset.formState = state;
      if (status) {
        status.textContent = message || '';
      }
      if (submit) {
        submit.disabled = state === 'loading';
      }
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setState('loading', 'Sending…');

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action || window.location.pathname, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString(),
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        setState('success', 'Message sent. Thank you!');
        form.reset();
      } catch (error) {
        setState('error', 'Something went wrong. Please try again.');
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
    initGuidesToggle();
    initHamburger();
    initScrollProgress();
    initFormStates();
  });
})();
