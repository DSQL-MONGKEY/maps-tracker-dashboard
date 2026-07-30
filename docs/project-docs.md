# Maps Tracker Dashboard - Project Documentation

## Overview

This is a comprehensive tracking and monitoring dashboard application designed for managing device tracking data, climber user information, and real-time environmental metrics. The system is built with Next.js, featuring real-time data visualization, advanced filtering capabilities, and a role-based access control system.

## Project Structure

### Root Directory
- `package.json` - Node package configuration
- `prisma/schema.prisma` - Database schema (PostgreSQL)
- `src/` - Source code directory

### Source Code Structure
```
src/
├── app/                              # Next.js pages
├── components/                      # UI components
│   ├── ui/                          # Shadcn/ui components
├── features/                        # Feature modules
│   ├── trackings/                   # Tracking module
│   ├── devices/                     # Device management
│   └── climber-users/               # User management
├── hooks/                           # Custom React hooks
├── lib/                             # Utility libraries
├── stores/                          # State management
├── types/                           # TypeScript types
├── components/                      # Shared components
```

### Key Features

#### 1. Tracking Management
- Real-time device location tracking
- Environmental monitoring (temperature, humidity, pressure)
- Biomedical metrics (heart rate, SpO2)
- Emergency and fall detection status
- Network routing and transmission metrics
- Map-based location visualization

#### 2. User Management
- Climber user profiles with contact information
- Device registration and assignment
- Role-based access control (admin/viewer)

#### 3. Data Visualization
- Interactive maps with location tracking
- Real-time data charts and graphs
- Advanced filtering and pagination
- Export capabilities

#### 4. Authentication & Security
- Clerk integration for user authentication
- Role-based permissions
- Secure data access controls

## Technology Stack

### Frontend
- **Framework**: Next.js 15
- **UI Library**: shadcn/ui with Radix UI
- **State Management**: React 19, Zustand
- **Data Fetching**: SWR, nuqs (URL state management)
- **Routing**: Next.js App Router
- **Icons**: Tabler Icons, Lucide React
- **Forms**: React Hook Form with Zod validation
- **Maps**: React-Leaflet with Leaflet-Geosearch

### Backend
- **Database**: PostgreSQL (Prisma ORM)
- **API Layer**: Next.js API routes
- **Authentication**: Clerk
- **Real-time**: WebSocket support via Supabase

### Dependencies
```json
{
  "dependencies": {
    "@clerk/nextjs": "^6.12.12",
    "@clerk/nextjs": "^6.12.12",
    "@prisma/client": "^6.16.2",
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.4",
    "@tanstack/react-table": "^8.21.2",
    "next": "15.2.8",
    "nuqs": "^2.4.1",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-leaflet": "^5.0.0",
    "react-resizable-panels": "^2.1.7",
    "swr": "^2.3.3",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "prisma": "^6.16.2",
    "typescript": "5.7.2",
    "@types/node": "22.10.2",
    "@types/react": "19.0.1",
    "@types/react-dom": "19.0.2",
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "husky": "^9.1.7",
    "lint-staged": "^15.2.11",
    "prettier": "3.4.2",
    "prisma": "^6.16.2",
    "tsx": "^4.21.0",
    "tw-animate-css": "^1.2.4"
  }
}
```

## Database Schema

### Core Models

#### Tracking (Primary Model)
- **id**: UUID primary key
- **location**: latitude/longitude coordinates
- **environmental**: temperature, pressure, humidity
- **biomedical**: heart rate, SpO2
- **emergency_status**: isEmergency, isFallen flags
- **network**: RSSI, SNR, hop count, routing path
- **device_time**: GPS timestamp
- **created_at**: Automatic timestamp
- **relations**: belongs to Device and optional ClimberUser

#### Device
- **name**: Unique device identifier
- **type**: base_station/client_device/extender_device
- **status**: active/inactive
- **device_code**: Unique hardware identifier
- **relations**: registerDevices, trackings

#### ClimberUser
- **name**: User name
- **phone/email/address**: Contact information
- **relations**: registerDevices, trackings

#### BaseStation
- **name/location_name**: Station identification
- **status**: active/inactive
- **coordinates**: latitude/longitude
- **relations**: manage registerDevices

