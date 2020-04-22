import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewEncapsulation,} from '@angular/core';
import * as d3 from 'd3';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {axisConfig} from '../shared/config/axis.config';
import {Axis} from '../shared/models/axis.interface';
import {GraphOptions} from '../shared/models/graph-options.interface';
import {ViewBox} from '../shared/models/viewbox.interface';
import {D3Service} from '../shared/services/d3.service';

import {BarService} from './bar.service';

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

export interface BarOptions extends GraphOptions {
  gridTicks?: number;
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
    width: 879,
    height: 804,
    margin: {top: 50, right: 50, bottom: 50, left: 50},
    gridTicks: 0,
  };

  viewBox: ViewBox = {} as ViewBox;

  onResize$ = new Subject<void>();
  @HostListener('window:resize')
  onResize(): void {
    this.onResize$.next();
  }

  constructor(
      private container: ElementRef,
      private d3Service: D3Service,
  ) {}

  ngOnInit() {
    this.options = {...this._options, ...this.options};
    this.viewBox = {
      minX: -this.options.margin.left,
      minY: -10,
      width: this.options.width + this.options.margin.left +
          this.options.margin.right,
      height: this.options.height + this.options.margin.top,
    };
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

    const x =
        d3.scaleBand().rangeRound([0, width]).padding(0.1).domain(this.labels);

    const y = d3.scaleLinear().rangeRound([height, 0]).domain([
      0, Math.max(...this.data.map((d) => Number(d)))
    ]);

    const xAxis = (g) => g.call(d3.axisBottom(x))
                             .attr('transform', 'translate(0,' + height + ')');

    const yAxis = (g) => g.call(d3.axisLeft(y));

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

    svg.selectAll('.bar')
        .data(this.labelsAndData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr(
            'x',
            (d) => {
              return x(d.x);
            })
        .attr(
            'y',
            (d) => {
              return y(Number(d.y));
            })
        .attr('width', x.bandwidth())
        .attr('height', (d) => {
          return height - y(Number(d.y));
        });

    const _xAxis = svg.append('g').call(xAxis);

    // text label for the x axis
    this.addLabelAxisX(svg, width, height);

    const _yAxis = svg.append('g').call(yAxis);

    // text label for the y axis
    this.addLabelAxisY(svg, height);

    this.removeAxisTicks(_xAxis);
    this.removeAxisTicks(_yAxis);

    this.changeAxisColor(_xAxis, axisConfig);
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

  private combineLabelsDataToOne(): LabelsAndData[] {
    const result = [];
    const N = this.data.length;
    for (let index = 0; index < N; index++) {
      result.push({x: this.labels[index], y: this.data[index]});
    }
    return result;
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
