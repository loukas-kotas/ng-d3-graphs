import { Injectable } from '@angular/core';
import { BarD3, Rectangle } from './bar.component';
import { Axis } from 'src/shared/models/axis.interface';
import { AxisDirection } from '../line/services/line.service';
import { D3Service } from 'src/shared/services/d3.service';
import * as d3 from 'd3';
import { GraphOptions } from 'src/shared/models/graph-options.interface';

@Injectable()
export class BarService {

  constructor(
    private d3Service: D3Service,
  ) { }

  factoryBarGraph(data: any[], labels: any[], options: GraphOptions): BarD3 {
    const graph: BarD3 = {
      xAxis: [],
      yAxis: [],
      xAxisPath : '',
      yAxisPath: '',
      rectanglesData: [],
    };

    const xScale = this.scaleX(labels, options.width);
    const yScale = this.scaleY(data, options.height);

    for (let index = 0; index < labels.length; index++) {
      graph.xAxis.push({ x: xScale(labels[index]) , label: labels[index] });
    }

    // TODO: make it own function
    for (let index = 0; index < data.length; index++) {
      graph.yAxis.push({ y: yScale(data[index]), label: data[index] });
    }

    graph.xAxisPath = this.factoryAxisX(xScale, labels);
    graph.yAxisPath = this.factoryAxisY(yScale, data);

    graph.rectanglesData = this.factoryRectangleData(options.width, options.height, labels, data, xScale, yScale);

    return graph;
  }

  factoryAxis(scale: any,  direction: AxisDirection): Axis {
    return this.d3Service.factoryAxis(scale, direction);
  }

  factoryAxisX(xScale: any, labels: any[]): any {
    const tempAxisData = [];

    labels.forEach(label => {
      tempAxisData.push({x: xScale(label), y: 0});
    });

    const lineGen = this.factoryLine();
    return lineGen(tempAxisData);
  }

  factoryAxisY(yScale: any, data: any[]): any {
    const tempAxisData = [];

    data.forEach(item => {
      tempAxisData.push({x: 0 , y: yScale(item)});
    });

    const lineGen = this.factoryLine();
    return lineGen(tempAxisData);
  }

  factoryRectangleData(width: number, height: number, labels: any[], data: any[], xScale: any, yScale: any): Rectangle[] {

    if (labels.length !== data.length) {
      throw new Error('Labels length is not equivalent with data length');
    }

    const rectangles = [];

    const x = this.d3Service.scaleBandX(labels, width);
    const y = this.scaleLinearYRangeRound(data, height);
    const bandwidth = x.bandwidth();

    for (let index = 0; index < data.length; index++) {
      rectangles.push({
        x: x(labels[index]),
        y: y(data[index]),
        height: (height - y(data[index])),
        width: bandwidth
      });
    }

    return rectangles;
  }

  scaleX(labels: any[], width: number) {
    // return this.d3Service.scaleLinearX(labels, width);
    return this.d3Service.scaleBandX(labels, width);
  }

  scaleY(data: any[], height: number) {
    // return this.d3Service.scaleLinearY(data, height);
    return this.scaleLinearYRangeRound(data, height);
  }

  scaleLinearYRangeRound(data: any[], height: number, ) {
    return this.d3Service.scaleLinearYRangeRound(data, height);
  }

  factoryLine(): any {
    return this.d3Service.factoryLine();
  }

  bandwidth(labels: any[], width: number): number {
    const x = this.d3Service.scaleBandX(labels, width);
    const bandwidth = x.bandwidth();
    return bandwidth;
  }

}
