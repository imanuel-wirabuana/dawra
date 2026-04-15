# 📜 Dawra Activities Feature Plan (Type-Safe + Firebase-Aligned)

## 🧠 Core Mental Model

- Activities track **user actions across the app**
- Activities are **append-only** (never updated or deleted)
- Activities are **non-blocking** (failure does not affect main action)
- Activities are **user-facing history**, not debug logs

---

## 📦 New Entity

### Activity

type Activity = {
id?: string

/\*_ Action type (namespaced) _/
type:
| "transaction.create"
| "transaction.update"
| "transaction.delete"
| "itinerary.create"
| "itinerary.update"
| "itinerary.complete"
| "bucket.create"
| "bucket.complete"

/\*_ Entity type _/
entity: "transaction" | "itinerary" | "bucket-list"

/\*_ Reference ID _/
entityId: string

/\*_ Human-readable message _/
message: string

/\*_ Optional structured data _/
metadata?: Record<string, any>

/\*_ Firebase timestamp _/
createdAt?: Timestamp
}

---

## 🔧 Activity Service (Firebase Style)

addActivity:
async function addActivity(data: Omit<Activity, "id" | "createdAt">) {
await addDoc(collection(db, "activities"), {
...data,
createdAt: serverTimestamp()
})
}

---

## 🔄 Integration Pattern (IMPORTANT)

👉 Always call AFTER success  
👉 Never block main flow

Example (Transaction Create):

const res = await createTransaction(data)

addActivity({
type: "transaction.create",
entity: "transaction",
entityId: res.id,
message: `Created transaction: ${data.title}`,
metadata: {
amount: data.amount,
date: data.date
}
}).catch(() => {
// ignore errors (non-blocking)
})

---

## 🧩 Activity Mapping (Aligned with Your Models)

### Transaction

On Create:
type: "transaction.create"
message: "Created transaction: {title}"

On Update:
type: "transaction.update"
message: "Updated transaction: {title}"

On Delete:
type: "transaction.delete"
message: "Deleted transaction: {title}"

---

### ItineraryItem

On Create:
type: "itinerary.create"
message: "Created itinerary: {title}"

On Update (date/time change):
type: "itinerary.update"
message: "Updated itinerary schedule"

On Complete Toggle:
type: "itinerary.complete"
message: "Completed itinerary: {title}"

---

### BucketList

On Create:
type: "bucket.create"
message: "Added bucket list: {title}"

On Complete:
type: "bucket.complete"
message: "Completed bucket list: {title}"

---

## 🖥️ Activities Page (MVP)

### Display

- message
- createdAt (formatted)
- optional metadata (small)

Example:

Created transaction: Coffee (50k)
Completed itinerary: Visit cafe
Updated itinerary schedule

---

## 🔍 Query Pattern (Firestore)

Get latest activities:

query(
collection(db, "activities"),
orderBy("createdAt", "desc"),
limit(50)
)

---

## 🧱 UI Components

### Activities List

- chronological (latest first)
- grouped by day (optional later)

### Activity Item

- message
- timestamp
- subtle metadata

---

## 🚀 Development Phases

### Phase 1 (MVP)

- Create Activity type
- Create addActivity service
- Log transaction.create
- Basic Activities page

---

### Phase 2

- Add itinerary + bucket logs
- Improve message quality
- Add metadata usage

---

### Phase 3

- Group by date
- Filter by entity/type
- Activity timeline UI

---

## ⚠️ Rules / Constraints

- Do NOT block main operations if activity fails
- Do NOT log everything (only meaningful actions)
- Keep messages readable (user-first)
- Use serverTimestamp() for consistency

---

## 🧠 One-liner

Activities capture what users did — not just what data exists.
