"use client"

import { useTimelineStore } from "../store/useTimelineStore"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function SlotWidthControl() {
  const { slotWidth, slotDuration, setSlotWidth, setSlotDuration } =
    useTimelineStore()

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium">Width:</Label>
        <Slider
          value={[slotWidth]}
          onValueChange={(value: number[]) => setSlotWidth(value[0])}
          min={12}
          max={48}
          step={1}
          className="w-20"
        />
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {slotWidth}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium">Duration:</Label>
        <Slider
          value={[slotDuration]}
          onValueChange={(value: number[]) => setSlotDuration(value[0])}
          min={5}
          max={60}
          step={5}
          className="w-20"
        />
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {slotDuration}m
        </span>
      </div>
    </div>
  )
}
