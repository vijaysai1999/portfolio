// Character Animation System using GSAP
class CharacterController {
  constructor() {
    this.character = document.getElementById('characterImage');
    this.characterBubble = document.getElementById('characterBubble');
    this.mainCharacter = document.getElementById('mainCharacter');
    this.widget = document.getElementById('characterWidget');
    this.currentPage = 'welcome';
    this.messages = {
      home: ['Hey there! 👋', 'Looking good!', 'Welcome back!', 'Nice to see you!'],
      about: ['Learning about me? 🤓', 'Impressive, right?', 'There\'s more!'],
      services: ['Check out my skills! 💪', 'I can help with this!', 'Let\'s work together!'],
      portfolio: ['See what I built! 🚀', 'Cool projects, huh?', 'Want to know more?'],
      contact: ['Let\'s connect! 📧', 'Drop me a message!', 'I\'d love to hear from you!']
    };
    this.init();
  }

  init() {
    this.setupWelcomeCharacter();
    this.setupMouseTracking();
    this.setupButtonHovers();
    this.setupWidgetInteractions();
  }

  setupWelcomeCharacter() {
    if (!this.mainCharacter) return;

    // Entrance animation
    gsap.from(this.mainCharacter, {
      duration: 1.5,
      scale: 0,
      rotation: 360,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.3
    });

    // Continuous floating animation
    gsap.to(this.mainCharacter, {
      y: -20,
      duration: 3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Subtle rotation
    gsap.to(this.mainCharacter, {
      rotation: 5,
      duration: 4,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Pulsing glow effect
    const glow = document.querySelector('.character-glow');
    if (glow) {
      gsap.to(glow, {
        scale: 1.2,
        opacity: 0.8,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });
    }
  }

  setupMouseTracking() {
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      if (!this.mainCharacter) return;

      const deltaX = (e.clientX - lastX) * 0.01;
      const deltaY = (e.clientY - lastY) * 0.01;

      gsap.to(this.mainCharacter, {
        rotation: deltaX * 2,
        x: deltaX * 10,
        y: deltaY * 5,
        duration: 0.5,
        ease: 'power2.out'
      });

      lastX = e.clientX;
      lastY = e.clientY;
    });
  }

  setupButtonHovers() {
    const enterButtons = document.querySelectorAll('[data-page="home"], .btn-primary');
    const exitButtons = document.querySelectorAll('[data-page="exit"], #reallyLeaveBtn');

    enterButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => this.showHappyExpression());
      btn.addEventListener('mouseleave', () => this.resetExpression());
    });

    exitButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => this.showSadExpression());
      btn.addEventListener('mouseleave', () => this.resetExpression());
    });
  }

  showHappyExpression() {
    if (!this.mainCharacter) return;

    // Excited bounce
    gsap.to(this.mainCharacter, {
      y: -30,
      scale: 1.1,
      rotation: 10,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });

    // Create sparkles
    this.createSparkles();
  }

  showSadExpression() {
    if (!this.mainCharacter) return;

    // Sad droop
    gsap.to(this.mainCharacter, {
      y: 10,
      scale: 0.95,
      rotation: -5,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Desaturate
    gsap.to(this.mainCharacter, {
      filter: 'saturate(0.5) brightness(0.9)',
      duration: 0.4
    });
  }

  resetExpression() {
    if (!this.mainCharacter) return;

    gsap.to(this.mainCharacter, {
      y: 0,
      scale: 1,
      rotation: 0,
      filter: 'saturate(1) brightness(1)',
      duration: 0.5,
      ease: 'power2.out'
    });
  }

  createSparkles() {
    const container = document.querySelector('.character-showcase');
    if (!container) return;

    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'absolute';
      sparkle.style.width = '8px';
      sparkle.style.height = '8px';
      sparkle.style.borderRadius = '50%';
      sparkle.style.background = `linear-gradient(45deg, ${this.getRandomColor()}, #ffffff)`;
      sparkle.style.pointerEvents = 'none';
      sparkle.style.left = '50%';
      sparkle.style.top = '50%';
      sparkle.style.boxShadow = '0 0 10px currentColor';
      container.appendChild(sparkle);

      const angle = (Math.PI * 2 * i) / 12;
      const distance = 100 + Math.random() * 50;

      gsap.to(sparkle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        rotation: 360,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => sparkle.remove()
      });
    }
  }

  getRandomColor() {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  showWidget() {
    if (!this.widget) return;
    
    this.widget.classList.add('show');
    
    gsap.from(this.widget, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    });

    // Random idle animations
    this.startIdleAnimations();
  }

  hideWidget() {
    if (!this.widget) return;
    this.widget.classList.remove('show');
  }

  startIdleAnimations() {
    if (!this.character) return;

    // Gentle bobbing
    gsap.to(this.character, {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Occasional wave
    setInterval(() => {
      if (Math.random() > 0.7) {
        gsap.to(this.character, {
          rotation: 15,
          duration: 0.3,
          yoyo: true,
          repeat: 3,
          ease: 'power1.inOut'
        });
      }
    }, 5000);
  }

  showMessage(message) {
    if (!this.characterBubble) return;

    this.characterBubble.textContent = message;
    this.characterBubble.classList.add('show');

    gsap.from(this.characterBubble, {
      y: 20,
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      gsap.to(this.characterBubble, {
        y: -10,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          this.characterBubble.classList.remove('show');
        }
      });
    }, 3000);
  }

  setupWidgetInteractions() {
    if (!this.character) return;

    this.character.addEventListener('click', () => {
      // Excited reaction
      gsap.to(this.character, {
        scale: 1.2,
        rotation: 360,
        duration: 0.6,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.to(this.character, {
            scale: 1,
            rotation: 0,
            duration: 0.3
          });
        }
      });

      // Show random message
      const messages = ['Yay! 🎉', 'That tickles! 😄', 'Again! Again!', 'Hehe! 😊'];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      this.showMessage(randomMessage);
    });

    this.character.addEventListener('mouseenter', () => {
      gsap.to(this.character, {
        scale: 1.15,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    });

    this.character.addEventListener('mouseleave', () => {
      gsap.to(this.character, {
        scale: 1,
        duration: 0.3
      });
    });
  }

  updateForPage(pageName) {
    this.currentPage = pageName;

    if (pageName === 'welcome' || pageName === 'loading' || pageName === 'exit') {
      this.hideWidget();
    } else {
      this.showWidget();
      
      // Show page-specific message
      if (this.messages[pageName]) {
        const messages = this.messages[pageName];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setTimeout(() => this.showMessage(randomMessage), 1000);
      }
    }
  }

  celebrateTransition() {
    // Create celebratory animation
    if (this.character) {
      gsap.timeline()
        .to(this.character, {
          scale: 1.3,
          rotation: 720,
          duration: 1,
          ease: 'power2.inOut'
        })
        .to(this.character, {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
    }
  }
}

// Initialize character controller
const characterController = new CharacterController();

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.characterController = characterController;
}