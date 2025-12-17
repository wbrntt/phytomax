import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Ingredients from './components/Ingredients'
import TrustSection from './components/TrustSection'
import CTABanner from './components/CTABanner'
import Footer from './components/Footer'

function App() {
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
      </main>
      <Footer />
    </div>
  )
}

export default App
