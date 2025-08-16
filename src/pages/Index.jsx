
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import FeaturedModelsSection from '../components/home/FeaturedModelsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
//import CtaSection from '../components/home/CtaSection';
import { fetchFeaturedModels, testimonials } from '../data/homePageData';

const Index = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [featuredModels, setFeaturedModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if user has VIP access
  const hasVipAccess = user?.membership_level === 'vip' || user?.membership_level === 'vvip';

  // Fetch featured models
  useEffect(() => {
    const loadFeaturedModels = async () => {
      try {
        // If user is admin, show all featured models. Otherwise, filter by user's region
        const userRegion = user && user.role !== 'admin' ? user.region : null;
        const models = await fetchFeaturedModels(userRegion);
        setFeaturedModels(models || []);
      } catch (error) {
        console.error('Error fetching featured models:', error);
        setFeaturedModels([]);
      } finally {
        setModelsLoading(false);
      }
    };

    loadFeaturedModels();
  }, [user]);

  useEffect(() => {
    // Only redirect if user is logged in and is staff
    if (!loading && user && (user.role === 'admin' || user.role === 'moderator')) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'moderator') {
        navigate('/moderator', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Set loaded state for animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-metadite-primary"></div>
      </div>
    );
  }

  // Show loading spinner only if we're about to redirect logged-in staff users
  if (user && (user.role === 'admin' || user.role === 'moderator')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-metadite-primary"></div>
      </div>
    );
  }

  // Always render landing page for non-staff users or when logged out
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <HeroSection isLoaded={isLoaded} user={user} hasVipAccess={hasVipAccess} theme={theme} />
        <FeaturesSection theme={theme} />
        <FeaturedModelsSection models={featuredModels} loading={modelsLoading} theme={theme} user={user} />
        <TestimonialsSection testimonials={testimonials} theme={theme} />
        {/* <CtaSection user={user} hasVipAccess={hasVipAccess} /> */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
