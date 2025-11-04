 # @joemark0008/sse-notifications-react

A React library for managing Server-Sent Events (SSE) notifications with hooks and provider pattern. Perfect for real-time notification systems with TypeScript support.

## Features

- 🚀 **Easy SSE Management**: Simple provider/hook pattern for SSE connections
- 🔄 **Auto Reconnection**: Configurable reconnection with exponential backoff
- 💾 **State Management**: Built-in notification state management
- 🎯 **Multi-target Notifications**: Support for user and department notifications
- 📝 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🔧 **API Integration**: Complete notification API client included
- 🔔 **Browser Notifications**: Optional native browser notification support
- 🔐 **Secure Authentication**: Built-in API key authentication support
- ✅ **Mark as Read & Delete**: Full notification lifecycle management
- 📱 **Mobile Friendly**: Works on all modern browsers and mobile devices

## Installation

```bash
npm install @joemark0008/sse-notifications-react
```

## ⚡ Quick Start (Simple Example)

```tsx
import React from 'react';
import { SSEProvider, useSSE, useNotifications } from '@joemark0008/sse-notifications-react';

// 1. Configure your connection
const config = {
  apiUrl: 'http://localhost:3000',
  userId: 'john_doe',
  appKey: 'your-api-key',        // Required
  appSecret: 'your-api-secret',  // Required
  autoConnect: true
};

// 2. Create a notification component
function Notifications() {
  const { isConnected } = useSSE();
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();

  return (
    <div>
      <h3>{isConnected ? '🟢 Connected' : '🔴 Disconnected'}</h3>
      <p>Unread: {unreadCount}</p>
      
      {notifications.map(notif => (
        <div key={notif.id} style={{ padding: '10px', border: '1px solid #ddd', margin: '5px' }}>
          <h4>{notif.title}</h4>
          <p>{notif.message}</p>
          {!notif.read && (
            <button onClick={() => markAsRead(notif.id)}>✓ Mark Read</button>
          )}
          <button onClick={() => deleteNotification(notif.id)}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
}

// 3. Wrap your app
export default function App() {
  return (
    <SSEProvider config={config}>
      <Notifications />
    </SSEProvider>
  );
}
```

**That's it! You're now receiving real-time notifications.** 🎉

## 📋 Complete Setup Guide

### Step 1: Install the Package

```bash
npm install @joemark0008/sse-notifications-react
```

### Step 2: Wrap Your App with SSEProvider

```tsx
import React from 'react';
import { SSEProvider } from '@joemark0008/sse-notifications-react';

const config = {
  apiUrl: 'http://localhost:3000',  // Your backend URL
  userId: 'john_doe',                // Current user ID
  appKey: 'your-api-key',            // Your API key
  appSecret: 'your-api-secret',      // Your API secret
  departmentIds: ['sales', 'it'],    // Optional: departments to subscribe to
  autoConnect: true,                 // Auto-connect on mount
  autoReconnect: true               // Auto-reconnect on disconnect
};

function App() {
  return (
    <SSEProvider 
      config={config}
      enableBrowserNotifications={true}
      onNotification={(notif) => console.log('New notification:', notif)}
      onConnect={() => console.log('✅ Connected')}
      onDisconnect={() => console.log('❌ Disconnected')}
    >
      <YourAppComponents />
    </SSEProvider>
  );
}

export default App;
```

### Step 3: Use Notifications in Your Components

