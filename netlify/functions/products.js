import { handleProductsRequest } from '../../server/handlers/products.js'
import { fromNetlifyEvent, toNetlifyResponse } from '../../server/http.js'

export async function handler(event) {
  const response = await handleProductsRequest(fromNetlifyEvent(event))
  return toNetlifyResponse(response)
}
