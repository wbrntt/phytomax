import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.95)']
  )
  
  const headerBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(10px)']
  )
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300"
      style={{ 
        backgroundColor: headerBackground,
        backdropFilter: headerBlur,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="/" 
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="font-heading text-2xl md:text-3xl font-bold text-gold tracking-wider">
            PHYTOMAX
          </span>
          {/* Logo Underline Animation */}
          <motion.span
            className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gold via-gold-light to-gold"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
        </motion.a>
        
        {/* CTA Button */}
        <motion.a
          href="https://m.me/phytomaxmu"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-2 bg-gold text-black font-bold text-sm px-6 py-2.5 rounded-full overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          />
          <svg className="relative w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06.91.23 1.88.35 2.88.35 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.89 7.73l-2.88 4.08c-.38.54-1.12.67-1.65.29l-2.29-1.72a.5.5 0 00-.6 0l-3.09 2.35c-.41.31-.95-.18-.68-.62l2.88-4.08c.38-.54 1.12-.67 1.65-.29l2.29 1.72a.5.5 0 00.6 0l3.09-2.35c.41-.31.95.18.68.62z"/>
          </svg>
          <span className="relative">Order Now</span>
        </motion.a>
      </div>
      
      {/* Bottom Border Animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.header>
  )
}
