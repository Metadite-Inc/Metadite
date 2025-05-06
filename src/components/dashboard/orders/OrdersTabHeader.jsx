
import React from 'react';
import { 
  Package, 
  Truck, 
  Check, 
  X, 
  Wallet,
  ArrowDown,
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

const OrdersTabHeader = ({ theme, activeFilter, setActiveFilter }) => {
  const isMobile = useIsMobile();
  
  // Map for getting display name and icon for a filter value
  const filterOptions = {
    all: { label: "All", icon: null },
    unpaid: { label: "Unpaid", icon: <Wallet className="h-3.5 w-3.5 mr-1" /> },
    to_be_shipped: { label: "To Be Shipped", icon: <Package className="h-3.5 w-3.5 mr-1" /> },
    shipped: { label: "Shipped", icon: <Truck className="h-3.5 w-3.5 mr-1" /> },
    completed: { label: "Completed", icon: <Check className="h-3.5 w-3.5 mr-1" /> },
    cancelled: { label: "Cancelled", icon: <X className="h-3.5 w-3.5 mr-1" /> },
  };
  
  // Get the current filter's display data
  const currentFilter = filterOptions[activeFilter];
  
  // Mobile dropdown version
  const mobileFilter = (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full justify-between ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
        >
          <span className="flex items-center">
            {currentFilter?.icon}
            {currentFilter?.label} Orders
          </span>
          <ArrowDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`w-[200px] p-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
      >
        <div className="py-1">
          {Object.entries(filterOptions).map(([value, { label, icon }]) => (
            <button
              key={value}
              className={`w-full text-left px-4 py-2 flex items-center text-sm ${
                activeFilter === value 
                  ? theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter(value)}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
  
  // Desktop toggle group version
  const desktopFilter = (
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
  );

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
        Your Orders
      </h2>
      
      <div className="w-full md:w-auto">
        {isMobile ? mobileFilter : desktopFilter}
      </div>
    </div>
  );
};

export default OrdersTabHeader;
