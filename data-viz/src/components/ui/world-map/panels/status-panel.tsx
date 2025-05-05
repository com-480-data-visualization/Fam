/**
 * Status panel component for the world map visualization.
 * Displays the launch status legend and statistics.
 *
 * @module components/ui/world-map/panels/status-panel
 */

import { RefObject } from "react";
import { StatusColorMap } from "../types";
import { YearlyLaunchData } from "../statistics/yearly-launch-data";
import { LaunchCountChart } from "../charts/launch-count-chart";
import { SuccessRateChart } from "../charts/success-rate-chart";

interface StatusPanelProps {
  showLaunchStatus: boolean;
  showLaunchStats: boolean;
  setShowLaunchStatus: (value: boolean) => void;
  setShowLaunchStats: (value: boolean) => void;
  statusColors: StatusColorMap;
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
 * Component that renders the status panel with launch status legend and statistics.
 *
 * @param {StatusPanelProps} props - Component props
 * @returns {JSX.Element | null} Status panel component or null if not visible
 */
export function StatusPanel({
  showLaunchStatus,
  showLaunchStats,
  setShowLaunchStatus,
  setShowLaunchStats,
  statusColors,
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
}: StatusPanelProps) {
  if (!showLaunchStatus) return null;

  // Status legend items
  const statusItems = [
    { label: "Successful", color: statusColors["Launch Successful"] },
    { label: "Failed", color: statusColors["Launch Failure"] },
    {
      label: "Partial Failure",
      color: statusColors["Launch was a Partial Failure"],
    },
    { label: "Planned/Future", color: statusColors["To Be Determined"] },
  ];

  return (
    <div className="absolute top-28 left-6 z-20">
      <div className="inline-block bg-background/70 backdrop-blur-sm px-4 py-3 mt-1 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs font-medium text-left">Launch Status</div>
          <button
            onClick={() => {
              setShowLaunchStatus(false);
              setShowLaunchStats(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
            title="Hide panel"
          >
            <span>×</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-w-[220px]">
          {statusItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <div
                className="w-3 h-3 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>

        {showLaunchStats && (
          <div className="mt-3 pt-3 border-t border-muted/40">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs font-medium text-left">Launch Stats</div>
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
              <LaunchCountChart
                yearlyData={yearlyData}
                currentYear={currentYear}
                chartRef={launchChartRef}
                showChart={showLaunchStats}
              />

              <svg
                ref={successChartRef}
                width="220"
                height="140"
                className="bg-background/70 backdrop-blur-sm rounded-md shadow-md border border-border"
              ></svg>
              <SuccessRateChart
                yearlyData={yearlyData}
                currentYear={currentYear}
                chartRef={successChartRef}
                showChart={showLaunchStats}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
