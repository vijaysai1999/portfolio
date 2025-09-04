// Enhanced Global Variables
let particles = [];
let colorfulParticles = [];
let mouse = { x: 0, y: 0 };
let animationId;
let isLoaded = false;
let currentTheme = 'dark';

// Enhanced Typing Animation Data
const typingTexts = [
    'MAINFRAME DEVELOPER', 
    'JAVA DEVELOPER',
    'SPRINGBOOT DEVELOPER',
    'FULL-STACK DEVELOPER'
];
let currentTextIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
let typingSpeed = 80;
let erasingSpeed = 40;
let delayBetweenTexts = 1500;

// Color palettes for different themes
const colorPalettes = {
    dark: [
        '#0066ff', '#00ffff', '#8b5cf6', '#ec4899', 
        '#10b981', '#f59e0b', '#ef4444', '#06ffa5'
    ],
    light: [
        '#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899',
        '#10b981', '#f59e0b', '#ef4444', '#14b8a6'
    ]
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Show loading screen initially
    setTimeout(() => {
        initializeApp();
    }, 2000);
});

function initializeTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    const toggleThumb = themeToggle?.querySelector('.toggle-thumb');
    
    if (currentTheme === 'light') {
        toggleThumb?.classList.add('light');
    } else {
        toggleThumb?.classList.add('dark');
    }
}

function initializeApp() {
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
    
    // Initialize all components
    initThemeToggle();
    initEnhancedParticles();
    initAdvancedCursor();
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initCounterAnimations();
    initFormHandling();
    initInteractiveEffects();
    initProfileImageEffects();
    initSkillHexagons();
    initProjectCards();
    initTimelineAnimations();
    initFloatingShapes();
    
    isLoaded = true;
}

// Enhanced Theme Toggle
// Enhanced Theme Toggle (iOS style)
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const toggleTrack = themeToggle?.querySelector('.toggle-track');
    const toggleThumb = themeToggle?.querySelector('.toggle-thumb');
    
    if (!themeToggle || !toggleThumb || !toggleTrack) return;
    
    // Initialize state
    if (currentTheme === 'dark') {
        toggleThumb.classList.add('active');
        toggleTrack.classList.add('active');
    }
    
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Apply theme
        document.documentElement.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Update toggle classes
        toggleThumb.classList.toggle('active', currentTheme === 'dark');
        toggleTrack.classList.toggle('active', currentTheme === 'dark');

        // Save theme
        localStorage.setItem('portfolio-theme', currentTheme);

        // Update particles
        updateParticleColors();

        // Reset transition
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 600);

        // Ripple effect
        createToggleRipple(themeToggle);
    });
}