```tsx
import { useSSE, useNotifications } from '@joemark0008/sse-notifications-react';

function NotificationBell() {
  const { isConnected } = useSSE();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  return (
    <div>
      {/* Connection Status */}
      <div>{isConnected ? '🟢 Online' : '🔴 Offline'}</div>
      
      {/* Unread Badge */}
      <div className="badge">{unreadCount}</div>
      
      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <button onClick={markAllAsRead}>Mark All Read</button>
      )}
      
      {/* Notifications List */}
      {notifications.map(notification => (
        <div 
          key={notification.id}
          style={{ opacity: notification.read ? 0.6 : 1 }}
        >
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
          <small>{new Date(notification.createdAt).toLocaleString()}</small>
          
          {/* Actions */}
          <div>
            {!notification.read && (
              <button onClick={() => markAsRead(notification.id)}>
                ✓ Mark Read
              </button>
            )}
            <button onClick={() => deleteNotification(notification.id)}>
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Step 4: Use API Methods (Optional)

```tsx
import { useNotificationAPI } from '@joemark0008/sse-notifications-react';

function NotificationPanel() {
  const { 
    getHistory, 
    getStats, 
    getUnreadCount,
    deleteOldNotifications,
    getDepartmentHistory,
    isLoading 
  } = useNotificationAPI();

  const loadHistory = async () => {
    const history = await getHistory('john_doe');
    console.log('History:', history);
  };

  const loadStats = async () => {
    const stats = await getStats('john_doe');
    console.log('Stats:', stats);
  };

  const cleanOldNotifications = async () => {
    await deleteOldNotifications('john_doe');
    console.log('Old notifications deleted');
  };

  return (
    <div>
      <button onClick={loadHistory} disabled={isLoading}>
        Load History
      </button>
      <button onClick={loadStats} disabled={isLoading}>
        Load Stats
      </button>
      <button onClick={cleanOldNotifications} disabled={isLoading}>
        Clean Old
      </button>
    </div>
  );
}
```

## 🔑 Authentication

The library requires API key authentication for secure communication with the backend.

### How Authentication Works

**SSE Connection** (uses query parameters):
```
GET /notifications/subscribe?userId=john_doe&departmentIds=sales,it&appKey=abc123&appSecret=xyz789
```

**API Requests** (uses headers):
```bash
POST /user-notifications/notif123/read
Headers:
  x-app-key: abc123
  x-app-secret: xyz789
  Content-Type: application/json
```

### Configuration Example

```tsx
const config = {
  apiUrl: 'http://localhost:3000',
  userId: 'john_doe',
  appKey: 'your-api-key',       // Required for authentication
  appSecret: 'your-api-secret'  // Required for authentication
};
```

The library automatically handles authentication for you - just provide the credentials in the config! 🔐

## 💾 Notification Persistence

Notifications are **automatically persisted** and loaded when your app starts!

### How It Works

```
1. App Mounts
     ↓
2. Fetch All Historical Notifications
   (GET /user-notifications/{userId}/history)
     ↓
3. Load into State (includes unread count)
     ↓
4. Connect to SSE for Real-Time Updates
     ↓
5. ✅ Ready! (Past + Future notifications)
```

### What This Means

- ✅ **No lost notifications** - Everything is saved on the backend
- ✅ **Survives page refresh** - All notifications reload automatically
- ✅ **Correct unread count** - Calculated from historical data
- ✅ **Fast loading** - API call happens in parallel with SSE connection

### Example

```tsx
// When your app starts:
<SSEProvider config={config}>
  {/* Component automatically:
      1. Loads all past notifications from API
      2. Connects to SSE for new ones
      3. Merges both seamlessly
  */}
  <YourApp />
