# 💰 Dawra Financial Feature Plan (Itinerary-Driven Transactions)

## 🧠 Core Mental Model

- BucketList / CustomItem = idea (template)
- ItineraryItem = planned event (scheduled)
- Transaction = actual money (source of truth)

👉 Transactions are created through a **monthly input interface**, not directly tied to itinerary creation.

---

## 📦 Data Models

### ItineraryItem

type ItineraryItem = {
id: string
itemType: "bucket-list" | "custom"
completed: boolean
bucketList?: string
customItem?: CustomItineraryItem
date: string
start: string
end: string
}

### BucketList

type BucketList = {
id?: string
title: string
description?: string
completed: boolean
cost?: number
location?: string
categories?: Category[]
}

### CustomItineraryItem

type CustomItineraryItem = {
title: string
location?: string
cost?: number
description?: string
categories?: Category[]
}

### Transaction (ONLY NEW ENTITY)

type Transaction = {
id: string
title: string
description?: string
amount: number
date: string
type: "income" | "expense"
itineraryItemId?: string
}

---

## 🔧 Helper Functions

Resolve Planned Cost:
function getPlannedCost(item, bucketListMap) {
if (item.itemType === "bucket-list") {
return bucketListMap[item.bucketList]?.cost ?? 0
}
if (item.itemType === "custom") {
return item.customItem?.cost ?? 0
}
return 0
}

Resolve Title:
function getTitle(item, bucketListMap) {
if (item.itemType === "bucket-list") {
return bucketListMap[item.bucketList]?.title ?? "Untitled"
}
return item.customItem?.title ?? "Untitled"
}

---

## 📊 Monthly Budget Logic

Monthly Expense (source of truth):
monthlyExpense = sum(
transactions.filter(t =>
t.type === "expense" &&
isSameMonth(t.date, selectedMonth)
)
)

Monthly Income (temporary: from manual input or transaction type="income"):
monthlyIncome = sum(
transactions.filter(t =>
t.type === "income" &&
isSameMonth(t.date, selectedMonth)
)
)

Remaining Balance:
remaining = monthlyIncome - monthlyExpense

---

## 🖥️ Transactions Page (CORE FEATURE)

### Behavior

- User selects a month
- System loads:
  - All ItineraryItems in that month
  - Existing Transactions in that month

---

### Section 1: Itinerary-Based Inputs

Display list:

For each ItineraryItem:

- Title (resolved)
- Planned cost (optional display)
- Input field → "Actual Cost"

Example UI:
Coffee at Starbucks | Planned: 50k | [ input: 55000 ]

---

### Input Rules

- If input is filled → will create/update transaction
- If empty → no transaction created

---

### Save Action

On save:
For each itinerary item with input:

createTransaction({
title: getTitle(item),
amount: inputAmount,
date: item.date,
type: "expense",
itineraryItemId: item.id
})

---

### Section 2: Custom Transactions

User can add manual transactions:

Fields:

- title
- amount
- type (income / expense)
- date
- description (optional)

Example:
"Parking" | 5000 | expense

---

## 🔄 Editing Behavior

If transaction already exists for an itinerary item:

- Pre-fill input with existing amount

On change:

- Update transaction instead of creating new

---

## 📊 UI Components

### 1. Monthly Summary

- Total Income
- Total Expense
- Remaining Balance

---

### 2. Itinerary Transaction List

- Title
- Planned cost (optional)
- Input for actual cost

---

### 3. Custom Transaction List

- Standard transaction entries
- Editable / deletable

---

### 4. Save Button

- Saves all changes in batch

---

## 🔗 Data Relationships

BucketList / CustomItem
↓
ItineraryItem (planned)
↓ (via UI input)
Transaction (actual)

---

## 🚀 Development Phases

Phase 1 (MVP):

- Create Transaction model
- Build Transactions Page
- List itinerary items per month
- Add input for actual cost
- Save → create transactions
- Monthly summary calculation

Phase 2:

- Pre-fill existing transactions
- Update instead of duplicate
- Add custom transactions

Phase 3:

- Add planned vs actual display
- Improve UI/UX (faster input, inline editing)

---

## ⚠️ Rules / Constraints

- Do NOT calculate budget from itinerary
- Always use transactions for actual spending
- One itinerary item → max one transaction (enforced in UI)
- itineraryItemId is optional (for custom transactions)
- Keep everything simple (no wallets, no categories yet)

---

## 🧠 One-liner

Plan with itinerary, input actuals monthly, track with transactions.
