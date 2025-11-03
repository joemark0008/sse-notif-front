import { useEffect } from 'react';
import { 
  SSEProvider, 
  useSSE, 
  useNotifications, 
  useNotificationAPI,
  requestNotificationPermission 
} from '@joemark0008/sse-notifications-react';
import type { SSEConfig } from '@joemark0008/sse-notifications-react';
import './App.css';

// Configuration for your SSE connection
const config: SSEConfig = {
  apiUrl: 'http://localhost:3000', // Your backend URL
  userId: 'john_doe',         // Current user ID
  departmentIds: ['sales', 'engineering'], // Optional departments
  autoConnect: true,
  autoReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000
};

function NotificationDemo() {
  const { isConnected, connectionState, connect, disconnect, error } = useSSE();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    isLoading: notifLoading 
  } = useNotifications();
  const { 
    sendToUser, 
    broadcast, 
    sendToDepartment,
    isLoading: apiLoading 
  } = useNotificationAPI();

  // Request browser notification permission
  useEffect(() => {
    requestNotificationPermission()
      .then(permission => {
        console.log('🔔 Browser notification permission:', permission);
      })
      .catch(error => {
        console.warn('⚠️ Browser notifications not supported:', error);
      });

    // Debug: Test API endpoint directly
    testAPIEndpoint();
  }, []);

  // Debug helper to test the API endpoint
  const testAPIEndpoint = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/notifications/user/${config.userId}/history`);
      const data = await response.json();
      console.log('🧪 API Test - GET /notifications/user/john_doe/history:', data);
    } catch (error) {
      console.error('🧪 API Test Failed:', error);
    }
  };

  // Test functions to send notifications
  const sendTestNotification = async () => {
    try {
      await sendToUser('test-user-123', {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification that you can mark as read!',
        data: { testId: Date.now() },
        icon: '🚀'
      });
      console.log('✅ Test notification sent!');
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    }
  };

  const sendUrgentNotification = async () => {
    try {
      await sendToUser('test-user-123', {
        type: 'urgent',
        title: 'URGENT: Action Required',
        message: 'This urgent notification needs your immediate attention!',
        data: { priority: 'high', actionRequired: true },
        icon: '🚨'
      });
      console.log('✅ Urgent notification sent!');
    } catch (error) {
      console.error('❌ Failed to send urgent notification:', error);
    }
  };

  const sendDepartmentNotification = async () => {
    try {
      await sendToDepartment('sales', {
        type: 'announcement',
        title: 'Team Meeting',
        message: 'Sales team meeting scheduled for 3 PM today',
        data: { meetingRoom: 'Conference A', time: '3:00 PM' },
        icon: '📅'
      });
      console.log('✅ Department notification sent!');
    } catch (error) {
      console.error('❌ Failed to send department notification:', error);
    }
  };

  const sendBroadcastNotification = async () => {
    try {
      await broadcast({
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight from 12 AM to 2 AM',
        data: { maintenanceWindow: '12:00 AM - 2:00 AM' },
        icon: '🔧'
      });
      console.log('✅ Broadcast notification sent!');
    } catch (error) {
      console.error('❌ Failed to send broadcast:', error);
    }
  };

  // Helper function to get notification type color
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return '#dc3545';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'success': return '#28a745';
      case 'info': return '#17a2b8';
      case 'system': return '#6f42c1';
      case 'announcement': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px' }}>
      <h1>🔔 SSE Notifications Test - Mark as Read Demo</h1>
      
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
        {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error.message}</p>}
        
        <div style={{ gap: '10px', display: 'flex', marginTop: '10px' }}>
          <button 
            onClick={connect} 
            disabled={isConnected}
            style={{ 
              padding: '8px 16px', 
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'not-allowed' : 'pointer',
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
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isConnected ? 'not-allowed' : 'pointer',
              opacity: !isConnected ? 0.5 : 1
            }}
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Send Test Notifications */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        background: '#e8f5e8', 
        borderRadius: '8px'
      }}>
        <h3>📤 Send Test Notifications</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '10px' 
        }}>
          <button 
            onClick={sendTestNotification} 
            disabled={apiLoading}
            style={{ 
              padding: '10px', 
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: apiLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {apiLoading ? '⏳ Sending...' : '📨 Send Test Notification'}
          </button>
          
          <button 
            onClick={sendUrgentNotification} 
            disabled={apiLoading}
            style={{ 
              padding: '10px', 
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: apiLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {apiLoading ? '⏳ Sending...' : '🚨 Send Urgent Alert'}
          </button>
          
          <button 
            onClick={sendDepartmentNotification} 
            disabled={apiLoading}
            style={{ 
              padding: '10px', 
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: apiLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {apiLoading ? '⏳ Sending...' : '🏢 Send to Department'}
          </button>
          
          <button 
            onClick={sendBroadcastNotification} 
            disabled={apiLoading}
            style={{ 
              padding: '10px', 
              background: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: apiLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {apiLoading ? '⏳ Broadcasting...' : '📢 Broadcast Message'}
          </button>
        </div>
      </div>

      {/* Notification Management */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        background: '#fff3cd', 
        borderRadius: '8px'
      }}>
        <h3>📊 Mark as Read Demo</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
          <div>
            <strong>Total Notifications:</strong> {notifications.length}
          </div>
          <div>
            <strong>Unread:</strong> 
            <span style={{
              background: unreadCount > 0 ? '#dc3545' : '#28a745',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              marginLeft: '5px',
              fontSize: '12px'
            }}>
              {unreadCount}
            </span>
          </div>
        </div>
        
        <button 
          onClick={markAllAsRead}
          disabled={unreadCount === 0 || notifLoading}
          style={{ 
            padding: '8px 16px', 
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (unreadCount === 0 || notifLoading) ? 'not-allowed' : 'pointer',
            opacity: (unreadCount === 0 || notifLoading) ? 0.5 : 1
          }}
        >
          {notifLoading ? '⏳ Processing...' : `✅ Mark All as Read (${unreadCount})`}
        </button>
      </div>

      {/* Notifications List with Mark as Read Examples */}
      <div style={{ 
        padding: '15px', 
        background: '#f8f9fa', 
        borderRadius: '8px'
      }}>
        <h3>📋 Notifications - Click to Mark as Read</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
          💡 <strong>Instructions:</strong> Click on any unread notification to mark it as read. 
          Unread notifications have a colored left border and higher opacity.
        </p>
        
        <div style={{ 
          maxHeight: '500px', 
          overflowY: 'auto',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          background: 'white'
        }}>
          {notifications.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6c757d'
            }}>
              📭 No notifications yet.<br />
              <small>Send a test notification above to see it here!</small>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => !notification.read && markAsRead(notification.id)}
                style={{ 
                  border: '1px solid #dee2e6', 
                  borderRadius: '6px', 
                  padding: '15px', 
                  margin: '8px',
                  background: notification.read ? '#f8f9fa' : '#ffffff',
                  opacity: notification.read ? 0.7 : 1,
                  borderLeft: `4px solid ${notification.read ? '#6c757d' : getNotificationColor(notification.type)}`,
                  cursor: notification.read ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: notification.read ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginBottom: '8px' 
                    }}>
                      <span style={{ fontSize: '20px' }}>{notification.icon}</span>
                      <h4 style={{ margin: 0, color: '#333' }}>{notification.title}</h4>
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
                      {!notification.read && (
                        <span style={{
                          background: '#dc3545',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          UNREAD
                        </span>
                      )}
                    </div>
                    
                    <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                      {notification.message}
                    </p>
                    
                    <small style={{ color: '#999' }}>
                      🕐 {new Date(notification.createdAt).toLocaleString()}
                    </small>
                    
                    {notification.data && (
                      <details style={{ marginTop: '8px' }}>
                        <summary style={{ 
                          cursor: 'pointer', 
                          color: '#007bff',
                          fontSize: '12px'
                        }}>
                          📄 View Data
                        </summary>
                        <pre style={{ 
                          background: '#f1f1f1', 
                          padding: '8px', 
                          borderRadius: '4px', 
                          fontSize: '11px',
                          marginTop: '5px',
                          overflow: 'auto'
                        }}>
                          {JSON.stringify(notification.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  
                  <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {!notification.read ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        disabled={notifLoading}
                        style={{ 
                          padding: '4px 8px', 
                          fontSize: '11px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: notifLoading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {notifLoading ? '⏳' : '✓ Mark Read'}
                      </button>
                    ) : (
                      <span style={{ 
                        padding: '4px 8px', 
                        fontSize: '11px',
                        background: '#6c757d',
                        color: 'white',
                        borderRadius: '3px'
                      }}>
                        ✓ Read
                      </span>
                    )}
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      disabled={notifLoading}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '11px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: notifLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {notifLoading ? '⏳' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
                
                {!notification.read && (
                  <div style={{ 
                    marginTop: '10px', 
                    fontSize: '12px', 
                    color: '#007bff',
                    fontStyle: 'italic'
                  }}>
                    💡 Click anywhere on this notification to mark as read
                  </div>
                )}
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
      enableBrowserNotifications={true}
      onNotification={(notification) => {
        console.log('📨 New notification received:', notification);
        
        // Custom handling based on notification type
        if (notification.type === 'urgent') {
          console.log('🚨 URGENT NOTIFICATION - Needs immediate attention!');
        }
      }}
      onConnect={() => {
        console.log('✅ Connected to SSE notifications server');
      }}
      onDisconnect={() => {
        console.log('❌ Disconnected from SSE notifications server');
      }}
      onError={(error) => {
        console.error('❌ SSE Connection Error:', error);
      }}
    >
      <NotificationDemo />
    </SSEProvider>
  );
}
