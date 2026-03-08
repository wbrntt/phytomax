import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function CTABanner() {
  const orderFormLink = "#order-form"
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  
  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-[#c39f2f]"
        style={{ 
          backgroundSize: '200% 100%',
          x: backgroundX,
        }}
      />
      
      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>
      
      {/* Floating Shapes */}
      <motion.div
        className="absolute top-10 left-[10%] w-20 h-20 border border-black/10 rounded-full"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-10 right-[15%] w-32 h-32 border border-black/10 rounded-full"
        animate={{
          y: [0, 20, 0],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 right-[5%] w-16 h-16 bg-black/5 rounded-lg"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 left-[5%] w-12 h-12 bg-black/5 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={{
          translateX: ['100%', '-100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
      />
      
      <motion.div 
        className="relative max-w-4xl mx-auto text-center"
        style={{ scale }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-black"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-black">Limited Time Offer</span>
        </motion.div>
        
        {/* Heading */}
        <motion.h2 
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          GET YOUR{' '}
          <motion.span
            className="relative inline-block"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            PHYTOMAX
            <motion.svg
              className="absolute -bottom-2 left-0 w-full h-3"
              viewBox="0 0 200 12"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.path
                d="M0 8 Q50 0 100 8 T200 8"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          </motion.span>
          {' '}TODAY
        </motion.h2>
        
        {/* Subheading */}
        <motion.p 
          className="text-black/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Fill in the order form, choose Juice, bank transfer, or cash on delivery, and add a confirmation code for prepaid orders.
        </motion.p>
        
        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.a 
            href={orderFormLink}
            className="group relative inline-flex items-center justify-center gap-3 bg-black text-white font-bold px-10 py-5 rounded-xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <svg className="relative w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14l-1 11H6L5 8zm4-3a3 3 0 016 0v3H9V5z" />
            </svg>
            <span className="relative text-lg">Open Order Form</span>
            <motion.div
              className="absolute inset-0 border-2 border-white/20 rounded-xl"
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.a>
        </motion.div>
        
        {/* Trust Indicators */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-6 text-black/60 text-sm"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {['Fast Delivery', 'Secure Payment', 'Money Back Guarantee'].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            >
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
