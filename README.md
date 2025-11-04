 # @joemark0008/sse-notifications-react

A minimal React library for connecting to Server-Sent Events (SSE) notification servers. Simple, lightweight, and TypeScript-ready.

## Features

- 🚀 **Simple SSE Connection**: Easy provider/hook pattern for SSE connections
- 🔄 **Auto Reconnection**: Configurable reconnection with exponential backoff
- 🔔 **Browser Notifications**: Optional native browser notification support
- 📝 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🔐 **Secure Authentication**: Built-in API key authentication support
- 📱 **Mobile Friendly**: Works on all modern browsers and mobile devices

## Installation

```bash
npm install @joemark0008/sse-notifications-react
```

## Quick Start

```tsx
import React from 'react';
import { SSEProvider, useSSE } from '@joemark0008/sse-notifications-react';

// 1. Configure your connection
const config = {
  apiUrl: 'http://localhost:3000',
  userId: 'john_doe',
  appKey: 'your-api-key',        // Required
  appSecret: 'your-api-secret',  // Required
  autoConnect: true
};

// 2. Create a component that handles notifications
function NotificationHandler() {
  const { isConnected, connectionState, error } = useSSE();

  return (
    <div>
      <h3>Connection Status: {connectionState}</h3>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}

// 3. Wrap your app
export default function App() {
  return (
    <SSEProvider
      config={config}
      enableBrowserNotifications={true}
      onNotification={(notification) => {
        console.log('New notification:', notification);
        // Handle your notification here (show toast, update state, etc.)
      }}
      onConnect={() => console.log('✅ Connected')}
      onDisconnect={() => console.log('❌ Disconnected')}
      onError={(error) => console.error('SSE Error:', error)}
    >
      <NotificationHandler />
      <YourOtherComponents />
    </SSEProvider>
  );
}
```

**That's it! You're now receiving real-time notifications.** 🎉

## API Reference

### SSEProvider Props

```typescript
interface SSEProviderProps {
  children: ReactNode;
  config: SSEConfig;                           // Required: SSE configuration
  onNotification?: (notification: Notification) => void;  // Callback for new notifications
  onConnect?: () => void;                      // Callback on successful connection
  onDisconnect?: () => void;                   // Callback on disconnection
  onError?: (error: Error) => void;            // Callback on connection error
  enableBrowserNotifications?: boolean;        // Enable native browser notifications
}
```

### useSSE Hook

```typescript
const {
  config,           // SSEConfig | null - Current configuration
  connectionState,  // 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'
  isConnected,      // boolean - Whether currently connected
  error,            // Error | null - Last connection error
  connect,          // () => void - Manually connect
  disconnect        // () => void - Manually disconnect
} = useSSE();
```

### Configuration

```typescript
interface SSEConfig {
  apiUrl: string;                    // Backend API URL (required)
  userId: string;                    // Current user ID (required)
  appKey: string;                    // API key for authentication (required)
  appSecret: string;                 // API secret for authentication (required)
  departmentIds?: string | string[]; // Optional departments to subscribe to
  autoConnect?: boolean;             // Auto-connect on mount (default: true)
  autoReconnect?: boolean;           // Auto-reconnect on disconnect (default: true)
  maxReconnectAttempts?: number;     // Max retries (-1 = infinite, default: -1)
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

## Backend Requirements

Your backend should implement this SSE endpoint:

```
GET /notifications/subscribe?userId={userId}&departmentIds={ids}&appKey={key}&appSecret={secret}
```

The endpoint should:
- Accept Server-Sent Events connections
- Authenticate using `appKey` and `appSecret` query parameters
- Send notifications in this format:

```json
{
  "id": "notif-123",
  "userId": "john_doe",
  "type": "info",
  "title": "New Message",
  "message": "You have a new message",
  "data": { "actionUrl": "/messages/123" },
  "icon": "📬",
  "read": false,
  "delivered": true,
  "createdAt": "2024-01-01T12:00:00Z"
}
```

## Troubleshooting

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

## License

MIT © HISD3

## Support

- **Issues**: [GitHub Issues](https://github.com/joemark0008/sse-notifications-react/issues)
- **NPM Package**: [@joemark0008/sse-notifications-react](https://www.npmjs.com/package/@joemark0008/sse-notifications-react)

---

Made with ❤️ by HISD3

## Complete Setup Guide

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

### Step 3: Handle Notifications in Your Components

```tsx
import { useSSE } from '@joemark0008/sse-notifications-react';

