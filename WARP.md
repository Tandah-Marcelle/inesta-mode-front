# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Inesta Mode is a React-based e-commerce website built with TypeScript, Vite, and TailwindCSS. It features a dual architecture with a public-facing e-commerce frontend and a comprehensive admin panel for content management. The application uses Supabase for backend services and connects to a separate Node.js backend API.

## Essential Commands

### Development
```bash
# Start frontend development server
npm run dev

# Start backend server (from separate backend directory)
npm run dev:backend

# Run both frontend and backend concurrently
npm run dev:fullstack
```

### Building & Linting
```bash
# Build for production
npm run build

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

### Database & Setup
```bash
# Seed product categories
npm run seed:categories

# Seed categories via backend
npm run seed:categories:backend

# Create admin user
npm run create:admin

# Setup admin user
npm run setup:admin
```

## Architecture Overview

### Frontend Structure
The application follows a modular React architecture with clear separation between public and admin functionality:

- **Public Routes**: E-commerce pages (home, collections, products, news, contact)
- **Admin Routes**: Protected management interface with role-based access control
- **Dual Layouts**: `Layout.tsx` for public pages, `AdminLayout.tsx` for admin interface

### Context Providers Hierarchy
The application uses multiple React contexts in a specific order:
1. `AuthProvider` - User authentication state
2. `PermissionsProvider` - Role-based access control
3. `CategoriesProvider` - Product categories management
4. `ShopProvider` - E-commerce cart and product state
5. `ChatbotProvider` - Customer support chat functionality

### Key Directories

- `src/pages/` - Route components split into public pages and `admin/` subfolder
- `src/components/` - Reusable UI components with `admin/` subfolder for admin-specific components
- `src/services/` - API service modules for different data entities
- `src/contexts/` - React context providers for state management
- `src/hooks/` - Custom React hooks (`useContactForm`, `useImageUpload`)
- `src/config/` - Configuration files for Supabase and API clients

### Data Layer Architecture

**Dual Backend Strategy:**
- **Supabase**: Direct integration for certain features (configured in `src/config/supabase.ts`)
- **Custom API**: Node.js backend running on localhost:3000 (configured in `src/config/api.ts`)

**API Client Pattern:**
- Generic `ApiClient` class with authentication token management
- Individual service modules for each entity (products, categories, users, etc.)
- Consistent error handling and timeout management

### Styling Architecture

**TailwindCSS Configuration:**
- Custom color palette with primary, secondary, accent, success, warning, and error colors
- Typography system using Playfair Display, Raleway, and Montserrat fonts
- Custom animations (fade-in, slide-up, scale-in) and extended spacing utilities

## Environment Setup

### Required Environment Variables
Copy `.env.example` to `.env` and configure:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:3001
```

### Backend Dependencies
The frontend expects a Node.js backend running on localhost:3000 (development) or as configured in `REACT_APP_API_URL`. Admin functionality requires this backend for user management and authentication.

## Admin System

### Role-Based Access Control
The admin system uses a sophisticated permission system with resources and actions:
- Protected routes use `ProtectedRoute` component with resource/action parameters
- Different admin sections require different permission levels
- Session management with expiration handling

### Admin User Management
- Create admin users via `npm run create:admin` script
- Default admin credentials are defined in `scripts/create-admin.js`
- Login through `/admin/login` route

## Development Notes

### Component Organization
- Public components are in root `components/` directory
- Admin-specific components are in `components/admin/` subdirectory
- Page components follow similar organization pattern

### State Management Strategy
- Context providers handle global state (auth, permissions, categories, cart)
- Custom hooks encapsulate complex logic (form handling, image uploads)
- Service modules handle API interactions with consistent patterns

### Image and Asset Handling
- Static assets in `src/assets/images/`
- Image upload functionality through `useImageUpload` hook
- Supabase storage integration for dynamic image management

### Routing Architecture
- React Router v6 with future flags enabled
- Nested routes for admin section
- Protected route wrapper for admin functionality
- 404 fallback handling

## Backend Integration Points

The frontend integrates with two backend systems:

1. **Supabase**: Direct client-side integration for certain features
2. **Custom Node.js API**: RESTful API with JWT authentication
   - Authentication endpoints (login, create admin)
   - CRUD operations for all entities
   - File upload handling
   - Permission management

When working on backend-related features, ensure both systems remain synchronized and consider which backend service is appropriate for new functionality.