import { create } from "zustand"
import { persist } from "zustand/middleware"

interface TimelineState {
  slotWidth: number
  slotDuration: number
  setSlotWidth: (width: number) => void
  setSlotDuration: (duration: number) => void
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
      slotWidth: 24,
      slotDuration: 15,
      setSlotWidth: (width: number) => set({ slotWidth: width }),
      setSlotDuration: (duration: number) => set({ slotDuration: duration }),
    }),
    {
      name: "timeline-settings",
    }
  )
)
