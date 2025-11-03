import { createContext, useContext, useCallback, useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { SSEConfig, SSEConnectionState, Notification } from '../../types';

interface SSEContextValue {
  config: SSEConfig | null;
  connectionState: SSEConnectionState;
  isConnected: boolean;
  error: Error | null;
  notifications: Notification[];
  unreadCount: number;
  connect: () => void;
  disconnect: () => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

const SSEContext = createContext<SSEContextValue | null>(null);

export interface SSEProviderProps {
  children: ReactNode;
  config: SSEConfig;
  onNotification?: (notification: Notification) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  enableBrowserNotifications?: boolean;
}

export function SSEProvider({
  children,
  config,
  onNotification,
  onConnect,
  onDisconnect,
  onError,
  enableBrowserNotifications = false,
}: SSEProviderProps) {
  const [connectionState, setConnectionState] = useState<SSEConnectionState>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectDelayRef = useRef(config.reconnectDelay || 1000);

  const isConnected = connectionState === 'connected';

  const buildSSEUrl = useCallback(() => {
    const baseUrl = config.apiUrl.replace(/\/$/, '');
    let url = `${baseUrl}/notifications/subscribe?userId=${encodeURIComponent(config.userId)}`;
    
    if (config.departmentIds) {
      const departments = Array.isArray(config.departmentIds) 
        ? config.departmentIds.join(',')
        : config.departmentIds;
      url += `&departmentIds=${encodeURIComponent(departments)}`;
    }
    
    return url;
  }, [config.apiUrl, config.userId, config.departmentIds]);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const handleConnect = useCallback(() => {
    setConnectionState('connected');
    setError(null);
    reconnectAttemptsRef.current = 0;
    reconnectDelayRef.current = config.reconnectDelay || 1000;
    console.log('✅ Connected to SSE notifications');
    onConnect?.();
  }, [config.reconnectDelay, onConnect]);

  const handleDisconnect = useCallback(() => {
    setConnectionState('disconnected');
    console.log('❌ Disconnected from SSE notifications');
    onDisconnect?.();
  }, [onDisconnect]);

  const handleError = useCallback((err: Error) => {
    setError(err);
    setConnectionState('error');
    console.log('❌ SSE connection error:', err);
    onError?.(err);
  }, [onError]);

  const showBrowserNotification = useCallback((notification: Notification) => {
    if (!enableBrowserNotifications) return;

    // Check if browser notifications are supported
    if (!('Notification' in window)) {
      console.warn('Browser notifications are not supported');
      return;
    }

    // Request permission if not already granted
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          showBrowserNotification(notification);
        }
      });
      return;
    }

    // Show notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/favicon.ico',
        tag: notification.id, // Prevents duplicate notifications
        requireInteraction: notification.type === 'urgent' || notification.type === 'error',
      });
    }
  }, [enableBrowserNotifications]);

  const addNotification = useCallback((notification: Notification) => {
    console.log('New notification:', notification);
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
    
    // Show browser notification
    showBrowserNotification(notification);
    
    // Call user-provided callback
    onNotification?.(notification);
  }, [onNotification, showBrowserNotification]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!config.autoReconnect) return;
    
    const maxAttempts = config.maxReconnectAttempts ?? -1;
    if (maxAttempts !== -1 && reconnectAttemptsRef.current >= maxAttempts) {
      console.warn('Max reconnection attempts reached');
      return;
    }

    clearReconnectTimeout();
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current++;
      connect();
      
      // Exponential backoff
      reconnectDelayRef.current = Math.min(
        reconnectDelayRef.current * 2,
        config.maxReconnectDelay || 30000
      );
    }, reconnectDelayRef.current);
  }, [config.autoReconnect, config.maxReconnectAttempts, config.maxReconnectDelay]);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionState('connecting');
    setError(null);

    try {
      const url = buildSSEUrl();
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        handleConnect();
      };

      eventSource.onmessage = (event) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          addNotification(notification);
        } catch (err) {
          console.error('Failed to parse SSE message:', err);
        }
      };

      eventSource.onerror = (event) => {
        console.log('❌ SSE connection error:', event);
        const error = new Error('SSE connection error');
        handleError(error);
        
        // Schedule reconnect on error
        if (config.autoReconnect !== false) {
          scheduleReconnect();
        }
      };

      // Handle custom event types
      eventSource.addEventListener('notification', (event) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          addNotification(notification);
        } catch (err) {
          console.error('Failed to parse notification event:', err);
        }
      });

      eventSource.addEventListener('error', (event) => {
        console.error('SSE Error event:', event);
      });

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create SSE connection');
      handleError(error);
    }
  }, [
    buildSSEUrl,
    config.autoReconnect,
    handleConnect,
    handleError,
    addNotification,
    scheduleReconnect,
  ]);

  const disconnect = useCallback(() => {
    clearReconnectTimeout();
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    handleDisconnect();
  }, [clearReconnectTimeout, handleDisconnect]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (config.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [config.autoConnect]); // Only depend on autoConnect to avoid reconnecting on config changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearReconnectTimeout();
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [clearReconnectTimeout]);

  const contextValue: SSEContextValue = {
    config,
    connectionState,
    isConnected,
    error,
    notifications,
    unreadCount,
    connect,
    disconnect,
    addNotification,
    markAsRead,
    clearNotifications,
  };

  return (
    <SSEContext.Provider value={contextValue}>
      {children}
    </SSEContext.Provider>
  );
}

export function useSSEContext(): SSEContextValue {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error('useSSEContext must be used within an SSEProvider');
  }
  return context;
}