"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2, Receipt, FileText } from "lucide-react"
import type { Transaction, BucketList, ItineraryItem } from "@/types"
import { formatCurrency } from "../utils/formatCurrency"
import { format } from "date-fns"

interface CustomTransactionsListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  isDeleting: boolean
  bucketLists?: BucketList[]
  itineraryItems?: ItineraryItem[]
}

export function CustomTransactionsList({
  transactions,
  onDelete,
  isDeleting,
  bucketLists = [],
  itineraryItems = [],
}: CustomTransactionsListProps) {
  // Build lookup maps
  const bucketListMap = useMemo(() => {
    return bucketLists.reduce(
      (acc, bl) => {
        if (bl.id) acc[bl.id] = bl
        return acc
      },
      {} as Record<string, BucketList>
    )
  }, [bucketLists])

  const itineraryItemMap = useMemo(() => {
    return itineraryItems.reduce(
      (acc, item) => {
        if (item.id) acc[item.id] = item
        return acc
      },
      {} as Record<string, ItineraryItem>
    )
  }, [itineraryItems])

  // Helper to get planned cost for a transaction
  const getPlannedCost = (transaction: Transaction): number | undefined => {
    if (!transaction.itineraryItemId) return undefined

    const item = itineraryItemMap[transaction.itineraryItemId]
    if (!item) return undefined

    if (item.itemType === "bucket-list" && item.bucketList) {
      return bucketListMap[item.bucketList]?.cost
    }
    return item.customItem?.cost
  }

  // Show ALL transactions (both itinerary-linked and custom)
  const allTransactions = transactions

  if (allTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          No transactions yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add transactions from the Itinerary tab or manually add custom
          transactions
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border/50">
      {allTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              transaction.type === "income"
                ? "bg-emerald-500/10"
                : "bg-rose-500/10"
            }`}
          >
            <Receipt
              className={`h-4 w-4 ${
                transaction.type === "income"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">
                {transaction.title}
              </p>
              <Badge
                variant={
                  transaction.type === "income" ? "default" : "secondary"
                }
                className="h-4 shrink-0 px-1.5 py-0 text-[10px]"
              >
                {transaction.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(transaction.date), "MMM d, yyyy")}
              {(() => {
                const planned = getPlannedCost(transaction)
                if (planned !== undefined) {
                  return (
                    <span>
                      {" · "}
                      <span className="text-muted-foreground">
                        Planned: {formatCurrency(planned)}
                      </span>
                      <span className="text-primary"> · From Itinerary</span>
                    </span>
                  )
                }
                if (transaction.itineraryItemId) {
                  return <span className="text-primary"> · From Itinerary</span>
                }
                return null
              })()}
              {transaction.description && ` · ${transaction.description}`}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-semibold ${
                  transaction.type === "income"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                    disabled={isDeleting}
                  >
                    <MoreVertical className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDelete(transaction.id)}
                    className="text-xs text-destructive"
                  >
                    <Trash2 className="mr-2 size-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {(() => {
              const planned = getPlannedCost(transaction)
              if (planned !== undefined && transaction.type === "expense") {
                const diff = transaction.amount - planned
                const isOver = diff > 0
                const isUnder = diff < 0
                return (
                  <span
                    className={`text-xs font-medium ${
                      isOver
                        ? "text-rose-600"
                        : isUnder
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {isOver ? "+" : isUnder ? "" : ""}
                    {formatCurrency(Math.abs(diff))}{" "}
                    {isOver ? "over" : isUnder ? "under" : "on budget"}
                  </span>
                )
              }
              return null
            })()}
          </div>
        </div>
      ))}
    </div>
  )
}
