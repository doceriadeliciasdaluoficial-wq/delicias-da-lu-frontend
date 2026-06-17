import authService from './authService'

export const adminAuthService = {
  isAuthenticated() {
    return authService.isAuthenticated()
  },

  async login(username, password) {
    return authService.login(username, password)
  },

  logout() {
    authService.logout()
  }
}

export default adminAuthService
