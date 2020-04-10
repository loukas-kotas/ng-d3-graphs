import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import * as d3 from 'd3';
import { GraphOptions } from 'src/shared/models/graph-options.interface';

interface LabelsAndData {
  x: any;
  y: any;
}

interface xAxisData {
  id: number;
  value: any;
}

@Component({
  selector: 'ng-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineComponent implements OnInit {


  @Input() data: any[] = [];
  @Input() labels: any[] = [];
  @Input() options?: GraphOptions = { width: 879, height: 804, margin: { top: 50, right: 50, bottom: 50, left: 50 } };
  labelsAndData: LabelsAndData[] = [];
  xAxisData: xAxisData[] = [];

  constructor() { }

  ngOnInit() {
    const options = { width: this.options.width - 200, height: this.options.height - 100, margin: this.options.margin };

    this.options = { width: 879, height: 804, margin: { top: 50, right: 50, bottom: 50, left: 50 } };

    this.labelsAndData = this.combineLabelsDataToOne();
    console.log(this.labelsAndData);
    this.initGraph();
    console.log(this.labels);
    console.log(this.data);
    console.log(this.options);
  }


  private initGraph(): void {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = this.options.width - margin.left - margin.right;
    const height = this.options.height - margin.top - margin.bottom;

    const xDomain = this.getXdomain(this.labels);
    const xScale = d3.scaleUtc()
    .domain(xDomain)
    .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(this.data)])
    .nice()

    .range([height - margin.bottom, margin.top]);

    // careful
    const line = d3.line<any>()
    .x((d, i) => { console.log('here'); console.log(d); return xScale(d.x); })
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);


    const svg = d3.select('#line')
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .classed('svg-content', true)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', 0)');


    const xAxis = g => g
    .attr('class', 'x axis')
    .attr('transform', `translate(${-margin.left},${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

    const yAxis = g => g
    .attr('class', 'y axis')
    .call(d3.axisLeft(yScale));

    svg.append('path')
    .datum(this.labelsAndData) // 10. Binds data to the line
    .attr('class', 'line') // Assign a class for styling
    .attr('d', line) // 11. Calls the line generator
    .attr('transform', `translate(${-margin.left},${0})`);


    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);

  }

  private combineLabelsDataToOne(): LabelsAndData[] {
    const result = [];
    const N = this.data.length;
    for (let index = 0; index < N; index++) {
      result.push({ x: this.labels[index], y: this.data[index] });
    }
    return result;
  }

  private getXdomain(labels: any[]): Date[] {
    const domainExtent = d3.extent(labels) as any[];
    return domainExtent.map(d => new Date(d));
  }



}
