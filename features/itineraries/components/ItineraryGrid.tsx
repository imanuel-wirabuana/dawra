"use client"

import { useRealtimeItineraryItems } from "../hooks/useRealtimeItineraryItems"
import GridTimeline from "@/features/itineraries/components/GridTimeline"
import SlotWidthControl from "./SlotWidthControl"
import DatePicker from "./DatePicker"
import ItineraryForm from "./ItineraryForm"
import { deleteItineraryItem } from "../services/delete.service"
import type { ItineraryItem } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Settings2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ItineraryGrid() {
  const itineraryItems = useRealtimeItineraryItems()

  const handleDelete = async (id: string) => {
    await deleteItineraryItem(id)
  }

  // Transform ItineraryItem to the format expected by GridTimeline
  const transformedItems =
    itineraryItems.map((item: ItineraryItem) => ({
      ...item.bucketList,
      id: item.id,
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
    })) || []

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
          <GridTimeline items={transformedItems} onDeleteItem={handleDelete} />
        </CardContent>
      </Card>
    </>
  )
}
