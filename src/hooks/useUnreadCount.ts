import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../services/ChatService';
import NotificationService from '../services/NotificationService';
import throttle from 'lodash.throttle';

interface UnreadCountResponse {
  total_unread: number;
  unread_per_room: Record<string, number>;
  remaining_messages: number;
  received_message: string;
}

const REFRESH_INTERVAL_MS = 2000;
const NOTIFICATION_THROTTLE_MS = 300000; // 5 minutes
const DEBUG = true;

const DEFAULT_UNREAD_DATA: UnreadCountResponse = {
  total_unread: 0,
  unread_per_room: {},
  remaining_messages: -1,
  received_message: ''
};

const DEFAULT_MESSAGE = (count: number) =>
  `You have ${count} new message${count > 1 ? 's' : ''}`;

const useUnreadCount = () => {
  const { user } = useAuth();
  const [unreadData, setUnreadData] = useState<UnreadCountResponse>(DEFAULT_UNREAD_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const notificationService = NotificationService.getInstance();

  const previousUnreadCountRef = useRef(0);
  const previousUnreadPerRoomRef = useRef<Record<string, number>>({});
  const isInitializedRef = useRef(false);
  const isMountedRef = useRef(true);

  const fetchUnreadCount = useCallback(async () => {
    if (!user || !isMountedRef.current) {
      setUnreadData(DEFAULT_UNREAD_DATA);
      setLoading(false);
      return;
    }

    try {
      const data = await getUnreadCount();
      const newTotalUnread = data.total_unread || 0;
      const previousCount = previousUnreadCountRef.current;
      const newUnreadPerRoom = data.unread_per_room || {};
      const previousUnreadPerRoomData = previousUnreadPerRoomRef.current;

      console.log('📊 Unread count update:', {
        newTotalUnread,
        previousCount,
        isInitialized: isInitializedRef.current,
        shouldTrigger: isInitializedRef.current && newTotalUnread > previousCount
      });

      if (DEBUG) {
        console.log('Notification service:', {
          enabled: notificationService.isNotificationEnabled(),
          permission: notificationService.getPermissionStatus(),
          sound: notificationService.isSoundEnabled()
        });

        console.log('Unread comparison:', {
          newTotalUnread,
          previousCount,
          newUnreadPerRoom,
          previousUnreadPerRoomData,
          isInitialized: isInitializedRef.current
        });
      }

      setUnreadData(data);

      // Check if unread count increased (but only after we have a previous count to compare against)
      if (previousCount > 0 && newTotalUnread > previousCount) {
        console.log('🎵 UNREAD COUNT INCREASED - TRIGGERING NOTIFICATION SOUND');
        console.log('Sound enabled:', notificationService.isSoundEnabled());
        console.log('Notification enabled:', notificationService.isNotificationEnabled());
        
        const roomsWithNewMessages: Array<{ roomId: number, newMessages: number }> = [];

        for (const [roomId, unreadCount] of Object.entries(newUnreadPerRoom)) {
          const roomIdNum = Number(roomId);
          const prevCount = previousUnreadPerRoomData[roomId] || 0;
          const currentCount = typeof unreadCount === 'number' ? unreadCount : 0;

          if (!isNaN(roomIdNum) && currentCount > prevCount) {
            roomsWithNewMessages.push({ roomId: roomIdNum, newMessages: currentCount - prevCount });
          }
        }

        const message = data.received_message || DEFAULT_MESSAGE(newTotalUnread - previousCount);

        // Show toast notification for unread count increase
        console.log(`🔔 Notifying unread count increase: ${message}`);
        notificationService.notifyUnreadCountIncrease(newTotalUnread, newUnreadPerRoom, message);
      } else {
        console.log('❌ No notification triggered:', {
          previousCount,
          newTotalUnread,
          condition: previousCount > 0 && newTotalUnread > previousCount
        });
      }

      // Set initialization flag after first successful fetch
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        console.log('✅ Unread hook initialized');
      }

      // Update previous counts AFTER processing
      previousUnreadCountRef.current = newTotalUnread;
      previousUnreadPerRoomRef.current = newUnreadPerRoom;

    } catch (error) {
      console.error('Error fetching unread count:', error);
      if (isMountedRef.current) setUnreadData(DEFAULT_UNREAD_DATA);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [user, notificationService]);

  // Throttled version
  const throttledFetch = useCallback(throttle(fetchUnreadCount, REFRESH_INTERVAL_MS), [fetchUnreadCount]);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    // Removed interval for polling
    return undefined;
  }, [user, refreshTrigger]);

  return {
    totalUnread: unreadData.total_unread,
    unreadPerRoom: unreadData.unread_per_room,
    remainingMessages: unreadData.remaining_messages,
    loading,
    refreshUnreadCount: fetchUnreadCount,
    triggerRefresh
  };
};

export default useUnreadCount;
