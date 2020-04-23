import {Component, ElementRef, HostListener, Input, OnInit, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import {ScaleTime} from 'd3';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {axisConfig} from '../shared/config/axis.config';
import {GraphOptions} from '../shared/models/graph-options.interface';
import {ViewBox} from '../shared/models/viewbox.interface';
import {D3Service} from '../shared/services/d3.service';

interface LabelsAndData {
  x: any;
  low: any;
  high: any;
}

export interface BandOptions extends GraphOptions {
  gridTicks?: number;
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
  @Input() options?: BandOptions = {} as BandOptions;
  labelsAndData: LabelsAndData[] = [];
  viewBox: ViewBox = {} as ViewBox;

  _options: BandOptions = {
    width: 879,
    height: 804,
    margin: {top: 50, right: 50, bottom: 50, left: 50},
    yAxisLabel: '',
    gridTicks: 0,
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
    this.options = {...this._options, ...this.options};
    this.viewBox = {
      minX: -this.options.margin.left,
      minY: -10,
      width: this.options.width + this.options.margin.left +
          this.options.margin.right,
      height: this.options.height + this.options.margin.top,
    };

    this.parseTime = d3.timeParse(this.options.timeParser);
    this.formatTime = d3.timeFormat(this.options.timeFormat);

    this.labels = this.formatLabels();
    this.labelsAndData = this.combineLabelsDataToOne();

    this.onResizeEvent();

    this.render();
  }

  private formatLabels(): any[] {
    return this.labels.map(d => this.parseTime(d));
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
      height: this.options.height - this.options.margin.top,
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

    const x: ScaleTime<any, any> =
        d3.scaleTime()
            .domain(d3.extent(this.labels, (d) => new Date(d)))
            .range([0, width]);

    const y =
        d3.scaleLinear()
            .domain([
              d3.min(this.data, (d) => d.low), d3.max(this.data, (d) => d.high)
            ])
            .nice(this.options.gridTicks)
            .range([height, 0]);

    // add the X gridlines
    svg.append('g')
        .attr('class', 'grid')
        .call(
            this.make_x_gridlines(x).tickSize(height)
            // .tickFormat('')
        );

    // add the Y gridlines
    svg.append('g')
        .attr('class', 'grid')
        .call(
            this.make_y_gridlines(y).tickSize(-width)
            // .tickFormat('')
        );

    const xAxis = this.d3Service.getXaxisTime(
        svg, height, x, this.options.timeFormat, this.options.xAxisTicks);

    const yAxis = (g) =>
        g.attr('transform', `translate(${0},0)`).call(d3.axisLeft(y));

    const curve: any = d3.curveStep;
    const area = d3.area<LabelsAndData>()
                     .curve(curve)
                     .x((d) => x(d.x))
                     .y0((d) => y(d.low))
                     .y1((d) => y(d.high));

    const _yAxis = svg.append('g').call(yAxis);

    // this.d3Service.addLabelAxisX(svg, width, height, this.options);

    // text label for the x axis
    this.addLabelAxisX(svg, width, height);
    // text label for the y axis
    this.addLabelAxisY(svg, height);

    svg.append('path')
        .datum(this.labelsAndData)
        .attr('fill', 'steelblue')
        .attr('d', area);

    this.removeAxisTicks(xAxis);
    this.removeAxisTicks(_yAxis);

    this.changeAxisColor(xAxis, axisConfig);
    this.changeAxisColor(_yAxis, axisConfig);
  }

  private changeAxisColor(
      axis: d3.Selection<SVGGElement, unknown, null, undefined>, config: any) {
    this.d3Service.changeAxisColor(axis, config);
  }


  private removeAxisTicks(
      axis: d3.Selection<SVGGElement, unknown, null, undefined>) {
    this.d3Service.removeAxisTicks(axis);
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
