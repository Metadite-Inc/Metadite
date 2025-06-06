import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../services/ChatService';
import NotificationService from '../services/NotificationService';

const useUnreadCount = () => {
  const { user } = useAuth();
  const [unreadData, setUnreadData] = useState({
    total_unread: 0,
    unread_per_room: {}
  });
  const [loading, setLoading] = useState(true);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const notificationService = NotificationService.getInstance();

  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadData({ total_unread: 0, unread_per_room: {} });
      setLoading(false);
      return;
    }

    try {
      const data = await getUnreadCount();
      
      // Check if unread count increased
      const newTotalUnread = data.total_unread || 0;
      const previousCount = previousUnreadCount;
      
      setUnreadData(data);
      
      // Trigger notification if unread count increased
      if (newTotalUnread > previousCount && previousCount > 0) {
        const newMessages = newTotalUnread - previousCount;
        notificationService.notifyUnreadMessages(newMessages);
      }
      
      setPreviousUnreadCount(newTotalUnread);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadData({ total_unread: 0, unread_per_room: {} });
    } finally {
      setLoading(false);
    }
  };

  // Function to trigger a refresh from external components
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Refresh unread count every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000);
    
    return () => clearInterval(interval);
  }, [user, refreshTrigger]);

  return { 
    unreadData, 
    loading, 
    refreshUnreadCount: fetchUnreadCount,
    triggerRefresh
  };
};

export default useUnreadCount;
