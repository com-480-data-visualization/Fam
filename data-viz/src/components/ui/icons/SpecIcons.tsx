import React from "react";
import { MoveVertical, Flame, Weight, CircleDot, Package } from "lucide-react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const defaultIconSize: number = 16;
const defaultIconStrokeWidth: number = 2;
const defaultIconColor: string = "currentColor";

export const HeightIcon: React.FC<IconProps> = ({
  className = "",
  size = defaultIconSize,
  color = defaultIconColor,
  strokeWidth = defaultIconStrokeWidth,
}) => (
  <MoveVertical
    className={className}
    size={size}
    color={color}
    strokeWidth={strokeWidth}
    aria-label="Height Icon"
  />
);

export const ThrustIcon: React.FC<IconProps> = ({
  className = "",
  size = defaultIconSize,
  color = defaultIconColor,
  strokeWidth = defaultIconStrokeWidth,
}) => (
  <Flame
    className={className}
    size={size}
    color={color}
    strokeWidth={strokeWidth}
    aria-label="Thrust Icon"
  />
);

export const WeightIcon: React.FC<IconProps> = ({
  className = "",
  size = defaultIconSize,
  color = defaultIconColor,
  strokeWidth = defaultIconStrokeWidth,
}) => (
  <Weight
    className={className}
    size={size}
    color={color}
    strokeWidth={strokeWidth}
    aria-label="Weight Icon"
  />
);

export const DiameterIcon: React.FC<IconProps> = ({
  className = "",
  size = defaultIconSize,
  color = defaultIconColor,
  strokeWidth = defaultIconStrokeWidth,
}) => (
  <CircleDot
    className={className}
    size={size}
    color={color}
    strokeWidth={strokeWidth}
    aria-label="Diameter Icon"
  />
);

export const StagesIcon: React.FC<IconProps> = ({
  className = "",
  size = defaultIconSize,
  color = defaultIconColor,
  strokeWidth = defaultIconStrokeWidth,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Stages Icon"
  >
    {/* Top stage: y=1, height=3. Ends at y=4. */}
    <rect x="8" y="1" width="8" height="3" rx="1" />
    {/* Middle stage: y=7, height=4. Ends at y=11. */}
    <rect x="6" y="7" width="12" height="4" rx="1" />
    {/* Bottom stage: y=14, height=5. Ends at y=19. */}
    <rect x="4" y="14" width="16" height="5" rx="1" />
  </svg>
);

export const PayloadCapacityIcon: React.FC<IconProps> = ({
  className = "",
  size = defaultIconSize,
  color = defaultIconColor,
  strokeWidth = defaultIconStrokeWidth,
}) => (
  <Package
    className={className}
    size={size}
    color={color}
    strokeWidth={strokeWidth}
    aria-label="Payload Capacity Icon"
  />
);

export const getSpecIcon = (key: string): React.FC<IconProps> | null => {
  if (!key) return null;

  const iconMap: Record<string, React.FC<IconProps>> = {
    height: HeightIcon,
    thrust: ThrustIcon,
    weight: WeightIcon,
    mass: WeightIcon,
    diameter: DiameterIcon,
    stages: StagesIcon,
    payloadCapacity: PayloadCapacityIcon,
  };

  return iconMap[key] || null;
};
