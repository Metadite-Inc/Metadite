
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Table,
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import { Button } from '../../ui/button';
import { ArrowRight } from 'lucide-react';
import OrderStatusCell from './OrderStatusCell';
import { useIsMobile } from '@/hooks/use-mobile';

const OrdersTable = ({ theme, filteredOrders }) => {
  const isMobile = useIsMobile();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div 
            key={order.id} 
            className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">
                <span className={theme === 'dark' ? 'text-gray-300' : ''}>ORD-{order.id}</span>
              </div>
              <OrderStatusCell status={order.status} />
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="grid grid-cols-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Date:</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>{order.date}</span>
              </div>
              
              <div className="grid grid-cols-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Items:</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>{order.items.join(', ')}</span>
              </div>
              
              <div className="grid grid-cols-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total:</span>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>{formatCurrency(order.total)}</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Link to={`/order/${order.id}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <Table>
      <TableHeader className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}>
        <TableRow>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Order ID</TableHead>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Date</TableHead>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Items</TableHead>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Total</TableHead>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Status</TableHead>
          <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((order) => (
          <TableRow 
            key={order.id} 
            className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/30' : 'hover:bg-gray-50'}
          >
            <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>
              ORD-{order.id}
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
              <OrderStatusCell status={order.status} />
            </TableCell>
            <TableCell>
              <Link to={`/order/${order.id}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
