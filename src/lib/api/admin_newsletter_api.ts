import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NewsletterSubscription {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

class AdminNewsletterApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Making request to:', `${API_BASE_URL}${endpoint}`);
      console.log('Token:', token.substring(0, 20) + '...');

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Admin Newsletter API error:', error);
      throw error;
    }
  }

  async getAllSubscriptions(skip: number = 0, limit: number = 100): Promise<NewsletterSubscription[]> {
    try {
      const result = await this.request<NewsletterSubscription[]>(`/api/newsletter/admin/subscriptions?skip=${skip}&limit=${limit}`);
      return result;
    } catch (error: any) {
      toast.error('Failed to fetch newsletter subscriptions');
      throw error;
    }
  }

  async unsubscribeEmail(email: string): Promise<void> {
    try {
      await this.request(`/api/newsletter/admin/unsubscribe/${email}`, {
        method: 'POST',
      });
      toast.success('Successfully unsubscribed email');
    } catch (error: any) {
      toast.error('Failed to unsubscribe email');
      throw error;
    }
  }

  async resubscribeEmail(email: string): Promise<NewsletterSubscription> {
    try {
      const result = await this.request<NewsletterSubscription>('/api/newsletter/subscribe/', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      toast.success('Successfully resubscribed email');
      return result;
    } catch (error: any) {
      toast.error('Failed to resubscribe email');
      throw error;
    }
  }

  async exportSubscriptions(): Promise<string> {
    try {
      const subscriptions = await this.request<NewsletterSubscription[]>('/api/newsletter/admin/export');
      
      if (!subscriptions || subscriptions.length === 0) {
        toast.info('No newsletter subscriptions to export');
        return '';
      }
      
      // Create CSV content
      const csvContent = [
        'ID,Email,Active,Created At',
        ...subscriptions.map(sub => 
          `${sub.id},"${sub.email}",${sub.is_active},"${sub.created_at}"`
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${subscriptions.length} newsletter subscriptions`);
      return csvContent;
    } catch (error: any) {
      console.error('Export error:', error);
      if (error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('Access denied. Please make sure you are logged in as an admin.');
      } else {
        toast.error('Failed to export newsletter subscriptions. Please try again.');
      }
      throw error;
    }
  }
}

export const adminNewsletterApi = new AdminNewsletterApiService(); 