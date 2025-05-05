/**
 * Timeline view mode toggle component.
 *
 * This component allows users to switch between month and year view modes
 * in the timeline visualization.
 *
 * @module components/ui/timeline-toggle
 */

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { useTimeline, type TimelineViewMode } from "@/contexts/TimelineContext";

/**
 * Props for TimelineToggle component
 */
interface TimelineToggleProps {
  /** Optional callback to be called when the view mode changes */
  onValueChange?: (value: string) => void;
}

/**
 * A toggle component that lets users switch between month and year timeline views.
 * Reflects and updates the current view mode in the TimelineContext.
 *
 * @param {TimelineToggleProps} props - Component props
 * @returns {JSX.Element} The timeline toggle component
 */
export function TimelineToggle({ onValueChange }: TimelineToggleProps) {
  // Get current view mode from context
  const { viewMode, setViewMode } = useTimeline();

  const handleValueChange = (newValue: string) => {
    if (newValue) {
      // Only accept valid view modes
      const validViewMode = newValue as TimelineViewMode;
      setViewMode(validViewMode);
      onValueChange?.(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label
        htmlFor="timeline-view"
        className="text-xs sm:text-sm whitespace-nowrap"
      >
        View:
      </Label>
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={handleValueChange}
        id="timeline-view"
        className="h-6 justify-start border rounded-md flex items-center"
        size="sm"
      >
        <ToggleGroupItem
          value="year"
          className="px-3 text-xs sm:text-sm h-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex items-center justify-center"
        >
          Year
        </ToggleGroupItem>
        <ToggleGroupItem
          value="month"
          className="px-3 text-xs sm:text-sm h-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex items-center justify-center"
        >
          Month
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
