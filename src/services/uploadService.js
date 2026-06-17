import apiClient from './apiClient'
import { fileToBase64 } from '../utils/imageUtils'

/**
 * Upload image and get back the path from the backend
 * Expects backend to have /admin/upload endpoint that accepts multipart form data
 */
export const uploadService = {
  /**
   * Upload a file and get the image path
   * @param {File} file - File object to upload
   * @param {string} type - Type of image (menu, cakeBuilder, home, etc.)
   * @returns {Promise<string>} Image path returned from backend
   */
  async uploadFile(file, type = 'general') {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await apiClient.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Backend should return { path: '/images/...' } or similar
      if (response?.path) {
        return response.path
      } else if (typeof response === 'string') {
        return response
      }

      console.warn('Upload response format unexpected:', response)
      return response
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  /**
   * Upload multiple files
   * @param {File[]} files - Array of files to upload
   * @param {string} type - Type of images
   * @returns {Promise<string[]>} Array of image paths
   */
  async uploadFiles(files, type = 'general') {
    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`files`, file)
      })
      formData.append('type', type)

      const response = await apiClient.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Backend should return array of paths
      if (Array.isArray(response)) {
        return response
      } else if (response?.paths && Array.isArray(response.paths)) {
        return response.paths
      }

      console.warn('Upload response format unexpected:', response)
      return response
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  },

  /**
   * Delete an uploaded image
   * @param {string} path - Image path to delete
   */
  async deleteImage(path) {
    try {
      return await apiClient.delete('/admin/upload', {
        params: {
          path
        }
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  },

  /**
   * Convert base64 to File and upload
   * This is a convenience method for the frontend's base64 image system
   * @param {string} base64 - Base64 encoded image
   * @param {string} filename - Filename for the file
   * @param {string} type - Type of image
   * @returns {Promise<string>} Image path from backend
   */
  async uploadBase64(base64, filename = 'image.jpg', type = 'general') {
    try {
      // Convert base64 to blob
      const binaryString = atob(base64.split(',')[1] || base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      const blob = new Blob([bytes], { type: 'image/jpeg' })
      const file = new File([blob], filename, { type: 'image/jpeg' })

      return await this.uploadFile(file, type)
    } catch (error) {
      console.error('Error uploading base64:', error)
      throw error
    }
  }
}

export default uploadService
