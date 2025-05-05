/**
 * SpeedControl component for controlling animation playback speed.
 *
 * This component provides a user interface for controlling animation speed including:
 * - A slider for precise speed adjustment
 * - Play/pause button for controlling animation playback
 * - Preset buttons for common speed values
 * - Compact mode with expand/collapse functionality
 *
 * @module components/ui/speed-control
 */
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pause, Play } from "lucide-react";

/**
 * Props for the SpeedControl component.
 *
 * @interface SpeedControlProps
 */
interface SpeedControlProps {
  /** Callback function triggered when animation speed changes */
  onSpeedChange?: (speed: number) => void;
  /** Callback function triggered when play/pause state changes */
  onPlayPause?: (isPlaying: boolean) => void;
  /** Whether to render the component in compact mode (collapsed by default) */
  compact?: boolean;
}

/**
 * SpeedControl component provides controls for adjusting animation playback speed.
 *
 * Features:
 * - Slider for fine-grained speed adjustment
 * - Play/pause button for controlling animation state
 * - Preset buttons for quickly selecting common speeds
 * - Expandable/collapsible UI in compact mode
 *
 * @param {SpeedControlProps} props - Component props
 * @returns {JSX.Element} The rendered SpeedControl component
 */
export function SpeedControl({
  onSpeedChange,
  onPlayPause,
  compact = false,
}: SpeedControlProps) {
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Common playback speed presets
  const speedPresets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  /**
   * Handles changes to the speed slider value
   *
   * @param {number} newSpeed - The new speed value from slider component
   */
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    onSpeedChange?.(newSpeed);
  };

  /**
   * Toggles between play and pause states
   */
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    onPlayPause?.(!isPlaying);
  };

  /**
   * Handles selection of a speed preset button
   *
   * @param {number} preset - The selected preset speed value
   */
  const handlePresetClick = (preset: number) => {
    setSpeed(preset);
    onSpeedChange?.(preset);
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="speed-slider" className="text-sm font-medium">
          Animation Speed:{" "}
          <span className="font-bold">{speed.toFixed(2)}x</span>
        </Label>
        {compact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        )}
      </div>

      {isExpanded && (
        <>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Slider
              id="speed-slider"
              defaultValue={1}
              value={speed}
              min={0.25}
              max={2}
              step={0.05}
              onValueChange={handleSpeedChange}
              className="flex-1"
              marks={speedPresets.map((preset) => ({
                value: preset,
                label: preset === 1 ? "Normal" : `${preset}x`,
              }))}
            />
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {speedPresets.map((preset) => (
              <Button
                key={preset}
                variant={speed === preset ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetClick(preset)}
                className="h-7 px-2 text-xs"
              >
                {preset === 1 ? "Normal" : `${preset}x`}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
