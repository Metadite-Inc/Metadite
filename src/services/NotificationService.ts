import { toast } from 'sonner';

class NotificationService {
  private static instance: NotificationService;
  private notificationSound: HTMLAudioElement | null = null;
  private isEnabled: boolean = false;
  private soundEnabled: boolean = true;
  private audioContext: AudioContext | null = null;

  private constructor() {
    this.initializeSound();
    this.checkPermissionStatus();
    this.loadSoundPreference();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeSound() {
    try {
      // Create a simple notification sound using Web Audio API
      this.createNotificationSound();
    } catch (error) {
      console.warn('Could not initialize notification sound:', error);
    }
  }

  private createNotificationSound() {
    // Create a simple beep sound using Web Audio API
    const createBeep = () => {
      try {
        // Use the stored audio context or create a new one
        const audioContext = this.audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
        this.audioContext = audioContext;
        
        // Resume audio context if it's suspended (required by modern browsers)
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    };

    this.notificationSound = { play: createBeep } as any;
  }

  private checkPermissionStatus() {
    if ('Notification' in window) {
      this.isEnabled = Notification.permission === 'granted';
    }
  }

  public loadSoundPreference() {
    try {
      const soundEnabled = localStorage.getItem('notificationSoundEnabled');
      this.soundEnabled = soundEnabled === null ? true : soundEnabled === 'true';
    } catch (error) {
      console.warn('Could not load sound preference:', error);
      this.soundEnabled = true;
    }
  }

  public initializeAudioContext() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      // Resume audio context if it's suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } catch (error) {
      console.warn('Could not initialize audio context:', error);
    }
  }

  public checkNotificationDisplay() {
    // This method can be used to test notification display
    // It's called during initialization to ensure notifications work
    if (this.isEnabled) {
      console.log('Notification system is ready');
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.isEnabled = permission === 'granted';
      
      if (permission === 'granted') {
        toast.success('Notification permissions granted!');
        // Send a test notification
        this.showNotification('Notifications enabled!', {
          body: 'You will now receive important updates.',
          icon: '/logo.png'
        });
        return true;
      } else if (permission === 'denied') {
        toast.error('Notification permissions denied. You can enable them in your browser settings.');
        return false;
      }
    } catch (error) {
      toast.error('Failed to request notification permissions');
      console.error('Notification permission error:', error);
    }
    
    return false;
  }

  public showNotification(title: string, options: NotificationOptions = {}) {
    if (!this.isEnabled) {
      console.log('Notifications not enabled');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  public playNotificationSound() {
    
    try {
      if (this.soundEnabled && this.notificationSound) {
        // Ensure audio context is initialized and resumed
        this.initializeAudioContext();
        this.notificationSound.play();
      } else {
        console.log('❌ Sound not played - disabled or no sound object');
      }
    } catch (error) {
      console.error('❌ Could not play notification sound:', error);
    }
  }

  public notifyNewMessage(senderName: string, message: string, chatRoomId?: number) {
    console.log('📢 notifyNewMessage called:', { senderName, message, chatRoomId });
    
    if (!this.isEnabled) {
      console.log('❌ Notifications not enabled, returning');
      return;
    }

    // Play sound
    this.playNotificationSound();

    // Show notification
    this.showNotification(`New message from ${senderName}`, {
      body: message.length > 50 ? message.substring(0, 50) + '...' : message,
      icon: '/logo.png',
      tag: `chat-${chatRoomId}`, // Prevents duplicate notifications for same chat
      requireInteraction: false
    });
  }

  public notifyUnreadMessages(count: number) {
    if (!this.isEnabled || count <= 0) return;

    // Play sound for unread messages
    this.playNotificationSound();

    // Show notification
    this.showNotification(`${count} unread message${count > 1 ? 's' : ''}`, {
      body: 'You have new messages waiting.',
      icon: '/logo.png',
      tag: 'unread-messages'
    });
  }

  public notifyUnreadCountIncrease(totalUnread: number, unreadPerRoom: Record<string, number>, receivedMessage?: string) {
    
    this.playNotificationSound();
    
    // Determine the message to show
    let message = receivedMessage;
    if (!message) {
      if (totalUnread === 1) {
        message = 'You have 1 new message';
      } else {
        message = `You have ${totalUnread} new messages`;
      }
    }

    // Show toast notification
    toast.info(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500'
      }
    });
  }

  public getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  public isNotificationEnabled(): boolean {
    return this.isEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('notificationSoundEnabled', enabled.toString());
    } catch (error) {
      console.warn('Could not save sound preference:', error);
    }
  }

  public testNotificationSound() {
    if (this.soundEnabled) {
      this.playNotificationSound();
      return true;
    }
    return false;
  }

  public testUnreadCountNotification() {
    console.log('🧪 Testing unread count notification...');
    this.notifyUnreadCountIncrease(5, { "1": 3, "2": 2 }, "You have 5 new messages!");
  }
}

export default NotificationService;
