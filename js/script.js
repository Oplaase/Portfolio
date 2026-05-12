// Lightbox
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.bloc-screenshot').forEach(img => {
    img.addEventListener('click', () => open(img.src, img.alt));
  });

  lightboxClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 80;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;

    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// Bloc accordion
document.querySelectorAll('.bloc-header').forEach(header => {
  header.addEventListener('click', () => {
    const bloc = header.closest('.bloc-competence');
    const toggle = header.querySelector('.bloc-toggle');
    const content = bloc.querySelector('.bloc-content');
    const isOpen = content.classList.contains('open');

    content.classList.toggle('open', !isOpen);
    toggle.classList.toggle('open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
});

// Fade-in on scroll
const fadeEls = document.querySelectorAll(
  '.bloc-competence, .poursuite-card, .contact-item, .apropos-grid, .table-wrapper'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

// Synthèse checkboxes – persist state in localStorage
(function () {
  const STORAGE_KEY = 'synthese-checks';

  function saveChecks() {
    const state = {};
    document.querySelectorAll('.synthese-table input[type="checkbox"]').forEach(cb => {
      if (cb.checked) state[cb.dataset.id] = true;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadChecks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    let state = null;
    try { state = saved ? JSON.parse(saved) : null; } catch (_) {}
    document.querySelectorAll('.synthese-table input[type="checkbox"]').forEach(cb => {
      cb.checked = state ? !!state[cb.dataset.id] : cb.defaultChecked;
    });
  }

  loadChecks();

  document.querySelectorAll('.synthese-table input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', saveChecks);
  });

  const resetBtn = document.getElementById('resetChecks');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.synthese-table input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      localStorage.removeItem(STORAGE_KEY);
    });
  }
})();

// Site preview modal
(function () {
  const modal = document.getElementById('siteModal');
  const modalIframe = document.getElementById('siteModalIframe');
  const modalUrl = document.getElementById('siteModalUrl');
  const modalClose = document.getElementById('siteModalClose');

  function openModal(url) {
    modalIframe.src = url;
    if (modalUrl) modalUrl.textContent = url.replace('https://', '');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modalIframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.site-preview-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.url;
      if (url) openModal(url);
    });
  });

  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();

// Contact form (UI only)
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    feedback.textContent = 'Veuillez remplir tous les champs.';
    feedback.className = 'form-feedback error';
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    feedback.textContent = 'Adresse email invalide.';
    feedback.className = 'form-feedback error';
    return;
  }

  feedback.textContent = 'Message envoyé ! Je vous répondrai bientôt.';
  feedback.className = 'form-feedback success';
  form.reset();
});
