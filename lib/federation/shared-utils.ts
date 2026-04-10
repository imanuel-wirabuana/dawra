// Shared utility functions exposed via module federation
// These can be used by all micro frontend modules

export { default as clsx } from 'clsx';
export { twMerge } from 'tailwind-merge';

// Re-export Firebase utilities
export { db, app } from '@/lib/firebase/client';

// Date formatting utilities
import { format } from 'date-fns';

export const dateUtils = {
  format,
};

// Error handling utility
export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Storage utilities
export const storageUtils = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};
