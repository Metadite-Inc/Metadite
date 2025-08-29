import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userApi } from '../../lib/api/user_api';
import PasswordInput from '../ui/PasswordInput';

const StaffAccountSettings = ({ user }) => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
    email_notifications: true,
    desktop_notifications: true,
    security_alerts: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await userApi.updateProfile({
        full_name: formData.full_name,
        email: formData.email
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Error handling is done in the API method
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      await userApi.updatePassword({
        current_password: formData.current_password,
        new_password: formData.new_password
      });
      
      toast.success('Password updated successfully. You will be logged out for security.');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
      
      // Auto-logout after 2 seconds
      setTimeout(() => {
        logout();
        // Navigation is now handled in the logout function
      }, 2000);
      
    } catch (error) {
      console.error('Failed to change password:', error);
      // Error handling is done in the API method
    }
  };

  const handleNotificationUpdate = (e) => {
    e.preventDefault();
    // Handle notification preferences update
    toast.success('Notification preferences updated');
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Account Settings
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your staff account preferences and security settings.
        </p>
      </div>

      {/* Profile Information */}
      <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-metadite-primary mr-2" />
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Profile Information
          </h3>
        </div>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                } focus:ring-metadite-primary focus:border-metadite-primary`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                } focus:ring-metadite-primary focus:border-metadite-primary`}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-metadite-primary text-white px-4 py-2 rounded-md hover:bg-metadite-secondary transition-colors"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Password Change */}
      <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center mb-4">
          <Lock className="h-5 w-5 text-metadite-primary mr-2" />
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Change Password
          </h3>
        </div>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <PasswordInput
            id="current_password"
            name="current_password"
            value={formData.current_password}
            onChange={handleInputChange}
            label="Current Password"
            theme={theme}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleInputChange}
              label="New Password"
              theme={theme}
              required
            />
            
            <PasswordInput
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              label="Confirm New Password"
              theme={theme}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-metadite-primary text-white px-4 py-2 rounded-md hover:bg-metadite-secondary transition-colors"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 text-metadite-primary mr-2" />
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Notification Preferences
          </h3>
        </div>
        
        <form onSubmit={handleNotificationUpdate} className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="email_notifications"
                checked={formData.email_notifications}
                onChange={handleInputChange}
                className="rounded text-metadite-primary focus:ring-metadite-primary h-4 w-4"
              />
              <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email notifications for important updates
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="desktop_notifications"
                checked={formData.desktop_notifications}
                onChange={handleInputChange}
                className="rounded text-metadite-primary focus:ring-metadite-primary h-4 w-4"
              />
              <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Desktop notifications for real-time alerts
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="security_alerts"
                checked={formData.security_alerts}
                onChange={handleInputChange}
                className="rounded text-metadite-primary focus:ring-metadite-primary h-4 w-4"
              />
              <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Security alerts and login notifications
              </span>
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-metadite-primary text-white px-4 py-2 rounded-md hover:bg-metadite-secondary transition-colors"
            >
              Update Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Role Information */}
      <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 text-metadite-primary mr-2" />
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Role & Permissions
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Current Role</p>
            <p className={`font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {user?.role || 'N/A'}
            </p>
          </div>
          
          <div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Account Status</p>
            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {user?.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
            <strong>Note:</strong> Role and permission changes must be made by a system administrator. 
            Contact your supervisor if you need access modifications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffAccountSettings;
