
import { Video, ScanEye, Users, CloverIcon, HandHeart, GemIcon, ShipWheel } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const FeaturesSection = ({ theme }) => {
  return (
    <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Metadite?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Because you’re not just buying a doll - you’re investing in pleasure, connection, and control on your own terms.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<HandHeart className="h-8 w-8 text-white" />} 
            title="Yours, Always" 
            description="No monthly fees. No limitations. Once she’s yours, she’s fully yours - to hold, explore, and enjoy anytime. Real intimacy, without the games."
            flipOnMount={true}
          />
          
          <FeatureCard 
            icon={<GemIcon className="h-8 w-8 text-white" />} 
            title="Lifelike Perfection" 
            description="She doesn’t just look real - she feels real. Every Metadite doll is crafted with stunning detail, soft skin, and lifelike curves that respond to your touch. Built to satisfy, designed to last."
            delay="0.3s"
            flipOnMount={true}
          />
          
          <FeatureCard 
            icon={<ShipWheel className="h-8 w-8 text-white" />} 
            title=" Ready to Ship" 
            description="No delays, no waiting lists. Every doll is in stock and ships discreetly, directly to your door. Premium packaging, private delivery - pleasure is just days away."
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
