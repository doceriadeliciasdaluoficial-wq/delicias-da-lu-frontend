import apiClient from './apiClient'

/**
 * Map frontend field names to backend schema for MenuItem
 * Frontend uses categories like 'bolos', 'docesSimples', etc.
 * Backend expects 'category' as string
 */
function mapMenuItemToBackend(item, categoryId) {
  return {
    id: item.id,
    name: item.name,
    category: item.category || categoryId,
    price: item.price || 0,
    unit: item.unit || 'un',
    image: item.image || '',
    description: item.description || '',
    active: item.active !== false,
    order: item.order || 1,
    customPrice: item.customPrice || false,
    minQuantity: item.minQuantity
  }
}

/**
 * Map backend response to frontend format
 */
function mapMenuItemToFrontend(data) {
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: data.price,
    unit: data.unit,
    image: data.image || '',
    description: data.description || '',
    active: data.active,
    order: data.order,
    customPrice: data.customPrice,
    minQuantity: data.minQuantity,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

export const menuService = {
  async getAll() {
    try {
      const response = await apiClient.get('/menu/items')
      const items = Array.isArray(response) ? response : response?.data || []
      return items.map(mapMenuItemToFrontend)
    } catch (error) {
      console.error('Error fetching menu items:', error)
      return []
    }
  },

  async getById(categoryId, id) {
    try {
      // Backend expects category in URL path
      const response = await apiClient.get(`/menu/${categoryId}/items/${id}`)
      return mapMenuItemToFrontend(response)
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error)
      return null
    }
  },

  async create(categoryId, menuItem) {
    try {
      const data = mapMenuItemToBackend(menuItem, categoryId)
      // Backend expects category in URL path
      const response = await apiClient.post(`/menu/${categoryId}/items`, data)
      return mapMenuItemToFrontend(response)
    } catch (error) {
      console.error('Error creating menu item:', error)
      throw error
    }
  },

  async update(categoryId, id, menuItem) {
    try {
      const data = mapMenuItemToBackend(menuItem, categoryId)
      // Backend expects category in URL path
      const response = await apiClient.put(`/menu/${categoryId}/items/${id}`, data)
      return mapMenuItemToFrontend(response)
    } catch (error) {
      console.error(`Error updating menu item ${id}:`, error)
      throw error
    }
  },

  async delete(categoryId, id) {
    try {
      // Backend expects category in URL path
      return await apiClient.delete(`/menu/${categoryId}/items/${id}`)
    } catch (error) {
      console.error(`Error deleting menu item ${id}:`, error)
      throw error
    }
  },

  async updateOrder(categoryId, id, order) {
    try {
      // Backend expects category in URL path
      return await apiClient.patch(`/menu/${categoryId}/items/${id}/order`, { order })
    } catch (error) {
      console.error(`Error updating menu item order ${id}:`, error)
      throw error
    }
  }
}

export default menuService
