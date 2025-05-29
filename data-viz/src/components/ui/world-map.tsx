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
import { useEffect, useLayoutEffect, useRef, useMemo, useState } from "react";
import { useTimeline } from "../../contexts/TimelineContext";
import { COLOR_SETS } from "./world-map/color-constants";
import { WorldMapProps, SpaceTweet } from "./world-map/types";
import { StatsPanel } from "./world-map/panels/stats-panel";
import { EventsPanel } from "./world-map/panels/events-panel";
import { MapVisualization } from "./world-map/map-visualization";
import { LaunchStatus, isSuccessfulLaunchStatus } from "../../types";
import {
  YearlyLaunchData,
  processYearlyLaunchData,
} from "./world-map/statistics/yearly-launch-data";
import { StatusLegend } from "./world-map/status-legend";
import { ResetViewButton } from "./world-map/controls/reset-view-button";

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
  resetTrigger = 0,
  onResetView,
}: WorldMapProps) => {
  // Access timeline data and view mode
  const { allLaunchData, viewMode } = useTimeline();

  // Essential refs for DOM manipulation
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const launchChartRef = useRef<SVGSVGElement | null>(null);
  const successChartRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // State for container element and screen mode
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(
    window.matchMedia("(min-width:1024px)").matches
  );
  useLayoutEffect(() => {
    const mql = window.matchMedia("(min-width:1024px)");
    const handler = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Update panel visibility when screen size changes
  useEffect(() => {
    setShowLaunchStats(isLargeScreen);
    setShowSpaceEvents(isLargeScreen);
  }, [isLargeScreen]);

  // Component state
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // Start with 0 to force container measurement
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);
  const [pinnedSite, setPinnedSite] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [tweets, setTweets] = useState<SpaceTweet[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(1950);
  const [yearlyData, setYearlyData] = useState<YearlyLaunchData[]>([]);

  // UI visibility toggles - responsive defaults
  const [showLaunchStats, setShowLaunchStats] =
    useState<boolean>(isLargeScreen);
  const [showSpaceEvents, setShowSpaceEvents] =
    useState<boolean>(isLargeScreen);

  useLayoutEffect(() => {
    if (!containerEl) return;
    const measure = () => {
      if (isLargeScreen) {
        const rect = containerEl.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({ width: rect.width, height: rect.height });
          setInitialRenderComplete(true);
        }
      } else {
        const w = window.innerWidth - 32;
        const h = (w * 10) / 16;
        setDimensions({ width: w, height: h });
        setInitialRenderComplete(true);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerEl);
    window.addEventListener("resize", measure);
    const id1 = window.setTimeout(measure, 0);
    const id2 = window.setTimeout(measure, 100);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(id1);
      window.clearTimeout(id2);
    };
  }, [containerEl, isLargeScreen]);

  // Color configuration for visualization
  const { statusColors, hoverStatusColors } = COLOR_SETS;

  // Calculate statistics for current launch data
  const totalLaunches = launchData ? launchData.length : 0;
  const successfulLaunches = launchData
    ? launchData.filter((l) => isSuccessfulLaunchStatus(l.Status)).length
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

  const successColor = statusColors[LaunchStatus.Successful];
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

  // Handle click outside to unpin tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is outside of launch site circles and tooltip
      if (
        pinnedSite &&
        !target.closest(".launch-site-circle") &&
        !target.closest(".tooltip")
      ) {
        setPinnedSite(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [pinnedSite]);

  // Memoized SVG with static <g> containers to persist between timeline updates
  const svgElement = useMemo(
    () => (
      <svg
        ref={svgRef}
        className={`w-full h-full max-w-full max-h-full ${
          isLoading ? "opacity-30" : ""
        }`}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
      >
        <g className="countries" />
        <g className="launch-sites" />
      </svg>
    ),
    [dimensions.width, dimensions.height, isLoading]
  );

  return (
    <div className="h-full mx-auto overflow-hidden px-4 lg:px-16 2xl:px-32">
      {/* Responsive layout: only one branch mounted */}
      {isLargeScreen ? (
        // Desktop view
        <div className="flex flex-row h-full">
          {/* Left sidebar - Stats Panel */}
          <div className="flex-shrink-0">
            <StatsPanel
              isLargeScreen={isLargeScreen}
              showLaunchStats={showLaunchStats}
              setShowLaunchStats={setShowLaunchStats}
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
          </div>

          {/* Map + Toolbar Column */}
          <div
            className="flex-1 flex flex-col min-h-0 h-full"
            ref={(el) => {
              containerRef.current = el;
              setContainerEl(el);
            }}
          >
            {/* Title Overlay */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
              <div className="bg-background/70 backdrop-blur-sm px-4 py-2 rounded-md shadow-md">
                <h1 className="text-xl font-bold text-foreground">
                  Rocket Launch History
                </h1>
              </div>
            </div>
            <div className="relative w-full h-full overflow-hidden bg-background">
              <MapVisualization
                key={`map-${isLargeScreen ? "desktop" : "mobile"}`}
                svgRef={svgRef}
                tooltipRef={tooltipRef}
                launchData={launchData}
                isLoading={isLoading}
                dimensions={dimensions}
                initialRenderComplete={initialRenderComplete}
                hoveredSite={hoveredSite}
                setHoveredSite={setHoveredSite}
                pinnedSite={pinnedSite}
                setPinnedSite={setPinnedSite}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                statusColors={statusColors}
                hoverStatusColors={hoverStatusColors}
                viewMode={viewMode}
                resetViewTrigger={resetTrigger}
                isLargeScreen={isLargeScreen}
              />
              {svgElement}
              <div
                ref={tooltipRef}
                className="tooltip absolute bg-card p-3 rounded-md shadow-lg border border-border text-sm pointer-events-auto opacity-0 transition-opacity z-50 max-w-xs"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>

          {/* Right sidebar - Events Panel */}
          <div className="flex-shrink-0">
            <EventsPanel
              showSpaceEvents={showSpaceEvents}
              setShowSpaceEvents={setShowSpaceEvents}
              visibleTweets={visibleTweets}
              currentYear={currentYear}
            />
          </div>
        </div>
      ) : (
        // Mobile view
        <div className="flex flex-col">
          {/* Mobile Title */}
          <div className="flex-shrink-0 px-4 bg-background mb-4">
            <h1 className="text-lg font-bold text-foreground text-center">
              Rocket Launch History
            </h1>
          </div>
          {/* Mobile Stats Panel */}
          <div className="flex-shrink-0">
            <StatsPanel
              isLargeScreen={isLargeScreen}
              showLaunchStats={showLaunchStats}
              setShowLaunchStats={setShowLaunchStats}
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
          </div>

          {/* Map Container */}
          <div
            className="w-full max-w-full aspect-[16/10] relative overflow-hidden bg-background mb-4"
            ref={(el) => {
              containerRef.current = el;
              setContainerEl(el);
            }}
          >
            <MapVisualization
              key={`map-${isLargeScreen ? "desktop" : "mobile"}`}
              svgRef={svgRef}
              tooltipRef={tooltipRef}
              launchData={launchData}
              isLoading={isLoading}
              dimensions={dimensions}
              initialRenderComplete={initialRenderComplete}
              hoveredSite={hoveredSite}
              setHoveredSite={setHoveredSite}
              pinnedSite={pinnedSite}
              setPinnedSite={setPinnedSite}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              statusColors={statusColors}
              hoverStatusColors={hoverStatusColors}
              viewMode={viewMode}
              resetViewTrigger={resetTrigger}
              isLargeScreen={isLargeScreen}
            />
            {svgElement}
            <div
              ref={tooltipRef}
              className="tooltip absolute bg-card p-3 rounded-md shadow-lg border border-border text-sm pointer-events-auto opacity-0 transition-opacity z-50 max-w-xs"
              style={{ pointerEvents: "none" }}
            />
          </div>

          {/* Mobile map controls: legend + reset */}
          <div className="flex items-center justify-center px-4 py-2 space-x-4 bg-background/70 backdrop-blur-sm">
            <StatusLegend statusColors={statusColors} />
            <ResetViewButton onResetView={onResetView!} />
          </div>

          {/* Mobile Events Panel - Below the map */}
          <div className="flex-shrink-0">
            <EventsPanel
              showSpaceEvents={showSpaceEvents}
              setShowSpaceEvents={setShowSpaceEvents}
              visibleTweets={visibleTweets}
              currentYear={currentYear}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { WorldMap };
