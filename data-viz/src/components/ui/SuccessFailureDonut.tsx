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
    // Skip rendering if no data or no DOM element
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

    // Outer arc for label positioning
    const outerArc = d3
      .arc<d3.PieArcDatum<number>>()
      .innerRadius(radius * 1.4)
      .outerRadius(radius * 1.4);

    // Create the arc paths with animated transition
    const arcs = pie([0, 1]); // Start with dummy data

    // Create paths for success and failure
    const successPath = g
      .append("path")
      .attr("d", arc(arcs[0]) || "")
      .attr("fill", "#10b981"); // green for success

    const failurePath = g
      .append("path")
      .attr("d", arc(arcs[1]) || "")
      .attr("fill", "#ef4444"); // red for failure

    // Animate to actual data
    const finalArcs = pie([success, failure]);

    successPath
      .transition()
      .duration(800)
      .attrTween("d", () => {
        const interpolate = d3.interpolate(arcs[0], finalArcs[0]);
        return (t) => arc(interpolate(t)) || "";
      })
      .on("end", function () {
        // Add polyline and label after the animation completes
        if (success > 0) {
          const arcData = finalArcs[0];
          const midangle =
            arcData.startAngle + (arcData.endAngle - arcData.startAngle) / 2;

          const posA = arc.centroid(arcData);
          const posB = outerArc.centroid(arcData);
          const posC = [...posB];

          // Adjust position based on chart size
          const labelOffset = 1.5;
          posC[0] = radius * labelOffset * (midangle < Math.PI ? 1 : -1);

          // Add polyline with increased visibility
          g.append("polyline")
            .attr(
              "points",
              `${posA[0]},${posA[1]} ${posB[0]},${posB[1]} ${posC[0]},${posC[1]}`
            )
            .attr("stroke", "#10b981")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style("opacity", 1);

          // Add success percentage label with improved visibility
          g.append("text")
            .attr("transform", `translate(${posC[0]}, ${posC[1]})`)
            .attr("text-anchor", midangle < Math.PI ? "start" : "end")
            .attr("dominant-baseline", "middle")
            .attr("font-size", `${Math.max(size / 8, 10)}px`)
            .attr("fill", "#10b981")
            .attr("font-weight", "bold")
            .style("opacity", 1)
            .text(`${successPercent}% success`);
        }
      });

    failurePath
      .transition()
      .duration(800)
      .attrTween("d", () => {
        const interpolate = d3.interpolate(arcs[1], finalArcs[1]);
        return (t) => arc(interpolate(t)) || "";
      });
  }, [success, failure, size, innerRadius, radius, successPercent]);

  const paddingRight = 20;

  return (
    <div
      className={`relative flex items-center justify-center pr-${paddingRight}`}
    >
      <svg
        ref={svgRef}
        width={size * 1.5}
        height={size * 1.5}
        viewBox={`0 0 ${size * 1.5} ${size * 1.5}`}
        style={{ overflow: "visible" }}
      />
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-xs pr-${paddingRight}`}
      >
        <span className="font-medium">{total}</span>
        <span className="text-muted-foreground">Launches</span>
      </div>
    </div>
  );
};

export default SuccessFailureDonut;
