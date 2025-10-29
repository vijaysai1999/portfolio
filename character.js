// Vertical Bar Character System with Eyes
class BarCharacter {
  constructor(canvas, x, baseHeight, colors, index) {
    this.canvas = canvas;
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.x = x;
    this.baseX = x; // Base position (fixed)
    this.baseHeight = baseHeight;
    this.currentHeight = baseHeight;
    this.width = 80;
    this.colors = colors;
    this.emotion = 'neutral';
    this.targetEmotion = 'neutral';
    this.transitionProgress = 1;
    this.index = index;
    
    // Mouse tracking
    this.mouseX = 0;
    this.mouseY = 0;
    
    // Tilt/lean mechanics
    this.tiltAngle = 0;
    this.targetTilt = 0;
    this.topX = x; // Top X position changes with tilt
    
    // Animation state
    this.time = Math.random() * 100;
    this.bounceOffset = 0;
    this.blinkTimer = 0;
    this.isBlinking = false;
    
    // Eyes
    this.leftEye = { x: this.x + 20, y: 100, pupilX: 0, pupilY: 0 };
    this.rightEye = { x: this.x + 60, y: 100, pupilX: 0, pupilY: 0 };
    
    // Particles
    this.particles = [];
    
    // Emotion properties
    this.emotions = {
      neutral: {
        bounceSpeed: 1,
        bounceHeight: 20,
        eyeSize: 1,
        sparkles: false,
        tears: false
      },
      happy: {
        bounceSpeed: 2.5,
        bounceHeight: 40,
        eyeSize: 1.2,
        sparkles: true,
        tears: false
      },
      sad: {
        bounceSpeed: 0.5,
        bounceHeight: 10,
        eyeSize: 0.8,
        sparkles: false,
        tears: true
      },
      excited: {
        bounceSpeed: 3,
        bounceHeight: 50,
        eyeSize: 1.4,
        sparkles: true,
        tears: false
      }
    };
    
    this.currentState = {...this.emotions.neutral};
  }
  
  setEmotion(emotion, immediate = false) {
    if (this.emotions[emotion]) {
      this.targetEmotion = emotion;
      if (immediate) {
        this.emotion = emotion;
        this.currentState = {...this.emotions[emotion]};
        this.transitionProgress = 1;
      } else {
        this.transitionProgress = 0;
      }
    }
  }
  
  updateMousePosition(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }
  
  animate() {
    this.time += 0.016;
    
    // Smooth transitions
    if (this.transitionProgress < 1) {
      this.transitionProgress += 0.05;
      const target = this.emotions[this.targetEmotion];
      const current = this.emotions[this.emotion];
      
      for (let key in target) {
        if (typeof target[key] === 'number') {
          this.currentState[key] = current[key] + (target[key] - current[key]) * this.transitionProgress;
        } else {
          this.currentState[key] = target[key];
        }
      }
      
      if (this.transitionProgress >= 1) {
        this.emotion = this.targetEmotion;
      }
    }
    
    // Bouncing animation
    this.bounceOffset = Math.sin(this.time * this.currentState.bounceSpeed) * this.currentState.bounceHeight;
    
    // Height oscillation
    this.currentHeight = this.baseHeight + this.bounceOffset;
    
    // Calculate tilt towards cursor
    this.updateTilt();
    
    // Blinking
    this.blinkTimer++;
    if (this.blinkTimer > 120 && Math.random() > 0.98) {
      this.isBlinking = true;
      this.blinkTimer = 0;
    }
    if (this.isBlinking && this.blinkTimer > 10) {
      this.isBlinking = false;
      this.blinkTimer = 0;
    }
  }
  
