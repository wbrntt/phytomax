import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Ingredients from './components/Ingredients'
import TrustSection from './components/TrustSection'
import CTABanner from './components/CTABanner'
import OrderForm from './components/OrderForm'
import Footer from './components/Footer'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { ORDER_FORM_HASH, scrollToOrderForm } from './lib/orderFormLink'

function HashScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash !== ORDER_FORM_HASH) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToOrderForm({ updateHash: false })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [location.hash, location.pathname])

  return null
}

function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <section id="benefits">
          <Benefits />
        </section>
        <Ingredients />
        <TrustSection />
        <CTABanner />
        <OrderForm />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <HashScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
