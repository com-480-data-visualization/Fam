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
 * - Supports both compact (hover) and expanded (pinned) modes
 *
 * @param {Launchpad} launchpad - The launchpad data to display in the tooltip
 * @param {Launch[]} launchData - Current launch data set being visualized
 * @param {boolean} isPinned - Whether the tooltip is pinned (allows more launches to be shown)
 * @param {boolean} isCompact - Whether to show a more compact version (fewer launches)
 * @returns {string} HTML string for the tooltip content
 */
export function generateTooltipContent(
  launchpad: Launchpad,
  launchData: Launch[],
  isPinned: boolean = false,
  isCompact: boolean = true
): string {
  const sortedLaunches = [...launchpad.launches].sort((a, b) => {
    if (a.datetime_iso && b.datetime_iso)
      return a.datetime_iso.localeCompare(b.datetime_iso);
    return 0;
  });

  // Show fewer launches for compact hover tooltips, more for pinned tooltips
  const maxToShow = isCompact ? 3 : isPinned ? sortedLaunches.length : 8;
  const launchesToShow = sortedLaunches.slice(0, maxToShow);
  const yearInfo =
    launchData && launchData.length > 0 && launchData[0].year
      ? ` in ${launchData[0].year}`
      : "";

  const launchCountText =
    launchpad.count === 1 ? "One Launch" : `${launchpad.count} Launches`;

  // More compact status breakdown for smaller tooltips
  const statusBreakdown = Object.entries(launchpad.statuses)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([status, count]) => `
      <div class="flex items-center text-xs">
        <div class="w-2 h-2 mr-1.5" style="background-color: ${
          statusColors[status] || statusColors.default
        }"></div>
        <span>${status}: ${count}</span>
      </div>
    `
    )
    .join("");

  // Add click instruction for compact tooltips
  const clickInstruction =
    isCompact && launchpad.launches.length > maxToShow
      ? `<div class="text-xs text-blue-500 mt-1 text-center font-medium cursor-pointer">Click circle to pin and view all ${launchpad.launches.length} launches</div>`
      : "";

  return `
    <div class="font-semibold text-sm mb-1">${launchpad.name}</div>
    ${
      isCompact
        ? ""
        : `<div class="text-xs mb-2">
      <span class="text-gray-500">Coordinates:</span> ${launchpad.lat.toFixed(
        2
      )}, ${launchpad.lon.toFixed(2)}
    </div>`
    }
    <div class="text-xs font-semibold mb-1">${launchCountText}${yearInfo}</div>
    
    ${
      isCompact
        ? ""
        : `<div class="mb-2">
      <div class="text-xs font-semibold mb-1">Status Breakdown:</div>
      ${statusBreakdown}
    </div>`
    }
    
    <div class="launch-list ${isPinned ? "max-h-60 overflow-y-auto" : ""}">
      ${launchesToShow
        .map((launch) => {
          return `
          <div class="border-t border-gray-100 pt-1 pb-1">
            <div class="font-medium flex items-center text-xs">
              <div class="w-1.5 h-1.5 mr-1.5 rounded-full" style="background-color: ${
                statusColors[launch.Status] || statusColors.default
              }"></div>
              ${launch.Name}
            </div>
            <div class="text-xs text-gray-600">${launch.Status}</div>
            ${
              launch.datetime_iso
                ? `<div class="text-xs text-gray-500">Date: ${
                    launch.datetime_iso.split("T")[0]
                  }</div>`
                : ""
            }
            ${
              launch.Mission && !isCompact
                ? `<div class="text-xs">${launch.Mission}</div>`
                : ""
            }
          </div>
        `;
        })
        .join("")}
      ${
        launchpad.launches.length > maxToShow && !isPinned
          ? `<div class="text-xs text-gray-500 mt-1 text-center font-medium">...and ${
              launchpad.launches.length - maxToShow
            } more launches</div>`
          : ""
      }
      ${clickInstruction}
    </div>
  `;
}
