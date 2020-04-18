import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { GraphOptions } from '../shared/models/graph-options.interface';
import { ScaleTime, ScaleOrdinal } from 'd3';
import { ViewBox } from '../shared/models/viewbox.interface';

interface LabelsAndData {
  x: any;
  y: any;
}

interface AreaOptions extends GraphOptions {
  gridTicks?: number;
}
@Component({
  selector: 'ng-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() labels: any[] = [];
  @Input() options: AreaOptions = {} as AreaOptions;
  formatx = d3.timeFormat('%Y-%m-%d %H:%M:%S');
  labelsAndData: LabelsAndData[] = [];
  viewBox: ViewBox = {} as ViewBox;
  _options: AreaOptions = {
    width: 300,
    height: 300,
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    gridTicks: 0,
  };


  constructor(
    private container: ElementRef,
  ) { }

  ngOnInit() {

    this.options = {...this._options, ...this.options};

    this.viewBox = {
      minX: -this.options.margin.left,
      minY: -25,
      width: (this.options.width + this.options.margin.left + this.options.margin.right),
      height: (this.options.height + this.options.margin.top),
    };

    this.labels = this.formatLabels(this.labels);
    this.labelsAndData = this.combineLabelsDataToOne(this.labels, this.data);
    this.render();
  }

  private formatLabels(labels) {
    return labels.map(d => new Date(d));
  }

  private combineLabelsDataToOne(labels, data): any[] {
    const N = data.length;
    const labelsAndData = [];
    for (let index = 0; index < N; index++) {
      labelsAndData.push({ x: labels[index], y: data[index] });
    }
    return labelsAndData;
  }

  private render() {

    const svg = d3
      .select(this.container.nativeElement)
      .select('div')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `${this.viewBox.minX} ${this.viewBox.minY} ${this.viewBox.width} ${this.viewBox.height}`
      )
      .classed('svg-content', true)
      .append('g');

    const xDomain = this.getXdomain();
    const x: ScaleTime<any, any> = d3
      .scaleUtc()
      .domain(xDomain)
      .range([0, this.options.width]);

    const xAxis = g => g
      .attr('transform', `translate(${0},${this.options.height})`)
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([d3.min(this.data, (d) => d), d3.max(this.data, (d) => d)])
      .nice()
      // .range([height - this.options.margin.bottom, this.options.margin.top]);
      .range([this.options.height, 0]);

    const yAxis = g =>
      g
        .attr('transform', `translate(${0},${0})`)
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

    // area
    const curve: any = d3.curveLinear;
    const area = d3.area<LabelsAndData>()
      .curve(curve)
      .x(d => x(d.x))
      .y0(y(0))
      .y1(d => y(d.y));


    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

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


    svg.append('path')
      .datum(this.labelsAndData)
      .attr('fill', 'steelblue')
      .attr('d', area);
      // .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);


  }

  private getXdomain(): Date[] {
    const domainExtent = d3.extent(this.labels) as any[];
    return domainExtent.map(d => new Date(d));
  }

  // gridlines in x axis function
  private make_x_gridlines(x) {
    return d3.axisBottom(x).ticks(this.options.gridTicks);
  }

  // gridlines in y axis function
  private make_y_gridlines(y) {
    return d3.axisLeft(y).ticks(this.options.gridTicks);
  }



}
