
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import FeaturedModelsSection from '../components/home/FeaturedModelsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';

import { fetchFeaturedModels, testimonials } from '../data/homePageData';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredModels, setFeaturedModels] = useState([]);
  const { user } = useAuth();
  const { theme } = useTheme();
  const hasVipAccess = user?.membershipLevel === 'vip' || user?.membershipLevel === 'vvip';

  useEffect(() => {
    setIsLoaded(true);
    fetchFeaturedModels().then(setFeaturedModels);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection isLoaded={isLoaded} user={user} hasVipAccess={hasVipAccess} theme={theme} />
      <FeaturesSection theme={theme} />
      <FeaturedModelsSection models={featuredModels} theme={theme} />
      <TestimonialsSection testimonials={testimonials} theme={theme} />
      <CtaSection user={user} hasVipAccess={hasVipAccess} />
      <Footer />
    </div>
  );
};

export default Index;
