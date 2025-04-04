import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { CreditCard, ShoppingBag, Lock, Check, ChevronsUp, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import countries from '../components/countries';

const Checkout = () => {
  const { items, totalAmount, totalItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({
      ...shippingDetails,
      [name]: value
    });
  };

  const handleExpirationDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length > 2) {
      value = value.slice(0, 2) + " / " + value.slice(2, 4); // Add the "/" separator
    }
    setExpirationDate(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      clearCart(); // Clear the cart after successful checkout
      toast.success("Payment successful!", {
        description: "Your order has been placed successfully.",
      });
    }, 2000);
  };

  if (items.length === 0 && !isComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 pt-24 pb-12 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="glass-card rounded-xl p-10 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">
                Add some items to your cart before proceeding to checkout.
              </p>
              <Link 
                to="/models"
                className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
              >
                Browse Models
              </Link>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 pt-24 pb-12 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
          <div className="container mx-auto max-w-md animate-fade-in">
            <div className="glass-card rounded-xl p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. We've sent a confirmation email to {shippingDetails.email} with your order details.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-500 mb-1">Order number</div>
                <div className="font-medium">ORD-{Math.floor(100000 + Math.random() * 900000)}</div>
              </div>
              <div className="space-y-4">
                <Link 
                  to="/dashboard"
                  className="block w-full bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-3 rounded-md hover:opacity-90 transition-opacity"
                >
                  View Order Status
                </Link>
                <Link 
                  to="/"
                  className="block w-full border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Return to Home
                </Link>
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
      
      <div className="flex-1 pt-24 pb-12 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <Link to="/cart" className="text-metadite-primary hover:underline">
              Back to Cart
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
                  <h2 className="text-lg font-semibold">Shipping Information</h2>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={shippingDetails.firstName}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={shippingDetails.lastName}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={shippingDetails.email}
                            onChange={handleInputChange}
                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={shippingDetails.phone}
                            onChange={handleInputChange}
                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingDetails.address}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingDetails.city}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={shippingDetails.zipCode}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={shippingDetails.state}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={shippingDetails.country}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                          required
                        >
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'card' 
                          ? 'border-metadite-primary bg-metadite-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          paymentMethod === 'card' ? 'border-metadite-primary' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'card' && (
                            <div className="w-3 h-3 rounded-full bg-metadite-primary"></div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                          <span className="font-medium">Credit / Debit Card</span>
                        </div>
                      </div>
                      
                      {paymentMethod === 'card' && (
                        <div className="mt-4 pl-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number
                              </label>
                              <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiration Date
                              </label>
                              <input
                                type="text"
                                placeholder="MM / YY"
                                value={expirationDate}
                                onChange={handleExpirationDateChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Security Code (CVV)
                              </label>
                              <input
                                type="text"
                                placeholder="123"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      onClick={() => setPaymentMethod('stripe')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'stripe' 
                          ? 'border-metadite-primary bg-metadite-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          paymentMethod === 'stripe' ? 'border-metadite-primary' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'stripe' && (
                            <div className="w-3 h-3 rounded-full bg-metadite-primary"></div>
                          )}
                        </div>
                        <span className="font-medium">Stripe</span>
                        <span className="ml-2 text-xs text-gray-500">(International payments)</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('crypto')}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'crypto' 
                          ? 'border-metadite-primary bg-metadite-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          paymentMethod === 'crypto' ? 'border-metadite-primary' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'crypto' && (
                            <div className="w-3 h-3 rounded-full bg-metadite-primary"></div>
                          )}
                        </div>
                        <span className="font-medium">Crypto Wallet</span>
                        <span className="ml-2 text-xs text-gray-500">(World wide payments)</span>
                      </div>
                      
                      {paymentMethod === 'crypto' && (
                        <div className="mt-4 pl-8">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Crypto Wallet Address
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your wallet address"
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-500 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Your payment information is secure. We use encryption to protect your data.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-4">
                  <div className="max-h-60 overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">${totalAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">$Free</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-lg">${(totalAmount/* + (totalAmount * 0.08)).toFixed(2)*/)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-4 text-xs text-center text-gray-500">
                    By placing your order, you agree to our <Link to="/terms" className="text-metadite-primary">Terms</Link> and <Link to="/privacy" className="text-metadite-primary">Privacy Policy</Link>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
