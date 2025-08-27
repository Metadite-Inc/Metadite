import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import FormInput from '../components/auth/FormInput';
import { authApi } from '../lib/api/auth_api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.requestPasswordReset(email);
      setIsSubmitted(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-metadite-primary to-metadite-secondary p-4">
        <div className={`glass-card rounded-2xl overflow-hidden shadow-xl max-w-md w-full ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-6 text-white">
            <h2 className="text-2xl font-bold mb-1">Check Your Email</h2>
            <p className="opacity-80">We've sent you a password reset link</p>
          </div>
          
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reset Email Sent</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </button>
              
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full text-sm text-metadite-primary hover:text-metadite-secondary"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-metadite-primary to-metadite-secondary p-4">
      <div className={`glass-card rounded-2xl overflow-hidden shadow-xl max-w-md w-full ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">Forgot Password</h2>
          <p className="opacity-80">Enter your email to reset your password</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              icon={Mail}
              label="Email Address"
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={handleBackToLogin}
              className="text-sm font-medium text-metadite-primary hover:text-metadite-secondary"
            >
              Back to Login
            </button>
          </div>
          
          <div className={`mt-8 text-xs text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Remember your password? <Link to="/login" className="text-metadite-primary underline">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

