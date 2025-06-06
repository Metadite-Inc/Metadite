
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../lib/api/user_api';

export const useChatAccess = () => {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState({
    can_send_messages: false,
    can_watch_videos: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessStatus = async () => {
      if (!user) {
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
