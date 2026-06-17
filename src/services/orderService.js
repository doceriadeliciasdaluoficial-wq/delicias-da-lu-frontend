import apiClient from './apiClient'

export const orderService = {
  async create(order) {
    return apiClient.post('/orders', order)
  },

  async getAll(limit = 10, offset = 0, status = null) {
    const params = { limit, offset }
    if (status) params.status = status
    return apiClient.get('/orders', { params })
  },

  async getById(id) {
    return apiClient.get(`/orders/${id}`)
  },

  async updateStatus(id, status) {
    return apiClient.put(`/orders/${id}`, { status })
  }
}

export default orderService
