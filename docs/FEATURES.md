# Features Documentation

## Bucket Lists

Track travel goals and experiences with completion status, categories, and cost estimation.

### Data Model

```typescript
type BucketList = {
  id: string
  title: string
  description?: string
  completed: boolean
  cost?: number
  location?: string
  categories?: Category[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `BucketListGrid` | Main grid view with view modes |
| `BucketListItem` | Individual item card with actions |
| `BucketListForm` | Create/edit form |
| `ViewModeSelector` | Toggle list/grid2/grid3 |
| `SortSelector` | Sort by title/date/completion/cost |
| `CompletedFilterSelector` | Filter all/completed/incomplete |
| `BulkDeleteButton` | Delete multiple selected items |

### Hooks

| Hook | Purpose |
|------|---------|
| `useGetBucketListItems` | Fetch from Firestore |
| `useRealtimeBucketLists` | Real-time subscription |
| `useAddBucketList` | Create new item |
| `useUpdateBucketList` | Update existing |
| `useToggleBucketList` | Toggle completion |
| `useDeleteBucketList` | Delete (single/bulk) |
| `useBucketSelection` | Manage selected items |

### Services

- `get.service.ts` - Query with filters
- `add.service.ts` - Create with validation
- `update.service.ts` - Partial updates
- `toggle.service.ts` - Completion toggle
- `delete.service.ts` - Soft/hard delete
- `subscribe.service.ts` - Real-time subscription

### Features

- Create and manage travel goals
- Mark items complete/incomplete
- Categorize with custom labels
- Estimate and track costs
- Filter by completion status
- Sort by multiple criteria
- Bulk selection and deletion
- Real-time updates

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/v1/bucket-lists` | GET | List all |
| `/api/v1/bucket-lists` | POST | Create |
| `/api/v1/bucket-lists/:id` | PATCH | Update |
| `/api/v1/bucket-lists/:id` | DELETE | Delete |

---

## Itineraries

Day-by-day trip planner with drag-and-drop scheduling and timeline views.

### Data Model

```typescript
type ItineraryItem = {
  id: string
  itemType: 'bucket-list' | 'custom'
  completed: boolean
  bucketList?: string        // Reference if itemType='bucket-list'
  customItem?: {             // If itemType='custom'
    title: string
    location?: string
    cost?: number
    description?: string
    categories?: Category[]
  }
  date: string   // YYYY-MM-DD
  start: string  // HH:MM
  end: string    // HH:MM
}
```

### Views

| View | Description |
|------|-------------|
| `DayGrid` | Hour-by-hour single day view |
| `WeekGrid` | 7-day horizontal view |
| `MonthGrid` | Traditional calendar layout |
| `GridTimeline` | Compact vertical timeline |

### Key Components

| Component | Purpose |
|-----------|---------|
| `ItineraryGrid` | Main container with view switching |
| `TimelineEvent` | Draggable event card |
| `ItineraryForm` | Create/edit form |
| `EditItineraryItemSheet` | Slide-out edit panel |
| `DroppableTimeSlot` | Drop target for drag-and-drop |
| `FullscreenMode` | Distraction-free view |

### Drag & Drop

Uses `@dnd-kit/core`:

```typescript
// Drag source
const { attributes, listeners, setNodeRef } = useDraggable({
  id: item.id,
  data: { item }
})

// Drop target
const { setNodeRef, isOver } = useDroppable({
  id: timeSlotId,
  data: { date, time }
})
```

### Hooks

| Hook | Purpose |
|------|---------|
| `useGetItineraryItems` | Fetch date range |
| `useRealtimeItineraryItems` | Real-time updates |
| `useAddItineraryItem` | Create event |
| `useUpdateItineraryItem` | Update/reschedule |
| `useToggleItineraryItem` | Toggle completion |
| `useDeleteItineraryItem` | Remove event |

### Store (Zustand)

```typescript
interface ItineraryState {
  selectedDate: Date
  viewMode: 'day' | 'week' | 'month' | 'grid'
  fullscreen: boolean
  setSelectedDate: (date: Date) => void
  setViewMode: (mode: ViewMode) => void
  toggleFullscreen: () => void
}
```

### Features

- Link to bucket list items or create custom events
- Drag-and-drop rescheduling
- Multiple timeline views
- Completion tracking
- Real-time updates

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `n` | New event |
| `d` | Day view |
| `w` | Week view |
| `m` | Month view |
| `f` | Toggle fullscreen |
| `← →` | Navigate dates |

---

## Photos

Photo gallery with folder organization, bulk operations, and randomized wall view.

### Data Model