function createToggleRipple(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${rect.width / 2 - size / 2}px;
        top: ${rect.height / 2 - size / 2}px;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: toggleRipple 0.8s ease-out forwards;
        z-index: 0;
    `;
    
    // ✅ Apply relative position to the track, NOT the fixed container
    const track = element.querySelector('.toggle-track');
    if (track) {
        track.style.position = 'relative';
        track.appendChild(ripple);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Enhanced Particle System
function initEnhancedParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create enhanced particles
    const particleCount = window.innerWidth < 768 ? 60 : 120;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.6 + 0.2,
            color: colorPalettes[currentTheme][Math.floor(Math.random() * colorPalettes[currentTheme].length)],
            trail: [],
            maxTrail: 5
        });
    }
    
    // Create special colorful particles
    for (let i = 0; i < 20; i++) {
        colorfulParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            hue: Math.random() * 360,
            saturation: 70 + Math.random() * 30,
            lightness: 50 + Math.random() * 30,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            pulse: 0
        });
    }
    
    function animateEnhancedParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Regular particles
        particles.forEach((particle, index) => {
            // Update trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > particle.maxTrail) {
                particle.trail.shift();
            }
            
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
            
            // Mouse interaction with magnetic effect
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                const angle = Math.atan2(dy, dx);
                particle.x += Math.cos(angle) * force * 2;
                particle.y += Math.sin(angle) * force * 2;
                particle.opacity = Math.min(1, particle.opacity + 0.3);
            } else {
                particle.opacity = Math.max(0.2, particle.opacity - 0.01);
            }
            
            // Draw trail
            particle.trail.forEach((trailPoint, trailIndex) => {
                const trailOpacity = (trailIndex / particle.trail.length) * particle.opacity * 0.5;
                ctx.beginPath();
                ctx.arc(trailPoint.x, trailPoint.y, particle.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace('rgb', 'rgba').replace(')', `, ${trailOpacity})`);
                ctx.fill();
            });
            
            // Draw main particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Draw connections with rainbow effect
            particles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    const dx2 = particle.x - otherParticle.x;
                    const dy2 = particle.y - otherParticle.y;
                    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    
                    if (distance2 < 100) {
                        const connectionOpacity = (1 - distance2 / 100) * 0.4;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        
                        // Create gradient for connection line
                        const lineGradient = ctx.createLinearGradient(
                            particle.x, particle.y,
                            otherParticle.x, otherParticle.y
                        );
                        lineGradient.addColorStop(0, particle.color.replace(')', `, ${connectionOpacity})`).replace('rgb', 'rgba'));
                        lineGradient.addColorStop(1, otherParticle.color.replace(')', `, ${connectionOpacity})`).replace('rgb', 'rgba'));
                        
                        ctx.strokeStyle = lineGradient;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });
        });
        
        // Colorful special particles
        colorfulParticles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.pulse += particle.pulseSpeed;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y <= 0 || particle.y >= canvas.height) {
                particle.speedY *= -1;
            }
            
            // Update color
            particle.hue += 0.5;
            if (particle.hue > 360) particle.hue = 0;
            
            const pulsedSize = particle.size + Math.sin(particle.pulse) * 2;
            const pulsedOpacity = 0.3 + Math.sin(particle.pulse) * 0.3;
            
            // Draw glowing particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, pulsedSize, 0, Math.PI * 2);
            
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, pulsedSize
            );
            
            const color = `hsl(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%)`;
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.7, color.replace(')', ', 0.5)').replace('hsl', 'hsla'));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.globalAlpha = pulsedOpacity;
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(animateEnhancedParticles);
    }
    
    animateEnhancedParticles();
}

function updateParticleColors() {
    particles.forEach(particle => {
        particle.color = colorPalettes[currentTheme][Math.floor(Math.random() * colorPalettes[currentTheme].length)];
    });
}

// Advanced Custom Cursor
function initAdvancedCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let isHovering = false;
    
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    function updateAdvancedCursor() {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Smooth follow effect with easing
        followerX += (cursorX - followerX) * 0.12;
        followerY += (cursorY - followerY) * 0.12;
        
        cursorFollower.style.left = (followerX - 20) + 'px';
        cursorFollower.style.top = (followerY - 20) + 'px';
        
        requestAnimationFrame(updateAdvancedCursor);
    }
    
    updateAdvancedCursor();
    
    // Enhanced cursor interactions
    const interactiveElements = document.querySelectorAll(`
        a, button, .nav-link, .project-card, .skill-item, 
        .hexagon, .timeline-item, .contact-item, .social-icon,
        .badge, .form-input, .theme-toggle
    `);
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
            isHovering = true;
            
            // Add magnetic effect
            el.style.transform = 'translateZ(10px)';
            
            // Color based on element type
            if (el.classList.contains('btn-primary')) {
                cursor.style.background = 'linear-gradient(45deg, #ec4899, #8b5cf6)';
            } else if (el.classList.contains('hexagon')) {
                cursor.style.background = 'linear-gradient(45deg, #10b981, #06b6d4)';
            } else if (el.classList.contains('project-card')) {
                cursor.style.background = 'linear-gradient(45deg, #f59e0b, #ef4444)';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
            isHovering = false;
            
            // Reset transform
            el.style.transform = '';
            
            // Reset cursor color
            cursor.style.background = '';
        });
        
        el.addEventListener('mousemove', (e) => {
            if (isHovering) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Subtle magnetic follow effect
                el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateZ(10px)`;
            }
        });
    });
}

// Enhanced Navigation
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle with animation
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navToggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
    }
    
    // Enhanced smooth scrolling and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                // Add click ripple effect
                createLinkRipple(link, e);
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link with animation
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                if (navMenu) {
                    navMenu.classList.remove('active');
                    navToggle?.classList.remove('active');
                }
            }
        });
    });
    
    // Enhanced navigation background on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (nav) {
            if (scrolled > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.15)';
                nav.style.backdropFilter = 'blur(30px)';
                nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.1)';
                nav.style.backdropFilter = 'blur(20px)';
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            }
        }
        
        updateActiveSection();
    });
    
    // Hero section buttons
    const exploreBtn = document.getElementById('exploreBtn');
    const contactBtn = document.getElementById('contactBtn');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('about');
            addButtonParticles(exploreBtn);
        });
    }
    
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('contact');
            addButtonShimmer(contactBtn);
        });
    }
}

function createLinkRipple(element, event) {
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
        background: radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: linkRipple 0.6s ease-out forwards;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const nav = document.getElementById('mainNav');
    
    if (section) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function addButtonParticles(button) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #00ffff, transparent);
            border-radius: 50%;
            pointer-events: none;
            left: 50%;
            top: 50%;
            animation: buttonParticle 1s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        button.style.position = 'relative';
        button.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

function addButtonShimmer(button) {
    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        border-radius: inherit;
        animation: shimmer 1s ease-out forwards;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.appendChild(shimmer);
    
    setTimeout(() => {
        shimmer.remove();
    }, 1000);
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

// Enhanced Typing Animation
function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    
    if (!typingElement) return;
    
    function typeEnhancedText() {
        const currentText = typingTexts[currentTextIndex];
        
        if (isTyping) {
            if (currentCharIndex < currentText.length) {
                typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                
                // Add random color flicker effect
                if (Math.random() > 0.8) {
                    typingElement.style.textShadow = `0 0 20px ${colorPalettes[currentTheme][Math.floor(Math.random() * colorPalettes[currentTheme].length)]}`;
                    setTimeout(() => {
                        typingElement.style.textShadow = '';
                    }, 100);
                }
                
                setTimeout(typeEnhancedText, typingSpeed + Math.random() * 50);
            } else {
                isTyping = false;
                setTimeout(typeEnhancedText, delayBetweenTexts);
            }
        } else {
            if (currentCharIndex > 0) {
                typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                setTimeout(typeEnhancedText, erasingSpeed);
            } else {
                isTyping = true;
                currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
                setTimeout(typeEnhancedText, 500);
            }
        }
    }
    
    setTimeout(typeEnhancedText, 1000);
}

// Enhanced Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger animation for child elements
                const children = entry.target.querySelectorAll('.skill-item, .timeline-responsibilities li, .project-tag');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animation = `fadeInUp 0.6s ease forwards`;
                        child.style.animationDelay = `${index * 0.1}s`;
                    }, index * 50);
                });
            }
        });
    }, observerOptions);
    
    // Enhanced element selection for animations
    const animatedElements = document.querySelectorAll(`
        .section-header, .about-image, .about-info, .timeline-item,
        .skill-category, .hexagon, .project-card, .contact-item,
        .contact-form, .certification-badges, .hero-stats
    `);
    
    animatedElements.forEach((el, index) => {
        // Add animation classes based on element type and position
        if (el.classList.contains('about-image') || 
            el.classList.contains('contact-item') ||
            el.classList.contains('hexagon')) {
            el.classList.add('slide-in-left');
        } else if (el.classList.contains('about-info') || 
                   el.classList.contains('contact-form')) {
            el.classList.add('slide-in-right');
        } else if (el.classList.contains('hero-stats')) {
            el.classList.add('fade-in');
            // Delay for hero stats
            setTimeout(() => observer.observe(el), 2000);
            return;
        } else {
            el.classList.add('scale-in');
        }
        
        observer.observe(el);
    });
}

