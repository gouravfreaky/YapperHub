# Replit.md

## Overview

YapperHub is a modern full-stack web application built with React, TypeScript, and Express.js. The application integrates with the Kaito AI API to search for user profiles and display their activity metrics (YAPS). The frontend uses shadcn/ui components with Tailwind CSS for styling, while the backend provides a REST API that acts as a proxy to the Kaito AI service.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with separate client and server directories, utilizing modern tooling and best practices:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **External Integration**: Kaito AI API proxy for user activity data
- **Development**: Hot reload with tsx and Vite integration

## Key Components

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: Neon serverless PostgreSQL (production-ready)
- **Schema**: Defined in `shared/schema.ts` with users and posts tables
- **Migrations**: Managed through Drizzle Kit

### Storage Abstraction
- **Interface**: `IStorage` abstraction for data operations
- **Implementation**: In-memory storage (`MemStorage`) for development
- **Future-ready**: Designed to easily swap to database implementation

### Frontend Features
- **User Search**: Modern search interface with gradient effects and suggestions
- **Profile Display**: Comprehensive user activity metrics (YAPS) display
- **Dark Mode**: Toggle between light and dark themes with persistent storage
- **Search History**: Recent searches with quick access badges
- **Real-time Search**: Instant search with loading indicators
- **Error Handling**: Comprehensive error boundaries and loading states

### UI Component System
- **Design System**: shadcn/ui with "new-york" style variant
- **Theme**: Light/dark mode support with CSS custom properties
- **Icons**: Lucide React icons throughout the interface
- **Accessibility**: Built on Radix UI for full accessibility compliance

## Data Flow

1. **API Requests**: Frontend makes requests to `/api/user/:username` endpoint
2. **Proxy Layer**: Express server fetches data from Kaito AI API
3. **Data Processing**: Server handles error cases and data transformation
4. **Client State**: TanStack Query manages caching and synchronization
5. **UI Updates**: React components re-render based on query state changes

The application implements optimistic UI patterns with proper loading and error states throughout the user journey.

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL client
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database operations
- **express**: Web application framework
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Primitive UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API
- **clsx**: Conditional className utility

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle pushes schema changes to production

### Environment Configuration
- **Development**: Uses tsx with hot reload and Vite dev server
- **Production**: Serves static files and API from single Express server
- **Database**: Configured via `DATABASE_URL` environment variable

### Scripts
- `npm run dev`: Development mode with hot reload
- `npm run build`: Production build for both client and server
- `npm run start`: Production server startup
- `npm run db:push`: Apply database schema changes

The application is designed for easy deployment to platforms like Replit, Vercel, or traditional VPS environments with minimal configuration changes.