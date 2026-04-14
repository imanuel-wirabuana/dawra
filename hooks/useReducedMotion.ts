"use client"

import { useEffect, useState } from "react"

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    queueMicrotask(() => {
      setPrefersReducedMotion(mediaQuery.matches)
    })

    const handleChange = (event: MediaQueryListEvent) => {
      queueMicrotask(() => {
        setPrefersReducedMotion(event.matches)
      })
    }

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }

    // Legacy API for older browsers
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return prefersReducedMotion
}

// Hook for getting animation props based on reduced motion preference
export function useAnimationProps() {
  const prefersReducedMotion = useReducedMotion()

  return {
    // Returns transition duration (0 for reduced motion)
    getDuration: (normalDuration: number) =>
      prefersReducedMotion ? 0 : normalDuration,

    // Returns spring config (stiff spring for reduced motion)
    getSpring: (stiffness = 300, damping = 30) =>
      prefersReducedMotion
        ? { type: "spring" as const, stiffness: 1000, damping: 100 }
        : { type: "spring" as const, stiffness, damping },

    // Returns transition config
    getTransition: (duration = 0.3, ease = [0.4, 0, 0.2, 1]) =>
      prefersReducedMotion ? { duration: 0 } : { duration, ease },

    // Whether to animate at all
    shouldAnimate: !prefersReducedMotion,
  }
}
