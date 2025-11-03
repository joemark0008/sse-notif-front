const fs = require('fs');
const path = require('path');

// Read the source types file and extract type definitions
const srcTypesPath = path.join(__dirname, '..', 'src', 'types.ts');
const srcIndexPath = path.join(__dirname, '..', 'src', 'index.ts');

// Read and export types from source
const typesContent = `// Auto-generated type definitions from src/types.ts and src/index.ts
// These types are re-exported from the compiled library

export type {
  Notification,
  NotificationStats,
  NotificationResponse,
  SSEConfig,
  SSEConnectionState,
  SendNotificationBody,
  SendBulkNotificationsBody,
  SendDepartmentNotificationBody,
  SendMultipleDepartmentsBody,
  NotificationsListResponse,
  ConnectedUsersResponse,
  UseNotificationsReturn,
  UseSSEReturn,
  UseNotificationAPIReturn,
  SSEProviderProps,
} from './index.js';

// Re-export classes and functions
export { SSEProvider, useSSEContext } from './index.js';
export { useSSE } from './index.js';
export { useNotifications } from './index.js';
export { useNotificationAPI } from './index.js';
export { NotificationAPIClient } from './index.js';
export { requestNotificationPermission } from './index.js';
`;

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const outputPath = path.join(distDir, 'index.d.ts');
fs.writeFileSync(outputPath, typesContent);
console.log('✅ TypeScript definitions generated at dist/index.d.ts');
console.log('   These reference-export from compiled .js files');
