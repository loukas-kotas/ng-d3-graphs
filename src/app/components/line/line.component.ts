import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewEncapsulation,} from '@angular/core';
import * as d3 from 'd3';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {axisConfig} from '../shared/config/axis.config';
import {GraphOptions} from '../shared/models/graph-options.interface';
import {ViewBox} from '../shared/models/viewbox.interface';
import {D3Service} from '../shared/services/d3.service';

interface LabelsAndData {
  x: any;
  y: any;
}

interface AxisDataX {
  id: number;
  value: any;
}

interface LineOptions extends GraphOptions {
  gridTicks?: number;
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
  @Input() options?: LineOptions = {} as LineOptions;

  private _options: LineOptions = {
    width: 879,
    height: 804,
    margin: {top: 50, right: 50, bottom: 50, left: 50},
    gridTicks: 0,
    yAxisLabel: '',
    xAxisLabel: '',
    timeParser: axisConfig.xAxisTimeParser,
    timeFormat: axisConfig.xAxisTimeFormat,
    xAxisTicks: axisConfig.xAxisTicks,
  };

  parseTime = d3.timeParse(this.options.timeParser);
  formatTime = d3.timeFormat(this.options.timeFormat);

  private viewBox: ViewBox = {} as ViewBox;

  labelsAndData: LabelsAndData[] = [];
  AxisDataX: AxisDataX[] = [];

  onResize$ = new Subject<void>();
  @HostListener('window:resize')
  onResize(): void {
    this.onResize$.next();
  }

  constructor(private container: ElementRef, private d3Service: D3Service) {}

  ngOnInit() {
    this.options = {...this._options, ...this.options};
    this.viewBox = this.d3Service.getViewBoxDefault(this.options);

    this.parseTime = d3.timeParse(this.options.timeParser);
    this.formatTime = d3.timeFormat(this.options.timeFormat);


    this.labels = this.labels.map(d => this.parseTime(d));

    this.labelsAndData = this.combineLabelsDataToOne();

    this.onResizeEvent();

    this.render();
  }

  private render(): void {
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

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]).nice();
    const valueline = d3.line<any>().x((d) => x(d.x)).y((d) => y(d.y));

    x.domain(d3.extent(this.labels, (d) => (d)));
    y.domain([0, d3.max(this.data, (d) => d)]);

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

    svg.append('path')
        .datum(this.labelsAndData)
        .attr('class', 'line')
        .attr('d', valueline);

    // add the X Axis
    const xAxis = this.d3Service.getXaxisTime(
        svg, height, x, this.options.timeFormat, this.options.xAxisTicks);


    // text label for the x axis
    this.addLabelAxisX(svg, width, height);

    // add the Y Axis
    const yAxis = svg.append('g').call(d3.axisLeft(y));

    // text label for the y axis
    this.addLabelAxisY(svg, height);

    this.removeAxisTicks(xAxis);
    this.removeAxisTicks(yAxis);

    this.changeAxisColor(xAxis, axisConfig);
    this.changeAxisColor(yAxis, axisConfig);

    this.addDots(svg, x, y);
  }

  private addDots(
      svg: d3.Selection<SVGGElement, unknown, null, undefined>,
      x: d3.ScaleTime<number, number>, y: d3.ScaleLinear<number, number>) {
    const dotRadius = 3;
    const dotColor = '#4682b4';
    // const mouseOutDuration = 500;

    // const div = d3.select(this.container.nativeElement)
    //                 .select('div')
    //                 .append('div')
    //                 .attr('class', 'tooltip')
    //                 .style('opacity', 0);

    svg.selectAll('dot')
        .data(this.labelsAndData)
        .enter()
        .append('circle')
        .attr('r', dotRadius)
        .attr('fill', dotColor)
        .attr(
            'cx',
            (d) => {
              return x(d.x);
            })
        .attr('cy', (d) => {
          return y(d.y);
        })
    // .on('mouseover',
    //     (d) => {
    //       console.log('on mouseover');
    //       div.transition().duration(200).style('opacity', .9);
    //       const formatTime = d3.timeFormat(this.options.timeFormat);
    //       div.html(formatTime(d.x) + '<br/>' + d.y)
    //           .style('left', (d3.event.pageX) + 'px')
    //           .style('top', (d3.event.pageY - 28) + 'px');
    //     })
    // .on('mouseout', (d) => {
    //   div.transition().duration(mouseOutDuration).style('opacity', 0);
    // });
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
