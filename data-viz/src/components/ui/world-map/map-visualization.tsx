/**
 * Map visualization component for the world map.
 * Handles the rendering of the world map and interactive launch site markers.
 *
 * @module components/ui/world-map/map-visualization
 */

import { useEffect, RefObject, useMemo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { FeatureCollection } from "geojson";
import { applyForceSimulation } from "./force-simulation";
import { initializePositions } from "./position-utils";
import { drawConnectionLines } from "./connection-utils";
import { updateCircles } from "./circle-utils";
import {
  setupTooltipInteractions,
  updateExistingTooltip,
} from "./tooltip-utils";
import { processLaunchData } from "./data-utils";
import { Launch } from "../../../types";
import { Launchpad, StatusColorMap } from "./types";
import { TimelineViewMode } from "../../../contexts/TimelineContext";
import { isFutureStatus } from "./statistics/yearly-launch-data";

interface MapVisualizationProps {
  svgRef: RefObject<SVGSVGElement | null>;
  tooltipRef: RefObject<HTMLDivElement | null>;
  launchData: Launch[] | null;
  isLoading: boolean;
  dimensions: { width: number; height: number };
  initialRenderComplete: boolean;
  hoveredSite: string | null;
  setHoveredSite: React.Dispatch<React.SetStateAction<string | null>>;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  statusColors: StatusColorMap;
  hoverStatusColors: StatusColorMap;
  viewMode: TimelineViewMode;
}

/**
 * Component that renders the interactive world map with launch site markers.
 *
 * @param {MapVisualizationProps} props - Component props
 * @returns {JSX.Element | null} Map visualization component
 */
export function MapVisualization({
  svgRef,
  tooltipRef,
  launchData,
  isLoading,
  dimensions,
  initialRenderComplete,
  hoveredSite,
  setHoveredSite,
  zoomLevel,
  setZoomLevel,
  statusColors,
  hoverStatusColors,
  viewMode,
}: MapVisualizationProps) {
  // Create projection and path generator for the map
  const { projection, path } = useMemo(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0) {
      return {
        projection: d3.geoNaturalEarth1(),
        path: d3.geoPath(),
      };
    }

    const proj = d3
      .geoNaturalEarth1()
      .scale(dimensions.width / 4.7)
      .translate([dimensions.width / 2, dimensions.height / 2]);

    return {
      projection: proj,
      path: d3.geoPath().projection(proj),
    };
  }, [dimensions.width, dimensions.height]);

  // Configure zoom behavior
  const zoom = useMemo(() => {
    return d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 12])
      .on("zoom", (event) => {
        const { transform } = event;
        const newZoomLevel = transform.k;
        setZoomLevel(newZoomLevel);

        const svg = d3.select(svgRef.current);
        svg.select("g.countries").attr("transform", transform as any);
        svg.select("g.launch-sites").attr("transform", transform as any);

        svg
          .selectAll("circle.launch-site")
          .attr("r", function () {
            const baseRadius = parseFloat(
              d3.select(this).attr("data-base-radius") || "0"
            );
            return Math.max(baseRadius / transform.k, 1.5);
          })
          .attr("stroke-width", function () {
            return 0.5 / transform.k;
          });
      });
  }, [setZoomLevel, svgRef]);

  // Initialize world map
  useEffect(() => {
    if (
      !initialRenderComplete ||
      dimensions.width <= 0 ||
      dimensions.height <= 0
    )
      return;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    svg.append("g").attr("class", "countries");
    svg.append("g").attr("class", "launch-sites");

    svg.call(zoom as any);

    d3.json<any>(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((data) => {
      if (!data) return;

      const countries: FeatureCollection = topojson.feature(
        data,
        data.objects.countries
      ) as unknown as FeatureCollection;

      svg
        .select("g.countries")
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#1e293b")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.5);
    });
  }, [path, initialRenderComplete, dimensions.width, dimensions.height, zoom, svgRef]);

  // Update launch site visualizations when data changes
  useEffect(() => {
    if (
      !launchData ||
      isLoading ||
      !initialRenderComplete ||
      dimensions.width <= 0
    )
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("line.connection-line").remove();

    const launchpadCounts = processLaunchData(launchData);
    const launchpads: Launchpad[] = Object.values(launchpadCounts);
    const tooltip = d3.select(tooltipRef.current);

    // Base circle size parameters
    const circleMinRadius = Math.max(5, dimensions.width / 250);
    const circleMaxRadius = Math.max(18, dimensions.width / 55);

    // Different domain scaling based on view mode
    // For month view: scale from 1-15 launches
    // For year view: scale from 1-60 launches (to accommodate up to ~55 launches)
    const circleDomain = viewMode === "month" ? [1, 15] : [1, 60];
    const circleRange = [circleMinRadius, circleMaxRadius];

    const radiusScale = d3.scaleSqrt().domain(circleDomain).range(circleRange);

    if (svg.select("g.launch-sites").empty()) {
      svg.append("g").attr("class", "launch-sites");
    }

    initializePositions(launchpads, projection);

    const forceStrength = Math.min(1.0, 0.3 * Math.sqrt(zoomLevel));
    applyForceSimulation(launchpads, radiusScale, forceStrength);

    drawConnectionLines(svg, launchpads, statusColors, zoomLevel);

    updateCircles({
      svg,
      launchpads,
      radiusScale,
      statusColors,
      hoverStatusColors,
      tooltip,
      setHoveredSite,
      isFutureStatus,
      launchpadCounts,
      hoveredSite,
      svgRef,
      launchData,
      zoomLevel,
      viewMode,
    });

    setupTooltipInteractions(tooltip, hoveredSite);

    updateExistingTooltip({
      svg,
      hoveredSite,
      launchpadCounts,
      tooltip,
      svgRef,
      launchData,
    });
  }, [
    launchData,
    isLoading,
    projection,
    hoveredSite,
    statusColors,
    hoverStatusColors,
    dimensions.width,
    zoomLevel,
    initialRenderComplete,
    viewMode,
    setHoveredSite,
    svgRef,
    tooltipRef,
  ]);

  return null;
}
