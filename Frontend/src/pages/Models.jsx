
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModelCard from '../components/ModelCard';
import { Search, Filter, Bookmark, Grid, Tag } from 'lucide-react';

// Mock data for model listings with categories
const modelData = [
  {
    id: 1,
    name: 'Sophia Elegance',
    price: 129.99,
    description: 'Handcrafted porcelain doll with intricate details and premium fabric clothing. A classic addition to any collection.',
    image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
    category: 'Premium'
  },
  {
    id: 2,
    name: 'Victoria Vintage',
    price: 159.99,
    description: 'Inspired by Victorian era fashion, this doll features authentic period clothing and accessories with incredible attention to detail.',
    image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop',
    category: 'Premium'
  },
  {
    id: 3,
    name: 'Modern Mila',
    price: 99.99,
    description: 'Contemporary doll design with customizable features and modern fashion elements. Perfect for the trendy collector.',
    image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop',
    category: 'Standard'
  },
  {
    id: 4,
    name: 'Elegant Eleanor',
    price: 149.99,
    description: 'Elegant porcelain doll with handcrafted lace details and satin finish. A premium collector\'s item.',
    image: 'https://images.unsplash.com/photo-1590072060877-89cdc8ab5524?q=80&w=1000&auto=format&fit=crop',
    category: 'Premium'
  },
  {
    id: 5,
    name: 'Classic Charlotte',
    price: 119.99,
    description: 'Traditional design with timeless appeal, featuring hand-painted features and authentic period costume.',
    image: 'https://images.unsplash.com/photo-1566512772618-ddecb1492ee9?q=80&w=1000&auto=format&fit=crop',
    category: 'Standard'
  },
  {
    id: 6,
    name: 'Retro Rebecca',
    price: 139.99,
    description: 'Vintage-inspired model with authentic mid-century styling and accessories. A nostalgic addition to any collection.',
    image: 'https://images.unsplash.com/photo-1597046510717-b0ffd88d592d?q=80&w=1000&auto=format&fit=crop',
    category: 'Limited Edition'
  }
];

const Models = () => {
  const [models, setModels] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  useEffect(() => {
    // Simulate fetching models from an API
    setTimeout(() => {
      setModels(modelData);
      setIsLoaded(true);
    }, 800);
  }, []);
  
  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        model.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || model.category === categoryFilter;
    
    let matchesPrice = true;
    if (priceFilter === 'under100' && model.price < 100) matchesPrice = true;
    else if (priceFilter === '100to150' && model.price >= 100 && model.price <= 150) matchesPrice = true;
    else if (priceFilter === 'over150' && model.price > 150) matchesPrice = true;
    else if (priceFilter !== 'all') matchesPrice = false;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Get available categories from model data
  const categories = ['all', ...new Set(models.map(model => model.category))];

  if (user?.role === 'moderator') {
    navigate('/moderator');
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-12 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">Our Model Collection</h1>
          <p className="text-gray-600 mb-8">
            Explore our premium selection of beautifully crafted model dolls
          </p>
          
          <div className="glass-card rounded-xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search models..."
                    className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-metadite-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-4">
                  <Filter className="h-5 w-5 text-metadite-primary" />
                  <select
                    className="py-2 px-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-metadite-primary bg-white"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="under100">Under $100</option>
                    <option value="100to150">$100 - $150</option>
                    <option value="over150">Over $150</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-metadite-primary" />
                  <select
                    className="py-2 px-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-metadite-primary bg-white"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.filter(cat => cat !== 'all').map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(categoryFilter !== 'all' || priceFilter !== 'all') && (
              <div className="flex items-center flex-wrap mt-4 ml-2">
                <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                
                {categoryFilter !== 'all' && (
                  <span className="inline-flex items-center bg-metadite-primary/10 text-metadite-primary text-xs px-2 py-1 rounded-full mr-2">
                    Category: {categoryFilter}
                    <button 
                      onClick={() => setCategoryFilter('all')}
                      className="ml-1 hover:text-metadite-secondary"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {priceFilter !== 'all' && (
                  <span className="inline-flex items-center bg-metadite-primary/10 text-metadite-primary text-xs px-2 py-1 rounded-full">
                    Price: {priceFilter === 'under100' ? 'Under $100' : priceFilter === '100to150' ? '$100 - $150' : 'Over $150'}
                    <button 
                      onClick={() => setPriceFilter('all')}
                      className="ml-1 hover:text-metadite-secondary"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                <button 
                  onClick={() => {
                    setCategoryFilter('all');
                    setPriceFilter('all');
                  }}
                  className="text-xs text-metadite-primary hover:underline ml-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          
          {/* Category Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-metadite-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid className="h-4 w-4 mr-2" />
              All Categories
            </button>
            
            {categories.filter(cat => cat !== 'all').map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === category
                    ? 'bg-metadite-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category === 'Premium' && <Bookmark className="h-4 w-4 mr-2" />}
                {category === 'Standard' && <Tag className="h-4 w-4 mr-2" />}
                {category === 'Limited Edition' && <Bookmark className="h-4 w-4 mr-2 fill-current" />}
                {category}
              </button>
            ))}
          </div>
          
          {isLoaded ? (
            filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No models found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setPriceFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="mt-4 text-metadite-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card rounded-xl overflow-hidden h-96 shimmer"></div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Models;
