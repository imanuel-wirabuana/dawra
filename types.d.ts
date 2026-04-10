import { Timestamp } from "firebase/firestore"

// ============================================================================
// CORE
// ============================================================================

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

// ============================================================================
// API (Database Collection Types)
// ============================================================================

/**
 * Represents a category for organizing bucket list items and itinerary events.
 * Categories are user-defined labels with color coding for visual distinction.
 */
type Category = {
  /** Unique identifier for the category (Firebase document ID) */
  id: string
  /** Display name of the category (e.g., "Food", "Adventure", "Sightseeing") */
  name: string
  /** Hex color code for the category (e.g., "#FF5733") */
  color: string
}

/**
 * Represents a bucket list item - a goal or experience the user wants to achieve.
 * Bucket list items can be linked to itinerary events and tracked for completion.
 */
type BucketList = {
  /** Unique identifier for the bucket list item (Firebase document ID) */
  id?: string
  /** Brief title or name of the bucket list item */
  title: string
  /** Detailed description of the bucket list item */
  description?: string
  /** Whether the item has been completed or not */
  completed: boolean
  /** Optional estimated cost associated with this item (in local currency) */
  cost?: number
  /** Optional location where the item should be completed */
  location?: string
  /** Optional categories for organizing and filtering items */
  categories?: Category[]
  /** Timestamp when the item was created */
  createdAt?: Timestamp
  /** Timestamp when the item was last updated */
  updatedAt?: Timestamp
}

/**
 * Represents an itinerary item - a scheduled event on a specific date.
 * Can be linked to a bucket list item or be a standalone custom item.
 */
type ItineraryItem = {
  /** Unique identifier for the itinerary item (Firebase document ID) */
  id: string
  /** Type discriminator indicating if linked to bucket list or custom */
  itemType: "bucket-list" | "custom"
  /** Whether this itinerary event has been completed */
  completed: boolean
  /** Reference to bucket list document ID (when itemType is 'bucket-list') */
  bucketList?: string
  /** Custom item data (when itemType is 'custom') */
  customItem?: CustomItineraryItem
  /** Date of the itinerary item in ISO format (YYYY-MM-DD) */
  date: string
  /** Start time in ISO format or time string (e.g., "09:00") */
  start: string
  /** End time in ISO format or time string (e.g., "17:00") */
  end: string
}

/**
 * Represents a folder for organizing photos into collections.
 * Folders act as albums for grouping related images.
 */
type Folder = {
  /** Unique identifier for the folder (Firebase document ID) */
  id: string
  /** Display name of the folder */
  name: string
  /** Optional description of the folder's contents */
  description?: string
  /** Timestamp when the folder was created */
  createdAt?: Timestamp
}

/**
 * Represents a photo stored in the application.
 * Photos are organized into folders and stored in Firebase Storage.
 */
type Photo = {
  /** Unique identifier for the photo (Firebase document ID) */
  id: string
  /** Public URL to access the photo in Firebase Storage */
  url: string
  /**
   * Storage file name following the pattern: dawra-<folderName>-<timestamp>.<extension>
   * Used for organizing files in storage buckets
   */
  name: string
  /** Original file name as uploaded by the user */
  realFileName: string
  /** File extension (e.g., "jpg", "png", "webp") */
  extension: string
  /** File size in bytes */
  size: number
  /** Optional reference to the folder this photo belongs to */
  folderId?: string
  /** Timestamp when the photo was uploaded */
  createdAt?: Timestamp
}

/**
 * Represents a chat message.
 * Supports text content, reactions, replies, and soft deletion.
 */
type ChatMessage = {
  /** Unique identifier for the message (Firebase document ID) */
  id?: string
  /** User ID of the message sender */
  userId: string
  /** Display name of the message sender */
  displayName: string
  /** Text content of the message */
  message: string
  /** Timestamp when the message was sent */
  createdAt?: Timestamp
  /** Timestamp when the message was last edited */
  editedAt?: Timestamp
  /** Whether the message has been soft-deleted */
  isDeleted?: boolean
  /** ID of the message this is replying to (for threaded conversations) */
  replyToId?: string
  /** Array of reactions added to this message */
  reactions?: Reaction[]
}

// ============================================================================
// ELSE (UI & Support Types)
// ============================================================================

/**
 * Available view modes for displaying bucket list items in the UI
 */
type ViewMode = "list" | "grid2" | "grid3"

/**
 * Available sorting options for bucket list items.
 * Each option combines a field with a sort direction.
 */
type SortOption =
  /** Sort by title in ascending order (A-Z) */
  | "title-asc"
  /** Sort by title in descending order (Z-A) */
  | "title-desc"
  /** Sort by creation date, oldest first */
  | "created-asc"
  /** Sort by creation date, newest first */
  | "created-desc"
  /** Sort with completed items first */
  | "completed"
  /** Sort with incomplete items first */
  | "incomplete"
  /** Sort by cost in ascending order (lowest first) */
  | "cost-asc"
  /** Sort by cost in descending order (highest first) */
  | "cost-desc"

/**
 * Represents a custom item that can be added directly to an itinerary
 * without being linked to an existing bucket list item.
 * Used for one-off events or activities.
 */
type CustomItineraryItem = {
  /** Title of the custom item */
  title: string
  /** Optional location where the activity takes place */
  location?: string
  /** Optional estimated cost for this item */
  cost?: number
  /** Optional description with additional details */
  description?: string
  /** Optional categories for organizing the item */
  categories?: Category[]
}

/**
 * Represents a reaction (emoji) added to a chat message.
 * Stores who reacted and with which emoji.
 */
type Reaction = {
  /** The emoji character used for the reaction */
  emoji: string
  /** User ID of the user who reacted */
  userId: string
  /** Display name of the user who reacted */
  displayName: string
}

/**
 * Represents a real-time typing indicator status.
 * Shows who is currently typing.
 */
type TypingStatus = {
  /** User ID of the typing user */
  userId: string
  /** Display name of the typing user */
  displayName: string
  /** Whether the user is currently typing (true) or stopped (false) */
  isTyping: boolean
  /** Timestamp of when this status was last updated */
  timestamp: Timestamp
}
