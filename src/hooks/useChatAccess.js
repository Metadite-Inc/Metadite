
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../lib/api/user_api';

export const useChatAccess = () => {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState({
    can_send_messages: false,
    can_watch_videos: false
  });
  const [loading, setLoading] = useState(false); // Start with false since we don't need to load if no user

  useEffect(() => {
    const fetchAccessStatus = async () => {
      // Check if user exists and has required properties
      if (!user || !user.id || !user.email) {
        setAccessStatus({
          can_send_messages: false,
          can_watch_videos: false
        });
        setLoading(false);
        return;
      }

      // Check if we have a valid token
      const token = localStorage.getItem('access_token');
      if (!token) {
        setAccessStatus({
          can_send_messages: false,
          can_watch_videos: false
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const status = await userApi.getChatAccessStatus();
        setAccessStatus(status);
      } catch (error) {
        console.error('Error fetching chat access status:', error);
        // Don't throw the error, just set default restricted access
        // This prevents the error from bubbling up and causing logout
        setAccessStatus({
          can_send_messages: false,
          can_watch_videos: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccessStatus();
  }, [user]);

  return { 
    accessStatus, 
    loading, 
    canSendMessages: accessStatus.can_send_messages,
    canWatchVideos: accessStatus.can_watch_videos
  };
};
