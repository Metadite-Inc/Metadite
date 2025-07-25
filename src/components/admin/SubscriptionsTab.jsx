import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { adminApiService } from '../../lib/api/admin_api';

const SubscriptionsTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isLoaded) {
      fetchPayments();
    }
  }, [isLoaded, currentPage]);

  useEffect(() => {
    // Filter payments based on search term
    const filtered = payments.filter(payment => 
      payment.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [payments, searchTerm]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const response = await adminApiService.getSubscriptionPayments(skip, itemsPerPage);
      
      if (response && response.payments) {
        setPayments(response.payments);
        setTotalPayments(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching subscription payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'partially_paid':
        return 'bg-orange-100 text-orange-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Subscription Payments</h2>
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading subscription payments...
            </div>
          ) : (
            <>
              <table className="min-w-full">
                <thead>
                  <tr className={`text-left text-gray-500 text-sm 
                    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <th className="px-6 py-3">Payment ID</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Plan</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Payment Date</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ? 'No payments found matching your search.' : 'No subscription payments found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className={`border-t border-gray-100 transition-colors 
                        ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                        >
                        <td className="px-6 py-4 font-medium text-sm">
                          {payment.payment_id || payment.id}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {payment.user_email || payment.user || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-metadite-primary/10 text-metadite-primary px-2 py-1 rounded-full text-xs font-medium">
                            {payment.plan || payment.membership_level || 'VIP'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {formatAmount(payment.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {formatDate(payment.created_at || payment.payment_date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="View Details"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Payment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalPayments)} of {totalPayments} payments
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsTab;