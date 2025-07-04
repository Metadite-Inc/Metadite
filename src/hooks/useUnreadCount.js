
import { useState, useEffect, useRef } from 'react';
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const notificationService = NotificationService.getInstance();
  
  // Use ref to persist previous count between renders
  const previousUnreadCountRef = useRef(0);

  const fetchUnreadCount = async () => {
    console.log('🔄 useUnreadCount.js: fetchUnreadCount called');
    
    if (!user) {
      setUnreadData({ total_unread: 0, unread_per_room: {} });
      setLoading(false);
      return;
    }

    try {
      const data = await getUnreadCount();
      
      // Check if unread count increased
      const newTotalUnread = data.total_unread || 0;
      const previousCount = previousUnreadCountRef.current;
      
      setUnreadData(data);
      
      // Trigger notification if unread count increased
      if (newTotalUnread > previousCount && previousCount > 0) {
        console.log('🎵 UNREAD COUNT INCREASED - TRIGGERING NOTIFICATION SOUND');
        console.log('Sound enabled:', notificationService.isSoundEnabled());
        console.log('Notification enabled:', notificationService.isNotificationEnabled());
        
        const newMessages = newTotalUnread - previousCount;
        const message = data.received_message || `You have ${newMessages} new message${newMessages > 1 ? 's' : ''}`;
        
        console.log(`🔔 Notifying unread count increase: ${message}`);
        notificationService.notifyUnreadCountIncrease(newTotalUnread, data.unread_per_room || {}, message);
      } else {
        console.log('❌ No notification triggered:', {
          previousCount,
          newTotalUnread,
          condition: newTotalUnread > previousCount && previousCount > 0
        });
      }
      
      // Update the ref with the new count for next comparison
      previousUnreadCountRef.current = newTotalUnread;
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
    
    // Refresh unread count every 2 seconds, to provide real time notifications
    const interval = setInterval(fetchUnreadCount, 2000);
    
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
