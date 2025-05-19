/**
 * Utilities for generating tooltip content for the world map visualization.
 *
 * This module handles the creation of HTML content for tooltips that display
 * detailed information about launch sites when users hover over markers.
 *
 * @module components/ui/world-map/tooltip-content
 */

import { Launch } from "../../../types";
import { Launchpad } from "./types";
import { COLOR_SETS } from "./color-constants";

const { statusColors } = COLOR_SETS;

/**
 * Generates HTML content for a tooltip displaying launchpad information.
 *
 * This function:
 * - Creates a formatted HTML tooltip with launch site details
 * - Shows a breakdown of launch statuses with appropriate colors
 * - Displays a list of recent launches with dates and missions
 * - Limits the number of displayed launches to avoid overcrowding
 *
 * @param {Launchpad} launchpad - The launchpad data to display in the tooltip
 * @param {Launch[]} launchData - Current launch data set being visualized
 * @returns {string} HTML string for the tooltip content
 */
export function generateTooltipContent(
  launchpad: Launchpad,
  launchData: Launch[]
): string {
  const sortedLaunches = [...launchpad.launches].sort((a, b) => {
    if (a.datetime_iso && b.datetime_iso)
      return a.datetime_iso.localeCompare(b.datetime_iso);
    return 0;
  });

  const launchesToShow = sortedLaunches.slice(0, 8);
  const yearInfo =
    launchData && launchData.length > 0 && launchData[0].year
      ? ` in ${launchData[0].year}`
      : "";

  const launchCountText =
    launchpad.count === 1 ? "One Launch" : `${launchpad.count} Launches`;

  const statusBreakdown = Object.entries(launchpad.statuses)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([status, count]) => `
      <div class="flex items-center text-xs">
        <div class="w-3 h-3 mr-2" style="background-color: ${
          statusColors[status] || statusColors.default
        }"></div>
        <span>${status}: ${count}</span>
      </div>
    `
    )
    .join("");

  return `
    <div class="font-semibold text-base mb-1">${launchpad.name}</div>
    <div class="text-sm mb-2">
      <span class="text-gray-500">Coordinates:</span> ${launchpad.lat.toFixed(
        2
      )}, ${launchpad.lon.toFixed(2)}
    </div>
    <div class="text-sm font-semibold mb-1">${launchCountText}${yearInfo}</div>
    
    <div class="mb-3">
      <div class="text-xs font-semibold mb-1">Status Breakdown:</div>
      ${statusBreakdown}
    </div>
    
    <div class="launch-list">
      ${launchesToShow
        .map((launch) => {
          return `
          <div class="border-t border-gray-100 pt-1 pb-1">
            <div class="font-medium flex items-center">
              <div class="w-2 h-2 mr-2 rounded-full" style="background-color: ${
                statusColors[launch.Status] || statusColors.default
              }"></div>
              ${launch.Name}
            </div>
            <div class="text-xs">${launch.Status}</div>
            ${
              launch.datetime_iso
                ? `<div class="text-xs text-gray-500">Date: ${
                    launch.datetime_iso.split("T")[0]
                  }</div>`
                : ""
            }
            ${
              launch.Mission
                ? `<div class="text-xs">${launch.Mission}</div>`
                : ""
            }
          </div>
        `;
        })
        .join("")}
      ${
        launchpad.launches.length > 8
          ? `<div class="text-xs text-gray-500 mt-1 text-center font-medium">...and ${
              launchpad.launches.length - 8
            } more launches</div>`
          : ""
      }
    </div>
  `;
}