// Enhanced Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            counters.forEach((counter, index) => {
                setTimeout(() => {
                    animateEnhancedCounter(counter);
                }, index * 200);
            });
        }
    });
    
    if (counters.length > 0) {
        observer.observe(counters[0].parentElement.parentElement.parentElement);
    }
    
    function animateEnhancedCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 60;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                
                // Add pulsing effect
                counter.parentElement.style.transform = `scale(${1 + Math.sin(current / target * Math.PI) * 0.1})`;
                
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
                counter.parentElement.style.transform = 'scale(1)';
                
                // Add completion sparkle effect
                addSparkleEffect(counter.parentElement);
            }
        };
        
        updateCounter();
    }
}

function addSparkleEffect(element) {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #00ffff, transparent);
            border-radius: 50%;
            pointer-events: none;
            left: 50%;
            top: 50%;
            animation: sparkle 1s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        element.style.position = 'relative';
        element.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// Profile Image 3D Effects
function initProfileImageEffects() {
    const imageContainer = document.querySelector('.image-container');
    const profileImage = document.querySelector('.profile-image');
    
    if (!imageContainer || !profileImage) return;
    
    imageContainer.addEventListener('mousemove', (e) => {
        const rect = imageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        imageContainer.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(20px)
            scale(1.05)
        `;
        
        // Add holographic effect
        const hologramEffect = imageContainer.querySelector('.hologram-effect');
        if (hologramEffect) {
            hologramEffect.style.opacity = '0.6';
            hologramEffect.style.background = `
                linear-gradient(${rotateY + 90}deg, 
                transparent, 
                rgba(0, 255, 255, 0.4), 
                rgba(255, 0, 255, 0.3),
                transparent)
            `;
        }
    });
    
    imageContainer.addEventListener('mouseleave', () => {
        imageContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
        
        const hologramEffect = imageContainer.querySelector('.hologram-effect');
        if (hologramEffect) {
            hologramEffect.style.opacity = '';
            hologramEffect.style.background = '';
        }
    });
    
    // Add error handling for profile image
    profileImage.addEventListener('error', () => {
        // Create fallback avatar
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0066ff, #00ffff);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', monospace;
            font-size: 4rem;
            font-weight: 900;
            color: white;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            border-radius: 18px;
        `;
        fallback.textContent = 'VSK';
        
        profileImage.style.display = 'none';
        imageContainer.appendChild(fallback);
    });
}

// Enhanced Skill Hexagons
function initSkillHexagons() {
    const hexagons = document.querySelectorAll('.hexagon');
    
    hexagons.forEach((hexagon, index) => {
        const skillLevel = hexagon.getAttribute('data-level');
        const skillName = hexagon.getAttribute('data-skill');
        
        hexagon.addEventListener('mouseenter', () => {
            // Add pulsing animation
            hexagon.style.animation = 'hexagonPulse 0.6s ease-in-out';
            
            // Change color based on skill level
            const level = parseInt(skillLevel);
            let color;
            if (level >= 90) color = '#10b981'; // green
            else if (level >= 80) color = '#0066ff'; // blue
            else if (level >= 70) color = '#f59e0b'; // orange
            else color = '#ef4444'; // red
            
            const hexInner = hexagon.querySelector('.hex-inner');
            if (hexInner) {
                hexInner.style.borderColor = color;
                hexInner.style.boxShadow = `0 0 30px ${color}`;
            }
            
            // Add floating skill percentage
            showSkillTooltip(hexagon, skillName, skillLevel);
        });
        
        hexagon.addEventListener('mouseleave', () => {
            hexagon.style.animation = '';
            const hexInner = hexagon.querySelector('.hex-inner');
            if (hexInner) {
                hexInner.style.borderColor = '';
                hexInner.style.boxShadow = '';
            }
            hideSkillTooltip();
        });
        
        // Stagger entrance animation
        setTimeout(() => {
            hexagon.style.animation = 'hexagonEntrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        }, index * 100);
    });
}

function showSkillTooltip(element, skill, level) {
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <strong>${skill}</strong>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${level}%"></div>
            </div>
            <span>${level}% Proficiency</span>
        </div>
    `;
    
    tooltip.style.cssText = `
        position: absolute;
        bottom: 120%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        color: white;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #00ffff;
        box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
        z-index: 1000;
        opacity: 0;
        animation: tooltipFadeIn 0.3s ease forwards;
        min-width: 200px;
        text-align: center;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
}

function hideSkillTooltip() {
    const tooltips = document.querySelectorAll('.skill-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.animation = 'tooltipFadeOut 0.3s ease forwards';
        setTimeout(() => tooltip.remove(), 300);
    });
}

// Enhanced Project Cards
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(30px)
                scale(1.05)
            `;
            
            // Add dynamic lighting effect
            const lightX = (x / rect.width) * 100;
            const lightY = (y / rect.height) * 100;
            
            card.style.background = `
                radial-gradient(circle at ${lightX}% ${lightY}%, 
                rgba(255, 255, 255, 0.1) 0%, 
                transparent 50%), 
                rgba(255, 255, 255, 0.05)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            card.style.background = '';
        });
        
        // Enhanced view project button
        const viewBtn = card.querySelector('.view-project');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                addProjectClickEffect(card);
                
                // Simulate project viewing
                setTimeout(() => {
                    showNotification('Project details would open here in a real implementation', 'info');
                }, 300);
            });
        }
    });
}

