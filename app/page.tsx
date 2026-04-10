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
            <Badge
              variant="outline"
              className="mb-6 h-7 gap-1.5 rounded-full border-primary/20 bg-background/80 px-3 text-xs font-medium text-primary shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/5"
            >
              <Sparkles className="h-3 w-3" />
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
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed font-light text-muted-foreground/90 sm:text-lg">
              <span className="font-medium text-primary">Dawra</span> — where
              every moment becomes a milestone, every adventure an achievement,
              and every day a step toward our goals.
            </p>
            <div className="mb-8 flex justify-center">
              <div className="max-w-sm overflow-hidden rounded-xl border border-border/50 bg-card/50 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-border/70 hover:shadow-md">
                <div className="mb-4 text-center text-lg font-light tracking-widest text-primary">
                  DAWRA
                </div>
                <div className="space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      D
                    </span>
                    <span className="pt-0.5">Dreams we chase together</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      A
                    </span>
                    <span className="pt-0.5">
                      Adventures we&apos;ll remember forever
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      W
                    </span>
                    <span className="pt-0.5">Wishes that come true</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      R
                    </span>
                    <span className="pt-0.5">Results that matter</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      A
                    </span>
                    <span className="pt-0.5">Always moving forward</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="h-11 gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground shadow-md transition-all duration-150 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
              >
                <Link href="/bucket-lists">
                  Start Our Dawra <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-11 gap-2 rounded-full border-border/60 px-6 font-medium text-foreground transition-all duration-150 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
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
