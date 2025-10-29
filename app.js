// Main Application Controller
class PortfolioApp {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('🚀 Portfolio App Initializing...');

    // Initialize GSAP plugins
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Setup preloader
    this.setupPreloader();

    // Setup contact form
    this.setupContactForm();

    // Setup smooth scroll
    this.setupSmoothScroll();

    // Setup intersection observers for animations
    this.setupScrollAnimations();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Setup content fit checker
    this.setupContentFitChecker();

    // Add loading complete class
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);

    this.isInitialized = true;
    console.log('✨ Portfolio App Ready!');
  }
  
  setupPreloader() {
    const preloader = document.getElementById('preloader');
    const welcomePage = document.getElementById('pageWelcome');
    
    if (!preloader || !welcomePage) return;
    
    console.log('Preloader setup started');
    
    // Wait for everything to load
    window.addEventListener('load', () => {
      console.log('Window loaded, hiding preloader');
      
      setTimeout(() => {
        // Hide preloader
        preloader.classList.add('hidden');
        
        // Show welcome page
        welcomePage.style.display = 'flex';
        welcomePage.classList.add('active');
        
        // Animate welcome page
        gsap.from(welcomePage, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        // Remove preloader after transition
        setTimeout(() => {
          preloader.remove();
          console.log('Preloader removed');
        }, 500);
      }, 1000); // Show preloader for at least 1 second
    });
  }

  setupContentFitChecker() {
    // Check if content fits viewport and manage scrolling
    const checkContentFit = () => {
      const activePage = document.querySelector('.page.active');
      if (!activePage) return;
      
      const contentHeight = activePage.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      // Get page ID to determine if it's a special page
      const pageId = activePage.id;
      const specialPages = ['pageWelcome', 'pageLoading', 'pageExit'];
      
      if (specialPages.includes(pageId)) {
        if (contentHeight <= viewportHeight) {
          // Content fits, prevent scroll
          document.documentElement.classList.add('no-scroll');
          document.body.classList.add('no-scroll');
        } else {
          // Content doesn't fit, allow scroll
          document.documentElement.classList.remove('no-scroll');
          document.body.classList.remove('no-scroll');
        }
      }
    };
    
    // Check on load and resize
    window.addEventListener('load', checkContentFit);
    window.addEventListener('resize', checkContentFit);
    
    // Check when page becomes active
    const observer = new MutationObserver(() => {
      checkContentFit();
    });
    
    document.querySelectorAll('.page').forEach(page => {
      observer.observe(page, { attributes: true, attributeFilter: ['class'] });
    });
  }

  setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitButton = contactForm.querySelector('.btn-primary');
      if (!submitButton) return;

      // Show loading state
      const originalContent = submitButton.innerHTML;
      submitButton.innerHTML = '<span>Sending...</span>';
      submitButton.disabled = true;

      // Simulate sending (in real app, this would be an API call)
      setTimeout(() => {
        // Success state
        submitButton.innerHTML = '<span>Message Sent! ✓</span>';
        submitButton.style.background = '#10b981';

        // Show success message from character
        if (window.characterController) {
          window.characterController.showMessage('Message received! I\'ll get back to you soon! 📧');
          window.characterController.celebrateTransition();
        }

        // Reset form
        contactForm.reset();

        // Reset button after delay
        setTimeout(() => {
          submitButton.innerHTML = originalContent;
          submitButton.style.background = '';
          submitButton.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  setupSmoothScroll() {
    // Smooth scroll for anchor links within pages
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle internal page anchors, not page navigation
        if (href.startsWith('#page')) {
          return; // Let navigation controller handle this
        }

        const target = document.querySelector(href);
        if (target && target.classList.contains('section')) {
          e.preventDefault();
          
          const navbar = document.getElementById('navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = target.offsetTop - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupScrollAnimations() {
    // Use Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger GSAP animation
          gsap.from(entry.target, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ESC key to go back
      if (e.key === 'Escape') {
        if (window.navigationController) {
          window.navigationController.goBack();
        }
      }

      // T key to toggle theme
      if (e.key === 't' || e.key === 'T') {
        if (window.themeController) {
          window.themeController.toggleTheme();
        }
      }

      // H key to go home
      if (e.key === 'h' || e.key === 'H') {
        if (window.navigationController) {
          window.navigationController.navigateTo('home');
        }
      }
    });
  }

  // Utility function to create particle effects
  createParticleEffect(x, y, color = '#6366f1') {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(particle);

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      opacity: 0,
      scale: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    });
  }

  // Add ripple effect to buttons
  addRippleEffect(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    gsap.to(ripple, {
      scale: 2,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
  }
}

// Initialize the application
const app = new PortfolioApp();

// Add ripple effect to all buttons
document.addEventListener('click', (e) => {
  const button = e.target.closest('.btn');
  if (button && app.addRippleEffect) {
    app.addRippleEffect(e, button);
  }
});

// Export app instance
if (typeof window !== 'undefined') {
  window.portfolioApp = app;
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiSequence.join(',')) {
    console.log('🎮 Konami Code Activated!');
    
    // Special celebration
    if (window.characterController) {
      window.characterController.showMessage('You found the secret! 🎉');
      window.characterController.celebrateTransition();
    }

    // Create particle explosion
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        app.createParticleEffect(x, y, color);
      }, i * 20);
    }

    konamiCode = [];
  }
});

console.log('%c👋 Welcome to My Portfolio!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with ❤️ using HTML, CSS, JavaScript, and GSAP', 'font-size: 14px; color: #8b5cf6;');
console.log('%cTry the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'font-size: 12px; color: #10b981;');
