import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { axisConfig } from '../shared/config/axis.config';
import { GraphOptions } from '../shared/models/graph-options.interface';
import { ViewBox } from '../shared/models/viewbox.interface';
import { D3Service } from '../shared/services/d3.service';

interface LabelsAndData {
  label: string;
  values: any[];
}

interface MultiareaData {
  label: string;
  values: any[];
}

export interface MultiareaOptions extends GraphOptions {
  gridTicks?: number;
}

@Component({
  selector: 'ng-multiarea',
  templateUrl: './multiarea.component.html',
  styleUrls: ['./multiarea.component.scss'],
})
export class MultiareaComponent implements OnInit {
  @Input() data: MultiareaData[] = [];
  @Input() labels: any[] = [];
  @Input() options?: MultiareaOptions = {} as MultiareaOptions;
  labelsAndData: LabelsAndData[] = [];
  utcParse = d3.utcParse('%Y-%m');
  x: any;
  y: any;
  viewBox: ViewBox = {} as ViewBox;

  _options: MultiareaOptions = {
    width: 879,
    height: 804,
    yAxisLabel: '',
    xAxisLabel: '',
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    timeParser: axisConfig.xAxisTimeParser,
    timeFormat: axisConfig.xAxisTimeFormat,
    xAxisTicks: axisConfig.xAxisTicks,
  };

  parseTime = d3.timeParse(this.options.timeParser);
  formatTime = d3.timeFormat(this.options.timeFormat);

  onResize$ = new Subject<void>();
  @HostListener('window:resize')
  onResize(): void {
    this.onResize$.next();
  }

  constructor(private container: ElementRef, private d3Service: D3Service) {}

  ngOnInit() {
    this.options = { ...this._options, ...this.options };
    this.viewBox = {
      minX: -this.options.margin.left,
      minY: -25,
      width: this.options.width + this.options.margin.left + this.options.margin.right,
      height: this.options.height + this.options.margin.top,
    };

    this.parseTime = d3.timeParse(this.options.timeParser);
    this.formatTime = d3.timeFormat(this.options.timeFormat);

    this.labels = this.formatData();
    this.labelsAndData = this.combineLabelsDataToOne();

    this.onResizeEvent();

    this.render();
  }

