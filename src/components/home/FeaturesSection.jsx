
import { ShoppingCart, Video, Users } from 'lucide-react';

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
            icon={<ShoppingCart className="h-8 w-8 text-white" />} 
            title="Premium Quality" 
            description="Each model is crafted with exceptional attention to detail and made from high-quality materials."
          />
          
          <FeatureCard 
            icon={<Video className="h-8 w-8 text-white" />} 
            title="Exclusive Content" 
            description="VIP members get access to exclusive videos, tutorials, and behind-the-scenes content."
            delay="0.3s"
          />
          
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-white" />} 
            title="Community" 
            description="Join a vibrant community of collectors and enthusiasts sharing their passion."
            delay="0.6s"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, delay = "0s" }) => {
  return (
    <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all animate-float" style={{ animationDelay: delay }}>
      <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
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
