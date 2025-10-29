// Loading Animation Controller
class LoadingController {
  constructor() {
    this.progressFill = document.getElementById('progressFill');
    this.progressText = document.getElementById('progressText');
    this.loadingCharacter = document.querySelector('.loading-character-img');
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.isLoading = false;
    this.callback = null;
  }

  startLoading(callback) {
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

    // Animate character entrance
    if (this.loadingCharacter) {
      gsap.from(this.loadingCharacter, {
        scale: 0,
        rotation: -360,
        opacity: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });
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
      'Preparing awesome content...',
      'Loading projects...',
      'Polishing animations...',
      'Almost there...'
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
        y: 10,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      });

      tipIndex++;
    }, 700);
  }

  completeLoading() {
    this.isLoading = false;

    // Final celebration animation
    if (this.loadingCharacter) {
      gsap.timeline()
        .to(this.loadingCharacter, {
          scale: 1.3,
          rotation: 360,
          duration: 0.5,
          ease: 'power2.inOut'
        })
        .to(this.loadingCharacter, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'back.in(1.7)',
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