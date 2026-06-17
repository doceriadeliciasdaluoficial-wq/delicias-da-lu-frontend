/**
 * Configuration for image operations
 */
export interface ImageConfig {
  /** Max file size in MB (default: 5) */
  maxSizeMB?: number;
  
  /** Allowed MIME types (default: jpeg, png, webp) */
  allowedMimes?: string[];
}

/**
 * Image upload payload sent to backend
 */
export interface ImageUploadPayload {
  /** Base64-encoded image string */
  image: string;
}

/**
 * MenuItem with image base64
 */
export interface MenuItemWithImage {
  id: string;
  name: string;
  category: string;
  price: number;
  unit?: string;
  image?: string; // base64-encoded image
  description?: string;
  active: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * CakeBuilder component with image base64
 */
export interface CakeBuilderComponentWithImage {
  id: string;
  name: string;
  type: 'massa' | 'recheio' | 'cobertura' | 'decoracao';
  price: number;
  image?: string; // base64-encoded image
  active: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Featured Cake with image base64
 */
export interface FeaturedCakeWithImage {
  id: string;
  name: string;
  description: string;
  image?: string; // base64-encoded image
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Image validation result
 */
export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Image loaded from file or URL
 */
export interface LoadedImage {
  blob: Blob;
  mimeType: string;
  filename?: string;
}
