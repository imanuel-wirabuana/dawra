# Dawra - Project Structure Map

**A Next.js travel planning app with bucket lists, itineraries, photos, and real-time chat.**

- **Framework:** Next.js 16 (App Router + Turbopack)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Base UI, Radix UI
- **State:** Zustand, TanStack Query
- **Backend:** Firebase (Firestore, Auth, Storage)
- **Storage:** Google Drive integration

---

## Directory Structure

```
dawra/
├── app/                    # Next.js app router
│   ├── api/v1/            # API routes
│   │   ├── bucket-lists/
│   │   ├── categories/
│   │   ├── folders/
│   │   ├── itineraries/
│   │   └── photos/
│   ├── bucket-lists/      # Bucket lists page
│   ├── chats/             # Chat page
│   ├── itineraries/       # Itinerary planner page
│   ├── photos/             # Photo gallery
│   │   ├── [folderId]/    # Folder view
│   │   └── wall/          # Randomized photo wall
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx           # Home page
│   └── providers.tsx
├── components/             # Shared UI components
│   ├── ui/              # shadcn/ui components (25+)
│   ├── Brand.tsx
│   ├── ChatWidget.tsx
│   ├── DynamicBreadcrumb.tsx
│   ├── FloatingNav.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ThemeToggle.tsx
│   └── theme-provider.tsx
├── features/              # Feature-based modules
│   ├── bucket-lists/
│   ├── chats/
│   ├── itineraries/
│   └── photos/
├── hooks/                 # Global custom hooks
│   └── useDebounce.ts
├── lib/                   # Utilities & integrations
│   ├── firebase/client.ts
│   ├── gdrive/gdrive.ts
│   └── utils.ts
├── store/                 # Zustand stores
│   ├── itineraryStore.ts
│   └── navStore.ts
├── public/                # Static assets
├── types.d.ts            # Global TypeScript types
└── [config files]
```

---

## Feature Modules

### Bucket Lists (`features/bucket-lists/`)
Goal tracking with completion status, categories, and cost estimation.

| Category | Files |
|----------|-------|
| **Components** | `BucketListForm.tsx`, `BucketListGrid.tsx`, `BucketListGridSkeleton.tsx`, `BucketListItem.tsx`, `BulkDeleteButton.tsx`, `CompletedFilterSelector.tsx`, `DeleteBucketListButton.tsx`, `MobileAddButton.tsx`, `SortSelector.tsx`, `ToggleBucketListButton.tsx`, `UpdateBucketListButton.tsx`, `ViewModeSelector.tsx` |
| **Hooks** | `useAddBucketList.ts`, `useBucketSelection.ts`, `useDeleteBucketList.ts`, `useToggleBucketList.ts`, `useUpdateBucketList.ts` |
| **Services** | `add.service.ts`, `delete.service.ts`, `subscribe.service.ts`, `toggle.service.ts`, `update.service.ts` |

### Itineraries (`features/itineraries/`)
Day-by-day trip planner with timeline, drag-and-drop scheduling.

