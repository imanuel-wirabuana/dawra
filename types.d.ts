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
 * Represents a bucket list item with its properties and lifecycle timestamps
 * @typedef {Object} BucketList
 * @property {string} id - Unique identifier for the bucket list item
 * @property {string} title - Brief title or name of the bucket list item
 * @property {string} description - Detailed description of the bucket list item
 * @property {boolean} completed - Whether the item has been completed or not
 * @property {string} createdAt - ISO timestamp when the item was created
 * @property {string} updatedAt - ISO timestamp when the item was last updated
 */
type BucketList = {
  id?: string
  title: string
  description: string
  completed: boolean
  location?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
