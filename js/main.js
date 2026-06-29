document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========== UTILITIES ========== */
  function splitToWords(el) {
    const text = el.textContent;
    const words = text.split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  /* ========== HERO TILE GRID ========== */
  (function () {
    const images = [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=700&q=80',
      'https://images.unsplash.com/photo-1618605387956-8f9a1b4e51b8?w=700&q=80',
      'https://images.unsplash.com/photo-1552581234-26160f608093?w=700&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80',
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=700&q=80',
      'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=700&q=80',
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=700&q=80',
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=700&q=80',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=700&q=80',
      'https://images.unsplash.com/photo-1619983081563-430f63602796?w=700&q=80',
      'https://images.unsplash.com/photo-1567596388756-f6d710c8fc07?w=700&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=700&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700&q=80',
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=700&q=80',
      'https://images.unsplash.com/photo-1484981138541-3d074aa97716?w=700&q=80',
    ];

    const grid = document.getElementById('heroTiles');
    const hero = document.getElementById('hero');

    if (!grid || !hero) return;

    // Fill 20 tiles (5 cols x 4 rows)
    for (let i = 0; i < 20; i++) {
      const tile = document.createElement('div');
      tile.style.cssText = `
        border-radius: 10px;
        background: url(${images[i % images.length]}) center/cover;
        width: 100%;
        height: 100%;
      `;
      grid.appendChild(tile);
    }

    // Smooth lerp-based animation for buttery motion
    let mouseOffX = 0, mouseOffY = 0;
    let scrollOffX = 0, scrollOffY = 0;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const moveRangeX = 100;
    const moveRangeY = 160;
    const LERP = 0.08;

    function updateTarget() {
      targetX = scrollOffX + mouseOffX;
      targetY = scrollOffY + mouseOffY;
    }

    gsap.ticker.add(function tick() {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      if (Math.abs(currentX - targetX) < 0.01 && Math.abs(currentY - targetY) < 0.01) {
        currentX = targetX;
        currentY = targetY;
      }
      gsap.set(grid, { x: currentX, y: currentY, rotation: 13 });
    });

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      mouseOffX = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      mouseOffY = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      updateTarget();
    });

    hero.addEventListener('mouseleave', () => {
      mouseOffX = 0;
      mouseOffY = 0;
      updateTarget();
    });

    // ScrollTrigger — grid moves while hero visible, resets when passed
    if (!REDUCE) {
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: () => `bottom+=${window.innerHeight * 0.3} top`,
        scrub: 2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (p <= 0.7) {
            scrollOffX = (p / 0.7) * moveRangeX;
            scrollOffY = (p / 0.7) * moveRangeY;
          } else {
            scrollOffX = ((1 - p) / 0.3) * moveRangeX;
            scrollOffY = ((1 - p) / 0.3) * moveRangeY;
          }
          updateTarget();
        }
      });
    }
  })();

  /* ========== CURSOR ========== */
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.innerWidth > 576) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });
    });
    document.querySelectorAll('a, button, .template-card, .feature-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });
  }

  /* ========== PRELOADER ========== */
  const preloader = document.getElementById('preloader');
  const loaderBar = document.querySelector('.loader-bar');

  if (preloader && loaderBar) {
    gsap.to(loaderBar, {
      width: '100%',
      duration: 2,
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.to(preloader, {
          opacity: 0,
          visibility: 'hidden',
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            preloader.style.display = 'none';
            initAnimations();
          }
        });
      }
    });
  } else {
    initAnimations();
  }

  function initAnimations() {
    if (REDUCE) {
      gsap.set([
        '.section-tag', '.section-title', '.section-desc',
        '.template-card', '.feature-card', '.mask-wrap > *',
        '.content-text', '.content-images', '.ci-main', '.ci-secondary', '.ci-accent',
        '.footer-content', '.footer-social a',
        '.testimonial-card', '.blog-card'
      ], { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0, filter: 'blur(0px)' });
      return;
    }

    /* ========== NAVBAR ========== */
    const navbar = document.getElementById('navbar');
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom top',
      onEnter: () => navbar.classList.add('visible'),
      onLeaveBack: () => navbar.classList.remove('visible')
    });

    /* ========== HAMBURGER MENU ========== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        navLinks.classList.toggle('nav-open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          navLinks.classList.remove('nav-open');
          document.body.style.overflow = '';
        });
      });
      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
          hamburger.classList.remove('open');
          navLinks.classList.remove('nav-open');
          document.body.style.overflow = '';
        }
      });
    }

    /* ========== HERO CONTENT ENTRANCE ========== */
    gsap.from('.hero-title', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out'
    });
    gsap.from('.hero-subtitle', {
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    });
    gsap.from('.hero-buttons a', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.7,
      stagger: 0.15,
      ease: 'power3.out'
    });

    gsap.to('.hero-title', {
      y: 120,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.hero-subtitle', {
      y: 60,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    /* ========== SVG UNDERLINE DRAW ========== */
    const underlines = document.querySelectorAll('.underline-path');
    underlines.forEach(path => {
      const length = path.getTotalLength ? path.getTotalLength() : 300;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      ScrollTrigger.create({
        trigger: path.closest('.section-header, .content-text') || path.closest('section'),
        start: 'top 80%',
        onEnter: () => {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power2.inOut'
          });
        },
        once: true
      });
    });

    /* =====================================================================
       SECTION 1 — FADE + RISE (#series)
       ===================================================================== */
    const seriesTl = gsap.timeline({
      scrollTrigger: { trigger: '#series', start: 'top 75%', once: true }
    });
    seriesTl
      .from('#series .section-tag', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('#series .section-title', { y: 80, opacity: 0, duration: 1.1, ease: 'power3.out' }, '-=0.2')
      .from('#series .section-desc', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
      .from('#series .template-card', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.3');

    /* =====================================================================
       SECTION 2 — MASK REVEAL (#features)
       ===================================================================== */
    const featuresTl = gsap.timeline({
      scrollTrigger: { trigger: '#features', start: 'top 75%', once: true }
    });
    featuresTl
      .from('#features .section-tag', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('#features .section-title', { y: 80, opacity: 0, duration: 1.1, ease: 'power3.out' }, '-=0.2')
      .from('#features .section-desc', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
      .from('#features .mask-wrap > *', {
        yPercent: 100,
        duration: 1,
        stagger: 0.12,
        ease: 'power4.out'
      }, '-=0.3');

    /* =====================================================================
       SECTION 3 — TEXT SPLIT (#grid-scroll)
       ===================================================================== */

    /* =====================================================================
       SECTION 4 — IMAGE STACK MOTION (#episodes, #videos, #events)
       ===================================================================== */
    ['#episodes', '#videos', '#events'].forEach(id => {
      const section = document.querySelector(id);
      if (!section) return;
      const main = section.querySelector('.ci-main');
      const sec  = section.querySelector('.ci-secondary');
      const acc  = section.querySelector('.ci-accent');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 75%', once: true }
      });
      tl
        .from(section.querySelector('.section-tag'), { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
        .from(section.querySelector('.section-title'), { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.2')
        .from(section.querySelector('.content-desc, .content-text p'), { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .from(main, { y: 80, opacity: 0, rotation: -5, duration: 1, ease: 'power3.out' }, '-=0.5')
        .from(sec,  { y: 60, opacity: 0, rotation:  5, duration: 0.9, ease: 'power3.out' }, '-=0.4')
        .from(acc,  { y: 40, opacity: 0, rotation: -3, duration: 0.8, ease: 'power3.out' }, '-=0.3');

      if (window.innerWidth > 768) {
        gsap.to(main, { y: -40, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.to(sec,  { y: -25, rotation: 3,  ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.to(acc,  { y: -15, rotation: -2, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      }
    });

    /* =====================================================================
       SECTION 5 — HORIZONTAL MARQUEE
       ===================================================================== */
    const marqueeContainer = document.querySelector('.marquee-container');
    if (marqueeContainer) {
      marqueeContainer.querySelectorAll('.marquee-row').forEach(row => {
        const clone = row.cloneNode(true);
        row.parentElement.appendChild(clone);
        const width = row.scrollWidth;
        const rev = row.classList.contains('reverse');
        gsap.set(clone, { x: rev ? -width : width });
        const tl = gsap.timeline({ repeat: -1, paused: false });
        tl.to([row, clone], { x: rev ? `+=${width}` : `-=${width}`, duration: 30, ease: 'none' })
          .set(row,   { x: 0 })
          .set(clone, { x: rev ? -width : width });
        row.parentElement.addEventListener('mouseenter', () => tl.pause());
        row.parentElement.addEventListener('mouseleave', () => tl.resume());
      });
    }

    /* ========== BLOG ========== */
    const blogTl = gsap.timeline({
      scrollTrigger: { trigger: '#blog', start: 'top 75%', once: true }
    });
    blogTl
      .from('#blog .section-tag',    { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('#blog .section-title',  { y: 80, opacity: 0, duration: 1.1, ease: 'power3.out' }, '-=0.2')
      .from('#blog .section-desc',   { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
      .from('#blog .template-card',  { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.3');

    /* ========== TESTIMONIALS ========== */
    const testiTl = gsap.timeline({
      scrollTrigger: { trigger: '#testimonials', start: 'top 75%', once: true }
    });
    testiTl
      .from('#testimonials .section-tag',       { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('#testimonials .section-title',     { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.2')
      .from('#testimonials .testimonial-card',  { y: 60, opacity: 0, duration: 1,   ease: 'power3.out' }, '-=0.4');

    /* ========== FOOTER ========== */
    gsap.from('.footer-content', {
      y: 60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '#contact', start: 'top 70%', once: true }
    });
    gsap.from('.footer-social a', {
      y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-bottom', start: 'top 80%', once: true }
    });

    /* ========== GRID SCROLLER ========== */
    const gridSection = document.querySelector('.grid-scroll-section');
    const gridImgs    = document.querySelectorAll('.grid-scroll-section .grid__img');

    if (gridSection && window.innerWidth > 992) {
      ScrollTrigger.create({
        trigger: gridSection,
        start: 'top top',
        end: '+=180%',
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true
      });

      gridImgs.forEach((img, i) => {
        const dir      = i % 2 === 0 ? 1 : -1;
        const rotStart = dir * (8 + i * 2);
        const rotEnd   = -dir * (8 + i * 2);
        const yOffset  = 120 + i * 40;

        gsap.fromTo(img,
          { y: yOffset * dir,  rotation: rotStart, opacity: 0.5 },
          { y: -yOffset * dir, rotation: rotEnd,   opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: gridSection, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
          }
        );
      });
    }

    /* ========== MICRO INTERACTIONS ========== */
    if (window.innerWidth > 992) {
      document.querySelectorAll('.template-card, .feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect    = card.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          gsap.to(card, {
            rotateX: (e.clientY - rect.top  - centerY) / 20,
            rotateY: (centerX - (e.clientX - rect.left)) / 20,
            duration: 0.4, ease: 'power2.out'
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' });
        });
      });

      document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - rect.left - rect.width  / 2) * 0.25,
            y: (e.clientY - rect.top  - rect.height / 2) * 0.25,
            duration: 0.3, ease: 'power2.out'
          });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
        });
      });
    }

    /* ========== SCRIBBLE HIGHLIGHTS ========== */
    initScribbleHighlights();

    /* ========== REFRESH ========== */
    ScrollTrigger.refresh();
  }

  /* ========== TESTIMONIAL SLIDER ========== */
  const track = document.querySelector('.testimonial-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.testi-arrow--prev');
  const nextBtn = document.querySelector('.testi-arrow--next');
  const counter = document.querySelector('.testi-counter');
  let currentTesti = 0;
  const totalTesti = cards.length;


  function getSlideWidth() {
    if (!cards.length) return 0;
    return cards[0].getBoundingClientRect().width;
  }

  function goToTesti(index) {
    if (!track) return;
    currentTesti = Math.max(0, Math.min(index, totalTesti - 1));
    const slideWidth = getSlideWidth();
    gsap.to(track, { x: -(currentTesti * slideWidth), duration: 0.5, ease: 'power3.out' });
    if (counter) counter.textContent = (currentTesti + 1) + ' / ' + totalTesti;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    clearInterval(testiInterval);
    goToTesti(currentTesti - 1);
    resetAutoPlay();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    clearInterval(testiInterval);
    goToTesti(currentTesti + 1);
    resetAutoPlay();
  });

  let testiInterval;
  function resetAutoPlay() {
    clearInterval(testiInterval);
    testiInterval = setInterval(() => {
      goToTesti((currentTesti + 1) % totalTesti);
    }, 2000);
  }
  resetAutoPlay();

  const testimonialSection = document.getElementById('testimonials');
  if (testimonialSection) {
    testimonialSection.addEventListener('mouseenter', () => clearInterval(testiInterval));
    testimonialSection.addEventListener('mouseleave', resetAutoPlay);
  }

  window.addEventListener('resize', () => {
    goToTesti(currentTesti);
  });

  goToTesti(0);

  /* ========== SCRIBBLE HIGHLIGHTS ========== */
  function initScribbleHighlights() {
    const els = document.querySelectorAll('.scribble-highlight');
    if (!els.length) return;

    els.forEach((el, idx) => {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 5) return;

        let seed = idx * 137 + (el.textContent || '').length * 7;
        function r() {
          seed = (seed * 16807) % 2147483647;
          return seed / 2147483647;
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('scribble-svg');
        svg.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);
        el.appendChild(svg);

        const cx     = rect.width / 2;
        const cy     = rect.height / 2;
        const baseRx = rect.width * 0.55;
        const baseRy = rect.height * 0.55;

        const numLoops = 4 + Math.floor(r() * 4);
        const paths    = [];

        for (let i = 0; i < numLoops; i++) {
          const rx       = baseRx * (0.85 + r() * 0.3);
          const ry       = baseRy * (0.85 + r() * 0.3);
          const rotation = (r() - 0.5) * 0.25;
          const ox       = (r() - 0.5) * 6;
          const oy       = (r() - 0.5) * 6;
          const d        = ellipsePath(cx + ox, cy + oy, rx, ry, rotation, r);

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', d);
          path.setAttribute('stroke', 'rgba(255,255,255,0.75)');
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke-width', (1 + r() * 1).toFixed(1));
          path.setAttribute('stroke-linecap', 'round');
          svg.appendChild(path);
          paths.push(path);
        }

        const section = el.closest('section') || el.parentElement;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 80%', once: true }
        });

        paths.forEach(function (p, i) {
          try {
            var len = p.getTotalLength();
            if (len > 0) {
              gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
              tl.to(p, { strokeDashoffset: 0, duration: 1.2 + r() * 0.8, ease: 'power2.out' },
                i * (0.1 + r() * 0.1));
            }
          } catch (e) {}
        });
      });
    });
  }

  function ellipsePath(cx, cy, rx, ry, rot, rand) {
    var k    = 0.5522847498;
    var cosR = Math.cos(rot);
    var sinR = Math.sin(rot);
    var wobble = 1.5;

    function t(x, y) {
      var dx = x - cx;
      var dy = y - cy;
      return { x: cx + dx * cosR - dy * sinR, y: cy + dx * sinR + dy * cosR };
    }

    var pt = t(cx,      cy - ry);
    var pr = t(cx + rx, cy);
    var pb = t(cx,      cy + ry);
    var pl = t(cx - rx, cy);

    var c0 = t(cx + k * rx + (rand() - 0.5) * wobble, cy - ry      + (rand() - 0.5) * wobble);
    var c1 = t(cx + rx      + (rand() - 0.5) * wobble, cy - k * ry + (rand() - 0.5) * wobble);
    var c2 = t(cx + rx      + (rand() - 0.5) * wobble, cy + k * ry + (rand() - 0.5) * wobble);
    var c3 = t(cx + k * rx + (rand() - 0.5) * wobble, cy + ry      + (rand() - 0.5) * wobble);
    var c4 = t(cx - k * rx + (rand() - 0.5) * wobble, cy + ry      + (rand() - 0.5) * wobble);
    var c5 = t(cx - rx      + (rand() - 0.5) * wobble, cy + k * ry + (rand() - 0.5) * wobble);
    var c6 = t(cx - rx      + (rand() - 0.5) * wobble, cy - k * ry + (rand() - 0.5) * wobble);
    var c7 = t(cx - k * rx + (rand() - 0.5) * wobble, cy - ry      + (rand() - 0.5) * wobble);

    function f(p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }

    return 'M' + f(pt) +
      ' C' + f(c0) + ' ' + f(c1) + ' ' + f(pr) +
      ' C' + f(c2) + ' ' + f(c3) + ' ' + f(pb) +
      ' C' + f(c4) + ' ' + f(c5) + ' ' + f(pl) +
      ' C' + f(c6) + ' ' + f(c7) + ' ' + f(pt);
  }

  /* ========== REFRESH AFTER IMAGES LOAD ========== */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh(true);
  });

}); // ← closes DOMContentLoaded