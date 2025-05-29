/**
 * Status legend overlay component for the world map visualization.
 * Displays the launch status legend as a small overlay on the map.
 *
 * @module components/ui/world-map/overlays/status-legend
 */

import { StatusColorMap } from "./types";
import { LaunchStatus } from "../../../types";

interface StatusLegendProps {
  statusColors: StatusColorMap;
}

/**
 * Component that renders a compact status legend overlay on the map.
 *
 * @param {StatusLegendProps} props - Component props
 * @returns {JSX.Element} Status legend component
 */
export function StatusLegend({ statusColors }: StatusLegendProps) {
  const statusItems = [
    { label: "Successful", color: statusColors[LaunchStatus.Successful] },
    { label: "Failed", color: statusColors[LaunchStatus.Failure] },
    {
      label: "Partial Failure",
      color: statusColors[LaunchStatus.PartialFailure],
    },
  ];

  return (
    <div className="flex items-center gap-4 text-xs text-foreground">

      {statusItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
