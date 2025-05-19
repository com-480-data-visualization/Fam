import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DonutChartProps {
  success: number;
  failure: number;
  size?: number;
  strokeWidth?: number;
}

const SuccessFailureDonut: React.FC<DonutChartProps> = ({
  success,
  failure,
  size = 80,
  strokeWidth = 12,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const total = success + failure;

  const radius = size / 2;
  const innerRadius = radius - strokeWidth;

  const successPercent = total > 0 ? Math.round((success / total) * 100) : 0;

  useEffect(() => {
    if (total === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("g").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${(size * 1.5) / 2}, ${(size * 1.5) / 2})`);

    const pie = d3
      .pie<number>()
      .sort(null)
      .value((d) => d);

    const arc = d3
      .arc<d3.PieArcDatum<number>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    // Animate arcs for success and failure
    const arcs = pie([0, 1]);
    const finalArcs = pie([success, failure]);

    const successPath = g
      .append("path")
      .attr("d", arc(arcs[0]) || "")
      .attr("fill", "#10b981");

    const failurePath = g
      .append("path")
      .attr("d", arc(arcs[1]) || "")
      .attr("fill", "#ef4444");

    successPath
      .transition()
      .duration(800)
      .attrTween("d", () => {
        const interpolate = d3.interpolate(arcs[0], finalArcs[0]);
        return (t) => arc(interpolate(t)) || "";
      });

    failurePath
      .transition()
      .duration(800)
      .attrTween("d", () => {
        const interpolate = d3.interpolate(arcs[1], finalArcs[1]);
        return (t) => arc(interpolate(t)) || "";
      });
  }, [success, failure, size, innerRadius, radius]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Launch count above donut */}
      <div className="mb-1 flex flex-col items-center">
        <span className="font-medium text-base">{total} Launches</span>
      </div>
      {/* Donut chart with success rate in center */}
      <div className="relative flex items-center justify-center">
        <svg
          ref={svgRef}
          width={size * 1.5}
          height={size * 1.5}
          viewBox={`0 0 ${size * 1.5} ${size * 1.5}`}
          style={{ overflow: "visible" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-bold text-lg text-white leading-tight">
            {successPercent}%
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-1 tracking-wide">
            Success
          </span>
        </div>
      </div>
    </div>
  );
};

export default SuccessFailureDonut;
