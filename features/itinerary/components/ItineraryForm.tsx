"use client"

import { useState } from "react"
import { useAddItineraryItem } from "../hooks/useAddItineraryItem"
import { useGetBucketListItems } from "../hooks/useGetBucketListItems"
import { useItineraryStore } from "@/store/itineraryStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BucketList } from "@/types"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Plus } from "lucide-react"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface ItineraryFormProps {
  className?: string
}

export default function ItineraryForm({ className }: ItineraryFormProps) {
  const [open, setOpen] = useState(false)
  const [selectedBucketList, setSelectedBucketList] =
    useState<BucketList | null>(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const { selectedDate } = useItineraryStore()
  const addItineraryMutation = useAddItineraryItem()
  const bucketListItems = useGetBucketListItems()

  // Format selected date for input fields
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0] // YYYY-MM-DD format
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedBucketList || !startTime || !endTime) {
      return
    }

    addItineraryMutation.mutate({
      bucketList: selectedBucketList,
      start: `${formatDateForInput(selectedDate)}T${startTime}`,
      end: `${formatDateForInput(selectedDate)}T${endTime}`,
    })
  }

  // Reset form on successful submission
  if (addItineraryMutation.isSuccess) {
    setSelectedBucketList(null)
    setStartTime("")
    setEndTime("")
    setOpen(false)
    addItineraryMutation.reset()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className={cn("mb-6", className)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Itinerary Item
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:max-w-96" align="end">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add New Itinerary Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bucketList">Bucket List Item</Label>
              <Combobox
                items={bucketListItems.filter((item) => !item.completed)}
                itemToStringValue={(item: BucketList | null) =>
                  item?.title || ""
                }
                value={selectedBucketList}
                onValueChange={setSelectedBucketList}
                disabled={addItineraryMutation.isPending}
              >
                <ComboboxInput
                  placeholder="Select a bucket list item..."
                  disabled={addItineraryMutation.isPending}
                />
                <ComboboxContent>
                  <ComboboxList>
                    {bucketListItems
                      .filter((item) => !item.completed)
                      .map((item) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.title}
                        </ComboboxItem>
                      ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStartTime(e.target.value)
                  }
                  disabled={addItineraryMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEndTime(e.target.value)
                  }
                  disabled={addItineraryMutation.isPending}
                />
              </div>
            </div>

            {addItineraryMutation.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {addItineraryMutation.error.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={addItineraryMutation.isPending}
              className="w-full"
            >
              {addItineraryMutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  )
}