</SSEProvider>
```

You don't need to do anything - it just works! 🎉

## 📚 API Reference

### Available Hooks

#### `useSSE()`
Manage SSE connection state.

```tsx
const { 
  connectionState,  // 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'
  isConnected,      // boolean
  error,            // Error | null
  connect,          // () => void
  disconnect        // () => void
} = useSSE();
```

#### `useNotifications()`
Manage notifications and actions.

```tsx
const {
  notifications,        // Notification[] - All notifications
  unreadCount,         // number - Count of unread notifications
  stats,               // NotificationStats | null
  isLoading,           // boolean - API call in progress
  error,               // Error | null - Last error
  markAsRead,          // (id: string) => Promise<void>
  markAllAsRead,       // () => Promise<void>
  deleteNotification   // (id: string) => Promise<void>
} = useNotifications();
```

#### `useNotificationAPI()`
Access API methods directly.

```tsx
const {
  // User notification methods
  getHistory,                    // (userId: string) => Promise<Notification[]>
  getStats,                      // (userId: string) => Promise<NotificationStats>
  getUnreadCount,                // (userId: string) => Promise<number>
  deleteOldNotifications,        // (userId: string) => Promise<any>
  
  // Department methods
  getDepartmentHistory,          // (deptId: string) => Promise<Notification[]>
  getDepartmentSubscribers,      // (deptId: string) => Promise<number>
  
  // State
  isLoading,                     // boolean
  error                          // Error | null
} = useNotificationAPI();
```

### Configuration

```typescript
interface SSEConfig {
  apiUrl: string;                    // Backend API URL
  userId: string;                    // Current user ID
  appKey: string;                    // API key (required)
  appSecret: string;                 // API secret (required)
  departmentIds?: string | string[]; // Optional departments
  autoConnect?: boolean;             // Auto-connect on mount (default: true)
  autoReconnect?: boolean;           // Auto-reconnect (default: true)
  maxReconnectAttempts?: number;     // Max retries (-1 = infinite)
  reconnectDelay?: number;           // Initial delay in ms (default: 1000)
  maxReconnectDelay?: number;        // Max delay in ms (default: 30000)
}
```

### Notification Object

```typescript
interface Notification {
  id: string;              // Unique notification ID
  userId: string;          // Target user ID
  type: string;            // Notification type (info, warning, error, etc.)
  title: string;           // Notification title
  message: string;         // Notification message
  data?: any;              // Optional custom data
  icon?: string;           // Optional icon (emoji or URL)
  read: boolean;           // Read status
  delivered: boolean;      // Delivery status
  consumedAt?: string;     // When notification was read
  createdAt: string;       // When notification was created
}
```

### SSEProvider Props

```typescript
<SSEProvider
  config={sseConfig}                           // Required: SSE configuration
  enableBrowserNotifications={true}            // Optional: Enable browser notifications
  onNotification={(notif) => {}}               // Optional: Callback for new notifications
  onConnect={() => {}}                         // Optional: Callback on connect
  onDisconnect={() => {}}                      // Optional: Callback on disconnect
  onError={(error) => {}}                      // Optional: Callback on error
>
  {children}
</SSEProvider>
```

## 🔌 Backend API Endpoints

Your backend should implement these endpoints:

### SSE Connection
```
GET /notifications/subscribe?userId={userId}&departmentIds={ids}&appKey={key}&appSecret={secret}
```

### User Notification Endpoints
```
GET  /user-notifications/{userId}/history          - Get notification history
GET  /user-notifications/{userId}/stats            - Get statistics
GET  /user-notifications/{userId}/unread-count     - Get unread count
POST /user-notifications/{notificationId}/read     - Mark as read
POST /user-notifications/{userId}/mark-all-read    - Mark all as read
POST /user-notifications/{notificationId}/delete   - Delete notification
POST /user-notifications/{userId}/delete-old       - Delete old notifications
```

### Department Endpoints
```
GET /department-notifications/{departmentId}/history      - Get department history
GET /department-notifications/{departmentId}/subscribers  - Get subscriber count
```

### Authentication

All API endpoints (except SSE) require these headers:
```
x-app-key: your-api-key
x-app-secret: your-api-secret
```

The SSE endpoint uses query parameters for authentication (due to EventSource API limitations).

## 🎨 Advanced Examples

### Example 1: Notification Bell with Dropdown

```tsx
import { useSSE, useNotifications } from '@joemark0008/sse-notifications-react';
import { useState } from 'react';

