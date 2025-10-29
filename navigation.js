// Advanced Page Navigation System with Smooth Transitions
class NavigationController {
  constructor() {
    this.pages = document.querySelectorAll('.page');
    this.currentPage = 'welcome';
    this.isTransitioning = false;
    this.history = ['welcome'];
    this.init();
  }

  init() {
    this.setupButtonListeners();
    this.setupNavLinks();
    this.setupMobileMenu();
    this.showPage('welcome', false);
  }

  setupButtonListeners() {
    // All buttons with data-page attribute
    const pageButtons = document.querySelectorAll('[data-page]');
    pageButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = button.getAttribute('data-page');
        
        // Special handling for exit button
        if (targetPage === 'exit') {
          this.navigateToExit();
        } else if (targetPage === 'home' && this.currentPage === 'welcome') {
          this.navigateWithLoading('home');
        } else if (targetPage === 'home' && this.currentPage === 'exit') {
          this.navigateWithLoading('home');
        } else {
          this.navigateTo(targetPage);
        }
      });
    });

    // Really leave button special handling
    const reallyLeaveBtn = document.getElementById('reallyLeaveBtn');
    if (reallyLeaveBtn) {
      reallyLeaveBtn.addEventListener('click', () => {
        // Change text and navigate anyway
        reallyLeaveBtn.innerHTML = '<span>Just Kidding! 😄</span>';
        setTimeout(() => {
          this.navigateWithLoading('home');
        }, 1000);
      });
    }
  }

  setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        if (targetPage) {
          this.navigateTo(targetPage);
          
          // Update active state
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          
          // Close mobile menu if open
          const navMenu = document.getElementById('navMenu');
          if (navMenu) {
            navMenu.classList.remove('active');
          }
        }
      });
    });
  }

  setupMobileMenu() {
    const hamburgers = document.querySelectorAll('.hamburger');
    hamburgers.forEach(hamburger => {
      hamburger.addEventListener('click', () => {
        const navMenu = hamburger.parentElement.querySelector('.nav-menu');
        if (navMenu) {
          navMenu.classList.toggle('active');
          hamburger.classList.toggle('active');
        }
      });
    });
  }

  navigateTo(pageName) {
    if (this.isTransitioning || pageName === this.currentPage) return;
    
    this.isTransitioning = true;
    const currentPageEl = document.getElementById(`page${this.capitalize(this.currentPage)}`);
    const targetPageEl = document.getElementById(`page${this.capitalize(pageName)}`);

    if (!targetPageEl) {
      console.error(`Page ${pageName} not found`);
      this.isTransitioning = false;
      return;
    }

    // Animate out current page
    gsap.to(currentPageEl, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        currentPageEl.classList.remove('active');
        this.showPage(pageName);
      }
    });
  }

  showPage(pageName, animate = true) {
    const targetPageEl = document.getElementById(`page${this.capitalize(pageName)}`);
    if (!targetPageEl) return;

    // Update current page
    this.currentPage = pageName;
    this.history.push(pageName);
    
    // Show target page
    targetPageEl.classList.add('active');

    if (animate) {
      // Animate in
      gsap.fromTo(targetPageEl, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: 'power2.out',
          onComplete: () => {
            this.isTransitioning = false;
            this.onPageShown(pageName);
          }
        }
      );
    } else {
      gsap.set(targetPageEl, { opacity: 1, y: 0 });
      this.isTransitioning = false;
      this.onPageShown(pageName);
    }

    // Initialize particles for specific pages
    this.initializePageEffects(pageName);
  }

  navigateToExit() {
    this.navigateTo('exit');
    
    // Animate sad character
    const exitChar = document.querySelector('.exit-character-img');
    if (exitChar) {
      gsap.from(exitChar, {
        scale: 0.5,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.3
      });
    }
  }

  navigateWithLoading(targetPage) {
    if (this.isTransitioning) return;

    // First go to loading page
    this.navigateTo('loading');
    
    // Start loading animation
    if (window.loadingController) {
      window.loadingController.startLoading(() => {
        this.navigateTo(targetPage);
        
        // Celebrate transition
        if (window.characterController) {
          window.characterController.celebrateTransition();
        }
      });
    } else {
      // Fallback if loading controller not ready
      setTimeout(() => {
        this.navigateTo(targetPage);
      }, 2000);
    }
  }

  initializePageEffects(pageName) {
    // Initialize particles for welcome page
    if (pageName === 'welcome' && typeof particlesJS !== 'undefined') {
      particlesJS('particles-welcome', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.2, width: 1 },
          move: { enable: true, speed: 2, direction: 'none', random: true, out_mode: 'out' }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' }
          }
        }
      });
    }

    // Initialize particles for home page
    if (pageName === 'home' && typeof particlesJS !== 'undefined') {
      particlesJS('particles-home', {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
          color: { value: '#6366f1' },
          shape: { type: ['circle', 'triangle'] },
          opacity: { value: 0.3, random: true },
          size: { value: 4, random: true },
          line_linked: { enable: false },
          move: { enable: true, speed: 1, direction: 'top', random: true, out_mode: 'out' }
        }
      });
    }
  }

  onPageShown(pageName) {
    // Update character widget
    if (window.characterController) {
      window.characterController.updateForPage(pageName);
    }

    // Animate page elements
    this.animatePageElements(pageName);

    // Update URL hash without scrolling
    if (pageName !== 'welcome' && pageName !== 'loading' && pageName !== 'exit') {
      window.history.replaceState(null, '', `#page${this.capitalize(pageName)}`);
    }
  }

  animatePageElements(pageName) {
    const pageEl = document.getElementById(`page${this.capitalize(pageName)}`);
    if (!pageEl) return;

    // Animate cards and sections with stagger
    const cards = pageEl.querySelectorAll('.about-card, .service-card, .project-card, .education-card, .contact-card, .stat-card');
    if (cards.length > 0) {
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
      });
    }

    // Animate timeline items
    const timelineItems = pageEl.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
      gsap.from(timelineItems, {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.2
      });
    }

    // Animate titles
    const title = pageEl.querySelector('.page-title, .hero-name');
    if (title) {
      gsap.from(title, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  goBack() {
    if (this.history.length > 1) {
      this.history.pop(); // Remove current
      const previousPage = this.history[this.history.length - 1];
      this.navigateTo(previousPage);
    }
  }
}

// Initialize navigation
const navigationController = new NavigationController();

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.navigationController = navigationController;
}

// Handle browser back button
window.addEventListener('popstate', () => {
  navigationController.goBack();
});