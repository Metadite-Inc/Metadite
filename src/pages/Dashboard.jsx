import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Calendar, ShoppingBag, CreditCard, 
  Heart, Video, Bell, Settings, LogOut
} from 'lucide-react';

// Mock data for recent orders
const recentOrders = [
  {
    id: 'ORD-12345',
    date: '2023-08-15',
    items: 2,
    total: 289.98,
    status: 'Delivered'
  },
  {
    id: 'ORD-12346',
    date: '2023-07-29',
    items: 1,
    total: 159.99,
    status: 'Processing'
  }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-20 pb-12 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-metadite-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h1>
                  <p className="opacity-80">Manage your account and purchases</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {user?.vip ? (
                  <span className="bg-white/20 px-3 py-1 rounded-full font-medium animate-pulse-soft">
                    VIP Member
                  </span>
                ) : (
                  <Link to="/upgrade" className="bg-white text-metadite-primary px-3 py-1 rounded-full font-medium hover:bg-opacity-90 transition-opacity">
                    Upgrade to VIP
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800">Dashboard Menu</h3>
                </div>
                
                <ul className="p-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'overview' 
                          ? 'bg-metadite-primary/10 text-metadite-primary' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <span>Account Overview</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'orders' 
                          ? 'bg-metadite-primary/10 text-metadite-primary' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ShoppingBag className="h-5 w-5 mr-3" />
                      <span>Orders</span>
                    </button>
                  </li>
                  {user?.vip && (
                    <li>
                      <button 
                        onClick={() => setActiveTab('vip')}
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                          activeTab === 'vip' 
                            ? 'bg-metadite-primary/10 text-metadite-primary' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Video className="h-5 w-5 mr-3" />
                        <span>VIP Content</span>
                      </button>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={() => setActiveTab('favorites')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'favorites' 
                          ? 'bg-metadite-primary/10 text-metadite-primary' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      <span>Favorites</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('payment')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'payment' 
                          ? 'bg-metadite-primary/10 text-metadite-primary' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span>Payment Methods</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('notifications')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'notifications' 
                          ? 'bg-metadite-primary/10 text-metadite-primary' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      <span>Notifications</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'settings' 
                          ? 'bg-metadite-primary/10 text-metadite-primary' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={logout}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {/* Account Overview */}
              {activeTab === 'overview' && (
                <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="glass-card rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <User className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{user?.name || 'John Doe'}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium">{user?.email || 'john.doe@example.com'}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium">August 2025</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Subscription</p>
                          <p className="font-medium">{user?.vip ? 'VIP Member' : 'Basic'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Recent Orders</h2>
                      <Link to="/orders" className="text-sm text-metadite-primary hover:underline">View All</Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="text-left text-gray-500 text-sm">
                            <th className="px-4 py-2">Order ID</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Items</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-t border-gray-100">
                              <td className="px-4 py-3 font-medium">{order.id}</td>
                              <td className="px-4 py-3 text-gray-600">{order.date}</td>
                              <td className="px-4 py-3 text-gray-600">{order.items}</td>
                              <td className="px-4 py-3 font-medium">${order.total.toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'Delivered' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <Link to={`/order/${order.id}`} className="text-sm text-metadite-primary hover:underline">
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {recentOrders.length === 0 && (
                      <div className="text-center py-10">
                        <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                        <Link 
                          to="/models" 
                          className="mt-2 inline-block text-metadite-primary hover:underline"
                        >
                          Start shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Other tabs would be implemented here */}
              {activeTab !== 'overview' && (
                <div className="glass-card rounded-xl p-10 text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    {activeTab === 'orders' && 'Your Orders'}
                    {activeTab === 'vip' && 'VIP Content'}
                    {activeTab === 'favorites' && 'Your Favorites'}
                    {activeTab === 'payment' && 'Payment Methods'}
                    {activeTab === 'notifications' && 'Notifications'}
                    {activeTab === 'settings' && 'Account Settings'}
                  </h2>
                  <p className="text-gray-500 mb-4">This section is under development.</p>
                  {activeTab === 'vip' && (
                    <Link 
                      to="/vip-content" 
                      className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                    >
                      Go to VIP Content
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
