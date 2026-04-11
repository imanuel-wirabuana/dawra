import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ItineraryStore {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set) => ({
      selectedDate: new Date(), // Default to today
      setSelectedDate: (date: Date) => set({ selectedDate: date }),
    }),
    {
      name: 'itinerary-storage',
    }
  )
)
