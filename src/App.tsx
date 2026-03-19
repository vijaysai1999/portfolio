/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Moon, 
  Sun, 
  Code2, 
  Database, 
  Cloud, 
  Terminal,
  ChevronRight,
  Download,
  Briefcase,
  GraduationCap,
  User,
  Home,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

// --- Types ---
type Page = 'welcome' | 'loading' | 'exit-confirm' | 'exit-final' | 'portfolio';
type Emotion = 'neutral' | 'happy' | 'sad' | 'surprised' | 'thinking';

// --- Custom Cursor Component ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <div 
        className="cursor-glow hidden md:block"
        style={{ 
          left: position.x, 
          top: position.y,
          width: isHovering ? '600px' : '400px',
          height: isHovering ? '600px' : '400px',
          opacity: isHovering ? 0.25 : 0.15,
          background: 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, transparent 70%)'
        }}
      />
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 border-2 border-yellow-500 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        animate={{ 
          x: position.x - 16, 
          y: position.y - 16,
          scale: isMouseDown ? 0.8 : (isHovering ? 2.5 : 1),
          opacity: 1
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
      />
      <motion.div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-yellow-500 rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{ 
          x: position.x - 3, 
          y: position.y - 3,
          scale: isMouseDown ? 2 : (isHovering ? 0.5 : 1)
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 500, mass: 0.1 }}
      />
    </>
  );
};

