import apiClient from './apiClient'

/**
 * Map frontend field names to backend schema
 * Frontend uses: label, value, description, fullDescription, weight, servings, note
 * Backend expects: name, price, description (and validates on type)
 */
function mapComponentToBackend(component, type) {
  const mapped = {
    id: component.id,
    name: component.label || component.name,
    type: type,
    price: component.value || component.price || 0,
    active: component.active !== false,
    image: component.image || '',
    order: component.order || 1,
    description: component.description || ''
  }

  // Add optional fields based on type
  if (type === 'massas' && component.fullDescription) {
    mapped.fullDescription = component.fullDescription
  }
  if (type === 'tamanhos') {
    if (component.weight) mapped.weight = component.weight
    if (component.servings) mapped.servings = component.servings
  }
  if (type === 'decoracoes' && component.note) {
    mapped.note = component.note
  }

  return mapped
}

/**
 * Map backend response to frontend format
 */
function mapComponentToFrontend(data) {
  return {
    id: data.id,
    label: data.name,
    value: data.price,
    name: data.name,
    price: data.price,
    type: data.type,
    description: data.description || '',
    fullDescription: data.fullDescription,
    weight: data.weight,
    servings: data.servings,
    note: data.note,
    image: data.image || '',
    active: data.active,
    order: data.order,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

export const cakeBuilderService = {
  async getAll() {
    try {
      const response = await apiClient.get('/cake-builder')
      if (!response) return {}
      
      const data = typeof response === 'object' ? response : response?.data || {}
      
      // Map all components to frontend format
      const mapped = {}
      for (const [type, items] of Object.entries(data)) {
        if (Array.isArray(items)) {
          mapped[type] = items.map(mapComponentToFrontend)
        }
      }
      return mapped
    } catch (error) {
      console.error('Error fetching cake builder:', error)
      return {}
    }
  },

  async getByType(type) {
    try {
      const response = await apiClient.get(`/cake-builder/${type}`)
      if (!response) return []
      
      const items = Array.isArray(response) ? response : response?.data || []
      return items.map(mapComponentToFrontend)
    } catch (error) {
      console.error(`Error fetching cake builder type ${type}:`, error)
      return []
    }
  },

  async getById(type, id) {
    try {
      const response = await apiClient.get(`/cake-builder/${type}/${id}`)
      return mapComponentToFrontend(response)
    } catch (error) {
      console.error(`Error fetching cake builder component ${id}:`, error)
      return null
    }
  },

  async create(type, component) {
    try {
      const data = mapComponentToBackend(component, type)
      const response = await apiClient.post(`/cake-builder/${type}`, data)
      return mapComponentToFrontend(response)
    } catch (error) {
      console.error('Error creating cake builder component:', error)
      throw error
    }
  },

  async update(type, id, component) {
    try {
      const data = mapComponentToBackend(component, type)
      const response = await apiClient.put(`/cake-builder/${type}/${id}`, data)
      return mapComponentToFrontend(response)
    } catch (error) {
      console.error(`Error updating cake builder component ${id}:`, error)
      throw error
    }
  },

  async delete(type, id) {
    try {
      return await apiClient.delete(`/cake-builder/${type}/${id}`)
    } catch (error) {
      console.error(`Error deleting cake builder component ${id}:`, error)
      throw error
    }
  }
}

export default cakeBuilderService
