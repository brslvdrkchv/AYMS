/**
 * AYMS Conf 2026 — Desktop Interactive Features & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navbar Dynamic Shadow & ScrollSpy ---
  const desktopNav = document.getElementById('desktop-nav');
  const sections = document.querySelectorAll('.vh-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-menu-toggle');

  if (mobileToggle && desktopNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = desktopNav.classList.toggle('nav-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  let scrollTicking = false;
  const updateScrollState = () => {
    const scrollY = window.scrollY;
    // Nav bar scrolled state
    if (scrollY > 40) {
      desktopNav?.classList.add('scrolled');
    } else {
      desktopNav?.classList.remove('scrolled');
    }

    // ScrollSpy active link tracking
    let currentId = '';
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.id;
        break;
      }
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', Boolean(currentId && link.getAttribute('href') === `#${currentId}`));
    });
    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollState);
      scrollTicking = true;
    }
  }, { passive: true });

  // --- 2. Smooth Scrolling for Internal Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const candidates = document.querySelectorAll(targetId);
      let targetEl = null;
      for (const el of candidates) {
        if (el.offsetParent !== null || el.getClientRects().length > 0) {
          targetEl = el;
          break;
        }
      }
      if (!targetEl && candidates.length > 0) targetEl = candidates[0];

      if (targetEl) {
        e.preventDefault();
        desktopNav?.classList.remove('nav-open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --- 3. Interactive Modal Content & Management ---
  const modalContainer = document.getElementById('modal-container');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  function openModal(type) {
    const data = window.I18n?.getModalData?.(type);
    if (!data) return;
    modalContainer.dataset.activeType = type;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;
    modalContainer.classList.add('active');
    modalContainer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalContainer.classList.remove('active');
    modalContainer.setAttribute('aria-hidden', 'true');
    modalContainer.removeAttribute('data-active-type');
    document.body.style.overflow = '';
  }

  // Bind Registration Buttons across Desktop and Mobile (UA & EN)
  document.querySelectorAll('#nav-btn-register, #hero-btn-register, #banner-btn-register, #footer-btn-register, #btn-nav-register, .m-nav-register, [data-modal="register"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('register');
    });
  });

  // Bind Guidelines, Sample, and Presentation Modals
  document.querySelectorAll('#btn-desktop-theses, #btn-m-open-theses, [data-modal="theses"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('theses');
    });
  });
  document.querySelectorAll('#btn-desktop-sample, #btn-m-open-sample, [data-modal="sample"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('sample');
    });
  });
  document.querySelectorAll('#btn-desktop-presentation, #btn-m-open-presentation, [data-modal="presentation"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('presentation');
    });
  });

  document.querySelectorAll('#btn-back-to-top, #btn-m-back-to-top').forEach(el => {
    el.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });

  modalClose?.addEventListener('click', closeModal);
  modalConfirmBtn?.addEventListener('click', closeModal);

  modalContainer?.addEventListener('click', (e) => {
    if (e.target === modalContainer) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer?.classList.contains('active')) {
      closeModal();
    }
  });
});
