/* ═══════════════════════════════════════
   HEXRA — Main JavaScript
   Swiss Poster + Tech Startup
   ═══════════════════════════════════════ */

;(function () {
  'use strict'

  /* ── Theme Toggle ─────────────── */
  const html = document.documentElement
  const themeBtn = document.getElementById('themeToggle')

  // Restore saved preference (default dark)
  const stored = localStorage.getItem('hexra-theme')
  if (stored) {
    html.setAttribute('data-theme', stored)
  }
  updateIcon()

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      html.setAttribute('data-theme', next)
      localStorage.setItem('hexra-theme', next)
      updateIcon()
    })
  }

  function updateIcon () {
    if (!themeBtn) return
    themeBtn.textContent = html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙'
  }

  /* ── Header shadow on scroll ──── */
  const header = document.querySelector('.header')
  if (header) {
    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  /* ── Burger / Mobile Nav ──────── */
  const burger = document.querySelector('.burger')
  const nav = document.getElementById('nav')
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open')
      burger.classList.toggle('open', open)
      burger.setAttribute('aria-expanded', String(open))
      document.body.style.overflow = open ? 'hidden' : ''
    })

    // Close nav when a link is clicked
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open')
        burger.classList.remove('open')
        burger.setAttribute('aria-expanded', 'false')
        document.body.style.overflow = ''
      })
    })
  }

  /* ── Scroll Reveal (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal')
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    revealEls.forEach(el => io.observe(el))
  }

  /* ── Stagger children reveal ──── */
  const staggerGroups = document.querySelectorAll('.reveal-stagger')
  if (staggerGroups.length && 'IntersectionObserver' in window) {
    const sio = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.reveal')
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add('revealed'), i * 100)
            })
            sio.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05 }
    )
    staggerGroups.forEach(g => sio.observe(g))
  }

  /* ── Init Tilt.js ─────────────── */
  if (typeof VanillaTilt !== 'undefined') {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      VanillaTilt.init(el, {
        max: parseInt(el.dataset.tiltMax) || 6,
        speed: 600,
        perspective: parseInt(el.dataset.tiltPerspective) || 1000,
        glare: true,
        'max-glare': 0.08,
        gyroscope: true
      })
    })
  }

})()
