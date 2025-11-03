 # @joemark0008/sse-notifications-react

A React library for managing Server-Sent Events (SSE) notifications with hooks and provider pattern. Perfect for real-time notification systems with TypeScript support.

## Features

- 🚀 **Easy SSE Management**: Simple provider/hook pattern for SSE connections
- 🔄 **Auto Reconnection**: Configurable reconnection with exponential backoff
- 💾 **State Management**: Built-in notification state management
- 🎯 **Multi-target Notifications**: Support for user, department, and broadcast notifications
- 📝 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🎛️ **Flexible Configuration**: Extensive configuration options
- 🔧 **API Integration**: Complete notification API client included
- 🔔 **Browser Notifications**: Optional native browser notification support
- 📱 **Mobile Friendly**: Works on all modern browsers and mobile devices

## Installation

```bash
npm install @joemark0008/sse-notifications-react
```

## ⚡ Quick Start (30 seconds)

```tsx
import React from 'react';
import { SSEProvider, useSSE, useNotifications } from '@joemark0008/sse-notifications-react';

// 1. Configure your connection
const config = {
  apiUrl: 'http://localhost:3000',
  userId: 'your-user-id'
};

// 2. Create a notification component
function MyNotifications() {
  const { isConnected } = useSSE();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div>
      <h3>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</h3>
      <p>Unread: {unreadCount}</p>
      
      {notifications.map(notif => (
        <div key={notif.id} onClick={() => markAsRead(notif.id)}>
          <h4>{notif.title}</h4>
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  );
}

// 3. Wrap your app
export default function App() {
  return (
    <SSEProvider config={config}>
      <MyNotifications />
    </SSEProvider>
  );
}
```

**That's it! You're now receiving real-time notifications.** 🎉

## Quick Start

### 1. Wrap your app with SSEProvider

```tsx
import React from 'react';
import { SSEProvider } from '@joemark0008/sse-notifications-react';
import type { SSEConfig } from '@joemark0008/sse-notifications-react';

const config: SSEConfig = {
  apiUrl: 'http://localhost:3000',
  userId: 'user123',
  departmentIds: ['dept1', 'dept2'], // Optional
  autoConnect: true,
  autoReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000
};

function App() {
  return (
    <SSEProvider 
      config={config}
      enableBrowserNotifications={true} // Enable native browser notifications
      onNotification={(notification) => console.log('New notification:', notification)}
      onConnect={() => console.log('✅ Connected to SSE')}
      onDisconnect={() => console.log('❌ Disconnected from SSE')}
      onError={(error) => console.error('❌ SSE Error:', error)}
    >
      <YourAppComponents />
    </SSEProvider>
  );
}
```

### 2. Use hooks in your components

```tsx
import React from 'react';
import { useSSE, useNotifications, useNotificationAPI } from '@joemark0008/sse-notifications-react';

function NotificationComponent() {
  const { isConnected, connectionState, connect, disconnect } = useSSE();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { sendToUser, broadcast } = useNotificationAPI();

  const handleSendNotification = async () => {
    await sendToUser('user456', {
      type: 'info',
      title: 'Hello!',
      message: 'This is a test notification',
      data: { custom: 'data' }
    });
  };

  return (
    <div>
      <h3>Connection Status: {connectionState}</h3>
      <p>Unread Notifications: {unreadCount}</p>
      
      <button onClick={connect} disabled={isConnected}>
        Connect
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>
      <button onClick={handleSendNotification}>
        Send Test Notification
      </button>
      <button onClick={markAllAsRead}>
        Mark All as Read
      </button>

      <div>
        {notifications.map((notification) => (
          <div key={notification.id} style={{ opacity: notification.read ? 0.5 : 1 }}>
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <button onClick={() => markAsRead(notification.id)}>
              Mark as Read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Browser Notifications

The library supports native browser notifications to alert users even when your app is not in focus.

### Setup Browser Notifications

```tsx
import { SSEProvider, requestNotificationPermission } from '@joemark0008/sse-notifications-react';

