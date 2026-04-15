"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2, Receipt } from "lucide-react"
import type { Transaction } from "@/types"
import { formatCurrency } from "../utils/formatCurrency"
import { format } from "date-fns"

interface CustomTransactionsListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  isDeleting: boolean
}

export function CustomTransactionsList({
  transactions,
  onDelete,
  isDeleting,
}: CustomTransactionsListProps) {
  // Filter only custom transactions (no itineraryItemId)
  const customTransactions = transactions.filter((t) => !t.itineraryItemId)

  if (customTransactions.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground">No custom transactions yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border/50">
      {customTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
            <Receipt className="h-4 w-4 text-muted-foreground" />
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
                className="shrink-0 text-xs"
              >
                {transaction.type}
              </Badge>
            </div>
            {transaction.description && (
              <p className="truncate text-xs text-muted-foreground">
                {transaction.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {format(new Date(transaction.date), "MMM d, yyyy")}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`text-sm font-medium ${
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
                  className="size-7"
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
        </div>
      ))}
    </div>
  )
}
