/**
 * Launch count chart component for the world map visualization.
 * Displays the number of launches per year as a line chart.
 *
 * @module components/ui/world-map/charts/launch-count-chart
 */

import { useEffect, RefObject } from "react";
import * as d3 from "d3";
import { YearlyLaunchData } from "../statistics/yearly-launch-data";

interface LaunchCountChartProps {
  yearlyData: YearlyLaunchData[];
  currentYear: number;
  chartRef: RefObject<SVGSVGElement | null>;
  showChart: boolean;
}

/**
 * Function that renders a chart showing the number of launches per year on the world map.
 *
 * @param {LaunchCountChartProps} props - Component props
 * @returns null
 */
export function LaunchCountChart({
  yearlyData,
  currentYear,
  chartRef,
  showChart,
}: LaunchCountChartProps) {
  useEffect(() => {
    if (!yearlyData.length || !chartRef.current || !showChart) return;

    const margin = { top: 20, right: 25, bottom: 25, left: 40 };
    const chartWidth = 220 - margin.left - margin.right;
    const chartHeight = 130 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const chartG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([d3.min(yearlyData, (d) => d.year) || 1957, currentYear])
      .range([0, chartWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(yearlyData, (d) => d.count) || 0])
      .range([chartHeight, 0])
      .nice();

    chartG
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(4)
          .tickFormat((d) => `${d}`)
      )
      .selectAll("text")
      .style("font-size", "9px");

    chartG
      .append("g")
      .call(d3.axisLeft(y).ticks(3))
      .selectAll("text")
      .style("font-size", "9px");

    const line = d3
      .line<YearlyLaunchData>()
      .defined((d) => !isNaN(d.count))
      .x((d) => x(d.year))
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    const filteredData = yearlyData.filter((d) => d.year <= currentYear);

    chartG
      .append("path")
      .datum(filteredData)
      .attr("fill", "rgba(59, 130, 246, 0.1)")
      .attr(
        "d",
        d3
          .area<YearlyLaunchData>()
          .defined((d) => !isNaN(d.count))
          .x((d) => x(d.year))
          .y0(chartHeight)
          .y1((d) => y(d.count))
          .curve(d3.curveMonotoneX)
      );

    chartG
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "rgba(59, 130, 246, 0.8)")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    const currentYearData = yearlyData.find((d) => d.year === currentYear);
    if (currentYearData) {
      chartG
        .append("circle")
        .attr("cx", x(currentYear))
        .attr("cy", y(currentYearData.count))
        .attr("r", 4)
        .attr("fill", "rgba(59, 130, 246, 1)");

      chartG
        .append("text")
        .attr("x", x(currentYear))
        .attr("y", y(currentYearData.count) - 7)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "var(--foreground)")
        .text(currentYearData.count);
    }

    chartG
      .append("text")
      .attr("x", 0)
      .attr("y", -5)
      .attr("font-size", "11px")
      .attr("fill", "var(--foreground)")
      .attr("font-weight", "500")
      .text("Annual Launches");
  }, [yearlyData, currentYear, showChart, chartRef]);

  return null;
}
