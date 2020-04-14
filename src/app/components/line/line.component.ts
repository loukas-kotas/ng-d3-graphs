import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as d3 from 'd3';
import { GraphOptions } from '../shared/models/graph-options.interface';
import { ViewBox } from '../shared/models/viewbox.interface';

interface LabelsAndData {
  x: any;
  y: any;
}

interface xAxisData {
  id: number;
  value: any;
}

interface LineOptions extends GraphOptions {
  ticks?: number;
}

@Component({
  selector: 'ng-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() labels: any[] = [];
  @Input() options?: LineOptions = {
    width: 879,
    height: 804,
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    ticks: 5,
  };
  labelsAndData: LabelsAndData[] = [];
  xAxisData: xAxisData[] = [];
  viewBox: ViewBox = {
    minX: -this.options.margin.left,
    minY: -25,
    width: this.options.width + this.options.margin.left + this.options.margin.right,
    height: this.options.height + this.options.margin.top,
  };

  constructor() {}

  ngOnInit() {
    const options = {
      width: this.options.width - 200,
      height: this.options.height - 100,
      margin: this.options.margin,
    };

    this.options = {
      width: 879,
      height: 804,
      margin: { top: 50, right: 50, bottom: 50, left: 50 },
    };

    const parseTime = d3.timeParse('%d-%b-%y');

    this.labels = this.labels.map((d) => parseTime(d));

    this.labelsAndData = this.combineLabelsDataToOne();
    this.render();
  }

  private render(): void {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = this.options.width - margin.left - margin.right;
    const height = this.options.height - margin.top - margin.bottom;
    this.viewBox = {
      minX: -margin.left,
      minY: -25,
      width: width + margin.left + margin.right,
      height: height + margin.top,
    };

    const svg = d3
      .select('#line')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `${this.viewBox.minX} ${this.viewBox.minY} ${this.viewBox.width} ${this.viewBox.height}`
      )
      .classed('svg-content', true)
      .append('g');

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]).nice();
    const valueline = d3
      .line<any>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));

    x.domain(d3.extent(this.labels, (d) => d));
    y.domain([0, d3.max(this.data, (d) => d)]);

    // add the X gridlines
    svg.append('g').attr('class', 'grid').call(
      this.make_x_gridlines(x).tickSize(height)
      // .tickFormat('')
    );

    // add the Y gridlines
    svg.append('g').attr('class', 'grid').call(
      this.make_y_gridlines(y).tickSize(-width)
      // .tickFormat('')
    );

    svg
      .append('path')
      .datum(this.labelsAndData)
      .attr('class', 'line')
      .attr('d', valueline);

    // add the X Axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // add the Y Axis
    svg.append('g').call(d3.axisLeft(y));
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