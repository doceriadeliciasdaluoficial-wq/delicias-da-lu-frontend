import apiClient from './apiClient'

export const menuService = {
  async getAll() {
    const response = await apiClient.get('/menu/items')
    return Array.isArray(response) ? response : response?.data || []
  },

  async getById(categoryId, id) {
    return apiClient.get(`/menu/${categoryId}/items/${id}`)
  },

  async create(categoryId, menuItem) {
    menuItem.category = categoryId
    return apiClient.post(`/menu/${categoryId}/items`, menuItem)
  },

  async update(categoryId, id, menuItem) {
    menuItem.category = categoryId
    return apiClient.put(`/menu/${categoryId}/items/${id}`, menuItem)
  },

  async delete(categoryId, id) {
    return apiClient.delete(`/menu/${categoryId}/items/${id}`)
  },

  async updateOrder(categoryId, id, order) {
    return apiClient.patch(`/menu/${categoryId}/items/${id}/order`, { order })
  }
}

export default menuService
