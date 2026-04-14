"use client"

import BucketListGrid from "@/features/bucket-lists/components/BucketListGrid"
import BucketListForm from "@/features/bucket-lists/components/BucketListForm"
import MobileAddButton from "@/features/bucket-lists/components/MobileAddButton"
import BucketListGridSkeleton from "@/features/bucket-lists/components/BucketListGridSkeleton"
import { Suspense } from "react"
import { Target, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function Page() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 sm:mb-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-sm">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Bucket Lists
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Dreams and goals we chase together
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-4 py-2 backdrop-blur-sm">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Shared Dreams
            </span>
          </div>
        </div>
      </motion.div>
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-8">
        <div className="order-2 w-full lg:order-1 lg:w-[70%]">
          <Suspense fallback={<BucketListGridSkeleton />}>
            <BucketListGrid />
          </Suspense>
        </div>
        <div className="order-1 hidden w-full lg:order-2 lg:block lg:w-[30%]">
          <div className="lg:sticky lg:top-20">
            <BucketListForm />
          </div>
        </div>
      </div>

      {/* Mobile Floating Button */}
      <MobileAddButton />
    </div>
  )
}
