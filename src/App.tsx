import { useState, useEffect } from 'react';
import { SSEProvider, useSSE } from '@joemark0008/sse-notifications-react';
import type { Notification } from './types';

const config = {
  apiUrl: 'http://localhost:3000',  // Your backend URL
  userId: 'john_doe',                // Current user ID
  appKey: '8fb26b0a568af89d66c0d729b1566cde',            // Your API key
  appSecret: '0578a10a6ba4d71e8b963f29fc89d349',      // Your API secret
  departmentIds: ['sales', 'it'],    // Optional: departments to subscribe to
  autoConnect: true,                 // Auto-connect on mount
  autoReconnect: true                // Auto-reconnect on disconnect
};

// Connection Status Component
function ConnectionStatus() {
  const { connectionState, isConnected, connect, disconnect, error } = useSSE();

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected': return '#10b981'; // green
      case 'connecting': return '#f59e0b'; // yellow
      case 'error': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'idle': return 'Not Connected';
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '20px',
      backgroundColor: '#f9fafb'
    }}>
      <h2 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>SSE Connection Status</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            boxShadow: '0 0 6px rgba(0,0,0,0.2)'
          }}
        />
        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{getStatusText()}</span>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={connect}
          disabled={isConnected}
          style={{
            padding: '8px 16px',
            backgroundColor: isConnected ? '#d1d5db' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isConnected ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          Connect
        </button>

        <button
          onClick={disconnect}
          disabled={!isConnected}
          style={{
            padding: '8px 16px',
            backgroundColor: !isConnected ? '#d1d5db' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isConnected ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

// Notifications Component
function NotificationsDisplay() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { isConnected } = useSSE();

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: 0, color: '#1f2937' }}>
          Notifications ({notifications.length})
        </h2>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {!isConnected && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          color: '#92400e',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          ⚠️ Connect to SSE server to receive notifications
        </div>
      )}

      {notifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          padding: '40px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
          <p>No notifications yet</p>
          <p style={{ fontSize: '14px' }}>Notifications will appear here when received from the server</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '15px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#f9fafb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ fontSize: '24px', lineHeight: '1' }}>
                  {notification.icon || '📬'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <h3 style={{ margin: 0, color: '#1f2937', fontSize: '16px' }}>
                      {notification.title}
                    </h3>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: getTypeColor(notification.type),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {notification.type}
                    </span>
                  </div>
                  <p style={{ margin: '5px 0', color: '#4b5563' }}>
                    {notification.message}
                  </p>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                    {notification.data && (
                      <span style={{ marginLeft: '10px' }}>
                        • Data: {JSON.stringify(notification.data)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function for notification type colors
function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'error': return '#ef4444';
    case 'warning': return '#f59e0b';
    case 'success': return '#10b981';
    case 'info': return '#3b82f6';
    default: return '#6b7280';
  }
}

// Main App Component
function App() {
  // Handle incoming notifications
  const handleNotification = (notification: Notification) => {
    console.log('🔔 Notification received:', notification);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/vite.svg',
        tag: notification.id,
      });
    }
  };

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('✅ Browser notifications enabled');
        }
      });
    }
  }, []);

  return (
    <SSEProvider
      config={config}
      enableBrowserNotifications={true}
      onNotification={handleNotification}
      onConnect={() => console.log('✅ SSE Connected')}
      onDisconnect={() => console.log('❌ SSE Disconnected')}
      onError={(error: Error) => console.error('❌ SSE Error:', error)}
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>
            @joemark0008/sse-notifications-react
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Minimal React library for Server-Sent Events (SSE) connections
          </p>
        </header>

        <ConnectionStatus />
        <NotificationsDisplay />

        <footer style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0 }}>
            📖 Check the README for setup instructions and API documentation
          </p>
          <p style={{ margin: '5px 0 0 0' }}>
            🔗 <a href="https://www.npmjs.com/package/@joemark0008/sse-notifications-react" style={{ color: '#3b82f6' }}>
              View on NPM
            </a>
          </p>
        </footer>
      </div>
    </SSEProvider>
  );
}

export default App;