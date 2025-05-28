import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StaffNavbar from '../components/StaffNavbar';
import StaffFooter from '../components/StaffFooter';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, MessageSquare, Settings } from 'lucide-react';
import StaffDashboardMenu from '../components/staff-dashboard/StaffDashboardMenu';
import StaffAccountOverview from '../components/staff-dashboard/StaffAccountOverview';
import StaffOtherTabs from '../components/staff-dashboard/StaffOtherTabs';

const StaffDashboard = () => {
  const { user, logout, loading } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth check to finish before redirecting
    if (!loading && !user) {
      navigate('/'); // Redirect to Home's heroSection
    }
    
    // Redirect regular users to regular dashboard
    if (!loading && user && user.role === 'user') {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Early loading state with optimized skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <StaffNavbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-6xl">
            {/* Optimized skeleton that matches final layout */}
            <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 animate-pulse">
                    <User className="h-8 w-8 text-white/60" />
                  </div>
                  <div>
                    <div className="h-8 bg-white/20 rounded w-48 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-white/20 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 bg-white/20 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-96 bg-white/20 dark:bg-gray-800/20 rounded-xl animate-pulse"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="h-96 bg-white/20 dark:bg-gray-800/20 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <StaffFooter />
      </div>
    );
  }

  // Don't render for regular users
  if (user?.role === 'user') {
    return null;
  }

  // Get user's first name immediately to avoid LCP delay
  const firstName = user?.full_name?.split(' ')[0] || 'Staff';

  // Get role-specific icon and title
  const getRoleInfo = () => {
    if (user?.role === 'admin') {
      return {
        icon: <Settings className="h-8 w-8 text-metadite-primary" />,
        title: 'Admin Dashboard',
        subtitle: 'Manage your platform and users',
        badge: 'Admin Account'
      };
    }
    if (user?.role === 'moderator') {
      return {
        icon: <MessageSquare className="h-8 w-8 text-metadite-primary" />,
        title: 'Moderator Dashboard', 
        subtitle: 'Manage conversations with users',
        badge: 'Moderator Account'
      };
    }
    return {
      icon: <User className="h-8 w-8 text-metadite-primary" />,
      title: 'Staff Dashboard',
      subtitle: 'Manage your account',
      badge: 'Staff Account'
    };
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen flex flex-col">
      <StaffNavbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          {/* Role-specific hero section */}
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
                  {roleInfo.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Welcome, {firstName}!</h1>
                  <p className="opacity-80">{roleInfo.subtitle}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                  {roleInfo.badge}
                </span>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="bg-white text-metadite-primary px-3 py-1 rounded-full font-medium hover:bg-opacity-90 transition-opacity"
                  >
                    Admin Panel
                  </Link>
                )}
                {user?.role === 'moderator' && (
                  <Link 
                    to="/moderator" 
                    className="bg-white text-metadite-primary px-3 py-1 rounded-full font-medium hover:bg-opacity-90 transition-opacity"
                  >
                    Moderator Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <StaffDashboardMenu 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                logout={logout} 
                user={user}
              />
            </div>
            
            <div className="lg:col-span-3">
              {/* Account Overview */}
              {activeTab === 'overview' && (
                <StaffAccountOverview user={user} isLoaded={isLoaded} />
              )}
              
              {/* Other tabs */}
              {activeTab !== 'overview' && (
                <StaffOtherTabs activeTab={activeTab} user={user} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <StaffFooter />
    </div>
  );
};

export default StaffDashboard;
