import BucketListGrid from "@/features/bucket-list/components/BucketListGrid"
import BucketListGridSkeleton from "@/features/bucket-list/components/BucketListGridSkeleton"
import BucketListForm from "@/features/bucket-list/components/BucketListForm"
import { Suspense } from "react"

export default function Page() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Bucket List</h1>
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <BucketListForm className="lg:sticky lg:top-17" />
        </div>
        <div className="w-full lg:w-3/4">
          <Suspense fallback={<BucketListGridSkeleton />}>
            <BucketListGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
