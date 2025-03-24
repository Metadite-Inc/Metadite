
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { Video, Filter, Search } from 'lucide-react';

// Mock data for VIP videos
const vipVideos = [
  {
    id: 1,
    title: 'Behind the Scenes: Making of Victoria Vintage',
    modelName: 'Victoria Vintage',
    duration: '12:34',
    thumbnail: 'https://images.unsplash.com/photo-1545239705-1564e6722e81?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '2 days ago'
  },
  {
    id: 2,
    title: 'Detailed Craftsmanship of Sophia Elegance',
    modelName: 'Sophia Elegance',
    duration: '8:45',
    thumbnail: 'https://images.unsplash.com/photo-1609726125291-190a9368cc3f?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '1 week ago'
  },
  {
    id: 3,
    title: 'Modern Mila Design Process',
    modelName: 'Modern Mila',
    duration: '15:22',
    thumbnail: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 4,
    title: 'Collector\'s Guide: Premium Storage Solutions',
    modelName: 'Various Models',
    duration: '10:18',
    thumbnail: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '3 days ago'
  },
  {
    id: 5,
    title: 'Exclusive Interview with Master Craftsman',
    modelName: 'Various Models',
    duration: '22:07',
    thumbnail: 'https://images.unsplash.com/photo-1599639957037-f791c72e853c?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 6,
    title: 'Restoration Techniques for Vintage Models',
    modelName: 'Victoria Vintage',
    duration: '18:33',
    thumbnail: 'https://images.unsplash.com/photo-1605289355680-75fb41239154?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 7,
    title: 'Limited Edition Models Showcase',
    modelName: 'Various Models',
    duration: '14:50',
    thumbnail: 'https://images.unsplash.com/photo-1595446472013-83748e352d7d?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '5 days ago'
  },
  {
    id: 8,
    title: 'Metadite Collection 2023 Preview',
    modelName: 'New Collection',
    duration: '9:42',
    thumbnail: 'https://images.unsplash.com/photo-1515660130198-1c888aac7ed1?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 9,
    title: 'Photography Tips for Collectors',
    modelName: 'Various Models',
    duration: '11:16',
    thumbnail: 'https://images.unsplash.com/photo-1580706483913-b6ea7db483a0?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '1 day ago'
  },
  {
    id: 10,
    title: 'Holiday Special: Gift Ideas for Collectors',
    modelName: 'Various Models',
    duration: '16:24',
    thumbnail: 'https://images.unsplash.com/photo-1607262807149-dda0a6e926e5?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 11,
    title: 'Advanced Display Techniques',
    modelName: 'Various Models',
    duration: '13:59',
    thumbnail: 'https://images.unsplash.com/photo-1615198996529-4d39019cc475?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 12,
    title: 'Material Science: Understanding Quality',
    modelName: 'Various Models',
    duration: '20:11',
    thumbnail: 'https://images.unsplash.com/photo-1594026112248-4572e9107ee9?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '4 days ago'
  },
  {
    id: 13,
    title: 'Exclusive: New York Collectors Exhibition',
    modelName: 'Various Models',
    duration: '17:33',
    thumbnail: 'https://images.unsplash.com/photo-1533658280853-e4a10c25a30d?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 14,
    title: 'Caring for Your Collection: Maintenance Tips',
    modelName: 'Various Models',
    duration: '12:48',
    thumbnail: 'https://images.unsplash.com/photo-1619596662922-58944c56554b?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 15,
    title: 'Collector Spotlight: Celebrity Collections',
    modelName: 'Various Models',
    duration: '19:26',
    thumbnail: 'https://images.unsplash.com/photo-1535571393765-ea44927160be?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '1 week ago'
  }
];

const VipContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState(vipVideos);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Redirect non-VIP users
    if (!user?.membershipLevel || (user.membershipLevel !== 'vip' && user.membershipLevel !== 'vvip')) {
      navigate('/upgrade');
    }
    
    // Set videos as loaded after a short delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);
  
  useEffect(() => {
    // Filter videos based on search term
    if (searchTerm.trim() === '') {
      setFilteredVideos(vipVideos);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredVideos(
        vipVideos.filter(
          video => 
            video.title.toLowerCase().includes(term) || 
            video.modelName.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-20 pb-12 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">VIP Exclusive Videos</h1>
                  <p className="opacity-80">Access to premium content for VIP members only</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                  {filteredVideos.length} Videos
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span>Filters</span>
                  </button>
                  <button className="flex items-center space-x-1 px-4 py-2 bg-metadite-primary text-white rounded-md hover:opacity-90 transition-opacity">
                    <Video className="h-4 w-4" />
                    <span>Recent</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos.map((video, index) => (
                <div 
                  key={video.id} 
                  className={`transition-all duration-500 transform ${
                    isLoaded 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <VideoCard video={video} vipAccess={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-10 text-center">
              <Video className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-xl font-medium mb-2">No videos found</h3>
              <p className="text-gray-500">
                We couldn't find any videos matching "{searchTerm}". Try a different search term.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VipContent;
