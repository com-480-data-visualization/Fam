/**
 * MainViz component displays the primary visualization interface of the application.
 * It combines the WorldMap component with timeline controls and contextual information
 * about the current time period being visualized.
 *
 * @module features/MainViz
 */

import { useTimeline } from "../../contexts/TimelineContext";
import { useState } from "react";
import { WorldMap } from "../../components/ui/world-map";
import { AnimationControls } from "../../components/ui/animation-controls";
import { StatusLegend } from "../../components/ui/world-map/status-legend";
import { ResetViewButton } from "../../components/ui/world-map/controls/reset-view-button";
import { COLOR_SETS } from "../../components/ui/world-map/color-constants";

/**
 * MainViz renders the primary visualization section with the world map and timeline controls.
 * This component serves as the main interactive area of the application, displaying rocket
 * launches on a world map with playback controls and contextual information about the
 * historical period being viewed.
 *
 * @returns JSX element containing the world map visualization and timeline controls
 */
export default function MainViz() {
  const {
    currentYear,
    isPlaying,
    currentMonthLaunches,
    isLoading,
    togglePlayback,
    resetTimeline,
    formatTimeDisplay,
  } = useTimeline();

  // State to trigger map reset from toolbar
  const [mapResetTrigger, setMapResetTrigger] = useState(0);

  return (
    <section id="main-viz" className="flex flex-col min-h-screen">
      {/* Main map visualization container */}
      <div className="relative overflow-hidden pt-2 w-full max-w-4xl mx-auto lg:mx-0 lg:max-w-full h-auto lg:h-[70vh]">
        <WorldMap
          launchData={currentMonthLaunches}
          isLoading={isLoading}
          resetTrigger={mapResetTrigger}
          onResetView={() => setMapResetTrigger((p) => p + 1)}
        />
      </div>
      <div className="lg:hidden w-full max-w-4xl mx-auto px-4">
        <AnimationControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          formattedTime={formatTimeDisplay()}
          onPlayPause={togglePlayback}
          onReset={resetTimeline}
        />
      </div>
      <div className="lg:hidden w-full max-w-4xl mx-auto px-4 mt-3">
        <div className="bg-card rounded-lg border py-1 px-3 lg:py-2 lg:px-4 xl:py-3 xl:px-6">
          <div className="bg-muted/20 p-2 rounded text-sm">
            {currentYear < 1970 ? (
              <p>
                <span className="font-semibold">Space Race Era:</span> Fierce
                competition between US and USSR dominated space exploration,
                with both nations racing to achieve milestones like the first
                satellite, human in space, and Moon landing.
              </p>
            ) : currentYear < 1990 ? (
              <p>
                <span className="font-semibold">Early Space Station Era:</span>{" "}
                Focus shifted to establishing a permanent human presence in
                space with stations like Salyut, Skylab and Mir, enabling
                longer-duration missions and advanced research.
              </p>
            ) : currentYear < 2012 ? (
              <p>
                <span className="font-semibold">Shuttle Era:</span> The Space
                Shuttle program enabled regular access to orbit, satellite
                deployment, and construction of the International Space Station.
                This era saw increased international cooperation.
              </p>
            ) : (
              <p>
                <span className="font-semibold">Commercial Space Era:</span>{" "}
                Private companies like SpaceX, Blue Origin, and others have
                revolutionized access to space with reusable rockets,
                drastically reducing launch costs and opening new possibilities.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Desktop-only bottom controls and toolbar */}
      <div className="hidden lg:flex-shrink-0 lg:flex w-full max-w-4xl mx-auto px-4 space-y-2 bg-background flex-col items-center">
        {/* Map toolbar: legend, zoom hint, reset */}
        <div className="w-full px-1 flex items-center bg-background/70 backdrop-blur-sm">
          <div className="flex-1">
            <StatusLegend statusColors={COLOR_SETS.statusColors} />
          </div>

          <div className="px-4">
            <ResetViewButton
              onResetView={() => setMapResetTrigger((p) => p + 1)}
            />
          </div>
          <div className="flex-1 flex justify-end">
            <div className="text-xs text-muted-foreground">
              Hold Ctrl + Scroll to zoom
            </div>
          </div>
        </div>
        <AnimationControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          formattedTime={formatTimeDisplay()}
          onPlayPause={togglePlayback}
          onReset={resetTimeline}
        />
        <div className="max-w-4xl mx-auto bg-card rounded-md border border-border">
          <div className="bg-muted/20 p-2 rounded text-sm lg:text-base">
            {currentYear < 1970 ? (
              <p>
                <span className="font-semibold">Space Race Era:</span> Fierce
                competition between US and USSR dominated space exploration,
                with both nations racing to achieve milestones like the first
                satellite, human in space, and Moon landing.
              </p>
            ) : currentYear < 1990 ? (
              <p>
                <span className="font-semibold">Early Space Station Era:</span>{" "}
                Focus shifted to establishing a permanent human presence in
                space with stations like Salyut, Skylab and Mir, enabling
                longer-duration missions and advanced research.
              </p>
            ) : currentYear < 2012 ? (
              <p>
                <span className="font-semibold">Shuttle Era:</span> The Space
                Shuttle program enabled regular access to orbit, satellite
                deployment, and construction of the International Space Station.
                This era saw increased international cooperation.
              </p>
            ) : (
              <p>
                <span className="font-semibold">Commercial Space Era:</span>{" "}
                Private companies like SpaceX, Blue Origin, and others have
                revolutionized access to space with reusable rockets,
                drastically reducing launch costs and opening new possibilities.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
