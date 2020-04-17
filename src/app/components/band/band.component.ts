import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GraphOptions } from '../shared/models/graph-options.interface';
import * as d3 from 'd3';
import { ScaleTime } from 'd3';
import { ViewBox } from '../shared/models/viewbox.interface';

interface LabelsAndData {
  x: any;
  low: any;
  high: any;
}

interface BandOptions extends GraphOptions {
  ticks?: number;
}

@Component({
  selector: 'ng-band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BandComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() labels: any[] = [];
  @Input() options: BandOptions = {
    width: 300,
    height: 300,
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    yAxisLabel: '',
  };
  labelsAndData: LabelsAndData[] = [];
  viewBox: ViewBox = {
    minX: -25,
    minY: -25,
    width:
      this.options.width + this.options.margin.left,
    height: this.options.height,
  };

  constructor() { }

  ngOnInit() {
    this.labels = this.formatLabels();
    this.labelsAndData = this.combineLabelsDataToOne();
    this.render();
  }

  private formatLabels(): any[] {
    return this.labels.map((d) => new Date(d));
  }

  private combineLabelsDataToOne(): LabelsAndData[] {
    const N = this.labels.length;
    const result: LabelsAndData[] = [];
    for (let index = 0; index < N; index++) {
      result.push({
        x: this.labels[index],
        low: this.data[index].low,
        high: this.data[index].high,
      });
    }
    return result;
  }

  private render() {

    this.viewBox = {
      minX: -25,
      minY: -25,
      width:
        this.options.width
        + this.options.margin.left,
      height:
        this.options.height
        + this.options.margin.top,
    };

    const svg = d3
      .select('#band')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `${this.viewBox.minX} ${this.viewBox.minY} ${this.viewBox.width} ${this.viewBox.height}`
      )
      .classed('svg-content', true)
      .append('g');

    const x: ScaleTime<any, any> = d3
      .scaleUtc()
      .domain(d3.extent(this.labels, d => new Date(d)))
      .range([0, this.options.width]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(this.data, (d) => d.low),
        d3.max(this.data, (d) => d.high),
      ])
      .nice(5)
      .range([this.options.height, 0]);

    // add the X gridlines
    svg.append('g').attr('class', 'grid').call(
      this.make_x_gridlines(x).tickSize(this.options.height)
      // .tickFormat('')
    );

    // add the Y gridlines
    svg.append('g').attr('class', 'grid').call(
      this.make_y_gridlines(y).tickSize(-this.options.width)
      // .tickFormat('')
    );


    const xAxis = (g) =>
      g
        .attr('transform', `translate(0,${this.options.height})`)
        .attr('opacity', '1')
        .call(
          d3
            .axisBottom(x)
        )
        .call((g) => g.select('.domain').remove());


    const yAxis = (g) =>
      g
        .attr('transform', `translate(${0},0)`)
        .attr('opacity', '1')
        .call(d3.axisLeft(y))
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text(this.options.yAxisLabel)
        );

    const curve: any = d3.curveStep;
    const area = d3
      .area<LabelsAndData>()
      .curve(curve)
      .x((d) => x(d.x))
      .y0((d) => y(d.low))
      .y1((d) => y(d.high));

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);


    svg
      .append('path')
      .datum(this.labelsAndData)
      .attr('fill', 'steelblue')
      .attr('d', area);

  }
  // gridlines in x axis function
  private make_x_gridlines(x) {
    return d3.axisBottom(x).ticks(this.options.ticks);
  }

  // gridlines in y axis function
  private make_y_gridlines(y) {
    return d3.axisLeft(y).ticks(this.options.ticks);
  }

}
