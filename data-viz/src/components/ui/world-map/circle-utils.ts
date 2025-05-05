/**
 * Utility functions for managing circle elements in the world map visualization.
 *
 * This module provides functions for creating and updating the circle markers
 * that represent launch sites on the world map.
 *
 * @module components/ui/world-map/circle-utils
 */
import * as d3 from "d3";
import React from "react";
import { generateTooltipContent } from "./tooltip-content";
import { Launch } from "../../../types";
import { Launchpad, StatusColorMap } from "./types";
import { TimelineViewMode } from "../../../contexts/TimelineContext";

/**
 * Parameters for the updateCircles function.
 *
 * @interface UpdateCirclesParams
 */
interface UpdateCirclesParams {
  /** D3 selection of the SVG element */
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;
  /** Array of launchpad data objects */
  launchpads: Launchpad[];
  /** D3 scale function for determining circle radius based on launch count */
  radiusScale: d3.ScalePower<number, number>;
  /** Map of launch status to display colors */
  statusColors: StatusColorMap;
  /** Map of launch status to hover state colors */
  hoverStatusColors: StatusColorMap;
  /** D3 selection of the tooltip element */
  tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>;
  /** React state setter for the currently hovered site */
  setHoveredSite: React.Dispatch<React.SetStateAction<string | null>>;
  /** Function that determines if a status represents a future launch */
  isFutureStatus: (status: string) => boolean;
  /** Record of launchpad data indexed by their keys */
  launchpadCounts: Record<string, Launchpad>;
  /** ID of the currently hovered launch site */
  hoveredSite: string | null;
  /** React reference to the SVG element */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /** Array of launch data objects */
  launchData: Launch[];
  /** Current zoom level of the map view */
  zoomLevel?: number;
  /** Current timeline view mode (month or year) */
  viewMode?: TimelineViewMode;
}

/**
 * Updates the circle elements representing launch sites on the map.
 *
 * This function:
 * - Creates, updates, or removes circle elements based on the provided launchpads data
 * - Sets appropriate sizes, colors, and styles based on launch data
 * - Adds interaction handlers for hover/mouseover events
 * - Updates visual properties based on the current zoom level
 * - Applies special styling for future launch sites
 * - Adjusts circle sizes based on the current view mode (month/year)
 *
 * @param {UpdateCirclesParams} params - Parameters for updating circles
 * @returns {void}
 */
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
    zoomLevel = 1,
    viewMode = "month",
  } = params;

  // Select existing circles and bind data
  const circles = svg
    .select("g.launch-sites")
    .selectAll<SVGCircleElement, Launchpad>("circle.launch-site")
    .data(launchpads, (d) => d.key);

  // Remove circles for launchpads that no longer exist
  circles.exit().transition().duration(100).attr("r", 0).remove();

  // Maximum count to use for capping the circle size based on view mode
  const maxCount = viewMode === "month" ? 15 : 60;

  // Standard border width for all circles, adjusted for zoom level
  const standardStrokeWidth = 0.5 / zoomLevel;

  // Update existing circles
  circles
    .attr("cx", (d) => d.x!)
    .attr("cy", (d) => d.y!)
    .attr("fill", (d) => statusColors[d.primaryStatus] || statusColors.default)
    .attr("data-launchpad", (d) => d.name.replace(/[^\w]/g, "_"))
    // Use consistent white border for all circles
    .attr("stroke", "#ffffff")
    .attr("stroke-width", standardStrokeWidth)
    // Apply dashed stroke only for future launches
    .attr("stroke-dasharray", (d) =>
      isFutureStatus(d.primaryStatus) ? "3,2" : "none"
    )
    .attr(
      "class",
      (d) =>
        `launch-site ${isFutureStatus(d.primaryStatus) ? "future-launch" : ""}`
    )
    .transition()
    .duration(100)
    .attr("r", (d) => {
      const radius = radiusScale(Math.min(d.count, maxCount));
      return radius / zoomLevel;
    })
    .attr("data-base-radius", (d) => radiusScale(Math.min(d.count, maxCount)));

  /**
   * Handles mouseover/hover events on launch site circles
   *
   * @param {MouseEvent} _ - Mouse event object (unused)
   * @param {Launchpad} d - Data object for the hovered launchpad
   */
  function handleMouseOver(
    this: SVGCircleElement,
    _: MouseEvent,
    d: Launchpad
  ): void {
    const key = d.key;
    setHoveredSite(key);

    d3.select(this)
      .interrupt()
      .style(
        "fill",
        hoverStatusColors[d.primaryStatus] || hoverStatusColors.default
      );

    const currentData = launchpadCounts[key];
    if (!currentData) return;

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

  /**
   * Handles mouseout events on launch site circles
   *
   * @param {MouseEvent} _ - Mouse event object (unused)
   * @param {Launchpad} d - Data object for the launchpad being exited
   */
  function handleMouseOut(
    this: SVGCircleElement,
    _: MouseEvent,
    d: Launchpad
  ): void {
    setHoveredSite(null);

    d3.select(this)
      .interrupt()
      .style("fill", null)
      .attr("fill", statusColors[d.primaryStatus] || statusColors.default);

    tooltip.interrupt().style("opacity", 0).style("pointer-events", "none");
  }

  // Create new circles for new launchpads
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
    .attr("stroke", "#ffffff")
    .attr("stroke-width", standardStrokeWidth)
    .attr("stroke-dasharray", (d) =>
      isFutureStatus(d.primaryStatus) ? "3,2" : "none"
    )
    .attr("cx", (d) => d.x!)
    .attr("cy", (d) => d.y!)
    .attr("r", 0)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .transition()
    .duration(100)
    .attr("r", (d) => {
      const radius = radiusScale(Math.min(d.count, maxCount));
      return radius / zoomLevel;
    })
    .attr("data-base-radius", (d) => radiusScale(Math.min(d.count, maxCount)));

  // Ensure all circles have event handlers
  svg
    .selectAll<SVGCircleElement, Launchpad>("circle.launch-site")
    .on("mouseover", null)
    .on("mouseout", null)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
}
