# Frontend - Integração com Backend API

## Índice
1. [Setup da Integração](#setup-da-integração)
2. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
3. [HTTP Client Service](#http-client-service)
4. [Atualizar siteDataService](#atualizar-sitedataservice)
5. [Exemplos de Integração](#exemplos-de-integração)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Autenticação no Frontend](#autenticação-no-frontend)

---

## Setup da Integração

### 1. Instalar Axios (ou Fetch API)

```bash
npm install axios
```

### 2. Variáveis de Ambiente

Adicionar em `.env.local` ou `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=10000
```

Para produção (`.env.production`):

```env
VITE_API_BASE_URL=https://api.delicias-da-lu.com.br/api/v1
VITE_API_TIMEOUT=10000
```

---

## Configuração de Variáveis de Ambiente

### Arquivo: `src/config/api.js`

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
}

export default API_CONFIG
```

---

## HTTP Client Service

### Arquivo: `src/services/apiClient.js`

```javascript
import axios from 'axios'
import API_CONFIG from '../config/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - adiciona token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - trata erros comuns
apiClient.interceptors.response.use(
  (response) => response.data, // Retorna apenas data
  async (error) => {
    // Se token expirou, tenta renovar
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh`,
          { refreshToken }
        )
        localStorage.setItem('authToken', response.data.token)
        // Retry original request
        return apiClient(error.config)
      } catch (refreshError) {
        // Logout
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/painel-interno-secreto-lu'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### Arquivo: `src/services/authService.js`

```javascript
import apiClient from './apiClient'

export const authService = {
  async login(username, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      })

      // Armazenar tokens
      localStorage.setItem('authToken', response.token)
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }

      return response
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erro ao fazer login',
        statusCode: error.response?.status
      }
    }
  },

  async logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },

  getToken() {
    return localStorage.getItem('authToken')
  }
}

export default authService
```

---

## Atualizar siteDataService

### Arquivo: `src/services/siteDataService.js` (ATUALIZADO)

```javascript
import apiClient from './apiClient'
import defaultSiteConfig, { cloneSiteConfig } from '../data/defaultSiteConfig'

const LOCAL_STORAGE_KEY = 'delicias.site.config.v1'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

let cachedConfig = null
let lastFetchTime = 0

export const siteDataService = {
  /**
   * Carrega configuração pública da API (com fallback para localStorage)
   */
  async loadConfig() {
    try {
      // Verificar se tem cache válido
      const now = Date.now()
      if (cachedConfig && now - lastFetchTime < CACHE_DURATION) {
        return cachedConfig
      }

      // Buscar da API
      const config = await apiClient.get('/config/public')
      cachedConfig = config
      lastFetchTime = now

      // Atualizar localStorage como backup
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config))
      return config
    } catch (error) {
      console.warn('Erro ao carregar configurações da API. Usando cache local.', error)

      // Fallback para localStorage
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (raw) return JSON.parse(raw)
      } catch (e) {
        console.error('Erro ao carregar do localStorage', e)
      }

      // Fallback final: config padrão
      return this.getDefaultConfig()
    }
  },

  /**
   * Carrega configuração completa (admin only)
   */
  async loadAdminConfig() {
    try {
      return await apiClient.get('/config/admin')
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erro ao carregar configurações admin',
        statusCode: error.response?.status
      }
    }
  },

  /**
   * Salva configuração completa (admin only)
   */
  async saveConfig(config) {
    try {
      const updated = await apiClient.put('/config/admin', config)
      cachedConfig = updated
      lastFetchTime = Date.now()
      return updated
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erro ao salvar configurações',
        statusCode: error.response?.status,
        details: error.response?.data?.details
      }
    }
  },

  /**
   * Retorna config padrão
   */
  getDefaultConfig() {
    return cloneSiteConfig(defaultSiteConfig)
  },

  /**
   * Reseta cache
   */
  resetCache() {
    cachedConfig = null
    lastFetchTime = 0
  }
}

export default siteDataService
```

---

## Exemplos de Integração

### 1. Menu Items Service

#### Arquivo: `src/services/menuService.js`

```javascript
import apiClient from './apiClient'

export const menuService = {
  // Público: listar itens
  async getItems(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.active !== undefined) params.append('active', filters.active)

      return await apiClient.get('/menu/items', { params })
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Público: obter item específico
  async getItem(id) {
    try {
      return await apiClient.get(`/menu/items/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: criar item
  async createItem(itemData) {
    try {
      return await apiClient.post('/menu/items', itemData)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: atualizar item
  async updateItem(id, itemData) {
    try {
      return await apiClient.put(`/menu/items/${id}`, itemData)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: deletar item
  async deleteItem(id) {
    try {
      return await apiClient.delete(`/menu/items/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: atualizar ordem
  async updateItemOrder(id, order) {
    try {
      return await apiClient.patch(`/menu/items/${id}/order`, { order })
    } catch (error) {
      throw this.handleError(error)
    }
  },

  handleError(error) {
    return {
      message: error.response?.data?.message || 'Erro ao processar requisição',
      statusCode: error.response?.status,
      details: error.response?.data?.details
    }
  }
}

export default menuService
```

### 2. Cake Builder Service

#### Arquivo: `src/services/cakeBuilderService.js`

```javascript
import apiClient from './apiClient'

export const cakeBuilderService = {
  // Público: obter todos os componentes
  async getComponents() {
    try {
      return await apiClient.get('/cake-builder')
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Público: obter componentes de um tipo
  async getComponentsByType(type) {
    try {
      return await apiClient.get(`/cake-builder/${type}`)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: criar componente
  async createComponent(type, componentData) {
    try {
      return await apiClient.post(`/cake-builder/${type}`, componentData)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: atualizar componente
  async updateComponent(type, id, componentData) {
    try {
      return await apiClient.put(`/cake-builder/${type}/${id}`, componentData)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: deletar componente
  async deleteComponent(type, id) {
    try {
      return await apiClient.delete(`/cake-builder/${type}/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  handleError(error) {
    return {
      message: error.response?.data?.message || 'Erro ao processar requisição',
      statusCode: error.response?.status,
      details: error.response?.data?.details
    }
  }
}

export default cakeBuilderService
```

### 3. Orders Service

#### Arquivo: `src/services/ordersService.js`

```javascript
import apiClient from './apiClient'

export const ordersService = {
  // Público: criar novo pedido
  async createOrder(orderData) {
    try {
      return await apiClient.post('/orders', orderData)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Público: obter pedido pelo ID
  async getOrder(id) {
    try {
      return await apiClient.get(`/orders/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: listar pedidos com paginação
  async listOrders(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.limit) params.append('limit', filters.limit)
      if (filters.offset) params.append('offset', filters.offset)

      return await apiClient.get('/orders', { params })
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Admin: atualizar status do pedido
  async updateOrderStatus(id, status) {
    try {
      return await apiClient.put(`/orders/${id}`, { status })
    } catch (error) {
      throw this.handleError(error)
    }
  },

  handleError(error) {
    return {
      message: error.response?.data?.message || 'Erro ao processar pedido',
      statusCode: error.response?.status,
      details: error.response?.data?.details
    }
  }
}

export default ordersService
```

---

## Exemplo: Integrar em um Componente React

### Arquivo: `src/pages/Menu.jsx` (EXEMPLO DE INTEGRAÇÃO)

```javascript
import { useEffect, useState } from 'react'
import { useSiteData } from '../context/SiteDataContext'
import menuService from '../services/menuService'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'

export default function Menu() {
  const { menuData } = useSiteData()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await menuService.getItems({ active: true })
      setItems(data)
    } catch (err) {
      setError(err.message || 'Erro ao carregar menu')
      console.error('Erro ao carregar menu:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando menu...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button
          onClick={loadMenuItems}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const groupedByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-8">
      {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
        <section key={category} className="mb-12">
          <SectionTitle title={category} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
```

---

## Tratamento de Erros

### Padrão Recomendado

```javascript
import { useState } from 'react'

export function useApiCall(apiFunction) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      setData(result)
      return result
    } catch (err) {
      const errorObj = {
        message: err.message || 'Erro desconhecido',
        statusCode: err.statusCode,
        details: err.details
      }
      setError(errorObj)
      throw errorObj
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, execute }
}
```

### Uso em Componentes

```javascript
import { useApiCall } from '../hooks/useApiCall'
import menuService from '../services/menuService'

export default function MenuManager() {
  const {
    data: items,
    loading,
    error,
    execute: loadItems
  } = useApiCall(menuService.getItems)

  // ...

  if (error?.statusCode === 401) {
    return <div>Você precisa estar autenticado</div>
  }

  if (error?.statusCode === 400) {
    return <div>Dados inválidos: {error.message}</div>
  }
}
```

---

## Autenticação no Frontend

### Context: `src/context/AdminAuthContext.jsx` (ATUALIZADO)

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar se já está autenticado ao montar
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // Aqui você poderia validar o token com o backend
      setUser({ authenticated: true })
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authService.login(username, password)
      setUser(response.user)
      return response
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    }
  }

  const isAuthenticated = () => authService.isAuthenticated()

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider')
  }
  return context
}
```

### Componente de Login

```javascript
import { useState } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const { login, error: authError } = useAdminAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      await login(formData.username, formData.password)
      navigate('/painel-interno-secreto-lu')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || authError?.message) && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error || authError.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Usuário</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Senha</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
      >
        {loading ? 'Autenticando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

---

## Checklist de Integração

- [ ] Instalar Axios: `npm install axios`
- [ ] Criar `src/services/apiClient.js`
- [ ] Criar `src/services/authService.js`
- [ ] Atualizar `src/services/siteDataService.js`
- [ ] Criar `src/services/menuService.js`
- [ ] Criar `src/services/cakeBuilderService.js`
- [ ] Criar `src/services/ordersService.js`
- [ ] Atualizar `src/context/AdminAuthContext.jsx`
- [ ] Criar `.env.local` com `VITE_API_BASE_URL`
- [ ] Testar login e autenticação
- [ ] Testar GET `/config/public`
- [ ] Testar GET/POST/PUT/DELETE `/menu/items`
- [ ] Testar GET/POST/PUT/DELETE `/cake-builder/{type}`
- [ ] Testar POST `/orders`
- [ ] Configurar CORS no backend
- [ ] Deploy em staging para teste

