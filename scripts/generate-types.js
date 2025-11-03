const fs = require('fs');
const path = require('path');

const typesContent = `import React from 'react';
import { ReactNode } from 'react';

// Main Types
export interface SSEConfig {
  apiUrl: string;
  userId: string;
  departmentIds?: string[];
  autoConnect?: boolean;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  maxReconnectDelay?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'urgent' | 'system' | 'announcement';
  title: string;
  message: string;
  data?: Record<string, any>;
  icon?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

export interface SendNotificationPayload {
  type: 'info' | 'warning' | 'error' | 'success' | 'urgent' | 'system' | 'announcement';
  title: string;
  message: string;
  data?: Record<string, any>;
  icon?: string;
}

export interface APIError extends Error {
  status?: number;
  response?: any;
}

// Hook Return Types
export interface UseSSEReturn {
  connectionState: string;
  isConnected: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export interface UseNotificationAPIReturn {
  sendToUser: (userId: string, payload: SendNotificationPayload) => Promise<void>;
  sendToUsers: (userIds: string[], payload: SendNotificationPayload) => Promise<void>;
  sendToDepartment: (departmentId: string, payload: SendNotificationPayload) => Promise<void>;
  sendToMultipleDepartments: (departmentIds: string[], payload: SendNotificationPayload) => Promise<void>;
  broadcast: (payload: SendNotificationPayload) => Promise<void>;
  getHistory: (userId: string, limit?: number) => Promise<Notification[]>;
  getWaiting: (userId: string) => Promise<Notification[]>;
  getDelivered: (userId: string) => Promise<Notification[]>;
  getStats: (userId: string) => Promise<NotificationStats>;
  deleteOldNotifications: (userId: string, daysOld?: number) => Promise<void>;
  getAllNotifications: () => Promise<Notification[]>;
  clearAllNotifications: () => Promise<void>;
  getAdminQueues: () => Promise<any>;
  isLoading: boolean;
}

export interface SSEProviderProps {
  config: SSEConfig;
  children: ReactNode;
  enableBrowserNotifications?: boolean;
  onNotification?: (notification: Notification) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

// Context and Provider
export const SSEContext: React.Context<{
  config: SSEConfig | null;
  connectionState: string;
  isConnected: boolean;
  error: Error | null;
  notifications: Notification[];
  unreadCount: number;
  connect: () => void;
  disconnect: () => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
} | null>;

export function SSEProvider(props: SSEProviderProps): React.JSX.Element;

// Hooks
export function useSSE(): UseSSEReturn;
export function useNotifications(): UseNotificationsReturn;
export function useNotificationAPI(): UseNotificationAPIReturn;

// Utility Functions
export function requestNotificationPermission(): Promise<NotificationPermission>;

// API Client
export class NotificationAPIClient {
  constructor(apiUrl: string);
  sendToUser(userId: string, payload: SendNotificationPayload): Promise<void>;
  sendToUsers(userIds: string[], payload: SendNotificationPayload): Promise<void>;
  sendToDepartment(departmentId: string, payload: SendNotificationPayload): Promise<void>;
  sendToMultipleDepartments(departmentIds: string[], payload: SendNotificationPayload): Promise<void>;
  broadcast(payload: SendNotificationPayload): Promise<void>;
  getHistory(userId: string, limit?: number): Promise<Notification[]>;
  getWaiting(userId: string): Promise<Notification[]>;
  getDelivered(userId: string): Promise<Notification[]>;
  getStats(userId: string): Promise<NotificationStats>;
  deleteOldNotifications(userId: string, daysOld?: number): Promise<void>;
  getAllNotifications(): Promise<Notification[]>;
  clearAllNotifications(): Promise<void>;
  getAdminQueues(): Promise<any>;
}
`;

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const outputPath = path.join(distDir, 'index.d.ts');
fs.writeFileSync(outputPath, typesContent);
console.log('✅ TypeScript definitions generated at dist/index.d.ts');
