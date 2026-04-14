# Getting Started

## Prerequisites

- Node.js 20+
- npm or pnpm
- Firebase account
- Google Cloud project (for Drive API, optional)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dawra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   Create `.env.local`:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google Drive (optional)
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   GOOGLE_REFRESH_TOKEN=your_refresh_token
   GOOGLE_DRIVE_FOLDER_ID=your_folder_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Enable Firebase Authentication (Anonymous or Google)
5. Copy config to `.env.local`

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Firebase Storage Rules

```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Google Drive Setup (Optional)

For photo backup to Google Drive:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google Drive API
3. Create OAuth 2.0 credentials
4. Generate refresh token
5. Add to `.env.local`

## Architecture Overview

```
┌─────────────────────────────────────────┐
│              UI Layer                   │
│  (Pages, Components, shadcn/ui)         │
├─────────────────────────────────────────┤
│           Feature Layer                 │
│  (Components, Hooks, Services)          │
├─────────────────────────────────────────┤
│          Data Layer                     │
│  (TanStack Query, Zustand, Firebase)    │
├─────────────────────────────────────────┤
│          Service Layer                  │
│  (API Routes, Firebase Services)        │
└─────────────────────────────────────────┘
```

### Feature-Based Organization

Each feature is self-contained:

```
features/[feature]/
├── components/     # Feature-specific UI
├── hooks/          # Feature-specific hooks
└── services/       # Business logic & API calls
```

### State Management

| Type | Technology | Use For |
|------|------------|---------|
| Server State | TanStack Query | All Firebase data |
| Global UI State | Zustand | Navigation, view modes |
| Local State | React useState | Form inputs, selections |

### Data Flow

**Read Flow:**
```
Component → Hook (useQuery/useRealtime) → Service → Firestore
     ↑                                              ↓
     └────────── onSnapshot Update ←───────────────┘
```

**Write Flow:**
```
Component → Hook (useMutation) → Service → Firestore
     ↑                                              ↓
     └────────── Cache Invalidation ←───────────────┘
```

## Database Schema

Firestore collections:

```
bucket-lists/     # Bucket list items
  - title: string
  - description: string
  - completed: boolean
  - cost: number
  - location: string
  - categories: array
  - createdAt: timestamp

categories/       # Category definitions
  - name: string
  - color: string

itineraries/      # Itinerary events
  - itemType: "bucket-list" | "custom"
  - bucketList: reference
  - customItem: object
  - date: string (YYYY-MM-DD)
  - start: string (HH:MM)
  - end: string (HH:MM)
  - completed: boolean

photos/           # Photo metadata
  - url: string
  - name: string
  - folderId: string
  - createdAt: timestamp

folders/          # Photo folders
  - name: string
  - description: string

chats/            # Chat messages
  - userId: string
  - displayName: string
  - message: string
  - reactions: array
  - createdAt: timestamp
```

## First Steps

1. **Create Categories** - Set up categories for organizing items
2. **Add Bucket List Items** - Start tracking travel goals
3. **Plan Itinerary** - Schedule items on specific dates
4. **Upload Photos** - Organize travel memories
5. **Invite Friends** - Use chat for collaboration

## Tech Stack Details

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4 |
| **Components** | shadcn/ui, Radix UI, Base UI |
| **Icons** | Lucide React |
| **State** | Zustand, TanStack Query |
| **Drag & Drop** | @dnd-kit |
| **Backend** | Firebase (Firestore, Auth, Storage) |
| **Integrations** | Google Drive API |

## Next Steps

- [Development Guide](DEVELOPMENT.md) - Learn coding patterns
- [Feature Docs](FEATURES.md) - Understand each feature
- [Deployment](RESOURCES.md#deployment) - Go to production
