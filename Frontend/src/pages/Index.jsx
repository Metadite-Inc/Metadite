import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModelCard from '../components/ModelCard';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Star, ShoppingCart, Users, Video } from 'lucide-react';

// Mock data
const featuredModels = [
  {
    id: 1,
    name: 'Sophia Elegance',
    price: 129.99,
    description: 'Handcrafted porcelain doll with intricate details and premium fabric clothing. A classic addition to any collection.',
    image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Victoria Vintage',
    price: 159.99,
    description: 'Inspired by Victorian era fashion, this doll features authentic period clothing and accessories with incredible attention to detail.',
    image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Modern Mila',
    price: 99.99,
    description: 'Contemporary doll design with customizable features and modern fashion elements. Perfect for the trendy collector.',
    image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Emily Thompson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'The quality of these model dolls is exceptional! The attention to detail and craftsmanship is outstanding.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Davis',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'I\'ve been collecting for years and Metadite offers some of the most unique and beautiful designs I\'ve ever seen.',
    rating: 5
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'The VIP membership is absolutely worth it! Access to exclusive content and early releases has enhanced my collecting experience.',
    rating: 4
  }
];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  const hasVipAccess = user?.membershipLevel === 'vip' || user?.membershipLevel === 'vvip';
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
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
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Metadite?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer premium quality and exclusive content for model enthusiasts and collectors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all animate-float">
              <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Each model is crafted with exceptional attention to detail and made from high-quality materials.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all animate-float" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Content</h3>
              <p className="text-gray-600">
                VIP members get access to exclusive videos, tutorials, and behind-the-scenes content.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all animate-float" style={{ animationDelay: '0.6s' }}>
              <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Join a vibrant community of collectors and enthusiasts sharing their passion.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Models */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Models</h2>
            <Link to="/models" className="flex items-center text-metadite-primary hover:text-metadite-secondary transition-colors">
              <span>View All</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our community has to say about Metadite.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-card p-6 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-metadite-primary to-metadite-secondary">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Community?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Sign up today and explore our exclusive collection of premium model dolls. VIP members get special access to videos and early releases.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!user ? (
              <Link 
                to="/login"
                className="bg-white text-metadite-primary px-8 py-3 rounded-lg hover:bg-opacity-90 transition-opacity shadow-lg font-medium"
              >
                Sign Up Now
              </Link>
            ) : !hasVipAccess ? (
              <Link 
                to="/upgrade"
                className="bg-white text-metadite-primary px-8 py-3 rounded-lg hover:bg-opacity-90 transition-opacity shadow-lg font-medium"
              >
                Upgrade to VIP
              </Link>
            ) : null}
            <Link 
              to="/models"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
