import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NavStore {
  isExpanded: boolean
  toggle: () => void
  expand: () => void
  collapse: () => void
}

export const useNavStore = create<NavStore>()(
  persist(
    (set) => ({
      isExpanded: false,
      toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
      expand: () => set({ isExpanded: true }),
      collapse: () => set({ isExpanded: false }),
    }),
    {
      name: 'nav-storage',
    }
  )
)
