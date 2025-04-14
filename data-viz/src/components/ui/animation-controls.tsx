import { Button } from "./button";
import { Slider } from "./slider";
import { Play, Pause, SkipBack } from "lucide-react";

interface AnimationControlsProps {
  currentTimeValue: number;
  minTimeValue: number;
  maxTimeValue: number;
  isPlaying: boolean;
  isLoading: boolean;
  formattedTime: string;
  onTimeChange: (timeValue: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
}

export function AnimationControls({
  currentTimeValue,
  minTimeValue,
  maxTimeValue,
  isPlaying,
  isLoading,
  formattedTime,
  onTimeChange,
  onPlayPause,
  onReset,
}: AnimationControlsProps) {
  const handleSliderChange = (value: number[]) => {
    const newTimeValue = value[0];
    onTimeChange(newTimeValue);
  };

  return (
    <div className="flex flex-col w-full items-center gap-1">
      <div className="flex w-full justify-center my-3">
        <div className="flex items-center w-48 justify-start mr-4">
          <Button onClick={onReset} variant="outline" className="mr-2">
            <SkipBack className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={onPlayPause}
            variant="default"
            disabled={isLoading}
            className="w-24"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Play
              </>
            )}
          </Button>
        </div>

        <div className="w-32 text-center">
          <span className="text-xl font-semibold whitespace-nowrap">
            {formattedTime}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <Slider
          value={[currentTimeValue]}
          onValueChange={handleSliderChange}
          min={minTimeValue}
          max={maxTimeValue}
          step={1}
          className="w-[90%] md:w-[70%] lg:w-[50%]"
        />
      </div>
    </div>
  );
}
