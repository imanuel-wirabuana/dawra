"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useReducedMotion } from "./useReducedMotion"

interface InViewAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

interface InViewAnimationResult {
  ref: React.RefObject<HTMLElement>
  isInView: boolean
  hasAnimated: boolean
}

export function useInViewAnimation(
  options: InViewAnimationOptions = {}
): InViewAnimationResult {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
  } = options

  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If reduced motion is preferred, immediately show content
    if (prefersReducedMotion) {
      queueMicrotask(() => {
        setIsInView(true)
        setHasAnimated(true)
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsInView(true)
                setHasAnimated(true)
              }, delay)
            } else {
              setIsInView(true)
              setHasAnimated(true)
            }

            if (triggerOnce) {
              observer.unobserve(element)
            }
          } else if (!triggerOnce) {
            setIsInView(false)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, delay, prefersReducedMotion])

  return { ref: ref as React.RefObject<HTMLElement>, isInView, hasAnimated }
}

// Hook for staggering multiple elements
export function useStaggerInView(
  itemCount: number,
  options: InViewAnimationOptions & { staggerDelay?: number } = {}
): { isInView: boolean; getItemDelay: (index: number) => number } {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
    staggerDelay = 50,
  } = options

  const containerRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    if (prefersReducedMotion) {
      queueMicrotask(() => {
        setIsInView(true)
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsInView(true)
            }, delay)

            if (triggerOnce) {
              observer.unobserve(element)
            }
          } else if (!triggerOnce) {
            setIsInView(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, delay, prefersReducedMotion])

  const getItemDelay = useCallback(
    (index: number) => {
      if (prefersReducedMotion) return 0
      return index * staggerDelay
    },
    [staggerDelay, prefersReducedMotion]
  )

  return { isInView, getItemDelay }
}

// Hook for parallax effect
export function useParallax(speed: number = 0.5): {
  ref: React.RefObject<HTMLElement>
  offset: number
} {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  const ticking = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const element = ref.current
          if (element) {
            const rect = element.getBoundingClientRect()
            const scrolled = window.scrollY
            const elementTop = rect.top + scrolled
            const relativeScroll = scrolled - elementTop + window.innerHeight
            setOffset(relativeScroll * speed)
          }
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed, prefersReducedMotion])

  return { ref: ref as React.RefObject<HTMLElement>, offset }
}
