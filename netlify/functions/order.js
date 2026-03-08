import { handleOrderRequest } from '../../server/handlers/order.js'
import { fromNetlifyEvent, toNetlifyResponse } from '../../server/http.js'

export async function handler(event) {
  const response = await handleOrderRequest(fromNetlifyEvent(event))
  return toNetlifyResponse(response)
}
