// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
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
};

// Global variables
let mouseX = 0;
let mouseY = 0;
let particles = [];
let animationFrameId;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    initCursor();
    initParticleSystem();
    initNavigation();
    initTypingEffect();
    initGlitchEffects();
    initScrollAnimations();
    initHeroStats();
    initContactForm();
    initInteractiveEffects();
    initSoundSystem();
    
    // Add loading completion effect
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Custom Cursor System
function initCursor() {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Smooth dot movement
        dotX += (cursorX - dotX) * 0.8;
        dotY += (cursorY - dotY) * 0.8;
        
        // Smooth ring movement (slower)
        ringX += (cursorX - ringX) * 0.15;
        ringY += (cursorY - ringY) * 0.15;
        
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .tech-hex, .achievement-card, .social-link');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorRing.style.borderColor = '#39FF14';
            cursorDot.style.backgroundColor = '#39FF14';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.borderColor = '#00FFFF';
            cursorDot.style.backgroundColor = '#00FFFF';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Advanced Particle System
function initParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.fadeDelay = Math.random() * 600 + 100;
            this.fadeStart = Date.now() + this.fadeDelay;
            this.fadingIn = true;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.z = Math.random() * 1000 + 1;
            this.speed = Math.random() * 2 + 0.5;
            this.opacity = 0;
            this.size = Math.random() * 3 + 1;
            this.color = this.getRandomColor();
            this.angle = Math.random() * Math.PI * 2;
            this.drift = Math.random() * 0.02 - 0.01;
            this.pulse = Math.random() * 0.02 + 0.01;
            this.life = 0;
            this.maxLife = Math.random() * 300 + 200;
        }
        
        getRandomColor() {
            const colors = ['#00FFFF', '#39FF14', '#FF0080', '#8A2BE2', '#FF6600', '#FFFF00'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.life++;
            this.angle += this.drift;
            this.y += this.speed;
            this.x += Math.sin(this.angle) * 0.5;
            
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
                this.opacity = Math.min(1, this.opacity + force * 0.02);
            }
            
            // Fading effect
            if (this.fadingIn && Date.now() > this.fadeStart) {
                this.opacity = Math.min(1, this.opacity + 0.01);
                if (this.opacity >= 1) this.fadingIn = false;
            }
            
            // Pulse effect
            this.size += Math.sin(this.life * this.pulse) * 0.1;
            
            // Reset when particle goes off screen or dies
            if (this.y > canvas.height + 10 || this.life > this.maxLife) {
                this.reset();
                this.fadeStart = Date.now() + this.fadeDelay;
                this.fadingIn = true;
            }
        }
        
        draw() {
            if (this.opacity <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Create glow effect
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.4, this.color + '80');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Core particle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Create particles
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Navigation System
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    }, 16));
    
    // Mobile menu toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = mobileMenu.querySelectorAll('.neon-bar');
            if (mobileMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth scroll and mobile menu close
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                const bars = mobileMenu.querySelectorAll('.neon-bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    }
}

// Advanced Typing Effect
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const phrases = [
        { text: 'CYBERPUNK_DEVELOPER.EXE', color: '#00FFFF' },
        { text: 'MAINFRAME_SPECIALIST.SYS', color: '#39FF14' },
        { text: 'JAVA_ARCHITECT.CLASS', color: '#FF0080' },
        { text: 'CLOUD_ENGINEER.AWS', color: '#FF6600' },
        { text: 'SYSTEM_MODERNIZER.COBOL', color: '#8A2BE2' },
        { text: 'DIGITAL_INNOVATOR.JS', color: '#FFFF00' }
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let isGlitching = false;
    
    function createGlitchEffect() {
        if (isGlitching) return;
        isGlitching = true;
        
        const originalText = typingElement.textContent;
        const glitchChars = '!@#$%^&*(){}[]|\\:";\'<>?,./`~';
        
        let glitchCount = 0;
        const glitchInterval = setInterval(() => {
            if (glitchCount < 3) {
                let glitchedText = '';
                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() < 0.1) {
                        glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        glitchedText += originalText[i];
                    }
                }
                typingElement.textContent = glitchedText;
                glitchCount++;
            } else {
                typingElement.textContent = originalText;
                clearInterval(glitchInterval);
                isGlitching = false;
            }
        }, 50);
    }
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.text.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.text.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = Math.random() * 100 + 50; // Variable typing speed
        }
        
        // Update color
        typingElement.style.color = currentPhrase.color;
        typingElement.style.textShadow = `0 0 10px ${currentPhrase.color}`;
        
        if (!isDeleting && charIndex === currentPhrase.text.length) {
            typingSpeed = 2000;
            isDeleting = true;
            
            // Random glitch effect
            if (Math.random() < 0.3) {
                createGlitchEffect();
            }
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    typeEffect();
}

