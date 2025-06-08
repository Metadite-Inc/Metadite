import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Clock, CheckCircle, AlertTriangle, 
  TrendingUp, Users, Calendar, BarChart3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { moderatorApiService } from '../../lib/api/moderator_api';

const ModerationSummaryTab = () => {
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await moderatorApiService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform API data to match our interface
  const getModerationStats = () => {
    if (!dashboardData?.metrics) {
      return [
        { label: 'Assigned Models', value: '0', change: '+0%', icon: MessageSquare, color: 'blue' },
        { label: 'Avg Response Time', value: '0 min', change: '+0%', icon: Clock, color: 'green' },
        { label: 'Active Chat Rooms', value: '0', change: '+0%', icon: CheckCircle, color: 'emerald' },
        { label: 'Messages Today', value: '0', change: '+0', icon: AlertTriangle, color: 'orange' }
      ];
    }

    const metrics = dashboardData.metrics;
    const today = new Date().toISOString().split('T')[0];
    const todayMessages = metrics.messages_per_day[today] || 0;
    
    return [
      { 
        label: 'Assigned Models', 
        value: metrics.assigned_dolls.toString(), 
        change: '+0%', 
        icon: MessageSquare, 
        color: 'blue' 
      },
      { 
        label: 'Avg Response Time', 
        value: `${metrics.avg_response_time_minutes.toFixed(1)} min`, 
        change: '-15%', 
        icon: Clock, 
        color: 'green' 
      },
      { 
        label: 'Active Chat Rooms', 
        value: metrics.active_chat_rooms.toString(), 
        change: '+0%', 
        icon: CheckCircle, 
        color: 'emerald' 
      },
      { 
        label: 'Messages Today', 
        value: todayMessages.toString(), 
        change: `+${todayMessages}`, 
        icon: TrendingUp, 
        color: 'orange' 
      }
    ];
  };

  // Transform messages_per_day to weekly activity
  const getWeeklyActivity = () => {
    if (!dashboardData?.metrics?.messages_per_day) {
      return [
        { day: 'Mon', messages: 0, resolved: 0 },
        { day: 'Tue', messages: 0, resolved: 0 },
        { day: 'Wed', messages: 0, resolved: 0 },
        { day: 'Thu', messages: 0, resolved: 0 },
        { day: 'Fri', messages: 0, resolved: 0 },
        { day: 'Sat', messages: 0, resolved: 0 },
        { day: 'Sun', messages: 0, resolved: 0 }
      ];
    }

    const messages = dashboardData.metrics.messages_per_day;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get last 7 days
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];
      const messageCount = messages[dateStr] || 0;
      
      weeklyData.push({
        day: dayName,
        messages: messageCount,
        resolved: Math.floor(messageCount * 0.85) // Estimate 85% resolved
      });
    }
    
    return weeklyData;
  };

  const moderationStats = getModerationStats();
  const weeklyActivity = getWeeklyActivity();

  const recentActions = [
    {
      action: 'Message approved',
      user: 'user123@example.com',
      model: dashboardData?.metrics?.top_dolls?.[0]?.name || 'Model',
      time: '2 minutes ago',
      status: 'approved'
    },
    {
      action: 'Message flagged',
      user: 'john.doe@example.com',
      model: dashboardData?.metrics?.top_dolls?.[1]?.name || 'Model',
      time: '8 minutes ago',
      status: 'flagged'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const statusMap = {
      approved: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      flagged: 'text-red-500 bg-red-50 dark:bg-red-900/20',
      warning: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
      completed: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
    };
    return statusMap[status] || 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-metadite-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Moderation Statistics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {moderationStats.map((stat, index) => {
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

      {/* Weekly Activity Chart */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Weekly Activity
        </h3>
        
        <div className="flex items-end justify-between h-40 space-x-2">
          {weeklyActivity.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex flex-col items-center justify-end h-32 space-y-1">
                <div 
                  className="w-full bg-metadite-primary rounded-t"
                  style={{ height: `${Math.max((day.messages / Math.max(...weeklyActivity.map(d => d.messages), 1)) * 100, 2)}%` }}
                  title={`${day.messages} messages`}
                ></div>
                <div 
                  className="w-full bg-green-500 rounded-t"
                  style={{ height: `${Math.max((day.resolved / Math.max(...weeklyActivity.map(d => d.resolved), 1)) * 100, 2)}%` }}
                  title={`${day.resolved} resolved`}
                ></div>
              </div>
              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {day.day}
              </p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-metadite-primary rounded mr-2"></div>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Messages</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Resolved</span>
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Recent Actions
          </h3>
          <button className="text-sm text-metadite-primary hover:text-metadite-secondary transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActions.map((action, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {action.action}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(action.status)}`}>
                      {action.status}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    User: {action.user} • Model: {action.model}
                  </p>
                </div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {action.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModerationSummaryTab;
