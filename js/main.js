/* ============================================================
   HEXRA — main.js
   Shared logic: stars canvas, burger nav, scroll reveal, header shadow
   ============================================================ */
(() => {
  "use strict";

  /* ── Star-field canvas ── */
  const canvas = document.getElementById("stars-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    const STAR_COUNT = 180;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.3,
          a: Math.random(),
          speed: Math.random() * 0.005 + 0.002,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const flicker = 0.5 + 0.5 * Math.sin(t * s.speed * 0.5 + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(s.a * flicker * 0.7).toFixed(3)})`;
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

    // Close on link click
    nav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    // Close on Escape
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: just show all
    revealEls.forEach((el) => el.classList.add("show"));
  }


  /* ── Init tilt.js on load ── */
  if (window.Tilt && typeof window.Tilt.init === "function") {
    window.Tilt.init();
  }

})();
