
import { Users, CreditCard, ShoppingBag } from 'lucide-react';

const DashboardStats = () => {
  return (
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
  );
};

export default DashboardStats;
