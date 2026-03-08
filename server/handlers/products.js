import { getProducts } from '../../lib/googleAppsScript.js'
import { createJsonResponse } from '../http.js'

export async function handleProductsRequest(request) {
  if (request.method !== 'GET') {
    return createJsonResponse(405, { error: 'Method not allowed.' }, { Allow: 'GET' })
  }

  try {
    const products = await getProducts()
    const publicProducts = products.map((product) => ({
      sku: product.sku,
      name: product.name,
      priceMUR: product.priceMUR,
      description: product.description,
      available: product.available,
    }))

    return createJsonResponse(200, { products: publicProducts }, { 'Cache-Control': 'no-store' })
  } catch (error) {
    return createJsonResponse(error.statusCode || 500, {
      error: error.message || 'We could not load the product catalog.',
    })
  }
}