function App() {
  useEffect(() => {
    // Request permission on app load
    const setupNotifications = async () => {
      try {
        const permission = await requestNotificationPermission();
        console.log('Notification permission:', permission);
      } catch (error) {
        console.warn('Notifications not supported:', error);
      }
    };
    
    setupNotifications();
  }, []);

  return (
    <SSEProvider 
      config={config}
      enableBrowserNotifications={true} // Enable browser notifications
      onNotification={(notification) => {
        // Custom handling for different notification types
        if (notification.type === 'urgent') {
          // Play sound or show additional UI for urgent notifications
          playUrgentSound();
        }
      }}
    >
      <YourApp />
    </SSEProvider>
  );
}
```

### Browser Notification Features

- **Auto Permission Request**: Automatically requests permission when needed
- **Smart Deduplication**: Uses notification tags to prevent duplicates
- **Type-based Behavior**: Urgent/error notifications require user interaction
- **Custom Icons**: Supports custom notification icons
- **Fallback Handling**: Gracefully handles unsupported browsers

## API Reference

### SSEProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | ✅ | React children components |
| `config` | `SSEConfig` | ✅ | SSE configuration object |
| `onNotification` | `(notification: Notification) => void` | ❌ | Callback when notification received |
| `onConnect` | `() => void` | ❌ | Callback when SSE connected |
| `onDisconnect` | `() => void` | ❌ | Callback when SSE disconnected |
| `onError` | `(error: Error) => void` | ❌ | Callback when SSE error occurs |
| `enableBrowserNotifications` | `boolean` | ❌ | Enable native browser notifications (default: false) |

### SSEConfig

```typescript
interface SSEConfig {
  apiUrl: string;                    // Base API URL
  userId: string;                    // User ID for notifications
  departmentIds?: string | string[]; // Department IDs (optional)
  autoConnect?: boolean;             // Auto-connect on mount (default: true)
  autoReconnect?: boolean;           // Auto-reconnect on disconnect (default: true)
  maxReconnectAttempts?: number;     // Max reconnect attempts (-1 for infinite)
  reconnectDelay?: number;           // Initial reconnect delay in ms (default: 1000)
  maxReconnectDelay?: number;        // Max reconnect delay in ms (default: 30000)
}
```

### Hooks

#### useSSE()

Manages SSE connection state and controls.

```typescript
const {
  connectionState,  // 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'
  isConnected,      // boolean
  error,            // Error | null
  connect,          // () => void
  disconnect        // () => void
} = useSSE();
```

#### useNotifications()

Manages notification state and actions.

```typescript
const {
  notifications,        // Notification[]
  unreadCount,         // number
  stats,               // NotificationStats | null
  isLoading,           // boolean
  error,               // Error | null
  markAsRead,          // (notificationId: string) => Promise<void>
  markAllAsRead,       // () => Promise<void>
  deleteNotification   // (notificationId: string) => Promise<void>
} = useNotifications();
```

#### useNotificationAPI()

Provides API methods for sending and managing notifications.

```typescript
const {
  // Sending notifications
  sendToUser,                    // (userId: string, notification: SendNotificationBody) => Promise<any>
  sendToUsers,                   // (body: SendBulkNotificationsBody) => Promise<any>
  sendToDepartment,              // (departmentId: string, notification: SendNotificationBody) => Promise<any>
  sendToMultipleDepartments,     // (body: SendMultipleDepartmentsBody) => Promise<any>
  broadcast,                     // (notification: SendNotificationBody) => Promise<any>
  
  // Getting notifications
  getHistory,                    // (userId: string) => Promise<Notification[]>
  getWaiting,                    // (userId: string) => Promise<NotificationsListResponse>
  getDelivered,                  // (userId: string) => Promise<NotificationsListResponse>
  getStats,                      // (userId: string) => Promise<NotificationStats>
  
  // Admin operations
  deleteOldNotifications,        // (userId: string) => Promise<any>
  getAllNotifications,           // () => Promise<Notification[]>
  clearAllNotifications,         // () => Promise<any>
  getAdminQueues,               // () => Promise<any>
  
  // State
  isLoading,                     // boolean
  error                          // Error | null
} = useNotificationAPI();
```

## Types

### Notification

```typescript
interface Notification {
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
```

### SendNotificationBody

```typescript
interface SendNotificationBody {
  type: string;
  title: string;
  message: string;
  data?: any;
  icon?: string;
}
```

## Advanced Usage

### Complete Usage Guide

#### 1. Basic Implementation

```tsx
// App.tsx
import React from 'react';
import { SSEProvider, useSSE, useNotifications } from '@joemark0008/sse-notifications-react';
import type { SSEConfig } from '@joemark0008/sse-notifications-react';

const config: SSEConfig = {
  apiUrl: 'http://localhost:3000',
  userId: 'user123',
  departmentIds: ['sales'],
  autoConnect: true,
  autoReconnect: true
};

function NotificationComponent() {
  const { isConnected, connectionState } = useSSE();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div>
      <h2>Status: {connectionState}</h2>
      <p>Unread: {unreadCount}</p>
      
      {notifications.map(notification => (
        <div key={notification.id} style={{
          padding: '10px',
          border: '1px solid #ddd',
          margin: '5px 0',
          background: notification.read ? '#f9f9f9' : '#fff'
        }}>
          <h4>{notification.icon} {notification.title}</h4>
          <p>{notification.message}</p>
          <small>{new Date(notification.createdAt).toLocaleString()}</small>
          {!notification.read && (
            <button onClick={() => markAsRead(notification.id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <SSEProvider config={config}>
      <NotificationComponent />
    </SSEProvider>
  );
}
```

#### 2. Sending Notifications

```tsx
import { useNotificationAPI } from '@joemark0008/sse-notifications-react';

function AdminPanel() {
  const { sendToUser, sendToDepartment, broadcast, isLoading } = useNotificationAPI();

  const sendUserNotification = async () => {
    await sendToUser('user456', {
      type: 'info',
      title: 'New Task',
      message: 'You have a new task assigned',
      data: { taskId: 'TASK-123' },
      icon: '📋'
    });
  };

  const sendDepartmentNotification = async () => {
    await sendToDepartment('sales', {
      type: 'announcement',
      title: 'Team Meeting',
      message: 'Meeting at 3 PM today',
      icon: '📅'
    });
  };

  const sendBroadcast = async () => {
    await broadcast({
      type: 'system',
      title: 'Maintenance',
      message: 'System maintenance at midnight',
      icon: '🔧'
    });
  };

  return (
    <div>
      <button onClick={sendUserNotification} disabled={isLoading}>
        Send to User
      </button>
      <button onClick={sendDepartmentNotification} disabled={isLoading}>
        Send to Department
      </button>
      <button onClick={sendBroadcast} disabled={isLoading}>
        Broadcast
      </button>
    </div>
  );
}
```

#### 3. With Browser Notifications

```tsx
import { SSEProvider, requestNotificationPermission } from '@joemark0008/sse-notifications-react';

function App() {
  useEffect(() => {
    // Request browser notification permission
    requestNotificationPermission()
      .then(permission => console.log('Permission:', permission))
      .catch(error => console.warn('Not supported:', error));
  }, []);

  return (
    <SSEProvider 
      config={config}
      enableBrowserNotifications={true}
      onNotification={(notification) => {
        console.log('New notification:', notification);
        
        // Custom handling by type
        if (notification.type === 'urgent') {
          // Play sound, show modal, etc.
          playUrgentSound();
        }
      }}
    >
      <YourApp />
    </SSEProvider>
  );
}
```

#### 4. Advanced Configuration

```tsx
const advancedConfig: SSEConfig = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  userId: 'current-user-id',
  departmentIds: ['engineering', 'product', 'design'],
  autoConnect: true,
  autoReconnect: true,
  maxReconnectAttempts: 10,
  reconnectDelay: 2000,
  maxReconnectDelay: 60000
};

function NotificationCenter() {
  const { isConnected, connectionState, connect, disconnect, error } = useSSE();
  const { 
    notifications, 
    unreadCount, 
    stats, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const { getHistory, getStats } = useNotificationAPI();

  return (
    <div className="notification-center">
      {/* Connection Status */}
      <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
        Status: {connectionState}
        {error && <div className="error">Error: {error.message}</div>}
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={connect} disabled={isConnected}>Connect</button>
        <button onClick={disconnect} disabled={!isConnected}>Disconnect</button>
        <button onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark All Read ({unreadCount})
        </button>
      </div>

      {/* Notifications */}
      <div className="notifications">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            <h4>{notification.icon} {notification.title}</h4>
            <p>{notification.message}</p>
            <div className="actions">
              {!notification.read && (
                <button onClick={() => markAsRead(notification.id)}>Mark Read</button>
              )}
              <button onClick={() => deleteNotification(notification.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 5. TypeScript Support

```tsx
import type { 
  SSEConfig,
  Notification,
  SendNotificationBody,
  NotificationStats
} from '@joemark0008/sse-notifications-react';

// Fully typed configuration
const config: SSEConfig = {
  apiUrl: 'http://localhost:3000',
  userId: 'user123',
  departmentIds: ['sales', 'engineering'],
  autoConnect: true
};

// Typed notification
const notification: SendNotificationBody = {
  type: 'info',
  title: 'Hello',
  message: 'World',
  data: { customData: 'value' },
  icon: '🚀'
};
```

#### 6. Backend Integration

Your backend should provide the SSE endpoint:

```javascript
// Express.js example
app.get('/notifications/subscribe', (req, res) => {
  const { userId, departmentIds } = req.query;
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send notifications as JSON
  const notification = {
    id: 'notif_123',
    userId: userId,
    type: 'info',
    title: 'Hello',
    message: 'New notification!',
    icon: '🔔',
    read: false,
    delivered: true,
    createdAt: new Date().toISOString()
  };

  res.write(`data: ${JSON.stringify(notification)}\n\n`);
});
```

### More Advanced Examples

### Custom Event Handlers

```tsx
<SSEProvider
  config={config}
  onNotification={(notification) => {
    // Show toast notification
    toast.info(notification.message);
    
    // Play sound for important notifications
    if (notification.type === 'urgent') {
      playNotificationSound();
    }
  }}
  onError={(error) => {
    // Log to error monitoring service
    errorLogger.log(error);
  }}
>
  <App />
</SSEProvider>
```

### Multiple Department Subscriptions

```tsx
const config: SSEConfig = {
  apiUrl: 'http://localhost:3000',
  userId: 'user123',
  departmentIds: ['sales', 'marketing', 'support'], // Subscribe to multiple departments
  autoConnect: true
};
```

### Manual Connection Management

```tsx
const config: SSEConfig = {
  apiUrl: 'http://localhost:3000',
  userId: 'user123',
  autoConnect: false, // Don't auto-connect
  autoReconnect: false // Don't auto-reconnect
};

function ManualConnectionComponent() {
  const { isConnected, connect, disconnect } = useSSE();
  
  return (
    <div>
      <button onClick={connect} disabled={isConnected}>
        Connect to Notifications
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>
    </div>
  );
}
```

### Sending Notifications

```tsx
function AdminPanel() {
  const { sendToUser, sendToDepartment, broadcast } = useNotificationAPI();
  
  const notifyUser = async () => {
    await sendToUser('user456', {
      type: 'info',
      title: 'Personal Message',
      message: 'You have a new task assigned',
      data: { taskId: '123' }
    });
  };
  
  const notifyDepartment = async () => {
    await sendToDepartment('sales', {
      type: 'announcement',
      title: 'Sales Meeting',
      message: 'Team meeting at 3 PM today',
      icon: '📅'
    });
  };
  
  const broadcastMessage = async () => {
    await broadcast({
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight at 12 AM',
      icon: '🔧'
    });
  };

  return (
    <div>
      <button onClick={notifyUser}>Notify User</button>
      <button onClick={notifyDepartment}>Notify Department</button>
      <button onClick={broadcastMessage}>Broadcast Message</button>
    </div>
  );
}
```

## Backend Integration

Your SSE endpoint should be accessible at `/notifications/subscribe` and accept the following query parameters:

- `userId`: Required user ID
- `departmentIds`: Optional comma-separated department IDs

Example SSE endpoint URL:
```
GET /notifications/subscribe?userId=user123&departmentIds=dept1,dept2
```

The endpoint should send notifications in this format:
```json
{
  "id": "notif_123",
  "userId": "user123",
  "type": "info",
  "title": "New Message",
  "message": "You have received a new message",
  "data": { "messageId": "msg_456" },
  "icon": "💬",
  "read": false,
  "delivered": true,
  "createdAt": "2023-11-03T10:30:00Z"
}
```

## API Endpoints

The library expects these endpoints to be available:

- `GET /notifications/subscribe` - SSE endpoint for real-time notifications
- `POST /notifications/user/:userId` - Send notification to specific user
- `POST /notifications/users` - Send notification to multiple users
- `POST /notifications/department/:departmentId` - Send notification to department
- `POST /notifications/departments` - Send notification to multiple departments
- `POST /notifications/broadcast` - Broadcast notification to all users
- `GET /notifications/user/:userId/history` - Get user's notification history
- `GET /notifications/user/:userId/waiting` - Get waiting notifications
- `GET /notifications/user/:userId/delivered` - Get delivered notifications
- `GET /notifications/user/:userId/stats` - Get notification statistics
- `GET /notifications/user/:userId/unread-count` - Get unread count
- `POST /notifications/:notificationId/read` - Mark notification as read
- `POST /notifications/user/:userId/mark-all-read` - Mark all as read
- `POST /notifications/:notificationId/delete` - Delete notification
- `POST /notifications/user/:userId/delete-old` - Delete old notifications
- `GET /notifications/all` - Get all notifications (admin)
- `POST /notifications/clear-all` - Clear all notifications (admin)
- `GET /admin/queues` - Get admin queue information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © HISD3

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/hisd3/sse-notifications-react/issues) page.
