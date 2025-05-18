/**
 * Interactive world map visualization for rocket launch data.
 *
 * This component is responsible for rendering the primary data visualization,
 * showing launch sites around the world with interactive features including:
 * - Zoomable and pannable world map
 * - Launch site markers sized by launch count
 * - Color-coding based on launch success rates
 * - Interactive tooltips with detailed launch information
 * - Time-based filtering synchronized with the timeline control
 * - Charts showing launch success rates and counts over time
 *
 * @module components/ui/world-map
 */
import { useEffect, useRef, useMemo, useState, useLayoutEffect } from "react";
import * as d3 from "d3";
import { useTimeline } from "../../contexts/TimelineContext";
import { COLOR_SETS } from "./world-map/color-constants";
import { WorldMapProps, SpaceTweet } from "./world-map/types";
import { MapControls } from "./world-map/controls/map-controls";
import { StatusPanel } from "./world-map/panels/status-panel";
import { EventsPanel } from "./world-map/panels/events-panel";
import { MapVisualization } from "./world-map/map-visualization";
import {
  YearlyLaunchData,
  processYearlyLaunchData,
} from "./world-map/statistics/yearly-launch-data";

/**
 * World map visualization component for rocket launch data
 *
 * This component handles the rendering of the interactive map and associated visualizations.
 *
 * @param {WorldMapProps} props - Component props
 * @param {Launch[] | null} props.launchData - Current launch data to visualize
 * @param {boolean} props.isLoading - Whether data is currently loading
 * @param {number} [props.width=1600] - Width of the map
 * @param {number} [props.height=1000] - Height of the map
 * @returns {JSX.Element} The rendered world map visualization
 */
