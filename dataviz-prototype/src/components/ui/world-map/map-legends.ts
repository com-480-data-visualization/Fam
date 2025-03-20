import * as d3 from "d3";
import { StatusColorMap } from "./types";

export class MapLegends {
  static createLegends(
    svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
    statusColors: StatusColorMap
  ): void {
    this.createStatusLegend(svg, statusColors);
    this.createSizeLegend(svg);
  }

  private static createStatusLegend(
    svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
    statusColors: StatusColorMap
  ): void {
    // create legend group with fixed position
    const statusLegend = svg
      .append("g")
      .attr("class", "status-legend")
      .attr("transform", "translate(30, 250)");

    statusLegend
      .append("text")
      .attr("class", "title")
      .attr("x", 0)
      .attr("y", -10)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Launch Status");

    const statusItems = [
      { label: "Successful", color: statusColors["Launch Successful"] },
      { label: "Failed", color: statusColors["Launch Failure"] },
      {
        label: "Partial Failure",
        color: statusColors["Launch was a Partial Failure"],
      },
      { label: "Planned/Future", color: statusColors["To Be Determined"] },
    ];

    // add colored rectangles for each status
    statusLegend
      .selectAll("rect")
      .data(statusItems)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 25 + 10)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5);

    // add labels next to rectangles
    statusLegend
      .selectAll("text.status")
      .data(statusItems)
      .enter()
      .append("text")
      .attr("class", "status")
      .attr("x", 24)
      .attr("y", (d, i) => i * 25 + 10 + 7)
      .attr("font-size", "12px")
      .text((d) => d.label);
  }

  private static createSizeLegend(
    svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>
  ): void {
    // create size legend with fixed position
    const sizeLegend = svg
      .append("g")
      .attr("class", "size-legend")
      .attr("transform", "translate(30, 30)");

    // scale circles by launch count using sqrt scale for better visual representation
    const legendValues = [1, 5, 10, 20];
    const radiusScale = d3.scaleSqrt().domain([1, 20]).range([5, 25]);

    sizeLegend
      .selectAll("circle")
      .data(legendValues)
      .enter()
      .append("circle")
      .attr("cx", 10)
      .attr("cy", (d, i) => i * 50 + 10)
      .attr("r", (d) => radiusScale(d))
      .attr("fill", "rgba(128, 128, 128, 0.7)")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5);

    sizeLegend
      .selectAll("text")
      .data(legendValues)
      .enter()
      .append("text")
      .attr("x", 50)
      .attr("y", (d, i) => i * 50 + 10)
      .attr("alignment-baseline", "middle")
      .attr("font-size", "12px")
      .text((d) => `${d} launch${d > 1 ? "es" : ""}`);

    sizeLegend
      .append("text")
      .attr("class", "title")
      .attr("x", 0)
      .attr("y", -10)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Launches per Site");
  }
}
