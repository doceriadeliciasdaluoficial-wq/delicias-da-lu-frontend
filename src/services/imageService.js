import { fileToBase64, validateImageFile } from '../utils/imageUtils';
import apiClient from './apiClient';

/**
 * Service for handling image uploads and API communication
 */
class ImageService {
  constructor(config = {}) {
    this.config = {
      maxSizeMB: 5,
      allowedMimes: ['image/jpeg', 'image/png', 'image/webp'],
      ...config,
    };
  }

  /**
   * Convert file to base64 and validate
   */
  async processImageFile(file) {
    // Validate file
    const validation = await validateImageFile(
      file,
      this.config.maxSizeMB,
      this.config.allowedMimes
    );

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Convert to base64
    return fileToBase64(file);
  }

  /**
   * Create menu item with image
   */
  async createMenuItem(data) {
    const response = await apiClient.post('/menu/items', data);
    return response.data;
  }

  /**
   * Update menu item with image
   */
  async updateMenuItem(id, data) {
    const response = await apiClient.put(`/menu/items/${id}`, data);
    return response.data;
  }

  /**
   * Get menu items (includes base64 images in response)
   */
  async getMenuItems() {
    const response = await apiClient.get('/menu/items');
    return response.data;
  }

  /**
   * Create cake builder component with image
   */
  async createCakeComponent(type, data) {
    const response = await apiClient.post(`/cake-builder/${type}`, data);
    return response.data;
  }

  /**
   * Update cake builder component with image
   */
  async updateCakeComponent(type, id, data) {
    const response = await apiClient.put(`/cake-builder/${type}/${id}`, data);
    return response.data;
  }

  /**
   * Get cake builder components
   */
  async getCakeBuilderComponents(type) {
    const response = await apiClient.get(`/cake-builder/${type}`);
    return response.data;
  }

  /**
   * Create featured cake with image
   */
  async createFeaturedCake(data) {
    const response = await apiClient.post('/home/featured-cakes', data);
    return response.data;
  }

  /**
   * Update featured cake with image
   */
  async updateFeaturedCake(id, data) {
    const response = await apiClient.put(`/home/featured-cakes/${id}`, data);
    return response.data;
  }

  /**
   * Get featured cakes (includes base64 images in response)
   */
  async getFeaturedCakes() {
    const response = await apiClient.get('/home/featured-cakes');
    return response.data;
  }
}

export default new ImageService();
