import BucketListGrid from "@/features/bucket-lists/components/BucketListGrid"
import BucketListForm from "@/features/bucket-lists/components/BucketListForm"
import MobileAddButton from "@/features/bucket-lists/components/MobileAddButton"
import { Suspense } from "react"
import { Target, CheckCircle } from "lucide-react"

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Bucket Lists</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Track your goals and dreams. Add items, organize by categories, and
          mark them as complete.
        </p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="order-2 w-full lg:order-1 lg:w-[70%]">
          <Suspense fallback={<p>Loading...</p>}>
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
