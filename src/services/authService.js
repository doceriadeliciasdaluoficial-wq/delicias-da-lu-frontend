import sha256 from 'js-sha256'
import apiClient from './apiClient'

function hashPassword(password) {
  return sha256(password)
}

export const authService = {
  async login(username, password) {
    const passwordHash = hashPassword(password)
    
    console.log('[Auth Service] Login attempt for:', username)
    
    const response = await apiClient.post('/auth/login', { 
      username, 
      passwordHash 
    })
    
    console.log('[Auth Service] Login response:', {
      hasToken: !!response?.token,
      responseKeys: Object.keys(response || {}),
      responseType: typeof response
    })
    
    // Handle different token response formats
    const token = response?.token || response?.data?.token || response?.accessToken
    
    if (token) {
      localStorage.setItem('authToken', token)
      console.log('[Auth Service] Token stored in localStorage successfully', {
        tokenLength: token.length,
        tokenPreview: token.substring(0, 20) + '...'
      })
    } else {
      console.error('[Auth Service] No token found in login response:', response)
      throw new Error('Token not found in login response')
    }
    
    return response
  },

  async logout() {
    console.log('[Auth Service] Logout')
    localStorage.removeItem('authToken')
  },

  isAuthenticated() {
    const hasToken = Boolean(localStorage.getItem('authToken'))
    console.log('[Auth Service] isAuthenticated:', hasToken)
    return hasToken
  }
}

export default authService
