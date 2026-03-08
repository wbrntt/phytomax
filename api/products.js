import { handleProductsRequest } from '../server/handlers/products.js'
import { fromVercelRequest, sendVercelResponse } from '../server/http.js'

export default async function handler(req, res) {
  const response = await handleProductsRequest(fromVercelRequest(req))
  return sendVercelResponse(res, response)
}
