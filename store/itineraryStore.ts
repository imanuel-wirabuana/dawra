import { create } from 'zustand'

interface ItineraryStore {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

export const useItineraryStore = create<ItineraryStore>((set) => ({
  selectedDate: new Date(), // Default to today
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
}))
