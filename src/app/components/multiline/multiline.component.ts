import {Component, ElementRef, HostListener, Input, OnInit, ViewEncapsulation} from '@angular/core';
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

interface MultilineData {
  label: string;
  values: any[];
}

export interface MultilineOptions extends GraphOptions {
  gridTicks?: number;
}

@Component({
  selector: 'ng-multiline',
  templateUrl: './multiline.component.html',
  styleUrls: ['./multiline.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MultilineComponent implements OnInit {
  @Input() data: MultilineData[] = [];
  @Input() labels: any[] = [];
  @Input() options?: MultilineOptions = {} as MultilineOptions;
  labelsAndData: LabelsAndData[] = [];
  utcParse = d3.utcParse('%Y-%m');
  x: any;
  y: any;
  viewBox: ViewBox = {} as ViewBox;

  _options: MultilineOptions = {
    width: 879,
    height: 804,
    yAxisLabel: '',
    xAxisLabel: '',
    margin: {top: 50, right: 50, bottom: 50, left: 50},
  };

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
      minY: -25,
      width: this.options.width + this.options.margin.left +
          this.options.margin.right,
      height: this.options.height + this.options.margin.top,
    };

    [this.labels] = this.formatData();
    this.labelsAndData = this.combineLabelsDataToOne();

    this.onResizeEvent();

    this.render();
  }

  private formatData() {
    const labels = this.labels.map((d) => new Date(d));
    return [labels];
  }

  private combineLabelsDataToOne(): LabelsAndData[] {
    const result = [];
    const N = this.data.length;
    for (let index = 0; index < N; index++) {
      result.push({x: this.labels, y: this.data[index]});
    }
    return result;
  }

  render(): void {
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

    const xDomain = this.getXdomain();
    const x = d3.scaleTime().domain(xDomain).range([0, width]);

    const y = d3.scaleLinear()
                  .domain([0, d3.max(this.data, (d) => d3.max(d.values))])
                  .range([height, 0])
                  .nice();

    const xAxis = (g) =>
        g.attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    const yAxis = (g) => g.call(d3.axisLeft(y));

    const line = d3.line<any>()
                     .defined((d) => !isNaN(d))
                     .x((d, i) => x(this.labels[i]))
                     .y((d) => y(d));

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

    const _xAxis = svg.append('g').call(xAxis);
    const _yAxis = svg.append('g').call(yAxis);

    // text label for the x axis
    this.addLabelAxisX(svg, width, height);
    // text label for the y axis
    this.addLabelAxisY(svg, height);

    const path = svg.append('g')
                     .attr('fill', 'none')
                     .attr('stroke', 'steelblue')
                     .attr('stroke-width', 1.5)
                     .attr('stroke-linejoin', 'round')
                     .attr('stroke-linecap', 'round')
                     .selectAll('path')
                     .data(this.data)
                     .join('path')
                     .style('mix-blend-mode', 'multiply')
                     .attr('d', (d) => line(d.values))
                     .text('this is ');

    this.removeAxisTicks(_xAxis);
    this.removeAxisTicks(_yAxis);

    this.changeAxisColor(_xAxis, axisConfig);
    this.changeAxisColor(_yAxis, axisConfig);

    // TODO: comment in when issue #61 is fixed
    /* svg.call(hover, path, this);

    function hover(svg, path, _this) {

      if ('ontouchstart' in document) {
        svg.style('-webkit-tap-highlight-color', 'transparent')
          .on('touchmove', moved)
          .on('touchstart', entered)
          .on('touchend', left);
      } else {
        svg.on('mousemove', moved)
          .on('mouseenter', entered)
          .on('mouseleave', left);
      }

      const dot = svg.append('g').attr('display', 'none');

      dot.append('circle').attr('r', 2.5);

      dot.append('text')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'middle')
        .attr('y', -8);

      function moved() {
        d3.event.preventDefault();
        const ym = y.invert(d3.event.layerY) as any;
        const xm = x.invert(d3.event.layerX) as any;
        const i1 = d3.bisectLeft(_this.labels, xm, 1);
        const i0 = i1 - 1;
        const i = xm - _this.labels[i0] > _this.labels[i1] - xm ? i1 : i0;
        // const s = d3.least(_this.data, d => Math.abs(d.values[i] - ym));
        const s = _this.least(_this.data, d => Math.abs(d.values[i] - ym), i,
    ym); path.attr('stroke', d => d === s ? null : '#ddd') .filter(d => d === s)
          .raise();
        dot.attr(
          'transform', `translate(${x(_this.labels[i])},${y(s.values[i])})`);
        dot.select('text').text(s.name);
      }

      function entered() {
        path.style('mix-blend-mode', null).attr('stroke', '#ddd');
        dot.attr('display', null);
      }

      function left() {
        path.style('mix-blend-mode', 'multiply').attr('stroke', null);
        dot.attr('display', 'none');
      }
    }
    */
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

  private getXdomain(): Date[] {
    const domainExtent = d3.extent(this.labels, (d) => d) as any[];
    return domainExtent.map((d) => new Date(d));
  }

  least(arr: any[], filterFun: any, pos: any, ym: any) {
    const tempValues = arr.map((d) => filterFun(d));
    const minNum = Math.min(...tempValues);
    let graphHovered;
    let minimax = tempValues[0];
    let minPos = 0;
    for (let i = 1; i < tempValues.length; i++) {
      const element = tempValues[i];
      if (element >= minimax) {
        minPos = i;
        minimax = element;
      }
    }

    graphHovered = arr[minPos];
    return graphHovered;
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
