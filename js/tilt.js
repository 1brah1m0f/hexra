/* ============================================================
   tilt.js — Reusable 3D tilt effect
   Apply via: data-tilt attribute on any element
   Options (data attributes):
     data-tilt-max="8"       -> max rotation degrees (default 8)
     data-tilt-perspective="800" -> perspective in px (default 800)
     data-tilt-scale="1.02"  -> scale on hover (default 1.02)
   ============================================================ */

(function () {
  "use strict";

  const DEFAULTS = {
    max: 8,
    perspective: 800,
    scale: 1.02,
    speed: 400,       // transition duration in ms
    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };

  /** Respect reduced motion preference */
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * Initialise tilt on a single element.
   * @param {HTMLElement} el
   */
  function initTilt(el) {
    if (prefersReducedMotion()) return;

    const max         = parseFloat(el.dataset.tiltMax)         || DEFAULTS.max;
    const perspective  = parseFloat(el.dataset.tiltPerspective) || DEFAULTS.perspective;
    const scale        = parseFloat(el.dataset.tiltScale)       || DEFAULTS.scale;
    const speed        = parseFloat(el.dataset.tiltSpeed)       || DEFAULTS.speed;
    const easing       = DEFAULTS.easing;

    // Set base transition once
    el.style.willChange   = "transform";
    el.style.transition   = `transform ${speed}ms ${easing}`;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x    = e.clientX - rect.left;   // cursor x relative to element
      const y    = e.clientY - rect.top;     // cursor y relative to element
      const w    = rect.width;
      const h    = rect.height;

      // -0.5 … 0.5   →   -max … +max
      const rotateY =  ((x / w) - 0.5) * max * 2;
      const rotateX = -((y / h) - 0.5) * max * 2;

      el.style.transform =
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale},${scale},${scale})`;
    }

    function onLeave() {
      el.style.transform = "";
    }

    el.addEventListener("mousemove", onMove,  { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });

    // Store cleanup reference
    el._tiltCleanup = () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.willChange = "";
      el.style.transform  = "";
      el.style.transition = "";
    };
  }

  /**
   * Public API: initialise all [data-tilt] elements currently in the DOM.
   * Safe to call multiple times — skips already-initialised elements.
   */
  function initAll() {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      if (!el._tiltCleanup) initTilt(el);
    });
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Expose globally so main.js can re-init if needed
  window.Tilt = { init: initAll };
})();
