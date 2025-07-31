
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowRight, 
  Trash2, 
  Calendar, 
  Clock,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StaffNavbar from '../components/StaffNavbar';
import StaffFooter from '../components/StaffFooter';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { userApi } from '../lib/api/user_api';
import { adminOrdersApiService } from '../lib/api/admin_orders_api';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let orderData;
        if (user?.role === 'admin') {
          orderData = await adminOrdersApiService.getOrderDetails(parseInt(orderId));
        } else {
          orderData = await userApi.getOrderById(orderId);
        }
        console.log('Fetched order data:', orderData);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, user?.role]);

  const handleTrackOrder = () => {
    toast.info('Tracking information sent to your email');
    // In a real app, this would open tracking information or redirect to carrier's website
  };

  const handleDeleteOrder = async () => {
    try {
      let success = false;
      if (user?.role === 'admin') {
        success = await adminOrdersApiService.deleteOrder(parseInt(orderId));
      } else {
        success = await userApi.deleteOrder(orderId);
      }
      
      if (success) {
        setDeleteDialogOpen(false);
        navigate(user?.role === 'admin' ? '/admin-orders' : '/dashboard');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
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
      <div className="min-h-screen flex flex-col">
        {user?.role === 'admin' ? <StaffNavbar /> : <Navbar />}
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-metadite-primary"></div>
              <div className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading order details...</div>
            </div>
          </div>
        </div>
        {user?.role === 'admin' ? <StaffFooter /> : <Footer />}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        {user?.role === 'admin' ? <StaffNavbar /> : <Navbar />}
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card rounded-xl p-10 text-center">
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                  Order Not Found
                </h2>
                <div className={`max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  We couldn't find the order you're looking for. It may have been deleted or the ID is incorrect.
                </div>
                <Button 
                  className="mt-6" 
                  onClick={() => navigate(user?.role === 'admin' ? '/admin-orders' : '/dashboard')}
                >
                  Go Back to {user?.role === 'admin' ? 'Orders' : 'Dashboard'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {user?.role === 'admin' ? <StaffFooter /> : <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {user?.role === 'admin' ? <StaffNavbar /> : <Navbar />}
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-4xl">
          {/* Header with Back Button and Order Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button 
              onClick={() => navigate(user?.role === 'admin' ? '/admin-orders' : '/dashboard')}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Back to Orders</span>
            </button>
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
              <button 
                onClick={() => setDeleteDialogOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete Order</span>
              </button>
            </div>
          </div>
          
          {/* Order Overview Card */}
          <Card className={`mb-6 ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700 text-white' : ''}`}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Order #{order.order_number || order.orderNumber || 'Unknown'}
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" title="Order ID" />
                  </CardTitle>
                  <div className={`text-sm text-muted-foreground mt-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                    <div className="flex flex-wrap items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" /> 
                      <span className="mr-2">Order Date: {order.date || 'N/A'}</span>
                      {order.time && (
                        <>
                          <Clock className="h-3.5 w-3.5 mr-1" /> 
                          <span>Order Time: {order.time}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {order.status === 'shipped' && (
                  <Button onClick={handleTrackOrder} className="gap-1 mt-2 sm:mt-0">
                    <Package className="h-4 w-4" />
                    Track Order
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Shipment Details */}
              {order.shippingAddress && (
                <div className="mb-6">
                  <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Shipment Details</h3>
                  <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    
                    {order.status === 'shipped' && (order.trackingNumber || order.tracking_number) && (
                      <div className="mt-2 text-sm">
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tracking Number:</span> {order.trackingNumber || order.tracking_number}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <>
                  <h3 className={`font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Order Items</h3>
                  <div className={`rounded-md overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} mb-6`}>
                    {order.items.map((item, index) => (
                      <div key={item.id || index}>
                        <div className="p-4 flex gap-3">
                          {item.image && (
                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name || 'Item'} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-grow min-w-0"> {/* Prevent text overflow */}
                            <h4 className="font-medium truncate">{item.name || 'Unknown Item'}</h4>
                            {item.description && (
                              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</div>
                            )}
                          </div>
                          <div className="flex flex-col items-end justify-between shrink-0">
                            <span className="font-medium">{formatCurrency(item.price || 0)}</span>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Qty: {item.quantity || 1}
                            </span>
                          </div>
                        </div>
                        {index < order.items.length - 1 && (
                          <Separator className={theme === 'dark' ? 'bg-gray-600' : ''} />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* Payment Details */}
              <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Payment Details</h3>
              <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Order Date:</span>
                    <span>{order.date || 'N/A'}</span>
                  </div>
                  
                  {order.paymentMethod && (
                    <div className="flex justify-between items-center">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Payment Method:</span>
                      <span className="text-right">{order.paymentMethod}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Total Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(order.total || 0)}
                    </span>
                  </div>
                  
                  {order.tracking_number && (
                    <div className="flex justify-between items-center">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Tracking Number:</span>
                      <span>{order.tracking_number}</span>
                    </div>
                  )}
                  
                  {order.notes && (
                    <div className="flex justify-between items-center">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Notes:</span>
                      <span>{order.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setDeleteDialogOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Order
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete order {order.order_number || order.orderNumber || 'Unknown'}? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleDeleteOrder}
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'admin' ? <StaffFooter /> : <Footer />}
    </div>
  );
};

export default OrderDetail;