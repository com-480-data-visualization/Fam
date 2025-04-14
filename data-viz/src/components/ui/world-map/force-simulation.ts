import * as d3 from "d3";
import { Launchpad } from "./types";

export function applyForceSimulation(
  launchpads: Launchpad[],
  radiusScale: d3.ScalePower<number, number>,
  forceStrength: number = 0.7
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
      return baseRadius + 1.5;
    })
    .strength(0.7);

  const simulation = d3
    .forceSimulation<Launchpad>(launchpads)
    .force("x", xForce)
    .force("y", yForce)
    .force("collide", collideForce)
    .stop();

  for (let i = 0; i < 50; i++) {
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

  positionMap.forEach((sites, _) => {
    if (sites.length > 1) {
      sites.forEach((site, i) => {
        if (i > 0) {
          site.x! += (Math.random() - 0.5) * 2;
          site.y! += (Math.random() - 0.5) * 2;
        }
      });
    }
  });
}
