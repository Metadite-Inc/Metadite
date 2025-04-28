import React from 'react';
import { Users, CreditCard, ShoppingBag, AlertTriangle } from 'lucide-react';

const DashboardTab = ({ isLoaded }) => {
  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold">1,243</h3>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-500">
            +12% from last month
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Subscriptions</p>
              <h3 className="text-2xl font-bold">267</h3>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-500">
            +8% from last month
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
              <ShoppingBag className="h-6 w-6 text-purple-500 dark:text-purple-200" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Monthly Revenue</p>
              <h3 className="text-2xl font-bold">$24,389</h3>
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-500 dark:text-purple-200">
            +15% from last month
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <button className="text-sm text-metadite-primary hover:text-metadite-secondary transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
              <CreditCard className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">New subscription</p>
              <p className="text-sm text-gray-500">User emma@example.com purchased a VIP subscription</p>
              <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 flex-shrink-0">
              <Users className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium">New moderator</p>
              <p className="text-sm text-gray-500">Added sarah.moderator@metadite.com as a moderator</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="font-medium">Message flagged</p>
              <p className="text-sm text-gray-500">The system flagged a potentially inappropriate message</p>
              <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">New order</p>
              <p className="text-sm text-gray-500">User john@example.com purchased Sophia Elegance model</p>
              <p className="text-xs text-gray-400 mt-1">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;