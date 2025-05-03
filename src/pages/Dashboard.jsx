import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth check to finish before redirecting
    if (!loading && !user) {
      navigate('/'); // Redirect to Home's heroSection
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-metadite-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Welcome, {(user?.full_name?.split(' ')[0]) || 'User'}!</h1>
                  <p className="opacity-80">Manage your account and purchases</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {user?.vip ? (
                  <span className="bg-white/20 px-3 py-1 rounded-full font-medium animate-pulse-soft">
                    VIP Member
                  </span>
                ) : user?.role === 'user' ? ( // Show Upgrade to VIP only for regular users
                  <Link to="/upgrade" className="bg-white text-metadite-primary px-3 py-1 rounded-full font-medium hover:bg-opacity-90 transition-opacity">
                    Upgrade to VIP
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <DashboardMenu 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                logout={logout} 
                userVip={user?.vip}
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
                <OtherTabs activeTab={activeTab} />
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
