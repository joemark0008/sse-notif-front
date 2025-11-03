import React, { useEffect } from 'react';
import { 
  SSEProvider, 
  useSSE, 
  useNotifications, 
  useNotificationAPI,
  requestNotificationPermission 
} from '@hisd3/sse-notifications-react';
import type { SSEConfig } from '@hisd3/sse-notifications-react';

// Enhanced configuration with all options
const config: SSEConfig = {
  apiUrl: 'http://localhost:3000',
  userId: 'john_doe',
  departmentIds: ['sales', 'engineering'], // Multiple departments
  autoConnect: true,
  autoReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000
};

function EnhancedNotificationDemo() {
  const { isConnected, connectionState, connect, disconnect } = useSSE();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { sendToUser, broadcast, sendToDepartment } = useNotificationAPI();

  // Request notification permission on component mount
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const permission = await requestNotificationPermission();
        console.log('Notification permission:', permission);
      } catch (error) {
        console.warn('Could not request notification permission:', error);
      }
    };

    setupNotifications();
  }, []);

  const handleSendToUser = async () => {
    try {
      await sendToUser('user456', {
        type: 'info',
        title: 'Personal Message',
        message: 'You have a new task assigned!',
        data: { taskId: 'TASK-123', priority: 'high' },
        icon: '📋'
      });
      console.log('✅ User notification sent');
    } catch (error) {
      console.error('❌ Failed to send user notification:', error);
    }
  };

  const handleSendToDepartment = async () => {
    try {
      await sendToDepartment('sales', {
        type: 'announcement',
        title: 'Sales Meeting',
        message: 'Team meeting scheduled for 3 PM today in Conference Room A',
        data: { meetingId: 'MTG-456', room: 'Conference Room A' },
        icon: '📅'
      });
      console.log('✅ Department notification sent');
    } catch (error) {
      console.error('❌ Failed to send department notification:', error);
    }
  };

  const handleBroadcast = async () => {
    try {
      await broadcast({
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight at 12 AM. System will be down for 2 hours.',
        data: { maintenanceWindow: '12:00 AM - 2:00 AM', affectedServices: ['API', 'Database'] },
        icon: '🔧'
      });
      console.log('✅ Broadcast notification sent');
    } catch (error) {
      console.error('❌ Failed to send broadcast:', error);
    }
  };

  const handleUrgentNotification = async () => {
    try {
      await sendToUser('user456', {
        type: 'urgent',
        title: 'URGENT: Security Alert',
        message: 'Suspicious login detected. Please verify your account immediately.',
        data: { alertId: 'SEC-789', severity: 'high' },
        icon: '🚨'
      });
      console.log('✅ Urgent notification sent');
    } catch (error) {
      console.error('❌ Failed to send urgent notification:', error);
    }
  };

  // Function to show notification details
  const showNotificationDetails = (notification: any) => {
    alert(`
Notification Details:
- ID: ${notification.id}
- Type: ${notification.type}
- Title: ${notification.title}
- Message: ${notification.message}
- Created: ${new Date(notification.createdAt).toLocaleString()}
- Data: ${JSON.stringify(notification.data, null, 2)}
    `);
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>🔔 Enhanced SSE Notifications Demo</h1>
      
      {/* Connection Status */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        background: isConnected ? '#d4edda' : '#f8d7da', 
        borderRadius: '8px',
        border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`
      }}>
        <h3>📡 Connection Status</h3>
        <p><strong>State:</strong> {connectionState}</p>
        <p><strong>Connected:</strong> {isConnected ? '✅ Yes' : '❌ No'}</p>
        <div style={{ gap: '10px', display: 'flex' }}>
          <button 
            onClick={connect} 
            disabled={isConnected}
            style={{ 
              padding: '8px 16px', 
              cursor: isConnected ? 'not-allowed' : 'pointer',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              opacity: isConnected ? 0.5 : 1
            }}
          >
            Connect
          </button>
          <button 
            onClick={disconnect} 
            disabled={!isConnected}
            style={{ 
              padding: '8px 16px', 
              cursor: !isConnected ? 'not-allowed' : 'pointer',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              opacity: !isConnected ? 0.5 : 1
            }}
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Send Notifications */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        background: '#e8f5e8', 
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h3>📤 Send Test Notifications</h3>
        <div style={{ 
          gap: '10px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' 
        }}>
          <button onClick={handleSendToUser} style={buttonStyle}>
            👤 Send to User
          </button>
          <button onClick={handleSendToDepartment} style={buttonStyle}>
            🏢 Send to Department
          </button>
          <button onClick={handleBroadcast} style={buttonStyle}>
            📢 Broadcast Message
          </button>
          <button onClick={handleUrgentNotification} style={{...buttonStyle, background: '#dc3545'}}>
            🚨 Urgent Alert
          </button>
        </div>
      </div>

      {/* Notification Management */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        background: '#fff3cd', 
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h3>📊 Notification Management</h3>
        <p><strong>Unread Count:</strong> <span style={{
          background: unreadCount > 0 ? '#dc3545' : '#28a745',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>{unreadCount}</span></p>
        <button 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          style={{ 
            padding: '8px 16px', 
            cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            opacity: unreadCount === 0 ? 0.5 : 1
          }}
        >
          ✅ Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ 
        padding: '15px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📋 Recent Notifications ({notifications.length})</h3>
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          background: 'white'
        }}>
          {notifications.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6c757d',
              fontStyle: 'italic'
            }}>
              📭 No notifications yet...
              <br />
              <small>Send a test notification to see it here!</small>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                style={{ 
                  border: '1px solid #dee2e6', 
                  borderRadius: '6px', 
                  padding: '12px', 
                  margin: '8px',
                  background: notification.read ? '#f8f9fa' : '#ffffff',
                  opacity: notification.read ? 0.7 : 1,
                  borderLeft: `4px solid ${getNotificationColor(notification.type)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: '0 0 5px 0', 
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>{notification.icon}</span>
                      <span>{notification.title}</span>
                      <span style={{
                        background: getNotificationColor(notification.type),
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        textTransform: 'uppercase'
                      }}>
                        {notification.type}
                      </span>
                    </h4>
                    <p style={{ margin: '0 0 8px 0', color: '#666' }}>{notification.message}</p>
                    <small style={{ color: '#999' }}>
                      🕐 {new Date(notification.createdAt).toLocaleString()}
                    </small>
                    {notification.data && (
                      <div style={{ marginTop: '8px' }}>
                        <button
                          onClick={() => showNotificationDetails(notification)}
                          style={{
                            background: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '3px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          📄 View Details
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ marginLeft: '12px', display: 'flex', gap: '6px' }}>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        style={{ 
                          padding: '4px 8px', 
                          fontSize: '11px',
                          cursor: 'pointer',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px'
                        }}
                      >
                        ✓ Read
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

// Helper function to get notification type color
function getNotificationColor(type: string): string {
  switch (type) {
    case 'urgent': 
    case 'error': 
      return '#dc3545';
    case 'warning': 
      return '#ffc107';
    case 'success': 
      return '#28a745';
    case 'info': 
      return '#17a2b8';
    case 'system': 
      return '#6f42c1';
    case 'announcement': 
      return '#fd7e14';
    default: 
      return '#6c757d';
  }
}

// Button style
const buttonStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px'
};

export default function App() {
  return (
    <SSEProvider 
      config={config}
      enableBrowserNotifications={true} // Enable browser notifications
      onNotification={(notification) => {
        console.log('📨 New notification received:', notification);
        
        // You can add custom logic here
        if (notification.type === 'urgent') {
          console.log('🚨 URGENT notification received!');
        }
      }}
      onConnect={() => {
        console.log('✅ Connected to SSE server');
      }}
      onDisconnect={() => {
        console.log('❌ Disconnected from SSE server');
      }}
      onError={(error) => {
        console.error('❌ SSE Error:', error);
      }}
    >
      <EnhancedNotificationDemo />
    </SSEProvider>
  );
}