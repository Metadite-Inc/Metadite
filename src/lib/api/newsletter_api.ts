import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NewsletterSubscriptionRequest {
  email: string;
}

interface NewsletterSubscriptionResponse {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

class NewsletterApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Newsletter API error:', error);
      throw error;
    }
  }

  async subscribeToNewsletter(email: string): Promise<NewsletterSubscriptionResponse> {
    try {
      const result = await this.request<NewsletterSubscriptionResponse & { message?: string }>('/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      // Show appropriate message based on response
      if (result.message) {
        if (result.message.includes('already subscribed')) {
          toast.info('You are already subscribed to our newsletter!');
        } else {
          toast.success(result.message);
        }
      } else {
        toast.success('Successfully subscribed to newsletter!');
      }
      
      return result;
    } catch (error: any) {
      toast.error('Failed to subscribe to newsletter. Please try again.');
      throw error;
    }
  }

  async unsubscribeFromNewsletter(email: string): Promise<void> {
    try {
      await this.request('/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      toast.success('Successfully unsubscribed from newsletter');
    } catch (error: any) {
      toast.error('Failed to unsubscribe from newsletter. Please try again.');
      throw error;
    }
  }
}

export const newsletterApi = new NewsletterApiService(); 