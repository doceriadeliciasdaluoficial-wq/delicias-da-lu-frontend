const SESSION_KEY = 'delicias.admin.session.v1'

const DEFAULT_USER = import.meta.env.VITE_ADMIN_USER || 'admin'
const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'lu123456'

export const adminAuthService = {
  isAuthenticated() {
    try {
      return Boolean(localStorage.getItem(SESSION_KEY))
    } catch {
      return false
    }
  },

  login(username, password) {
    if (username === DEFAULT_USER && password === DEFAULT_PASSWORD) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ username, loginAt: new Date().toISOString() })
      )
      return true
    }

    return false
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
  }
}

export default adminAuthService
