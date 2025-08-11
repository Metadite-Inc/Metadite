import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, ShieldCheck, TrendingUp, 
  DollarSign, AlertTriangle, Server, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { adminApiService } from '../../lib/api/admin_api';

const AdminSummaryTab = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        console.log('Fetching dashboard stats for staff dashboard...');
        const data = await adminApiService.getDashboardStats();
        console.log('Dashboard stats received:', data);
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const summaryData = [
    {
      title: 'Platform Overview',
      stats: [
        { 
          label: 'Total Users', 
          value: loading ? 'Loading...' : (stats?.total_users?.toLocaleString() ?? '--'), 
          change: loading ? '' : (stats?.users_change ? `${stats.users_change} from last month` : ''), 
          icon: Users, 
          color: 'blue',
          action: () => navigate('/admin?tab=admins')
        },
        { 
          label: 'Active Models', 
          value: loading ? 'Loading...' : (stats?.active_models?.toString() ?? '--'), 
          change: loading ? '' : (stats?.models_change ? `${stats.models_change} from last month` : ''), 
          icon: MessageSquare, 
          color: 'green',
          action: () => navigate('/admin?tab=models')
        },
        { 
          label: 'Revenue (MTD)', 
          value: loading
            ? 'Loading...'
            : stats?.monthly_revenue !== undefined && stats?.monthly_revenue !== null
              ? `$${stats.monthly_revenue.toLocaleString()}`
              : '--',
          change: loading ? '' : (stats?.revenue_change ? `${stats.revenue_change} from last month` : ''), 
          icon: DollarSign, 
          color: 'purple',
          action: () => navigate('/admin?tab=payments')
        }
      ]
    },
    {
      title: 'Security & Moderation',
      stats: [
        { 
          label: 'Flagged Messages', 
          value: loading ? 'Loading...' : (stats?.flagged_messages?.toString() ?? '--'), 
          change: loading ? '' : (stats?.flagged_change ? `${stats.flagged_change} from last month` : ''), 
          icon: AlertTriangle, 
          color: 'red',
          action: () => navigate('/admin?tab=flagged')
        },
        { 
          label: 'Active Moderators', 
          value: loading ? 'Loading...' : (stats?.active_moderators?.toString() ?? '--'), 
          change: loading ? '' : (stats?.moderators_change ? `${stats.moderators_change} from last month` : ''), 
          icon: Users, 
          color: 'orange',
          action: () => navigate('/admin?tab=moderators')
        }
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
                <button
                  key={index}
                  onClick={stat.action}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/70' 
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-metadite-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-500' : 
                      stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Recent Activity */}
      {/* 
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Recent Activity
          </h3>
          <button 
            onClick={() => navigate('/admin')}
            className="text-sm text-metadite-primary hover:text-metadite-secondary transition-colors"
          >
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
      */}
    </div>
  );
};

export default AdminSummaryTab;
