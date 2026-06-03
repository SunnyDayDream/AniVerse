document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('dna-core');
  if (!container) return;

  const tooltip = document.getElementById('genre-tooltip');
  
  // Tooltip interaction logic for the genre nodes
  document.querySelectorAll('.node').forEach(node => {
    const genre = node.dataset.genre || node.querySelector('.p-label')?.childNodes[0]?.textContent?.trim() || 'Unknown';
    const percent = node.dataset.percent || node.querySelector('small')?.textContent?.trim() || '0%';

    const showTooltip = (e) => {
      if (!tooltip) return;
      tooltip.innerHTML = `
        <div class="tooltip-header" style="font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--neon-pink); font-size: 0.9rem; margin-bottom: 4px;">${genre}</div>
        <div class="tooltip-body" style="font-size: 0.8rem; color: #fff; display: flex; align-items: center; gap: 8px;">
          <span>Compatibility Core:</span>
          <strong style="color: var(--neon-cyan); font-family: 'Outfit'; font-size: 0.95rem;">${percent}</strong>
        </div>
      `;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Position the tooltip near the cursor but keep it within bounds
      tooltip.style.left = `${x + 15}px`;
      tooltip.style.top = `${y + 15}px`;
      tooltip.classList.add('show');
    };

    const hideTooltip = () => {
      if (tooltip) tooltip.classList.remove('show');
    };

    node.addEventListener('mouseenter', showTooltip);
    node.addEventListener('mousemove', showTooltip);
    node.addEventListener('mouseleave', hideTooltip);
  });

  // Dynamic particle canvas background for the galaxy core
  const canvas = container.querySelector('.particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 45; // slightly increased for a richer effect

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(isInitial = false) {
      this.reset(isInitial);
    }

    reset(isInitial = false) {
      const angle = Math.random() * Math.PI * 2;
      // Spawn particles close to the center crystal core or randomly if initial
      const distance = isInitial 
        ? Math.random() * (canvas.width * 0.3) 
        : Math.random() * 20 + 10;

      this.x = canvas.width / 2 + Math.cos(angle) * distance;
      this.y = canvas.height / 2 + Math.sin(angle) * distance;
      
      // Radial velocity outwards with a tiny bit of spiral/orbital velocity
      const speed = Math.random() * 0.4 + 0.1;
      const spiralSpeed = (Math.random() - 0.5) * 0.2;
      this.vx = Math.cos(angle) * speed - Math.sin(angle) * spiralSpeed;
      this.vy = Math.sin(angle) * speed + Math.cos(angle) * spiralSpeed;
      
      this.life = isInitial ? Math.random() * 80 + 20 : 100;
      this.maxLife = this.life;
      this.size = Math.random() * 2.5 + 1;
      
      // Match the cyberpunk color scheme: neon pink, neon cyan, neon blue
      const hues = [190, 200, 320, 340, 280]; // Cyan/Blue and Pink/Magenta/Purple
      this.hue = hues[Math.floor(Math.random() * hues.length)];
      this.brightness = Math.random() * 20 + 60;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.6;
      
      if (this.life <= 0) {
        this.reset(false);
      }
    }

    draw() {
      const alpha = this.life / this.maxLife;
      ctx.save();
      // Glowing particle shadow
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
      ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate particles initially
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(true));
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  };

  animate();
});