  private render() {
    const currentWidth = parseInt(d3.select(this.container.nativeElement).select('div').style('width'), 10);
    const currentHeight = parseInt(d3.select(this.container.nativeElement).select('div').style('height'), 10);

    const width = this.options.width - this.options.margin.left - this.options.margin.right;
    const height = this.options.height - this.options.margin.top - this.options.margin.bottom;

    this.viewBox = {
      minX: -this.options.margin.left,
      minY: -10,
      width: this.options.width,
      height: this.options.height - this.options.margin.top,
    };

    const svg = d3
      .select(this.container.nativeElement)
      .select('div')
      .append('svg')
      .attr('width', currentWidth)
      .attr('height', currentHeight)
      .attr('viewBox', `${this.viewBox.minX} ${this.viewBox.minY} ${this.viewBox.width} ${this.viewBox.height}`)
      .classed('svg-content', true)
      .append('g');

    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]).nice();
    const colorScale = d3
      .scaleOrdinal<any>()
      .domain(this.labelsAndData.map((d) => d.label))
      .range(['rgba(249, 208, 87, 0.7)', 'rgba(54, 174, 175, 0.65)']);

    colorScale.domain(
      this.labelsAndData.map((c) => {
        return c.label;
      })
    );

    // const sources = this.data.columns.slice(1).map(function(id) {
    //   return {
    //     id: id,
    //     values: data.map(function(d) {
    //       return {date: d.date, kW: d[id]};
    //     })
    //   };
    // });

    // SCALE
    xScale.domain(
      d3.extent(this.labels, (d) => {
        return d;
      })
    );

    yScale.domain([0, d3.max(this.data, (d) => d3.max(d.values))]);

    // AREA
    const area = d3
      .area<any>()
      .curve(d3.curveMonotoneX)
      .x((d) => {
        return xScale(d.x);
      })
      .y0(yScale(0))
      .y1((d) => {
        return yScale(d.y);
      });

    // AXIS
    const xAxis = this.d3Service.getXaxisTime(svg, height, xScale, this.options.timeFormat, this.options.xAxisTicks);
    const yAxis = (g) => g.call(d3.axisLeft(yScale));

    const _yAxis = svg.append('g').call(yAxis);

    const source = svg.append('g').selectAll('.area').data(this.labelsAndData).enter().append('g');

    source
      .append('path')
      .attr('d', (d) => {
        return area(d.values);
      })
      .attr('fill', (d) => {
        return colorScale(d.label);
      });

    this.removeAxisTicks(xAxis);
    this.removeAxisTicks(_yAxis);

    this.changeAxisColor(xAxis, axisConfig);
    this.changeAxisColor(_yAxis, axisConfig);

    // text label for the x axis
    this.addLabelAxisX(svg, width, height);
    // text label for the y axis
    this.addLabelAxisY(svg, height);

    // add the X gridlines
    svg.append('g').attr('class', 'grid').call(
      this.make_x_gridlines(xScale).tickSize(height)
      // .tickFormat('')
    );

    // add the Y gridlines
    svg.append('g').attr('class', 'grid').call(
      this.make_y_gridlines(yScale).tickSize(-width)
      // .tickFormat('')
    );
  }

  private changeAxisColor(axis: d3.Selection<SVGGElement, unknown, null, undefined>, config: any) {
    this.d3Service.changeAxisColor(axis, config);
  }

  private removeAxisTicks(axis: d3.Selection<SVGGElement, unknown, null, undefined>) {
    this.d3Service.removeAxisTicks(axis);
  }

  private formatData() {
    return this.labels.map((d) => this.parseTime(d));
  }

  private combineLabelsDataToOne(): LabelsAndData[] {
    const result = [];
    const numOfAreas = this.data.length;
    for (let i = 0; i < numOfAreas; i++) {
      let x = Number.NEGATIVE_INFINITY;
      let y = Number.NEGATIVE_INFINITY;
      const values = [];
      const numOfDataPoints = this.data[i].values.length;

      for (let j = 0; j < numOfDataPoints; j++) {
        y = this.data[i].values[j];
        x = this.labels[j];
        values.push({ x, y });
      }
      const newArea = { label: this.data[i].label, values };
      result.push(newArea);
    }

    return result;
  }

  private addLabelAxisY(svg: d3.Selection<SVGGElement, unknown, null, undefined>, height: number) {
    svg
      .append('text')
      .attr('transform', 'rotate(0)')
      .attr('y', 0 - this.options.margin.top / 2)
      .attr('x', 0)
      .attr('dy', '1em')
      .style('text-anchor', 'start')

      .text(this.options.yAxisLabel);
  }

  private addLabelAxisX(svg: d3.Selection<SVGGElement, unknown, null, undefined>, width: number, height: number) {
    svg
      .append('text')
      .attr('transform', 'translate(' + width / 2 + ' ,' + (height + this.options.margin.top - 15) + ')')
      .style('text-anchor', 'middle')
      .text(this.options.xAxisLabel);
  }

  // gridlines in x axis function
  private make_x_gridlines(x) {
    return d3.axisBottom(x).ticks(this.options.gridTicks);
  }

  // gridlines in y axis function
  private make_y_gridlines(y) {
    return d3.axisLeft(y).ticks(this.options.gridTicks);
  }

  onResizeEvent(): void {
    this.onResize$.pipe(debounceTime(200)).subscribe(() => {
      const svgExist = d3.select(this.container.nativeElement).select('svg');
      if (svgExist) {
        svgExist.remove();
      }
      this.render();
    });
  }
}
