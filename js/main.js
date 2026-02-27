/* ============================================================
   main.js — HEXRA Space Theme
   • Animated starfield canvas
   • Mobile menu toggle
   • Scroll-reveal (IntersectionObserver)
   • Active nav link highlight on scroll
   • Header scroll shadow
   ============================================================ */

(function () {
  "use strict";

  /* ── Starfield Canvas ─────────────────────────────────── */
  const canvas = document.getElementById("stars-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w, h;
    const STAR_COUNT = 280;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.6 + 0.2,
          twinkleSpeed: Math.random() * 0.008 + 0.002,
          twinkleOffset: Math.random() * Math.PI * 2,
          // Some stars are colored
          color: Math.random() > 0.92
            ? `hsla(${180 + Math.random() * 40}, 90%, 70%, `
            : Math.random() > 0.95
              ? `hsla(${270 + Math.random() * 30}, 70%, 70%, `
              : `hsla(0, 0%, 100%, `,
        });
      }
    }

    let time = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      time += 1;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = prefersReduced
          ? s.alpha
          : s.alpha + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.3;
        const a = Math.max(0.05, Math.min(1, twinkle));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + a.toFixed(2) + ")";
        ctx.fill();

        // Larger stars get a subtle glow
        if (s.r > 1.1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = s.color + (a * 0.12).toFixed(3) + ")";
          ctx.fill();
        }
      }

      if (!prefersReduced) {
        requestAnimationFrame(draw);
      }
    }

    resize();
    createStars();
    draw();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createStars();
        if (prefersReduced) draw();
      }, 200);
    }, { passive: true });
  }


  /* ── Mobile menu ────────────────────────────────────────── */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }


  /* ── Scroll-reveal ──────────────────────────────────────── */
  const reveals = document.querySelectorAll(".reveal:not(.show)");
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }


  /* ── Active nav link highlight ─────────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link[href^='#']");

  if (sections.length && navLinks.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: "-60px 0px -40% 0px" }
    );
    sections.forEach((s) => activeObserver.observe(s));
  }


  /* ── Header scroll shadow ──────────────────────────────── */
  const header = document.querySelector(".header");
  if (header) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            header.classList.toggle("scrolled", window.scrollY > 20);
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

})();
