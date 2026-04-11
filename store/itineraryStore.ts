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
      serialize: (state: { state: ItineraryStore }) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            selectedDate: state.state.selectedDate.toISOString(),
          },
        })
      },
      deserialize: (str: string) => {
        const parsed = JSON.parse(str)
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
