
import React from 'react';

const OrdersLoading = ({ theme }) => {
  return (
    <div className={`glass-card rounded-xl p-6 sm:p-10 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-metadite-primary"></div>
        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading your orders...</p>
      </div>
    </div>
  );
};

export default OrdersLoading;
