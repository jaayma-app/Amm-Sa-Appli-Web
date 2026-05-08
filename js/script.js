// Mobile menu toggle
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
  navbar.classList.toggle('active');
  menuIcon.classList.toggle('bx-x');
});

// Close menu on nav link click
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuIcon.classList.remove('bx-x');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  // Sticky header style
  const header = document.querySelector('.header');
  if (scrollY > 50) {
    header.style.background = 'rgba(10,10,18,0.97)';
  } else {
    header.style.background = 'rgba(10,10,18,0.85)';
  }

  // Active section highlight
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.navbar a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

// Scroll reveal
const revealElements = document.querySelectorAll(
  '.about-card, .plan-card, .feature-item, .policy-block, .home-content, .home-img, .section-title, .section-sub, .section-tag, .contact-info, .contact-form'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// Staggered children reveal
document.querySelectorAll('.about-grid, .plans-grid, .features-grid, .policy-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.08}s`;
  });
});

// Form submit handler
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.innerHTML = "<i class='bx bx-check'></i> Message sent!";
  btn.style.background = '#3B6D11';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = "<i class='bx bx-send'></i> Send message";
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}
