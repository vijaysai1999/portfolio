// Canvas-Based Character Animation System
class CanvasCharacter {
  constructor(canvas, size = 'large') {
    this.canvas = canvas;
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.size = size;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    
    // Character state
    this.emotion = 'neutral';
    this.targetEmotion = 'neutral';
    this.transitionProgress = 1;
    
    // Size scaling based on canvas size
    this.scale = this.width / 400; // Base scale from 400px canvas
    
    // Mouse tracking
    this.mouseX = this.centerX;
    this.mouseY = this.centerY;
    this.targetMouseX = this.centerX;
    this.targetMouseY = this.centerY;
    
    // Animation state
    this.time = 0;
    this.blinkTimer = 0;
    this.blinkDuration = 0;
    this.isBlinking = false;
    this.breathPhase = 0;
    
    // Particles
    this.particles = [];
    
    // Emotion properties - MORE DRAMATIC AND COLORFUL
    this.emotions = {
      neutral: {
        mouthCurve: 0.15,
        eyeSize: 1,
        eyebrowAngle: 0,
        bodyScale: 1,
        skinColor1: '#FFD4A3',
        skinColor2: '#FFBC78',
        bodyColor1: '#667eea',
        bodyColor2: '#764ba2',
        blushOpacity: 0
      },
      happy: {
        mouthCurve: 0.7,
        eyeSize: 0.8,
        eyebrowAngle: 0.4,
        bodyScale: 1.08,
        skinColor1: '#FFE5B4',
        skinColor2: '#FFD09B',
        bodyColor1: '#10b981',
        bodyColor2: '#34d399',
        sparkles: true,
        hearts: true,
        blushOpacity: 0.8,
        showTeeth: true
      },
      sad: {
        mouthCurve: -0.6,
        eyeSize: 1.1,
        eyebrowAngle: -0.5,
        bodyScale: 0.92,
        skinColor1: '#B8C5D6',
        skinColor2: '#A0AABB',
        bodyColor1: '#6b7280',
        bodyColor2: '#4b5563',
        tears: true,
        rainCloud: true,
        blushOpacity: 0
      },
      excited: {
        mouthCurve: 0.8,
        eyeSize: 1.3,
        eyebrowAngle: 0.5,
        bodyScale: 1.12,
        skinColor1: '#FFEB99',
        skinColor2: '#FFD966',
        bodyColor1: '#f59e0b',
        bodyColor2: '#fbbf24',
        sparkles: true,
        stars: true,
        blushOpacity: 0.6
      },
      surprised: {
        mouthCurve: 0,
        eyeSize: 1.5,
        eyebrowAngle: 0.6,
        bodyScale: 1.05,
        skinColor1: '#E6D5FF',
        skinColor2: '#D4BBFF',
        bodyColor1: '#8b5cf6',
        bodyColor2: '#a78bfa',
        sweatDrops: true,
        blushOpacity: 0.3
      }
    };
    
    this.currentState = {...this.emotions.neutral};
    this.animate();
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
    this.targetMouseX = x;
    this.targetMouseY = y;
  }
  
