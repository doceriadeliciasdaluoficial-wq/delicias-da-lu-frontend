import apiClient from './apiClient'

export const contactService = {
  async getContacts() {
    const response = await apiClient.get('/contacts')
    return typeof response === 'object' ? response : response?.data || {}
  },

  async updateContacts(contacts) {
    return apiClient.put('/contacts', contacts)
  }
}

export default contactService
