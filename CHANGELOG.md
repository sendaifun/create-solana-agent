# Changelog

## [1.3.0] - 2024-02-03

### Added
- Vercel AI SDK for agent initialization
- Deepseek Provider

### Features
- Switched from Langchain to Vercel AI SDK 

### Technical Details
- Integrated createVercelAITools instead of Langchain
- New `useChat` hook from AI SDK
- stream.toTextStreamResponse instead of String

### Fixed
- User's Chat Message hide Bug
- Reduced the dependencies of Chat messages throughout
- Added Text Stream
- More Markdown Support 


### Dependencies Added
- @ai-sdk/deepseek
- @ai-sdk/openai
- ai
- openai
- react-markdown

## [1.2.0] - 2024-01-30

### Added
- Chat session management with Zustand store
- Session-based navigation using Next.js routing
- Persistent chat history using localStorage
- Sidebar navigation for chat sessions
- Delete functionality for chat sessions

### Features
- Session-based URL routing (`/chat/[sessionId]`)
- Automatic API trigger for new chat sessions
- Message history preservation across sessions
- Dynamic session titles based on first message

### Technical Details
- Store Implementation
  - Added `useChatStore` with Zustand
  - Implemented message persistence
  - Added session management functions
  - Added message tracking per session

- Navigation
  - Added session-based routing
  - Implemented sidebar session navigation
  - Added new chat creation flow

- Chat Interface
  - Added ChatSession component

### Fixed
- Message persistence issues
- Navigation synchronization
- Session state management


### Dependencies
- Zustand for state management