import { toast } from "sonner";
import { BaseApiService } from "./base_api";

export interface AdminOrder {
  id: number;
  order_number: string;
  user_id: number;
  user?: {
    id: number;
    full_name: string;
    email: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  shipping_address?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  payment_method?: string;
  tracking_number?: string;
  notes?: string;
  date: string;
  updated_at: string;
}

export interface OrderUpdateRequest {
  status?: string;
  tracking_number?: string;
  notes?: string;
}

class AdminOrdersApiService extends BaseApiService {
  // Get all orders with pagination
  async getAllOrders(skip = 0, limit = 100, search?: string, status?: string): Promise<AdminOrder[]> {
    try {
      await this.validateRole('admin');
      const token = this.validateAuth();
      
      let url = `/api/orders/admin/all?skip=${skip}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (status && status !== 'all') {
        url += `&status=${encodeURIComponent(status)}`;
      }
      
      const response = await this.request<AdminOrder[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      return [];
    }
  }

  // Get orders count
  async getOrdersCount(search?: string, status?: string): Promise<number> {
    try {
      await this.validateRole('admin');
      const token = this.validateAuth();
      
      let url = '/api/orders/admin/count';
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      if (status && status !== 'all') {
        url += `${search ? '&' : '?'}status=${encodeURIComponent(status)}`;
      }
      
      const response = await this.request<{total: number}>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.total;
    } catch (error) {
      console.error('Error fetching orders count:', error);
      return 0;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: number, updateData: OrderUpdateRequest): Promise<AdminOrder | null> {
    try {
      await this.validateRole('admin');
      const token = this.validateAuth();
      
      const response = await this.request<AdminOrder>(`/api/orders/admin/${orderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData)
      });
      
      toast.success('Order status updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
      return null;
    }
  }

  // Get order details
  async getOrderDetails(orderId: number): Promise<AdminOrder | null> {
    try {
      await this.validateRole('admin');
      const token = this.validateAuth();
      
      const response = await this.request<AdminOrder>(`/api/orders/admin/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      return null;
    }
  }

  // Delete order
  async deleteOrder(orderId: number): Promise<boolean> {
    try {
      await this.validateRole('admin');
      const token = this.validateAuth();
      
      await this.request(`/api/orders/admin/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success('Order deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
      return false;
    }
  }
}

export const adminOrdersApiService = new AdminOrdersApiService(); 