"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Transaction } from "@/types"

interface CustomTransactionFormProps {
  selectedMonth: string
  onAdd: (transaction: Omit<Transaction, "id" | "itineraryItemId">) => void
  isAdding: boolean
}

export function CustomTransactionForm({
  selectedMonth,
  onAdd,
  isAdding,
}: CustomTransactionFormProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0
    if (!title || parsedAmount <= 0) return

    onAdd({
      title,
      amount: parsedAmount,
      date: selectedMonth,
      type,
      description: description || undefined,
    })

    // Reset form
    setTitle("")
    setAmount("")
    setType("expense")
    setDescription("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm">
            Title
          </Label>
          <Input
            id="title"
            placeholder="e.g., Parking, Gift, Salary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm">
            Amount
          </Label>
          <Input
            id="amount"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="h-9"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm">
            Type
          </Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as "income" | "expense")}
          >
            <SelectTrigger id="type" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm">
            Description (Optional)
          </Label>
          <Input
            id="description"
            placeholder="Additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isAdding}
        className="w-full bg-primary font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] sm:w-auto"
      >
        {isAdding ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  )
}
