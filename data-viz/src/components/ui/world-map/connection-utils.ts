/**
 * Utilities for drawing connection lines between original and adjusted launchpad positions.
 *
 * This module handles the visualization of displacement lines that show how launch site
 * markers have been moved from their original geographic positions to avoid overlapping.
 *
 * @module components/ui/world-map/connection-utils
 */

import * as d3 from "d3";
import { Launchpad, StatusColorMap } from "./types";

/**
 * Draws connection lines between original geographic positions and adjusted marker positions.
 *
 * This function:
 * - Creates lines connecting original geographic coordinates to adjusted marker positions
 * - Adjusts line opacity and width based on zoom level
 * - Uses the same color scheme as the markers for visual consistency
 * - Only draws lines when markers have been moved a significant distance
 *
 * @param {d3.Selection<SVGSVGElement | null, unknown, null, undefined>} svg - The SVG selection to draw in
 * @param {Launchpad[]} launchpads - Array of launchpad objects to draw connections for
 * @param {StatusColorMap} statusColors - Map of launch status to color values
 * @param {number} [zoomLevel=1] - Current zoom level of the map view
 * @returns {void}
 */
export function drawConnectionLines(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  launchpads: Launchpad[],
  statusColors: StatusColorMap,
  zoomLevel: number = 1
): void {
  svg.selectAll("line.connection-line").remove();

  const opacityScale = d3
    .scaleLinear()
    .domain([1, 3, 5])
    .range([0.5, 0.2, 0.05])
    .clamp(true);

  const zoomAdjustmentFactor =
    1 - Math.min(0.8, Math.max(0, (zoomLevel - 1) / 5));

  launchpads.forEach((launchpad) => {
    if (
      launchpad.x === undefined ||
      launchpad.y === undefined ||
      launchpad.originalX === undefined ||
      launchpad.originalY === undefined
    ) {
      return;
    }

    const adjustedX =
      launchpad.originalX +
      (launchpad.x - launchpad.originalX) * zoomAdjustmentFactor;
    const adjustedY =
      launchpad.originalY +
      (launchpad.y - launchpad.originalY) * zoomAdjustmentFactor;

    launchpad.x = adjustedX;
    launchpad.y = adjustedY;

    const dx = launchpad.x - launchpad.originalX;
    const dy = launchpad.y - launchpad.originalY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 2) {
      svg
        .select("g.launch-sites")
        .append("line")
        .attr("class", "connection-line")
        .attr("x1", launchpad.originalX)
        .attr("y1", launchpad.originalY)
        .attr("x2", launchpad.x)
        .attr("y2", launchpad.y)
        .attr(
          "stroke",
          statusColors[launchpad.primaryStatus] || statusColors.default
        )
        .attr("stroke-opacity", opacityScale(zoomLevel))
        .attr("stroke-width", 0.5 / Math.sqrt(zoomLevel))
        .attr("stroke-dasharray", "2,2");
    }
  });
}
