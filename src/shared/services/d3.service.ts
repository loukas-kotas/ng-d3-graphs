import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { AxisDirection } from 'src/app/line/services/line.service';
@Injectable({
  providedIn: 'root'
})
export class D3Service {

  constructor() { }

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
    return d3.line<any>()
    .x((d) => d.x)
    .y((d) => d.y);
  }


  // ==== Axis =====
  scaleLinearX(labels: any[], width: number) {
    return d3.scaleLinear()
    .domain(d3.extent(labels)) // does the magic for adjustable axis
    .range([0, width]);

  }

  scaleLinearY(data: any[], height: number) {
    return d3.scaleLinear()
    .domain(d3.extent(data)) // does the magic for adjustable axis
    .range([height, 0]);
  }

  scaleBandX(labels: any[], width: number) {
    return d3.scaleBand()
    .domain(labels)
    .rangeRound([0, width])
    .padding(0.1);
  }

  scaleLinearYRangeRound(data: any[], height: number ) {
    return d3.scaleLinear()
    .domain([0, Math.max(...data)])
    .rangeRound([height, 0]);
  }


  // =============




}
