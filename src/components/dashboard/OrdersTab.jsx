
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';
import OrdersTabHeader from './orders/OrdersTabHeader';
import OrdersTable from './orders/OrdersTable';
import OrdersLoading from './orders/OrdersLoading';
import OrdersEmpty from './orders/OrdersEmpty';

const OrdersTab = ({ user }) => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from an API based on the user's ID
    const fetchOrders = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock orders data
        const mockOrders = [
          {
            id: '123456',
            date: '2025-04-28',
            items: ['Emma Watson Model', 'Premium Access'],
            total: 49.98,
            status: 'unpaid',
          },
          {
            id: '789012',
            date: '2025-04-25',
            items: ['John Smith Model'],
            total: 19.99,
            status: 'to_be_shipped',
          },
          {
            id: '345678',
            date: '2025-04-20',
            items: ['Sarah Parker Model', 'VIP Subscription'],
            total: 39.98,
            status: 'shipped',
          },
          {
            id: '901234',
            date: '2025-04-15',
            items: ['Michael Johnson Model'],
            total: 24.99,
            status: 'completed',
          },
          {
            id: '567890',
            date: '2025-04-10',
            items: ['Custom Model Package'],
            total: 99.99,
            status: 'cancelled',
          },
        ];
        
        setOrders(mockOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user?.id]);

  // Filter orders based on active filter
  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  if (isLoading) {
    return <OrdersLoading theme={theme} />;
  }

  if (orders.length === 0) {
    return <OrdersEmpty theme={theme} />;
  }

  return (
    <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <OrdersTabHeader 
        theme={theme} 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />
      
      <div className="rounded-lg overflow-hidden">
        <OrdersTable 
          theme={theme} 
          filteredOrders={filteredOrders} 
        />
      </div>
    </div>
  );
};

export default OrdersTab;
