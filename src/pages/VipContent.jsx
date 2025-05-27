
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import VipHeader from '../components/vip/VipHeader';
import VideoSearch from '../components/vip/VideoSearch';
import VideoGrid from '../components/vip/VideoGrid';
import { useVipVideos } from '../hooks/useVipVideos';
import { Loader2 } from 'lucide-react';

const VipContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredVideos, isLoaded, isLoading } = useVipVideos(searchTerm);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Redirect non-VIP users
    if (!user?.membership_level || (user.membership_level !== 'vip' && user.membership_level !== 'vvip')) {
      navigate('/upgrade');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <VipHeader filteredVideosCount={filteredVideos.length} />
          <VideoSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 text-metadite-primary animate-spin" />
              <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                Loading videos...
              </span>
            </div>
          ) : (
            <VideoGrid videos={filteredVideos} isLoaded={isLoaded} />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VipContent;
