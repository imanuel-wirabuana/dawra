"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ItineraryItem, BucketList, Transaction } from "@/types"
import { formatCurrency } from "../utils/formatCurrency"
import { Banknote } from "lucide-react"

interface ItineraryTransactionItemProps {
  item: ItineraryItem
  bucketListMap: Record<string, BucketList>
  existingTransaction?: Transaction
  onAmountChange: (itemId: string, amount: number | null) => void
}

function getTitle(
  item: ItineraryItem,
  bucketListMap: Record<string, BucketList>
): string {
  if (item.itemType === "bucket-list" && item.bucketList) {
    return bucketListMap[item.bucketList]?.title ?? "Untitled"
  }
  return item.customItem?.title ?? "Untitled"
}

function getPlannedCost(
  item: ItineraryItem,
  bucketListMap: Record<string, BucketList>
): number | undefined {
  if (item.itemType === "bucket-list" && item.bucketList) {
    return bucketListMap[item.bucketList]?.cost
  }
  return item.customItem?.cost
}

export function ItineraryTransactionItem({
  item,
  bucketListMap,
  existingTransaction,
  onAmountChange,
}: ItineraryTransactionItemProps) {
  // Initialize from existing transaction - parent uses key prop to force re-mount
  const [inputValue, setInputValue] = useState<string>(
    existingTransaction?.amount.toString() ?? ""
  )

  const title = getTitle(item, bucketListMap)
  const plannedCost = getPlannedCost(item, bucketListMap)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Parse amount
    const amount =
      value === "" ? null : parseInt(value.replace(/[^0-9]/g, ""), 10) || 0
    onAmountChange(item.id, amount)
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
        <Banknote className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {item.date} · {item.start} - {item.end}
        </p>
      </div>

      {plannedCost !== undefined && plannedCost > 0 && (
        <div className="hidden shrink-0 text-xs text-muted-foreground sm:block">
          Planned: {formatCurrency(plannedCost)}
        </div>
      )}

      <div className="w-28 shrink-0 sm:w-32">
        <Label htmlFor={`amount-${item.id}`} className="sr-only">
          Actual Cost
        </Label>
        <Input
          id={`amount-${item.id}`}
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={inputValue}
          onChange={handleChange}
          className="h-8 text-right text-sm"
        />
      </div>
    </div>
  )
}
