
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import FormInput from './FormInput';
import RoleSelector from './RoleSelector';
import SocialLoginButtons from './SocialLoginButtons';
import RegionSelect from './RegionSelect';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [region, setRegion] = useState('north_america');
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const handleToggleView = () => {
    setIsLogin(!isLogin);
    // Reset form
    setEmail('');
    setPassword('');
    setName('');
    setRole('user');
    setRegion('north_america');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(email, password, role);
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);
        
        // Navigate based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'moderator') {
          navigate('/moderator');
        } else {
          navigate('/dashboard');
        }
      } else {
        await register(email, password, name, region);
        toast.success("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error("Authentication failed", {
        description: error.message || "Please check your credentials and try again.",
      });
    }
  };
  
  const handleSocialLogin = (provider) => {
    toast("Social login", {
      description: `${provider} login is not implemented in this demo.`,
    });
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="opacity-80">{isLogin ? 'Sign in to your account' : 'Join our community today'}</p>
      </div>
      
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <FormInput
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required={!isLogin}
              icon={User}
              label="Full Name"
            />
          )}
          
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
            icon={Lock}
            label="Password"
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
          />
          
          {!isLogin && <RegionSelect region={region} setRegion={setRegion} />}
          
          {isLogin && <RoleSelector role={role} setRole={setRole} />}
          
          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-metadite-primary focus:ring-metadite-primary border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-metadite-primary hover:text-metadite-secondary">
                  Forgot password?
                </Link>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>
        
        <SocialLoginButtons onSocialLogin={handleSocialLogin} />
        
        <div className="mt-6 text-center">
          <button 
            onClick={handleToggleView}
            className="text-sm font-medium text-metadite-primary hover:text-metadite-secondary"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          {isLogin && (
            <Link 
              to="/upgrade"
              className="inline-block text-sm font-medium text-white bg-gradient-to-r from-metadite-primary to-metadite-secondary px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Upgrade your membership
            </Link>
          )}
        </div>
        
        <div className="mt-8 text-xs text-center text-gray-500">
          By continuing, you agree to Metadite's <Link to="/terms" className="text-metadite-primary">Terms of Service</Link> and <Link to="/privacy" className="text-metadite-primary">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
