import React, { createContext, useContext, useMemo, useState } from 'react'
import adminAuthService from '../services/adminAuthService'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => adminAuthService.isAuthenticated())

  const login = (username, password) => {
    const success = adminAuthService.login(username, password)
    setIsAuthenticated(success)
    return success
  }

  const logout = () => {
    adminAuthService.logout()
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout
    }),
    [isAuthenticated]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider')
  }
  return context
}

export default AdminAuthContext
