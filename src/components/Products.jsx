import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import goldProductImage from '../assets/phytogold.png'
import redProductImage from '../assets/phyto red.png'
import { getApiUrl } from '../lib/api'
import { ORDER_FORM_LINK, handleOrderFormLinkClick } from '../lib/orderFormLink'

const products = [
  {
    id: 'max',
    sku: 'red',
    name: 'Phyto Max',
    variant: 'Red formula',
    fallbackPriceMUR: 70,
    image: redProductImage,
    accent: 'from-rose-500/[0.22] via-orange-500/[0.16] to-gold/[0.16]',
    border: 'border-rose-500/20',
    glow: 'bg-rose-500/20',
    capsuleBadge: '500mg capsules',
    dosageForm: '500mg Capsules',
    identification: 'Red capsule printed with "PHYTO MAX for men".',
    summary:
      'A compact Tongkat Ali and Horny Goat Weed blend positioned for rapid vitality support.',
    action:
      'Phyto Max is made from pure natural raw material extracts, is rapidly absorbed by the body, and becomes effective within 30 minutes after consumption.',
    indication:
      'Enhances sexual vitality and helps to alleviate the symptoms of erectile dysfunction.',
    composition: [
      '300mg Eurycoma Longifolia (Tongkat Ali) [Root powder]',
      '200mg Epimedium (Horny Goat Weed) [Leaf extract]',
    ],
    badges: ['100% natural ingredients', 'Sugar free', 'Unscheduled Grade CO'],
    administration: 'Orally',
    directions: 'Take 1 to 2 capsules 30 minutes before the need of an erection.',
    warnings: ['Keep out of the reach of children.', 'Use only as indicated.'],
    sideEffects:
      'There are no known side effects for this product. If symptoms persist, please consult your doctor.',
    overdose: 'There are no known symptoms of overdose.',
    presentation: 'Individually packed capsules in an air-tight foil pouch.',
    storage:
      'Store below 25 degrees Celsius in a dry place. Protect from direct sunlight.',
    disclaimer:
      'Phyto Max is not intended to diagnose, treat, cure, or prevent any disease.',
  },
  {
    id: 'gold',
    sku: 'gold',
    name: 'Phyto Gold',
    variant: 'Gold formula',
    fallbackPriceMUR: 140,
    image: goldProductImage,
    accent: 'from-amber-300/20 via-gold/[0.18] to-yellow-100/[0.12]',
    border: 'border-gold/25',
    glow: 'bg-gold/20',
    capsuleBadge: '2 x 500mg capsules',
    dosageForm: '2 x 500mg Capsules',
    identification: '2 x gold colored capsules printed with "PHYTO Gold for men".',
    summary:
      'A broader three-ingredient blend that adds Saw Palmetto to the Tongkat Ali and Horny Goat Weed base.',
    action:
      'Phyto Gold is made from pure natural raw material extracts, is rapidly absorbed by the body, and becomes effective within 30 minutes after consumption.',
    indication:
      'Enhances sexual vitality and helps to alleviate the symptoms of erectile dysfunction.',
    composition: [
      '200mg Eurycoma Longifolia (Tongkat Ali) [Root powder]',
      '150mg Serenoa repens (Saw Palmetto) [Dried berry extract]',
      '100mg Epimedium (Horny Goat Weed) [Leaf extract]',
    ],
    badges: ['100% natural ingredients', 'Sugar free', 'Unscheduled Grade CO'],
    administration: 'Orally',
    directions: 'Take 1 to 2 capsules 30 minutes before the need of an erection.',
    warnings: ['Keep out of the reach of children.', 'Use only as indicated.'],
    sideEffects:
      'There are no known side effects for this product. If symptoms persist, please consult your doctor.',
    overdose: 'There are no known symptoms of overdose.',
    presentation: 'Individually packed capsules in an air-tight foil pouch.',
    storage:
      'Store below 25 degrees Celsius in a dry place. Protect from direct sunlight.',
    disclaimer:
      'Phyto Gold is not intended to diagnose, treat, cure, or prevent any disease.',
  },
]

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-MU', {
    style: 'currency',
    currency: 'MUR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function DetailBlock({ eyebrow, title, children }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-black/[0.25] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f1d883]">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-heading text-2xl font-bold text-white">{title}</h3>
      <div className="mt-4 text-sm leading-relaxed text-white/[0.68]">{children}</div>
    </div>
  )
}

