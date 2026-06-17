/**
 * Convert Blob/File to base64 string
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Remove 'data:image/...;base64,' prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 string back to Blob
 */
export function base64ToBlob(base64, mimeType = 'image/jpeg') {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: mimeType });
}

/**
 * Create object URL from base64 string for displaying in <img>
 */
export function base64ToObjectURL(base64, mimeType = 'image/jpeg') {
  const blob = base64ToBlob(base64, mimeType);
  return URL.createObjectURL(blob);
}

/**
 * Load image from URL and convert to base64
 */
export async function loadImageFromURL(url) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to load image from URL: ${response.statusText}`);
  }

  const blob = await response.blob();
  return fileToBase64(new File([blob], 'image', { type: blob.type }));
}

/**
 * Validate image file
 */
export async function validateImageFile(
  file,
  maxSizeMB = 5,
  allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
) {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check MIME type
  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed: ${allowedMimes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Load image from file input
 */
export async function loadImageFromFileInput(file) {
  return {
    blob: file,
    mimeType: file.type,
    filename: file.name,
  };
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get mime type from file name
 */
export function getMimeTypeFromFilename(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  
  return mimeTypes[ext || ''] || 'image/jpeg';
}
