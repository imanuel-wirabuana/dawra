"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-[80vh] flex-col">
      {/* Hero Section - Full Viewport minus navbar */}
      <section
        className="flex flex-1 items-center justify-center py-8"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 border border-primary/30 bg-background/90 px-3 py-1 text-primary shadow-sm backdrop-blur-sm dark:border-primary/40 dark:bg-background/80">
              <Sparkles className="mr-2 h-3 w-3" />
              Dawra - Our Journey Together
            </Badge>
            <h1 className="mb-4 text-3xl leading-tight font-light tracking-wide sm:text-4xl lg:text-5xl">
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text font-semibold text-transparent dark:from-primary dark:to-primary/80">
                D
              </span>
              <span className="font-light text-foreground dark:text-foreground/90">
                reaming{" "}
              </span>
              <span className="bg-linear-to-r from-primary/60 to-primary bg-clip-text font-semibold text-transparent dark:from-primary/80 dark:to-primary">
                A
              </span>
              <span className="font-light text-foreground dark:text-foreground/90">
                dventures,{" "}
              </span>
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text font-semibold text-transparent dark:from-primary dark:to-primary/80">
                W
              </span>
              <span className="font-light text-foreground dark:text-foreground/90">
                ith{" "}
              </span>
              <span className="bg-linear-to-r from-primary/60 to-primary bg-clip-text font-semibold text-transparent dark:from-primary/80 dark:to-primary">
                R
              </span>
              <span className="font-light text-foreground dark:text-foreground/90">
                esults,{" "}
              </span>
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text font-semibold text-transparent dark:from-primary dark:to-primary/80">
                A
              </span>
              <span className="font-light text-foreground dark:text-foreground/90">
                lways
              </span>
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed font-light text-muted-foreground dark:text-muted-foreground/80">
              <span className="font-medium text-primary dark:text-primary/90">
                Dawra
              </span>{" "}
              — where every moment becomes a milestone, every adventure a
              achievement, and every day a step toward our goals.
            </p>
            <div className="mb-6 flex justify-center">
              <div className="max-w-sm rounded-xl border border-primary/15 bg-background/70 p-4 shadow-lg backdrop-blur-sm dark:border-primary/20 dark:bg-background/60 dark:shadow-xl">
                <div className="mb-3 text-xl font-light tracking-widest text-primary dark:text-primary/90">
                  DAWRA
                </div>
                <div className="space-y-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-primary dark:text-primary/90">
                      D
                    </span>
                    <span>Dreams we chase together</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-primary dark:text-primary/90">
                      A
                    </span>
                    <span>Adventures we&apos;ll remember forever</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-primary dark:text-primary/90">
                      W
                    </span>
                    <span>Wishes that come true</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-primary dark:text-primary/90">
                      R
                    </span>
                    <span>Results that matter</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-primary dark:text-primary/90">
                      A
                    </span>
                    <span>Always moving forward</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="gap-2 rounded-full px-6 py-2 shadow-md transition-all hover:shadow-lg dark:shadow-lg dark:hover:shadow-xl"
              >
                <Link href="/bucket-lists">
                  Start Our Dawra <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full border-primary/25 px-6 py-2 text-primary transition-all hover:bg-primary/5 dark:border-primary/30 dark:hover:bg-primary/10"
              >
                <Link href="/photos">Our Dawra Memories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
