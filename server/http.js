function parseBody(body) {
  if (!body) return {}

  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }

  return body
}

export function createJsonResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body,
  }
}

export function fromVercelRequest(req) {
  return {
    method: req.method,
    body: parseBody(req.body),
    headers: req.headers || {},
  }
}

export function sendVercelResponse(res, response) {
  Object.entries(response.headers || {}).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  return res.status(response.statusCode).json(response.body)
}

export function fromNetlifyEvent(event) {
  return {
    method: event.httpMethod,
    body: parseBody(event.body),
    headers: event.headers || {},
  }
}

export function toNetlifyResponse(response) {
  return {
    statusCode: response.statusCode,
    headers: response.headers,
    body: JSON.stringify(response.body),
  }
}
