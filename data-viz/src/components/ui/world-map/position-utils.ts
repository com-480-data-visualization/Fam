import * as d3 from "d3";
import { Launchpad } from "./types";

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
