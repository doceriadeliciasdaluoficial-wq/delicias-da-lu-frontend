import React, { useRef, useEffect, useState } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';
import { formatFileSize } from '../utils/imageUtils';

/**
 * ImageUploader component for uploading and previewing images
 */
const ImageUploader = ({
  onImageBase64Change,
  label = 'Upload Image',
}) => {
  const fileInputRef = useRef(null);
  const [hasChanged, setHasChanged] = useState(false);
  const {
    base64,
    displayURL,
    mimeType,
    loading,
    error,
    handleFileUpload,
    handleURLUpload,
    reset,
  } = useImageUpload();

  // Only notify parent of changes when user has actually interacted with the uploader
  useEffect(() => {
    if (hasChanged) {
      onImageBase64Change(base64, mimeType);
    }
  }, [base64, mimeType, hasChanged]); // Remove onImageBase64Change to prevent infinite loop

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setHasChanged(true);
      handleFileUpload(file).catch((err) => console.error(err));
    }
  };

  const handleURLChange = (event) => {
    const url = event.target.value.trim();
    if (url) {
      setHasChanged(true);
      handleURLUpload(url).catch((err) => console.error(err));
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>

      <div style={styles.inputGroup}>
        {/* File input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          disabled={loading}
          hidden
          style={styles.hiddenInput}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Choose File'}
        </button>

        {/* URL input */}
        <input
          type="url"
          placeholder="Or paste image URL"
          onChange={handleURLChange}
          disabled={loading}
          style={styles.urlInput}
        />
      </div>

      {/* Preview */}
      {displayURL && (
        <div style={styles.previewContainer}>
          <img
            src={displayURL}
            alt="Preview"
            style={styles.previewImage}
          />
          {base64 && (
            <p style={styles.sizeText}>
              {formatFileSize((base64.length * 0.75) / 1.33)}
            </p>
          )}
          <button
            onClick={() => {
              reset();
              onImageBase64Change(null, 'image/jpeg')
            }}
            style={styles.removeButton}
          >
            Remove
          </button>
        </div>
      )}

      {/* Error message */}
      {error && <div style={styles.errorMessage}>{error}</div>}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  urlInput: {
    flex: '1',
    minWidth: '200px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  hiddenInput: {
    display: 'none',
  },
  previewContainer: {
    position: 'relative',
    marginTop: '15px',
    textAlign: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '4px',
    objectFit: 'cover',
  },
  sizeText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
  },
  removeButton: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  errorMessage: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    fontSize: '14px',
  },
};

export default ImageUploader;
