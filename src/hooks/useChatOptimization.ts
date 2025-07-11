import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';

// Virtual scrolling utilities
export const useVirtualScrolling = (
  items: any[],
  itemHeight: number = 60,
  containerHeight: number = 400
) => {
  const scrollTop = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop.current / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    scrollTop.current = e.currentTarget.scrollTop;
  }, []);

  return {
    visibleItems,
    totalHeight,
    containerRef,
    handleScroll
  };
};

// Message grouping utilities
export const useMessageGrouping = (messages: any[]) => {
  return useMemo(() => {
    const groups: any[] = [];
    let currentGroup: any[] = [];
    let currentSender: string | null = null;
    let currentDate: string | null = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.created_at).toDateString();
      const sender = message.sender_id || message.sender_uuid;

      // Check if we need a new group
      const needsNewGroup = 
        sender !== currentSender ||
        messageDate !== currentDate ||
        index === 0;

      if (needsNewGroup && currentGroup.length > 0) {
        groups.push({
          id: `group_${groups.length}`,
          messages: currentGroup,
          sender: currentSender,
          date: currentDate
        });
        currentGroup = [];
      }

      currentGroup.push(message);
      currentSender = sender;
      currentDate = messageDate;
    });

    // Add the last group
    if (currentGroup.length > 0) {
      groups.push({
        id: `group_${groups.length}`,
        messages: currentGroup,
        sender: currentSender,
        date: currentDate
      });
    }

    return groups;
  }, [messages]);
};

// Optimized message filtering
export const useMessageFiltering = (
  messages: any[],
  searchTerm: string = '',
  filters: {
    sender?: string;
    dateRange?: { start: Date; end: Date };
    messageType?: string;
  } = {}
) => {
  return useMemo(() => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(message =>
        message.content?.toLowerCase().includes(term) ||
        message.sender_name?.toLowerCase().includes(term)
      );
    }

    // Filter by sender
    if (filters.sender) {
      filtered = filtered.filter(message =>
        message.sender_id === filters.sender || message.sender_uuid === filters.sender
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(message => {
        const messageDate = new Date(message.created_at);
        return messageDate >= start && messageDate <= end;
      });
    }

    // Filter by message type
    if (filters.messageType) {
      filtered = filtered.filter(message =>
        message.message_type === filters.messageType
      );
    }

    return filtered;
  }, [messages, searchTerm, filters]);
};

// Optimized typing indicator
export const useTypingIndicator = (typingUsers: Set<string>) => {
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addTypingUser = useCallback((userId: string) => {
    // Clear existing timeout
    const existingTimeout = typingTimeoutRef.current.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout to remove typing indicator after 3 seconds
    const timeout = setTimeout(() => {
      // This would typically be handled by the store
      console.log(`Typing indicator expired for user ${userId}`);
    }, 3000);

    typingTimeoutRef.current.set(userId, timeout);
  }, []);

  const removeTypingUser = useCallback((userId: string) => {
    const timeout = typingTimeoutRef.current.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      typingTimeoutRef.current.delete(userId);
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      typingTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutRef.current.clear();
    };
  }, []);

  return {
    addTypingUser,
    removeTypingUser
  };
};

// Optimized scroll management
export const useScrollOptimization = () => {
  const scrollPositionRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    scrollPositionRef.current = scrollTop;

    // Debounce scroll events
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    isScrollingRef.current = true;
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, []);

  const scrollToBottom = useCallback((containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  const scrollToMessage = useCallback((
    containerRef: React.RefObject<HTMLDivElement>,
    messageId: string
  ) => {
    if (containerRef.current) {
      const messageElement = containerRef.current.querySelector(`[data-message-id="${messageId}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  return {
    handleScroll,
    scrollToBottom,
    scrollToMessage,
    isScrolling: isScrollingRef.current,
    scrollPosition: scrollPositionRef.current
  };
};

// Optimized message rendering
export const useMessageRendering = (messages: any[]) => {
  const { visibleItems, totalHeight, containerRef, handleScroll } = useVirtualScrolling(messages);
  const { groupedMessages } = useMessageGrouping(messages);

  const renderMessage = useCallback((message: any, index: number) => {
    // Memoize individual message rendering
    return {
      id: message.id,
      content: message.content,
      sender: message.sender_name || message.sender_id,
      timestamp: message.created_at,
      type: message.message_type,
      isOwn: message.sender_id === 'current_user', // This should be replaced with actual user ID
      style: visibleItems[index]?.style
    };
  }, [visibleItems]);

  return {
    visibleItems,
    totalHeight,
    containerRef,
    handleScroll,
    groupedMessages,
    renderMessage
  };
};

// Main chat optimization hook
export const useChatOptimization = () => {
  const {
    messages,
    searchTerm,
    typingUsers
  } = useChatStore();

  const { addTypingUser, removeTypingUser } = useTypingIndicator(typingUsers);
  const { handleScroll, scrollToBottom, scrollToMessage, isScrolling } = useScrollOptimization();
  
  const filteredMessages = useMessageFiltering(messages, searchTerm);
  const { groupedMessages, renderMessage } = useMessageRendering(filteredMessages);

  // Optimize re-renders by memoizing expensive computations
  const messageStats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter(m => !m.read).length;
    const today = messages.filter(m => {
      const messageDate = new Date(m.created_at);
      const today = new Date();
      return messageDate.toDateString() === today.toDateString();
    }).length;

    return { total, unread, today };
  }, [messages]);

  return {
    messages: filteredMessages,
    groupedMessages,
    renderMessage,
    messageStats,
    typingUsers,
    addTypingUser,
    removeTypingUser,
    handleScroll,
    scrollToBottom,
    scrollToMessage,
    isScrolling
  };
}; 