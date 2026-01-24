(() => {
  const MOBILE_MAX = 991.98;

  const TYPING_TEXT = "Search cars, brands, models...";
  const TYPING_SPEED_MS = 55;
  const TYPING_PAUSE_MS = 900;

  function isMobile() {
    return window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
  }

  function ensureOverlay() {
    let overlay = document.querySelector(".mh-search-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "mh-search-overlay";
    overlay.innerHTML = `
      <div class="mh-search-backdrop" data-mh-search-close></div>
      <div class="mh-search-panel" role="dialog" aria-modal="true" aria-label="Search">
        <div class="mh-search-head">
          <div class="mh-search-title">
            <i class="bi bi-search" aria-hidden="true"></i>
            <span>Search</span>
          </div>
          <button type="button" class="mh-search-close" aria-label="Close search" data-mh-search-close>
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <div class="mh-search-body">
          <div class="mh-search-inputwrap">
            <input class="mh-search-input" type="search" autocomplete="off" inputmode="search" aria-label="Search cars" />
            <div class="mh-search-typing" aria-hidden="true">
              <span class="mh-typing-text"></span><span class="mh-typing-cursor"></span>
            </div>
          </div>
          <div class="mh-search-hint">Type to search. Tap outside to close.</div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function createTyper(overlay) {
    const input = overlay.querySelector(".mh-search-input");
    const typingWrap = overlay.querySelector(".mh-search-typing");
    const typingTextEl = overlay.querySelector(".mh-typing-text");

    let timer = null;
    let phase = "idle"; // idle | typing | pause
    let idx = 0;

    function clearTimer() {
      if (timer) window.clearTimeout(timer);
      timer = null;
    }

    function showTyping() {
      typingWrap.classList.remove("is-hidden");
    }

    function hideTyping() {
      typingWrap.classList.add("is-hidden");
    }

    function step() {
      if (!overlay.classList.contains("is-open")) return;
      if (document.activeElement === input && input.value) {
        hideTyping();
        clearTimer();
        return;
      }

      showTyping();

      if (phase === "typing") {
        idx++;
        typingTextEl.textContent = TYPING_TEXT.slice(0, idx);
        if (idx >= TYPING_TEXT.length) {
          phase = "pause";
          timer = window.setTimeout(step, TYPING_PAUSE_MS);
          return;
        }
        timer = window.setTimeout(step, TYPING_SPEED_MS);
        return;
      }

      // pause -> reset
      phase = "typing";
      idx = 0;
      typingTextEl.textContent = "";
      timer = window.setTimeout(step, TYPING_SPEED_MS);
    }

    function start() {
      clearTimer();
      phase = "typing";
      idx = 0;
      typingTextEl.textContent = "";
      showTyping();
      timer = window.setTimeout(step, TYPING_SPEED_MS);
    }

    function stop() {
      clearTimer();
      typingTextEl.textContent = "";
    }

    // Hide typing overlay when user types; show when empty
    input.addEventListener("input", () => {
      if (input.value) hideTyping();
      else showTyping();
    });

    return { start, stop };
  }

  function init() {
    const toggles = Array.from(document.querySelectorAll("[data-mh-search-toggle]"));
    if (!toggles.length) return;

    const overlay = ensureOverlay();
    const input = overlay.querySelector(".mh-search-input");
    const typer = createTyper(overlay);

    function open() {
      if (!isMobile()) return;
      overlay.classList.add("is-open");
      document.body.classList.add("mh-search-open");
      typer.start();
      window.setTimeout(() => input.focus(), 60);
    }

    function close() {
      overlay.classList.remove("is-open");
      document.body.classList.remove("mh-search-open");
      typer.stop();
      input.value = "";
    }

    toggles.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (overlay.classList.contains("is-open")) close();
        else open();
      });
    });

    overlay.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.closest && t.closest("[data-mh-search-close]")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });

    window.addEventListener("resize", () => {
      if (!isMobile() && overlay.classList.contains("is-open")) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


