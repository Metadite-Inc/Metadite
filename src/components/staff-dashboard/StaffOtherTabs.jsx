
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import StaffAccountSettings from './StaffAccountSettings';
import AdminSummaryTab from './AdminSummaryTab';
import ModerationSummaryTab from './ModerationSummaryTab';
import ChatActivityTab from './ChatActivityTab';
import NotificationService from '../../services/NotificationService';

const StaffOtherTabs = ({ activeTab, user }) => {
  const { theme } = useTheme();
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    // Check current notification permission status
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    // Load sound preference from NotificationService
    setSoundEnabled(notificationService.isSoundEnabled());
  }, [notificationService]);

  const requestNotificationPermission = async () => {
    setIsRequesting(true);
    try {
      const granted = await notificationService.requestPermission();
      setNotificationPermission(Notification.permission);
    } catch (error) {
      toast.error('Failed to request notification permissions');
    } finally {
      setIsRequesting(false);
    }
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      notificationService.notifyNewMessage('Test User', 'This is a test notification!');
      toast.success('Test notification sent!');
    } else {
      toast.error('Please enable notifications first');
    }
  };

  const getPermissionStatus = () => {
    switch (notificationPermission) {
      case 'granted':
        return { status: 'Enabled', color: 'text-green-600', icon: Bell };
      case 'denied':
        return { status: 'Blocked', color: 'text-red-600', icon: BellOff };
      default:
        return { status: 'Not Set', color: 'text-gray-600', icon: BellOff };
    }
  };

  // Handle tabs with dedicated components
  if (activeTab === 'settings') {
    return (
      <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <StaffAccountSettings user={user} />
      </div>
    );
  }

  // Handle notifications tab with enhanced functionality
  if (activeTab === 'notifications') {
    const permissionInfo = getPermissionStatus();
    const PermissionIcon = permissionInfo.icon;

    return (
      <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
              Notifications
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage your notification preferences and permissions for staff activities
            </p>
          </div>

          {/* Browser Notification Permissions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PermissionIcon className="h-5 w-5" />
                Browser Notifications
              </CardTitle>
              <CardDescription>
                Allow us to send you important updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Permission Status</p>
                  <p className={`text-sm ${permissionInfo.color}`}>
                    {permissionInfo.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {notificationPermission !== 'granted' && (
                    <Button 
                      onClick={requestNotificationPermission}
                      disabled={isRequesting || notificationPermission === 'denied'}
                    >
                      {isRequesting ? 'Requesting...' : 'Enable Notifications'}
                    </Button>
                  )}
                  {notificationPermission === 'granted' && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={testNotification}>
                        Test Notification
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          notificationService.testUnreadCountNotification();
                          toast.success('Unread count notification test sent!');
                        }}
                      >
                        Test Unread Toast
                      </Button>
                    </div>
                  )}
                  {notificationPermission === 'denied' && (
                    <Button variant="outline" onClick={() => {
                      toast.info('Please enable notifications in your browser settings and refresh the page');
                    }}>
                      Browser Settings
                    </Button>
                  )}
                </div>
              </div>

              {notificationPermission === 'granted' && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ Notifications are enabled! You'll receive alerts for new messages and important updates.
                  </p>
                </div>
              )}

              {notificationPermission === 'denied' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                    ❌ Notifications are blocked. To enable them:
                  </p>
                  <ol className="text-sm text-red-700 dark:text-red-300 list-decimal list-inside space-y-1">
                    <li>Click the lock icon in your browser's address bar</li>
                    <li>Change notifications to "Allow"</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sound Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                Sound Settings
              </CardTitle>
              <CardDescription>
                Configure notification sounds and audio alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notification Sounds</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Play sound when new messages arrive
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const newSoundEnabled = !soundEnabled;
                    setSoundEnabled(newSoundEnabled);
                    notificationService.setSoundEnabled(newSoundEnabled);
                    toast.success(`Notification sounds ${newSoundEnabled ? 'enabled' : 'disabled'}`);
                  }}
                >
                  {soundEnabled ? 'Disable' : 'Enable'} Sounds
                </Button>
              </div>
              
              {soundEnabled && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      notificationService.playNotificationSound();
                      toast.success('Test sound played!');
                    }}
                  >
                    Test Sound
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Staff-specific Notification Types Card */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Notification Types</CardTitle>
              <CardDescription>
                Choose which types of notifications you'd like to receive as a staff member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">New Chat Messages</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about new messages from users</p>
                  </div>
                  <div className={`text-sm font-medium ${notificationPermission === 'granted' ? 'text-green-600' : 'text-gray-500'}`}>
                    {notificationPermission === 'granted' ? 'Active' : 'Enable notifications first'}
                  </div>
                </div>
                {user?.role === 'moderator' && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Model Assignment Updates</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when models are assigned or unassigned to you</p>
                    </div>
                    <div className="text-sm text-gray-500">Coming Soon</div>
                  </div>
                )}
                {user?.role === 'admin' && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">System Alerts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about system issues and maintenance</p>
                    </div>
                    <div className="text-sm text-gray-500">Coming Soon</div>
                  </div>
                )}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Account Security</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Important security and account alerts</p>
                  </div>
                  <div className="text-sm text-gray-500">Coming Soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin-specific tabs
  if (user?.role === 'admin') {
    if (activeTab === 'admin-summary') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <AdminSummaryTab />
        </div>
      );
    }

    /**
    if (activeTab === 'system-health') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <SystemHealthTab />
        </div>
      );
    }
    **/

    if (activeTab === 'user-management') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <div className="p-8 text-center">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
              Quick User Management
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              Access full user management features from the admin panel.
            </p>
            <Link 
              to="/admin" 
              className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Go to Admin Panel
            </Link>
          </div>
        </div>
      );
    }
  }

  // Moderator-specific tabs
  if (user?.role === 'moderator') {
    if (activeTab === 'moderation-summary') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <ModerationSummaryTab />
        </div>
      );
    }

    if (activeTab === 'chat-activity') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <ChatActivityTab />
        </div>
      );
    }
  }

  // Default tab handling for other common tabs
  return (
    <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="p-10 text-center">
        <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
          {activeTab}
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
          This section is under development.
        </p>
        
        {user?.role === 'admin' && (
          <Link 
            to="/admin" 
            className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity mr-4"
          >
            Go to Admin Panel
          </Link>
        )}
        
        {user?.role === 'moderator' && (
          <Link 
            to="/moderator" 
            className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Go to Moderator Panel
          </Link>
        )}
      </div>
    </div>
  );
};

export default StaffOtherTabs;
