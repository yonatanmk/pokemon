import { useRef, useEffect } from "react";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from "d3";
import { IBarChartData } from '../../interfaces';
import styles from './BarChart.module.scss';

export type IBarChartProps = {
  data: IBarChartData[];
  height: number;
  width: number;
}

const DEFAULT_MAX_STAT = 200;

function BarChart({ data, height, width } : IBarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const maxStat = data.reduce((acc, datum) => {
    return datum.value > acc ? datum.value : acc;
  }, DEFAULT_MAX_STAT)

  useEffect(() => {
    const svg = select(svgRef.current);

    const xScale = scaleBand()
      .domain(data.map((value, index) => index.toString()))
      .range([0, width])
      .padding(0.1);

    const yScale = scaleLinear()
      .domain([0, maxStat])
      .range([height, 0]);

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((_, index) => data[index].label);

    svg
      .select("#x-axis")
      .style("transform", `translateY(${height}px)`)
      .style("font-size", '16px')
      .call(xAxis as any);

    const yAxis = axisLeft(yScale);
    svg
      .select("#y-axis")
      .style("font-size", '16px')
      .call(yAxis as any);

    svg.selectAll('g.tick');

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (_, index) => xScale(index.toString()) as any)
      .attr("y", -height)
      .attr("width", xScale.bandwidth())
      .transition()
      .attr("fill","#0072BD")
      .attr("height", (value) => height - yScale(value.value));
  }, [data]);

  return (
    <div className={styles.BarChart__Container} style={{ height: `${height + 50}px`, width: `${width + 50}px` }}>
      <svg className={styles.BarChart} ref={svgRef} style={{ height: `${height}px`, width: `${width}px` }}>
        <g id="x-axis" />
        <g id="y-axis" />
      </svg>
    </div>
  );
}

export default BarChart;
