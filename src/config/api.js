export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://delicias-da-lu-514609008596.southamerica-east1.run.app/v1',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
}

export default API_CONFIG
