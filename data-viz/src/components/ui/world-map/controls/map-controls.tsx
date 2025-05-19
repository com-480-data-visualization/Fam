/**
 * Map controls component for the world map visualization.
 * Provides buttons for controlling the map view and display options.
 *
 * @module components/ui/world-map/controls/map-controls
 */

import React from "react";

interface MapControlsProps {
  showLaunchStatus: boolean;
  showLaunchStats: boolean;
  showSpaceEvents: boolean;
  setShowLaunchStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLaunchStats: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSpaceEvents: React.Dispatch<React.SetStateAction<boolean>>;
  onResetView: () => void;
}

/**
 * Component that renders a set of controls for the interactive map.
 * Allows users to toggle different visualization elements and reset the view.
 *
 * @param {MapControlsProps} props - Component props
 * @returns {JSX.Element} Map controls component
 */
export function MapControls({
  showLaunchStatus,
  showLaunchStats,
  showSpaceEvents,
  setShowLaunchStatus,
  setShowLaunchStats,
  setShowSpaceEvents,
  onResetView,
}: MapControlsProps) {
  const handleStatusToggle = () => {
    if (showLaunchStatus) {
      setShowLaunchStats(false);
    }
    setShowLaunchStatus(!showLaunchStatus);
  };

  const handleStatsToggle = () => {
    if (!showLaunchStats) {
      setShowLaunchStatus(true);
    }
    setShowLaunchStats(!showLaunchStats);
  };

  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex gap-2">
        <button
          onClick={onResetView}
          className="px-3 py-1 rounded text-xs bg-card text-foreground border border-muted hover:bg-muted transition-colors"
        >
          Reset View
        </button>
        <button
          onClick={handleStatusToggle}
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
          onClick={handleStatsToggle}
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
  );
}
