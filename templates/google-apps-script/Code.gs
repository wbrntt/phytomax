const CONFIG = {
  // Leave blank if this Apps Script is attached to your Google Sheet.
  spreadsheetId: '',
  secret: 'replace-with-a-long-random-secret',
  productsSheetName: 'Products',
  ordersSheetName: 'Orders',
}

const PRODUCT_COLUMN_COUNT = 6
const ORDER_COLUMNS = 15
const PAYMENT_METHOD_LABELS = {
  juice: 'Juice',
  bank_transfer: 'Local Bank Transfer',
  cash_on_delivery: 'Cash on Delivery',
}

function doGet(e) {
  return handleRequest_(e)
}

function doPost(e) {
  return handleRequest_(e)
}

function handleRequest_(e) {
  try {
    const request = getRequestData_(e)
    const action = String(request.action || '').toLowerCase()

    if (!action) {
      return jsonResponse_({ ok: false, code: 400, error: 'Action is required.' })
    }

    if (!CONFIG.secret || CONFIG.secret === 'replace-with-a-long-random-secret') {
      return jsonResponse_({ ok: false, code: 500, error: 'Apps Script secret is not configured.' })
    }

    if (request.secret !== CONFIG.secret) {
      return jsonResponse_({ ok: false, code: 401, error: 'Unauthorized.' })
    }

    switch (action) {
      case 'health':
        return jsonResponse_(handleHealth_())
      case 'products':
        return jsonResponse_({ ok: true, products: getProducts_() })
      case 'order':
        return jsonResponse_({ ok: true, order: submitOrder_(request.order) })
      default:
        return jsonResponse_({ ok: false, code: 400, error: 'Unknown action.' })
    }
  } catch (error) {
    return jsonResponse_({
      ok: false,
      code: error && error.code ? error.code : 500,
      error: error && error.message ? error.message : 'Unexpected Apps Script error.',
    })
  }
}

function getRequestData_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents)
    } catch (error) {
      throw new Error('Invalid JSON body.')
    }
  }

  return (e && e.parameter) || {}
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}

function getSpreadsheet_() {
  if (CONFIG.spreadsheetId) {
    return SpreadsheetApp.openById(CONFIG.spreadsheetId)
  }

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  if (activeSpreadsheet) {
    return activeSpreadsheet
  }

  throw new Error('Spreadsheet not found. Attach the script to the sheet or set CONFIG.spreadsheetId.')
}

function getSheet_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName)

  if (!sheet) {
    throw new Error('Missing sheet: ' + sheetName)
  }

  return sheet
}

