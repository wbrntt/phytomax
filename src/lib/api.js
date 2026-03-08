const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined
const apiBasePath = ((viteEnv && viteEnv.VITE_API_BASE_PATH) || '/api').replace(/\/$/, '')

export function getApiUrl(path) {
  const normalizedPath = path.replace(/^\//, '')
  return `${apiBasePath}/${normalizedPath}`
}
