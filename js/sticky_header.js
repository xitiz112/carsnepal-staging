(() => {
  // Mobile-only sticky header that hides on scroll down and slides in on scroll up.
  // Applies to: <header class="site-header ...">
  const MOBILE_MAX = 991.98; // Bootstrap lg breakpoint - 1

  function isMobile() {
    return window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
  }

  function init() {
    const header = document.querySelector('header.site-header');
    if (!header) return;

    let lastY = window.scrollY || 0;
    let ticking = false;

    // Ensure clean initial state
    header.classList.add('mh-sticky');
    header.classList.remove('mh-header-hidden');

    function onScroll() {
      if (!isMobile()) {
        header.classList.remove('mh-header-hidden');
        lastY = window.scrollY || 0;
        ticking = false;
        return;
      }

      const y = window.scrollY || 0;
      const delta = y - lastY;
      const nearTop = y < 8;

      // Hide on scroll down, show on scroll up.
      // Add a small delta threshold to avoid jitter.
      if (nearTop) {
        header.classList.remove('mh-header-hidden');
      } else if (delta > 6) {
        header.classList.add('mh-header-hidden');
      } else if (delta < -6) {
        header.classList.remove('mh-header-hidden');
      }

      lastY = y;
      ticking = false;
    }

    function requestTick() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


