"use client"

import { useMemo, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import type { ItineraryItem, BucketList, Transaction } from "@/types"
import { ItineraryTransactionItem } from "./ItineraryTransactionItem"
import { Save, CalendarX2 } from "lucide-react"

interface ItineraryTransactionsListProps {
  itineraryItems: ItineraryItem[]
  bucketLists: BucketList[]
  existingTransactions: Transaction[]
  onSave: (
    transactions: Array<{
      itemId: string
      amount: number
      title: string
      date: string
      existingId?: string
    }>
  ) => void
  isSaving: boolean
}

export function ItineraryTransactionsList({
  itineraryItems,
  bucketLists,
  existingTransactions,
  onSave,
  isSaving,
}: ItineraryTransactionsListProps) {
  // Build bucket list map for quick lookup
  const bucketListMap = useMemo(() => {
    return bucketLists.reduce(
      (acc, bl) => {
        if (bl.id) acc[bl.id] = bl
        return acc
      },
      {} as Record<string, BucketList>
    )
  }, [bucketLists])

  // Build existing transaction map by itinerary item ID
  const existingTransactionMap = useMemo(() => {
    return existingTransactions.reduce(
      (acc, t) => {
        if (t.itineraryItemId) {
          acc[t.itineraryItemId] = t
        }
        return acc
      },
      {} as Record<string, Transaction>
    )
  }, [existingTransactions])

  // Filter to only show pending items (those without saved transactions)
  const pendingItems = useMemo(() => {
    return itineraryItems.filter((item) => !existingTransactionMap[item.id])
  }, [itineraryItems, existingTransactionMap])

  // Track changed amounts
  const [changedAmounts, setChangedAmounts] = useState<
    Record<string, number | null>
  >({})

  const handleAmountChange = useCallback(
    (itemId: string, amount: number | null) => {
      setChangedAmounts((prev) => ({
        ...prev,
        [itemId]: amount,
      }))
    },
    []
  )

  const handleSave = () => {
    const transactionsToSave = Object.entries(changedAmounts)
      .filter(([, amount]) => amount !== null && amount > 0)
      .map(([itemId, amount]) => {
        const item = pendingItems.find((i) => i.id === itemId)
        if (!item) return null

        // Get title
        let title: string
        if (item.itemType === "bucket-list" && item.bucketList) {
          title = bucketListMap[item.bucketList]?.title ?? "Untitled"
        } else {
          title = item.customItem?.title ?? "Untitled"
        }

        return {
          itemId,
          amount: amount!,
          title,
          date: item.date,
          existingId: existingTransactionMap[itemId]?.id,
        }
      })
      .filter(Boolean) as Array<{
      itemId: string
      amount: number
      title: string
      date: string
      existingId?: string
    }>

    onSave(transactionsToSave)
    setChangedAmounts({})
  }

  const hasChanges = Object.values(changedAmounts).some(
    (amount) => amount !== null && amount > 0
  )

  if (pendingItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <CalendarX2 className="h-6 w-6 text-emerald-600" />
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          All caught up!
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          All itinerary items for this month have been tracked
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border/50">
      {hasChanges && (
        <div className="flex justify-end bg-muted/30 px-4 py-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="gap-1.5"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
      {pendingItems.map((item) => {
        const existingTransaction = existingTransactionMap[item.id]
        // Include transaction ID in key to force re-mount when transaction changes
        const key = `${item.id}-${existingTransaction?.id ?? "new"}`

        return (
          <ItineraryTransactionItem
            key={key}
            item={item}
            bucketListMap={bucketListMap}
            existingTransaction={existingTransaction}
            onAmountChange={handleAmountChange}
          />
        )
      })}

      {hasChanges && (
        <div className="flex justify-end bg-muted/30 px-4 py-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="gap-1.5"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
