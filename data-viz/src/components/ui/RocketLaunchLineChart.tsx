interface RocketLaunchLineChartProps {
  data: { year: number; count: number }[];
}

export default function RocketLaunchLineChart({ data }: RocketLaunchLineChartProps) {
  if (data.length === 0) return null;

  const width = 700;
  const height = 320;
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
    return { x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(" ");

  // Generate tick values every 5, and add maxCount if missing
  const yTicks = Array.from({ length: Math.floor(maxCount / 5) + 1 }, (_, i) => i * 5);
  if (yTicks[yTicks.length - 1] !== maxCount) {
    yTicks.push(maxCount);
  }

  return (
    <div className="w-full">
      <svg width="100%" height={height + 40} viewBox={`0 0 ${width} ${height + 40}`}>
        {/* Title */}
        <text
          x={padding}
          y={15}
          fontSize="24"
          fontWeight="600"
          fill="#ffffff"
        >
          Launches Over Time
        </text>

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
          const y = height - padding - (yVal / maxCount) * (height - padding * 2);
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
            ((year - minYear) / (maxYear - minYear || 1)) * (width - padding * 2);

          const show = (maxYear - minYear > 10) ? year % 5 === 0 : true;

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

        {/* Line path */}
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={3} />

        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
        ))}
      </svg>
    </div>
  );
}