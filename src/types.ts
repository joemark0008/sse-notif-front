/**
 * Notification object returned from SSE stream
 */
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  icon?: string;
  read: boolean;
  delivered: boolean;
  consumedAt?: string;
  createdAt: string;
}

/**
 * Statistics for user's notifications
 */
export interface NotificationStats {
  total: number;
  waiting: number;
  delivered: number;
  read: number;
  unread: number;
}

/**
 * Notification response from API
 */
export interface NotificationResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Configuration for SSE notifications
 */
export interface SSEConfig {
  /** Base API URL (e.g., http://localhost:3000) */
  apiUrl: string;
  /** User ID subscribing to notifications */
  userId: string;
  /** Optional department IDs (comma-separated or array) */
  departmentIds?: string | string[];
  /** Auto-connect on mount (default: true) */
  autoConnect?: boolean;
  /** Reconnect on disconnect (default: true) */
  autoReconnect?: boolean;
  /** Max reconnect attempts (-1 for infinite) */
  maxReconnectAttempts?: number;
  /** Initial reconnect delay in ms (default: 1000) */
  reconnectDelay?: number;
  /** Max reconnect delay in ms (default: 30000) */
  maxReconnectDelay?: number;
}

/**
 * SSE connection state
 */
export type SSEConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Body for sending notification to single user
 */
export interface SendNotificationBody {
  type: string;
  title: string;
  message: string;
  data?: any;
  icon?: string;
}

/**
 * Body for sending notifications to multiple users
 */
export interface SendBulkNotificationsBody extends SendNotificationBody {
  userIds: string[];
}

/**
 * Body for sending to department
 */
export interface SendDepartmentNotificationBody extends SendNotificationBody {
  departmentId: string;
}

/**
 * Body for sending to multiple departments
 */
export interface SendMultipleDepartmentsBody extends SendNotificationBody {
  departmentIds: string[];
}

/**
 * Query response for notifications list
 */
export interface NotificationsListResponse {
  count: number;
  notifications: Notification[];
}

/**
 * Connected users response
 */
export interface ConnectedUsersResponse {
  count: number;
  users: string[];
}

/**
 * Hook return type for useNotifications
 */
export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

/**
 * Hook return type for useSSE
 */
export interface UseSSEReturn {
  connectionState: SSEConnectionState;
  isConnected: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Hook return type for useNotificationAPI
 */
export interface UseNotificationAPIReturn {
  sendToUser: (userId: string, notification: SendNotificationBody) => Promise<any>;
  sendToUsers: (body: SendBulkNotificationsBody) => Promise<any>;
  sendToDepartment: (departmentId: string, notification: SendNotificationBody) => Promise<any>;
  sendToMultipleDepartments: (body: SendMultipleDepartmentsBody) => Promise<any>;
  broadcast: (notification: SendNotificationBody) => Promise<any>;
  getHistory: (userId: string) => Promise<Notification[]>;
  getWaiting: (userId: string) => Promise<NotificationsListResponse>;
  getDelivered: (userId: string) => Promise<NotificationsListResponse>;
  getStats: (userId: string) => Promise<NotificationStats>;
  deleteOldNotifications: (userId: string) => Promise<any>;
  getAllNotifications: () => Promise<Notification[]>;
  clearAllNotifications: () => Promise<any>;
  getAdminQueues: () => Promise<any>;
  isLoading: boolean;
  error: Error | null;
}
