/* ============================================================
   HEXRA — main.js v2.0
   Shared logic: stars canvas, burger nav, scroll reveal, header
   Built for Averta design system
   ============================================================ */
(() => {
  "use strict";

  /* ── Star-field canvas ── */
  const canvas = document.getElementById("stars-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    const STAR_COUNT = 160;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    /* Gradient palette tinted stars */
    const starColors = [
      [255, 255, 255],   /* white */
      [167, 139, 250],   /* violet */
      [34, 211, 238],    /* cyan */
      [236, 72, 153],    /* magenta */
      [139, 92, 246],    /* purple */
      [244, 114, 182],   /* pink */
    ];

    const createStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const clr = starColors[Math.random() < 0.35
          ? (1 + Math.floor(Math.random() * (starColors.length - 1)))
          : 0];
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.3 + 0.2,
          a: Math.random() * 0.6 + 0.1,
          speed: Math.random() * 0.004 + 0.001,
          phase: Math.random() * Math.PI * 2,
          c: clr,
        });
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const flicker = 0.5 + 0.5 * Math.sin(t * s.speed * 0.5 + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.c[0]},${s.c[1]},${s.c[2]},${(s.a * flicker * 0.65).toFixed(3)})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };

    resize();
    createStars();
    requestAnimationFrame(draw);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); createStars(); }, 150);
    });
  }


  /* ── Header scroll shadow ── */
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }


  /* ── Burger / mobile nav ── */
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });

    nav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
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


  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("show"));
  }


  /* ── Init tilt.js ── */
  if (window.Tilt && typeof window.Tilt.init === "function") {
    window.Tilt.init();
  }

})();
