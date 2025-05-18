import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { slideshowApi } from '../lib/api/slideshow_api';
import { useAuth } from '../context/AuthContext';

export default function SlideshowManager({ isLoaded }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const { token } = useAuth();

  // Fetch slideshow items from API
  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        const data = await slideshowApi.getSlideshows();
        setItems(data);
      } catch (e) {
        setItems([]);
      }
      setLoading(false);
    };
    fetchSlides();
  }, []);

  // --- Upload handler ---
  async function handleUpload(e) {
    e.preventDefault();
    if (!items.filter(item => item.file).length) return;
    try {
      for (const item of items) {
        if (item.file) {
          await slideshowApi.uploadSlideshow({
            file: item.file,
            caption: item.name || '',
            is_video: item.type === 'video',
            token,
          });
        }
      }
      // Remove uploaded files from the upload section
      setItems(prev => prev.filter(item => !item.file));
      alert('Upload successful!');
    } catch (err) {
      alert('Upload failed');
    }
  }

  // --- Cancel handler ---
  function handleCancel(e) {
    e.preventDefault();
    if (window.confirm('Are you sure you want to clear all selected files?')) {
      setItems([]);
    }
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const MAX_SIZE_MB = 30;
    const validFiles = [];
    let rejected = false;
    files.forEach(file => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        rejected = true;
      } else {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video') ? 'video' : 'image';
        validFiles.push({ type, url, name: file.name, file });
      }
    });
    if (rejected) {
      alert(`Some files were not added because they exceed the ${MAX_SIZE_MB}MB limit.`);
    }
    if (validFiles.length > 0) {
      setItems(prev => [...prev, ...validFiles]);
    }
    e.target.value = '';
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    const url = e.target.url.value.trim();
    if (!url) return;
    const type = url.match(/\.mp4$|\.webm$|\.ogg$/i) ? 'video' : 'image';
    setItems(prev => [...prev, { type, url }]);
    e.target.reset();
  };

  // Delete from API if item has id, else from local state
  const handleDelete = async idx => {
    const item = items[idx];
    if (item.id) {
      try {
        await slideshowApi.deleteSlideshow(item.id, token);
        setItems(items.filter((_, i) => i !== idx));
      } catch {
        alert('Failed to delete');
      }
    } else {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className={`glass-card rounded-xl transition-opacity duration-300 max-w-xl mx-auto mt-6 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white rounded-t-xl">
        <h2 className="text-lg font-semibold">Upload Slideshow Item</h2>
      </div>
      <div className="p-6">
        <form className="flex gap-2 mb-4" onSubmit={handleAddUrl}>
          <input type="url" name="url" placeholder="Paste image/video URL" className="px-2 py-1 rounded border border-gray-300 text-xs flex-1" required />
          <button type="submit" className="bg-metadite-primary text-white px-2 py-1 rounded text-xs">Add by URL</button>
        </form>
        <div
          className={`cursor-pointer border-2 border-dashed rounded-xl mb-4 transition-all duration-300 flex flex-col items-center justify-center py-8 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{ minHeight: 130 }}
        >
          <div className={`p-3 rounded-full mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Upload className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`} />
          </div>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Drag and drop or click to select images/videos
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            PNG, JPG, GIF, MP4, WEBM, OGG up to 20MB
          </p>
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/ogg"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        <div className="text-xs text-gray-500 mb-2">Upload images, GIFs, or videos (mp4/webm/ogg) - Max 20MB per file</div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {loading ? (
            <div className="col-span-2 text-center text-gray-400">Loading...</div>
          ) : items.map((item, idx) => (
            <div key={(item.url || item.id) + idx} className="relative group border rounded p-1 bg-gray-50 dark:bg-gray-800">
              {item.type === 'video' || item.is_video ? (
                <video src={item.url || (item.file && URL.createObjectURL(item.file))} className="w-full h-28 object-cover rounded" autoPlay loop muted playsInline />
              ) : (
                <img src={item.url || item.file && URL.createObjectURL(item.file)} alt={item.name || `Slide ${idx + 1}`} className="w-full h-28 object-contain rounded" />
              )}
              <button onClick={() => handleDelete(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 z-40 hover:bg-red-700 transition-colors text-xs">&times;</button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-900 rounded-b-xl">
        <button
          className="bg-metadite-primary text-white px-4 py-2 rounded hover:bg-metadite-secondary transition disabled:opacity-60"
          onClick={handleUpload}
          disabled={items.filter(i => i.file).length === 0}
        >
          Upload
        </button>
        <button
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          onClick={handleCancel}
          disabled={items.length === 0}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