function addProjectClickEffect(card) {
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: projectRipple 0.8s ease-out forwards;
        pointer-events: none;
        z-index: 10;
    `;
    
    card.style.position = 'relative';
    card.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate timeline item entrance
                    setTimeout(() => {
                        item.style.animation = 'timelineSlideIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                        
                        // Animate skill tags
                        const skillTags = item.querySelectorAll('.skill-tag');
                        skillTags.forEach((tag, tagIndex) => {
                            setTimeout(() => {
                                tag.style.animation = 'tagBounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                            }, 500 + (tagIndex * 100));
                        });
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(item);
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', () => {
            const marker = item.querySelector('.timeline-marker');
            const pulse = item.querySelector('.timeline-pulse');
            
            if (marker) {
                marker.style.transform = 'scale(1.3)';
                marker.style.filter = 'brightness(1.5)';
            }
            
            if (pulse) {
                pulse.style.animationDuration = '1s';
                pulse.style.borderColor = '#00ffff';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const marker = item.querySelector('.timeline-marker');
            const pulse = item.querySelector('.timeline-pulse');
            
            if (marker) {
                marker.style.transform = 'scale(1)';
                marker.style.filter = '';
            }
            
            if (pulse) {
                pulse.style.animationDuration = '2s';
                pulse.style.borderColor = '';
            }
        });
    });
}

// Floating Shapes Animation
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach(shape => {
        // Add random delay and duration
        const delay = Math.random() * 5;
        const duration = 15 + Math.random() * 10;
        
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;
        
        // Add mouse interaction
        shape.addEventListener('mouseenter', () => {
            shape.style.opacity = '0.3';
            shape.style.transform = 'scale(1.2)';
        });
        
        shape.addEventListener('mouseleave', () => {
            shape.style.opacity = '';
            shape.style.transform = '';
        });
    });
}

// Enhanced Form Handling
function initFormHandling() {
    const form = document.getElementById('contactForm');
    const inputs = document.querySelectorAll('.form-input');
    const submitBtn = form?.querySelector('.btn-submit');
    
    if (!form) return;
    
    // Enhanced input interactions
    inputs.forEach(input => {
        input.addEventListener('focus', function(event) {
            this.parentElement.classList.add('focused');
            
            // Add focus ripple effect
            createInputRipple(this.parentElement, event);
            
            // Add floating label effect
            const placeholder = this.getAttribute('placeholder');
            if (placeholder && !this.getAttribute('data-floating-label')) {
                createFloatingLabel(this, placeholder);
                this.setAttribute('data-floating-label', 'true');
            }
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
            
            // Real-time validation feedback
            validateInput(this);
        });
    });
    
    // Enhanced form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!submitBtn) return;
        
        // Show loading state
        submitBtn.classList.add('loading');
        const btnSpan = submitBtn.querySelector('span');
        const originalText = btnSpan ? btnSpan.textContent : 'SEND MESSAGE';
        
        // Add submission animation
        addSubmissionAnimation(form);
        
        // Simulate form submission
        setTimeout(() => {
            // Show success animation
            showFormSuccess(form);
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                inputs.forEach(input => {
                    input.parentElement.classList.remove('has-value');
                });
                
                submitBtn.classList.remove('loading');
            }, 2000);
        }, 3000);
    });
}

function createInputRipple(container, event) {
    const ripple = document.createElement('div');
    const rect = container.getBoundingClientRect();
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
        animation: inputRipple 0.6s ease-out forwards;
        z-index: 1;
    `;
    
    container.style.position = 'relative';
    container.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createFloatingLabel(input, text) {
    const label = document.createElement('label');
    label.textContent = text;
    label.style.cssText = `
        position: absolute;
        top: 15px;
        left: 20px;
        color: #64748b;
        font-size: 16px;
        pointer-events: none;
        transition: all 0.3s ease;
        z-index: 2;
    `;
    
    input.parentElement.insertBefore(label, input);
    
    input.addEventListener('focus', () => {
        label.style.top = '-10px';
        label.style.fontSize = '12px';
        label.style.color = '#00ffff';
        label.style.background = 'rgba(0, 0, 0, 0.8)';
        label.style.padding = '0 8px';
        label.style.borderRadius = '4px';
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            label.style.top = '15px';
            label.style.fontSize = '16px';
            label.style.color = '#64748b';
            label.style.background = 'transparent';
            label.style.padding = '0';
        }
    });
}

