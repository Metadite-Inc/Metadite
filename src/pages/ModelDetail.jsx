
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingCart, Heart, ChevronLeft, Star, Share2, Info, 
  Truck, Package, Clock, ShieldCheck, User, FileText, Grid, Gift, MessageCircle 
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for a single model
const getModelData = (id) => {
  const models = [
    {
      id: 1,
      name: 'Sophia Elegance',
      price: 129.99,
      description: 'Handcrafted porcelain doll with intricate details and premium fabric clothing. A classic addition to any collection.',
      longDescription: 'Sophia Elegance is a masterpiece of craftsmanship, featuring hand-painted details and premium fabric clothing. Each doll is uniquely crafted with attention to the smallest details, from the delicate eyelashes to the perfectly styled hair. The porcelain used is of the highest quality, ensuring a lifelike appearance that will captivate viewers for years to come. The clothing is made from authentic period fabrics, with hand-stitched details that showcase the artistry involved in creating these collectible dolls.',
      image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1625091003965-4d9dea5b1312?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611044318330-9a6e1713d809?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.8,
      reviews: 24,
      inStock: true,
      category: 'Premium',
      specifications: [
        { name: 'Height', value: '18 inches' },
        { name: 'Material', value: 'Porcelain, Fabric' },
        { name: 'Age Range', value: 'Adult Collectors' },
        { name: 'Origin', value: 'Handcrafted in Europe' },
        { name: 'Release Date', value: 'January 2025' },
        { name: 'Limited Edition', value: 'No' },
        { name: 'Articulation', value: 'Fixed pose' },
        { name: 'Hair Type', value: 'Human hair blend' }
      ],
      detailedDescription: "Sophia Elegance represents the pinnacle of doll craftsmanship. Each piece is meticulously crafted by master artisans who have dedicated decades to perfecting their craft. The porcelain is fired at precise temperatures to achieve the perfect translucency and durability. The face painting is done entirely by hand, requiring multiple layers and fine detailing to achieve the lifelike appearance that collectors treasure. The clothing is designed after extensive historical research to ensure period accuracy, with fabrics sourced from specialized mills that create authentic replicas of historical textiles.",
      shippingInfo: {
        dimensions: "20\" x 12\" x 8\"",
        weight: "3.5 lbs",
        handlingTime: "3-5 business days",
        shippingOptions: [
          { method: "Standard", time: "7-10 business days", price: "Free" },
          { method: "Express", time: "2-3 business days", price: "Free" },
          { method: "International", time: "10-14 business days", price: "Free" }
        ],
        specialNotes: "Packaged in a custom protective box with acid-free tissue paper. Certificate of authenticity included."
      },
      customerReviews: [
        { rating: 5, date: "March 12, 2025", comment: "Absolutely stunning craftsmanship. The attention to detail is remarkable, especially in the facial features and costume." },
        { rating: 4, date: "February 18, 2025", comment: "Beautiful addition to my collection. The quality is excellent, though I wish there were more accessory options." },
        { rating: 5, date: "January 30, 2025", comment: "Sophia exceeded my expectations. The porcelain has a wonderful translucency and the costume is historically accurate." }
      ]
    },
    {
      id: 2,
      name: 'Victoria Vintage',
      price: 159.99,
      description: 'Inspired by Victorian era fashion, this doll features authentic period clothing and accessories with incredible attention to detail.',
      longDescription: 'Victoria Vintage captures the elegance and sophistication of the Victorian era with exquisite attention to historical accuracy. Each aspect of this doll has been carefully researched and crafted to represent authentic Victorian fashion and style. From the intricately designed dress with multiple layers of petticoats to the tiny accessories like miniature books and delicate jewelry, every element tells a story of a bygone era. The face is hand-painted with subtle blush tones and features a gentle expression that embodies the refined demeanor of Victorian nobility.',
      image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614344440172-8384ac26984a?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1630191071621-171e469e6128?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.9,
      reviews: 36,
      inStock: true,
      category: 'Premium',
      specifications: [
        { name: 'Height', value: '20 inches' },
        { name: 'Material', value: 'Porcelain, Silk, Lace' },
        { name: 'Age Range', value: 'Adult Collectors' },
        { name: 'Origin', value: 'Handcrafted in United Kingdom' },
        { name: 'Release Date', value: 'November 2022' },
        { name: 'Limited Edition', value: 'Yes (500 pieces)' },
        { name: 'Articulation', value: 'Partial (arms and head)' },
        { name: 'Hair Type', value: 'Premium mohair' }
      ],
      detailedDescription: "Victoria Vintage is a meticulous recreation of high Victorian fashion circa 1876. Our research team worked with museum curators to ensure every aspect of the doll's appearance, from the hairstyle to the undergarments, is historically accurate. The silk brocade pattern on the main dress was custom-designed based on textile samples from the period. Each accessory, including the parasol and reticule (small handbag), is fully functional and crafted to scale. The doll features a bisque porcelain head and hands with a cloth body allowing for gentle positioning of the arms.",
      shippingInfo: {
        dimensions: "22\" x 14\" x 10\"",
        weight: "4.2 lbs",
        handlingTime: "5-7 business days",
        shippingOptions: [
          { method: "Standard", time: "7-10 business days", price: "Free" },
          { method: "Express", time: "2-3 business days", price: "Free" },
          { method: "International", time: "10-14 business days", price: "Free" }
        ],
        specialNotes: "Includes display stand and glass dome cover. Ships in reinforced packaging with insurance."
      },
      customerReviews: [
        { rating: 5, date: "April 2, 2025", comment: "As a historian specializing in Victorian fashion, I can attest to the incredible accuracy of this piece. Truly museum quality." },
        { rating: 5, date: "March 15, 2025", comment: "The craftsmanship is extraordinary. Victoria is the centerpiece of my collection now." },
        { rating: 4, date: "February 27, 2025", comment: "Beautiful doll with amazing details. Shipping took longer than expected, but worth the wait." }
      ]
    },
    {
      id: 3,
      name: 'Modern Mila',
      price: 99.99,
      description: 'Contemporary doll design with customizable features and modern fashion elements. Perfect for the trendy collector.',
      longDescription: 'Modern Mila represents the cutting edge of contemporary doll design, featuring customizable elements and fashion-forward styling. With her trendy outfit and modern aesthetic, Mila appeals to collectors who appreciate current fashion trends and artistic innovation. The doll features a unique posable design that allows for creative positioning and display options.',
      image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586044761514-7d979c9e90dc?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598256196200-224ffe6e39de?q=80&w=1000&auto=format&fit=crop'
      ],
      rating: 4.7,
      reviews: 19,
      inStock: true,
      category: 'Standard',
      specifications: [
        { name: 'Height', value: '16 inches' },
        { name: 'Material', value: 'Vinyl, Synthetic Fabric' },
        { name: 'Age Range', value: 'Teen and Adult Collectors' },
        { name: 'Origin', value: 'Designed in USA, Made in Japan' },
        { name: 'Release Date', value: 'March 2025' },
        { name: 'Limited Edition', value: 'No' },
        { name: 'Articulation', value: 'Fully posable (11 points)' },
        { name: 'Hair Type', value: 'Changeable wigs (2 included)' }
      ],
      detailedDescription: "Modern Mila is the result of collaboration between fashion designers and doll artists, creating a piece that bridges the worlds of collectibles and contemporary style. Her wardrobe includes pieces inspired by current runway trends, scaled perfectly and constructed with the same attention to detail as their full-sized counterparts. The innovative joint system allows for natural posing while maintaining the aesthetic appeal of the doll. Mila comes with two interchangeable wigs and a fashion accessory set that allows collectors to create multiple looks.",
      shippingInfo: {
        dimensions: "18\" x 10\" x 6\"",
        weight: "2.8 lbs",
        handlingTime: "1-3 business days",
        shippingOptions: [
          { method: "Standard", time: "7-10 business days", price: "Free" },
          { method: "Express", time: "2-3 business days", price: "Free" },
          { method: "International", time: "10-14 business days", price: "Free" }
        ],
        specialNotes: "Comes with display stand and fashion lookbook. Additional outfit sets available separately."
      },
      customerReviews: [
        { rating: 5, date: "April 10, 2025", comment: "Love the contemporary vibe of this doll! The changeable wigs and posability make her super versatile for photography." },
        { rating: 4, date: "March 25, 2025", comment: "Really cool design and concept. Would love to see more outfit options in the future." },
        { rating: 5, date: "March 18, 2025", comment: "The attention to detail on the miniature clothing is incredible! Each piece is perfectly scaled and on-trend." }
      ]
    }
    // Add more models as needed
  ];
  
  return models.find(model => model.id === parseInt(id)) || null;
};