// Glitch Effects System
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(el => {
        // Random glitch activation
        setInterval(() => {
            if (Math.random() < 0.1) {
                triggerGlitch(el);
            }
        }, 3000);
        
        // Glitch on hover
        el.addEventListener('mouseenter', () => {
            if (Math.random() < 0.5) {
                triggerGlitch(el);
            }
        });
    });
    
    function triggerGlitch(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'glitchText 0.3s ease-in-out';
    }
}

// Advanced Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('animated');
                
                // Trigger specific animations based on element type
                if (element.classList.contains('skill-bar-item')) {
                    setTimeout(() => animateSkillBar(element), 300);
                }
                
                if (element.classList.contains('achievement-card')) {
                    setTimeout(() => animateAchievementCard(element), 200);
                }
                
                if (element.classList.contains('tech-hex')) {
                    setTimeout(() => animateTechHex(element), Math.random() * 500);
                }
                
                if (element.classList.contains('timeline-item')) {
                    setTimeout(() => animateTimelineItem(element), 400);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = [
        '.skill-bar-item',
        '.achievement-card',
        '.tech-hex',
        '.timeline-item',
        '.contact-item',
        '.terminal-window'
    ];
    
    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    });
    
    function animateSkillBar(element) {
        const skillBar = element.querySelector('.skill-bar-fill');
        if (skillBar && !skillBar.classList.contains('animated')) {
            const targetWidth = skillBar.getAttribute('data-width');
            
            setTimeout(() => {
                skillBar.style.width = targetWidth + '%';
                skillBar.classList.add('animated');
                
                // Add completion pulse effect
                setTimeout(() => {
                    skillBar.style.boxShadow = '0 0 20px currentColor';
                    setTimeout(() => {
                        skillBar.style.boxShadow = '';
                    }, 500);
                }, 1500);
            }, 200);
        }
    }
    
    function animateAchievementCard(element) {
        element.style.transform = 'translateY(0) scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'translateY(0) scale(1)';
        }, 300);
    }
    
    function animateTechHex(element) {
        const hexShape = element.querySelector('.hex-shape');
        hexShape.style.transform = 'rotateY(360deg) scale(1.2)';
        setTimeout(() => {
            hexShape.style.transform = 'rotateY(0deg) scale(1)';
        }, 600);
    }
    
    function animateTimelineItem(element) {
        const card = element.querySelector('.timeline-card');
        card.style.transform = 'translateX(20px) rotateY(10deg)';
        setTimeout(() => {
            card.style.transform = 'translateX(0) rotateY(0deg)';
        }, 400);
    }
}

