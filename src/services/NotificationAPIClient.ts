import type {
  SendNotificationBody,
  SendBulkNotificationsBody,
  SendMultipleDepartmentsBody,
  NotificationStats,
  Notification,
  NotificationsListResponse,
} from '../types';

/**
 * Notification API Client
 * Handles all API calls to the notification backend
 */
export class NotificationAPIClient {
  private baseUrl: string;

  constructor(apiUrl: string) {
    this.baseUrl = apiUrl;
  }

  /**
   * Send notification to single user
   */
  async sendToUser(userId: string, notification: SendNotificationBody) {
    return this.post(`/notifications/user/${userId}`, notification);
  }

  /**
   * Send notification to multiple users
   */
  async sendToUsers(body: SendBulkNotificationsBody) {
    return this.post('/notifications/users', body);
  }

  /**
   * Send notification to department
   */
  async sendToDepartment(departmentId: string, notification: SendNotificationBody) {
    return this.post(`/notifications/department/${departmentId}`, notification);
  }

  /**
   * Send notification to multiple departments
   */
  async sendToMultipleDepartments(body: SendMultipleDepartmentsBody) {
    return this.post('/notifications/departments', body);
  }

  /**
   * Broadcast notification to all users
   */
  async broadcast(notification: SendNotificationBody) {
    return this.post('/notifications/broadcast', notification);
  }

  /**
   * Get notification history for user
   */
  async getHistory(userId: string): Promise<Notification[]> {
    const response = await this.get(`/notifications/user/${userId}/history`);
    // Handle both direct array response and wrapped response
    if (Array.isArray(response)) {
      return response;
    }
    return response.data || response.notifications || [];
  }

  /**
   * Get waiting (offline) notifications
   */
  async getWaiting(userId: string): Promise<NotificationsListResponse> {
    return this.get(`/notifications/user/${userId}/waiting`);
  }

  /**
   * Get delivered notifications
   */
  async getDelivered(userId: string): Promise<NotificationsListResponse> {
    return this.get(`/notifications/user/${userId}/delivered`);
  }

  /**
   * Get notification statistics
   */
  async getStats(userId: string): Promise<NotificationStats> {
    return this.get(`/notifications/user/${userId}/stats`);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const response = await this.get(`/notifications/user/${userId}/unread-count`);
    return response.unreadCount || 0;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    return this.post(`/notifications/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    return this.post(`/notifications/user/${userId}/mark-all-read`, {});
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string) {
    return this.post(`/notifications/${notificationId}/delete`, {});
  }

  /**
   * Get connected users
   */
  async getConnectedUsers() {
    return this.get('/notifications/connected-users');
  }

  /**
   * Delete old notifications for a user
   */
  async deleteOldNotifications(userId: string) {
    return this.post(`/notifications/user/${userId}/delete-old`, {});
  }

  /**
   * Get all notifications (admin endpoint)
   */
  async getAllNotifications(): Promise<Notification[]> {
    const response = await this.get('/notifications/all');
    return response.data || [];
  }

  /**
   * Clear all notifications (admin endpoint)
   */
  async clearAllNotifications() {
    return this.post('/notifications/clear-all', {});
  }

  /**
   * Get admin queue information
   */
  async getAdminQueues() {
    return this.get('/admin/queues');
  }

  /**
   * Private helper for GET requests
   */
  private async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
}
