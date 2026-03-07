gsap.registerPlugin(ScrollTrigger);

/* Canvas Background Effects */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let cw = 0;
let ch = 0;

const trailParticles = [];
const trailConfig = {
  maxParticles: 24,
  lifeMs: 1400,
};

function resizeCanvas() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (event) => {
  addTrailParticle(event.clientX, event.clientY);
});

function addTrailParticle(x, y) {
  trailParticles.push({
    x,
    y,
    radius: Math.random() * 120 + 80,
    created: performance.now(),
  });

  if (trailParticles.length > trailConfig.maxParticles) {
    trailParticles.shift();
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';

  const now = performance.now();
  const t = now / 1000;

  // Breathing ring
  const centerX = cw / 2;
  const centerY = ch / 2;
  const baseRadius = Math.min(cw, ch) * 0.34;
  const pulse = 1 + Math.sin(t * 1.1) * 0.08;
  const radius = baseRadius * pulse;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.16)';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 18;
  ctx.shadowColor = 'rgba(0, 255, 255, 0.45)';
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Orbiting particles
  const orbitCount = 12;
  const orbitRadius = radius + 54;
  for (let i = 0; i < orbitCount; i += 1) {
    const angle = t * 0.64 + (Math.PI * 2 * i) / orbitCount;
    const ox = centerX + Math.cos(angle) * orbitRadius;
    const oy = centerY + Math.sin(angle) * orbitRadius;

    ctx.beginPath();
    ctx.arc(ox, oy, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.22)';
    ctx.fill();
  }

  // Soft mouse glow blobs
  for (const p of trailParticles) {
    const age = now - p.created;
    const progress = Math.min(age / trailConfig.lifeMs, 1);
    const alpha = (1 - progress) * 0.18;
    const blobRadius = p.radius * (1 - progress * 0.65);

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blobRadius);
    gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha})`);
    gradient.addColorStop(0.6, `rgba(0, 255, 255, ${alpha * 0.3})`);
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, blobRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = 'source-over';

  requestAnimationFrame(drawBackground);
}

requestAnimationFrame(drawBackground);

/* Reveal Animation */
gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
    }
  });
});

/* Counter Animation */
const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const update = () => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;
    const increment = target / 200;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(update, 10);
    } else {
      counter.innerText = target;
    }
  };

  ScrollTrigger.create({
    trigger: counter,
    start: "top 80%",
    onEnter: update
  });
});
