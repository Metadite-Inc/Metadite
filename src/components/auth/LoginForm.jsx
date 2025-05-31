import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import FormInput from './FormInput';
import SocialLoginButtons from './SocialLoginButtons';
import RegionSelect from './RegionSelect';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [region, setRegion] = useState('north_america');
  const [showPassword, setShowPassword] = useState(false);
  // ToS checkbox for sign up
  const [tosChecked, setTosChecked] = useState(false);
  const { login, register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const handleToggleView = () => {
    setIsLogin(!isLogin);
    // Reset form
    setEmail('');
    setPassword('');
    setPasswordError('');
    setName('');
    setRole('user');
    setRegion('north_america');
  };
  
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
    
    if (!isLogin && newPassword) {
      setPasswordError(validatePassword(newPassword));
    } else {
      setPasswordError('');
    }
  };
  
  const handlePasswordBlur = () => {
    if (!isLogin && password) {
      setPasswordError(validatePassword(password));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!isLogin && !tosChecked) {
        toast.error("You must agree to the Terms of Service to create an account.");
        return;
      }
      
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast.success("Login successful!");
          // Navigate to dashboard - server-side will handle role-based access
          navigate('/dashboard');
        } else {
          // Only show error notification if login failed
          toast.error("Login failed. Please check your credentials and try again.");
          // Do not navigate - keep user on login page
        }
      } else {
        // Validate password before registration
        const validationError = validatePassword(password);
        if (validationError) {
          setPasswordError(validationError);
          return;
        }
        
        await register(email, password, name, region);
        toast.success("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      if (isLogin) {
        toast.error("Login failed. Please check your credentials and try again.");
      } else {
        toast.error("Registration failed", {
          description: error.message || "Please try again.",
        });
      }
    }
  };
  
  const handleSocialLogin = (provider) => {
    toast("Social login", {
      description: `${provider} login is not implemented in this demo.`,
    });
  };

  return (
    <>
      <div className={`glass-card rounded-2xl overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="opacity-80">{isLogin ? 'Sign in to your account' : 'Join our community today'}</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isLogin ? (
              <>
                <FormInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  icon={Mail}
                  label="Email Address"
                />
                <FormInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  icon={Lock}
                  label="Password"
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword(!showPassword)}
                  error={passwordError}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className={`h-4 w-4 text-metadite-primary focus:ring-metadite-primary ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} rounded`}
                    />
                    <label htmlFor="remember" className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Remember me</label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-metadite-primary hover:text-metadite-secondary">
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <FormInput
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  icon={User}
                  label="Full Name"
                />
                <FormInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  icon={Mail}
                  label="Email Address"
                />
                <FormInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="At least 8 chars with uppercase, lowercase & number"
                  required
                  minLength={8}
                  icon={Lock}
                  label="Password"
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword(!showPassword)}
                  error={passwordError}
                />
                <RegionSelect region={region} setRegion={setRegion} />
                <div className="flex items-center mb-2 bg-yellow-50 dark:bg-gray-900 p-3 rounded shadow animate-fadeIn">
                  <input
                    id="tos-checkbox"
                    type="checkbox"
                    checked={tosChecked}
                    onChange={e => setTosChecked(e.target.checked)}
                    className="h-4 w-4 text-metadite-primary border-gray-300 rounded focus:ring-metadite-primary"
                    required
                  />
                  <label htmlFor="tos-checkbox" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                   I agree to the <Link to="/terms" className="text-metadite-primary underline">Terms of Service</Link>
                  </label>
                </div>
              </>
            )}
            <button
              type="submit"
              className={`w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity ${!isLogin && !tosChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isLogin && !tosChecked}
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
          <div className="mt-6 text-center">
            <button 
              onClick={handleToggleView}
              className="text-sm font-medium text-metadite-primary hover:text-metadite-secondary"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
          <div className={`mt-8 text-xs text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            By continuing, you agree to Metadite's <Link to="/terms" className="text-metadite-primary underline">Terms of Service</Link> and <Link to="/privacy" className="text-metadite-primary">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
