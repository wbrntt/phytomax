import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
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
          <h1 className="font-heading text-4xl font-bold text-gold mb-8">Privacy Policy</h1>
          <p className="text-gray-400 mb-12">Last updated: December 2024</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>
                When you interact with Phytomax, we may collect the following information:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                <li>Contact information (name, phone number, delivery address)</li>
                <li>Order history and preferences</li>
                <li>Communication records through Messenger</li>
                <li>Website usage data (cookies, browsing patterns)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>
                We use your personal information to:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate about your orders and inquiries</li>
                <li>Improve our products and services</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Data Protection</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and accessed only by authorized personnel.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Third-Party Sharing</h2>
              <p>
                We do not sell your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                <li>Delivery partners to fulfill your orders</li>
                <li>Payment processors for secure transactions</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Cookies</h2>
              <p>
                Our website uses cookies to enhance your browsing experience. Cookies help us understand how you use our site and enable certain features. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with relevant authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">9. Contact Us</h2>
              <p>
                For any questions about this Privacy Policy or to exercise your rights, please contact us through our{' '}
                <a href="https://m.me/phytomaxmu" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">
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
