/**
 * Stats panel component for the world map visualization.
 * Displays detailed launch statistics and charts in a collapsible side panel.
 *
 * @module components/ui/world-map/panels/stats-panel
 */

import { RefObject } from "react";
import { YearlyLaunchData } from "../statistics/yearly-launch-data";
import { LaunchCountChart } from "../charts/launch-count-chart";
import { SuccessRateChart } from "../charts/success-rate-chart";

interface StatsPanelProps {
  isLargeScreen: boolean;
  showLaunchStats: boolean;
  setShowLaunchStats: (value: boolean) => void;
  totalLaunches: number;
  successfulLaunches: number;
  otherLaunches: number;
  successPercentage: number;
  otherPercentage: number;
  overallSuccessRate: number;
  uniqueSites: number;
  successColor: string;
  otherColor: string;
  yearlyData: YearlyLaunchData[];
  currentYear: number;
  launchChartRef: RefObject<SVGSVGElement | null>;
  successChartRef: RefObject<SVGSVGElement | null>;
}

/**
 * Component that renders a collapsible stats panel with detailed launch statistics.
 *
 * @param {StatsPanelProps} props - Component props
 * @returns {JSX.Element} Stats panel component
 */
export function StatsPanel({
  isLargeScreen,
  showLaunchStats,
  setShowLaunchStats,
  totalLaunches,
  successfulLaunches,
  otherLaunches,
  successPercentage,
  otherPercentage,
  overallSuccessRate,
  uniqueSites,
  successColor,
  otherColor,
  yearlyData,
  currentYear,
  launchChartRef,
  successChartRef,
}: StatsPanelProps) {
  // Determine chart dimensions based on screen size
  const chartWidth = isLargeScreen ? 240 : 180;
  const chartHeight = isLargeScreen ? 140 : 100;

  return (
    <div className="w-full lg:w-64">
      <div className="bg-background/70 backdrop-blur-sm rounded-md shadow-md border border-border">
        {/* Panel header */}
        <div className="p-3 border-b border-muted/40">
          <button
            onClick={() => setShowLaunchStats(!showLaunchStats)}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="text-sm font-medium">Launch Statistics</span>
            <span
              className={`text-xs transition-transform duration-200 ${
                showLaunchStats ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
        </div>

        {/* Panel content */}
        {showLaunchStats && (
          <div className="p-3">
            {totalLaunches > 0 ? (
              <div className={`${isLargeScreen ? "space-y-4" : "space-y-2"}`}>
                {/* Basic stats */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">
                      Total Launches:
                    </span>
                    <span className="font-medium text-xs">{totalLaunches}</span>
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

                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Unique Sites:
                  </span>
                  <span className="font-medium text-xs">{uniqueSites}</span>
                </div>

                {/* Charts */}
                <div
                  className={`${
                    isLargeScreen
                      ? "space-y-3"
                      : "flex justify-between items-center space-x-2"
                  }`}
                >
                  <div className="relative">
                    <svg
                      ref={launchChartRef}
                      width={chartWidth}
                      height={chartHeight}
                      className="bg-background/70 backdrop-blur-sm rounded-md shadow-md"
                    ></svg>
                    <LaunchCountChart
                      yearlyData={yearlyData}
                      currentYear={currentYear}
                      chartRef={launchChartRef}
                      showChart={showLaunchStats}
                      width={chartWidth}
                      height={chartHeight}
                    />
                  </div>
                  <div className="relative">
                    <svg
                      ref={successChartRef}
                      width={chartWidth}
                      height={chartHeight}
                      className="bg-background/70 backdrop-blur-sm rounded-md shadow-md"
                    ></svg>
                    <SuccessRateChart
                      yearlyData={yearlyData}
                      currentYear={currentYear}
                      chartRef={successChartRef}
                      showChart={showLaunchStats}
                      width={chartWidth}
                      height={chartHeight}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                No launch data available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