// Get related models based on category
const getRelatedModels = (currentModelId, category) => {
  const allModels = [
    {
      id: 1,
      name: 'Sophia Elegance',
      price: 129.99,
      description: 'Handcrafted porcelain doll with intricate details and premium fabric clothing.',
      image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
      category: 'Premium'
    },
    {
      id: 2,
      name: 'Victoria Vintage',
      price: 159.99,
      description: 'Inspired by Victorian era fashion with authentic period clothing.',
      image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop',
      category: 'Premium'
    },
    {
      id: 3,
      name: 'Modern Mila',
      price: 99.99,
      description: 'Contemporary doll design with customizable features and modern fashion elements.',
      image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop',
      category: 'Standard'
    },
    {
      id: 4,
      name: 'Elegant Eleanor',
      price: 149.99,
      description: 'Elegant porcelain doll with handcrafted lace details and satin finish.',
      image: 'https://images.unsplash.com/photo-1590072060877-89cdc8ab5524?q=80&w=1000&auto=format&fit=crop',
      category: 'Premium'
    },
    {
      id: 5,
      name: 'Classic Charlotte',
      price: 119.99,
      description: 'Traditional design with timeless appeal, featuring hand-painted features.',
      image: 'https://images.unsplash.com/photo-1566512772618-ddecb1492ee9?q=80&w=1000&auto=format&fit=crop',
      category: 'Standard'
    },
    {
      id: 6,
      name: 'Retro Rebecca',
      price: 139.99,
      description: 'Vintage-inspired model with authentic mid-century styling and accessories.',
      image: 'https://images.unsplash.com/photo-1597046510717-b0ffd88d592d?q=80&w=1000&auto=format&fit=crop',
      category: 'Limited Edition'
    }
  ];
  
  return allModels
    .filter(model => model.id !== parseInt(currentModelId) && model.category === category)
    .slice(0, 3);
};

const ModelDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [model, setModel] = useState(null);
  const [relatedModels, setRelatedModels] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    // Simulate fetching the model from an API
    setTimeout(() => {
      const fetchedModel = getModelData(id);
      setModel(fetchedModel);
      if (fetchedModel) {
        setMainImage(fetchedModel.image);
        // Get related models
        const related = getRelatedModels(id, fetchedModel.category);
        setRelatedModels(related);
      }
      setIsLoaded(true);
    }, 800);
  }, [id]);
  
  const handleAddToCart = () => {
    if (model) {
      const itemToAdd = {
        ...model,
        quantity
      };
      addToCart(itemToAdd);
      toast.success("Added to cart!", {
        description: `${model.name} has been added to your cart.`,
      });
    }
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast("Added to favorites", {
        description: `${model?.name} has been added to your favorites.`,
      });
    } else {
      toast("Removed from favorites", {
        description: `${model?.name} has been removed from your favorites.`,
      });
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied to clipboard", {
      description: "Share this link with your friends!",
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-24 pb-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
          <div className="container mx-auto max-w-6xl">
            <div className={`glass-card rounded-xl overflow-hidden p-8 shimmer h-96 ${isDark ? 'bg-gray-800/70' : ''}`}></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-24 pb-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
          <div className="container mx-auto max-w-6xl text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Model Not Found</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>The model you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/models"
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse All Models
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-24 pb-12 px-4 
        ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}
        >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <Link to="/models" className="flex items-center text-metadite-primary hover:underline">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Models
            </Link>
          </div>
          
          {/* Main Product Section */}
          <div className="glass-card rounded-xl overflow-hidden p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <div className="rounded-lg overflow-hidden bg-white mb-4 aspect-square">
                  <img 
                    src={mainImage} 
                    alt={model.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {model.gallery.map((img, index) => (
                    <button
                      key={index}
                      className={`rounded-lg overflow-hidden border-2 ${mainImage === img ? 'border-metadite-primary' : 'border-transparent'}`}
                      onClick={() => setMainImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`${model.name} - view ${index + 1}`} 
                        className="w-full h-full object-cover aspect-square"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold">{model.name}</h1>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleLike}
                      className={`p-2 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : isDark ? 'text-gray-300' : 'text-gray-500'}`} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className={`p-2 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
                    >
                      <Share2 className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(model.rating) ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm ml-2`}>{model.rating} ({model.reviews} reviews)</span>
                </div>
                
                <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded mb-4">
                  {model.category}
                </div>
                
                <div className="text-2xl font-bold text-metadite-primary mb-4">
                  ${model.price}
                </div>
                
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                  {model.description}
                </p>
                
                <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-6 mb-6`}></div>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} border`}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} border`}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {model.inStock ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!model.inStock}
                    className="flex-1 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  
                  <Link
                    to="/checkout"
                    className={`flex-1 border-2 border-metadite-primary text-metadite-primary px-6 py-3 rounded-lg ${isDark ? 'hover:bg-metadite-primary/10' : 'hover:bg-metadite-primary/5'} transition-colors text-center`}
                  >
                    Buy Now
                  </Link>
                </div>

                <div className="mt-6">
                  <Dialog open={chatOpen} onOpenChange={setChatOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`w-full flex items-center justify-center ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}`}
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Chat to Us About This Model
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={isDark ? "bg-gray-800 border-gray-700" : ""}>
                      <DialogHeader>
                        <DialogTitle className={isDark ? "text-white" : ""}>Chat with a Moderator</DialogTitle>
                        <DialogDescription className={isDark ? "text-gray-300" : ""}>
                          Send a message about {model.name} to our team
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Textarea
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className={isDark ? "bg-gray-700 border-gray-600 placeholder:text-gray-400 text-white" : ""}
                          rows={5}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            onClick={() => setChatOpen(false)}
                            className={isDark ? "text-gray-300 hover:bg-gray-700 hover:text-white" : ""}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSendMessage}>
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="glass-card rounded-xl overflow-hidden mb-8">
            <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'description'
                    ? `${isDark ? 'bg-gray-800' : 'bg-white'} text-metadite-primary border-b-2 border-metadite-primary`
                    : `${isDark ? 'text-gray-300 hover:text-metadite-primary' : 'text-gray-600 hover:text-metadite-primary'}`
                }`}
              >
                <FileText className="h-4 w-4 inline-block mr-2" />
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'specifications'
                    ? `${isDark ? 'bg-gray-800' : 'bg-white'} text-metadite-primary border-b-2 border-metadite-primary`
                    : `${isDark ? 'text-gray-300 hover:text-metadite-primary' : 'text-gray-600 hover:text-metadite-primary'}`
                }`}
              >
                <Info className="h-4 w-4 inline-block mr-2" />
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'shipping'
                    ? `${isDark ? 'bg-gray-800' : 'bg-white'} text-metadite-primary border-b-2 border-metadite-primary`
                    : `${isDark ? 'text-gray-300 hover:text-metadite-primary' : 'text-gray-600 hover:text-metadite-primary'}`
                }`}
              >
                <Truck className="h-4 w-4 inline-block mr-2" />
                Shipping
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? `${isDark ? 'bg-gray-800' : 'bg-white'} text-metadite-primary border-b-2 border-metadite-primary`
                    : `${isDark ? 'text-gray-300 hover:text-metadite-primary' : 'text-gray-600 hover:text-metadite-primary'}`
                }`}
              >
                <Star className="h-4 w-4 inline-block mr-2" />
                Reviews
              </button>
            </div>
            
            <div className={`p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>Product Description</h3>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : ''}`}>{model.longDescription}</p>
                  <p className={isDark ? 'text-gray-300' : ''}>{model.detailedDescription}</p>
                </div>
              )}
              
              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {model.specifications.map((spec, index) => (
                      <div key={index} className={`flex ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-100'} pb-2`}>
                        <span className={`font-medium w-1/3 ${isDark ? 'text-gray-300' : ''}`}>{spec.name}:</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} w-2/3`}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`flex items-center mt-6 p-4 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg`}>
                    <ShieldCheck className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
                    <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                      All our products come with a 1-year warranty against manufacturing defects.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Shipping Tab */}
              {activeTab === 'shipping' && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>Shipping Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}>
                      <div className="flex items-center mb-3">
                        <Package className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
                        <h4 className={`font-medium ${isDark ? 'text-white' : ''}`}>Package Details</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Dimensions:</span>
                          <span className={isDark ? 'text-gray-300' : ''}>{model.shippingInfo.dimensions}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Weight:</span>
                          <span className={isDark ? 'text-gray-300' : ''}>{model.shippingInfo.weight}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}>
                      <div className="flex items-center mb-3">
                        <Clock className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
                        <h4 className={`font-medium ${isDark ? 'text-white' : ''}`}>Processing Time</h4>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>
                        Orders are typically processed within {model.shippingInfo.handlingTime} before shipping.
                      </p>
                    </div>
                  </div>
                  
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : ''}`}>Shipping Options</h4>
                  <div className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden mb-6`}>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Method</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Estimated Delivery</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Cost</th>
                        </tr>
                      </thead>
                      <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {model.shippingInfo.shippingOptions.map((option, index) => (
                          <tr key={index}>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : ''}`}>{option.method}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{option.time}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>${option.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className={isDark ? 'bg-gray-700 p-4 rounded-lg' : 'bg-gray-50 p-4 rounded-lg'}>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : ''}`}>Special Notes</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{model.shippingInfo.specialNotes}</p>
                  </div>
                </div>
              )}
              
              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>Customer Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < Math.floor(model.rating) ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className={`text-lg font-medium ${isDark ? 'text-white' : ''}`}>{model.rating}</span>
                      <span className={isDark ? 'text-gray-400 ml-1' : 'text-gray-500 ml-1'}>({model.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {model.customerReviews.map((review, index) => (
                      <div key={index} className={`${isDark ? 'border-b border-gray-700' : 'border-b border-gray-100'} pb-6 last:border-b-0`}>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mr-3`}>
                              <User className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                          </div>
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{review.date}</span>
                        </div>
                        
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Products */}
          {relatedModels.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Grid className="h-5 w-5 text-metadite-primary mr-2" />
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : ''}`}>You May Also Like</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedModels.map((relatedModel) => (
                  <Link 
                    key={relatedModel.id} 
                    to={`/model/${relatedModel.id}`}
                    className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedModel.image} 
                        alt={relatedModel.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`font-medium text-lg mb-1 ${isDark ? 'text-white' : ''}`}>{relatedModel.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-metadite-primary font-bold">${relatedModel.price}</span>
                        <div className={`inline-block ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'} text-xs font-medium px-2.5 py-0.5 rounded`}>
                          {relatedModel.category}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ModelDetail;
