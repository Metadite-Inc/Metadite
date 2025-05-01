
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Package, 
  Truck, 
  Check, 
  X, 
  Wallet,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Table,
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Badge } from '../ui/badge';

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
            id: 'ORD-123456',
            date: '2025-04-28',
            items: ['Emma Watson Model', 'Premium Access'],
            total: 49.98,
            status: 'unpaid',
          },
          {
            id: 'ORD-789012',
            date: '2025-04-25',
            items: ['John Smith Model'],
            total: 19.99,
            status: 'to_be_shipped',
          },
          {
            id: 'ORD-345678',
            date: '2025-04-20',
            items: ['Sarah Parker Model', 'VIP Subscription'],
            total: 39.98,
            status: 'shipped',
          },
          {
            id: 'ORD-901234',
            date: '2025-04-15',
            items: ['Michael Johnson Model'],
            total: 24.99,
            status: 'completed',
          },
          {
            id: 'ORD-567890',
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'unpaid':
        return <Wallet className="h-4 w-4 text-amber-500" />;
      case 'to_be_shipped':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'unpaid':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">Unpaid</Badge>;
      case 'to_be_shipped':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">To Be Shipped</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">Shipped</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">Pending</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={`glass-card rounded-xl p-10 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-metadite-primary"></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`glass-card rounded-xl p-10 text-center ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            No Orders Yet
          </h2>
          <p className={`max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            You haven't placed any orders yet. Browse our models and make a purchase to see your orders here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
          Your Orders
        </h2>
        
        <div className="w-full md:w-auto">
          <ToggleGroup type="single" value={activeFilter} onValueChange={(value) => value && setActiveFilter(value)}>
            <ToggleGroupItem value="all" aria-label="Toggle all orders" className={`text-xs px-3 ${theme === 'dark' ? 'data-[state=on]:bg-gray-700' : ''}`}>
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="unpaid" aria-label="Toggle unpaid orders" className={`text-xs px-3 ${theme === 'dark' ? 'data-[state=on]:bg-gray-700' : ''}`}>
              <Wallet className="h-3.5 w-3.5 mr-1" /> Unpaid
            </ToggleGroupItem>
            <ToggleGroupItem value="to_be_shipped" aria-label="Toggle orders to be shipped" className={`text-xs px-3 ${theme === 'dark' ? 'data-[state=on]:bg-gray-700' : ''}`}>
              <Package className="h-3.5 w-3.5 mr-1" /> To Be Shipped
            </ToggleGroupItem>
            <ToggleGroupItem value="shipped" aria-label="Toggle shipped orders" className={`text-xs px-3 ${theme === 'dark' ? 'data-[state=on]:bg-gray-700' : ''}`}>
              <Truck className="h-3.5 w-3.5 mr-1" /> Shipped
            </ToggleGroupItem>
            <ToggleGroupItem value="completed" aria-label="Toggle completed orders" className={`text-xs px-3 ${theme === 'dark' ? 'data-[state=on]:bg-gray-700' : ''}`}>
              <Check className="h-3.5 w-3.5 mr-1" /> Completed
            </ToggleGroupItem>
            <ToggleGroupItem value="cancelled" aria-label="Toggle cancelled orders" className={`text-xs px-3 ${theme === 'dark' ? 'data-[state=on]:bg-gray-700' : ''}`}>
              <X className="h-3.5 w-3.5 mr-1" /> Cancelled
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <TableRow>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Order ID</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Date</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Items</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Total</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow 
                key={order.id} 
                className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/30' : 'hover:bg-gray-50'}
              >
                <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                  {order.id}
                </TableCell>
                <TableCell className={theme === 'dark' ? 'text-gray-300' : ''}>
                  {order.date}
                </TableCell>
                <TableCell className={theme === 'dark' ? 'text-gray-300' : ''}>
                  {order.items.join(', ')}
                </TableCell>
                <TableCell className={theme === 'dark' ? 'text-gray-300' : ''}>
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{getStatusBadge(order.status)}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTab;
