import * as d3 from "d3";
import { Launchpad } from "./types";

export function applyForceSimulation(
  launchpads: Launchpad[],
  radiusScale: d3.ScalePower<number, number>
): void {
  // create force simulation to prevent circle overlap
  const simulation = d3
    .forceSimulation<Launchpad>(launchpads)
    .force(
      "x", 
      d3.forceX<Launchpad>((d) => d.originalX!).strength(0.7)
    )
    .force(
      "y", 
      d3.forceY<Launchpad>((d) => d.originalY!).strength(0.7)
    )
    .force(
      "collide",
      d3
        .forceCollide<Launchpad>()
        .radius((d) => radiusScale(Math.min(d.count, 20)) + 1)
        .strength(0.5)
    )
    .stop();

  for (let i = 0; i < 50; i++) {
    simulation.tick();
  }
}