// Hero Stats Animation
function initHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateStats = () => {
        if (animated) return;
        animated = true;
        
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const increment = target / 60;
            const colors = ['#39FF14', '#FF0080', '#FF6600'];
            
            stat.style.color = colors[index % colors.length];
            stat.style.textShadow = `0 0 10px ${colors[index % colors.length]}`;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + (target === 10 ? '+' : '');
                    clearInterval(timer);
                    
                    // Final glow effect
                    stat.style.textShadow = `0 0 20px ${colors[index % colors.length]}, 0 0 30px ${colors[index % colors.length]}`;
                    setTimeout(() => {
                        stat.style.textShadow = `0 0 10px ${colors[index % colors.length]}`;
                    }, 500);
                } else {
                    stat.textContent = Math.floor(current) + (target === 10 ? '+' : '');
                }
            }, 16);
        });
    };
    
    // Trigger animation when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStats, 1000);
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// Contact Form with Advanced Validation
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('.neon-input');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('focus', () => clearFieldError(input));
        
        // Typing effect for inputs
        input.addEventListener('input', (e) => {
            const inputGlow = input.parentNode.querySelector('.input-glow');
            if (inputGlow) {
                inputGlow.style.opacity = e.target.value ? '0.2' : '0';
            }
        });
    });
    
    form.addEventListener('submit', handleFormSubmit);
    
    function validateField(field) {
        const value = field.value.trim();
        clearFieldError(field);
        
        // Validation rules
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'FIELD_REQUIRED.ERROR');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'INVALID_EMAIL.ERROR');
                return false;
            }
        }
        
        if (field.name === 'name' && value.length < 2) {
            showFieldError(field, 'NAME_TOO_SHORT.ERROR');
            return false;
        }
        
        if (field.name === 'message' && value.length < 10) {
            showFieldError(field, 'MESSAGE_TOO_SHORT.ERROR');
            return false;
        }
        
        showFieldSuccess(field);
        return true;
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = '#FF073A';
        field.style.boxShadow = '0 0 10px #FF073A';
        
        const errorDiv = createMessageDiv(message, 'error');
        field.parentNode.appendChild(errorDiv);
    }
    
    function showFieldSuccess(field) {
        field.style.borderColor = '#39FF14';
        field.style.boxShadow = '0 0 10px #39FF14';
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '#00FFFF';
        field.style.boxShadow = '';
        
        const existingMessage = field.parentNode.querySelector('.field-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    function createMessageDiv(message, type) {
        const div = document.createElement('div');
        div.className = `field-message ${type}`;
        div.textContent = message;
        div.style.cssText = `
            color: ${type === 'error' ? '#FF073A' : '#39FF14'};
            font-size: 0.8rem;
            font-family: 'Courier New', monospace;
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: rgba(${type === 'error' ? '255, 7, 58' : '57, 255, 20'}, 0.1);
            border: 1px solid ${type === 'error' ? '#FF073A' : '#39FF14'};
            border-radius: 4px;
            animation: messageSlide 0.3s ease-out forwards;
        `;
        return div;
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = {};
        
        inputs.forEach(input => {
            const fieldValid = validateField(input);
            if (!fieldValid) {
                isValid = false;
            } else {
                formData[input.name] = input.value.trim();
            }
        });
        
        if (isValid) {
            simulateFormSubmission(formData);
        } else {
            // Focus first error field
            const firstError = form.querySelector('[style*="FF073A"]');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
    
    function simulateFormSubmission(data) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        // Loading state
        submitBtn.innerHTML = '<span>TRANSMITTING...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Simulate network delay
        setTimeout(() => {
            // Success state
            submitBtn.innerHTML = '<span>TRANSMISSION_COMPLETE</span><i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(45deg, #39FF14, #00FFFF)';
            submitBtn.style.borderColor = '#39FF14';
            submitBtn.style.color = '#0A0A0A';
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.innerHTML = `
                <div style="
                    background: rgba(57, 255, 20, 0.1);
                    border: 2px solid #39FF14;
                    border-radius: 10px;
                    padding: 1.5rem;
                    margin-top: 1rem;
                    text-align: center;
                    color: #39FF14;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
                    animation: successPulse 0.5s ease-out;
                ">
                    <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <h4 style="margin-bottom: 0.5rem; font-family: 'Orbitron', monospace;">MESSAGE_TRANSMITTED</h4>
                    <p>Thank you ${data.name}! Your message has been received. Initiating response protocol...</p>
                </div>
            `;
            
            form.appendChild(successDiv);
            
            // Reset form after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '#00FFFF';
                submitBtn.style.color = '#00FFFF';
                form.reset();
                
                // Clear input glows
                inputs.forEach(input => {
                    input.style.borderColor = '#00FFFF';
                    input.style.boxShadow = '';
                    const inputGlow = input.parentNode.querySelector('.input-glow');
                    if (inputGlow) inputGlow.style.opacity = '0';
                });
                
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 4000);
            
        }, 2000);
    }
}