function validateInput(input) {
    const value = input.value;
    const type = input.type;
    let isValid = true;
    
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    } else if (input.hasAttribute('required')) {
        isValid = value.trim().length > 0;
    }
    
    if (isValid) {
        input.parentElement.classList.remove('error');
        input.parentElement.classList.add('valid');
    } else {
        input.parentElement.classList.remove('valid');
        input.parentElement.classList.add('error');
    }
}

function addSubmissionAnimation(form) {
    const particles = [];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #00ffff, transparent);
            border-radius: 50%;
            pointer-events: none;
            left: 50%;
            top: 50%;
            animation: submissionParticle 2s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        form.style.position = 'relative';
        form.appendChild(particle);
        particles.push(particle);
    }
    
    setTimeout(() => {
        particles.forEach(particle => particle.remove());
    }, 2000);
}

function showFormSuccess(form) {
    const success = document.createElement('div');
    success.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out. I'll get back to you soon.</p>
        </div>
    `;
    
    success.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(16, 185, 129, 0.1);
        backdrop-filter: blur(20px);
        border: 2px solid #10b981;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #10b981;
        animation: successSlide 0.5s ease forwards;
        z-index: 10;
    `;
    
    form.style.position = 'relative';
    form.appendChild(success);
    
    setTimeout(() => {
        success.style.animation = 'successSlide 0.5s ease reverse forwards';
        setTimeout(() => success.remove(), 500);
    }, 2000);
}

// Interactive Effects
function initInteractiveEffects() {
    // Enhanced parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Hero parallax
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Floating shapes parallax
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.3 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Color blobs parallax
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, index) => {
            const speed = 0.2 + (index * 0.15);
            blob.style.transform = `translateY(${scrolled * speed}px) scale(${1 + Math.sin(scrolled * 0.01) * 0.1})`;
        });
    });
    
    // Add intersection observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Add section-specific animations
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                } else if (entry.target.id === 'about') {
                    animateAboutHighlights();
                }
            }
        });
    }, { threshold: 0.3 });
    
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
}

function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'skillPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        }, index * 50);
    });
}

function animateAboutHighlights() {
    const highlights = document.querySelectorAll('.highlight-item');
    highlights.forEach((highlight, index) => {
        setTimeout(() => {
            highlight.style.animation = 'highlightGlow 0.8s ease forwards';
        }, index * 200);
    });
}

