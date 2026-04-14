"use client"

import { useEffect, useRef, useCallback, useState } from "react"

// Focusable elements selector
const FOCUSABLE_ELEMENTS = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  "summary",
  "details",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
].join(", ")

interface FocusTrapOptions {
  isActive: boolean
  returnFocusOnDeactivate?: boolean
  escapeDeactivates?: boolean
  onDeactivate?: () => void
}

interface FocusTrapResult {
  containerRef: React.RefObject<HTMLElement>
  handleKeyDown: (event: React.KeyboardEvent) => void
}

export function useFocusTrap(options: FocusTrapOptions): FocusTrapResult {
  const {
    isActive,
    returnFocusOnDeactivate = true,
    escapeDeactivates = true,
    onDeactivate,
  } = options

  const containerRef = useRef<HTMLElement>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback(
    (container: HTMLElement): HTMLElement[] => {
      const elements = Array.from(
        container.querySelectorAll(FOCUSABLE_ELEMENTS)
      ) as HTMLElement[]

      // Filter out hidden elements
      return elements.filter((el) => {
        const style = window.getComputedStyle(el)
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          el.offsetParent !== null
        )
      })
    },
    []
  )

  // Store previously focused element when activating
  useEffect(() => {
    if (isActive) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement

      // Focus first focusable element
      const container = containerRef.current
      if (container) {
        const focusableElements = getFocusableElements(container)
        if (focusableElements.length > 0) {
          focusableElements[0].focus()
        }
      }
    } else if (returnFocusOnDeactivate && previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus()
    }
  }, [isActive, returnFocusOnDeactivate, getFocusableElements])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isActive) return

      const container = containerRef.current
      if (!container) return

      // Handle Escape key
      if (event.key === "Escape" && escapeDeactivates) {
        event.preventDefault()
        onDeactivate?.()
        return
      }

      // Handle Tab key for focus trapping
      if (event.key === "Tab") {
        const focusableElements = getFocusableElements(container)

        if (focusableElements.length === 0) {
          event.preventDefault()
          return
        }

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        const activeElement = document.activeElement

        // Shift + Tab (backwards)
        if (event.shiftKey) {
          if (
            activeElement === firstElement ||
            !container.contains(activeElement)
          ) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab (forwards)
          if (
            activeElement === lastElement ||
            !container.contains(activeElement)
          ) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    },
    [isActive, escapeDeactivates, onDeactivate, getFocusableElements]
  )

  return {
    containerRef: containerRef as React.RefObject<HTMLElement>,
    handleKeyDown,
  }
}

// Hook for managing focus within a modal or dialog
export function useModalFocusTrap(
  isOpen: boolean,
  onClose: () => void
): FocusTrapResult {
  return useFocusTrap({
    isActive: isOpen,
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    onDeactivate: onClose,
  })
}

// Hook for managing focus list (for dropdowns, menus)
export function useFocusList(
  itemCount: number,
  onSelect?: (index: number) => void
): {
  focusedIndex: number
  setFocusedIndex: (index: number) => void
  handleKeyDown: (event: React.KeyboardEvent) => void
} {
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setFocusedIndex((prev) => {
            const next = prev < itemCount - 1 ? prev + 1 : 0
            return next
          })
          break
        case "ArrowUp":
          event.preventDefault()
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : itemCount - 1
            return next
          })
          break
        case "Home":
          event.preventDefault()
          setFocusedIndex(0)
          break
        case "End":
          event.preventDefault()
          setFocusedIndex(itemCount - 1)
          break
        case "Enter":
        case " ":
          if (focusedIndex >= 0 && onSelect) {
            event.preventDefault()
            onSelect(focusedIndex)
          }
          break
      }
    },
    [itemCount, focusedIndex, onSelect]
  )

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
  }
}
