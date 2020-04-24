import {Injectable} from '@angular/core';
import * as d3 from 'd3';
import {ViewBox} from '../models/viewbox.interface';

export enum AxisDirection {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}
@Injectable({providedIn: 'root'})
export class D3Service {
  constructor() {}

  translate(x: number, y: number): string {
    return `translate(${x}, ${y})`;
  }

  factoryAxis(scale: any, direction: AxisDirection): any {
    switch (direction) {
      case AxisDirection.top:
        return d3.axisTop(scale);
      case AxisDirection.right:
        return d3.axisRight(scale);
      case AxisDirection.bottom:
        return d3.axisBottom(scale);
      case AxisDirection.left:
        return d3.axisLeft(scale);
      default:
        return new Error('No axis Direction Provided');
    }
  }

  factoryLine(): any {
    return d3.line<any>().x((d) => d.x).y((d) => d.y);
  }

  // ==== Axis =====
  scaleLinearX(labels: any[], width: number) {
    return d3.scaleLinear()
        .domain(d3.extent(labels))  // does the magic for adjustable axis
        .range([0, width]);
  }

  scaleLinearY(data: any[], height: number) {
    return d3.scaleLinear()
        .domain(d3.extent(data))  // does the magic for adjustable axis
        .range([height, 0]);
  }

  scaleBandX(labels: any[], width: number) {
    return d3.scaleBand().domain(labels).rangeRound([0, width]).padding(0.1);
  }

  scaleLinearYRangeRound(data: any[], height: number) {
    return d3.scaleLinear().domain([0, Math.max(...data)]).rangeRound([
      height, 0
    ]);
  }

  addLabelAxisY(
      svg: d3.Selection<SVGGElement, unknown, null, undefined>, height: number,
      options: any) {
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - options.margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(options.yAxisLabel);
  }

  addLabelAxisX(
      svg: d3.Selection<SVGGElement, unknown, null, undefined>, width: number,
      height: number, options: any) {
    svg.append('text')
        .attr(
            'transform',
            'translate(' + width / 2 + ' ,' + (height + options.margin.top) +
                ')')
        .style('text-anchor', 'middle')
        .text(options.xAxisLabel);
  }

  getViewBoxDefault(options: any): ViewBox {
    const res = {
      minX: -options.margin.left,
      minY: -25,
      width: options.width,
      height: options.height - options.margin.top,
    };

    return res;
  }

  removeAxisTicks(axis: d3.Selection<SVGGElement, unknown, null, undefined>) {
    axis.selectAll('.tick').selectAll('line').remove();
  }

  changeAxisColor(
      axis: d3.Selection<SVGGElement, unknown, null, undefined>, config: any) {
    axis.select('path')
        .attr('color', config.color)
        .attr('opacity', config.opacity)
        .attr('rendering', config.rendering)
        .attr('stroke-width', config.strokeWidth);
  }

  getXaxisTime(
      svg: d3.Selection<SVGGElement, unknown, null, undefined>, height: number,
      x: d3.ScaleTime<number, number>, timeFormat: string, xAxisTicks: number) {
    return svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
                  .tickFormat(d3.timeFormat(timeFormat))
                  .ticks(xAxisTicks));
  }

  hideTooltip(tooltipText: any, tooltip: any) {
    tooltipText.selectAll('tspan').remove();
    tooltip.attr('visibility', 'hidden');
  }

  showTooltip(
      d: any, xScale: any, yScale: any, tooltip: any, tooltipRect: any,
      tooltipText: any, formatTime: any) {
    const xPos = xScale(d.x) - 150 / 2;
    const yPos = yScale(d.y) + 10;
    tooltip.attr('transform', `translate(${xPos}, ${yPos})`)
        .attr('is', true)
        .attr('visibility', 'visible');
    tooltipRect.attr('opacity', 0.7);
    tooltipText.attr('tranform', 'translate(75,30)')
        .attr('fill', 'white')
        .attr('font-size', 10)
        .attr('font-family', `'Roboto', 'sans-serif'`);
    tooltipText.append('tspan')
        .attr('text-anchor', 'middle')
        .attr('is', true)
        .attr('x', 25)
        .attr('y', -5)
        .text(`${formatTime(d.x)}`);
    tooltipText.append('tspan')
        .attr('text-anchor', 'middle')
        .attr('is', true)
        .attr('x', 20)
        .attr('dy', 15)
        .text(`${d.y}`);
  }

  addTooltip(container) {
    const tooltipConfig = {
      width: 100,
      height: 40,
      fill: '#333',
      opacity: 0.7,
      rx: 15,
      text: {
        translateX: 10,
        translateY: 20,
      },
    };
    const tooltip =
        d3.select(container.nativeElement).select('svg').append('g');
    const tooltipRect = tooltip.append('rect')
                            .attr('width', tooltipConfig.width)
                            .attr('height', tooltipConfig.height)
                            .attr('fill', tooltipConfig.fill)
                            .attr('opacity', 0)
                            .attr('rx', tooltipConfig.rx);
    const tooltipText = tooltip.append('text').attr('transform', `translate(
          ${tooltipConfig.text.translateX},
          ${tooltipConfig.text.translateY})`);
    return {tooltip, tooltipRect, tooltipText, tooltipConfig};
  }



  // =============
}
