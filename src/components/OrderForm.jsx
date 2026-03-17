import { motion, useInView } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getApiUrl } from '../lib/api'

const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined
const paymentCompanyName = ((viteEnv && viteEnv.VITE_PAYMENT_COMPANY_NAME) || 'Phytomax Mauritius').trim()
const mcbAccountNumber = ((viteEnv && viteEnv.VITE_MCB_ACCOUNT_NUMBER) || '').trim()

const initialFormData = {
  fullName: '',
  phone: '',
  email: '',
  deliveryAddress: '',
  productSku: '',
  paymentMethod: 'juice',
  paymentConfirmationCode: '',
  quantity: '1',
  notes: '',
  website: '',
}

const paymentOptions = [
  {
    value: 'juice',
    title: 'Juice',
    description: 'Pay instantly with Juice and enter your payment reference at checkout.',
    confirmationLabel: 'Juice Payment Reference',
    confirmationPlaceholder: 'Paste your Juice payment reference',
    requiresConfirmation: true,
  },
  {
    value: 'bank_transfer',
    title: 'Local Bank Transfer',
    description: 'Transfer to our MCB account and enter your payment reference at checkout.',
    confirmationLabel: 'Bank Transfer Reference',
    confirmationPlaceholder: 'Paste your bank transfer reference',
    requiresConfirmation: true,
  },
  {
    value: 'cash_on_delivery',
    title: 'Cash on Delivery',
    description: 'Keep it simple and pay when your order arrives.',
    confirmationLabel: '',
    confirmationPlaceholder: '',
    requiresConfirmation: false,
  },
]

const orderSteps = [
  {
    title: 'Choose your product',
    description: 'Choose the formula that fits you best and select your quantity.',
  },
  {
    title: 'Choose your payment',
    description: 'Choose the payment option that suits you best.',
  },
  {
    title: 'Complete your order',
    description: 'Prepaid orders only need a payment reference so we can confirm everything quickly.',
  },
]

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-MU', {
    style: 'currency',
    currency: 'MUR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function toCustomerFacingMessage(message, fallbackMessage) {
  const normalizedMessage = String(message || '').trim()

  if (!normalizedMessage) {
    return fallbackMessage
  }

  if (/google apps script|catalog|configured|deployment|publicly accessible|non-json|request failed|request timed out/i.test(normalizedMessage)) {
    return fallbackMessage
  }

  return normalizedMessage
}

