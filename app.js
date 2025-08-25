// Global variables
let particles = [];
let mouse = { x: 0, y: 0 };
let animationId;
let isLoaded = false;

// Typing animation data
const typingTexts = [
    'MAINFRAME DEVELOPER', 
    'JAVA DEVELOPER',
    'SPRINGBOOT DEVELOPER',
    'FULL-STACK DEVELOPER'
];
let currentTextIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
let typingSpeed = 100;
let erasingSpeed = 50;
let delayBetweenTexts = 2000;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen initially
    setTimeout(() => {
        initializeApp();
    }, 1500);
});

function initializeApp() {
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
    
    // Initialize all components
    initParticles();
    initCustomCursor();
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initCounterAnimations();
    initFormHandling();
    initInteractiveEffects();
    
    isLoaded = true;
}

// Particle System
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            color: `hsl(${180 + Math.random() * 60}, 100%, 70%)`
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y <= 0 || particle.y >= canvas.height) {
                particle.speedY *= -1;
            }
            
            // Mouse interaction
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= dx * force * 0.01;
                particle.y -= dy * force * 0.01;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Draw connections
            particles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    const dx2 = particle.x - otherParticle.x;
                    const dy2 = particle.y - otherParticle.y;
                    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    
                    if (distance2 < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance2 / 80)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });
        });
        
        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    function updateCursor() {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Smooth follow effect
        followerX += (cursorX - followerX) * 0.1;
        followerY += (cursorY - followerY) * 0.1;
        
        cursorFollower.style.left = (followerX - 15) + 'px';
        cursorFollower.style.top = (followerY - 15) + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .project-card, .skill-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursorFollower.style.transform = 'scale(1.5)';
            cursorFollower.style.borderColor = '#00ffff';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
            cursorFollower.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        });
    });
}

