import apiClient from './apiClient'

export const homeService = {
  async getFeaturedCakes() {
    try {
      const response = await apiClient.get('/home/featured-cakes')
      return Array.isArray(response) ? response : response?.data || []
    } catch (error) {
      console.error('Erro ao carregar featured cakes:', error)
      return []
    }
  },

  async getHome() {
    try {
      const response = await apiClient.get('/home/featured-cakes')
      return { featuredCakes: Array.isArray(response) ? response : response?.data || [] }
    } catch (error) {
      console.error('Erro ao carregar home data:', error)
      return { featuredCakes: [] }
    }
  },

  async getFeaturedCakeById(id) {
    return apiClient.get(`/home/featured-cakes/${id}`)
  },

  async createFeaturedCake(cake) {
    return apiClient.post('/home/featured-cakes', cake)
  },

  async updateFeaturedCake(id, cake) {
    return apiClient.put(`/home/featured-cakes/${id}`, cake)
  },

  async deleteFeaturedCake(id) {
    return apiClient.delete(`/home/featured-cakes/${id}`)
  }
}

export default homeService
