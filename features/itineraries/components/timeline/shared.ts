import type { Category } from "@/types"

export type ViewMode = "day" | "week" | "month"

export type Item = {
  id: string
  itemType: "bucket-list" | "custom"
  title: string
  start: string
  end: string
  location?: string
  cost?: number
  description?: string
  completed?: boolean
  date?: Date
  categories?: Category[]
}

export const HOUR_HEIGHT = 60
export const START_HOUR = 0
export const END_HOUR = 24
export const SIDEBAR_WIDTH = 60
export const DAY_COL_WIDTH = 120

export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export const minutesToTime = (minutes: number): string => {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0")
  const m = String(minutes % 60).padStart(2, "0")
  return `${h}:${m}`
}

export const getDurationMinutes = (start: string, end: string): number => {
  return timeToMinutes(end) - timeToMinutes(start)
}

export const formatDuration = (start: string, end: string): string => {
  const totalMinutes = getDurationMinutes(start, end)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export const generateHours = () => {
  const hours = []
  for (let i = START_HOUR; i < END_HOUR; i++) {
    hours.push(String(i).padStart(2, "0"))
  }
  return hours
}

// Calculate positions for overlapping events (Google Calendar style)
export const calculateEventPositions = (items: Item[]) => {
  const sortedItems = [...items].sort(
    (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
  )

  const events = sortedItems.map((item) => ({
    ...item,
    startMinutes: timeToMinutes(item.start),
    endMinutes: timeToMinutes(item.end),
    column: 0,
    totalColumns: 1,
  }))

  const groups: (typeof events)[] = []
  let currentGroup: typeof events = []

  for (const event of events) {
    if (currentGroup.length === 0) {
      currentGroup.push(event)
    } else {
      const overlaps = currentGroup.some(
        (e) =>
          event.startMinutes < e.endMinutes && event.endMinutes > e.startMinutes
      )
      if (overlaps) {
        currentGroup.push(event)
      } else {
        if (currentGroup.length > 0) {
          assignColumns(currentGroup)
          groups.push([...currentGroup])
        }
        currentGroup = [event]
      }
    }
  }

  if (currentGroup.length > 0) {
    assignColumns(currentGroup)
    groups.push(currentGroup)
  }

  const result = new Map<string, (typeof events)[0]>()
  for (const group of groups) {
    for (const event of group) {
      result.set(event.id, event)
    }
  }

  return result
}

const assignColumns = (
  group: Array<{
    startMinutes: number
    endMinutes: number
    column: number
    totalColumns: number
  }>
) => {
  const columns: number[] = []

  for (const event of group) {
    let column = 0
    while (columns.some((c, i) => c > event.startMinutes && i === column)) {
      column++
    }
    event.column = column
    columns[column] = event.endMinutes
  }

  const maxColumn = Math.max(...group.map((e) => e.column), 0)
  for (const event of group) {
    event.totalColumns = maxColumn + 1
  }
}
