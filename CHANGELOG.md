# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.9] - 2025-11-03

### Added
- **API Key Authentication**: Required `appKey` and `appSecret` fields in `SSEConfig`
- **Authentication Headers**: All API requests now include `x-app-key` and `x-app-secret` headers
- **SSE Query Parameters**: SSE connection now includes `appKey` and `appSecret` query parameters
- **Authentication Documentation**: Comprehensive README section explaining authentication setup

### Changed
- **Breaking Change**: `appKey` and `appSecret` are now **required** fields in `SSEConfig` (no longer optional)
- **NotificationAPIClient**: Constructor now requires `appKey` and `appSecret` parameters
- **useNotificationAPI**: Updated to pass credentials from config to API client
- **useNotifications**: Updated to pass credentials from config to API client
- **SSEContext**: Updated to include credentials in SSE subscribe URL and API client initialization

### Fixed
- Proper authentication support for backends with API key guards

## [1.0.8] - 2025-11-03

### Added
- **Notification Persistence Documentation**: Updated README with "Notification Persistence" section
- **CHANGELOG.md**: Created comprehensive changelog documenting all versions

### Changed
- Updated README with detailed notification persistence explanation

## [1.0.7] - 2025-11-03

### Fixed
- **Notification Persistence**: Improved response handling in `getHistory()` to support multiple API response formats
- **Response Handling**: API client now handles direct array responses and wrapped responses (with `data` or `notifications` fields)
- **Debug Logging**: Added detailed console logging to help diagnose API fetch issues
- **TypeScript Error**: Fixed `reconnectTimeoutRef` type from `number` to `ReturnType<typeof setTimeout>`

### Added
- **Enhanced Error Messages**: Better error reporting in SSEContext initialization
- **API Test Function**: Added test helper in App.tsx to verify API endpoints directly
- **Console Debugging**: Detailed logs showing exactly what's being fetched from the API

### Changed
- Updated README with new "Notification Persistence" section explaining the feature

## [1.0.6] - 2025-11-03

### Fixed
- **API Response Parsing**: Improved `getHistory()` method to handle multiple response formats from backend

### Added
- Debug logging to track notification initialization

## [1.0.5] - 2025-11-03

### Added
- **Notification Persistence**: Notifications now automatically load from API history on component mount
- **Auto-reconnect Logic**: SSEProvider now fetches historical notifications before establishing SSE connection
- **Graceful Error Handling**: Continues SSE connection even if API history fetch fails

### Fixed
- **Package Configuration**: Removed circular dependency from package.json

## [1.0.4] - 2025-11-03

### Added
- **Proper TypeScript Definitions**: Implemented proper type declaration generation using re-export pattern
- **Type Generation Script**: Added `scripts/generate-types.js` for maintaining .d.ts files

### Changed
- **Build Process**: Simplified to use Vite build + post-build type generation
- **vite-plugin-dts**: Disabled in favor of manual type generation for better control

### Removed
- Removed vite-plugin-dts configuration that was causing empty type definitions

## [1.0.3] - 2025-11-03

### Fixed
- **TypeScript Definitions**: Fixed empty `dist/index.d.ts` file
- **Package Configuration**: Removed unused `vite-plugin-dts` import from vite.config.ts
- **Build Output**: Properly generating TypeScript definitions for npm consumers

### Added
- Manual type definition generation via post-build script

## [1.0.2] - 2025-11-03

### Fixed
- **Circular Dependency**: Removed self-referencing dependency from package.json
- **Type Definitions**: Generated proper TypeScript type declarations

### Changed
- Updated vite configuration for proper type generation

## [1.0.1] - 2025-11-03

### Fixed
- **Infinite Update Loop**: Fixed `useNotifications` hook infinite loop by:
  - Adding `useMemo` to memoize `apiClient` creation
  - Fixed `useEffect` dependency array to only depend on necessary values
  - Removed unnecessary duplicate returns
- **API Resource Error**: Fixed ERR_INSUFFICIENT_RESOURCES by preventing unnecessary API client recreation
- **Hook Performance**: Applied same memoization pattern to `useNotificationAPI` hook

### Added
- Exponential backoff reconnection strategy (1s initial, 30s max)
- Auto-reconnection with configurable parameters

## [1.0.0] - 2025-11-02

### Added
- Initial release of @joemark0008/sse-notifications-react
- **SSEProvider**: React Context Provider for managing SSE connections
- **useSSE Hook**: Connection state and control management
- **useNotifications Hook**: Notification state and actions (mark as read, delete, etc.)
- **useNotificationAPI Hook**: API operations for sending and managing notifications
- **NotificationAPIClient**: Complete REST API client with 17+ endpoints
- **Browser Notifications**: Native browser notification support with permission handling
- **TypeScript Support**: Full type definitions for all components and hooks
- **Auto-reconnection**: Exponential backoff reconnection strategy
- **Dual Build**: ES modules and CommonJS output

### Features
- 🚀 Easy SSE Management with provider/hook pattern
- 🔄 Auto reconnection with configurable backoff
- 💾 Built-in notification state management
- 🎯 Multi-target notifications (user, department, broadcast)
- 📝 Full TypeScript support
- 🔔 Browser notifications
- 🔧 Complete API client included
- 📱 Mobile friendly

## Release History

| Version | Release Date | Status |
|---------|------------|--------|
| 1.0.9 | 2025-11-03 | Latest |
| 1.0.8 | 2025-11-03 | Stable |
| 1.0.7 | 2025-11-03 | Stable |
| 1.0.4 | 2025-11-03 | Stable |
| 1.0.3 | 2025-11-03 | Stable |
| 1.0.2 | 2025-11-03 | Stable |
| 1.0.1 | 2025-11-03 | Stable |
| 1.0.0 | 2025-11-02 | Initial |

## Known Issues

- None currently

## Future Enhancements

- [ ] LocalStorage persistence for notifications
- [ ] Notification caching strategy
- [ ] Batch notification API calls
- [ ] Notification analytics and metrics
- [ ] WebSocket as fallback transport
- [ ] GraphQL API client option
- [ ] React Query integration example
- [ ] E2E testing suite

## Contributing

Bug reports and feature requests are welcome! Please see [GitHub Issues](https://github.com/joemark0008/sse-notifications-react/issues).
