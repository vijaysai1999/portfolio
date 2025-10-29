// Theme Management System
class ThemeController {
  constructor() {
    this.currentTheme = 'light';
    this.themeToggle = document.getElementById('themeToggle');
    this.html = document.documentElement;
    this.init();
  }

  init() {
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
    }

    // Apply initial theme
    this.applyTheme(this.currentTheme, false);

    // Setup toggle button
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      this.applyTheme(newTheme, true);
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme, true);
  }

  applyTheme(theme, animate = true) {
    this.currentTheme = theme;
    this.html.setAttribute('data-theme', theme);

    if (animate) {
      // Animate theme transition
      this.animateThemeTransition();
    }

    // Update toggle button with animation
    if (this.themeToggle && animate) {
      gsap.to(this.themeToggle, {
        rotation: 360,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  }

  animateThemeTransition() {
    // Create a smooth transition effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${this.currentTheme === 'dark' ? '#0f172a' : '#f8fafc'};
      opacity: 0;
      pointer-events: none;
      z-index: 99999;
    `;
    document.body.appendChild(overlay);

    gsap.timeline()
      .to(overlay, {
        opacity: 0.3,
        duration: 0.15,
        ease: 'power2.in'
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.out',
        onComplete: () => overlay.remove()
      });

    // Animate character if visible
    if (window.characterController && window.characterController.character) {
      gsap.to(window.characterController.character, {
        rotation: 360,
        scale: 1.2,
        duration: 0.5,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.to(window.characterController.character, {
            rotation: 0,
            scale: 1,
            duration: 0.3
          });
        }
      });
    }
  }

  getTheme() {
    return this.currentTheme;
  }
}

// Initialize theme controller
const themeController = new ThemeController();

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.themeController = themeController;
}