| Category | Files |
|----------|-------|
| **Components** | `DatePicker.tsx`, `EditItineraryItemSheet.tsx`, `FullscreenMode.tsx`, `GridTimeline.tsx`, `ItineraryForm.tsx`, `ItineraryGrid.tsx`, `ItineraryGridSkeleton.tsx`, `SidebarItem.tsx`, `TimelineEvent.tsx`, `ToggleItineraryItemButton.tsx` |
| **Timeline/** | `DayGrid.tsx`, `DroppableTimeSlot.tsx`, `MonthGrid.tsx`, `WeekGrid.tsx`, `shared.ts` |
| **Hooks** | `useAddItineraryItem.ts`, `useDeleteItineraryItem.ts`, `useGetBucketListItems.ts`, `useGetItineraryItems.ts`, `useRealtimeItineraryItems.ts`, `useToggleItineraryItem.ts`, `useUpdateItineraryItem.ts` |
| **Services** | `add.service.ts`, `delete.service.ts`, `get.service.ts`, `subscribe.service.ts`, `toggle.service.ts`, `update.service.ts` |

### Photos (`features/photos/`)
Photo gallery with folders, upload, bulk operations, randomized wall view.

| Category | Files |
|----------|-------|
| **Components** | `CreateFolderDialog.tsx`, `EmptyState.tsx`, `FolderGrid.tsx`, `FolderGridSkeleton.tsx`, `LoadingState.tsx`, `MoveToFolderDialog.tsx`, `PhotoBulkDeleteButton.tsx`, `PhotoCard.tsx`, `PhotoGalleryModal.tsx`, `PhotoGrid.tsx`, `PhotoGridSkeleton.tsx`, `PhotoUploadArea.tsx`, `PhotoViewModeSelector.tsx` |
| **Hooks** | `useAddFolder.ts`, `useDeleteFolder.ts`, `useDeletePhoto.ts`, `useGetPhotos.ts`, `useMovePhotos.ts`, `usePhotoSelection.ts`, `useRandomizedPhotos.ts`, `useRealtimeFolders.ts`, `useRealtimePhotos.ts`, `useRealtimePhotosByFolder.ts`, `useUploadPhoto.ts` |
| **Services** | `addFolder.service.ts`, `delete.service.ts`, `deleteFolder.service.ts`, `get.service.ts`, `getFolders.service.ts`, `getRandomized.service.ts`, `movePhotos.service.ts`, `subscribe.service.ts`, `subscribeByFolder.service.ts`, `subscribeFolders.service.ts`, `upload.service.ts` |

### Chats (`features/chats/`)
Real-time messaging with reactions, typing indicators, search.

| Category | Files |
|----------|-------|
| **Components** | `ChatsPanel.tsx`, `ChatsPanelSkeleton.tsx`, `EmojiPicker.tsx`, `MessageActions.tsx`, `ReactionsDisplay.tsx` |
| **Hooks** | `useAddChatMessage.ts`, `useEditDelete.ts`, `useReactions.ts`, `useRealtimeChats.ts`, `useSearchMessages.ts`, `useTyping.ts` |
| **Services** | `add.service.ts`, `edit-delete.service.ts`, `reactions.service.ts`, `subscribe.service.ts`, `typing.service.ts` |

---

## API Routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/v1/bucket-lists` | GET, POST | List/create bucket lists |
| `/api/v1/bucket-lists/[id]` | PATCH, DELETE | Update/delete item |
| `/api/v1/categories` | GET, POST | List/create categories |
| `/api/v1/categories/[id]` | PATCH, DELETE | Update/delete category |
| `/api/v1/folders` | GET, POST | List/create photo folders |
| `/api/v1/folders/[id]` | DELETE | Delete folder |
| `/api/v1/itineraries` | GET, POST | List/create itinerary items |
| `/api/v1/itineraries/[id]` | PATCH, DELETE | Update/delete item |
| `/api/v1/photos` | GET, POST | List photos, upload metadata |
| `/api/v1/photos/[id]` | DELETE | Delete photo |

---

## Data Models (from `types.d.ts`)

| Entity | Key Fields |
|--------|------------|
| **BucketList** | `id`, `title`, `description`, `completed`, `cost`, `location`, `categories[]` |
| **ItineraryItem** | `id`, `itemType` ('bucket-list' \| 'custom'), `completed`, `bucketList` (ref), `customItem`, `date`, `start`, `end` |
| **Category** | `id`, `name`, `color` |
| **Photo** | `id`, `url`, `name`, `realFileName`, `extension`, `size`, `folderId` |
| **Folder** | `id`, `name`, `description` |
| **ChatMessage** | `id`, `userId`, `displayName`, `message`, `reactions[]`, `replyToId`, `isDeleted` |
| **Expense** | `id`, `expenseType` ('custom' \| 'itinerary'), `customExpense`, `itineraryId` |

---

## Global State Stores

| Store | File | Purpose |
|-------|------|---------|
| **Navigation** | `store/navStore.ts` | Active tab, search query |
| **Itinerary** | `store/itineraryStore.ts` | Selected date, view mode, filters |

---

## UI Components (shadcn/ui)

`components/ui/`: `alert-dialog`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `chart`, `checkbox`, `combobox`, `dialog`, `drawer`, `dropdown-menu`, `input`, `input-group`, `label`, `popover`, `scroll-area`, `select`, `sheet`, `skeleton`, `slider`, `sonner`, `switch`, `tabs`, `textarea`, `tooltip`

---

## Dependencies Highlights

| Category | Packages |
|----------|----------|
| **Core** | `next`, `react`, `react-dom`, `typescript` |
| **UI** | `@base-ui/react`, `radix-ui`, `tailwind-merge`, `class-variance-authority`, `lucide-react` |
| **State** | `zustand`, `@tanstack/react-query` |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/utilities` |
| **Backend** | `firebase` |
| **Integrations** | `googleapis`, `axios`, `html-to-image` |
| **UX** | `sonner` (toasts), `vaul` (drawers), `react-day-picker`, `date-fns` |
| **Dev** | `eslint`, `prettier`, `prettier-plugin-tailwindcss` |

---

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run format       # Prettier format
npm run typecheck    # TypeScript check
```
