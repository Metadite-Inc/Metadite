
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';
import StaffFooter from '../components/StaffFooter';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import FeaturedModelsSection from '../components/home/FeaturedModelsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to load, then redirect staff users
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      } else if (user.role === 'moderator') {
        navigate('/moderator', { replace: true });
        return;
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

  // Don't render the landing page content if we're about to redirect staff users
  if (user && (user.role === 'admin' || user.role === 'moderator')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-metadite-primary"></div>
      </div>
    );
  }

  // Render landing page for non-staff users or when logged out
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
