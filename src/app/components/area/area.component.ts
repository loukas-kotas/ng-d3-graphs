import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { GraphOptions } from '../shared/models/graph-options.interface';
import { ScaleTime, ScaleOrdinal } from 'd3';

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

  constructor() { }

  ngOnInit() {

    this.formatLabels();
    this.labelsAndData = this.combineLabelsDataToOne(this.labels, this.data);
    this.render();
    // this.demo();
  }

  private formatLabels() {
    this.labels = this.labels.map(d => new Date(d));
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

      const svg = d3
      .select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const xRange = this.getRange(width, padding);

    const scale: ScaleOrdinal<any, any> = d3
      .scaleOrdinal()
      .domain(this.labels)
      .range(xRange);

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

  private render() {

    const margin = { top: 20, right: 30, bottom: 50, left: 20 };
    const height = 500;
    const width = 800;

    const svg = d3
      .select('#area')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .classed('svg-content', true)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const xDomain = this.getXdomain();
    const x: ScaleTime<any, any> = d3
    .scaleUtc()
    .domain(xDomain)
    .range([margin.left, width - margin.right]);

    const xAxis = g => g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

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

  private getXdomain(): Date[] {
    const domainExtent = d3.extent(this.labels) as any[];
    return domainExtent.map(d => new Date(d));
  }


}