const WorldMap = ({
  launchData,
  isLoading,
  width = 1600,
  height = 1000,
}: WorldMapProps) => {
  // Access timeline data and view mode
  const { allLaunchData, viewMode } = useTimeline();

  // Essential refs for DOM manipulation
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const launchChartRef = useRef<SVGSVGElement | null>(null);
  const successChartRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);

  // Component state
  const [dimensions, setDimensions] = useState({ width, height });
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [tweets, setTweets] = useState<SpaceTweet[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(1950);
  const [yearlyData, setYearlyData] = useState<YearlyLaunchData[]>([]);

  // UI visibility toggles
  const [showLaunchStatus, setShowLaunchStatus] = useState<boolean>(true);
  const [showLaunchStats, setShowLaunchStats] = useState<boolean>(true);
  const [showSpaceEvents, setShowSpaceEvents] = useState<boolean>(true);

  // Color configuration for visualization
  const { statusColors, hoverStatusColors } = COLOR_SETS;

  // Calculate statistics for current launch data
  const totalLaunches = launchData ? launchData.length : 0;
  const successfulLaunches = launchData
    ? launchData.filter((l) => l.Status === "Launch Successful").length
    : 0;
  const otherLaunches = totalLaunches - successfulLaunches;
  const successPercentage =
    totalLaunches > 0 ? (successfulLaunches / totalLaunches) * 100 : 0;
  const otherPercentage = 100 - successPercentage;
  const overallSuccessRate = Math.round(successPercentage);
  const uniqueSites =
    launchData && launchData.length
      ? new Set(launchData.map((l) => l.LaunchPad)).size
      : 0;

  const successColor = statusColors["Launch Successful"];
  const otherColor = "#a2a2a2";

  // Load tweet data on component mount
  useEffect(() => {
    fetch("/space_tweets.json")
      .then((response) => response.json())
      .then((data) => setTweets(data))
      .catch((error) => console.error("Failed to load tweets:", error));
  }, []);

  // Filter tweets based on current year
  const visibleTweets = useMemo(() => {
    return tweets
      .filter((tweet) => tweet.year <= currentYear)
      .sort((a, b) => b.year - a.year);
  }, [tweets, currentYear]);

  // Update current year when launch data changes
  useEffect(() => {
    if (launchData && launchData.length > 0 && launchData[0].year) {
      setCurrentYear(Number(launchData[0].year));
    }
  }, [launchData]);

  // Process yearly data when all launch data is available
  useEffect(() => {
    if (allLaunchData && allLaunchData.length > 0) {
      const processedData = processYearlyLaunchData(allLaunchData);
      setYearlyData(processedData);
    }
  }, [allLaunchData]);

  // Handle responsive sizing
  useLayoutEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const mapHeight = containerWidth * 0.625;

        setDimensions({
          width: containerWidth,
          height: mapHeight,
        });
      }
    }

    updateDimensions();
    setInitialRenderComplete(true);

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [width, height]);

  // Initialize zoom behavior
  useEffect(() => {
    if (svgRef.current && initialRenderComplete) {
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 12])
        .on("zoom", (event) => {
          const { transform } = event;
          const newZoomLevel = transform.k;
          setZoomLevel(newZoomLevel);

          const svg = d3.select(svgRef.current);
          svg.selectAll("g").attr("transform", transform);
        });

      zoomBehaviorRef.current = zoom;

      d3.select(svgRef.current).call(zoom);
    }
  }, [initialRenderComplete]);

  /**
   * Resets the map view to its initial state
   */
  const resetView = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg
        .transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);

      setZoomLevel(10);
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      ref={containerRef}
      style={{ paddingBottom: "0" }}
    >
      <div className="absolute top-4 left-6 z-10 flex flex-col items-start gap-1">
        <div className="bg-background/70 backdrop-blur-sm px-4 py-2 rounded-md shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Rocket Launch History
          </h1>
        </div>

        <MapControls
          showLaunchStatus={showLaunchStatus}
          showLaunchStats={showLaunchStats}
          showSpaceEvents={showSpaceEvents}
          setShowLaunchStatus={setShowLaunchStatus}
          setShowLaunchStats={setShowLaunchStats}
          setShowSpaceEvents={setShowSpaceEvents}
          onResetView={resetView}
        />
      </div>
      <StatusPanel
        showLaunchStatus={showLaunchStatus}
        showLaunchStats={showLaunchStats}
        setShowLaunchStatus={setShowLaunchStatus}
        setShowLaunchStats={setShowLaunchStats}
        statusColors={statusColors}
        totalLaunches={totalLaunches}
        successfulLaunches={successfulLaunches}
        otherLaunches={otherLaunches}
        successPercentage={successPercentage}
        otherPercentage={otherPercentage}
        overallSuccessRate={overallSuccessRate}
        uniqueSites={uniqueSites}
        successColor={successColor}
        otherColor={otherColor}
        yearlyData={yearlyData}
        currentYear={currentYear}
        launchChartRef={launchChartRef}
        successChartRef={successChartRef}
      />

      <EventsPanel
        showSpaceEvents={showSpaceEvents}
        setShowSpaceEvents={setShowSpaceEvents}
        visibleTweets={visibleTweets}
        currentYear={currentYear}
      />

      <MapVisualization
        svgRef={svgRef}
        tooltipRef={tooltipRef}
        launchData={launchData}
        isLoading={isLoading}
        dimensions={dimensions}
        initialRenderComplete={initialRenderComplete}
        hoveredSite={hoveredSite}
        setHoveredSite={setHoveredSite}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        statusColors={statusColors}
        hoverStatusColors={hoverStatusColors}
        viewMode={viewMode}
      />

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`w-full h-full ${isLoading ? "opacity-30" : ""}`}
        viewBox={`50 0 ${dimensions.width} ${dimensions.height}`}
        style={{ marginTop: "5vh" }}
      >
        <g className="countries" />
        <g className="launch-sites" />
      </svg>

      <div
        ref={tooltipRef}
        className="absolute bg-card p-3 rounded-md shadow-lg border border-border text-sm pointer-events-auto opacity-0 transition-opacity z-50 max-w-xs"
        style={{ pointerEvents: "none" }}
      ></div>

      <style>
        {`
        .tweet-scroll {
          scrollbar-width: thin;
        }
        .tweet-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .tweet-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .animate-pulse-once {
          animation: pulse-highlight 2s ease-in-out;
        }
        @keyframes pulse-highlight {
          0%,
          100% {
            background-color: rgba(59, 130, 246, 0.05);
          }
          50% {
            background-color: rgba(59, 130, 246, 0.2);
          }
        }
        `}
      </style>
    </div>
  );
};

export { WorldMap };
