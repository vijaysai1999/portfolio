// Loading Animation Controller
class LoadingController {
  constructor() {
    this.progressFill = document.getElementById('progressFill');
    this.progressText = document.getElementById('progressText');
    this.loadingCanvas = document.getElementById('loadingCharacter');
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.isLoading = false;
    this.callback = null;
  }

  startLoading(callback) {
    console.log('Loading started');
    this.isLoading = true;
    this.callback = callback;
    this.currentProgress = 0;
    this.targetProgress = 0;

    // Reset progress bar
    if (this.progressFill) {
      this.progressFill.style.width = '0%';
    }
    if (this.progressText) {
      this.progressText.textContent = '0%';
    }
    
    // Scroll to top
    window.scrollTo(0, 0);

    // Stunning character entrance animation
    if (this.loadingCanvas) {
      gsap.from(this.loadingCanvas, {
        scale: 0,
        rotation: -360,
        opacity: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });
      
      // Continuous bounce during loading
      gsap.to(this.loadingCanvas, {
        y: -30,
        duration: 0.6,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });
      
      // Slight rotation
      gsap.to(this.loadingCanvas, {
        rotation: 10,
        duration: 0.8,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });
      
      // Reinitialize loading character if needed
      if (window.characterController && !window.characterController.loadingCharacter) {
        window.characterController.loadingCharacter = new CanvasCharacter(this.loadingCanvas, 'medium');
        window.characterController.loadingCharacter.setEmotion('excited', true);
      }
    }

    // Start progress animation
    this.animateProgress();
  }

  animateProgress() {
    const duration = 2000; // 2 seconds total
    const startTime = Date.now();

    const updateProgress = () => {
      if (!this.isLoading) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      // Add some randomness for more natural feel
      this.targetProgress = progress + Math.random() * 5;
      if (this.targetProgress > 100) this.targetProgress = 100;

      // Smooth interpolation
      this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;

      // Update UI
      if (this.progressFill) {
        this.progressFill.style.width = `${this.currentProgress}%`;
      }
      if (this.progressText) {
        this.progressText.textContent = `${Math.floor(this.currentProgress)}%`;
      }

      // Continue animation
      if (this.currentProgress < 99) {
        requestAnimationFrame(updateProgress);
      } else {
        this.completeLoading();
      }
    };

    requestAnimationFrame(updateProgress);

    // Add loading tips or fun facts
    this.showLoadingTips();
  }

  showLoadingTips() {
    const tips = [
      '✨ Preparing awesome content...',
      '🚀 Loading projects...',
      '🎨 Polishing animations...',
      '⚡ Almost there...'
    ];

    const loadingTitle = document.querySelector('.loading-title');
    if (!loadingTitle) return;

    let tipIndex = 0;
    const tipInterval = setInterval(() => {
      if (!this.isLoading || tipIndex >= tips.length) {
        clearInterval(tipInterval);
        return;
      }

      loadingTitle.textContent = tips[tipIndex];
      
      gsap.from(loadingTitle, {
        scale: 0.8,
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });

      tipIndex++;
    }, 600);
  }

  completeLoading() {
    console.log('Loading complete');
    this.isLoading = false;

    // Kill all loading animations
    gsap.killTweensOf(this.loadingCanvas);
    
    // Ensure scroll at top
    window.scrollTo(0, 0);

    // Final STUNNING celebration animation
    if (this.loadingCanvas) {
      // Happy character animation
      if (window.characterController && window.characterController.loadingCharacter) {
        window.characterController.loadingCharacter.setEmotion('happy');
      }
      
      // Create particle burst
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          if (window.portfolioApp && window.portfolioApp.createParticleEffect) {
            const canvas = this.loadingCanvas;
            const rect = canvas.getBoundingClientRect();
            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 100;
            const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
            window.portfolioApp.createParticleEffect(x, y, colors[i % colors.length]);
          }
        }, i * 20);
      }
      
      gsap.timeline()
        .to(this.loadingCanvas, {
          scale: 1.4,
          rotation: 720,
          duration: 0.6,
          ease: 'power2.inOut'
        })
        .to(this.loadingCanvas, {
          scale: 0,
          opacity: 0,
          y: -100,
          duration: 0.4,
          ease: 'back.in(2)',
          onComplete: () => {
            if (this.callback) {
              this.callback();
            }
          }
        });
    } else if (this.callback) {
      setTimeout(() => this.callback(), 300);
    }
  }

  reset() {
    this.isLoading = false;
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.callback = null;
  }
}

// Initialize loading controller
const loadingController = new LoadingController();

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.loadingController = loadingController;
}