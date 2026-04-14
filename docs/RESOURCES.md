# Resources

## Deployment

### Build Configuration

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com']
  }
}
export default nextConfig
```

### Vercel Deployment (Recommended)

```bash
# Install CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

Set environment variables in Vercel Dashboard → Settings → Environment Variables.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Storage bucket |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth secret |
| `GOOGLE_REFRESH_TOKEN` | Optional | Drive API token |
| `GOOGLE_DRIVE_FOLDER_ID` | Optional | Target Drive folder |

### Pre-Deployment Checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Firebase security rules reviewed
- [ ] Environment variables configured
- [ ] All features tested in production build

### Firebase Hosting (Alternative)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
```

```bash
docker build -t dawra-app .
docker run -p 3000:3000 --env-file .env.local dawra-app
```

---

## Troubleshooting

### Firebase Permission Denied

**Error:** `Missing or insufficient permissions`

**Solutions:**
1. Check Firestore rules allow `request.auth != null`
2. Verify user is authenticated
3. Confirm environment variables are correct

### Photos Not Uploading

**Check:**
1. Firebase Storage rules allow authenticated access
2. Google Drive credentials valid (if enabled)
3. File size under 10MB limit

### Build Failures

```bash
# Clear everything
rm -rf .next node_modules package-lock.json
npm install
npm run typecheck
npm run build
```

### Real-time Updates Not Working

**Check:**
1. Hook returns `unsubscribe` cleanup function
2. Query has `staleTime: 0` for real-time data
3. Firebase project quota not exceeded

### API 500 Errors

1. Check Vercel function logs
2. Verify environment variables in production
3. Confirm Firebase service account is valid

### Images Not Loading

```javascript
// Add to next.config.mjs
images: {
  domains: ['firebasestorage.googleapis.com']
}
```

Also check Firebase Storage CORS configuration.

### Common Development Issues

| Issue | Solution |
|-------|----------|
| Hot reload not working | Restart `npm run dev` |
| Port 3000 in use | `npx kill-port 3000` |
| Node modules issues | Delete and reinstall |
| Type errors | Run `npm run typecheck` |

### Performance Issues

**Slow initial load:**
- Check bundle size: `npm run build`
- Implement code splitting with `dynamic()`

**High Firebase reads:**
- Add pagination: `limit(50)`
- Use React Query caching

**Memory leaks:**
- Unsubscribe from listeners in `useEffect` cleanup
- Cancel in-flight requests

---

## Frequently Asked Questions

### General

**What does "Dawra" mean?**
> "Dawra" (دورة) means "trip" or "round/cycle" in Arabic — reflecting the journey from dreaming to planning to experiencing.

**Is this production-ready?**
> Core features are functional. Work-in-progress: Expenses, User management.

### Technical

**Why Next.js App Router?**
> Server components, simplified data fetching, built-in layouts, streaming.

**Why Firebase?**
> Real-time subscriptions, built-in auth, serverless scaling, no backend maintenance.

**Can I use a different database?**
> Yes, but requires rewriting services and implementing WebSockets for real-time.

**How do I add authentication?**
> 1. Enable auth in Firebase Console
> 2. Update `lib/firebase/client.ts`
> 3. Add sign-in UI
> 4. Update Firestore rules

### Features

**How do I add custom categories?**
```typescript
const { mutate } = useAddCategory()
mutate({ name: 'Adventure', color: '#FF5733' })
```

**Can I export my data?**
> Not built-in yet. Export from Firebase Console or use API to fetch all data.

**Is there offline support?**
> Firestore supports offline persistence but not enabled by default.

**How do I invite friends?**
> Currently uses shared Firebase project. For multi-user: add Firebase Auth and access control.

### Deployment

**Which platforms are supported?**

| Platform | Support |
|----------|---------|
| Vercel | ✅ Full (recommended) |
| Netlify | ⚠️ Partial |
| Firebase Hosting | ✅ Full |
| AWS Amplify | ⚠️ Partial |
| Self-hosted | ✅ Full (Docker) |

**Firebase costs?**

**Free tier:**
- 50K reads/day
- 20K writes/day
- 1GB storage

**Pay-as-you-go:** ~$0.06 per 100K reads. Small teams typically stay within free tier.

**Is Google Drive required?**
> No. It provides backup redundancy but works without it. Disable by removing Drive env vars.

### Common Tasks

**How do I reset all data?**
```bash
firebase firestore:delete --all-collections
firebase storage:delete --all
```

**How do I change the theme?**
> Edit CSS variables in `app/globals.css`.

**How do I add a new API endpoint?**
> Create `app/api/v1/my-feature/route.ts` with GET/POST handlers.

---

## Contributing

### Development Setup

1. Fork and clone
2. `npm install`
3. `git checkout -b feature/your-feature`

### Code Standards

- TypeScript strict mode
- No `any` types
- Explicit return types on exports
- Feature-based file organization

### Commit Convention

```
<type>(<scope>): <description>

types: feat, fix, docs, style, refactor, test, chore

examples:
feat(bucket-lists): add search
fix(photos): resolve upload progress
docs: update deployment guide
```

### Pull Request Process

1. Branch up to date with `main`
2. All checks passing (`typecheck`, `lint`, `build`)
3. Include screenshots for UI changes
4. Address review feedback

### Code of Conduct

- Be respectful
- Welcome newcomers
- Constructive feedback
- Assume positive intent

---

## Additional Resources

### Links

- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Project Files

- [`PROJECT_MAP.md`](../PROJECT_MAP.md) - Full project structure
- [`README.md`](../README.md) - Project overview
- [`package.json`](../package.json) - Dependencies

### Support

- Check [Troubleshooting](#troubleshooting) above
- Review feature docs in [FEATURES.md](FEATURES.md)
- Search the codebase for examples
