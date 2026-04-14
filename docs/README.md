# Dawra Documentation

Welcome to the Dawra documentation — a travel planning application for managing bucket lists, itineraries, photos, and real-time collaboration.

**Dawra** (دورة) means "trip" in Arabic — from dreaming about destinations to planning the journey and sharing memories with friends.

## Documentation Files

| File | Purpose |
|------|---------|
| [**README.md**](README.md) (this file) | Overview and navigation |
| [**GETTING-STARTED.md**](GETTING-STARTED.md) | Installation, setup, and architecture |
| [**DEVELOPMENT.md**](DEVELOPMENT.md) | Coding patterns, adding features, and API reference |
| [**FEATURES.md**](FEATURES.md) | Feature documentation (bucket lists, itineraries, photos, chats) |
| [**RESOURCES.md**](RESOURCES.md) | Deployment, troubleshooting, FAQ, and contributing |

## Quick Links

### For New Users
- [Installation & Setup](GETTING-STARTED.md#installation)
- [Architecture Overview](GETTING-STARTED.md#architecture-overview)
- [Firebase Setup](GETTING-STARTED.md#firebase-setup)

### For Developers
- [Development Workflow](DEVELOPMENT.md#development-workflow)
- [Adding a New Feature](DEVELOPMENT.md#adding-a-new-feature)
- [API Reference](DEVELOPMENT.md#api-reference)
- [Data Models](DEVELOPMENT.md#data-models)

### For Feature Details
- [Bucket Lists](FEATURES.md#bucket-lists)
- [Itineraries](FEATURES.md#itineraries)
- [Photos](FEATURES.md#photos)
- [Chats](FEATURES.md#chats)

### For Deployment & Support
- [Deployment Guide](RESOURCES.md#deployment)
- [Troubleshooting](RESOURCES.md#troubleshooting)
- [FAQ](RESOURCES.md#frequently-asked-questions)
- [Contributing](RESOURCES.md#contributing)

## Project Overview

| Aspect | Details |
|--------|---------|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui |
| **State** | Zustand, TanStack Query |
| **Backend** | Firebase (Firestore, Auth, Storage) |
| **Storage** | Firebase Storage + Google Drive |

## Directory Structure

```
dawra/
├── app/              # Next.js app router (pages & API)
├── components/       # Shared UI components
├── features/         # Feature modules
│   ├── bucket-lists/
│   ├── chats/
│   ├── itineraries/
│   └── photos/
├── hooks/            # Global custom hooks
├── lib/              # Utilities & integrations
├── store/            # Zustand stores
├── docs/             # Documentation
└── PROJECT_MAP.md    # Full project map
```

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment (copy and edit .env.local)
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run format       # Prettier formatting
npm run typecheck    # TypeScript check
```

---

**Need help?** Check [RESOURCES.md](RESOURCES.md#troubleshooting) for common issues or [FAQ](RESOURCES.md#frequently-asked-questions).