function ProductModal({ product, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const originalOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && product ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#050505] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
              role="dialog"
              aria-modal="true"
              aria-label={`${product.name} details`}
              initial={{ y: 32, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${product.accent} opacity-50`} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white transition hover:bg-white/[0.12]"
                aria-label={`Close ${product.name} details`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative max-h-[88vh] overflow-y-auto p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
                  <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/[0.72]">
                        {product.variant}
                      </span>
                    </div>

                    <div className="relative mt-6 overflow-hidden rounded-[26px] border border-white/[0.08] bg-black/[0.45] px-4 py-6">
                      <div className={`absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${product.glow}`} />
                      <img
                        src={product.image}
                        alt={`${product.name} pack shot`}
                        className="relative mx-auto h-64 w-auto object-contain md:h-80"
                      />
                    </div>

                    <div className="mt-6 rounded-[26px] border border-white/10 bg-black/[0.35] p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f1d883]">
                        Price
                      </p>
                      <div className="mt-3 flex items-end justify-between gap-4">
                        <p className="font-heading text-4xl font-bold text-white">{product.priceLabel}</p>
                        <p className="text-right text-xs font-medium uppercase tracking-[0.22em] text-white/[0.45]">Per pack</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {product.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/[0.68]"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f1d883]">
                      Overview
                    </p>
                    <h2 className="mt-3 font-heading text-4xl font-bold text-white md:text-5xl">
                      {product.name}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/[0.72]">
                      {product.summary}
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      {[
                        { label: 'Dosage form', value: product.dosageForm },
                        { label: 'Administration', value: product.administration },
                        { label: 'Identification', value: product.identification },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f1d883]">
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-white/[0.72]">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <DetailBlock eyebrow="Action" title="How It Is Positioned">
                        <p>{product.action}</p>
                        <p className="mt-3">{product.indication}</p>
                      </DetailBlock>

                      <DetailBlock eyebrow="Directions" title="Use & Precautions">
                        <p><strong className="text-white">Dosage:</strong> {product.directions}</p>
                        <p className="mt-3"><strong className="text-white">Warnings:</strong> {product.warnings.join(' ')}</p>
                        <p className="mt-3"><strong className="text-white">Side effects:</strong> {product.sideEffects}</p>
                        <p className="mt-3"><strong className="text-white">Overdose:</strong> {product.overdose}</p>
                      </DetailBlock>

                      <DetailBlock eyebrow="Composition" title="Each Capsule Contains">
                        <ul className="space-y-3">
                          {product.composition.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f1d883]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </DetailBlock>

                      <DetailBlock eyebrow="Handling" title="Storage & Presentation">
                        <p><strong className="text-white">Presentation:</strong> {product.presentation}</p>
                        <p className="mt-3"><strong className="text-white">Storage:</strong> {product.storage}</p>
                        <p className="mt-3"><strong className="text-white">Scheduling status:</strong> Unscheduled, Grade CO (Food supplement)</p>
                      </DetailBlock>
                    </div>

                    <div className="mt-4 rounded-[26px] border border-white/10 bg-black/[0.28] p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f1d883]">
                        Disclaimer
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-white/[0.62]">
                        This product should not be used to diagnose, treat, mitigate, or prevent
                        disease or modify organic function in man. {product.disclaimer}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={ORDER_FORM_LINK}
                        onClick={(event) => {
                          handleOrderFormLinkClick(event)
                          onClose()
                        }}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl btn-gold-primary px-6 py-4 text-base font-bold"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14l-1 11H6L5 8zm4-3a3 3 0 016 0v3H9V5z" />
                        </svg>
                        Start Order
                      </a>
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-2xl border border-white/[0.12] bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                      >
                        Continue Browsing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default function Products() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-120px' })
  const [catalogProductsBySku, setCatalogProductsBySku] = useState({})
  const [selectedProductId, setSelectedProductId] = useState(null)

  useEffect(() => {
    let ignore = false

    const loadCatalogProducts = async () => {
      try {
        const response = await fetch(getApiUrl('products'), {
          headers: {
            Accept: 'application/json',
          },
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(result.error || 'We could not load the product catalog right now.')
        }

        const nextCatalogProductsBySku = Object.fromEntries(
          (Array.isArray(result.products) ? result.products : []).map((product) => [
            String(product.sku || '').toLowerCase(),
            product,
          ]),
        )

        if (!ignore) {
          setCatalogProductsBySku(nextCatalogProductsBySku)
        }
      } catch {
        if (!ignore) {
          setCatalogProductsBySku({})
        }
      }
    }

    loadCatalogProducts()

    return () => {
      ignore = true
    }
  }, [])

  const displayProducts = useMemo(
    () => products.map((product) => {
      const catalogProduct = catalogProductsBySku[product.sku]
      const livePriceMUR = Number(catalogProduct?.priceMUR)
      const priceMUR = Number.isFinite(livePriceMUR) ? livePriceMUR : product.fallbackPriceMUR

      return {
        ...product,
        priceMUR,
        priceLabel: formatCurrency(priceMUR),
      }
    }),
    [catalogProductsBySku],
  )

  const selectedProduct = useMemo(
    () => displayProducts.find((product) => product.id === selectedProductId) || null,
    [displayProducts, selectedProductId],
  )

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(209,145,45,0.18),_transparent_28%),linear-gradient(180deg,_#050505_0%,_#120905_52%,_#181109_100%)] px-6 py-24 md:py-28"
    >
      <div className="absolute inset-0">
        <div className="absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-gold/[0.08] blur-[110px]" />
        <div className="absolute bottom-0 right-[-10%] h-80 w-80 rounded-full bg-rose-500/[0.08] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '54px 54px',
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f1d883]/20 bg-[#f1d883]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f1d883]">
            Choose Your Formula
          </span>
          <h2 className="mt-6 font-heading text-4xl font-bold text-white md:text-5xl">
            Natural support, tailored to the formula you prefer.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
            Explore both options, compare the active blend, and open the full breakdown for dosage,
            directions, and detailed product information.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {displayProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className={`group relative overflow-hidden rounded-[36px] border ${product.border} bg-[linear-gradient(180deg,rgba(27,18,13,0.96),rgba(16,11,8,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-sm md:p-8`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${product.accent} opacity-60`} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
              <div className="absolute left-8 top-8 h-28 w-28 rounded-full bg-white/[0.04] blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <span className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f1d883]">
                    {product.variant}
                  </span>

                  <div className="rounded-[24px] border border-white/10 bg-black/[0.32] px-5 py-4 text-right shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f1d883]">
                      Price
                    </p>
                    <p className="mt-2 font-heading text-4xl font-bold leading-none text-white">
                      {product.priceLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-heading text-4xl font-bold text-white md:text-5xl">
                    {product.name}
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/[0.72] md:text-lg">
                    {product.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/[0.12] bg-black/[0.22] px-3 py-1.5 text-xs font-medium text-white/[0.72]">
                      {product.capsuleBadge}
                    </span>
                    {product.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-white/[0.12] bg-black/[0.22] px-3 py-1.5 text-xs font-medium text-white/[0.72]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(0,0,0,0.18))] px-6 py-8 md:px-8">
                    <div className={`absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${product.glow}`} />
                    <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <div className="relative flex min-h-[240px] items-center justify-center md:min-h-[280px]">
                      <img
                        src={product.image}
                        alt={`${product.name} pack shot`}
                        className="w-full max-w-[16rem] object-contain drop-shadow-[0_32px_50px_rgba(0,0,0,0.38)] transition duration-500 group-hover:scale-[1.03] md:max-w-[18rem]"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-sm leading-relaxed text-white/[0.58]">
                      Open the full details for ingredients, dosage, directions, storage, and precautions.
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedProductId(product.id)}
                      className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#f1d883]/25 bg-[#f1d883]/12 px-5 py-3.5 text-sm font-semibold text-[#f8e7a3] transition hover:bg-[#f1d883]/18"
                    >
                      View Full Details
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProductId(null)}
      />
    </section>
  )
}
