// Main exports for the library
export { SSEProvider, useSSEContext } from './lib/context/SSEContext';
export { useSSE } from './lib/hooks/useSSE';
export { useNotifications } from './lib/hooks/useNotifications';
export { useNotificationAPI } from './lib/hooks/useNotificationAPI';
export { NotificationAPIClient } from './services/NotificationAPIClient';

// Export all types
export type {
  Notification,
  NotificationStats,
  NotificationResponse,
  SSEConfig,
  SSEConnectionState,
  SendNotificationBody,
  SendBulkNotificationsBody,
  SendDepartmentNotificationBody,
  SendMultipleDepartmentsBody,
  NotificationsListResponse,
  ConnectedUsersResponse,
  UseNotificationsReturn,
  UseSSEReturn,
  UseNotificationAPIReturn,
} from './types';

// Re-export context types for advanced usage
export type { SSEProviderProps } from './lib/context/SSEContext';

// Utility function to request browser notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    throw new Error('Browser notifications are not supported');
  }
  
  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
};