
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
import { useChatAccess } from '../hooks/useChatAccess';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import { Loader2, Lock } from 'lucide-react';

const VipContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredVideos, isLoaded, isLoading } = useVipVideos(searchTerm);
  const { canWatchVideos, loading: accessLoading } = useChatAccess();
  const { theme } = useTheme();
  
  // Add performance optimization
  usePerformanceOptimization();

  useEffect(() => {
    // Redirect non-VIP users
    if (!user?.membership_level || (user.membership_level !== 'vip' && user.membership_level !== 'vvip')) {
      navigate('/upgrade');
    }
  }, [user, navigate]);

  // Show loading while checking access
  if (accessLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 text-metadite-primary animate-spin" />
              <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                Checking access permissions...
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show access denied message if user can't watch videos
  if (!canWatchVideos) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Lock className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Access Restricted
              </h2>
              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                You don't have permission to watch videos at this time.
              </p>
              <button 
                onClick={() => navigate('/upgrade')}
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
              >
                Upgrade Membership
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          {/* Render header immediately to improve LCP */}
          <VipHeader filteredVideosCount={isLoaded ? filteredVideos.length : 0} />
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
