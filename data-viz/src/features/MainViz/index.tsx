/**
 * MainViz component displays the primary visualization interface of the application.
 * It combines the WorldMap component with timeline controls and contextual information
 * about the current time period being visualized.
 *
 * @module features/MainViz
 */

import { useTimeline } from "../../contexts/TimelineContext";
import { WorldMap } from "../../components/ui/world-map";
import { AnimationControls } from "../../components/ui/animation-controls";

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

  return (
    <section className="flex flex-col bg-background min-h-screen">
      <div
        className="w-full bg-[#000000] relative overflow-hidden"
        style={{
          maxWidth: "100vw",
          height: "calc(70vh - 1rem)",
          maxHeight: "70vh",
          minHeight: "630px",
        }}
      >
        <WorldMap launchData={currentMonthLaunches} isLoading={isLoading} />
      </div>

      <div className="container mx-auto px-4 py-1 space-y-2">
        <AnimationControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          formattedTime={formatTimeDisplay()}
          onPlayPause={togglePlayback}
          onReset={resetTimeline}
        />
        <div className="max-w-4xl mx-auto bg-background/70 backdrop-blur-sm rounded-md shadow-md border border-border">
          <div className="bg-muted/20 p-2 rounded text-sm sm:text-base">
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
