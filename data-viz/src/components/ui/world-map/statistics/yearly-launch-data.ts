/**
 * Utilities for processing yearly launch statistics.
 *
 * This module contains functions for aggregating and analyzing launch data
 * on a per-year basis, calculating success rates and launch counts.
 *
 * @module components/ui/world-map/statistics/yearly-launch-data
 */

import { Launch } from "../../../../types";

/**
 * Data structure to track yearly launch statistics
 * @interface YearlyLaunchData
 */
export interface YearlyLaunchData {
  /** Calendar year */
  year: number;
  /** Total number of launches in the year */
  count: number;
  /** Number of successful launches in the year */
  successCount: number;
  /** Success rate as a percentage (0-100) */
  successRate: number;
}

/**
 * Processes raw launch data to calculate year-by-year statistics
 *
 * @param {Launch[]} allLaunchData - Complete launch dataset
 * @returns {YearlyLaunchData[]} Array of yearly statistics
 */
export function processYearlyLaunchData(
  allLaunchData: Launch[]
): YearlyLaunchData[] {
  const dataByYear = new Map<number, { count: number; successCount: number }>();

  allLaunchData.forEach((launch) => {
    const year = launch.year;
    if (!dataByYear.has(year)) {
      dataByYear.set(year, { count: 0, successCount: 0 });
    }

    const yearData = dataByYear.get(year)!;
    yearData.count += 1;
    if (launch.Status === "Launch Successful") {
      yearData.successCount += 1;
    }
  });

  return Array.from(dataByYear.entries())
    .map(([year, data]) => ({
      year,
      count: data.count,
      successCount: data.successCount,
      successRate: data.count > 0 ? (data.successCount / data.count) * 100 : 0,
    }))
    .sort((a, b) => a.year - b.year);
}

/**
 * Determines if a launch status indicates a future/planned launch
 * @param {string} status - Launch status string
 * @returns {boolean} True if the status indicates a future launch
 */
export function isFutureStatus(status: string): boolean {
  return ["To Be Determined", "Go for Launch", "To Be Confirmed"].includes(
    status
  );
}
