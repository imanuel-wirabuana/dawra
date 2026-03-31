import { useState, useCallback } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"

interface UsePhotoSelectionProps {
  ids: string[]
  isSelectionMode?: boolean
}

export function usePhotoSelection({
  ids,
  isSelectionMode = false,
}: UsePhotoSelectionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [lastSelected, setLastSelected] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  const isMobile =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)

  const handleSelect = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault()
      e.stopPropagation()

      const currentIndex = ids.indexOf(id)
      if (currentIndex === -1) return

      if (e.shiftKey && lastSelected) {
        // Shift + Click: Select range
        const lastIndex = ids.indexOf(lastSelected)
        const start = Math.min(currentIndex, lastIndex)
        const end = Math.max(currentIndex, lastIndex)
        const rangeIds = ids.slice(start, end + 1)

        setSelected((prev) => {
          const newSet = new Set(prev)
          rangeIds.forEach((rangeId) => newSet.add(rangeId))
          return newSet
        })
      } else if ((e.ctrlKey || e.metaKey) && !isMobile) {
        // Ctrl/Cmd + Click: Toggle selection (desktop only)
        setSelected((prev) => {
          const newSet = new Set(prev)
          if (newSet.has(id)) {
            newSet.delete(id)
          } else {
            newSet.add(id)
          }
          return newSet
        })
      } else if (isMobile) {
        // Mobile: Toggle selection on tap
        setSelected((prev) => {
          const newSet = new Set(prev)
          if (newSet.has(id)) {
            newSet.delete(id)
          } else {
            newSet.add(id)
          }
          return newSet
        })
      } else {
        // Regular Click: Single select
        setSelected(new Set([id]))
      }

      setLastSelected(id)
      setFocusedIndex(currentIndex)
    },
    [ids, lastSelected, isMobile]
  )

  // Keyboard navigation
  useHotkey("ArrowDown", () => {
    if (!isSelectionMode || ids.length === 0) return
    const nextIndex = focusedIndex < ids.length - 1 ? focusedIndex + 1 : 0
    setFocusedIndex(nextIndex)
    if (nextIndex >= 0 && nextIndex < ids.length) {
      setSelected(new Set([ids[nextIndex]]))
      setLastSelected(ids[nextIndex])
    }
  })

  useHotkey("ArrowUp", () => {
    if (!isSelectionMode || ids.length === 0) return
    const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : ids.length - 1
    setFocusedIndex(prevIndex)
    if (prevIndex >= 0 && prevIndex < ids.length) {
      setSelected(new Set([ids[prevIndex]]))
      setLastSelected(ids[prevIndex])
    }
  })

  useHotkey("Enter", () => {
    if (!isSelectionMode || focusedIndex < 0 || focusedIndex >= ids.length)
      return
    const currentId = ids[focusedIndex]
    setSelected(new Set([currentId]))
    setLastSelected(currentId)
  })

  useHotkey("Space", () => {
    if (!isSelectionMode || focusedIndex < 0 || focusedIndex >= ids.length)
      return
    const currentId = ids[focusedIndex]
    setSelected((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(currentId)) {
        newSet.delete(currentId)
      } else {
        newSet.add(currentId)
      }
      return newSet
    })
    setLastSelected(currentId)
  })

  // Select all
  useHotkey({ key: "a", meta: true }, () => {
    if (!isSelectionMode) return
    setSelected(new Set(ids))
    setLastSelected(ids[ids.length - 1])
  })

  useHotkey({ key: "a", ctrl: true }, () => {
    if (!isSelectionMode) return
    setSelected(new Set(ids))
    setLastSelected(ids[ids.length - 1])
  })

  const clear = useCallback(() => {
    setSelected(new Set())
    setLastSelected(null)
    setFocusedIndex(-1)
  }, [])

  const selectedIds = Array.from(selected)

  return {
    selected,
    selectedIds,
    focusedIndex,
    handleSelect,
    clear,
  }
}
