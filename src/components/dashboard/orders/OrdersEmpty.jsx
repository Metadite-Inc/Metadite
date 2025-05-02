
import React from 'react';
import { Package } from 'lucide-react';

const OrdersEmpty = ({ theme }) => {
  return (
    <div className={`glass-card rounded-xl p-6 sm:p-10 text-center ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="flex flex-col items-center">
        <div className="h-16 sm:h-20 w-16 sm:w-20 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Package className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
        </div>
        <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
          No Orders Yet
        </h2>
        <p className={`max-w-md mx-auto text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          You haven't placed any orders yet. Browse our models and make a purchase to see your orders here.
        </p>
      </div>
    </div>
  );
};

export default OrdersEmpty;