// --- Particle Background Component ---
const ParticleBackground = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;
      pulse: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 1.5 + 0.5;
        this.density = (Math.random() * 20) + 5;
        this.color = isDark ? 'rgba(234, 179, 8, 0.8)' : 'rgba(234, 179, 8, 0.9)';
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      update() {
        let dx = mouseRef.current.x - this.x;
        let dy = mouseRef.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 300;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }
        this.pulse += this.pulseSpeed;
      }

      draw() {
        if (!ctx) return;
        const currentSize = this.size * (1 + Math.sin(this.pulse) * 0.3);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Modern square particles
        ctx.rect(this.x - currentSize/2, this.y - currentSize/2, currentSize, currentSize);
        ctx.fill();
        
        // Add a small glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 6000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Draw lines between nearby particles that are also near the mouse
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const mdx = mouseRef.current.x - particles[a].x;
            const mdy = mouseRef.current.y - particles[a].y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            
            if (mDist < 250) {
              const opacity = (1 - distance / 120) * (1 - mDist / 250) * 0.8;
              ctx.strokeStyle = isDark ? `rgba(234, 179, 8, ${opacity * 0.4})` : `rgba(234, 179, 8, ${opacity * 0.6})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[-1]"
    />
  );
};

// --- Realistic 3D-ish Avatar Component ---
const RealisticAvatar = ({ emotion, size = "large" }: { emotion: Emotion, size?: "small" | "large" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const figureRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!figureRef.current) return;
      const rect = figureRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 12, 12);
      
      setMousePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sizeClasses = size === "small" 
    ? "w-60 h-60 md:w-[50vh] md:h-[50vh]" 
    : "w-80 h-80 md:w-[75vh] md:h-[75vh]";

  return (
    <motion.svg
      ref={figureRef}
      viewBox="0 0 200 200"
      className={`${sizeClasses} max-w-[800px] max-h-[800px] drop-shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_35px_60px_-15px_rgba(255,255,255,0.1)]`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="#E2B200" />
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="2" floodOpacity="0.3" />
        </filter>
        <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      
      {/* Ears with 3D effect */}
      <circle cx="35" cy="100" r="22" fill="#E2B200" stroke="#000" strokeWidth="1" />
      <circle cx="35" cy="100" r="12" fill="#C49A00" />
      <circle cx="165" cy="100" r="22" fill="#E2B200" stroke="#000" strokeWidth="1" />
      <circle cx="165" cy="100" r="12" fill="#C49A00" />

      {/* Main Head - Rounded Square with Shading */}
      <rect x="30" y="40" width="140" height="130" rx="55" fill="url(#bodyGrad)" stroke="#000" strokeWidth="3" />
      
      {/* Glossy Reflection */}
      <ellipse cx="70" cy="65" rx="20" ry="10" fill="white" fillOpacity="0.2" transform="rotate(-15, 70, 65)" />

      {/* Blushing */}
      <AnimatePresence>
        {emotion === 'happy' && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}>
            <circle cx="60" cy="125" r="12" fill="#FF6B6B" filter="blur(4px)" />
            <circle cx="140" cy="125" r="12" fill="#FF6B6B" filter="blur(4px)" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Eyes Container */}
      <g transform={`translate(${mousePos.x}, ${mousePos.y})`}>
        {/* Left Eye */}
        <circle cx="72" cy="95" r="20" fill="url(#eyeGrad)" stroke="black" strokeWidth="2" />
        <motion.circle 
          cx="72" cy="95" r="9" fill="black" 
          animate={emotion === 'surprised' ? { scale: 1.6 } : { scale: 1 }}
        />
        <circle cx="68" cy="91" r="3" fill="white" />
        
        {/* Right Eye */}
        <circle cx="128" cy="95" r="20" fill="url(#eyeGrad)" stroke="black" strokeWidth="2" />
        <motion.circle 
          cx="128" cy="95" r="9" fill="black"
          animate={emotion === 'surprised' ? { scale: 1.6 } : { scale: 1 }}
        />
        <circle cx="124" cy="91" r="3" fill="white" />
      </g>

      {/* Mouth */}
      <AnimatePresence mode="wait">
        {emotion === 'neutral' && (
          <motion.path
            key="neutral"
            d="M 85 145 Q 100 145 115 145"
            fill="transparent"
            stroke="black"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        )}
        {emotion === 'happy' && (
          <motion.path
            key="happy"
            d="M 75 140 Q 100 170 125 140"
            fill="transparent"
            stroke="black"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        )}
        {emotion === 'sad' && (
          <motion.path
            key="sad"
            d="M 80 155 Q 100 135 120 155"
            fill="transparent"
            stroke="black"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        )}
        {emotion === 'surprised' && (
          <motion.circle
            key="surprised"
            cx="100" cy="150" r="12"
            fill="transparent"
            stroke="black"
            strokeWidth="6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Antenna with Glow */}
      <line x1="100" y1="40" x2="100" y2="15" stroke="black" strokeWidth="5" />
      <motion.circle 
        cx="100" cy="15" r="10" fill="#FFD93D" stroke="black" strokeWidth="3"
        animate={{ 
          y: [0, -8, 0],
          fill: ["#FFD93D", "#FFF", "#FFD93D"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
};

// --- iOS Style Toggle Component ---
const IosToggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => {
  return (
    <button
      onClick={onChange}
      className={`ios-toggle ${checked ? 'bg-zinc-800' : 'bg-zinc-200'}`}
    >
      <span className={`ios-toggle-thumb ${checked ? 'translate-x-7' : 'translate-x-1'}`}>
        <span className="flex items-center justify-center h-full">
          {checked ? <Moon size={12} className="text-zinc-900" /> : <Sun size={12} className="text-yellow-500" />}
        </span>
      </span>
    </button>
  );
};

// --- Main App Component ---
export default function App() {
  const [page, setPage] = useState<Page>('welcome');
  const [emotion, setEmotion] = useState<Emotion>('neutral');
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleEnter = () => {
    setPage('loading');
    setTimeout(() => setPage('portfolio'), 2000);
  };

  const goHome = () => {
    setPage('welcome');
    setEmotion('neutral');
    setIsMenuOpen(false);
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden selection:bg-yellow-500/30 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
      <CustomCursor />
      
      {/* Base Background Layer */}
      <div className={`fixed inset-0 z-[-3] ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`} />
      
      <ParticleBackground isDark={isDark} />
      
      {/* Mesh Background */}
      <div className="mesh-bg" />

      {/* Global Header - Unified and Aligned */}
      <AnimatePresence>
        {page === 'portfolio' && (
          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              {/* Left Side: Home Button & Name */}
              <div className="flex items-center gap-6">
                <button
                  onClick={goHome}
                  className="ios-button ios-button-secondary group !px-4 !py-2"
                >
                  <Home size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Home</span>
                </button>
                <span className="text-2xl font-black font-display tracking-tighter hidden sm:block">
                  VIJAY<span className="text-yellow-500">.</span>
                </span>
              </div>

              {/* Right Side: Menu & Theme */}
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-8 mr-4 font-bold uppercase tracking-widest text-[10px]">
                  <a href="#about" className="hover:text-yellow-500 transition-colors">About</a>
                  <a href="#experience" className="hover:text-yellow-500 transition-colors">Experience</a>
                  <a href="#skills" className="hover:text-yellow-500 transition-colors">Skills</a>
                  <a href="#contact" className="hover:text-yellow-500 transition-colors">Contact</a>
                </div>
                
                <div className="flex items-center gap-3 glass px-3 py-1.5 rounded-full">
                  <IosToggle checked={isDark} onChange={() => setIsDark(!isDark)} />
                </div>

                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden ios-button ios-button-secondary !p-2"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mt-4 flex flex-col gap-4 font-bold uppercase tracking-widest text-xs py-4 border-t border-zinc-200 dark:border-zinc-800"
                >
                  <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors py-2">About</a>
                  <a href="#experience" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors py-2">Experience</a>
                  <a href="#skills" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors py-2">Skills</a>
                  <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors py-2">Contact</a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {page === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center h-screen w-screen p-6 text-center relative overflow-hidden"
          >
            {/* Theme Toggle for Welcome Page */}
            <div className="absolute top-6 right-6 flex items-center gap-4 glass px-4 py-2 rounded-full z-50">
              <IosToggle checked={isDark} onChange={() => setIsDark(!isDark)} />
            </div>

            <div className="flex flex-col items-center justify-center flex-1 w-full max-h-full overflow-hidden">
              <RealisticAvatar emotion={emotion} />
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <h1 className="text-6xl font-black tracking-tighter md:text-8xl lg:text-9xl font-display leading-none">
                  HELLO <br/> <span className="text-yellow-500">WORLD.</span>
                </h1>
                <p className="max-w-md mx-auto mt-4 text-lg md:text-xl text-zinc-500 dark:text-white font-medium leading-relaxed">
                  I'm Vijay Sai Kishore Babu. <br/>
                  Crafting the future of <span className="text-zinc-900 dark:text-yellow-400 font-black underline decoration-yellow-500 underline-offset-8">Mainframe</span> & <span className="text-zinc-900 dark:text-blue-400 font-black underline decoration-blue-500 underline-offset-8">Java</span>.
                </p>
              </motion.div>
              
              <div className="flex flex-col gap-4 mt-8 sm:flex-row">
                <button
                  onMouseEnter={() => setEmotion('happy')}
                  onMouseLeave={() => setEmotion('neutral')}
                  onClick={handleEnter}
                  className="ios-button ios-button-primary px-10 py-4 text-lg shadow-2xl hover:scale-105"
                >
                  Enter Experience <Sparkles size={20} className="text-yellow-500" />
                </button>
                <button
                  onMouseEnter={() => setEmotion('surprised')}
                  onMouseLeave={() => setEmotion('neutral')}
                  onClick={() => setPage('exit-confirm')}
                  className="ios-button ios-button-secondary px-10 py-4 text-lg"
                >
                  Exit Site
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {page === 'exit-confirm' && (
          <motion.div
            key="exit-confirm"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col items-center justify-center h-screen w-screen p-6 text-center overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center flex-1 w-full max-h-full overflow-hidden">
              <RealisticAvatar emotion={emotion} />
              <div className="mt-8">
                <h2 className="text-5xl font-black font-display tracking-tighter">Wait, Really?</h2>
                <p className="max-w-md mx-auto mt-6 text-xl md:text-2xl text-zinc-500 dark:text-white font-medium">
                  You're about to miss out on some seriously cool tech showcases. Stay a while?
                </p>
              </div>
              <div className="flex flex-col gap-4 mt-10 sm:flex-row">
                <button
                  onMouseEnter={() => setEmotion('happy')}
                  onMouseLeave={() => setEmotion('neutral')}
                  onClick={handleEnter}
                  className="ios-button ios-button-primary px-10 py-4 text-lg font-bold"
                >
                  Let's See It!
                </button>
                <button
                  onMouseEnter={() => setEmotion('sad')}
                  onMouseLeave={() => setEmotion('neutral')}
                  onClick={() => setPage('exit-final')}
                  className="ios-button ios-button-secondary px-10 py-4 text-lg"
                >
                  I'm sure, exit.
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {page === 'exit-final' && (
          <motion.div
            key="exit-final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-screen w-screen p-6 text-center overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center flex-1 w-full max-h-full overflow-hidden">
              <div className="text-8xl md:text-9xl mb-8 animate-bounce">👋</div>
              <h2 className="text-6xl font-black font-display tracking-tighter">Farewell!</h2>
              <p className="max-w-xl mx-auto mt-8 text-xl md:text-2xl text-zinc-500 dark:text-white leading-relaxed font-medium">
                It was great having you here. If you have any feedback or just want to say hi, my inbox is always open.
              </p>
              
              <a 
                href="mailto:vijaysai1999@gmail.com" 
                className="mt-10 ios-button ios-button-primary px-8 py-4 text-lg"
              >
                <MessageSquare size={22} />
                Feedback: vijaysai1999@gmail.com
              </a>

              <button 
                onClick={goHome}
                className="mt-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-sm"
              >
                <ArrowLeft size={18} /> Back to Start
              </button>
            </div>
          </motion.div>
        )}

        {page === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden"
          >
            <div className="relative w-40 h-40">
              <motion.div
                className="absolute inset-0 border-8 border-yellow-500/20 rounded-[40px]"
              />
              <motion.div
                className="absolute inset-0 border-t-8 border-yellow-500 rounded-[40px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-yellow-500 animate-pulse" size={40} />
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-3xl font-black tracking-[0.3em] uppercase font-display text-zinc-400 dark:text-white"
            >
              Initializing...
            </motion.p>
          </motion.div>
        )}

        {page === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative pt-24"
          >

            {/* Hero Section */}
            <section id="about" className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 pt-32 max-w-7xl mx-auto gap-16 lg:text-left text-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="relative group lg:w-1/2"
              >
                <div className="absolute -inset-4 bg-yellow-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
                <div className="relative z-10 w-full aspect-square max-w-md mx-auto rounded-[60px] bg-zinc-200 dark:bg-zinc-800 overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-900">
                   {/* User Image Placeholder with high-quality feel */}
                   <motion.img 
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    src="https://picsum.photos/seed/vijay/800/800" 
                    alt="Vijay Sai Kishore Babu" 
                    className="w-full h-full object-cover transition-all duration-700"
                    referrerPolicy="no-referrer"
                   />
                </div>
                {/* Floating Badge */}
                <motion.div 
                  className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl shadow-xl z-20 hidden md:block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    <span className="font-bold text-sm uppercase tracking-widest">Available for Projects</span>
                  </div>
                </motion.div>
              </motion.div>

              <div className="lg:w-1/2">
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-yellow-500 font-black uppercase tracking-[0.3em] text-sm mb-6 block"
                >
                  Software Engineer
                </motion.span>
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-tight mb-10 break-words">
                  Vijay Sai Kishore Babu<span className="text-yellow-500">.</span>
                </h1>
                <p className="text-2xl md:text-3xl text-zinc-500 dark:text-white font-medium leading-tight mb-12">
                  Architecting resilient <span className="text-zinc-900 dark:text-white font-bold">Mainframe</span> solutions and scalable <span className="text-zinc-900 dark:text-white font-bold">Java</span> ecosystems for the next generation of enterprise technology.
                </p>
                <div className="flex flex-wrap gap-6 lg:justify-start justify-center">
                  <a href="mailto:vijaysai1999@gmail.com" className="ios-button ios-button-primary px-12 py-5 text-xl">
                    <Mail size={24} /> Get in Touch
                  </a>
                  <a href="#" className="ios-button ios-button-secondary px-12 py-5 text-xl">
                    <Download size={24} /> Download CV
                  </a>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="py-40 px-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                  <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-sm">Professional Path</span>
                  <h2 className="text-6xl md:text-8xl font-black font-display tracking-tighter mt-4 leading-none">The Journey.</h2>
                </div>
                <Briefcase className="text-zinc-200 dark:text-zinc-800 hidden lg:block" size={160} />
              </div>
              <div className="grid gap-16">
                {[
                  {
                    company: "Tata Consultancy Services (TCS)",
                    role: "System Engineer / Developer",
                    period: "May 2023 - Present",
                    location: "Chennai, India",
                    desc: "Driving high-impact digital transformation at TCS. I specialize in the end-to-end SDLC of complex Mainframe-to-Java migrations, delivering robust, scalable solutions that modernize legacy architectures while maintaining mission-critical stability."
                  },
                  {
                    company: "Infosys Limited",
                    role: "Senior Systems Associate",
                    period: "June 2021 - May 2023",
                    location: "Chennai, India",
                    desc: "Engineered high-performance banking solutions for the Royal Bank of Scotland. Leveraged COBOL, JCL, and DB2 within a SAFe Agile framework to optimize core financial processing and enhance system reliability."
                  }
                ].map((exp, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="group p-10 md:p-16 rounded-[60px] glass hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-all duration-500 shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                      <div>
                        <h3 className="text-4xl md:text-5xl font-black font-display tracking-tight">{exp.role}</h3>
                        <p className="text-yellow-500 font-black text-2xl mt-2">{exp.company}</p>
                      </div>
                      <div className="md:text-right flex flex-col items-start md:items-end gap-3">
                        <span className="px-6 py-3 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm font-black tracking-widest whitespace-nowrap">{exp.period}</span>
                        <p className="text-zinc-400 font-bold flex items-center gap-2"><MapPin size={18}/> {exp.location}</p>
                      </div>
                    </div>
                    <p className="text-2xl text-zinc-500 dark:text-white leading-relaxed max-w-5xl font-medium">
                      {exp.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-40 px-6 relative">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                  <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-sm">Expertise</span>
                  <h2 className="text-6xl md:text-8xl font-black font-display tracking-tighter mt-4">Tech Arsenal.</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[
                    { 
                      title: "Mainframe Core", 
                      icon: <Terminal size={32} />, 
                      skills: ["COBOL", "JCL", "CICS", "DB2", "VSAM", "z/OS"],
                      color: "bg-yellow-500"
                    },
                    { 
                      title: "Modern Java", 
                      icon: <Code2 size={32} />, 
                      skills: ["Core Java", "Spring Boot", "Spring MVC", "RESTful APIs", "Maven"],
                      color: "bg-blue-500"
                    },
                    { 
                      title: "Databases & Tools", 
                      icon: <Database size={32} />, 
                      skills: ["MySQL", "MongoDB", "Git", "Jenkins", "Jira", "Confluence"],
                      color: "bg-emerald-500"
                    },
                    { 
                      title: "Cloud & Agile", 
                      icon: <Cloud size={32} />, 
                      skills: ["Azure Certified", "AWS Practitioner", "SAFe Agile", "Scrum"],
                      color: "bg-purple-500"
                    }
                  ].map((cat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-12 rounded-[60px] glass relative group overflow-hidden shadow-2xl cursor-pointer"
                    >
                      <div className={`absolute top-0 right-0 w-48 h-48 ${cat.color} opacity-5 blur-[80px] group-hover:opacity-20 transition-opacity`} />
                      <div className="flex items-center gap-6 mb-10">
                        <div className={`w-16 h-16 rounded-3xl ${cat.color} text-white flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform`}>
                          {cat.icon}
                        </div>
                        <h3 className="text-3xl font-black font-display">{cat.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {cat.skills.map((skill, index) => (
                          <motion.span 
                            key={skill} 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
                            transition={{ delay: (i * 0.1) + (index * 0.05) }}
                            className="px-6 py-3 rounded-2xl bg-white/50 dark:bg-zinc-800/50 text-lg font-black backdrop-blur-md border border-white/20 dark:border-white/5 cursor-default"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-40 px-6">
              <div className="max-w-6xl mx-auto rounded-[80px] bg-zinc-900 text-white p-16 md:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.2),transparent_70%)]" />
                <div className="relative z-10">
                  <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tighter mb-12 leading-none break-words">Let's engineer <br/> the <br/> extraordinary.</h2>
                  <p className="text-2xl md:text-3xl text-white mb-20 max-w-3xl mx-auto font-medium leading-relaxed">
                    Whether you're looking to modernize legacy systems or build high-performance Java applications, I bring the expertise to deliver results. Let's connect.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="mailto:vijaysai1999@gmail.com" 
                      className="ios-button bg-yellow-500 text-zinc-900 px-16 py-6 text-2xl font-black shadow-[0_20px_50px_rgba(234,179,8,0.3)]"
                    >
                      <Mail size={28} /> Say Hello
                    </motion.a>
                    <div className="flex gap-6 justify-center">
                      <motion.a 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        href="#" 
                        className="w-20 h-20 rounded-full glass flex items-center justify-center hover:bg-white hover:text-zinc-900 transition-all shadow-xl"
                      >
                        <Linkedin size={32} />
                      </motion.a>
                      <motion.a 
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        href="#" 
                        className="w-20 h-20 rounded-full glass flex items-center justify-center hover:bg-white hover:text-zinc-900 transition-all shadow-xl"
                      >
                        <Github size={32} />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-24 px-6 text-center">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-zinc-400 font-bold uppercase tracking-widest text-xs">
                <p>© {new Date().getFullYear()} Vijay Sai Kishore Babu</p>
                <div className="flex gap-12">
                  <a href="#about" className="hover:text-yellow-500 transition-colors">Home</a>
                  <a href="#experience" className="hover:text-yellow-500 transition-colors">Experience</a>
                  <a href="#skills" className="hover:text-yellow-500 transition-colors">Skills</a>
                </div>
                <p className="flex items-center gap-2">Designed for the future <Sparkles size={14} className="text-yellow-500" /></p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
