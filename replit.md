# Excel Data Management Application

## Overview

This is a full-stack web application designed for managing Excel data uploads and processing. The application provides a clean interface for users to upload Excel files, preview data, and manage their uploaded content through an administrative dashboard. Built with modern React frontend and Express.js backend, it focuses on simplicity and ease of use for Excel data management workflows.

## User Preferences

Preferred communication style: Simple, everyday language.
Database Storage Requirements: User wants permanent database storage (not temporary) for deployment to GitHub. Using Neon PostgreSQL for persistent, production-grade storage.

## Recent Changes (January 2025)

- Fixed all TypeScript and LSP errors for clean code
- Added comprehensive database backup system with daily auto-backups
- Enhanced admin dashboard with backup creation functionality  
- Implemented permanent Neon PostgreSQL storage (not temporary)
- Added database status indicators in admin interface
- Created .gitignore for proper GitHub deployment preparation
- User confirmed preference for permanent database storage over temporary solutions

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **Routing**: Client-side routing using Wouter for lightweight navigation
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **File Processing**: XLSX library for Excel file parsing and data extraction
- **Session Management**: Express sessions with PostgreSQL store for persistent authentication
- **Middleware Stack**: JSON parsing, URL encoding, error handling, and request logging

### Authentication System
- **Replit Authentication**: OpenID Connect integration using Replit's authentication service
- **Passport.js**: Authentication middleware for handling OAuth flows
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Route-level authentication checks with user context

### Data Storage
- **PostgreSQL Database**: Primary data store using Neon serverless PostgreSQL (PERMANENT STORAGE)
- **Backup System**: Automated daily backups with manual backup creation capability
- **Schema Design**: 
  - Users table for authentication and profile data
  - Excel data table for storing parsed spreadsheet content as JSON
  - Sessions table for authentication state persistence
- **Drizzle ORM**: Type-safe database queries with schema-first approach
- **Migration System**: Database schema versioning and deployment
- **Storage Location**: Production-grade Neon PostgreSQL (not temporary storage)
- **Data Persistence**: All data is permanently stored and backed up regularly

### File Upload & Processing
- **Multer Middleware**: Memory-based file upload handling
- **XLSX Processing**: Client and server-side Excel file parsing
- **Data Validation**: Zod schemas for ensuring data integrity
- **Preview System**: Real-time data preview before final submission

### UI/UX Design System
- **Design Tokens**: CSS custom properties for consistent theming
- **Component Library**: Reusable components following design system principles
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA-compliant components from Radix UI primitives
- **Loading States**: Proper loading indicators and error boundaries

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **WebSocket Support**: Real-time database connections using ws library

### Authentication Services
- **Replit OIDC**: OAuth 2.0/OpenID Connect provider integration
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### File Processing Libraries
- **XLSX**: Excel file reading and writing capabilities
- **Multer**: Multipart form data handling for file uploads

### UI & Frontend Libraries
- **Radix UI**: Headless UI components for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide Icons**: Consistent icon system throughout the application
- **TanStack Query**: Server state management and caching

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Modern build tooling with hot module replacement
- **ESBuild**: Fast JavaScript bundling for production
- **Replit Plugins**: Development environment integration for deployment