  animate() {
    if (!this.canvas) return;
    
    this.time += 0.016;
    this.breathPhase += 0.02;
    
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
    
    // Smooth mouse tracking
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;
    
    // Blinking logic
    this.blinkTimer++;
    if (this.blinkTimer > 180 && Math.random() > 0.98) {
      this.isBlinking = true;
      this.blinkDuration = 15;
      this.blinkTimer = 0;
    }
    if (this.isBlinking) {
      this.blinkDuration--;
      if (this.blinkDuration <= 0) {
        this.isBlinking = false;
      }
    }
    
    this.clear();
    this.draw();
    this.updateParticles();
    
    requestAnimationFrame(() => this.animate());
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  
  draw() {
    const breath = Math.sin(this.breathPhase) * 0.02 + 1;
    const scale = this.currentState.bodyScale * breath;
    
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.scale(scale, scale);
    
    // Draw body
    this.drawBody();
    
    // Draw head
    this.drawHead();
    
    // Draw eyes
    this.drawEyes();
    
    // Draw eyebrows
    this.drawEyebrows();
    
    // Draw mouth
    this.drawMouth();
    
    // Draw accessories
    this.drawAccessories();
    
    this.ctx.restore();
  }
  
  drawBody() {
    const s = this.scale * 1.2;
    
    // Neck
    const neckGradient = this.ctx.createLinearGradient(0, 5 * s, 0, 25 * s);
    neckGradient.addColorStop(0, this.currentState.skinColor1 || '#FFD4A3');
    neckGradient.addColorStop(1, this.currentState.skinColor2 || '#FFBC78');
    this.ctx.fillStyle = neckGradient;
    this.ctx.fillRect(-10 * s, 5 * s, 20 * s, 20 * s);
    
    // Shoulders and torso - modern jacket/shirt
    const bodyGradient = this.ctx.createLinearGradient(0, 20 * s, 0, 100 * s);
    bodyGradient.addColorStop(0, this.currentState.bodyColor1 || '#667eea');
    bodyGradient.addColorStop(1, this.currentState.bodyColor2 || '#764ba2');
    
    this.ctx.fillStyle = bodyGradient;
    this.ctx.beginPath();
    // Torso shape - more rectangular for clothing
    this.ctx.moveTo(-45 * s, 25 * s); // Left shoulder
    this.ctx.lineTo(-45 * s, 90 * s); // Left bottom
    this.ctx.lineTo(45 * s, 90 * s); // Right bottom
    this.ctx.lineTo(45 * s, 25 * s); // Right shoulder
    this.ctx.closePath();
    this.ctx.fill();
    
    // Collar
    this.ctx.fillStyle = this.darkenColor(this.currentState.bodyColor1 || '#667eea', 15);
    this.ctx.beginPath();
    this.ctx.moveTo(-12 * s, 20 * s);
    this.ctx.lineTo(-20 * s, 30 * s);
    this.ctx.lineTo(-10 * s, 40 * s);
    this.ctx.lineTo(10 * s, 40 * s);
    this.ctx.lineTo(20 * s, 30 * s);
    this.ctx.lineTo(12 * s, 20 * s);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Buttons on shirt
    this.ctx.fillStyle = this.lightenColor(this.currentState.bodyColor1 || '#667eea', 30);
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.arc(0, 45 * s + i * 15 * s, 3 * s, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Arms with sleeves
    const armWave = Math.sin(this.time * 2);
    
    // Left arm
    this.ctx.fillStyle = this.currentState.bodyColor1 || '#667eea';
    this.ctx.beginPath();
    this.ctx.moveTo(-45 * s, 30 * s);
    this.ctx.lineTo(-55 * s, 35 * s + armWave * 5 * s);
    this.ctx.lineTo(-60 * s, 70 * s + armWave * 8 * s);
    this.ctx.lineTo(-50 * s, 72 * s + armWave * 8 * s);
    this.ctx.lineTo(-45 * s, 50 * s);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Right arm
    this.ctx.beginPath();
    this.ctx.moveTo(45 * s, 30 * s);
    this.ctx.lineTo(55 * s, 35 * s - armWave * 5 * s);
    this.ctx.lineTo(60 * s, 70 * s - armWave * 8 * s);
    this.ctx.lineTo(50 * s, 72 * s - armWave * 8 * s);
    this.ctx.lineTo(45 * s, 50 * s);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Hands
    this.ctx.fillStyle = this.currentState.skinColor2 || '#FFBC78';
    // Left hand
    this.ctx.beginPath();
    this.ctx.arc(-57 * s, 72 * s + armWave * 8 * s, 8 * s, 0, Math.PI * 2);
    this.ctx.fill();
    // Right hand
    this.ctx.beginPath();
    this.ctx.arc(57 * s, 72 * s - armWave * 8 * s, 8 * s, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawHead() {
    const s = this.scale * 1.2;
    const headBob = Math.sin(this.time) * 3 * s;
    
    // Draw hair FIRST (behind head) - Modern hairstyle
    this.drawHairBack(headBob, s);
    
    // Head shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, -10 * s + headBob + 5 * s, 85 * s, 88 * s, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Head gradient - realistic skin tones
    const headGradient = this.ctx.createRadialGradient(-15 * s, -30 * s + headBob, 10 * s, 0, -10 * s + headBob, 100 * s);
    headGradient.addColorStop(0, this.lightenColor(this.currentState.skinColor1 || '#FFD4A3', 10));
    headGradient.addColorStop(0.5, this.currentState.skinColor1 || '#FFD4A3');
    headGradient.addColorStop(0.85, this.currentState.skinColor2 || '#FFBC78');
    headGradient.addColorStop(1, this.darkenColor(this.currentState.skinColor2 || '#FFBC78', 15));
    
    this.ctx.fillStyle = headGradient;
    this.ctx.beginPath();
    this.ctx.ellipse(0, -10 * s + headBob, 80 * s, 85 * s, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Head outline
    this.ctx.strokeStyle = this.darkenColor(this.currentState.skinColor2 || '#FFBC78', 25);
    this.ctx.lineWidth = 2 * s;
    this.ctx.stroke();
    
    // Nose - subtle triangle
    this.ctx.fillStyle = this.darkenColor(this.currentState.skinColor2 || '#FFBC78', 10);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0 + headBob);
    this.ctx.lineTo(-4 * s, 10 * s + headBob);
    this.ctx.lineTo(4 * s, 10 * s + headBob);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Nostril shadows
    this.ctx.fillStyle = this.darkenColor(this.currentState.skinColor2 || '#FFBC78', 20);
    this.ctx.beginPath();
    this.ctx.arc(-3 * s, 10 * s + headBob, 1.5 * s, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(3 * s, 10 * s + headBob, 1.5 * s, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Glossy highlight on forehead
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.ellipse(-10 * s, -40 * s + headBob, 20 * s, 25 * s, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Blush cheeks
    if (this.currentState.blushOpacity > 0) {
      this.ctx.fillStyle = `rgba(255, 179, 186, ${this.currentState.blushOpacity * 0.5})`;
      // Left cheek
      this.ctx.beginPath();
      this.ctx.ellipse(-40 * s, 5 * s + headBob, 16 * s, 14 * s, 0, 0, Math.PI * 2);
      this.ctx.fill();
      // Right cheek
      this.ctx.beginPath();
      this.ctx.ellipse(40 * s, 5 * s + headBob, 16 * s, 14 * s, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw hair FRONT (on top of head)
    this.drawHairFront(headBob, s);
  }
  
  drawHairBack(headBob, s) {
    // Back hair layer - covers back and sides of head
    const hairColor = '#2C1810'; // Dark brown
    
    this.ctx.fillStyle = hairColor;
    this.ctx.beginPath();
    // Large oval covering back of head
    this.ctx.ellipse(0, -20 * s + headBob, 85 * s, 90 * s, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add hair texture/shading
    this.ctx.fillStyle = this.lightenColor(hairColor, 15);
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 8) * i + Math.PI / 2;
      const x = Math.cos(angle) * 75 * s;
      const y = -20 * s + Math.sin(angle) * 80 * s + headBob;
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, 12 * s, 25 * s, angle, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawHairFront(headBob, s) {
    // Modern hairstyle - styled top with bangs
    const hairColor = '#2C1810';
    const hairHighlight = this.lightenColor(hairColor, 20);
    
    this.ctx.fillStyle = hairColor;
    
    // Top hair - styled upward
    this.ctx.beginPath();
    this.ctx.moveTo(-50 * s, -60 * s + headBob);
    this.ctx.quadraticCurveTo(-30 * s, -90 * s + headBob, 0, -95 * s + headBob);
    this.ctx.quadraticCurveTo(30 * s, -90 * s + headBob, 50 * s, -60 * s + headBob);
    this.ctx.quadraticCurveTo(30 * s, -70 * s + headBob, 0, -75 * s + headBob);
    this.ctx.quadraticCurveTo(-30 * s, -70 * s + headBob, -50 * s, -60 * s + headBob);
    this.ctx.fill();
    
    // Individual hair strands for detail
    this.ctx.strokeStyle = hairColor;
    this.ctx.lineWidth = 3 * s;
    this.ctx.lineCap = 'round';
    
    for (let i = -2; i <= 2; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * 15 * s, -75 * s + headBob);
      this.ctx.quadraticCurveTo(
        i * 12 * s, 
        -85 * s + headBob + Math.sin(this.time + i) * 3 * s,
        i * 10 * s, 
        -92 * s + headBob
      );
      this.ctx.stroke();
    }
    
    // Hair highlights
    this.ctx.strokeStyle = hairHighlight;
    this.ctx.lineWidth = 2 * s;
    for (let i = -1; i <= 1; i += 2) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * 20 * s, -70 * s + headBob);
      this.ctx.lineTo(i * 15 * s, -88 * s + headBob);
      this.ctx.stroke();
    }
    
    // Side bangs
    this.ctx.fillStyle = hairColor;
    // Left side
    this.ctx.beginPath();
    this.ctx.moveTo(-70 * s, -50 * s + headBob);
    this.ctx.quadraticCurveTo(-80 * s, -30 * s + headBob, -75 * s, -10 * s + headBob);
    this.ctx.lineTo(-60 * s, -15 * s + headBob);
    this.ctx.quadraticCurveTo(-65 * s, -35 * s + headBob, -60 * s, -55 * s + headBob);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Right side
    this.ctx.beginPath();
    this.ctx.moveTo(70 * s, -50 * s + headBob);
    this.ctx.quadraticCurveTo(80 * s, -30 * s + headBob, 75 * s, -10 * s + headBob);
    this.ctx.lineTo(60 * s, -15 * s + headBob);
    this.ctx.quadraticCurveTo(65 * s, -35 * s + headBob, 60 * s, -55 * s + headBob);
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  drawEyes() {
    const s = this.scale * 1.2;
    const eyeSize = 22 * s * this.currentState.eyeSize;
    const eyeY = -25 * s;
    const eyeSpacing = 32 * s;
    
    // Calculate pupil position based on mouse
    const dx = this.mouseX - this.centerX;
    const dy = this.mouseY - this.centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 100, 1);
    const pupilOffsetX = Math.cos(angle) * distance * 8 * s;
    const pupilOffsetY = Math.sin(angle) * distance * 8 * s;
    
    // Draw eyes - LARGER AND MORE EXPRESSIVE
    [-1, 1].forEach(side => {
      const eyeX = side * eyeSpacing;
      
      // Eye white with subtle shadow
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      this.ctx.shadowBlur = 5 * s;
      this.ctx.beginPath();
      if (this.isBlinking) {
        // Blinking animation - squinted happy eyes
        this.ctx.ellipse(eyeX, eyeY, eyeSize, 3 * s, 0, 0, Math.PI * 2);
      } else if (this.currentState.eyeSize < 0.9 && this.emotion === 'happy') {
        // Happy squinted eyes (^_^)
        this.ctx.arc(eyeX, eyeY, eyeSize * 0.6, 0, Math.PI, true);
      } else {
        this.ctx.arc(eyeX, eyeY, eyeSize, 0, Math.PI * 2);
      }
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      
      // Eye outline - thicker
      this.ctx.strokeStyle = this.darkenColor(this.currentState.skinColor2 || '#FFBC78', 40);
      this.ctx.lineWidth = 3 * s;
      this.ctx.stroke();
      
      if (!this.isBlinking && !(this.currentState.eyeSize < 0.9 && this.emotion === 'happy')) {
        // Iris gradient - vibrant blue/green
        const irisGradient = this.ctx.createRadialGradient(
          eyeX + pupilOffsetX, eyeY + pupilOffsetY, 0,
          eyeX + pupilOffsetX, eyeY + pupilOffsetY, eyeSize * 0.7
        );
        irisGradient.addColorStop(0, '#00C9FF');
        irisGradient.addColorStop(0.5, '#00B8E6');
        irisGradient.addColorStop(1, '#92FE9D');
        
        this.ctx.fillStyle = irisGradient;
        this.ctx.beginPath();
        this.ctx.arc(eyeX + pupilOffsetX, eyeY + pupilOffsetY, eyeSize * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Pupil - deep black
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(eyeX + pupilOffsetX, eyeY + pupilOffsetY, eyeSize * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Multiple highlights for glossy effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.beginPath();
        this.ctx.arc(eyeX + pupilOffsetX - 4 * s, eyeY + pupilOffsetY - 5 * s, eyeSize * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(eyeX + pupilOffsetX + 3 * s, eyeY + pupilOffsetY + 4 * s, eyeSize * 0.12, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Eyelashes for added detail
      if (!this.isBlinking) {
        this.ctx.strokeStyle = this.darkenColor(this.currentState.skinColor2 || '#FFBC78', 50);
        this.ctx.lineWidth = 2 * s;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < 3; i++) {
          const lashAngle = (Math.PI / 4) + (i * Math.PI / 6);
          this.ctx.beginPath();
          this.ctx.moveTo(
            eyeX + Math.cos(lashAngle) * eyeSize * 0.9,
            eyeY + Math.sin(lashAngle) * eyeSize * 0.9
          );
          this.ctx.lineTo(
            eyeX + Math.cos(lashAngle) * eyeSize * 1.2,
            eyeY + Math.sin(lashAngle) * eyeSize * 1.2
          );
          this.ctx.stroke();
        }
      }
    });
  }
  
  drawEyebrows() {
    const s = this.scale * 1.2;
    const eyebrowY = -50 * s;
    const eyeSpacing = 32 * s;
    const angle = this.currentState.eyebrowAngle;
    
    // Natural, thick eyebrows with arch
    this.ctx.strokeStyle = '#3D2817'; // Dark brown
    this.ctx.lineWidth = 4 * s;
    this.ctx.lineCap = 'round';
    
    // Left eyebrow with natural arch
    this.ctx.beginPath();
    this.ctx.moveTo(-eyeSpacing - 15 * s, eyebrowY - angle * 15 * s + 3 * s);
    this.ctx.quadraticCurveTo(
      -eyeSpacing - 5 * s, eyebrowY - angle * 15 * s - 5 * s,
      -eyeSpacing + 12 * s, eyebrowY + angle * 15 * s
    );
    this.ctx.stroke();
    
    // Right eyebrow with natural arch
    this.ctx.beginPath();
    this.ctx.moveTo(eyeSpacing - 12 * s, eyebrowY + angle * 15 * s);
    this.ctx.quadraticCurveTo(
      eyeSpacing + 5 * s, eyebrowY + angle * 15 * s - 5 * s,
      eyeSpacing + 15 * s, eyebrowY - angle * 15 * s + 3 * s
    );
    this.ctx.stroke();
    
    // Add eyebrow hair texture
    this.ctx.lineWidth = 1.5 * s;
    for (let i = 0; i < 5; i++) {
      const offset = (i - 2) * 5 * s;
      // Left eyebrow hairs
      this.ctx.beginPath();
      this.ctx.moveTo(-eyeSpacing + offset, eyebrowY - 2 * s);
      this.ctx.lineTo(-eyeSpacing + offset - 2 * s, eyebrowY - 6 * s);
      this.ctx.stroke();
      // Right eyebrow hairs
      this.ctx.beginPath();
      this.ctx.moveTo(eyeSpacing + offset, eyebrowY - 2 * s);
      this.ctx.lineTo(eyeSpacing + offset + 2 * s, eyebrowY - 6 * s);
      this.ctx.stroke();
    }
  }
  
  drawMouth() {
    const s = this.scale * 1.2;
    const mouthY = 15 * s;
    const mouthWidth = 28 * s;
    const curve = this.currentState.mouthCurve * 25 * s;
    
    if (this.currentState.showTeeth && this.currentState.mouthCurve > 0.5) {
      // Big happy smile with teeth - VERY EXPRESSIVE
      // Mouth interior
      this.ctx.fillStyle = '#C74867';
      this.ctx.beginPath();
      this.ctx.arc(0, mouthY - 5 * s, mouthWidth * 1.1, 0.2, Math.PI - 0.2);
      this.ctx.fill();
      
      // Upper teeth
      this.ctx.fillStyle = '#FFFFFF';
      for (let i = -3; i <= 3; i++) {
        this.ctx.fillRect(i * 7 * s - 3 * s, mouthY - 8 * s, 6 * s, 10 * s);
      }
      
      // Lower teeth
      for (let i = -3; i <= 3; i++) {
        this.ctx.fillRect(i * 7 * s - 3 * s, mouthY + 2 * s, 6 * s, 8 * s);
      }
      
      // Lips - upper
      this.ctx.fillStyle = '#E89BAA';
      this.ctx.beginPath();
      this.ctx.moveTo(-mouthWidth, mouthY - 3 * s);
      this.ctx.quadraticCurveTo(-mouthWidth * 0.5, mouthY - 8 * s, 0, mouthY - 10 * s);
      this.ctx.quadraticCurveTo(mouthWidth * 0.5, mouthY - 8 * s, mouthWidth, mouthY - 3 * s);
      this.ctx.lineTo(mouthWidth * 0.8, mouthY - 1 * s);
      this.ctx.quadraticCurveTo(0, mouthY - 5 * s, -mouthWidth * 0.8, mouthY - 1 * s);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Lips - lower
      this.ctx.beginPath();
      this.ctx.moveTo(-mouthWidth, mouthY + 3 * s);
      this.ctx.quadraticCurveTo(0, mouthY + curve, mouthWidth, mouthY + 3 * s);
      this.ctx.lineTo(mouthWidth * 0.8, mouthY + 1 * s);
      this.ctx.quadraticCurveTo(0, mouthY + curve * 0.7, -mouthWidth * 0.8, mouthY + 1 * s);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Lip gloss
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, mouthY + curve * 0.6, mouthWidth * 0.5, 3 * s, 0, 0, Math.PI);
      this.ctx.fill();
      
    } else if (this.currentState.mouthCurve < -0.4) {
      // Deep sad frown with lower lip
      // Lips outline
      this.ctx.strokeStyle = '#B5798D';
      this.ctx.lineWidth = 4 * s;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(-mouthWidth, mouthY);
      this.ctx.quadraticCurveTo(0, mouthY + curve, mouthWidth, mouthY);
      this.ctx.stroke();
      
      // Lower lip (fuller for sad expression)
      this.ctx.fillStyle = '#D89BAA';
      this.ctx.beginPath();
      this.ctx.moveTo(-mouthWidth * 0.7, mouthY + curve * 0.5);
      this.ctx.quadraticCurveTo(0, mouthY + curve * 0.8, mouthWidth * 0.7, mouthY + curve * 0.5);
      this.ctx.quadraticCurveTo(0, mouthY + curve * 0.6, -mouthWidth * 0.7, mouthY + curve * 0.5);
      this.ctx.fill();
      
    } else {
      // Natural lips - neutral/slight smile
      const lipCurve = this.currentState.mouthCurve * 20 * s;
      
      // Upper lip
      this.ctx.fillStyle = '#D89BAA';
      this.ctx.beginPath();
      this.ctx.moveTo(-mouthWidth, mouthY);
      this.ctx.quadraticCurveTo(-mouthWidth * 0.5, mouthY - 5 * s, 0, mouthY - 6 * s);
      this.ctx.quadraticCurveTo(mouthWidth * 0.5, mouthY - 5 * s, mouthWidth, mouthY);
      this.ctx.lineTo(mouthWidth * 0.8, mouthY + 2 * s);
      this.ctx.quadraticCurveTo(0, mouthY - 2 * s, -mouthWidth * 0.8, mouthY + 2 * s);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Lower lip
      this.ctx.beginPath();
      this.ctx.moveTo(-mouthWidth, mouthY + 3 * s);
      this.ctx.quadraticCurveTo(0, mouthY + lipCurve, mouthWidth, mouthY + 3 * s);
      this.ctx.lineTo(mouthWidth * 0.8, mouthY + 1 * s);
      this.ctx.quadraticCurveTo(0, mouthY + lipCurve * 0.6, -mouthWidth * 0.8, mouthY + 1 * s);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Lip highlight
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, mouthY + lipCurve * 0.5, mouthWidth * 0.4, 2 * s, 0, 0, Math.PI);
      this.ctx.fill();
    }
  }
  
  drawAccessories() {
    const s = this.scale * 1.2;
    
    // Optional modern glasses (can be toggled)
    if (this.emotion === 'neutral' || this.emotion === 'excited') {
      const headBob = Math.sin(this.time) * 3 * s;
      
      // Glasses frame
      this.ctx.strokeStyle = 'rgba(50, 50, 50, 0.4)';
      this.ctx.lineWidth = 2 * s;
      
      // Left lens
      this.ctx.beginPath();
      this.ctx.arc(-32 * s, -25 * s + headBob, 18 * s, 0, Math.PI * 2);
      this.ctx.stroke();
      
      // Right lens
      this.ctx.beginPath();
      this.ctx.arc(32 * s, -25 * s + headBob, 18 * s, 0, Math.PI * 2);
      this.ctx.stroke();
      
      // Bridge
      this.ctx.beginPath();
      this.ctx.moveTo(-14 * s, -25 * s + headBob);
      this.ctx.lineTo(14 * s, -25 * s + headBob);
      this.ctx.stroke();
      
      // Lens glare
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.beginPath();
      this.ctx.arc(-35 * s, -30 * s + headBob, 6 * s, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(35 * s, -30 * s + headBob, 6 * s, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  createParticle(type = 'sparkle') {
    const s = this.scale * 1.2;
    this.particles.push({
      x: (Math.random() - 0.5) * 120 * s,
      y: (Math.random() - 0.5) * 120 * s,
      vx: (Math.random() - 0.5) * 4 * s,
      vy: (Math.random() - 0.5) * 4 * s - 2 * s, // Bias upward for some particles
      life: 1,
      type: type,
      size: (Math.random() * 6 + 3) * s,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      color: ['#FFD700', '#FFA500', '#FF69B4', '#00FF88', '#00D4FF'][Math.floor(Math.random() * 5)]
    });
  }
  
  updateParticles() {
    // Create particles based on emotion - MORE FREQUENT
    if (this.currentState.sparkles && Math.random() > 0.85) {
      this.createParticle('sparkle');
    }
    if (this.currentState.hearts && Math.random() > 0.9) {
      this.createParticle('heart');
    }
    if (this.currentState.tears && Math.random() > 0.92) {
      this.createParticle('tear');
    }
    if (this.currentState.stars && Math.random() > 0.88) {
      this.createParticle('star');
    }
    
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    
    this.particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= 0.02;
      p.rotation += p.rotationSpeed;
      
      if (p.life <= 0) {
        this.particles.splice(index, 1);
        return;
      }
      
      this.ctx.globalAlpha = p.life;
      
      if (p.type === 'sparkle') {
        this.ctx.fillStyle = p.color || '#ffd700';
        this.ctx.shadowColor = p.color || '#ffd700';
        this.ctx.shadowBlur = 10;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 2) * i;
          this.ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
          this.ctx.lineTo(Math.cos(angle + Math.PI / 4) * p.size * 0.5, Math.sin(angle + Math.PI / 4) * p.size * 0.5);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.shadowBlur = 0;
      } else if (p.type === 'heart') {
        this.ctx.fillStyle = '#FF1493';
        this.ctx.shadowColor = '#FF1493';
        this.ctx.shadowBlur = 8;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.scale(p.size / 10, p.size / 10);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 3);
        this.ctx.bezierCurveTo(-5, -2, -10, 1, 0, 10);
        this.ctx.bezierCurveTo(10, 1, 5, -2, 0, 3);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.shadowBlur = 0;
      } else if (p.type === 'tear') {
        const tearGradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        tearGradient.addColorStop(0, '#87CEEB');
        tearGradient.addColorStop(1, '#4A90E2');
        this.ctx.fillStyle = tearGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Highlight on tear
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(p.x - p.size * 0.2, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'star') {
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.shadowColor = '#FFFF00';
        this.ctx.shadowBlur = 10;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
          const x = Math.cos(angle) * p.size;
          const y = Math.sin(angle) * p.size;
          if (i === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
          
          const innerAngle = angle + Math.PI / 5;
          const innerX = Math.cos(innerAngle) * p.size * 0.4;
          const innerY = Math.sin(innerAngle) * p.size * 0.4;
          this.ctx.lineTo(innerX, innerY);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.shadowBlur = 0;
      }
    });
    
    this.ctx.restore();
    this.ctx.globalAlpha = 1;
  }
  
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }
  
  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
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
      this.mainCharacter = new CanvasCharacter(mainCanvas, 'large');
    }
    
    // Widget character
    const widgetCanvas = document.getElementById('characterCanvas');
    if (widgetCanvas) {
      this.widgetCharacter = new CanvasCharacter(widgetCanvas, 'small');
    }
    
    // Loading character
    const loadingCanvas = document.getElementById('loadingCharacter');
    if (loadingCanvas) {
      this.loadingCharacter = new CanvasCharacter(loadingCanvas, 'medium');
      this.loadingCharacter.setEmotion('excited', true);
    }
    
    // Exit character
    const exitCanvas = document.getElementById('exitCharacter');
    if (exitCanvas) {
      this.exitCharacter = new CanvasCharacter(exitCanvas, 'medium');
      this.exitCharacter.setEmotion('sad', true);
    }
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

    // Continuous floating animation - more pronounced
    gsap.to(mainCanvas, {
      y: -25,
      duration: 2.5,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Subtle rotation for life
    gsap.to(mainCanvas, {
      rotation: 8,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Pulsing glow effect - more vibrant
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
    
    // Create welcome sparkles around character
    setInterval(() => {
      if (window.portfolioApp && window.portfolioApp.createParticleEffect) {
        const rect = mainCanvas.getBoundingClientRect();
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const x = rect.left + rect.width / 2 + Math.cos(angle) * distance;
        const y = rect.top + rect.height / 2 + Math.sin(angle) * distance;
        const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF88', '#00D4FF'];
        window.portfolioApp.createParticleEffect(x, y, colors[Math.floor(Math.random() * colors.length)]);
      }
    }, 500);
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
      
      // Canvas bounce animation
      const canvas = document.getElementById('mainCharacter');
      if (canvas) {
        gsap.to(canvas, {
          y: -30,
          scale: 1.05,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    }
    
    if (this.widgetCharacter && this.widget.classList.contains('show')) {
      this.widgetCharacter.setEmotion('happy');
    }
  }

  showSadExpression() {
    if (this.mainCharacter) {
      this.mainCharacter.setEmotion('sad');
      
      // Canvas droop animation
      const canvas = document.getElementById('mainCharacter');
      if (canvas) {
        gsap.to(canvas, {
          y: 10,
          scale: 0.95,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    }
    
    if (this.widgetCharacter && this.widget.classList.contains('show')) {
      this.widgetCharacter.setEmotion('sad');
    }
  }

  resetExpression() {
    if (this.mainCharacter) {
      this.mainCharacter.setEmotion('neutral');
      
      const canvas = document.getElementById('mainCharacter');
      if (canvas) {
        gsap.to(canvas, {
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    }
    
    if (this.widgetCharacter && this.widget.classList.contains('show')) {
      this.widgetCharacter.setEmotion('neutral');
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
    const canvas = document.getElementById('characterCanvas');
    if (!canvas) return;

    // Gentle bobbing
    gsap.to(canvas, {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Occasional wave
    setInterval(() => {
      if (Math.random() > 0.7 && this.widgetCharacter) {
        gsap.to(canvas, {
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
    const canvas = document.getElementById('characterCanvas');
    if (!canvas) return;

    canvas.addEventListener('click', () => {
      if (this.widgetCharacter) {
        this.widgetCharacter.setEmotion('excited');
        setTimeout(() => {
          this.widgetCharacter.setEmotion('neutral');
        }, 1000);
      }
      
      // Excited reaction
      gsap.to(canvas, {
        scale: 1.2,
        rotation: 360,
        duration: 0.6,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.to(canvas, {
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

    canvas.addEventListener('mouseenter', () => {
      if (this.widgetCharacter) {
        this.widgetCharacter.setEmotion('happy');
      }
      gsap.to(canvas, {
        scale: 1.15,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    });

    canvas.addEventListener('mouseleave', () => {
      if (this.widgetCharacter) {
        this.widgetCharacter.setEmotion('neutral');
      }
      gsap.to(canvas, {
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
    if (this.widgetCharacter) {
      this.widgetCharacter.setEmotion('excited');
      setTimeout(() => {
        this.widgetCharacter.setEmotion('happy');
      }, 500);
      setTimeout(() => {
        this.widgetCharacter.setEmotion('neutral');
      }, 1500);
    }
    
    const canvas = document.getElementById('characterCanvas');
    if (canvas) {
      gsap.timeline()
        .to(canvas, {
          scale: 1.3,
          rotation: 720,
          duration: 1,
          ease: 'power2.inOut'
        })
        .to(canvas, {
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