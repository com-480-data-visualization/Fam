import * as d3 from "d3";
import { Launchpad, StatusColorMap } from "./types";

export function drawConnectionLines(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  launchpads: Launchpad[],
  statusColors: StatusColorMap
): void {
  launchpads.forEach((d) => {
    if (d.x === undefined || d.y === undefined || 
        d.originalX === undefined || d.originalY === undefined) return;
        
    // draw lines only for circles that moved significantly
    const dx = d.x - d.originalX;
    const dy = d.y - d.originalY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      svg
        .select("g.launch-sites")
        .append("line")
        .attr("class", "connection-line")
        .attr("data-launchpad", d.name.replace(/[^\w]/g, "_"))
        .attr("stroke", statusColors[d.primaryStatus] || statusColors.default)
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "2,2")
        .attr("opacity", 0.6)
        .attr("x1", d.originalX)
        .attr("y1", d.originalY)
        .attr("x2", d.x)
        .attr("y2", d.y);
    }
  });
}
