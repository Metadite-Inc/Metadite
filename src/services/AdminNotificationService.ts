import { authApi } from '../lib/api/auth_api';
import NotificationService from './NotificationService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface OrderNotification {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  status: string;
  date: string;
}

interface PaymentNotification {
  payment_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  transaction_id: string;
  invoice_id: string;
  order_id: string;
  date: string;
}

interface AdminNotificationMessage {
  type: 'new_order' | 'new_payment';
  order?: OrderNotification;
  payment?: PaymentNotification;
  timestamp: string;
}

class AdminNotificationService {
  private static instance: AdminNotificationService;
  private websocket: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private notificationService: NotificationService;

  private constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): AdminNotificationService {
    if (!AdminNotificationService.instance) {
      AdminNotificationService.instance = new AdminNotificationService();
    }
    return AdminNotificationService.instance;
  }

  public async connect(): Promise<void> {
    try {
      const user = await authApi.getCurrentUser();
      
      if (user.role !== 'admin') {
        console.log('User is not admin, skipping notification connection');
        return;
      }

      const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/orders/admin/notifications/${user.id}`;
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('🔔 Admin notification WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.websocket.onmessage = (event) => {
        try {
          const data: AdminNotificationMessage = JSON.parse(event.data);
          this.handleNotification(data);
        } catch (error) {
          console.error('Error parsing notification message:', error);
        }
      };

      this.websocket.onclose = (event) => {
        console.log('🔔 Admin notification WebSocket closed:', event.code, event.reason);
        this.isConnected = false;
        
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.websocket.onerror = (error) => {
        console.error('🔔 Admin notification WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect to admin notifications:', error);
    }
  }

  private handleNotification(data: AdminNotificationMessage): void {
    console.log('🔔 Received admin notification:', data);

    if (data.type === 'new_order' && data.order) {
      const { order } = data;
      
      // Show notification using NotificationService
      this.notificationService.notifyNewOrder(
        order.order_number,
        order.customer_name,
        order.total
      );
    } else if (data.type === 'new_payment' && data.payment) {
      const { payment } = data;
      
      // Show notification using NotificationService
      this.notificationService.notifyNewPayment(
        payment.payment_id,
        payment.customer_name,
        payment.amount,
        payment.currency
      );
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s

    console.log(`🔔 Scheduling admin notification reconnection in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.websocket) {
      this.websocket.close(1000, 'Disconnecting');
      this.websocket = null;
    }

    this.isConnected = false;
    console.log('🔔 Admin notification WebSocket disconnected');
  }

  public isNotificationConnected(): boolean {
    return this.isConnected;
  }

  public sendPing(): void {
    if (this.websocket && this.isConnected) {
      this.websocket.send('ping');
    }
  }
}

export default AdminNotificationService;