import { useState, useCallback, useEffect } from 'react';
import imageService from '../services/imageService';
import { base64ToObjectURL } from '../utils/imageUtils';

/**
 * Hook for image upload and conversion
 */
export function useImageUpload() {
  const [base64, setBase64] = useState(null);
  const [displayURL, setDisplayURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');

  const handleFileUpload = useCallback(async (file) => {
    setLoading(true);
    setError(null);

    try {
      // Process and convert file to base64
      const b64 = await imageService.processImageFile(file);
      setBase64(b64);
      setMimeType(file.type);

      // Create display URL
      const url = base64ToObjectURL(b64, file.type);
      setDisplayURL(url);

      return b64;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleURLUpload = useCallback(
    async (url) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], 'image', { type: blob.type });

        return handleFileUpload(file);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load image';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleFileUpload]
  );

  const reset = useCallback(() => {
    setBase64(null);
    setDisplayURL(null);
    setError(null);
    if (displayURL?.startsWith('blob:')) {
      URL.revokeObjectURL(displayURL);
    }
  }, [displayURL]);

  return {
    base64,
    displayURL,
    mimeType,
    loading,
    error,
    handleFileUpload,
    handleURLUpload,
    reset,
  };
}

/**
 * Hook to display base64 image from server
 */
export function useImageDisplay(imageBase64, defaultMimeType = 'image/jpeg') {
  const [displayURL, setDisplayURL] = useState(null);

  useEffect(() => {
    if (!imageBase64) {
      setDisplayURL(null);
      return;
    }

    try {
      const url = base64ToObjectURL(imageBase64, defaultMimeType);
      setDisplayURL(url);

      // Cleanup on unmount
      return () => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      };
    } catch (err) {
      console.error('Failed to display image:', err);
      setDisplayURL(null);
    }
  }, [imageBase64, defaultMimeType]);

  return displayURL;
}
