"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface ScrollProgressOptions {
  threshold?: number
  target?: React.RefObject<HTMLElement>
}

interface ScrollProgress {
  progress: number
  isScrolled: boolean
  scrollY: number
  scrollDirection: "up" | "down" | null
}

export function useScrollProgress(
  options: ScrollProgressOptions = {}
): ScrollProgress {
  const { threshold = 50 } = options
  const [scrollY, setScrollY] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  )
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight

        // Calculate progress (0 to 1)
        const newProgress = docHeight > 0 ? currentScrollY / docHeight : 0

        // Determine direction
        queueMicrotask(() => {
          if (currentScrollY > lastScrollY.current) {
            setScrollDirection("down")
          } else if (currentScrollY < lastScrollY.current) {
            setScrollDirection("up")
          }

          lastScrollY.current = currentScrollY
          setScrollY(currentScrollY)
          setProgress(Math.min(1, Math.max(0, newProgress)))
          setIsScrolled(currentScrollY > threshold)
        })

        ticking.current = false
      })

      ticking.current = true
    }
  }, [threshold])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  return {
    progress,
    isScrolled,
    scrollY,
    scrollDirection,
  }
}

// Hook for element-specific scroll progress
export function useElementScrollProgress(
  elementRef: React.RefObject<HTMLElement>
): ScrollProgress & { isInView: boolean } {
  const [progress, setProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  )
  const [isInView, setIsInView] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect()
          const windowHeight = window.innerHeight
          const elementHeight = rect.height

          // Element is in view if any part is visible
          const inView = rect.top < windowHeight && rect.bottom > 0

          const currentScrollY = window.scrollY

          queueMicrotask(() => {
            setIsInView(inView)

            if (inView) {
              // Calculate progress through the element
              const scrolled = windowHeight - rect.top
              const totalScrollable = windowHeight + elementHeight
              const newProgress = Math.max(
                0,
                Math.min(1, scrolled / totalScrollable)
              )

              setProgress(newProgress)
              setIsScrolled(rect.top < 0)
            }

            if (currentScrollY > lastScrollY.current) {
              setScrollDirection("down")
            } else if (currentScrollY < lastScrollY.current) {
              setScrollDirection("up")
            }

            lastScrollY.current = currentScrollY
            setScrollY(currentScrollY)
          })

          ticking.current = false
        })

        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [elementRef])

  return {
    progress,
    isScrolled,
    scrollY,
    scrollDirection,
    isInView,
  }
}
