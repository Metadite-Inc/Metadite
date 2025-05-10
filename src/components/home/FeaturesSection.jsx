
import { Video, ScanEye, Users } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const FeaturesSection = ({ theme }) => {
  return (
    <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Metadite?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer premium quality and exclusive content for model enthusiasts and collectors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ScanEye className="h-8 w-8 text-white" />} 
            title="Premium Visual Experience" 
            description="Every model is captured in stunning, high-definition detail to deliver a captivating and sensual viewing experience."
            flipOnMount={true}
          />
          
          <FeatureCard 
            icon={<Video className="h-8 w-8 text-white" />} 
            title="Exclusive Member Access" 
            description="Get access to private videos and photo sets reserved only for subscribers-content that goes beyond the surface."
            delay="0.3s"
            flipOnMount={true}
          />
          
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-white" />} 
            title="Real Interaction, Real Connection" 
            description="Use your messages to connect with models on a deeper level before making a purchase. It's more than content-it's conversation, chemistry, and choice."
            delay="0.6s"
            flipOnMount={true}
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, delay = "0s", flipOnMount }) => {
  const iconRef = useRef();
  useEffect(() => {
    if (flipOnMount && iconRef.current) {
      iconRef.current.classList.add("feature-flip");
      const timeout = setTimeout(() => {
        iconRef.current.classList.remove("feature-flip");
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [flipOnMount]);
  return (
    <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all animate-float" style={{ animationDelay: delay }}>
      <div
        ref={iconRef}
        className="bg-gradient-to-r from-metadite-primary to-metadite-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-flip-y"
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default FeaturesSection;
