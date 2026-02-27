/* ============================================================
   main.js — Core interactions for HEXRA landing page
   • Mobile menu toggle
   • Scroll-reveal (IntersectionObserver)
   • Active nav link highlight on scroll
   • 3D hero stage mouse-follow
   • Header scroll shadow
   ============================================================ */

(function () {
  "use strict";

  /* ── Mobile menu ────────────────────────────────────────── */
  const burger = document.getElementById("burger");
  const nav    = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on link click
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }


  /* ── Scroll-reveal ──────────────────────────────────────── */
  const reveals = document.querySelectorAll(".reveal");
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
      { threshold: 0.1 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }


  /* ── Active nav link highlight ─────────────────────────── */
  const sections = document.querySelectorAll("section[id], main[id]");
  const navLinks = document.querySelectorAll(".nav__link[href^='#']");

  if (sections.length && navLinks.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const matches = link.getAttribute("href") === "#" + id;
              link.classList.toggle("active", matches);
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: "-60px 0px -40% 0px" }
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


  /* ── 3D Hero stage mouse-follow ────────────────────────── */
  const stage  = document.getElementById("hero-stage");
  const visual = document.getElementById("hero-visual");

  if (stage && visual) {
    // Skip if reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced) {
      visual.addEventListener(
        "mousemove",
        (ev) => {
          const r  = visual.getBoundingClientRect();
          const nx = (ev.clientX - r.left) / r.width;   // 0…1
          const ny = (ev.clientY - r.top)  / r.height;  // 0…1
          const ry = -32 + nx * 24;
          const rx =  34 - ny * 22;
          stage.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        },
        { passive: true }
      );

      visual.addEventListener("mouseleave", () => {
        stage.style.transform = "";   // CSS animation takes over
      });
    }
  }
})();
