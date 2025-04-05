
import { Link } from 'react-router-dom';

const HeroSection = ({ isLoaded, user, hasVipAccess, theme }) => {
  return (
    <section className={`pt-24 pb-20 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className={`md:w-1/2 md:pr-8 mb-8 md:mb-0 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="inline-block px-3 py-1 bg-metadite-primary/10 text-metadite-primary rounded-full text-sm font-medium mb-4">
              Premium Collectibles
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-metadite-dark via-metadite-primary to-metadite-secondary bg-clip-text text-transparent">
              Discover Exquisite Model Dolls
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Explore our collection of beautifully crafted model dolls with premium quality and attention to detail. Join our VIP membership for exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/models"
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg font-medium"
              >
                Browse Models
              </Link>
              {!user && (
                <Link 
                  to="/login"
                  className="border-2 border-metadite-primary text-metadite-primary px-6 py-3 rounded-lg hover:bg-metadite-primary/5 transition-colors font-medium"
                >
                  Join VIP
                </Link>
              )}
              {user && !hasVipAccess && (
                <Link 
                  to="/upgrade"
                  className="border-2 border-metadite-primary text-metadite-primary px-6 py-3 rounded-lg hover:bg-metadite-primary/5 transition-colors font-medium"
                >
                  Upgrade to VIP
                </Link>
              )}
            </div>
          </div>
          
          <div className={`md:w-1/2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="absolute -top-6 -right-6 -bottom-6 -left-6 bg-gradient-to-br from-metadite-primary/20 via-metadite-secondary/20 to-metadite-accent/20 rounded-xl animate-pulse-soft"></div>
              <img 
                src="https://images.unsplash.com/photo-1620218944474-d2a3029da66d?q=80&w=1000&auto=format&fit=crop" 
                alt="Featured Model Doll" 
                className="w-full h-auto rounded-xl relative z-10 object-cover shadow-xl"
              />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full py-1 px-3 shadow-lg z-20">
                <span className="text-metadite-primary font-bold">New Collection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
