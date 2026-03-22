gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* Canvas Background Effects */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let cw = 0;
let ch = 0;
let scrollProgress = 0;
let targetProtonScale = 1;
let currentProtonScale = 1;

const trailParticles = [];
const trailConfig = {
  maxParticles: 15,
  lifeMs: 800,
};

// Energy field particles
const energyParticles = [];

function resizeCanvas() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (event) => {
  addTrailParticle(event.clientX, event.clientY);
});

// Track scroll progress and update proton scale target
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
  
  // Calculate target proton scale based on scroll progress (1 to 1.5)
  targetProtonScale = 1 + (scrollProgress * 0.5);
});

function addTrailParticle(x, y) {
  trailParticles.push({
    x,
    y,
    size: Math.random() * 2 + 1,
    created: performance.now(),
  });

  if (trailParticles.length > trailConfig.maxParticles) {
    trailParticles.shift();
  }
}

// Initialize energy particles
function initEnergyParticles() {
  energyParticles.length = 0;
  const particleCount = 40;
  
  for (let i = 0; i < particleCount; i++) {
    energyParticles.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 150 + 80,
      speed: Math.random() * 0.5 + 0.3,
      verticalSpeed: Math.random() * 0.3 - 0.15,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    });
  }
}

initEnergyParticles();

function drawEnergyCore() {
  ctx.clearRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';

  const now = performance.now();
  const t = now / 1000;
  
  const centerX = cw / 2;
  const centerY = ch / 2.2;

  // Subtle rotating gradient background
  const rotationAngle = t * 0.15;
  
  // Draw swirling energy trails
  for (let i = 0; i < energyParticles.length; i++) {
    const particle = energyParticles[i];
    
    // Update position with organic motion
    particle.angle += particle.speed * 0.02;
    particle.radius += particle.verticalSpeed * 0.1;
    if (particle.radius > 300) particle.radius = 80;
    
    const x = centerX + Math.cos(particle.angle) * particle.radius;
    const y = centerY + Math.sin(particle.angle) * particle.radius + Math.sin(t + i) * 20;
    
    // Draw glowing particles
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
    gradient.addColorStop(0, `rgba(0, 255, 198, ${particle.opacity * 0.6})`);
    gradient.addColorStop(0.7, `rgba(58, 134, 255, ${particle.opacity * 0.3})`);
    gradient.addColorStop(1, 'rgba(58, 134, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, particle.size * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central core - semi-transparent glow (reduced opacity for text readability)
  const coreSize = 60 + Math.sin(t * 0.8) * 15;
  const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize);
  coreGradient.addColorStop(0, 'rgba(0, 255, 198, 0.08)');
  coreGradient.addColorStop(0.4, 'rgba(58, 134, 255, 0.05)');
  coreGradient.addColorStop(1, 'rgba(0, 255, 198, 0)');
  
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
  ctx.fill();

  // Inner core accent (very subtle)
  const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize * 0.4);
  innerGradient.addColorStop(0, 'rgba(0, 255, 198, 0.04)');
  innerGradient.addColorStop(1, 'rgba(0, 255, 198, 0)');
  
  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreSize * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Lightweight cursor particles
  for (const p of trailParticles) {
    const age = now - p.created;
    const progress = Math.min(age / trailConfig.lifeMs, 1);
    const alpha = (1 - progress) * 0.5;
    
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
    gradient.addColorStop(0, `rgba(0, 255, 198, ${alpha})`);
    gradient.addColorStop(1, 'rgba(0, 255, 198, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = 'source-over';

  requestAnimationFrame(drawEnergyCore);
}

requestAnimationFrame(drawEnergyCore);

/* SMOOTH PROTON SCALING ANIMATION */
const proton = document.getElementById('proton');
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

// Linear interpolation function for smooth scaling
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Continuous animation loop for smooth proton scaling
function animateProtonScaling() {
  // Smooth interpolation: ease the current scale towards target scale
  currentProtonScale = lerp(currentProtonScale, targetProtonScale, 0.08);
  
  // Apply the smoothed scale to proton
  if (proton) {
    proton.style.transform = `translate(-50%, -50%) scale(${currentProtonScale})`;
  }
  
  requestAnimationFrame(animateProtonScaling);
}

// Start the animation loop
animateProtonScaling();

/* PORTRAIT SCROLL-BASED FADE AND MOVEMENT */
const heroPortrait = document.querySelector('.hero-portrait');

function updatePortraitFade() {
  if (!heroPortrait) return;
  
  const scrollY = window.scrollY;
  const fadeStart = 0;
  const fadeEnd = window.innerHeight * 0.8; // Start fading after scrolling viewport height
  
  // Calculate progress: 0 to 1
  const progress = Math.min(Math.max((scrollY - fadeStart) / (fadeEnd - fadeStart), 0), 1);
  
  // Fade out: from 0.9 to 0
  const newOpacity = 0.9 * (1 - progress);
  
  // Move down: 0 to 40px
  const translateDistance = progress * 40;
  
  // Apply styles
  heroPortrait.style.opacity = newOpacity;
  heroPortrait.style.transform = `translateY(calc(-50% + ${translateDistance}px))`;
  
  requestAnimationFrame(updatePortraitFade);
}

updatePortraitFade();

// Optional: Create GSAP timeline for hero content fade during scroll
if (heroSection && heroContent) {
  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "bottom center",
      scrub: 0.6,
      markers: false
    }
  });

  // Fade hero content as you scroll
  heroTimeline.to(heroContent, {
    opacity: 0.4,
    scale: 0.9,
    duration: 0.6,
    ease: "power2.inOut"
  }, 0);
}

