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
    // All buttons with data-page attribute - ENSURE THEY WORK
    const pageButtons = document.querySelectorAll('[data-page]');
    console.log('Setting up', pageButtons.length, 'navigation buttons');
    
    // Setup exit button hover to trigger crying
    const exitButtons = document.querySelectorAll('[data-page="exit"]');
    exitButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (window.characterController) {
          if (window.characterController.mainCharacter) {
            window.characterController.mainCharacter.setEmotion('crying');
          }
          if (window.characterController.widgetCharacter) {
            window.characterController.widgetCharacter.setEmotion('crying');
          }
        }
      });
      
      btn.addEventListener('mouseleave', () => {
        if (window.characterController) {
          if (window.characterController.mainCharacter) {
            window.characterController.mainCharacter.setEmotion('neutral');
          }
          if (window.characterController.widgetCharacter) {
            window.characterController.widgetCharacter.setEmotion('neutral');
          }
        }
      });
    });
    
    pageButtons.forEach(button => {
      // Add shimmer effect to buttons
      button.classList.add('shimmer-effect');
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetPage = button.getAttribute('data-page');
        console.log('Button clicked for page:', targetPage);
        
        // Special handling for exit button
        if (targetPage === 'exit' && this.currentPage === 'welcome') {
          this.navigateToExit();
        } else if (targetPage === 'home' && (this.currentPage === 'welcome' || this.currentPage === 'exit')) {
          this.navigateWithLoading('home');
        } else if (targetPage === 'contact') {
          this.navigateTo('contact');
        } else if (targetPage === 'portfolio') {
          this.navigateTo('portfolio');
        } else {
          this.navigateTo(targetPage);
        }
      });
    });

    // Really leave button - go to apology page
    const reallyLeaveBtn = document.getElementById('reallyLeaveBtn');
    if (reallyLeaveBtn) {
      reallyLeaveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Really leave button clicked - going to apology');
        this.navigateToApology();
      });
    }

    // Give another chance button
    const giveChanceBtn = document.getElementById('giveChanceBtn');
    if (giveChanceBtn) {
      giveChanceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Give chance button clicked');
        this.navigateWithLoading('home');
      });
    }

    // Final leave button - still go to portfolio
    const finalLeaveBtn = document.getElementById('finalLeaveBtn');
    if (finalLeaveBtn) {
      finalLeaveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Final leave button clicked - going to home anyway');
        this.navigateWithLoading('home');
      });
    }
    
    console.log('✓ Navigation buttons setup complete');
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

    if (!currentPageEl) {
      console.error(`Current page ${this.currentPage} element not found`);
      this.isTransitioning = false;
      return;
    }

    if (!targetPageEl) {
      console.error(`Target page ${pageName} element not found`);
      this.isTransitioning = false;
      return;
    }
    
    console.log('Transitioning from', this.currentPage, 'to', pageName);

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

    // CRITICAL: Scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Update current page
    this.currentPage = pageName;
    this.history.push(pageName);
    
    // Smart scroll handling - check if content fits
    this.updateScrollBehavior(pageName, targetPageEl);
    
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

  navigateToApology() {
    this.navigateTo('apology');
    
    // Animate apology character with apologetic bow
    const apologyCanvas = document.getElementById('apologyCharacter');
    if (apologyCanvas) {
      gsap.from(apologyCanvas, {
        scale: 0.3,
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
        delay: 0.2
      });
      
      // Reinitialize apology character if needed
      if (window.characterController && !window.characterController.apologyCharacter) {
        window.characterController.apologyCharacter = new CanvasCharacter(apologyCanvas, 'medium');
        window.characterController.apologyCharacter.setEmotion('sad', true);
      }
    }
    
    // Animate highlight cards with sequential entrance
    setTimeout(() => {
      const highlightCards = document.querySelectorAll('.highlight-card');
      gsap.from(highlightCards, {
        scale: 0,
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        delay: 0.5
      });
    }, 500);
    
    // Pulse the give chance button
    setTimeout(() => {
      const giveChanceBtn = document.getElementById('giveChanceBtn');
      if (giveChanceBtn) {
        gsap.to(giveChanceBtn, {
          scale: 1.05,
          duration: 0.8,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1
        });
      }
    }, 1500);
  }

  navigateToExit() {
    this.navigateTo('exit');
    
    // Animate sad character canvas with dramatic entrance
    const exitCanvas = document.getElementById('exitCharacter');
    if (exitCanvas) {
      gsap.from(exitCanvas, {
        scale: 0.5,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.3
      });
      
      // Continuous sad wobble animation
      gsap.to(exitCanvas, {
        rotation: 5,
        y: 10,
        duration: 1,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.3
      });
      
      // Reinitialize exit character if needed
      if (window.characterController && !window.characterController.exitCharacter) {
        window.characterController.exitCharacter = new CanvasCharacter(exitCanvas, 'medium');
        window.characterController.exitCharacter.setEmotion('sad', true);
      }
    }
    
    // Animate tears with continuous fall
    const tears = document.getElementById('tearsContainer');
    if (tears) {
      const tearElements = tears.querySelectorAll('.tear');
      gsap.from(tearElements, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5
      });
    }
    
    // Animate exit reasons with stagger
    setTimeout(() => {
      const reasons = document.querySelectorAll('.page-exit .reason');
      gsap.from(reasons, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });
    }, 800);
    
    // Add floating emoji animation
    this.createFloatingEmojis();
  }
  
  createFloatingEmojis() {
    const exitPage = document.getElementById('pageExit');
    if (!exitPage) return;
    
    const emojis = ['😢', '😭', '🙏', '❤️', '⭐', '🎉'];
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          bottom: -50px;
          font-size: ${20 + Math.random() * 30}px;
          pointer-events: none;
          z-index: 10;
        `;
        exitPage.appendChild(emoji);
        
        gsap.to(emoji, {
          y: -window.innerHeight - 100,
          x: (Math.random() - 0.5) * 200,
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 3 + Math.random() * 2,
          ease: 'power1.out',
          onComplete: () => emoji.remove()
        });
      }, i * 200);
    }
  }

  navigateWithLoading(targetPage) {
    console.log('Navigate with loading to:', targetPage);
    
    if (this.isTransitioning) {
      console.log('Already transitioning');
      return;
    }

    // Scroll to top before showing loading
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // First go to loading page
    this.navigateTo('loading');
    
    // Start loading animation
    if (window.loadingController) {
      console.log('Starting loading animation');
      window.loadingController.startLoading(() => {
        console.log('Loading complete, navigating to', targetPage);
        this.navigateTo(targetPage);
        
        // Celebrate transition
        if (window.characterController) {
          window.characterController.celebrateTransition();
        }
      });
    } else {
      console.log('Loading controller not found, using fallback');
      // Fallback if loading controller not ready
      setTimeout(() => {
        this.navigateTo(targetPage);
      }, 2000);
    }
  }

  initializePageEffects(pageName) {
    // Initialize apology page effects
    if (pageName === 'apology') {
      // Create floating particles
      this.createApologyParticles();
    }

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

  createApologyParticles() {
    const apologyPage = document.getElementById('pageApology');
    if (!apologyPage) return;
    
    // Create gentle floating hearts and stars
    const symbols = ['💙', '⭐', '✨', '💫', '🌟'];
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          bottom: -50px;
          font-size: ${15 + Math.random() * 20}px;
          pointer-events: none;
          z-index: 1;
        `;
        apologyPage.appendChild(particle);
        
        gsap.to(particle, {
          y: -window.innerHeight - 100,
          x: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 4 + Math.random() * 2,
          ease: 'power1.out',
          onComplete: () => particle.remove()
        });
      }, i * 300);
    }
  }

  onPageShown(pageName) {
    // CRITICAL: Force scroll to top
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
    
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
  
  updateScrollBehavior(pageName, pageElement) {
    // Check if page content fits in viewport
    setTimeout(() => {
      const contentHeight = pageElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      // Only lock scroll if content actually fits AND it's a special page
      const specialPages = ['welcome', 'loading', 'exit', 'apology'];
      if (specialPages.includes(pageName) && contentHeight <= viewportHeight) {
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');
      } else {
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
      }
    }, 100);
  }

  animatePageElements(pageName) {
    const pageEl = document.getElementById(`page${this.capitalize(pageName)}`);
    if (!pageEl) return;
    
    // Add animate-on-scroll class to cards
    const allCards = pageEl.querySelectorAll('.glass-card, .about-card, .service-card, .project-card, .education-card, .contact-card, .stat-card, .skill-card');
    allCards.forEach(card => {
      if (!card.classList.contains('animate-on-scroll')) {
        card.classList.add('animate-on-scroll');
      }
    });

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
    
    // Animate profile image if on about page
    if (pageName === 'about') {
      const profileImage = pageEl.querySelector('.profile-image');
      if (profileImage) {
        gsap.from(profileImage, {
          scale: 0,
          rotation: 360,
          opacity: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          delay: 0.3
        });
      }
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
    if (!str) return '';
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

// Update scroll behavior on window resize
window.addEventListener('resize', () => {
  if (navigationController && navigationController.currentPage) {
    const currentPageEl = document.getElementById(`page${navigationController.capitalize(navigationController.currentPage)}`);
    if (currentPageEl) {
      navigationController.updateScrollBehavior(navigationController.currentPage, currentPageEl);
    }
  }
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.navigationController = navigationController;
}

// Handle browser back button
window.addEventListener('popstate', () => {
  navigationController.goBack();
});