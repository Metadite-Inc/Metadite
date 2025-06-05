import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import OrdersTabHeader from './orders/OrdersTabHeader';
import { userApi } from '../../lib/api/user_api';

const OrdersTab = ({ user }) => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await userApi.getUserOrders();
        setOrders(userOrders || []); // Ensure we always have an array
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      fetchOrders();
    } else {
      setIsLoading(false); // Stop loading if no user
    }
  }, [user?.id]);

  // Filter orders based on active filter
  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  if (isLoading) {
    return (
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="py-8 text-center">
          <span className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="py-8 text-center">
          <span className="text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
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
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <OrdersTabHeader 
        theme={theme} 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />
      
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
            {filteredOrders.map((order) => (
              <tr key={order.id} className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : ''}`}>ORD-{order.id}</td>
                <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{order.date}</td>
                <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{order.items}</td>
                <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : ''}`}>${order.total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
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
    </div>
  );
};

export default OrdersTab;