function NotificationBell() {
  const { isConnected } = useSSE();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-bell">
      <button onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="dropdown">
          <div className="header">
            <h3>Notifications</h3>
            <span className={isConnected ? 'online' : 'offline'}>
              {isConnected ? '🟢' : '🔴'}
            </span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead}>Mark All Read</button>
            )}
          </div>

          <div className="list">
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notification ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="icon">{notif.icon || '📬'}</div>
                  <div className="content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Using with React Router

```tsx
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@joemark0008/sse-notifications-react';

function NotificationList() {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();

  const handleNotificationClick = async (notification) => {
    // Mark as read
    await markAsRead(notification.id);
    
    // Navigate based on notification data
    if (notification.data?.route) {
      navigate(notification.data.route);
    }
  };

  return (
    <div>
      {notifications.map(notif => (
        <div
          key={notif.id}
          onClick={() => handleNotificationClick(notif)}
          style={{ cursor: 'pointer' }}
        >
          <h4>{notif.title}</h4>
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Browser Notifications

```tsx
import { SSEProvider } from '@joemark0008/sse-notifications-react';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <SSEProvider
      config={config}
      enableBrowserNotifications={true}
      onNotification={(notif) => {
        // Custom handling
        if (notif.type === 'urgent') {
          // Play sound or show modal
          new Audio('/alert.mp3').play();
        }
      }}
    >
      <YourApp />
    </SSEProvider>
  );
}
```

### Example 4: Manual Connection Control

```tsx
import { useSSE, useNotifications } from '@joemark0008/sse-notifications-react';

function ConnectionControls() {
  const { isConnected, connectionState, connect, disconnect, error } = useSSE();
  const { notifications } = useNotifications();

  return (
    <div>
      <div className="status">
        Status: {connectionState}
        {error && <span className="error">{error.message}</span>}
      </div>

      <div className="controls">
        <button onClick={connect} disabled={isConnected}>
          Connect
        </button>
        <button onClick={disconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>

      <p>Loaded {notifications.length} notifications</p>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Notifications not appearing?

1. **Check browser console** for error messages
2. **Verify backend is running** on the correct URL
3. **Check CORS settings** on your backend
4. **Verify authentication** - appKey and appSecret are correct
5. **Test the SSE endpoint** directly in browser:
   ```
   http://localhost:3000/notifications/subscribe?userId=john_doe&appKey=key&appSecret=secret
   ```

### Connection keeps dropping?

1. **Check network stability**
2. **Increase reconnect attempts** in config:
   ```tsx
   maxReconnectAttempts: 10,
   maxReconnectDelay: 60000
   ```
3. **Check backend timeout settings**
4. **Look for backend errors** in server logs

### Unread count incorrect?

1. **Refresh the page** to reload from API
2. **Check backend** `/user-notifications/{userId}/history` endpoint
3. **Verify read status** is properly saved on backend

### TypeScript errors?

```tsx
import type { SSEConfig, Notification } from '@joemark0008/sse-notifications-react';
```

## 🚀 What's New in v1.1.0

### ✨ New Features
- **Delete Notifications**: Now you can permanently delete notifications from the UI
- **Improved State Management**: Notifications are properly removed from state when deleted
- **Better Type Safety**: Enhanced TypeScript definitions

### 🔄 Breaking Changes (Removed in v1.1.0)
The following methods have been **removed** as the backend no longer supports notification sending from the client:
- ❌ `sendToUser` 
- ❌ `sendToUsers`
- ❌ `sendToDepartment`
- ❌ `sendToMultipleDepartments`
- ❌ `broadcast`

**New API Structure:**
- User endpoints: `/user-notifications/{userId}/*`
- Department endpoints: `/department-notifications/{departmentId}/*`

See [CHANGELOG.md](./CHANGELOG.md) for full migration guide.

## 📄 License

MIT © HISD3

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/joemark0008/sse-notifications-react/issues)
- **NPM Package**: [@joemark0008/sse-notifications-react](https://www.npmjs.com/package/@joemark0008/sse-notifications-react)

---

Made with ❤️ by HISD3
