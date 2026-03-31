"use client"

import { useState } from "react"
import { useRealtimeItineraryItems } from "../hooks/useRealtimeItineraryItems"
import { useUpdateItineraryItem } from "../hooks/useUpdateItineraryItem"
import GridTimeline from "@/features/itineraries/components/GridTimeline"
import SlotWidthControl from "./SlotWidthControl"
import DatePicker from "./DatePicker"
import ItineraryForm from "./ItineraryForm"
import { deleteItineraryItem } from "../services/delete.service"
import type { ItineraryItem } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, DollarSign, Settings2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useItineraryStore } from "@/store/itineraryStore"

export default function ItineraryGrid() {
  const itineraryItems = useRealtimeItineraryItems()
  const updateMutation = useUpdateItineraryItem()
  const { selectedDate } = useItineraryStore()
  const [editingItem, setEditingItem] = useState<{
    id: string
    itemType: "bucket-list" | "custom"
    title: string
    location?: string
    cost?: number
    description?: string
    start: string
    end: string
  } | null>(null)

  const handleDelete = async (id: string) => {
    await deleteItineraryItem(id)
  }

  const handleReschedule = async (
    id: string,
    newStartTime: string,
    newEndTime: string
  ) => {
    const formatDateForInput = (date: Date) => date.toISOString().split("T")[0]

    await updateMutation.mutateAsync({
      id,
      updates: {
        start: `${formatDateForInput(selectedDate)}T${newStartTime}`,
        end: `${formatDateForInput(selectedDate)}T${newEndTime}`,
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
    start: string
    end: string
  }) => {
    setEditingItem(item)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    const selectedDate = new Date()
    const formatDateForInput = (date: Date) => date.toISOString().split("T")[0]

    await updateMutation.mutateAsync({
      id: editingItem.id,
      updates: {
        start: `${formatDateForInput(selectedDate)}T${editingItem.start}`,
        end: `${formatDateForInput(selectedDate)}T${editingItem.end}`,
        ...(editingItem.itemType === "custom" && {
          customItem: {
            title: editingItem.title,
            location: editingItem.location,
            cost: editingItem.cost,
            description: editingItem.description,
          },
        }),
      },
    })

    setEditingItem(null)
  }

  // Transform ItineraryItem to the format expected by GridTimeline
  const transformedItems =
    itineraryItems.map((item: ItineraryItem) => {
      // For bucket-list items, use bucketList data
      // For custom items, use customItem data
      const itemData =
        item.itemType === "bucket-list" ? item.bucketList : item.customItem

      return {
        ...itemData,
        id: item.id,
        itemType: item.itemType,
        title: itemData?.title || "Untitled",
        completed: item.completed,
        start: new Date(item.start).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        end: new Date(item.end).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      }
    }) || []

  // Calculate total daily budget from all items with costs
  const totalCost = itineraryItems.reduce((sum, item) => {
    const cost =
      item.itemType === "bucket-list"
        ? item.bucketList?.cost
        : item.customItem?.cost
    return sum + (cost || 0)
  }, 0)

  return (
    <>
      <Card className="border-0 bg-linear-to-br from-background to-muted/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <DatePicker />
              <ItineraryForm className="w-fit" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal text-muted-foreground">
                {transformedItems.length}{" "}
                {transformedItems.length === 1 ? "item" : "items"}
              </span>
              {totalCost > 0 && (
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  Rp.
                  {totalCost.toLocaleString()}
                </span>
              )}
              <div className="hidden md:block">
                <SlotWidthControl />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden"
                    aria-label="Timeline settings"
                  >
                    <Settings2 size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-75">
                  <DialogHeader>
                    <DialogTitle>Timeline Settings</DialogTitle>
                  </DialogHeader>
                  <SlotWidthControl />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <GridTimeline
            items={transformedItems}
            onDeleteItem={handleDelete}
            onEditItem={handleEdit}
            onReschedule={handleReschedule}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog for Custom Items */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent className="sm:max-w-96">
          <DialogHeader>
            <DialogTitle>Edit Itinerary Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleUpdate} className="space-y-4">
              {editingItem.itemType === "custom" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="editTitle">Title</Label>
                    <Input
                      id="editTitle"
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLocation">Location</Label>
                    <Input
                      id="editLocation"
                      value={editingItem.location || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="editCost">Cost</Label>
                      <Input
                        id="editCost"
                        type="number"
                        value={editingItem.cost || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            cost: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDescription">Description</Label>
                    <Input
                      id="editDescription"
                      value={editingItem.description || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                  Bucket list items can only have their time updated. Edit the
                  bucket list item directly for other changes.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStart">Start Time</Label>
                  <Input
                    id="editStart"
                    type="time"
                    value={editingItem.start}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, start: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEnd">End Time</Label>
                  <Input
                    id="editEnd"
                    type="time"
                    value={editingItem.end}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, end: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
