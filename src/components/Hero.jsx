import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import bgImage from '../assets/bg.jpeg'
import HeroProduct3D from './HeroProduct3D'

// Floating particle component
function FloatingParticle({ delay, duration, size, left, top }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gold/30 blur-sm"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        top: `${top}%`,
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Glowing orb component
function GlowOrb({ className }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

export default function Hero() {
  const messengerLink = "https://m.me/phytomaxmu"
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Parallax scroll effect
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])
  
  // Smooth spring for mouse movement
  const springConfig = { stiffness: 100, damping: 30 }
  const mouseX = useSpring(0, springConfig)
  const mouseY = useSpring(0, springConfig)
  
  // Track mouse for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX - innerWidth / 2) / innerWidth
      const y = (clientY - innerHeight / 2) / innerHeight
      mouseX.set(x * 20)
      mouseY.set(y * 20)
      setMousePosition({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])
  
  // Particles configuration
  const particles = [
    { delay: 0, duration: 6, size: 8, left: 10, top: 20 },
    { delay: 1, duration: 8, size: 12, left: 85, top: 30 },
    { delay: 2, duration: 7, size: 6, left: 20, top: 70 },
    { delay: 0.5, duration: 9, size: 10, left: 75, top: 60 },
    { delay: 1.5, duration: 6, size: 8, left: 50, top: 15 },
    { delay: 2.5, duration: 8, size: 14, left: 90, top: 80 },
    { delay: 0.8, duration: 7, size: 6, left: 5, top: 50 },
    { delay: 1.8, duration: 9, size: 10, left: 65, top: 85 },
  ]
  
  return (
    <motion.section 
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden flex items-center"
      style={{ opacity, scale }}
    >
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          y: y1,
          scale: 1.1,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      
      {/* Animated Glow Orbs */}
      <GlowOrb className="w-96 h-96 bg-gold/20 -left-48 top-1/4" />
      <GlowOrb className="w-72 h-72 bg-gold/15 right-0 bottom-1/4" />
      
      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <FloatingParticle key={index} {...particle} />
      ))}
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(212,165,116,0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212,165,116,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* 3D Product with Real-time Reflections */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <HeroProduct3D mousePosition={mousePosition} />
          </motion.div>
          
          {/* Hero Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="inline-block text-gold text-sm md:text-base tracking-[0.3em] mb-4 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                PREMIUM VITALITY SUPPLEMENT
              </motion.span>
            </motion.div>
            
            <motion.h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              UNLOCK YOUR PEAK PERFORMANCE{' '}
              <motion.span 
                className="text-gold inline-block"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(212,165,116,0.5)',
                    '0 0 40px rgba(212,165,116,0.8)',
                    '0 0 20px rgba(212,165,116,0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                NATURALLY.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Powerful Support for Weak Erection, Erectile Dysfunction, and Low Libido. 
              Explore our range of natural vitality supplements.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.a 
                href={messengerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 bg-gold text-black font-bold text-lg md:text-xl px-10 py-4 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  animate={{
                    translateX: ['100%', '-100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />
                <svg className="relative w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06.91.23 1.88.35 2.88.35 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.89 7.73l-2.88 4.08c-.38.54-1.12.67-1.65.29l-2.29-1.72a.5.5 0 00-.6 0l-3.09 2.35c-.41.31-.95-.18-.68-.62l2.88-4.08c.38-.54 1.12-.67 1.65-.29l2.29 1.72a.5.5 0 00.6 0l3.09-2.35c.41-.31.95.18.68.62z"/>
                </svg>
                <span className="relative">ORDER NOW</span>
              </motion.a>
            </motion.div>
            
            {/* Trust Badges */}
            <motion.div
              className="flex items-center justify-center md:justify-start gap-6 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Natural
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SAHPRA Registered
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-gold rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
