"use client"

import { motion } from "framer-motion"
import { MessageCircle, Heart, Sparkles } from "lucide-react"

export default function ChatEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center px-8 py-16 text-center"
    >
      {/* Animated illustration */}
      <div className="relative mb-6">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-500/10 shadow-lg"
        >
          <MessageCircle className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="h-5 w-5 text-primary/60" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20"
        >
          <Heart className="h-3 w-3 text-primary" />
        </motion.div>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-foreground">
        Start your conversation
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Send a message to begin chatting. React with emojis and keep the connection alive.
      </p>
    </motion.div>
  )
}
