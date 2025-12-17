import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

import rocketImg from '../assets/rocket.png'
import muscleImg from '../assets/muscle.png'
import maleGenderImg from '../assets/male-gender.png'
import leavesImg from '../assets/leaves.png'

const benefits = [
  {
    title: "STRONGER ERECTIONS",
    description: "Enhanced blood flow for powerful, lasting performance",
    image: rocketImg,
  },
  {
    title: "INCREASED VITALITY",
    description: "Sustained energy throughout the day and night",
    image: muscleImg,
  },
  {
    title: "BOOSTED LIBIDO",
    description: "Reignite passion and desire naturally",
    image: maleGenderImg,
  },
  {
    title: "NATURAL INGREDIENTS",
    description: "Pure botanical extracts, no synthetic additives",
    image: leavesImg,
  },
]

function BenefitCard({ benefit, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative bg-white rounded-2xl p-8 text-center h-full border border-gray-100 overflow-hidden"
        whileHover={{ 
          y: -10,
          boxShadow: "0 25px 50px -12px rgba(212, 165, 116, 0.25)",
        }}
        transition={{ duration: 0.3 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Gradient Background on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10 opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.5), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '200% 0%'] : '0% 0%',
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />
        
        {/* Icon Container */}
        <motion.div 
          className="relative mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold/10 to-gold/5"
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={benefit.image}
            alt={benefit.title}
            className="w-14 h-14 object-contain"
            animate={{
              scale: isHovered ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Icon Glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gold/20 blur-xl"
            animate={{
              scale: isHovered ? 1.5 : 0,
              opacity: isHovered ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        
        {/* Title */}
        <motion.h3 
          className="relative font-heading font-bold text-lg text-black mb-3"
          animate={{
            color: isHovered ? '#B8956E' : '#000',
          }}
          transition={{ duration: 0.3 }}
        >
          {benefit.title}
        </motion.h3>
        
        {/* Description */}
        <motion.p
          className="relative text-gray-600 text-sm leading-relaxed"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {benefit.description}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default function Benefits() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  
  return (
    <section ref={sectionRef} className="relative bg-gradient-to-b from-white to-gray-50 py-20 md:py-28 px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gold/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-gold/5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
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
            WHY CHOOSE US
          </motion.span>
          <motion.h2 
            className="font-heading text-4xl md:text-5xl font-bold text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            POWERFUL BENEFITS
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>
        
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
