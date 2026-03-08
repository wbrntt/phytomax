import { handleHealthRequest } from '../server/handlers/health.js'
import { fromVercelRequest, sendVercelResponse } from '../server/http.js'

export default async function handler(req, res) {
  const response = await handleHealthRequest(fromVercelRequest(req))
  return sendVercelResponse(res, response)
}
