
import { toast } from 'sonner';

class TokenUtils {
  // Helper method to extract user ID from JWT token
  public getUserIdFromToken(token: string): number {
    try {
      // JWT tokens consist of three parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Extract the 'sub' claim which contains the user ID
      if (payload && payload.sub) {
        return Number(payload.sub);
      } else {
        throw new Error('User ID not found in token');
      }
    } catch (error) {
      console.error('Failed to extract user ID from token:', error);
      throw new Error('Failed to extract user ID from token');
    }
  }

  // Get auth token from localStorage and validate
  public getAuthToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Authentication required', {
        description: 'You must be logged in to send messages.',
      });
      return null;
    }
    return token;
  }
}

export default new TokenUtils();
