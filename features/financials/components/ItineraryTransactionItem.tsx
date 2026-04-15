"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
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
  const [isEditing, setIsEditing] = useState(!existingTransaction)
  const inputRef = useRef<HTMLInputElement>(null)

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
    <div className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
      {/* Icon with rose background (expenses) */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
        <Banknote className="h-4 w-4 text-rose-600" />
      </div>

      {/* Title and details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {item.date} · {item.start} - {item.end}
          {plannedCost !== undefined && plannedCost > 0 && (
            <span className="hidden sm:inline">
              {" "}
              · Planned: {formatCurrency(plannedCost)}
            </span>
          )}
        </p>
      </div>

      {/* Amount section */}
      <div className="flex shrink-0 items-center gap-1">
        {isEditing ? (
          <Input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={inputValue}
            onChange={handleChange}
            onBlur={() => {
              if (inputValue && parseInt(inputValue) > 0) {
                setIsEditing(false)
              }
            }}
            className="h-9 w-28 text-right text-sm sm:w-32"
          />
        ) : (
          <span className="text-sm font-semibold text-rose-600">
            -{formatCurrency(parseInt(inputValue) || 0)}
          </span>
        )}
      </div>
    </div>
  )
}
