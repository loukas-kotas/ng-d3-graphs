import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { CircleData, LineD3 } from '../line.component';
import { GraphOptions } from 'src/shared/models/graph-options.interface';
import { D3Service } from 'src/shared/services/d3.service';

export enum AxisDirection { top = 'top', right = 'right', bottom = 'bottom', left = 'left' }
export type DataType = { x: any, y: any };
@Injectable()
export class LineService {

  constructor(
    private d3Service: D3Service,
  ) { }

  factoryLineGraph(xAxisLabels: string[], data: any[], options: GraphOptions): LineD3 {
    const graph: LineD3 = {
      xAxis: [],
      yAxis: [],
      path: '',
      circleData: []
    };

    const xScale = this.scaleLinearX(xAxisLabels.length, options.width, data);
    const yScale = this.scaleLinearY(data.length, options.height, data);

    graph.path = this.factoryPath(xScale, yScale);
    graph.circleData = this.factoryCircleData(data, xScale, yScale);

    // TODO: make it own function
    for (let index = 0; index < xAxisLabels.length; index++) {
      graph.xAxis.push({ x: xScale(index), label: xAxisLabels[index] });
    }

    // TODO: make it own function
    for (let index = 0; index < data.length; index++) {
      graph.yAxis.push({ y: yScale(data[index]), label: data[index] });
    }

    return graph;

  }

  /**
   *
   * @param N
   * @param width
   */
  scaleLinearX(N: number, width: number, data: any[]): any {


    return d3
      .scaleLinear()
      .domain([0, N - 1])
      .range([0, width]);
  }

  /**
   *
   * @param height
   */
  scaleLinearY(N: number, height: number, data: any[]): any {
    return d3
      .scaleLinear()
      .domain([Math.min(...data), Math.max(...data)])
      .range([height, 0]);
  }

  /**
   *
   * @param margin
   * returns width, height according to margin provided
   */
  getDim(margin): any {
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;
    return { width, height };
  }

  factoryAxis(scale: any, direction: AxisDirection, data: CircleData[]): any {
    return this.d3Service.factoryAxis(scale, direction);
  }

  /**
   *
   * @param xScale
   * @param yScale
   * generates line
   */
  factoryPath(xScale: any, yScale: any): any {
    return d3.line<DataType>()
      .x((d, i) => { return xScale(i); })
      .y((d) => { return yScale(d.y); })
      .curve(d3.curveMonotoneX);
  }

  factoryCircleData(data: any[], xScale: any, yScale: any): any[] {
    const circleData = [];

    for (let index = 0; index < data.length; index++) {
      circleData.push({
        cx: xScale(index),
        cy: yScale(data[index]),
        r: 5
      });
    }
    return circleData;
  }


}
