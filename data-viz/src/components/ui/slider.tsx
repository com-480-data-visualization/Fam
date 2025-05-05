/**
 * Slider component using Material UI Slider.
 *
 * @module components/ui/slider
 */

import { SyntheticEvent } from "react";
import { Slider as MUISlider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { cn } from "@/lib/utils";

/**
 * Interface for mark objects used in the Slider component
 */
export interface SliderMark {
  value: number;
  label?: string;
}

/**
 * Extended props for the Slider component
 */
interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  marks?: SliderMark[];
  showMarkLabels?: boolean;
  onValueChange?: (value: number) => void;
  onChange?: (event: Event, value: number | number[]) => void;
  onChangeCommitted?: (
    event: SyntheticEvent | Event,
    value: number | number[]
  ) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  id?: string;
}

// Styled MUI Slider to match our design system
const StyledSlider = styled(MUISlider)(() => ({
  color: "var(--primary)",
  height: 6,
  padding: "15px 0",
  "& .MuiSlider-track": {
    border: "none",
    height: 6,
    backgroundColor: "var(--primary)",
  },
  "& .MuiSlider-thumb": {
    height: 16,
    width: 16,
    backgroundColor: "var(--background)",
    border: "2px solid var(--primary)",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0 0 0 4px var(--ring)",
    },
  },
  "& .MuiSlider-rail": {
    color: "var(--border)",
    opacity: 1,
    height: 6,
  },
  "& .MuiSlider-markLabel": {
    color: "var(--muted-foreground)",
    fontSize: "0.75rem",
    marginTop: 7,
  },
  "& .MuiSlider-mark": {
    display: "none",
  },
  "& .MuiSlider-markActive": {
    display: "none",
  },
}));

/**
 * Slider component for selecting numeric values within a range.
 * Used throughout the application for timeline navigation and value selection.
 *
 * @param props - Slider component props
 * @returns JSX element containing the styled slider
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  marks = [],
  showMarkLabels = false,
  onValueChange,
  onChange,
  onChangeCommitted,
  disabled = false,
  "aria-label": ariaLabel,
  id,
}: SliderProps) {
  const muiMarks = marks.map((mark) => ({
    value: mark.value,
    label: showMarkLabels ? mark.label : undefined,
  }));

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (onChange) {
      onChange(event, newValue);
    }

    if (onValueChange && typeof newValue === "number") {
      onValueChange(newValue);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <StyledSlider
        id={id}
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        step={step}
        marks={muiMarks}
        onChange={handleChange}
        onChangeCommitted={onChangeCommitted}
        disabled={disabled}
        aria-label={ariaLabel}
        valueLabelDisplay="off"
      />
    </div>
  );
}

export { Slider };