// Interactive Effects
function initInteractiveEffects() {
    // Skill radar interaction
    const skillRadar = document.querySelector('.skill-radar');
    if (skillRadar) {
        skillRadar.addEventListener('mouseenter', () => {
            const sweep = skillRadar.querySelector('.radar-sweep');
            if (sweep) {
                sweep.style.animationDuration = '1s';
            }
        });
        
        skillRadar.addEventListener('mouseleave', () => {
            const sweep = skillRadar.querySelector('.radar-sweep');
            if (sweep) {
                sweep.style.animationDuration = '4s';
            }
        });
    }
    
    // Tech hexagon interactions
    const techHexes = document.querySelectorAll('.tech-hex');
    techHexes.forEach((hex, index) => {
        hex.addEventListener('mouseenter', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(0, 255, 255, 0.5) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: hexRipple 0.8s ease-out forwards;
            `;
            
            hex.style.position = 'relative';
            hex.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) ripple.remove();
            }, 800);
        });
        
        hex.addEventListener('click', () => {
            // Show tech info popup (simulated)
            console.log(`Tech selected: ${hex.getAttribute('data-tech')}`);
        });
    });
    
    // Achievement card hover effects
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Particle burst effect
            createParticleBurst(card);
        });
    });
    
    // Profile image interaction
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        let hueRotation = 0;
        
        profileImg.addEventListener('mouseenter', () => {
            const interval = setInterval(() => {
                hueRotation += 10;
                profileImg.style.filter = `brightness(1.3) contrast(1.4) hue-rotate(${hueRotation}deg)`;
                
                if (hueRotation >= 360) {
                    clearInterval(interval);
                    profileImg.style.filter = 'brightness(1.1) contrast(1.2)';
                    hueRotation = 0;
                }
            }, 50);
        });
    }
}

// Utility Functions
function createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 4px;
            height: 4px;
            background: #00FFFF;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 10px #00FFFF;
            animation: burstParticle 0.8s ease-out forwards;
        `;
        
        particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.remove();
        }, 800);
    }
}

// Sound System (Visual feedback for interactions)
function initSoundSystem() {
    // Visual sound bars (decorative)
    const createSoundBars = () => {
        const soundBars = document.createElement('div');
        soundBars.className = 'sound-bars';
        soundBars.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 2px;
            z-index: 1001;
            opacity: 0.3;
        `;
        
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 3px;
                height: 20px;
                background: #00FFFF;
                border-radius: 2px;
                animation: soundBar ${0.5 + i * 0.1}s ease-in-out infinite alternate;
                box-shadow: 0 0 5px #00FFFF;
            `;
            soundBars.appendChild(bar);
        }
        
        document.body.appendChild(soundBars);
    };
    
    createSoundBars();
}

// Add dynamic CSS animations
const dynamicStyles = `
    @keyframes messageSlide {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes successPulse {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes hexRipple {
        from { width: 0; height: 0; opacity: 1; }
        to { width: 200px; height: 200px; opacity: 0; }
    }
    
    @keyframes burstParticle {
        from { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
        }
        to { 
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0); 
            opacity: 0; 
        }
    }
    
    @keyframes soundBar {
        from { height: 5px; }
        to { height: 25px; }
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Performance monitoring
const performanceMonitor = () => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkPerformance = (currentTime) => {
        frameCount++;
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Adjust particle count based on performance
            if (fps < 30 && particles.length > 20) {
                particles.length = Math.max(20, particles.length - 5);
            } else if (fps > 50 && particles.length < 50) {
                particles.push(new Particle());
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkPerformance);
    };
    
    requestAnimationFrame(checkPerformance);
};

// Initialize performance monitoring
performanceMonitor();

// Window resize handler
window.addEventListener('resize', debounce(() => {
    // Update particle system
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Update cursor system for mobile
    const cursor = document.getElementById('custom-cursor');
    if (window.innerWidth <= 768 && cursor) {
        cursor.style.display = 'none';
    } else if (cursor) {
        cursor.style.display = 'block';
    }
}, 250));

// Keyboard shortcuts (Easter eggs)
document.addEventListener('keydown', (e) => {
    // Konami code: ↑↑↓↓←→←→BA
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    if (!window.konamiProgress) window.konamiProgress = [];
    
    window.konamiProgress.push(e.code);
    
    if (window.konamiProgress.length > konamiSequence.length) {
        window.konamiProgress.shift();
    }
    
    if (window.konamiProgress.join(',') === konamiSequence.join(',')) {
        // Activate matrix mode
        document.body.style.filter = 'hue-rotate(120deg) saturate(2)';
        particles.forEach(particle => {
            particle.color = '#39FF14';
        });
        
        setTimeout(() => {
            document.body.style.filter = '';
            particles.forEach(particle => {
                particle.color = particle.getRandomColor();
            });
        }, 5000);
        
        window.konamiProgress = [];
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
