import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { GraphOptions } from 'src/shared/models/graph-options.interface';
import * as d3 from 'd3';

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



@Component({
  selector: 'ng-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieComponent implements OnInit {

  @Input() labels: string[] = [];
  @Input() data: any[] = [];
  @Input() backgroundColors: any = d3.schemeSet2;
  @Input() radius: number = 100;
  @Input() options: GraphOptions = { width: 300, height: 300, margin: { top: 40, right: 40, bottom: 40, left: 40 } };
  color = this.interpolateColor(); // range [0,1] -> builtin range of colors.
  defaultSliceColor = 'steerblue';
  labelsAndData: LabelsAndData[] = [];


  constructor() { }

  ngOnInit() {
    const options = this.options;
    this.onBgdColorUndefined();
    this.initGraph();
  }

  private onBgdColorUndefined() {
    if (this.backgroundColors.length === 0) {
      for (let index = 0; index < this.data.length; index++) {
        this.backgroundColors.push(this.defaultSliceColor);
      }
    }
  }

  initGraph() {
    const radius = Math.min(this.options.width, this.options.height) / 2 - this.options.margin.top;
    const svg = d3.select('#pie')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`)
      .classed('svg-content', true)
      .append('g')
      .attr('transform', 'translate(' + this.options.width / 2 + ',' + this.options.height / 2 + ')');

    const color = d3.scaleOrdinal()
      .domain(this.data)
      .range(this.backgroundColors);

    const pie = d3.pie<any>()
      .value((d) => d.value);

    const pieData = pie(d3.entries(this.data));



    const arcGenerator = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius);


    svg
      .selectAll('slices')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', d => this.backgroundColors[d.index])
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);


    svg
      .selectAll('slices')
      .data(pieData)
      .enter()
      .append('text')
      .text(d => this.labels[d.index])
      .attr('transform', d => { return 'translate(' + arcGenerator.centroid({ startAngle: d.startAngle, endAngle: d.endAngle }) + ')'; })
      .style('text-anchor', 'middle')
      .style('font-size', 17);


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


}
