import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { 
  Download, 
  Mail, 
  Users, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { adminNewsletterApi } from '../../lib/api/admin_newsletter_api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const NewsletterTab = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching newsletter subscriptions...');
      const data = await adminNewsletterApi.getAllSubscriptions();
      console.log('Fetched subscriptions:', data);
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching newsletter subscriptions:', error);
      toast.error('Failed to load newsletter subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async (email) => {
    try {
      await adminNewsletterApi.unsubscribeEmail(email);
      await fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error unsubscribing email:', error);
    }
  };

  const handleResubscribe = async (email) => {
    try {
      await adminNewsletterApi.resubscribeEmail(email);
      await fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error resubscribing email:', error);
    }
  };

  const handleExport = async () => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required to export newsletter subscriptions.');
      return;
    }
    
    try {
      setIsExporting(true);
      await adminNewsletterApi.exportSubscriptions();
    } catch (error) {
      console.error('Error exporting subscriptions:', error);
      toast.error('Failed to export newsletter subscriptions. Please make sure you are logged in as an admin.');
    } finally {
      setIsExporting(false);
    }
  };

  const confirmUnsubscribe = (email) => {
    console.log('Unsubscribe button clicked for email:', email);
    setSelectedEmail(email);
    setDeleteDialogOpen(true);
    console.log('Dialog state set to open');
  };

  const confirmUnsubscribeAction = async () => {
    await handleUnsubscribe(selectedEmail);
    setDeleteDialogOpen(false);
    setSelectedEmail('');
  };

  // Filter and search subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && subscription.is_active) ||
      (filterStatus === 'inactive' && !subscription.is_active);
    
    return matchesSearch && matchesFilter;
  });

  const activeCount = subscriptions.filter(sub => sub.is_active).length;
  const inactiveCount = subscriptions.filter(sub => !sub.is_active).length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="py-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-metadite-primary" />
          <span className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading newsletter subscriptions...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Newsletter Management</h2>
          <p className="text-gray-300">
            Manage newsletter subscriptions and export subscriber data
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            disabled={isExporting || !user || user.role !== 'admin'}
            className={`${
              user && user.role === 'admin' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
            title={!user || user.role !== 'admin' ? 'Admin privileges required' : 'Export newsletter subscriptions'}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button
            onClick={fetchSubscriptions}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <Users className="h-8 w-8 text-metadite-primary mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Subscribers</p>
              <p className="text-2xl font-bold text-white">{subscriptions.length}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Inactive</p>
              <p className="text-2xl font-bold text-white">{inactiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-3 py-2 rounded-md border ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Subscribers</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <TableRow>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Email</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Status</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Subscribed</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow 
                key={subscription.id}
                className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/30' : 'hover:bg-gray-50'}
              >
                <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                  {subscription.email}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={subscription.is_active ? "default" : "secondary"}
                    className={subscription.is_active ? "bg-green-500" : "bg-gray-500"}
                  >
                    {subscription.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className={theme === 'dark' ? 'text-gray-300' : ''}>
                  {formatDate(subscription.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {subscription.is_active ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmUnsubscribe(subscription.email)}
                        className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Unsubscribe
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResubscribe(subscription.email)}
                        className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resubscribe
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-8">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'No subscriptions match your filters' 
              : 'No newsletter subscriptions found'
            }
          </p>
        </div>
      )}

                           {/* Unsubscribe Confirmation Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => {
                console.log('Backdrop clicked');
                setDeleteDialogOpen(false);
              }}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Unsubscribe
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to unsubscribe <strong>{selectedEmail}</strong> from the newsletter? 
                  They can resubscribe themselves later if needed.
                </p>
              </div>
              
                             <div className="flex justify-end space-x-3">
                 <button 
                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   onClick={() => {
                     console.log('Cancel button clicked');
                     setDeleteDialogOpen(false);
                   }}
                 >
                   Cancel
                 </button>
                 <button 
                   className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                   onClick={() => {
                     console.log('Confirm unsubscribe button clicked');
                     confirmUnsubscribeAction();
                   }}
                 >
                   Unsubscribe
                 </button>
               </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default NewsletterTab; 