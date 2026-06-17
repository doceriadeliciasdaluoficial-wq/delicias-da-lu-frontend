import apiClient from './apiClient'

/**
 * Map frontend field names to backend schema according to swagger CakeBuilderComponent
 * Frontend uses: id, label, value, description, fullDescription, weight, servings, note, image, order, active
 * Backend expects: id, name, type, price, description, image, active, order, createdAt, updatedAt
 * Type-specific optional: fullDescription (massas), weight, servings (sizes), note (decoracoes)
 */
function mapComponentToBackend(component, backendType) {
  if (!component.id) {
    throw new Error('Component must have an id')
  }

  const mapped = {
    id: component.id,
    name: component.label || component.name || '',
    type: backendType,
    price: Number(component.value || component.price || 0),
    description: component.description || '',
    image: component.image || '',
    active: component.active !== false,
    order: Number(component.order || 1)
  }

  // Add type-specific optional fields
  if (backendType === 'massas' && component.fullDescription) {
    mapped.fullDescription = component.fullDescription
  }
  if (backendType === 'sizes') {
    if (component.weight) mapped.weight = component.weight
    if (component.servings) mapped.servings = component.servings
  }
  if (backendType === 'decoracoes' && component.note) {
    mapped.note = component.note
  }

  return mapped
}

/**
 * Map backend response to frontend format
 * Ensures both frontend and backend field names are available
 */
function mapComponentToFrontend(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response data for component')
  }

  return {
    // Backend fields
    id: data.id,
    name: data.name,
    type: data.type,
    price: Number(data.price || 0),
    description: data.description || '',
    image: data.image || '',
    active: data.active !== false,
    order: Number(data.order || 1),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    
    // Frontend aliases for backend fields
    label: data.name,
    value: Number(data.price || 0),
    
    // Optional type-specific fields
    fullDescription: data.fullDescription,
    weight: data.weight,
    servings: data.servings,
    note: data.note
  }
}

export const cakeBuilderService = {
  /**
   * Map Portuguese backend type names to English frontend keys
   */
  _typeToFrontendKey(type) {
    const mapping = {
      'massas': 'masses',
      'recheios': 'fillings',
      'coberturas': 'toppings',
      'decoracoes': 'decorations',
      'sizes': 'sizes'
    }
    return mapping[type] || type
  },

  /**
   * Map English frontend keys to Portuguese backend type names
   */
  _keyToBackendType(key) {
    const mapping = {
      'masses': 'massas',
      'fillings': 'recheios',
      'toppings': 'coberturas',
      'decorations': 'decoracoes',
      'sizes': 'sizes'
    }
    return mapping[key] || key
  },

  async getAll() {
    try {
      // GET /cake-builder returns CakeBuilderAll: { massas[], recheios[], coberturas[], decoracoes[] }
      const response = await apiClient.get('/cake-builder')
      if (!response || typeof response !== 'object') {
        console.warn('Invalid cake builder response, returning empty object')
        return {}
      }
      
      // Map Portuguese type keys to English frontend keys and convert items
      const mapped = {}
      for (const [backendType, items] of Object.entries(response)) {
        const frontendKey = this._typeToFrontendKey(backendType)
        
        if (Array.isArray(items)) {
          try {
            mapped[frontendKey] = items.map(item => {
              const frontend = mapComponentToFrontend(item)
              frontend.type = frontendKey
              return frontend
            })
          } catch (err) {
            console.error(`Error mapping ${backendType} items:`, err)
            mapped[frontendKey] = []
          }
        } else {
          console.warn(`Expected array for ${backendType}, got ${typeof items}`)
          mapped[frontendKey] = []
        }
      }
      
      return mapped
    } catch (error) {
      console.error('Error fetching all cake builder components:', error)
      throw error
    }
  },

  async getByType(frontendKey) {
    try {
      const backendType = this._keyToBackendType(frontendKey)
      // GET /cake-builder/{type} returns array of CakeBuilderComponent
      const response = await apiClient.get(`/cake-builder/${backendType}`)
      
      if (!Array.isArray(response)) {
        console.warn(`Expected array for ${backendType}, got ${typeof response}`)
        return []
      }
      
      return response.map(item => {
        const frontend = mapComponentToFrontend(item)
        frontend.type = frontendKey
        return frontend
      })
    } catch (error) {
      console.error(`Error fetching cake builder type ${frontendKey}:`, error)
      throw error
    }
  },

  async getById(frontendKey, id) {
    try {
      const backendType = this._keyToBackendType(frontendKey)
      // GET /cake-builder/{type}/{id} returns single CakeBuilderComponent
      const response = await apiClient.get(`/cake-builder/${backendType}/${id}`)
      
      const frontend = mapComponentToFrontend(response)
      frontend.type = frontendKey
      return frontend
    } catch (error) {
      console.error(`Error fetching cake builder component ${id}:`, error)
      throw error
    }
  },

  async create(frontendKey, component) {
    try {
      const backendType = this._keyToBackendType(frontendKey)
      const data = mapComponentToBackend(component, backendType)
      
      // POST /cake-builder/{type} - Creates component, returns CakeBuilderComponent (201)
      const response = await apiClient.post(`/cake-builder/${backendType}`, data)
      
      const frontend = mapComponentToFrontend(response)
      frontend.type = frontendKey
      return frontend
    } catch (error) {
      console.error(`Error creating cake builder component in ${frontendKey}:`, error)
      throw error
    }
  },

  async update(frontendKey, id, component) {
    try {
      const backendType = this._keyToBackendType(frontendKey)
      const data = mapComponentToBackend(component, backendType)
      
      // PUT /cake-builder/{type}/{id} - Updates component, returns CakeBuilderComponent (200)
      const response = await apiClient.put(`/cake-builder/${backendType}/${id}`, data)
      
      const frontend = mapComponentToFrontend(response)
      frontend.type = frontendKey
      return frontend
    } catch (error) {
      console.error(`Error updating cake builder component ${id}:`, error)
      throw error
    }
  },

  async delete(frontendKey, id) {
    try {
      const backendType = this._keyToBackendType(frontendKey)
      // DELETE /cake-builder/{type}/{id} - Deletes component (204)
      await apiClient.delete(`/cake-builder/${backendType}/${id}`)
    } catch (error) {
      console.error(`Error deleting cake builder component ${id}:`, error)
      throw error
    }
  }
}

export default cakeBuilderService
