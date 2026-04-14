"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useScrollProgress } from "@/hooks/useScrollProgress"
import { Brand } from "@/components/Brand"
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb"
import Footer from "@/components/Footer"
import FloatingNav from "@/components/FloatingNav"
import ChatWidget from "@/components/ChatWidget"
import { Toaster } from "@/components/ui/sonner"

interface LayoutContentProps {
  children: React.ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { isScrolled } = useScrollProgress({ threshold: 10 })

  return (
    <>
      {/* Scroll-aware Glassmorphism Header */}
      <motion.header
        className="fixed top-0 right-0 left-0 z-[var(--z-fixed)] transition-all duration-300"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className={cn(
            "w-full transition-all duration-300",
            isScrolled
              ? "border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-xl"
              : "bg-transparent"
          )}
        >
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Brand size="md" />
            </motion.div>
            <div className="flex items-center gap-4">
              <DynamicBreadcrumb />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content with padding for fixed header */}
      <main className="relative flex-1 pt-16">{children}</main>

      {/* Elegant Footer */}
      <Footer />

      {/* Floating Navigation */}
      <FloatingNav />

      {/* Chat Widget */}
      <ChatWidget />

      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors />
    </>
  )
}
