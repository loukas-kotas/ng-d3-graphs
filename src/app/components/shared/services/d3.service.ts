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

  // =============
}
