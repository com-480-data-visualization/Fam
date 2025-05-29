/**
 * Utility functions for managing tooltips in the world map visualization.
 *
 * This module provides functions for creating, updating, and controlling
 * the behavior of tooltips that display information about launch sites.
 *
 * @module components/ui/world-map/tooltip-utils
 */
import * as d3 from "d3";
import React from "react";
import { generateTooltipContent } from "./tooltip-content";
import { Launch } from "../../../types";
import { Launchpad } from "./types";

/**
 * Sets up mouse interaction behaviors for the tooltip.
 *
 * This function configures how the tooltip responds to mouse events,
 * including hover persistence and fade-out behavior.
 *
 * @param {d3.Selection<HTMLDivElement | null, unknown, null, undefined>} tooltip - The tooltip D3 selection
 * @param {string | null} hoveredSite - The currently hovered site ID or null if none
 * @param {string | null} pinnedSite - The currently pinned site ID or null if none
 * @returns {void}
 */
/**
 * Sets up mouse interaction behaviors for the tooltip.
 *
 * This function configures how the tooltip responds to mouse events,
 * including hover persistence and fade-out behavior.
 *
 * @param {d3.Selection<HTMLDivElement | null, unknown, null, undefined>} tooltip - The tooltip D3 selection
 * @param {string | null} hoveredSite - The currently hovered site ID or null if none
 * @param {string | null} pinnedSite - The currently pinned site ID or null if none
 * @returns {void}
 */
export function setupTooltipInteractions(
  tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>,
  hoveredSite: string | null,
  pinnedSite: string | null = null
): void {
  tooltip
    .style("display", "block")
    .style("opacity", 0)
    .style("pointer-events", "none");

  // Allow tooltip interaction when mouse enters the tooltip itself
  tooltip.on("mouseenter", function () {
    tooltip.interrupt().style("pointer-events", "auto");
  });

  // Hide tooltip when mouse leaves, but only if no site is hovered and tooltip is not pinned
  tooltip.on("mouseleave", function () {
    if (hoveredSite === null && pinnedSite === null) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
        .on("end", function () {
          tooltip.style("pointer-events", "none");
        });
    }
  });
}

/**
 * Parameters for the updateExistingTooltip function.
 *
 * @interface UpdateExistingTooltipParams
 */
interface UpdateExistingTooltipParams {
  /** D3 selection of the SVG element */
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;
  /** ID of the currently hovered launch site */
  hoveredSite: string | null;
  /** ID of the currently pinned launch site */
  pinnedSite?: string | null;
  /** Record of launchpad data indexed by their keys */
  launchpadCounts: Record<string, Launchpad>;
  /** D3 selection of the tooltip element */
  tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>;
  /** React reference to the SVG element */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /** Array of launch data objects */
  launchData: Launch[];
}

/**
 * Updates an existing tooltip when hovering over a launch site.
 *
 * This function:
 * - Positions the tooltip next to the hovered launch site marker
 * - Updates the tooltip content with information about the launch site
 * - Makes the tooltip visible and interactive
 * - Supports both hover and pinned modes
 *
 * @param {UpdateExistingTooltipParams} params - Parameters for updating the tooltip
 * @returns {void}
 */
export function updateExistingTooltip(
  params: UpdateExistingTooltipParams
): void {
  const {
    svg,
    hoveredSite,
    pinnedSite,
    launchpadCounts,
    tooltip,
    svgRef,
    launchData,
  } = params;

  // Determine which site to show (pinned takes priority over hovered)
  const targetSite = pinnedSite || hoveredSite;

  // If there's no target site or data, don't update the tooltip
  if (!targetSite || !launchpadCounts[targetSite]) return;

  // Sanitize the selector to avoid issues with special characters
  const safeSelector = targetSite.replace(/[^\w]/g, "_");
  const currentCircle = svg.select(`circle[data-launchpad="${safeSelector}"]`);
  const currentData = launchpadCounts[targetSite];

  // Guard against missing elements or data
  if (!currentCircle.node() || !currentData) {
    console.warn(`circle node or data not found for ${targetSite}`);
    return;
  }

  // Calculate tooltip position based on circle position
  const node = currentCircle.node() as SVGCircleElement;
  const circleRect = node.getBoundingClientRect();
  const svgRect = svgRef.current?.getBoundingClientRect();

  if (!svgRect) {
    console.warn("svg reference is not available");
    return;
  }

  // Ensure tooltip stays within viewport
  const tooltipX = Math.max(
    0,
    circleRect.left - svgRect.left + circleRect.width + 15
  );
  const tooltipY = Math.max(0, circleRect.top - svgRect.top - 15);

  // Determine tooltip display mode
  const isPinned = pinnedSite === targetSite;
  const isCompact = !isPinned;

  // Update tooltip content and position
  tooltip
    .interrupt()
    .style("display", "block")
    .style("pointer-events", isPinned ? "auto" : "auto")
    .html(generateTooltipContent(currentData, launchData, isPinned, isCompact))
    .style("left", `${tooltipX}px`)
    .style("top", `${tooltipY}px`)
    .style("opacity", 1);
}

/**
 * Hides the tooltip with a smooth transition.
 *
 * @param {d3.Selection<HTMLDivElement | null, unknown, null, undefined>} tooltip - The tooltip D3 selection
 * @returns {void}
 */
export function hideTooltip(
  tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>
): void {
  tooltip
    .interrupt()
    .transition()
    .duration(200)
    .style("opacity", 0)
    .on("end", function () {
      tooltip.style("pointer-events", "none").style("display", "none");
    });
}
