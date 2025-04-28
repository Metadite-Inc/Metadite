import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Mock data for payments
const payments = [
  { id: 'PAY-12345', user: 'john@example.com', amount: 129.99, date: '2023-08-15', method: 'Credit Card', status: 'Completed' },
  { id: 'PAY-12346', user: 'emma@example.com', amount: 259.98, date: '2023-08-14', method: 'Stripe', status: 'Completed' },
  { id: 'PAY-12347', user: 'michael@example.com', amount: 99.99, date: '2023-08-13', method: 'Crypto', status: 'Processing' },
  { id: 'PAY-12348', user: 'sarah@example.com', amount: 159.99, date: '2023-08-12', method: 'Credit Card', status: 'Failed' }
];

const PaymentsTab = ({ isLoaded }) => {
  const { theme } = useTheme();

  return (
    <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Recent Payments</h2>
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={`text-left text-gray-500 text-sm 
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <th className="px-6 py-3">Payment ID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Method</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className={`border-t border-gray-100 transition-colors 
                  ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                  <td className="px-6 py-4 font-medium">{payment.id}</td>
                  <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {payment.user}</td>
                  <td className="px-6 py-4 font-medium">${payment.amount}</td>
                  <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {payment.date}</td>
                  <td className="px-6 py-4">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : payment.status === 'Processing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                      Details
                    </button>
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

export default PaymentsTab;