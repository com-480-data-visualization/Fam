import { useEffect, useRef, useMemo, useState, useLayoutEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { FeatureCollection } from "geojson";
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
import { Launchpad, WorldMapProps, SpaceTweet } from "./world-map/types";
import { useTimeline } from "../../contexts/TimelineContext";
import { Launch } from "../../types";

interface YearlyLaunchData {
  year: number;
  count: number;
  successCount: number;
  successRate: number;
}

function processYearlyLaunchData(allLaunchData: Launch[]): YearlyLaunchData[] {
  const dataByYear = new Map<number, { count: number; successCount: number }>();

  allLaunchData.forEach((launch) => {
    const year = launch.year;
    if (!dataByYear.has(year)) {
      dataByYear.set(year, { count: 0, successCount: 0 });
    }

    const yearData = dataByYear.get(year)!;
    yearData.count += 1;
    if (launch.Status === "Launch Successful") {
      yearData.successCount += 1;
    }
  });

  return Array.from(dataByYear.entries())
    .map(([year, data]) => ({
      year,
      count: data.count,
      successCount: data.successCount,
      successRate: data.count > 0 ? (data.successCount / data.count) * 100 : 0,
    }))
    .sort((a, b) => a.year - b.year);
}

const WorldMap = ({
  launchData,
  isLoading,
  width = 1600,
  height = 1000,
}: WorldMapProps) => {
  const { allLaunchData } = useTimeline();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const launchChartRef = useRef<SVGSVGElement | null>(null);
  const successChartRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [tweets, setTweets] = useState<SpaceTweet[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(1950);
  const [yearlyData, setYearlyData] = useState<YearlyLaunchData[]>([]);

  const [showLaunchStatus, setShowLaunchStatus] = useState<boolean>(true);
  const [showLaunchStats, setShowLaunchStats] = useState<boolean>(true);
  const [showSpaceEvents, setShowSpaceEvents] = useState<boolean>(true);

  const { statusColors, hoverStatusColors } = COLOR_SETS;

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

  const statusItems = [
    { label: "Successful", color: statusColors["Launch Successful"] },
    { label: "Failed", color: statusColors["Launch Failure"] },
    {
      label: "Partial Failure",
      color: statusColors["Launch was a Partial Failure"],
    },
    { label: "Planned/Future", color: statusColors["To Be Determined"] },
  ];

  const isFutureStatus = (status: string): boolean => {
    return ["To Be Determined", "Go for Launch", "To Be Confirmed"].includes(
      status
    );
  };

  useEffect(() => {
    fetch("/space_tweets.json")
      .then((response) => response.json())
      .then((data) => setTweets(data))
      .catch((error) => console.error("Failed to load tweets:", error));
  }, []);

  const visibleTweets = useMemo(() => {
    return tweets
      .filter((tweet) => tweet.year <= currentYear)
      .sort((a, b) => b.year - a.year);
  }, [tweets, currentYear]);

  useEffect(() => {
    if (launchData && launchData.length > 0 && launchData[0].year) {
      setCurrentYear(Number(launchData[0].year));
    }
  }, [launchData]);

  useEffect(() => {
    if (allLaunchData && allLaunchData.length > 0) {
      const processedData = processYearlyLaunchData(allLaunchData);
      setYearlyData(processedData);
    }
  }, [allLaunchData]);

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
  }, []);

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
  }, [path, statusColors, dimensions, zoom, initialRenderComplete]);

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
    let launchpads: Launchpad[] = Object.values(launchpadCounts);
    const tooltip = d3.select(tooltipRef.current);

    const circleMinRadius = Math.max(6, dimensions.width / 230);
    const circleMaxRadius = Math.max(22, dimensions.width / 45);
    const radiusScale = d3
      .scaleSqrt()
      .domain([1, 10])
      .range([circleMinRadius, circleMaxRadius]);

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
    dimensions,
    zoomLevel,
    initialRenderComplete,
  ]);

  useEffect(() => {
    if (!yearlyData.length || !launchChartRef.current) return;

    const margin = { top: 20, right: 25, bottom: 25, left: 40 };
    const chartWidth = 220 - margin.left - margin.right;
    const chartHeight = 130 - margin.top - margin.bottom;

    const svg = d3.select(launchChartRef.current);
    svg.selectAll("*").remove();

    const chartG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([d3.min(yearlyData, (d) => d.year) || 1957, currentYear])
      .range([0, chartWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(yearlyData, (d) => d.count) || 0])
      .range([chartHeight, 0])
      .nice();

    chartG
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(4)
          .tickFormat((d) => `${d}`)
      )
      .selectAll("text")
      .style("font-size", "9px");

    chartG
      .append("g")
      .call(d3.axisLeft(y).ticks(3))
      .selectAll("text")
      .style("font-size", "9px");

    const line = d3
      .line<YearlyLaunchData>()
      .defined((d) => !isNaN(d.count))
      .x((d) => x(d.year))
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    const filteredData = yearlyData.filter((d) => d.year <= currentYear);

    chartG
      .append("path")
      .datum(filteredData)
      .attr("fill", "rgba(59, 130, 246, 0.1)")
      .attr(
        "d",
        d3
          .area<YearlyLaunchData>()
          .defined((d) => !isNaN(d.count))
          .x((d) => x(d.year))
          .y0(chartHeight)
          .y1((d) => y(d.count))
          .curve(d3.curveMonotoneX)
      );

    chartG
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "rgba(59, 130, 246, 0.8)")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    const currentYearData = yearlyData.find((d) => d.year === currentYear);
    if (currentYearData) {
      chartG
        .append("circle")
        .attr("cx", x(currentYear))
        .attr("cy", y(currentYearData.count))
        .attr("r", 4)
        .attr("fill", "rgba(59, 130, 246, 1)");

      chartG
        .append("text")
        .attr("x", x(currentYear))
        .attr("y", y(currentYearData.count) - 7)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "var(--foreground)")
        .text(currentYearData.count);
    }

    chartG
      .append("text")
      .attr("x", 0)
      .attr("y", -5)
      .attr("font-size", "11px")
      .attr("fill", "var(--foreground)")
      .attr("font-weight", "500")
      .text("Annual Launches");
  }, [yearlyData, currentYear, showLaunchStats]);

  useEffect(() => {
    if (!yearlyData.length || !successChartRef.current) return;

    const margin = { top: 20, right: 25, bottom: 25, left: 40 };
    const chartWidth = 220 - margin.left - margin.right;
    const chartHeight = 130 - margin.top - margin.bottom;

    const svg = d3.select(successChartRef.current);
    svg.selectAll("*").remove();

    const chartG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([d3.min(yearlyData, (d) => d.year) || 1957, currentYear])
      .range([0, chartWidth]);

    const y = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);

    chartG
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(4)
          .tickFormat((d) => `${d}`)
      )
      .selectAll("text")
      .style("font-size", "9px");

    chartG
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(3)
          .tickFormat((d) => `${d}%`)
      )
      .selectAll("text")
      .style("font-size", "9px");

    const line = d3
      .line<YearlyLaunchData>()
      .defined((d) => !isNaN(d.successRate))
      .x((d) => x(d.year))
      .y((d) => y(d.successRate))
      .curve(d3.curveMonotoneX);

    const filteredData = yearlyData.filter(
      (d) => d.year <= currentYear && d.count >= 3
    );

    chartG
      .append("path")
      .datum(filteredData)
      .attr("fill", "rgba(16, 185, 129, 0.1)")
      .attr(
        "d",
        d3
          .area<YearlyLaunchData>()
          .defined((d) => !isNaN(d.successRate))
          .x((d) => x(d.year))
          .y0(chartHeight)
          .y1((d) => y(d.successRate))
          .curve(d3.curveMonotoneX)
      );

    chartG
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "rgba(16, 185, 129, 0.8)")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    const currentYearData = yearlyData.find((d) => d.year === currentYear);
    if (currentYearData && currentYearData.count >= 3) {
      chartG
        .append("circle")
        .attr("cx", x(currentYear))
        .attr("cy", y(currentYearData.successRate))
        .attr("r", 4)
        .attr("fill", "rgba(16, 185, 129, 1)");

      chartG
        .append("text")
        .attr("x", x(currentYear))
        .attr("y", y(currentYearData.successRate) - 7)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "var(--foreground)")
        .text(`${Math.round(currentYearData.successRate)}%`);
    }

    chartG
      .append("text")
      .attr("x", 0)
      .attr("y", -5)
      .attr("font-size", "11px")
      .attr("fill", "var(--foreground)")
      .attr("font-weight", "500")
      .text("Success Rate");
  }, [yearlyData, currentYear, showLaunchStats]);

  const resetView = () => {
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .duration(750)
      .call(zoom.transform as any, d3.zoomIdentity);
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

        <div className="flex gap-2 px-4">
          <button
            onClick={resetView}
            className="px-3 py-1 rounded text-xs bg-card text-foreground border border-muted hover:bg-muted transition-colors"
          >
            Reset View
          </button>
          <button
            onClick={() => {
              if (showLaunchStatus) {
                setShowLaunchStats(false);
              }
              setShowLaunchStatus(!showLaunchStatus);
            }}
            className={`px-3 py-1 rounded text-xs border ${
              showLaunchStatus
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-muted hover:bg-muted"
            } transition-colors`}
            title={
              showLaunchStatus
                ? "Hide Launch Status Legend"
                : "Show Launch Status Legend"
            }
          >
            Status
          </button>
          <button
            onClick={() => {
              if (!showLaunchStats) {
                setShowLaunchStatus(true);
              }
              setShowLaunchStats(!showLaunchStats);
            }}
            className={`px-3 py-1 rounded text-xs border ${
              showLaunchStats
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-muted hover:bg-muted"
            } transition-colors`}
            title={
              showLaunchStats
                ? "Hide Launch Statistics"
                : "Show Launch Statistics"
            }
          >
            Stats
          </button>
          <button
            onClick={() => setShowSpaceEvents(!showSpaceEvents)}
            className={`px-3 py-1 rounded text-xs border ${
              showSpaceEvents
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-muted hover:bg-muted"
            } transition-colors`}
            title={showSpaceEvents ? "Hide Space Events" : "Show Space Events"}
          >
            Events
          </button>
        </div>
      </div>

      {showLaunchStatus && (
        <div className="absolute top-28 left-6 z-20">
          <div className="inline-block bg-background/70 backdrop-blur-sm px-4 py-3 mt-1 rounded-md shadow-md">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-medium text-left">Launch Status</div>
              <button
                onClick={() => setShowLaunchStatus(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
                title="Hide panel"
              >
                <span>×</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {statusItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>

            {showLaunchStats && (
              <div className="mt-3 pt-3 border-t border-muted/40">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs font-medium text-left">
                    Launch Stats
                  </div>
                  <button
                    onClick={() => setShowLaunchStats(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                    title="Hide panel"
                  >
                    <span>×</span>
                  </button>
                </div>
                {totalLaunches > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          Total Launches:
                        </span>
                        <span className="font-medium text-xs">
                          {totalLaunches}
                        </span>
                      </div>
                      <div
                        className="flex w-full h-3 rounded overflow-hidden bg-muted/40"
                        title={`Launches: ${successfulLaunches} Successful, ${otherLaunches} Other Statuses`}
                      >
                        <div
                          title={`Successful: ${successfulLaunches} (${overallSuccessRate}%)`}
                          style={{
                            width: `${successPercentage}%`,
                            backgroundColor: successColor,
                          }}
                          className="h-full"
                        ></div>
                        <div
                          title={`Other Statuses: ${otherLaunches}`}
                          style={{
                            width: `${otherPercentage}%`,
                            backgroundColor: otherColor,
                          }}
                          className="h-full"
                        ></div>
                      </div>
                      <div className="text-right text-xs mt-1 font-medium">
                        {overallSuccessRate}% Success Rate
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-muted-foreground">
                        Unique Sites:
                      </span>
                      <span className="font-medium text-xs">{uniqueSites}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    No launch data.
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-2">
                  <svg
                    ref={launchChartRef}
                    width="220"
                    height="140"
                    className="bg-background/70 backdrop-blur-sm rounded-md shadow-md border border-border"
                  ></svg>
                  <svg
                    ref={successChartRef}
                    width="220"
                    height="140"
                    className="bg-background/70 backdrop-blur-sm rounded-md shadow-md border border-border"
                  ></svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute top-6 right-6 z-10 w-72 bg-background/70 backdrop-blur-sm rounded-md shadow-lg border border-border overflow-hidden flex flex-col">
        {showSpaceEvents ? (
          <>
            <div className="p-2 border-b border-muted/40 font-medium text-sm text-left flex justify-between items-center">
              <span>Space Events</span>
              <button
                onClick={() => setShowSpaceEvents(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
                title="Hide panel"
              >
                <span>×</span>
              </button>
            </div>
            <div
              id="tweet-container"
              className="overflow-y-auto p-2 h-52 space-y-2 tweet-scroll"
            >
              {visibleTweets.length > 0 ? (
                visibleTweets.map((tweet) => (
                  <div
                    key={`${tweet.year}-${tweet.id}`}
                    className={`p-2 rounded bg-muted/60 text-xs tweet-item text-left ${
                      tweet.year === currentYear
                        ? "animate-pulse-once border-l-2 border-primary pl-2 -ml-2"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{tweet.author}</span>
                      <span className="text-muted-foreground">
                        {tweet.year}
                      </span>
                    </div>
                    <p className="text-left">{tweet.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground p-4 text-left">
                  No space events yet
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-2 border-b border-muted/40 font-medium text-sm text-left flex justify-between items-center">
            <span>Space Events</span>
            <button
              onClick={() => setShowSpaceEvents(true)}
              className="text-xs text-muted-foreground hover:text-foreground px-2"
              title="Show panel"
            >
              <span>+</span>
            </button>
          </div>
        )}
      </div>

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
