
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffNavbar from '../components/StaffNavbar';
import StaffFooter from '../components/StaffFooter';
import { useAuth } from '../context/AuthContext';
import { Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Import admin components
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardTab from '../components/admin/DashboardTab';
import ModelsTab from '../components/admin/ModelsTab';
import AdminsTab from '../components/admin/AdminsTab';
import ModeratorsTab from '../components/admin/ModeratorsTab';
import SubscriptionsTab from '../components/admin/SubscriptionsTab';
import PaymentsTab from '../components/admin/PaymentsTab';
import FlaggedMessagesTab from '../components/admin/FlaggedMessagesTab';
import SettingsTab from '../components/admin/SettingsTab';
import VideosTab from '../components/admin/VideosTab'; // Import the new VideosTab component
import SlideshowTab from '../components/admin/SlideshowTab';

// Mock data for flagged messages count
const flaggedMessagesCount = 2;

const Admin = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Only redirect if user is explicitly not logged in
    // Role validation will be handled server-side when making API calls
    if (!loading && !user) {
      navigate('/#heroSection'); // Redirect to Home's heroSection
    } else if (user) {
      setIsLoaded(true);
    }
  }, [user, loading, navigate]);
  
  // Persist activeTab to localStorage
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <StaffNavbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-white via-gray-100 to-white'
        }`}>
        <div className="container mx-auto max-w-7xl">
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="opacity-80">Manage your platform and users</p>
                </div>
              </div>
              
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                  Admin Account
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <AdminSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              flaggedMessagesCount={flaggedMessagesCount} 
            />
            
            <div className="lg:col-span-3">
              {/* Dashboard Overview */}
              {activeTab === 'dashboard' && <DashboardTab isLoaded={isLoaded} />}
              
              {/* Models Management */}
              {activeTab === 'models' && <ModelsTab isLoaded={isLoaded} />}
              
              {/* Videos Management */}
              {activeTab === 'videos' && <VideosTab isLoaded={isLoaded} />}
              
              {/* Admins Management */}
              {activeTab === 'admins' && <AdminsTab isLoaded={isLoaded} />}
              
              {/* Moderators Management */}
              {activeTab === 'moderators' && <ModeratorsTab isLoaded={isLoaded} />}

              {/* Subscriptions Management */}
              {activeTab === 'subscriptions' && <SubscriptionsTab isLoaded={isLoaded} />}
              
              {/* Payments Management */}
              {activeTab === 'payments' && <PaymentsTab isLoaded={isLoaded} />}
              
              {/* Flagged Messages */}
              {activeTab === 'flagged' && <FlaggedMessagesTab isLoaded={isLoaded} />}
              
              {/* Slideshow Management */}
              {activeTab === 'slideshow' && <SlideshowTab isLoaded={isLoaded} />}
              {/* Settings */}
              {activeTab === 'settings' && <SettingsTab isLoaded={isLoaded} />}
            </div>
          </div>
        </div>
      </div>

      <StaffFooter />
    </div>
  );
};

export default Admin;
