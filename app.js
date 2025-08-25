// Modern Portfolio JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initSkillBars();
    initCounters();
    initContactForm();
    initParticles();
    initSmoothScroll();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// Typing effect for hero section
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    const phrases = [
        'Software Developer',
        'Mainframe Expert',
        'Java Developer',
        'Problem Solver',
        'Cloud Enthusiast'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Trigger specific animations
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target);
                }
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = [
        '.stat-card',
        '.skill-item',
        '.education-item',
        '.timeline-item',
        '.tech-item',
        '.cert-badge'
    ];

    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    });
}

// Skill bar animations
function initSkillBars() {
    // This will be triggered by the scroll observer
}

function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    if (progressBar && !progressBar.classList.contains('animated')) {
        const targetWidth = progressBar.getAttribute('data-width');
        
        setTimeout(() => {
            progressBar.style.width = targetWidth + '%';
            progressBar.classList.add('animated');
        }, 300);
    }
}

// Counter animations
function initCounters() {
    // This will be triggered by the scroll observer
}

function animateCounter(statCard) {
    const counter = statCard.querySelector('.stat-number');
    if (counter && !counter.classList.contains('animated')) {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        const increment = target / 60; // Animation duration ~1 second
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + (target === 10 ? '+' : '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + (target === 10 ? '+' : '');
            }
        }, 16); // ~60 FPS
        
        counter.classList.add('animated');
    }
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('.form-control');

    // Form validation
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('focus', clearFieldError);
    });

    form.addEventListener('submit', handleFormSubmit);

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove previous error styling
        field.classList.remove('error');
        
        // Validation rules
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.5rem';
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        if (isValid) {
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    form.reset();
                }, 2000);
            }, 1500);
        }
    }
}

// Simple particle system
function initParticles() {
    const particleContainer = document.getElementById('particles-bg');
    const particleCount = window.innerWidth < 768 ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 4 + 2;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255, 255, 255, ${opacity}) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle ${duration}s linear infinite;
        `;
        
        particleContainer.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                createParticle();
            }
        }, duration * 1000);
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add CSS for particles animation
const particleStyles = `
    @keyframes floatParticle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .form-control.error {
        border-color: #ff6b6b;
        background: rgba(255, 107, 107, 0.1);
    }
    
    .nav-link.active {
        background: rgba(255, 255, 255, 0.2);
        color: #4ecdc4;
    }
`;

// Inject particle styles
const styleSheet = document.createElement('style');
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const parallaxSpeed = 0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }
});

// Handle window resize for particles
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recreate particles on resize
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());
        
        setTimeout(() => {
            initParticles();
        }, 100);
    }, 250);
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll-heavy functions
const throttledScroll = throttle(() => {
    // Navbar scroll effect (already handled above)
}, 16); // ~60 FPS

window.addEventListener('scroll', throttledScroll);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Trigger special effect
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        konamiCode = [];
    }
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add keyboard navigation styles
const keyboardStyles = `
    .keyboard-navigation *:focus {
        outline: 2px solid #4ecdc4;
        outline-offset: 2px;
    }
    
    .keyboard-navigation .btn:focus {
        box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.3);
    }
`;

const keyboardStyleSheet = document.createElement('style');
keyboardStyleSheet.textContent = keyboardStyles;
document.head.appendChild(keyboardStyleSheet);
