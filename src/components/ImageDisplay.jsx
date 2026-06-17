import React from 'react';
import { useImageDisplay } from '../hooks/useImageUpload';

/**
 * ImageDisplay component for displaying base64 images
 */
const ImageDisplay = ({
  imageBase64,
  alt = 'Image',
  className = '',
  mimeType = 'image/jpeg',
  style = {},
}) => {
  const displayURL = useImageDisplay(imageBase64, mimeType);

  if (!imageBase64) {
    return (
      <div
        className={className}
        style={{
          ...styles.noImageContainer,
          ...style,
        }}
      >
        No image
      </div>
    );
  }

  if (displayURL) {
    return (
      <img
        src={displayURL}
        alt={alt}
        className={className}
        style={{
          ...styles.image,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        ...styles.errorContainer,
        ...style,
      }}
    >
      Unable to display image
    </div>
  );
};

const styles = {
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    objectFit: 'cover',
  },
  noImageContainer: {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
  },
  errorContainer: {
    padding: '20px',
    backgroundColor: '#f8d7da',
    borderRadius: '4px',
    textAlign: 'center',
    color: '#721c24',
    fontSize: '14px',
  },
};

export default ImageDisplay;
