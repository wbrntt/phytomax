import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import sugarFreeImg from '../assets/sugar-free.png'

function TrustBadge({ children, delay, icon, image, title }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <motion.div
        className="relative bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 overflow-hidden group"
        whileHover={{ 
          y: -8,
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.15)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        {/* Floating Particles */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold/30"
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-8 left-8 w-3 h-3 rounded-full bg-gold/20"
          animate={{
            y: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        
        {/* Icon/Image Container */}
        <motion.div
          className="relative mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 group-hover:from-gold/20 group-hover:to-gold/10 transition-all duration-300"
          whileHover={{ rotate: 5, scale: 1.05 }}
        >
          {image ? (
            <img 
              src={image} 
              alt={title} 
              className="w-12 h-12 object-contain"
              style={{ 
                filter: 'brightness(0) saturate(100%) invert(72%) sepia(29%) saturate(459%) hue-rotate(348deg) brightness(91%) contrast(89%)' 
              }}
            />
          ) : (
            <div className="text-gold">
              {icon}
            </div>
          )}
        </motion.div>
        
        {/* Title */}
        <h3 className="font-heading text-2xl font-bold text-black mb-4 group-hover:text-gold-dark transition-colors duration-300">
          {title}
        </h3>
        
        {/* Content */}
        <div className="relative">
          {children}
        </div>
        
        {/* Bottom Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: 'left' }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function TrustSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])
  
  return (
    <section ref={sectionRef} className="relative bg-gradient-to-b from-gray-50 to-gray-100 py-24 md:py-32 px-6 overflow-hidden">
      {/* Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ y }}
      >
        <svg className="w-full h-full">
          <pattern id="trust-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#trust-pattern)" />
        </svg>
      </motion.div>
      
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-gold text-sm tracking-[0.3em] mb-4 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            QUALITY ASSURANCE
          </motion.span>
          <motion.h2 
            className="font-heading text-4xl md:text-5xl font-bold text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            TRUSTED & SAFE
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>
        
        {/* Trust Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* SAHPRA Badge */}
          <TrustBadge
            delay={0.2}
            title="SAHPRA Registered"
            icon={
              <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M24 4L4 14v10c0 11 8.5 21.3 20 24 11.5-2.7 20-13 20-24V14L24 4z" />
                <path d="M16 24l6 6 12-12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            <p className="text-gray-600 leading-relaxed">
              SAHPRA registered to provide safe, quality-controlled supplements that meet strict regulatory standards for consumer protection.
            </p>
            <motion.div
              className="mt-4 inline-flex items-center gap-2 text-sm text-gold font-medium"
              whileHover={{ x: 5 }}
            >
              <span>Verified Vendor</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </TrustBadge>
          
          {/* Sugar Free Badge */}
          <TrustBadge
            delay={0.4}
            title="Sugar Free"
            image={sugarFreeImg}
          >
            <p className="text-gray-600 leading-relaxed">
              Sugar-free formula suitable for those managing diabetes, weight, or simply preferring a healthier supplement option.
            </p>
            <motion.div
              className="mt-4 inline-flex items-center gap-2 text-sm text-gold font-medium"
              whileHover={{ x: 5 }}
            >
              <span>Diabetic Friendly</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </TrustBadge>
        </div>
        
        {/* Additional Trust Indicators */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { number: "10K+", label: "Happy Customers" },
            { number: "100%", label: "Natural" },
            { number: "5+", label: "Years Trusted" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="font-heading text-4xl md:text-5xl font-bold text-gold"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(212,165,116,0)',
                    '0 0 20px rgba(212,165,116,0.3)',
                    '0 0 10px rgba(212,165,116,0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 text-sm mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
