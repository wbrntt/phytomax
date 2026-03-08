import { handleOrderRequest } from '../server/handlers/order.js'
import { fromVercelRequest, sendVercelResponse } from '../server/http.js'

export default async function handler(req, res) {
  const response = await handleOrderRequest(fromVercelRequest(req))
  return sendVercelResponse(res, response)
}
