
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowRight, 
  Trash2, 
  Calendar as CalendarDays,
  Clock,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
        // In a real app, this would fetch from an API based on the orderId
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock order data
        const mockOrder = {
          id: orderId,
          orderNumber: `ORD-${orderId}`,
          date: '2025-04-28',
          time: '14:32:15',
          paymentTime: '14:35:22',
          paymentMethod: 'Credit Card (Visa ending in 4242)',
          status: 'shipped',
          trackingNumber: 'TRK123456789',
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
          items: [
            {
              id: 1,
              name: 'Emma Watson Model',
              description: 'Premium quality collectible model with authentic details.',
              price: 29.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=300&auto=format&fit=crop'
            },
            {
              id: 2,
              name: 'Premium Access',
              description: 'One month subscription to premium model content.',
              price: 19.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=300&auto=format&fit=crop'
            }
          ],
          productsAmount: 49.98,
          shippingFee: 0,
          shippingDiscount: 0,
          paymentAmount: 49.98
        };
        
        setOrder(mockOrder);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  const handleTrackOrder = () => {
    toast.info('Tracking information sent to your email');
    // In a real app, this would open tracking information or redirect to carrier's website
  };

  const handleDeleteOrder = () => {
    // In a real app, this would send a delete request to the API
    toast.success('Order successfully deleted');
    setDeleteDialogOpen(false);
    navigate('/dashboard');
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
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-metadite-primary"></div>
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading order details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
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
                <p className={`max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  We couldn't find the order you're looking for. It may have been deleted or the ID is incorrect.
                </p>
                <Button 
                  className="mt-6" 
                  onClick={() => navigate('/dashboard')}
                >
                  Go Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-4xl">
          {/* Header with Back Button and Order Status */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Back to Orders</span>
            </button>
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-1">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Order</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete order {order.orderNumber}. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteOrder}>Delete Order</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Order Overview Card */}
          <Card className={`mb-6 ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700 text-white' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Order #{order.orderNumber}
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" title="Order ID" />
                  </CardTitle>
                  <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : ''}`}>
                    <div className="flex items-center mt-2 gap-1">
                      <CalendarDays className="h-3.5 w-3.5 mr-1" /> 
                      Order Date: {order.date}
                      <span className="mx-2">•</span>
                      <Clock className="h-3.5 w-3.5 mr-1" /> 
                      Order Time: {order.time}
                    </div>
                  </CardDescription>
                </div>
                
                {order.status === 'shipped' && (
                  <Button onClick={handleTrackOrder} className="gap-1">
                    <Package className="h-4 w-4" />
                    Track Order
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Shipment Details */}
              <div className="mb-6">
                <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Shipment Details</h3>
                <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  
                  {order.status === 'shipped' && order.trackingNumber && (
                    <div className="mt-2 text-sm">
                      <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tracking Number:</span> {order.trackingNumber}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Order Items */}
              <h3 className={`font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Order Items</h3>
              <div className={`rounded-md overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} mb-6`}>
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="p-4 flex gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span className="font-medium">{formatCurrency(item.price)}</span>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    {index < order.items.length - 1 && (
                      <Separator className={theme === 'dark' ? 'bg-gray-600' : ''} />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Payment Details */}
              <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Payment Details</h3>
              <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Payment Time:</div>
                  <div className="text-right">{order.date} {order.paymentTime}</div>
                  
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Payment Method:</div>
                  <div className="text-right">{order.paymentMethod}</div>
                  
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Products Amount:</div>
                  <div className="text-right">{formatCurrency(order.productsAmount)}</div>
                  
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Shipping Fee:</div>
                  <div className="text-right">{order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}</div>
                  
                  {order.shippingDiscount > 0 && (
                    <>
                      <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Shipping Discount:</div>
                      <div className="text-right text-green-600">-{formatCurrency(order.shippingDiscount)}</div>
                    </>
                  )}
                  
                  <div className="font-medium pt-2 border-t border-dashed border-gray-300 dark:border-gray-600">Total Amount:</div>
                  <div className="text-right font-medium pt-2 border-t border-dashed border-gray-300 dark:border-gray-600">
                    {formatCurrency(order.paymentAmount)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
