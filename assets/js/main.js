// ── SCROLL PROGRESS BAR
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ── NAV scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  });
});

// ── HERO TEXT ANIMATION
function animateHero() {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const h1 = document.querySelector('.hero-content h1');
  const sub = document.querySelector('.hero-sub');
  const btns = document.querySelectorAll('.hero-content .btn-primary, .hero-content .btn-ghost');

  if (h1) {
    const lines = h1.innerText.split('\n').filter(l => l.trim());
    h1.innerHTML = lines.map(line =>
      '<span class="word">' + line.split('').map(c =>
        '<span class="char">' + (c === ' ' ? '&nbsp;' : c) + '</span>'
      ).join('') + '</span><br>'
    ).join('');

    const chars = h1.querySelectorAll('.char');
    chars.forEach((c, i) => {
      setTimeout(() => c.classList.add('revealed'), 400 + i * 40);
    });
  }

  setTimeout(() => eyebrow && eyebrow.classList.add('revealed'), 200);
  setTimeout(() => sub && sub.classList.add('revealed'), 400 + 12 * 40 + 200);
  const heroBtns = document.querySelector('.hero-btns');
  if (heroBtns) setTimeout(() => heroBtns.classList.add('revealed'), 400 + 12 * 40 + 500);
}
window.addEventListener('load', animateHero);

// ── INTRO STRIP QUOTE
const introObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      introObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.intro-strip p').forEach(el => introObserver.observe(el));

// ── SECTION LABELS
const labelObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      labelObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.8 });
document.querySelectorAll('.section-label').forEach(el => labelObserver.observe(el));

// ── GENERIC FADE-IN
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── STAGGER CHILDREN
const staggerObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      staggerObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.stagger-children').forEach(el => staggerObserver.observe(el));

// ── PRICING GLOW
const glowObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible-glow');
      glowObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.pricing-card.featured').forEach(el => glowObserver.observe(el));

// ── COUNT-UP ANIMATION
function countUp(el, target, duration) {
  duration = duration || 1800;
  const start = performance.now();
  const isFloat = String(target).includes('.');
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = ease * target;
    el.textContent = isFloat ? val.toFixed(2) : Math.round(val).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseFloat(e.target.dataset.target);
      if (!isNaN(target)) countUp(e.target, target);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.8 });
document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

// ── SMOOTH PARALLAX (mobile-safe, replaces background-attachment:fixed)
const parallaxEls = document.querySelectorAll('.hero-bg, .nature-bg');
function updateParallax() {
  parallaxEls.forEach(el => {
    const rect = el.parentElement.getBoundingClientRect();
    const offset = rect.top * 0.35;
    el.style.transform = 'translateY(' + offset + 'px)';
  });
}
if (!('ontouchstart' in window)) {
  document.querySelectorAll('.hero-bg, .nature-bg').forEach(el => {
    el.style.backgroundAttachment = 'scroll';
    el.style.willChange = 'transform';
  });
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

// ── CAROUSEL with slide transitions
const items = document.querySelectorAll('.carousel-item');
const dotsContainer = document.getElementById('carousel-dots');
let current = 0;
let autoTimer;
let isAnimating = false;

items.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  dotsContainer.appendChild(dot);
});
const dots = dotsContainer.querySelectorAll('.dot');

function goTo(n) {
  if (isAnimating || n === current) return;
  isAnimating = true;
  const prev = current;
  current = (n + items.length) % items.length;
  items[prev].classList.add('exit-left');
  dots[prev].classList.remove('active');
  setTimeout(() => {
    items[prev].classList.remove('active', 'exit-left');
    items[current].classList.add('active');
    dots[current].classList.add('active');
    isAnimating = false;
  }, 500);
}

if (items.length) {
  items[0].classList.add('active');
  document.querySelector('.carousel-prev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.querySelector('.carousel-next').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 5500); }
  autoTimer = setInterval(() => goTo(current + 1), 5500);
}

// ── FAQ ACCORDION
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ── BUTTON RIPPLE
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size/2) + 'px;top:' + (e.clientY - rect.top - size/2) + 'px';
    this.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

// ── CONTACT FORM
const form = document.getElementById('book-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const sessionType = form['session-type'].value;
    const message = form.message.value;
    const subject = encodeURIComponent('Booking Enquiry — ' + sessionType + ' — ' + name);
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone || 'Not provided') + '\nSession: ' + sessionType + '\n\n' + message);
    window.location.href = 'mailto:bikebodybreath@gmail.com?subject=' + subject + '&body=' + body;
    document.getElementById('form-success').style.display = 'block';
    form.reset();
  });
}
