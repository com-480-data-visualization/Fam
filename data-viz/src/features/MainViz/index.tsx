import { useTimeline } from "../../contexts/TimelineContext";
import { WorldMap } from "../../components/ui/world-map";
import { AnimationControls } from "../../components/ui/animation-controls";

export default function MainViz() {
  const {
    currentTimeValue,
    currentYear,
    isPlaying,
    currentMonthLaunches,
    isLoading,
    minTimeValue,
    maxTimeValue,
    setTimeValue,
    togglePlayback,
    resetTimeline,
    formatTimeDisplay,
  } = useTimeline();

  const handleTimeChange = (timeValue: number) => {
    setTimeValue(timeValue);
  };

  return (
    <section className="flex flex-col bg-background min-h-screen">
      <div
        className="w-full bg-[#0a0f1c] relative overflow-hidden"
        style={{
          maxWidth: "100vw",
          height: "80vh",
        }}
      >
        <WorldMap launchData={currentMonthLaunches} isLoading={isLoading} />
      </div>

      <div className="container mx-auto px-4 py-2">
        <AnimationControls
          currentTimeValue={currentTimeValue}
          minTimeValue={minTimeValue}
          maxTimeValue={maxTimeValue}
          isPlaying={isPlaying}
          isLoading={isLoading}
          formattedTime={formatTimeDisplay()}
          onTimeChange={handleTimeChange}
          onPlayPause={togglePlayback}
          onReset={resetTimeline}
        />
        <div className="mt-4 max-w-4xl mx-auto bg-background/70 backdrop-blur-sm rounded-md shadow-md border border-border p-1">
          <div className="bg-muted/20 p-2 rounded">
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
