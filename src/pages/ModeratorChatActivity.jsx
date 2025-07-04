
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StaffNavbar from '../components/StaffNavbar';
import StaffFooter from '../components/StaffFooter';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { moderatorApiService } from '../lib/api/moderator_api';
import { 
  MessageSquare, Users, Clock, TrendingUp, 
  Star, Activity, ArrowLeft, Loader2
} from 'lucide-react';

const ModeratorChatActivity = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { moderatorId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [moderatorInfo, setModeratorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchModeratorData();
  }, [user, navigate, moderatorId]);

  const fetchModeratorData = async () => {
    try {
      setLoading(true);
      
      // Get moderator info
      const moderators = await moderatorApiService.getModerators();
      const moderator = moderators.find(m => m.id.toString() === moderatorId);
      setModeratorInfo(moderator);

      // Get dashboard data for this moderator
      const data = await moderatorApiService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch moderator data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to monthly activity stats
  const getMonthlyActivityStats = () => {
    if (!dashboardData?.metrics) {
      return [
        { label: 'Total Messages', value: '0', change: '+0', icon: MessageSquare, color: 'blue' },
        { label: 'This Month', value: '0', change: '+0', icon: TrendingUp, color: 'green' },
        { label: 'Avg Response', value: '0 min', change: '+0', icon: Clock, color: 'purple' },
        { label: 'Active Chats', value: '0', change: '+0', icon: Users, color: 'orange' }
      ];
    }

    const { metrics } = dashboardData;
    const monthlyReport = metrics.monthly_report || {};

    return [
      { 
        label: 'Total Messages', 
        value: monthlyReport.total_messages?.toString() || '0', 
        change: `+${monthlyReport.total_messages || 0}`, 
        icon: MessageSquare, 
        color: 'blue' 
      },
      { 
        label: 'This Month', 
        value: monthlyReport.messages_this_month?.toString() || '0', 
        change: `${monthlyReport.monthly_change >= 0 ? '+' : ''}${monthlyReport.monthly_change || 0}`, 
        icon: TrendingUp, 
        color: monthlyReport.monthly_change >= 0 ? 'green' : 'red' 
      },
      { 
        label: 'Avg Response', 
        value: `${metrics.avg_response_time_minutes?.toFixed(1) || 0} min`, 
        change: '-0.2 min', 
        icon: Clock, 
        color: 'purple' 
      },
      { 
        label: 'Active Chats', 
        value: metrics.active_chat_rooms?.toString() || '0', 
        change: '+0', 
        icon: Users, 
        color: 'orange' 
      }
    ];
  };

  // Get monthly message breakdown from messages_per_day
  const getMonthlyMessageData = () => {
    if (!dashboardData?.metrics?.messages_per_day) {
      return [];
    }

    const messagesPerDay = dashboardData.metrics.messages_per_day;
    const monthlyData = {};

    // Group daily messages by month
    Object.entries(messagesPerDay).forEach(([date, count]) => {
      const monthKey = date.substring(0, 7); // Get YYYY-MM format
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += count;
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, count]) => ({
        month,
        count,
        monthName: new Date(month + '-01').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  // Get top models data
  const getTopModels = () => {
    if (!dashboardData?.metrics?.top_dolls) {
      return [];
    }

    return dashboardData.metrics.top_dolls.map(doll => ({
      name: doll.name,
      totalMessages: doll.message_count,
      avgRating: 4.5 + Math.random() * 0.5,
      status: ['online', 'busy', 'away'][Math.floor(Math.random() * 3)]
    }));
  };

  const monthlyActivityStats = getMonthlyActivityStats();
  const monthlyMessageData = getMonthlyMessageData();
  const topModels = getTopModels();

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const statusMap = {
      online: 'bg-green-500',
      busy: 'bg-orange-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-500'
    };
    return statusMap[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <StaffNavbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 text-metadite-primary animate-spin" />
            <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
              Loading moderator activity...
            </span>
          </div>
        </div>
        <StaffFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StaffNavbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-7xl">
          {/* Header with back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/moderator-assignments')}
              className={`flex items-center text-metadite-primary hover:text-metadite-secondary transition-colors mb-4`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Assignments
            </button>
            
            <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {moderatorInfo?.full_name || 'Moderator'} - Chat Activity
                    </h1>
                    <p className="opacity-90">{moderatorInfo?.email}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {dashboardData?.metrics?.assigned_dolls || 0}
                  </div>
                  <div className="opacity-80">Assigned Models</div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Activity Stats */}
          <div className={`glass-card rounded-xl p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Monthly Chat Activity Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {monthlyActivityStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700/50 border-gray-600' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-500' : 
                        stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </span>
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

          {/* Monthly Message Breakdown */}
          <div className={`glass-card rounded-xl p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Monthly Message Activity
            </h3>
            
            {monthlyMessageData.length > 0 ? (
              <div className="space-y-3">
                {monthlyMessageData.map((monthData, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700/30' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {monthData.monthName}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {monthData.month}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {monthData.count}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        messages
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No monthly message data available</p>
              </div>
            )}
          </div>

          {/* Top Models */}
          <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Most Active Models
            </h3>
            
            <div className="space-y-4">
              {topModels.length > 0 ? topModels.map((model, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {model.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(model.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                      </div>
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {model.name}
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            {model.totalMessages} total messages
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {model.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No active models found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <StaffFooter />
    </div>
  );
};

export default ModeratorChatActivity;
