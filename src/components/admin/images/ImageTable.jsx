import React, { useState } from 'react';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import ImagePreviewModal from './ImagePreviewModal';

const ImageTable = ({ 
  images, 
  searchTerm, 
  loading, 
  getModelNameById, 
  handleDeleteImage 
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const { theme } = useTheme();
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-metadite-primary mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading images...</p>
      </div>
    );
  }
  
  if (images.length === 0) {
    return (
      <div className="text-center py-10">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 text-gray-300 mx-auto mb-2" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <p className="text-gray-500">No images found</p>
      </div>
    );
  }

  // Filter images based on search term
  const filteredImages = images.filter(image => {
    const matchesSearch = image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        image.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (filteredImages.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No images match your search criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className={`${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredImages.map((image) => (
            <TableRow key={image.id} className={`${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
              <TableCell>
                <div 
                  className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer hover:ring-2 hover:ring-metadite-primary transition-all"
                  onClick={() => setPreviewImage(image.thumbnail_url || image.url)}
                >
                  <img
                    src={image.thumbnail_url || image.url}
                    alt={image.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="line-clamp-1">{image.title}</div>
                {image.description && (
                  <div className="text-xs text-gray-500 line-clamp-1">
                    {image.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {getModelNameById(image.doll_id) || 'N/A'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  image.is_featured 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {image.is_featured ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {image.title || 'Untitled'}
                  </div>
                  <a 
                    href={image.thumbnail_url || image.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-metadite-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500">
                  {new Date(image.created_at).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {}}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Image Preview Modal */}
      <ImagePreviewModal 
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};

export default ImageTable;
