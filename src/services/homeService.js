import apiClient from './apiClient'

/**
 * Map backend FeaturedCake response to frontend format
 */
function mapFeaturedCakeToFrontend(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    image: data.image || '',
    order: data.order || 1,
    defaultWeight: data.defaultWeight,
    defaultConfig: data.defaultConfig,
    basePrice: data.basePrice,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

export const homeService = {
  async getFeaturedCakes() {
    try {
      const response = await apiClient.get('/home/featured-cakes')
      const cakes = Array.isArray(response) ? response : response?.data || []
      return cakes.map(mapFeaturedCakeToFrontend)
    } catch (error) {
      console.error('Erro ao carregar featured cakes:', error)
      return []
    }
  },

  async getHome() {
    try {
      const response = await apiClient.get('/home/featured-cakes')
      const cakes = Array.isArray(response) ? response : response?.data || []
      return { featuredCakes: cakes.map(mapFeaturedCakeToFrontend) }
    } catch (error) {
      console.error('Erro ao carregar home data:', error)
      return { featuredCakes: [] }
    }
  },

  async getFeaturedCakeById(id) {
    try {
      const response = await apiClient.get(`/home/featured-cakes/${id}`)
      return mapFeaturedCakeToFrontend(response)
    } catch (error) {
      console.error(`Error fetching featured cake ${id}:`, error)
      return null
    }
  },

  async createFeaturedCake(cake) {
    try {
      const data = {
        id: cake.id,
        name: cake.name,
        description: cake.description || '',
        image: cake.image || '',
        order: cake.order || 1,
        defaultWeight: cake.defaultWeight,
        defaultConfig: cake.defaultConfig,
        basePrice: cake.basePrice
      }
      const response = await apiClient.post('/home/featured-cakes', data)
      return mapFeaturedCakeToFrontend(response)
    } catch (error) {
      console.error('Error creating featured cake:', error)
      throw error
    }
  },

  async updateFeaturedCake(id, cake) {
    try {
      const data = {
        name: cake.name,
        description: cake.description || '',
        image: cake.image || '',
        order: cake.order || 1,
        defaultWeight: cake.defaultWeight,
        defaultConfig: cake.defaultConfig,
        basePrice: cake.basePrice
      }
      const response = await apiClient.put(`/home/featured-cakes/${id}`, data)
      return mapFeaturedCakeToFrontend(response)
    } catch (error) {
      console.error(`Error updating featured cake ${id}:`, error)
      throw error
    }
  },

  async deleteFeaturedCake(id) {
    try {
      return await apiClient.delete(`/home/featured-cakes/${id}`)
    } catch (error) {
      console.error(`Error deleting featured cake ${id}:`, error)
      throw error
    }
  }
}

export default homeService
