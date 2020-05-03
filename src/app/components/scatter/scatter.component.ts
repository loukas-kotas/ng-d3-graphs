import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {axisConfig} from '../shared/config/axis.config';
import {GraphOptions} from '../shared/models/graph-options.interface';
import {ViewBox} from '../shared/models/viewbox.interface';
import {D3Service} from '../shared/services/d3.service';


interface LabelsAndData {
  label: string;
  x: any;
  y: any;
}

interface ScatterData {
  x: any;
  y: any;
}

export interface ScatterOptions extends GraphOptions {
  gridTicks?: number;
  legend?: boolean;
  legendFontSize?: string;
  legendWidth?: string;
  legendHeight?: string;
  legendBackground?: string;
}

@Component({
  selector: 'ng-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent implements OnInit {
  @Input() data: ScatterData[] = [];
  @Input() labels: any[] = [];
  @Input() options?: ScatterOptions = {} as ScatterOptions;
  labelsAndData: LabelsAndData[] = [];
  utcParse = d3.utcParse('%Y-%m');
  x: any;
  y: any;
  viewBox: ViewBox = {} as ViewBox;

  _options: ScatterOptions = {
    width: 879,
    height: 804,
    yAxisLabel: '',
    xAxisLabel: '',
    margin: {top: 50, right: 50, bottom: 50, left: 50},
    timeParser: axisConfig.xAxisTimeParser,
    timeFormat: axisConfig.xAxisTimeFormat,
    xAxisTicks: axisConfig.xAxisTicks,
    legend: false,
    legendFontSize: '1rem',
    legendWidth: '0%',
    legendHeight: '0%',
    legendBackground: 'lightgray',
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
    this.options = {...this._options, ...this.options};
    this.viewBox = {
      minX: -this.options.margin.left,
      minY: -25,
      width: this.options.width + this.options.margin.left +
          this.options.margin.right,
      height: this.options.height + this.options.margin.top,
    };

    this.parseTime = d3.timeParse(this.options.timeParser);
    this.formatTime = d3.timeFormat(this.options.timeFormat);

    this.labelsAndData = this.combineLabelsDataToOne();

    this.onResizeEvent();

    this.render();
  }

  private render() {
    const currentWidth = parseInt(
        d3.select(this.container.nativeElement).select('div').style('width'),
        10);
    const currentHeight = parseInt(
        d3.select(this.container.nativeElement).select('div').style('height'),
        10);

    const width = this.options.width - this.options.margin.left -
        this.options.margin.right;
    const height = this.options.height - this.options.margin.top -
        this.options.margin.bottom;

    this.viewBox = {
      minX: -this.options.margin.left,
      minY: -10,
      width: this.options.width,
      height: this.options.height,
    };

    const svg = d3.select(this.container.nativeElement)
                    .select('div')
                    .append('svg')
                    .attr('width', currentWidth)
                    .attr('height', currentHeight)
                    .attr(
                        'viewBox',
                        `${this.viewBox.minX} ${this.viewBox.minY} ${
                            this.viewBox.width} ${this.viewBox.height}`)
                    .classed('svg-content', true)
                    .append('g');

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear<any>().range([height, 0]).nice();

    const colorScale =
        d3.scaleOrdinal<any>().domain(this.data.map(d => d.x)).range([
          'rgba(249, 208, 87, 0.7)', 'rgba(54, 174, 175, 0.65)'
        ]);

    colorScale.domain(this.labelsAndData.map((c) => {
      return c.label;
    }));

    // SCALE
    xScale
        .domain(d3.extent(
            this.data,
            (d) => {
              return d.x;
            }))
        .nice();

    yScale.domain([0, d3.max(this.data, (d) => d.y)]);

    // AXIS
    const xAxis = this.d3Service.getXaxisLinear(
        svg, height, xScale, this.options.xAxisTicks);

    const yAxis = (g) => g.call(d3.axisLeft(yScale));
    const _yAxis = svg.append('g').call(yAxis);


    // add the X gridlines
    svg.append('g')
        .attr('class', 'grid')
        .call(
            this.make_x_gridlines(xScale).tickSize(height)
            // .tickFormat('')
        );

    // add the Y gridlines
    svg.append('g')
        .attr('class', 'grid')
        .call(
            this.make_y_gridlines(yScale).tickSize(-width)
            // .tickFormat('')
        );



    // scatter grid
    this.addScatterGrid(xScale, height, yScale, width, svg);

    this.removeAxisTicks(xAxis);
    this.removeAxisTicks(_yAxis);

    this.changeAxisColor(xAxis, axisConfig);
    this.changeAxisColor(_yAxis, axisConfig);

    // text label for the x axis
    this.addLabelAxisX(svg, width, height);
    // text label for the y axis
    this.addLabelAxisY(svg, height);
  }

  private addScatterGrid(
      xScale: d3.ScaleLinear<number, number>, height: number,
      yScale: d3.ScaleLinear<any, any>, width: number,
      svg: d3.Selection<SVGGElement, unknown, null, undefined>) {
    const grid = g =>
        g.attr('stroke', 'currentColor')
            .attr('stroke-opacity', 0.5)
            .call(
                g => g.append('g')
                         .selectAll('line')
                         .data(xScale.ticks())
                         .join('line')
                         .attr('x1', d => 0.5 + xScale(d))
                         .attr('x2', d => 0.5 + xScale(d))
                         .attr('y1', this.options.margin.top)
                         .attr('y2', height - this.options.margin.bottom))
            .call(
                g => g.append('g')
                         .selectAll('line')
                         .data(yScale.ticks())
                         .join('line')
                         .attr('y1', d => 0.5 + yScale(d))
                         .attr('y2', d => 0.5 + yScale(d))
                         .attr('x1', this.options.margin.left)
                         .attr('x2', width - this.options.margin.right));
    // circles
    svg.append('g')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('fill', 'none')
        .selectAll('circle')
        .data(this.labelsAndData)
        .join('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 3);
    // text
    svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll('text')
        .data(this.labelsAndData)
        .join('text')
        .attr('dy', '0.35em')
        .attr('x', d => xScale(d.x) + 7)
        .attr('y', d => yScale(d.y))
        .text(d => d.label);
  }

  private addLegend(
      svg: d3.Selection<SVGGElement, unknown, null, undefined>, width: number,
      height: number, colorScale: any, labels: string[], fontSize: string,
      legendWidth: string, legendHeight: string, legendBackground: string) {
    const d3Legend = this.d3Service.getLegend(
        svg, width, height, colorScale, labels, fontSize, legendWidth,
        legendHeight, legendBackground);
  }

  private changeAxisColor(
      axis: d3.Selection<SVGGElement, unknown, null, undefined>, config: any) {
    this.d3Service.changeAxisColor(axis, config);
  }

  private removeAxisTicks(
      axis: d3.Selection<SVGGElement, unknown, null, undefined>) {
    this.d3Service.removeAxisTicks(axis);
  }

  private formatData() {
    return this.labels.map((d) => this.parseTime(d));
  }

  private combineLabelsDataToOne(): LabelsAndData[] {
    const result = [];
    const numOfAreas = this.data.length;

    for (let i = 0; i < numOfAreas; i++) {
      result.push(
          {label: this.labels[i], x: this.data[i].x, y: this.data[i].y});
    }

    return result;
  }

  private addLabelAxisY(
      svg: d3.Selection<SVGGElement, unknown, null, undefined>,
      height: number) {
    svg.append('text')
        .attr('transform', 'rotate(0)')
        .attr('y', 0 - this.options.margin.top / 2)
        .attr('x', 0)
        .attr('dy', '1em')
        .style('text-anchor', 'start')

        .text(this.options.yAxisLabel);
  }

  private addLabelAxisX(
      svg: d3.Selection<SVGGElement, unknown, null, undefined>, width: number,
      height: number) {
    svg.append('text')
        .attr(
            'transform',
            'translate(' + width / 2 + ' ,' +
                (height + this.options.margin.top - 15) + ')')
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
