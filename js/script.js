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

// Add this after your page loads
const params = new URLSearchParams(window.location.search);
const plan = params.get('plan');

if (plan) {
    const select = document.querySelector('.contact-form select');
    if (select) {
        // Find and select the matching option
        [...select.options].forEach(opt => {
            if (opt.value.toLowerCase() === plan.toLowerCase()) {
                opt.selected = true;
            }
        });
    }
}

const PROFIT_PLANS = {
    basic:  { fee: 200000, adsSetup: 50000, hosting: 0 },
    medium: { fee: 600000, adsSetup: 75000, hosting: 30000 },
    pro:    { fee: 1400000, adsSetup: 90000, hosting: 100000 },
  };

  let profitPlan = 'basic';
  let profitChartInstance = null;

  function selectProfitPlan(plan, el) {
    profitPlan = plan;
    document.querySelectorAll('.profit-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    updateProfit();
  }

  function fmtNum(n) {
    return Math.round(n).toLocaleString('fr-FR');
  }

  function updateProfit() {
    const users   = parseInt(document.getElementById('profitUsers').value);
    const arpu    = parseInt(document.getElementById('profitARPU').value);
    const months  = parseInt(document.getElementById('profitMonths').value);
    const adsOn   = document.getElementById('profitAdsToggle').checked;
    const traffic = parseInt(document.getElementById('profitTraffic').value);

    document.getElementById('profitUsersVal').textContent  = fmtNum(users);
    document.getElementById('profitARPUVal').textContent   = fmtNum(arpu);
    document.getElementById('profitMonthsVal').textContent = months + ' mo';

    const tg = document.getElementById('profitTrafficGroup');
    tg.style.display = adsOn ? 'block' : 'none';

    const p = PROFIT_PLANS[profitPlan];
    const setupCost   = p.fee + (adsOn ? p.adsSetup : 0);
    const monthlyCost = p.hosting + (adsOn ? traffic : 0);
    const totalCost   = setupCost + monthlyCost * months;

    // Build per-month arrays
    const labels   = [];
    const revenues = [];
    const costs    = [];
    const nets     = [];

    for (let m = 1; m <= months; m++) {
      const rev       = users * arpu * m + (adsOn ? traffic * m : 0);
      const costSoFar = setupCost + monthlyCost * m;
      labels.push('M' + m);
      revenues.push(rev);
      costs.push(costSoFar);
      nets.push(rev - costSoFar);
    }

    const totalRevenue = revenues[revenues.length - 1] || 0;
    const netProfit    = totalRevenue - totalCost;
    const roi          = totalCost > 0 ? ((netProfit / totalCost) * 100) : 0;

    // Update metric cards
    document.getElementById('metricInvestment').textContent = fmtNum(totalCost) + ' CFA';
    document.getElementById('metricRevenue').textContent    = fmtNum(totalRevenue) + ' CFA';

    const netEl = document.getElementById('metricNet');
    netEl.textContent = fmtNum(netProfit) + ' CFA';
    netEl.className   = 'profit-metric-val ' + (netProfit >= 0 ? 'positive' : 'negative');

    const roiEl = document.getElementById('metricROI');
    roiEl.textContent = roi.toFixed(1) + '%';
    roiEl.className   = 'profit-metric-val ' + (roi >= 0 ? 'positive' : 'negative');

    // Draw chart
    const ctx = document.getElementById('profitChart').getContext('2d');
    if (profitChartInstance) profitChartInstance.destroy();

    profitChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue (CFA)',
            data: revenues,
            backgroundColor: 'rgba(104,32,236,0.7)',
            borderRadius: 4,
            order: 2,
          },
          {
            label: 'Total Cost (CFA)',
            data: costs,
            backgroundColor: 'rgba(37,99,235,0.5)',
            borderRadius: 4,
            order: 2,
          },
          {
            label: 'Net Profit (CFA)',
            data: nets,
            type: 'line',
            borderColor: '#639922',
            backgroundColor: 'rgba(99,153,34,0.1)',
            borderWidth: 2,
            pointRadius: months <= 12 ? 4 : 2,
            fill: true,
            tension: 0.4,
            order: 1,
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: {
              color: '#9090b0',
              font: { family: 'DM Sans', size: 11 },
              boxWidth: 12,
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + fmtNum(ctx.raw) + ' CFA'
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#9090b0', font: { size: 10 } },
            grid:  { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            ticks: {
              color: '#9090b0',
              font: { size: 10 },
              callback: v => fmtNum(v)
            },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  }

  // Init on load
  document.addEventListener('DOMContentLoaded', updateProfit);
