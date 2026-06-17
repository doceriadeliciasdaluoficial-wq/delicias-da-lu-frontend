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
      console.log('[AdminAuthContext] Attempting login for:', username)
      
      await authService.login(username, password)
      
      console.log('[AdminAuthContext] Login successful, checking authenticated status')
      const isAuth = authService.isAuthenticated()
      console.log('[AdminAuthContext] isAuthenticated result:', isAuth)
      
      setIsAuthenticated(isAuth)
      console.log('[AdminAuthContext] ✅ Authentication state updated to true')
      return true
    } catch (err) {
      console.error('[AdminAuthContext] ❌ Login error caught:', {
        errorMessage: err.message,
        errorResponse: err.response?.data?.message || err.response?.data,
        errorStatus: err.response?.status
      })
      
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'Erro ao fazer login'
      
      setError(errorMessage)
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
