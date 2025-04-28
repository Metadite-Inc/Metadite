import React from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Mock data for subscriptions
const subscriptions = [
  { id: 1, user: 'john@example.com', plan: 'VIP', startDate: '2023-06-15', endDate: '2024-06-15', status: 'Active', amount: 99.99 },
  { id: 2, user: 'emma@example.com', plan: 'VIP', startDate: '2023-07-22', endDate: '2024-07-22', status: 'Active', amount: 99.99 },
  { id: 3, user: 'robert@example.com', plan: 'VIP', startDate: '2023-05-10', endDate: '2023-11-10', status: 'Expired', amount: 59.99 }
];

const SubscriptionsTab = ({ isLoaded }) => {
  const { theme } = useTheme();

  return (
    <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Active Subscriptions</h2>
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={`text-left text-gray-500 text-sm 
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">End Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className={`border-t border-gray-100 transition-colors 
                  ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                  <td className="px-6 py-4 font-medium">{subscription.user}</td>
                  <td className="px-6 py-4">
                    <span className="bg-metadite-primary/10 text-metadite-primary px-2 py-1 rounded-full text-xs font-medium">
                      {subscription.plan}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {subscription.startDate}</td>
                  <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {subscription.endDate}</td>
                  <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    ${subscription.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsTab;