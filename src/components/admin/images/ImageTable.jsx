import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';

const backendUrl = import.meta.env.VITE_API_BASE_URL;

const getFullImageUrl = (url) => {
  if (!url) return '';
  // If already absolute (starts with http), return as is
  if (url.startsWith('http')) return url;
  // Otherwise, prepend backendUrl
  return `${backendUrl}${url}`;
};

const ImageTable = ({ 
  images, 
  searchTerm, 
  loading, 
  getModelNameById, 
  handleDeleteImage 
}) => {
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
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p className="text-gray-500">No images found</p>
      </div>
    );
  }

  // Filter images by search term
  const filteredImages = images.filter(image => 
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.doll_name && image.doll_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    getModelNameById(image.doll_id).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (filteredImages.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No images match your search</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Doll Model</TableHead>
            <TableHead>Added Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredImages.map((image) => (
            <TableRow key={image.id} className={`border-t border-gray-100 transition-colors 
              ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >
              <TableCell>
                <img 
                  src={getFullImageUrl(image.thumbnail_url) || getFullImageUrl(image.image_url) || 'https://via.placeholder.com/150'} 
                  alt={image.title} 
                  className="w-16 h-16 object-cover rounded-md"
                  onError={e => { e.target.src = 'https://via.placeholder.com/150'; }}
                />
              </TableCell>
              <TableCell className="font-medium">{image.title}</TableCell>
              <TableCell>{image.doll_name || getModelNameById(image.doll_id)}</TableCell>
              <TableCell>{new Date(image.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button 
                    className="text-red-500 hover:text-red-700 transition-colors"
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
    </div>
  );
};

export default ImageTable; 