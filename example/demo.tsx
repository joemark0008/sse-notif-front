import React from 'react';
import { SSEProvider, useSSE, useNotifications, useNotificationAPI } from '@hisd3/sse-notifications-react';
import type { SSEConfig } from '@hisd3/sse-notifications-react';

// Example configuration
const config: SSEConfig = {
  apiUrl: 'http://localhost:3000',
  userId: 'user123',
  departmentIds: ['sales', 'marketing'],
  autoConnect: true,
  autoReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000
};

function NotificationDemo() {
  const { isConnected, connectionState, connect, disconnect } = useSSE();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { sendToUser, broadcast, isLoading } = useNotificationAPI();

  const handleSendTest = async () => {
    try {
      await sendToUser('user456', {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test message from the demo!',
        data: { demoData: 'example' },
        icon: '🚀'
      });
      console.log('Notification sent successfully!');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleBroadcast = async () => {
    try {
      await broadcast({
        type: 'announcement',
        title: 'System Announcement',
        message: 'Hello everyone! This is a broadcast message.',
        icon: '📢'
      });
      console.log('Broadcast sent successfully!');
    } catch (error) {
      console.error('Failed to send broadcast:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>SSE Notifications Demo</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Connection Status</h3>
        <p><strong>State:</strong> {connectionState}</p>
        <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
        <div style={{ gap: '10px', display: 'flex' }}>
          <button 
            onClick={connect} 
            disabled={isConnected}
            style={{ padding: '5px 10px', cursor: isConnected ? 'not-allowed' : 'pointer' }}
          >
            Connect
          </button>
          <button 
            onClick={disconnect} 
            disabled={!isConnected}
            style={{ padding: '5px 10px', cursor: !isConnected ? 'not-allowed' : 'pointer' }}
          >
            Disconnect
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#e8f5e8', borderRadius: '5px' }}>
        <h3>Send Notifications</h3>
        <div style={{ gap: '10px', display: 'flex' }}>
          <button 
            onClick={handleSendTest}
            disabled={isLoading}
            style={{ padding: '5px 10px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Sending...' : 'Send Test to User'}
          </button>
          <button 
            onClick={handleBroadcast}
            disabled={isLoading}
            style={{ padding: '5px 10px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Broadcasting...' : 'Send Broadcast'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#fff3cd', borderRadius: '5px' }}>
        <h3>Notification Management</h3>
        <p><strong>Unread Count:</strong> {unreadCount}</p>
        <button 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          style={{ 
            padding: '5px 10px', 
            cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
            opacity: unreadCount === 0 ? 0.5 : 1
          }}
        >
          Mark All as Read
        </button>
      </div>

      <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Recent Notifications ({notifications.length})</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No notifications yet...</p>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  padding: '10px', 
                  marginBottom: '10px',
                  background: notification.read ? '#f9f9f9' : '#ffffff',
                  opacity: notification.read ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                      {notification.icon} {notification.title}
                    </h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>{notification.message}</p>
                    <small style={{ color: '#999' }}>
                      {new Date(notification.createdAt).toLocaleString()} • Type: {notification.type}
                    </small>
                    {notification.data && (
                      <pre style={{ 
                        background: '#f1f1f1', 
                        padding: '5px', 
                        borderRadius: '3px', 
                        fontSize: '12px',
                        marginTop: '5px'
                      }}>
                        {JSON.stringify(notification.data, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        style={{ 
                          padding: '3px 8px', 
                          fontSize: '12px',
                          cursor: 'pointer',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px'
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SSEProvider 
      config={config}
      onNotification={(notification) => {
        console.log('New notification received:', notification);
        // You can add toast notifications here
      }}
      onConnect={() => {
        console.log('✅ Connected to SSE server');
      }}
      onDisconnect={() => {
        console.log('❌ Disconnected from SSE server');
      }}
      onError={(error) => {
        console.error('SSE Error:', error);
      }}
    >
      <NotificationDemo />
    </SSEProvider>
  );
}