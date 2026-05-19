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
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUZZ6lK86zlBkEOjgK-G3xpC5RAN_xwNYZLcxqrY6nSQwibZwlg4WZp1Yi5czZV9lx/exec';

async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('.btn-submit');
  const inputs = form.querySelectorAll('input, select, textarea');

  const name = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const plan = inputs[2].value;
  const idea = inputs[3].value.trim();

  if (!name || !email || !plan || !idea) {
    showToast('Veuillez remplir tous les champs.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Envoi en cours...";

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, plan, idea })
    });

    showToast("Message envoyé! Nous vous répondrons dans les 24 heures.", 'success');
    form.reset();

  } catch (err) {
    showToast('Une erreur s\'est produite. Veuillez réessayer.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = "<i class='bx bx-send'></i> <span>Send message</span>";
  }
}

function showToast(message, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('toast-visible'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function openPlan(event, plan) {
    event.preventDefault();

    const deepLink = `https://jaayma-app.github.io/Amm-Sa-Appli-Web/selection?plan=${plan}`;
    const fallback = `plan.html?plan=${plan}`;

    // Trigger deep link without touching window.location
    const anchor = document.createElement('a');
    anchor.href = deepLink;
    anchor.click();

    setTimeout(() => {
        window.location.href = fallback;
    }, 1500);
}

function openPlanFromDetail(event, plan) {
    event.preventDefault();

    const deepLink = `https://jaayma-app.github.io/Amm-Sa-Appli-Web/selection?plan=${plan}`;
    const fallback = `index.html#contact?plan=${plan}`;

    // Trigger deep link without touching window.location
    const anchor = document.createElement('a');
    anchor.href = deepLink;
    anchor.click();

    setTimeout(() => {
        window.location.href = fallback;
    }, 1500);
}
