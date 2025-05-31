
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

  // Don't render the landing page for staff users
  if (user && (user.role === 'admin' || user.role === 'moderator')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-metadite-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user && (user.role === 'admin' || user.role === 'moderator') ? (
        <StaffNavbar />
      ) : (
        <Navbar />
      )}
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedModelsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      
      {user && (user.role === 'admin' || user.role === 'moderator') ? (
        <StaffFooter />
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default Index;
