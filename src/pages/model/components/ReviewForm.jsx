import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { userApi } from '../../../lib/api/user_api';

const ReviewForm = ({ modelId, onReviewSubmitted, existingReview = null, onCancel = null }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let reviewData;
      
      if (existingReview) {
        // Update existing review
        reviewData = await userApi.updateModelReview(existingReview.id, rating, comment);
        
        const updatedReview = {
          ...existingReview,
          rating,
          comment,
          // Add any other fields needed
        };
        
        onReviewSubmitted(updatedReview);
        
        if (onCancel) onCancel(); // Close edit form if applicable
        
      } else {
        // Create new review
        reviewData = await userApi.createModelReview(
          parseInt(modelId), 
          rating, 
          comment
        );
        
        // Format response for the UI
        const newReview = {
          id: reviewData.id,
          userId: user.id,
          userName: user.name || user.email || 'User',
          rating,
          comment,
          date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        };
        
        onReviewSubmitted(newReview);
        
        // Reset form for new submissions
        setRating(0);
        setComment('');
      }
      
      toast.success(existingReview ? "Review updated successfully" : "Review submitted successfully");
      
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error(existingReview ? "Failed to update review" : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-center">
        <p className="mb-2">Please log in to leave a review</p>
        <Button variant="outline" asChild>
          <a href="/login">Log In</a>
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <Star 
                className={`h-6 w-6 ${
                  (hoverRating ? hoverRating >= star : rating >= star) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                } cursor-pointer`} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <Textarea
          id="review-comment"
          placeholder="Share your experience with this model..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px]"
        />
      </div>
      
      <div className="flex space-x-3">
        {existingReview && onCancel && (
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className={`bg-gradient-to-r from-metadite-primary to-metadite-secondary ${existingReview ? 'flex-1' : 'w-full'}`}
        >
          {isSubmitting 
            ? 'Submitting...' 
            : (existingReview ? 'Update Review' : 'Submit Review')}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
