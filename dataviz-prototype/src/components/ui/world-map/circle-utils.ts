import * as d3 from "d3";
import React from "react";
import { generateTooltipContent } from "./tooltip-content";
import { Launch, Launchpad, StatusColorMap } from "./types";

interface UpdateCirclesParams {
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;
  launchpads: Launchpad[];
  radiusScale: d3.ScalePower<number, number>;
  statusColors: StatusColorMap;
  hoverStatusColors: StatusColorMap;
  tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>;
  setHoveredSite: React.Dispatch<React.SetStateAction<string | null>>;
  isFutureStatus: (status: string) => boolean;
  launchpadCounts: Record<string, Launchpad>;
  hoveredSite: string | null;
  svgRef: React.RefObject<SVGSVGElement | null>;
  launchData: Launch[];
}

export function updateCircles(params: UpdateCirclesParams): void {
  const {
    svg,
    launchpads,
    radiusScale,
    statusColors,
    hoverStatusColors,
    tooltip,
    setHoveredSite,
    isFutureStatus,
    launchpadCounts,
    svgRef,
    launchData,
  } = params;

  // bind data to circles using key for stable updates
  const circles = svg
    .select("g.launch-sites")
    .selectAll<SVGCircleElement, Launchpad>("circle.launch-site")
    .data(launchpads, (d) => d.key);

  // smoothly remove circles no longer in dataset
  circles.exit().transition().duration(300).attr("r", 0).remove();

  // update positions and styles of existing circles
  circles
    .attr("cx", (d) => d.x!)
    .attr("cy", (d) => d.y!)
    .attr("fill", (d) => statusColors[d.primaryStatus] || statusColors.default)
    .attr("data-launchpad", (d) => d.name.replace(/[^\w]/g, "_"))
    .each(function (d) {
      // add stroke to circles that moved from original position
      if (
        d.x === undefined ||
        d.y === undefined ||
        d.originalX === undefined ||
        d.originalY === undefined
      )
        return;

      const dx = d.x - d.originalX;
      const dy = d.y - d.originalY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        d3.select(this)
          .attr("stroke-width", "2")
          .attr(
            "stroke",
            statusColors[d.primaryStatus] || statusColors.default
          );
      }
    })
    .attr(
      "class",
      (d) =>
        `launch-site ${isFutureStatus(d.primaryStatus) ? "future-launch" : ""}`
    )
    .transition()
    .duration(300)
    .attr("r", (d) => radiusScale(Math.min(d.count, 20)));

  // handle hover interactions
  function handleMouseOver(
    this: SVGCircleElement,
    event: MouseEvent,
    d: Launchpad
  ): void {
    const key = d.key;
    setHoveredSite(key);

    // apply hover color immediately
    d3.select(this)
      .interrupt()
      .style(
        "fill",
        hoverStatusColors[d.primaryStatus] || hoverStatusColors.default
      );

    const currentData = launchpadCounts[key];
    if (!currentData) return;

    // position and show tooltip
    const circleRect = this.getBoundingClientRect();
    const svgRect = svgRef.current?.getBoundingClientRect();

    if (svgRect) {
      const tooltipX = circleRect.left - svgRect.left + circleRect.width + 15;
      const tooltipY = circleRect.top - svgRect.top - 15;

      tooltip
        .interrupt()
        .style("display", "block")
        .style("pointer-events", "auto")
        .style("left", `${tooltipX}px`)
        .style("top", `${tooltipY}px`)
        .html(generateTooltipContent(currentData, launchData))
        .style("opacity", 1);
    }
  }

  // reset circle and tooltip on mouse out
  function handleMouseOut(
    this: SVGCircleElement,
    event: MouseEvent,
    d: Launchpad
  ): void {
    setHoveredSite(null);

    d3.select(this)
      .interrupt()
      .style("fill", null)
      .attr("fill", statusColors[d.primaryStatus] || statusColors.default);

    tooltip.interrupt().style("opacity", 0).style("pointer-events", "none");
  }

  // add new circles with animations
  circles
    .enter()
    .append("circle")
    .attr(
      "class",
      (d) =>
        `launch-site ${isFutureStatus(d.primaryStatus) ? "future-launch" : ""}`
    )
    .attr("data-launchpad", (d) => d.name.replace(/[^\w]/g, "_"))
    .attr("fill", (d) => statusColors[d.primaryStatus] || statusColors.default)
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5)
    .attr("cx", (d) => d.x!)
    .attr("cy", (d) => d.y!)
    .attr("r", 0)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .transition()
    .duration(600)
    .attr("r", (d) => radiusScale(Math.min(d.count, 20)));

  // ensure event handlers are properly bound
  svg
    .selectAll<SVGCircleElement, Launchpad>("circle.launch-site")
    .on("mouseover", null)
    .on("mouseout", null)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // style future launches with dashed outline
  svg
    .selectAll("circle.future-launch")
    .style("stroke-width", 1.5)
    .style("stroke-dasharray", "3,2");
}
