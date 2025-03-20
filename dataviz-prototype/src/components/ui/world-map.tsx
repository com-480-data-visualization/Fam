import React, { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { FeatureCollection } from "geojson";
import { MapLegends } from "./world-map/map-legends";
import { applyForceSimulation } from "./world-map/force-simulation";
import { initializePositions } from "./world-map/position-utils";
import { drawConnectionLines } from "./world-map/connection-utils";
import { updateCircles } from "./world-map/circle-utils";
import {
  setupTooltipInteractions,
  updateExistingTooltip,
} from "./world-map/tooltip-utils";
import { processLaunchData } from "./world-map/data-utils";
import { COLOR_SETS } from "./world-map/color-constants";
import { Launchpad, WorldMapProps } from "./world-map/types";

const WorldMap = ({ launchData, isLoading }: WorldMapProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const width = 1600;
  const height = 1000;
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);

  const { statusColors, hoverStatusColors } = COLOR_SETS;

  const isFutureStatus = (status: string): boolean => {
    return ["To Be Determined", "Go for Launch", "To Be Confirmed"].includes(
      status
    );
  };

  // configure natural earth projection for world map
  const { projection, path } = useMemo(() => {
    const proj = d3
      .geoNaturalEarth1()
      .scale(250)
      .translate([width / 2 + 30, height / 2]);
    return {
      projection: proj,
      path: d3.geoPath().projection(proj),
    };
  }, [width, height]);

  // setup base map and legends
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.append("g").attr("class", "countries");

    // add status and size legends
    MapLegends.createLegends(svg, statusColors);

    // render world map from topojson data
    d3.json<any>(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((data) => {
      // hack, the output type of topojson.feature is incorrect
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
        .attr("fill", "#f0f0f0")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5);
    });
  }, [path, statusColors]);

  // handle data updates and visualization
  useEffect(() => {
    if (!launchData || isLoading) return;

    // reset visualization state
    d3.select(svgRef.current).selectAll("line.connection-line").remove();

    // prepare data and setup scales
    const launchpadCounts = processLaunchData(launchData);
    const launchpads: Launchpad[] = Object.values(launchpadCounts);
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const radiusScale = d3.scaleSqrt().domain([1, 20]).range([5, 25]);

    // ensure launch sites container exists
    if (svg.select("g.launch-sites").empty()) {
      svg.append("g").attr("class", "launch-sites");
    }

    // position and layout launch sites
    initializePositions(launchpads, projection);
    applyForceSimulation(launchpads, radiusScale);
    drawConnectionLines(svg, launchpads, statusColors);

    // render launch site circles with interactions
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
    });

    // initialize tooltip behavior
    setupTooltipInteractions(tooltip, hoveredSite);

    // maintain tooltip state for hovered sites
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
  ]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={isLoading ? "opacity-30" : ""}
      >
        <g className="countries" />
        <g className="launch-sites" />
        <g className="legend" />
      </svg>
      <div
        ref={tooltipRef}
        className="absolute bg-white p-3 rounded-md shadow-lg border border-gray-200 text-sm pointer-events-auto opacity-0 transition-opacity z-50 max-w-xs"
        style={{ pointerEvents: "none" }}
      >
        {/* tooltip content rendered dynamically */}
      </div>
    </div>
  );
};

export { WorldMap };
