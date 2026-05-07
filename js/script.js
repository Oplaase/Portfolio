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
