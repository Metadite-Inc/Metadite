import React from 'react';
import { 
  Server, Database, Wifi, Shield, Activity, 
  HardDrive, Cpu, MemoryStick, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SystemHealthTab = () => {
  const { theme } = useTheme();

  const systemMetrics = [
    { 
      label: 'Server Uptime', 
      value: '99.98%', 
      status: 'healthy', 
      icon: Server, 
      color: 'green',
      details: 'Last restart: 7 days ago'
    },
    { 
      label: 'Database Health', 
      value: '98.5%', 
      status: 'healthy', 
      icon: Database, 
      color: 'green',
      details: 'Query avg: 45ms'
    },
    { 
      label: 'API Response', 
      value: '156ms', 
      status: 'warning', 
      icon: Activity, 
      color: 'orange',
      details: 'Target: <150ms'
    },
    { 
      label: 'Security Status', 
      value: 'Secure', 
      status: 'healthy', 
      icon: Shield, 
      color: 'green',
      details: 'No threats detected'
    }
  ];

  const resourceUsage = [
    { label: 'CPU Usage', value: 45, max: 100, unit: '%', icon: Cpu, color: 'blue' },
    { label: 'Memory Usage', value: 67, max: 100, unit: '%', icon: MemoryStick, color: 'purple' },
    { label: 'Disk Usage', value: 78, max: 100, unit: '%', icon: HardDrive, color: 'orange' },
    { label: 'Network I/O', value: 23, max: 100, unit: '%', icon: Wifi, color: 'cyan' }
  ];

  const systemLogs = [
    {
      level: 'info',
      message: 'Database backup completed successfully',
      timestamp: '2025-05-28 14:30:15',
      service: 'backup-service'
    },
    {
      level: 'warning',
      message: 'High memory usage detected on server-02',
      timestamp: '2025-05-28 14:25:08',
      service: 'monitoring'
    },
    {
      level: 'info',
      message: 'SSL certificate auto-renewed for metadite.com',
      timestamp: '2025-05-28 14:20:42',
      service: 'ssl-manager'
    },
    {
      level: 'error',
      message: 'Failed to connect to external API endpoint',
      timestamp: '2025-05-28 14:15:33',
      service: 'api-gateway'
    },
    {
      level: 'info',
      message: 'Cache cleared and rebuilt successfully',
      timestamp: '2025-05-28 14:10:17',
      service: 'cache-service'
    }
  ];

  const getStatusColor = (status) => {
    const statusMap = {
      healthy: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      warning: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
      critical: 'text-red-500 bg-red-50 dark:bg-red-900/20'
    };
    return statusMap[status] || 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  };

  const getLogLevelColor = (level) => {
    const levelMap = {
      info: 'text-blue-500',
      warning: 'text-orange-500',
      error: 'text-red-500',
      success: 'text-green-500'
    };
    return levelMap[level] || 'text-gray-500';
  };

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      cyan: 'bg-cyan-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getUsageColor = (value) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          System Health Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 ${getColorClasses(metric.color)} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <div>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </p>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {metric.label}
                  </p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {metric.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource Usage */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Resource Usage
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resourceUsage.map((resource, index) => {
            const IconComponent = resource.icon;
            const percentage = (resource.value / resource.max) * 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {resource.label}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {resource.value}{resource.unit}
                  </span>
                </div>
                <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                  <div 
                    className={`h-2 rounded-full ${getUsageColor(resource.value)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Logs */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            System Logs
          </h3>
          <button className="text-sm text-metadite-primary hover:text-metadite-secondary transition-colors">
            View All Logs
          </button>
        </div>
        
        <div className="space-y-3">
          {systemLogs.map((log, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs font-medium uppercase ${getLogLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {log.service}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.message}
                  </p>
                </div>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {log.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthTab;
