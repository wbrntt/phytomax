import { handleHealthRequest } from '../../server/handlers/health.js'
import { fromNetlifyEvent, toNetlifyResponse } from '../../server/http.js'

export async function handler(event) {
  const response = await handleHealthRequest(fromNetlifyEvent(event))
  return toNetlifyResponse(response)
}
