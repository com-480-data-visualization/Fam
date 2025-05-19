/**
 * Color constants used for visualizing launch statuses in the world map.
 *
 * This module provides consistent color mappings for different launch statuses,
 * with separate sets for normal and hover states.
 *
 * @module components/ui/world-map/color-constants
 */

import { LaunchStatus } from "../../../types";
import { StatusColorMap } from "./types";

/**
 * Collection of color sets for different visualization purposes.
 */
export const COLOR_SETS = {
  /**
   * Colors for normal (non-interactive) state of launch site markers.
   * Each status has a semi-transparent color for visual distinction.
   */
  statusColors: {
    [LaunchStatus.Successful]: "rgba(0, 128, 0, 0.7)",
    [LaunchStatus.Failure]: "rgba(255, 0, 0, 0.7)",
    [LaunchStatus.PartialFailure]: "rgba(255, 165, 0, 0.7)",
    default: "rgba(128, 128, 128, 0.7)",
  } as StatusColorMap,

  /**
   * Colors for hover state of launch site markers.
   * These colors are more vibrant and fully opaque versions of the standard colors.
   */
  hoverStatusColors: {
    [LaunchStatus.Successful]: "rgba(0, 160, 0, 1)",
    [LaunchStatus.Failure]: "rgba(255, 0, 0, 1)",
    [LaunchStatus.PartialFailure]: "rgba(255, 185, 0, 1)",
    default: "rgba(150, 150, 150, 1)",
  } as StatusColorMap,
};
