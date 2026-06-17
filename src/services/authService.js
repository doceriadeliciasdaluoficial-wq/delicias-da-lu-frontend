import sha256 from 'js-sha256'
import apiClient from './apiClient'

function hashPassword(password) {
  return sha256(password)
}

export const authService = {
  async login(username, password) {
    const passwordHash = hashPassword(password)
    const response = await apiClient.post('/auth/login', { 
      username, 
      passwordHash 
    })
    if (response.token) {
      localStorage.setItem('authToken', response.token)
    }
    return response
  },

  async logout() {
    localStorage.removeItem('authToken')
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('authToken'))
  }
}

export default authService
