/* =====================================================
   PROFILO – Script
   Theme: Starry Night Sky
   ===================================================== */

// ── Cursor Glow ──────────────────────────────────────
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ── Navbar scroll shadow ─────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Typed text effect ────────────────────────────────
const roles = ['Data Engineer 📊', 'Business Analyst 🔍', 'Power BI Developer 📈', 'Python Enthusiast 🐍'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; return setTimeout(typeLoop, 1800); }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

// ── Starry Sky Canvas ─────────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ── Stars ──────────────────────────────────────────
const STAR_COUNT = 220;
const stars = [];

class Star {
  constructor() { this.init(); }
  init() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    // Phân loại sao theo kích thước
    const roll = Math.random();
    if (roll < 0.65) {
      // Sao nhỏ (nhiều nhất)
      this.r = Math.random() * 0.7 + 0.2;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    } else if (roll < 0.90) {
      // Sao vừa
      this.r = Math.random() * 1.0 + 0.7;
      this.baseAlpha = Math.random() * 0.5 + 0.35;
    } else {
      // Sao sáng lớn (hiếm)
      this.r = Math.random() * 1.5 + 1.2;
      this.baseAlpha = Math.random() * 0.4 + 0.55;
    }
    this.alpha = this.baseAlpha;
    // Nhấp nháy
    this.twinkleSpeed = Math.random() * 0.015 + 0.005;
    this.twinklePhase = Math.random() * Math.PI * 2;
    // Màu sắc: phần lớn trắng, một ít xanh nhạt, vàng nhạt
    const colorRoll = Math.random();
    if (colorRoll < 0.60) {
      this.color = '255,255,255';  // trắng
    } else if (colorRoll < 0.78) {
      this.color = '210,190,255';  // tím nhạt
    } else if (colorRoll < 0.91) {
      this.color = '160,220,255';  // cyan nhạt
    } else {
      this.color = '230,210,255';  // tím trắng
    }
  }
  update(t) {
    this.alpha = this.baseAlpha + Math.sin(t * this.twinkleSpeed + this.twinklePhase) * 0.25;
    this.alpha = Math.max(0.05, Math.min(1, this.alpha));
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha.toFixed(3)})`;
    ctx.fill();

    // Thêm ánh sáng hào quang cho sao lớn
    if (this.r > 1.5) {
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 5);
      grd.addColorStop(0, `rgba(${this.color},${(this.alpha * 0.4).toFixed(3)})`);
      grd.addColorStop(1, `rgba(${this.color},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
  }
}

for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

// ── Shooting Stars ─────────────────────────────────
const shootingStars = [];

class ShootingStar {
  constructor() { this.reset(); }
  reset() {
    this.active = false;
    this.countdown = Math.random() * 5000 + 2000; // 2-7 giây mới xuất hiện
    this.timer = 0;
  }
  activate() {
    this.active = true;
    // Bắt đầu từ góc trên
    this.x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    this.y = Math.random() * canvas.height * 0.3;
    const angle = (Math.random() * 30 + 25) * Math.PI / 180; // 25-55 độ
    const speed = Math.random() * 8 + 6;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.length = Math.random() * 120 + 80;
    this.alpha = 1;
    this.life = 0;
    this.maxLife = Math.random() * 40 + 30;
  }
  update(dt) {
    if (!this.active) {
      this.timer += dt;
      if (this.timer >= this.countdown) this.activate();
      return;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    this.alpha = 1 - this.life / this.maxLife;
    if (this.alpha <= 0 || this.x > canvas.width || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    if (!this.active || this.alpha <= 0) return;
    const tailX = this.x - this.vx * (this.length / 10);
    const tailY = this.y - this.vy * (this.length / 10);
    const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
    grad.addColorStop(0, `rgba(255,255,255,0)`);
    grad.addColorStop(0.6, `rgba(200,225,255,${(this.alpha * 0.5).toFixed(3)})`);
    grad.addColorStop(1, `rgba(255,255,255,${this.alpha.toFixed(3)})`);
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Đầu sao sáng
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha.toFixed(3)})`;
    ctx.fill();
  }
}

// Tạo 4 sao băng
for (let i = 0; i < 4; i++) {
  const ss = new ShootingStar();
  ss.timer = Math.random() * ss.countdown; // randomize start time
  shootingStars.push(ss);
}

// ── Nebula (tinh vân mờ) ────────────────────────────
function drawNebula() {
  // Tinh vân tím trái
  const g1 = ctx.createRadialGradient(
    canvas.width * 0.15, canvas.height * 0.2, 0,
    canvas.width * 0.15, canvas.height * 0.2, canvas.width * 0.25
  );
  g1.addColorStop(0, 'rgba(100,40,200,0.05)');
  g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tinh vân cyan phải
  const g2 = ctx.createRadialGradient(
    canvas.width * 0.85, canvas.height * 0.6, 0,
    canvas.width * 0.85, canvas.height * 0.6, canvas.width * 0.2
  );
  g2.addColorStop(0, 'rgba(6,182,212,0.045)');
  g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tinh vân tím trung tâm nhẹ
  const g3 = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.4, 0,
    canvas.width * 0.5, canvas.height * 0.4, canvas.width * 0.3
  );
  g3.addColorStop(0, 'rgba(80,30,150,0.04)');
  g3.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g3;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ── Animation Loop ──────────────────────────────────
let lastTime = 0;
function animateSky(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ tinh vân
  drawNebula();

  // Vẽ sao
  stars.forEach(s => { s.update(timestamp); s.draw(); });

  // Vẽ sao băng
  shootingStars.forEach(ss => { ss.update(dt); ss.draw(); });

  requestAnimationFrame(animateSky);
}
requestAnimationFrame(animateSky);

// ── Scroll Reveal ────────────────────────────────────
const revealEls = document.querySelectorAll('.section-inner > *, .project-card, .tl-item, .skill-group, .contact-card');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ── Skill Bar Animation ──────────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
skillFills.forEach(f => skillObserver.observe(f));

// ── Project Filter ───────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cats = card.dataset.cat || '';
      const show = filter === 'all' || cats.includes(filter);
      card.style.display = show ? 'flex' : 'none';
      if (show) setTimeout(() => card.style.opacity = '1', 10);
    });
  });
});

// ── Contact Form ─────────────────────────────────────
function handleForm(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const success = document.getElementById('form-success');
  btn.textContent = 'Đang gửi...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Gửi ngay 🚀';
    btn.disabled = false;
    success.classList.remove('hidden');
    e.target.reset();
    setTimeout(() => success.classList.add('hidden'), 4000);
  }, 1200);
}

// ── Active nav link on scroll ────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent2)' : '';
  });
});

// ── Counter animation ────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0, step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + (el.dataset.suffix || '+');
    if (start < target) requestAnimationFrame(tick);
  };
  tick();
}

const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const num = parseInt(e.target.textContent);
      e.target.textContent = '0+';
      animateCounter(e.target, num);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObserver.observe(n));
