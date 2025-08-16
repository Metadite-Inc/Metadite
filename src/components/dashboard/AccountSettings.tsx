
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { userApi } from '../../lib/api/user_api';
import { newsletterApi } from '../../lib/api/newsletter_api';
import PasswordInput from '../ui/PasswordInput';

const AccountSettings: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [isCheckingNewsletter, setIsCheckingNewsletter] = useState(true);
  const [isTogglingNewsletter, setIsTogglingNewsletter] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    region: user?.region || ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  // Check newsletter subscription status on component mount
  React.useEffect(() => {
    const checkNewsletterStatus = async () => {
      if (user?.email) {
        try {
          setIsCheckingNewsletter(true);
          const status = await newsletterApi.checkSubscriptionStatus(user.email);
          setIsNewsletterSubscribed(status.is_subscribed);
        } catch (error) {
          console.error('Failed to check newsletter status:', error);
        } finally {
          setIsCheckingNewsletter(false);
        }
      } else {
        setIsCheckingNewsletter(false);
      }
    };

    checkNewsletterStatus();
  }, [user?.email]);

  const handleToggleNewsletter = async () => {
    if (!user?.email) {
      toast.error('Please log in to manage newsletter subscription');
      return;
    }

    setIsTogglingNewsletter(true);
    try {
      if (isNewsletterSubscribed) {
        await newsletterApi.unsubscribeFromNewsletter(user.email);
        setIsNewsletterSubscribed(false);
      } else {
        await newsletterApi.subscribeToNewsletter(user.email);
        setIsNewsletterSubscribed(true);
      }
    } catch (error) {
      console.error('Failed to toggle newsletter subscription:', error);
    } finally {
      setIsTogglingNewsletter(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await userApi.updateProfile(profileData);
      await refreshUser();
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userApi.updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      toast.success('Password updated successfully. You will be logged out for security.');
      
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Auto-logout after 2 seconds
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await userApi.deleteAccount();
      logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  const getMembershipDisplayName = (level: string) => {
    const levelMap = {
      free: 'Free',
      standard: 'Standard',
      vip: 'VIP',
      vvip: 'VVIP'
    };
    return levelMap[level as keyof typeof levelMap] || 'Free';
  };

  const getMembershipColor = (level: string) => {
    const colorMap = {
      free: 'text-gray-500',
      standard: 'text-green-500',
      vip: 'text-amber-500',
      vvip: 'text-purple-500'
    };
    return colorMap[level as keyof typeof colorMap] || 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.full_name}
                onChange={(e) => handleProfileChange('full_name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={profileData.region}
              onChange={(e) => handleProfileChange('region', e.target.value)}
              placeholder="Enter your region"
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your account password for better security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            value={passwordData.current_password}
            onChange={(e) => handlePasswordChange('current_password', e.target.value)}
            placeholder="Enter your current password"
            theme={theme}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={passwordData.new_password}
              onChange={(e) => handlePasswordChange('new_password', e.target.value)}
              placeholder="Enter new password"
              theme={theme}
              required
            />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirm_password}
              onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
              placeholder="Confirm new password"
              theme={theme}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleChangePassword} 
              disabled={isChangingPassword || !passwordData.current_password || !passwordData.new_password}
            >
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscription</CardTitle>
          <CardDescription>
            Manage your newsletter subscription preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user?.email ? (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">
                Please log in to manage your newsletter subscription.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Newsletter</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isNewsletterSubscribed 
                    ? "You are currently subscribed to our newsletter and will receive updates about new features, promotions, and announcements."
                    : "Subscribe to our newsletter to receive updates about new features, promotions, and announcements."
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {isCheckingNewsletter ? (
                  <div className="animate-spin h-5 w-5 border-2 border-metadite-primary border-t-transparent rounded-full"></div>
                ) : (
                  <Button 
                    onClick={handleToggleNewsletter}
                    disabled={isTogglingNewsletter}
                    variant={isNewsletterSubscribed ? "outline" : "default"}
                    className={isNewsletterSubscribed 
                      ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white" 
                      : "bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white"
                    }
                  >
                    {isTogglingNewsletter ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        {isNewsletterSubscribed ? 'Unsubscribing...' : 'Subscribing...'}
                      </>
                    ) : (
                      isNewsletterSubscribed ? 'Unsubscribe' : 'Subscribe'
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              This action cannot be undone. This will permanently delete your account, 
              remove all your data, and cancel any active subscriptions.
            </p>
            
            {!showDeleteConfirm ? (
              <button 
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button 
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount}
                  >
                    {isDeletingAccount ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeletingAccount}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
