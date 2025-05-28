import React from 'react';
import { 
  Users, MessageSquare, ShieldCheck, TrendingUp, 
  DollarSign, AlertTriangle, Server, Activity
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminSummaryTab = () => {
  const { theme } = useTheme();

  const summaryData = [
    {
      title: 'Platform Overview',
      stats: [
        { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'blue' },
        { label: 'Active Models', value: '45', change: '+5%', icon: MessageSquare, color: 'green' },
        { label: 'System Uptime', value: '99.8%', change: '+0.1%', icon: ShieldCheck, color: 'emerald' },
        { label: 'Revenue (MTD)', value: '$24,389', change: '+15%', icon: DollarSign, color: 'purple' }
      ]
    },
    {
      title: 'Security & Moderation',
      stats: [
        { label: 'Flagged Messages', value: '3', change: '-2', icon: AlertTriangle, color: 'red' },
        { label: 'Active Moderators', value: '8', change: '+1', icon: Users, color: 'orange' },
        { label: 'Server Health', value: '98%', change: '+1%', icon: Server, color: 'cyan' },
        { label: 'API Requests', value: '45.2K', change: '+8%', icon: Activity, color: 'indigo' }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      cyan: 'bg-cyan-500',
      indigo: 'bg-indigo-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const recentActivities = [
    {
      type: 'user_signup',
      message: 'New user registration: john.doe@example.com',
      time: '5 minutes ago',
      icon: Users,
      color: 'green'
    },
    {
      type: 'payment',
      message: 'VIP subscription purchased by emma@example.com',
      time: '12 minutes ago',
      icon: DollarSign,
      color: 'purple'
    },
    {
      type: 'alert',
      message: 'Message flagged for review in #general',
      time: '23 minutes ago',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      type: 'system',
      message: 'Database backup completed successfully',
      time: '1 hour ago',
      icon: Server,
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      {summaryData.map((section, sectionIndex) => (
        <div key={sectionIndex} className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {section.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section.stats.map((stat, index) => {
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
      ))}

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
          {recentActivities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div key={index} className="flex items-start">
                <div className={`w-10 h-10 rounded-full ${getColorClasses(activity.color)} bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0`}>
                  <IconComponent className={`h-5 w-5 ${getColorClasses(activity.color).replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {activity.message}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminSummaryTab;