```typescript
type Photo = {
  id: string
  url: string              // Firebase Storage URL
  name: string
  realFileName: string
  extension: string
  size: number
  folderId?: string
  createdAt: Timestamp
}

type Folder = {
  id: string
  name: string
  description?: string
  createdAt: Timestamp
}
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `PhotoGrid` | Main gallery with selection |
| `PhotoCard` | Thumbnail with actions |
| `PhotoGalleryModal` | Fullscreen lightbox |
| `FolderGrid` | Folder browser |
| `PhotoUploadArea` | Drag-and-drop upload |
| `PhotoViewModeSelector` | Grid/Masonry toggle |
| `MoveToFolderDialog` | Bulk move dialog |
| `PhotoBulkDeleteButton` | Bulk delete |
| `CreateFolderDialog` | New folder creation |

### Upload Flow

```
1. Select files (drag-drop or picker)
2. Resize/optimize images (client-side)
3. Upload to Firebase Storage
4. Mirror to Google Drive (optional)
5. Store metadata in Firestore
6. Show completion toast
```

### Hooks

| Hook | Purpose |
|------|---------|
| `useGetPhotos` | Fetch by folder |
| `useRealtimePhotos` | Real-time subscription |
| `useRealtimeFolders` | Folder updates |
| `useUploadPhoto` | Upload with progress |
| `usePhotoSelection` | Bulk selection |
| `useDeletePhoto` | Delete (Storage + Firestore) |
| `useMovePhotos` | Move between folders |
| `useRandomizedPhotos` | Shuffled for wall view |

### Storage

**Firebase Storage:**
- Path: `photos/{folderId}/{filename}`
- Public URLs cached in Firestore
- Authenticated access only

**Google Drive (optional):**
- Mirror copy in Drive folder
- Organized by folder name

### Pages

| Route | Description |
|-------|-------------|
| `/photos` | All folders view |
| `/photos/[folderId]` | Photos in folder |
| `/photos/wall` | Randomized full-screen wall |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `u` | Open upload |
| `n` | New folder |
| `Esc` | Exit selection mode |
| `Del` | Delete selected |
| `Space` | Select photo |

---

## Chats

Real-time messaging with reactions, typing indicators, and message search.

### Data Model

```typescript
type ChatMessage = {
  id: string
  userId: string
  displayName: string
  message: string
  createdAt: Timestamp
  editedAt?: Timestamp
  isDeleted?: boolean
  replyToId?: string
  reactions?: Reaction[]
}

type Reaction = {
  emoji: string
  userId: string
  displayName: string
}
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `ChatsPanel` | Main chat interface |
| `MessageActions` | Reply/Edit/Delete/Reaction menu |
| `ReactionsDisplay` | Emoji reactions bar |
| `EmojiPicker` | Emoji selection popover |
| `ChatsPanelSkeleton` | Loading state |

### Hooks

| Hook | Purpose |
|------|---------|
| `useRealtimeChats` | Subscribe to messages |
| `useAddChatMessage` | Send message |
| `useEditDelete` | Edit or soft-delete |
| `useReactions` | Add/remove reactions |
| `useTyping` | Typing indicators |
| `useSearchMessages` | Search content |

### Real-time Architecture

```
Firestore
├── messages/           # Chat messages
│   ├── {messageId}
│   └── ...
└── typing/            # Typing indicators
    └── {userId}
```

### Features

- Real-time messaging via Firestore
- Emoji reactions on messages
- Typing indicators (3s timeout)
- Message search (client-side)
- Edit messages (5min window)
- Soft delete (preserves thread)
- Reply to messages

### Usage Example

```typescript
// Full page
import { ChatsPanel } from '@/features/chats/components/ChatsPanel'

export default function ChatsPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ChatsPanel height="100%" showSearch />
    </div>
  )
}

// Widget version
import { ChatsPanel } from '@/features/chats/components/ChatsPanel'

export function ChatWidget() {
  return (
    <Popover>
      <PopoverTrigger><Button>Chat</Button></PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <ChatsPanel height={400} />
      </PopoverContent>
    </Popover>
  )
}
```

---

## Shared Components

### UI Components (shadcn/ui)

Located in `components/ui/`:

`alert-dialog`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `chart`, `checkbox`, `combobox`, `dialog`, `drawer`, `dropdown-menu`, `input`, `input-group`, `label`, `popover`, `scroll-area`, `select`, `sheet`, `skeleton`, `slider`, `sonner`, `switch`, `tabs`, `textarea`, `tooltip`

### Navigation Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Navbar` | `components/Navbar.tsx` | Top navigation |
| `FloatingNav` | `components/FloatingNav.tsx` | Quick action buttons |
| `DynamicBreadcrumb` | `components/DynamicBreadcrumb.tsx` | Path navigation |
| `ThemeToggle` | `components/ThemeToggle.tsx` | Light/dark mode |
| `ThemeProvider` | `components/theme-provider.tsx` | Theme context |

### Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Footer` | `components/Footer.tsx` | Page footer |
| `Brand` | `components/Brand.tsx` | Logo component |
| `ChatWidget` | `components/ChatWidget.tsx` | Floating chat button |
