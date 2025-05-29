import React from 'react';
import { 
  MessageSquare, Users, Clock, TrendingUp, 
  Eye, Heart, Star, Activity
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ChatActivityTab = () => {
  const { theme } = useTheme();

  const activityStats = [
    { label: 'Active Chats', value: '24', change: '+3', icon: MessageSquare, color: 'blue' },
    { label: 'Online Users', value: '156', change: '+12', icon: Users, color: 'green' },
    { label: 'Avg Session', value: '18 min', change: '+2 min', icon: Clock, color: 'purple' },
    { label: 'Messages/Hour', value: '342', change: '+15%', icon: TrendingUp, color: 'orange' }
  ];

  const topModels = [
    {
      name: 'Sophia Elegance',
      activeChats: 8,
      totalMessages: 156,
      avgRating: 4.9,
      status: 'online'
    },
    {
      name: 'Luna Mystique',
      activeChats: 6,
      totalMessages: 134,
      avgRating: 4.8,
      status: 'online'
    },
    {
      name: 'Aria Grace',
      activeChats: 5,
      totalMessages: 98,
      avgRating: 4.7,
      status: 'busy'
    },
    {
      name: 'Zara Bliss',
      activeChats: 3,
      totalMessages: 76,
      avgRating: 4.6,
      status: 'online'
    },
    {
      name: 'Nova Dream',
      activeChats: 2,
      totalMessages: 45,
      avgRating: 4.5,
      status: 'away'
    }
  ];

  const recentActivity = [
    {
      type: 'chat_started',
      user: 'john.doe@example.com',
      model: 'Sophia Elegance',
      time: '2 minutes ago',
      status: 'active'
    },
    {
      type: 'chat_ended',
      user: 'emma@example.com',
      model: 'Luna Mystique',
      time: '5 minutes ago',
      status: 'completed'
    },
    {
      type: 'message_flagged',
      user: 'user123@example.com',
      model: 'Aria Grace',
      time: '8 minutes ago',
      status: 'flagged'
    },
    {
      type: 'rating_submitted',
      user: 'alice@example.com',
      model: 'Zara Bliss',
      time: '12 minutes ago',
      status: 'rated'
    },
    {
      type: 'chat_started',
      user: 'bob@example.com',
      model: 'Nova Dream',
      time: '15 minutes ago',
      status: 'active'
    }
  ];

  const hourlyActivity = [
    { hour: '08:00', messages: 45 },
    { hour: '09:00', messages: 67 },
    { hour: '10:00', messages: 89 },
    { hour: '11:00', messages: 123 },
    { hour: '12:00', messages: 156 },
    { hour: '13:00', messages: 178 },
    { hour: '14:00', messages: 201 },
    { hour: '15:00', messages: 189 }
  ];

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

  const getActivityColor = (status) => {
    const statusMap = {
      active: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      completed: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      flagged: 'text-red-500 bg-red-50 dark:bg-red-900/20',
      rated: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
    };
    return statusMap[status] || 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      chat_started: MessageSquare,
      chat_ended: MessageSquare,
      message_flagged: Eye,
      rating_submitted: Star
    };
    return iconMap[type] || Activity;
  };

  return (
    <div className="space-y-6">
      {/* Activity Stats */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Chat Activity Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activityStats.map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Models */}
        <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Most Active Models
          </h3>
          
          <div className="space-y-4">
            {topModels.map((model, index) => (
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
                          {model.activeChats} active chats
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>•</span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          {model.totalMessages} messages
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {model.avgRating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Activity Chart */}
        <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Hourly Message Activity
          </h3>
          
          <div className="flex items-end justify-between h-40 space-x-2">
            {hourlyActivity.map((hour, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-metadite-primary rounded-t"
                  style={{ height: `${(hour.messages / 250) * 100}%` }}
                  title={`${hour.messages} messages at ${hour.hour}`}
                ></div>
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {hour.hour}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Recent Activity
          </h3>
          <button className="text-sm text-metadite-primary hover:text-metadite-secondary transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type);
            return (
              <div key={index} className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-metadite-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <IconComponent className="h-4 w-4 text-metadite-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getActivityColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        User: {activity.user} • Model: {activity.model}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatActivityTab;
