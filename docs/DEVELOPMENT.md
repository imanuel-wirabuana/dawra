# Development Guide

## Development Workflow

### Branch Strategy

```bash
main           # Production-ready code
├── develop    # Integration branch
├── feature/*  # Feature branches
├── fix/*      # Bug fix branches
└── hotfix/*   # Production hotfixes
```

### Creating a Feature

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ...

# Run checks
npm run typecheck
npm run lint
npm run build

# Commit with conventional commits
git commit -m "feat(bucket-lists): add search functionality"

# Push and create PR
git push origin feature/my-feature
```

## Code Conventions

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `PhotoGrid.tsx` |
| Hooks | camelCase with `use` | `usePhotoSelection.ts` |
| Services | camelCase | `subscribe.service.ts` |
| Utilities | camelCase | `utils.ts` |

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types
interface PhotoGridProps {
  photos: Photo[]
  folderId?: string
}

// 3. Component
export function PhotoGrid({ photos, folderId }: PhotoGridProps) {
  const [selected, setSelected] = useState<string[]>([])
  const { mutate: deletePhotos } = useDeletePhoto()
  
  const handleSelect = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map(photo => (
        <PhotoCard 
          key={photo.id}
          photo={photo}
          selected={selected.includes(photo.id)}
          onSelect={() => handleSelect(photo.id)}
        />
      ))}
    </div>
  )
}
```

### Hook Patterns

**Query Hook:**
```typescript
export function useGetPhotos(folderId?: string) {
  return useQuery({
    queryKey: ['photos', folderId],
    queryFn: () => getPhotosService(folderId),
    enabled: !!folderId
  })
}
```

**Mutation Hook:**
```typescript
export function useAddBucketList() {
  const queryClient = useQueryClient()
  const { toast } = useSonner()
  
  return useMutation({
    mutationFn: addBucketListService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-lists'] })
      toast.success('Item added')
    },
    onError: (error) => {
      toast.error('Failed', { description: error.message })
    }
  })
}
```

**Real-time Hook:**
```typescript
export function useRealtimePhotos(folderId?: string) {
  return useQuery({
    queryKey: ['photos', folderId, 'realtime'],
    queryFn: () => new Promise((resolve, reject) => {
      const q = folderId 
        ? query(collection(db, 'photos'), where('folderId', '==', folderId))
        : query(collection(db, 'photos'))
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => resolve(snapshot.docs.map(doc => ({ ... }))),
        (error) => reject(error)
      )
      
      return () => unsubscribe()
    })
  })
}
```

### Service Patterns

```typescript
// CRUD Service
export async function getPhotos(folderId?: string) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  if (folderId) constraints.push(where('folderId', '==', folderId))
  
  const q = query(collection(db, 'photos'), ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Photo[]
}

export async function addPhoto(data: PhotoFormData) {
  const docRef = await addDoc(collection(db, 'photos'), {
    ...data,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export async function updatePhoto(id: string, data: Partial<Photo>) {
  await updateDoc(doc(db, 'photos', id), {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export async function deletePhoto(id: string) {
  await deleteDoc(doc(db, 'photos', id))
}
```

## Adding a New Feature

### Step 1: Create Structure

```bash
mkdir -p features/my-feature/{components,hooks,services}
touch features/my-feature/index.ts
```

### Step 2: Define Types

Add to `types.d.ts`:
```typescript
type MyFeature = {
  id: string
  name: string
  // ...
}
```

### Step 3: Create Services

```typescript
// features/my-feature/services/get.service.ts
export async function getMyFeatures(): Promise<MyFeature[]> { ... }

// features/my-feature/services/add.service.ts
export async function addMyFeature(data: MyFeatureForm): Promise<string> { ... }
```

### Step 4: Create Hooks

```typescript
// features/my-feature/hooks/useGetMyFeatures.ts
export function useGetMyFeatures() { ... }

// features/my-feature/hooks/useAddMyFeature.ts
export function useAddMyFeature() { ... }
```

### Step 5: Create Components

```typescript
// features/my-feature/components/MyFeatureList.tsx
export function MyFeatureList() { ... }
```

### Step 6: Create Page

```typescript
// app/my-feature/page.tsx
import { MyFeatureList } from '@/features/my-feature/components/MyFeatureList'

export default function MyFeaturePage() {
  return <MyFeatureList />
}
```

### Step 7: Add Navigation

Update `components/Navbar.tsx` or `components/FloatingNav.tsx`.

## Data Models

### Core Types

| Entity | Key Fields |
|--------|------------|
| **BucketList** | `id`, `title`, `description`, `completed`, `cost`, `location`, `categories[]` |
| **ItineraryItem** | `id`, `itemType` ('bucket-list' \| 'custom'), `completed`, `bucketList` (ref), `customItem`, `date`, `start`, `end` |
| **Category** | `id`, `name`, `color` |
| **Photo** | `id`, `url`, `name`, `realFileName`, `extension`, `size`, `folderId` |
| **Folder** | `id`, `name`, `description` |
| **ChatMessage** | `id`, `userId`, `displayName`, `message`, `reactions[]`, `replyToId`, `isDeleted` |

### API Response Format

```typescript
type ApiResponse<T> = {
  code: -1 | 0 | 1  // -1=error, 0=loading, 1=success
  data: T
  message: string
}
```

## API Reference

### Endpoints

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/v1/bucket-lists` | GET, POST | List/create bucket lists |
| `/api/v1/bucket-lists/:id` | PATCH, DELETE | Update/delete item |
| `/api/v1/categories` | GET, POST | List/create categories |
| `/api/v1/categories/:id` | PATCH, DELETE | Update/delete category |
| `/api/v1/folders` | GET, POST | List/create photo folders |
| `/api/v1/folders/:id` | DELETE | Delete folder |
| `/api/v1/itineraries` | GET, POST | List/create itinerary items |
| `/api/v1/itineraries/:id` | PATCH, DELETE | Update/delete item |
| `/api/v1/photos` | GET, POST | List photos, upload metadata |
| `/api/v1/photos/:id` | DELETE | Delete photo |

### Request/Response Examples

**Create Bucket List:**
```http
POST /api/v1/bucket-lists
Content-Type: application/json

{
  "title": "Visit Tokyo",
  "description": "Explore Japan's capital",
  "cost": 2000,
  "categories": [{ "id": "1", "name": "Travel", "color": "#FF5733" }]
}
```

**Response:**
```json
{
  "code": 1,
  "data": { "id": "abc123" },
  "message": "Bucket list created"
}
```

## Performance Tips

1. **Use React.memo for expensive components**
2. **Virtualize long lists** with `@tanstack/react-virtual`
3. **Debounce search inputs** with `useDebounce`
4. **Lazy load images** with Next.js Image
5. **Code split features** with `dynamic()`:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { loading: () => <Skeleton /> }
)
```

## Testing

### Running Checks

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build
```

### Manual Testing Checklist

- [ ] Feature works on desktop
- [ ] Feature works on mobile
- [ ] Loading states display correctly
- [ ] Error states handled gracefully
- [ ] Real-time updates work
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

## Debugging

### Common Issues

**Firebase permission denied:**
- Check Firestore rules
- Verify user authentication

**TanStack Query cache issues:**
```typescript
// Invalidate cache
queryClient.invalidateQueries({ queryKey: ['my-key'] })

// Clear all cache
queryClient.clear()
```

**Real-time not updating:**
- Check `onSnapshot` subscription is active
- Verify query constraints
- Check Firebase rules allow reads
