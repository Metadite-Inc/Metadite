import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set the VITE_API_BASE_URL environment variable.");
}

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormResponse {
  message: string;
  success: boolean;
}

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies
});

export const contactApi = {
  // Submit contact form
  async submitContactForm(data: ContactFormRequest): Promise<ContactFormResponse> {
    try {
      const response = await api.post<ContactFormResponse>('/api/contact/submit', data);
      return response.data;
    } catch (error) {
      console.error('Contact form submission error:', error);
      throw error;
    }
  },
};
