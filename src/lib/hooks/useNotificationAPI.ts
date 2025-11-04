import { useCallback, useState, useMemo } from 'react';
import { useSSEContext } from '../context/SSEContext';
import { NotificationAPIClient } from '../../services/NotificationAPIClient';
import type { 
  UseNotificationAPIReturn,
  Notification,
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
    return config ? new NotificationAPIClient(config.apiUrl, config.appKey, config.appSecret) : null;
  }, [config?.apiUrl, config?.appKey, config?.appSecret]);

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

  // User notification methods
  const getHistory = useCallback(async (
    userId: string
  ): Promise<Notification[]> => {
    return executeAPICall(() => apiClient!.getHistory(userId));
  }, [executeAPICall, apiClient]);

  const getStats = useCallback(async (
    userId: string
  ): Promise<NotificationStats> => {
    return executeAPICall(() => apiClient!.getStats(userId));
  }, [executeAPICall, apiClient]);

  const getUnreadCount = useCallback(async (
    userId: string
  ): Promise<number> => {
    return executeAPICall(() => apiClient!.getUnreadCount(userId));
  }, [executeAPICall, apiClient]);

  const deleteOldNotifications = useCallback(async (
    userId: string
  ): Promise<any> => {
    return executeAPICall(() => apiClient!.deleteOldNotifications(userId));
  }, [executeAPICall, apiClient]);

  // Department notification methods
  const getDepartmentHistory = useCallback(async (
    departmentId: string
  ): Promise<Notification[]> => {
    return executeAPICall(() => apiClient!.getDepartmentHistory(departmentId));
  }, [executeAPICall, apiClient]);

  const getDepartmentSubscribers = useCallback(async (
    departmentId: string
  ): Promise<number> => {
    return executeAPICall(() => apiClient!.getDepartmentSubscribers(departmentId));
  }, [executeAPICall, apiClient]);

  return {
    getHistory,
    getStats,
    getUnreadCount,
    deleteOldNotifications,
    getDepartmentHistory,
    getDepartmentSubscribers,
    isLoading,
    error,
  };
}