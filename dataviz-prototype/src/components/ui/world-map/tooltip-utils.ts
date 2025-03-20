import * as d3 from "d3";
import React from "react";
import { generateTooltipContent } from "./tooltip-content";
import { Launch, Launchpad } from "./types";

// setup initial tooltip behavior and event handlers
export function setupTooltipInteractions(
  tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>,
  hoveredSite: string | null
): void {
  tooltip
    .style("display", "block")
    .style("opacity", 0)
    .style("pointer-events", "none");

  tooltip.on("mouseenter", function () {
    tooltip.interrupt().style("pointer-events", "auto");
  });

  tooltip.on("mouseleave", function () {
    if (hoveredSite === null) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
        .on("end", function () {
          tooltip.style("pointer-events", "none");
        });
    }
  });
}

interface UpdateExistingTooltipParams {
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;
  hoveredSite: string | null;
  launchpadCounts: Record<string, Launchpad>;
  tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  launchData: Launch[];
}

// update tooltip content and position for currently hovered site
export function updateExistingTooltip(
  params: UpdateExistingTooltipParams
): void {
  const { svg, hoveredSite, launchpadCounts, tooltip, svgRef, launchData } =
    params;

  if (!hoveredSite || !launchpadCounts[hoveredSite]) return;

  const safeSelector = hoveredSite.replace(/[^\w]/g, "_");
  const currentCircle = svg.select(`circle[data-launchpad="${safeSelector}"]`);
  const currentData = launchpadCounts[hoveredSite];

  if (!currentCircle.node() || !currentData) {
    console.warn(`circle node or data not found for ${hoveredSite}`);
    return;
  }

  const node = currentCircle.node() as SVGCircleElement;
  const circleRect = node.getBoundingClientRect();
  const svgRect = svgRef.current?.getBoundingClientRect();

  if (!svgRect) {
    console.warn("svg reference is not available");
    return;
  }

  // ensure tooltip stays within viewport
  const tooltipX = Math.max(
    0,
    circleRect.left - svgRect.left + circleRect.width + 15
  );
  const tooltipY = Math.max(0, circleRect.top - svgRect.top - 15);

  tooltip
    .interrupt()
    .style("display", "block")
    .style("pointer-events", "auto")
    .html(generateTooltipContent(currentData, launchData))
    .style("left", `${tooltipX}px`)
    .style("top", `${tooltipY}px`)
    .style("opacity", 1);
}
