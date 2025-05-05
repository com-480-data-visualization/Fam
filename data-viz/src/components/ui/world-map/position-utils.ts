/**
 * Utilities for initializing and managing launchpad positions on the world map.
 *
 * This module handles the initial positioning of launch site markers on the map
 * by converting geographic coordinates to SVG coordinates.
 *
 * @module components/ui/world-map/position-utils
 */

import * as d3 from "d3";
import { Launchpad } from "./types";

/**
 * Initializes the positions of launchpads on the map using geographic projection.
 *
 * This function:
 * - Converts geographic coordinates (lat/lon) to SVG coordinate space
 * - Sets both the original and current position for each launchpad
 * - The original positions are preserved for drawing connection lines
 *
 * @param {Launchpad[]} launchpads - Array of launchpad objects to position
 * @param {d3.GeoProjection} projection - D3 geographic projection function
 * @returns {void}
 */
export function initializePositions(
  launchpads: Launchpad[],
  projection: d3.GeoProjection
): void {
  launchpads.forEach((launchpad) => {
    const [x, y] = projection([launchpad.lon, launchpad.lat]) || [0, 0];
    launchpad.originalX = x;
    launchpad.originalY = y;
    launchpad.x = x;
    launchpad.y = y;
  });
}
