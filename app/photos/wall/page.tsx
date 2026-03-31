"use client"

import { useState, useRef } from "react"
import { toPng } from "html-to-image"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useRandomizedPhotos } from "@/features/photos/hooks/useRandomizedPhotos"
import { Pendu } from "@inkorange/pendu"
import { Loader2, Camera, Settings2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Page() {
  const [seed, setSeed] = useState(37)
  const [width, setWidth] = useState(1200)
  const [height, setHeight] = useState(800)
  const [photoLimit, setPhotoLimit] = useState(7)
  const contentRef = useRef<HTMLDivElement>(null)

  const { photos, loading, refetch } = useRandomizedPhotos(photoLimit)

  const [screenshotLoading, setScreenshotLoading] = useState(false)
  const [pixelRatio, setPixelRatio] = useState(2)

  const qualityOptions = [
    { label: "HD", ratio: 1 },
    { label: "Full HD", ratio: 3 },
    { label: "Ultra HD", ratio: 5 },
  ] as const

  const handleScreenshot = async () => {
    if (!contentRef.current || screenshotLoading) return
    setScreenshotLoading(true)
    try {
      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true,
        pixelRatio,
        skipFonts: true,
        imagePlaceholder:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      })
      const link = document.createElement("a")
      link.download = `photo-wall-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to capture screenshot:", err)
      if (err instanceof Error) {
        console.error("Error message:", err.message)
      }
    } finally {
      setScreenshotLoading(false)
    }
  }

  useHotkey({ key: "s", ctrl: true }, handleScreenshot)

  useHotkey({ key: "r" }, () => {
    setSeed(Math.floor(Math.random() * 10000))
    setWidth(Math.floor(Math.random() * 800) + 400)
    setHeight(Math.floor(Math.random() * 800) + 400)
    refetch()
  })

  if (loading && photos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="mb-4 flex flex-col items-center justify-end gap-4 lg:flex-row">
        <div className="flex w-full max-w-xs items-center gap-3">
          <Label
            htmlFor="limit"
            className="text-sm whitespace-nowrap text-muted-foreground"
          >
            Limit: {photoLimit}
          </Label>
          <Slider
            id="limit"
            min={1}
            max={50}
            value={[photoLimit]}
            onValueChange={(value) => setPhotoLimit(value[0])}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="w-80">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="seed">Seed</Label>
                <Input
                  id="seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  min={100}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  min={100}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={screenshotLoading}>
              {screenshotLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Camera className="mr-2 h-4 w-4" />
              )}
              Screenshot (
              {qualityOptions.find((o) => o.ratio === pixelRatio)?.label ||
                pixelRatio + "x"}
              )
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {qualityOptions.map((option) => (
              <DropdownMenuItem
                key={option.ratio}
                onClick={() => setPixelRatio(option.ratio)}
                className="flex items-center justify-between"
              >
                {option.label} ({option.ratio}x)
                {pixelRatio === option.ratio && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={handleScreenshot}
              className="font-semibold"
            >
              Take Screenshot Now
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-muted-foreground">
        Press <kbd>R</kbd> to randomize.
        <br />
        Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to take a screenshot.
      </p>

      <div ref={contentRef} className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <Pendu gap={12} seed={seed}>
          {photos.map((photo) => (
            <Pendu.Image
              key={photo.id}
              src={`https://lh3.googleusercontent.com/d/${photo.id}=s0`}
              width={width}
              height={height}
              alt={photo.realFileName || "Photo"}
            />
          ))}
        </Pendu>
      </div>
    </div>
  )
}
