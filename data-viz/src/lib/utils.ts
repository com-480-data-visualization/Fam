/**
 * Utility functions for the Rocket Launch Data Visualization application.
 * @module utils
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge for optimal Tailwind CSS usage.
 * This utility helps prevent class conflicts when combining conditional classes.
 *
 * @param inputs - Array of class values, objects, or arrays to be merged
 * @returns Optimized class string with tailwind-merge applied
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a human-readable format (e.g., "Jan 15, 2023").
 *
 * @param dateStr - Date string in valid JavaScript Date format
 * @returns Formatted date string
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Calculates the number of years between a given date and the current date.
 *
 * @param dateStr - Date string in valid JavaScript Date format
 * @returns Number of years since the given date
 */
export function yearsSince(dateStr: string): number {
  const startDate = new Date(dateStr);
  const currentDate = new Date();
  return currentDate.getFullYear() - startDate.getFullYear();
}

/**
 * Groups an array of objects by a specified key.
 *
 * @template T - Type of array elements
 * @param array - Array to be grouped
 * @param key - Object property to group by
 * @returns Object with groups as properties and arrays as values
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, currentItem) => {
    const groupKey = String(currentItem[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Creates a debounced version of a function that delays its execution
 * until after the specified delay has elapsed since the last time it was invoked.
 *
 * @template T - Function type
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
