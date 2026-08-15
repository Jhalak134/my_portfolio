/* ══════════════════════════════════════════
   JHALAK MITTAL — PORTFOLIO JAVASCRIPT
   Intersection Observer animations, counters,
   skill bars, lightbox, navbar, hamburger
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────
     1. NAVBAR — scroll + hamburger
  ────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ──────────────────────────────────
     2. ACTIVE NAV LINK on scroll
  ────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navLinkEls  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ──────────────────────────────────
     3. GENERAL INTERSECTION OBSERVER
        triggers 'animated' class
  ────────────────────────────────── */
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Elements that receive 'animated' class
  const animatables = [
    '.about-photo-slide',
    '.stagger-up',
    '.mv-card',
    '.exp-card',
    '.edu-card',
    '.proj-card',
    '.skill-category-card',
    '.cert-card',
    '.ach-card',
    '.contact-form-panel',
    '.contact-info-panel',
  ];

  animatables.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      animateObserver.observe(el);
    });
  });

  /* ──────────────────────────────────
     4. SKILL BARS — animate on visible
  ────────────────────────────────── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const bars = card.querySelectorAll('.skill-bar-fill');
        const pcts = card.querySelectorAll('.skill-pct');

        bars.forEach((bar, i) => {
          const target = parseInt(bar.dataset.fill, 10);
          const pctEl  = pcts[i];
          // Delay per card wave
          const waveDelay = parseInt(card.style.getPropertyValue('--wi') || '0') * 100;

          setTimeout(() => {
            bar.style.width = target + '%';
            // Count-up number
            animateCounter(pctEl, 0, target, 1000, v => v + '%');
          }, waveDelay + i * 80);
        });

        skillObserver.unobserve(card);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category-card').forEach(card => {
    skillObserver.observe(card);
  });

  /* ──────────────────────────────────
     5. STAT COUNTERS
  ────────────────────────────────── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, 0, target, 1200);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el, from, to, duration, format) {
    const start  = performance.now();
    const fmt    = format || (v => v);
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = fmt(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ──────────────────────────────────
     6. EXPERIENCE CARDS — stagger
  ────────────────────────────────── */
  const expObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        expObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.exp-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.15) + 's';
    expObserver.observe(card);
  });

  /* ──────────────────────────────────
     7. PROJECTS — observe each card
  ────────────────────────────────── */
  const projObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        projObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.proj-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
    projObserver.observe(card);
  });

  /* ──────────────────────────────────
     8. CERTIFICATIONS — waterfall
  ────────────────────────────────── */
  const certObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        certObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.cert-card').forEach(card => {
    certObserver.observe(card);
  });

  /* ──────────────────────────────────
     9. ACHIEVEMENTS — zoom spring
  ────────────────────────────────── */
  const achObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        achObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.ach-card').forEach(card => {
    achObserver.observe(card);
  });

  /* ──────────────────────────────────
     10. SKILLS WAVE — observe grid
  ────────────────────────────────── */
  const skillWaveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        skillWaveObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skill-wave').forEach(card => {
    skillWaveObserver.observe(card);
  });

  /* ──────────────────────────────────
     11. CERTIFICATE LIGHTBOX
  ────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.cert-img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ──────────────────────────────────
     12. SEND BUTTON PULSE on load
  ────────────────────────────────── */
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    const contactObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          sendBtn.classList.add('pulse');
          sendBtn.addEventListener('animationend', () => sendBtn.classList.remove('pulse'), { once: true });
        }, 1200);
        contactObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.5 });
    contactObserver.observe(sendBtn);
  }

  /* ──────────────────────────────────
     13. CERT CARD — 3D tilt on hover
  ────────────────────────────── */
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const dx     = e.clientX - rect.left - cx;
      const dy     = e.clientY - rect.top  - cy;
      const tiltX  = -(dy / cy) * 5;
      const tiltY  =  (dx / cx) * 5;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ──────────────────────────────────
     14. SMOOTH SCROLL for CTA buttons
  ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────
     15. CONTACT FORM — open mailto
  ────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('fullName').value;
      const email   = document.getElementById('emailAddr').value;
      const subject = document.getElementById('subjectField').value;
      const message = document.getElementById('messageField').value;

      const mailSubject = encodeURIComponent(`Portfolio Contact: ${subject}`);
      const mailBody    = encodeURIComponent(
        `Hi Jhalak,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via portfolio contact form`
      );

      window.location.href = `mailto:mittaljhalak908@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      contactForm.reset();
    });
  }

  /* ──────────────────────────────────
     16. ACHIEVEMENT CARD — gold border trace
  ────────────────────────────── */
  // Already handled by CSS :hover pseudo-elements

  /* ──────────────────────────────────
     17. ABOUT SECTION — Mission/Vision flip
        on mobile: show both cards directly
  ────────────────────────────── */
  const mvCards = document.querySelectorAll('.mv-card');
  const mvObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, i * 200);
        mvObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  mvCards.forEach(card => mvObserver.observe(card));

});