function normalizeText_(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function limitText_(value, maxLength) {
  return normalizeText_(String(value || '')).slice(0, maxLength)
}

function parseNumber_(value) {
  const normalized = String(value == null ? '' : value).replace(/[^0-9.-]/g, '')
  const parsed = Number(normalized)
  return isFinite(parsed) ? parsed : 0
}

function normalizeStatus_(value) {
  const normalized = normalizeText_(String(value || '')).toLowerCase()
  return normalized || 'active'
}

function formatProductRow_(row, index) {
  const stock = Math.max(0, Math.floor(parseNumber_(row[3])))
  const status = normalizeStatus_(row[4])

  return {
    rowNumber: index + 2,
    sku: limitText_(row[0], 80),
    name: limitText_(row[1], 120),
    priceMUR: parseNumber_(row[2]),
    stock: stock,
    status: status,
    description: limitText_(row[5], 500),
    available: status === 'active' && stock > 0,
  }
}

function getProducts_() {
  const sheet = getSheet_(CONFIG.productsSheetName)
  const lastRow = sheet.getLastRow()

  if (lastRow < 2) {
    return []
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, PRODUCT_COLUMN_COUNT).getValues()
  const products = []

  for (let index = 0; index < rows.length; index += 1) {
    const product = formatProductRow_(rows[index], index)

    if (product.sku && product.name && product.status !== 'hidden') {
      products.push(product)
    }
  }

  return products
}

function handleHealth_() {
  const products = getProducts_()

  return {
    ok: true,
    service: 'phytomax-sheet-bridge',
    timestamp: new Date().toISOString(),
    productsSheetName: CONFIG.productsSheetName,
    ordersSheetName: CONFIG.ordersSheetName,
    productCount: products.length,
  }
}

function buildOrderRow_(order) {
  return [[
    order.createdAt,
    order.orderId,
    order.productSku,
    order.productName,
    order.quantity,
    order.unitPriceMUR,
    order.totalPriceMUR,
    order.fullName,
    order.phone,
    order.email || '',
    order.paymentMethod,
    order.paymentConfirmationCode || '',
    order.deliveryAddress,
    order.notes || '',
    order.status,
  ]]
}

function submitOrder_(inputOrder) {
  if (!inputOrder || typeof inputOrder !== 'object') {
    throw new Error('Order payload is required.')
  }

  const quantity = Math.max(0, Math.floor(parseNumber_(inputOrder.quantity)))
  const paymentMethod = normalizePaymentMethod_(inputOrder.paymentMethod)
  const paymentConfirmationCode = limitText_(inputOrder.paymentConfirmationCode, 160)

  if (quantity < 1) {
    throwOrderError_(400, 'Quantity must be at least 1.')
  }

  if (!paymentMethod) {
    throwOrderError_(400, 'Select a valid payment method.')
  }

  if (requiresPaymentConfirmation_(paymentMethod) && !paymentConfirmationCode) {
    throwOrderError_(400, getPaymentMethodLabel_(paymentMethod) + ' requires a payment confirmation code.')
  }

  const lock = LockService.getScriptLock()
  lock.waitLock(15000)

  try {
    const productsSheet = getSheet_(CONFIG.productsSheetName)
    const ordersSheet = getSheet_(CONFIG.ordersSheetName)
    const product = getProducts_().find(function (item) {
      return item.sku === limitText_(inputOrder.productSku, 80)
    })

    if (!product || product.status !== 'active') {
      throwOrderError_(400, 'Selected product is not available.')
    }

    if (quantity > product.stock) {
      throwOrderError_(409, 'Max ' + product.stock + ' available right now for ' + product.name + '.')
    }

    const order = {
      orderId: limitText_(inputOrder.orderId, 80) || createOrderId_(),
      createdAt: limitText_(inputOrder.createdAt, 80) || new Date().toISOString(),
      status: limitText_(inputOrder.status, 40) || 'new',
      productSku: product.sku,
      productName: product.name,
      quantity: quantity,
      unitPriceMUR: product.priceMUR,
      totalPriceMUR: product.priceMUR * quantity,
      fullName: limitText_(inputOrder.fullName, 80),
      phone: limitText_(inputOrder.phone, 40),
      email: limitText_(inputOrder.email, 120),
      paymentMethod: getPaymentMethodLabel_(paymentMethod),
      paymentConfirmationCode: paymentConfirmationCode,
      deliveryAddress: limitText_(inputOrder.deliveryAddress, 300),
      notes: limitText_(inputOrder.notes, 500),
    }

    if (!order.fullName || !order.phone || !order.deliveryAddress) {
      throwOrderError_(400, 'Missing required order fields.')
    }

    const nextStock = product.stock - quantity
    productsSheet.getRange(product.rowNumber, 4).setValue(nextStock)

    try {
      const nextRowNumber = Math.max(ordersSheet.getLastRow(), 1) + 1
      ordersSheet.getRange(nextRowNumber, 1, 1, ORDER_COLUMNS).setValues(buildOrderRow_(order))
    } catch (error) {
      productsSheet.getRange(product.rowNumber, 4).setValue(product.stock)
      throw error
    }

    return order
  } finally {
    lock.releaseLock()
  }
}

function throwOrderError_(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

function normalizePaymentMethod_(value) {
  const normalized = normalizeText_(String(value || '')).toLowerCase()
  return PAYMENT_METHOD_LABELS[normalized] ? normalized : ''
}

function requiresPaymentConfirmation_(value) {
  return value === 'juice' || value === 'bank_transfer'
}

function getPaymentMethodLabel_(value) {
  return PAYMENT_METHOD_LABELS[value] || 'Unknown'
}

function createOrderId_() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return 'PHY-' + stamp + '-' + suffix
}
