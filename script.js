// ============ THEME TOGGLE ============
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ============ NAVIGATION ============
const navButtons = document.querySelectorAll('.nav-bar button');
const pages = document.querySelectorAll('.page');

function navigateTo(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  navButtons.forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelector(`.nav-bar button[data-page="${pageId}"]`).classList.add('active');
  document.getElementById('navBar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(initReveals, 50);
  if (pageId === 'home') setTimeout(animateCounters, 200);
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});

// ============ MOBILE MENU ============
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navBar').classList.toggle('open');
});

// ============ SCROLL PROGRESS ============
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scrollProgress').style.width = scrolled + '%';
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// ============ BACK TO TOP ============
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ REVEAL ON SCROLL ============
function initReveals() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
}
initReveals();

// ============ ANIMATED COUNTERS ============
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += stepValue;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      const display = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
      el.textContent = display + suffix;
    }, duration / steps);
  });
}
setTimeout(animateCounters, 400);

// ============ TABLE SORTING ============
const table = document.getElementById('toolsTable');
const headers = table.querySelectorAll('th');
let sortDir = {};

headers.forEach(th => {
  th.addEventListener('click', () => {
    const col = parseInt(th.dataset.col);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const asc = sortDir[col] !== 'asc';
    sortDir = {};
    sortDir[col] = asc ? 'asc' : 'desc';
    rows.sort((a, b) => {
      const aText = a.children[col].textContent.trim();
      const bText = b.children[col].textContent.trim();
      return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach(r => tbody.appendChild(r));
    headers.forEach(h => h.classList.remove('sorted', 'sorted-asc'));
    th.classList.add(asc ? 'sorted-asc' : 'sorted');
  });
});

// ============ EVENT REGISTRATION ============
function registerEvent(btn, eventName) {
  btn.textContent = '✓ Angemeldet';
  btn.style.background = 'var(--gradient)';
  btn.style.color = 'white';
  btn.disabled = true;
  showToast(`Erfolgreich angemeldet zu: ${eventName}`);
}

// ============ POLL ============
const pollOptions = document.querySelectorAll('.poll-option');
let hasVoted = localStorage.getItem('hasVoted') === 'true';

function renderPoll() {
  let total = 0;
  pollOptions.forEach(opt => total += parseInt(opt.dataset.votes));
  pollOptions.forEach(opt => {
    const votes = parseInt(opt.dataset.votes);
    const percent = Math.round((votes / total) * 100);
    if (hasVoted) {
      opt.classList.add('voted');
      opt.querySelector('.poll-bar').style.width = percent + '%';
      opt.querySelector('.poll-percent').textContent = percent + '%';
    }
  });
}

pollOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    if (hasVoted) return;
    opt.dataset.votes = parseInt(opt.dataset.votes) + 1;
    hasVoted = true;
    localStorage.setItem('hasVoted', 'true');
    renderPoll();
    showToast('Danke für Ihre Stimme! 🎉');
  });
});
renderPoll();

// ============ CONTACT FORM ============
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Wird gesendet...';
  btn.disabled = true;
  setTimeout(() => {
    showToast('✓ Nachricht erfolgreich gesendet!');
    e.target.reset();
    btn.textContent = 'Nachricht senden ✉️';
    btn.disabled = false;
  }, 1000);
}

// ============ TOAST ============
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============ HIGHLIGHTS FILTER TABS ============
document.querySelectorAll('.beitraege-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.beitraege-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('#highlightsGrid .card').forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ============ NEWSLETTER ============
function submitNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Wird gesendet...';
  btn.disabled = true;
  setTimeout(() => {
    showToast('✓ Erfolgreich für den Newsletter angemeldet!');
    e.target.reset();
    btn.textContent = 'Jetzt anmelden';
    btn.disabled = false;
  }, 800);
}

// ============ KEYBOARD NAVIGATION ============
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('navBar').classList.remove('open');
  }
});
