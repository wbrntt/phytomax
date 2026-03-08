const REQUEST_TIMEOUT_MS = 12000

export class AppsScriptError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message)
    this.name = 'AppsScriptError'
    this.statusCode = statusCode
    this.details = details
  }
}

function getAppsScriptConfig() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL?.trim()
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET?.trim()

  if (!url || !secret) {
    throw new AppsScriptError(
      'Google Apps Script is not configured. Add GOOGLE_APPS_SCRIPT_URL and GOOGLE_APPS_SCRIPT_SECRET.',
      500,
    )
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new AppsScriptError('GOOGLE_APPS_SCRIPT_URL is not a valid URL.', 500)
  }

  if (!parsedUrl.pathname.endsWith('/exec')) {
    throw new AppsScriptError(
      'GOOGLE_APPS_SCRIPT_URL must be the deployed Google Apps Script /exec URL.',
      500,
    )
  }

  return { url: parsedUrl.toString(), secret }
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
    throw new AppsScriptError(
      buildInvalidResponseMessage(response, text),
      502,
      buildResponseDiagnostics(response),
    )
  }
}

function getUrlHost(url) {
  if (!url) {
    return null
  }

  try {
    return new URL(url).host
  } catch {
    return null
  }
}

function buildResponseDiagnostics(response) {
  return {
    responseStatus: Number.isInteger(response.status) ? response.status : null,
    contentType: response.headers.get('content-type') || null,
    responseHost: getUrlHost(response.url),
    redirected: Boolean(response.redirected),
  }
}

function normalizeResponseText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function buildInvalidResponseMessage(response, text) {
  const diagnostics = buildResponseDiagnostics(response)
  const details = []

  if (diagnostics.responseStatus) {
    details.push(`status ${diagnostics.responseStatus}`)
  }

  if (diagnostics.contentType) {
    details.push(`content-type ${diagnostics.contentType}`)
  }

  let message = 'Google Apps Script returned a non-JSON response'
  if (details.length > 0) {
    message += ` (${details.join(', ')})`
  }
  message += '.'

  const normalizedText = normalizeResponseText(text)
  const responseHost = diagnostics.responseHost || ''

  if (responseHost === 'accounts.google.com' || /google accounts|sign in/.test(normalizedText)) {
    return `${message} Google returned a sign-in page. Confirm the deployment uses the /exec URL and the web app access is set to Anyone.`
  }

  if (diagnostics.responseStatus === 401 && responseHost === 'script.google.com') {
    return `${message} Google blocked the web app before your script ran. Confirm the deployment uses the live /exec URL, Execute as is set to Me, and Who has access is set to Anyone.`
  }

  if (/requested file does not exist|unable to open the file/.test(normalizedText)) {
    return `${message} Confirm GOOGLE_APPS_SCRIPT_URL is the current deployed /exec URL.`
  }

  return `${message} Confirm GOOGLE_APPS_SCRIPT_URL points to the deployed /exec web app and that the deployment is publicly accessible.`
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
  const diagnostics = buildResponseDiagnostics(response)

  if (!response.ok) {
    throw new AppsScriptError(
      result.error || 'Google Apps Script request failed.',
      response.status,
      diagnostics,
    )
  }

  if (result.ok === false) {
    throw new AppsScriptError(
      result.error || 'Google Apps Script request failed.',
      Number.isInteger(result.code) ? result.code : 500,
      diagnostics,
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
