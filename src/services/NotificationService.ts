
import { toast } from 'sonner';

class NotificationService {
  private static instance: NotificationService;
  private notificationSound: HTMLAudioElement | null = null;
  private isEnabled: boolean = false;

  private constructor() {
    this.initializeSound();
    this.checkPermissionStatus();
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
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createBeep = () => {
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
    };

    this.notificationSound = { play: createBeep } as any;
  }

  private checkPermissionStatus() {
    if ('Notification' in window) {
      this.isEnabled = Notification.permission === 'granted';
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
      if (this.notificationSound) {
        this.notificationSound.play();
      }
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  public notifyNewMessage(senderName: string, message: string, chatRoomId?: number) {
    if (!this.isEnabled) return;

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

  public getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  public isNotificationEnabled(): boolean {
    return this.isEnabled;
  }
}

export default NotificationService;
