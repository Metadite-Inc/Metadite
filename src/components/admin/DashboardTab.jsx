import React, { useEffect, useState } from 'react';
import { Users, CreditCard, ShoppingBag, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApiService } from '../../lib/api/admin_api';

const ICON_MAP = {
  subscription: CreditCard,
  moderator: Users,
  flagged: AlertTriangle,
  order: ShoppingBag,
  user_registration: Users,
  payment: CreditCard,
  model_purchase: ShoppingBag,
  moderator_created: Users,
  message_flagged: AlertTriangle,
};

const DashboardTab = ({ isLoaded }) => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        console.log('Fetching dashboard stats...');
        const data = await adminApiService.getDashboardStats();
        console.log('Dashboard stats received:', data);
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    if (isLoaded) fetchStats();
  }, [isLoaded]);

  useEffect(() => {
    const fetchActivity = async () => {
      setActivityLoading(true);
      try {
        console.log('Fetching recent activity...');
        const skip = (currentPage - 1) * itemsPerPage;
        const response = await adminApiService.getRecentActivity(skip, itemsPerPage);
        console.log('Recent activity received:', response);
        
        if (response && response.activities) {
          setRecentActivity(response.activities);
          setTotalActivities(response.total || 0);
          setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
        } else {
          // Handle legacy response format (array instead of object)
          setRecentActivity(response || []);
          setTotalActivities(response?.length || 0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setActivityLoading(false);
      }
    };
    if (isLoaded) fetchActivity();
  }, [isLoaded, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold">
                {statsLoading ? <span className="text-gray-400">Loading...</span> : stats?.total_users ?? '--'}
              </h3>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-500">
            {statsLoading ? '' : stats?.users_change ? `${stats.users_change} from last month` : ''}
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Subscriptions</p>
              <h3 className="text-2xl font-bold">
                {statsLoading ? <span className="text-gray-400">Loading...</span> : stats?.active_subscriptions ?? '--'}
              </h3>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-500">
            {statsLoading ? '' : stats?.subscriptions_change ? `${stats.subscriptions_change} from last month` : ''}
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
              <ShoppingBag className="h-6 w-6 text-purple-500 dark:text-purple-200" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Monthly Revenue</p>
              <h3 className="text-2xl font-bold">
                {statsLoading ? <span className="text-gray-400">Loading...</span> : stats?.monthly_revenue ? `$${stats.monthly_revenue.toLocaleString()}` : '--'}
              </h3>
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-500 dark:text-purple-200">
            {statsLoading ? '' : stats?.revenue_change ? `${stats.revenue_change} from last month` : ''}
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <button className="text-sm text-metadite-primary hover:text-metadite-secondary transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {activityLoading ? (
            <div className="text-gray-400">Loading recent activity...</div>
          ) : recentActivity.length === 0 ? (
            <div className="text-gray-400">No recent activity found.</div>
          ) : (
            recentActivity.map((activity, idx) => {
              const Icon = ICON_MAP[activity.type] || Users;
              return (
                <div className="flex items-start" key={idx}>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon className="h-5 w-5 text-metadite-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.title || activity.type.replace(/_/g, ' ')} </p>
                    <p className="text-sm text-gray-500">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time ? new Date(activity.time).toLocaleString() : ''}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalActivities)} of {totalActivities} activities
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;