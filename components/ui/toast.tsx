"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps {
  toast: Toast
  onDismiss: (id: string) => void
  position?: "top" | "bottom" | "top-right" | "bottom-right" | "bottom-left"
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles = {
  success:
    "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
  error: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
  info: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
  warning:
    "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400",
}

function ToastItem({
  toast,
  onDismiss,
  position = "bottom-right",
}: ToastProps) {
  const [progress, setProgress] = useState(100)
  const duration = toast.duration || 5000
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const Icon = toastIcons[toast.type]

  useEffect(() => {
    const startTime = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining === 0) {
        onDismiss(toast.id)
      }
    }, 16)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [duration, toast.id, onDismiss])

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: position.includes("bottom") ? 20 : -20,
        scale: 0.9,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative flex max-w-100 min-w-75 items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm",
        toastStyles[toast.type],
        position.includes("bottom") && "mb-3"
      )}
      onClick={() => onDismiss(toast.id)}
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-xs opacity-90">{toast.description}</p>
        )}
        {toast.action && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation()
              toast.action?.onClick()
              onDismiss(toast.id)
            }}
          >
            {toast.action.label}
          </Button>
        )}
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="-mt-1 -mr-1 h-6 w-6 shrink-0 opacity-60 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onDismiss(toast.id)
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Progress Bar */}
      <div className="absolute right-0 bottom-0 left-0 h-1 overflow-hidden rounded-b-xl bg-current opacity-20">
        <motion.div
          className="h-full bg-current"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  )
}

// Toast Container Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, type: "success", duration })
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, type: "error", duration })
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, type: "info", duration })
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, type: "warning", duration })
    },
    [addToast]
  )

  return {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    info,
    warning,
  }
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
  position?: "top" | "bottom" | "top-right" | "bottom-right" | "bottom-left"
  className?: string
}

export function ToastContainer({
  toasts,
  onDismiss,
  position = "bottom-right",
  className,
}: ToastContainerProps) {
  const positionClasses = {
    top: "top-4 left-1/2 -translate-x-1/2 flex-col",
    bottom: "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
    "top-right": "top-4 right-4 flex-col",
    "bottom-right": "bottom-4 right-4 flex-col-reverse",
    "bottom-left": "bottom-4 left-4 flex-col-reverse",
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-100 flex gap-2",
        positionClasses[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem
              toast={toast}
              onDismiss={onDismiss}
              position={position}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
