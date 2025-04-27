import React, { useState } from 'react';

/**
 * Drag-and-drop image uploader for models management.
 * Calls onImageChange with the File object (for upload) and preview URL.
 */
export default function ModelImageUploader({ onImageChange }) {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        className={`border-2 ${dragActive ? 'border-metadite-primary' : 'border-gray-300'} border-dashed rounded-md p-4 text-center transition-colors mb-2`}
        style={{ cursor: 'pointer', background: dragActive ? '#f0f4ff' : undefined }}
        onClick={() => document.getElementById('model-image-input').click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, margin: '0 auto' }} />
        ) : (
          <span className="text-gray-500">Drag & drop image here, or click to select</span>
        )}
      </div>
      <input
        id="model-image-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}
