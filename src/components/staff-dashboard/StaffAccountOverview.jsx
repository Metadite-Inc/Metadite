import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Calendar, Shield, MessageSquare, 
  Clock, BarChart3, Users, AlertTriangle, Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { moderatorApiService } from '../../lib/api/moderator_api';

const StaffAccountOverview = ({ user, isLoaded }) => {
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (user?.role === 'moderator') {
      const fetchDashboardData = async () => {
        try {
          const data = await moderatorApiService.getDashboardData();
          setDashboardData(data);
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        }
      };

      fetchDashboardData();
    }
  }, [user]);

  // Get role-specific stats and information
  const getRoleSpecificData = () => {
    if (user?.role === 'admin') {
      return {
        title: 'Admin Account Overview',
        stats: [
          { label: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
          { label: 'Active Models', value: '45', icon: MessageSquare, color: 'green' },
          { label: 'System Health', value: '99.8%', icon: Shield, color: 'emerald' },
          { label: 'Flagged Messages', value: '3', icon: AlertTriangle, color: 'red' }
        ]
      };
    }

    if (user?.role === 'moderator') {
      const metrics = dashboardData?.metrics;
      const today = new Date().toISOString().split('T')[0];
      const todayMessages = metrics?.messages_per_day?.[today] || 0;

      return {
        title: 'Moderator Account Overview',
        stats: [
          { 
            label: 'Assigned Models', 
            value: metrics?.assigned_dolls?.toString() || '0', 
            icon: MessageSquare, 
            color: 'blue' 
          },
          { 
            label: 'Messages Today', 
            value: todayMessages.toString(), 
            icon: BarChart3, 
            color: 'green' 
          },
          { 
            label: 'Active Chats', 
            value: metrics?.active_chat_rooms?.toString() || '0', 
            icon: Clock, 
            color: 'purple' 
          },
          { 
            label: 'Response Time', 
            value: metrics ? `${metrics.avg_response_time_minutes.toFixed(1)}min` : '0min', 
            icon: Clock, 
            color: 'orange' 
          }
        ]
      };
    }

    return {
      title: 'Staff Account Overview',
      stats: []
    };
  };

  const roleData = getRoleSpecificData();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      emerald: 'bg-emerald-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Account Information Card */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-metadite-primary to-metadite-secondary rounded-full flex items-center justify-center mr-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {user?.full_name || 'Staff Member'}
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.role === 'admin' ? 'Platform Administrator' :
               user?.role === 'moderator' ? 'Content Moderator' :
               'Staff Member'}
            </p>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-metadite-primary mr-3" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.email || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-metadite-primary mr-3" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Role</p>
                <p className={`font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.role || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-metadite-primary mr-3" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Member Since</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(user?.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-metadite-primary mr-3" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Last Active</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(user?.last_login)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific Stats */}
      {roleData.stats.length > 0 && (
        <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {user?.role === 'admin' ? 'Platform Statistics' : 'Performance Overview'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleData.stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === 'admin' && (
            <>
              <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <Users className="h-6 w-6 text-metadite-primary mb-2" />
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Manage Users
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add, edit, or remove users
                </p>
              </button>
              
              <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <BarChart3 className="h-6 w-6 text-metadite-primary mb-2" />
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  View Analytics
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Platform performance metrics
                </p>
              </button>
            </>
          )}
          
          {user?.role === 'moderator' && (
            <>
              <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <MessageSquare className="h-6 w-6 text-metadite-primary mb-2" />
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Active Chats
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  View ongoing conversations
                </p>
              </button>
              
              <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <AlertTriangle className="h-6 w-6 text-metadite-primary mb-2" />
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Flagged Content
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Review reported messages
                </p>
              </button>
            </>
          )}
          
          <button className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <Settings className="h-6 w-6 text-metadite-primary mb-2" />
            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Account Settings
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Update your preferences
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffAccountOverview;