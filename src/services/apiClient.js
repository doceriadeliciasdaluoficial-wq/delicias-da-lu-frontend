import axios from 'axios'
import API_CONFIG from '../config/api'

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    
    // Debug logging
    console.log('[API Request]', {
      method: config.method.toUpperCase(),
      url: config.url,
      hasToken: !!token,
      tokenLength: token?.length,
      baseURL: config.baseURL
    })
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API Auth] Bearer token added to request')
    } else {
      console.warn('[API Auth] No token found in localStorage for request:', config.url)
    }
    
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', {
      status: response.status,
      url: response.config?.url,
      method: response.config?.method?.toUpperCase()
    })
    return response.data
  },
  async (error) => {
    console.error('[API Error Response]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      console.warn('[API Auth] 401 Unauthorized - removing token')
      localStorage.removeItem('authToken')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
