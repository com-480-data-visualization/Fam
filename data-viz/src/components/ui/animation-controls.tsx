/**
 * Animation controls component for timeline-based visualizations.
 *
 * This component provides a user interface for controlling the playback
 * of time-based data, including play/pause functionality, timeline scrubbing,
 * timeline scale switching, playback speed control, and reset capabilities.
 *
 * @module components/ui/animation-controls
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider, type SliderMark } from "@/components/ui/slider";
import { TimelineToggle } from "./timeline-toggle";
import { Play, Pause, SkipBack, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTimeline } from "@/contexts/TimelineContext";

/**
 * Props for the AnimationControls component.
 */
interface AnimationControlsProps {
  /** Whether the animation is currently playing */
  isPlaying: boolean;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Human-readable representation of the current time */
  formattedTime: string;
  /** Callback for resetting the timeline to the beginning */
  onReset: () => void;
  /** Callback for toggling between playing and paused states */
  onPlayPause: () => void;
}

/**
 * Component that provides controls for timeline-based animations.
 *
 * Includes:
 * - Play/pause controls
 * - Timeline scrubbing slider
 * - Year/Month scale switching
 * - Speed controls with presets
 * - Reset button
 *
 * @returns {JSX.Element} The rendered animation controls
 */
export function AnimationControls({
  isPlaying,
  isLoading,
  formattedTime,
  onPlayPause,
  onReset,
}: AnimationControlsProps) {
  // Access the timeline context for controlling speed and view mode
  const {
    playbackSpeed,
    setPlaybackSpeed,
    viewMode,
    currentMonthIndex,
    minMonthIndex,
    maxMonthIndex,
    setMonthIndex,
  } = useTimeline();

  // Common speed presets
  const speedPresets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const [currentSpeed, setCurrentSpeed] = useState(playbackSpeed);
  const [showSpeedControls, setShowSpeedControls] = useState(false);

  // Create marks for the speed slider
  const speedMarks: SliderMark[] = speedPresets.map((preset) => ({
    value: preset,
    label: preset === 1 ? "Normal" : `${preset}x`,
  }));

  // Sync local speed state with context
  useEffect(() => {
    setCurrentSpeed(playbackSpeed);
  }, [playbackSpeed]);

  /**
   * Handles changes to the timeline slider value
   */
  const handleSliderChange = (value: number) => {
    // Update month index directly
    setMonthIndex(value);
  };

  /**
   * Handles changes to the speed slider value
   */
  const handleSpeedChange = (value: number) => {
    setCurrentSpeed(value);
    setPlaybackSpeed(value);
  };

  /**
   * Handles clicks on speed preset buttons
   */
  const handleSpeedPresetClick = (preset: number) => {
    setCurrentSpeed(preset);
    setPlaybackSpeed(preset);
  };

  // Determine the appropriate step size based on view mode
  // In month view, we want to move 1 month at a time
  // In year view, we want to move 12 months (1 year) at a time
  const timelineStep = viewMode === "month" ? 1 : 12;

  return (
    <div className="flex flex-col w-full items-center mt-1 py-1 px-3 md:py-2 md:px-4 lg:py-3 lg:px-6 bg-card rounded-lg border shadow-sm">
      {/* Main controls row */}
      <div className="flex w-full flex-wrap items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            onClick={onReset}
            variant="outline"
            className="h-6.5 px-2 md:px-3 text-xs md:text-sm flex items-center justify-center box-border"
          >
            <SkipBack className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span>Reset</span>
          </Button>
          <Button
            onClick={onPlayPause}
            variant="default"
            disabled={isLoading}
            className="h-6 px-2 md:px-3 text-xs md:text-sm flex items-center justify-center box-border min-w-16 md:min-w-24"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span>Play</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center">
          <span className="text-base md:text-lg font-semibold whitespace-nowrap">
            {formattedTime}
          </span>
        </div>

        <div className="flex items-center ml-auto">
          <TimelineToggle />
        </div>
      </div>

      {/* Timeline slider - uses month indices */}
      <div className="flex w-full items-center">
        <Slider
          value={currentMonthIndex}
          onValueChange={handleSliderChange}
          min={minMonthIndex}
          max={maxMonthIndex}
          step={timelineStep}
          className="w-full"
        />
      </div>

      {/* Speed controls section */}
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label className="text-xs md:text-sm font-medium">
              Speed:{" "}
              <span className="font-bold">{currentSpeed.toFixed(2)}x</span>
            </Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSpeedControls(!showSpeedControls)}
            className="h-6 md:h-8 px-2 text-xs md:text-sm"
          >
            {showSpeedControls ? (
              <>
                <ChevronUp className="h-3 w-3 md:h-4 md:w-4 mr-1" /> Hide
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 md:h-4 md:w-4 mr-1" /> Show
              </>
            )}
          </Button>
        </div>

        {showSpeedControls && (
          <div className="md:mt-1 space-y-1 md:space-y-2 md:pt-1">
            <Slider
              value={currentSpeed}
              min={0.25}
              max={2}
              step={0.05}
              onValueChange={handleSpeedChange}
              className="w-full"
              marks={speedMarks}
              showMarkLabels={true}
            />

            <div className="flex flex-wrap gap-1 mt-2 md:mt-4">
              {speedPresets.map((preset) => (
                <Button
                  key={preset}
                  variant={currentSpeed === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSpeedPresetClick(preset)}
                  className="h-6 md:h-7 px-1 md:px-2 text-xs"
                >
                  {preset === 1 ? "Normal" : `${preset}x`}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
