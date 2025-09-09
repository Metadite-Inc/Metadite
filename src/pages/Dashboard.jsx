
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User } from 'lucide-react';
import DashboardMenu from '../components/dashboard/DashboardMenu';
import AccountOverview from '../components/dashboard/AccountOverview';
import OtherTabs from '../components/dashboard/OtherTabs';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  // Set tab from URL query param if present
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search, activeTab]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth check to finish before redirecting
    if (!loading) {
      if (!user) {
        navigate('/'); // Redirect to Home's heroSection
      } else if (user.role === 'admin' || user.role === 'moderator') {
        // Only redirect staff users if we're sure about their role
        console.log('Redirecting staff user to staff dashboard:', user.role);
        navigate('/staff-dashboard', { replace: true });
      }
    }
    
    // Redirect staff users to staff dashboard
    if (!loading && user && (user.role === 'admin' || user.role === 'moderator')) {
      navigate('/staff-dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Early loading state with optimized skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
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
        <Footer />
      </div>
    );
  }

  // Don't render for staff users - they should be redirected
  if (user && (user.role === 'admin' || user.role === 'moderator')) {
    return null;
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  // Helper function to get membership display name
  const getMembershipDisplayName = (level) => {
    const levelMap = {
      free: 'Free',
      standard: 'Standard',
      vip: 'VIP',
      vvip: 'VVIP'
    };
    return levelMap[level] || 'Free';
  };

  // Don't render for staff users
  if (user && (user.role === 'admin' || user.role === 'moderator')) {
    return null;
  }

  // Check if user has VIP access
  const hasVipAccess = user?.membership_level === 'vip' || user?.membership_level === 'vvip';

  // Get user's first name immediately to avoid LCP delay
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          {/* Optimized hero section with immediate text rendering */}
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-metadite-primary" />
                </div>
                <div>
                  {/* LCP-optimized heading - render immediately with cached firstName */}
                  <h1 className="text-2xl font-bold">Welcome, {firstName}!</h1>
                  <p className="opacity-80">Manage your account and purchases</p>
                </div>
              </div>
              
              {/*<div className="flex space-x-3">
                {hasVipAccess ? (
                  <span className="bg-white/20 px-3 py-1 rounded-full font-medium animate-pulse-soft">
                    {getMembershipDisplayName(user?.membership_level)} Member
                  </span>
                ) : user?.role === 'user' ? (
                  <Link to="/upgrade" className="bg-white text-metadite-primary px-3 py-1 rounded-full font-medium hover:bg-opacity-90 transition-opacity">
                    Upgrade to VIP
                  </Link>
                ) : null}
              </div>*/}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <DashboardMenu 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                logout={logout} 
                userVip={hasVipAccess}
                user={user}
              />
            </div>
            
            <div className="lg:col-span-3">
              {/* Account Overview */}
              {activeTab === 'overview' && (
                <AccountOverview user={user} isLoaded={isLoaded} />
              )}
              
              {/* Other tabs */}
              {activeTab !== 'overview' && (
                <OtherTabs activeTab={activeTab} user={user} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
