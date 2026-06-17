import apiClient from './apiClient'

export const cakeBuilderService = {
  async getAll() {
    const response = await apiClient.get('/cake-builder')
    return typeof response === 'object' ? response : response?.data || {}
  },

  async getByType(type) {
    return apiClient.get(`/cake-builder/${type}`)
  },

  async getById(type, id) {
    return apiClient.get(`/cake-builder/${type}/${id}`)
  },

  async create(type, component) {
    return apiClient.post(`/cake-builder/${type}`, component)
  },

  async update(type, id, component) {
    return apiClient.put(`/cake-builder/${type}/${id}`, component)
  },

  async delete(type, id) {
    return apiClient.delete(`/cake-builder/${type}/${id}`)
  }
}

export default cakeBuilderService
