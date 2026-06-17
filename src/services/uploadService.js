import apiClient from './apiClient'

export const uploadService = {
  async uploadMenuImage(categoryId, itemId, file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/upload', formData, {
      params: {
        type: 'menu',
        category: categoryId,
        id: itemId
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },

  async uploadCakeBuilderImage(componentType, componentId, file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/upload', formData, {
      params: {
        type: 'cakeBuilder',
        category: componentType,
        id: componentId
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },

  async uploadFeaturedCakeImage(cakeId, file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/upload', formData, {
      params: {
        type: 'home',
        id: cakeId
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },

  async deleteImage(path) {
    return apiClient.delete('/upload', {
      params: {
        path
      }
    })
  }
}
}

export default uploadService
