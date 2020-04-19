import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ElementRef, HostListener } from '@angular/core';
import { GraphOptions } from '../shared/models/graph-options.interface';
import * as d3 from 'd3';
import { ViewBox } from '../shared/models/viewbox.interface';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface Pie {
  labels: string[];
  data: any[];
  backgroundColors?: string[];
  options: GraphOptions;
}

export interface Label {
  text: string;
  x: number;
  y: number;
}

interface LabelsAndData {
  x: any;
  y: any;
}

interface PieOptions extends GraphOptions {

}


@Component({
  selector: 'ng-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieComponent implements OnInit {
  @Input() labels: string[] = [];
  @Input() data: any[] = [];
  @Input() backgroundColors: any = d3.schemeSet2;
  @Input() radius: number = 100;
  @Input() options: PieOptions = {} as PieOptions;
  color = this.interpolateColor(); // range [0,1] -> builtin range of colors.
  defaultSliceColor = 'steerblue';
  labelsAndData: LabelsAndData[] = [];
  viewBox: ViewBox = {} as ViewBox;

  private _options: PieOptions = {
    width: 300,
    height: 300,
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
  };

  onResize$ = new Subject<void>();
  @HostListener('window:resize')
  onResize(): void {
    this.onResize$.next();
  }

  constructor(private container: ElementRef) { }

  ngOnInit() {
    this.options = { ...this._options, ...this.options };
    this.viewBox = {
      minX: -this.options.margin.left,
      minY: 0,
      width:
        Number(this.options.width) +
        Number(this.options.margin.left) +
        Number(this.options.margin.right),
      height: this.options.height,
    };
    this.onBgdColorUndefined();

    this.onResizeEvent();

    this.render();
  }

  private onBgdColorUndefined() {
    if (this.backgroundColors.length === 0) {
      for (let index = 0; index < this.data.length; index++) {
        this.backgroundColors.push(this.defaultSliceColor);
      }
    }
  }

  render() {
    const currentWidth = parseInt(
      d3.select(this.container.nativeElement).select('div').style('width'),
      10
    );
    const currentHeight = parseInt(
      d3.select(this.container.nativeElement).select('div').style('height'),
      10
    );

    // const width =
    //   this.options.width - this.options.margin.left - this.options.margin.right;
    // const height =
    //   this.options.height -
    //   this.options.margin.top -
    //   this.options.margin.bottom;
    // this.viewBox = {
    //   minX: -this.options.margin.left,
    //   minY: -25,
    //   width: this.options.width,
    //   height: this.options.height - this.options.margin.top,
    // };


    const radius =
      Math.min(this.options.width, this.options.height) / 2 -
      this.options.margin.top;
    const svg = d3
      .select(this.container.nativeElement)
      .select('div')
      .append('svg')
      // TODO: delete me
      // .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('width', currentWidth)
      .attr('height', currentHeight)
      .attr(
        'viewBox',
        `${this.viewBox.minX} ${this.viewBox.minY} ${this.viewBox.width} ${this.viewBox.height}`
      )
      .classed('svg-content', true)
      .append('g')
      .attr(
        'transform',
        'translate(' +
        this.options.width / 2 +
        ',' +
        this.options.height / 2 +
        ')'
      );

    const color = d3
      .scaleOrdinal()
      .domain(this.data)
      .range(this.backgroundColors);

    const pie = d3.pie<any>().value((d) => d.value);

    const pieData = pie(d3.entries(this.data));

    const arcGenerator = d3.arc<any>().innerRadius(0).outerRadius(radius);

    svg
      .selectAll('slices')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d) => this.backgroundColors[d.index])
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    svg
      .selectAll('slices')
      .data(pieData)
      .enter()
      .append('text')
      .text((d) => this.labels[d.index])
      .attr('transform', (d) => {
        return (
          'translate(' +
          arcGenerator.centroid({
            startAngle: d.startAngle,
            endAngle: d.endAngle,
          }) +
          ')'
        );
      })
      .style('text-anchor', 'middle')
      .style('font-size', 17);

    this.addLabelAxisX(svg, this.options.width, this.options.height);
  }

  private addLabelAxisX(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    width: number,
    height: number
  ) {
    console.log('jjjjj');
    console.log(this.options.xAxisLabel);
    svg
      .append('text')
      .attr(
        'transform',
        `translate(${0}, ${this.options.margin.top * 2.5})`
      )
      .style('text-anchor', 'middle')
      .text(this.options.xAxisLabel);
  }

  /**
   * range [0, 1]
   */
  interpolateColor(): any {
    return d3.interpolateCool;
  }

  private combineLabelsDataToOne(): LabelsAndData[] {
    const result = [];
    const N = this.data.length;
    for (let index = 0; index < N; index++) {
      result.push({ x: this.labels[index], y: this.data[index] });
    }
    return result;
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
