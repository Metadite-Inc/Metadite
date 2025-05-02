import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModelGallery from './model/components/ModelGallery';
import ModelDetails from './model/components/ModelDetails';
import ModelTabs from './model/components/ModelTabs';
import RelatedModels from './model/components/RelatedModels';
import { getModelData, getRelatedModels } from './model/api/modelData';

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
  
  useEffect(() => {
    const fetchModelData = async () => {
      const modelData = await getModelData(id);
      setModel(modelData);
      setMainImage(modelData?.gallery?.[0] || '');
      setIsLoaded(true);
    };

    fetchModelData();
  }, [id]);

  useEffect(() => {
    if (model) {
      const fetchRelatedModels = async () => {
        const related = await getRelatedModels(model.id, model.category);
        setRelatedModels(related);
      };

      fetchRelatedModels();
    }
  }, [model]);
  
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

  const handleReviewSubmitted = (newReview) => {
    if (model) {
      // Add the new review to the model
      setModel({
        ...model,
        customerReviews: [newReview, ...model.customerReviews],
        // Recalculate the average rating
        rating: ((model.rating * model.reviews) + newReview.rating) / (model.reviews + 1),
        reviews: model.reviews + 1
      });
    }
  };

  const isDark = theme === 'dark';

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
      
      <div className={`flex-1 pt-24 pb-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <Link
              to="/models"
              className="mb-6 inline-flex items-center px-4 py-2 bg-metadite-primary text-white rounded hover:bg-metadite-secondary transition-colors"
              aria-label="Back to Models"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Models
            </Link>
          </div>
          
          {/* Main Product Section */}
          <div className="glass-card rounded-xl overflow-hidden p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <ModelGallery 
                images={model.gallery} 
                mainImage={mainImage} 
                setMainImage={setMainImage} 
              />
              
              {/* Product Info */}
              <ModelDetails 
                model={model}
                quantity={quantity}
                setQuantity={setQuantity}
                isLiked={isLiked}
                handleLike={handleLike}
                handleShare={handleShare}
                handleAddToCart={handleAddToCart}
              />
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <ModelTabs 
            model={model} 
            onReviewSubmitted={handleReviewSubmitted} 
          />
          
          {/* Related Products */}
          <RelatedModels models={relatedModels} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ModelDetail;
