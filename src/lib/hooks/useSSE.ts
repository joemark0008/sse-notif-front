import { useSSEContext } from '../context/SSEContext';
import type { UseSSEReturn } from '../../types';

/**
 * Hook for managing SSE connection state and controls
 * Must be used within an SSEProvider
 */
export function useSSE(): UseSSEReturn {
  const {
    connectionState,
    isConnected,
    error,
    connect,
    disconnect,
  } = useSSEContext();

  return {
    connectionState,
    isConnected,
    error,
    connect,
    disconnect,
  };
}