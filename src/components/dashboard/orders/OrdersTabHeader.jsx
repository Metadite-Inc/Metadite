
import React from 'react';
import { 
  Package, 
  Truck, 
  Check, 
  X, 
  Wallet,
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';

const OrdersTabHeader = ({ theme, activeFilter, setActiveFilter }) => {
  return (
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
  );
};

export default OrdersTabHeader;
