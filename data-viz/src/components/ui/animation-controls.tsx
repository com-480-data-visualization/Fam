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
    <div className="flex flex-col w-full items-center mt-1 py-1 px-3 lg:py-2 lg:px-4 xl:py-3 xl:px-6 bg-card rounded-lg border shadow-sm">
      {/* Main controls row */}
      <div className="flex w-full items-center justify-between gap-2 lg:gap-4">
        <div className="flex items-center gap-1 lg:gap-2">
          <Button
            onClick={onReset}
            variant="outline"
            className="h-6.5 px-2 lg:px-3 text-xs lg:text-sm flex items-center justify-center box-border"
          >
            <SkipBack className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
            <span>Reset</span>
          </Button>
          <Button
            onClick={onPlayPause}
            variant="default"
            disabled={isLoading}
            className="h-6 px-2 lg:px-3 text-xs lg:text-sm flex items-center justify-center box-border min-w-16 lg:min-w-24"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                <span>Play</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center">
          <span className="text-base lg:text-lg font-semibold whitespace-nowrap">
            {formattedTime}
          </span>
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
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <Label className="text-xs lg:text-sm font-medium">
              Speed:{" "}
              <span className="font-bold">{currentSpeed.toFixed(2)}x</span>
            </Label>
          </div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <TimelineToggle />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSpeedControls(!showSpeedControls)}
            className="h-6 lg:h-8 px-2 text-xs lg:text-sm"
          >
            {showSpeedControls ? (
              <>
                <ChevronUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" /> Hide
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 mr-1" /> Show
              </>
            )}
          </Button>
        </div>

        {showSpeedControls && (
          <div className="lg:mt-1 space-y-1 lg:space-y-2 lg:pt-1">
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

            <div className="flex flex-wrap gap-1 mt-2 lg:mt-4">
              {speedPresets.map((preset) => (
                <Button
                  key={preset}
                  variant={currentSpeed === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSpeedPresetClick(preset)}
                  className="h-6 lg:h-7 px-1 lg:px-2 text-xs"
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
