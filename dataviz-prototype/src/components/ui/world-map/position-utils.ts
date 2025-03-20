import * as d3 from "d3";
import { Launchpad } from "./types";

export function initializePositions(
  launchpads: Launchpad[],
  projection: d3.GeoProjection
): void {
  launchpads.forEach((d) => {
    const pos = projection([d.lon, d.lat]);
    if (pos) {
      d.x = pos[0];
      d.y = pos[1];
      d.originalX = pos[0];
      d.originalY = pos[1];
    }
  });
}
