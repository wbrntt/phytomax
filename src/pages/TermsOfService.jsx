import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            to="/"
            className="font-heading text-2xl font-bold text-gold tracking-wider hover:opacity-80 transition-opacity"
          >
            PHYTOMAX
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-4xl font-bold text-gold mb-8">Terms of Service</h1>
          <p className="text-gray-400 mb-12">Last updated: December 2024</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Phytomax website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Products and Services</h2>
              <p>
                Phytomax offers natural dietary supplements designed to support men's health and vitality. Our products are registered with SAHPRA (South African Health Products Regulatory Authority) and comply with all applicable regulations in Mauritius.
              </p>
              <p className="mt-4">
                Our supplements are not intended to diagnose, treat, cure, or prevent any disease. Always consult with a healthcare professional before starting any supplement regimen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Orders and Payment</h2>
              <p>
                All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order. Payment must be made in full before dispatch of products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Shipping and Delivery</h2>
              <p>
                We offer delivery services within Mauritius. Delivery times may vary depending on your location. We are not responsible for delays caused by circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Returns and Refunds</h2>
              <p>
                Due to the nature of our products, we can only accept returns for unopened items in their original packaging within 14 days of purchase. Please contact us via Messenger to initiate a return.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images, is the property of Phytomax Mauritius and is protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                Phytomax shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Individual results may vary.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">9. Contact Us</h2>
              <p>
                For any questions regarding these Terms of Service, please contact us through our{' '}
                <a href="https://m.me/61584867212520" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">
                  Facebook Messenger
                </a>.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gold hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
