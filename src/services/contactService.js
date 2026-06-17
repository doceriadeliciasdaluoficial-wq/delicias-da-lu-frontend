import apiClient from './apiClient'

/**
 * Map backend Contact response to frontend format
 */
function mapContactsToFrontend(data) {
  return {
    whatsapp: {
      number: data?.whatsapp?.number || '',
      link: data?.whatsapp?.link || ''
    },
    email: data?.email || '',
    instagram: data?.instagram || '',
    address: data?.address || '',
    phone: data?.phone || ''
  }
}

export const contactService = {
  async getContacts() {
    try {
      const response = await apiClient.get('/contacts')
      const data = typeof response === 'object' ? response : response?.data || {}
      return mapContactsToFrontend(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      return {
        whatsapp: { number: '', link: '' },
        email: '',
        instagram: '',
        address: '',
        phone: ''
      }
    }
  },

  async updateContacts(contacts) {
    try {
      const data = {
        whatsapp: {
          number: contacts?.whatsapp?.number || '',
          link: contacts?.whatsapp?.link || ''
        },
        email: contacts?.email || '',
        instagram: contacts?.instagram || '',
        address: contacts?.address || '',
        phone: contacts?.phone || ''
      }
      const response = await apiClient.put('/contacts', data)
      return mapContactsToFrontend(response)
    } catch (error) {
      console.error('Error updating contacts:', error)
      throw error
    }
  }
}

export default contactService
