"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import BucketListForm from "./BucketListForm"

export default function MobileAddButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button - Mobile Only */}
      <div className="fixed right-4 bottom-4 z-50 lg:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Add new item</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="border-b pb-4">
              <DrawerTitle className="text-lg font-semibold">
                Add New Bucket List Item
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto p-4">
              <BucketListForm />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}
