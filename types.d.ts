import { Timestamp } from "firebase/firestore"

/**
 * Standardized API response format
 * @template T - Type of the data payload
 */
type ApiResponse<T> = {
  /** Response status code: -1 for error, 0 for loading, 1 for success */
  code: -1 | 0 | 1
  /** Response data payload */
  data: T
  /** Response message describing the result */
  message: string
}

/**
 * Represents a category with its properties
 */
type Category = {
  /** Unique identifier for the category */
  id: string
  /** Display name of the category */
  name: string
  /** Hex color code for the category */
  color: string
}

/**
 * Represents a bucket list item with its properties and lifecycle timestamps
 */
type BucketList = {
  /** Unique identifier for the bucket list item */
  id?: string
  /** Brief title or name of the bucket list item */
  title: string
  /** Detailed description of the bucket list item */
  description?: string
  /** Whether the item has been completed or not */
  completed: boolean
  /** Optional cost associated with this item */
  cost?: number
  /** Optional location where the item should be completed */
  location?: string
  /** Optional categories associated with this item */
  categories?: Category[]
  /** Timestamp when the item was created */
  createdAt?: Timestamp
  /** Timestamp when the item was last updated */
  updatedAt?: Timestamp
}

/**
 * Available view modes for displaying bucket list items
 */
type ViewMode = "list" | "grid2" | "grid3"

/**
 * Available sorting options for bucket list items
 */
type SortOption =
  | "title-asc" /** Sort by title in ascending order (A-Z) */
  | "title-desc" /** Sort by title in descending order (Z-A) */
  | "created-asc" /** Sort by creation date, oldest first */
  | "created-desc" /** Sort by creation date, newest first */
  | "completed" /** Sort with completed items first */
  | "incomplete" /** Sort with incomplete items first */
  | "cost-asc" /** Sort by cost in ascending order (lowest first) */
  | "cost-desc" /** Sort by cost in descending order (highest first) */
