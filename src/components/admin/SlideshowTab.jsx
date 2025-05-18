import React, { useState, useEffect } from 'react';
import SlideshowManager from '../SlideshowManager';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { slideshowApi } from '../../lib/api/slideshow_api';
import { Search, Edit, Trash2, PackagePlus } from 'lucide-react';
import { toast } from 'sonner';

const SlideshowTab = ({ isLoaded }) => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        const data = await slideshowApi.getSlideshows();
        setSlides(data);
      } catch (error) {
        toast.error('Failed to fetch slideshow items');
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const handleDeleteSlide = async (slideId) => {
    try {
      await slideshowApi.deleteSlideshow(slideId, token);
      setSlides(slides.filter(slide => slide.id !== slideId));
      toast.success('Slideshow item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete slideshow item');
    }
  };

  return (
    <div className={`glass-card rounded-xl p-10 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-xl font-semibold mb-2 text-center">Slideshow Management</h2>
      <p className="text-gray-500 mb-4 text-center">Upload, remove, and manage slideshow images, GIFs, and videos for the homepage slideshow.</p>
      <div className="mt-10 mb-14">
        <SlideshowManager isLoaded={isLoaded} />
      </div>
      {/* Slideshow Items Management Section */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Manage Slideshow Items</h2>
          {/*<div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search slideshow items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
            />
          </div>*/}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-metadite-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading slideshow items...</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className={`text-left text-gray-500 text-sm ${theme === 'dark' ? 'bg-gray-100' : 'bg-gray-50'}`}>
                  <th className="px-6 py-3">Preview</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Caption</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides
                  .filter(slide =>
                    (slide.caption || '').toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((slide) => (
                    <tr key={slide.id} className={`border-t border-gray-100 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        {slide.is_video ? (
                          <video src={slide.url} className="w-16 h-16 object-contain rounded" controls />
                        ) : (
                          <img
                            src={slide.url}
                            alt={slide.caption || 'Slideshow'}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">{slide.is_video ? 'Video' : 'Image'}</td>
                      <td className="px-6 py-4">{slide.caption || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700 transition-colors" disabled>
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 transition-colors"
                            onClick={() => handleDeleteSlide(slide.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && slides.length === 0 && (
          <div className="text-center py-10">
            <PackagePlus className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No slideshow items found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideshowTab;
