import { ApiResponse } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a standardized API success response
 * @template T - Type of the data being returned
 * @param {T} data - The response data
 * @param {string} message - Success message describing the operation
 * @returns {ApiResponse<T>} Standardized API response with success code
 */
export function apiSuccess<T>(data: T, message: string): ApiResponse<T> {
  return {
    code: 1,
    data,
    message,
  }
}

/**
 * Creates a standardized API error response
 * @template T - Type of the data (typically null for error responses)
 * @param {string} message - Error message describing what went wrong
 * @returns {ApiResponse<T>} Standardized API response with error code
 */
export function apiError<T>(message: string): ApiResponse<T> {
  return {
    code: -1,
    data: null as T,
    message: message || "Error",
  }
}

/**
 * Creates a standardized API loading response
 * @template T - Type of the data (typically null for loading responses)
 * @returns {ApiResponse<T>} Standardized API response with loading code
 */
export function apiLoading<T>(): ApiResponse<T> {
  return {
    code: 0,
    data: null as T,
    message: "Loading...",
  }
}
