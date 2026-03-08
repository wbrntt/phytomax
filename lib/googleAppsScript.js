const REQUEST_TIMEOUT_MS = 12000

export class AppsScriptError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.name = 'AppsScriptError'
    this.statusCode = statusCode
  }
}

function getAppsScriptConfig() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET

  if (!url || !secret) {
    throw new AppsScriptError(
      'Google Apps Script is not configured. Add GOOGLE_APPS_SCRIPT_URL and GOOGLE_APPS_SCRIPT_SECRET.',
      500,
    )
  }

  return { url, secret }
}

function createTimeoutSignal() {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  }

  return undefined
}

async function parseJsonResponse(response) {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new AppsScriptError('Google Apps Script returned an invalid response.', 502)
  }
}

async function callAppsScript(action, payload = {}) {
  const { url, secret } = getAppsScriptConfig()

  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        secret,
        ...payload,
      }),
      signal: createTimeoutSignal(),
    })
  } catch (error) {
    if (error?.name === 'AbortError' || error?.name === 'TimeoutError') {
      throw new AppsScriptError('Google Apps Script request timed out.', 504)
    }

    throw new AppsScriptError('Google Apps Script request failed.', 502)
  }

  const result = await parseJsonResponse(response)

  if (!response.ok) {
    throw new AppsScriptError(result.error || 'Google Apps Script request failed.', response.status)
  }

  if (result.ok === false) {
    throw new AppsScriptError(
      result.error || 'Google Apps Script request failed.',
      Number.isInteger(result.code) ? result.code : 500,
    )
  }

  return result
}

export async function getProducts() {
  const result = await callAppsScript('products')

  if (!Array.isArray(result.products)) {
    throw new AppsScriptError('Google Apps Script returned an invalid product catalog.', 502)
  }

  return result.products
}

export async function submitOrder(order) {
  const result = await callAppsScript('order', { order })

  if (!result.order || typeof result.order !== 'object') {
    throw new AppsScriptError('Google Apps Script returned an invalid order response.', 502)
  }

  return result.order
}

export async function getBridgeHealth() {
  return callAppsScript('health')
}
