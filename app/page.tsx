"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Camera,
  Heart,
  Sparkles,
  MapPin,
  CalendarDays,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const floatVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function Page() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top right blob */}
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
        {/* Bottom left blob */}
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-gradient-to-tr from-accent/30 to-transparent blur-3xl" />
        {/* Center subtle glow */}
        <div className="bg-gradient-radial absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full from-primary/5 to-transparent blur-2xl" />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <motion.div
          className="container mx-auto max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column - Main content */}
            <div className="order-2 lg:order-1">
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Our Journey Together
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mb-6 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
              >
                <span className="block text-foreground">Dreaming</span>
                <span className="block">
                  <span className="gradient-text">Adventures</span>
                </span>
                <span className="block text-foreground">Together</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground"
              >
                Capture every moment, plan every adventure, and achieve your
                dreams as one. Your shared journey starts here.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3"
              >
                <Button
                  size="lg"
                  asChild
                  className="h-12 gap-2 rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                >
                  <Link href="/bucket-lists">
                    Start Our Journey
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-12 gap-2 rounded-full border-2 border-border/60 bg-card/50 px-6 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Link href="/photos">
                    <Camera className="h-4 w-4" />
                    Memories
                  </Link>
                </Button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={itemVariants}
                className="mt-12 flex items-center gap-8 border-t border-border/30 pt-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Shared Dreams
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bucket lists & goals
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Adventures
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Itineraries & plans
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Memories
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Photos & moments
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right column - Visual element */}
            <motion.div
              variants={floatVariants}
              className="order-1 flex justify-center lg:order-2"
            >
              <div className="relative">
                {/* Main card */}
                <div className="relative z-10 w-72 rounded-3xl border border-border/50 bg-card/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:w-80">
                  {/* Card header */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                      D
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Dawra</p>
                      <p className="text-xs text-muted-foreground">
                        Our Journey
                      </p>
                    </div>
                  </div>

                  {/* D-A-W-R-A breakdown */}
                  <div className="space-y-3">
                    {[
                      { letter: "D", text: "Dreams we chase" },
                      { letter: "A", text: "Adventures shared" },
                      { letter: "W", text: "Wishes come true" },
                      { letter: "R", text: "Results together" },
                      { letter: "A", text: "Always moving forward" },
                    ].map((item, i) => (
                      <motion.div
                        key={`${item.letter}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {item.letter}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Decorative line */}
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-primary/20" />
                    <div className="h-1.5 w-8 rounded-full bg-primary" />
                  </div>
                </div>

                {/* Floating decorative elements */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 h-20 w-20 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 p-4 shadow-lg backdrop-blur-sm"
                >
                  <Heart className="h-full w-full text-primary/60" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full border border-border/50 bg-card/80 p-3 shadow-lg backdrop-blur-sm"
                >
                  <Sparkles className="h-full w-full text-primary/50" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/30 bg-muted/20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-6xl"
        >
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Everything for <span className="gradient-text">Your Journey</span>
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              Tools designed to help you dream, plan, and remember together.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: "Bucket Lists",
                desc: "Dreams & goals to achieve",
                href: "/bucket-lists",
                color: "from-rose-400/20 to-rose-500/10",
              },
              {
                icon: CalendarDays,
                title: "Itineraries",
                desc: "Plan your adventures",
                href: "/itineraries",
                color: "from-amber-400/20 to-amber-500/10",
              },
              {
                icon: Camera,
                title: "Photos",
                desc: "Capture memories",
                href: "/photos",
                color: "from-violet-400/20 to-violet-500/10",
              },
              {
                icon: Sparkles,
                title: "Chats",
                desc: "Stay connected",
                href: "/chats",
                color: "from-emerald-400/20 to-emerald-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={feature.href}
                  className="group block h-full rounded-2xl border border-border/50 bg-card/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
