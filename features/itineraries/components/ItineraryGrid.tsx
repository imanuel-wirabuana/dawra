"use client"

import { useState } from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { CalendarDays, ListTodo, Plus, Wallet } from "lucide-react"

import type { Category, ItineraryItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useItineraryStore } from "@/store/itineraryStore"
import GridTimeline from "@/features/itineraries/components/GridTimeline"

import { useDeleteItineraryItem } from "../hooks/useDeleteItineraryItem"
import { useGetBucketListItems } from "../hooks/useGetBucketListItems"
import { useRealtimeItineraryItems } from "../hooks/useRealtimeItineraryItems"
import { useToggleItineraryItem } from "../hooks/useToggleItineraryItem"
import { useUpdateItineraryItem } from "../hooks/useUpdateItineraryItem"
import EditItineraryItemSheet from "./EditItineraryItemSheet"
import ItineraryForm from "./ItineraryForm"

export default function ItineraryGrid() {
  const itineraryItems = useRealtimeItineraryItems()
  const bucketListItems = useGetBucketListItems()
  const updateMutation = useUpdateItineraryItem()
  const toggleMutation = useToggleItineraryItem()
  const deleteMutation = useDeleteItineraryItem()
  const { selectedDate, setSelectedDate } = useItineraryStore()
  const [editingItem, setEditingItem] = useState<{
    id: string
    itemType: "bucket-list" | "custom"
    title: string
    location?: string
    cost?: number
    description?: string
    categories?: Category[]
    start: string
    end: string
  } | null>(null)

  // Add popover state for ItineraryForm
  const [formOpen, setFormOpen] = useState(false)

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await toggleMutation.mutateAsync({ id, completed })
  }

  const handleReschedule = (
    id: string,
    newStartTime: string,
    newEndTime: string,
    targetDate?: Date
  ) => {
    // Use format to get yyyy-MM-dd in local timezone, avoiding UTC conversion issues
    const formatDateForInput = (date: Date) => format(date, "yyyy-MM-dd")
    const dateToUse = targetDate || selectedDate

    // Fire-and-forget: don't await, optimistic update handles the UI immediately
    updateMutation.mutate({
      id,
      updates: {
        date: formatDateForInput(dateToUse),
        start: newStartTime,
        end: newEndTime,
      },
    })
  }

  const handleEdit = (item: {
    id: string
    itemType: "bucket-list" | "custom"
    title: string
    location?: string
    cost?: number
    description?: string
    categories?: Category[]
    start: string
    end: string
  }) => {
    setEditingItem(item)
  }

  const handleUpdate = async (item: {
    id: string
    itemType: "bucket-list" | "custom"
    title: string
    location?: string
    cost?: number
    description?: string
    categories?: Category[]
    start: string
    end: string
  }) => {
    // Parse the time from the full ISO string if needed
    const parseTime = (timeStr: string) => {
      // If timeStr is already just time (HH:mm), return it
      if (timeStr.length === 5 && timeStr.includes(":")) {
        return timeStr
      }
      // If timeStr includes date portion, extract just time
      const match = timeStr.match(/T(\d{2}:\d{2})/)
      return match ? match[1] : timeStr
    }

    await updateMutation.mutateAsync({
      id: item.id,
      updates: {
        start: parseTime(item.start),
        end: parseTime(item.end),
        ...(item.itemType === "custom" && {
          customItem: {
            title: item.title,
            location: item.location,
            cost: item.cost,
            description: item.description,
            categories: item.categories,
          },
        }),
      },
    })

    setEditingItem(null)
  }

  // Transform ItineraryItem to the format expected by GridTimeline
  const transformedItems =
    itineraryItems.map((item: ItineraryItem) => {
      // For bucket-list items, resolve the linked bucket list by id
      // For custom items, use customItem data
      const bucketListItem =
        item.itemType === "bucket-list"
          ? bucketListItems.find(
              (bucketList) => bucketList.id === item.bucketList
            )
          : undefined
      const itemData =
        item.itemType === "bucket-list" ? bucketListItem : item.customItem

      return {
        ...(itemData || {}),
        id: item.id,
        itemType: item.itemType,
        title: itemData?.title || "Untitled",
        location: itemData?.location,
        cost: itemData?.cost,
        description: itemData?.description,
        categories: itemData?.categories,
        completed: item.completed,
        date: item.date ? parseISO(item.date) : new Date(item.start),
        start: item.start?.includes("T")
          ? item.start.split("T")[1]
          : item.start,
        end: item.end?.includes("T") ? item.end.split("T")[1] : item.end,
      }
    }) || []

  // Calculate total daily budget from items with costs for the selected date only
  const totalCost = itineraryItems.reduce((sum, item) => {
    if (!item.date) return sum
    const itemDate = parseISO(item.date)
    if (!isSameDay(itemDate, selectedDate)) return sum

    const cost =
      item.itemType === "bucket-list"
        ? bucketListItems.find(
            (bucketList) => bucketList.id === item.bucketList
          )?.cost
        : item.customItem?.cost
    return sum + (cost || 0)
  }, 0)

  return (
    <>
      <Card className="overflow-hidden border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Sheet open={formOpen} onOpenChange={setFormOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 bg-primary px-3 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] sm:h-9 sm:px-4"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Item</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Add New Item
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-4 py-4">
                    <ItineraryForm onSuccess={() => setFormOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 rounded-full bg-muted/40 px-2 py-1.5 text-xs text-muted-foreground sm:gap-2 sm:px-3">
                <ListTodo className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="font-medium">
                  {transformedItems.length}{" "}
                  {transformedItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              {totalCost > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-emerald-100 to-emerald-50 px-2 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm sm:gap-2 sm:px-3 dark:from-emerald-900/30 dark:to-emerald-900/20 dark:text-emerald-400">
                  <Wallet className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">
                    Rp {totalCost.toLocaleString("id-ID")}
                  </span>
                  <span className="sm:hidden">
                    {totalCost >= 1000000
                      ? `${(totalCost / 1000000).toFixed(1)}M`
                      : `${(totalCost / 1000).toFixed(0)}K`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <GridTimeline
            items={transformedItems}
            onDeleteItem={handleDelete}
            onEditItem={handleEdit}
            onToggleComplete={handleToggleComplete}
            onReschedule={handleReschedule}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </CardContent>
      </Card>

      {/* Edit Sheet for Custom Items */}
      <EditItineraryItemSheet
        item={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        onUpdate={handleUpdate}
        isPending={updateMutation.isPending}
      />
    </>
  )
}
