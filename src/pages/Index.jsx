
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import FeaturedModelsSection from '../components/home/FeaturedModelsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
        <HeroSection />
        <FeaturesSection />
        <FeaturedModelsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
