
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

const VipContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredVideos, isLoaded } = useVipVideos(searchTerm);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Redirect non-VIP users
    if (!user?.membershipLevel || (user.membershipLevel !== 'vip' && user.membershipLevel !== 'vvip')) {
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
          <VideoGrid videos={filteredVideos} isLoaded={isLoaded} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VipContent;