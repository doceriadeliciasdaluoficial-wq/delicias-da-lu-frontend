import sha256 from 'js-sha256'
import apiClient from './apiClient'

function hashPassword(password) {
  return sha256(password)
}

export const authService = {
  async login(username, password) {
    const passwordHash = hashPassword(password)
    
    console.log('[Auth Service] Starting login attempt for:', username)
    console.log('[Auth Service] Password hash:', passwordHash.substring(0, 10) + '...')
    
    try {
      const response = await apiClient.post('/auth/login', { 
        username, 
        passwordHash 
      })
      
      console.log('[Auth Service] Login response received:', {
        hasResponse: !!response,
        responseType: typeof response,
        responseKeys: response ? Object.keys(response) : 'N/A',
        hasToken: !!response?.token,
        tokenType: typeof response?.token,
        tokenLength: response?.token?.length || 0,
        hasUser: !!response?.user,
        fullResponse: JSON.stringify(response).substring(0, 150)
      })
      
      // Try multiple token extraction paths
      let token = null
      
      if (response?.token) {
        token = response.token
        console.log('[Auth Service] Token found in response.token')
      } else if (response?.data?.token) {
        token = response.data.token
        console.log('[Auth Service] Token found in response.data.token')
      } else if (response?.accessToken) {
        token = response.accessToken
        console.log('[Auth Service] Token found in response.accessToken')
      } else {
        console.error('[Auth Service] Token extraction failed', {
          response: JSON.stringify(response),
          responseKeys: Object.keys(response || {})
        })
      }
      
      if (token) {
        localStorage.setItem('authToken', token)
        console.log('[Auth Service] ✅ Token stored in localStorage successfully', {
          tokenLength: token.length,
          tokenPreview: token.substring(0, 30) + '...',
          tokenEndsOk: token.substring(token.length - 10)
        })
      } else {
        console.error('[Auth Service] ❌ No token found in login response')
        throw new Error('Token not found in login response')
      }
      
      return response
    } catch (error) {
      console.error('[Auth Service] ❌ Login failed with error:', {
        errorMessage: error.message,
        errorType: error.constructor.name,
        hasResponse: !!error.response,
        responseStatus: error.response?.status,
        responseData: error.response?.data
      })
      throw error
    }
  },

  async logout() {
    console.log('[Auth Service] Logging out')
    localStorage.removeItem('authToken')
  },

  isAuthenticated() {
    const hasToken = Boolean(localStorage.getItem('authToken'))
    console.log('[Auth Service] isAuthenticated check:', hasToken)
    return hasToken
  }
}

export default authService