// Utility function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const colors = {
        success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' },
        error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
        info: { bg: 'rgba(0, 102, 255, 0.1)', border: 'rgba(0, 102, 255, 0.3)', text: '#0066ff' }
    };
    
    const colorScheme = colors[type] || colors.info;
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</div>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colorScheme.bg};
        backdrop-filter: blur(20px);
        border: 1px solid ${colorScheme.border};
        border-radius: 15px;
        padding: 20px;
        color: ${colorScheme.text};
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        max-width: 350px;
        font-size: 14px;
        border-left: 4px solid ${colorScheme.text};
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
            closeNotification(notification);
        });
    }
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification(notification);
        }
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 400);
}

// Add enhanced CSS animations
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    @keyframes linkRipple {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(2); opacity: 0; }
    }
    
    @keyframes toggleRipple {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(1); opacity: 0; }
    }
    
    @keyframes buttonParticle {
        from { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
        }
        to { 
            transform: translate(-50%, -50%) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); 
            opacity: 0; 
        }
    }
    
    @keyframes shimmer {
        from { transform: translateX(-100%); }
        to { transform: translateX(100%); }
    }
    
    @keyframes sparkle {
        from { 
            transform: translate(-50%, -50%) scale(0) rotate(0deg); 
            opacity: 1; 
        }
        to { 
            transform: translate(-50%, -50%) translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(1) rotate(360deg); 
            opacity: 0; 
        }
    }
    
    @keyframes hexagonPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes hexagonEntrance {
        from { 
            transform: scale(0) rotate(-180deg); 
            opacity: 0; 
        }
        to { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
        }
    }
    
    @keyframes tooltipFadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes tooltipFadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    
    @keyframes projectRipple {
        from { width: 0; height: 0; opacity: 1; }
        to { width: 300px; height: 300px; opacity: 0; }
    }
    
    @keyframes timelineSlideIn {
        from { 
            opacity: 0; 
            transform: translateX(-50px) scale(0.8); 
        }
        to { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
        }
    }
    
    @keyframes tagBounceIn {
        from { 
            opacity: 0; 
            transform: scale(0) rotate(-180deg); 
        }
        to { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
        }
    }
    
    @keyframes inputRipple {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(2); opacity: 0; }
    }
    
    @keyframes submissionParticle {
        from { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
        }
        to { 
            transform: translate(-50%, -50%) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0); 
            opacity: 0; 
        }
    }
    
    @keyframes successSlide {
        from { 
            opacity: 0; 
            transform: scale(0.8); 
        }
        to { 
            opacity: 1; 
            transform: scale(1); 
        }
    }
    
    @keyframes fadeInUp {
        from { 
            opacity: 0; 
            transform: translateY(20px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    
    @keyframes skillPop {
        from { 
            opacity: 0; 
            transform: scale(0.5) rotate(-10deg); 
        }
        to { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
        }
    }
    
    @keyframes highlightGlow {
        from { 
            opacity: 0; 
            box-shadow: none; 
        }
        to { 
            opacity: 1; 
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); 
        }
    }
    
    .skill-tooltip .skill-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin: 8px 0;
        overflow: hidden;
    }
    
    .skill-tooltip .skill-progress {
        height: 100%;
        background: linear-gradient(90deg, #00ffff, #0066ff);
        border-radius: 2px;
        animation: progressFill 1s ease-out forwards;
    }
    
    @keyframes progressFill {
        from { width: 0%; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .notification-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: currentColor;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
        flex-shrink: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

document.head.appendChild(enhancedStyles);

// Handle page visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    } else {
        if (isLoaded) {
            initEnhancedParticles();
        }
    }
});

// Initialize performance optimizations
if (window.innerWidth < 768) {
    // Reduce particle count and effects on mobile
    document.documentElement.style.setProperty('--particle-count', '30');
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
}

// Add resize handler for responsive optimizations
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        particles = particles.slice(0, 50);
        colorfulParticles = colorfulParticles.slice(0, 10);
    }
});
