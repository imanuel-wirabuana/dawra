"use client"

import { useState, useMemo } from "react"
import { format, isSameMonth, parseISO, startOfMonth } from "date-fns"
import { Plus, ListTodo, Wallet, CalendarIcon } from "lucide-react"

import type { Transaction } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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

  return (
    <div className="space-y-6">
      {/* Monthly Summary Cards */}
      <MonthlySummary
        income={monthlyIncome}
        expense={monthlyExpense}
        remaining={monthlyIncome - monthlyExpense}
      />

      {/* Main Content - Tabs Layout */}
      <Card className="overflow-hidden border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start gap-2 border-border/50 bg-background/80 px-3 text-left font-normal transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm",
                      !selectedMonth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {selectedMonth ? (
                      format(selectedMonth, "MMMM yyyy")
                    ) : (
                      <span>Pick a month</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <MonthPicker
                    onMonthSelect={setSelectedMonth}
                    selectedMonth={selectedMonth}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <Sheet open={formOpen} onOpenChange={setFormOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 bg-primary px-3 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <Wallet className="h-4 w-4 text-primary" />
                      Add Transaction
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
          </div>
        </CardHeader>

        <Tabs defaultValue="itinerary" className="w-full">
          <div className="border-b border-border/50 px-4 py-2">
            <TabsList variant="line" className="w-full sm:w-auto">
              <TabsTrigger value="itinerary" className="gap-2">
                <ListTodo className="h-3.5 w-3.5" />
                Pending
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0 text-[10px] font-medium">
                  {
                    monthItineraryItems.filter(
                      (item) =>
                        !transactions.find((t) => t.itineraryItemId === item.id)
                    ).length
                  }
                </span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="gap-2">
                <Wallet className="h-3.5 w-3.5" />
                Transactions
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0 text-[10px] font-medium">
                  {transactions.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="itinerary" className="m-0">
            <ItineraryTransactionsList
              itineraryItems={monthItineraryItems}
              bucketLists={bucketLists ?? []}
              existingTransactions={transactions}
              onSave={handleSaveItineraryTransactions}
              isSaving={isAdding || isUpdating}
            />
          </TabsContent>

          <TabsContent value="transactions" className="m-0">
            <CustomTransactionsList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              isDeleting={isDeleting}
              bucketLists={bucketLists ?? []}
              itineraryItems={itineraryItems ?? []}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