#### RegisterDevice (Bridge Model)
- **deviceId**: Device being registered
- **climberUserId**: User registering device
- **registeredAt/unregisteredAt**: Time tracking
- **isActive**: Registration status
- **relations**: climberUser, device

#### User (Custom Model)
- **email**: User email
- **role**: admin/viewer (default: viewer)
- **created_at**: Registration timestamp

## Recent Improvements

### Server-Side Pagination & Filtering
- **Modified**: `src/app/api/trackings/route.ts`
  - Added support for `page`, `perPage`, `search`, `categories` query parameters
  - Implemented Prisma `skip`/`take`/count for efficient pagination
  - Added advanced filtering for emergency and fall status
  - Returns `totalCount`, `totalPages` for client-side pagination UI

- **Modified**: `src/features/trackings/trackings-listing-table.tsx`
  - Replaced hardcoded `/api/trackings` with dynamic URL from nuqs
  - Reads pagination/search/filter state from URL query params
  - Added `keepPreviousData` for smooth page transitions

- **Modified**: `src/features/trackings/trackings-listing.tsx`
  - Removed unused filter prop and searchParamsCache
  - Simplified component to focus on URL state management

## Current Features (Zero Changes Required)

### Table Functionality (Already Working)
- **`useDataTable` hook** (src/hooks/use-data-table.ts): Manual pagination, filtering, and sorting state synchronized to URL
- **`DataTableToolbar`** (src/components/ui/table/data-table-toolbar.tsx): Renders text inputs, faceted filters per column meta
- **`DataTablePagination`** (src/components/ui/table/data-table-pagination.tsx): Page navigation and page size selector
- **Columns definition** (src/features/tracking/trackings-tables/columns.tsx): All filtering, sorting, and meta configuration already set

### URL State Management
- **`searchParamsCache`** (src/lib/searchparams.ts): Server-side parsing of search params
- Column filters automatically emit to URL via `debouncedSetFilterValues` in `useDataTable`
- Table state changes (page, perPage, sort) automatically sync to URL via nuqs

## API Endpoints

### GET `/api/trackings`
- Query params: `page`, `perPage`, `search`, `categories`
- Response: `{ data, totalCount, page, perPage, totalPages }`
- Filters: by device name, climber user name, emergency status, fall status

### POST `/api/trackings`
- Creates new tracking record from gateway data
- Validates device existence and active registration
- Converts GPS timestamp and stores all sensor readings

### GET `/api/trackings/[id]`
- Retrieves specific tracking record by ID
- Includes device and climber user data

### PUT `/api/trackings/[id]`
- Updates existing tracking record
- Supports partial updates for any field

### DELETE `/api/trackings/[id]`
- Deletes tracking record

## Setting Up Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- .env file with:
  ```env
  DATABASE_URL=your-postgresql-connection-string
  DIRECT_URL=your-direct-connection-string
  CLERK_SECRET_KEY=your-clerk-secret
  ```

### Quick Start
```bash
# Install dependencies (using pnpm if available, otherwise npm)
pnpm install

# Generate Prisma client
pnpm prisma generate

# Start development server
pnpm dev
```

## Running the Application

1. **Access the Dashboard**
   - Navigate to `http://localhost:3000/dashboard/trackings`
   - Choose appropriate role and login method

2. **Trackings Table Features**
   - **Pagination**: Use page buttons or page size dropdown
   - **Search**: Filter by device name or climber user in any column header
   - **Filters**: Use column filters for text, faceted select, and range filters
   - **Sorting**: Click column headers to sort ascending/descending

3. **Actions Available**
   - View detailed tracking records
   - Edit tracking data (admin only)
   - Delete tracking records (admin only)

4. **Authentication Routes**
   - `/auth/sign-in` - Sign in
   - `/auth/sign-up` - Sign up

## Support & Troubleshooting

### Common Issues
- **Database connection errors**: Ensure DATABASE_URL is set and PostgreSQL is running
- **Authentication failures**: Check Clerk configuration in .env.local
- **Build errors**: Run `pnpm lint:strict` for type checking, then `pnpm format:check` for formatting
- **Next.js development issues**: Clear browser cache and try `pnpm lint:fix`

### Monitoring Production
The application includes logging via the `Log` model for tracking system events and debugging.

This project provides a robust foundation for real-time device tracking with advanced data management capabilities, built on modern web technologies and best practices.