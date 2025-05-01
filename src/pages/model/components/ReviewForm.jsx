
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

const ReviewForm = ({ modelId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
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
    
    // In a real app, this would be an API call to save the review
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        userId: user?.id || 'guest',
        userName: user?.name || 'Guest User',
        rating,
        comment,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
      
      onReviewSubmitted(newReview);
      
      // Reset form
      setRating(0);
      setComment('');
      setIsSubmitting(false);
      
      toast.success("Review submitted successfully");
    }, 800);
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
      
      <Button 
        type="submit" 
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        className="bg-gradient-to-r from-metadite-primary to-metadite-secondary"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
