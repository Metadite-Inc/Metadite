import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import FormInput from '../components/auth/FormInput';
import { authApi } from '../lib/api/auth_api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one digit";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (password && newConfirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.confirmPasswordReset(token, password);
      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-metadite-primary to-metadite-secondary p-4">
        <div className={`glass-card rounded-2xl overflow-hidden shadow-xl max-w-md w-full ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-6 text-white">
            <h2 className="text-2xl font-bold mb-1">Password Reset Success</h2>
            <p className="opacity-80">Your password has been updated</p>
          </div>
          
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Success!</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>
            
            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-metadite-primary to-metadite-secondary p-4">
      <div className={`glass-card rounded-2xl overflow-hidden shadow-xl max-w-md w-full ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">Reset Password</h2>
          <p className="opacity-80">Enter your new password</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
              required
              minLength={8}
              icon={Lock}
              label="New Password"
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              error={passwordError}
            />
            
            <FormInput
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your new password"
              required
              minLength={8}
              icon={Lock}
              label="Confirm Password"
              showPassword={showConfirmPassword}
              toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
              error={confirmPasswordError}
            />
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                <strong>Password requirements:</strong> At least 8 characters with uppercase, lowercase, and number
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword || passwordError || confirmPasswordError}
              className={`w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity ${
                isLoading || !password || !confirmPassword || passwordError || confirmPasswordError ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting...
                </div>
              ) : (
                <>
                  <span>Reset Password</span>
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

export default ResetPassword;

