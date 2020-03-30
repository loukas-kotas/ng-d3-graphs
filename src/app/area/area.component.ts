import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { D3Service } from 'src/shared/services/d3.service';
import { GraphOptions } from 'src/shared/models/graph-options.interface';
import { ScaleOrdinal, ScaleLinear } from 'd3';

interface LabelsAndData {
  x: any;
  y: any;
}
@Component({
  selector: 'ng-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() labels: any[] = [];
  @Input() options: GraphOptions = { width: 300, height: 300 };
  formatx = d3.timeFormat('%Y-%m-%d %H:%M:%S');
  // labelsAndData: labelsAndData[] = [];
  labelsAndData: LabelsAndData[] = [];

  constructor(private d3Service: D3Service) { }

  ngOnInit() {
    this.labelsAndData = this.combineLabelsDataToOne(this.labels, this.data);
    this.initGraph();
    // this.demo();
  }

  private combineLabelsDataToOne(labels, data): any[] {
    const N = data.length;
    const labelsAndData = [];
    for (let index = 0; index < N; index++) {
      labelsAndData.push({ x: labels[index], y: data[index] });
    }
    return labelsAndData;
  }

  private demo() {
    const width = 500,
      height = 500,
      padding = { left: 20, right: 20 };
    const data = ['tang', 'song', 'yuan', 'ming', 'qing'];
    const axis_length = width - padding.left - padding.right;
    //d3.scaleImplicit = 200;
    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const xRange = this.getRange(width, padding);

    console.log(xRange);

    const scale: ScaleOrdinal<any, any> = d3
      .scaleOrdinal()
      .domain(this.labels)
      .range(xRange);

    //	.unknown(500);
    console.log(scale('ceshi'));
    const axis = d3.axisBottom(scale).ticks(5);

    svg
      .append('g')
      .call(axis)
      .attr(
        'transform',
        'translate(' + padding.left + ',' + (height - 100) + ')'
      )
      .selectAll('text')
      .attr('y', 0)
      .attr('x', 9)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(45)translate(-3, 10)')
      .style('text-anchor', 'start');
  }

  private getRange(width: number, padding: { left: number; right: number }) {
    const xStep = width / this.labels.length;
    const xRange = [];
    for (let index = 0; index < width - padding.left; index++) {
      const xRangePoint = index * xStep;
      xRange.push(xRangePoint);
    }
    return xRange;
  }

  private initGraph() {
    // let margin = { top: 20, right: 20, bottom: 30, left: 50 }, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
    const margin = { top: 20, right: 30, bottom: 50, left: 20 },
      height = 500,
      width = 800;

    const svg = d3
      .select('#area')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    // x, axis-x
    const xRange = [margin.left];
    const xFactor = width / this.labels.length;
    for (let index = 1; index < this.labels.length; index++) {
      const factor = xFactor * index + margin.left;
      xRange.push(factor);
    }

    const x: ScaleOrdinal<any, any> = d3
      .scaleOrdinal()
      .domain(this.labels)
      .range(xRange);

    const xAxis = g =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(width / this.labels.length)
            .tickSizeOuter(0)
        )
        .selectAll('text')
        .attr('y', 0)
        .attr('x', 9)
        .attr('dy', '.35em')
        .attr('transform', 'rotate(45)translate(-3, 10)')
        .style('text-anchor', 'start');

    svg.append('g').call(xAxis);

    // y, y-axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yAxis = g =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select('.domain').remove())
        .call(g =>
          g
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text(this.data)
        );

    svg.append('g')
    .call(yAxis);

    // area
    const curve: any = d3.curveLinear;
    const area = d3.area<LabelsAndData>()
    .curve(curve)
    .x(d => x(d.x))
    .y0(y(0))
    .y1(d => y(d.y));

    svg.append('path')
    .datum(this.labelsAndData)
    .attr('fill', 'steelblue')
    .attr('d', area);


  }

}