function MyComponent() {
  const { isConnected, connectionState, connect, disconnect, error } = useSSE();

  return (
    <div>
      <div>Status: {connectionState}</div>
      <button onClick={connect} disabled={isConnected}>
        Connect
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

## API Reference

### SSEProvider Props

```typescript
interface SSEProviderProps {
  children: ReactNode;
  config: SSEConfig;                           // Required: SSE configuration
  onNotification?: (notification: Notification) => void;  // Callback for new notifications
  onConnect?: () => void;                      // Callback on successful connection
  onDisconnect?: () => void;                   // Callback on disconnection
  onError?: (error: Error) => void;            // Callback on connection error
  enableBrowserNotifications?: boolean;        // Enable native browser notifications
}
```

### useSSE Hook

```typescript
const {
  config,           // SSEConfig | null - Current configuration
  connectionState,  // 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'
  isConnected,      // boolean - Whether currently connected
  error,            // Error | null - Last connection error
  connect,          // () => void - Manually connect
  disconnect        // () => void - Manually disconnect
} = useSSE();
```

### Configuration

```typescript
interface SSEConfig {
  apiUrl: string;                    // Backend API URL (required)
  userId: string;                    // Current user ID (required)
  appKey: string;                    // API key for authentication (required)
  appSecret: string;                 // API secret for authentication (required)
  departmentIds?: string | string[]; // Optional departments to subscribe to
  autoConnect?: boolean;             // Auto-connect on mount (default: true)
  autoReconnect?: boolean;           // Auto-reconnect on disconnect (default: true)
  maxReconnectAttempts?: number;     // Max retries (-1 = infinite, default: -1)
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

## Authentication

The library requires API key authentication for secure communication with the backend.

### How It Works

**SSE Connection** uses query parameters (required by EventSource API):
```
GET /notifications/subscribe?userId=john_doe&departmentIds=sales,it&appKey=abc123&appSecret=xyz789
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

## Backend Requirements

Your backend should implement this SSE endpoint:

```
GET /notifications/subscribe?userId={userId}&departmentIds={ids}&appKey={key}&appSecret={secret}
```

The endpoint should:
- Accept Server-Sent Events connections
- Authenticate using `appKey` and `appSecret` query parameters
- Send notifications in this format:
```json
{
  "id": "notif-123",
  "userId": "john_doe",
  "type": "info",
  "title": "New Message",
  "message": "You have a new message",
  "data": { "actionUrl": "/messages/123" },
  "icon": "📬",
  "read": false,
  "delivered": true,
  "createdAt": "2024-01-01T12:00:00Z"
}
```

## Examples

### Basic Connection with Manual Controls

```tsx
import { useSSE } from '@joemark0008/sse-notifications-react';

function ConnectionControls() {
  const { isConnected, connectionState, connect, disconnect, error } = useSSE();

  return (
    <div>
      <div>Status: {connectionState}</div>
      <button onClick={connect} disabled={isConnected}>
        Connect
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </div>
  );
}
```

### Browser Notifications

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

### Notification Toast System

```tsx
import { SSEProvider } from '@joemark0008/sse-notifications-react';
import { useState } from 'react';

function NotificationToast() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 5000);
  };

  return (
    <SSEProvider
      config={config}
      onNotification={addNotification}
    >
      <div className="toast-container">
        {notifications.map(notif => (
          <div key={notif.id} className="toast">
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
          </div>
        ))}
      </div>
      <YourApp />
    </SSEProvider>
  );
}
```

## Troubleshooting

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

### Browser notifications not working?

1. **Check if HTTPS** - Browser notifications require HTTPS in production
2. **Request permission** - Call `Notification.requestPermission()` first
3. **Check permission status** - `Notification.permission` should be 'granted'

## License

MIT © HISD3

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/joemark0008/sse-notifications-react/issues)
- **NPM Package**: [@joemark0008/sse-notifications-react](https://www.npmjs.com/package/@joemark0008/sse-notifications-react)

---

Made with ❤️ by HISD3

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


    # @joemark0008/sse-notifications-react

    A React library for connecting to a Server-Sent Events (SSE) notification server in React. Minimal, simple, and TypeScript-ready.

    ## Installation

    ```bash
    npm install @joemark0008/sse-notifications-react
    ```

    ## Quick Start

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
      autoReconnect: true                // Auto-reconnect on disconnect
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

    **That's it! You're now receiving real-time notifications.** 🎉
    const users = await getConnectedUsers();
    console.log('Connected users:', users);
  };

  return (
    <div>
      <button onClick={loadHistory} disabled={isLoading}>
        Load History
      </button>
      <button onClick={loadStats} disabled={isLoading}>
        Load Stats
      </button>
      <button onClick={loadConnectedUsers} disabled={isLoading}>
        Debug: Connected Users
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

#### Traditional Hooks

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
  deleteNotification   // (id: string) => void - Client-side only!
} = useNotifications();
```

**Note**: `deleteNotification` only removes the notification from local state (UI) - it does not delete from the server as the API doesn't provide a delete endpoint.

#### `useNotificationAPI()`
Access API methods directly.

```tsx
const {
  // User notification methods
  getHistory,                    // (userId: string) => Promise<Notification[]>
  getStats,                      // (userId: string) => Promise<NotificationStats>
  getUnreadCount,                // (userId: string) => Promise<number>
  
  // Department methods
  getDepartmentHistory,          // (deptId: string, limit?: number) => Promise<Notification[]>
  
  // Debug methods
  getConnectedUsers,             // () => Promise<any> - All connected users
  
  // State
  isLoading,                     // boolean
  error                          // Error | null
} = useNotificationAPI();
```

#### TanStack Query Hooks (Recommended)

##### Query Hooks

```tsx
// Notification history with caching
const { data, isLoading, refetch } = useNotificationHistory(userId?, options?);

// Notification stats
const { data, isLoading, refetch } = useNotificationStats(userId?, options?);

// Unread count (auto-refreshes every 30s)
const { data, isLoading } = useUnreadCount(userId?, options?);

// Department history (with optional limit)
const { data, isLoading } = useDepartmentHistory(departmentId?, { limit: 50, enabled: true });

// Connected users (debug endpoint)
const { data, isLoading } = useConnectedUsers(options?);
```

##### Mutation Hooks

```tsx
// Mark as read
const { mutate, isPending, isSuccess } = useMarkAsReadMutation();
mutate(notificationId);

// Mark all as read
const { mutate, isPending } = useMarkAllAsReadMutation();
mutate(userId?); // optional, uses config userId if not provided
```

##### Query Keys

```tsx
import { notificationKeys } from '@joemark0008/sse-notifications-react';

// For advanced cache management
queryClient.invalidateQueries({ queryKey: notificationKeys.history(userId) });
queryClient.setQueryData(notificationKeys.stats(userId), newData);
queryClient.invalidateQueries({ queryKey: notificationKeys.connectedUsers() });
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
```

### Department Endpoints
```
GET /department-notifications/{departmentId}/history?limit=50  - Get department history
```

### Debug Endpoints
```
GET /notifications/debug/connected-users  - Get all connected users
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

### ✨ Key Features (v1.3.0)
- **TanStack Query Integration**: Automatic caching and optimistic updates
- **API Alignment**: Now matches actual backend API endpoints
- **Mark as Read**: Full server-side notification tracking
- **Client-Side Filtering**: Remove notifications from UI with `deleteNotification()`

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
