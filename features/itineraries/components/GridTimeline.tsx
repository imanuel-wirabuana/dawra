"use client"

import TimelineEvent from "./TimelineEvent"
import { Trash2 } from "lucide-react"
import { useTimelineStore } from "../store/useTimelineStore"

type Item = {
  id: string
  title: string
  start: string
  end: string
  location?: string
  cost?: number
  description?: string
}

const SIDEBAR_WIDTH = 160

const timeToIndex = (time: string, slotDuration: number) => {
  const [h, m] = time.split(":").map(Number)
  return (h * 60 + m) / slotDuration
}

const generateSlots = (slotDuration: number) => {
  const slots = []
  for (let i = 0; i < 24 * 60; i += slotDuration) {
    const h = String(Math.floor(i / 60)).padStart(2, "0")
    const m = String(i % 60).padStart(2, "0")
    slots.push(`${h}:${m}`)
  }
  return slots
}

export default function NotionHourlyTimeline({
  items,
  onDeleteItem,
}: {
  items: Item[]
  onDeleteItem: (id: string) => void
}) {
  const { slotWidth, slotDuration } = useTimelineStore()
  const totalSlots = (24 * 60) / slotDuration
  const slots = generateSlots(slotDuration)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground">
          <h3 className="text-lg font-semibold">No itinerary items</h3>
          <p className="text-sm">Start by adding items to your itinerary</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto border bg-background">
      {/* HEADER */}
      <div
        className="sticky top-0 z-30 grid w-max border-b bg-primary/10 text-xs"
        style={{
          gridTemplateColumns: `${SIDEBAR_WIDTH}px repeat(${totalSlots}, ${slotWidth}px)`,
        }}
      >
        {/* Sticky Task Header */}
        <div className="sticky left-0 z-40 border-r bg-transparent p-3 font-medium text-primary-foreground shadow-sm"></div>

        {slots.map((s, i) => {
          const isHour = i % 4 === 0
          return (
            <div
              key={i}
              className={`relative border-l ${
                isHour
                  ? "border-muted-foreground/40 bg-muted/30"
                  : "border-muted-foreground/10"
              }`}
            >
              {isHour && (
                <span className="absolute top-1 left-1 text-[10px] font-semibold text-muted-foreground">
                  {s}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ROWS */}
      {items.map((item) => {
        const start = timeToIndex(item.start, slotDuration)
        const end = timeToIndex(item.end, slotDuration)
        const span = end - start

        return (
          <div
            key={item.id}
            className="relative grid h-12 w-max border-b"
            style={{
              gridTemplateColumns: `${SIDEBAR_WIDTH}px repeat(${totalSlots}, ${slotWidth}px)`,
            }}
          >
            {/* Sticky Task Column */}
            <div className="sticky left-0 z-20 flex items-center justify-between truncate border-r bg-primary p-2 text-sm text-primary-foreground">
              <span className="truncate px-1">{item.title}</span>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                title="Delete item"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            {/* GRID BACKGROUND */}
            {Array.from({ length: totalSlots }).map((_, i) => {
              const isHour = i % 4 === 0
              return (
                <div
                  key={i}
                  className={`border-l ${
                    isHour
                      ? "border-muted-foreground/30"
                      : "border-muted-foreground/10"
                  }`}
                />
              )
            })}

            {/* EVENT */}
            <TimelineEvent
              item={{
                id: item.id,
                title: item.title,
                start: item.start,
                end: item.end,
                location: item.location,
                cost: item.cost,
                description: item.description,
              }}
              style={{
                position: "absolute",
                left: `calc(${SIDEBAR_WIDTH}px + ${start * slotWidth}px)`,
                width: `${span * slotWidth}px`,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
