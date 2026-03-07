import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

import branchImg from '../assets/branch.png'
import palmsImg from '../assets/palms.png'
import goatImg from '../assets/goat.png'

const ingredients = [
  {
    name: "Tongkat Ali",
    dosage: "200mg",
    description: "Tongkat Ali helps improve energy levels, supports stronger erections, and enhances male vitality naturally.",
    fullDescription: `Tongkat Ali (Eurycoma longifolia) is a powerful herbal extract native to Southeast Asia, renowned for its remarkable effects on male health and vitality.

**Key Benefits:**
• **Testosterone Support** - Clinical studies show Tongkat Ali can help maintain healthy testosterone levels, which naturally decline with age
• **Enhanced Energy** - Users report significant improvements in physical energy and reduced fatigue
• **Improved Libido** - Traditionally used for centuries to enhance sexual desire and performance
• **Stress Reduction** - Helps lower cortisol levels, the stress hormone that can negatively impact testosterone
• **Muscle Support** - May help support lean muscle mass when combined with exercise

**How It Works:**
Tongkat Ali works by supporting the body's natural hormone production pathways. It contains bioactive compounds called quassinoids and eurycomaoside that help optimize the hormonal environment for male vitality.

**Our Quality:**
We use a standardized 200mg extract with verified potency, sourced from mature roots for maximum effectiveness.`,
    color: "from-amber-500/20 to-orange-500/20",
    image: branchImg,
  },
  {
    name: "Saw Palmetto",
    dosage: "150mg",
    description: "Saw Palmetto supports the prostate system, promotes hormonal balance, and protects reproductive health.",
    fullDescription: `Saw Palmetto (Serenoa repens) is a small palm native to the southeastern United States, prized for its berries that have been used for over 200 years to support male health.

**Key Benefits:**
• **Prostate Health** - The most well-researched benefit, supporting healthy prostate size and function
• **Urinary Function** - Helps maintain normal urinary flow and frequency
• **Hormonal Balance** - Works by inhibiting the conversion of testosterone to DHT
• **Hair Health** - May help support healthy hair growth patterns in men
• **Anti-inflammatory** - Contains fatty acids with natural anti-inflammatory properties

**How It Works:**
Saw Palmetto works primarily by inhibiting the enzyme 5-alpha-reductase, which converts testosterone to dihydrotestosterone (DHT). By maintaining optimal DHT levels, it supports prostate comfort and overall male wellness.

**Our Quality:**
Our 150mg extract is standardized for fatty acids and sterols, the key active compounds, ensuring consistent potency in every dose.`,
    color: "from-emerald-500/20 to-green-500/20",
    image: palmsImg,
  },
  {
    name: "Epimedium",
    dosage: "100mg",
    description: "Epimedium enhances blood circulation, supports healthy libido, and improves overall stamina and energy.",
    fullDescription: `Horny Goat Weed (Epimedium) has been a cornerstone of traditional Chinese medicine for over 2,000 years, earning its unique name from observations of increased vitality in goats that consumed the plant.

**Key Benefits:**
• **Enhanced Circulation** - Contains icariin, which supports healthy blood flow throughout the body
• **Libido Support** - Traditionally renowned for supporting sexual desire and arousal
• **Energy & Stamina** - Users report improved physical endurance and reduced fatigue
• **Bone Health** - Research suggests potential benefits for maintaining bone density
• **Mood Support** - May help promote a positive mood and mental well-being

**How It Works:**
The primary active compound, icariin, works by supporting nitric oxide production and inhibiting PDE5, similar to how certain pharmaceutical medications work but in a gentler, natural way. This helps relax blood vessels and improve circulation where it matters most.

**Our Quality:**
We use a potent 100mg extract standardized for icariin content, ensuring you receive the optimal amount of active compounds for maximum benefit.`,
    color: "from-purple-500/20 to-pink-500/20",
    image: goatImg,
  },
]

