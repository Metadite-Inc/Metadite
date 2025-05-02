
import React from 'react';
import { 
  Package, 
  Truck, 
  Check, 
  X, 
  Wallet,
  Clock
} from 'lucide-react';
import { Badge } from '../../ui/badge';

const OrderStatusCell = ({ status }) => {
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

  return (
    <div className="flex items-center">
      {getStatusIcon(status)}
      <span className="ml-2">{getStatusBadge(status)}</span>
    </div>
  );
};

export default OrderStatusCell;