/* Smooth Reveal Animations - now using CSS transitions with Intersection Observer */
// Stagger delays for reveal elements
gsap.utils.toArray(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.1}s`;
});

/* Section Title Animations - now using CSS transitions with Intersection Observer */
// All staggering and visibility handled by Intersection Observer

/* About Column Animations - now using CSS transitions with Intersection Observer */
gsap.utils.toArray(".about-column").forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.15}s`;
});

/* Expertise Card Animations - now using CSS transitions with Intersection Observer */
gsap.utils.toArray(".expertise-card").forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.12}s`;
});

/* Contact Items Stagger Animation - now using CSS transitions with Intersection Observer */
gsap.utils.toArray(".contact-item").forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.15}s`;
});

/* Project Card Stagger with Rotation */
gsap.utils.toArray(".project-card").forEach((el, index) => {
  gsap.to(el, {
    opacity: 1,
    rotationY: 0,
    scale: 1,
    duration: 0.5,
    delay: index * 0.1,
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    },
    ease: "back.out(1.7)"
  });
});

/* Reversible Animations with Intersection Observer */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -20% 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is in view - apply animation
      entry.target.classList.add('visible');
    } else {
      // Element is out of view - remove animation for reversible effect
      entry.target.classList.remove('visible');
    }
  });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal, .reveal-title, .about-column, .expertise-card, .contact-item').forEach(el => {
  animationObserver.observe(el);
});

/* Active Section Highlight on Scroll */
const sectionObserverOptions = {
  threshold: 0.3,
  rootMargin: '0px 0px -60% 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.id;
      
      // Remove active class from all nav links
      document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
      });
      
      // Add active class to corresponding nav link
      const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, sectionObserverOptions);

// Observe all sections for active state
['home', 'about', 'expertise', 'projects', 'contact'].forEach(id => {
  const section = document.getElementById(id);
  if (section) {
    sectionObserver.observe(section);
  }
});

/* Navigation Smooth Scroll Handler */
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    // Use GSAP ScrollToPlugin for smooth animated scroll
    gsap.to(window, {
      scrollTo: {
        y: target,
        autoKill: false,
        offsetY: 80  // Account for fixed navbar height
      },
      duration: 0.8,
      ease: "power2.inOut"
    });
  });
});

// Fallback: Handle direct anchor navigation on page load
window.addEventListener('hashchange', () => {
  const target = document.querySelector(window.location.hash);
  if (target) {
    // Use native scroll with slight delay to ensure page is ready
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
});
