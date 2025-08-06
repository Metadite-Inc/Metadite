import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../lib/api/user_api';
import { ensureNumberId, isValidId } from '../lib/utils';
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
  const { user } = useAuth();
  const [model, setModel] = useState(null);
  const [relatedModels, setRelatedModels] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  
  // Fetch model data
  useEffect(() => {
    const fetchModelData = async () => {
      const modelData = await getModelData(id);
      setModel(modelData);
      setMainImage(modelData?.gallery?.[0] || '');
      setIsLoaded(true);
    };

    fetchModelData();
  }, [id]);

  // Check if model is in user's favorites
  useEffect(() => {
    const checkIfFavorited = async () => {
      if (user && model) {
        try {
          const favorites = await userApi.getUserFavoriteModels();
          const favorite = favorites.find(fav => fav.doll_id === model.id);
          if (favorite) {
            setIsLiked(true);
            setFavoriteId(favorite.id);
          } else {
            setIsLiked(false);
            setFavoriteId(null);
          }
        } catch (error) {
          console.error("Error checking favorites status:", error);
        }
      }
    };

    checkIfFavorited();
  }, [user, model]);

  // Fetch user reviews for this model
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (user && model) {
        try {
          const reviews = await userApi.getUserModelReviews();
          // Filter reviews for this specific model
          const modelReviews = reviews.filter(review => review.doll_id === model.id);
          setUserReviews(modelReviews);
        } catch (error) {
          console.error("Error fetching user reviews:", error);
        }
      }
    };

    fetchUserReviews();
  }, [user, model]);

  // Fetch related models
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
  
  const handleLike = async () => {
    // Use access_token to match auth_api.ts implementation
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      if (!isLiked) {
        // Add to favorites
        const response = await userApi.addModelToFavorites(ensureNumberId(model.id));
        setFavoriteId(response.id);
        setIsLiked(true);
        toast.success("Added to favorites");
      } else {
        // Remove from favorites
        await userApi.removeModelFromFavorites(ensureNumberId(model.id));
        setIsLiked(false);
        setFavoriteId(null);
        toast.success("Removed from favorites");
      }
    } catch (error) {
      console.error("Favorite operation failed:", error);
      if (error.message && (error.message.includes("401") || error.message.includes("403"))) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error("Failed to update favorites");
      }
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied to clipboard", {
      description: "Share this link with your friends!",
    });
  };

  const handleReviewSubmitted = async (newReview) => {
    if (model && user) {
      try {
        // Add the new review via API
        const reviewData = await userApi.createModelReview(
          ensureNumberId(model.id), 
          newReview.rating, 
          newReview.comment
        );

        // Update the model with the new review
        setModel({
          ...model,
          customerReviews: [
            {
              ...reviewData,
              userName: user.name || user.email,
              date: new Date().toLocaleDateString()
            }, 
            ...model.customerReviews
          ],
          // Recalculate the average rating
          rating: ((model.rating * model.reviews) + newReview.rating) / (model.reviews + 1),
          reviews: model.reviews + 1
        });
        
        // Update user reviews
        setUserReviews([...userReviews, reviewData]);
        
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review");
      }
    }
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      const updatedReview = await userApi.updateModelReview(
        reviewId, 
        updatedData.rating, 
        updatedData.comment
      );
      
      // Update the reviews in state
      setUserReviews(userReviews.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
      
      // Also update in the model
      setModel({
        ...model,
        customerReviews: model.customerReviews.map(review =>
          review.id === reviewId ? {
            ...review,
            rating: updatedData.rating,
            comment: updatedData.comment
          } : review
        )
      });
      
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await userApi.deleteModelReview(reviewId);
      
      // Remove from user reviews
      setUserReviews(userReviews.filter(review => review.id !== reviewId));
      
      // Remove from model reviews
      setModel({
        ...model,
        customerReviews: model.customerReviews.filter(review => review.id !== reviewId)
      });
      
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
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
            userReviews={userReviews}
            onUpdateReview={handleUpdateReview}
            onDeleteReview={handleDeleteReview}
            user={user}
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
