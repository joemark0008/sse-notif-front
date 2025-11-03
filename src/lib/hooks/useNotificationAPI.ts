import { useCallback, useState, useMemo } from 'react';
import { useSSEContext } from '../context/SSEContext';
import { NotificationAPIClient } from '../../services/NotificationAPIClient';
import type { 
  UseNotificationAPIReturn,
  SendNotificationBody,
  SendBulkNotificationsBody,
  SendMultipleDepartmentsBody,
  Notification,
  NotificationsListResponse,
  NotificationStats
} from '../../types';

/**
 * Hook for managing notification API operations
 * Must be used within an SSEProvider
 */
export function useNotificationAPI(): UseNotificationAPIReturn {
  const { config } = useSSEContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the API client to prevent recreation on every render
  const apiClient = useMemo(() => {
    return config ? new NotificationAPIClient(config.apiUrl) : null;
  }, [config?.apiUrl]);

  const executeAPICall = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    if (!apiClient) {
      throw new Error('API client not available');
    }

    try {
      setIsLoading(true);
      setError(null);
      return await operation();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('API operation failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  const sendToUser = useCallback(async (
    userId: string, 
    notification: SendNotificationBody
  ): Promise<any> => {
    return executeAPICall(() => apiClient!.sendToUser(userId, notification));
  }, [executeAPICall, apiClient]);

  const sendToUsers = useCallback(async (
    body: SendBulkNotificationsBody
  ): Promise<any> => {
    return executeAPICall(() => apiClient!.sendToUsers(body));
  }, [executeAPICall, apiClient]);

  const sendToDepartment = useCallback(async (
    departmentId: string, 
    notification: SendNotificationBody
  ): Promise<any> => {
    return executeAPICall(() => apiClient!.sendToDepartment(departmentId, notification));
  }, [executeAPICall, apiClient]);

  const sendToMultipleDepartments = useCallback(async (
    body: SendMultipleDepartmentsBody
  ): Promise<any> => {
    return executeAPICall(() => apiClient!.sendToMultipleDepartments(body));
  }, [executeAPICall, apiClient]);

  const broadcast = useCallback(async (
    notification: SendNotificationBody
  ): Promise<any> => {
    return executeAPICall(() => apiClient!.broadcast(notification));
  }, [executeAPICall, apiClient]);

  const getHistory = useCallback(async (
    userId: string
  ): Promise<Notification[]> => {
    return executeAPICall(() => apiClient!.getHistory(userId));
  }, [executeAPICall, apiClient]);

  const getWaiting = useCallback(async (
    userId: string
  ): Promise<NotificationsListResponse> => {
    return executeAPICall(() => apiClient!.getWaiting(userId));
  }, [executeAPICall, apiClient]);

  const getDelivered = useCallback(async (
    userId: string
  ): Promise<NotificationsListResponse> => {
    return executeAPICall(() => apiClient!.getDelivered(userId));
  }, [executeAPICall, apiClient]);

  const getStats = useCallback(async (
    userId: string
  ): Promise<NotificationStats> => {
    return executeAPICall(() => apiClient!.getStats(userId));
  }, [executeAPICall, apiClient]);

  const deleteOldNotifications = useCallback(async (
    userId: string
  ): Promise<any> => {
    return executeAPICall(() => apiClient!.deleteOldNotifications(userId));
  }, [executeAPICall, apiClient]);

  const getAllNotifications = useCallback(async (): Promise<Notification[]> => {
    return executeAPICall(() => apiClient!.getAllNotifications());
  }, [executeAPICall, apiClient]);

  const clearAllNotifications = useCallback(async (): Promise<any> => {
    return executeAPICall(() => apiClient!.clearAllNotifications());
  }, [executeAPICall, apiClient]);

  const getAdminQueues = useCallback(async (): Promise<any> => {
    return executeAPICall(() => apiClient!.getAdminQueues());
  }, [executeAPICall, apiClient]);

  return {
    sendToUser,
    sendToUsers,
    sendToDepartment,
    sendToMultipleDepartments,
    broadcast,
    getHistory,
    getWaiting,
    getDelivered,
    getStats,
    deleteOldNotifications,
    getAllNotifications,
    clearAllNotifications,
    getAdminQueues,
    isLoading,
    error,
  };
}