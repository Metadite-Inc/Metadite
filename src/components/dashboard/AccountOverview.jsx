
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, CreditCard, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Mock data for recent orders
const recentOrders = [
  {
    id: 'ORD-12345',
    date: '2023-08-15',
    items: 2,
    total: 289.98,
    status: 'Delivered'
  },
  {
    id: 'ORD-12346',
    date: '2023-07-29',
    items: 1,
    total: 159.99,
    status: 'Processing'
  }
];

const AccountOverview = ({ user, isLoaded }) => {
  const { theme } = useTheme();

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`flex items-center p-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg`}>
            <User className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} mr-3`} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</p>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{user?.name || 'John Doe'}</p>
            </div>
          </div>
          <div className={`flex items-center p-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg`}>
            <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} mr-3`} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Email Address</p>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{user?.email || 'john.doe@example.com'}</p>
            </div>
          </div>
          <div className={`flex items-center p-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg`}>
            <Calendar className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} mr-3`} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Member Since</p>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>August 2023</p>
            </div>
          </div>
          <div className={`flex items-center p-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg`}>
            <CreditCard className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} mr-3`} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Subscription</p>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{user?.vip ? 'VIP Member' : 'Basic'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>Recent Orders</h2>
          <Link to="/orders" className="text-sm text-metadite-primary hover:underline">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={`text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{order.id}</td>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{order.date}</td>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{order.items}</td>
                  <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : ''}`}>${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/order/${order.id}`} className="text-sm text-metadite-primary hover:underline">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {recentOrders.length === 0 && (
          <div className="text-center py-10">
            <ShoppingBag className={`h-10 w-10 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-2`} />
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>You haven't placed any orders yet.</p>
            <Link 
              to="/models" 
              className="mt-2 inline-block text-metadite-primary hover:underline"
            >
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOverview;
