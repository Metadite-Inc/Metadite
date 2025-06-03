
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../services/ChatService';

const useUnreadCount = () => {
  const { user } = useAuth();
  const [unreadData, setUnreadData] = useState({
    total_unread: 0,
    unread_per_room: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadData({ total_unread: 0, unread_per_room: {} });
      setLoading(false);
      return;
    }

    try {
      const data = await getUnreadCount();
      setUnreadData(data);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadData({ total_unread: 0, unread_per_room: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  return { 
    unreadData, 
    loading, 
    refreshUnreadCount: fetchUnreadCount 
  };
};

export default useUnreadCount;