// Navigation
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset to account for fixed navigation
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Navigation background on scroll
    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.15)';
                nav.style.backdropFilter = 'blur(30px)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.1)';
                nav.style.backdropFilter = 'blur(20px)';
            }
        }
        
        // Update active section
        updateActiveSection();
    });
    
    // Hero section buttons
    const exploreBtn = document.getElementById('exploreBtn');
    const contactBtn = document.getElementById('contactBtn');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Update active navigation section
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    
    if (!typingElement) return;
    
    function typeText() {
        const currentText = typingTexts[currentTextIndex];
        
        if (isTyping) {
            if (currentCharIndex < currentText.length) {
                typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                setTimeout(typeText, typingSpeed);
            } else {
                isTyping = false;
                setTimeout(typeText, delayBetweenTexts);
            }
        } else {
            if (currentCharIndex > 0) {
                typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                setTimeout(typeText, erasingSpeed);
            } else {
                isTyping = true;
                currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
                setTimeout(typeText, 500);
            }
        }
    }
    
    // Start typing animation
    setTimeout(typeText, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .section-header,
        .about-image,
        .about-info,
        .timeline-item,
        .skill-category,
        .project-card,
        .contact-item,
        .contact-form
    `);
    
    animatedElements.forEach((el, index) => {
        // Add animation classes based on element type and position
        if (el.classList.contains('about-image') || 
            el.classList.contains('contact-item') ||
            index % 2 === 0) {
            el.classList.add('slide-in-left');
        } else if (el.classList.contains('about-info') || 
                   el.classList.contains('contact-form')) {
            el.classList.add('slide-in-right');
        } else {
            el.classList.add('fade-in');
        }
        
        observer.observe(el);
    });
    
    // Special handling for skill items and project cards
    const skillItems = document.querySelectorAll('.skill-category');
    const projectCards = document.querySelectorAll('.project-card');
    
    skillItems.forEach(el => {
        el.classList.add('scale-in');
        observer.observe(el);
    });
    
    projectCards.forEach(el => {
        el.classList.add('scale-in');
        observer.observe(el);
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            counters.forEach(counter => animateCounter(counter));
        }
    });
    
    if (counters.length > 0) {
        observer.observe(counters[0].parentElement.parentElement);
    }
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (target === 4 ? '+' : target === 15 ? '+' : target === 20 ? '+' : '');
            }
        };
        
        updateCounter();
    }
}

// Form Handling
function initFormHandling() {
    const form = document.getElementById('contactForm');
    const inputs = document.querySelectorAll('.form-input');
    
    if (!form) return;
    
    // Enhanced input interactions
    inputs.forEach(input => {
        input.addEventListener('focus', function(event) {
            this.parentElement.classList.add('focused');
            
            // Add ripple effect
            createRipple(this.parentElement, event);
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('.btn-primary');
        if (!submitBtn) return;
        
        const btnSpan = submitBtn.querySelector('span');
        const originalText = btnSpan ? btnSpan.textContent : 'SEND MESSAGE';
        
        if (btnSpan) {
            btnSpan.textContent = 'SENDING...';
        }
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            inputs.forEach(input => {
                input.parentElement.classList.remove('has-value');
            });
            
            // Reset button
            if (btnSpan) {
                btnSpan.textContent = originalText;
            }
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Interactive Effects
function initInteractiveEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // 3D hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Skill item hover effects
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Create glow effect
            item.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
            item.style.transform = 'scale(1.1) translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.boxShadow = '';
            item.style.transform = 'scale(1) translateY(0)';
        });
    });
    
    // Timeline item interactions
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const marker = item.querySelector('.timeline-marker');
            if (marker) {
                marker.style.transform = 'scale(1.5)';
                marker.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.8)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const marker = item.querySelector('.timeline-marker');
            if (marker) {
                marker.style.transform = 'scale(1)';
                marker.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
            }
        });
    });
}

// Utility Functions
function createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out forwards;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const colors = {
        success: 'rgba(0, 255, 136, 0.1)',
        error: 'rgba(255, 84, 89, 0.1)',
        info: 'rgba(0, 255, 255, 0.1)'
    };
    
    const borderColors = {
        success: 'rgba(0, 255, 136, 0.3)',
        error: 'rgba(255, 84, 89, 0.3)',
        info: 'rgba(0, 255, 255, 0.3)'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        backdrop-filter: blur(20px);
        border: 1px solid ${borderColors[type] || borderColors.info};
        border-radius: 10px;
        padding: 15px 20px;
        color: #ffffff;
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Slide in animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #ffffff;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

document.head.appendChild(style);

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    } else {
        // Resume animations when page becomes visible
        if (isLoaded) {
            const canvas = document.getElementById('particles');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            function resumeAnimation() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach((particle, index) => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    if (particle.x <= 0 || particle.x >= canvas.width) {
                        particle.speedX *= -1;
                    }
                    if (particle.y <= 0 || particle.y >= canvas.height) {
                        particle.speedY *= -1;
                    }
                    
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fillStyle = particle.color;
                    ctx.globalAlpha = particle.opacity;
                    ctx.fill();
                    
                    particles.forEach((otherParticle, otherIndex) => {
                        if (index !== otherIndex) {
                            const dx = particle.x - otherParticle.x;
                            const dy = particle.y - otherParticle.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < 80) {
                                ctx.beginPath();
                                ctx.moveTo(particle.x, particle.y);
                                ctx.lineTo(otherParticle.x, otherParticle.y);
                                ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 80)})`;
                                ctx.lineWidth = 1;
                                ctx.stroke();
                            }
                        }
                    });
                });
                
                ctx.globalAlpha = 1;
                animationId = requestAnimationFrame(resumeAnimation);
            }
            
            resumeAnimation();
        }
    }
});

// Performance optimization: Reduce particle count on mobile
if (window.innerWidth < 768) {
    // This will be handled when particles array is created
    window.addEventListener('load', () => {
        if (particles.length > 50) {
            particles = particles.slice(0, 50); // Reduce particles on mobile
        }
    });
}
