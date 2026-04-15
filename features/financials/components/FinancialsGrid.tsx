"use client"

import { useState, useMemo } from "react"
import { format, isSameMonth, parseISO, startOfMonth } from "date-fns"
import { Plus, ListTodo, Wallet, CalendarIcon } from "lucide-react"

import type { Transaction } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { useRealtimeTransactions } from "../hooks/useRealtimeTransactions"
import { useAddTransaction } from "../hooks/useAddTransaction"
import { useUpdateTransaction } from "../hooks/useUpdateTransaction"
import { useDeleteTransaction } from "../hooks/useDeleteTransaction"
import { useGetBucketListItems } from "@/features/bucket-lists/hooks/useGetBucketListItems"
import { useGetItineraryItems } from "@/features/itineraries/hooks/useGetItineraryItems"

import { MonthlySummary } from "./MonthlySummary"
import { ItineraryTransactionsList } from "./ItineraryTransactionsList"
import { CustomTransactionForm } from "./CustomTransactionForm"
import { CustomTransactionsList } from "./CustomTransactionsList"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MonthPicker } from "@/components/ui/monthpicker"

export default function FinancialsGrid() {
  // State
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    startOfMonth(new Date())
  )
  const [formOpen, setFormOpen] = useState(false)

  // Real-time data
  const transactions = useRealtimeTransactions(
    format(selectedMonth, "yyyy-MM-dd")
  )
  const { data: itineraryItems } = useGetItineraryItems()
  const { data: bucketLists } = useGetBucketListItems()

  // Mutations
  const { mutateAsync: addTransaction, isPending: isAdding } =
    useAddTransaction()
  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction()
  const { mutateAsync: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction()

  // Filter itinerary items by selected month
  const monthItineraryItems = useMemo(() => {
    if (!itineraryItems) return []
    return itineraryItems.filter((item) =>
      isSameMonth(parseISO(item.date), selectedMonth)
    )
  }, [itineraryItems, selectedMonth])

  // Calculate totals
  const monthlyIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const monthlyExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  // Handle saving itinerary transactions
  const handleSaveItineraryTransactions = async (
    items: Array<{
      itemId: string
      amount: number
      title: string
      date: string
      existingId?: string
    }>
  ) => {
    try {
      for (const item of items) {
        if (item.existingId) {
          await updateTransaction({
            id: item.existingId,
            updates: { amount: item.amount, title: item.title },
          })
        } else {
          await addTransaction({
            title: item.title,
            amount: item.amount,
            date: item.date,
            type: "expense",
            itineraryItemId: item.itemId,
          })
        }
      }
      toast.success(`Saved ${items.length} transaction(s)`)
    } catch (error) {
      toast.error("Failed to save transactions")
      console.error(error)
    }
  }

  // Handle adding custom transaction
  const handleAddCustomTransaction = async (
    transaction: Omit<Transaction, "id" | "itineraryItemId">
  ) => {
    try {
      await addTransaction({
        ...transaction,
        itineraryItemId: undefined,
      })
      toast.success("Transaction added")
      setFormOpen(false)
    } catch (error) {
      toast.error("Failed to add transaction")
      console.error(error)
    }
  }

  // Handle deleting transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
      toast.success("Transaction deleted")
    } catch (error) {
      toast.error("Failed to delete transaction")
      console.error(error)
    }
  }

  // Custom transactions only
  const customTransactions = useMemo(() => {
    return transactions.filter((t) => !t.itineraryItemId)
  }, [transactions])

  return (
    <div className="space-y-6">
      {/* Monthly Summary Cards */}
      <MonthlySummary
        income={monthlyIncome}
        expense={monthlyExpense}
        remaining={monthlyIncome - monthlyExpense}
      />

      {/* Main Itinerary Transactions Card */}
      <Card className="overflow-hidden border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* <MonthPicker value={selectedMonth} onChange={setSelectedMonth} /> */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !selectedMonth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedMonth ? (
                      format(selectedMonth, "MMM yyyy")
                    ) : (
                      <span>Pick a month</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <MonthPicker
                    onMonthSelect={setSelectedMonth}
                    selectedMonth={selectedMonth}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 rounded-full bg-muted/40 px-2 py-1.5 text-xs text-muted-foreground sm:gap-2 sm:px-3">
                <ListTodo className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="font-medium">
                  {monthItineraryItems.length}{" "}
                  {monthItineraryItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              {monthlyExpense > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-100 to-rose-50 px-2 py-1.5 text-xs font-semibold text-rose-700 shadow-sm sm:gap-2 sm:px-3 dark:from-rose-900/30 dark:to-rose-900/20 dark:text-rose-400">
                  <Wallet className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">
                    Rp {monthlyExpense.toLocaleString("id-ID")}
                  </span>
                  <span className="sm:hidden">
                    {monthlyExpense >= 1000000
                      ? `${(monthlyExpense / 1000000).toFixed(1)}M`
                      : `${(monthlyExpense / 1000).toFixed(0)}K`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ItineraryTransactionsList
            itineraryItems={monthItineraryItems}
            bucketLists={bucketLists ?? []}
            existingTransactions={transactions}
            onSave={handleSaveItineraryTransactions}
            isSaving={isAdding || isUpdating}
          />
        </CardContent>
      </Card>

      {/* Custom Transaction Form Card */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Sheet open={formOpen} onOpenChange={setFormOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 bg-primary px-3 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] sm:h-9 sm:px-4"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Transaction</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <Wallet className="h-4 w-4 text-primary" />
                      Add Custom Transaction
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-4 py-4">
                    <CustomTransactionForm
                      selectedMonth={format(selectedMonth, "yyyy-MM-dd")}
                      onAdd={handleAddCustomTransaction}
                      isAdding={isAdding}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-muted/40 px-2 py-1.5 text-xs text-muted-foreground sm:gap-2 sm:px-3">
              <ListTodo className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="font-medium">
                {customTransactions.length}{" "}
                {customTransactions.length === 1
                  ? "transaction"
                  : "transactions"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CustomTransactionsList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  )
}