// Modal Component
function IngredientModal({ ingredient, isOpen, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[85vh] bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden pointer-events-auto border border-gray-800"
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${ingredient.color} opacity-30`} />
              
              {/* Glow Effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
              
              {/* Close Button */}
              <motion.button
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              
              {/* Scrollable Content */}
              <div className="relative overflow-y-auto max-h-[85vh] p-8">
                {/* Header */}
                <div className="flex items-start gap-6 mb-8">
                  {/* Image */}
                  <motion.div
                    className="flex-shrink-0 w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center"
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="w-16 h-16 object-contain"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </motion.div>
                  
                  <div>
                    {/* Dosage Badge */}
                    <motion.span
                      className="inline-block bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {ingredient.dosage} per serving
                    </motion.span>
                    
                    {/* Name */}
                    <motion.h2
                      className="font-heading text-3xl md:text-4xl font-bold text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {ingredient.name}
                    </motion.h2>
                  </div>
                </div>
                
                {/* Divider */}
                <motion.div
                  className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                />
                
                {/* Full Description */}
                <motion.div
                  className="prose prose-invert prose-gold max-w-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {ingredient.fullDescription.split('\n\n').map((paragraph, idx) => {
                    // Check if paragraph starts with a header like **Key Benefits:**
                    const headerMatch = paragraph.match(/^\*\*(.+?):\*\*\n?(.*)$/s)

                    if (headerMatch) {
                      const headerText = headerMatch[1]
                      const content = headerMatch[2]

                      // Header with bullet list
                      if (content.includes('• **')) {
                        const items = content.split('\n').filter(item => item.trim())
                        return (
                          <div key={idx}>
                            <h3 className="text-gold font-heading text-xl font-bold mt-6 mb-3">
                              {headerText}:
                            </h3>
                            <ul className="space-y-2 mb-4">
                              {items.map((item, itemIdx) => {
                                const match = item.match(/• \*\*(.+?)\*\* - (.+)/)
                                if (match) {
                                  return (
                                    <li key={itemIdx} className="flex items-start gap-2 text-gray-300">
                                      <span className="text-gold mt-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                      </span>
                                      <span>
                                        <strong className="text-white">{match[1]}</strong> - {match[2]}
                                      </span>
                                    </li>
                                  )
                                }
                                return null
                              })}
                            </ul>
                          </div>
                        )
                      }

                      // Header with regular text
                      return (
                        <div key={idx}>
                          <h3 className="text-gold font-heading text-xl font-bold mt-6 mb-3">
                            {headerText}:
                          </h3>
                          <p className="text-gray-400 leading-relaxed mb-4">
                            {content}
                          </p>
                        </div>
                      )
                    }

                    // Regular paragraph
                    return (
                      <p key={idx} className="text-gray-400 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    )
                  })}
                </motion.div>
                
                {/* CTA */}
                <motion.div
                  className="mt-8 pt-6 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <a
                    href="https://m.me/61584867212520"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-black font-bold px-6 py-3 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06.91.23 1.88.35 2.88.35 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.89 7.73l-2.88 4.08c-.38.54-1.12.67-1.65.29l-2.29-1.72a.5.5 0 00-.6 0l-3.09 2.35c-.41.31-.95-.18-.68-.62l2.88-4.08c.38-.54 1.12-.67 1.65-.29l2.29 1.72a.5.5 0 00.6 0l3.09-2.35c.41-.31.95.18.68.62z"/>
                    </svg>
                    Order Now
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function IngredientCard({ ingredient, index, onLearnMore }) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-50px" })
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePosition({ x, y })
  }
  
  return (
    <motion.div
      ref={cardRef}
      className="relative h-full"
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      onMouseMove={handleMouseMove}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative h-full bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 overflow-hidden border border-gray-800"
        animate={{
          rotateY: isHovered ? mousePosition.x * 10 : 0,
          rotateX: isHovered ? -mousePosition.y * 10 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${ingredient.color} opacity-0`}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Animated Glow */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-gold via-gold-light to-gold rounded-3xl blur-xl opacity-0"
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Moving Highlight */}
        <motion.div
          className="absolute w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x * 100,
            y: mousePosition.y * 100,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
          {/* Image */}
          <motion.div
            className="mb-6 w-20 h-20 flex items-center justify-center"
            animate={{
              scale: isHovered ? 1.1 : 1,
              y: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={ingredient.image}
              alt={ingredient.name}
              className="w-full h-full object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </motion.div>
          
          {/* Dosage Badge */}
          <motion.span
            className="inline-block bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full mb-4"
            animate={{
              backgroundColor: isHovered ? 'rgba(212, 165, 116, 0.3)' : 'rgba(212, 165, 116, 0.2)',
            }}
          >
            {ingredient.dosage}
          </motion.span>
          
          {/* Name */}
          <h3 className="font-heading text-2xl font-bold text-white mb-4">
            {ingredient.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {ingredient.description}
          </p>
          
          {/* Learn More Link */}
          <motion.button
            className="mt-6 flex items-center gap-2 text-gold text-sm font-medium cursor-pointer"
            animate={{
              x: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
            onClick={() => onLearnMore(ingredient)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Learn more</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{
                x: isHovered ? 5 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </div>
        
        {/* Corner Accent */}
        <motion.div
          className="absolute top-0 right-0 w-24 h-24"
          animate={{
            opacity: isHovered ? 1 : 0.5,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-gold/20">
            <path d="M100 0 L100 100 L0 100 Q100 100 100 0" fill="currentColor" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Ingredients() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  
  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-32 px-6 overflow-hidden">
      {/* Parallax Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,165,116,0.3) 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }} />
      </motion.div>
      
      {/* Large Background Text */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-heading font-bold text-white/[0.02] whitespace-nowrap pointer-events-none select-none"
        style={{ y: backgroundY }}
      >
        INGREDIENTS
      </motion.div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
      
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
            NATURE'S FINEST
          </motion.span>
          <motion.h2 
            className="font-heading text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            POWERFUL INGREDIENTS
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Each ingredient is carefully selected for maximum potency and bioavailability
          </motion.p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>
        
        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {ingredients.map((ingredient, index) => (
            <IngredientCard 
              key={index} 
              ingredient={ingredient} 
              index={index} 
              onLearnMore={setSelectedIngredient}
            />
          ))}
        </div>
      </div>
      
      {/* Modal */}
      <IngredientModal
        ingredient={selectedIngredient}
        isOpen={!!selectedIngredient}
        onClose={() => setSelectedIngredient(null)}
      />
    </section>
  )
}