  updateTilt() {
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.left + this.baseX + this.width / 2;
    const centerY = rect.top + rect.height - this.currentHeight / 2;
    
    // Calculate direction to cursor
    const dx = this.mouseX - centerX;
    const dy = this.mouseY - centerY;
    
    // Calculate lean angle based on horizontal distance
    // Each bar has slightly different response for wave effect
    const sensitivity = 0.0008 - (this.index * 0.00005);
    this.targetTilt = dx * sensitivity;
    
    // Constrain tilt to reasonable range (-0.3 to +0.3 radians, ~17 degrees)
    this.targetTilt = Math.max(-0.3, Math.min(0.3, this.targetTilt));
    
    // Smooth interpolation for fluid movement
    this.tiltAngle += (this.targetTilt - this.tiltAngle) * 0.08;
    
    // Calculate top position based on tilt
    this.topX = this.baseX + Math.tan(this.tiltAngle) * this.currentHeight;
  }
  
  draw(ctx) {
    const canvasHeight = this.canvas.height;
    
    // Draw trapezoid shape (leaning bar)
    const gradient = ctx.createLinearGradient(
      this.baseX, canvasHeight,
      this.topX, canvasHeight - this.currentHeight
    );
    gradient.addColorStop(0, this.colors[0]);
    gradient.addColorStop(1, this.colors[1]);
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = this.colors[0];
    ctx.shadowBlur = 20;
    
    // Draw leaning bar with trapezoid shape
    ctx.beginPath();
    // Bottom left
    ctx.moveTo(this.baseX, canvasHeight);
    // Bottom right
    ctx.lineTo(this.baseX + this.width, canvasHeight);
    // Top right (with tilt)
    ctx.lineTo(this.topX + this.width, canvasHeight - this.currentHeight);
    // Rounded top
    ctx.arcTo(
      this.topX + this.width / 2,
      canvasHeight - this.currentHeight - 20,
      this.topX,
      canvasHeight - this.currentHeight,
      20
    );
    // Top left (with tilt)
    ctx.lineTo(this.topX, canvasHeight - this.currentHeight);
    ctx.closePath();
    ctx.fill();
    
    // Add highlight on tilted side
    if (Math.abs(this.tiltAngle) > 0.05) {
      ctx.fillStyle = this.tiltAngle > 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      if (this.tiltAngle > 0) {
        ctx.moveTo(this.baseX + this.width, canvasHeight);
        ctx.lineTo(this.topX + this.width, canvasHeight - this.currentHeight);
        ctx.lineTo(this.topX + this.width / 2, canvasHeight - this.currentHeight);
        ctx.lineTo(this.baseX + this.width / 2, canvasHeight);
      } else {
        ctx.moveTo(this.baseX, canvasHeight);
        ctx.lineTo(this.topX, canvasHeight - this.currentHeight);
        ctx.lineTo(this.topX + this.width / 2, canvasHeight - this.currentHeight);
        ctx.lineTo(this.baseX + this.width / 2, canvasHeight);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    
    // Update eye positions on tilted bar
    const eyeHeight = canvasHeight - this.currentHeight * 0.7;
    const tiltOffset = Math.tan(this.tiltAngle) * this.currentHeight * 0.7;
    this.leftEye.x = this.baseX + 20 + tiltOffset;
    this.leftEye.y = eyeHeight;
    this.rightEye.x = this.baseX + 60 + tiltOffset;
    this.rightEye.y = eyeHeight;
    
    // Draw eyes
    this.drawEyes(ctx);
    
    // Draw particles
    this.updateParticles(ctx);
  }
  
  drawEyes(ctx) {
    const eyeSize = 20 * this.currentState.eyeSize;
    
    // Calculate pupil position based on mouse
    const canvas = this.canvas;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const dx = this.mouseX - (rect.left + this.leftEye.x);
      const dy = this.mouseY - (rect.top + this.leftEye.y);
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 1);
      const pupilOffsetX = Math.cos(angle) * distance * 8;
      const pupilOffsetY = Math.sin(angle) * distance * 8;
      
      this.leftEye.pupilX = pupilOffsetX;
      this.leftEye.pupilY = pupilOffsetY;
      this.rightEye.pupilX = pupilOffsetX;
      this.rightEye.pupilY = pupilOffsetY;
    }
    
    // Draw left eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (this.isBlinking) {
      ctx.ellipse(this.leftEye.x, this.leftEye.y, eyeSize, 3, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(this.leftEye.x, this.leftEye.y, eyeSize, 0, Math.PI * 2);
    }
    ctx.fill();
    
    // Left pupil
    if (!this.isBlinking) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(
        this.leftEye.x + this.leftEye.pupilX,
        this.leftEye.y + this.leftEye.pupilY,
        eyeSize * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        this.leftEye.x + this.leftEye.pupilX - 3,
        this.leftEye.y + this.leftEye.pupilY - 3,
        eyeSize * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    // Draw right eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (this.isBlinking) {
      ctx.ellipse(this.rightEye.x, this.rightEye.y, eyeSize, 3, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(this.rightEye.x, this.rightEye.y, eyeSize, 0, Math.PI * 2);
    }
    ctx.fill();
    
    // Right pupil
    if (!this.isBlinking) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(
        this.rightEye.x + this.rightEye.pupilX,
        this.rightEye.y + this.rightEye.pupilY,
        eyeSize * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        this.rightEye.x + this.rightEye.pupilX - 3,
        this.rightEye.y + this.rightEye.pupilY - 3,
        eyeSize * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
  
  createParticle(type = 'sparkle') {
    this.particles.push({
      x: this.x + this.width / 2 + (Math.random() - 0.5) * this.width,
      y: this.currentHeight * 0.2 + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3 - 2,
      life: 1,
      type: type,
      size: Math.random() * 6 + 3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      color: this.colors[0]
    });
  }
  
  updateParticles(ctx) {
    // Create particles based on emotion
    if (this.currentState.sparkles && Math.random() > 0.9) {
      this.createParticle('sparkle');
    }
    if (this.currentState.tears && Math.random() > 0.95) {
      this.createParticle('tear');
    }
    
    this.particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= 0.02;
      p.rotation += p.rotationSpeed;
      
      if (p.life <= 0) {
        this.particles.splice(index, 1);
        return;
      }
      
      ctx.globalAlpha = p.life;
      
      if (p.type === 'sparkle') {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 2) * i;
          ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
          ctx.lineTo(Math.cos(angle + Math.PI / 4) * p.size * 0.5, Math.sin(angle + Math.PI / 4) * p.size * 0.5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.shadowBlur = 0;
      } else if (p.type === 'tear') {
        ctx.fillStyle = '#4A90E2';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    ctx.globalAlpha = 1;
  }
}

// Canvas Container for Multiple Bars
class CanvasCharacter {
  constructor(canvas, size = 'large') {
    this.canvas = canvas;
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.size = size;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Create 4 bars with different heights and colors
    this.barColors = [
      ['#667eea', '#764ba2'], // Purple
      ['#f093fb', '#f5576c'], // Pink
      ['#4facfe', '#00f2fe'], // Cyan
      ['#43e97b', '#38f9d7']  // Green
    ];
    
    this.baseBarHeights = [300, 400, 350, 380];
    
    this.bars = [];
    this.createBars();
    
    this.emotion = 'neutral';
    this.animate();
    
    // Setup resize handler
    this.setupResize();
  }
  
  createBars() {
    this.bars = [];
    const spacing = this.width / 5;
    
    for (let i = 0; i < 4; i++) {
      const x = spacing * (i + 0.5);
      this.bars.push(new BarCharacter(
        this.canvas,
        x - 40,
        this.baseBarHeights[i] * (this.height / 600),
        this.barColors[i],
        i
      ));
    }
  }
  
  setupResize() {
    let resizeTimeout;
    const resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 150);
    };
    
    window.addEventListener('resize', resizeHandler);
  }
  
  handleResize() {
    if (!this.canvas) return;
    
    // Get container dimensions
    const container = this.canvas.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Update canvas size with device pixel ratio for crisp rendering
    const scale = window.devicePixelRatio || 1;
    this.canvas.width = containerWidth * scale;
    this.canvas.height = containerHeight * scale;
    this.canvas.style.width = containerWidth + 'px';
    this.canvas.style.height = containerHeight + 'px';
    
    this.ctx.scale(scale, scale);
    
    this.width = containerWidth;
    this.height = containerHeight;
    
    // Recreate bars with new dimensions
    this.createBars();
    
    // Restore emotion
    this.setEmotion(this.emotion, true);
  }
  
  setEmotion(emotion, immediate = false) {
    this.emotion = emotion;
    this.bars.forEach(bar => bar.setEmotion(emotion, immediate));
  }
  
  updateMousePosition(x, y) {
    this.bars.forEach(bar => bar.updateMousePosition(x, y));
  }
  
  animate() {
    if (!this.canvas) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw shared base platform
    this.drawBasePlatform();
    
    // Update and draw each bar
    this.bars.forEach(bar => {
      bar.animate();
      bar.draw(this.ctx);
    });
    
    requestAnimationFrame(() => this.animate());
  }
  
  drawBasePlatform() {
    const ctx = this.ctx;
    const platformHeight = 20;
    const platformY = this.height - platformHeight;
    
    // Platform gradient
    const gradient = ctx.createLinearGradient(0, platformY, 0, this.height);
    gradient.addColorStop(0, 'rgba(100, 100, 120, 0.3)');
    gradient.addColorStop(1, 'rgba(50, 50, 70, 0.5)');
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
    
    // Draw platform with rounded corners
    const x = this.width * 0.1;
    const y = platformY;
    const width = this.width * 0.8;
    const height = platformHeight;
    const radius = 10;
    
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      // Fallback for older browsers
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
}

// Character Controller for managing multiple character instances
class CharacterController {
  constructor() {
    this.mainCharacter = null;
    this.widgetCharacter = null;
    this.loadingCharacter = null;
    this.exitCharacter = null;
    this.characterBubble = document.getElementById('characterBubble');
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
    this.initializeCharacters();
    this.setupMouseTracking();
    this.setupButtonHovers();
    this.setupWidgetInteractions();
    
    // Setup welcome character after a short delay
    setTimeout(() => {
      this.setupWelcomeCharacter();
    }, 100);
  }
  
  initializeCharacters() {
    // Main welcome character
    const mainCanvas = document.getElementById('mainCharacter');
    if (mainCanvas) {
      this.initCanvas(mainCanvas);
      this.mainCharacter = new CanvasCharacter(mainCanvas, 'large');
    }
    
    // Widget character
    const widgetCanvas = document.getElementById('characterCanvas');
    if (widgetCanvas) {
      this.initCanvas(widgetCanvas);
      this.widgetCharacter = new CanvasCharacter(widgetCanvas, 'small');
    }
    
    // Loading character
    const loadingCanvas = document.getElementById('loadingCharacter');
    if (loadingCanvas) {
      this.initCanvas(loadingCanvas);
      this.loadingCharacter = new CanvasCharacter(loadingCanvas, 'medium');
      this.loadingCharacter.setEmotion('excited', true);
    }
    
    // Exit character
    const exitCanvas = document.getElementById('exitCharacter');
    if (exitCanvas) {
      this.initCanvas(exitCanvas);
      this.exitCharacter = new CanvasCharacter(exitCanvas, 'medium');
      this.exitCharacter.setEmotion('sad', true);
    }
    
    // Apology character
    const apologyCanvas = document.getElementById('apologyCharacter');
    if (apologyCanvas) {
      this.initCanvas(apologyCanvas);
      this.apologyCharacter = new CanvasCharacter(apologyCanvas, 'medium');
      this.apologyCharacter.setEmotion('sad', true);
    }
  }
  
  initCanvas(canvas) {
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Set canvas size with device pixel ratio
    const scale = window.devicePixelRatio || 1;
    canvas.width = containerWidth * scale;
    canvas.height = containerHeight * scale;
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = containerHeight + 'px';
    
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
  }

  setupWelcomeCharacter() {
    const mainCanvas = document.getElementById('mainCharacter');
    if (!mainCanvas) return;

    // Dramatic entrance animation for canvas
    gsap.from(mainCanvas, {
      duration: 1.5,
      scale: 0,
      rotation: 360,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.5
    });

    // Continuous floating animation
    gsap.to(mainCanvas, {
      y: -25,
      duration: 2.5,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Subtle rotation
    gsap.to(mainCanvas, {
      rotation: 8,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Pulsing glow effect
    const glow = document.querySelector('.character-glow');
    if (glow) {
      gsap.to(glow, {
        scale: 1.3,
        opacity: 0.9,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });
    }
  }

  setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      // Update all active characters
      if (this.mainCharacter) {
        this.mainCharacter.updateMousePosition(e.clientX, e.clientY);
      }
      if (this.widgetCharacter && this.widget.classList.contains('show')) {
        this.widgetCharacter.updateMousePosition(e.clientX, e.clientY);
      }
      if (this.loadingCharacter && this.currentPage === 'loading') {
        this.loadingCharacter.updateMousePosition(e.clientX, e.clientY);
      }
      if (this.exitCharacter && this.currentPage === 'exit') {
        this.exitCharacter.updateMousePosition(e.clientX, e.clientY);
      }
      if (this.apologyCharacter && this.currentPage === 'apology') {
        this.apologyCharacter.updateMousePosition(e.clientX, e.clientY);
      }
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
    if (this.mainCharacter) {
      this.mainCharacter.setEmotion('happy');
    }
    if (this.widgetCharacter && this.widget.classList.contains('show')) {
      this.widgetCharacter.setEmotion('happy');
    }
  }

  showSadExpression() {
    if (this.mainCharacter) {
      this.mainCharacter.setEmotion('sad');
    }
    if (this.widgetCharacter && this.widget.classList.contains('show')) {
      this.widgetCharacter.setEmotion('sad');
    }
  }

  resetExpression() {
    if (this.mainCharacter) {
      this.mainCharacter.setEmotion('neutral');
    }
    if (this.widgetCharacter && this.widget.classList.contains('show')) {
      this.widgetCharacter.setEmotion('neutral');
    }
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
  }

  hideWidget() {
    if (!this.widget) return;
    this.widget.classList.remove('show');
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
    const canvas = document.getElementById('characterCanvas');
    if (!canvas) return;

    canvas.addEventListener('click', () => {
      if (this.widgetCharacter) {
        this.widgetCharacter.setEmotion('excited');
        setTimeout(() => {
          this.widgetCharacter.setEmotion('neutral');
        }, 1000);
      }
      
      const messages = ['Yay! 🎉', 'That tickles! 😄', 'Again! Again!', 'Hehe! 😊'];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      this.showMessage(randomMessage);
    });
  }

  updateForPage(pageName) {
    this.currentPage = pageName;

    if (pageName === 'welcome' || pageName === 'loading' || pageName === 'exit' || pageName === 'apology') {
      this.hideWidget();
    } else {
      this.showWidget();
      
      if (this.messages[pageName]) {
        const messages = this.messages[pageName];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setTimeout(() => this.showMessage(randomMessage), 1000);
      }
    }
  }

  celebrateTransition() {
    if (this.widgetCharacter) {
      this.widgetCharacter.setEmotion('excited');
      setTimeout(() => {
        this.widgetCharacter.setEmotion('happy');
      }, 500);
      setTimeout(() => {
        this.widgetCharacter.setEmotion('neutral');
      }, 1500);
    }
  }
}

// Initialize character controller after DOM is ready
let characterController;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    characterController = new CharacterController();
    if (typeof window !== 'undefined') {
      window.characterController = characterController;
    }
  });
} else {
  characterController = new CharacterController();
  if (typeof window !== 'undefined') {
    window.characterController = characterController;
  }
}
