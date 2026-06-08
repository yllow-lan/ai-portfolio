// Portfolio Rendering and Interactive HPC Simulators Controller

// Data loaded globally via window.portfolioData

function initPortfolio() {
  renderAbout();
  renderProjects();
  renderSkills();
  renderExperience();
  renderEducation();
  
  setupCudaSim();
  setupAutoAnimations();
  setupContactForm();
  setupSmoothScrolling();
}

/**
 * 1. Render About Section
 */
function renderAbout() {
  const aboutText = document.getElementById('about-text-long');
  if (aboutText) {
    aboutText.textContent = portfolioData.personal.aboutLong;
  }
}

/**
 * 2. Render Projects Section
 */
function renderProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = portfolioData.projects.map(project => `
    <article class="project-card" id="project-${project.id}">
      <div class="project-header">
        <div class="project-title-area">
          <span class="project-tag">${project.tag}</span>
          <h3>${project.title}</h3>
        </div>
        <span class="project-metric">${project.metrics}</span>
      </div>
      <p class="project-desc">${project.description}</p>
      <ul class="project-bullets">
        ${project.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
      <div class="project-links">
        <a href="${project.github}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Source Code</a>
      </div>
    </article>
  `).join('');
}

/**
 * 3. Render Skills Section
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  container.innerHTML = portfolioData.skills.categories.map(category => `
    <div class="skill-category">
      <h3>${category.name}</h3>
      <div class="skill-tags">
        ${category.items.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * 4. Render Experience Section
 */
function renderExperience() {
  const container = document.getElementById('experience-container');
  if (!container) return;

  container.innerHTML = portfolioData.experience.map(exp => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-header">
        <h3>${exp.company}</h3>
        <span class="timeline-duration">${exp.duration}</span>
      </div>
      <div class="timeline-role">${exp.role}</div>
      <p class="timeline-desc">${exp.description}</p>
      <ul class="timeline-bullets">
        ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/**
 * 5. Render Education Section
 */
function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container) return;

  container.innerHTML = portfolioData.education.map(edu => `
    <div class="education-item">
      <div class="education-header">
        <h3>${edu.institution}</h3>
        <span class="education-duration">${edu.duration}</span>
      </div>
      <div class="education-degree">${edu.degree}</div>
      ${edu.gpa ? `<div class="education-gpa">${edu.gpa}</div>` : ''}
      <div class="courses-label">Key Coursework</div>
      <div class="courses-list">
        ${edu.courses.map(course => `<span class="course-badge">${course}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

let cudaSimRunning = false;

function setupCudaSim() {
  // Initialize widths to 0% for clean appearance prior to trigger
  const barCpu = document.getElementById('bar-cpu');
  const barCustom = document.getElementById('bar-custom-cuda');
  const barCublas = document.getElementById('bar-cublas');
  if (barCpu) barCpu.style.width = '0%';
  if (barCustom) barCustom.style.width = '0%';
  if (barCublas) barCublas.style.width = '0%';
}

function runCudaSim() {
  if (cudaSimRunning) return;
  cudaSimRunning = true;

  const barCpu = document.getElementById('bar-cpu');
  const barCustom = document.getElementById('bar-custom-cuda');
  const barCublas = document.getElementById('bar-cublas');
  
  const valCpu = document.getElementById('val-cpu');
  const valCustom = document.getElementById('val-custom-cuda');
  const valCublas = document.getElementById('val-cublas');
  const effPercent = document.getElementById('cuda-eff-percent');

  if (!barCpu || !barCustom || !barCublas) return;

  const cpuTarget = 12;
  const cudaTarget = 382;
  const cublasTarget = 415;
  
  let currentCpu = 0;
  let currentCuda = 0;
  let currentCublas = 0;

  const duration = 1500; // ms
  const steps = 30;
  const stepTime = duration / steps;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    
    currentCpu = Math.min(cpuTarget, Math.round((cpuTarget / steps) * step));
    currentCuda = Math.min(cudaTarget, Math.round((cudaTarget / steps) * step));
    currentCublas = Math.min(cublasTarget, Math.round((cublasTarget / steps) * step));

    const cpuWidth = (currentCpu / cublasTarget) * 100;
    const cudaWidth = (currentCuda / cublasTarget) * 100;
    const cublasWidth = (currentCublas / cublasTarget) * 100;

    barCpu.style.width = `${cpuWidth}%`;
    barCustom.style.width = `${cudaWidth}%`;
    barCublas.style.width = `${cublasWidth}%`;

    if (valCpu) valCpu.textContent = `${currentCpu} GFLOPS`;
    if (valCustom) valCustom.textContent = `${currentCuda} GFLOPS`;
    if (valCublas) valCublas.textContent = `${currentCublas} GFLOPS`;

    const currentEff = Math.round((currentCuda / (currentCublas || 1)) * 100);
    if (effPercent) effPercent.textContent = `${currentEff}%`;

    if (step >= steps) {
      clearInterval(interval);
    }
  }, stepTime);
}

// KV Cache simulation removed to avoid exposing research details.

/**
 * 8. Contact Form Handling
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = "Sending message...";

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        status.className = 'form-status success';
        status.innerHTML = `<i class="fa-solid fa-check-double"></i> Thank you, ${name}! Your message has been received.`;
        form.reset();
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Server error");
      }
    } catch (error) {
      console.warn("Contact API error, falling back to local simulation:", error);
      // Simulate success for offline/local file launches
      setTimeout(() => {
        status.className = 'form-status success';
        status.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Message simulated successfully (Local mode).`;
        form.reset();
      }, 800);
    }
  });
}

/**
 * 9. Smooth scrolling for nav-links and scroll tracking for active states
 */
function setupSmoothScrolling() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.portfolio-section');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const navBar = document.querySelector('.section-nav');
        const navHeight = navBar ? navBar.offsetHeight : 0;
        const stickyTop = navBar ? parseInt(window.getComputedStyle(navBar).top) || 20 : 20;
        const targetScrollTop = (targetSection.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)) - navHeight - stickyTop - 10;

        window.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
        
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Track scroll position to update active nav tab
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const navBar = document.querySelector('.section-nav');
    const navHeight = navBar ? navBar.offsetHeight : 0;
    const stickyTop = navBar ? parseInt(window.getComputedStyle(navBar).top) || 20 : 20;
    const triggerOffset = navHeight + stickyTop + 50; // threshold below the sticky nav bar

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= triggerOffset) {
        currentSectionId = '#' + section.getAttribute('id');
      }
    });

    // Fallback to the first section if we are at the top and none matched
    if (!currentSectionId && sections.length > 0) {
      currentSectionId = '#' + sections[0].getAttribute('id');
    }

    if (currentSectionId) {
      links.forEach(link => {
        if (link.getAttribute('href') === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}

/**
 * 10. Intersection Observer triggers simulation animations when in view
 */
function setupAutoAnimations() {
  const cudaDisplay = document.getElementById('cuda-sim-display');

  if (!cudaDisplay) return;

  const observerOptions = {
    root: null, // bind to viewport
    rootMargin: '0px',
    threshold: 0.25 // Trigger when 25% of the element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === 'cuda-sim-display') {
          runCudaSim();
        }
      }
    });
  }, observerOptions);

  if (cudaDisplay) observer.observe(cudaDisplay);
}

// Global attachment
window.initPortfolio = initPortfolio;
