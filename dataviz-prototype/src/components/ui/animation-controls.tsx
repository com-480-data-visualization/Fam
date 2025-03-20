import { Button } from "./button";
import { Slider } from "./slider";
import { Play, Pause, SkipBack } from "lucide-react";

interface AnimationControlsProps {
  currentYear: number;
  minYear: number;
  maxYear: number;
  isPlaying: boolean;
  isLoading: boolean;
  onYearChange: (year: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
}

export function AnimationControls({
  currentYear,
  minYear,
  maxYear,
  isPlaying,
  isLoading,
  onYearChange,
  onPlayPause,
  onReset,
}: AnimationControlsProps) {
  // handle slider value changes and update year
  const handleSliderChange = (value: number[]) => {
    const newYear = value[0];
    onYearChange(newYear);
  };

  return (
    <div className="flex flex-col w-full items-center gap-4">
      <div className="flex w-full justify-center my-4">
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

        <div className="w-24 text-center">
          <span className="text-xl font-semibold whitespace-nowrap">
            Year: {currentYear}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <Slider
          value={[currentYear]}
          onValueChange={handleSliderChange}
          min={minYear}
          max={maxYear}
          step={1}
          className="w-[30%]"
        />
      </div>
    </div>
  );
}
