
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

const AccountSettings: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
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
{/*}
         <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Membership Level</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current plan: <span className={`font-semibold ${getMembershipColor(user?.membership_level || 'free')}`}>
                  {getMembershipDisplayName(user?.membership_level || 'free')}
                </span>
              </p>
              {user?.video_access_count !== undefined && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Video access count: <span className="font-semibold">{user.video_access_count}</span>
                </p>
              )}
            </div>
            {(user?.membership_level === 'free' || user?.membership_level === 'standard') && (
              <Button variant="outline" asChild>
                <a href="/upgrade">Upgrade Plan</a>
              </Button>
            )}
          </div>*/}
          
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
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.current_password}
              onChange={(e) => handlePasswordChange('current_password', e.target.value)}
              placeholder="Enter your current password"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.new_password}
                onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
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
