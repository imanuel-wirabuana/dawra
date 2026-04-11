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
      // Serialize/deserialize dates properly
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            selectedDate: state.state.selectedDate.toISOString(),
          },
        })
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str as string)
        return {
          ...parsed,
          state: {
            ...parsed.state,
            selectedDate: new Date(parsed.state.selectedDate),
          },
        }
      },
    } as any
  )
)
