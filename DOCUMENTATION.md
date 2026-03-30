# Dawra

**Dawra** — where every moment becomes a milestone, every adventure an achievement, and every day a step toward our goals.

> **D**reaming **A**dventures, **W**ith **R**esults, **A**lways

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Features](#features)
  - [Bucket List](#bucket-list)
  - [Itinerary](#itinerary)
  - [Categories](#categories)
- [Type System](#type-system)
- [Hooks](#hooks)
- [Services](#services)
- [UI Components](#ui-components)
- [Environment Setup](#environment-setup)
- [Scripts](#scripts)

---

## Overview

Dawra is a modern web application for managing shared bucket lists and travel itineraries. Built with Next.js 16, React 19, and Firebase, it provides a beautiful, responsive interface for tracking life goals and planning adventures together.

**Key Features:**
- Bucket list management with categories, costs, and locations
- Interactive itinerary planning with timeline visualization
- Real-time data synchronization via Firebase Firestore
- Keyboard navigation and selection shortcuts
- Multiple view modes (list, grid) and sorting options
- Dark/light theme support

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.7 (App Router) |
| **UI Library** | React 19.2.4 |
| **Language** | TypeScript 5.9.3 |
| **Styling** | Tailwind CSS 4.2.1 |
| **Database** | Firebase Firestore |
| **State Management** | Zustand 5.0.12 |
| **Data Fetching** | TanStack Query 5.95.2 |
| **Hotkeys** | TanStack React Hotkeys 0.7.0 |
| **UI Components** | shadcn/ui + Radix UI |
| **Icons** | Lucide React |
| **Fonts** | Figtree, Yellowtail, Geist Mono |

---

## Project Structure

```
dawra/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   ├── bucket-list/              # Bucket list page
│   ├── itinerary/                # Itinerary page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── providers.tsx             # App providers
├── components/                   # Shared components
│   ├── ui/                       # shadcn/ui components
│   ├── DynamicBreadcrumb.tsx       # Breadcrumb navigation
│   ├── Navbar.tsx                # Navigation bar
│   └── theme-provider.tsx        # Theme context
├── features/                     # Feature-based modules
│   ├── bucket-list/              # Bucket list feature
│   │   ├── components/           # Feature components
│   │   ├── hooks/                # Feature hooks
│   │   └── services/             # Feature services
│   ├── category/                 # Category management
│   └── itinerary/                # Itinerary feature
├── hooks/                        # Global hooks
├── lib/                          # Utilities
│   ├── firebase/                 # Firebase config
│   └── utils.ts                  # Helper functions
├── store/                        # Zustand stores
├── types.d.ts                    # Global types
└── public/                       # Static assets
```

---

## Architecture

### Feature-Based Organization

The project uses a **feature-based folder structure** where each feature contains its own components, hooks, and services:

```
features/
├── bucket-list/
│   ├── components/     # UI components specific to bucket list
│   ├── hooks/          # Data fetching and state hooks
│   └── services/       # Firebase operations
```

### Data Flow

1. **Services** handle Firebase operations (CRUD)
2. **Hooks** wrap services with React Query for caching and state
3. **Components** use hooks and manage local UI state
4. **Global Store** (Zustand) manages cross-feature state

### API Response Pattern

All API responses follow a standardized format (`@/types.d.ts`):

```typescript
type ApiResponse<T> = {
  code: -1 | 0 | 1  // error | loading | success
  data: T
  message: string
}
```

Helper functions in `@/lib/utils.ts`:
- `apiSuccess<T>(data, message)` - Success response
- `apiError<T>(message)` - Error response
- `apiLoading<T>()` - Loading state

---

## Features

### Bucket List

Manage shared goals and experiences with rich metadata.

**Components:**

| Component | Path | Description |
|-----------|------|-------------|
| `BucketListGrid` | `features/bucket-list/components/BucketListGrid.tsx` | Main grid with filtering, sorting, selection |
| `BucketListItem` | `features/bucket-list/components/BucketListItem.tsx` | Individual item card with actions |
| `BucketListForm` | `features/bucket-list/components/BucketListForm.tsx` | Add/edit form for items |
| `ViewModeSelector` | `features/bucket-list/components/ViewModeSelector.tsx` | Toggle between list/grid views |
| `SortSelector` | `features/bucket-list/components/SortSelector.tsx` | Sort options dropdown |
| `BulkDeleteButton` | `features/bucket-list/components/BulkDeleteButton.tsx` | Delete multiple items |
| `ToggleBucketListButton` | `features/bucket-list/components/ToggleBucketListButton.tsx` | Mark complete/incomplete |
| `UpdateBucketListButton` | `features/bucket-list/components/UpdateBucketListButton.tsx` | Edit item dialog |

**Hooks:**

| Hook | Path | Purpose |
|------|------|---------|
| `useAddBucketList` | `features/bucket-list/hooks/useAddBucketList.ts` | Add new item |
| `useDeleteBucketList` | `features/bucket-list/hooks/useDeleteBucketList.ts` | Delete item |
| `useToggleBucketList` | `features/bucket-list/hooks/useToggleBucketList.ts` | Toggle completion |
| `useUpdateBucketList` | `features/bucket-list/hooks/useUpdateBucketList.ts` | Update item |
| `useBucketSelection` | `features/bucket-list/hooks/useBucketSelection.ts` | Keyboard/mouse selection |

**Services:**

| Service | Path | Firebase Operation |
|---------|------|-------------------|
| `add.service.ts` | `features/bucket-list/services/add.service.ts` | Create document |
| `delete.service.ts` | `features/bucket-list/services/delete.service.ts` | Delete document |
| `subscribe.service.ts` | `features/bucket-list/services/subscribe.service.ts` | Real-time listener |
| `toggle.service.ts` | `features/bucket-list/services/toggle.service.ts` | Update completion |
| `update.service.ts` | `features/bucket-list/services/update.service.ts` | Update document |

**Selection System:**

The bucket list has an advanced selection system with keyboard shortcuts:

| Action | Shortcut |
|--------|----------|
| Select single | Click |
| Toggle selection | Ctrl/Cmd + Click |
| Select range | Shift + Click |
| Select all | Ctrl/Cmd + A |
| Navigate | Arrow Up/Down |
| Toggle focused | Space |
| Delete selected | Delete |
| Exit selection | Escape |

---

### Itinerary

Plan and visualize bucket list items on a timeline.

**Components:**

| Component | Path | Description |
|-----------|------|-------------|
| `ItineraryGrid` | `features/itinerary/components/ItineraryGrid.tsx` | Main timeline container |
| `GridTimeline` | `features/itinerary/components/GridTimeline.tsx` | Timeline visualization |
| `TimelineEvent` | `features/itinerary/components/TimelineEvent.tsx` | Individual event card |
| `ItineraryForm` | `features/itinerary/components/ItineraryForm.tsx` | Add itinerary item form |
| `DatePicker` | `features/itinerary/components/DatePicker.tsx` | Date/time selection |
| `SlotWidthControl` | `features/itinerary/components/SlotWidthControl.tsx` | Timeline zoom control |

**Hooks:**

| Hook | Path | Purpose |
|------|------|---------|
| `useAddItineraryItem` | `features/itinerary/hooks/useAddItineraryItem.ts` | Add to itinerary |
| `useGetBucketListItems` | `features/itinerary/hooks/useGetBucketListItems.ts` | Fetch available items |
| `useGetItineraryItems` | `features/itinerary/hooks/useGetItineraryItems.ts` | Fetch itinerary |
| `useRealtimeItineraryItems` | `features/itinerary/hooks/useRealtimeItineraryItems.ts` | Real-time updates |

---

### Categories

Organize bucket list items with color-coded categories.

**Type:**

```typescript
type Category = {
  id: string
  name: string
  color: string  // Hex color code
}
```

---

## Type System

### Core Types (`types.d.ts`)

```typescript
// Bucket List Item
type BucketList = {
  id?: string
  title: string
  description?: string
  completed: boolean
  cost?: number
  location?: string
  categories?: Category[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Itinerary Entry
type ItineraryItem = {
  id: string
  bucketList: BucketList
  start: string  // ISO date string
  end: string    // ISO date string
}

// View & Sort Options
type ViewMode = "list" | "grid2" | "grid3"
type SortOption = 
  | "title-asc" | "title-desc"
  | "created-asc" | "created-desc"
  | "completed" | "incomplete"
  | "cost-asc" | "cost-desc"
```

---

## Hooks

### `useBucketSelection`

Manages keyboard and mouse selection for bucket list items.

```typescript
const {
  selected,      // Set<string> of selected IDs
  selectedIds,   // Array of selected IDs
  focusedIndex,  // Currently focused item index
  handleSelect,  // Click handler (handles Shift/Ctrl)
  clear          // Clear selection
} = useBucketSelection({
  ids: string[],           // All item IDs
  isSelectionMode: boolean // Enable keyboard shortcuts
})
```

---

## Services

### Bucket List Services

All services return `Promise<ApiResponse<T>>`:

```typescript
// Subscribe to real-time updates
subscribeToBucketList(callback: (data: BucketList[]) => void): Unsubscribe

// Add item
addBucketList(item: Omit<BucketList, 'id'>): Promise<ApiResponse<BucketList>>

// Delete items
deleteBucketList(ids: string[]): Promise<ApiResponse<null>>

// Toggle completion
toggleBucketList(id: string, completed: boolean): Promise<ApiResponse<BucketList>>

// Update item
updateBucketList(id: string, data: Partial<BucketList>): Promise<ApiResponse<BucketList>>
```

---

## UI Components

### shadcn/ui Components (`components/ui/`)

| Component | Usage |
|-----------|-------|
| `button` | Primary actions, form submissions |
| `badge` | Labels, status indicators |
| `breadcrumb` | Navigation hierarchy |
| `card` | Content containers |
| `checkbox` | Multi-select options |
| `combobox` | Searchable dropdowns |
| `dialog` | Modals, confirmation dialogs |
| `input` | Text inputs |
| `input-group` | Input with addons |
| `label` | Form labels |
| `popover` | Dropdown menus |
| `scroll-area` | Custom scrollbars |
| `slider` | Range inputs |
| `textarea` | Multi-line text |
| `tooltip` | Help text, hints |

### Theme System

Uses `next-themes` with CSS variables for light/dark modes. Colors defined in `globals.css`.

---

## Environment Setup

Create `.env` file with Firebase configuration:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint with ESLint
npm run lint

# Format with Prettier
npm run format

# Type check
npm run typecheck
```

---

## Routing

| Route | Feature | Page Component |
|-------|---------|----------------|
| `/` | Home/Landing | `app/page.tsx` |
| `/bucket-list` | Bucket List | `app/bucket-list/page.tsx` |
| `/itinerary` | Itinerary | `app/itinerary/page.tsx` |

---

## Utilities

### `lib/utils.ts`

```typescript
// Tailwind class merging
cn(...inputs: ClassValue[]): string

// API response helpers
apiSuccess<T>(data: T, message: string): ApiResponse<T>
apiError<T>(message: string): ApiResponse<T>
apiLoading<T>(): ApiResponse<T>
```

---

## License

Private project - All rights reserved.
