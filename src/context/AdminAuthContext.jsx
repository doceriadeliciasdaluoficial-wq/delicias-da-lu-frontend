import React, { createContext, useContext, useMemo, useState } from 'react'
import authService from '../services/authService'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (username, password) => {
    try {
      setIsLoading(true)
      setError(null)
      await authService.login(username, password)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login')
      setIsAuthenticated(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      isLoading,
      error
    }),
    [isAuthenticated, isLoading, error]
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
