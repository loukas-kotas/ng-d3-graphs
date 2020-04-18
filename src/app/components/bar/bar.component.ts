import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, ElementRef } from '@angular/core';
import { GraphOptions } from '../shared/models/graph-options.interface';
import * as d3 from 'd3';
import { Axis } from '../shared/models/axis.interface';
import { BarService } from './bar.service';
import { ViewBox } from '../shared/models/viewbox.interface';

export interface Bar {
  labels: any[];
  data: any[];
  options?: any;
}

interface BarData {
  label: string;
  values: any[];
}
export interface BarD3 {
  xAxis: Axis[];
  yAxis: Axis[];
  xAxisPath: string;
  yAxisPath: string;
  rectanglesData: Rectangle[];
}

export interface Rectangle {
  x: number;
  y: number;
  height: number;
  width: number;
}

interface LabelsAndData {
  x: any;
  y: any;
}

interface BarOptions extends GraphOptions {
  ticks?: number;
}

@Component({
  selector: 'ng-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements OnInit {
  @Input() data: BarData[] = [];
  @Input() labels: any[] = [];
  @Input() options?: BarOptions = {} as BarOptions;
  graph: BarD3 = {
    xAxis: [],
    yAxis: [],
    xAxisPath: '',
    yAxisPath: '',
    rectanglesData: [],
  };
  labelsAndData: LabelsAndData[] = [];
  parseTime = d3.timeParse('%d-%b-%y');

  private _options: BarOptions = {
    width: 600,
    height: 300,
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    ticks: 5,
  };

  viewBox: ViewBox = {} as ViewBox;


  constructor(private container: ElementRef) {}

  ngOnInit() {
    this.options =  {...this._options, ...this.options};
    this.viewBox = {
      minX: -this.options.margin.left,
      minY: -25,
      width:
        this.options.width + this.options.margin.left + this.options.margin.right,
      height:
        this.options.height +
        this.options.margin.top +
        this.options.margin.bottom,
    };
    this.labelsAndData = this.combineLabelsDataToOne();
    this.render();
  }

  private render() {
    const options = {
      width:
        this.options.width -
        this.options.margin.right -
        this.options.margin.left,
      height: this.options.height + this.options.margin.top,
      margin: this.options.margin,
    };

    const svg = d3
      .select(this.container.nativeElement)
      .select('div')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `${this.viewBox.minX} ${this.viewBox.minY} ${this.viewBox.width} ${this.viewBox.height}`
      )
      .classed('svg-content', true)
      .append('g');

    const x = d3
      .scaleBand()
      .rangeRound([0, options.width])
      .padding(0.1)
      .domain(this.labels);

    const y = d3
      .scaleLinear()
      .rangeRound([options.height, 0])
      .domain([0, Math.max(...this.data.map((d) => Number(d)))]);

    const xAxis = (g) =>
      g
        .call(d3.axisBottom(x))
        .attr('transform', 'translate(0,' + options.height + ')');

    const yAxis = (g) =>
      g
        .call(d3.axisLeft(y))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text(this.options.yAxisLabel);

    // add the X gridlines
    svg.append('g').attr('class', 'grid').call(
      this.make_x_gridlines(x).tickSize(options.height)
      // .tickFormat('')
    );

    // add the Y gridlines
    svg.append('g').attr('class', 'grid').call(
      this.make_y_gridlines(y).tickSize(-options.width)
      // .tickFormat('')
    );

    svg
      .selectAll('.bar')
      .data(this.labelsAndData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => {
        return x(d.x);
      })
      .attr('y', (d) => {
        return y(Number(d.y));
      })
      .attr('width', x.bandwidth())
      .attr('height', (d) => {
        return options.height - y(Number(d.y));
      });

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
  // gridlines in x axis function
  private make_x_gridlines(x) {
    return d3.axisBottom(x).ticks(this.options.ticks);
  }

  // gridlines in y axis function
  private make_y_gridlines(y) {
    return d3.axisLeft(y).ticks(this.options.ticks);
  }
}
