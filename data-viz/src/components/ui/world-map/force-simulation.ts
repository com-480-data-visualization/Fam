/**
 * Force simulation utilities for optimizing the placement of launchpad markers.
 *
 * This module uses D3's force simulation to prevent overlapping of launchpad markers
 * while keeping them close to their original geographic locations.
 *
 * @module components/ui/world-map/force-simulation
 */

import * as d3 from "d3";
import { Launchpad } from "./types";

/**
 * Applies force simulation to optimize the positioning of launchpad markers.
 *
 * This function:
 * - Uses D3's force simulation to prevent marker overlapping
 * - Applies forces to keep markers near their original geographic positions
 * - Adjusts collision radius based on the size of each marker and force strength
 * - Makes minor position adjustments to markers in very close proximity
 * - Maintains consistent behavior across all zoom levels
 * - Adapts simulation parameters based on force strength for better mobile performance
 *
 * @param {Launchpad[]} launchpads - Array of launchpad objects to position
 * @param {d3.ScalePower<number, number>} radiusScale - Scale function for determining marker sizes
 * @param {number} [forceStrength=0.7] - Strength of the positioning forces (0-1)
 * @param {number} [zoomLevel=1] - Current zoom level for collision radius adjustment
 * @returns {void}
 */
export function applyForceSimulation(
  launchpads: Launchpad[],
  radiusScale: d3.ScalePower<number, number>,
  forceStrength: number = 0.7,
  zoomLevel: number = 1
): void {
  const xForce = d3
    .forceX<Launchpad>((d) => d.originalX!)
    .strength(forceStrength);
  const yForce = d3
    .forceY<Launchpad>((d) => d.originalY!)
    .strength(forceStrength);

  const collideForce = d3
    .forceCollide<Launchpad>()
    .radius((d) => {
      const baseRadius = radiusScale(Math.min(d.count, 20));
      // Adjust collision radius to account for zoom level scaling
      // Circles get smaller visually when zoomed in, so collision should too
      // For weaker forces, use slightly tighter collision radius to prevent over-separation
      const paddingMultiplier = forceStrength < 0.5 ? 1.0 : 1.5;
      return (baseRadius + paddingMultiplier) / zoomLevel;
    })
    .strength(forceStrength);

  const simulation = d3
    .forceSimulation<Launchpad>(launchpads)
    .force("x", xForce)
    .force("y", yForce)
    .force("collide", collideForce)
    .stop();

  // Adjust number of iterations based on force strength
  // Weaker forces need fewer iterations to prevent over-processing
  // Stronger forces can benefit from more iterations for better settling
  const iterations = forceStrength < 0.5 ? 50 : 100;

  for (let i = 0; i < iterations; i++) {
    simulation.tick();
  }

  const positionMap = new Map<string, Launchpad[]>();
  launchpads.forEach((site) => {
    if (!site.x || !site.y) return;

    const posKey = `${Math.round(site.x * 2) / 2},${
      Math.round(site.y * 2) / 2
    }`;

    if (!positionMap.has(posKey)) {
      positionMap.set(posKey, []);
    }
    positionMap.get(posKey)!.push(site);
  });

  positionMap.forEach((sites) => {
    if (sites.length > 1) {
      // Scale random adjustment based on force strength
      // Weaker forces (mobile) need smaller adjustments
      const adjustmentScale = Math.max(forceStrength, 0.3);
      const maxAdjustment = 2 * adjustmentScale;

      sites.forEach((site, i) => {
        if (i > 0) {
          site.x! += (Math.random() - 0.5) * maxAdjustment;
          site.y! += (Math.random() - 0.5) * maxAdjustment;
        }
      });
    }
  });
}
