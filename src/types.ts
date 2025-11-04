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
 * Configuration for SSE notifications
 */
export interface SSEConfig {
  /** Base API URL (e.g., http://localhost:3000) */
  apiUrl: string;
  /** User ID subscribing to notifications */
  userId: string;
  /** API key for authentication (required for API calls) */
  appKey: string;
  /** API secret for authentication (required for API calls) */
  appSecret: string;
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
 * Hook return type for useSSE
 */
export interface UseSSEReturn {
  connectionState: SSEConnectionState;
  isConnected: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}
