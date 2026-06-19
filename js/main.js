document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  let mm = gsap.matchMedia();

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
    /* ========== NAVBAR ========== */
    const navbar = document.getElementById('navbar');
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        if (self.progress > 0) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });

    /* ========== HERO TILES PARALLAX ========== */
    const rows = document.querySelectorAll('.tiles-row');
    rows.forEach((row, i) => {
      const speed = parseFloat(row.dataset.speed) || 0.5;
      const direction = i % 2 === 0 ? -1 : 1;
      gsap.to(row, {
        x: () => direction * speed * 200,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });

    /* ========== HERO CONTENT ========== */
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

    /* ========== SERIES CARDS ========== */
    gsap.from('#series .template-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#series',
        start: 'top 70%'
      }
    });

    /* ========== FEATURE CARDS ========== */
    gsap.from('.feature-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#features',
        start: 'top 70%'
      }
    });

    /* ========== GRID SCROLLER (VERTICAL) ========== */
    const gridSection = document.querySelector('.grid-scroll-section');
    const gridTextItems = document.querySelectorAll('.grid-scroll-section .grid__item--text');
    const gridImgs = document.querySelectorAll('.grid-scroll-section .grid__img');

    if (gridSection && window.innerWidth > 992) {
      ScrollTrigger.create({
        trigger: gridSection,
        start: 'top top',
        end: '+=180%',
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true
      });

      gridTextItems.forEach((item, i) => {
        gsap.fromTo(item, {
          opacity: 0,
          y: 100
        }, {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridSection,
            start: 'top 30%',
            end: 'top 10%',
            scrub: 1.2
          }
        });
      });

      gridImgs.forEach((img, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const rotStart = dir * (8 + i * 2);
        const rotEnd = -dir * (8 + i * 2);
        const yOffset = 120 + i * 40;

        gsap.fromTo(img, {
          y: yOffset * dir,
          rotation: rotStart,
          opacity: 0.5
        }, {
          y: -yOffset * dir,
          rotation: rotEnd,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: gridSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        });
      });
    }

    /* ========== CONTENT SECTIONS REVEAL ========== */
    const contentSections = document.querySelectorAll('#episodes, #videos, #events');
    contentSections.forEach(section => {
      gsap.from(section.querySelector('.content-text'), {
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%'
        }
      });
      gsap.from(section.querySelector('.content-images'), {
        x: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%'
        }
      });
    });

    /* ========== BLOG CARDS REVEAL ========== */
    gsap.from('#blog .template-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#blog',
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });

    /* ========== TESTIMONIAL SLIDER ========== */
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.dot');
    let currentTesti = 0;
    const totalTesti = document.querySelectorAll('.testimonial-card').length;

    function goToTesti(index) {
      if (!track) return;
      currentTesti = index;
      track.style.transform = `translateX(-${currentTesti * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[currentTesti]?.classList.add('active');
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToTesti(parseInt(dot.dataset.index));
      });
    });

    let testiInterval = setInterval(() => {
      goToTesti((currentTesti + 1) % totalTesti);
    }, 5000);

    const testimonialSection = document.getElementById('testimonials');
    if (testimonialSection) {
      testimonialSection.addEventListener('mouseenter', () => clearInterval(testiInterval));
      testimonialSection.addEventListener('mouseleave', () => {
        testiInterval = setInterval(() => {
          goToTesti((currentTesti + 1) % totalTesti);
        }, 5000);
      });
    }

    /* ========== FOOTER REVEAL ========== */
    gsap.from('.footer-content', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 70%'
      }
    });

    gsap.from('.footer-social a', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer-bottom',
        start: 'top 80%'
      }
    });

    /* ========== SECTION TAG REVEALS ========== */
    gsap.utils.toArray('.section-tag').forEach(tag => {
      gsap.from(tag, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: tag.closest('section') || tag.parentElement,
          start: 'top 75%'
        }
      });
    });

    /* ========== IMAGE PARALLAX ON SCROLL ========== */
    gsap.utils.toArray('.ci-main img, .ci-secondary img, .ci-accent img').forEach(img => {
      gsap.to(img, {
        y: '8%',
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.content-images'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    /* ========== REFRESH ========== */
    ScrollTrigger.refresh();
  }

  /* ========== REFRESH AFTER IMAGES LOAD ========== */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh(true);
  });
});
