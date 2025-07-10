
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
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

const VideoTable = ({ 
  videos, 
  searchTerm, 
  loading, 
  getModelNameById, 
  handleDeleteVideo 
}) => {
  const { theme } = useTheme();
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-metadite-primary mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading videos...</p>
      </div>
    );
  }
  
  if (videos.length === 0) {
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
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
        <p className="text-gray-500">No videos found</p>
      </div>
    );
  }

  // Debug: Log the first video to see the structure
  if (videos.length > 0) {
    console.log('First video data:', videos[0]);
    console.log('Video URL:', videos[0].url);
    console.log('Full video URL:', getFullImageUrl(videos[0].url));
  }

  // Filter videos by search term
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getModelNameById(video.model_id).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No videos match your search</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
            <TableHead>Preview</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Doll Model</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Added Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVideos.map((video) => (
            <TableRow key={video.id} className={`border-t border-gray-100 transition-colors 
              ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >
              <TableCell>
                <video 
                  src={getFullImageUrl(video.url)} 
                  className="w-16 h-9 object-cover rounded-md"
                  muted
                  autoPlay
                  loop
                  preload="metadata"
                  onError={e => { 
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="w-16 h-9 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500"
                  style={{ display: 'none' }}
                >
                  No Preview
                </div>
              </TableCell>
              <TableCell className="font-medium">{video.title}</TableCell>
              <TableCell>{getModelNameById(video.model_id)}</TableCell>
              <TableCell>
                {video.is_featured ? (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Featured
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Not Featured
                  </span>
                )}
              </TableCell>
              <TableCell>{new Date(video.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => handleDeleteVideo(video.id)}
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

export default VideoTable;
