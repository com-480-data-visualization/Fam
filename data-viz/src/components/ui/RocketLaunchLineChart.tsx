import { useState } from "react";

interface LaunchDataPoint {
  year: number;
  count: number;
  successRate?: number;
}

interface TooltipData {
  x: number;
  y: number;
  year: number;
  count: number;
  successRate?: number;
}

interface RocketLaunchLineChartProps {
  data: LaunchDataPoint[];
}

export default function RocketLaunchLineChart({
  data,
}: RocketLaunchLineChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  if (data.length === 0) return null;

  const width = 700;
  const height = 400;
  const padding = 50;

  const years = data.map((d) => d.year);
  const counts = data.map((d) => d.count);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const maxCount = Math.max(...counts);

  const points = data.map((d) => {
    const x =
      padding +
      ((d.year - minYear) / (maxYear - minYear || 1)) * (width - padding * 2);
    const y = height - padding - (d.count / maxCount) * (height - padding * 2);
    return {
      x,
      y,
      year: d.year,
      count: d.count,
      successRate: d.successRate,
    };
  });

  // Sort points by x for gradient stops alignment
  const sortedPointsByX = [...points].sort((a, b) => a.x - b.x);

  // Create a color scale based on success rate
  const getPointColor = (successRate: number | undefined) => {
    if (successRate === undefined) return "#3b82f6"; // Default blue
    if (successRate >= 90) return "#10b981"; // Green for high success
    if (successRate >= 75) return "#f59e0b"; // Amber for medium success
    return "#ef4444"; // Red for low success
  };

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(" ");

  // Compute dynamic y-axis ticks based on data range
  const desiredYTicks = 5;
  function getYTicks(maxValue: number, tickCount: number): number[] {
    const rawStep = maxValue / tickCount;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const residual = rawStep / magnitude;
    let niceStep: number;
    if (residual < 1.5) niceStep = 1 * magnitude;
    else if (residual < 3) niceStep = 2 * magnitude;
    else if (residual < 7) niceStep = 5 * magnitude;
    else niceStep = 10 * magnitude;
    const ticks: number[] = [];
    for (let val = 0; val <= maxValue; val += niceStep) {
      ticks.push(Math.round(val));
    }
    if (ticks[ticks.length - 1] < maxValue) {
      ticks.push(maxValue);
    }
    return ticks;
  }
  const yTicks = getYTicks(maxCount, desiredYTicks);

  const handleMouseOver = (point: (typeof points)[0]) => {
    setTooltip({
      x: point.x,
      y: point.y,
      year: point.year,
      count: point.count,
      successRate: point.successRate,
    });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h4 className="text-base text-left pl-10 text-lg font-semibold">
        Launches Over Time
      </h4>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mt-[-40px]"
      >
        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={padding}
          y2={padding}
          stroke="#ffffff"
          strokeWidth={2}
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* Y-axis ticks */}
        {yTicks.map((yVal, i) => {
          const y =
            height - padding - (yVal / maxCount) * (height - padding * 2);
          return (
            <g key={`y-${i}`}>
              <line
                x1={padding - 5}
                y1={y}
                x2={padding}
                y2={y}
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text
                x={padding - 10}
                y={y + 5}
                fontSize="14"
                fill="#ffffff"
                textAnchor="end"
              >
                {yVal}
              </text>
            </g>
          );
        })}

        {/* X-axis ticks */}
        {Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
          const year = minYear + i;
          const x =
            padding +
            ((year - minYear) / (maxYear - minYear || 1)) *
              (width - padding * 2);

          const show = maxYear - minYear > 10 ? year % 5 === 0 : true;

          return show ? (
            <g key={`x-${year}`}>
              <line
                x1={x}
                y1={height - padding}
                x2={x}
                y2={height - padding + 6}
                stroke="#ffffff"
              />
              <text
                x={x}
                y={height - padding + 20}
                fontSize="14"
                fill="#ffffff"
                textAnchor="middle"
              >
                {year}
              </text>
            </g>
          ) : null;
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id="lineGradient"
            gradientUnits="userSpaceOnUse"
            x1={padding}
            x2={width - padding}
            y1="0"
            y2="0"
          >
            {sortedPointsByX.map((p, i) => (
              <stop
                key={i}
                offset={`${((p.x - padding) / (width - padding * 2)) * 100}%`}
                stopColor={getPointColor(p.successRate)}
              />
            ))}
          </linearGradient>
        </defs>

        {/* Line path */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth={3}
        />

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={getPointColor(p.successRate)}
            stroke="#ffffff"
            strokeWidth={1}
            onMouseEnter={() => handleMouseOver(p)}
            onMouseLeave={handleMouseOut}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x + 10}
              y={tooltip.y - 60}
              width={120}
              height={50}
              rx={4}
              ry={4}
              fill="#1f2937" // Dark background
              opacity={0.9}
            />
            <text
              x={tooltip.x + 20}
              y={tooltip.y - 40}
              fontSize="12"
              fill="#ffffff"
            >
              Year: {tooltip.year}
            </text>
            <text
              x={tooltip.x + 20}
              y={tooltip.y - 25}
              fontSize="12"
              fill="#ffffff"
            >
              Launches: {tooltip.count}
            </text>
            {tooltip.successRate !== undefined && (
              <text
                x={tooltip.x + 20}
                y={tooltip.y - 10}
                fontSize="12"
                fill="#ffffff"
              >
                Success: {tooltip.successRate.toFixed(0)}%
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
