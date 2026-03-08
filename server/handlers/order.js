import { submitOrder } from '../../lib/googleAppsScript.js'
import { createJsonResponse } from '../http.js'

const FIELD_LIMITS = {
  fullName: 80,
  phone: 40,
  email: 120,
  deliveryAddress: 300,
  productSku: 80,
  paymentMethod: 40,
  paymentConfirmationCode: 160,
  quantity: 4,
  notes: 500,
  website: 120,
}

const PAYMENT_METHODS = {
  juice: {
    label: 'Juice',
    requiresConfirmation: true,
  },
  bank_transfer: {
    label: 'Local Bank Transfer',
    requiresConfirmation: true,
  },
  cash_on_delivery: {
    label: 'Cash on Delivery',
    requiresConfirmation: false,
  },
}

function sanitize(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\r\n/g, '\n').slice(0, maxLength)
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function createOrderId() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PHY-${stamp}-${suffix}`
}

async function sendTelegramNotification(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) return

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })

  if (!response.ok) {
    throw new Error('Telegram notification failed.')
  }
}

async function sendEmailNotification(order) {
  const resendApiKey = process.env.RESEND_API_KEY
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL
  const fromEmail = process.env.ORDER_FROM_EMAIL

  if (!resendApiKey || !notificationEmail || !fromEmail) return

  const recipients = notificationEmail
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  const text = [
    `New Phytomax order: ${order.orderId}`,
    '',
    `Product: ${order.productName} (${order.productSku})`,
    `Quantity: ${order.quantity}`,
    `Unit price: MUR ${order.unitPriceMUR}`,
    `Total: MUR ${order.totalPriceMUR}`,
    `Payment method: ${order.paymentMethod}`,
    `Payment confirmation code: ${order.paymentConfirmationCode || 'Not required'}`,
    `Customer: ${order.fullName}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email || 'Not provided'}`,
    `Delivery address: ${order.deliveryAddress}`,
    `Notes: ${order.notes || 'None'}`,
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 16px;">New Phytomax order: ${escapeHtml(order.orderId)}</h2>
      <p><strong>Product:</strong> ${escapeHtml(order.productName)} (${escapeHtml(order.productSku)})</p>
      <p><strong>Quantity:</strong> ${order.quantity}</p>
      <p><strong>Unit price:</strong> MUR ${order.unitPriceMUR}</p>
      <p><strong>Total:</strong> MUR ${order.totalPriceMUR}</p>
      <p><strong>Payment method:</strong> ${escapeHtml(order.paymentMethod)}</p>
      <p><strong>Payment confirmation code:</strong><br>${escapeHtml(order.paymentConfirmationCode || 'Not required')}</p>
      <p><strong>Customer:</strong> ${escapeHtml(order.fullName)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(order.email || 'Not provided')}</p>
      <p><strong>Delivery address:</strong><br>${escapeHtml(order.deliveryAddress).replace(/\n/g, '<br>')}</p>
      <p><strong>Notes:</strong><br>${escapeHtml(order.notes || 'None').replace(/\n/g, '<br>')}</p>
    </div>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: recipients,
      subject: `New Phytomax order ${order.orderId}`,
      text,
      html,
      reply_to: order.email || undefined,
    }),
  })

  if (!response.ok) {
    throw new Error('Email notification failed.')
  }
}

export async function handleOrderRequest(request) {
  if (request.method !== 'POST') {
    return createJsonResponse(405, { error: 'Method not allowed.' }, { Allow: 'POST' })
  }

  const orderInput = {
    fullName: sanitize(request.body?.fullName, FIELD_LIMITS.fullName),
    phone: sanitize(request.body?.phone, FIELD_LIMITS.phone),
    email: sanitize(request.body?.email, FIELD_LIMITS.email),
    deliveryAddress: sanitize(request.body?.deliveryAddress, FIELD_LIMITS.deliveryAddress),
    productSku: sanitize(request.body?.productSku, FIELD_LIMITS.productSku),
    paymentMethod: sanitize(request.body?.paymentMethod, FIELD_LIMITS.paymentMethod),
    paymentConfirmationCode: sanitize(request.body?.paymentConfirmationCode, FIELD_LIMITS.paymentConfirmationCode),
    quantity: sanitize(request.body?.quantity, FIELD_LIMITS.quantity),
    notes: sanitize(request.body?.notes, FIELD_LIMITS.notes),
    website: sanitize(request.body?.website, FIELD_LIMITS.website),
  }

  if (orderInput.website) {
    return createJsonResponse(200, { message: 'Order received.' })
  }

  const missingField = [
    ['fullName', 'Full name'],
    ['phone', 'Phone number'],
    ['deliveryAddress', 'Delivery address'],
    ['productSku', 'Product'],
    ['paymentMethod', 'Payment method'],
    ['quantity', 'Quantity'],
  ].find(([key]) => !orderInput[key])

  if (missingField) {
    return createJsonResponse(400, { error: `${missingField[1]} is required.` })
  }

  const quantity = Number.parseInt(orderInput.quantity, 10)

  if (!Number.isInteger(quantity) || quantity < 1) {
    return createJsonResponse(400, { error: 'Quantity must be at least 1.' })
  }

  const paymentMethod = PAYMENT_METHODS[orderInput.paymentMethod]

  if (!paymentMethod) {
    return createJsonResponse(400, { error: 'Select a valid payment method.' })
  }

  if (paymentMethod.requiresConfirmation && !orderInput.paymentConfirmationCode) {
    return createJsonResponse(400, {
      error: `${paymentMethod.label} requires a payment confirmation code.`,
    })
  }

  try {
    const savedOrder = await submitOrder({
      orderId: createOrderId(),
      createdAt: new Date().toISOString(),
      status: 'new',
      productSku: orderInput.productSku,
      quantity,
      paymentMethod: orderInput.paymentMethod,
      paymentConfirmationCode: orderInput.paymentConfirmationCode,
      fullName: orderInput.fullName,
      phone: orderInput.phone,
      email: orderInput.email,
      deliveryAddress: orderInput.deliveryAddress,
      notes: orderInput.notes,
    })

    const notificationMessage = [
      `New Phytomax order ${savedOrder.orderId}`,
      `Product: ${savedOrder.productName}`,
      `Quantity: ${savedOrder.quantity}`,
      `Total: MUR ${savedOrder.totalPriceMUR}`,
      `Payment method: ${savedOrder.paymentMethod}`,
      `Payment confirmation: ${savedOrder.paymentConfirmationCode || 'Not required'}`,
      `Customer: ${savedOrder.fullName}`,
      `Phone: ${savedOrder.phone}`,
    ].join('\n')

    const notificationResults = await Promise.allSettled([
      sendTelegramNotification(notificationMessage),
      sendEmailNotification(savedOrder),
    ])

    notificationResults.forEach((result) => {
      if (result.status === 'rejected') {
        console.error(result.reason)
      }
    })

    return createJsonResponse(200, {
      message: `Order ${savedOrder.orderId} received. We will contact you shortly to confirm delivery.`,
    })
  } catch (error) {
    return createJsonResponse(error.statusCode || 500, {
      error: error.message || 'We could not submit your order right now.',
    })
  }
}
