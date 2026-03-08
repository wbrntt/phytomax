import { getBridgeHealth } from '../../lib/googleAppsScript.js'
import { createJsonResponse } from '../http.js'

function hasEnv(name) {
  return Boolean(process.env[name])
}

function getAppsScriptErrorDetails(error) {
  const details = {}

  if (Number.isInteger(error?.statusCode)) {
    details.statusCode = error.statusCode
  }

  if (Number.isInteger(error?.details?.responseStatus)) {
    details.responseStatus = error.details.responseStatus
  }

  if (error?.details?.contentType) {
    details.contentType = error.details.contentType
  }

  if (error?.details?.responseHost) {
    details.responseHost = error.details.responseHost
  }

  if (typeof error?.details?.redirected === 'boolean') {
    details.redirected = error.details.redirected
  }

  return details
}

export async function handleHealthRequest(request) {
  if (request.method !== 'GET') {
    return createJsonResponse(405, { error: 'Method not allowed.' }, { Allow: 'GET' })
  }

  const appsScriptConfigured = hasEnv('GOOGLE_APPS_SCRIPT_URL') && hasEnv('GOOGLE_APPS_SCRIPT_SECRET')
  const integrations = {
    googleAppsScript: {
      configured: appsScriptConfigured,
      reachable: false,
    },
    telegram: hasEnv('TELEGRAM_BOT_TOKEN') && hasEnv('TELEGRAM_CHAT_ID'),
    resend:
      hasEnv('RESEND_API_KEY') &&
      hasEnv('ORDER_NOTIFICATION_EMAIL') &&
      hasEnv('ORDER_FROM_EMAIL'),
  }

  if (appsScriptConfigured) {
    try {
      const bridgeHealth = await getBridgeHealth()
      integrations.googleAppsScript = {
        configured: true,
        reachable: true,
        productsSheetName: bridgeHealth.productsSheetName || null,
        ordersSheetName: bridgeHealth.ordersSheetName || null,
        productCount: Number.isInteger(bridgeHealth.productCount) ? bridgeHealth.productCount : null,
      }
    } catch (error) {
      integrations.googleAppsScript = {
        configured: true,
        reachable: false,
        error: error.message || 'Google Apps Script healthcheck failed.',
        ...getAppsScriptErrorDetails(error),
      }
    }
  }

  return createJsonResponse(200, {
    ok: appsScriptConfigured && integrations.googleAppsScript.reachable,
    service: 'phytomax-order-api',
    timestamp: new Date().toISOString(),
    integrations,
  }, {
    'Cache-Control': 'no-store',
  })
}
