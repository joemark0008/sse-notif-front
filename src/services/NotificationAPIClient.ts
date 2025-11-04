import type {
  NotificationStats,
  Notification,
} from '../types';

/**
 * Notification API Client
 * Handles all API calls to the notification backend
 */
export class NotificationAPIClient {
  private baseUrl: string;
  private appKey?: string;
  private appSecret?: string;

  constructor(apiUrl: string, appKey?: string, appSecret?: string) {
    this.baseUrl = apiUrl;
    this.appKey = appKey;
    this.appSecret = appSecret;
  }

  /**
   * Get notification history for user
   */
  async getHistory(userId: string): Promise<Notification[]> {
    const response = await this.get(`/user-notifications/${userId}/history`);
    // Handle both direct array response and wrapped response
    if (Array.isArray(response)) {
      return response;
    }
    return response.data || response.notifications || [];
  }

  /**
   * Get notification statistics for user
   */
  async getStats(userId: string): Promise<NotificationStats> {
    return this.get(`/user-notifications/${userId}/stats`);
  }

  /**
   * Get unread count for user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const response = await this.get(`/user-notifications/${userId}/unread-count`);
    return response.unreadCount || response.count || 0;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    return this.post(`/user-notifications/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string) {
    return this.post(`/user-notifications/${userId}/mark-all-read`, {});
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string) {
    return this.post(`/user-notifications/${notificationId}/delete`, {});
  }

  /**
   * Delete old notifications for a user
   */
  async deleteOldNotifications(userId: string) {
    return this.post(`/user-notifications/${userId}/delete-old`, {});
  }

  /**
   * Get department notification history
   */
  async getDepartmentHistory(departmentId: string): Promise<Notification[]> {
    const response = await this.get(`/department-notifications/${departmentId}/history`);
    if (Array.isArray(response)) {
      return response;
    }
    return response.data || response.notifications || [];
  }

  /**
   * Get department subscribers count
   */
  async getDepartmentSubscribers(departmentId: string): Promise<number> {
    const response = await this.get(`/department-notifications/${departmentId}/subscribers`);
    return response.count || response.subscribers || 0;
  }

  /**
   * Get request headers with API key authentication
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.appKey && this.appSecret) {
      headers['x-app-key'] = this.appKey;
      headers['x-app-secret'] = this.appSecret;
    }

    return headers;
  }

  /**
   * Private helper for GET requests
   */
  private async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Private helper for POST requests
   */
  private async post(endpoint: string, body: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
}
