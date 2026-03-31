# Itineraries Feature Roadmap

Future improvements and feature ideas for the itineraries feature.

---

## Quick Wins (Low effort, high impact)

| Feature | Description |
|---------|-------------|
| **Edit existing items** | Currently only add/delete. Add an edit flow to modify time, bucket list item, or notes without recreating. |
| **Time conflict warnings** | Detect overlapping items and show a warning before saving. Prevents scheduling mistakes. |
| **Daily budget summary** | Sum the `cost` field from bucket list items and display total spend for the selected date. |
| **Item notes/remarks** | Add a text field to itinerary items for booking references, contact info, or reminders. |

---

## UX Improvements (Medium effort, better experience)

| Feature | Description |
|---------|-------------|
| **Drag-and-drop rescheduling** | Let users drag timeline items to new time slots instead of deleting and recreating. |
| **Visual time gaps** | Show empty slots between items so users see unused time at a glance. |
| **Duration badges** | Display "2h 30m" on each item so users quickly see how long activities take. |
| **Quick-add from past items** | Suggest recently scheduled bucket list items for faster entry. |
| **Conflict resolution UI** | When conflicts detected, show side-by-side comparison to help user decide. |

---

## Feature Expansions (Higher effort, new capabilities)

| Feature | Description |
|---------|-------------|
| **Multi-day view** | Week/calendar view to see the bigger picture beyond single-day scheduling. |
| **Travel time estimates** | If locations differ between consecutive items, estimate and display travel time. |
| **Export options** | PDF itinerary or iCal export for sharing with travel companions. |
| **Templates** | Save common day patterns (e.g., "Beach Day", "City Walking Tour") to reuse. |
| **Weather widget** | Fetch weather for the selected date to help plan outdoor activities. |
| **Itinerary collections** | Group days into trips (e.g., "Bali Trip 2024" containing March 1-7). |
| **Smart suggestions** | Recommend bucket list items based on time of day (morning hikes, evening dining). |
| **Collaboration** | Share itineraries with friends who can view or edit. |

---

## Data Model Considerations

Potential schema additions for future features:

```typescript
// Additional fields to consider
interface ItineraryItemExtended {
  notes?: string           // Quick Win #4
  bookingRef?: string      // Quick Win #4
  actualStart?: string     // For tracking vs planned
  actualEnd?: string
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled'
  tripId?: string          // For Itinerary collections
  order: number            // For manual sequencing
  createdAt: string
  updatedAt: string
}

interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  destination?: string
  color?: string
}
```

---

## Prioritization Notes

**Start with:**
1. Daily budget summary — Uses existing data, immediate value
2. Edit existing items — Core CRUD completeness
3. Time conflict warnings — Prevents user errors

**Consider next:**
- Duration badges
- Visual time gaps
- Item notes

**For later:**
- Multi-day view (significant UI work)
- Collaboration (requires auth changes)
- Export options (depends on user demand)

---

*Last updated: March 31, 2026*
