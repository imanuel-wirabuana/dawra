"use client"

import { Heart, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-auto border-t border-border/30 bg-muted/10 py-8">
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {/* Brand line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground shadow-sm">
              D
            </div>
            <span className="text-lg font-semibold text-foreground">Dawra</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-sm text-muted-foreground">{currentYear}</span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary/60" />
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 fill-primary/80 text-primary/80 transition-all hover:scale-110 hover:fill-primary" />
            <span>by</span>
            <a
              href="https://github.com/imanuel-wirabuana"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              Fio
            </a>
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
