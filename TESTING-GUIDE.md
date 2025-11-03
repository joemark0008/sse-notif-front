# 🔔 SSE Notifications Package - Mark as Read Testing Guide

## 🚀 Quick Setup & Testing

### 1. **Start Your Backend**
Make sure your backend is running with SSE endpoint at:
```
http://localhost:3000/notifications/subscribe
```

### 2. **Install & Run the Test App**
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. **Open in Browser**
Go to `http://localhost:5173` to see the test interface.

## 📋 Mark as Read Testing Scenarios

### **Scenario 1: Individual Mark as Read**
1. **Send a test notification** by clicking "📨 Send Test Notification"
2. **Observe the unread notification** - it will have:
   - Colored left border (blue for info, red for urgent, etc.)
   - "UNREAD" badge
   - Higher opacity
   - "Mark Read" button
3. **Click the "✓ Mark Read" button** or **click anywhere on the notification**
4. **Verify the notification is marked as read**:
   - Border becomes gray
   - "UNREAD" badge disappears
   - Opacity reduces
   - Button changes to "✓ Read"

### **Scenario 2: Mark All as Read**
1. **Send multiple notifications** using different buttons
2. **Check the unread counter** in the management section
3. **Click "✅ Mark All as Read"** button
4. **Verify all notifications are marked as read** at once

### **Scenario 3: Different Notification Types**
Test with different notification types to see color coding:
- **Info** (blue): "📨 Send Test Notification"
- **Urgent** (red): "🚨 Send Urgent Alert"  
- **Announcement** (orange): "🏢 Send to Department"
- **System** (purple): "📢 Broadcast Message"

### **Scenario 4: Real-time Updates**
1. **Open multiple browser tabs** with the same app
2. **Mark notifications as read in one tab**
3. **Verify the read status updates** in other tabs (if your backend supports this)

## 🔧 Testing with Your Backend

### **Required Backend Endpoints**

Your backend should implement these endpoints for full functionality:

```javascript
// 1. SSE Connection
GET /notifications/subscribe?userId=test-user-123&departmentIds=sales,engineering

// 2. Mark Single Notification as Read
POST /notifications/:notificationId/read

// 3. Mark All Notifications as Read
POST /notifications/user/:userId/mark-all-read

// 4. Send Notifications (for testing)
POST /notifications/user/:userId
POST /notifications/department/:departmentId
POST /notifications/broadcast

// 5. Delete Notification
POST /notifications/:notificationId/delete
```

### **Expected Notification Format**
Your SSE endpoint should send notifications in this format:

```json
{
  "id": "notif_123",
  "userId": "test-user-123",
  "type": "info",
  "title": "Test Notification",
  "message": "This is a test notification",
  "data": { "testId": 1699123456789 },
  "icon": "🚀",
  "read": false,
  "delivered": true,
  "createdAt": "2025-11-03T10:30:00Z"
}
```

## 🎯 Testing Checklist

### ✅ **Connection Testing**
- [ ] SSE connection establishes successfully
- [ ] Connection status shows "connected"
- [ ] Reconnection works when backend restarts
- [ ] Error handling works when backend is down

### ✅ **Mark as Read Testing**
- [ ] Individual notifications can be marked as read
- [ ] "Mark All as Read" works for multiple notifications
- [ ] Read status persists after page refresh
- [ ] Unread counter updates correctly
- [ ] Visual indicators change when marked as read

### ✅ **Notification Types Testing**
- [ ] Info notifications (blue border)
- [ ] Urgent notifications (red border)
- [ ] Success notifications (green border)
- [ ] Warning notifications (yellow border)
- [ ] System notifications (purple border)

### ✅ **Browser Notifications Testing**
- [ ] Browser permission is requested
- [ ] Native notifications appear for new messages
- [ ] Urgent notifications require interaction

### ✅ **UI/UX Testing**
- [ ] Loading states work correctly
- [ ] Error messages are displayed
- [ ] Responsive design works on mobile
- [ ] Accessibility features work

## 🐛 Common Issues & Solutions

### **Issue: TypeScript Errors**
```typescript
// If you get import errors, try:
import * as SSENotifications from '@joemark0008/sse-notifications-react';
const { SSEProvider, useSSE, useNotifications } = SSENotifications;
```

### **Issue: Connection Fails**
- Check if backend is running on `http://localhost:3000`
- Verify CORS settings allow your frontend origin
- Check browser console for SSE connection errors

### **Issue: Notifications Don't Appear**
- Verify the SSE endpoint returns proper JSON format
- Check if `userId` matches between frontend and backend
- Ensure `Content-Type: text/event-stream` header is set

### **Issue: Mark as Read Doesn't Work**
- Verify backend implements the read endpoints
- Check network tab for API call success
- Ensure notification IDs are properly generated

## 📊 Testing Data

### **Sample User IDs for Testing**
```javascript
const testUsers = [
  'test-user-123',
  'admin-user-456', 
  'demo-user-789'
];
```

### **Sample Department IDs**
```javascript
const departments = [
  'sales',
  'engineering', 
  'marketing',
  'support'
];
```

### **Sample Notification Payloads**
```javascript
// Info Notification
{
  type: 'info',
  title: 'New Message',
  message: 'You have received a new message',
  icon: '💬',
  data: { messageId: 'msg_123' }
}

// Urgent Notification  
{
  type: 'urgent',
  title: 'URGENT: Action Required',
  message: 'Please review and approve the pending request',
  icon: '🚨',
  data: { requestId: 'req_456', priority: 'high' }
}

// System Notification
{
  type: 'system', 
  title: 'System Maintenance',
  message: 'Scheduled maintenance in 1 hour',
  icon: '🔧',
  data: { maintenanceId: 'maint_789', startTime: '2025-11-03T12:00:00Z' }
}
```

## 🚀 Advanced Testing

### **Load Testing**
Send multiple notifications quickly to test performance:

```javascript
// Send 10 notifications rapidly
for (let i = 0; i < 10; i++) {
  await sendToUser('test-user-123', {
    type: 'info',
    title: `Notification ${i + 1}`,
    message: `Test notification number ${i + 1}`,
    icon: '📨'
  });
}
```

### **Stress Testing**
Test mark as read with many notifications:

```javascript
// Mark all notifications as read when you have 50+ notifications
const notifications = await getHistory('test-user-123');
console.log(`Marking ${notifications.length} notifications as read...`);
await markAllAsRead();
```

## 🎉 Success Criteria

Your implementation is working correctly when:

1. ✅ **Notifications appear in real-time** when sent from backend
2. ✅ **Individual mark as read** changes visual state immediately  
3. ✅ **Mark all as read** processes multiple notifications
4. ✅ **Unread counter** updates accurately
5. ✅ **Visual indicators** clearly show read/unread status
6. ✅ **Loading states** provide user feedback
7. ✅ **Error handling** gracefully manages failures
8. ✅ **Browser notifications** work for urgent messages

## 📞 Need Help?

If you encounter issues:

1. **Check the browser console** for error messages
2. **Verify backend logs** for SSE connection issues  
3. **Test API endpoints** directly with Postman/curl
4. **Review network tab** for failed requests
5. **Check notification format** matches expected structure

**Package Documentation:** https://www.npmjs.com/package/@joemark0008/sse-notifications-react

Happy testing! 🚀