document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize sub-components
  window.initPortfolio();
  window.initCopilot();

  // 2. Initialize Mobile Tab Switching
  setupMobileTabs();

  // 3. Initialize Interactive Background Canvas
  initNeuralBackground();
});

/**
 * Mobile Tab switching for responsive layouts
 */
function setupMobileTabs() {
  const btnPortfolio = document.getElementById('tab-btn-portfolio');
  const btnCopilot = document.getElementById('tab-btn-copilot');
  const panePortfolio = document.getElementById('portfolio-pane');
  const paneCopilot = document.getElementById('copilot-pane');

  if (!btnPortfolio || !btnCopilot || !panePortfolio || !paneCopilot) return;

  btnPortfolio.addEventListener('click', () => {
    btnPortfolio.classList.add('active');
    btnCopilot.classList.remove('active');
    
    panePortfolio.classList.add('active');
    paneCopilot.classList.remove('active');
    
    // Reset scroll to top when toggling view on mobile
    window.scrollTo({ top: 0 });
  });

  btnCopilot.addEventListener('click', () => {
    btnCopilot.classList.add('active');
    btnPortfolio.classList.remove('active');
    
    paneCopilot.classList.add('active');
    panePortfolio.classList.remove('active');
    
    // Reset scroll to top when toggling view on mobile
    window.scrollTo({ top: 0 });
    
    // Automatically focus chat input when switching to copilot tab
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      setTimeout(() => chatInput.focus(), 150);
    }
  });
}

/**
 * Animated High-Tech Neural Grid background
 */
function initNeuralBackground() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Set size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle configuration
  const particles = [];
  const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 20000));
  const connectionDistance = 120;
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 245, 160, 0.4)';
      ctx.fill();
    }
  }

  // Generate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background subtly
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connection lines
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.strokeStyle = `rgba(0, 217, 245, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}
