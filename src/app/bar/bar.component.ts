import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GraphOptions } from 'src/shared/models/graph-options.interface';
import { D3Service } from 'src/shared/services/d3.service';
import * as d3 from 'd3';
import { Axis } from 'src/shared/models/axis.interface';
import { BarService } from './bar.service';

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

@Component({
  selector: 'ng-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarComponent implements OnInit {

  @Input() data: BarData[] = [];
  @Input() labels: any[] = [];
  @Input() options: GraphOptions = { width: 600, height: 300, margin: { top: 50, right: 50, bottom: 50, left: 50 } };
  graph: BarD3 = { xAxis: [], yAxis: [], xAxisPath: '', yAxisPath: '', rectanglesData: [] };
  labelsAndData: LabelsAndData[] = [];
  parseTime = d3.timeParse('%d-%b-%y');

  constructor() { }

  ngOnInit() {
    console.log(this.labels);
    console.log(this.data);
    this.labelsAndData = this.combineLabelsDataToOne();
    this.initGraph();
  }


  private initGraph() {

    const options = {
      width: this.options.width - this.options.margin.right - this.options.margin.left,
      height: this.options.height + this.options.margin.top,
      margin: this.options.margin
    };

    const svg = d3.select('#bar')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${options.width + options.margin.left + options.margin.right} ${options.height + options.margin.top + options.margin.bottom}`)
      .classed('svg-content', true)
      .append('g')
      .attr('transform', 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')');

    const x = d3.scaleBand()
      .rangeRound([0, options.width])
      .padding(0.1)
      .domain(this.labels);

    const y = d3.scaleLinear()
      .rangeRound([options.height, 0])
      .domain([0, Math.max(...this.data.map(d => Number(d)))]);

    const xAxis = g =>
      g
        .call(d3.axisBottom(x))
        .attr('transform', 'translate(0,' + options.height + ')');

    const yAxis = g =>
      g
        .call(d3.axisLeft(y))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text(this.options.yAxisLabel);

    svg.selectAll('.bar')
      .data(this.labelsAndData)
      .enter().append('rect')
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

}
