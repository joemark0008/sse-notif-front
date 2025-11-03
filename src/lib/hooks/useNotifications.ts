import { useCallback, useState, useMemo } from 'react';
import { useSSEContext } from '../context/SSEContext';
import { NotificationAPIClient } from '../../services/NotificationAPIClient';
import type { UseNotificationsReturn, NotificationStats } from '../../types';

/**
 * Hook for managing notifications state and actions
 * Must be used within an SSEProvider
 */
export function useNotifications(): UseNotificationsReturn {
  const {
    config,
    notifications,
    unreadCount,
    markAsRead: contextMarkAsRead,
  } = useSSEContext();

  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the API client to prevent recreation on every render
  const apiClient = useMemo(() => {
    return config ? new NotificationAPIClient(config.apiUrl) : null;
  }, [config?.apiUrl]);

  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    if (!apiClient || !config) {
      throw new Error('API client not available');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await apiClient.markAsRead(notificationId);
      contextMarkAsRead(notificationId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to mark notification as read');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, config, contextMarkAsRead]);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    if (!apiClient || !config) {
      throw new Error('API client not available');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await apiClient.markAllAsRead(config.userId);
      
      // Mark all local notifications as read
      notifications.forEach(notification => {
        if (!notification.read) {
          contextMarkAsRead(notification.id);
        }
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to mark all notifications as read');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, config, notifications, contextMarkAsRead]);

  const deleteNotification = useCallback(async (notificationId: string): Promise<void> => {
    if (!apiClient || !config) {
      throw new Error('API client not available');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await apiClient.deleteNotification(notificationId);
      
      // Note: In a real implementation, you might want to remove from local state
      // For now, we'll just mark as read since deletion isn't handled in context
      contextMarkAsRead(notificationId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete notification');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, config, contextMarkAsRead]);

  // Load initial stats - only run once when apiClient or userId changes
  // Commented out to prevent ERR_INSUFFICIENT_RESOURCES on initial load
  // You can manually call getStats from useNotificationAPI when needed
  /*
  useEffect(() => {
    if (!apiClient || !config?.userId) return;

    const loadStats = async () => {
      try {
        setIsLoading(true);
        const statsData = await apiClient.getStats(config.userId);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load notification stats:', err);
        setError(err instanceof Error ? err : new Error('Failed to load stats'));
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [apiClient, config?.userId]); // Only depend on apiClient and userId, not the entire config
  */

  return {
    notifications,
    unreadCount,
    stats,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}