export default function OrderForm() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState(initialFormData)
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true)
    setCatalogError('')

    try {
      const response = await fetch(getApiUrl('products'), {
        headers: {
          Accept: 'application/json',
        },
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          toCustomerFacingMessage(
            result.error,
            'Products are temporarily unavailable. Please try again in a moment.',
          ),
        )
      }

      setProducts(Array.isArray(result.products) ? result.products : [])
    } catch (error) {
      setProducts([])
      setCatalogError(
        toCustomerFacingMessage(
          error.message,
          'Products are temporarily unavailable. Please try again in a moment.',
        ),
      )
    } finally {
      setIsLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    if (!products.length) {
      return
    }

    const firstAvailableProduct = products.find((product) => product.available) || products[0]

    setFormData((current) => {
      const selectedProduct = products.find((product) => product.sku === current.productSku)
      const nextProduct = selectedProduct?.available ? selectedProduct : firstAvailableProduct
      const normalizedQuantity = String(Math.max(Number.parseInt(current.quantity, 10) || 1, 1))

      if (
        current.productSku === nextProduct?.sku &&
        current.quantity === normalizedQuantity
      ) {
        return current
      }

      return {
        ...current,
        productSku: nextProduct?.sku || '',
        quantity: normalizedQuantity,
      }
    })
  }, [products])

  const selectedProduct = useMemo(
    () => products.find((product) => product.sku === formData.productSku) || null,
    [products, formData.productSku],
  )
  const selectedPaymentOption = useMemo(
    () => paymentOptions.find((option) => option.value === formData.paymentMethod) || paymentOptions[0],
    [formData.paymentMethod],
  )
  const paymentRequiresConfirmation = selectedPaymentOption.requiresConfirmation

  const orderTotal = selectedProduct ? selectedProduct.priceMUR * (Number.parseInt(formData.quantity, 10) || 1) : 0
  const hasAvailableProducts = products.some((product) => product.available)

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'quantity') {
      const digitsOnly = value.replace(/[^0-9]/g, '')
      setFormData((current) => ({
        ...current,
        quantity: digitsOnly ? String(Math.max(Number.parseInt(digitsOnly, 10), 1)) : '',
      }))
      return
    }

    if (name === 'paymentMethod') {
      setFormData((current) => ({
        ...current,
        paymentMethod: value,
        paymentConfirmationCode: '',
      }))
      return
    }

    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: 'idle', message: '' })

    try {
      const response = await fetch(getApiUrl('order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: formData.quantity || '1',
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          toCustomerFacingMessage(
            result.error,
            'We could not place your order right now. Please try again in a moment.',
          ),
        )
      }

      setStatus({
        type: 'success',
        message: result.message || 'Your order is in. We will contact you shortly to confirm delivery.',
      })
      setFormData(initialFormData)
      await loadProducts()
    } catch (error) {
      setStatus({
        type: 'error',
        message: toCustomerFacingMessage(
          error.message,
          'We could not place your order right now. Please try again in a moment.',
        ),
      })
      await loadProducts()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="order-form"
      ref={sectionRef}
      className="relative scroll-mt-32 overflow-hidden bg-black px-6 py-24 md:py-28"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(195,159,47,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(195,159,47,0.12),_transparent_30%)]" />
        <div className="absolute left-[-8%] top-12 h-64 w-64 rounded-full bg-[#c39f2f]/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-6%] h-72 w-72 rounded-full bg-[#c39f2f]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="lg:sticky lg:top-28"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c39f2f]/30 bg-[#c39f2f]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f1d883]">
            Simple Ordering
          </span>

          <h2 className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl">
            Order Phytomax in just a few steps.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/72 md:text-lg">
            Choose your product, pick your preferred payment method, and complete your order for fast confirmation and delivery.
          </p>

          <div className="mt-8 space-y-4">
            {orderSteps.map((step, index) => (
              <motion.div
                key={step.title}
                className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm"
                initial={{ opacity: 0, x: -18 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c39f2f] text-sm font-bold text-black">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c39f2f]/50 to-transparent" />

          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#f1d883]">Secure checkout</p>
              <h3 className="mt-3 font-heading text-3xl font-bold text-white">Order Now</h3>
            </div>
            <div className="rounded-2xl border border-[#c39f2f]/20 bg-[#c39f2f]/10 px-4 py-3 text-right text-xs font-medium text-white/70">
              Mauritius delivery only
            </div>
          </div>

          {catalogError && (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {catalogError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              autoComplete="off"
              tabIndex={-1}
              className="hidden"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-white">Full Name</span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  maxLength={80}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#c39f2f] focus:ring-2 focus:ring-[#c39f2f]/30"
                  placeholder="Your full name"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-white">Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={40}
                  inputMode="tel"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#c39f2f] focus:ring-2 focus:ring-[#c39f2f]/30"
                  placeholder="e.g. +230 5XXX XXXX"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-[1.25fr_0.75fr]">
              <label className="space-y-2">
                <span className="text-sm font-medium text-white">Product</span>
                <select
                  name="productSku"
                  value={formData.productSku}
                  onChange={handleChange}
                  required
                  disabled={isLoadingProducts || !products.length}
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#c39f2f] focus:ring-2 focus:ring-[#c39f2f]/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingProducts && <option value="">Loading products...</option>}
                  {!isLoadingProducts && !products.length && <option value="">No products currently in stock</option>}
                  {!isLoadingProducts && products.map((product) => (
                    <option key={product.sku} value={product.sku} disabled={!product.available}>
                      {product.name}{!product.available ? ' (Out of stock)' : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-white">Quantity</span>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  disabled={!selectedProduct || !selectedProduct.available}
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#c39f2f] focus:ring-2 focus:ring-[#c39f2f]/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f1d883]">Your selection</p>
                  <h4 className="mt-2 font-heading text-2xl font-bold text-white">
                    {selectedProduct?.name || 'Choose a product'}
                  </h4>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/65">
                    {selectedProduct?.description || (products.length
                      ? 'Select a product to view details.'
                      : 'Please check back later for the next restock.')}
                  </p>
                </div>

                <div className="grid gap-2 rounded-2xl border border-[#c39f2f]/20 bg-[#c39f2f]/10 px-4 py-4 text-sm text-white/75 md:min-w-[220px]">
                  <div className="flex items-center justify-between gap-4">
                    <span>Unit price</span>
                    <strong className="text-white">{selectedProduct ? formatCurrency(selectedProduct.priceMUR) : '-'}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Stock status</span>
                    <strong className="text-white">
                      {selectedProduct ? (selectedProduct.available ? 'In stock' : 'Out of stock') : '-'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-2">
                    <span>Estimated total</span>
                    <strong className="text-white">{selectedProduct ? formatCurrency(orderTotal) : '-'}</strong>
                  </div>
                </div>
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-white">Email Address (optional)</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={120}
                className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#c39f2f] focus:ring-2 focus:ring-[#c39f2f]/30"
                placeholder="name@example.com"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-white">Delivery Address</span>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                maxLength={300}
                required
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#c39f2f] focus:ring-2 focus:ring-[#c39f2f]/30"
                placeholder="Street, area, district, and any delivery landmarks"
              />
            </label>

            <div className="space-y-3">
              <span className="text-sm font-medium text-white">Payment Method</span>
              <div className="grid gap-3 md:grid-cols-3">
                {paymentOptions.map((option) => {
                  const isSelected = formData.paymentMethod === option.value

                  return (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-2xl border px-4 py-4 transition ${
                        isSelected
                          ? 'border-[#c39f2f] bg-[#c39f2f]/12'
                          : 'border-white/10 bg-black/25 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={isSelected}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <p className="text-sm font-semibold text-white">{option.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">{option.description}</p>
                    </label>
                  )
                })}
              </div>
            </div>

            {formData.paymentMethod !== 'cash_on_delivery' && (
              <div className="rounded-2xl border border-[#c39f2f]/20 bg-[#c39f2f]/10 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f1d883]">
                      {selectedPaymentOption.title} payment details
                    </p>
                    <h4 className="mt-2 font-heading text-2xl font-bold text-white">Pay to this MCB account</h4>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                      Use the company name and account number below, then enter your payment reference to complete your order.
                    </p>
                  </div>

                  <div className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/75 md:max-w-[420px]">
                    <div className="grid gap-3">
                      <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                          Company name
                        </p>
                        <p className="mt-2 break-words text-base font-semibold text-white">
                          {paymentCompanyName}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                          MCB account number
                        </p>
                        <p className="mt-2 break-all text-base font-semibold text-white">
                          {mcbAccountNumber || 'Account number available on request'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentRequiresConfirmation ? (
              <label className="space-y-2">
                <span className="text-sm font-medium text-white">{selectedPaymentOption.confirmationLabel}</span>
                <input
                  type="text"
                  name="paymentConfirmationCode"
                  value={formData.paymentConfirmationCode}
                  onChange={handleChange}
                  maxLength={160}
                  required={paymentRequiresConfirmation}
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#c39f2f] focus:ring-2 focus:ring-[#c39f2f]/30"
                  placeholder={selectedPaymentOption.confirmationPlaceholder}
                />
                <p className="text-sm leading-relaxed text-white/55">
                  Enter your payment reference exactly as shown so we can confirm your order quickly.
                </p>
              </label>
            ) : (
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-relaxed text-white/60">
                No payment reference is needed for cash on delivery. You can pay when your order arrives.
              </div>
            )}

            <label className="space-y-2">
              <span className="text-sm font-medium text-white">Notes (optional)</span>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                maxLength={500}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#c39f2f] focus:ring-2 focus:ring-[#c39f2f]/30"
                placeholder="Preferred delivery time, landmark, or any extra instructions"
              />
            </label>

            {!hasAvailableProducts && !isLoadingProducts && !catalogError && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-100">
                There are currently no products in stock.
              </div>
            )}

            {status.type !== 'idle' && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  status.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    : 'border-red-500/30 bg-red-500/10 text-red-200'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting || isLoadingProducts || !selectedProduct || !selectedProduct.available}
                className="inline-flex items-center justify-center gap-3 rounded-2xl btn-gold-primary px-6 py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14l-1 11H6L5 8zm4-3a3 3 0 016 0v3H9V5z" />
                </svg>
                {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
              </button>

              <p className="max-w-sm text-sm leading-relaxed text-white/55">
                By placing your order, you confirm that your product, quantity, and payment details are correct.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
